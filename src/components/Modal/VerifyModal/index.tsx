import Flex from 'components/Flex';
import Modal, { IModal } from '..';
import { ClipLoader } from 'react-spinners';
import { CheckCircle, XCircle } from 'lucide-react';
import { createUseStyles } from 'react-jss';
import { VerifyModalPayload } from 'types';
import { useMemo } from 'react';

const useStyles = createUseStyles({
  shouted: {
    color: '#ED1010',
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '24px',
  },
  text: ({ shouted }: { shouted: boolean }) => ({
    color: shouted ? '#ED1010' : '#FBD270',
    fontSize: '20px',
    textAlign: 'center',
  }),
});

type VerifyModalProps = {
  data: VerifyModalPayload | null;
} & Omit<IModal, 'children'>;

export default function VerifyModal({ data, onClose, open }: VerifyModalProps) {
  const styles = useStyles({ shouted: data?.shouted ?? false });

  const icon = useMemo(() => {
    if (!data) return <></>;
    if (data.verifying) {
      return <ClipLoader color='#FBD270' size={70} />;
    } else if (data.verified && data.shouted) {
      return <CheckCircle color='#ED1010' size={70} />;
    } else if (data.verified) {
      return <CheckCircle color='#22E01F' size={70} />;
    } else {
      return <XCircle color='#ED1010' size={70} />;
    }
  }, [data]);

  const text = useMemo(() => {
    if (!data) return '';
    if (data.verifying) {
      return `Verifying proof for round ${data.round}`;
    } else if (!data.verifying && data.shouted) {
      return `Round ${data.round} is no longer active`;
    } else if (!data.verifying && data.verified) {
      return `Proof successfully verified for user: ${data.username}`;
    } else {
      return `Could not verify proof for user`;
    }
  }, [data]);

  return (
    <Modal onClose={onClose} open={open}>
      <Flex
        alignItems='center'
        direction='column'
        gap='16px'
        justifyContent='center'
        style={{ height: '100%' }}
      >
        <div style={{ height: '70px' }}>{icon}</div>
        <div className={styles.text}>{text}</div>
      </Flex>
    </Modal>
  );
}
