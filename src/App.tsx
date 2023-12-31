import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStyles } from 'appStyles';
import Select from './components/Select';
import ActionModal from './components/Modal/ActionModal';
import {
  ActionPayload,
  checkForSession,
  getWords,
  login,
  logout,
  verify,
} from './api';
import {
  Action,
  SelectedWord,
  UserSession,
  VerifyModalPayload,
  Word,
} from './types';
import { ArrowUpDown, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import { shout, whisper } from './api';
import WordCard from 'components/WordCard';
import {
  addPCD,
  getProofWithoutProving,
  convertTitleToFelts,
  usernameToBigint,
  handlePopup,
} from 'utils/zupass';
import Button from 'components/Button';
import { MoonLoader } from 'react-spinners';
import Flex from 'components/Flex';
import VerifyModal from 'components/Modal/VerifyModal';
import { ungzip } from 'pako';
import { groth16 } from 'snarkjs';

const wasmPath = 'the_word.wasm';
const zkeyPath = 'the_word.zkey';

const FILTER_OPTIONS = ['Secrets I know', `Secrets I don't know`];
const SORT_OPTIONS = ['Secret ID', '# of whispers', 'Prize shouting'];

function App() {
  const styles = useStyles();
  const [asc, setAsc] = useState(false);
  const [fetchingWords, setFetchingWords] = useState(true);
  const [filter, setFilter] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<UserSession | null>(null);
  const [performingAction, setPerformingAction] = useState(false);
  const [restoringSession, setRestoringSession] = useState(true);
  const [selectedWord, setSelectedWord] = useState<SelectedWord | null>(null);
  const [showDetails, setShowDetails] = useState(-1);
  const [showVerifyModal, setShowVerifyModal] =
    useState<VerifyModalPayload | null>(null);
  const [sort, setSort] = useState('');
  const [words, setWords] = useState<Array<Word>>([]);

  const actionText = (action: Action) => {
    let errorText = '';
    let successText = '';
    if (action === Action.Shout) {
      errorText = 'Shout failed!!!';
      successText = 'Successfully shouted!';
    } else if (action === Action.Whisper) {
      errorText = 'Whisper failed!!!';
      successText = 'Successfully whispered!';
    } else {
      errorText = 'Verification failed!!!';
      successText = 'Successfully verified!';
    }
    return { errorText, successText };
  };

  const applyFilter = useCallback(
    (word: Word) => {
      if (filter === FILTER_OPTIONS[0]) {
        return word.userInteractions.shouted || word.userInteractions.whispered;
      } else {
        return (
          !word.userInteractions.shouted && !word.userInteractions.whispered
        );
      }
    },
    [filter]
  );

  const applySort = useCallback(
    (word1: Word, word2: Word) => {
      if (sort === SORT_OPTIONS[0]) {
        return word2.round - word1.round;
      } else if (sort === SORT_OPTIONS[1]) {
        return word2.whisperers.length - word1.whisperers.length;
      } else {
        return word2.prize - word1.prize;
      }
    },
    [sort]
  );

  const preparedWords = useMemo(() => {
    let prepared = words.slice();
    if (filter) prepared = prepared.filter((word) => applyFilter(word));
    if (sort)
      prepared.sort((word1, word2) =>
        asc ? applySort(word2, word1) : applySort(word1, word2)
      );
    return prepared;
  }, [applyFilter, applySort, asc, filter, sort, words]);

  const loginWithZupass = async () => {
    getProofWithoutProving();
    const proof = await waitForProof();
    const loginData = await login(proof);
    // Fetch words again to reflect beginning of user session
    const wordData = await getWords();
    setWords(wordData);
    setLoggedInUser(loginData);
  };

  const logoutWithZupass = async () => {
    try {
      await logout();
      setLoggedInUser(null);
      // Update words to reflect end of user session
      setWords((prev) =>
        prev.map((word) => ({
          ...word,
          userInteractions: { shouted: false, whispered: false },
        }))
      );
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  const onActionComplete = async (payload: ActionPayload) => {
    if (!selectedWord) return;
    setPerformingAction(true);
    const { errorText, successText } = actionText(selectedWord.action);
    try {
      if (selectedWord.action === Action.Shout) await shout(payload);
      else {
        const usernameEncoded = `0x${BigInt(
          usernameToBigint(payload.username)
        ).toString(16)}`;
        const { proof } = await groth16.fullProve(
          {
            phrase: convertTitleToFelts(payload.secret!),
            username: usernameEncoded,
          },
          wasmPath,
          zkeyPath
        );
        const proofPayload = {
          proof,
          round: payload.round,
          username: payload.username,
        };
        selectedWord.action === Action.Whisper
          ? await whisper(proofPayload)
          : await verify(proofPayload);
      }
      toast.success(successText);
      setSelectedWord(null);
      if (selectedWord.action !== Action.Reissue) {
        updateLocalState(selectedWord.action === Action.Shout, payload);
      }
      if (selectedWord.action !== Action.Shout) {
        addPCD(payload);
      }
    } catch (err) {
      console.log('Err: ', err);
      toast.error(errorText);
    }
    setPerformingAction(false);
  };

  const updateLocalState = (isShout: boolean, payload: ActionPayload) => {
    if (!loggedInUser) return;
    setWords((prev) => {
      const index = prev.findIndex((word) => word.round === payload.round);
      const wordToUpdate = {
        ...prev[index],
        whisperers: [...prev[index].whisperers],
      };
      if (isShout) {
        wordToUpdate.active = false;
        wordToUpdate.shouter = payload.username;
        wordToUpdate.userInteractions.shouted = true;
      } else {
        wordToUpdate.userInteractions.whispered = true;
        wordToUpdate.whisperers = [
          ...wordToUpdate.whisperers,
          payload.username,
        ];
      }
      return [...prev.slice(0, index), wordToUpdate, ...prev.slice(index + 1)];
    });
  };

  const waitForProof = (): Promise<string> => {
    return new Promise((resolve) => {
      const onReceipt = (event: MessageEvent) => {
        const { proof, zupass_redirect } = event.data;
        if (zupass_redirect) {
          resolve(proof);
          window.removeEventListener('message', onReceipt);
        }
      };
      window.addEventListener('message', onReceipt);
    });
  };

  const parseQRUrl = (url: string) => {
    // Detect whether oauth redirect window or not
    const hashIndex = url.indexOf('#');
    const hashSlice = url.slice(hashIndex);
    const qMarkIndex = hashSlice.indexOf('?');
    const qMarkSlice = hashSlice.slice(qMarkIndex + 1);
    const params = new URLSearchParams(qMarkSlice);
    const pcdParam = params.get('pcd');
    if (pcdParam) {
      const buffer = Buffer.from(pcdParam, 'base64');
      const unzippedBuffer = Buffer.from(ungzip(buffer));
      const decodedBuffer = unzippedBuffer.toString('utf8');
      const { pcd } = JSON.parse(decodedBuffer);
      return JSON.parse(pcd);
    }
    return undefined;
  };

  const verifyPCDFromQR = async (pcd: any) => {
    const { phraseId: round, username } = pcd.claim;
    setShowVerifyModal({
      round,
      username,
      verifying: true,
    });
    const { msg } = await verify({
      proof: pcd.proof,
      round,
      username,
    });
    if (!msg) {
      setShowVerifyModal(
        (prev) => ({ ...prev!, verified: true, verifying: false }!)
      );
    } else {
      setShowVerifyModal(
        (prev) =>
          ({ ...prev!, shouted: true, verified: false, verifying: false }!)
      );
    }
  };

  useEffect(() => {
    (async () => {
      if (window.opener) {
        handlePopup();
      } else if (
        window.location.href.includes(`${window.location.origin}/#/`)
      ) {
        try {
          const url = window.location.href;
          const pcd = parseQRUrl(url);
          await verifyPCDFromQR(pcd);
        } catch (err) {
          setShowVerifyModal(
            (prev) => ({ ...prev!, verified: false, verifying: false }!)
          );
        }
      } else {
        const wordData = await getWords();
        const data = await checkForSession();
        if (!data.msg) {
          setLoggedInUser(data);
        }
        setWords(wordData);
        setFetchingWords(false);
        setRestoringSession(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className={styles.titleSection}>
        <div style={{ textAlign: 'center' }}>The Word</div>
        {restoringSession ? (
          <div style={{ color: '#FBD270', fontSize: '12px' }}>
            Restoring session...
          </div>
        ) : (
          <div className={styles.loggedInContainer}>
            {loggedInUser && (
              <div className={styles.emailContainer}>
                <i>{loggedInUser.email}</i>
              </div>
            )}
            <Button
              onClick={() =>
                loggedInUser ? logoutWithZupass() : loginWithZupass()
              }
              text={loggedInUser ? 'Log out' : 'Log in'}
            />
          </div>
        )}
      </div>
      <div className={styles.divider} />
      <div className={styles.content}>
        <div className={styles.selectContainer}>
          <div className={styles.flex}>
            <Select
              Icon={ArrowUpDown}
              options={SORT_OPTIONS}
              placeholder='Choose sort'
              select={setSort}
              selectedOption={sort}
            />
            {sort && (
              <div className={styles.flex}>
                <div className={styles.clear} onClick={() => setSort('')}>
                  Clear sort
                </div>
                <label htmlFor='ascending' style={{ fontSize: '12px' }}>
                  Asc{' '}
                </label>
                <input
                  checked={asc}
                  id='ascending'
                  onChange={() => setAsc(!asc)}
                  style={{ marginLeft: '-2px' }}
                  type='checkbox'
                />
              </div>
            )}
          </div>
          <div className={styles.flex}>
            <Select
              Icon={Filter}
              options={FILTER_OPTIONS}
              placeholder='Choose filter'
              select={setFilter}
              selectedOption={filter}
            />
            {filter && (
              <div className={styles.clear} onClick={() => setFilter('')}>
                Clear filter
              </div>
            )}
          </div>
        </div>
        <div>
          {fetchingWords ? (
            <div className={styles.loadingSection}>
              <MoonLoader color='#FBD270' size={40} />
              <div className={styles.loadingText}>Fetching words</div>
            </div>
          ) : !!preparedWords.length ? (
            <Flex
              childFlex='1 0 calc(33.3% - 8px)'
              gap='8px'
              mt='24px'
              paddingItemsCount={3}
              paddingItemsStyle={{ minWidth: '250px' }}
              wrap='wrap'
            >
              {preparedWords.map((word: Word) => (
                <WordCard
                  key={word.round}
                  isLoggedIn={!!loggedInUser}
                  setSelectedWord={setSelectedWord}
                  setShowDetails={setShowDetails}
                  showDetails={showDetails}
                  word={word}
                />
              ))}
            </Flex>
          ) : (
            <Flex alignItems='center' justifyContent='center'>
              <div className={styles.noWords}>No words</div>
            </Flex>
          )}
        </div>
        <ActionModal
          action={selectedWord?.action}
          onClose={() => setSelectedWord(null)}
          onFinish={onActionComplete}
          open={!!selectedWord}
          performingAction={performingAction}
          round={selectedWord?.round ?? -1}
          savedUsername={loggedInUser?.username}
        />
        <VerifyModal
          data={showVerifyModal}
          onClose={() => setShowVerifyModal(null)}
          open={!!showVerifyModal}
        />
      </div>
    </div>
  );
}

export default App;
