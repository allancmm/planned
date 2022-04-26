import SecurityGroupRepository from '../domain/repositories/securityGroupRepository';
import AuthSecurity from "../domain/entities/authSecurity";

export default class SecurityGroupService {
    constructor(private securityGroupRepository: SecurityGroupRepository) { }

    getPlanTransactionSecurity = async (transactionGuid: string, securityGroupGuid: string): Promise<Object> => {
        return this.securityGroupRepository.getPlanTransactionSecurity(transactionGuid, securityGroupGuid);
    };

    getPlanProductTransactionSecurity = async (transactionGuid: string, planGuid: string, securityGroupGuid: string) =>
        this.securityGroupRepository.getPlanProductTransactionSecurity(transactionGuid, planGuid, securityGroupGuid);

    getProductTransactionSecurity = async (transactionGuid: string, securityGroupGuid: string) =>
        this.securityGroupRepository.getProductTransactionSecurity(transactionGuid, securityGroupGuid);

    getPlanSecurity = async (planGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getPlanSecurity(planGuid, securityGroupGuid);

    getPlanSecurityByParentPlan = async (parentPlanGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getPlanSecurityByParentPlan(parentPlanGuid, securityGroupGuid);

    getPlanSecurityInquiry = async (inquiryScreenNameGuid: string, planGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getPlanSecurityInquiry(inquiryScreenNameGuid, planGuid, securityGroupGuid);

    getCompanySecurityInquiry = async (inquiryScreenNameGuid: string, companyGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getCompanySecurityInquiry(inquiryScreenNameGuid, companyGuid, securityGroupGuid);

    getProductSecurityInquiry = async (inquiryScreenNameGuid: string, productGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getProductSecurityInquiry(inquiryScreenNameGuid, productGuid, securityGroupGuid);

    getCompanySecurity = async (parentPlanGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getCompanySecurity(parentPlanGuid, securityGroupGuid);

    getProductSecurity = async (productGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getProductSecurity(productGuid, securityGroupGuid);

    getPlanProduct = async (productGuid: string, planGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getPlanProduct(productGuid, planGuid, securityGroupGuid);

    getAuthMask = async (entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string): Promise<AuthSecurity[]> =>
        this.securityGroupRepository.getAuthMask(entityType, entityGuid, securityGroupGuid, childPlanGuid);

    getAuthField = async (entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string): Promise<AuthSecurity[]> =>
        this.securityGroupRepository.getAuthField(entityType, entityGuid, securityGroupGuid, childPlanGuid);

    getAuthMaskGlobal = async (entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string, companyGuid: string): Promise<AuthSecurity[]> =>
    this.securityGroupRepository.getAuthMaskGlobal(entityType, entityGuid, securityGroupGuid, childPlanGuid, companyGuid);

    getAuthFieldGlobal = async (entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string, companyGuid: string): Promise<AuthSecurity[]> =>
        this.securityGroupRepository.getAuthFieldGlobal(entityType, entityGuid, securityGroupGuid, childPlanGuid, companyGuid);

    getCompanySecurityAccess = async (companyGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getCompanySecurityAccess(companyGuid, securityGroupGuid);

    getAuthCompanyWebService = async (companyGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.securityGroupRepository.getAuthCompanyWebService(companyGuid, securityGroupGuid);
}
