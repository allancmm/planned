import { TypeCode, TypeCodeEnum } from "./typeCodeEnum";

export const ListSystemFile : TypeCode[] = [
    { code: 'COPY_SCHEMA', value: 'CopySchema.xml'},
    { code: 'DB_SCHEMA', value: 'DBSchema.xml'},
    { code: 'DDL_COMPOSE', value: 'DDLCompose.xml'},
    { code: 'SNIPPETS', value: 'Snippets.xml'},
    { code: 'TEST_DEFINITION', value: 'TestSuiteDefinition.xml'},
    { code: 'RELEASE_TEMPLATE', value: 'ReleaseTemplate.xml'},
];

export const SystemFileEnum = new TypeCodeEnum(ListSystemFile);

type SystemFileType = typeof ListSystemFile[number]['code'];

export default SystemFileType;