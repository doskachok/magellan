import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import toast from 'react-hot-toast';
import {RootState} from './index';

const ErrorNotifier = () => {
  const dispatch = useDispatch();
  const {notifications = [], prevCount = 0} =  useSelector((state: RootState) => state.errors);

  useEffect(() => {
    if (notifications.length > prevCount) {
      const notificationsNumberToShow = notifications.length - prevCount;
      const newNotifications = notifications.slice(-notificationsNumberToShow);
      
      newNotifications.forEach(({message}) => toast.error(message));
    }
  }, [dispatch, notifications, prevCount]);

  return null;
};

export default ErrorNotifier;
