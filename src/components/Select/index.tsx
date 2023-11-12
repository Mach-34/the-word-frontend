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
  divider: {
    backgroundColor: '#FBD270',
    height: '1px',
    width: '100%',
  },
  menu: {
    backgroundColor: '#19473F',
    border: '1px solid #FBD270',
    borderRadius: '4px',
    marginLeft: '-12px',
    // padding: '4px 8px',
    position: 'absolute',
    top: 'calc(100% + 8px)',
    width: '100%',
    zIndex: 100,
  },
  option: {
    padding: '4px 8px',
    transition: '.3s all',
    '&:hover': {
      backgroundColor: '#FBD270',
      color: '#19473F',
    },
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
          {options.map((option, index) => (
            <>
              <div
                className={styles.option}
                key={option}
                onClick={() => select(option)}
              >
                {option}
              </div>
              {index !== options.length - 1 && (
                <div className={styles.divider} />
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
}
