import { Dispatch, SetStateAction, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SelectedWord, Word } from 'types';
import { createUseStyles } from 'react-jss';
import Button from 'components/Button';
import StatusChip from './components/StatusChip';

type WordCardStyles = {
  active: boolean;
};

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
  wordCard: ({ active }: WordCardStyles) => ({
    // backgroundColor: active ? '#19473F' : 'gray',
    backgroundColor: '#19473F',
    // TODO: Figure out how to return style from function
    borderRadius: '8px',
    boxSizing: 'border-box',
    color: 'white',
    cursor: 'pointer',
    flex: '1 1 calc(33.33% - 8px)',
    marginBottom: '12px',
    // maxWidth: 'calc(33.33% - 8px)',
    minWidth: '250px',
    padding: '16px',
  }),
});

type WordCardProps = {
  setSelectedWord: Dispatch<SetStateAction<SelectedWord | null>>;
  setShowDetails: Dispatch<SetStateAction<number>>;
  showDetails: number;
  word: Word;
};

export default function WordCard({
  setSelectedWord,
  setShowDetails,
  showDetails,
  word,
}: WordCardProps): JSX.Element {
  const styles = useStyles({ active: word.active });

  const border = useMemo(() => {
    if (word.userInteractions.shouted) {
      return '2px solid red';
    } else if (word.userInteractions.whispered) {
      return '2px solid green';
    } else {
      return '2px solid #FBD270';
    }
  }, [word]);

  return (
    <div
      className={styles.wordCard}
      onClick={() => setShowDetails(word.round)}
      style={{ border }}
    >
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
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* <StatusChip /> */}
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
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWord({
                action: 'whisper',
                round: word.round,
              });
            }}
            text='Whisper'
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWord({ action: 'shout', round: word.round });
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
