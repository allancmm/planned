import React, {useContext} from 'react';
import {PanelTitle} from '../../components/general/sidebar/style';
import {AuthContext} from '../../page/authContext';
import ConfigPackages from './configPackages';
import MigrationSets from './migrationSet';
import ModifiedRules from './modifiedRules';
import Releases from './releases';

const PackagingControlPanel = () => {

    const {auth} = useContext(AuthContext);

    const filterSectionsByControlType = () => {
        if (auth.versionControlType.toUpperCase() === 'IVS') {
            return <>
                     <ModifiedRules/>
                     <ConfigPackages/>
                     <MigrationSets/>
                  </>;
        }
        return;
    };


    return (
        <>
            <PanelTitle>Packaging Control</PanelTitle>
            {filterSectionsByControlType()}
            <Releases />
        </>
    );
};

export default PackagingControlPanel;
