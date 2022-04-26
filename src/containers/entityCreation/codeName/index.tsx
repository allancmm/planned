import React, {ChangeEvent, FormEvent, useContext, useState} from 'react';
import { CollapseContainer } from 'equisoft-design-ui-elements';
import produce from 'immer';
import { InputText } from "../../../components/general";
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import CreateCodeRequest from '../../../lib/domain/entities/createCodeRequest';
import EntityLockStatus, { STATUS_LOCKED } from '../../../lib/domain/entities/entityLockStatus';
import EntityStatus from '../../../lib/domain/entities/entityStatus';
import { RuleOverride } from '../../../lib/domain/entities/ruleOverride';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import { AuthContext } from '../../../page/authContext';
import {MSG_REQUIRED_FIELD} from "../../../lib/constants";
import FrameworkComponent from "../frameworkComponent";

interface CodeCreationProps {}

const CodeCreationWizard = ({ }: CodeCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const { auth } = useContext(AuthContext);

    const [request, setRequest] = useState<CreateCodeRequest>(new CreateCodeRequest());
    const [errorValidation, setErrorValidation] = useState('');

    const dispatch = useTabActions();
    const createCode = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!request.name) {
            setErrorValidation(MSG_REQUIRED_FIELD);
            return;
        }
        const data = new EntityInformation();
        data.fileType = 'CODE';
        data.entityType = 'CODE';
        const override = new RuleOverride();
        override.overrideName = 'GLOBAL';
        data.oipaRule.override = override;
        data.oipaRule.ruleGuid = request.name;
        data.oipaRule.ruleName = request.name;
        data.oipaRule.entityType = 'CODE';
        const checkedInStatus = new EntityStatus();
        checkedInStatus.status = 'checkOut'
        data.status = checkedInStatus;
        const lockStatus = new EntityLockStatus();
        lockStatus.status = STATUS_LOCKED;
        data.lockStatus = lockStatus;
        data.status.readOnly = false;
        data.status.user = auth.userName;
        dispatch({ type: OPEN, payload: { data: data } });

        closeRightbar();
    };

    const handleNameChanged = async (val: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.name = val;
            }),
        );
        setErrorValidation('');
    };

    return (
        <FrameworkComponent
            title='Create Code Name'
            loading={false}
            onSubmit={createCode}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        value={request.name}
                        label="Code Name"
                        feedbackMsg={errorValidation}
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChanged(e.target.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};
CodeCreationWizard.defaultProps = {};
export default CodeCreationWizard;