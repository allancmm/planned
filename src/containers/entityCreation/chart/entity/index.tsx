import { CollapseContainer, useLoading } from "equisoft-design-ui-elements";
import React, {FormEvent, useContext, useEffect, useMemo, useState} from "react";
import { InputText, Options } from "../../../../components/general";
import {useTabActions} from '../../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../../components/editor/tabs/tabReducerTypes';
import { PanelSectionContainer } from "../../../../components/general/sidebar/style";
import { defaultBasicEntityService, defaultEntitiesService, defaultEntityInformationService } from "../../../../lib/context";
import EntityService from "../../../../lib/services/entitiesService";
import EntityInformationService from "../../../../lib/services/entityInformationService";
import { RightbarContext } from "../../../../components/general/sidebar/rightbarContext";
import { toast } from "react-toastify";
import CreateChartAccountEntityRequest from "../../../../lib/domain/entities/createChartAccountEntityRequest";
import produce, {immerable} from "immer";
import BasicEntity from "../../../../lib/domain/entities/basicEntity";
import BasicEntityService from "../../../../lib/services/basicEntityService";
import {validateRequiredFields} from "../../util";
import FrameworkComponent from "../../frameworkComponent";

const entityCodeOptions: Options[] = [
    { label: 'Select One', value: ''},
    { label: 'Transactions', value: '01' },
    { label: 'Suspense', value: '02' },
];

type TypeFieldEntity = 'chartOfAccountsEntityCode' | 'transactionName' | 'chartOfAccountsGuid';

class ErrorEntity {
    [immerable] = true;
    chartOfAccountsEntityCode = '';
    transactionName = '';
    chartOfAccountsGuid = '';
}
interface EntityCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
    basicEntityService: BasicEntityService;
}

const EntityAccountCreationWizard = ({ entityService, basicEntityService }: EntityCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [loading, load] = useLoading();
    const [request, setRequest] = useState<CreateChartAccountEntityRequest>(new CreateChartAccountEntityRequest());
    const [chartAccounts, setChartAccounts] = useState<BasicEntity[]>([]);
    const [transactions, setTransactions] = useState<BasicEntity[]>([]);
    const [error, setError] = useState(new ErrorEntity());

    const optionsTransaction = useMemo(() =>
        [ {label: transactions.length > 0 ? 'Select Transaction name' : ' No Transaction Name Available', value: ''},
          ...Object.values(transactions).map((f) => ({
                label: f?.override || '',
                value: f.name,
            }))], [transactions]);

    const optionsChartAccount = useMemo(() =>
        [{label: chartAccounts.length > 0 ? 'Select Chart Of Account' : ' No Chart Of Account Available', value:''},
         ...Object.values(chartAccounts).map((f) => ({
                label: f.name,
                value: f.value,
            }))], [chartAccounts]);

    const fetchData = load(async () => {
        const [chartResp, transactionResp] = await Promise.allSettled([
            entityService.getChartAccounts(),
            basicEntityService.getAllTransactions()
        ]);
        setChartAccounts(chartResp.status === 'fulfilled' ? chartResp.value : [] );
        setTransactions(transactionResp.status === 'fulfilled' ? transactionResp.value : []);
    });

    useEffect(() => {
        fetchData();
    }, []);

    const validateForm = () => {
        const { isValid, newError} = validateRequiredFields(error, request);
        setError(newError);
        return isValid;
    }

    const createEntity = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()){
            return;
        }
        const entity = await entityService.createChartAccountEntity(request);
        if (entity != null) {
            dispatch({ type: OPEN, payload: { data: entity }});
            toast.success('Chart of account entity was created');
        }
        closeRightbar();
    });

    const handleFieldChanged = async (field: TypeFieldEntity, value: string) => {
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
            title='Create Chart of Account Entity'
            loading={loading}
            onSubmit={createEntity}
            onCancel={closeRightbar}
        >
            <CollapseContainer title="General" defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='custom-select'
                        value={request.chartOfAccountsEntityCode}
                        label="Chart Of Accounts Entity Code"
                        options={entityCodeOptions}
                        onChange={(o: Options) => handleFieldChanged('chartOfAccountsEntityCode', o.value)}
                        required
                        feedbackMsg={error.chartOfAccountsEntityCode}
                    />
                    <InputText
                        type='custom-select'
                        value={request.transactionName}
                        label="Transaction Name"
                        options={optionsTransaction}
                        onChange={(o: Options) => handleFieldChanged('transactionName', o.value)}
                        disabled={request.chartOfAccountsEntityCode === "02"}
                        required
                        feedbackMsg={error.transactionName}
                        numberOfItemsVisible={10}
                    />

                    <InputText
                        type='custom-select'
                        label="Chart Of Account"
                        value={request.chartOfAccountsGuid}
                        options={optionsChartAccount}
                        onChange={(o: Options) => handleFieldChanged('chartOfAccountsGuid', o.value)}
                        required
                        feedbackMsg={error.chartOfAccountsGuid}
                        numberOfItemsVisible={10}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

EntityAccountCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
    basicEntityService: defaultBasicEntityService,
};
export default EntityAccountCreationWizard;