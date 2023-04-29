import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as CheckSVG } from 'assets/images/check-icon.svg';
import BottomNavigation from "components/BottomNavigation";
import { ContentWrapper, PageWrapper } from "components/Containers";
import Header from "components/Header";
import { CreateRouteString, ExpenseRouteMode, NoneRouteString, composeExpenseRoute } from "constants/routes";
import { newTransactionSelector } from "../slice";
import { ButtonBase, HalfCircle, TextUnderline } from "components";
import defaultTheme from "constants/theme/default.theme";

import { AddParticipantsWrapper, BackgroundFiller, SaveButtonWrapper } from "./AddParticipants.styled";


const AddParticipants = () => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();

  const transaction = useSelector(newTransactionSelector);
  if (!transaction)
    navigate(composeExpenseRoute(NoneRouteString, CreateRouteString, ExpenseRouteMode.ADD_MAININFO));

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <PageWrapper>
      <Header
        text={t('participants')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />
      <ContentWrapper fullWidth>
        <AddParticipantsWrapper fullWidth>

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