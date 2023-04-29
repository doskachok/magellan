import styled, {css} from 'styled-components';

interface ContainerProps {
  gap?: string;
  jc?: string;
  ai?: string;
  fullWidth?: boolean;
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

export const PageContentWrapper = styled(Column)`
  padding: 0 20px;
`;

export const ContentWrapper = styled(Column)`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  flex: 1;
`;
