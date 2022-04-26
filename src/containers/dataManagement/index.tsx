import React from 'react';
import { PanelTitle } from '../../components/general/sidebar/style';
import DataCopyTool from './dataCopyTool/dataCopyTool';
import DataDictionary from './dataDictionary/dataDictionary';
import GenericDataFile from './genericDataFile/genericDataFile';

const DataManagementPanel = () => {
    return (
        <>
            <PanelTitle>Data Management</PanelTitle>
            <DataDictionary />
            <GenericDataFile />
            <DataCopyTool />
        </>
    );
};

export default DataManagementPanel;
