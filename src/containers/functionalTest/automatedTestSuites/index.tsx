import {useModal} from "@equisoft/design-elements-react";
import {faFile} from '@fortawesome/free-solid-svg-icons';
import {Button, CollapseContainer, useDialog} from 'equisoft-design-ui-elements';
import {Draft} from 'immer';
import React, {ReactNode, useEffect, useState} from 'react';
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {ModalDialog} from '../../../components/general';
import {notifyError} from '../../../components/general/error';
import ActionNavButton from '../../../components/general/sidebar/actionNav/actionNavButton';
import {ActionNav, ActionNavItem, NavItem} from '../../../components/general/sidebar/actionNav/style';
import {defaultAutomatedTestService} from '../../../lib/context';
import {ErrorInformation} from '../../../lib/domain/entities/apiError';
import AutomatedTestSuite from '../../../lib/domain/entities/automatedTestItems/AutomatedTestSuite';
import FunctionalTestSuiteSession from '../../../lib/domain/entities/tabData/functionalTestSuiteSession';
import AutomatedTestService from '../../../lib/services/automatedTestService';
import {AddFolderIcon, CancelIcon, CheckIcon, RightButton} from '../automatedTestTree/style';
import {TestSuiteContainer, TestSuiteIcon, TestSuiteList} from './style';

interface AutomatedTestSuitesProps {
    automatedTestService: AutomatedTestService,
    testSuites: AutomatedTestSuite[],
    updateTestSuite(recipe: (draft: Draft<AutomatedTestSuite[]>) => void): void,
    setTestSuites(testSuites: AutomatedTestSuite[]): void;
}

const AutomatedTestSuites = ({ testSuites, updateTestSuite, setTestSuites, automatedTestService }: AutomatedTestSuitesProps) => {
    const [showMenu, toggleMenu] = useDialog();
    const [testSuiteName, setTestSuiteName] = useState('');
    const [dialogProps, setDialogProps] = useState({});
    const dispatch = useTabActions();

    useEffect(() => {
        fetchContent();
        if(!showMenu) {
            toggleMenu();
        }
    }, []);

    const fetchContent = async () => {
        setTestSuites(await automatedTestService.getAutomatedTestSuites());
    };

    const openTestSuite = (s: AutomatedTestSuite) => {
        const session = new FunctionalTestSuiteSession();
        session.testSuiteName = s.id;
        session.testSuitePath = s.path;
        dispatch({ type: OPEN, payload: { data: session } });
    };

    const titleInput = (value?: string) => {
        return <input type={'text'} autoFocus  defaultValue={value}
                      onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                      }}
                      onChange={(e) => setTestSuiteName(e.target.value)} />;
    }

    const actionBar = (s: AutomatedTestSuite) => {
        return (!showMenu && s?.htmlInput) ?
            <>
                <RightButton buttonType="tertiary" onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    cancelTestSuiteChange();
                }}>
                    <CancelIcon/>
                </RightButton>
                <RightButton type="submit" buttonType="tertiary" onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    submitTestSuiteChange();
                }}>
                    <CheckIcon/>
                </RightButton>
            </>
            : <ActionNav>
                <ActionNavItem>
                    <NavItem onClick={(e) => e?.stopPropagation()}>...</NavItem>
                    <ul>
                        <li>
                            <ActionNavButton
                                onClick={(e) => {
                                    e?.stopPropagation();
                                    processDeleteTestSuite(s);
                                }}
                                title='Delete'
                            />
                        </li>
                    </ul>
                </ActionNavItem>
            </ActionNav>
    }

    const cancelTestSuiteChange = async () => {
        updateTestSuite((draft) => {
            draft.pop()
        });
        setTestSuiteName('');
        toggleMenu();
    }

    const submitTestSuiteChange = async () => {
        if (!testSuiteName) {
            const errorInformation: ErrorInformation = {
                message: 'Test Suite name must be set',
                extraInformation: testSuiteName
            };
            notifyError(errorInformation);
            return;
        }

        if (validateUnicityTestSuiteName()) {
            const errorInformation: ErrorInformation = {
                message: 'Test Suite name is not unique',
                extraInformation: testSuiteName
            };
            notifyError(errorInformation);
            return;
        }

        await automatedTestService.createTestSuite(testSuiteName);
        updateTestSuite((draft) => {
            draft[draft.length - 1].htmlInput = null;
            draft[draft.length - 1].id = testSuiteName;
        });

        setTestSuiteName('');
        fetchContent();
        toggleMenu();
    }

    const validateUnicityTestSuiteName = () => {
        return testSuites.find(s => s.id === testSuiteName);
    }

    const createTestSuite = async () => {
        setTestSuiteName('');
        toggleMenu();
        updateTestSuite((draft) => {
            const ts = new AutomatedTestSuite();
            ts.htmlInput = titleInput('')
            draft.push(ts)
        });
    }

    const panelButton = () => {
        return (showMenu) ? <Button
                buttonType="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    createTestSuite();
                }}>
                <AddFolderIcon />
            </Button>
            : null;
    }

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const openDialog = (element: ReactNode, onConfirm: () => void) => {
        openModal();
        setDialogProps({
            children: element,
            confirmButton: { onConfirm },
            title: 'Confirmation Required',
        });
    };

    const closeDialog = () => {
        closeModal();
        setDialogProps({});
    };

    const getDialogProps = () => {
        return {
            isOpen: isModalOpen,
            onRequestClose: closeDialog,
            children: <></>,
            ...dialogProps,
        };
    };

    const deleteTestSuite = async (s: AutomatedTestSuite) => {
        await automatedTestService.deleteTestSuite(s.path);
        await fetchContent();
        closeDialog();
    };

    const processDeleteTestSuite = (s: AutomatedTestSuite) => {
        openDialog(
            <div>
                Are you sure you want to delete test suite <b>{s.id}</b> ?
            </div>,
            () => deleteTestSuite(s),
        );
    }

    return (
        <>
            <ModalDialog {...getDialogProps()} />
            <CollapseContainer title='Test Suites' defaultOpened actions={panelButton()}>
                <TestSuiteContainer>
                    {testSuites.length > 0 ? (
                            <TestSuiteList id="TestSuiteList">
                                {testSuites.map((s) => (
                                    <li key={s.id}>
                                        <div className={!s.htmlInput ? 'open-test-suite' : ''} onClick={() => !s.htmlInput ? openTestSuite(s) : undefined}>
                                            <TestSuiteIcon key="File" icon={faFile} color={'orange'} />
                                            <span>{s.htmlInput || s.id}</span>
                                        </div>
                                        <div>
                                            {actionBar(s)}
                                        </div>
                                    </li>
                                ))}
                            </TestSuiteList>
                        ) : <span>No records found.</span>
                    }
                </TestSuiteContainer>
            </CollapseContainer>
        </>
    );
};

AutomatedTestSuites.defaultProps = {
    automatedTestService: defaultAutomatedTestService,
};

export default AutomatedTestSuites;
