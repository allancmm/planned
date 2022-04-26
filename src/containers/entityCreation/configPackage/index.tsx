import React, { ChangeEvent } from "react";
import { Loading } from "equisoft-design-ui-elements";
import ConfigPackage from "../../../lib/domain/entities/configPackage";
import { PanelBreak, PanelContainer, PanelTitleContent } from "../../../components/general/sidebar/style";
import InputText from "../../../components/general/inputText";
import { Button } from "@equisoft/design-elements-react";
import useConfigPackageLogic  from "./useConfigPackageLogic";

interface ConfigPackageProps {
    isEdit: boolean,
    configPackage: ConfigPackage,
    callback() : void
}
const ConfigPackageComponent = ({ isEdit, configPackage, callback } : ConfigPackageProps) => {

    const { packageSession, loading, onChange, errorValidation, onSaveConfigPackage } = useConfigPackageLogic(configPackage, callback);

    return (
        <>
            <Loading loading={loading} />
            <PanelContainer>
                <PanelTitleContent>
                    {isEdit ? 'Edit' : 'Create'} Config Package
                </PanelTitleContent>

                <PanelBreak />

                <InputText
                   type='text'
                   label='Package Name'
                   feedbackMsg={errorValidation.packageName ?? ''}
                   value={packageSession.packageName}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('packageName', e.target.value)}
                   required
                />

                <InputText
                    type='textarea'
                    label='Description'
                    value={packageSession.description}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('description', e.target.value)}
                    maxLength={255}
                />

                <Button
                    buttonType="primary"
                    disabled={loading}
                    onClick={onSaveConfigPackage}
                >
                    Save
                </Button>
            </PanelContainer>
        </>
    );
}

ConfigPackageComponent.defaultProps = {};

export default ConfigPackageComponent;