import React, {ChangeEvent, FormEvent, useContext, useState} from 'react';
import { CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import { InputText, Options } from "../../../components/general";
import produce, {immerable} from 'immer';
import {toast} from 'react-toastify';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import CreateSecurityGroupRequest from '../../../lib/domain/entities/CreateSecurityGroupRequest';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import {OverrideEnumType} from '../../general/components/overrideEnum';
import FrameworkComponent from "../frameworkComponent";
import {validateRequiredFields} from "../util";

const options = [
    { label: 'Select Option', value: ''},
    { label: 'Security Group - All Access', value: 'NEW_SECURITY'},
    { label: 'Security Group - Empty', value: 'NEW_EMPTY'}
];

class ErrorSecurityGroup {
    [immerable] = true;
    option = '';
    securityGroupName = '';
}
interface SecurityGroupProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const SecurityGroupCreationWizard = ({entityService}: SecurityGroupProps) => {
    const {closeRightbar} = useContext(RightbarContext);
    const [loading, load] = useLoading();

    const [request, setRequest] = useState<CreateSecurityGroupRequest>(new CreateSecurityGroupRequest());

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorSecurityGroup());

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides={[
                    {name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code}
                ]}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const handleFieldChanged = async (field: 'option' | 'securityGroupName', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            })
        );
        setError(produce(error, (draft => {
            draft[field] = '';
        })));
    };

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const createSecurityGroup = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }
        await entityService.createSecurityGroup(request);
        toast("Security Group Created");
        closeRightbar();
    });

    return (
        <FrameworkComponent
            title='Create Security Group'
            loading={loading}
            onSubmit={createSecurityGroup}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='custom-select'
                        label="Option"
                        value={request.option}
                        options={options}
                        onChange={(o: Options) => handleFieldChanged('option', o.value.trim())}
                        required
                        feedbackMsg={error.option}
                    />
                    <InputText
                        type='text'
                        value={request.securityGroupName}
                        label="Security Group Name"
                        required
                        feedbackMsg={error.securityGroupName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('securityGroupName', e.target.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'Override'} defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

SecurityGroupCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService
};

export default SecurityGroupCreationWizard;
