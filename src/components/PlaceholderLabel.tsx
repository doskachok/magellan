import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Label = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.space(0.5, 2)};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

/** Marks a name-only member who hasn't signed up. */
export const PlaceholderLabel = () => {
  const { t } = useTranslation();
  return <Label>{t('notSignedUp')}</Label>;
};
