import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';

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
  menu: {
    backgroundColor: '#19473F',
    border: '1px solid #FBD270',
    borderRadius: '4px',
    marginLeft: '-12px',
    padding: '6px',
    position: 'absolute',
    top: 'calc(100% + 8px)',
    width: 'calc(100% - 12px)',
    zIndex: 100,
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
  options,
  placeholder,
  select,
  selectedOption,
}: SelectProps): JSX.Element {
  const selectRef = useRef(null);
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  useOutsideAlerter(selectRef, () => setOpen(false));

  return (
    <div
      className={styles.container}
      onClick={() => setOpen(!open)}
      ref={selectRef}
    >
      <div>{selectedOption || placeholder}</div>
      {Icon ? <Icon size={16} /> : <ChevronDown size={16} />}
      {open && (
        <div className={styles.menu}>
          {options.map((option) => (
            <div onClick={() => select(option)} style={{ marginTop: '8px' }}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
