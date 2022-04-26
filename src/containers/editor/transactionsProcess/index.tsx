import { Button } from '@equisoft/design-elements-react';
import { createStyles, Divider, Grid, makeStyles } from '@material-ui/core';
import { GridColumns } from '@material-ui/data-grid';
import { Loading, Select, WindowContainer } from 'equisoft-design-ui-elements';
import React from 'react';
import DataGrid from '../../../components/general/dataGrid';
import { defaultEntitiesService, defaultSearchRulesService } from '../../../lib/context';
import EntityService from '../../../lib/services/entitiesService';
import SearchRulesService from '../../../lib/services/searchRulesService';
import { DataGridContainerTransaction } from '../securityData/style';
import { ButtonSubmitSection } from '../translations/style';
import useTransactionsProcessLogic from './useTransactionsProcessLogic';

const columns: GridColumns = [
    {
        headerName: 'Transaction Name',
        field: 'transactionName',
        flex: 0.4,
    },
    { headerName: 'Override', field: 'override', flex: 0.4 },
    { headerName: 'Processing Order', field: 'processOrder', flex: 0.2 },
];

interface TransactionsProcessProps {
    tabId: string;
    entityService: EntityService;
    searchRulesService: SearchRulesService;
}

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            margin: 0,
        },
        button: {
            position: 'relative',
        },
    }),
);
const TransactionsProcess = ({ tabId, entityService, searchRulesService }: TransactionsProcessProps) => {
    const { loading, plans, rows, setSelectedPlan, onClickSearch, requestSearch, searchText, selectedPlan } =
        useTransactionsProcessLogic(tabId, entityService, searchRulesService);

    const classes = useStyles();

    const displayPlans = () => {
        return (
            <Grid container spacing={6} className={classes.container}>
                <Grid item sm={4}>
                    <Select
                        label="Plans : "
                        options={plans}
                        value={selectedPlan}
                        emptySelectText="Select One"
                        required
                        onChange={(e) => setSelectedPlan(e.target.value)}
                    />
                </Grid>

                <Grid item sm={2} className={classes.button}>
                    <ButtonSubmitSection>
                        <Button buttonType="primary" label="Submit" onClick={onClickSearch} />
                    </ButtonSubmitSection>
                </Grid>
            </Grid>
        );
    };

    return (
        <WindowContainer>
            <Loading loading={loading} />
            {displayPlans()}
            <Divider />
            <DataGridContainerTransaction>
                <DataGrid
                    id="transactionGuid"
                    columns={columns}
                    rows={rows}
                    disableColumnMenu
                    searchText={searchText}
                    requestSearch={requestSearch}
                    isShowInputFilter
                    pageSize={15}
                    rowCount={rows.length}
                />
            </DataGridContainerTransaction>
        </WindowContainer>
    );
};

TransactionsProcess.defaultProps = {
    entityService: defaultEntitiesService,
    searchRulesService: defaultSearchRulesService,
};

export default TransactionsProcess;
