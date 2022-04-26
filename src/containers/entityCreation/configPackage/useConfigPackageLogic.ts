import { useState } from "react";
import { useLoading} from "equisoft-design-ui-elements";
import produce, { Draft } from "immer";
import ConfigPackage from "../../../lib/domain/entities/configPackage";
import { defaultConfigPackageService } from "../../../lib/context";


type PossibleFields = 'packageName' | 'description';

const useConfigPackageLogic = (configPackage: ConfigPackage,
                               callback: (packageUpdated: ConfigPackage) => void,
                               configPackageService = defaultConfigPackageService) => {

    const [loading, load] = useLoading();
    const [packageSession, setPackageSession] = useState(configPackage);
    const [errorValidation, setErrorValidation] = useState<{ packageName?: string }>({});
    const updateConfigPackage = (recipe: (draft: Draft<ConfigPackage>) => void) => {
        setPackageSession(produce(packageSession, recipe));
    }
    const onChange = (field: PossibleFields, value: string) => {
        field === 'packageName' && setErrorValidation({ 'packageName': ''});
        updateConfigPackage((draft => {
            draft[field] = value;
        }));
    }

    const onSaveConfigPackage = async () => {
        if(!packageSession.packageName) {
            setErrorValidation({ 'packageName': 'Package name is required' });
            return;
        }
        // TODO - Allan - need to change name field from comments to description
        packageSession.comments = '';
        await load(configPackageService.editPackage)(packageSession);
        typeof callback === 'function' && callback(packageSession);
    }

    return {
        loading,
        packageSession,
        onChange,
        errorValidation,
        onSaveConfigPackage
    }
};

export default useConfigPackageLogic;