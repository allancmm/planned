import React from 'react';
import Translation from '../../../lib/domain/entities/translation';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';

interface TranslationSectionProps {
    translations: Translation[];
    isEditMode: boolean;

    updateTranslation(newTrans: Translation[]): void;
}

export const TranslationSection = ({ translations, isEditMode, updateTranslation }: TranslationSectionProps) => {
    const dataTableColumns: DataTableColumn[] = [
        {
            name: 'Locale',
            selector: 'locale',
        },
        {
            name: 'Translation Value',
            selector: 'translationValue',
        },
    ];

    return (
        <DataTable
            columns={dataTableColumns}
            data={translations}
            keyColumn={'translationGuid'}
            defaultSortColumn={'locale'}
            hasSearchBar={false}
            isEditMode={isEditMode}
            updateTable={updateTranslation}
        />
    );
};

export default TranslationSection;
