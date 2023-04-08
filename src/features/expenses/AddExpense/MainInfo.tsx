import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Input, Select, TextUnderline } from "components";
import { Column, PageWrapper, Row } from "components/Containers";
import Header from "components/Header";
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as ArrowRightSVG } from 'assets/images/arrow-right.svg';
import { BackgroundFiller, ContentWrapper, CurrencyText, HalfCircleBackground, MainInfoText, MainInfoWrapper, NextStepButtonWrapper } from "./MainInfo.styled";
import BottomNavigation from "components/BottomNavigation";
import currencies from "constants/currencies";
import { selectedGroupSelector } from "features/groups/slice";
import { ICreateTransaction } from "../types";
import { newTransactionSelector } from "../slice";

const MainInfo = () => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();

  const group = useSelector(selectedGroupSelector);
  const transaction = useSelector(newTransactionSelector);

  const [form, setForm] = useState<ICreateTransaction>({
    name: '',
    paymentDateUtc: new Date(),
    currencyCode: currencies[0].value,
    groupId: group?.id ?? '',
    payerDetails: [],
    partialsAssignments: [],
  });

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onControllTextChanged = useCallback((name: string, value: string) => {
    setForm(form => ({
      ...form,
      [name]: name === 'paymentDateUtc' ? new Date(value) : value,
    }));
  }, []);

  const onNextStep = useCallback(() => {
    throw new Error("Not implemented.");
  }, []);

  useEffect(() => {
    if (!group)
      throw new Error("Not implemented.");
    
    if (transaction) {
      setForm((form) => ({
        ...form,
        ...transaction,
      }));
      return;
    }
    
    setForm((form) => ({
      ...form,
      paymentDateUtc: new Date(),
      groupId: group.id,
    }));
  }, [group, transaction])

  return (
    <PageWrapper>
      <Header
        text={t('mainInfo')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth>
        <MainInfoWrapper fullWidth>
          <Column gap={'1rem'} fullWidth>
            <MainInfoText>
              {t('mainInfoText')}
            </MainInfoText>

            <Row jc={'center'} fullWidth>
              <Input
                reversedTheme
                name={'name'}
                displayName={t('transactionName')}
                placeholder={t('transactionName')}
                value={form.name}
                onTextChange={onControllTextChanged}
              />
            </Row>
            <Row jc={'center'} fullWidth>
              <Input
                reversedTheme
                name={'paymentDateUtc'}
                displayName={t('paymentDateUtc')}
                type={'date'}
                value={form.paymentDateUtc.toISOString().split('T')[0]}
                onTextChange={onControllTextChanged}
              />
            </Row>
            <Row jc={'space-between'} ai={'center'} fullWidth>
              <CurrencyText>
                {t('currency')}
              </CurrencyText>

              <Select
                options={currencies}
                required
                value={form.currencyCode}
                name={'currencyCode'}
                reversedTheme={true}
                onValueChanged={onControllTextChanged}
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