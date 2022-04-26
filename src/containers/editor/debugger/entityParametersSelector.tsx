import { Button } from '@equisoft/design-elements-react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Grid, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    CollapseContainer,
    DateInput,
    Dialog,
    Loading,
    Select,
    SelectOption,
    useDialog,
    useLoading,
} from 'equisoft-design-ui-elements';
import { editor } from 'monaco-editor';
import React, { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { useTabWithId } from '../../../components/editor/tabs/tabContext';
import { MainContainer } from '../../../components/general';
import InputText from '../../../components/general/inputText';
import { defaultDebuggerEntitiesService, defaultEntitiesService } from '../../../lib/context';
import { APIError } from '../../../lib/domain/entities/apiError';
import Currency from '../../../lib/domain/entities/currency';
import DebuggerParameters from '../../../lib/domain/entities/debuggerParameters';
import MultifieldItem from '../../../lib/domain/entities/multifieldItem';
import ParameterItem from '../../../lib/domain/entities/parameterItem';
import InterpreterSession from '../../../lib/domain/entities/tabData/interpreterSession';
import { EntityType } from '../../../lib/domain/enums/entityType';
import DebuggerEntitiesService from '../../../lib/services/debuggerEntitiesService';
import EntityService from '../../../lib/services/entitiesService';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';
import { ActionIcon } from '../../packagingControl/style';
import MonacoContainer from '../monaco/monaco';
import { ParametersContainer } from './style';

interface EntityParametersSelectorProps {
    data: InterpreterSession;
    debuggerEntitiesService: DebuggerEntitiesService;
    interpreterEntityType: EntityType;
    defaultMultifieldsList: MultifieldItem[];
    defaultMultifieldsSource: string;
    entityService: EntityService;
    xmlMode?: boolean;
    tabId: string;
    layoutId: number;
    instance?: number;
    handleParametersChange(newPrameters: ParameterItem[]): void;
    handleMultifieldsParametersChange(newPrameters: ParameterItem[], sourceName: string): void;
    handleIndexChange(newPrameters: MultifieldItem[]): void;
    handleSourceChange(newSource: string): void;
    handelXMLMode(newParams: string): void;
    handelTableMode(newParams: DebuggerParameters): void;
    handleParametersChangeXMLFormat(newPrameters: DebuggerParameters): void;
}

const EntityParametersSelector = ({
    data,
    handleParametersChange,
    handleIndexChange,
    handleMultifieldsParametersChange,
    handleSourceChange,
    handelXMLMode,
    handelTableMode,
    handleParametersChangeXMLFormat,
    interpreterEntityType,
    defaultMultifieldsList,
    defaultMultifieldsSource,
    debuggerEntitiesService,
    entityService,
    xmlMode,
    tabId,
    layoutId,
    instance,
}: EntityParametersSelectorProps) => {
    const tab = useTabWithId(tabId);
    const [dialogProps, setDialogProps] = useState({});
    const [show, toggle] = useDialog();
    const [items, setItems] = useState<ParameterItem[]>([]);
    const [source, setSource] = useState<string>('');
    const [multifieldsList, setMultifieldsList] = useState<MultifieldItem[]>([]);
    const [defaultParams, setDefaultParams] = useState<ParameterItem[]>([]);
    const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);
    const [loading, load] = useLoading();

    const useStyles = makeStyles(() => ({
        input: {
            marginBottom: 0,
        },
    }));

    const classes = useStyles();

    const currencyCodes = useMemo(() => {
        return allCurrencies.map((simpleCurrency: Currency) => ({
            label: simpleCurrency.currencyCode,
            value: simpleCurrency.currencyCode,
        }));
    }, [allCurrencies]);

    useEffect(() => {
        setItems(
            data.useTestCase && data.testCase ? data.testCase.parametersTable : data.form?.params.parametersTable ?? [],
        );

        setMultifieldsList(
            data.useTestCase && data.testCase
                ? data.testCase.multifieldsIndex
                : data.form?.params.multifieldsIndex ?? [],
        );

        setSource(defaultMultifieldsSource);

        setDefaultParams(
            defaultMultifieldsList
                .find((c) => c.sourceName === defaultMultifieldsSource)
                ?.parameterItemList.filter((c) => c.index === 0) || [],
        );
    }, [data]);

    useEffect(() => {
        if (xmlMode) {
            loadParametersIntoXML();
        } else {
            loadParametersIntoTable();
        }
    }, [xmlMode]);

    const loadParametersIntoXML = load(async () => {
        if (data.useTestCase && data.testCase) {
            const listFetchInit = [
                debuggerEntitiesService
                    .getParametersXmlFromTable(
                        data.interpreterEntityType,
                        data.testCase.parametersTable,
                        data.testCase.multifieldsIndex,
                    )
                    .catch(() => ''),
            ];
            Promise.all(listFetchInit).then(([params]) => {
                handelXMLMode(params);
            });
        } else if (data.form) {
            const listFetchInit = [
                debuggerEntitiesService
                    .getParametersXmlFromTable(
                        data.interpreterEntityType,
                        data.form.params.parametersTable,
                        data.form.params.multifieldsIndex,
                    )
                    .catch(() => ''),
            ];
            Promise.all(listFetchInit).then(([params]) => {
                handelXMLMode(params);
            });
        }
    });

    const loadParametersIntoTable = async () => {
        const editorText = tab.model[0]?.getValue() ?? '';
        if (editorText !== '') {
            if (data.form) {
                try {
                    const listFetchInit = await debuggerEntitiesService.getParametersTableFromXML(
                        editorText,
                        data.interpreterEntityType,
                    );
                    handelTableMode(listFetchInit);
                } catch (error) {
                    const err = error as APIError;
                    toast.error(err);
                }
            }
        }
    };

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

    const onConfirmDeletion = (index: number, elementDelete: ParameterItem[]) => {
        const multifields = multifieldsList.find((c) => c.sourceName === source);
        if (multifields) {
            elementDelete.filter((cm) => {
                const num = multifields.parameterItemList.indexOf(cm);
                if (num > -1) {
                    multifields.parameterItemList.splice(num, 1);
                }
            });
            const indexToRemove = multifields.indexes.indexOf(index);

            if (indexToRemove > -1) {
                multifields.indexes.splice(indexToRemove, 1);
            }
            // decrement next indexes
            const newList: number[] = [];
            multifields.indexes.filter((cm) => {
                if (cm <= index) {
                    newList.push(cm);
                } else {
                    newList.push(cm - 1);
                }
            });
            multifields.indexes = newList;
            // decrement the parameters index
            multifields.parameterItemList.filter((cm) => {
                if (cm.index > index) {
                    const newIndex = cm.index - 1;
                    cm.index = newIndex;
                }
            });
        }
        handleIndexChange(multifieldsList);
    };

    useEffect(() => {
        entityService.getCurrencies().then(setAllCurrencies);
    }, []);

    const columns: DataTableColumn[] = [
        {
            name:
                interpreterEntityType === 'FUNCTIONS' || interpreterEntityType === 'EXPOSED_COMPUTATION'
                    ? 'Parameters'
                    : 'Activity Field',
            selector: 'activityField',
            isUnmodifiable: true,
        },
        { name: 'Data Type', selector: 'dataType', isUnmodifiable: true },
        {
            name: 'Value',
            selector: 'value',
            cell: (row: ParameterItem) =>
                row.dataType === 'DATE' ? (
                    <DateInput selected={row.dateValue} onChange={(d) => onDateValueChange(row, d as Date)} />
                ) : row.dataType === 'CURRENCY' && row.currency ? (
                    <Grid container>
                        <Grid item xs={8}>
                            <InputText
                                disabled={row.activityField === 'ActivityGUID'}
                                value={row.value}
                                classNameInput={classes.input}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    onParameterChange(row, e.currentTarget.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Select
                                onChange={onCurrencyCodeChange(row, false)}
                                options={currencyCodes}
                                value={row.currency?.currencyCode}
                                required
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <InputText
                        disabled={row.activityField === 'ActivityGUID'}
                        value={row.value}
                        classNameInput={classes.input}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onParameterChange(row, e.currentTarget.value)}
                    />
                ),
        },
    ];

    const columnsMultiFields: DataTableColumn[] = [
        {
            name: 'Index',
            selector: 'index',
            isUnmodifiable: true,
        },
        {
            name: 'Activity Field',
            selector: 'activityField',
            isUnmodifiable: true,
        },
        { name: 'Data Type', selector: 'dataType', isUnmodifiable: true },
        {
            name: 'Value',
            selector: 'value',
            cell: (row: ParameterItem) =>
                row.dataType === 'DATE' ? (
                    <DateInput
                        selected={row.dateValue}
                        onChange={(d) => onMultifieldParameterDateChange(row, d as Date)}
                    />
                ) : row.dataType === 'CURRENCY' && row.currency ? (
                    <Grid container>
                        <Grid item xs={8}>
                            <InputText
                                disabled={row.activityField === 'ActivityGUID'}
                                value={row.value}
                                classNameInput={classes.input}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    onMultifieldParameterChange(row, e.currentTarget.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Select
                                onChange={onCurrencyCodeChange(row, true)}
                                options={currencyCodes}
                                value={row.currency?.currencyCode}
                                required
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <InputText
                        disabled={row.activityField === 'ActivityGUID'}
                        value={row.value}
                        classNameInput={classes.input}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            onMultifieldParameterChange(row, e.currentTarget.value)
                        }
                    />
                ),
        },
    ];

    const onCurrencyCodeChange = (row: ParameterItem, isMultifield: boolean) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();

        if (isMultifield) {
            const multifields = multifieldsList.find((c) => c.sourceName === source)?.parameterItemList;
            if (multifields) {
                const params = multifields.map((c) => {
                    if (c.rowID === row.rowID && c.activityField === row.activityField && c.index === row.index) {
                        if (c.currency) {
                            c.currency.currencyCode = e.target.value;
                            c.currency.currencyName =
                                allCurrencies.find((sc) => sc.currencyCode === e.target.value)?.currencyName ||
                                c.currency.currencyName;
                        }
                    }
                    return c;
                });
                handleMultifieldsParametersChange(params, source);
            }
        } else {
            const params = items.map((c) => {
                if (c.rowID === row.rowID && c.activityField === row.activityField) {
                    if (c.currency) {
                        c.currency.currencyCode = e.target.value;
                        c.currency.currencyName =
                            allCurrencies.find((sc) => sc.currencyCode === e.target.value)?.currencyName ||
                            c.currency.currencyName;
                    }
                }
                return c;
            });
            handleParametersChange(params);
        }
    };

    const onDateValueChange = (row: ParameterItem, d: Date) => {
        const params = items.map((c) => {
            if (c.rowID === row.rowID && c.activityField === row.activityField) {
                c.dateValue = d;
            }
            return c;
        });
        handleParametersChange(params);
    };

    const onParameterChange = (row: ParameterItem, value: string) => {
        const params = items.map((c) => {
            if (c.rowID === row.rowID && c.activityField === row.activityField) {
                c.value = value;
            }
            return c;
        });
        handleParametersChange(params);
    };

    const onMultifieldParameterChange = (row: ParameterItem, value: string) => {
        const multifields = multifieldsList.find((c) => c.sourceName === source)?.parameterItemList;
        if (multifields) {
            const params = multifields.map((c) => {
                if (c.rowID === row.rowID && c.activityField === row.activityField && c.index === row.index) {
                    c.value = value;
                }
                return c;
            });
            handleMultifieldsParametersChange(params, source);
        }
    };

    const onMultifieldParameterDateChange = (row: ParameterItem, d: Date) => {
        const multifields = multifieldsList.find((c) => c.sourceName === source)?.parameterItemList;
        if (multifields) {
            const params = multifields.map((c) => {
                if (c.rowID === row.rowID && c.activityField === row.activityField && c.index === row.index) {
                    c.dateValue = d;
                }
                return c;
            });
            handleMultifieldsParametersChange(params, source);
        }
    };

    const addIndex = () => {
        const multifields = multifieldsList.find((c) => c.sourceName === source);
        if (multifields) {
            // when all indexes are removed we need to put the default params from xml
            if (multifields.indexes.length === 0) {
                const newList: ParameterItem[] = [];
                for (const rule of defaultParams) {
                    const newElement = { ...rule };
                    newElement.index = 0;
                    newList.push(newElement);
                }
                multifields.parameterItemList.push(...newList);

                multifields.indexes.push(0);
            } else {
                const maxIndex = multifields.indexes.length === 0 ? -1 : Math.max(...multifields?.indexes);
                const newIndex = maxIndex + 1;

                const newList: ParameterItem[] = [];
                for (const rule of defaultParams) {
                    const newElement = { ...rule };
                    newElement.index = newIndex;
                    newElement.rowID = uuid();
                    // exceptionnel case be cause the parameters are stored for testcase, not like simple form
                    if (data.useTestCase) {
                        newElement.value = getDefaultValueForTestParameter(newElement);
                        newElement.dateValue = new Date();
                    }
                    newList.push(newElement);
                }
                multifields.parameterItemList.push(...newList);
                multifields.indexes.push(newIndex);
            }

            handleIndexChange(multifieldsList);
        }
    };

    const getDefaultValueForTestParameter = (newElement: ParameterItem): string => {
        if (newElement.dataType === 'INTEGER') {
            return '0';
        } else if (newElement.dataType === 'DECIMAL') {
            return '0.0';
        }
        return '';
    };

    const buildFieldsTab = () => {
        return (
            <ParametersContainer>
                <DataTable
                    columns={columns}
                    data={items}
                    keyColumn={'rowID'}
                    defaultSortColumn={'index'}
                    hasSearchBar={false}
                />
            </ParametersContainer>
        );
    };

    const buildMultifielsTab = () => {
        const multifields = multifieldsList.find((c) => c.sourceName === source);
        if (multifields) {
            return multifields?.indexes.map((c) => (
                <CollapseContainer
                    title={'Index ' + c}
                    open
                    actions={
                        <div onClick={(e) => e.stopPropagation()} title="Delete index">
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() =>
                                    openDialog(<div>Are you sure you want to delete this index ?</div>, () =>
                                        onConfirmDeletion(
                                            c,
                                            multifields.parameterItemList.filter((cm) => cm.index === c),
                                        ),
                                    )
                                }
                            >
                                <ActionIcon icon={faTrashAlt} />
                            </IconButton>
                        </div>
                    }
                >
                    <ParametersContainer>
                        <DataTable
                            columns={columnsMultiFields}
                            data={multifields.parameterItemList.filter((cm) => cm.index === c)}
                            keyColumn={'rowID'}
                            defaultSortColumn={'index'}
                            hasSearchBar={false}
                        />
                    </ParametersContainer>
                </CollapseContainer>
            ));
        }
        return <></>;
    };

    const getMulrifieldsSources = (): SelectOption[] => {
        const sgs: SelectOption[] = multifieldsList.map((sg: MultifieldItem) => ({
            label: sg.sourceName,
            value: sg.sourceName,
        }));
        return sgs;
    };

    const onSourceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setSource(e.target.value);
        handleSourceChange(e.target.value);
        setDefaultParams(
            defaultMultifieldsList
                .find((c) => c.sourceName === e.target.value)
                ?.parameterItemList.filter((c) => c.index === 0) || [],
        );
    };

    const generateDefaultParameters: editor.IActionDescriptor[] = useMemo(
        () => [
            {
                id: 'unit-tests-generate-params',
                label: 'Generate default parameters',
                keybindings: [],
                contextMenuGroupId: '0_generate',
                contextMenuOrder: 0.5,
                run: load(async () => {
                    const params = await debuggerEntitiesService
                        .getParameters(
                            data.interpreterEntityType,
                            data.form?.entityLevel || 'NONE',
                            data.form?.entity?.guid ?? '',
                            data.interpreterRuleGuid,
                        )
                        .catch(() => new DebuggerParameters());
                    handleParametersChangeXMLFormat(params);
                    if (data.form?.entityType !== 'AS_FILE') {
                        handelTableMode(params);
                    }
                }),
            },
        ],
        [data],
    );
    const buildXmlCobtent = () => {
        if (!xmlMode) {
            return (
                <MainContainer>
                    <Dialog {...getDialogProps()} />
                    {buildFieldsTab()}
                    {data.form &&
                        (data.form.entityType === 'ACTIVITY' || data.form.entityType === 'TRANSACTIONS') &&
                        defaultMultifieldsList.length > 0 && (
                            <div>
                                <Select
                                    label=" Multifields Section:"
                                    options={getMulrifieldsSources()}
                                    value={source}
                                    onChange={onSourceChange}
                                />
                                <Button
                                    disabled={multifieldsList.length === 0}
                                    onClick={addIndex}
                                    buttonType="secondary"
                                >
                                    + Add Index
                                </Button>
                            </div>
                        )}
                    {data.form &&
                        (data.form.entityType === 'ACTIVITY' || data.form.entityType === 'TRANSACTIONS') &&
                        defaultMultifieldsList.length > 0 &&
                        buildMultifielsTab()}
                </MainContainer>
            );
        } else {
            return (
                <>
                    {xmlMode && (data.form?.params.parametersXml || data.testCase?.parameters) && (
                        <MonacoContainer
                            tabId={tabId}
                            layoutId={layoutId}
                            instance={instance}
                            modelInstance={0}
                            defaultValue={
                                data.useTestCase ? data.testCase?.parameters : data.form?.params.parametersXml
                            }
                            readOnly={data.useTestCase && !data.testCase?.name}
                            defaultActions={generateDefaultParameters}
                        />
                    )}
                </>
            );
        }
    };
    return (
        <>
            <Loading loading={loading} />
            {data.form?.entityType === 'AS_FILE' ? (
                <MonacoContainer
                    tabId={tabId}
                    layoutId={layoutId}
                    instance={instance}
                    modelInstance={0}
                    defaultValue={data.form?.params.parametersXml}
                    defaultActions={generateDefaultParameters}
                />
            ) : (
                buildXmlCobtent()
            )}
        </>
    );
};

EntityParametersSelector.defaultProps = {
    debuggerEntitiesService: defaultDebuggerEntitiesService,
    entityService: defaultEntitiesService,
};
export default EntityParametersSelector;
