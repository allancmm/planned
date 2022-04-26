import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { useEffect, useMemo, useState } from 'react';
import Plan from '../../../lib/domain/entities/plan';
import { useLoading } from 'equisoft-design-ui-elements';
import TransactionProcess from '../../../lib/domain/entities/transactionProcess';
import { defaultEntitiesService, defaultSearchRulesService } from '../../../lib/context';
import produce, { Draft } from 'immer';
import TransactionProcessSession from '../../../lib/domain/entities/tabData/transactionProcessSession';
import { EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import { toast } from 'react-toastify';
import { getSearchRegex, Options } from '../../../components/general';

const emptyFunction = () => {};

class TransactionsProcessState {
    loading = false;
    plans :Options[] = [];
    rows: TransactionProcess[] = [];
    setSelectedPlan: Function = emptyFunction;
    onClickSearch: Function = emptyFunction;
    requestSearch: Function = emptyFunction;
    searchText = '';
    selectedPlan = '';
}
const useTransactionsProcessLogic = ( tabId: string,
                                      entityService= defaultEntitiesService,
                                      searchRulesService = defaultSearchRulesService) : TransactionsProcessState => {
    const tab = useTabWithId(tabId);
    const { data } = tab;
    const [allPlans, setAllPlans] = useState<Plan[]>([]);
    const [loading, load] = useLoading();
    const dispatch = useTabActions();
    const [rows, setRows] = useState<TransactionProcess[]>([]);

    if (!(data instanceof TransactionProcessSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return new TransactionsProcessState();
    }

    const { transactions, searchText, selectedPlan } = data;

    useEffect(() => {
        initPlans();
    }, []);

    useEffect(() => {
        setRows(transactions);
    }, [transactions]);

    const plans = useMemo(() =>
            allPlans.map((plan: Plan) => ({
                label: plan.planName,
                value: plan.planGuid,
            }))
        , [allPlans]);

    const updateData = (recipe: (draft: Draft<TransactionProcessSession>) => void) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, recipe),
            },
        });
    };

    const initPlans = load(async () => {
        const paramsResp = await Promise.all(await entityService.getAllPlans());
        setAllPlans(paramsResp.sort((a, b) => a.planName.localeCompare(b.planName)));
        if (selectedPlan !== '') {
            findTransactions();
        }
    });



    const setSelectedPlan = (value: string) => {
        updateData((draft) => {
            draft.selectedPlan = value;
        });
    };

    const onClickSearch = () => {
        if (selectedPlan !== '') {
            findTransactions();
        } else {
            toast.error('Select a Plan');
        }
    };

    const findTransactions = load(async () => {
        const response = await searchRulesService.getTransactionsProcessByPlanGuid(selectedPlan);

        updateData((draft) => {
            draft.transactions = response;
        });
    });

    const requestSearch = (value: string) => {
        dispatchUpdate(
            produce(data, (draft) => {
                draft.searchText = value;
            }),
        );

        const searchRegex = getSearchRegex(value);
        const filteredRows = transactions.filter((row: TransactionProcess) =>
            Object.keys(row).some((field) => {
                const keyLog = field as keyof Omit<TransactionProcess, '[unknown]'>;
                switch (keyLog) {
                    case 'transactionGuid':
                    case 'override':
                    case 'processOrder':
                        return null;
                    default:
                        return searchRegex.test(row[keyLog] as string);
                }
            }),
        );
        setRows(filteredRows);
    };

    const dispatchUpdate = (newData: TransactionProcessSession) => {
        dispatch({ type: EDIT_TAB_DATA, payload: { tabId, data: newData } });
    };

    return {
        loading, plans, rows, setSelectedPlan, onClickSearch, requestSearch, searchText, selectedPlan
    }
}

export default useTransactionsProcessLogic;
