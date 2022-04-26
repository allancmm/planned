import {Button, Dialog, DialogProps, TextInput, useDialog, WindowContainer} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {useCallback, useContext, useState} from 'react';
import { Actions, FileHeaderSection } from '../../../../components/editor/fileHeader/style';
import { TabLoadingContext, useTabActions, useTabWithId } from '../../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA } from '../../../../components/editor/tabs/tabReducerTypes';
import MonacoContainer from '../../../../containers/editor/monaco/monaco';
import { defaultGenerateXmlService } from '../../../../lib/context';
import GenericDataFileSession from '../../../../lib/domain/entities/tabData/genericDataFileSession';
import GenerateXmlService from '../../../../lib/services/generateXmlService';

interface GenericXmlTabProps {
    tabId: string;
    layoutId: number;
    generateXmlService: GenerateXmlService;
}

const GenericXmlTab = ({ tabId, layoutId, generateXmlService }: GenericXmlTabProps) => {
    const dispatch = useTabActions();

    const { model, data } = useTabWithId(tabId);
    const session = data as GenericDataFileSession;

    const { load } = useContext(TabLoadingContext);

    const [show, toggle] = useDialog();
    const [dataFileName, setDataFileName] = useState('');

    const saveDataFile = load(async () => {
        const xml = model[0]?.getValue() ?? '';
        await generateXmlService.saveDataFile(
            session.fileGuid,
            dataFileName,
            session.entityLevel,
            xml,
            session.newFile
        );
        toggleSavedStatus(true);
    });

    const toggleSavedStatus = (b: boolean) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(session, (draft) => {
                    draft.saved = b;
                    draft.newFile = false;
                }),
            },
        });
    };

    const handleClickSave = () => {
        session.newFile ? toggle() : saveDataFile();
    };

    const closeDialog = () => {
        toggle();
        setDataFileName('');
    };

    const saveDialogProps = (): DialogProps => {
        const baseProps = {
            show,
            onClose: closeDialog,
            element: null,
            title: 'Save New DataFile',
            closeOnConfirm: true
        };
        return {
            ...baseProps,
               element:
                   <TextInput
                        type="text"
                        onChange={(e) => setDataFileName(e.target.value)}
                        value={dataFileName}
                        label="DataFile Name"
                        placeholder="Enter DataFile name ..."
                    />,
            confirmPanel: true,
            onConfirm: () => {
                saveDataFile();
            }
        };
    };

    const Header = (
        <>
            <FileHeaderSection>{session.fileGuid}</FileHeaderSection>
            <FileHeaderSection>
                <div>
                    Status:{' '}
                    <span style={{ color: session.saved ? 'green' : 'red' }}>
                        {session.saved ? 'Saved' : 'Not Saved'}
                    </span>
                </div>
                <Actions>
                    <Button buttonType="primary" type="button" label="Save" onClick={handleClickSave} />
                </Actions>
            </FileHeaderSection>
        </>
    );

    return (
        <WindowContainer>
            <MonacoContainer
                tabId={tabId}
                layoutId={layoutId}
                defaultValue={session.xmlData}
                header={Header}
                onChangeContent={useCallback(() => toggleSavedStatus(false), [toggleSavedStatus])}
            />
            <Dialog {...saveDialogProps()} />
        </WindowContainer>
    );
};

GenericXmlTab.defaultProps = {
    generateXmlService: defaultGenerateXmlService,
};

export default GenericXmlTab;
