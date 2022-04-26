import {useLoading} from 'equisoft-design-ui-elements';
import produce, {Draft} from 'immer';
import {useState} from 'react';
import {defaultMigrationSetService} from '../../../lib/context';
import MigrationSet from '../../../lib/domain/entities/migrationSet';

type MigrationSetEditableFields = 'migrationSetName' | 'comments';

const editMigrationSetLogic = (migrationSet: MigrationSet,
                               callback: (migrationSetUpdated: MigrationSet) => void,
                               migrationSetService = defaultMigrationSetService) => {
    const [loading, load] = useLoading();
    const [migrationSetSession, setMigrationSetSession] = useState(migrationSet);
    const [errorValidation, setErrorValidation] = useState<{ migrationSetName?: string }>({});

    const update = (recipe: (draft: Draft<MigrationSet>) => void) => {
        setMigrationSetSession(produce(migrationSetSession, recipe));
    }

    const onChange = (field: MigrationSetEditableFields, value: string) => {
        field === 'migrationSetName' && setErrorValidation({ 'migrationSetName': ''});
        update((draft => {
            draft[field] = value;
        }));
    }

    const onSave = async () => {
        if(!migrationSetSession.migrationSetName.trim()) {
            setErrorValidation({ 'migrationSetName': 'Name is required, cannot be blank or empty' });
            return;
        }
        await load(migrationSetService.editMigrationSet)(migrationSetSession);
        typeof callback === 'function' && callback(migrationSetSession);
    }

    return {
        loading,
        migrationSetSession,
        onChange,
        errorValidation,
        onSave
    }
}
export default editMigrationSetLogic;