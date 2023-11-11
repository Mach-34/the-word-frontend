import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    backgroundColor: 'black',
    borderRadius: '999px',
    fontSize: '12px',
    padding: '2px 8px',
  },
});

type StatusChipProps = {
  whispered: 'boolean';
};

export default function StatusChip(): JSX.Element {
  const styles = useStyles();
  return <div className={styles.container}>Test</div>;
}
