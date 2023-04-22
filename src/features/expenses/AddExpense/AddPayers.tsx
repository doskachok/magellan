import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { TextUnderline } from "components";
import { Column, PageWrapper, Row } from "components/Containers";
import Header from "components/Header";
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as ArrowRightSVG } from 'assets/images/arrow-right.svg';
import { ReactComponent as ArrowRightDisabledSVG } from 'assets/images/arrow-right-disabled.svg';
import { BackgroundFiller, ContentWrapper, HalfCircleBackground, AddPayersWrapper, NextStepButton, AddPayersText, CurrencyText, AddPayersInfo } from "./AddPayers.styled";
import BottomNavigation from "components/BottomNavigation";
import currencies from "constants/currencies";
import { ICreateTransaction } from "../types";
import { newTransactionSelector, saveTransaction } from "../slice";
import { CreateRouteString, ExpenseRouteMode, composeExpenseRoute } from "constants/routes";
import { getCurrencyWithSymbolString } from "helpers/currencyHelper";

const AddPayers = () => {
  const { t } = useTranslation('expenses');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const transaction = useSelector(newTransactionSelector);

  const [form, /*setForm*/] = useState<ICreateTransaction>({
    name: '',
    paymentDateUtc: new Date().toISOString().split('T')[0],
    currencyCode: currencies[0].value,
    groupId: '',
    payerDetails: [],
    partialsAssignments: [],
    ...(transaction ? transaction : {}), // Load transaction from the slice
  });

  const isNextStepButtonDisabled = true;

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onNextStep = () => {
    dispatch(saveTransaction(form));
    // TODO: navigate to the next step
    navigate(composeExpenseRoute(form.groupId, CreateRouteString, ExpenseRouteMode.ADD_MAININFO));
  }

  return (
    <PageWrapper>
      <Header
        text={t('payers')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth>
        <AddPayersWrapper fullWidth>
          <Column gap={'1rem'} fullWidth>
            <AddPayersInfo>
              <AddPayersText>
                {t('howMuchPayed')}
              </AddPayersText>
              <CurrencyText>
              {`${t('total')}: ${getCurrencyWithSymbolString(0, form.currencyCode)}`}
              </CurrencyText>
            </AddPayersInfo>
            {/* TODO: Implement add payers */}
          </Column>
          <BackgroundFiller />
        </AddPayersWrapper>
        <HalfCircleBackground />

        <Row fullWidth jc={'center'}>
          <NextStepButton disabled={isNextStepButtonDisabled} onClick={onNextStep}>
            <TextUnderline>
              {t('nextStep')}
            </TextUnderline>
            {!isNextStepButtonDisabled ? <ArrowRightSVG /> : <ArrowRightDisabledSVG />}
          </NextStepButton>
        </Row>
      </ContentWrapper>

      <BottomNavigation />
    </PageWrapper>
  );
};

export default AddPayers;