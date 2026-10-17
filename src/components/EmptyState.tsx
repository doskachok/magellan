import type { ReactNode } from 'react';
import styled from 'styled-components';

import { popIn } from 'theme/motion';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(10, 6)};
  text-align: center;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandSoft};
  color: ${({ theme }) => theme.colors.brand};
  animation: ${popIn} ${({ theme }) => theme.motion.spring} backwards;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

const Description = styled.p`
  max-width: 320px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <Root>
    <IconCircle aria-hidden>{icon}</IconCircle>
    <Title>{title}</Title>
    {description && <Description>{description}</Description>}
    {action}
  </Root>
);
