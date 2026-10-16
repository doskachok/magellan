import type { ReactNode } from 'react';
import styled from 'styled-components';

import { SectionTitle } from './Card';

const SectionRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  padding: ${({ theme }) => theme.space(0, 1)};
`;

interface SectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export const Section = ({ title, action, children }: SectionProps) => (
  <SectionRoot>
    <SectionHeader>
      <SectionTitle>{title}</SectionTitle>
      {action}
    </SectionHeader>
    {children}
  </SectionRoot>
);
