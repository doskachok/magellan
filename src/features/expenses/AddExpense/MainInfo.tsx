import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Input, Select, TextRegular, TextUnderline } from "components";
import { Column, PageWrapper, Row } from "components/Containers";
import Header from "components/Header";
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as ArrowRightSVG } from 'assets/images/arrow-right.svg';
import { BackgroundFiller, ContentWrapper, CurrencyText, HalfCircleBackground, MainInfoWrapper, NextStepButtonWrapper } from "./MainInfo.styled";
import BottomNavigation from "components/BottomNavigation";
import currencies from "constants/currencies";
import { selectedGroupSelector } from "features/groups/slice";

const MainInfo = () => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();

  const group = useSelector(selectedGroupSelector);

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onInputTextChanged = useCallback((name: string, value: string) => {
    throw new Error("Not implemented.");
  }, []);

  const onCurrencyChanged = useCallback((name: string, value: string) => {
    throw new Error("Not implemented.");
  }, []);

  const onNextStep = useCallback(() => {
    throw new Error("Not implemented.");
  }, []);

  useEffect(() => {
    if (!group)
      throw new Error("Not implemented.");
  }, [group])

  return (
    <PageWrapper>
      <Header
        text={t('mainInfo')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth>
        <MainInfoWrapper fullWidth>
          <Column gap={'1.5rem'} fullWidth>
            <TextRegular reversedColor>
              {t('mainInfoText')}
            </TextRegular>
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
            <Row jc={'center'} fullWidth>
              <Input
                reversedTheme
                name={'date'}
                displayName={t('transactionName')}
                type={'date'}
                value={''}
                onTextChange={onInputTextChanged}
              />
            </Row>
            <Row jc={'space-between'} ai={'center'} fullWidth>
              <CurrencyText>
                {t('currency')}
              </CurrencyText>

              <Select
                options={currencies}
                required
                value={'USD'}
                name={'currencyCode'}
                reversedTheme={true}
                onValueChanged={onCurrencyChanged}
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