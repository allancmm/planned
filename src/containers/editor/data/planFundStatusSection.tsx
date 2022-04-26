import {format} from "date-fns";
import {Button, DateInput, Select} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {defaultEntitiesService} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import PlanFundStatus from '../../../lib/domain/entities/planFundStatus';
import EntityService from '../../../lib/services/entitiesService';
import DataTable, {DataTableColumn} from '../../general/dataTable/table';
import {ButtonDiv} from './style';
import {v4 as uuid} from 'uuid';

interface PlanFundStatusSectionProps {
    entityService: EntityService;
    planFundGuid: string;
    planFundStatus: PlanFundStatus[];
    isEditMode: boolean;
    updatePlanFundStatus(newPlanFundStatus: PlanFundStatus[]): void;
}

export const PlanFundStatusSection = ({ entityService, planFundGuid, planFundStatus, isEditMode, updatePlanFundStatus }: PlanFundStatusSectionProps) => {
    const [allPlanFundStatus, setAllPlanFundStatus] = useState<BasicEntity[]>([]);
    const STATUS_CODES = `AsCodeFundStatus`;
    useEffect(() => { entityService.getCodes(STATUS_CODES).then(setAllPlanFundStatus) }, []);

    const effectiveDateCell = (row: PlanFundStatus): React.ReactNode => {
        return isEditMode ? <DateInput selected={row.effectiveDate} onChange={(d) => onDateChange(row, d as Date, 'EFFECTIVE_DATE')} />
            : <div>{row.effectiveDate ? format(row.effectiveDate, 'yyyy-MM-dd') : ''}</div>;
    };

    const activeFromDateCell = (row: PlanFundStatus): React.ReactNode => {
        return isEditMode ? <DateInput selected={row.activeFromDate} onChange={(d) => onDateChange(row, d as Date, 'ACTIVE_FROM_DATE')} />
            : <div>{row.activeFromDate ? format(row.activeFromDate, 'yyyy-MM-dd') : ''}</div>;
    };

    const activeToDateCell = (row: PlanFundStatus): React.ReactNode => {
        return isEditMode ? <DateInput selected={row.activeToDate} onChange={(d) => onDateChange(row, d as Date, 'ACTIVE_TO_DATE')} />
            : <div>{row.activeToDate ? format(row.activeToDate, 'yyyy-MM-dd') : ''}</div>;
    };

    const expirationDateCell = (row: PlanFundStatus): React.ReactNode => {
        return isEditMode ? <DateInput selected={row.expirationDate} onChange={(d) => onDateChange(row, d as Date, 'EXPIRATION_DATE')} />
            : <div>{row.expirationDate ? format(row.expirationDate, 'yyyy-MM-dd') : ''}</div>;
    };

    const statusCodeCell = (row: PlanFundStatus): React.ReactNode => {
        return isEditMode ? <Select
            onChange={onStatusCodeChange(row)}
            options={allPlanFundStatus.map((c) => ({ label: c.name, value: c.value }))}
            emptySelectText={'Please Select'}
            value={row.statusCode}
            required
        /> : allPlanFundStatus.filter(s => s.value === row.statusCode).map(s => s.name);
    };

    const planFundColumns: DataTableColumn[] = [
        {name: 'Effective Date', selector: 'effectiveDate', cell: effectiveDateCell},
        {name: 'Active From Date', selector: 'activeFromDate', cell: activeFromDateCell},
        {name: 'Active To Date', selector: 'activeToDate', cell: activeToDateCell},
        {name: 'Expiration Date', selector: 'expirationDate', cell: expirationDateCell},
        {name: 'Status Code', selector: 'statusCode', cell: statusCodeCell}
    ];

    const onDateChange = (row: PlanFundStatus, date: Date, typeDate: string) => {
        const TabPlanFundStatus = planFundStatus.map(
            s => {
                if (s.planFundStatusGuid === row.planFundStatusGuid) {
                    switch(typeDate) {
                        case 'EFFECTIVE_DATE':
                            s.effectiveDate = date;
                            break;
                        case 'ACTIVE_FROM_DATE':
                            s.activeFromDate = date;
                            break;
                        case 'ACTIVE_TO_DATE':
                            s.activeToDate = date;
                            break;
                        case 'EXPIRATION_DATE':
                            s.expirationDate = date;
                            break;
                    }
                }
                return s;
            }
        )
        updatePlanFundStatus(TabPlanFundStatus);
    }

    const onStatusCodeChange = (row: PlanFundStatus) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const TabPlanFundStatus = planFundStatus.map(
            s => {
                if(s.planFundStatusGuid === row.planFundStatusGuid){
                    s.statusCode = e.target.value
                }
                return s;
            }
        )
        updatePlanFundStatus(TabPlanFundStatus);
    }

    const addStatusRow = () => {
        if (isEditMode) {
            updatePlanFundStatus(
                produce(planFundStatus, (draft) => {
                    const pfs = new PlanFundStatus();
                    pfs.planFundStatusGuid = uuid();
                    pfs.planFundGuid = planFundGuid;
                    pfs.isNewPlanFundStatus = true;
                    draft.push(pfs);
                }),
            );
        }
    };

    return (
        <DataTable
            columns={planFundColumns}
            data={planFundStatus}
            keyColumn={'planFundStatusGuid'}
            defaultSortColumn={'effectiveDate'}
            hasSearchBar={false}
            isEditMode={isEditMode}
            updateTable={updatePlanFundStatus}
            actions={
                <ButtonDiv>
                    <Button buttonType="tertiary" disabled={!isEditMode} onClick={addStatusRow}>
                        + Add Row
                    </Button>
                </ButtonDiv>
            }
        />
    );
};

PlanFundStatusSection.defaultProps = {
    entityService: defaultEntitiesService
};

export default PlanFundStatusSection;