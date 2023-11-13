import { useEffect, useMemo, useState } from 'react';
import Modal, { IModal } from '..';
import { createUseStyles } from 'react-jss';
import { X } from 'lucide-react';
import { ActionPayload } from '../../../api';
import Button from 'components/Button';
import { Action } from 'types';

type ActionModalProps = {
  action: Action | undefined;
  onFinish: (payload: ActionPayload) => void;
  performingAction: boolean;
  round: number;
  savedUsername?: string;
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
  action,
  onClose,
  onFinish,
  open,
  performingAction,
  round,
  savedUsername,
}: ActionModalProps): JSX.Element {
  const [secret, setSecret] = useState('');
  const [username, setUsername] = useState('');
  const styles = useStyles();

  const actionText = useMemo(() => {
    if (action === Action.Shout) {
      return performingAction ? 'Shouting...' : 'Shout';
    } else if (action === Action.Whisper) {
      return performingAction ? 'Whispering...' : 'Whisper';
    } else {
      return performingAction ? 'Verifying...' : 'Verify';
    }
  }, [action, performingAction]);

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
      }}
    >
      <X className={styles.exit} color='#FBD270' onClick={onClose} />
      <div className={styles.modalContent}>
        <input
          className={styles.input}
          onChange={(e) => setSecret(e.target.value)}
          placeholder='Secret'
          style={{ width: '85%' }}
          value={secret}
        />
        <input
          className={styles.input}
          disabled={!!savedUsername}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Username'
          style={{ width: '85%' }}
          value={savedUsername ?? username}
        />
        <Button
          onClick={() =>
            onFinish({ round, secret, username: savedUsername ?? username })
          }
          text={actionText}
        />
      </div>
    </Modal>
  );
}
