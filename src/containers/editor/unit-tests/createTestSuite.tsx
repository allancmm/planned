import { Select, useLoading, Loading } from 'equisoft-design-ui-elements';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { Button } from "@equisoft/design-elements-react";
import { toast } from 'react-toastify';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { PanelTitle, PanelContentSection } from "../../../components/general/sidebar/style";
import { defaultDebuggerEntitiesService, defaultUnitTestService } from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import { EntityType } from '../../../lib/domain/enums/entityType';
import DebuggerEntitiesService from '../../../lib/services/debuggerEntitiesService';
import UnitTestService from '../../../lib/services/unitTestService';

interface CreateTestCaseProps {
    testData: any;
    unitTestService: UnitTestService;
    debuggerEntityService: DebuggerEntitiesService;
}

interface RequiredData {
    entityType: string;
}

function isRequiredData(object: any): object is RequiredData {
    return 'entityType' in object;
}

const CreateTestSuite = ({ unitTestService, debuggerEntityService, testData }: CreateTestCaseProps) => {
    const { toggleRefreshSidebar } = useContext(SidebarContext);
    const { closeRightbar } = useContext(RightbarContext);
    const [rule, setRule] = useState<BasicEntity>(new BasicEntity());
    const [rules, setRules] = useState<BasicEntity[]>([]);

    if (!isRequiredData(testData)) {
        toast('Fuck my life');
        return null;
    }

    const [loading, load] = useLoading();

    const fetchRules = load(async () => debuggerEntityService.getRules(testData.entityType as EntityType, 'NONE', ''));

    useEffect(() => {
        fetchRules().then(setRules);
    }, []);


    const handleRuleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newRule = rules.find((r) => r.value === e.target.value);
        setRule(newRule ?? new BasicEntity());
    };

    const createTestSuite = load(async () => unitTestService.createTestSuite(testData.entityType, rule.value, rule.name));

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await createTestSuite();
        toggleRefreshSidebar();
        closeRightbar();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Loading loading={loading} />

            <PanelTitle>Create Test Suite</PanelTitle>

            <PanelContentSection>
                <Select
                    value={rule.value}
                    onChange={handleRuleChange}
                    emptySelectText="Select One"
                    options={rules.map((r) => ({ label: r.name + ' (' + r.override + ')', value: r.value }))}
                />
                <Button type="submit" buttonType="primary" label="Create" />
            </PanelContentSection>
        </form>
    );
};

CreateTestSuite.defaultProps = {
    unitTestService: defaultUnitTestService,
    debuggerEntityService: defaultDebuggerEntitiesService,
};
export default CreateTestSuite;
