import { TextRegular } from "components";
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
  background: ${props => props.theme.colors.primary};
  z-index: 1;
  padding: 14px 1.5rem 0;
  flex: 1;
`;

export const MainInfoText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.secondary};
  width: 100%;
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const CurrencyText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.secondary};
  width: 100%;
`;

export const BackgroundFiller = styled(Row)`
  background: ${props => props.theme.colors.primary};
  width: 100%;
  flex: 1;
`;

export const HalfCircleBackground = styled(Row)`
  border-radius: 100%;
  background: ${props => props.theme.colors.primary};
  width: 120vw;
  height: 80vw;
  z-index: 0;
  margin-top: -60vw;
  margin-left: -10vw;
`;

export const NextStepButtonWrapper = styled(Row)`
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
  width: 100%;
`;