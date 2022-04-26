import React from 'react';
import MigrationSetSession from '../../../lib/domain/entities/tabData/migrationSetSession';
import MigrationHistoriesInSet from './migrationHistory';
import PackagesInSet from './packagesInSet';
import VersionInSet from './versionInSet';

const MigrationSetContent = ({ data, className = '' }: { data?: MigrationSetSession, className?: string }) => {
    return data instanceof MigrationSetSession ? (
        <div className={className}>
            <PackagesInSet pkgs={data.pkgs} />
            <VersionInSet versions={data.versions} />
            <MigrationHistoriesInSet migrationSet={data.set} />
        </div>
    ) : (
        <></>
    );
};

export default MigrationSetContent;
