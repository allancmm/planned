import React, { ChangeEvent } from "react";
import { ModalDialog, InputText } from "../../../../components/general";
import MigrationSet from "../../../../lib/domain/entities/migrationSet";

export type FieldMigrationSetEditType = 'migrationSetName';

interface ModalEditMigrationSetProps {
    isModalOpen: string,
    data: MigrationSet,
    onChange(field: FieldMigrationSetEditType, value: string) : void,
    onConfirm(newName: string): void,
    onRequestClose() : void
}

const ModalEditMigrationSet = ({ isModalOpen, data, onChange, onConfirm, onRequestClose } : ModalEditMigrationSetProps ) => {
    const { migrationSetName } = data;
    return (
        <>
            {isModalOpen &&
                <ModalDialog
                    isOpen={isModalOpen}
                    onRequestClose={onRequestClose}
                    title='Edit Migration Set'
                    children={
                       <>
                         <InputText
                            label='Name'
                            value={migrationSetName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('migrationSetName', e.target.value)}
                         />

                      </>
                    }
                    confirmButton={{ onConfirm: onConfirm }}
                />
            }
        </>
    );
}

export default ModalEditMigrationSet;