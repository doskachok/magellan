import { memo } from 'react';
import { IUser } from 'types/userTypes';
import { TextHint, TextRegular } from 'components/Text';
import { Actions, Identification, Wrapper } from './index.styled';
import { Avatar, AvatarSize } from 'components';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import { ReactComponent as RemoveSVG } from 'assets/images/remove-icon.svg';
import { ReactComponent as DeclineSVG } from 'assets/images/decline-icon.svg';
import { ReactComponent as ApproveSVG } from 'assets/images/check-icon.svg';
import { useTranslation } from 'react-i18next';
import { Column } from 'components/Containers';

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
      <Identification>
        <Avatar
          src={getDownloadFileUrl(member.avatarId)}
          rounded={true}
          size={AvatarSize.Small}
        />

        <Column gap='3px'>
          <TextRegular>
            {member.name || member.username}
          </TextRegular>
          <TextHint>
            {member.email}
          </TextHint>
        </Column>
      </Identification>

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
    </Wrapper>
  );
};

export default memo(MemberRow);