import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useDialog } from 'equisoft-design-ui-elements';
import ModalDialog from "../../../general/modalDialog";
import { Button } from "@equisoft/design-elements-react";
import { defaultScriptSqlService } from '../../../../lib/context';
import ResultSqlScript from '../../../../lib/domain/entities/resultSqlScript';
import EntityInformation from '../../../../lib/domain/entities/tabData/entityInformation';
import SqlScriptService from '../../../../lib/services/sqlScriptService';
import { ResultSqlContainer, RunBy, RunDate, RunScriptBlock } from './style';

interface SqlResultModelProps {
    entityInformation: EntityInformation;
    sqlScriptService: SqlScriptService;
}

const SqlResultModal = ({ entityInformation, sqlScriptService }: SqlResultModelProps) => {

    const [showResultScript, toggleResultScript] = useDialog();
    const [resultSql, setResultSql] = useState<ResultSqlScript>();
    const [infoSqlScript, setInfoSqlScript] = useState<ResultSqlScript>();
    const [hasAccessScript, setHasAccessScript] = useState<boolean>(true);

    useEffect(() => {
        fetchSqlScriptInfo(entityInformation.getGuid()).then(setInfoSqlScript);
    }, [resultSql]);

    useEffect(() => {
        fetchPermissionRunScript();
    }, []);

    const openSqlDialog = () => {
        executeSqlScript();
        if (entityInformation.status.status === 'checkIn') {
            toggleResultScript();
        }
    };

    const fetchResultScript = async (guid: string) => sqlScriptService.getResultSqlScript(guid);

    const fetchSqlScriptInfo = async (guid: string) => sqlScriptService.getSqlScriptinfo(guid);

    const fetchPermissionRunScript = async () => {
        setHasAccessScript(await sqlScriptService.hasAccessToRunSqlScript());
    };

    const executeSqlScript = async () => {
        const guid: string = entityInformation.getGuid();
        const result: ResultSqlScript = await fetchResultScript(guid);
        setResultSql(result);
    };

    const renderResultSqls = () => {
        return (
            <>
                <ResultSqlContainer>
                    <ul>
                        {resultSql?.result.map((sql, index) => {
                            return <li key={index}>{sql}</li>;
                        })}
                    </ul>
                </ResultSqlContainer>
            </>
        );
    };

    return (
        <>
            <RunScriptBlock>
                <Button buttonType="secondary" onClick={openSqlDialog} disabled={!hasAccessScript}>
                    Run Script
                </Button>
            </RunScriptBlock>
            <RunBy>RunBy:</RunBy>
            {infoSqlScript?.runBy}
            <RunDate>RunDate:</RunDate>
            {infoSqlScript?.runDate ? format(infoSqlScript.runDate, 'MM/dd/yyyy HH:mm:ss') : ''}
            <ModalDialog
                modalHeader="Result Sql Script"
                isOpen={showResultScript}
                onRequestClose={toggleResultScript}
                children={renderResultSqls()}
                confirmPanel={false}
            />
        </>
    );
};

SqlResultModal.defaultProps = {
    sqlScriptService: defaultScriptSqlService,
};

export default SqlResultModal;
