import ChoiceGrantAccess, { YesNoType } from "../enums/yesNo";

type grantAccessAllType = YesNoType;

export default class SecurityGroupData {
    public entityGuid: string = '';
    public planGuid: string = '';
    public overrideTypeCode: string = '';
    public securityGroupGuid: string = '';
    public grantAccessAll: grantAccessAllType = ChoiceGrantAccess.No;
    public securityDetail: Object = {};
    public planOverride: string = '';
    public companyInquiryGuid: string = '';
    public planInquiryGuid: string = '';
    public productInquiryGuid: string = '';

    constructor(securityGroupGuid: string,
                entityGuid: string,
                planGuid: string,
                overrideTypeCode: string,
                securityDetail?: any,
                grantAccessAll?: grantAccessAllType,
                planOverride?: string,
                companyInquiryGuid?: string,
                planInquiryGuid?: string,
                productInquiryGuid?: string) {
        this.securityGroupGuid = securityGroupGuid;
        this.entityGuid = entityGuid;
        this.planGuid = planGuid;
        this.overrideTypeCode = overrideTypeCode;
        this.securityDetail = securityDetail || {};
        this.grantAccessAll = grantAccessAll || ChoiceGrantAccess.No;
        this.planOverride = planOverride || '';
        this.companyInquiryGuid = companyInquiryGuid || '';
        this.planInquiryGuid = planInquiryGuid || '';
        this.productInquiryGuid = productInquiryGuid || '';
    }
}
