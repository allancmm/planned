import React, {useContext} from 'react';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import DebuggerDataDocument from '../../../lib/domain/entities/sidebarData/debuggerData';
import { EntityLevel } from '../../../lib/domain/enums/entityLevel';
import EntityContextSelector from './entityContextSelector';
import { DebugFormContainer } from './style';

interface DefaultContextProps {}

const DefaultContext = ({}: DefaultContextProps) => {
    const { data, editSidebarData } = useContext(SidebarContext);

    if (!(data instanceof DebuggerDataDocument)) {
        return null;
    }

    return (
        <DebugFormContainer>
            <EntityContextSelector
                form={data.defaultContextForm}
                allLevels
                handleSelectEntityLevel={(e) => {
                    editSidebarData<DebuggerDataDocument>((draft) => {
                        draft.defaultContextForm.entityLevel = e.value as EntityLevel;
                        draft.defaultContextForm.entity = null;
                    });
                }}
                handleEntityChange={(val) =>
                    editSidebarData<DebuggerDataDocument>((draft) => {
                        draft.defaultContextForm.entity = val;
                    })
                }
            />
        </DebugFormContainer>
    );
};

export default DefaultContext;
