import { TypeCode } from "./typeCodeEnum";

export const ListTestStatus : TypeCode[] = [
    {code: '01', value: 'Success'},
    {code: '02', value: 'Not executed'},
    {code: '03', value: 'Failure'},
    {code: '04', value: 'Compilation failure'},
]

type TestStatusTypeCode = typeof ListTestStatus[number]['code'];

export const testStatusToDisplayName = (status: TestStatusTypeCode) =>
    ListTestStatus.find((item) => item.code === status)?.value ?? '';


export default TestStatusTypeCode;