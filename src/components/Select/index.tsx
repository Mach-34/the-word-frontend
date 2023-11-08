import { Dispatch, SetStateAction, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ChevronDown, LucideIcon } from 'lucide-react';

const useStyles = createUseStyles({
  container: {
    alignItems: 'center',
    backgroundColor: '#19473F',
    border: '1px solid #FBD270',
    borderRadius: '4px',
    color: '#FBD270',
    cursor: 'pointer',
    display: 'flex',
    gap: '8px',
    padding: '6px 12px',
    position: 'relative',
  },
});

type SelectProps = {
  Icon?: LucideIcon;
  options: string[];
  placeholder: string;
  select: Dispatch<SetStateAction<string>>;
  selectedOption: string;
};

export default function Select({
  Icon,
  placeholder,
  selectedOption,
}: SelectProps): JSX.Element {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.container} onClick={() => setOpen(!open)}>
      <div>{selectedOption || placeholder}</div>
      {Icon ? <Icon size={16} /> : <ChevronDown size={16} />}
    </div>
  );
}
