import AuthSecurity from "../entities/authSecurity";

export default interface SecurityGroupRepository {
    getPlanTransactionSecurity(transactionGuid: string, securityGroupGuid: string): Promise<Object>;
    getPlanProductTransactionSecurity(transactionGuid: string, planGuid: string, securityGroupGuid: string): Promise<Object>;
    getProductTransactionSecurity(transactionGuid: string, securityGroupGuid: string): Promise<Object>;
    getPlanSecurity(planGuid: string, securityGroupGuid: string): Promise<Object>;
    getPlanSecurityByParentPlan(parentPlanGuid: string, securityGroupGuid: string): Promise<Object>;
    getPlanSecurityInquiry(inquiryScreenNameGuid: string, planGuid: string, securityGuid: string): Promise<Object>;
    getCompanySecurityInquiry(inquiryScreenNameGuid: string, companyGuid: string, securityGroupGuid: string): Promise<Object>;
    getProductSecurityInquiry(inquiryScreenNameGuid: string, productGuid: string, securityGroupGuid: string): Promise<Object>;
    getCompanySecurity(companyGuid: string, securityGuid: string): Promise<Object>;
    getProductSecurity(productGuid: string, securityGuid: string): Promise<Object>;
    getPlanProduct(productGuid: string, planGuid: string, securityGroupGuid: string): Promise<Object>;
    getAuthMask(entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string): Promise<AuthSecurity[]>;
    getAuthField(entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string): Promise<AuthSecurity[]>;
    getAuthMaskGlobal(entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string, companyGuid: string): Promise<AuthSecurity[]>;
    getAuthFieldGlobal(entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string, companyGuid: string): Promise<AuthSecurity[]>;
    getCompanySecurityAccess(companyGuid: string, securityGroupGuid: string): Promise<Object>;
    getAuthCompanyWebService(companyGuid: string, securityGroupGuid: string): Promise<Object>;
}
