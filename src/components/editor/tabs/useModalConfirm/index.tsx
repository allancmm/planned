import React, { useContext, useMemo } from 'react';
import { TabContext, useTabActions } from '../tabContext';
import { ModalDialog } from '../../../general';
import { CLOSE } from '../tabReducerTypes';

const STANDARD_MESSAGE = 'Do you want to save it before closing the tab?';

const useModalConfirm = (onConfirm: Function, tabId: string, layoutId: number, bodyMessage= STANDARD_MESSAGE) => {
    const { useConfirmClose: { isModalOpen, closeModal } } = useContext(TabContext);
    const dispatch = useTabActions();

    const close = () => {
        closeModal();
        dispatch({ type: CLOSE, payload: { id: tabId, layoutId } });
    }

    const propsModal = useMemo(() => ({
        isOpen: isModalOpen,
        confirmButton: {
            label: 'Save and close',
            onConfirm: async () => {
                await onConfirm();
                close();
            },
        },
        cancelButton: {
            label: 'Close without saving',
            onCancel: close
        },
        onRequestClose: closeModal
    }), [isModalOpen]);

    return {
       ModalConfirm: () => <ModalDialog {...propsModal}><>{bodyMessage}</></ModalDialog>
    }
}

export default useModalConfirm;