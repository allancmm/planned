import React, {ChangeEvent, FormEvent, useContext, useState} from 'react';
import {CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import produce, {immerable} from 'immer';
import { InputText } from "../../../components/general";
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import CreateProductRequest from '../../../lib/domain/entities/createProductRequest';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import {OverrideEnumType} from '../../general/components/overrideEnum';
import FrameworkComponent from "../frameworkComponent";
import {validateRequiredFields} from "../util";

type TypeString = 'productName' | 'description';
type TypeDate = 'effectiveDate' | 'expirationDate';

class ErrorProduct {
    [immerable] = true;
    productName = '';
}
const FILTERED_OVERRIDES = [
    {name: OverrideEnumType.SCOMPANY.value, value: OverrideEnumType.SCOMPANY.code},
    {name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code}
];

interface ProductCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const ProductCreationWizard = ({entityInformationService, entityService}: ProductCreationProps) => {
    const {closeRightbar} = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    const [request, setRequest] = useState<CreateProductRequest>(new CreateProductRequest());

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorProduct());

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                parentType="PLAN"
                filteredOverrides={FILTERED_OVERRIDES}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const handleStringFieldChange = async (field: TypeString, value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            })
        );
        if(field === 'productName') {
            setError(produce(error, (draft => {
                draft[field] = '';
            })));
        }
    };

    const handleDateFieldChange = (field: TypeDate, value: Date) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            })
        );
    };

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const createProduct = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }
        const product = await entityService.createProduct(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            product.entityType,
            product.getGuid(),
            'DATA'
        );
        dispatch({type: OPEN, payload: {data: entityInformation}});
        closeRightbar();
    });

    return (
        <FrameworkComponent
            title='Create Product'
            loading={loading}
            onSubmit={createProduct}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        value={request.productName}
                        label="Product Name"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleStringFieldChange('productName', e.target.value)}
                        required
                        feedbackMsg={error.productName}
                    />

                    <InputText
                        type='text'
                        value={request.description}
                        label="Description"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleStringFieldChange('description', e.target.value)}
                    />

                    <InputText
                        type='date'
                        label="Effective From"
                        startDate={request.effectiveDate}
                        value={request.effectiveDate}
                        onChange={(d: Date) => handleDateFieldChange('effectiveDate', d)}
                    />

                    <InputText
                        type='date'
                        label="Effective To"
                        startDate={request.expirationDate}
                        value={request.expirationDate}
                        onChange={(d: Date) => handleDateFieldChange('expirationDate', d)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'Parent Entity'} defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

ProductCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService
};

export default ProductCreationWizard;
