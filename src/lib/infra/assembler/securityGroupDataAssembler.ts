import SecurityGroupDataDetail from "../../domain/entities/securityGroupDataDetail";
import SecurityGroupData from "../../domain/entities/securityGroupData";
import { EntityTypeSecurityGroup } from "../../domain/enums/entityTypeSecurityGroup";
import Access from "../../domain/enums/yesNo";

 const parseWithPageName = (securityGroupDataDetails: SecurityGroupDataDetail[]) => {
    const updateSecurity = new Map();
     securityGroupDataDetails.forEach(sgd => {
        if(!updateSecurity.has(sgd.pageName)) {
            updateSecurity.set(sgd.pageName, new Map())
        }
         updateSecurity.get(sgd.pageName).set(sgd.buttonName, sgd.access)
    });
    return updateSecurity;
}

 const parseWithoutPageName = (securityGroupDataDetails: SecurityGroupDataDetail[])  => {
        const securityDetail = new Map();
        securityGroupDataDetails.forEach(sgd =>
            securityDetail.set(sgd.buttonName,  sgd.access)
        );
        return Object.fromEntries(securityDetail);
    }

    export const buildSecurityGroupData = (securityGroupDataDetails: SecurityGroupDataDetail[],
                                           grantAccessAll: boolean,
                                           securityGuid: string,
                                           entityGuid: string,
                                           entityType: EntityTypeSecurityGroup,
                                           planGuid: string,
                                           overrideTypeCode: string,
                                           planOverride?: string,
                                           companyInquiryGuid?: string,
                                           planInquiryGuid?: string,
                                           productInquiryGuid?: string) : SecurityGroupData => {
        let securityDetail: any;
        switch (true) {
            case grantAccessAll:
                securityDetail = {};
                break;
            case entityType === 'TRANSACTIONS':
            case entityType === 'INQUIRY_SCREEN':
                securityDetail = parseWithoutPageName(securityGroupDataDetails);
                break;
            default:
                securityDetail = parseWithPageName(securityGroupDataDetails);
        }
        return new SecurityGroupData(securityGuid,
                                     entityGuid,
                                     planGuid,
                                     overrideTypeCode,
                                     securityDetail,
                         grantAccessAll ? Access.Yes : Access.No,
                                     planOverride,
                                     companyInquiryGuid,
                                     planInquiryGuid,
                                     productInquiryGuid);
    };