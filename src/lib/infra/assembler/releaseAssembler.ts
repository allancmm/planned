import { BuildIvsReleaseRequest } from '../request/buildIvsReleaseRequest';
import { BuildReleaseRequest, BuildCustomRequest, BuildTemplateRequest } from '../request/buildReleaseRequest';
import { DeployDetachedReleaseRequest } from '../request/deployDetachedReleaseRequest';
import { DeployIvsReleaseRequest } from '../request/deployIvsReleaseRequest';

export const toBuildIvsReleaseRequest = (request: BuildReleaseRequest): BuildIvsReleaseRequest => {
    const { sourceEnvironmentId, description, name, filters: {migrationSets} } = request;

    return { description, name, sourceEnvironmentId, migrationSets };
};

export const toBuildCustomReleaseRequest = (request: BuildReleaseRequest): BuildCustomRequest => {
    const {
        filters: { companyGuid, productGuid, planGuid, transactionGuid },
        ...req
    } = request;

    if (transactionGuid) return { ...req, filterType: 'TRANSACTION', filterGuid: transactionGuid };
    if (planGuid) return { ...req, filterType: 'PLAN', filterGuid: planGuid };
    if (productGuid) return { ...req, filterType: 'PRODUCT', filterGuid: productGuid };
    if (companyGuid) return { ...req, filterType: 'COMPANY', filterGuid: companyGuid };

    return {...req, filterType: 'COMPANY', filterGuid: ''};
};

export const toBuildTemplateReleaseRequest = (request: BuildReleaseRequest): BuildTemplateRequest => {
    return request;
};

export const toDeployIvsReleaseRequest = (target: string): DeployIvsReleaseRequest => {
    return { targetEnvironmentId: target };
};

export const toDeployDetachedReleaseRequest = (target: string, path?: string): DeployDetachedReleaseRequest => {
    return { targetEnvironmentId: target, releasePath: path };
};
