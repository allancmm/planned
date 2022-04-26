import { ValidSearchTableEnum, ValidSearchTable } from "./validSearchTableEnum";

const validSearchTables: ValidSearchTable[] = [
    {name: 'AS_FILES', displayName: "Files"},
    {name: 'BUSINESS_RULES', displayName: "Business Rules"},
    {name: 'CODES', displayName: "Codes"},
    {name: 'INQUIRY_SCREENS', displayName: "Inquiry Screens"},
    {name: 'MAP_GROUPS', displayName: "Map Groups"},
    {name: 'MASKS', displayName: "Masks"},
    {name: 'REQUIREMENT_DEFINITIONS', displayName: "Requirement Definitions"},
    {name: 'SEGMENT_NAMES', displayName: "Segments"},
    {name: 'TRANSACTIONS', displayName: "Transactions"}
]

export const SearchTableEnum = new ValidSearchTableEnum(validSearchTables); 

