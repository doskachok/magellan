import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import BottomNavigation from "components/BottomNavigation";
import { PageWrapper } from "components/Containers";
import Header from "components/Header";
import { CreateRouteString, ExpenseRouteMode, NoneRouteString, composeExpenseRoute } from "constants/routes";
import { newTransactionSelector } from "../slice";

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

      <BottomNavigation />
    </PageWrapper>
  );
};

export default AddParticipants;