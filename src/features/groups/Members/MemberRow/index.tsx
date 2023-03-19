import { memo } from 'react';
import { IUser } from 'types/userTypes';
import { TextRegular } from 'components/Text';
import { MemberName, Wrapper } from './index.styled';
import { Avatar, AvatarSize } from 'components';
import { getDownloadFileUrl } from 'helpers/urlHelper';

export interface IProps {
  member: IUser;
  isSelected: boolean;
  onClick: (member: IUser) => void;
}

const MemberRow = ({ member, isSelected, onClick }: IProps) => {
  return (
    <Wrapper isSelected={isSelected} fullWidth onClick={() => onClick(member)}>
      <Avatar
        src={getDownloadFileUrl(member.avatarId)}
        rounded={true}
        size={AvatarSize.Small}
      />

      <MemberName>
        {member.name || member.email}
      </MemberName>

      <TextRegular>
        $0.0
      </TextRegular>
    </Wrapper>
  );
};

export default memo(MemberRow);