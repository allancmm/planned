import {Input} from '@material-ui/core';
import {format} from "date-fns";
import {DateInput, TextInput as TextInputRow} from 'equisoft-design-ui-elements';
import React, {ChangeEvent} from 'react';
import {defaultEntitiesService} from '../../../lib/context';
import EntityField from '../../../lib/domain/entities/entityField';
import {FieldTypeCodeEnum} from '../../../lib/domain/enums/fieldTypeCode';
import EntityService from '../../../lib/services/entitiesService';
import DataTable, {DataTableColumn} from '../../general/dataTable/table';
import {TextRow} from '../translations/style';

interface EntityFieldsSectionProps {
    entityService: EntityService;
    entityFields: EntityField[];
    isEditMode: boolean;
    updateEntityFields(newEntityFields: EntityField[]): void;
}

export const EntityFieldsSection = ({ entityFields, isEditMode, updateEntityFields }: EntityFieldsSectionProps) => {

    const fieldNameCell = (row: EntityField): React.ReactNode => {
        return <>
                <Input type='hidden' name='fieldTypeCode' value={FieldTypeCodeEnum.getEnumFromValue(row.fieldTypeCode).value}/>
                {row.fieldDisplayName}
            </>;
    };

    const fieldValueCell = (row: EntityField): React.ReactNode => {
        return isEditMode ?
            (FieldTypeCodeEnum.getEnumFromValue(row.fieldTypeCode).value === 'DATE') ?
                <DateInput selected={row.fieldValue ? new Date(row.fieldValue) : null} onChange={(d) => onDateValueChange(row, d as Date)} />
                : <TextInputRow value={row.fieldValue} onChange={(e: ChangeEvent<HTMLInputElement>) => onFieldValueChange(row, e.currentTarget.value)} />
            :  <TextRow>{row.fieldValue}</TextRow>;
    };

    const entityFieldColumns: DataTableColumn[] = [
        { name: 'Field Name', selector: 'fieldName', cell: fieldNameCell },
        { name: 'Field Value', selector: 'fieldValue', cell: fieldValueCell }
    ];

    const onDateValueChange = (row: EntityField, date: Date) => {
        const tabDataFields = entityFields.map((f) => {
            if (f.rowID === row.rowID) {
                f.fieldValue = date ? format(date, 'yyyy-MM-dd') : '';
            }
            return f;
        });
        updateEntityFields(tabDataFields);
    }

    const onFieldValueChange = (row: EntityField, value?: string) => {
        const tabDataFields = entityFields.map((f) => {
            if (f.rowID === row.rowID) {
                f.fieldValue = value;
            }
            return f;
        });
        updateEntityFields(tabDataFields);
    }

    return (
        <DataTable
            columns={entityFieldColumns}
            data={entityFields}
            keyColumn={'rowID'}
            defaultSortColumn={'fieldName'}
            hasSearchBar={false}
            isEditMode={isEditMode}
            updateTable={updateEntityFields}
        />
    );
};

EntityFieldsSection.defaultProps = {
    entityService: defaultEntitiesService
};

export default EntityFieldsSection;