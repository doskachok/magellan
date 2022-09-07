import { BottomNavigationStyled, Groups, Profile, AddExpense } from './index.styled';
import { useNavigate } from 'react-router-dom';
import groups from '../../assets/images/groups-icon.svg'
import receipt from '../../assets/images/receipt-icon.svg'
import avatar from '../../assets/images/avatar-icon.svg'
import { ROUTES } from '../../constants/routes';

interface Props {
  visible: boolean;
}

const BottomNavigation = ({ visible }: Props) => {
  const navigate = useNavigate();

  if (visible)
    return (
      <BottomNavigationStyled>
        <Groups onClick={() => navigate(ROUTES.GROUPS.ROOT)}>
          <img src={groups} alt="Groups" />
        </Groups>

        <AddExpense>
          <img src={receipt} alt="AddExpense" />
        </AddExpense>

        <Profile>
          <img src={avatar} alt="Profile" />
        </Profile>
      </BottomNavigationStyled>
    );
  return null;
}

export default BottomNavigation;