import { TypeCode } from "./typeCodeEnum";

export const ListReleaseReportStatus : TypeCode[] = [
    {code: '01', value: 'Success'},
    {code: '02', value: 'Warning'},
    {code: '03', value: 'Error'},
    {code: '', value: 'Undefined'}
]

type ReleaseReportStatusTypeCode = typeof ListReleaseReportStatus[number]['code'];

export const releaseReportStatusToDisplayName = (status: ReleaseReportStatusTypeCode) =>
    ListReleaseReportStatus.find((item) => item.code === status)?.value ?? '';


export default ReleaseReportStatusTypeCode;