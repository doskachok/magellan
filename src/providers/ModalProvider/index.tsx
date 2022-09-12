import { createContext, ReactElement, useState, useContext, useCallback, ReactNode } from 'react';
import Modal from './Modal';

export interface IModalsContext {
  showModal: (modalContent: ReactElement<any>) => number;
  closeModal: (id: number) => void;
  deleteModal: (id: number) => void;
}

const ModalContext = createContext({} as IModalsContext);

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<{ [id: number]: { content: ReactElement<any>, show: boolean, onClose?: () => void } }>({});

  const showModal = useCallback((modalContent: ReactElement<any>, onClose?: () => void) => {
    const id = new Date().getTime();

    setModals(modals => ({
      ...modals,
      [id]: { content: modalContent, show: true, onClose: onClose }
    }));

    return id;
  }, [setModals]);

  const closeModal = useCallback((id: number) => {
    setModals(modals => {
      const modal = modals[id];

      return {
        ...modals,
        [id]: { ...modal, show: false }
      };
    });
  }, [setModals]);

  const deleteModal = useCallback((id: number) => {
    setModals(modals => {
      if (modals[id]) {
        modals[id].onClose && modals[id].onClose!();

        const { [id]: removed, ...rest } = modals;

        return rest;
      }

      return modals;
    });
  }, [setModals]);

  return (
    <ModalContext.Provider value={{ showModal, closeModal, deleteModal }}>
      {children}
      {Object.keys(modals).map(id =>
        <Modal id={+id} show={modals[+id].show} key={id}>{modals[+id].content}</Modal>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
export default ModalProvider;
