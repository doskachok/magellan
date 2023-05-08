import { TextRegular } from 'components';
import { Column, Row } from 'components/Containers';
import styled from 'styled-components';

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

export const NextStepButtonWrapper = styled(Row)`
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
`;