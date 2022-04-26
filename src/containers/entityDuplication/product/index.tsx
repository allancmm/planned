import {Button} from '@equisoft/design-elements-react';
import {DateInput, Loading, TextInput, useLoading} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {ButtonSection} from '../../../components/general';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import {PanelTitle} from '../../../components/general/sidebar/style';
import {defaultEntityDuplicateService, defaultEntityInformationService} from '../../../lib/context';
import CreateProductRequest from '../../../lib/domain/entities/createProductRequest';
import {DuplicateProduct} from '../../../lib/domain/entities/duplicateProduct';
import EntityDuplicateService from '../../../lib/services/entityDuplicateService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import {OverrideEnumType} from '../../general/components/overrideEnum';
import StateGeneralProps from '../../general/components/stateGeneralProps';
import {CheckoutSwitch} from '../general/checkout';
import {CopyAllSwitch} from '../general/copyAll';
import {DuplicateContainer} from '../styles';

const request = new CreateProductRequest();

type TypeAllowProduct = string | Boolean | Date;

interface ProductDuplicateProp {
    sourceProduct: DuplicateProduct;
    entityDuplicateService: EntityDuplicateService,
    entityInformationService: EntityInformationService,
}

const ProductDuplicate = ({sourceProduct, entityDuplicateService, entityInformationService}: ProductDuplicateProp) => {
    const dispatch = useTabActions();
    const [loading, load] = useLoading();
    const {closeRightbar} = useContext(RightbarContext);

    const [product, setProduct] = useState<DuplicateProduct>(sourceProduct);
    const [overrideLevelCode, setOverrideLevelCode] = useState('');
    const [generalComponentState, setGeneralComponentState] = useState<StateGeneralProps>();

    const duplicateProduct = load(async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            product.overrideLevel = overridesList.find((o) => o.value === overrideLevelCode)?.name ?? '';
            if (product.overrideLevel === OverrideEnumType.SCOMPANY.value) {
                product.overrideLevel = OverrideEnumType.COMPANY.value;
            }
            const entitiesCreated = await entityDuplicateService.duplicateProduct(product);
            for (const entity of entitiesCreated) {
                const entityInformation = await entityInformationService.getEntityInformation(
                    entity.entityType,
                    entity.getGuid(),
                    'DATA'
                );
                dispatch({type: OPEN, payload: {data: entityInformation}});
            }
            toast.success('Product duplicated successfully');
            closeRightbar();
        }
    );


    useEffect(() => {
        generalComponentState?.guid && onChange('overrideGuid', generalComponentState?.guid);
    }, [generalComponentState]);

    useEffect(() => {
        setProduct(produce(product, (draft) => {
            draft.newEntityName = sourceProduct.newEntityName;
            draft.createCheckedOut = sourceProduct.createCheckedOut;
        }));
    }, [sourceProduct.sourceEntityGuid]);

    const overridesList = useMemo(() => {
        return [
            {name: OverrideEnumType.SCOMPANY.value, value: OverrideEnumType.SCOMPANY.code},
            {name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code}
        ];
    }, [product.overrideTypeCode]);

    const onChange = (field: keyof DuplicateProduct, value: TypeAllowProduct) => {
        setProduct(produce(product, (draft) => {
            (draft[field] as TypeAllowProduct) = value;
        }));
    };

    return (
        <>
            <PanelTitle>Duplicate Product</PanelTitle>

            <DuplicateContainer onSubmit={duplicateProduct}>
                <Loading loading={loading}/>

                <TextInput
                    label="New Product Name"
                    defaultValue={product.newEntityName}
                    required
                    onChange={(e) => onChange('newEntityName', e.target.value)}
                />

                <TextInput
                    label="Description"
                    defaultValue={product.description}
                    onChange={(e) => onChange('description', e.target.value)}
                />

                <DateInput
                    label="Effective From"
                    selected={product.newEffectiveDate}
                    onChange={(d) => onChange('newEffectiveDate', d as Date)}
                />
                <DateInput
                    label="Effective To"
                    selected={product.newExpirationDate}
                    onChange={(d) => onChange('newExpirationDate', d as Date)}
                />
                <hr/>
                <GeneralComponent
                    data={request}
                    warningMessage=""
                    filteredOverrides={overridesList}
                    setGeneralComponentState={setGeneralComponentState}
                    setOverrideLevelCode={setOverrideLevelCode}
                />
                <hr/>
                <CheckoutSwitch createCheckedOut={product.createCheckedOut} onChange={onChange}/>
                <CopyAllSwitch copyAllRules={product.copyAllRules} onChange={onChange}/>

                <ButtonSection>
                    <Button buttonType="primary"
                            label="Save"/>
                </ButtonSection>
            </DuplicateContainer>
        </>
    );
};

ProductDuplicate.defaultProps = {
    entityDuplicateService: defaultEntityDuplicateService,
    entityInformationService: defaultEntityInformationService
};

export default ProductDuplicate;