import { CSSProperties, ReactNode } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  wrapper: (props: FlexStyleProps) => ({
    '& > *': {
      flex: props.childFlex ? props.childFlex : 'initial',
    },
  }),
});

type FlexProps = {
  alignItems?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'stretch';
  children: ReactNode;
  childFlex?: string;
  cursor?: 'pointer';
  direction?: 'row' | 'column' | 'column-reverse' | 'row-reverse';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  gap?: string;
  h?: string;
  m?: string;
  mb?: string;
  ml?: string;
  mr?: string;
  mt?: string;
  mx?: string;
  my?: string;
  onClick?: () => void;
  p?: string;
  paddingItemsCount?: number;
  paddingItemsStyle?: CSSProperties;
  pb?: string;
  pl?: string;
  pr?: string;
  pt?: string;
  px?: string;
  py?: string;
  style?: CSSProperties;
  w?: string;
  wrap?: 'wrap' | 'nowrap';
};

type FlexStyleProps = Pick<FlexProps, 'childFlex'>;

export function Flex({
  alignItems,
  children,
  childFlex,
  cursor,
  direction,
  justifyContent,
  gap,
  h,
  m,
  mb,
  ml,
  mr,
  mt,
  mx,
  my,
  onClick,
  p,
  paddingItemsCount,
  paddingItemsStyle,
  pb,
  pl,
  pr,
  pt,
  px,
  py,
  w,
  wrap,
  style,
}: FlexProps): JSX.Element {
  const styles = useStyles({ childFlex });
  return (
    <div
      className={styles.wrapper}
      onClick={() => onClick && onClick()}
      style={{
        alignItems: alignItems ? alignItems : 'initial',
        cursor: onClick || cursor ? 'pointer' : 'inherit',
        display: 'flex',
        flexDirection: direction ? direction : 'initial',
        justifyContent: justifyContent ? justifyContent : 'initial',
        gap: gap ? gap : 'initial',
        height: h ? h : 'initial',
        margin: m ? m : 'initial',
        marginBlock: my ? my : 'inital',
        marginBottom: mb ? mb : 'initial',
        marginInline: mx ? mx : 'initial',
        marginLeft: ml ? ml : 'initial',
        marginRight: mr ? mr : 'initial',
        marginTop: mt ? mt : 'initial',
        paddingBlock: py ? py : 'initial',
        paddingBottom: pb ? pb : 'initial',
        paddingInline: px ? px : 'initial',
        paddingLeft: pl ? pl : 'initial',
        paddingRight: pr ? pr : 'initial',
        paddingTop: pt ? pt : 'initial',
        padding: p ? p : 'initial',
        flexWrap: wrap ? wrap : 'initial',
        width: w ? w : 'initial',
        ...style,
      }}
    >
      {children}
      {!!paddingItemsCount &&
        new Array(paddingItemsCount)
          .fill(0)
          .map((_, index) => (
            <div key={index} style={{ ...paddingItemsStyle }} />
          ))}
    </div>
  );
}

export default Flex;
