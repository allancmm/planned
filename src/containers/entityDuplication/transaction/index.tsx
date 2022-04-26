import React, { FormEvent, useContext, useEffect, useMemo, useState } from "react";
import produce from "immer";
import { Loading, TextInput, useLoading } from "equisoft-design-ui-elements";
import { Button } from "@equisoft/design-elements-react";
import { toast } from "react-toastify";
import { DuplicateTransaction } from "../../../lib/domain/entities/duplicateTransaction";
import { PanelTitle } from "../../../components/general/sidebar/style";
import { ButtonSection } from "../../../components/general";
import EntityDuplicateService from "../../../lib/services/entityDuplicateService";
import {
    defaultEntitiesService,
    defaultEntityDuplicateService,
    defaultEntityInformationService
} from "../../../lib/context";
import { RightbarContext } from "../../../components/general/sidebar/rightbarContext";
import { CheckoutSwitch } from "../general/checkout";
import { DuplicateContainer } from "../styles";
import GeneralComponent from "../../general/components/generalComponent";
import StateGeneralProps from "../../general/components/stateGeneralProps";
import CreateTransactionRuleRequest from "../../../lib/domain/entities/createTransactionRequest";
import { getOverrideFromDisplayName, OverrideEnumType } from "../../general/components/overrideEnum";
import { OPEN } from "../../../components/editor/tabs/tabReducerTypes";
import EntityInformationService from "../../../lib/services/entityInformationService";
import { useTabActions } from "../../../components/editor/tabs/tabContext";
import EntityService from "../../../lib/services/entitiesService";
import TransactionType from "../../../lib/domain/entities/transactionTypes";

const request = new CreateTransactionRuleRequest();

type TypeAllowTransaction = string | Boolean;

interface TransactionDuplicateProp {
    sourceTransaction: DuplicateTransaction;
    entityDuplicateService: EntityDuplicateService,
    entityInformationService: EntityInformationService,
    entityService: EntityService,
}

const TransactionDuplicate = ({ sourceTransaction, entityDuplicateService, entityInformationService, entityService }: TransactionDuplicateProp) => {
    const dispatch = useTabActions();

    const [loading, load] = useLoading();

    const { closeRightbar } = useContext(RightbarContext);

    const duplicateTransaction = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        transaction.overrideLevel = overridesList.find((o) => o.value === overrideLevelCode)?.name ?? '';
        const entitiesCreated = await entityDuplicateService.duplicateTransaction(transaction);
        for (const entity of entitiesCreated) {
            const entityInformation = await entityInformationService.getEntityInformation(
                entity.entityType,
                entity.getGuid(),
                'XML_DATA',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
        }
        toast.success('Transaction duplicated successfully');
        closeRightbar();
    });

    const [transaction, setTransaction] = useState<DuplicateTransaction>(sourceTransaction);

    const [overrideLevelCode, setOverrideLevelCode] = useState('');

    const [generalComponentState, setGeneralComponentState] = useState<StateGeneralProps>();

    const [ codeType, setCodeType ] = useState('');

    useEffect(() => {
        generalComponentState?.guid && onChange('overrideGuid', generalComponentState?.guid);
    }, [generalComponentState]);

    useEffect(() => {
        setTransaction(produce(transaction, (draft) => {
            draft.newEntityName = sourceTransaction.newEntityName;
            draft.createCheckedOut = sourceTransaction.createCheckedOut;
        }));
    }, [sourceTransaction.sourceEntityGuid]);

    const fetchTransactionTypeCode = load(async () => entityService.getTransactionTypeCode(transaction.sourceEntityGuid));

    useEffect(() => {
        fetchTransactionTypeCode().then((resp: TransactionType) => {
            setCodeType(resp.shortDescription);
        });
    }, []);

    const overridesList = useMemo(() => {
        const value = getOverrideFromDisplayName(transaction.overrideTypeCode) || 'BAD_GUID';
        switch (value) {
            case 'CLIENT':
            case 'COMPANY':
            case 'INTAKE':
                return [{ name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code }];
            case 'PLAN':
            case 'PRODUCT':
            case 'POLICY':
                return [
                    { name: OverrideEnumType.PRODUCT.value, value: OverrideEnumType.PRODUCT.code },
                    { name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code }
                ];
            default:
                return [];
        }
    }, [transaction.overrideTypeCode]);

    const onChange = (field: keyof DuplicateTransaction, value: TypeAllowTransaction) => {
        setTransaction(produce(transaction, (draft) => {
            (draft[field] as TypeAllowTransaction) = value;
        }));
    };

    return (
        <>
            <PanelTitle>Duplicate Transaction</PanelTitle>

            <DuplicateContainer onSubmit={duplicateTransaction}>
                <Loading loading={loading} />

                <TextInput
                    label="New Transaction Name"
                    defaultValue={transaction.newEntityName}
                    required
                    onChange={(e) => onChange('newEntityName', e.target.value)}
                />

                <TextInput
                    defaultValue={codeType}
                    label="Transaction Type Code"
                    required
                    onChange={() => { }}
                    disabled
                />

                <hr />

                <GeneralComponent
                    data={request}
                    warningMessage=''
                    filteredOverrides={overridesList}
                    setGeneralComponentState={setGeneralComponentState}
                    setOverrideLevelCode={setOverrideLevelCode}
                />
                <hr/>
                <CheckoutSwitch createCheckedOut={transaction.createCheckedOut} onChange={onChange} />

                <ButtonSection>
                    <Button buttonType="primary"
                        label='Save' />
                </ButtonSection>
            </DuplicateContainer>
        </>
    );
}

TransactionDuplicate.defaultProps = {
    entityDuplicateService: defaultEntityDuplicateService,
    entityInformationService: defaultEntityInformationService,
    entityService: defaultEntitiesService,
};

export default TransactionDuplicate;