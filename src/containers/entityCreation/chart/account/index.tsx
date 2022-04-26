import React, {ChangeEvent, FormEvent, useContext, useState} from "react";
import {useTabActions} from '../../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../../components/editor/tabs/tabReducerTypes';
import { defaultEntitiesService } from "../../../../lib/context";
import EntityService from "../../../../lib/services/entitiesService";
import { RightbarContext } from "../../../../components/general/sidebar/rightbarContext";
import { PanelSectionContainer } from "../../../../components/general/sidebar/style";
import { CollapseContainer, useLoading } from "equisoft-design-ui-elements";
import { InputText } from "../../../../components/general";
import GeneralComponent from "../../../general/components/generalComponent";
import { OverrideEnumType } from "../../../general/components/overrideEnum";
import CreateChartAccountRequest from "../../../../lib/domain/entities/createChartAccountRequest";
import produce, {immerable} from "immer";
import { toast } from "react-toastify";
import {validateRequiredFields} from "../../util";
import FrameworkComponent from "../../frameworkComponent";

const FILTERED_OVERRIDES = [
    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
];

class ErrorAccount {
    [immerable] = true;
    accountNumber = '';
    accountDescription = '';
}
interface ChartAccountCreationProps {
    entityService: EntityService;
}

const ChartAccountCreationWizard = ({ entityService }: ChartAccountCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    const [request, setRequest] = useState<CreateChartAccountRequest>(new CreateChartAccountRequest());

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorAccount());

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const createAccountScreen = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }
        const account = await entityService.createChartAccount(request);
        if (account != null) {
            dispatch({ type: OPEN, payload: { data: account }});
            toast.success('Chart of account was created');
        }
        closeRightbar();
    });

    const handleFieldChanged = async (field: 'accountNumber' | 'accountDescription', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        setError(produce(error, (draft => {
            draft[field] = '';
        })))
    };

    return (
        <FrameworkComponent
            title='Create Chart of Account'
            loading={loading}
            onSubmit={createAccountScreen}
            onCancel={closeRightbar}
        >
            <CollapseContainer title="General" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        value={request.accountNumber}
                        label="Account number"
                        required
                        feedbackMsg={error.accountNumber}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('accountNumber', e.target.value)}
                    />

                    <InputText
                        type='text'
                        value={request.accountDescription}
                        label="Account description"
                        required
                        feedbackMsg={error.accountDescription}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('accountDescription', e.target.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title="Override" defaultOpened>
                <PanelSectionContainer>
                    <GeneralComponent
                        data={request}
                        filteredOverrides={FILTERED_OVERRIDES}
                        load={load}
                        setIsOverrideValid={setIsOverrideValid}
                        showMessageOverride={showMessageOverride}
                        setGeneralComponentState={() => setShowMessageOverride(false)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};
ChartAccountCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
};
export default ChartAccountCreationWizard;


