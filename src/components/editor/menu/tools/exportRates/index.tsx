import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import { Loading, useLoading } from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import withLongJob from '../../../../../containers/general/longJob';
import { defaultRateService } from '../../../../../lib/context';
import BasicEntity from '../../../../../lib/domain/entities/basicEntity';
import RateService from '../../../../../lib/services/rateService';
import InputText, {Options} from '../../../../general/inputText';
import { RightbarContext } from '../../../../general/sidebar/rightbarContext';
import { LongJobContainer, PanelBreak, PanelContainer, PanelTitleContent} from "../../../../general/sidebar/style";

interface ExportRatesWizardProps {
    rateService: RateService;
}

const ExportRatesWizard = ({ rateService }: ExportRatesWizardProps) => {
    useEffect(() => {
        fetchRateGroups();
    }, []);

    const [loading, load] = useLoading();
    const { closeRightbar } = useContext(RightbarContext);
    const [rateGroups, setRateGroups] = useState<Options[]>([]);
    const [rateGroup, setRateGroup] = useState<Options>(new Options());
    const [, job, displayJobLog, startPollingWithAction] = withLongJob();

    const canExport: boolean = rateGroup.value.length > 0 && job.status !== 'IN_PROGRESS';
    const renderExportButton: boolean = !(job.status === 'COMPLETED' || job.status === 'WARNINGS');

    const onExport = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        startPollingWithAction(() => rateService.startJobForRateExcel(rateGroup.value));
    });

    const onDownload = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        await rateService.downloadRateExcel(job, rateGroup.label);
        closeRightbar();
    });

    const fetchRateGroups = load(async () => {
        const result :BasicEntity[] = await rateService.getRateGroups()
        setRateGroups(result.map(b => new Options(b.name, b.value)))
    });

    return (
        <>
            <Loading loading={loading} />
            <PanelContainer>
                <PanelTitleContent>Export Rates</PanelTitleContent>
                <PanelBreak />

                <InputText
                    type='select'
                    label="Rate Groups"
                    onChange={setRateGroup}
                    options={rateGroups}
                    searchable
                    numberOfItemsVisible={10}
                />

                {renderExportButton ?
                    <Button buttonType="primary" type="button" onClick={onExport} disabled={!canExport}>
                        Export
                    </Button> :
                    <Button type="submit" buttonType="secondary" onClick={onDownload}>
                        Download as Excel
                    </Button>
                }

                <LongJobContainer>{displayJobLog}</LongJobContainer>
            </PanelContainer>
        </>
    );
};

ExportRatesWizard.defaultProps = {
    rateService: defaultRateService,
};

export default ExportRatesWizard;