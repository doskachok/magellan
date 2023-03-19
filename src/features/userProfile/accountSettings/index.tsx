import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import FileUploader, { IFileUploaderRef } from "components/FileUploader";
import { Avatar, AvatarSize, Button, Input } from "components";
import { Column, PageWrapper, Row } from "components/Containers";
import Header from "components/Header";
import { ROUTES } from "constants/routes";
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { userReceived, userSelector } from "features/auth/slice";
import { IUser, userToUpdateUser } from "types/userTypes";
import { getDownloadFileUrl } from "helpers/urlHelper";

import { AccountInfoWrapper, AccountSettingsBackground, ContentWrapper, MainInfoWrapper, SaveButtonWrapper } from "./index.styled";
import { useUpdateUserMutation } from "store/user.api";

const AccountSetttings = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoUploaderRef = useRef<IFileUploaderRef>();

  const user = useSelector(userSelector);

  const [form, setForm] = useState<IUser>({
    id: '',
    name: '',
    email: '',
    username: '',
    avatarId: '',
  });

  const [logoSrc, setLogoSrc] = useState<string | null>(getDownloadFileUrl(user?.avatarId));
  const [isLogoSelected, setIsLogoSelected] = useState<boolean>(false);

  const [updateUser, { data: updatedUser, isLoading: isUserUpdating }] = useUpdateUserMutation();

  const handleBackAction = useCallback(() => {
    navigate(ROUTES.GROUPS.ROOT, { replace: true });
  }, [navigate]);

  const onLogoSelected = useCallback((file: File, fileData: string) => {
    setLogoSrc(fileData);
    setIsLogoSelected(true);
  }, []);

  const onLogoUploaded = useCallback((fileId: string) => {
    updateUser(userToUpdateUser({ ...form, avatarId: fileId }));
  }, [form, updateUser]);

  const onFormSubmit = useCallback(() => {
    if (isLogoSelected) {
      logoUploaderRef!.current!.uploadFile();
    } else {
      updateUser(userToUpdateUser(form));
    }
  }, [form, updateUser, isLogoSelected]);

  const onInputTextChanged = useCallback((name: string, value: string) => {
    setForm((form) => ({
      ...form,
      [name]: value,
    }));
  }, [setForm]);

  useEffect(() => {
    if (updatedUser) {
      dispatch(userReceived(updatedUser));
    }
  }, [updatedUser, dispatch]);

  useEffect(() => {
    if (user) {
      setForm(() => ({
        ...user,
      }));
    }
  }, [user, setForm]);

  return (
    <PageWrapper>
      <Header
        text={t('accountSettings')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth>
        <MainInfoWrapper fullWidth>
          <AccountInfoWrapper gap={'2.5rem'} jc={'center'} fullWidth>
            <Row jc={'center'} fullWidth>
              <FileUploader
                ref={logoUploaderRef}
                onFileSelected={onLogoSelected}
                onFileUploaded={onLogoUploaded}>
                <Avatar
                  src={logoSrc}
                  framed={true}
                  rounded={true}
                  size={AvatarSize.Large}
                />
              </FileUploader>
            </Row>

            <Column fullWidth>
              <Row jc={'center'} fullWidth>
                <Input
                  reversedTheme
                  name={'email'}
                  displayName={t('email')}
                  disabled
                  value={form.email}
                  onTextChange={onInputTextChanged}
                />
              </Row>
              <Row jc={'center'} fullWidth>
                <Input
                  reversedTheme
                  name={'username'}
                  displayName={t('username')}
                  disabled
                  value={form.username}
                  onTextChange={onInputTextChanged}
                />
              </Row>
              <Row jc={'center'} fullWidth>
                <Input
                  reversedTheme
                  placeholder={t('name')}
                  name={'name'}
                  displayName={t('name')}
                  value={form.name}
                  onTextChange={onInputTextChanged}
                />
              </Row>
            </Column>
          </AccountInfoWrapper>

          <AccountSettingsBackground fullWidth>
          </AccountSettingsBackground>
        </MainInfoWrapper>

        <SaveButtonWrapper>
          <Button onClick={onFormSubmit} disabled={false}>
            {t('saveChanges')}
          </Button>
        </SaveButtonWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default AccountSetttings;