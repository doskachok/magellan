import { Row } from '../Containers';
import styled from 'styled-components';

export const NavigationStyled = styled(Row)`
  height: 55px;
  width: 100%;
  border-top: solid 1px lightgrey;

  & div {
    width: 100%;
    display: flex;
    place-content: center;
  }
`;

export const Groups = styled.div`
  height: 100%;
  align-items: center;
  color: ${props => props.theme.colors.primary};
`

export const AddExpense = styled.button`
  border: none;
  padding: 13px 16px 16px 12px;
  margin-top: -17px;
  border-radius: 35px;
  height: 70px;
  background: ${props => props.theme.colors.primary};
`
export const Profile = styled.div`
  height: 100%;
  align-items: center;
  color: ${props => props.theme.colors.primary};
`