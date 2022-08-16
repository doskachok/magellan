import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NotificationText, NotificationWrapper } from './index.styled';
interface ILocationState {
  isRegistered?: boolean;
}

export enum NotificationType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export const Notification = ({
  text,
  type = NotificationType.SUCCESS,
}: {
  text?: string | null;
  type?: NotificationType;
}) => {
  const { t } = useTranslation('notificaton');
  const location = useLocation();
  const state = location.state as ILocationState;

  const registerSuccessTxt = t('register_success', 'Registration was successfull');
  const emailUsedTxt = t('email_already_used', 'Try again, this email has been already used');

  const notificatonTxt = state?.isRegistered ? registerSuccessTxt : state?.isRegistered === false && emailUsedTxt;

  if (text || notificatonTxt) {
    return (
      <NotificationWrapper>
        <NotificationText isError={!text ? !state?.isRegistered : type !== NotificationType.SUCCESS}>
          {text || notificatonTxt}
        </NotificationText>
      </NotificationWrapper>
    );
  }

  return null;
};
