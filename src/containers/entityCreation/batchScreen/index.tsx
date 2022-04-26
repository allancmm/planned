import React, {useContext, useEffect, useState, FormEvent, ChangeEvent, useMemo} from "react";
import { CollapseContainer, useLoading } from "equisoft-design-ui-elements";
import { InputText, Options } from "../../../components/general";
import produce, {immerable} from "immer";
import { useTabActions } from "../../../components/editor/tabs/tabContext";
import { OPEN } from "../../../components/editor/tabs/tabReducerTypes";
import { RightbarContext } from "../../../components/general/sidebar/rightbarContext";
import { PanelSectionContainer } from "../../../components/general/sidebar/style";
import { defaultEntitiesService, defaultEntityInformationService } from "../../../lib/context";
import BasicEntity from "../../../lib/domain/entities/basicEntity";
import CreateBatchScreenRequest from "../../../lib/domain/entities/createBatchScreenRequest";
import EntityService from "../../../lib/services/entitiesService";
import EntityInformationService from "../../../lib/services/entityInformationService";
import GeneralComponent from "../../general/components/generalComponent";
import { OverrideEnumType } from "../../general/components/overrideEnum";
import FrameworkComponent from "../frameworkComponent";
import {validateRequiredFields} from "../util";

const TYPE_CODE = "AsCodeBatchScreenType";

class ErrorBatchScreen {
    [immerable] = true;
    screenName = '';
}

const FILTERED_OVERRIDES = [
    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
    { name: OverrideEnumType.SCOMPANY.value, value: OverrideEnumType.SCOMPANY.code }
];

interface BatchScreenCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const BatchScreenCreationWizard = ({ entityService, entityInformationService }: BatchScreenCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const [loading, load] = useLoading();
    const dispatch = useTabActions();

    const [request, setRequest] = useState<CreateBatchScreenRequest>(new CreateBatchScreenRequest());
    const [typeCodes, setTypeCodes] = useState<BasicEntity[]>([]);

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorBatchScreen());

    const optionsTypeCode = useMemo(() => [
        { label: typeCodes.length > 0 ? 'Select Type Code' : ' No Type Code Available', value: ''},
            ...Object.values(typeCodes).map((f) => ({
                label: f.name,
                value: f.value,
            }))
        ], [typeCodes]);

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const createBatchScreen = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!validateForm()) {
            return;
        }

        if (request.overrideGuid != null) {
            request.relatedGuid = request.overrideGuid;
        }
        const batch = await entityService.createBatchScreen(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            batch.entityType,
            batch.getGuid(),
            'XML_DATA',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
        closeRightbar();
    });

    const fetchData = async () => {
        setTypeCodes(await load(entityService.getCodes)(TYPE_CODE));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides={FILTERED_OVERRIDES}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const handleFieldChanged = async (field: 'screenName' | 'typeCode', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );

        field === 'screenName' && setError(produce(error, (draft => { draft.screenName = '' })));
    };

    return (
        <FrameworkComponent
            title='Create Batch Screen'
            loading={loading}
            onSubmit={createBatchScreen}
            onCancel={closeRightbar}
        >
            <CollapseContainer title="General" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        value={request.screenName}
                        label="Screen Name"
                        required
                        feedbackMsg={error.screenName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('screenName', e.target.value)}
                    />

                    <InputText
                        type='custom-select'
                        value={request.typeCode}
                        label="Type Code"
                        options={optionsTypeCode}
                        onChange={(o: Options) => handleFieldChanged('typeCode', o.value)}
                    />

                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title="Override" defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

BatchScreenCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default BatchScreenCreationWizard;
