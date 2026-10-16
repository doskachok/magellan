import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Split as SplitIcon } from 'lucide-react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const Hero = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(12, 6, 16)};
  padding-top: calc(${({ theme }) => theme.space(12)} + env(safe-area-inset-top));
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.onBrand};
  text-align: center;
`;

const Logo = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.brand};
`;

const AppName = styled.p`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

const Tagline = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const Panel = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(5)};
  width: calc(100% - 32px);
  max-width: 440px;
  margin: ${({ theme }) => theme.space(-10)} auto ${({ theme }) => theme.space(8)};
  padding: ${({ theme }) => theme.space(6, 5)};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.raised};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

export const AuthLayout = ({ title, children }: { title: string; children: ReactNode }) => {
  const { t } = useTranslation('auth');

  return (
    <Root>
      <Hero>
        <Logo aria-hidden>
          <SplitIcon size={30} />
        </Logo>
        <AppName>WiseSplit</AppName>
        <Tagline>{t('tagline')}</Tagline>
      </Hero>
      <Panel>
        <Title>{title}</Title>
        {children}
      </Panel>
    </Root>
  );
};
