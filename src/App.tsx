import { createUseStyles } from 'react-jss';
import { useEffect, useState } from 'react';
import Select from './components/Select';
import ActionModal from './components/Modal/ActionModal';
import { ShoutWhisperPayload, getWords } from './api';
import { SelectedWord, Word } from './types';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { shout, whisper } from './api';
import WordCard from 'components/WordCard';
import { addPCD } from 'utils/zupass';
import Button from 'components/Button';
import { openEmailPCDPopup } from 'utils/zupass';

const useStyles = createUseStyles({
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
  content: {
    padding: '16px',
    height: '100%',
  },
  divider: {
    backgroundColor: '#FBD270',
    height: '1.5px',
    width: '100vw',
  },
  loadingSection: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    height: '100%',
    justifyContent: 'center',
    marginTop: '100px',
  },
  loadingText: {
    fontSize: '20px',
    fontWeight: 700,
  },
  selectContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  spin: {
    animation: '$spin 1s linear infinite',
  },
  title: {
    backgroundColor: '#19473F',
    color: '#FBD270',
    fontSize: '28px',
    fontWeight: 700,
    paddingBlock: '16px',
    textAlign: 'center',
  },
  wordContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
});

const FILTER_OPTIONS = ['Secrets I know', `Secrets I don't know`];
const SORT_OPTIONS = ['Secret ID', '# of whispers', 'Prize shouting'];

function App() {
  const styles = useStyles();
  const [fetchingWords, setFetchingWords] = useState(true);
  const [filter, setFilter] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');
  const [performingAction, setPerformingAction] = useState(false);
  const [selectedWord, setSelectedWord] = useState<SelectedWord | null>(null);
  const [showDetails, setShowDetails] = useState(-1);
  const [sort, setSort] = useState('');
  const [words, setWords] = useState<Array<Word>>([]);
  const [userInput, setUserInput] = useState('');

  const onActionComplete = async (payload: ShoutWhisperPayload) => {
    setPerformingAction(true);
    const isShout = selectedWord?.action === 'shout';
    const successText = `Successfully ${isShout ? 'shouted' : 'whispered'}!`;
    const errorText = `${isShout ? 'Shout' : 'Whisper'} failed!!!`;
    try {
      isShout ? await shout(payload) : await whisper(payload);
      toast.success(successText);
      setSelectedWord(null);
      updateLocalState(isShout, payload);
      if (!isShout) {
        addPCD(payload);
      }
    } catch (err) {
      toast.error(errorText);
    }
    setPerformingAction(false);
  };

  const updateLocalState = (isShout: boolean, payload: ShoutWhisperPayload) => {
    setWords((prev) => {
      const index = prev.findIndex((word) => word.round === payload.round);
      const wordToUpdate = {
        ...prev[index],
        whisperers: [...prev[index].whisperers],
      };
      if (isShout) {
        wordToUpdate.active = false;
        wordToUpdate.shouter = payload.username;
      } else {
        wordToUpdate.whisperers = [
          ...wordToUpdate.whisperers,
          payload.username,
        ];
      }
      return [...prev.slice(0, index), wordToUpdate, ...prev.slice(index + 1)];
    });
  };

  useEffect(() => {
    (async () => {
      const wordData = await getWords();
      setWords(wordData);
      setFetchingWords(false);
    })();
  }, []);

  return (
    <div>
      {/* <div
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
        }}
      >
        <input
          onChange={(e) => setUserInput(e.target.value)}
          placeholder='Search by user'
          value={userInput}
        />
        <button onClick={() => setLoggedInUser(userInput.slice())}>
          Log In
        </button>
      </div> */}
      <div className={styles.title}>The Word</div>
      <div className={styles.divider} />
      <div className={styles.content}>
        <div className={styles.selectContainer}>
          <Select
            options={FILTER_OPTIONS}
            placeholder='Choose sort'
            select={setFilter}
            selectedOption={filter}
          />
          <Select
            options={SORT_OPTIONS}
            placeholder='Choose filter'
            select={setSort}
            selectedOption={sort}
          />
        </div>
        <div>
          {fetchingWords ? (
            <div className={styles.loadingSection}>
              <div className={styles.spin}>
                <Loader2 size={30} />
              </div>
              <div className={styles.loadingText}>Fetching words</div>
            </div>
          ) : (
            <div className={styles.wordContainer}>
              {words.map((word: Word) => (
                <WordCard
                  key={word.round}
                  loggedInUser={loggedInUser}
                  setSelectedWord={setSelectedWord}
                  setShowDetails={setShowDetails}
                  showDetails={showDetails}
                  word={word}
                />
              ))}
            </div>
          )}
        </div>
        <Button onClick={() => openEmailPCDPopup()} text='Open Email' />
        <ActionModal
          isShout={selectedWord?.action === 'shout'}
          onClose={() => setSelectedWord(null)}
          onFinish={onActionComplete}
          open={!!selectedWord}
          performingAction={performingAction}
          round={selectedWord?.round ?? -1}
        />
      </div>
    </div>
  );
}

export default App;
