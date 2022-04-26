import produce, { Draft } from 'immer';
import React from 'react';
import { toast } from 'react-toastify';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA, MONACO_DISPOSE } from '../../../components/editor/tabs/tabReducerTypes';
import HistoryDocument from '../../../lib/domain/entities/tabData/historyDocument';
import MonacoDiff from '../monaco/monacoDiff';
import HistoryHeader from './historyHeader';

interface HistoryTabProps {
    tabId: string;
    layoutId: number;
}

const HistoryTab = ({ tabId, layoutId }: HistoryTabProps) => {
    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);
    const { data } = tab;

    if (!(data instanceof HistoryDocument)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const editHistoryDocument = (recipe: (draft: Draft<HistoryDocument>) => void, dispose: boolean = false) => {
        if (dispose) dispatch({ type: MONACO_DISPOSE, payload: { layoutId, dispose: 'all' } });
        dispatch({ type: EDIT_TAB_DATA, payload: { tabId, data: produce(data, recipe) } });
    };

    return (
        <MonacoDiff
            tabId={tabId}
            layoutId={layoutId}
            defaultValueOriginal={data.leftXml}
            defaultValueModified={data.rightXml}
            readOnly
            header={<HistoryHeader tabId={tabId} editHistoryDocument={editHistoryDocument} />}
        />
    );
};

export default HistoryTab;
