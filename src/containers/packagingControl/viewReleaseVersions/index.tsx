import React, { useEffect, useState } from 'react';
import ReleaseService from '../../../lib/services/releaseService';
import Release from '../../../lib/domain/entities/release';
import { defaultReleaseService } from '../../../lib/context/index';
import Version from '../../../lib/domain/entities/version';

interface ViewReleaseVersions {
    releaseService: ReleaseService;
    release: Release;
}

const ViewReleaseVersions = ({ releaseService, release }: ViewReleaseVersions) => {
    const [versions, setVersions] = useState<Version[]>([]);

    useEffect(() => {
        fetchReleaseVersions();
    }, []);

    const fetchReleaseVersions = async () => {
        const versionsList = await releaseService.getVersionInRelease(release);
        setVersions(versionsList.versions);
    };

    return (
        <ul>
            {versions.map(v => (
                <li key={v.versionGuid}>
                    <div>
                        <p>
                            {v.rule.ruleName} | {v.rule.override.overrideName} | {v.versionNumber}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

ViewReleaseVersions.defaultProps = {
    releaseService: defaultReleaseService,
};

export default ViewReleaseVersions;
