import {format} from "date-fns";
import {DateInput, TextAreaInput} from 'equisoft-design-ui-elements';
import React, {ChangeEvent} from 'react';
import {defaultEntitiesService} from '../../../lib/context';
import FundField from '../../../lib/domain/entities/fundField';
import {FieldTypeCodeEnum} from '../../../lib/domain/enums/fieldTypeCode';
import EntityService from '../../../lib/services/entitiesService';
import DataTable, {DataTableColumn} from '../../general/dataTable/table';

interface FundFieldsSectionProps {
    entityService: EntityService;
    fundFields: FundField[];
    isEditMode: boolean;
    updateFundFields(newFundFields: FundField[]): void;
}

export const FundFieldsSection = ({ fundFields, isEditMode, updateFundFields }: FundFieldsSectionProps) => {

    const fieldTypeCodeCell = (row: FundField): React.ReactNode => {
        return FieldTypeCodeEnum.getEnumFromValue(row.fieldTypeCode).value;
    };

    const fieldNameCell = (row: FundField): React.ReactNode => {
        return row.fieldName;
    };

    const dateValueCell = (row: FundField): React.ReactNode => {
        return isEditMode ? <DateInput selected={row.dateValue} onChange={(d) => onDateValueChange(row, d as Date)} />
            : <div>{row.dateValue ? format(row.dateValue, 'yyyy-MM-dd') : ''}</div>;
    };

    const bigTextValueCell = (row: FundField): React.ReactNode => {
        return isEditMode ? (
                <TextAreaInput
                    value={row.bigTextValue}
                    maxLength={255}
                    onChange={onBigTextValueChange(row)}
                />
        ) : (
            row.bigTextValue
        );
    };

    const fundFieldColumns: DataTableColumn[] = [
        { name: 'Field Name', selector: 'fieldName', cell: fieldNameCell },
        { name: 'Field Type Code', selector: 'fieldTypeCode', cell: fieldTypeCodeCell },
        { name: 'Date Value', selector: 'dateValue', cell: dateValueCell },
        { name: 'Text Value', selector: 'textValue' },
        { name: 'Option Text', selector: 'optionText' },
        { name: 'Int Value', selector: 'intValue' },
        { name: 'Float Value', selector: 'floatValue' },
        { name: 'Currency Code', selector: 'currencyCode' },
        { name: 'Big Text Value', selector: 'bigTextValue', cell: bigTextValueCell }
    ];

    const onDateValueChange = (row: FundField, date: Date) => {
        const tabDataFields = fundFields.map((f) => {
            if (f.rowID === row.rowID) {
                f.dateValue = date;
            }
            return f;
        });
        updateFundFields(tabDataFields);
    }

    const onBigTextValueChange = (row: FundField) => (e: ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const tabDataFields = fundFields.map((f) => {
            if (f.rowID === row.rowID) {
                f.bigTextValue = e.target.value;
            }
            return f;
        });
        updateFundFields(tabDataFields);
    };

    return (
        <DataTable
            columns={fundFieldColumns}
            data={fundFields}
            keyColumn={'rowID'}
            defaultSortColumn={'fieldName'}
            hasSearchBar={false}
            isEditMode={isEditMode}
            updateTable={updateFundFields}
        />
    );
};

FundFieldsSection.defaultProps = {
    entityService: defaultEntitiesService
};

export default FundFieldsSection;