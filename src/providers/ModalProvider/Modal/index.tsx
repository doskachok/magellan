import {
  memo,
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
} from 'react';
import { useModal } from '..';

import { ModalBackground, ModalContainer, ModalContent } from './index.styled';

interface IProps {
  id: number,
  show: boolean,
  children: ReactElement<any>,
};

const Modal = ({ id, show, children }: IProps) => {
  const { deleteModal, closeModal } = useModal();

  useEffect(() => {
    if (!show) {
      const timer = setTimeout(() => {
        deleteModal(id);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [show, id, deleteModal]);

  const backgroundClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === `${id}`) {
      closeModal(id);
    }
  }, [closeModal, id]);

  return (
    <ModalBackground id={`${id}`} show={show} onClick={(e) => backgroundClick(e)}>
      <ModalContainer>
        <ModalContent show={show}>
          {children}
        </ModalContent>
      </ModalContainer>
    </ModalBackground>
  );
};

export default memo(Modal);
