import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
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
    color: '#FBD270',
    fontSize: '20px',
    fontWeight: 700,
  },
  loggedInContainer: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '12px',
    gap: '8px',
    marginTop: '8px',
    '@media (max-width: 450px)': {
      justifyContent: 'center'
    }
  },
  noWords: {
    color: '#FBD270',
    fontSize: '28px',
    marginTop: '150px',
  },
  selectContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'space-between',
    marginBottom: '12px',
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
    marginTop: '16px'
  },
});