import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {IconButton} from '@material-ui/core';
import {Button} from '@equisoft/design-elements-react';
import {Dialog, Select, SelectOption, useDialog, WindowContainer} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {v4 as uuid} from 'uuid';
import FileHeader from '../../../components/editor/fileHeader';
import {FileHeaderContainer} from '../../../components/editor/fileHeader/style';
import {useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA} from '../../../components/editor/tabs/tabReducerTypes';
import {defaultEntitiesService} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import Currency from '../../../lib/domain/entities/currency';
import MarketMaker from '../../../lib/domain/entities/marketMaker';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import DataTable, {DataTableColumn} from '../../general/dataTable/table';
import {ActionIcon} from '../../packagingControl/style';
import {CellText} from '../code/style';

const CALENDAR_CODES = `AsCodeCalendar`;
const CURRENCY_ROUND_METHOD_CODES = 'AsCodeCurrencyRoundMethod';
const entityService = defaultEntitiesService;

const MarketMakerTab = ({ tabId }: { tabId: string }) => {
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();

    const [show, toggle] = useDialog();
    const [dialogProps, setDialogProps] = useState({});
    const [allCurrencies, setAllCurrency] = useState<Currency[]>([]);
    const [allCalendarCodes, setAllCalendarCodes] = useState<BasicEntity[]>([]);
    const [allCurrencyRoundMethodCodes, setAllCurrencyRoundMethodCodes] = useState<BasicEntity[]>([]);

    const {data} = tab;

    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { marketMakers, currencies } = data;

    useEffect(() => { entityService.getCurrencyCodes().then(setAllCurrency) }, []);
    useEffect(() => { entityService.getCodes(CALENDAR_CODES).then(setAllCalendarCodes) }, []);
    useEffect(() => { entityService.getCodes(CURRENCY_ROUND_METHOD_CODES).then(setAllCurrencyRoundMethodCodes) }, []);

    const openDialog = (element: ReactNode, onConfirm: () => void) => {
        toggle();
        setDialogProps({
            element,
            onConfirm,
        });
    };

    const closeDialog = () => {
        toggle();
        setDialogProps({});
    };

    const getDialogProps = () => {
        return {
            show,
            onClose: closeDialog,
            title: 'Confirmation Required',
            confirmPanel: true,
            element: <></>,
            ...dialogProps,
        };
    };

    const onConfirmDeletion = async (marketMaker: MarketMaker) => {
        if (!data.status.readOnly) {
            handleTableChange(marketMakers.filter((m) => m !== marketMaker));
        }
    };

    const baseCurrencyCodeCell = (row: MarketMaker):React.ReactNode => {
        return !data.status.readOnly ?
            <Select onChange={handleChange(row, 'BASE_CURRENCY_CODE')} options={getCurrencyCodes(row)} value={row.baseCurrencyCode} />
            : row.baseCurrencyCode
    };

    const crossRateCurrencyCodeCell = (row: MarketMaker):React.ReactNode => {
        return !data.status.readOnly ?
            <Select onChange={handleChange(row, 'CROSS_RATE_CURRENCY_CODE')} options={getCurrencyCodes(row)} value={row.crossRateCurrencyCode} />
            : row.crossRateCurrencyCode
    };

    const calendarCodeCell = (row: MarketMaker):React.ReactNode => {
        return !data.status.readOnly ?
            <Select onChange={handleChange(row, 'CALENDAR_CODE')} options={getCalendarCodes()} value={row.calendarCode} />
            : allCalendarCodes.length > 0 ? allCalendarCodes.filter(cc => cc.value === row.calendarCode)[0].name : row.calendarCode
    };

    const crossRateRoundMethodCell = (row: MarketMaker):React.ReactNode => {
        return !data.status.readOnly ?
            <Select onChange={handleChange(row, 'CROSS_RATE_ROUND_METHOD')} options={getCrossRateRoundMethods()}
                    value={row.crossRateRoundMethod} />
            : allCurrencyRoundMethodCodes.length > 0 ? allCurrencyRoundMethodCodes.filter(cc => cc.value === row.crossRateRoundMethod)[0].name
                : row.crossRateRoundMethod
    };

    const getCurrencyCodes = (currentMarketMaker: MarketMaker): SelectOption[] => {
        const select: SelectOption[] = allCurrencies
            .filter((currency: Currency) => currencies.findIndex(
                c => c.currencyCode === currency.currencyCode && c.currencyCode !== currentMarketMaker.baseCurrencyCode ) === -1)
            .map((currency: Currency) => ({ label: currency.currencyCode, value: currency.currencyCode }));
        select.unshift({label: "Select Currency Code"});
        return select;
    };

    const getCalendarCodes = (): SelectOption[] => {
        const select: SelectOption[] = allCalendarCodes.map((cc) => ({ label: cc.name, value: cc.value }));
        select.unshift({label: "Select Calendar Code"});
        return select;
    };

    const getCrossRateRoundMethods = (): SelectOption[] => {
        const select: SelectOption[] = allCurrencyRoundMethodCodes.map((c) => ({ label: c.name, value: c.value }));
        select.unshift({label: "Select Method"});
        return select;
    };

    const handleChange = (row: MarketMaker, changeType: string) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const TabDataMarketMaker = marketMakers.map(m => {
            if(m.marketMakerGuid === row.marketMakerGuid) {
                switch(changeType) {
                    case 'BASE_CURRENCY_CODE':
                        m.baseCurrencyCode = e.target.value;
                        break;
                    case 'CROSS_RATE_CURRENCY_CODE':
                        m.crossRateCurrencyCode = e.target.value;
                        break;
                    case 'CALENDAR_CODE':
                        m.calendarCode = e.target.value;
                        break;
                    case 'CROSS_RATE_ROUND_METHOD':
                        m.crossRateRoundMethod = e.target.value;
                        break;
                }
            }
            return m;
        })
        handleTableChange(TabDataMarketMaker);
    }

    const handleTableChange = (newMarketMakers: MarketMaker[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.marketMakers = newMarketMakers;
                }),
            },
        });
    };

    const columns: DataTableColumn[] = [
        { name: 'Name', selector: 'marketMakerName' },
        { name: 'Cross Round Places', selector: 'crossRateRoundPlaces' },
        { name: 'Cross Rate Round Method', selector: 'crossRateRoundMethod', cell: crossRateRoundMethodCell },
        { name: 'Cross Rate Currency Code', selector: 'crossRateCurrencyCode', cell: crossRateCurrencyCodeCell },
        { name: 'Base Currency Code', selector: 'baseCurrencyCode', cell: baseCurrencyCodeCell },
        { name: 'Calendar Code', selector: 'calendarCode', cell: calendarCodeCell },
        {name: 'Action', cell: (marketMaker: MarketMaker) => {
                return data.status.readOnly ? <CellText/> :
                    <IconButton aria-label="delete" size="small"
                                onClick={ () => openDialog(<div>Are you sure you want to delete this market maker row?</div>,
                                    () => onConfirmDeletion(marketMaker))}>
                        <ActionIcon  icon={ faTrashAlt } />
                    </IconButton>;
            }
        },
    ];

    const addRow = () => {
        if (!data.status.readOnly) {
            handleTableChange(
                produce(marketMakers, (draft) => {
                    const m = new MarketMaker();
                    m.marketMakerGuid= uuid();
                    draft.push(m);
                }),
            );
        }
    };

    return (
        <WindowContainer>
            <Dialog {...getDialogProps()} />
            <FileHeaderContainer>
                <FileHeader tabId={tabId} />
            </FileHeaderContainer>
            <DataTable
                columns={columns}
                data={marketMakers}
                keyColumn={'marketMakerGuid'}
                defaultSortColumn={'marketMakerName'}
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
}

export default MarketMakerTab;