import styled, {css} from 'styled-components';

interface ContainerProps {
  gap?: string;
  jc?: string;
  ai?: string;
  fullWidth?: boolean;
  mt?: string;
  mb?: string;
  ml?: string;
  mr?: string;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  ${props => props.fullWidth && css`
    width: 100%;
  `};
  
  ${props => props.gap && css`
    gap: ${props.gap};
  `};

  ${props => props.jc && css`
    justify-content: ${props.jc};
  `};

  ${props => props.ai && css`
    align-items: ${props.ai};
  `};

  ${props => props.mt && css`
    margin-top: ${props.mt};
  `};

  ${props => props.mb && css`
    margin-bottom: ${props.mb};
  `};

  ${props => props.ml && css`
    margin-left: ${props.ml};
  `};

  ${props => props.mr && css`
    margin-right: ${props.mr};
  `};
`;

export const Row = styled(Container)`
  flex-direction: row;
`;

export const Column = styled(Container)`
  flex-direction: column;
`;

export const PageWrapper = styled(Column)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export const ContentWrapper = styled(Column)`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  flex: 1;
`;
