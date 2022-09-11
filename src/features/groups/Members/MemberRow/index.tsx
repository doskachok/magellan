import { memo } from 'react';
import { IUser } from '../../../../types/user-types';
import UserRow from '../UserRow';
import { TextRegular } from '../../../../components/Text';
import { Wrapper } from './index.styled';

export interface IProps {
  member: IUser;
  isSelected: boolean;
  onClick: (member: IUser) => void;
}

const MemberRow = ({ member, isSelected, onClick }: IProps) => {
  return (
    <Wrapper isSelected={isSelected} jc={'space-between'} ai={'center'} fullWidth onClick={() => onClick(member)}>
      <UserRow user={member} />

      <TextRegular>
        $0.0
      </TextRegular>
    </Wrapper>
  );
};

export default memo(MemberRow);
