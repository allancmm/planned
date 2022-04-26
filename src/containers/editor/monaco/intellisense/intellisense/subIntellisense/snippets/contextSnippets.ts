import dedent from 'ts-dedent';
import { MathVariablesSnippets } from './mathVariablesSnippets';

export interface Snippet {
    name: string;
    snippet: string;

    grandParentTag?: string;
    details?: string;
}

interface SnippetDictionary {
    [parentTag: string]: Snippet[];
}

export const ContextSnippets: SnippetDictionary = {
    Fields: [
        {
            name: 'Field',
            grandParentTag: 'CreateSegment',
            details: 'Add field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:SegmentFieldName}</Name>
                    <Value>\${2:ValueMV}</Value>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'Role',
            details: 'Add field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:RoleField}</To>
                </Field>
            `),
        },
        {
            name: 'Field from collection',
            grandParentTag: 'Role',
            details: 'Add Field from collection',
            snippet: dedent(`
                <Field>
                    <FromCollection>\${1:Collection}</FromCollection>
                    <To>\${2:RoleField}</To>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'Policy',
            details: 'Add field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:PolicyField}</To>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'Segment',
            details: 'Add Field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:PolicyField}</To>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'ActivityFields',
            details: 'Add Field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:RoleField}</To>
                </Field>
            `),
        },
        {
            name: 'Field from collection',
            grandParentTag: 'ActivityFields',
            details: 'Add Field from collection',
            snippet: dedent(`
                <Field>
                    <FromCollection>\${1:Collection}</FromCollection>
                    <To>\${2:RoleField}</To>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'SegmentRole',
            details: 'Add Field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:RoleField}</To>
                </Field>
            `),
        },
        {
            name: 'Field from collection',
            grandParentTag: 'SegmentRole',
            details: 'Add Field from collection',
            snippet: dedent(`
                <Field>
                    <FromCollection>\${1:Collection}</FromCollection>
                    <To>\${2:RoleField}</To>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'CopyToSegmentFields',
            details: 'Add Field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:SegmentField}</To>
                </Field>
            `),
        },
        {
            name: 'Field from collection',
            grandParentTag: 'CopyToSegmentFields',
            details: 'Add Field from collection',
            snippet: dedent(`
                <Field>
                    <FromCollection>\${1:Collection}</FromCollection>
                    <To>\${2:SegmentField}</To>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'PolicyRole',
            details: 'Add Field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:RoleField}</To>
                </Field>
            `),
        },
        {
            name: 'Field from collection',
            grandParentTag: 'PolicyRole',
            details: 'Add Field from collection',
            snippet: dedent(`
                <Field>
                    <FromCollection>\${1:Collection}</FromCollection>
                    <To>\${2:RoleField}</To>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'CopyToAddressFields',
            details: 'Add Field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:AddressField}</To>
                </Field>
            `),
        },
        {
            name: 'Field from collection',
            grandParentTag: 'CopyToAddressFields',
            details: 'Add Field from collection',
            snippet: dedent(`
                <Field>
                    <FromCollection>\${1:Collection}</FromCollection>
                    <To>\${2:AddressField}</To>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'CopyToPolicyFields',
            details: 'Add Field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:PolicyField}</To>
                </Field>
            `),
        },
        {
            name: 'Field from collection',
            grandParentTag: 'CopyToPolicyFields',
            details: 'Add Field from collection',
            snippet: dedent(`
                <Field>
                    <FromCollection>\${1:Collection}</FromCollection>
                    <To>\${2:PolicyField}</To>
                </Field>
            `),
        },
        {
            name: 'Field',
            grandParentTag: 'CopyToClientFields',
            details: 'Add Field',
            snippet: dedent(`
                <Field>
                    <From>\${1:MathVariable}</From>
                    <To>\${2:ClientField}</To>
                </Field>
            `),
        },
        {
            name: 'Field from collection',
            grandParentTag: 'CopyToClientFields',
            details: 'Add Field from collection',
            snippet: dedent(`
                <Field>
                    <FromCollection>\${1:Collection}</FromCollection>
                    <To>\${2:ClientField}</To>
                </Field>
            `),
        },
        {
            name: 'Blank field',
            details: 'Add Blank field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Blank</DataType>
                </Field>
            `),
        },
        {
            name: 'Checkbox field',
            details: 'Add Checkbox field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Check</DataType>
                </Field>
            `),
        },
        {
            name: 'Client field',
            details: 'Add Client field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Client</DataType>
                </Field>
            `),
        },
        {
            name: 'SQL Combo field',
            details: 'Add SQL Combo field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Combo</DataType>
                    <Query TYPE="SQL">\${3:query}</Query>
                    <DefaultValue>\${3:00}</DefaultValue>
                </Field>
            `),
        },
        {
            name: 'Fixed Combo field',
            details: 'Add Fixed Combo field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Combo</DataType>
                    <Query TYPE="FIXED">
                    <Options>
                        <Option>
                            <OptionValue>00</OptionValue>
                            <OptionText>No</OptionText>
                        </Option>
                        <Option>
                            <OptionValue>01</OptionValue>
                            <OptionText>Yes</OptionText>
                        </Option>
                    </Options>
                    </Query>
                    <DefaultValue>\${3:00}</DefaultValue>
                </Field>
            `),
        },
        {
            name: 'Date field',
            details: 'Add Date field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Date</DataType>
                </Field>
            `),
        },
        {
            name: 'Decimal field',
            details: 'Add Decimal field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Decimal</DataType>
                    <DefaultValue>\${3:0}</DefaultValue>
                </Field>
            `),
        },
        {
            name: 'Integer field',
            details: 'Add Integer field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Integer</DataType>
                    <DefaultValue>\${3:0}</DefaultValue>
                </Field>
            `),
        },
        {
            name: 'Label field',
            details: 'Add label field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Label</DataType>
                </Field>
            `),
        },
        {
            name: 'Line field',
            details: 'Add Line field',
            snippet: dedent(`
                <Field>
                    <Name>Line</Name>
                    <Display>Line</Display>
                    <DataType>Line</DataType>
                </Field>
            `),
        },
        {
            name: 'Money field',
            details: 'Add Money field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Money</DataType>
                    <DefaultValue>\${3:0}</DefaultValue>
                    <Currency>CAD,USD</Currency>
                    <DefaultCurrency>USD</DefaultCurrency>
                </Field>
            `),
        },
        {
            name: 'Percent field',
            details: 'Add Percent field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Percent</DataType>
                    <DefaultValue>\${3:0}</DefaultValue>
                </Field>
            `),
        },
        {
            name: 'Radio field',
            details: 'Add Radio field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Radio</DataType>
                    <Query TYPE="FIXED">
                        <Options>
                            <Option>
                                <OptionValue>00</OptionValue>
                                <OptionText>No</OptionText>
                            </Option>
                            <Option>
                                <OptionValue>01</OptionValue>
                                <OptionText>Yes</OptionText>
                            </Option>
                        </Options>
                    </Query>
                    <DefaultValue>\${3:00}</DefaultValue>
                </Field>
            `),
        },
        {
            name: 'Text area field',
            details: 'Add Text area field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>TextArea</DataType>
                </Field>
            `),
        },
        {
            name: 'Text field',
            details: 'Add Text  field',
            snippet: dedent(`
                <Field>
                    <Name>\${1:name}</Name>
                    <Display>\${2:display}</Display>
                    <DataType>Text</DataType>
                </Field>
            `),
        },
    ],
    CreateSegments: [
        {
            name: 'CreateSegment',
            details: 'Create Segment',
            snippet: dedent(`
                <CreateSegment SEGMENTNAME="Base Coverage" STATUSCODE="24">
                    <Tests>
                        <Test>\${1:1 = 1}</Test>
                    </Tests>
                    <Fields>
                        <Field>
                            <Name>\${2:SegmentFieldName}</Name>
                            <Value>\${3:ValueMV}</Value>
                        </Field>
                    </Fields>
                </CreateSegment>
            `),
        },
    ],
    TransactionBusinessRulePacket: [
        {
            name: 'Rule',
            details: 'Add Rule',
            snippet: dedent(`
                <Rule IF="\${1:1 = 1}">\${2:AttachedRule}</Rule>
            `),
        },
    ],
    TransactionCosmetics: [
        {
            name: 'Icon',
            details: 'Add Icon',
            snippet: dedent(`
                <Icon>\${1:AsIconConfirm.gif}</Icon>
            `),
        },
        {
            name: 'Reverse',
            details: 'Add Reverse',
            snippet: dedent(`
                <Reverse>\${1:recycleIcon.gif}</Reverse>
            `),
        },
        {
            name: 'Button',
            details: 'Add Button',
            snippet: dedent(`
                <Button>\${1:addSegmentIcon.gif}</Button>
            `),
        },
        {
            name: 'AmountField',
            details: 'Add AmountField',
            snippet: dedent(`
                <AmountField TOOLTIP="\${1:OptionalTextMV}">\${2:CurrencyMV}</AmountField>
            `),
        },
        {
            name: 'DetailField',
            details: 'Add DetailField',
            snippet: dedent(`
                <DetailField TOOLTIP="\${1:OptionalTextMV}">\${2:TextMV}</DetailField>
            `),
        },
    ],
    ValidateExpressions: [
        {
            name: 'ErrorOnTrue',
            details: 'Add ErrorOnTrue',
            snippet: dedent(`
                <Expression TYPE="ErrorOnTrue" OVERRIDABLE="No" MESSAGE="\${1:Error message}">\${2:1 = 1}</Expression>
            `),
        },
        {
            name: 'ErrorOnFalse',
            details: 'Add ErrorOnFalse',
            snippet: dedent(`
                <Expression TYPE="ErrorOnFalse" OVERRIDABLE="No" MESSAGE="\${1:Error message}">\${2:1 = 1}</Expression>
            `),
        },
    ],
    CreatePolicy: [
        {
            name: 'Policy',
            details: 'Add Policy',
            snippet: dedent(`
                <Policy PLAN="\${1:Plan Name}" COPYSOURCE="No">
                    <Fields>
                        <Field>
                            <From>\${2:FromMV}</From>
                            <To>\${3:PolicyField}</To>
                        </Field>
                    </Fields>
                </Policy>
            `),
        },
        {
            name: 'Policy (Copy source)',
            details: 'Add Policy (Copy source)',
            snippet: dedent(`
                <Policy PLAN="\${1:Plan Name}" COPYSOURCE="Yes" />
            `),
        },
        {
            name: 'Segments',
            details: 'Add Segments',
            snippet: dedent(`
                <Segments>
                </Segments>
            `),
        },
        {
            name: 'Roles',
            details: 'Add Roles',
            snippet: dedent(`
                <Roles COPYALL="No">
                </Roles>
            `),
        },
        {
            name: 'Activities',
            details: 'Add Activities',
            snippet: dedent(`
                <Activities>
                </Activities>
            `),
        },
        {
            name: 'Comments',
            details: 'Add Comments',
            snippet: dedent(`
                <Comments>
                </Comments>
            `),
        },
    ],
    Roles: [
        {
            name: 'Role',
            grandParentTag: 'CreatePolicy',
            details: 'Add Role',
            snippet: dedent(`
                <Role ROLECODE="37" COPYSOURCE="No">
                    <Fields>
                        <Field>
                            <From>\${1:FromMV}</From>
                            <To>\${2:RoleField}</To>
                        </Field>
                    </Fields>
                </Role>
            `),
        },
        {
            name: 'Role (Copy source)',
            grandParentTag: 'CreatePolicy',
            details: 'Add Role (Copy source)',
            snippet: dedent(`
                <Role ROLECODE="37" COPYSOURCE="Yes" />
            `),
        },
        {
            name: 'Tests',
            grandParentTag: 'CreatePolicy',
            details: 'Add Tests',
            snippet: dedent(`
                <Tests>
                </Tests>
            `),
        },
    ],
    Segments: [
        {
            name: 'Segment',
            grandParentTag: 'CreatePolicy',
            details: 'Add Segment',
            snippet: dedent(`
                <Segment SEGMENTNAME="Base Coverage" COPYSOURCE="No">
                    <Fields>
                        <Field>
                            <From>\${1:FromMV}</From>
                            <To>\${2:SegmentField}</To>
                        </Field>
                    </Fields>
                </Segment>
            `),
        },
        {
            name: 'Segment (Copy source)',
            grandParentTag: 'CreatePolicy',
            details: 'Add Segment (Copy source)',
            snippet: dedent(`
                <Segment SEGMENTNAME="Base Coverage" COPYSOURCE="Yes" />
            `),
        },
        {
            name: 'Tests',
            grandParentTag: 'CreatePolicy',
            details: 'Add Tests',
            snippet: dedent(`
                <Tests>
                </Tests>
            `),
        },
    ],
    Comments: [
        {
            name: 'Comment',
            details: 'Add Comment',
            snippet: dedent(`
                <Comment>\${1:CommentMV}</Comment>
            `),
        },
    ],
    PolicyRoles: [
        {
            name: 'All roles',
            details: 'Add All roles',
            snippet: dedent(`
                <PolicyRole ALLROLES="Yes">
                    <Fields>
                        <Field>
                            <From>\${1:FromMV}</From>
                            <To>\${2:ToRoleField}</To>
                        </Field>
                    </Fields>
                </PolicyRole>
            `),
        },
        {
            name: 'By role code',
            details: 'Add By role code',
            snippet: dedent(`
                <PolicyRole ALLROLES="No" ROLECODE="RoleCodeMV">
                    <Fields>
                        <Field>
                            <From>\${1:FromMV}</From>
                            <To>\${2:ToRoleField}</To>
                        </Field>
                    </Fields>
                </PolicyRole>
            `),
        },
    ],
    SegmentRoles: [
        {
            name: 'All roles',
            details: 'Add All roles',
            snippet: dedent(`
                <SegmentRole ALLROLES="Yes"  SEGMENTGUID="\${1:SegmentGuidMV}">
                    <Fields>
                        <Field>
                            <From>\${2:FromMV}</From>
                            <To>\${3:ToRoleField}</To>
                        </Field>
                    </Fields>
                </SegmentRole>
            `),
        },
        {
            name: 'By role code',
            details: 'Add By role code',
            snippet: dedent(`
                <SegmentRole ALLROLES="No" ROLECODE="RoleCodeMV" SEGMENTGUID="\${1:SegmentGuidMV}">
                    <Fields>
                        <Field>
                            <From>\${2:FromMV}</From>
                            <To>\${3:ToRoleField}</To>
                        </Field>
                    </Fields>
                </SegmentRole>
            `),
        },
    ],
    CopyToRoleFields: [
        {
            name: 'PolicyRoles',
            details: 'Add PolicyRoles',
            snippet: dedent(`
                <PolicyRoles>
                </PolicyRoles>
            `),
        },
        {
            name: 'SegmentRoles',
            details: 'Add SegmentRoles',
            snippet: dedent(`
                <SegmentRoles>
                </SegmentRoles>
            `),
        },
    ],
    Tests: [
        {
            name: 'Test',
            details: 'Add Test',
            snippet: dedent(`
                <Test>\${1:1 = 1}</Test>
            `),
        },
    ],
    ActivityFields: [
        {
            name: 'Tests',
            details: 'Add Tests',
            snippet: dedent(`
                <Tests>
                </Tests>
            `),
        },
        {
            name: 'Fields',
            details: 'Add Fields',
            snippet: dedent(`
                <Fields>
                </Fields>
            `),
        },
    ],
    CopyToPendingActivityFields: [
        {
            name: 'Activity',
            details: 'Add Activity',
            snippet: dedent(`
                <Activity ACTIVITYGUID="\${1:ActivityGUIDMV}">
                    <ActivityFields>
                        <Tests>
                            <Test>\${2:1 = 1}</Test>
                        </Tests>
                        <Fields>
                            <Field>
                                <From>\${3:FromMV}</From>
                                <To>\${4:ToActivityField}</To>
                            </Field>
                        </Fields>
                    </ActivityFields>
                </Activity>
            `),
        },
        {
            name: 'Activity from collection',
            details: 'Add Activity from collection',
            snippet: dedent(`
                <Activity>
                    <ActivityFields>
                        <Tests>
                            <Test>\${1:1 = 1}</Test>
                        </Tests>
                        <Fields>
                            <Field>
                                <FromCollection>\${2:Collection}</FromCollection>
                                <To>\${3:ToActivityField}</To>
                            </Field>
                        </Fields>
                    </ActivityFields>
                </Activity>
            `),
        },
    ],
    ConfirmationScreen: [
        {
            name: 'Fields',
            details: 'Add Fields',
            snippet: dedent(`
                <Fields>
                </Fields>
            `),
        },
    ],
    AddRoles: [
        {
            name: 'Role',
            details: 'Add Role',
            snippet: dedent(`
                <Role CLIENTGUID="\${1:ClientGUIDMV}" ROLECODE="\${2:RoleCodeMV}" STATUSCODE="\${3:RoleStatusMV}" ROLEPERCENT="\${4:RolePercentMV}">
                    <Tests>
                        <Test>\${5:1 = 1}</Test>
                    </Tests>
                    <Fields>
                        <Field>
                            <From>\${6:FromMV}</From>
                            <To>\${7:ToRoleField}</To>
                        </Field>
                    </Fields>
                </Role>
            `),
        },
    ],
    AddRequirements: [
        {
            name: 'Requirement',
            details: 'Add Requirement',
            snippet: dedent(`
                <Requirement ALLOW_DUPLICATES="Yes">
                    <Tests>
                        <Test>\${1:1 = 1}</Test>
                    </Tests>
                    <RequirementName>\${2:Requirement name}</RequirementName>
                    <ClientGUID>\${3:ClientGuidMV}</ClientGUID>
                    <StatusCode>\${4:00}</StatusCode>
                </Requirement>
            `),
        },
    ],
    MathAndFields: [
        {
            name: 'Field',
            details: 'Add Field',
            snippet: dedent(`
                <Field>
                    <DisplayName>\${1:DisplayName}</DisplayName>
                    <Name>\${2:FieldName}</Name>
                    <Group>Math</Group>
                    <DataType>Text</DataType>
                </Field>
            `),
        },
    ],
    ActivitySummary: [
        {
            name: 'MathAndFields',
            details: 'Add MathAndFields',
            snippet: dedent(`
                <MathAndFields>
                </MathAndFields>
            `),
        },
        {
            name: 'ActivityResult',
            details: 'Add ActivityResult',
            snippet: dedent(`
                <ActivityResult>
                    <Result DISPLAY="Display">
                        <Table>
                            <Results>
                                <Query TYPE="SQL">\${1:SELECT 'Number', 'Name' FROM DUAL}</Query>
                            </Results>
                            <Column>
                                <Name>PolicyNumber</Name>
                                <Display>PolicyNumber</Display>
                                <DataType>Text</DataType>
                            </Column>
                            <Column>
                                <Name>PolicyName</Name>
                                <Display>PolicyName</Display>
                                <DataType>Text</DataType>
                            </Column>
                        </Table>
                    </Result>
                </ActivityResult>
            `),
        },
    ],
    CopyToPolicyFields: [
        {
            name: 'Fields',
            details: 'Add Fields',
            snippet: dedent(`
                <Fields>
                </Fields>
            `),
        },
    ],
    CopyToSegmentFields: [
        {
            name: 'Fields',
            details: 'Add Fields',
            snippet: dedent(`
                <Fields>
                </Fields>
            `),
        },
    ],
    CopyToClientFields: [
        {
            name: 'Fields',
            details: 'Add Fields',
            snippet: dedent(`
                <Fields>
                </Fields>
            `),
        },
    ],
    MathIF: MathVariablesSnippets,
    MathLoop: MathVariablesSnippets,
    CopyBook: MathVariablesSnippets,
    MultiFields: MathVariablesSnippets,
    MathVariables: MathVariablesSnippets,
    Condition: [
        {
            name: 'Condition',
            details: 'Add Condition',
            snippet: dedent(`
                <Condition IF="\${1}">
                </Condition>
            `),
        },
        {
            name: 'Action-Warning',
            details: 'Add an action of type warning',
            snippet: dedent(`
                <Action ACTIONTYPE="WARNING">\${1:Warning message}</Action>
            `),
        },
        {
            name: 'Action-Error',
            details: 'Add an action of type error',
            snippet: dedent(`
                <Action ACTIONTYPE="WARNING">\${1:Warning message}</Action>
            `),
        },
        {
            name: 'Action-SQL Query',
            details: 'Add an action of type SQL query',
            snippet: dedent(`
                <Action ACTIONTYPE="SQLQUERY">\${1}</Action>
            `),
        },
        {
            name: 'Action-Collection',
            details: 'Add an action of type collection',
            snippet: dedent(`
                <Action ACTIONTYPE="MATHCOLLECTION">\${1:ScreenMath:Collection1}</Action>
            `),
        },
        {
            name: 'Action-Enable',
            details: 'Add an action of type enable',
            snippet: dedent(`
                <Action ACTIONTYPE="ENABLE" FIELD="\${1}"/>
            `),
        },
        {
            name: 'Action-Disable',
            details: 'Add an action of type disable',
            snippet: dedent(`
                <Action ACTIONTYPE="DISABLE" FIELD="\${1}"/>
            `),
        },
        {
            name: 'Action-Show',
            details: 'Add an action of type show',
            snippet: dedent(`
                <Action ACTIONTYPE="SHOW" FIELD="\${1}"/>
            `),
        },
        {
            name: 'Action-Hide',
            details: 'Add an action of type hide',
            snippet: dedent(`
                <Action ACTIONTYPE="HIDE" FIELD="\${1}"/>
            `),
        },
        {
            name: 'Action-Assign',
            details: 'Add an action of type assign',
            snippet: dedent(`
                <Action ACTIONTYPE="ASSIGN" FIELD="\${1}">\${2:GlobalScreenMath:Blank}</Action>
            `),
        },
        {
            name: 'Action-Enable All',
            details: 'Add an action of type enable all',
            snippet: dedent(`
                <Action ACTIONTYPE="ENABLEALL"/>
            `),
        },
        {
            name: 'Action-Disable All',
            details: 'Add an action of type disable all',
            snippet: dedent(`
                <Action ACTIONTYPE="DISABLEALL"/>
            `),
        },
    ],
    QuerySet: [
        {
            name: 'Condition',
            details: 'Add a condition',
            snippet: dedent(`
                <Condition IF="\${1}">
                </Condition>
            `),
        },
        {
            name: 'Action-SQL Query',
            details: 'Add a action of type sql query',
            snippet: dedent(`
                <Action ACTIONTYPE="SQLQUERY">\${1}</Action>
            `),
        },
        {
            name: 'Action-Collection',
            details: 'Add a action of type collection',
            snippet: dedent(`
                <Action ACTIONTYPE="MATHCOLLECTION">\${1:ScreenMath:Collection1}</Action>
            `),
        },
    ],
    ActionSet: [
        {
            name: 'Condition',
            details: 'Add a condition',
            snippet: dedent(`
                <Condition IF="\${1}">
                </Condition>
            `),
        },
        {
            name: 'Action-Warning',
            details: 'Add an action of type warning',
            snippet: dedent(`
                <Action ACTIONTYPE="ERROR">\${1:Error message}</Action
            `),
        },
        {
            name: 'Action-Error',
            details: 'Add an action of type error',
            snippet: dedent(`
                <Action ACTIONTYPE="WARNING">\${1:Warning message}</Action>
            `),
        },
        {
            name: 'Action-Enable',
            details: 'Add an action of type enable',
            snippet: dedent(`
                <Action ACTIONTYPE="ENABLE" FIELD="\${1}"/>
            `),
        },
        {
            name: 'Action-Disable',
            details: 'Add an action of type disable',
            snippet: dedent(`
                <Action ACTIONTYPE="DISABLE" FIELD="\${1}"/>
            `),
        },
        {
            name: 'Action-Show',
            details: 'Add an action of type show',
            snippet: dedent(`
                <Action ACTIONTYPE="SHOW" FIELD="\${1}"/>
            `),
        },
        {
            name: 'Action-Hide',
            details: 'Add an action of type hide',
            snippet: dedent(`
                <Action ACTIONTYPE="HIDE" FIELD="\${1}"/>
            `),
        },
        {
            name: 'Action-Assign',
            details: 'Add an action of type assign',
            snippet: dedent(`
                <Action ACTIONTYPE="ASSIGN" FIELD="\${1}">\${2:GlobalScreenMath:Blank}</Action>
            `),
        },
        {
            name: 'Action-Enable All',
            details: 'Add an action of type enable all',
            snippet: dedent(`
                <Action ACTIONTYPE="ENABLEALL"/>
            `),
        },
        {
            name: 'Action-Disable All',
            details: 'Add an action of type disable all',
            snippet: dedent(`
                <Action ACTIONTYPE="DISABLEALL"/>
            `),
        },
    ],
    Actions: [
        {
            name: 'ActionSet',
            details: 'Add an action set',
            snippet: dedent(`
                <ActionSet ID="\${1}">
                </ActionSet>
            `),
        },
        {
            name: 'QuerySet',
            details: 'Add an query set',
            snippet: dedent(`
                <QuerySet ID="\${1}">
                </QuerySet>
            `),
        },
    ],
    Events: [
        {
            name: 'On Load Event',
            details: 'Add a on load event',
            snippet: dedent(`
                <Event TYPE="ONLOAD">
                    <ActionSet ID="\${1:OnLoadAction}"/>
                </Event>
            `),
        },
        {
            name: 'On Change Event',
            details: 'Add a on change event',
            snippet: dedent(`
                <Event TYPE="ONCHANGE" FIELD="\${1}">
                    <ActionSet ID="\${2:OnChangeAction}"/>
                </Event>
            `),
        },
        {
            name: 'On Submit Event',
            details: 'Add a on submit event',
            snippet: dedent(`
                <Event TYPE="ONSUBMIT">
                    <ActionSet ID="\${1:OnSubmitAction}"/>
                </Event>
            `),
        },
    ],
    Spawns: [
        {
            name: 'Spawn Immediate',
            details: 'Add spawn immediate',
            snippet: dedent(`
                <Spawn>
                    <Transaction SPAWNCODE="01">\${1:TransactionName}</Transaction>
                    <SpawnFields>
                        <SpawnField>
                            <From>\${2:MathVariable}</From>
                            <To>\${3:ActivityField}</To>
                            <DataType>Text</DataType>
                        </SpawnField>
                    </SpawnFields>
                </Spawn>
            `),
        },
        {
            name: 'Spawn To Date',
            details: 'Add spawn to date',
            snippet: dedent(`
                <Spawn>
                    <Transaction SPAWNCODE="03" FIELD="\${1:DateMathVariable}">\${2:TransactionName}</Transaction>
                    <SpawnFields>
                        <SpawnField>
                            <From>\${3:MathVariable}</From>
                            <To>\${4:ActivityField}</To>
                            <DataType>Text</DataType>
                        </SpawnField>
                    </SpawnFields>
                </Spawn>
            `),
        },
        {
            name: 'Spawn Array',
            details: 'Add spawn array',
            snippet: dedent(`
                <Spawn>
                    <Activity>\${1:ActivitySpawnArray}</Activity>
                </Spawn>
            `),
        },
    ],
    Transaction: [
        {
            name: 'Effective Date',
            details: 'Add a effective date',
            snippet: dedent(`
                <EffectiveDate STATUS="Enabled" TYPE="SYSTEM"/>
            `),
        },
        {
            name: 'MultiFields',
            details: 'Add multi fields',
            snippet: dedent(`
                <MultiFields RULE="MultiField-">Yes</MultiFields>
            `),
        },
        {
            name: 'Fields',
            details: 'Add fields',
            snippet: dedent(`
                <Fields>
                </Fields>
            `),
        },
        {
            name: 'Events',
            details: 'Add events',
            snippet: dedent(`
                <Events>
                </Events>
            `),
        },
        {
            name: 'ScreenMath',
            details: 'Add screen math',
            snippet: dedent(`
                <ScreenMath>
                </ScreenMath>
            `),
        },
        {
            name: 'Actions',
            details: 'Add actions',
            snippet: dedent(`
                <Actions>
                </Actions>
            `),
        },
        {
            name: 'Math',
            details: 'Add math',
            snippet: dedent(`
                <Math>
                    <MathVariables>
                    </MathVariables>
                </Math>
            `),
        },
        {
            name: 'Spawns',
            details: 'Add spawns',
            snippet: dedent(`
                <Spawns>
                </Spawns>
            `),
        },
    ],
    TestData: [
        {
            name: 'Mocks',
            details: 'Add mocks',
            snippet: dedent(`
                <Mocks>
                    <Mock VARIABLENAME="\${1}" DATATYPE="\${2}">
                        <Return>\${3}</Return>
                    </Mock>
                </Mocks>
            `),
        },
        {
            name: 'Assessments',
            details: 'Add assessments',
            snippet: dedent(`
                <Assessments>
                    <Assessment LABEL="\${1}">
                        <Observable>\${2}</Observable>
                        <ExpectedResult>\${3}</ExpectedResult>
                    </Assessment>
                </Assessments>
            `),
        },
    ],
    Mocks: [
        {
            name: 'Mock (Variable)',
            details: 'Add a mock',
            snippet: dedent(`
                <Mock VARIABLENAME="\${1}" DATATYPE="\${2}">
                    <Return>\${3}</Return>
                </Mock>
            `),
        },
        {
            name: 'Mock (Field)',
            details: 'Add a mock',
            snippet: dedent(`
                <Mock FIELDNAME="\${1}" DATATYPE="\${2}">
                    <Return>\${3}</Return>
                </Mock>
            `),
        },
        {
            name: 'Mock (Function Call)',
            details: 'Add a mock',
            snippet: dedent(`
                <Mock VARIABLENAME="\${1}" DATATYPE="\${2}">
                    <Return>\${3}</Return>
                    <OutputParameters>
                        <Parameter NAME="" DATATYPE=""></Parameter>
                    </OutputParameters>
                </Mock>
            `),
        },
    ],
    Assessments: [
        {
            name: 'Assessment',
            details: 'Add am assessment',
            snippet: dedent(`
                <Assessment LABEL="\${1}">
                    <Observable>\${2}</Observable>
                    <ExpectedResult>\${3}</ExpectedResult>
                </Assessment>
            `),
        },
    ],
};
