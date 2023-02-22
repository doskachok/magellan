import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Column, Row } from 'components/Containers';
import Loader from 'components/Loader';

import {
  GroupCurrencyText,
  GroupEditBackground,
  GroupInfoWrapper,
  MainInfoWrapper,
  SaveButtonWrapper
} from './index.styled';

import FileUploader, { IFileUploaderRef } from 'components/FileUploader';
import { Avatar, AvatarSize, Button, Input, Select } from 'components';
import { requiredValidator } from 'features/auth/validation';
import currencies from 'constants/currencies';
import { useCreateTransactionGroupMutation, useUpdateTransactionGroupMutation } from '../api';
import { ITransactionGroup } from '../types';
import { saveGroup } from '../slice'
import { getDownloadFileUrl } from 'helpers/urlHelper';

import { ROUTES } from 'constants/routes';

interface IProps {
  group: ITransactionGroup | undefined;
}

interface IValidation {
  name: boolean;
}

const Form = ({ group }: IProps) => {
  const { t } = useTranslation('groups');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoUploaderRef = useRef<IFileUploaderRef>();

  const [createGroup, { data: createdGroup, isLoading: isGroupCreating }] = useCreateTransactionGroupMutation();
  const [updateGroup, { data: updatedGroup, isLoading: isGroupUpdating }] = useUpdateTransactionGroupMutation();

  const [form, setForm] = useState<ITransactionGroup>({
    id: '',
    name: '',
    currencyCode: currencies[0].value,
    ownerId: '',
    participants: [],
    transactions: [],
  });

  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isLogoSelected, setIsLogoSelected] = useState<boolean>(false);
  const [isLogoUploading, setIsLogoUploading] = useState<boolean>(false);

  const [validation, setValidation] = useState<IValidation>({
    name: false
  });

  const isSaveButtonDisabled = useMemo(() => Object.values(validation).some(el => !el), [validation]);

  const onValidationChange = useCallback((name: string, value: boolean) => {
    setValidation(validation => ({
      ...validation,
      [name]: value,
    }));
  }, []);

  const onControlChange = useCallback((name: string, value: string) => {
    setForm(form => ({
      ...form,
      [name]: value,
    }));
  }, []);

  const onFormSubmit = useCallback(() => {
    if (isLogoSelected) {
      logoUploaderRef!.current!.uploadFile();
    } else {
      form.id ? updateGroup(form) : createGroup(form);
    }
  }, [form, updateGroup, createGroup, isLogoSelected]);

  const onLogoSelected = useCallback((file: File, fileData: string) => {
    setLogoSrc(fileData);
    setIsLogoSelected(true);
  }, []);

  const onLogoUploadingChanged = useCallback((isUploading: boolean) => {
    setIsLogoUploading(isUploading);
  }, []);

  const onLogoUploaded = useCallback((fileId: string) => {
    const formToSave = {
      ...form,
      avatarId: fileId,
    };

    formToSave.id ? updateGroup(formToSave) : createGroup(formToSave);
  }, [form, updateGroup, createGroup]);

  useEffect(() => {
    const newGroup = createdGroup ? createdGroup : updatedGroup ? updatedGroup : null;
    
    if (newGroup) {
      dispatch(saveGroup(newGroup));
      navigate(ROUTES.GROUPS.ROOT, { replace: true });
    }
  }, [createdGroup, updatedGroup, dispatch, navigate]);
  
  useEffect(() => {
    if (group) {
      setForm((form) => ({
        ...form,
        ...group,
      }));
      setLogoSrc(getDownloadFileUrl(group.avatarId));
    }
  }, [group, setForm]);
  
  return (
    <>
      <Column fullWidth>
        <MainInfoWrapper fullWidth>
          <GroupInfoWrapper gap={'2.5rem'} jc={'center'} fullWidth>
            <Row jc={'center'} fullWidth>
              <FileUploader
                ref={logoUploaderRef}
                onFileSelected={onLogoSelected}
                onFileUploaded={onLogoUploaded}
                onUploadingChange={onLogoUploadingChanged}>
                <Avatar
                  src={logoSrc}
                  framed={true}
                  rounded={true}
                  size={AvatarSize.Large}
                />
              </FileUploader>
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

          <GroupEditBackground fullWidth>
          </GroupEditBackground>
        </MainInfoWrapper>

        <SaveButtonWrapper jc={'center'} fullWidth>
          <Button onClick={onFormSubmit} disabled={isSaveButtonDisabled}>
            {t('saveGroup')}
          </Button>
        </SaveButtonWrapper>
      </Column>

      <Loader isLoading={isLogoUploading || isGroupCreating || isGroupUpdating}/>
    </>
  );
};

export default Form;
