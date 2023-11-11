import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
  clear: {
    cursor: 'pointer',
    fontSize: '12px'
  },
  content: {
    padding: '16px',
    height: '100%',
  },
  divider: {
    backgroundColor: '#FBD270',
    height: '1.5px',
    width: '100vw',
  },
  emailContainer: {
    backgroundColor: '#278473',
    border: '1px solid #FBD270',
    borderRadius: '4px',
    padding: '4px',
  },
  flex: {
    alignItems: 'center',
    display: 'flex',
    gap: '6px',
  },
  loadingSection: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    height: '100%',
    justifyContent: 'center',
    marginTop: '100px',
  },
  loadingText: {
    fontSize: '20px',
    fontWeight: 700,
  },
  loggedInContainer: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '12px',
    gap: '8px',
  },
  noWords: {
    alignItems: 'center',
    color: '#FBD270',
    display: 'flex',
    fontSize: '28px',
    justifyContent: 'center',
    marginTop: '150px',
    width: '100%'
  },
  selectContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  spin: {
    animation: '$spin 1s linear infinite',
  },
  titleSection: {
    backgroundColor: '#19473F',
    color: '#FBD270',
    fontSize: '28px',
    fontWeight: 700,
    padding: '16px 8px',
  },
  wordContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
});