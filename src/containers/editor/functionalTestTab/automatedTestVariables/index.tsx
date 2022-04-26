import {Button} from "@equisoft/design-elements-react";
import {faPen, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {IconButton, Tooltip} from '@material-ui/core';
import {CollapseContainer} from 'equisoft-design-ui-elements';
import {Draft} from 'immer';
import React, {MouseEvent, useMemo, useState} from 'react';
import {toast} from 'react-toastify';
import FlexibleDataTable, {FlexibleDataTableColumn} from '../../../../components/general/sidebar/flexibleDataTable';
import {RightButtonWrapper} from '../../../../components/transactionTab/attachedRules/style';
import AutomatedTestCase from '../../../../lib/domain/entities/automatedTestItems/automatedTestCase';
import AutomatedTestVariable from '../../../../lib/domain/entities/automatedTestItems/automatedTestVariable';
import FunctionalTestSession from '../../../../lib/domain/entities/tabData/functionalTestSession';
import { ActionIcon, ButtonContent, CancelIcon, CheckIcon, InputCell, RightButton, TableContainer, VariablesTable } from './style';

const DEFAULT_TYPE = 'VALUE';
const DEFAULT_DATATYPE = 'TEXT';

interface AutomatedTestVariablesProps {
    automatedTestCase: AutomatedTestCase;
    updateSession(recipe: (draft: Draft<FunctionalTestSession>) => void): void;
}

const AutomatedTestVariables = ({ automatedTestCase, updateSession }: AutomatedTestVariablesProps) => {
    const [isVariableOpen, setIsVariableOpen] = useState(true);
    const [variableName, setVariableName] = useState('');
    const [variableValue, setVariableValue] = useState('');
    const isAddingVariable = useMemo(() => automatedTestCase.variables.some(v => v.add), [automatedTestCase.variables]);
    const isEditingVariable = useMemo(() => automatedTestCase.variables.some(v => v.edit), [automatedTestCase.variables]);

    const nameCell = (variable: AutomatedTestVariable) => variable.edit || variable.add ?
        <InputCell>
                <input type="text" autoFocus defaultValue={variable.name}
                   onClick={(e) => {
                       e?.stopPropagation();
                       e?.preventDefault();
                   }}
                   onChange={(e) => setVariableName(e?.target?.value)}/>
        </InputCell>
        : variable.name;

    const valueCell = (variable: AutomatedTestVariable) => variable.edit || variable.add ?
        <>
            <InputCell>
                <input type="text" defaultValue={variable.value}
                   onClick={(e) => {
                       e?.stopPropagation();
                       e?.preventDefault();
                   }}
                   onChange={(e) => setVariableValue(e?.target?.value)}/>
                <RightButton type="submit" buttonType="tertiary" onClick={() => {
                    if (variableName && variableValue) {
                        updateSession((draft) => {
                            const index = automatedTestCase.variables.indexOf(variable);
                            const currentVariable = draft.automatedTestCase.variables[index];
                            currentVariable.name = variableName;
                            currentVariable.value = variableValue;
                            if (!currentVariable.type) {
                                currentVariable.type = DEFAULT_TYPE;
                            }
                            if (!currentVariable.dataType) {
                                currentVariable.dataType = DEFAULT_DATATYPE;
                            }
                            currentVariable.edit = false;
                            currentVariable.add = false;
                        });
                    } else {
                        toast.error('Variable name and value cannot be empty');
                    }
                }}>
                    <CheckIcon/>
                </RightButton>
                <RightButton buttonType="tertiary" onClick={() => {
                    updateSession((draft) => {
                        const index = automatedTestCase.variables.indexOf(variable);
                        const currentVariable = draft.automatedTestCase.variables[index];
                        if (currentVariable.edit) {
                            currentVariable.edit = false;
                        } else {
                            draft.automatedTestCase.variables.splice(index, 1);
                        }
                    });
                }}>
                    <CancelIcon/>
                </RightButton>
            </InputCell>
        </>
        : variable.value

    const addVariable = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        createVariable();
    };

    const dataTableColumns: FlexibleDataTableColumn[] = [
        {
            name: 'Name',
            selector: 'name',
            cell: nameCell
        },
        {
            name: 'Value',
            selector: 'value',
            cell: valueCell
        },
    ];

    const createVariable = async () => {
        updateSession((draft) => {
            const variable = new AutomatedTestVariable();
            variable.add = true;
            draft.automatedTestCase.variables.push(variable);
        });
    }

    const editVariable = (v: AutomatedTestVariable) => {
        if (!isAddingVariable && !isEditingVariable) {
            updateSession((draft) => {
                const index = automatedTestCase.variables.indexOf(v);
                const currentVariable = draft.automatedTestCase.variables[index];
                currentVariable.edit = true;
                setVariableName(currentVariable.name);
                setVariableValue(currentVariable.value);
            });
        }
    };

    const removeVariable = (v: AutomatedTestVariable) => {
        const index = automatedTestCase.variables.indexOf(v);
        updateSession((draft) => {
            draft.automatedTestCase.variables.splice(index, 1);
        });
    };

    const actionsVariablesSection = () =>
        <div onClick={(e) => e.stopPropagation()}>
            <Button buttonType="tertiary"
                    onClick={addVariable}
                    disabled={!isVariableOpen || isAddingVariable || isEditingVariable} >+ Add
            </Button>
        </div>

    const actions = (variable: AutomatedTestVariable) =>
        (!isEditingVariable && ! isAddingVariable) ?
            <>
                <RightButtonWrapper>
                    <Tooltip title='Delete'>
                        <ButtonContent>
                            <IconButton aria-label="delete" size="small" onClick={() => removeVariable(variable)}>
                                <ActionIcon  icon={ faTrashAlt } />
                            </IconButton>
                        </ButtonContent>
                    </Tooltip>
                    <Tooltip title='Edit'>
                        <ButtonContent>
                            <IconButton aria-label="edit" size="small" onClick={() => editVariable(variable)}>
                                <ActionIcon  icon={ faPen } />
                            </IconButton>
                        </ButtonContent>
                    </Tooltip>
                </RightButtonWrapper>
            </>
            : <></>

    return (
        <CollapseContainer
            open={isVariableOpen}
            toggleOpen={() => setIsVariableOpen((prevState) => !prevState)}
            title='Variables'
            actions={actionsVariablesSection()}
        >
            <VariablesTable>
                <TableContainer>
                    <FlexibleDataTable
                        columns={dataTableColumns}
                        data={automatedTestCase.variables}
                        rowMapper={(v: AutomatedTestVariable) => ({
                            id: v.name,
                            columns: dataTableColumns,
                            value: v,
                            actionBar: actions(v),
                        })}
                    />
                </TableContainer>
            </VariablesTable>
        </CollapseContainer>
    );
};

export default AutomatedTestVariables;
