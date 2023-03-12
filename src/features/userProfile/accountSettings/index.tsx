import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { PageWrapper } from "components/Containers";
import Header from "components/Header";
import { ROUTES } from "constants/routes";
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';

const AccountSetttings = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const handleBackAction = useCallback(() => {
    navigate(ROUTES.GROUPS.ROOT, { replace: true });
  }, [navigate]);

  return (
    <PageWrapper>
      <Header
        text={t('accountSettings')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />
    </PageWrapper>
  );
};

export default AccountSetttings;