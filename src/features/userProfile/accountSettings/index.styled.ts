import { Column, Row } from "components/Containers";
import styled from "styled-components";

export const ContentWrapper = styled(Column)`
  overflow-y: auto;
  overflow-x: hidden;
  justify-content: space-between;
  height: 100%;
  flex: 1;
`;

export const MainInfoWrapper = styled(Column)`
  z-index: 1;
`;

export const AccountInfoWrapper = styled(Column)`
  background: ${props => props.theme.colors.primary};
  padding: 2rem 1.5rem 0;
  z-index: 1;
`;

export const AccountSettingsBackground = styled(Row)`
  border-radius: 100%;
  background: ${props => props.theme.colors.primary};
  width: 120vw;
  height: 80vw;
  z-index: 0;
  margin-top: -55vw;
  margin-left: -10vw;
`;

export const LogoutWrapper = styled(Row)`
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const SaveButtonWrapper = styled(Row)`
  justify-content: flex-end;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding-right: 1.5rem;
`;