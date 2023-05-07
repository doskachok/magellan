import { useCallback, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

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
import Loader from "components/Loader";
import { composeGroupRoute } from "constants/routes";
import { getCurrencyWithSymbolString } from "helpers/currencyHelper";

import { AddParticipantsWrapper, BackgroundFiller, MovingBorder, SaveButtonWrapper, BorderShift, SplitMethodBorderWrapper, SplitMethodWrapper, MismatchText } from "./AddParticipants.styled";


enum SplitMethodView {
  Equally = 0,
  Unequally = 1,
  Percentage = 2,
  Adjustment = 3
}

const GetSplitModeView = (splitMethodView: SplitMethodView, transaction: ICreateTransaction, group: ITransactionGroup) => {
  switch (splitMethodView) {
    case SplitMethodView.Equally:
      return <EquallySplitMethodView transaction={transaction} group={group} />;
    case SplitMethodView.Unequally:
      return <UnequallySplitMethodView transaction={transaction} group={group} />;
    case SplitMethodView.Percentage:
      return <PercentageSplitMethodView transaction={transaction} group={group} />;
    case SplitMethodView.Adjustment:
      return <AdjustmentSplitMethodView transaction={transaction} group={group} />;
    default:
      throw new Error('Invalid split method view');
  }
}

const splitMethodViewToApiEnum = (splitMethodView: SplitMethodView) => {
  switch (splitMethodView) {
    case SplitMethodView.Equally:
      return SplitMethod.Equal;
    case SplitMethodView.Unequally:
      return SplitMethod.AssignedAmount;
    case SplitMethodView.Percentage:
      return SplitMethod.Percentage;
    case SplitMethodView.Adjustment: // Ajustment uses Equal as base type and AssignedAmount for adjustments
      return SplitMethod.Equal;
    default:
      throw new Error('Invalid split method index');
  }
};
   

const AddParticipants = () => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createTransaction, { data: createdTransaction, isLoading: isTransactionCreating }] = useCreateTransactionMutation();

  const transaction = useSelector(newTransactionSelector);
  const group = useGetTransactionGroupByIdQuery(transaction?.groupId || '');

  const [splitMethodView, setSplitMethodView] = useState<SplitMethodView>(SplitMethodView.Equally);

  const errorString = useMemo(() => {
    const paidSum = transaction!.payerDetails.reduce((acc, curr) => acc + curr.amount, 0);
    const borrowedSum = transaction!.partialsAssignments
      .filter(pa => pa.splitMethod === SplitMethod.AssignedAmount)
      .reduce((acc, curr) => acc + curr.partialAmount, 0);

    const borrowedToPaidString = `${getCurrencyWithSymbolString(borrowedSum, transaction!.currencyCode)}
      / ${getCurrencyWithSymbolString(paidSum, transaction!.currencyCode)} ${t('settled')}`;

    // If SplitMethod is Equal/Shares we cannot do any validation.
    if (transaction!.partialsAssignments.some(pa => pa.splitMethod === SplitMethod.Equal || pa.splitMethod === SplitMethod.Shares)) {
      if (paidSum < borrowedSum)
        return borrowedToPaidString;
      return null;
    }

    // Check that we have 100%
    if (transaction!.partialsAssignments.some(pa => pa.splitMethod === SplitMethod.Percentage)) {
      const percentsAssignmentAmount = transaction!.partialsAssignments
        .filter(pa => pa.splitMethod === SplitMethod.Percentage)
        .reduce((acc, curr) => acc + curr.partialAmount, 0);

      if (percentsAssignmentAmount !== 100)
        return `${percentsAssignmentAmount} / 100% ${t('settled')}`;
      if (paidSum < borrowedSum)
        return borrowedToPaidString;
      return null;
    }

    // Check that paidSum and borrowedSum are the same.
    if (paidSum !== borrowedSum)
      return borrowedToPaidString;
    return null;
  }, [transaction, t]);

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const resetPartialsAssignments = useCallback((splitMethodView: SplitMethodView) => {
    const newSplitMethod = splitMethodViewToApiEnum(splitMethodView);
    
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
    setSplitMethodView(i);
  }), [setSplitMethodView, resetPartialsAssignments]);

  const onSave = useCallback(() => {
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
              <BorderShift flex={splitMethodView} />
              <MovingBorder />
              <BorderShift flex={Object.keys(SplitMethodView).length / 2 - 1 - splitMethodView} />
            </SplitMethodBorderWrapper>

            <SplitMethodButton text={t("equally")} svgImg={<EquallyMethodSVG />} onClick={onSplitMethods[SplitMethodView.Equally]} />
            <SplitMethodButton text={t("unequally")} svgImg={<UnequallyMethodSVG />} onClick={onSplitMethods[SplitMethodView.Unequally]} />
            <SplitMethodButton text={t("percentage")} svgImg={<PercentageMethodSVG />} onClick={onSplitMethods[SplitMethodView.Percentage]} />
            <SplitMethodButton text={t("adjustment")} svgImg={<AdjustmentMethodSVG />} onClick={onSplitMethods[SplitMethodView.Adjustment]} />
          </SplitMethodWrapper>

          {GetSplitModeView(splitMethodView, transaction!, group.data!)}

          <BackgroundFiller />
        </AddParticipantsWrapper>
        <HalfCircle />

        <SaveButtonWrapper>
          {!errorString &&
            <ButtonBase onClick={onSave}>
              <TextUnderline>
                {t('save')}
              </TextUnderline>
              <CheckSVG fill={defaultTheme.colors.text.link} />
            </ButtonBase>
          }
          {!!errorString &&
            <MismatchText>
              {errorString}
            </MismatchText>
          }
        </SaveButtonWrapper>
      </ContentWrapper>

      <Loader isLoading={isTransactionCreating} />
      <BottomNavigation />
    </PageWrapper>
  );
};

export default AddParticipants;