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
  @supports (-webkit-hyphens:none) {
    min-height: -webkit-fill-available;
  }
  
  min-height: 100vh;
  width: 100%;
`;

export const PageContentWrapper = styled(Column)`
  padding: 0 20px;
`;
