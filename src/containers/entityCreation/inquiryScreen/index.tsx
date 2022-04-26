import React, {ChangeEvent, FormEvent, MouseEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import { InputText, Options } from "../../../components/general";
import { produce } from 'immer';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {
    defaultEntitiesService,
    defaultEntityInformationService,
    defaultXmlTemplateService,
} from '../../../lib/context';
import CreateInquiryScreenRequest from '../../../lib/domain/entities/createInquiryScreenRequest';
import { StateCode } from '../../../lib/domain/entities/createRequirementDefinitionRequest';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import MapKeyValue from '../../../lib/domain/entities/mapKeyValue';
import XmlTemplate from '../../../lib/domain/entities/xmlTemplate';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import XmlTemplateService from '../../../lib/services/xmlTemplateService';
import GeneralComponent from '../../general/components/generalComponent';
import { OverrideEnumType } from '../../general/components/overrideEnum';
import StateGeneralProps from '../../general/components/stateGeneralProps';
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";

interface InquiryScreenCreationProps {
    xmlTemplateService: XmlTemplateService;
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const InquiryScreenCreationWizard = ({
    entityService,
    xmlTemplateService,
    entityInformationService,
}: InquiryScreenCreationProps) => {
    const POLICY_CODE = '03';

    const [loading, load] = useLoading();

    const [request, setRequest] = useState<CreateInquiryScreenRequest>(new CreateInquiryScreenRequest());
    const dispatch = useTabActions();
    const [codeTypes, setCodeTypes] = useState<MapKeyValue[]>([]);
    const [securityGroups, setSecurityGroups] = useState<BasicEntity[]>([]);
    const [templates, setTemplates] = useState<XmlTemplate[]>([]);
    const { closeRightbar } = useContext(RightbarContext);
    const [states, setStates] = useState<StateCode[]>([]);
    const [showWarning, setShowWarning] = useState<boolean>();

    const [overridesList, setOverridesList] = useState<BasicEntity[]>([]);
    const [renderGeneralComponent, setRenderGeneralCommponent] = useState<React.ReactElement>();
    const [generalComponentState, setGeneralComponentState] = useState<StateGeneralProps>();

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [errorValidation, setErrorValidation] = useState<ErrorValidation>(new ErrorValidation());

    const optionsLevel = useMemo(() =>
        [{label: codeTypes.length > 0 ? 'Select Type Code' : ' No Type Code Available', value: ''},
            ...codeTypes.map((code) => ({
                label: code.shortDescription,
                value: code.codeValue,
            }))] , [codeTypes]);

    const optionsState = useMemo(() =>
        [{ label: states.length > 0 ? 'Select State' : ' No State Available', value: ''},
            ...states.map((p) => ({
                label: p.shortDescription,
                value: p.codeValue,
            }))], [states]);

    const optionsTemplate = useMemo(() =>
        [{ label: templates.length > 0 ? 'Select One' : ' No Template Available', value: ''},
            ...templates.map((t) => ({
                label: t.name,
                value: t.name,
            }))], [templates]);

    const optionsSecurityGroup = useMemo(() => [
        { label: securityGroups.length > 0 ? 'Security Group' : ' No Security Group Available', value: ''},
        ...securityGroups.map((s) => ({
            label: s.name,
            value: s.value,
        }))
    ], [securityGroups]);

    const fetchData = async () => {
        // TODO - Allan - Promise.all or Promise.allSettled
        setTemplates(await load(xmlTemplateService.getTemplates)('inquiry screen', ''));
        setCodeTypes(await load(entityService.getInquiryScreenTypes)());
        setStates(await load(entityService.getStateCodes)());
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setRenderGeneralCommponent(
            <GeneralComponent
                data={request}
                filteredOverrides={overridesList}
                setGeneralComponentState={(state) => {
                    setShowMessageOverride(false);
                    setGeneralComponentState(state);
                }}
                setOverridesList={setOverridesList}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
            />
        );
    }, [request.typeCode, showMessageOverride])

    useEffect(() => {
        fetchSecurity();
    }, [generalComponentState]);

    const fetchSecurity = async () => {
        if (generalComponentState &&
            (generalComponentState.code === OverrideEnumType.PCOMPANY.code ||
                generalComponentState.code === OverrideEnumType.SCOMPANY.code)) {
            setSecurityGroups(await load(entityService.getSecurityGroups)(generalComponentState.guid));
        }
    }

    const renderTypeCodeField = () => {
        return (
            <InputText
                type='custom-select'
                label="Level"
                value={request.typeCode}
                options={optionsLevel}
                onChange={(o: Options) => handleTypeCodeField(o.value)}
            />
        );
    };

    const renderStateField = () => {
        return (
            <InputText
                type='custom-select'
                label="State"
                value={request.stateCode}
                options={optionsState}
                onChange={(o: Options) => handleStateField(o.value)}
            />
        );
    };

    const renderTemplates = () => {
        return (
            <>
                <span style={{ color: 'orange' }}>
                    {showWarning && templates.length > 0 && request.templateName === ''
                        ? 'WARNING : Template was not selected.'
                        : ''}
                </span>
                <InputText
                    type='custom-select'
                    label="Template"
                    value={request.templateName}
                    options={optionsTemplate}
                    onChange={(o: Options) => handleTemplateChange(o.value)}
                />

            </>
        );
    };

    const renderSecurityGroupField = () => {
        return (
            <>
                <span style={{ color: 'orange' }}>
                    {showWarning ? 'WARNING : Security group was not selected.' : ''}
                </span>
                <InputText
                    type='custom-select'
                    label="Security Group"
                    value={request.securityGroupGuid}
                    options={optionsSecurityGroup}
                    onChange={(o: Options) => handleSecurityGroupField(o.value)}
                />
            </>
        );
    };

    const handleNameChanged = async (val: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.name = val;
            }),
        );
        setErrorValidation({ name: '' });
    };

    const handleTypeCodeField = async (code: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.typeCode = code;
            }),
        );
        setRenderGeneralCommponent(undefined);

        switch (code) {
            case '01':
            case '02':
                setOverridesList([
                    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
                    { name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code }
                ]);
                break;
            case '03':
                setOverridesList([
                    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
                    { name: OverrideEnumType.SCOMPANY.value, value: OverrideEnumType.SCOMPANY.code },
                    { name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code },
                    { name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code }
                ]);
                break;
            default:
                setOverridesList([])
                break;
        }
    };

    const handleTemplateChange = (value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.templateName = value;
            }),
        );
    };

    const handleSecurityGroupField = async (group: string) => {
        if (group) {
            setRequest(
                produce(request, (draft) => {
                    draft.securityGroupGuid = group;
                }),
            );
        }
    };

    const handleStateField = async (code: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.stateCode = code;
            }),
        );
    };

    const validateForm = () => {
        let isValid = true;
        const newError = new ErrorValidation();

        if(!request.name) {
            newError.name = MSG_REQUIRED_FIELD;
            isValid = false;
        }

        if(!isOverrideValid) {
            isValid = false;
        }

        setErrorValidation(newError);
        !isValid && setShowMessageOverride(true);
        return isValid;
    }
    const createInquiryScreen = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            if (templates.length > 0 && request.templateName === '') {
                warningVerification(e);
            } else if (request.securityGroupGuid == null) {
                warningVerification(e);
            } else {
                confirmCreation(e);
            }
        }
    };

    const warningVerification = (e: FormEvent<HTMLFormElement>) => {
        if (!showWarning) {
            setShowWarning(true);
        } else {
            confirmCreation(e);
        }
    }

    const confirmCreation = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowWarning(false);
        const inquiryScreen = await load(entityService.createInquiryScreen)(request);
        const entityInformation = await load(entityInformationService.getEntityInformation)(
            inquiryScreen.entityType,
            inquiryScreen.getGuid(),
            'XML_DATA',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
        closeRightbar();
    };

    return (
      <FrameworkComponent
            title='Create Inquiry Screen'
            loading={loading}
            onSubmit={createInquiryScreen}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        label="Inquiry Name"
                        value={request.name}
                        feedbackMsg={errorValidation.name}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChanged(e.target.value)}
                    />
                    {renderTypeCodeField()}
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'Overrides'} defaultOpened>
                <PanelSectionContainer>
                    {renderGeneralComponent}
                    {request.typeCode === POLICY_CODE && renderStateField()}
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'Settings'} defaultOpened>
                <PanelSectionContainer>
                    {renderTemplates()}
                    {renderSecurityGroupField()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

InquiryScreenCreationWizard.defaultProps = {
    xmlTemplateService: defaultXmlTemplateService,
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default InquiryScreenCreationWizard;

class ErrorValidation {
    name = '';
}