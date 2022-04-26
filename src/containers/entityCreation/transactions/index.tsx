import { Button } from '@equisoft/design-elements-react';
import { Grid } from '@material-ui/core';
import { CollapseContainer, MultiSelect, useLoading } from 'equisoft-design-ui-elements';
import produce, { immerable } from 'immer';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { InputText, Label, Options } from '../../../components/general';
import useDebouncedSearch from '../../../components/general/hooks/useDebounceSearch';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import { MSG_REQUIRED_FIELD } from '../../../lib/constants';
import {
    defaultEntitiesService,
    defaultEntityInformationService,
    defaultXmlTemplateService,
} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import CreateTransactionRuleRequest, {
    AttachedRuleDto,
    TransactionMapDto,
} from '../../../lib/domain/entities/createTransactionRequest';
import TransactionProcessSession from '../../../lib/domain/entities/tabData/transactionProcessSession';
import TransactionEligibilityStatus from '../../../lib/domain/entities/transactionEligibilityStatus';
import TransactionType from '../../../lib/domain/entities/transactionTypes';
import XmlTemplate from '../../../lib/domain/entities/xmlTemplate';
import { EntityLevel } from '../../../lib/domain/enums/entityLevel';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import XmlTemplateService from '../../../lib/services/xmlTemplateService';
import GeneralComponent from '../../general/components/generalComponent';
import { OverrideEnumType } from '../../general/components/overrideEnum';
import StateGeneralProps from '../../general/components/stateGeneralProps';
import TemplateComponent from '../../general/components/templateComponent';
import FrameworkComponent from '../frameworkComponent';
import entityLevelLayout from './formEntityLevel';
import { AttachedRulesContainer, ProcessingOrderSection } from './style';

const eligibilityTypes: string[] = ['User', 'System'];
const defaultAttachedRules: string[] = ['TransactionBusinessRulePacket', 'TransactionCosmetics'];

interface TransactionCreationProps {
    xmlTemplateService: XmlTemplateService;
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const TransactionCreationWizard = ({
    entityService,
    xmlTemplateService,
    entityInformationService,
}: TransactionCreationProps) => {
    const dispatch = useTabActions();
    const { closeRightbar } = useContext(RightbarContext);
    const [loading, load] = useLoading();

    const [templates, setTemplates] = useState<XmlTemplate[]>([]);
    const [eligibilityStatuses, setEligibilityStatuses] = useState<TransactionEligibilityStatus[]>([]);
    const [translations, setTranslations] = useState<TransactionMapDto[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [securityGroups, setSecurityGroups] = useState<BasicEntity[]>([]);
    const [selectedAttachedRules, setSelectedAttachedRules] = useState<string[]>([]);
    const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
    const [debouncedTransactionName, setDebouncedTransactionName] = useState('');
    const [generalComponentState, setGeneralComponentState] = useState<StateGeneralProps>();

    const [renderGeneralComponent, setRenderGeneralComponent] = useState<React.ReactElement>();

    const [attachedRules, setAttachedRules] = useState<AttachedRuleDto[]>([]);
    const [request, setRequest] = useState<CreateTransactionRuleRequest>(new CreateTransactionRuleRequest());

    const [overridesList, setOverridesList] = useState<BasicEntity[]>([]);

    const useSearchTransactionName = () =>
        useDebouncedSearch((debouncedTransactionNameParam: string) => {
            setDebouncedTransactionName(debouncedTransactionNameParam);
        });

    const { inputText, setInputText } = useSearchTransactionName();

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [errorValidation, setErrorValidation] = useState<ErrorValidation>(new ErrorValidation());

    const optionsLevel = useMemo(
        () =>
            Object.values(entityLevelLayout).map((f) => ({
                label: f.label,
                value: f.value,
            })),
        [entityLevelLayout],
    );

    const optionsTypeCode = useMemo(
        () => [
            { label: transactionTypes.length > 0 ? 'Select Type Code' : ' No Type Code Available', value: '' },
            ...transactionTypes.map((t) => ({
                label: t.shortDescription,
                value: t.codeValue,
            })),
        ],
        [transactionTypes],
    );

    const optionsEligibilityType = useMemo(
        () => [
            { label: eligibilityTypes.length > 0 ? 'Select Eligibility Type' : ' No Type Code Available', value: '' },
            ...eligibilityTypes.map((el) => ({
                label: el,
                value: el,
            })),
        ],
        [eligibilityTypes],
    );

    const optionsEligibilityStatus = useMemo(
        () =>
            eligibilityStatuses.map((els, index) => ({
                id: index,
                label: `${els.codeValue} - ${els.shortDescription}`,
            })),
        [eligibilityStatuses],
    );

    const optionsTemplate = useMemo(
        () => [
            { label: templates.length > 0 ? 'Select One' : ' No Template Available', value: '' },
            ...templates.map((t) => ({
                label: t.name,
                value: t.name,
            })),
        ],
        [templates],
    );

    const optionsSecurityGroup = useMemo(
        () => [
            { label: securityGroups.length > 0 ? 'Security Group' : ' No Security Group Available', value: '' },
            ...securityGroups.map((s) => ({
                label: s.name,
                value: s.value,
            })),
        ],
        [securityGroups],
    );

    useEffect(() => {
        setRequest(
            produce(request, (draft) => {
                draft.transactionName = debouncedTransactionName;
            }),
        );
        handleNameChanged(debouncedTransactionName);
    }, [debouncedTransactionName]);

    useEffect(() => {
        setRenderGeneralComponent(
            <GeneralComponent
                data={request}
                setOverride={(overrideGuid, overrideLevel) =>
                    setRequest(
                        produce(request, (draft) => {
                            draft.overrideGuid = overrideGuid;
                            draft.overrideLevel = overrideLevel;
                        }),
                    )
                }
                filteredOverrides={overridesList}
                setGeneralComponentState={(state) => {
                    setShowMessageOverride(false);
                    setGeneralComponentState(state);
                }}
                setOverridesList={setOverridesList}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
            />,
        );
    }, [request.level, showMessageOverride]);

    useEffect(() => {
        fetchSecurity();
    }, [generalComponentState]);

    const fetchSecurity = async () => {
        if (
            generalComponentState &&
            (generalComponentState.code === OverrideEnumType.PCOMPANY.code ||
                generalComponentState.code === OverrideEnumType.SCOMPANY.code)
        ) {
            setSecurityGroups(await entityService.getSecurityGroups(generalComponentState.guid));
        }
    };

    const handleTemplateChange = (value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.templateName = value || undefined; // handle empty value
            }),
        );
    };

    const handleEligibilityStatusChange = (selected: string[]) => {
        setSelectedStatus(selected);

        const statues: { [key: string]: string } = {};
        selected.forEach((element) => {
            let [code, description] = element.split('-');
            code = code?.trim();
            description = description?.trim();
            statues[code] = description;
        });
        setRequest(
            produce(request, (draft) => {
                draft.eligibleStatus = statues;
            }),
        );
    };

    const handleAttachedRule = (selected: string[]) => {
        setSelectedAttachedRules(selected);
        setRequest(
            produce(request, (draft) => {
                draft.attachedRules = selected;
            }),
        );
    };

    const handleEligibilityTypeField = (eligibility: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.eligibityType = eligibility;
            }),
        );
    };

    const handleSecurityGroupField = (group: string) => {
        if (group) {
            setRequest(
                produce(request, (draft) => {
                    draft.securityGroupGuid = group;
                }),
            );
        }
    };

    const handleTransactionTypeField = (typeCode: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.typeCode = typeCode;
            }),
        );
    };

    const validateForm = () => {
        let isValid = true;
        const newError = new ErrorValidation();

        if (!request.transactionName) {
            newError.transactionName = MSG_REQUIRED_FIELD;
            isValid = false;
        }

        if (!request.level || request.level === 'NONE') {
            newError.level = MSG_REQUIRED_FIELD;
            isValid = false;
        }

        if (!request.processingOrder) {
            newError.processingOrder = MSG_REQUIRED_FIELD;
            isValid = false;
        }

        if (!isOverrideValid) {
            isValid = false;
        }

        setErrorValidation(newError);
        !isValid && setShowMessageOverride(true);
        return isValid;
    };
    const createTransaction = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (translations && validateForm()) {
            const finalAttachedRules = request.attachedRules;
            finalAttachedRules.push(...defaultAttachedRules);
            const newReq = produce(request, (draft) => {
                translations.forEach((translation) => {
                    draft.translations[translation.code] = translation.text;
                });
                draft.attachedRules = finalAttachedRules;
            });
            setRequest(newReq);

            const createdEntities = await entityService.createTransaction(newReq);
            for (const entity of createdEntities) {
                const entityInformation = await entityInformationService.getEntityInformation(
                    entity.entityType,
                    entity.getGuid(),
                    'XML_DATA',
                );
                dispatch({ type: OPEN, payload: { data: entityInformation } });
            }
            closeRightbar();
        }
    });

    const handleNameChanged = load(async (val: string) => {
        const [transResp, templateResp] = await Promise.allSettled([
            load(entityService.getTransactionTranslations)(val),
            load(xmlTemplateService.getTemplates)('Transaction', ''),
        ]);
        setTranslations(transResp.status === 'fulfilled' ? transResp.value : []);
        setTemplates(templateResp.status === 'fulfilled' ? templateResp.value : []);
    });

    // TODO - Allan - aggregate all states into one
    const handleProcessingOrderChanged = (val: number) => {
        setRequest(
            produce(request, (draft) => {
                draft.processingOrder = val;
            }),
        );

        setErrorValidation(
            produce(errorValidation, (draft) => {
                draft.processingOrder = '';
            }),
        );
    };

    const renderTranslations = () => {
        if (translations.length > 0) {
            const elements: any[] = [];
            for (let i = 0; i < translations.length; i++) {
                elements.push(
                    <InputText
                        type="text"
                        label={translations[i].code}
                        value={translations[i].text}
                        key={translations[i].code}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleTranslationChanged(e.target.value, i)}
                    />,
                );
            }
            return <div>{elements}</div>;
        }
        return;
    };

    const handleTranslationChanged = async (val: string, id: number) => {
        setTranslations(
            produce(translations, (draft) => {
                draft[id].text = val;
            }),
        );
    };

    const handleLevelChanged = load(async (o: Options) => {
        const value = o.value as EntityLevel;
        setRenderGeneralComponent(undefined);
        if (value) {
            setRequest(
                produce(request, (draft) => {
                    draft.level = value;
                    draft.overrideGuid = '';
                    draft.typeCode = '';
                    draft.attachedRules = [];
                    draft.eligibleStatus = {};
                }),
            );

            setSelectedStatus([]);
            setSelectedAttachedRules([]);

            switch (value) {
                case 'CLIENT':
                case 'COMPANY':
                case 'INTAKE':
                    setOverridesList([{ name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code }]);
                    break;
                case 'PLAN':
                case 'POLICY':
                    setOverridesList([
                        { name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code },
                        { name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code },
                    ]);
                    break;
                default:
                    setOverridesList([]);
                    break;
            }

            const [transResp, eligibilityResp, rulesResp] = await Promise.allSettled([
                load(entityService.getTransactionTypes)(value),
                load(entityService.getTransactionEligibilityStatuses)(),
                load(entityService.getLevelAttachedRules)(value),
            ]);

            setTransactionTypes(transResp.status === 'fulfilled' ? transResp.value : []);
            setEligibilityStatuses(eligibilityResp.status === 'fulfilled' ? eligibilityResp.value : []);
            setAttachedRules(rulesResp.status === 'fulfilled' ? rulesResp.value : []);
            setErrorValidation(
                produce(errorValidation, (draft) => {
                    draft.level = '';
                }),
            );
        }
    });

    const openProcessingOrder = () => {
        dispatch({ type: OPEN, payload: { data: new TransactionProcessSession(request?.overrideGuid || '') } });
    };

    return (
        <FrameworkComponent
            title="Create Transaction"
            loading={loading}
            onSubmit={createTransaction}
            onCancel={closeRightbar}
        >
            <CollapseContainer title="Name" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type="text"
                        value={inputText}
                        label="Transaction Name"
                        feedbackMsg={errorValidation.transactionName}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setErrorValidation(
                                produce(errorValidation, (draft) => {
                                    draft.transactionName = '';
                                }),
                            );
                            setInputText(e.target.value);
                        }}
                    />
                    <InputText
                        type="custom-select"
                        value={request.level}
                        label="Level"
                        feedbackMsg={errorValidation.level}
                        options={optionsLevel}
                        required
                        onChange={handleLevelChanged}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title="Override" defaultOpened>
                <PanelSectionContainer>{renderGeneralComponent}</PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title="Settings" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type="custom-select"
                        label="Type Code"
                        value={request.typeCode}
                        options={optionsTypeCode}
                        onChange={(o: Options) => handleTransactionTypeField(o.value)}
                    />
                    <Grid container spacing={3} alignContent="flex-start" alignItems="flex-start">
                        <Grid item sm={4}>
                            <InputText
                                value={request.processingOrder}
                                label="Processing order"
                                feedbackMsg={errorValidation.processingOrder}
                                required
                                type="number"
                                onChange={(value: string) => handleProcessingOrderChanged(parseInt(value, 10))}
                            />
                        </Grid>

                        <Grid item sm={8}>
                            {request.overrideLevel === 'PLAN' && request.overrideGuid !== '' && (
                                <ProcessingOrderSection>
                                    <Button type="button" buttonType="secondary" onClick={openProcessingOrder}>
                                        see processing order
                                    </Button>
                                </ProcessingOrderSection>
                            )}
                        </Grid>
                    </Grid>

                    {request.level === 'POLICY' && (
                        <>
                            <InputText
                                type="custom-select"
                                label="Eligibility Type"
                                value={request.eligibityType || ''}
                                options={optionsEligibilityType}
                                onChange={(o: Options) => handleEligibilityTypeField(o.value)}
                            />

                            <>
                                <Label text="Eligibility Status" />
                                <MultiSelect
                                    name=""
                                    items={optionsEligibilityStatus}
                                    selectedItems={selectedStatus}
                                    onChange={handleEligibilityStatusChange}
                                />
                            </>
                        </>
                    )}
                </PanelSectionContainer>
            </CollapseContainer>

            {translations.length > 0 && (
                <CollapseContainer title="Translations">
                    <PanelSectionContainer>{renderTranslations()}</PanelSectionContainer>
                </CollapseContainer>
            )}

            {attachedRules.length > 0 && (
                <CollapseContainer title="Attached Rules">
                    <AttachedRulesContainer>
                        <Label text="Attached Rules" />
                        <MultiSelect
                            name=""
                            items={attachedRules.map((rule) => ({
                                id: attachedRules.indexOf(rule),
                                label: rule.name,
                            }))}
                            selectedItems={selectedAttachedRules}
                            onChange={handleAttachedRule}
                        />
                    </AttachedRulesContainer>
                </CollapseContainer>
            )}

            {templates.length > 0 && (
                <CollapseContainer title="Template">
                    <PanelSectionContainer>
                        <TemplateComponent
                            name={request.templateName}
                            options={optionsTemplate}
                            disabled={templates.length === 0}
                            onChange={handleTemplateChange}
                        />
                    </PanelSectionContainer>
                </CollapseContainer>
            )}

            <CollapseContainer title="Security">
                <PanelSectionContainer>
                    <InputText
                        type="custom-select"
                        label="Security Group"
                        value={request.securityGroupGuid || ''}
                        options={optionsSecurityGroup}
                        onChange={(o: Options) => handleSecurityGroupField(o.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

TransactionCreationWizard.defaultProps = {
    xmlTemplateService: defaultXmlTemplateService,
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default TransactionCreationWizard;

class ErrorValidation {
    [immerable] = true;
    transactionName = '';
    level = '';
    processingOrder = '';
}
