import { Dispatch, SetStateAction, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SelectedWord, Word } from 'types';
import { createUseStyles } from 'react-jss';
import Button from 'components/Button';
import StatusChip from './components/StatusChip';
import { Action } from 'types';

const useStyles = createUseStyles({
  actions: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    marginTop: '12px',
  },
  id: {
    textAlign: 'right',
  },
  noWhisperers: {
    fontWeight: 800,
    marginTop: '16px',
    textAlign: 'center',
  },
  shoutedBy: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  whispers: {
    fontSize: '18px',
    textAlign: 'center',
  },
  whispererList: {
    backgroundColor: 'white',
    border: '1px solid black',
    borderRadius: '4px',
    color: 'black',
    height: '100px',
    marginTop: '16px',
    overflowY: 'auto',
    padding: '4px 8px',
  },
  wordCard: {
    backgroundColor: '#19473F',
    border: '1px solid #FBD270',
    borderRadius: '8px',
    boxSizing: 'border-box',
    color: 'white',
    cursor: 'pointer',
    marginBottom: '12px',
    minWidth: '250px',
    padding: '16px',
  },
});

type WordCardProps = {
  isLoggedIn: boolean;
  setSelectedWord: Dispatch<SetStateAction<SelectedWord | null>>;
  setShowDetails: Dispatch<SetStateAction<number>>;
  showDetails: number;
  word: Word;
};

export default function WordCard({
  isLoggedIn,
  setSelectedWord,
  setShowDetails,
  showDetails,
  word,
}: WordCardProps): JSX.Element {
  const styles = useStyles();

  // const border = useMemo(() => {
  //   // if (word.userInteractions.shouted) {
  //   //   return '2px solid red';
  //   // } else if (word.userInteractions.whispered) {
  //   //   return '2px solid green';
  //   // } else {
  //   //   return '2px solid #FBD270';
  //   // }
  //   return '2px solid #FBD270';
  // }, [word]);

  const hasWhispered = word.userInteractions.whispered;

  const renderChip = useMemo(() => {
    return word.userInteractions.shouted || word.userInteractions.whispered;
  }, [word]);

  return (
    <div className={styles.wordCard} onClick={() => setShowDetails(word.round)}>
      {showDetails === word.round ? (
        <>
          <ArrowLeft
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(-1);
            }}
            style={{ cursor: 'pointer' }}
          />
          <div style={{ marginTop: '8px' }}>
            <div style={{ textAlign: 'center' }}>Hint: {word.hint}</div>
            {!!word.whisperers.length ? (
              <div className={styles.whispererList}>
                {word.whisperers.map((username, index) => (
                  <div key={index}>
                    <i>{username}</i>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noWhisperers}>No whisperers</div>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {renderChip ? (
              <StatusChip
                selfShout={word.userInteractions.shouted}
                selfWhisper={word.userInteractions.whispered}
                shouted={!!word.shouter}
              />
            ) : (
              <div style={{ width: '10px' }} />
            )}
            <div className={styles.id}>
              Round <i>#{word.round}</i>
            </div>
          </div>
          <div className={styles.whispers}>
            # of Whispers: {word.whisperers.length}
          </div>
          <div className={styles.whispers} style={{ marginTop: '16px' }}>
            Burn Prize: {word.prize} eth
          </div>
        </>
      )}
      {word.active ? (
        <div className={styles.actions}>
          <Button
            disabled={!isLoggedIn}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWord({
                action: hasWhispered ? Action.Reissue : Action.Whisper,
                round: word.round,
              });
            }}
            text={hasWhispered ? 'Reissue PCD' : 'Whisper'}
          />
          <Button
            disabled={!isLoggedIn}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWord({ action: Action.Shout, round: word.round });
            }}
            text='Shout'
          />
        </div>
      ) : (
        <div className={styles.shoutedBy}>Shouted by: {word.shouter}</div>
      )}
    </div>
  );
}
