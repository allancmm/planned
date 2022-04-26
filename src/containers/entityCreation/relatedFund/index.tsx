import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import produce, {immerable} from 'immer';
import { InputText, Options } from "../../../components/general";
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultCompanyService, defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import CreateRelatedFundRequest from '../../../lib/domain/entities/CreateRelatedFundRequest';
import {EntityType} from '../../../lib/domain/enums/entityType';
import CompanyService from '../../../lib/services/companyService';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import {OverrideEnumType} from '../../general/components/overrideEnum';
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";

type FieldRelatedFund = 'fundName' | 'relationCode' | 'effectiveDate' | 'expirationDate';
const fieldsRequired = [ 'fundName', 'relationCode'] as const;
type FieldsRequired = (typeof fieldsRequired)[number];
const isFieldRequired = (field: any) : field is FieldsRequired => fieldsRequired.includes(field);

interface RelatedFundCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
    companyService: CompanyService;
}
const RelatedFundCreationWizard = ({ entityService, entityInformationService }: RelatedFundCreationProps) => {
    const RELATION_CODE = "AsCodeFundRelation";
    const [request, setRequest] = useState<CreateRelatedFundRequest>(new CreateRelatedFundRequest());
    const [relationCodes, setRelationCodes] = useState<BasicEntity[]>([]);
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [errorValidation, setErrorValidation] = useState<ErrorValidation>(new ErrorValidation());

    const optionsFundRelation = useMemo(() => [
        { label: relationCodes.length > 0 ? 'Select Relation Code' : ' No Relation Code Available', value: ''},
          ...Object.values(relationCodes).map((f) => ({
                label: f.name,
                value: f.value,
            }))], [relationCodes]);

    const fetchData = async () => {
        setRelationCodes(await entityService.getCodes(RELATION_CODE));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fundRelationTypeCodeToEntityType = (typeCode: string): EntityType => {
        switch (typeCode) {
            case '01':
                return 'CHILD_FUNDS';
            case '02':
                return 'BENEFIT_FUNDS';
            case '03':
                return 'LATERAL_FUNDS';
            default:
                return 'FUND';
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newError = new ErrorValidation();

        Object.keys(newError).map((key) => {
            if(isFieldRequired(key) && !request[key]) {
                newError[key] = MSG_REQUIRED_FIELD;
                isValid = false;
            }
        });

        setShowMessageOverride(!isOverrideValid);
        setErrorValidation(newError);
        return isValid && isOverrideValid;
    }

    const createRelatedFund = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const fund = await entityService.createRelatedFund(request);

            const entityInformation = await entityInformationService.getEntityInformation(
                fundRelationTypeCodeToEntityType(request.relationCode),
                fund.getGuid(),
                'DATA',
            );

            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    });

    const handleFieldChanged = (field: FieldRelatedFund, value: string | Date) => {
        setRequest(
            produce(request, (draft) => {
                if(field === 'effectiveDate' || field === 'expirationDate') {
                    draft[field] = value as Date;
                } else {
                    draft[field] = value as string;
                }
            }),
        );

        isFieldRequired(field) && setErrorValidation(produce(errorValidation, (draft) => { draft[field] = ''; }));
    }

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                parentType="RELATED_FUND"
                filteredOverrides={[
                    { name: OverrideEnumType.FUND.value, value: OverrideEnumType.FUND.code }
                ]}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    return (
        <FrameworkComponent
            title='Create Related Fund'
            loading={loading}
            onSubmit={createRelatedFund}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        label="Fund Name"
                        value={request.fundName}
                        required
                        feedbackMsg={errorValidation.fundName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('fundName', e.target.value)}
                    />
                    <InputText
                        type='custom-select'
                        value={request.relationCode}
                        label="Fund Relation"
                        required
                        feedbackMsg={errorValidation.relationCode}
                        options={optionsFundRelation}
                        onChange={(o: Options) => handleFieldChanged('relationCode', o.value)}
                    />
                    <InputText
                        type='date'
                        label="Effective From"
                        value={request.effectiveDate}
                        onChange={(d : Date) => handleFieldChanged('effectiveDate', d)}
                    />
                    <InputText
                        type='date'
                        value={request.expirationDate}
                        label="Expiration Date"
                        onChange={(d: Date) => handleFieldChanged('expirationDate', d)}
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
RelatedFundCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
    companyService: defaultCompanyService,
};
export default RelatedFundCreationWizard;

class ErrorValidation {
    [immerable] = true;
    fundName = '';
    relationCode = '';
}