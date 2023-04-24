import { useCallback, useEffect, useState } from "react";
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
import UserListItem from "components/UserListItem";
import { useGetTransactionGroupByIdQuery } from "features/groups/api";
import { useModal } from "providers/ModalProvider";
import ChangeUserMoneyModal from "../ChangeUserMoneyModal";
import { IUser } from "types/userTypes";

const getUserAmountComponent = (user: IUser, form: ICreateTransaction) => {
  const amount = form.payerDetails.find(p => p.payerId === user.id)?.amount || 0;
  return amount > 0 ?
    (<CurrencyText>{getCurrencyWithSymbolString(amount, form.currencyCode)}</CurrencyText>)
    : null;
};

const AddPayers = () => {
  const { t } = useTranslation('expenses');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalContext = useModal();

  const transaction = useSelector(newTransactionSelector);
  const group = useGetTransactionGroupByIdQuery(transaction?.groupId || '');
  const [addMemberModalId, setAddMemberModalId] = useState<number | null>(null);

  const [form, setForm] = useState<ICreateTransaction>({
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

  const onUserAmountChanged = useCallback((user: IUser, amount: number) => {
    setForm((form) => ({
      ...form,
      payerDetails: [
        ...form.payerDetails.filter(p => p.payerId !== user.id),
        {
          payerId: user.id,
          amount: amount,
        }
      ]
    }));
  }, [setForm]);

  const onUserClicked = useCallback((user: IUser) => {
    const modalId = modalContext.showModal(<ChangeUserMoneyModal user={user} onDone={onUserAmountChanged} />);
    setAddMemberModalId(modalId);
  }, [modalContext, setAddMemberModalId, onUserAmountChanged]);

  const onNextStep = () => {
    dispatch(saveTransaction(form));
    // TODO: navigate to the next step
    navigate(composeExpenseRoute(form.groupId, CreateRouteString, ExpenseRouteMode.ADD_MAININFO));
  }

  useEffect(() => {
    return () => {
      if (addMemberModalId) {
        modalContext.closeModal(addMemberModalId);
        setAddMemberModalId(null);
      }
    };
  }, [addMemberModalId, modalContext]);

  useEffect(() => {
    if (!addMemberModalId) // To not save on the first render.
      return;

    dispatch(saveTransaction(form));
  }, [form, addMemberModalId, modalContext, dispatch])
  
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

            <Column fullWidth gap={'0.5rem'}>
              {group.data?.participants?.map(u => <UserListItem
                key={u.id}
                user={u}
                underlined
                onClick={() => onUserClicked(u)}
                rightItem={getUserAmountComponent(u, form)}
              />)}
            </Column>
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