import styled from 'styled-components';

export const AuthFooter = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.brand};
    font-weight: ${({ theme }) => theme.font.weight.semibold};
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
`;
