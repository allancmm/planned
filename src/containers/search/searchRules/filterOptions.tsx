import { LoadMethod, Select, SelectOption } from 'equisoft-design-ui-elements';
import { Draft } from 'immer';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { defaultSearchRulesService } from '../../../lib/context';
import Company from '../../../lib/domain/entities/company';
import EntityFilter from '../../../lib/domain/entities/entityFilter';
import Plan from '../../../lib/domain/entities/plan';
import Product from '../../../lib/domain/entities/product';
import Transaction from '../../../lib/domain/entities/transaction';
import SearchRulesService from '../../../lib/services/searchRulesService';

interface FilterOptionsProps {
    data: EntityFilter;
    filterByTransaction?: boolean;

    searchRulesService: SearchRulesService;

    load: LoadMethod;
    editFilter(recipe: (d: Draft<EntityFilter>) => void): void;
}

const FilterOptions = ({ data, filterByTransaction, searchRulesService, editFilter, load }: FilterOptionsProps) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const { planGuid, productGuid, companyGuid, transactionGuid } = data;

    useEffect(() => {
        fetchCompanies();
        if (companyGuid) {
            fetchProducts(companyGuid);
        }
        if (productGuid) {
            fetchPlans(productGuid, companyGuid);
        }
        if (filterByTransaction) {
            fetchTransactions(productGuid, planGuid);
        }
    }, []);

    const fetchCompanies = load(async () => {
        const c: Company[] = await searchRulesService.getAllCompanies();
        setCompanies(c);
    });

    const fetchProducts = load(async (cGuid: string) => {
        if (cGuid !== '') {
            const p: Product[] = await searchRulesService.getProductsByCompanyGuid(cGuid);
            setProducts(p);
        } else {
            setProducts([]);
        }
    });

    const fetchPlans = load(async (pGuid: string, cGuid: string) => {
        if (pGuid !== '') {
            const p: Plan[] = await searchRulesService.getPlansByProductGuidOrCompanyGuid(pGuid, '');
            setPlans(p);
        } else if (cGuid !== '') {
            const p: Plan[] = await searchRulesService.getPlansByProductGuidOrCompanyGuid('', cGuid);
            setPlans(p);
        } else {
            setPlans([]);
        }
    });

    const fetchTransactions = load(async (proGuid: string, plGuid: string) => {
        if (plGuid !== '') {
            const t: Transaction[] = await searchRulesService.getTransactionsByPlanGuid(plGuid);
            setTransactions(t);
        } else if (proGuid !== '') {
            const t: Transaction[] = await searchRulesService.getTransactionsByProductGuid(proGuid);
            setTransactions(t);
        } else {
            setTransactions([]);
        }
    });

    const onCompanyChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        fetchProducts(e.target.value);
        fetchPlans('', e.target.value);
        editFilter((draft) => {
            draft.planGuid = '';
            draft.productGuid = '';
            draft.transactionGuid = '';
            draft.companyGuid = e.target.value;
        });
    };

    const getSelectableCompanies = (): SelectOption[] => {
        const selectableCompanies: SelectOption[] = companies.map((c: Company) => ({
            value: c.companyGuid,
            label: c.companyName,
        }));
        return selectableCompanies;
    };

    const onProductChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        fetchPlans(e.target.value, '');
        if (filterByTransaction) fetchTransactions(e.target.value, planGuid);
        editFilter((draft) => {
            draft.planGuid = '';
            draft.transactionGuid = '';
            draft.productGuid = e.target.value;
        });
    };

    const getSelectableProducts = (): SelectOption[] => {
        const selectableProducts: SelectOption[] = products.map((p: Product) => ({
            value: p.productGuid,
            label: p.productName,
        }));
        return selectableProducts;
    };

    const onPlanChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        if (filterByTransaction) fetchTransactions(productGuid, e.target.value);
        editFilter((draft) => {
            draft.transactionGuid = '';
            draft.planGuid = e.target.value;
        });
    };

    const getSelectablePlans = (): SelectOption[] => {
        const selectablePlans: SelectOption[] = plans.map((p: Plan) => ({
            value: p.planGuid,
            label: p.planName,
        }));
        return selectablePlans;
    };

    const onTransactionChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        editFilter((draft) => {
            draft.transactionGuid = e.target.value;
        });
    };

    const getSelectableTransactions = (): SelectOption[] => {
        const selectableTransactions: SelectOption[] = transactions.map((t: Transaction) => ({
            value: t.transactionGuid,
            label: t.transactionName,
        }));
        return selectableTransactions;
    };

    return (
        <>
            <Select
                label="Company"
                onChange={onCompanyChange}
                value={companyGuid}
                options={getSelectableCompanies()}
                emptySelectText='Select an option'
            />

            <Select
                label="Product"
                onChange={onProductChange}
                value={productGuid}
                options={getSelectableProducts()}
                emptySelectText='Select an option'
            />

            <Select
                label="Plan"
                onChange={onPlanChange}
                value={planGuid}
                options={getSelectablePlans()}
                emptySelectText='Select an option'
            />

            {filterByTransaction && (
                <Select
                    label="Transaction"
                    onChange={onTransactionChange}
                    value={transactionGuid}
                    options={getSelectableTransactions()}
                    emptySelectText='Select an option'
                />
            )}
        </>
    );
};

FilterOptions.defaultProps = {
    searchRulesService: defaultSearchRulesService,
};

export default FilterOptions;