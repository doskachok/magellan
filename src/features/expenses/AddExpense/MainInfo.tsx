import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Input, Select, TextUnderline } from "components";
import { Column, PageWrapper, Row } from "components/Containers";
import Header from "components/Header";
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as ArrowRightSVG } from 'assets/images/arrow-right.svg';
import { BackgroundFiller, ContentWrapper, CurrencyText, HalfCircleBackground, MainInfoText, MainInfoWrapper, NextStepButtonWrapper } from "./MainInfo.styled";
import BottomNavigation from "components/BottomNavigation";
import currencies from "constants/currencies";
import { ICreateTransaction } from "../types";
import { newTransactionSelector } from "../slice";
import { CreateRouteString, ExpenseRouteMode, composeExpenseRoute } from "constants/routes";
import { saveTransaction } from "../slice";

interface ILocationState {
  proceed?: boolean;
}

const MainInfo = () => {
  const { t } = useTranslation('expenses');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as ILocationState;

  const {groupId: groupIdOptional} = useParams();
  const groupId = groupIdOptional ?? '';

  const transaction = useSelector(newTransactionSelector);

  const [form, setForm] = useState<ICreateTransaction>({
    name: '',
    paymentDateUtc: new Date().toISOString().split('T')[0],
    currencyCode: currencies[0].value,
    groupId: groupId,
    payerDetails: [],
    partialsAssignments: [],
  });

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onControllTextChanged = useCallback((name: string, value: string) => {
    setForm(form => ({
      ...form,
      [name]: value,
    }));
  }, []);

  const onNextStep = () => {
    dispatch(saveTransaction(form));
    navigate(composeExpenseRoute(groupId, CreateRouteString, ExpenseRouteMode.ADD_MAININFO), {state: { proceed: true }});
  }

  useEffect(() => {  
    if (!locationState?.proceed || !transaction) {
      // Clean transaction
      dispatch(saveTransaction(null));
    }
    else {
      // Load transaction from the slice 
      setForm((form) => ({
        ...form,
        ...transaction,
      }));
      return;
    }
  }, [dispatch, transaction, locationState])

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
                value={form.paymentDateUtc}
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