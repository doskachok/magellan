import { Column, Row } from "components/Containers";
import styled from "styled-components";

export const ContentWrapper = styled(Column)`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  flex: 1;
`;

export const MainInfoWrapper = styled(Column)`
  z-index: 1;
  flex: 1;
`;

export const AccountInfoWrapper = styled(Column)`
  background: ${props => props.theme.colors.primary};
  padding: 14px 1.5rem 0;
  z-index: 1;
`;

export const BackgroundFiller = styled(Row)`
  background: ${props => props.theme.colors.primary};
  width: 100%;
  flex: 1;
`;

export const LogoutButtonWrapper = styled(Row)`
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
`;

export const SaveButtonWrapper = styled(Row)`
  justify-content: flex-end;
  align-items: end;
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding-right: 1.5rem;
`;