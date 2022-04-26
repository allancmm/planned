import React, { useEffect, useState } from 'react';
import MonacoContainer from "../monaco/monaco";
import { toast } from "react-toastify";
import { Button } from "@equisoft/design-elements-react";
import { useLayoutWithId, useTabWithId } from "../../../components/editor/tabs/tabContext";
import { Loading, useLoading, WindowContainer } from "equisoft-design-ui-elements";
import SystemFileSession from "../../../lib/domain/entities/tabData/systemFileSession";
import { Actions, FileHeaderSection } from "../../../components/editor/fileHeader/style";
import { defaultSystemFileService } from "../../../lib/context";
import SystemFileService from "../../../lib/services/systemFileService";
import { SystemFileEnum } from "../../../lib/domain/enums/systemFileType";

interface SystemFileProps {
    tabId: string,
    layoutId: number,
    systemFileService: SystemFileService
}

const SystemFile = ({ tabId, layoutId, systemFileService } : SystemFileProps) => {
    const tab = useTabWithId(tabId);
    const layout = useLayoutWithId(layoutId);

    const { data } = tab;

    if (!(data instanceof SystemFileSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { codeSystemFile } = data;

    const [ loading, load ] = useLoading();

    const [ dataSystemFile, setDataSystemFile ] = useState('');
    const [ isShow, setIsShow ] = useState(false);
    const [ hasError, setHasError ] = useState(false);

    const fetchSystemFile = () => {
        load(async () => {
            try {
                setDataSystemFile(await systemFileService.getSystemFile(codeSystemFile));
            }
            catch {
                setHasError(true);
            }
            finally {
                setIsShow(true);
            }

        })();
    };

    useEffect(() => {
        fetchSystemFile();
    }, []);

    const saveSystemFile = load(async () => {
        const dataSystemFileValue = layout.editorInstance[0].getValue();
        await systemFileService.updateSystemFile(codeSystemFile, dataSystemFileValue);
        toast.success('File updated successfully');
    });

    const Header = (
        <>
            <FileHeaderSection>{SystemFileEnum.getEnumFromCode(codeSystemFile).value }</FileHeaderSection>
            <FileHeaderSection>
                <Actions>
                    <Button buttonType="primary" label="Save" onClick={saveSystemFile } disabled={hasError} />
                </Actions>
            </FileHeaderSection>
        </>
    );

    return(
        <WindowContainer>
            <Loading loading={loading} />
            {isShow &&
                <MonacoContainer
                    tabId={tabId}
                    layoutId={layoutId}
                    header={Header}
                    readOnly={false}
                    defaultValue={dataSystemFile}
                />
            }
        </WindowContainer>
    );
}

SystemFile.defaultProps = {
   systemFileService: defaultSystemFileService
};

export default SystemFile;