import styled from 'styled-components';
import { Row } from '../Containers';

const radius = '10px';

export const ModalHeader = styled(Row)`
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  width: 100%;
  border-top-left-radius: ${radius};
  border-top-right-radius: ${radius};
`;

export const ModalBody = styled.div`
  display: flex;
  padding: 0.5rem;
  background: white;
  width: 100%;
`;

export const ModalFooter = styled(Row)`
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  width: 100%;
  background: aliceblue;
  border-bottom-left-radius: ${radius};
  border-bottom-right-radius: ${radius};
`;