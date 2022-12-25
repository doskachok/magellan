import styled, { css } from 'styled-components';
import { Column, Row } from '../../../components/Containers';
import { TextRegular } from '../../../components/Text';

export const ContentWrapper = styled(Column)`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

interface IGroupEditWrapperProps {
  hidden: boolean;
};

export const GroupEditWrapper = styled(Column) <IGroupEditWrapperProps>`
  ${props => props.hidden && css`
    display: none;
  `};
`;

export const MainInfoWrapper = styled(Column)`
  z-index: 1;
`;

export const GroupInfoWrapper = styled(Column)`
  background: ${props => props.theme.colors.primary};
  padding: 2rem 1.5rem 0;
  z-index: 1;
`;

export const GroupCurrencyText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.secondary};
  width: 100%;
`;

export const GroupEditBackground = styled(Row)`
  border-radius: 100%;
  background: ${props => props.theme.colors.primary};
  width: 120vw;
  height: 80vw;
  z-index: 0;
  margin-top: -55vw;
  margin-left: -10vw;
`;

export const AddMembersWrapper = styled(Row)`
  margin-top: 1rem;
`;

export const SaveButtonWrapper = styled(Row)`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

export const Avatar = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -khtml-border-radius: 50%;
  outline: solid 5px white;
  object-fit: cover;
`;
