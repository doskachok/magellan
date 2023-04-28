import React, {
  memo,
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
} from 'react';
import { useModal } from '..';

import { ModalBackground, ModalContainer, ModalContent } from './index.styled';

export interface IModalForm {
  close?: () => void;
}

interface IProps {
  id: number,
  show: boolean,
  children: ReactElement<IModalForm>,
};

const backgroundId = (modalId: number) => `b-${modalId}`;
const containerId = (modalId: number) => `c-${modalId}`;

const Modal = ({ id, show, children }: IProps) => {
  const { deleteModal, closeModal } = useModal();

  useEffect(() => {
    if (!show) {
      const timer = setTimeout(() => {
        deleteModal(id);
      }, 300); // Time needed to finish modal closing animation

      return () => clearTimeout(timer);
    }
  }, [show, id, deleteModal]);

  const backgroundClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const targetId = (event.target as HTMLDivElement).id;

    if (targetId === backgroundId(id) ||
      targetId === containerId(id)) {
      closeModal(id);
    }
  }, [closeModal, id]);

  const childrenWithProps = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a
    // typescript error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { close: () => closeModal(id) });
    }
    return child;
  });

  return (
    <ModalBackground id={backgroundId(id)} show={show} onClick={backgroundClick}>
      <ModalContainer id={containerId(id)} onClick={backgroundClick}>
        <ModalContent show={show}>
          {childrenWithProps}
        </ModalContent>
      </ModalContainer>
    </ModalBackground>
  );
};

export default memo(Modal);
