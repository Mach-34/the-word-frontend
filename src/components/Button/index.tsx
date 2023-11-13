import { CSSProperties } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  button: ({ disabled }: { disabled?: boolean }) => ({
    background: disabled ? 'grey' : '#19473F',
    border: '1px solid #FBD270',
    borderRadius: '8px',
    color: '#FBD270',
    cursor: disabled ? 'not-allowed' : 'pointer',
    padding: '6px 12px',
    transition: '.3s all',
    '&:hover': {
      backgroundColor: disabled ? '' : '#FBD270',
      color: disabled ? '' : '#19473F',
    },
  }),
});

type ButtonProps = {
  disabled?: boolean;
  onClick: (e: any) => void;
  style?: CSSProperties;
  text: string;
};

export default function Button({
  disabled,
  onClick,
  style,
  text,
}: ButtonProps): JSX.Element {
  const styles = useStyles({ disabled });
  return (
    <button
      className={styles.button}
      disabled={disabled}
      onClick={onClick}
      style={{ ...style }}
    >
      {text}
    </button>
  );
}
