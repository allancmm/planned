import React, {ChangeEvent, MouseEvent, useContext, useState} from 'react';
import { Loading, useLoading } from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import withLongJob from '../../../../../containers/general/longJob';
import { defaultImportSecurityGroupsService } from '../../../../../lib/context';
import {SecurityGroupDataTypeEnum} from '../../../../../lib/domain/enums/securityGroupDataType';
import ImportSecurityGroupsService from '../../../../../lib/services/importSecurityGroupsService';
import InputText from '../../../../general/inputText';
import { RightbarContext } from '../../../../general/sidebar/rightbarContext';
import { LongJobContainer, PanelBreak, PanelContainer, PanelTitleContent } from "../../../../general/sidebar/style";

interface ImportSecurityGroupsWizardProps {
    importSecurityGroupsService: ImportSecurityGroupsService;
}

const ImportSecurityGroupsWizard = ({ importSecurityGroupsService }: ImportSecurityGroupsWizardProps) => {
    const [loading, load] = useLoading();
    const { closeRightbar } = useContext(RightbarContext);

    const [file, setFile] = useState<Blob>(new Blob());
    const [, job, displayJobLog, startPollingWithAction] = withLongJob();

    const canImport: boolean = job.status !== 'IN_PROGRESS' && file.size !== 0;
    const renderImportButton: boolean = !(job.status === 'COMPLETED' || job.status === 'WARNINGS');

    const onImport = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        startPollingWithAction(() =>
            importSecurityGroupsService.importSecurityGroupsData(file,
                SecurityGroupDataTypeEnum.getType('ALL'),
                {securityGroupGuid: 'All Security Groups', securityGroupName: 'All Security Groups'}));
    });

    const onFileUpload = load(async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const f: Blob = e.target.files[0];
            setFile(f);
        }
    });

    const onClose = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        closeRightbar();
    };

    return (
        <>
            <Loading loading={loading} />
            <PanelContainer>
                <PanelTitleContent>Import Security Groups</PanelTitleContent>
                <PanelBreak/>

                <InputText type='file' onChange={onFileUpload} />

                {renderImportButton ?
                    <Button buttonType="primary" type="button" onClick={onImport} disabled={!canImport}>
                        Import
                    </Button> :
                    <Button type="submit" buttonType="secondary" onClick={onClose}>
                        Close
                    </Button>
                }

                <LongJobContainer>{displayJobLog}</LongJobContainer>

            </PanelContainer>
        </>
    );
};

ImportSecurityGroupsWizard.defaultProps = {
    importSecurityGroupsService: defaultImportSecurityGroupsService,
};

export default ImportSecurityGroupsWizard;
