import { TreeItem } from 'react-sortable-tree';
import { v4 as uuid } from 'uuid';
import { getFolderType } from './folderType';

export const StructureRoot: TreeItem[] = [
    {
        id: 'ROOT',
        folderType: 'ROOT',
        title: 'Rules',
        expanded: true,
        isDirectory: true,
    },
];

export const EntityTreeRoot: TreeItem[] = [
    {
        id: getFolderType('BUSINESS_RULE')?.name,
        folderType: getFolderType('BUSINESS_RULE')?.name,
        title: getFolderType('BUSINESS_RULE')?.value,
        entityType: 'BUSINESS_RULES',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('TRANSACTION')?.name,
        folderType: getFolderType('TRANSACTION')?.name,
        title: getFolderType('TRANSACTION')?.value,
        entityType: 'TRANSACTIONS',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },

    {
        id: getFolderType('SEGMENT_NAME')?.name,
        folderType: getFolderType('SEGMENT_NAME')?.name,
        title: getFolderType('SEGMENT_NAME')?.value,
        entityType: 'SEGMENT_NAME',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('REQUIREMENT_DEFINITION')?.name,
        folderType: getFolderType('REQUIREMENT_DEFINITION')?.name,
        title: getFolderType('REQUIREMENT_DEFINITION')?.value,
        entityType: 'REQUIREMENT',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('INQUIRY_SCREEN')?.name,
        folderType: getFolderType('INQUIRY_SCREEN')?.name,
        title: getFolderType('INQUIRY_SCREEN')?.value,
        entityType: 'INQUIRY_SCREEN',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: uuid(),
        title: '',
        expanded: false,
        isDirectory: false,
        isSeparator: true,
        children: undefined,
    },
    {
        id: getFolderType('CODE')?.name,
        folderType: getFolderType('CODE')?.name,
        title: getFolderType('CODE')?.value,
        entityType: 'CODE',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('MAP_GROUP')?.name,
        folderType: getFolderType('MAP_GROUP')?.name,
        title: getFolderType('MAP_GROUP')?.value,
        entityType: 'MAP',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('RATE_GROUP')?.name,
        folderType: getFolderType('RATE_GROUP')?.name,
        title: getFolderType('RATE_GROUP')?.value,
        entityType: 'RATE',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('FUND')?.name,
        folderType: getFolderType('FUND')?.name,
        title: getFolderType('FUND')?.value,
        entityType: 'FUND',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('PLAN_STATE_APPROVAL')?.name,
        folderType: getFolderType('PLAN_STATE_APPROVAL')?.name,
        title: getFolderType('PLAN_STATE_APPROVAL')?.value,
        entityType: 'PLAN_STATE_APPROVAL',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: uuid(),
        title: '',
        expanded: false,
        isDirectory: false,
        isSeparator: true,
        children: undefined,
    },
    {
        id: getFolderType('FILE')?.name,
        folderType: getFolderType('FILE')?.name,
        title: getFolderType('FILE')?.value,
        entityType: 'AS_FILE',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('FILE_OUTPUT')?.name,
        folderType: getFolderType('FILE_OUTPUT')?.name,
        title: getFolderType('FILE_OUTPUT')?.value,
        entityType: 'FILEOUTPUT',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('EXPOSED_COMPUTATION')?.name,
        folderType: getFolderType('EXPOSED_COMPUTATION')?.name,
        title: getFolderType('EXPOSED_COMPUTATION')?.value,
        entityType: 'EXPOSED_COMPUTATION',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('AGREEMENT')?.name,
        folderType: getFolderType('AGREEMENT')?.name,
        title: getFolderType('AGREEMENT')?.value,
        entityType: 'AGREEMENT',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('INTAKE_PROFILE')?.name,
        folderType: getFolderType('INTAKE_PROFILE')?.name,
        title: getFolderType('INTAKE_PROFILE')?.value,
        entityType: 'INTAKE',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('PROGRAM_DEFINITION')?.name,
        folderType: getFolderType('PROGRAM_DEFINITION')?.name,
        title: getFolderType('PROGRAM_DEFINITION')?.value,
        entityType: 'PROGRAM_DEFINITION',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('QUOTE_DEFINITION')?.name,
        folderType: getFolderType('QUOTE_DEFINITION')?.name,
        title: getFolderType('QUOTE_DEFINITION')?.value,
        entityType: 'QUOTE_DEFINITION',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: uuid(),
        title: '',
        expanded: false,
        isDirectory: false,
        isSeparator: true,
        children: undefined,
    },
    {
        id: getFolderType('MASK')?.name,
        folderType: getFolderType('MASK')?.name,
        title: getFolderType('MASK')?.value,
        entityType: 'MASKS',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('WORKFLOWQUEUEROLE')?.name,
        folderType: getFolderType('WORKFLOWQUEUEROLE')?.name,
        title: 'Workflow Configuration',
        entityType: 'WORKFLOW',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('FILTER')?.name,
        folderType: getFolderType('FILTER')?.name,
        title: getFolderType('FILTER')?.value,
        entityType: 'FILTER',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('COMMENTS_TEMPLATE')?.name,
        folderType: getFolderType('COMMENTS_TEMPLATE')?.name,
        title: getFolderType('COMMENTS_TEMPLATE')?.value,
        entityType: 'COMMENTS_TEMPLATE',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('BATCH_SCREENS')?.name,
        folderType: getFolderType('BATCH_SCREENS')?.name,
        title: getFolderType('BATCH_SCREENS')?.value,
        entityType: 'BATCH_SCREENS',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('SQL_SCRIPT')?.name,
        folderType: getFolderType('SQL_SCRIPT')?.name,
        title: getFolderType('SQL_SCRIPT')?.value,
        entityType: 'SQL_SCRIPT',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('CHART_OF_ACCOUNTS')?.name,
        folderType: getFolderType('CHART_OF_ACCOUNTS')?.name,
        title: getFolderType('CHART_OF_ACCOUNTS')?.value,
        entityType: 'CHART_OF_ACCOUNTS',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: uuid(),
        title: '',
        expanded: false,
        isDirectory: false,
        isSeparator: true,
        children: undefined,
    },
    {
        id: getFolderType('PRIMARY_COMPANY')?.name,
        folderType: getFolderType('PRIMARY_COMPANY')?.name,
        title: getFolderType('PRIMARY_COMPANY')?.value,
        entityType: 'PRIMARY_COMPANY',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('SECONDARY_COMPANY')?.name,
        folderType: getFolderType('SECONDARY_COMPANY')?.name,
        title: getFolderType('SECONDARY_COMPANY')?.value,
        entityType: 'SECONDARY_COMPANY',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('PRODUCT')?.name,
        folderType: getFolderType('PRODUCT')?.name,
        title: getFolderType('PRODUCT')?.value,
        entityType: 'PRODUCT',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: getFolderType('PLAN')?.name,
        folderType: getFolderType('PLAN')?.name,
        title: getFolderType('PLAN')?.value,
        entityType: 'PLAN',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
    {
        id: uuid(),
        title: '',
        expanded: false,
        isDirectory: false,
        isSeparator: true,
        children: undefined,
    },
    {
        id: getFolderType('DATA_FILE')?.name,
        folderType: getFolderType('DATA_FILE')?.name,
        title: getFolderType('DATA_FILE')?.value,
        entityType: 'DATA_FILE',
        expanded: false,
        isDirectory: true,
        isSeparator: false,
    },
];

export const ProductRoot: TreeItem[] = [
    {
        id: 'Overview',
        folderType: 'OVERVIEW',
        title: 'Overview',
        isDirectory: true,
    },
    {
        id: 'PR_COMPANY',
        folderType: 'PRIMARY_COMPANY',
        title: 'My Company',
        isDirectory: true,
        isPrimStructure: true,
    },
    {
        id: 'PR_PRODUCT',
        folderType: 'PLAN',
        title: 'My Products',
        isDirectory: true,
        isPrimStructure: true,
    },
];
