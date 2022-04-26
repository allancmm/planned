import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Grid, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
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
import { InputText, MainContainer } from '../../../components/general';
import { defaultDebuggerEntitiesService, defaultEntitiesService, defaultUnitTestService } from '../../../lib/context';
import { APIError } from '../../../lib/domain/entities/apiError';
import AssessmentDto from '../../../lib/domain/entities/assessmentDto';
import Currency from '../../../lib/domain/entities/currency';
import MockDto from '../../../lib/domain/entities/mockDto';
import InterpreterSession from '../../../lib/domain/entities/tabData/interpreterSession';
import TestDataResultDto from '../../../lib/domain/entities/testDataResultDto';
import { EntityType } from '../../../lib/domain/enums/entityType';
import DebuggerEntitiesService from '../../../lib/services/debuggerEntitiesService';
import EntityService from '../../../lib/services/entitiesService';
import UnitTestService from '../../../lib/services/unitTestService';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';
import { ActionIcon } from '../../packagingControl/style';
import MonacoContainer from '../monaco/monaco';

const dataType: SelectOption[] = [
    { label: 'DATE', value: 'DATE' },
    { label: 'TEXT', value: 'TEXT' },
    { label: 'INTEGER', value: 'INTEGER' },
    { label: 'FLOAT', value: 'FLOAT' },
    { label: 'CURRENCY', value: 'CURRENCY' },
];

const useStyles = makeStyles(() => ({
    input: {
        marginBottom: 0,
    },
}));

interface TableDataTabProps {
    data: InterpreterSession;
    debuggerEntitiesService: DebuggerEntitiesService;
    interpreterEntityType: EntityType;
    tabId: string;
    layoutId: number;
    instance?: number;
    unitTestService: UnitTestService;
    xmlModeForTestData?: boolean;
    entityService: EntityService;
    handelTestDataChange(table: TestDataResultDto): void;
    handleMocksChange(mocks: MockDto[]): void;
    handleAssessmentsChange(assessments: AssessmentDto[]): void;
    handelAddAssessment(): void;
    handelAddMock(): void;
}

const TableDataTab = ({
    tabId,
    layoutId,
    instance,
    data,
    unitTestService,
    xmlModeForTestData,
    entityService,
    handelTestDataChange,
    handleMocksChange,
    handleAssessmentsChange,
    handelAddAssessment,
    handelAddMock,
}: TableDataTabProps) => {
    const [loading, load] = useLoading();
    const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);
    const [mocks, setMocks] = useState<MockDto[]>([]);
    const [assessments, setAssessments] = useState<AssessmentDto[]>([]);
    const tab = useTabWithId(tabId);
    const [dialogProps, setDialogProps] = useState({});
    const [show, toggle] = useDialog();

    useEffect(() => {
        entityService.getCurrencies().then(setAllCurrencies);
    }, []);

    useEffect(() => {
        setMocks(data.testCase?.testDataTable.mocks || []);
        setAssessments(data.testCase?.testDataTable.assessments || []);
    }, [data.testCase?.testDataTable.mocks, data.testCase?.testDataTable.assessments]);

    const classes = useStyles();

    const currencyCodes = useMemo(() => {
        return allCurrencies.map((simpleCurrency: Currency) => ({
            label: simpleCurrency.currencyCode,
            value: simpleCurrency.currencyCode,
        }));
    }, [allCurrencies]);

    useEffect(() => {
        if (xmlModeForTestData) {
            loadTestDataXml();
        } else {
            loadTestDataIntoTable();
        }
    }, [xmlModeForTestData]);

    const loadTestDataXml = load(async () => {
        if (data.useTestCase && data.testCase) {
            try {
                const listFetchInit = [
                    unitTestService.generateMocksIntoXml(
                        data.testCase.testDataTable.assessments,
                        data.testCase.testDataTable.mocks,
                    ),
                ];
                Promise.all(listFetchInit).then(([params]) => {
                    handelTestDataChange(params);
                });
            } catch (error) {
                const err = error as APIError;
                toast.error(err);
            }
        }
    });

    const loadTestDataIntoTable = async () => {
        const editorText = tab.model[1]?.getValue() ?? '';
        if (editorText !== '') {
            if (data.testCase) {
                try {
                    const mock = await unitTestService
                        .generateMocksTables(editorText)
                        .catch(() => new TestDataResultDto());

                    mock.mocks.forEach((d) => (d.rowID = uuid()));
                    mock.assessments.forEach((d) => (d.rowID = uuid()));
                    mock.mocks.forEach((d) => {
                        if (d.dataType === 'CURRENCY' && d.currency === null) {
                            d.currency = allCurrencies.at(0);
                        }
                    });

                    handelTestDataChange(mock);
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

    const onConfirmDeletion = (dto: AssessmentDto) => {
        handleAssessmentsChange(assessments.filter((c) => c !== dto));
    };

    const onConfirmMockDeletion = (dto: MockDto) => {
        handleMocksChange(mocks.filter((c) => c !== dto));
    };

    const assessmentsCol: DataTableColumn[] = [
        {
            name: 'Label',
            selector: 'label',
        },
        {
            name: 'Observation',
            selector: 'observation',
        },
        {
            name: 'Expected Result',
            selector: 'expectedResult',
        },
        {
            name: 'Action',
            cell: (dto: AssessmentDto) => {
                return (
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() =>
                            openDialog(<div>Are you sure you want to delete this assessment row?</div>, () =>
                                onConfirmDeletion(dto),
                            )
                        }
                    >
                        <ActionIcon icon={faTrashAlt} />
                    </IconButton>
                );
            },
        },
    ];

    const mocksCol: DataTableColumn[] = [
        {
            name: 'Variable Name',
            selector: 'variableName',
        },
        {
            name: 'Data Type',
            selector: 'dataType',
            cell: (row: MockDto) => (
                <Select
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => onDataTypeChange(row, e.target.value)}
                    options={dataType}
                    value={row.dataType}
                    required
                />
            ),
        },
        {
            name: 'Value',
            selector: 'value',
            cell: (row: MockDto) =>
                row.dataType === 'DATE' ? (
                    <DateInput selected={row.dateValue} onChange={(d) => onDateValueChange(row, d as Date)} />
                ) : row.dataType === 'CURRENCY' && row.currency ? (
                    <Grid container>
                        <Grid item xs={8}>
                            <InputText
                                value={row.value}
                                classNameInput={classes.input}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    onMockChange(row, e.currentTarget.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Select
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    onCurrencyCodeChange(row, e.target.value)
                                }
                                options={currencyCodes}
                                value={row.currency?.currencyCode}
                                required
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <InputText
                        value={row.value}
                        classNameInput={classes.input}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onMockChange(row, e.currentTarget.value)}
                    />
                ),
        },
        {
            name: 'Action',
            cell: (dto: MockDto) => {
                return (
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() =>
                            openDialog(<div>Are you sure you want to delete this mock row?</div>, () =>
                                onConfirmMockDeletion(dto),
                            )
                        }
                    >
                        <ActionIcon icon={faTrashAlt} />
                    </IconButton>
                );
            },
        },
    ];

    const onDateValueChange = (row: MockDto, d: Date) => {
        const newMocks = mocks.map((c) => {
            if (c.rowID === row.rowID) {
                c.dateValue = d;
            }
            return c;
        });
        handleMocksChange(newMocks);
    };

    const onMockChange = (row: MockDto, newValue: string) => {
        const newMocks = mocks.map((c) => {
            if (c.rowID === row.rowID) {
                c.value = newValue;
            }
            return c;
        });
        handleMocksChange(newMocks);
    };

    const onMocksChange = (newMocks: MockDto[]) => {
        handleMocksChange(newMocks);
    };

    const onAssessmentsChange = (newAssessments: AssessmentDto[]) => {
        handleAssessmentsChange(newAssessments);
    };

    const onCurrencyCodeChange = (row: MockDto, value: string) => {
        const newMocks = mocks.map((c) => {
            if (c.rowID === row.rowID) {
                if (c.currency) {
                    c.currency.currencyCode = value;
                    c.currency.currencyName =
                        allCurrencies.find((sc) => sc.currencyCode === value)?.currencyName || c.currency.currencyName;
                }
            }
            return c;
        });
        handleMocksChange(newMocks);
    };

    const onDataTypeChange = (row: MockDto, value: string) => {
        const newMocks = mocks.map((c) => {
            if (c.rowID === row.rowID) {
                c.dataType = value;
                if (value === 'CURRENCY') {
                    c.currency = allCurrencies.at(0);
                }
            }
            return c;
        });
        handleMocksChange(newMocks);
    };

    const generateDefaultAssessments: editor.IActionDescriptor[] = useMemo(
        () => [
            {
                id: 'unit-tests-generate-assess',
                label: 'Generate basic mocks',
                keybindings: [],
                contextMenuGroupId: '0_generate',
                contextMenuOrder: 0.5,
                run: load(async () => {
                    if (data.testSuite && data.testCase) {
                        const mock = await unitTestService
                            .generateDefaultMocks(
                                data.interpreterEntityType,
                                data.testSuite.unitTestGuid,
                                data.testCase.name ?? 'no-case',
                            )
                            .catch(() => '');
                        const testData = await unitTestService
                            .generateMocksTables(mock)
                            .catch(() => new TestDataResultDto());
                        testData.mocks.forEach((d) => (d.rowID = uuid()));
                        testData.assessments.forEach((d) => (d.rowID = uuid()));
                        handelTestDataChange(testData);
                    } else {
                        toast.error('No test case selected');
                    }
                }),
            },
        ],
        [data],
    );

    return (
        <>
            <Loading loading={loading} />
            {xmlModeForTestData ? (
                <MonacoContainer
                    tabId={tabId}
                    layoutId={layoutId}
                    instance={instance}
                    modelInstance={1}
                    defaultValue={data.testCase?.testData}
                    readOnly={!data.testCase?.name}
                    defaultActions={generateDefaultAssessments}
                />
            ) : (
                <>
                    <MainContainer>
                        <Dialog {...getDialogProps()} />

                        <CollapseContainer title={'Assessments'} open>
                            <DataTable
                                columns={assessmentsCol}
                                data={data.testCase?.testDataTable.assessments || []}
                                keyColumn={'rowID'}
                                defaultSortColumn={'label'}
                                hasSearchBar={false}
                                isEditMode
                                updateTable={onAssessmentsChange}
                                actions={
                                    <Button buttonType="tertiary" onClick={handelAddAssessment}>
                                        + Add Row
                                    </Button>
                                }
                            />
                        </CollapseContainer>

                        <CollapseContainer title={'Mocks'} open>
                            <DataTable
                                columns={mocksCol}
                                data={data.testCase?.testDataTable.mocks || []}
                                keyColumn={'rowID'}
                                defaultSortColumn={'label'}
                                hasSearchBar={false}
                                isEditMode
                                updateTable={onMocksChange}
                                actions={
                                    <Button buttonType="tertiary" onClick={handelAddMock}>
                                        + Add Row
                                    </Button>
                                }
                            />
                        </CollapseContainer>
                    </MainContainer>
                </>
            )}
        </>
    );
};

TableDataTab.defaultProps = {
    debuggerEntitiesService: defaultDebuggerEntitiesService,
    unitTestService: defaultUnitTestService,
    entityService: defaultEntitiesService,
};

export default TableDataTab;
