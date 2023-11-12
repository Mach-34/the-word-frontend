import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: (props: StatusChipProps) => {
    let backgroundColor = '';
    let border = '';
    if (props.selfShout) {
      backgroundColor = 'red';
    } else if (props.shouted) {
      backgroundColor = 'grey';
      if (props.selfWhisper) {
        border = '2px solid green';
      }
    } else {
      if (props.selfWhisper) {
        backgroundColor = 'green';
      }
    }
    return {
      backgroundColor,
      border,
      borderRadius: '999px',
      fontSize: '12px',
      padding: '2px 8px',
    };
  },
});

type StatusChipProps = {
  selfShout: boolean;
  selfWhisper: boolean;
  shouted: boolean;
};

export default function StatusChip({
  selfShout,
  selfWhisper,
  shouted,
}: StatusChipProps): JSX.Element {
  const styles = useStyles({ selfShout, selfWhisper, shouted });

  return (
    <div className={styles.container}>{shouted ? 'Inactive' : 'Whispered'}</div>
  );
}
