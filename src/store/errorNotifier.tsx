import {useSnackbar} from 'notistack';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from './index';

const ErrorNotifier = () => {
  const dispatch = useDispatch();
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const {notifications = [], prevCount = 0} =  useSelector((state: RootState) => state.errors);

  useEffect(() => {
    if (notifications.length > prevCount) {
      const {message, key} = notifications[notifications.length - 1];
      enqueueSnackbar(message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        key: key,
      })
    }
  }, [closeSnackbar, dispatch, enqueueSnackbar, notifications, prevCount]);

  return null;
};

export default ErrorNotifier;
