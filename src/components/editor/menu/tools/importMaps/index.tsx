import React, {ChangeEvent, MouseEvent, useContext, useMemo, useState} from 'react';
import { Loading, useLoading } from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import withLongJob from '../../../../../containers/general/longJob';
import { defaultImportMapService } from '../../../../../lib/context';
import ImportMapService from '../../../../../lib/services/importMapService';
import { InputText, Options } from '../../../../general';
import { RightbarContext } from '../../../../general/sidebar/rightbarContext';
import { LongJobContainer, PanelBreak, PanelContainer, PanelTitleContent} from "../../../../general/sidebar/style";

interface ImportMapsWizardProps {
    importMapService: ImportMapService;
}

const ImportMapsWizard = ({ importMapService }: ImportMapsWizardProps) => {
    const [loading, load] = useLoading();
    const { closeRightbar } = useContext(RightbarContext);

    const [file, setFile] = useState<Blob>(new Blob());
    const [mapName, setMapName] = useState<string>('');
    const [mapNames, setMapNames] = useState<string[]>([]);
    const [, job, displayJobLog, startPollingWithAction] = withLongJob();

    const canImport: boolean = mapName?.length > 0 && job.status !== 'IN_PROGRESS';
    const renderImportButton: boolean = !(job.status === 'COMPLETED' || job.status === 'WARNINGS');

    const onMapChange = load(async (o: Options) => {
        setMapName(o.value);
    });

    const onImport = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        startPollingWithAction(() => importMapService.importMapData(file, mapName));
    });

    const optionsMap = useMemo(() => [{ label: 'Select map', value: ''}, ...mapNames.map((mn: string) => ({
        label: mn,
        value: mn,
    }))], [mapNames]);

    const onFileUpload = load(async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const f: Blob = e.target.files[0];
            setFile(f);
            const tabNames: string[] = await importMapService.extractTabNames(f);
            setMapNames(tabNames);
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
                <PanelTitleContent>Import Map</PanelTitleContent>

                <PanelBreak/>

                <InputText type='file' onChange={onFileUpload} />

                <InputText
                    type='select'
                    label="Map"
                    onChange={onMapChange}
                    options={optionsMap}
                    value={mapName}
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

ImportMapsWizard.defaultProps = {
    importMapService: defaultImportMapService,
};

export default ImportMapsWizard;
