import React, {useEffect, useState} from 'react';
import { Loading, useLoading} from "equisoft-design-ui-elements";
import {TreeItem} from 'react-sortable-tree';
import { toast } from "react-toastify";
import InputText, {Options} from '../../../components/general/inputText';
import ModalDialog from '../../../components/general/modalDialog';
import {defaultAutomatedTestService} from '../../../lib/context';
import AutomatedTestSuite from '../../../lib/domain/entities/automatedTestItems/AutomatedTestSuite';
import AutomatedTestService from '../../../lib/services/automatedTestService';
import {SelectInput} from './style';

interface ModalAddToTestSuiteProps {
    onConfirm: Function,
    closeModal: Function,
    currentTestCase: TreeItem,
    automatedTestService: AutomatedTestService
}

const ModalAddToTestSuite = ({ onConfirm,  closeModal, currentTestCase, automatedTestService } : ModalAddToTestSuiteProps) => {
    const [testSuites, setTestSuites] = useState<AutomatedTestSuite[]>([]);
    const [selectedTestSuite, setSelectedTestSuite] = useState('')
    const [loading, load] = useLoading();

    useEffect(() => {
        fetchTestSuites();
    }, []);

    const fetchTestSuites = load(async ()  => {
        setTestSuites(await automatedTestService.getAutomatedTestSuites());
    });

    const updateTestSuite = load(async () => automatedTestService.updateTestSuite(selectedTestSuite, currentTestCase.id));

    const handleClickConfirm = async () => {
        if (selectedTestSuite.length === 0) {
            toast.error('Test suite must not be empty');
            return;
        }
        await updateTestSuite();
        toast.success("Testcase added successfully");
        closeModal();
        onConfirm();
    };

    return (
        <ModalDialog isOpen
                     onRequestClose={closeModal}
                     confirmButton={{
                         onConfirm: handleClickConfirm
                     }}
                     title="Add testcase to suite">
            <>
                <Loading loading={loading} />
                <SelectInput>
                    <InputText type="select"
                               label="Test suite"
                               value={selectedTestSuite}
                               options={testSuites.sort().map((t) => ({label: t.id, value: t.path}))}
                               placeholder="Select One"
                               onChange={(e: Options) => setSelectedTestSuite(e.value)}
                    />
                </SelectInput>
            </>
        </ModalDialog>);
}

ModalAddToTestSuite.defaultProps = {
    automatedTestService: defaultAutomatedTestService
};

export default ModalAddToTestSuite;