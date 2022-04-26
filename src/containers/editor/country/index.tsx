import { Button, WindowContainer, Select, SelectOption } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FileHeader from '../../../components/editor/fileHeader';
import { FileHeaderContainer } from '../../../components/editor/fileHeader/style';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import Country from '../../../lib/domain/entities/country';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';
import { defaultEntitiesService } from '../../../lib/context';
import Currency from '../../../lib/domain/entities/currency';

const TabCountry = ({ tabId }: { tabId: string }) => {
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();
    const entityService = defaultEntitiesService;
    const [allCountry, setAllCountry] = useState<Country[]>([]);
    const [allCurrency, setAllCurrency] = useState<Currency[]>([]);

    const { data } = tab;
    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const { countries, currencies } = data;
    useEffect(() => { entityService.getCountryCodes().then(setAllCountry) }, []);
    useEffect(() => { entityService.getCurrencyCodes().then(setAllCurrency) }, []);

    const countryCodeCell = (row: Country):React.ReactNode => {
        return !data.status.readOnly ? <Select
            onChange={onCountryCodeChange(row)}
            options={getCountryCodes(row)}
            value={row.countryCode}
            required
        /> : row.countryCode
    };

    const getCountryCodes = (currentCountry: Country): SelectOption[] => {
        const select: SelectOption[] = allCountry
        .filter((country: Country) => countries.findIndex(
            c => c.countryCode === country.countryCode &&
            c.countryCode !== currentCountry.countryCode
        ) === -1)
        .map((country: Country) => ({
            label: country.countryCode,
            value: country.countryCode,
        }));
        select.unshift({label:"Select Country Code"});
        return select;
    };

    const onCountryCodeChange = (row: Country) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const TabDataCountry = countries.map(
            c => {
                if(c.rowID === row.rowID){
                    c.countryCode = e.target.value;
                    c.countryLongName = allCountry.find(c1 => 
                        c1.countryCode === e.target.value
                    )?.countryLongName || c.countryLongName;
                    c.countryShortName = allCountry.find(c2 =>
                        c2.countryCode === e.target.value)
                        ?.countryShortName || c.countryShortName
                }

                return c;
            }
        )
        handleTableChange(TabDataCountry);
    };

    const currencyCodeCell = (row: Country):React.ReactNode => {
        return !data.status.readOnly ? <Select
            onChange={onCurrencyCodeChange(row)}
            options={getCurrencyCodes(row)}
            value={row.taxableCurrencyCode}
    /> : row.taxableCurrencyCode
    };

    const getCurrencyCodes = (currentCountry: Country): SelectOption[] => {
        const select: SelectOption[] =  allCurrency
        .filter((currency: Currency) => currencies.findIndex(
            c => c.currencyCode === currency.currencyCode &&
            c.currencyCode !== currentCountry.taxableCurrencyCode
        ) === -1)
        .map((currency: Currency) => ({
            label: currency.currencyCode,
            value: currency.currencyCode
        }));
        select.unshift({label: "Select Currency Code"});

        return select;
    };

    const onCurrencyCodeChange = (row: Country) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const TabDataCountry = countries.map(
            c => {
                if(c.rowID === row.rowID){
                    c.taxableCurrencyCode = e.target.value
                }
                return c;
            }
        )
        handleTableChange(TabDataCountry);
    }
    

    const columns: DataTableColumn[] = [
        { name: 'Country Code', selector: 'countryCode', cell: countryCodeCell},
        { name: 'Country Short Name', selector: 'countryShortName' , isUnmodifiable: true},
        { name: 'Country Long Name', selector: 'countryLongName' , isUnmodifiable: true},
        { name: 'Taxable Currency Code', selector: 'taxableCurrencyCode', cell:currencyCodeCell },
        { name: 'Calling Code', selector: 'callingCode' },
    ];

    const handleTableChange = (newCountries: Country[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.countries = newCountries;
                }),
            },
        });
    };

    const addRow = () => {
        if (!data.status.readOnly) {
            handleTableChange(
                produce(countries, (draft) => {
                    draft.push(new Country());
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
                data={countries}
                keyColumn={'rowID'}
                defaultSortColumn={'countryShortName'}
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

export default TabCountry;
