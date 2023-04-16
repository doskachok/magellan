import { TextRegular, TextUnderline } from "components";
import { ButtonTransparent } from "components/Button/index.styled";
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
  margin-bottom: 15px;
`;

export const CurrencyTitle = styled(TextRegular)`
  color: ${props => props.theme.colors.text.secondary};
  width: 100%;
  margin-top: 23px;
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

export const NextStepButton = styled(ButtonTransparent)`
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;

  &:disabled ${TextUnderline} {
    color: ${props => props.theme.colors.input.disabled.default};
  }
`;

