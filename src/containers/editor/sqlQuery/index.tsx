import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { GridPageChangeParams } from '@material-ui/data-grid';
import {DataGrid, ModalDialog, XMLViewer, TabContainer } from "../../../components/general";
import {
    FileHeaderContainer,
    FileHeaderSection,
    FileHeaderLabel,
    FileHeaderValue, Actions,
} from "../../../components/editor/fileHeader/style";
import { SplitWrapper, WindowContainer, useLoading, Loading} from 'equisoft-design-ui-elements';
import { Button, useModal } from "@equisoft/design-elements-react";
import produce from 'immer';
import {toast} from 'react-toastify';
import {useLayoutWithId, useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA} from '../../../components/editor/tabs/tabReducerTypes';
import {defaultSqlQueryService} from '../../../lib/context';
import SqlQuerySession from '../../../lib/domain/entities/tabData/sqlQuerySession';
import SqlQueryService from '../../../lib/services/sqlQueryService';
import MonacoContainer from '../monaco/monaco';
import useStyles, { customTheme } from "./useStyles";

interface SqlQueryProps {
    tabId: string;
    layoutId: number;
    sqlQueryService: SqlQueryService;
}

const SqlQuery = ({tabId, layoutId, sqlQueryService}: SqlQueryProps) => {

    const tab = useTabWithId(tabId);
    const layout = useLayoutWithId(layoutId);
    const {data} = tab
    const dispatch = useTabActions();

    if (!(data instanceof SqlQuerySession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { queryResult, query, pageSize, xmlDataDisplayModal } = data;

    const { isModalOpen, closeModal, openModal } = useModal();

    const classes = useStyles();
    const [loading, load] = useLoading();

    const dispatchEditData = (newData: SqlQuerySession) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: newData
            }
        })
    }

    const dialogProps = () => ({
        isOpen: isModalOpen,
        onRequestClose: closeModal,
        title: "XML Data",
        confirmPanel: true,
        footerContent: <></>,
        children: <div className={classes.xmlContainer}><XMLViewer xml={xmlDataDisplayModal} /></div>
    });

    const handlePageSizeChange = (params: GridPageChangeParams) => {
        dispatchEditData(produce(data, (draft) => {
            draft.pageSize = params.pageSize
        }));
    };

    const getHeaders = (rows: Object[]) => {
        if(rows.length > 0) {
            return Object.getOwnPropertyNames(rows[0])
                .map(column => {
                    if(column.toLowerCase().includes('xml')) {
                        return createXMLDataColumn(column)
                    }
                    return { field: column, headerName: column.toUpperCase(), width: 300}
                })
        }
        return [];
    };

    const openModalXmlData = (xmlData: string) => {
        openModal();
        dispatchEditData(produce(data, (draft) => {
            draft.xmlDataDisplayModal = xmlData;
        }));
    }

    const createXMLDataColumn: any = (column: string) => {
        return {
            field: column,
            headerName: column.toUpperCase(),
            sortable: false,
            width: 150,
            disableClickEventBubbling: true,
            renderCell: (params: any) => {
                const xmlData = params.row[params.field];
                if(xmlData) {
                    const onClick = () => {
                        const xmlDataToDisplay = params.row[params.field].string === undefined ? params.row[params.field] : params.row[params.field].string
                        openModalXmlData(xmlDataToDisplay);
                    };
                    return <Button buttonType="secondary" onClick={onClick}>XML DATA</Button>;
                }
                return;
            }
        }
    }

    const getRowData = (rows: Object[]) => {
        if(rows.length > 0) {
            return rows.map((row: any, index: number) => {
                const rowWithId = {...row}
                rowWithId.id = index;
                return rowWithId;
            })
        }
        return [];
    }

    const executeQuery = async () => {
        const result =  JSON.parse(await load(sqlQueryService.getResultFromExecuteQuery)(query));
        dispatchEditData(produce(data, (draft) => {
            draft.queryResult = result;
        }));
    };

    const updateQuery = () => {
        const editorInstance: any = layout.editorInstance[0];
        const selectedQuery = editorInstance.getModel()?.getValueInRange(editorInstance.getSelection());
        dispatchEditData(produce(data, (draft) => {
            draft.query = selectedQuery || editorInstance.getValue();
        }));
    }

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <TabContainer className={classes.container}>
                <FileHeaderContainer>
                    <FileHeaderSection>
                        <div>
                            <FileHeaderLabel>Type:</FileHeaderLabel>
                            <FileHeaderValue>SQL Query</FileHeaderValue>
                        </div>
                        <Actions>
                            <Button buttonType="primary" onClick={executeQuery} disabled={loading}>Execute</Button>
                        </Actions>
                    </FileHeaderSection>
                </FileHeaderContainer>
            </TabContainer>
            <div className={classes.bodyContainer}>
                <SplitWrapper cursor={'col-resize'} direction={'vertical'} defaultSizes={[50, 50]}>
                    <MonacoContainer
                        tabId={tabId}
                        layoutId={layoutId}
                        lang={'sql'}
                        theme={'vs-dark'}
                        defaultValue={query}
                        onChangeContent={updateQuery}
                    />

                    <MuiThemeProvider theme={customTheme}>
                        <DataGrid
                            id='id'
                            density="compact"
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSizeChange}
                            rowsPerPageOptions={[5, 10, 20]}
                            columns={getHeaders(queryResult)}
                            rows={getRowData(queryResult)}
                            disableSelectionOnClick={false}
                            className={classes.dataGrid}
                        />
                    </MuiThemeProvider>
                </SplitWrapper>
            </div>
            <ModalDialog {...dialogProps()} />
        </WindowContainer>
    );
};

SqlQuery.defaultProps = {
    sqlQueryService: defaultSqlQueryService
};

export default SqlQuery;
