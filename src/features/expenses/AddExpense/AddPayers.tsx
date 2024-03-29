import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ButtonBase, HalfCircle, TextUnderline } from 'components';
import { Column, ContentWrapper, PageWrapper } from 'components/Containers';
import Header from 'components/Header';
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as ArrowRightSVG } from 'assets/images/arrow-right.svg';
import { ReactComponent as ArrowRightDisabledSVG } from 'assets/images/arrow-right-disabled.svg';
import { BackgroundFiller, AddPayersWrapper, AddPayersText, CurrencyText, AddPayersInfo, NextStepButtonWrapper } from './AddPayers.styled';
import BottomNavigation from 'components/BottomNavigation';
import currencies from 'constants/currencies';
import { ICreateTransaction } from '../types';
import { newTransactionSelector, saveTransaction } from '../slice';
import { CreateRouteString, ExpenseRouteMode, composeExpenseRoute } from 'constants/routes';
import { getCurrencyWithSymbolString } from 'helpers/currencyHelper';
import UserListItem from 'components/UserListItem';
import { useGetTransactionGroupByIdQuery } from 'features/groups/api';
import { useModal } from 'providers/ModalProvider';
import ChangeUserMoneyModal from '../ChangeUserMoneyModal';
import { IUser } from 'types/userTypes';

const getUserAmountComponent = (user: IUser, currencyCode: string, userAmountMap: Record<string, number>) => {
  const amount = userAmountMap[user.id] > 0 ? userAmountMap[user.id] : 0;
  return <CurrencyText>{getCurrencyWithSymbolString(amount, currencyCode)}</CurrencyText>;
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

  const userAmountMap = useMemo(() => form.payerDetails.reduce((acc, curr) => ({
    ...acc,
    [curr.payerId]: curr.amount,
  }), {} as { [key: string]: number }), [form.payerDetails]);

  const total = useMemo(() => form.payerDetails.reduce((acc, curr) => acc + curr.amount, 0), [form.payerDetails]);

  const isNextStepButtonDisabled = total <= 0;

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
    const modalId = modalContext.showModal(
      <ChangeUserMoneyModal user={user} onDone={onUserAmountChanged} amount={userAmountMap[user.id]} />
    );
    setAddMemberModalId(modalId);
  }, [modalContext, setAddMemberModalId, onUserAmountChanged, userAmountMap]);

  const onNextStep = () => {
    dispatch(saveTransaction(form));
    navigate(composeExpenseRoute(form.groupId, CreateRouteString, ExpenseRouteMode.ADD_PARTICIPANTS));
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
    dispatch(saveTransaction(form));
  }, [form, dispatch]);
  
  return (
    <PageWrapper>
      <Header
        text={t('payers')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth jc="space-between">
        <AddPayersWrapper fullWidth>
          <Column gap={'1rem'} fullWidth>
            <AddPayersInfo>
              <AddPayersText>
                {t('howMuchPayed')}
              </AddPayersText>
              <CurrencyText>
              {`${t('total')}: ${getCurrencyWithSymbolString(total, form.currencyCode)}`}
              </CurrencyText>
            </AddPayersInfo>

            <Column fullWidth gap={'0.5rem'}>
              {group.data?.participants?.map(u => <UserListItem
                key={u.id}
                user={u}
                reversedTheme
                onClick={() => onUserClicked(u)}
                rightItem={getUserAmountComponent(u, form.currencyCode, userAmountMap)}
              />)}
            </Column>
          </Column>
          <BackgroundFiller />
        </AddPayersWrapper>
        <HalfCircle />

        <NextStepButtonWrapper>
          <ButtonBase disabled={isNextStepButtonDisabled} onClick={onNextStep}>
            <TextUnderline>
              {t('nextStep')}
            </TextUnderline>
            {!isNextStepButtonDisabled ? <ArrowRightSVG /> : <ArrowRightDisabledSVG />}
          </ButtonBase>
        </NextStepButtonWrapper>
      </ContentWrapper>

      <BottomNavigation />
    </PageWrapper>
  );
};

export default AddPayers;