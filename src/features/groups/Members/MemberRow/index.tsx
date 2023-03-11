import { memo } from 'react';
import { IUser } from 'types/userTypes';
import { TextRegular } from 'components/Text';
import { Wrapper } from './index.styled';
import { Avatar, AvatarSize } from 'components';
import { getDownloadFileUrl } from 'helpers/urlHelper';

export interface IProps {
  member: IUser;
  isSelected: boolean;
  onClick: (member: IUser) => void;
}

const MemberRow = ({ member, isSelected, onClick }: IProps) => {
  return (
    <Wrapper isSelected={isSelected} jc={'space-between'} ai={'center'} fullWidth onClick={() => onClick(member)}>
      <Avatar
        src={getDownloadFileUrl(member.avatarId)}
        rounded={true}
        size={AvatarSize.Small}
      />

      <TextRegular>
        {member.name || member.email}
      </TextRegular>

      <TextRegular>
        $0.0
      </TextRegular>
    </Wrapper>
  );
};

export default memo(MemberRow);