import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  memo,
  MutableRefObject,
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { FileUploaderWrapper, HiddenInput } from './index.styled';
import { useUploadFileMutation } from '../../store/storage.api';

export interface IFileUploaderProps {
  onFileUploaded: (fileId: string) => void;
  onFileSelected?: (file: File, fileData: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  children: ReactElement<any>;
  ref: MutableRefObject<any>;
};

export interface IFileUploaderRef {
  uploadFile: () => void;
}

const FileUploader = forwardRef(({ onFileUploaded, onFileSelected, onUploadingChange, children }: IFileUploaderProps, ref: ForwardedRef<unknown>) => {
  const uploaderId = useMemo(() => new Date().toString(), []);

  const [uploadFileToApi, { data: uploadedFileId, isLoading: isFileUploading }] = useUploadFileMutation();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useImperativeHandle(ref, () => ({
    uploadFile() {
      if (!uploadedFile) {
        return;
      }

      uploadFileToApi(uploadedFile);
    },
  } as IFileUploaderRef))

  useEffect(() => {
    if (!uploadedFileId || !uploadedFile) {
      return;
    }

    setUploadedFile(null);
    onFileUploaded(uploadedFileId.id);
  }, [uploadedFileId, uploadedFile, onFileUploaded]);

  useEffect(() => {
    onUploadingChange && onUploadingChange(isFileUploading);
  }, [onUploadingChange, isFileUploading])

  const onLogoChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target!.files![0];

    setUploadedFile(file);

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent) => {
      const fileData = (e.target as FileReader)!.result as string;

      onFileSelected && onFileSelected(file, fileData);
    };

    reader.readAsDataURL(file);
  }, [onFileSelected]);

  return (
    <FileUploaderWrapper>
      <label htmlFor={uploaderId}>
        {children}
      </label>
      <HiddenInput type="file" id={uploaderId} onChange={onLogoChanged} />
    </FileUploaderWrapper>
  );
});

export default memo(FileUploader);
