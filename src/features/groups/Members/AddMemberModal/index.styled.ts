import styled from 'styled-components';
import { ModalBody } from 'components/Modal';
import { TextRegular } from 'components/Text';

export const MembersModalBody = styled(ModalBody)`
  background: ${props => props.theme.colors.primary};
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`

export const ModalBodyElementWrapper = styled.div`
  padding: 0 1rem;
`

export const ModalText = styled(TextRegular)`
  font-weight: bold;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.75rem;
`

export const ModalSeparator = styled.div`
  width:100%;
  border-top: 1px solid ${props => props.theme.colors.secondary};
  margin: 0.75rem 0;
`