import { useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { CreateRouteString, ExpenseRouteMode, NoneRouteString, composeExpenseRoute } from "constants/routes";
import { newTransactionSelector } from "../slice";
import { ButtonBase, HalfCircle, TextUnderline } from "components";
import defaultTheme from "constants/theme/default.theme";
import { useGetTransactionGroupByIdQuery } from "features/groups/api";
import SplitMethodButton from "./SplitMethods/SplitMethodButton";

import { AddParticipantsWrapper, BackgroundFiller, MovingBorder, SaveButtonWrapper, BorderShift, SplitMethodBorderWrapper, SplitMethodWrapper } from "./AddParticipants.styled";


const AddParticipants = () => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();

  const transaction = useSelector(newTransactionSelector);
  if (!transaction)
    navigate(composeExpenseRoute(NoneRouteString, CreateRouteString, ExpenseRouteMode.ADD_MAININFO));

  const group = useGetTransactionGroupByIdQuery(transaction?.groupId || '');

  const [splitMethodIndex, setSplitMethodIndex] = useState<number>(0);

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onSplitMethods = useMemo(() => new Array(4).fill(null).map((_, i) => () => setSplitMethodIndex(i)), [setSplitMethodIndex]);

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

          <BackgroundFiller />
        </AddParticipantsWrapper>
        <HalfCircle />

        <SaveButtonWrapper>
          <ButtonBase>
            <TextUnderline>
              {t('save')}
            </TextUnderline>
            <CheckSVG fill={defaultTheme.colors.text.link} />
          </ButtonBase>
        </SaveButtonWrapper>
      </ContentWrapper>

      <BottomNavigation />
    </PageWrapper>
  );
};

export default AddParticipants;