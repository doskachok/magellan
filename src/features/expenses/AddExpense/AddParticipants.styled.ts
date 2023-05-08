import styled, { css } from 'styled-components';
import { Column, Row } from 'components/Containers';
import { TextError } from 'components/Input/index.styled';

export const AddParticipantsWrapper = styled(Column)`
  background: ${props => props.theme.colors.primary};
  z-index: 1;
  padding: 14px 1.5rem 0;
  flex: 1;
`;

export const MovingBorder = styled.div`
  width: 64px;
  height: 64px;
  border: 2px solid white;
  border-radius: 5px;
`;

export const BorderShift = styled.div<{flex: number}>`
  ${prop => prop.flex && css`flex: ${prop.flex}`};
  height: 100%;

  transition: all 0.3s ease;
`;

export const SplitMethodWrapper = styled(Row)`
  position: relative;
`;

export const SplitMethodBorderWrapper = styled(Row)`
  position: absolute;
  justify-content: flex-start;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

export const MismatchText = styled(TextError)`
  font-size: 16px;
  font-weight: bold;
`;