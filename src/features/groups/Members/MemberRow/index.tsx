import { memo } from 'react';
import { IUser } from 'types/userTypes';
import { TextRegular, UserListItem } from 'components';
import { Actions, Wrapper } from './index.styled';
import RemoveSVG from 'assets/images/remove-icon.svg?react';
import DeclineSVG from 'assets/images/decline-icon.svg?react';
import ApproveSVG from 'assets/images/check-icon.svg?react';
import { useTranslation } from 'react-i18next';

export interface IProps {
  member: IUser;
  isSelected: boolean;
  onClick: (member: IUser) => void;
  onRemove: (member: IUser) => void;
}

const MemberRow = ({ member, isSelected, onClick, onRemove }: IProps) => {
  const { t } = useTranslation('groups');

  return (
    <Wrapper isSelected={isSelected} fullWidth>
      <UserListItem 
        user={member}
        onClick={() => onClick(member)}
        rightItem={
        <>
          { !isSelected && 
            <Actions>
              <TextRegular>
                $0.0
              </TextRegular>
      
              <RemoveSVG onClick={() => onClick(member)} />
            </Actions> }
      
          { isSelected &&
            <Actions>
              <TextRegular>
                {t('removeMember')}
              </TextRegular>
      
              <ApproveSVG onClick={() => onRemove(member)} />
              <DeclineSVG onClick={() => onClick(member)} />
            </Actions> } 
          </>}
      />
    </Wrapper>
  );
};

export default memo(MemberRow);