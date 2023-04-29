import styled from "styled-components";
import { Column, Row } from "components/Containers";

export const AddParticipantsWrapper = styled(Column)`
  background: ${props => props.theme.colors.primary};
  z-index: 1;
  padding: 14px 1.5rem 0;
  flex: 1;
`;

export const SplitMethodButtonWrapper = styled(Row)`
  justify-content: center;
  align-items: center;
  height: 64px;
  width: 64px;
`;

export const BackgroundFiller = styled(Row)`
  background: ${props => props.theme.colors.primary};
  width: 100%;
  flex: 1;
`;

export const SaveButtonWrapper = styled(Row)`
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
`;