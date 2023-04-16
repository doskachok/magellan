import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import FileUploader, { IFileUploaderRef } from "components/FileUploader";
import { Avatar, AvatarSize, Button, Input, TextUnderline } from "components";
import { Column, PageWrapper, Row } from "components/Containers";
import Header from "components/Header";
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as ArrowLeftSVG } from 'assets/images/arrow-left.svg';
import { logOut, userReceived, userSelector } from "features/auth/slice";
import { IUser, userToUpdateUser } from "types/userTypes";
import { getDownloadFileUrl } from "helpers/urlHelper";

import { AccountInfoWrapper, AccountSettingsBackground, BackgroundFiller, ContentWrapper, LogoutButton, MainInfoWrapper, SaveButtonWrapper } from "./index.styled";
import { useUpdateUserMutation } from "store/user.api";
import Loader from "components/Loader";
import toast from "react-hot-toast";

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
  const [isTextChanged, setIsTextChanged] = useState<boolean>(false);

  const [updateUser, { data: updatedUser, isLoading: isUserUpdating }] = useUpdateUserMutation();

  const handleBackAction = useCallback(() => {
    navigate(-1);
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

    setIsTextChanged(true);
  }, [setForm]);

  useEffect(() => {
    if (updatedUser) {
      dispatch(userReceived(updatedUser));

      setIsTextChanged(false);
      setIsLogoSelected(false);
      toast.success(t('profileSaved'));
    }
  }, [updatedUser, dispatch, t]);

  useEffect(() => {
    if (user) {
      setForm(() => ({
        ...user,
      }));
    }
  }, [user, setForm]);

  return (
    <>
      <PageWrapper>
        <Header
          text={t('accountSettings')}
          leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
        />

        <ContentWrapper fullWidth>
          <MainInfoWrapper fullWidth>
            <AccountInfoWrapper gap={'5px'} jc={'center'} fullWidth>
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

            <BackgroundFiller />
            <AccountSettingsBackground fullWidth>
            </AccountSettingsBackground>
          </MainInfoWrapper>

          <Row fullWidth jc={'center'}>
            <LogoutButton onClick={() => dispatch(logOut())}>
              <ArrowLeftSVG />
              <TextUnderline>
                {t('logout')}
              </TextUnderline>
            </LogoutButton>
          </Row>

          <SaveButtonWrapper>
            <Button onClick={onFormSubmit} disabled={(!isLogoSelected && !isTextChanged) || isUserUpdating}>
              {t('saveChanges')}
            </Button>
          </SaveButtonWrapper>
        </ContentWrapper>
      </PageWrapper>
      <Loader isLoading={isUserUpdating} />
    </>
  );
};

export default AccountSetttings;