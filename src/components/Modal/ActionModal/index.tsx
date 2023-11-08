import { useEffect, useMemo, useState } from 'react';
import Modal, { IModal } from '..';
import { createUseStyles } from 'react-jss';
import { X } from 'lucide-react';
import { ShoutWhisperPayload } from '../../../api';
import Button from 'components/Button';

type ActionModalProps = {
  isShout: boolean;
  onFinish: (payload: ShoutWhisperPayload) => void;
  performingAction: boolean;
  round: number;
} & Omit<IModal, 'children'>;

const useStyles = createUseStyles({
  exit: {
    cursor: 'pointer',
    display: 'block',
    height: '25px',
    marginLeft: 'auto',
    width: '25px',
  },
  input: {
    border: '1px solid #FBD270',
    borderRadius: '4px',
    outline: 'transparent',
    padding: '4px',
  },
  modalContent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    gap: '24px',
  },
});

export default function ActionModal({
  isShout,
  onClose,
  onFinish,
  open,
  performingAction,
  round,
}: ActionModalProps): JSX.Element {
  const [secret, setSecret] = useState('');
  const [username, setUsername] = useState('');
  const styles = useStyles();

  const actionText = useMemo(() => {
    if (isShout) {
      return performingAction ? 'Shouting...' : 'Shout';
    } else {
      return performingAction ? 'Whispering...' : 'Whisper';
    }
  }, [isShout, performingAction]);

  useEffect(() => {
    setSecret('');
    setUsername('');
  }, [open]);

  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{
        backgroundColor: '#19473F',
        border: '2px solid #CABF8D',
        padding: '24px',
      }}
    >
      <X className={styles.exit} color='#FBD270' onClick={onClose} />
      <div className={styles.modalContent}>
        <input
          className={styles.input}
          onChange={(e) => setSecret(e.target.value)}
          placeholder='Secret'
          style={{ width: '75%' }}
          value={secret}
        />
        <input
          className={styles.input}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Username'
          style={{ width: '75%' }}
          value={username}
        />
        <Button
          onClick={() => onFinish({ round, secret, username })}
          text={actionText}
        />
      </div>
    </Modal>
  );
}
