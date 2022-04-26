import { Loading, Select, SelectOption, TextInput, useLoading } from 'equisoft-design-ui-elements';
import React, { ChangeEvent, useContext, useState } from 'react';
import { ActionButton, FieldWrapper } from '../../../components/editor/menu/tools/style';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelTitle } from '../../../components/general/sidebar/style';
import { defaultDataDictionaryService } from '../../../lib/context';
import DataDictionaryService from '../../../lib/services/dataDictionaryService';
import withLongJob from '../../general/longJob';
import {  Button } from "@equisoft/design-elements-react";

const ExportDataDictionaryTypeOptions: SelectOption[] = [
    {
        label: 'Release',
        value: 'release',
    },
    {
        label: 'Snapshot',
        value: 'snapshot',
    },
];

interface ExportDDcProps {
    dataDictionaryService: DataDictionaryService;
}

const ExportDataDictionaryWizard = ({ dataDictionaryService }: ExportDDcProps) => {
    const [fileName, setFileName] = useState<string>('');
    const [exportType, setExportType] = useState<string>('');
    const [loading, load] = useLoading();
    const [, job, displayJobLog, startPollingWithAction] = withLongJob();
    const renderExportButton: boolean = !(job.status === 'COMPLETED' || job.status === 'WARNINGS');
    const { closeRightbar } = useContext(RightbarContext);

    const handleSelectExportType = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setExportType(e.target.value);
    };

    const exportDataDictionary = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation();
        e.preventDefault();
        startPollingWithAction(() => dataDictionaryService.export(fileName, exportType));
    });

    const onDownload = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        await dataDictionaryService.getDataDictionaryAsExcel(job, fileName);
        closeRightbar();
    });

    return (
        <>
            <Loading loading={loading} />
            <PanelTitle>{'Export Data Dictionary'}</PanelTitle>
            <FieldWrapper>
                <TextInput label="File name: " value={fileName} onChange={(e) => setFileName(e.target.value)} />

                <Select
                    label="Export Type:"
                    emptySelectText="Select One"
                    options={ExportDataDictionaryTypeOptions}
                    required
                    value={exportType}
                    onChange={handleSelectExportType}
                />

                <div>
                    {displayJobLog}
                    {!renderExportButton && (
                        <Button type="submit" buttonType="secondary" onClick={onDownload}>
                            Download as Excel
                        </Button>
                    )}
                </div>
            </FieldWrapper>

            {exportType.length > 0 && fileName.length > 0 && renderExportButton && (
                <ActionButton>
                    <Button buttonType="primary" onClick={exportDataDictionary}>
                        Export
                    </Button>
                </ActionButton>
            )}
        </>
    );
};

ExportDataDictionaryWizard.defaultProps = {
    dataDictionaryService: defaultDataDictionaryService,
};

export default ExportDataDictionaryWizard;
