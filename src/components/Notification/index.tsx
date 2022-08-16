import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NotificationText, NotificationWrapper } from './index.styled';
interface ILocationState {
  isRegistered?: boolean;
}

export const Notification = () => {
  const { t } = useTranslation('notificaton');
  const location = useLocation();
  const state = location.state as ILocationState;

  const registerSuccessTxt = t(
    'email_already_used',
    'Try again, this email has been already used'
  );
  const emailUsedTxt = t(
    'email_already_used',
    'Try again, this email has been already used'
  );

  const notificatonTxt = state?.isRegistered
    ? registerSuccessTxt
    : state?.isRegistered === false && emailUsedTxt;

  if (notificatonTxt) {
    return (
      <NotificationWrapper>
        <NotificationText>{notificatonTxt}</NotificationText>
      </NotificationWrapper>
    );
  }

  return null;
};
