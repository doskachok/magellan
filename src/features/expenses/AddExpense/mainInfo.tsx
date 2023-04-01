import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Input, TextUnderline } from "components";
import { Column, PageWrapper, Row } from "components/Containers";
import Header from "components/Header";
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as ArrowRightSVG } from 'assets/images/arrow-right.svg';

import { BackgroundFiller, ContentWrapper, HalfCircleBackground, MainInfoWrapper, NextStepButtonWrapper } from "./mainInfo.styled";
import BottomNavigation from "components/BottomNavigation";

const MainInfo = () => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onInputTextChanged = useCallback((name: string, value: string) => {
    throw new Error("Not implemented.");
  }, []);

  const onNextStep = useCallback(() => {
    throw new Error("Not implemented.");
  }, []);

  return (
    <PageWrapper>
      <Header
        text={t('mainInfo')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth>
        <MainInfoWrapper fullWidth>
          <Column fullWidth>
            <Row jc={'center'} fullWidth>
              <Input
                reversedTheme
                name={'transactionName'}
                displayName={t('transactionName')}
                placeholder={t('transactionName')}
                value=''
                onTextChange={onInputTextChanged}
              />
            </Row>
          </Column>

          <BackgroundFiller />
        </MainInfoWrapper>
        <HalfCircleBackground />

        <NextStepButtonWrapper onClick={onNextStep}>
          <TextUnderline>
            {t('nextStep')}
          </TextUnderline>
          <ArrowRightSVG />
        </NextStepButtonWrapper>
      </ContentWrapper>

      <BottomNavigation/>
    </PageWrapper>
  );
};

export default MainInfo;