import { Button, WindowContainer, Select, SelectOption } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FileHeader from '../../../components/editor/fileHeader';
import { FileHeaderContainer } from '../../../components/editor/fileHeader/style';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import Currency from '../../../lib/domain/entities/currency';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';
import { defaultEntitiesService } from '../../../lib/context';

const CurrencyCatalog = ({ tabId }: { tabId: string }) => {
    const NO_DUPLICATE = -1

    const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();
    const entityService = defaultEntitiesService;

    const { data } = tab;
    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const { currencies: currenciesInfoToDisplay } = data;
    useEffect(() => { entityService.getCurrencyCodes().then(setAllCurrencies) }, []);

    const columns: DataTableColumn[] = [
        {
            name: 'Currency Code',
            selector: 'currencyCode',
            cell: (row: Currency) =>
                !data.status.readOnly ?
                    <Select
                        onChange={onCurrencyCodeChange(row)}
                        options={getCurrencyCode(row)}
                        value={row.currencyCode}
                        required
                    />
                    :
                    row.currencyCode
        },
        { name: 'Currency Name', selector: 'currencyName' },
        { name: 'Display Round Places', selector: 'displayRoundPlaces' },
        { name: 'Currency Round Places', selector: 'currencyRoundPlaces' },
        { name: 'Currency Round Method', selector: 'currencyRoundMethod' },
    ];

    const getCurrencyCode = (actualCurrency: Currency): SelectOption[] => {
        return allCurrencies
            .filter((simpleCurrency: Currency) => currenciesInfoToDisplay.findIndex(c =>
                c.currencyCode === simpleCurrency.currencyCode &&
                c.currencyCode !== actualCurrency.currencyCode
            ) === NO_DUPLICATE)
        .map((simpleCurrency: Currency) => ({
            label: simpleCurrency.currencyCode,
            value: simpleCurrency.currencyCode,
        }));
    };

    const onCurrencyCodeChange = (row: Currency) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const tableOfCurrencies = currenciesInfoToDisplay.map(c => {
            if (c.rowID === row.rowID) {
                c.currencyCode = e.target.value
                c.currencyName = allCurrencies.find(sc => sc.currencyCode === e.target.value)?.currencyName || c.currencyName
            }
            return c
        })
        handleTableChange(tableOfCurrencies)
    };

    const handleTableChange = (newCurrencies: Currency[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.currencies = newCurrencies;
                }),
            },
        });
    };

    const addRow = () => {
        if (!data.status.readOnly) {
            handleTableChange(
                produce(currenciesInfoToDisplay, (draft) => {
                    draft.push(new Currency());
                }),
            );
        }
    };

    return (
        <WindowContainer>
            <FileHeaderContainer>
                <FileHeader tabId={tabId} />
            </FileHeaderContainer>
            <DataTable
                columns={columns}
                data={currenciesInfoToDisplay}
                keyColumn={'rowID'}
                defaultSortColumn={'currencyCode'}
                hasSearchBar
                isEditMode={!data.status.readOnly}
                updateTable={handleTableChange}
                actions={
                    <Button buttonType="tertiary" disabled={data.status.readOnly} onClick={addRow}>
                        + Add Row
                    </Button>
                }
            />
        </WindowContainer>
    );
};

export default CurrencyCatalog;