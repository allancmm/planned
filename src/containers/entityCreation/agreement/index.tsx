import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import {immerable, produce} from 'immer';
import { InputText, Options } from "../../../components/general";
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import { defaultEntitiesService, defaultEntityInformationService } from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import CreateAgreementDefinitionRequest from '../../../lib/domain/entities/createAgreementDefinitionRequest';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import { getEnumKey, OverrideEnumType } from '../../general/components/overrideEnum';
import { validateRequiredFields} from "../util";
import FrameworkComponent from "../frameworkComponent";

const CATEGORY_CODE = 'AsCodeAgreementCategory';
const TYPE_CODE = 'AsCodeAgreementType';
const STATUS_CODE = 'AsCodeAgreementStatus';

type TypeFieldsAgreement = 'agreementName' | 'agreementCategoryCode' | 'typeCode' | 'statusCode' | 'effectiveFrom' | 'effectiveTo';

class ErrorValidationAgreement {
    [immerable] = true;
    agreementName = '';
    agreementCategoryCode = '';
    typeCode = '';
    statusCode = '';
    effectiveFrom = '';
    effectiveTo = '';
}

interface AgreementDefinitionProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const AgreementDefinitionCreationWizard = ({ entityService, entityInformationService }: AgreementDefinitionProps) => {
    const [request, setRequest] = useState<CreateAgreementDefinitionRequest>(new CreateAgreementDefinitionRequest());
    const dispatch = useTabActions();
    const { closeRightbar } = useContext(RightbarContext);
    const [codeTypes, setCodeTypes] = useState<BasicEntity[]>([]);
    const [categoryTypes, setCategoryTypes] = useState<BasicEntity[]>([]);
    const [statusTypes, setStatusTypes] = useState<BasicEntity[]>([]);

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorValidationAgreement());

    const [loading, load] = useLoading();

    const optionsCategoryCode = useMemo(() =>
        [{ label: categoryTypes.length > 0 ? 'Select Type Category' : ' No Category Available', value: ''},
            ...categoryTypes.map((code) => ({
                label: code.name,
                value: code.value,
            }))], [categoryTypes]);

    const optionsTypeCode = useMemo(() =>
        [{ label: codeTypes.length > 0 ? 'Select Type Code' : ' No Type Code Available', value: ''},
         ...codeTypes.map((code) => ({
                label: code.name,
                value: code.value,
            }))], [codeTypes]);

    const optionsStatusCode = useMemo(() =>
        [{label: statusTypes.length > 0 ? 'Select Status Code' : ' No Status Code Available', value: ''},
         ...statusTypes.map((status) => ({
                label: status.name,
                value: status.value,
            }))], [statusTypes]);

    const fetchData = async () => {
        const [categoryResp, codeResp, statusResp] =
            await Promise.allSettled([
                load(entityService.getCodes)(CATEGORY_CODE),
                load(entityService.getCodes)(TYPE_CODE),
                load(entityService.getCodes)(STATUS_CODE)
            ]);

        setCategoryTypes(categoryResp.status === 'fulfilled' ? categoryResp.value : []);
        setCodeTypes(codeResp.status === 'fulfilled' ? codeResp.value : []);
        setStatusTypes(statusResp.status === 'fulfilled' ? statusResp.value : []);
    };

    useEffect(() => {
        request.overrideLevel = getEnumKey(OverrideEnumType.GLOBAL.code);
        request.overrideGuid = '';
        fetchData();
    }, []);

    const renderNameField = () => {
        return (
            <InputText
                value={request.agreementName}
                label="Agreement Name"
                required
                feedbackMsg={error.agreementName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('agreementName', e.target.value)}
            />
        );
    };

    const renderCategoryCodeField = () => {
        return (
            <InputText
                value={request.agreementCategoryCode}
                type='custom-select'
                label="Category Code"
                options={optionsCategoryCode}
                required
                feedbackMsg={error.agreementCategoryCode}
                onChange={(o: Options) => handleFieldChanged('agreementCategoryCode', o.value)}

            />
        );
    };

    const renderTypeCodeField = () => {
        return (
            <InputText
                value={request.typeCode}
                type='custom-select'
                label="Type Code"
                options={optionsTypeCode}
                required
                feedbackMsg={error.typeCode}
                onChange={(o: Options) => handleFieldChanged('typeCode', o.value)}
            />
        );
    };

    const renderStatusCodeField = () => {
        return (
            <InputText
                value={request.statusCode}
                type='custom-select'
                label="Status Code"
                options={optionsStatusCode}
                required
                feedbackMsg={error.statusCode}
                onChange={(o: Options) => handleFieldChanged('statusCode', o.value)}
            />
        );
    };

    const renderEffectiveFromField = () => {
        return (
            <InputText
                type='date'
                value={request.effectiveFrom}
                startDate={request.effectiveFrom}
                label="Effective From"
                feedbackMsg={error.effectiveFrom}
                onChange={(d: Date) => handleFieldChanged('effectiveFrom', d)}
                required
            />
        );
    };

    const renderEffectiveToField = () => {
        return (
            <InputText
                type='date'
                value={request.effectiveTo}
                label="Effective To"
                onChange={(d: Date) => handleFieldChanged('effectiveTo', d)}
                required
                feedbackMsg={error.effectiveTo}
            />
        );
    };

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides={[
                    { name: OverrideEnumType.GLOBAL.value, value: OverrideEnumType.GLOBAL.code },
                    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
                ]}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const handleFieldChanged = (field: TypeFieldsAgreement, value: string | Date) => {
        if(field === 'effectiveFrom' || field === 'effectiveTo') {
            setRequest(
                produce(request, (draft) => {
                    draft[field] = value as Date;
                }),
            );
        } else {
            setRequest(
                produce(request, (draft) => {
                    draft[field] = value as string;
                }),
            );
        }

        setError(produce(error, (draft) => {
            draft[field] = '';
        }));
    }

    const validateForm = () => {
        const { isValid, newError} = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const createAgreementDefinition = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const agreement = await entityService.createAgreement(request);
            const entityInformation = await entityInformationService.getEntityInformation(
                agreement.entityType,
                agreement.getGuid(),
                'XML_DATA',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    });

    return (
        <FrameworkComponent
            title='Create Agreement'
            loading={loading}
            onSubmit={createAgreementDefinition}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    {renderNameField()}
                    {renderCategoryCodeField()}
                    {renderTypeCodeField()}
                    {renderStatusCodeField()}
                    {renderEffectiveFromField()}
                    {renderEffectiveToField()}
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'Override'} defaultOpened>
                <PanelSectionContainer>{renderOverride()}</PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

AgreementDefinitionCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default AgreementDefinitionCreationWizard;
