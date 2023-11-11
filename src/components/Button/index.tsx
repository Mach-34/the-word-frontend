import { CSSProperties } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  button: {
    background: '#19473F',
    border: '1px solid #FBD270',
    borderRadius: '8px',
    color: '#FBD270',
    cursor: 'pointer',
    padding: '6px 12px',
    transition: '.3s all',
    '&:hover': {
      backgroundColor: '#FBD270',
      color: '#19473F',
    },
  },
});

type ButtonProps = {
  onClick: (e: any) => void;
  style?: CSSProperties;
  text: string;
};

export default function Button({
  onClick,
  style,
  text,
}: ButtonProps): JSX.Element {
  const styles = useStyles();
  return (
    <button className={styles.button} onClick={onClick} style={{ ...style }}>
      {text}
    </button>
  );
}
