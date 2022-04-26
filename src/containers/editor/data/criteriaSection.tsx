import React, { useState } from "react";
import ChartOfAccountsCriteria from "../../../lib/domain/entities/chartOfAccountsCriteria";
import DataTable, { DataTableColumn } from '../../general/dataTable/table';
import { Dialog, useDialog, WindowContainer } from "equisoft-design-ui-elements";

interface CriteriaSectionProps {
    criterias: ChartOfAccountsCriteria[];
    isEditMode: boolean;
    updateCriterias(newCriterias: ChartOfAccountsCriteria[]): void;
}

export const CriteriaSection = ({ isEditMode, updateCriterias, criterias }: CriteriaSectionProps) => {
    const [dialogProps, setDialogProps] = useState({});
    const [show, toggle] = useDialog();

    const dataTableColumns: DataTableColumn[] = [
        {
            name: 'Criteria Name',
            selector: 'criteriaName',
            isUnmodifiable: true
        },
        {
            name: 'Criteria Value',
            selector: 'criteriaValue',
        }
    ];

    const getDialogProps = () => {
        return {
            show,
            onClose: closeDialog,
            title: 'Confirmation Required',
            confirmPanel: true,
            element: <></>,
            ...dialogProps,
        };
    };

    const closeDialog = () => {
        toggle();
        setDialogProps({});
    };

    return (
        <WindowContainer>
            <Dialog {...getDialogProps()} />

            <DataTable
                columns={dataTableColumns}
                data={criterias}
                keyColumn={'rowID'}
                hasSearchBar={false}
                isEditMode={isEditMode}
                updateTable={updateCriterias}
            />
        </WindowContainer>

    );
};

export default CriteriaSection;
