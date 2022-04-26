import {Button} from '@equisoft/design-elements-react';
import {Loading} from 'equisoft-design-ui-elements';
import React, {ChangeEvent} from 'react';
import InputText from '../../../components/general/inputText';
import {PanelBreak, PanelContainer, PanelTitleContent} from '../../../components/general/sidebar/style';
import MigrationSet from '../../../lib/domain/entities/migrationSet';
import editMigrationSetLogic from './editMigrationSetLogic';

interface EditMigrationSetProps {
    migrationSet: MigrationSet,
    callback() : void
}

// todo -kayu- this will need to merge with the entityCreation/configPackage/index.ts due to the code being very similar
const EditMigrationSetComponent = ({migrationSet, callback } : EditMigrationSetProps) => {
    const { migrationSetSession, loading, onChange, errorValidation, onSave } = editMigrationSetLogic(migrationSet, callback);
    return (
        <>
            <Loading loading={loading} />
            <PanelContainer>
                <PanelTitleContent>
                    Edit Migration Set
                </PanelTitleContent>

                <PanelBreak />

                <InputText
                    type='text'
                    label='Name'
                    feedbackMsg={errorValidation.migrationSetName ?? ''}
                    value={migrationSetSession.migrationSetName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('migrationSetName', e.target.value)}
                    required
                />

                <InputText
                    type='textarea'
                    label='Comment'
                    value={migrationSetSession.comments}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('comments', e.target.value)}
                    maxLength={255}
                />

                <Button
                    buttonType="primary"
                    disabled={loading}
                    onClick={onSave}
                >
                    Save
                </Button>
            </PanelContainer>
        </>
    );
}

EditMigrationSetComponent.defaultProps = {};

export default EditMigrationSetComponent;