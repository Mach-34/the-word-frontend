import { CSSProperties, ReactNode, useEffect } from 'react';
import ReactModal from 'react-modal';

const customStyles = {
  content: {
    background: 'white',
    border: '1px solid black',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100001,
  },
  overlay: {
    background: 'transparent',
    backdropFilter: 'blur(8px)',
    border: 'none',
    zIndex: 100000,
  },
};

ReactModal.setAppElement('#root');

export type IModal = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: CSSProperties;
};

export default function Modal({ open, onClose, children, style }: IModal) {
  const modalStyles = {
    content: {
      borderRadius: '21px',
      height: '70vh',
      maxWidth: '466px',
      width: 'calc(100% - 80px)',
      ...customStyles.content,
      ...style,
    },
    overlay: { ...customStyles.overlay },
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  }, [open]);

  return (
    <ReactModal
      closeTimeoutMS={300}
      isOpen={open}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel='modal'
    >
      <div style={{ position: 'relative', height: '100%' }}>{children}</div>
    </ReactModal>
  );
}
