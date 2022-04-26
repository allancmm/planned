import React from 'react';
import { InputText, Options } from "../../../components/general";
import {SelectWrapper} from './style';

interface FilterMigrationSetsProps {
    activeFilter: ActiveFilter;
    setActiveFilter(f: ActiveFilter): void;
}

export const ActiveFilters = [
    { label: 'All', value: 'ALL_MIGRATION_SETS' },
    { label: 'Ready to migrate', value: 'READY_TO_MIGRATE_MIGRATION_SETS' },
    { label: 'Sent', value: 'SENT_MIGRATION_SETS' },
    { label: 'Received', value: 'RECEIVED_MIGRATION_SETS' }
];

export type ActiveFilter = typeof ActiveFilters[number]['value'];

const FilterSetSelect = ({ activeFilter, setActiveFilter }: FilterMigrationSetsProps) => {
    return (
            <SelectWrapper>
                <InputText
                    label='Filter'
                    type='select'
                    onChange={(o: Options ) => setActiveFilter(o.value)}
                    options={ActiveFilters}
                    value={activeFilter}
                />
            </SelectWrapper>
    );
};

export default FilterSetSelect;