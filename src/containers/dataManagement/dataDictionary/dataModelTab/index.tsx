import { Loading, useLoading, WindowContainer } from 'equisoft-design-ui-elements';
import React, { useEffect, useState } from 'react';
import FileHeader from '../../../../components/editor/fileHeader';
import { FileHeaderContainer } from '../../../../components/editor/fileHeader/style';
import { defaultDataDictionaryService } from '../../../../lib/context';
import DataModel from '../../../../lib/domain/entities/dataModel';
import DataDictionaryService from '../../../../lib/services/dataDictionaryService';
import DataTable, { DataTableColumn } from '../../../general/dataTable/table';

interface DataModelTabProps {
    tabId: string;
    layoutId: number;
    dataDictionaryService: DataDictionaryService;
}
const DataModelTab = ({ tabId, dataDictionaryService }: DataModelTabProps) => {
    const [loading, load] = useLoading();
    const [dataModels, setDataModels] = useState<DataModel[]>([]);
    useEffect(() => {
        setEntities();
    }, []);

    const setEntities = load(async () => {
        const models = await dataDictionaryService.findDataModelsByFieldName(tabId);
        setDataModels(models.dataModelFields);
    });

    const dataTableColumns: DataTableColumn[] = [
        {
            name: 'Category',
            selector: 'category.categoryInfo',
        },
        {
            name: 'Override',
            selector: 'category.override',
        },
        {
            name: 'Field name',
            selector: 'fieldName',
        },
        {
            name: 'Field Id',
            selector: 'fieldId',
        },
        {
            name: 'Data Type',
            selector: 'dataType',
        },

        {
            name: 'Display Name',
            selector: 'displayName',
        },
        {
            name: 'Field Type',
            selector: 'fieldType',
        },
        {
            name: 'MultiField Name',
            selector: 'multifield',
        },
        {
            name: 'Description',
            selector: 'description',
        },
    ];

    return (
        <WindowContainer>
            <FileHeaderContainer>
                <FileHeader tabId={tabId} />
            </FileHeaderContainer>
            <Loading loading={loading} />
            <DataTable
                title={'Data Models'}
                columns={dataTableColumns}
                data={dataModels}
                defaultSortColumn={'fieldName'}
                hasSearchBar
                keyColumn={'fieldName'}
            />
        </WindowContainer>
    );
};

DataModelTab.defaultProps = {
    dataDictionaryService: defaultDataDictionaryService,
};

export default DataModelTab;
