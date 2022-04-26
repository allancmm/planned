import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from 'react';
import { Loading, useLoading } from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import withLongJob from '../../../../../containers/general/longJob';
import { defaultExportMapService } from '../../../../../lib/context';
import BasicEntity from '../../../../../lib/domain/entities/basicEntity';
import ExportMapService from '../../../../../lib/services/exportMapService';
import { RightbarContext } from '../../../../general/sidebar/rightbarContext';
import {LongJobContainer, PanelBreak, PanelContainer, PanelTitleContent} from "../../../../general/sidebar/style";
import { InputText, Options } from "../../../../general";

interface ExportMapsWizardProps {
    exportMapService: ExportMapService;
}

const ExportMapsWizard = ({ exportMapService }: ExportMapsWizardProps) => {
    useEffect(() => {
        fetchMaps();
    }, []);

    const [loading, load] = useLoading();
    const { closeRightbar } = useContext(RightbarContext);
    const [maps, setMaps] = useState<BasicEntity[]>([]);
    const [map, setMap] = useState<BasicEntity>(new BasicEntity());
    const [fileName, setFileName] = useState<string>('');
    const [, job, displayJobLog, startPollingWithAction] = withLongJob();

    const canExport: boolean = useMemo(() =>
        map.value.length > 0 && job.status !== 'IN_PROGRESS'
        , [map.value, job.status]);

    const renderExportButton: boolean = useMemo(() =>
        job.status !== 'COMPLETED' && job.status !== 'WARNINGS'
        , [job.status]);

    const onMapChange = load(async (option: Options) => {
        const mapGuid = option.value;
        const m: BasicEntity = maps.filter((c) => c.value === mapGuid)[0] || new BasicEntity();
        setMap(m);
        setFileName(m.name);
    });

    const onExport = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        startPollingWithAction(() => exportMapService.exportMapData(fileName));
    });

    const onDownload = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        await exportMapService.getMapDataAsExcel(job, fileName);
        closeRightbar();
    });

    const fetchMaps = load(async () => {
        setMaps(await exportMapService.getMaps());
    });

    const optionsMap = useMemo( () =>
        [{ label: 'Select map', value: '' },
        ...maps.map((c: BasicEntity) => ({
                label: c.name,
                value: c.value,
            }))]
        , [maps] );

    return (
        <>
            <Loading loading={loading} />
            <PanelContainer>
                <PanelTitleContent>Export Map</PanelTitleContent>

                <PanelBreak />

                <InputText
                   type='select'
                   label='Map'
                   options={optionsMap}
                   onChange={onMapChange}
                   value={map.value}
                   required
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

ExportMapsWizard.defaultProps = {
    exportMapService: defaultExportMapService,
};

export default ExportMapsWizard;
