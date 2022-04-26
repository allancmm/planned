import dedent from 'ts-dedent';
import { Snippet } from './contextSnippets';

export const MathVariablesSnippets: Snippet[] = [
    {
        name: 'MathLoop',
        details: 'Add MathLoop',
        snippet: dedent(`
            <MathLoop VARIABLENAME="\${1:Loop}" TYPE="FOR" ITERATIONS="\${2:NumberOfIteration}">
                <MathVariable VARIABLENAME="LoopIndex" TYPE="LOOPINDEX" SOURCEARRAY="Loop" DATATYPE="INTEGER"/>			
            </MathLoop>
        `),
    },
    {
        name: 'SegmentLoop',
        details: 'Add SegmentLoop',
        snippet: dedent(`
            <MathLoop VARIABLENAME="\${1:SegmentLoop}" TYPE="SEGMENT" POLICY="\${2:[Policy:PolicyGUID]}">
                <MathVariable VARIABLENAME="SegmentGUID" TYPE="SEGMENTFIELD" SOURCEARRAY="SegmentLoop" DATATYPE="TEXT">SegmentGUID</MathVariable>
            </MathLoop>
        `),
    },
    {
        name: 'RoleLoop',
        details: 'Add RoleLoop',
        snippet: dedent(`
            <MathLoop VARIABLENAME="\${1:RoleLoop}" TYPE="OBJECTLOOP" OBJECTNAME="Role" CONDITION="\${2:PolicyGUID = '[Policy:PolicyGUID]}' AND StatusCode = '01'" KEY="RoleGUID">
                <MathVariable VARIABLENAME="RoleLoopObject" TYPE="OBJECT" OBJECTNAME="Role" SOURCEARRAY="RoleLoop" DATATYPE="OBJECT"/>
                <MathVariable VARIABLENAME="ClientGUID" TYPE="OBJECTFIELD" OBJECTNAME="Role" SOURCEOBJECT="RoleLoopObject" DATATYPE="TEXT">ClientGUID</MathVariable>
            </MathLoop>
        `),
    },
    {
        name: 'ClientLoop',
        details: 'Add ClientLoop',
        snippet: dedent(`
            <MathLoop VARIABLENAME="\${1:ClientLoop}" TYPE="OBJECTLOOP" OBJECTNAME="Client" CONDITION="\${1:ClientGUID = '[ClientGUID]'}" KEY="ClientGUID">
                <MathVariable VARIABLENAME="ClientLoopObject" TYPE="OBJECT" OBJECTNAME="Client" SOURCEARRAY="ClientLoop" DATATYPE="OBJECT"/>
                <MathVariable VARIABLENAME="InsuredDateOfBirth" TYPE="OBJECTFIELD" OBJECTNAME="Client" SOURCEOBJECT="ClientLoopObject" DATATYPE="DATE">DateOfBirth</MathVariable>
            </MathLoop>
        `),
    },
    {
        name: 'ExitLoop',
        details: 'Add ExitLoop',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:ExitLoopWhen}" TYPE="EXIT-LOOP" IF="\${2:1=1}"/>
        `),
    },
    {
        name: 'MathIF',
        details: 'Add MathIF',
        snippet: dedent(`
            <MathIF IF="\${1}">
            </MathIF>
        `),
    },
    {
        name: 'CopyBook',
        details: 'Add CopyBook',
        snippet: dedent(`
            <CopyBook>CopyBook-\${1}</CopyBook>
        `),
    },
    {
        name: 'Spawn Array',
        details: 'Add Spawn Array',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:SpawnActivityArray}" TYPE="ACTIVITYARRAY" OPERATION="CREATE" DATATYPE="ACTIVITY">0</MathVariable>
            <MathVariable VARIABLENAME="\${2:SpawnActivity}" TYPE="ACTIVITY" OPERATION="CREATE" DATATYPE="ACTIVITY">\${3:'TransactionName'}</MathVariable>
            <MathVariable VARIABLENAME="\${2:SpawnActivity}" TYPE="ACTIVITY" OPERATION="SETVALUE" FIELDNAME="EffectiveDate" DATATYPE="DATE">\${4:EffectiveDateVariable}</MathVariable>
            <MathVariable VARIABLENAME="\${1:SpawnActivityArray}" TYPE="ACTIVITYARRAY" OPERATION="APPEND" SOURCEARRAY="ScheduledActivitySpawnArray" DATATYPE="ACTIVITY">\${2:SpawnActivity}</MathVariable>
        `),
    },
    {
        name: 'Collections-Create',
        details: 'Create a collection',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="COLLECTION" OPERATION="CREATE" DATATYPE="MAP"/>
        `),
    },
    {
        name: 'Collections-Filled by SQL',
        details: 'Fill a collection with a SQL-Query',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="COLLECTION" DATATYPE="MAP">\${2:SELECT DUMMY, DUMMY FROM DUAL}</MathVariable>
        `),
    },
    {
        name: 'Collections-Set Value',
        details: 'Set Value in a collection',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="COLLECTION" OPERATION="SETVALUE" KEY="\${2:KeyVariable}" DATATYPE="TEXT">\${3:VariableToSet}</MathVariable>
        `),
    },
    {
        name: 'Collections-Get Value',
        details: 'Get Value in a collection',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:NewVariableToGetValue}" TYPE="COLLECTIONVALUE" KEYFIELD="\${2:KeyVariable}" DATATYPE="TEXT">\${3:CollectionVariable}</MathVariable>
        `),
    },
    {
        name: 'Arrays-Create',
        details: 'Create an array',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:MyArray}" TYPE="STRINGARRAY" DATATYPE="TEXT" OPERATION="CREATE">0</MathVariable>
        `),
    },
    {
        name: 'Arrays-Append',
        details: 'Append to an array',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:MyArray}" TYPE="STRINGARRAY" DATATYPE="TEXT" OPERATION="APPEND" SOURCEARRAY="\${2:MyArray}">\${3:VariableToAppend}</MathVariable>
        `),
    },
    {
        name: 'Arrays-Copy',
        details: 'Copy to an array',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:MyArray}" TYPE="STRINGARRAY" DATATYPE="TEXT" OPERATION="COPY" SOURCEARRAY="\${2:CopyFromArray}"/><
        `),
    },
    {
        name: 'Arrays-FILLBY-SQL',
        details: 'Fill the array from a SQL Query',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:MyArray}" TYPE="STRINGARRAY" DATATYPE="TEXT" OPERATION="FILLBY-SQL">\${2:SELECT DUMMY FROM DUAL}</MathVariable>
        `),
    },
    {
        name: 'Aggregate-Count',
        details: 'Get the length of an array',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="AGGREGATEFUNCTION" METHOD="COUNT" DATATYPE="INTEGER">\${2:Array}</MathVariable>
        `),
    },
    {
        name: 'Aggregate-Min',
        details: 'Get the minimum value of an array',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="AGGREGATEFUNCTION" METHOD="MIN" DATATYPE="DECIMAL">\${2:Array}</MathVariable>
        `),
    },
    {
        name: 'Aggregate-Max',
        details: 'Get the maximum value of an array',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="AGGREGATEFUNCTION" METHOD="MAX" DATATYPE="DECIMAL">\${2:Array}</MathVariable>
        `),
    },
    {
        name: 'Aggregate-Sum',
        details: 'Get the sum of values in an array',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="AGGREGATEFUNCTION" METHOD="SUM" DATATYPE="DECIMAL">\${2:Array}</MathVariable>
        `),
    },
    {
        name: 'Aggregate-Index',
        details: 'Get the index of an array',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="AGGREGATEFUNCTION" METHOD="INDEX" INDEX="\${2:IndexVariable}" DATATYPE="TEXT">\${3:Array}</MathVariable>
        `),
    },
    {
        name: 'Text-VALUE',
        details: 'Add a value of datatype text',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="VALUE" DATATYPE="TEXT">\${2:00}</MathVariable>
        `),
    },
    {
        name: 'Text-EXPRESSION',
        details: 'Add a expression of datatype text',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="EXPRESSION" DATATYPE="TEXT">\${2}</MathVariable>
        `),
    },
    {
        name: 'Text-FUNCTION',
        details: 'Add a function of datatype text',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTION" DATATYPE="TEXT">\${2}</MathVariable>
        `),
    },
    {
        name: 'Text-SQL',
        details: 'Add a sql query of datatype text',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="SQL" DATATYPE="TEXT">\${2:SELECT DUMMY FROM DUAL}</MathVariable>
        `),
    },
    {
        name: 'Text-FIELD',
        details: 'Add a field of datatype text',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FIELD" DATATYPE="TEXT">\${2:Activity:Field}</MathVariable>
        `),
    },
    {
        name: 'Text-POLICYFIELD',
        details: 'Add a policy field of datatype text',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="POLICYFIELD" DATATYPE="TEXT">\${2}</MathVariable>
        `),
    },
    {
        name: 'Text-FUNCTIONCALL',
        details: 'Add a function call of datatype text',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTIONCALL" FUNCTIONNAME="Function-\${2:}" DATATYPE="TEXT">
                <Parameters>   
                    <Parameter NAME="pEffectiveDate">EffectiveDateMV</Parameter>          			
                </Parameters>    
            </MathVariable>
        `),
    },
    {
        name: 'Integer-VALUE',
        details: 'Add a value of datatype integer',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="VALUE" DATATYPE="INTEGER">\${1:0}</MathVariable>
        `),
    },
    {
        name: 'Integer-EXPRESSION',
        details: 'Add a expression of datatype integer',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="EXPRESSION" DATATYPE="INTEGER">\${2}</MathVariable>
        `),
    },
    {
        name: 'Integer-FUNCTION',
        details: 'Add a function of datatype integer',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTION" DATATYPE="INTEGER">\${2}</MathVariable>
        `),
    },
    {
        name: 'Integer-SQL',
        details: 'Add a sql query of datatype integer',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="SQL" DATATYPE="INTEGER">\${2:SELECT DUMMY FROM DUAL}</MathVariable>
        `),
    },
    {
        name: 'Integer-FIELD',
        details: 'Add a field of datatype integer',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FIELD" DATATYPE="INTEGER">\${2:Activity:Field}</MathVariable>
        `),
    },
    {
        name: 'Integer-POLICYFIELD',
        details: 'Add a policy field of datatype integer',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="POLICYFIELD" DATATYPE="INTEGER">\${2}</MathVariable>
        `),
    },
    {
        name: 'Integer-FUNCTIONCALL',
        details: 'Add a function call of datatype integer',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTIONCALL" FUNCTIONNAME="Function-\${2}" DATATYPE="INTEGER">
                <Parameters>   
                    <Parameter NAME="pEffectiveDate">EffectiveDateMV</Parameter>          			
                </Parameters>    
            </MathVariable>
        `),
    },
    {
        name: 'Decimal-VALUE',
        details: 'Add a value of datatype decimal',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="VALUE" DATATYPE="DECIMAL">\${2:0}</MathVariable>
        `),
    },
    {
        name: 'Decimal-EXPRESSION',
        details: 'Add a expression of datatype decimal',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="EXPRESSION" DATATYPE="DECIMAL">\${2}</MathVariable>
        `),
    },
    {
        name: 'Decimal-FUNCTION',
        details: 'Add a function of datatype decimal',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTION" DATATYPE="DECIMAL">\${2}</MathVariable>
        `),
    },
    {
        name: 'Decimal-SQL',
        details: 'Add a sql query of datatype decimal',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="SQL" DATATYPE="DECIMAL">\${2:SELECT DUMMY FROM DUAL}</MathVariable>
        `),
    },
    {
        name: 'Decimal-FIELD',
        details: 'Add a field of datatype decimal',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FIELD" DATATYPE="DECIMAL">\${2:Activity:Field}</MathVariable>
        `),
    },
    {
        name: 'Decimal-POLICYFIELD',
        details: 'Add a policy field of datatype decimal',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="POLICYFIELD" DATATYPE="DECIMAL">\${2}</MathVariable>
        `),
    },
    {
        name: 'Decimal-FUNCTIONCALL',
        details: 'Add a function call of datatype decimal',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTIONCALL" FUNCTIONNAME="Function-\${2}" DATATYPE="DECIMAL">
                <Parameters>   
                    <Parameter NAME="pEffectiveDate">EffectiveDateMV</Parameter>          			
                </Parameters>    
            </MathVariable>
        `),
    },
    {
        name: 'Date-VALUE',
        details: 'Add a value of datatype date',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="VALUE" DATATYPE="DATE">\${2:2001-01-01}</MathVariable>
        `),
    },
    {
        name: 'Date-EXPRESSION',
        details: 'Add a expression of datatype date',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="EXPRESSION" DATATYPE="DATE">\${2}</MathVariable>
        `),
    },
    {
        name: 'Date-FUNCTION',
        details: 'Add a function of datatype date',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTION" DATATYPE="DECIMAL">\${2}</MathVariable>
        `),
    },
    {
        name: 'Date-SQL',
        details: 'Add a sql query of datatype date',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="SQL" DATATYPE="DATE">\${2:SELECT SysDate FROM DUAL}</MathVariable>
        `),
    },
    {
        name: 'Date-FIELD',
        details: 'Add a field of datatype date',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FIELD" DATATYPE="DATE">\${2:Activity:Field}</MathVariable>
        `),
    },
    {
        name: 'Date-POLICYFIELD',
        details: 'Add a policy field of datatype date',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="POLICYFIELD" DATATYPE="DATE">\${2}</MathVariable>
        `),
    },
    {
        name: 'Date-SYSTEMDATE',
        details: 'Add the system date',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:SystemDateMV}" TYPE="SYSTEMDATE" DATATYPE="DATE">\${2:SystemDate}</MathVariable>
        `),
    },
    {
        name: 'Date-FUNCTIONCALL',
        details: 'Add a function call of datatype date',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTIONCALL" FUNCTIONNAME="Function-\${2}" DATATYPE="DATE">
                <Parameters>   
                    <Parameter NAME="pEffectiveDate">EffectiveDateMV</Parameter>          			
                </Parameters>    
            </MathVariable>
        `),
    },
    {
        name: 'Boolean-VALUE',
        details: 'Add a value of datatype boolean',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="VALUE" DATATYPE="BOOLEAN">\${2:true}</MathVariable>
        `),
    },
    {
        name: 'Boolean-EXPRESSION',
        details: 'Add a expression of datatype boolean',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="EXPRESSION" DATATYPE="BOOLEAN">\${2}</MathVariable>
        `),
    },
    {
        name: 'Boolean-FUNCTION',
        details: 'Add a function of datatype boolean',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTION" DATATYPE="DECIMAL">\${2}</MathVariable>
        `),
    },
    {
        name: 'Boolean-SQL',
        details: 'Add a sql query of datatype boolean',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="SQL" DATATYPE="BOOLEAN">\${2:SELECT 'true' FROM DUAL}</MathVariable>
        `),
    },
    {
        name: 'Boolean-FIELD',
        details: 'Add a field of datatype boolean',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FIELD" DATATYPE="BOOLEAN">\${2:Activity:Field}</MathVariable>
        `),
    },
    {
        name: 'Boolean-POLICYFIELD',
        details: 'Add a policy field of datatype boolean',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="POLICYFIELD" DATATYPE="BOOLEAN">\${2}</MathVariable>
        `),
    },
    {
        name: 'Boolean-FUNCTIONCALL',
        details: 'Add a function call of datatype boolean',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTIONCALL" FUNCTIONNAME="Function-\${2}" DATATYPE="BOOLEAN">
                <Parameters>   
                    <Parameter NAME="pEffectiveDate">EffectiveDateMV</Parameter>          			
                </Parameters>    
            </MathVariable>
        `),
    },
    {
        name: 'BigText-VALUE',
        details: 'Add a value of datatype bigText',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="VALUE" DATATYPE="BIGTEXT">\${2}</MathVariable>
        `),
    },
    {
        name: 'BigText-EXPRESSION',
        details: 'Add a expression of datatype bigText',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="EXPRESSION" DATATYPE="BIGTEXT">\${2}</MathVariable>
        `),
    },
    {
        name: 'BigText-FUNCTION',
        details: 'Add a function of datatype bigText',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTION" DATATYPE="BIGTEXT">\${2}</MathVariable>
        `),
    },
    {
        name: 'BigText-SQL',
        details: 'Add a sql query of datatype bigText',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="SQL" DATATYPE="BIGTEXT">\${2:SELECT 'true' FROM DUAL}</MathVariable>
        `),
    },
    {
        name: 'BigText-FIELD',
        details: 'Add a field of datatype bigText',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FIELD" DATATYPE="BIGTEXT">\${2:Activity:Field}</MathVariable>
        `),
    },
    {
        name: 'BigText-POLICYFIELD',
        details: 'Add a policy field of datatype bigText',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="POLICYFIELD" DATATYPE="BIGTEXT">\${2}</MathVariable>
        `),
    },
    {
        name: 'BigText-FUNCTIONCALL',
        details: 'Add a function call of datatype bigText',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTIONCALL" FUNCTIONNAME="Function-\${2}" DATATYPE="BIGTEXT">
                <Parameters>   
                    <Parameter NAME="pEffectiveDate">EffectiveDateMV</Parameter>          			
                </Parameters>    
            </MathVariable>
        `),
    },
    {
        name: 'Currency-EXPRESSION',
        details: 'Add a expression of datatype currency',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:ZeroAmount}" TYPE="EXPRESSION" DATATYPE="CURRENCY">\${2:ToCurrency(0,'USD')}</MathVariable>
        `),
    },
    {
        name: 'Currency-FUNCTION',
        details: 'Add a function of datatype currency',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:ZeroAmount}" TYPE="FUNCTION" DATATYPE="CURRENCY">\${2:ToCurrency(0,'USD')}</MathVariable>
        `),
    },
    {
        name: 'Currency-FIELD',
        details: 'Add a field of datatype currency',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FIELD" DATATYPE="CURRENCY">\${2:Activity:Field}</MathVariable>
        `),
    },
    {
        name: 'Currency-POLICYFIELD',
        details: 'Add a policy field of datatype currency',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="POLICYFIELD" DATATYPE="CURRENCY">\${2}</MathVariable>
        `),
    },
    {
        name: 'Currency-FUNCTIONCALL',
        details: 'Add a function call of datatype currency',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="FUNCTIONCALL" FUNCTIONNAME="Function-\${2}" DATATYPE="CURRENCY">
                <Parameters>   
                    <Parameter NAME="pEffectiveDate">EffectiveDateMV</Parameter>          			
                </Parameters>    
            </MathVariable>
        `),
    },
    {
        name: 'MultiFields',
        details: 'Add MultiFields',
        snippet: dedent(`
            <MultiFields RULE="MultiField-\${1}"></MultiFields>
        `),
    },
];
