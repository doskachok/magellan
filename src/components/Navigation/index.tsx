import { NavigationStyled, Groups, Profile, AddExpense } from './index.styled';
import groups from '../../assets/images/groups-icon.svg'
import receipt from '../../assets/images/receipt-icon.svg'
import avatar from '../../assets/images/avatar-icon.svg'

interface Props {
  visible: boolean;
}

const Navigation = ({ visible }: Props) => {
  if (visible)
    return (
      <NavigationStyled>
        <Groups>
          <img src={groups} alt="Groups" />
        </Groups>

        <AddExpense>
          <img src={receipt} alt="AddExpense" />
        </AddExpense>

        <Profile>
          <img src={avatar} alt="Profile" />
        </Profile>
      </NavigationStyled>
    );
  return null;
}

export default Navigation;
