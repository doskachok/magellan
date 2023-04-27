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

export const AddPayersWrapper = styled(Column)`
  background: ${props => props.theme.colors.primary};
  z-index: 1;
  padding: 14px 1.5rem 0;
  flex: 1;
`;

export const AddPayersInfo = styled(Row)`
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 15px;
`;

export const AddPayersText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.secondary};
  width: 50%;
`;

export const CurrencyText = styled(TextRegular)`
  font-weight: bold;
  color: ${props => props.theme.colors.text.secondary};
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
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
`;

