
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Row } from '../../../../components/Containers';
import { ITransactionGroup, ITransactionGroupListItem } from '../../types';
import {
  AddMembersWrapper,
  ContentWrapper,
  GroupCurrencyText,
  GroupDetailsBackground,
  GroupDetailsWrapper,
  GroupInfoWrapper,
  MainInfoWrapper,
  SaveButtonWrapper
} from './index.styled';
import { ReactComponent as AddAvatarSVG } from '../../../../assets/images/add-avatar.svg';
import { ReactComponent as ArrowRightSVG } from '../../../../assets/images/arrow-right.svg';
import Select from '../../../../components/Select';
import { TextUnderline } from '../../../../components/Text';
import currencies from '../../../../constants/currencies';
import { useCreateTransactionGroupMutation, useLazyGetTransactionGroupByIdQuery, useUpdateTransactionGroupMutation } from '../../api';
import Button from '../../../../components/Button';
import { requiredValidator } from '../../../auth/validation';
import Input from '../../../../components/Input';
import GroupMembers from '../group-members';

interface IValidation {
  name: boolean;
}

export interface IGroupDetailsProps {
  groupListItem?: ITransactionGroupListItem | null;
  onSaved: (group: ITransactionGroup) => void;
  isAddGroupMembersMode: boolean;
  onGroupMembersModeChange: (value: boolean) => void;
}

const GroupDetails = ({ groupListItem, onSaved, isAddGroupMembersMode, onGroupMembersModeChange }: IGroupDetailsProps) => {
  const { t } = useTranslation('groups');

  const [getGroupById] = useLazyGetTransactionGroupByIdQuery();
  const [createGroup, { data: createdGroup }] = useCreateTransactionGroupMutation();
  const [updateGroup, { data: updatedGroup }] = useUpdateTransactionGroupMutation();

  const [form, setForm] = useState<ITransactionGroup>({
    id: groupListItem?.id || '',
    name: groupListItem?.name || '',
    currencyCode: groupListItem?.currencyCode || currencies[0].value,
    ownerId: '',
    participants: [],
    transactions: []
  });

  const [validation, setValidation] = useState<IValidation>({
    name: false
  });

  const isDisabled = useMemo(() => Object.values(validation).some(el => !el), [validation]);

  const onValidationChange = useCallback((name: string, value: boolean) => {
    setValidation(validation => ({
      ...validation,
      [name]: value,
    }));
  }, []);

  const onFormSubmit = () => {
    form.id ? updateGroup(form) : createGroup(form);
  };

  useEffect(() => {
    if (createdGroup) {
      onSaved(createdGroup);
    }
  }, [createdGroup, onSaved]);

  useEffect(() => {
    if (updatedGroup) {
      onSaved(updatedGroup);
    }
  }, [updatedGroup, onSaved]);

  useEffect(() => {
    if (groupListItem) {
      getGroupById(groupListItem.id);
    }
  }, [groupListItem, getGroupById]);

  const onControlChange = useCallback((name: string, value: string) => {
    setForm(form => ({
      ...form,
      [name]: value,
    }));
  }, []);

  const onAddGroupMembersClick = useCallback(() => {
    onGroupMembersModeChange(true);
  }, [onGroupMembersModeChange]);

  return (
    <ContentWrapper fullWidth>
      <GroupDetailsWrapper hidden={isAddGroupMembersMode} fullWidth>
        <MainInfoWrapper fullWidth>
          <GroupInfoWrapper gap={'2.5rem'} jc={'center'} fullWidth>
            <Row jc={'center'} fullWidth>
              <AddAvatarSVG />
            </Row>

            <Row jc={'center'} fullWidth>
              <Input
                placeholder={t('groupName')}
                reversedTheme
                name={'name'}
                required
                value={form.name}
                validator={requiredValidator}
                onTextChange={onControlChange}
                onValidationChange={onValidationChange}
              />
            </Row>

            <Row jc={'space-between'} ai={'center'} fullWidth>
              <GroupCurrencyText>
                {t('mainCurrency')}
              </GroupCurrencyText>

              <Select
                options={currencies}
                required
                value={form.currencyCode}
                name={'currencyCode'}
                reversedTheme={true}
                onValueChanged={onControlChange}
              />
            </Row>
          </GroupInfoWrapper>

          <GroupDetailsBackground fullWidth>
          </GroupDetailsBackground>
        </MainInfoWrapper>

        {
          !!groupListItem &&
          <AddMembersWrapper gap={'0.5rem'} jc={'center'} ai={'center'} fullWidth>
            <TextUnderline onClick={onAddGroupMembersClick}>
              {t('addGroupMembers')}
            </TextUnderline>

            <ArrowRightSVG onClick={onAddGroupMembersClick} />
          </AddMembersWrapper>
        }

        <SaveButtonWrapper jc={'center'} fullWidth>
          <Button onClick={onFormSubmit} disabled={isDisabled}>
            {t('saveGroup')}
          </Button>
        </SaveButtonWrapper>
      </GroupDetailsWrapper>

      {
        isAddGroupMembersMode &&
        <GroupMembers groupId={form.id} />
      }
    </ContentWrapper>
  );
};

export default memo(GroupDetails);
