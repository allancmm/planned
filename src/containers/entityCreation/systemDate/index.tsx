import {CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import React, {FormEvent, useContext, useEffect, useState} from 'react';
import InputText, {Options} from '../../../components/general/inputText';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultEntitiesService} from '../../../lib/context';
import CreateSystemDateRequest from '../../../lib/domain/entities/createSystemDateRequest';
import EntityService from '../../../lib/services/entitiesService';
import FrameworkComponent from "../frameworkComponent";

const range = (start:number, end: number) => {
    return [...Array(end - start).keys()].map(i => i + start);
}

const years = [{label: 'Select one', value: ''}, ...range(1950, 2101).map( i => ({value: i.toString(), label: i.toString()}))];

interface SystemDateCreationProps {
    entityService: EntityService,
    callback() : void
}

const SystemDateCreationWizard = ({ entityService, callback }: SystemDateCreationProps) => {
    const [loading, load] = useLoading();
    const { closeRightbar } = useContext(RightbarContext);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [calendarCodes, setCalendarCodes] = useState<Options[]>([]);
    const [selectedCalendarCode, setSelectedCalendarCode] = useState<string>('');

    const fetchCalendarCodes = load( async() => {
        const codes = await entityService.getCalendarCodes()
        setCalendarCodes([{label: 'Select one', value: ''},...codes.map( c => new Options(c.longDescription, c.value))])
    });

    useEffect(() => {
        fetchCalendarCodes();
    }, []);


    const createSystemDate = load(async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const request = new CreateSystemDateRequest()
        request.year = selectedYear
        request.calendarCode = selectedCalendarCode
        await entityService.createSystemDate(request);
        typeof callback === 'function' && callback();
    })

    return (
        <>
            <FrameworkComponent title='Create System Dates' loading={loading} onSubmit={createSystemDate} onCancel={closeRightbar} >
                <CollapseContainer title={'General'} defaultOpened>
                    <PanelSectionContainer>
                        <InputText
                            label="Year"
                            value={selectedYear}
                            options={years}
                            type='custom-select'
                            onChange={(e: Options) => setSelectedYear(e.value)}
                        />
                        <InputText
                            label="Calendar Code"
                            value={selectedCalendarCode}
                            options={calendarCodes}
                            type='custom-select'
                            onChange={(e: Options) => setSelectedCalendarCode(e.value)}
                        />
                    </PanelSectionContainer>
                </CollapseContainer>
            </FrameworkComponent>
        </>
    );
};

SystemDateCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
};

export default SystemDateCreationWizard;