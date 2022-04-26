import { ApiGateway } from '../config/apiGateway';
import SecurityGroupRepository from '../../domain/repositories/securityGroupRepository';
import AuthSecurity from "../../domain/entities/authSecurity";

export default class SecurityGroupApiRepository implements SecurityGroupRepository {
    constructor(private api: ApiGateway) { }

    getPlanTransactionSecurity = async (transactionGuid: string, securityGroupGuid: string): Promise<Object> => {
        return this.api.get(`/oipa/security/planTransaction?transactionGuid=${transactionGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });
    };

    getPlanProductTransactionSecurity = async (transactionGuid: string, planGuid: string, securityGroupGuid: string) =>
        this.api.get(`/oipa/security/planProductTransaction?transactionGuid=${transactionGuid}&planGuid=${planGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getProductTransactionSecurity = async (transactionGuid: string, securityGroupGuid: string) =>
        this.api.get(`/oipa/security/productTransaction?transactionGuid=${transactionGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getPlanSecurity = async (planGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.api.get(`/oipa/security/plan?planGuid=${planGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getPlanSecurityByParentPlan = async (parentPlanGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.api.get(`/oipa/security/parentPlan?planGuid=${parentPlanGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getPlanSecurityInquiry = async (inquiryScreenNameGuid: string, parentPlanGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.api.get(`/oipa/security/planInquiry?inquiryScreenNameGuid=${inquiryScreenNameGuid}&planGuid=${parentPlanGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getCompanySecurityInquiry = async (inquiryScreenNameGuid: string, companyGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.api.get(`/oipa/security/companyInquiry?inquiryScreenNameGuid=${inquiryScreenNameGuid}&companyGuid=${companyGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getProductSecurityInquiry = async (inquiryScreenNameGuid: string, productGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.api.get(`/oipa/security/productInquiry?inquiryScreenNameGuid=${inquiryScreenNameGuid}&productGuid=${productGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getCompanySecurity = async (companyGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.api.get(`/oipa/security/company?companyGuid=${companyGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getProductSecurity = async (productGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.api.get(`/oipa/security/product?productGuid=${productGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getPlanProduct = async (productGuid: string, planGuid: string, securityGroupGuid: string): Promise<Object> =>
        this.api.get(`/oipa/security/planProduct?productGuid=${productGuid}&planGuid=${planGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });

    getAuthMask = async (entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string): Promise<AuthSecurity[]> =>
        this.api.getArray(`/oipa/security/mask?entityType=${entityType}&entityGuid=${entityGuid}&securityGroupGuid=${securityGroupGuid}&childPlanGuid=${childPlanGuid}`,
            { outType: AuthSecurity });

    getAuthField = async (entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string): Promise<AuthSecurity[]> =>
        this.api.getArray(`/oipa/security/field?entityType=${entityType}&entityGuid=${entityGuid}&securityGroupGuid=${securityGroupGuid}&childPlanGuid=${childPlanGuid}`,
            {outType: AuthSecurity });

    getAuthMaskGlobal = async (entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string, companyGuid: string): Promise<AuthSecurity[]> =>
    this.api.getArray(`/oipa/security/mask?entityType=${entityType}&entityGuid=${entityGuid}&securityGroupGuid=${securityGroupGuid}&childPlanGuid=${childPlanGuid}&companyGuid=${companyGuid}`,
        { outType: AuthSecurity });

        getAuthFieldGlobal = async (entityType: string, entityGuid: string, securityGroupGuid: string, childPlanGuid: string, companyGuid: string): Promise<AuthSecurity[]> =>
    this.api.getArray(`/oipa/security/field?entityType=${entityType}&entityGuid=${entityGuid}&securityGroupGuid=${securityGroupGuid}&childPlanGuid=${childPlanGuid}&companyGuid=${companyGuid}`,
        {outType: AuthSecurity });

    getCompanySecurityAccess = async (companyGuid: string, securityGroupGuid: string): Promise<Object>  =>
        this.api.get(`/oipa/security/companyAccess?companyGuid=${companyGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });


    getAuthCompanyWebService = async (companyGuid: string, securityGroupGuid: string): Promise<Object>  =>
        this.api.get(`/oipa/security/companyWebService?companyGuid=${companyGuid}&securityGroupGuid=${securityGroupGuid}`,
            { outType: Object });
}
