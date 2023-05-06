import { useCallback, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as CheckSVG } from 'assets/images/check-icon.svg';
import { ReactComponent as EquallyMethodSVG } from 'assets/images/scales-icon.svg';
import { ReactComponent as UnequallyMethodSVG } from 'assets/images/coins-icon.svg';
import { ReactComponent as PercentageMethodSVG } from 'assets/images/percent-icon.svg';
import { ReactComponent as AdjustmentMethodSVG } from 'assets/images/adjust-control-icon.svg';
import BottomNavigation from "components/BottomNavigation";
import { ContentWrapper, PageWrapper } from "components/Containers";
import Header from "components/Header";
import { newTransactionSelector, saveTransaction } from "../slice";
import { ButtonBase, HalfCircle, TextUnderline } from "components";
import defaultTheme from "constants/theme/default.theme";
import { useGetTransactionGroupByIdQuery } from "features/groups/api";
import SplitMethodButton from "./SplitMethods/SplitMethodButton";
import EquallySplitMethodView from "./SplitMethods/Equally";
import UnequallySplitMethodView from "./SplitMethods/Unequally";
import AdjustmentSplitMethodView from "./SplitMethods/Adjustment";
import PercentageSplitMethodView from "./SplitMethods/Percentage";
import { ICreateTransaction, SplitMethod } from "../types";
import { ITransactionGroup } from "features/groups/types";
import { useCreateTransactionMutation } from "../api";

import { AddParticipantsWrapper, BackgroundFiller, MovingBorder, SaveButtonWrapper, BorderShift, SplitMethodBorderWrapper, SplitMethodWrapper } from "./AddParticipants.styled";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import { composeGroupRoute } from "constants/routes";

const GetSplitModeView = (splitMethodIndex: number, transaction: ICreateTransaction, group: ITransactionGroup) => {
  if (splitMethodIndex === 0)
    return <EquallySplitMethodView transaction={transaction} group={group} />
  else if (splitMethodIndex === 1)
    return <UnequallySplitMethodView transaction={transaction} group={group} />
  else if (splitMethodIndex === 2)
    return <PercentageSplitMethodView transaction={transaction} group={group} />
  else if (splitMethodIndex === 3)
    return <AdjustmentSplitMethodView transaction={transaction} group={group} />
  else
    throw new Error('Invalid split method index');
}

const splitMethodIndexToEnum = (splitMethodIndex: number) => {
  if (splitMethodIndex === 0)
    return SplitMethod.Equal;
  else if (splitMethodIndex === 1)
    return SplitMethod.AssignedAmount;
  else if (splitMethodIndex === 2)
    return SplitMethod.Percentage;
  else if (splitMethodIndex === 3) // Ajustment uses Equal as base type and AssignedAmount for adjustments
    return SplitMethod.Equal;
  else
    throw new Error('Invalid split method index');
};
   

const AddParticipants = () => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createTransaction, { data: createdTransaction, isLoading: isTransactionCreating }] = useCreateTransactionMutation();

  const transaction = useSelector(newTransactionSelector);
  const group = useGetTransactionGroupByIdQuery(transaction?.groupId || '');

  const [splitMethodIndex, setSplitMethodIndex] = useState<number>(0);

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const resetPartialsAssignments = useCallback((splitIndex: number) => {
    const newSplitMethod = splitMethodIndexToEnum(splitIndex);
    
    // Get unique usersIds from partialsAssignments
    const userIds = transaction!.partialsAssignments
      .map(partialsAssignment => partialsAssignment.userId)
      .filter((userId, index, self) => index === self.indexOf(userId));

    const newTransaction = {
      ...transaction!,
      partialsAssignments: [...userIds].map((userId) => ({
        userId,
        partialAmount: 0,
        splitMethod: newSplitMethod
      }))
    };

    dispatch(saveTransaction(newTransaction));
  }, [transaction, dispatch]);

  const onSplitMethods = useMemo(() => new Array(4).fill(null).map((_, i) => () => {
    resetPartialsAssignments(i);
    setSplitMethodIndex(i);
  }), [setSplitMethodIndex, resetPartialsAssignments]);

  const onSave = useCallback(() => {
    console.log(transaction);
    createTransaction(transaction!);
  }, [createTransaction, transaction]);

  useEffect(() => {
    if (createdTransaction) {
      toast.success(t('transactionCreated'));
      navigate(composeGroupRoute(transaction!.groupId), { replace: true });
    }
  }, [createdTransaction, navigate, t, transaction]);

  return (
    <PageWrapper>
      <Header
        text={t('participants')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />
      <ContentWrapper fullWidth>
        <AddParticipantsWrapper fullWidth gap="5vh">
          <ButtonBase>
            <TextUnderline reversedColor>
              {`${group.data?.participants.length}/${group.data?.participants.length} ${t('membersInTransaction')}`}
            </TextUnderline>
          </ButtonBase>

          <SplitMethodWrapper fullWidth jc="space-between">
            <SplitMethodBorderWrapper>
              <BorderShift flex={splitMethodIndex} />
              <MovingBorder />
              <BorderShift flex={3 - splitMethodIndex} />
            </SplitMethodBorderWrapper>

            <SplitMethodButton text={t("equally")} svgImg={<EquallyMethodSVG />} onClick={onSplitMethods[0]} />
            <SplitMethodButton text={t("unequally")} svgImg={<UnequallyMethodSVG />} onClick={onSplitMethods[1]} />
            <SplitMethodButton text={t("percentage")} svgImg={<PercentageMethodSVG />} onClick={onSplitMethods[2]} />
            <SplitMethodButton text={t("adjustment")} svgImg={<AdjustmentMethodSVG />} onClick={onSplitMethods[3]} />
          </SplitMethodWrapper>

          {GetSplitModeView(splitMethodIndex, transaction!, group.data!)}

          <BackgroundFiller />
        </AddParticipantsWrapper>
        <HalfCircle />

        <SaveButtonWrapper>
          <ButtonBase onClick={onSave}>
            <TextUnderline>
              {t('save')}
            </TextUnderline>
            <CheckSVG fill={defaultTheme.colors.text.link} />
          </ButtonBase>
        </SaveButtonWrapper>
      </ContentWrapper>

      <Loader isLoading={isTransactionCreating} />
      <BottomNavigation />
    </PageWrapper>
  );
};

export default AddParticipants;