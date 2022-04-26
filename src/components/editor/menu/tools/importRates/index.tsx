import { Loading, useLoading } from 'equisoft-design-ui-elements';
import React, {ChangeEvent, MouseEvent, useContext, useMemo, useState} from 'react';
import { Button } from "@equisoft/design-elements-react";
import withLongJob from '../../../../../containers/general/longJob';
import { defaultImportRateService } from '../../../../../lib/context';
import ImportRateService from '../../../../../lib/services/importRateService';
import { InputText, Options } from '../../../../general';
import { RightbarContext } from '../../../../general/sidebar/rightbarContext';
import { LongJobContainer, PanelBreak, PanelContainer, PanelTitleContent } from "../../../../general/sidebar/style";

interface ImportRatesWizardProps {
    importRateService: ImportRateService;
}

const ImportRatesWizard = ({ importRateService }: ImportRatesWizardProps) => {
    const [loading, load] = useLoading();
    const { closeRightbar } = useContext(RightbarContext);

    const [file, setFile] = useState<Blob>(new Blob());
    const [rateDescription, setRateDescription] = useState<string>('');
    const [rateDescriptions, setRateDescriptions] = useState<string[]>([]);
    const [, job, displayJobLog, startPollingWithAction] = withLongJob();

    const canImport: boolean = rateDescription?.length > 0 && job.status !== 'IN_PROGRESS';
    const renderImportButton: boolean = !(job.status === 'COMPLETED' || job.status === 'WARNINGS');

    const onRateChange = load(async (o: Options) => {
        setRateDescription(o.value);
    });

    const onImport = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        startPollingWithAction(() => importRateService.importRateData(file, rateDescription));
    });

    const rateOptions = useMemo(() =>
        [ {label: 'Select rate group', value: ''},
            ...rateDescriptions.map((mn: string) => ({ label: mn, value: mn }))], [rateDescriptions]);

    const onFileUpload = load(async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const f: Blob = e.target.files[0];
            setFile(f);
            const tabNames: string[] = await importRateService.extractTabNames(f);
            setRateDescriptions(tabNames);
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
                <PanelTitleContent>Import Rates</PanelTitleContent>
                <PanelBreak />

                <InputText type='file' onChange={onFileUpload} />

                <InputText
                    type='select'
                    label="Rate"
                    onChange={onRateChange}
                    options={rateOptions}
                    value={rateDescription}
                    required
                />

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

ImportRatesWizard.defaultProps = {
    importRateService: defaultImportRateService,
};

export default ImportRatesWizard;
