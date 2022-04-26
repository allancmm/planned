interface Tags {
    [tagName: string]: Tag;
}

interface Tag {
    children?: string[];
    attrs?: Attributes;
}

interface Attributes {
    [attrName: string]: string[] | null;
}

export const allAssessmentOperators = [
    'EQUAL',
    'NOT_EQUAL',
    'GREATER_THAN',
    'LESS_THAN',
    'GREATER_OR_EQUAL_THAN',
    'LESS_OR_EQUAL_THAN',
];

export const allDatatypes = [
    'ACTIVITY',
    'BIGTEXT',
    'BOOLEAN',
    'CURRENCY',
    'DATE',
    'DECIMAL',
    'INTEGER',
    'TEXT',
    'MAP',
    'OBJECT',
    'XML',
];

export const topTags = [
    'Transaction',
    'CopyBook',
    'MultiFields',
    'Function',
    'ValidateExpressions',
    'TransactionBusinessRulePacket',
    'ActivitySummary',
    'InquiryScreen',
    'AddRequirements',
    'CopyToPolicyFields',
    'AddRoles',
    'ConfirmationScreen',
    'CopyToAddressFields',
    'CopyToClientFields',
    'CopyToPendingActivityFields',
    'CopyToRoleFields',
    'CopyToSegmentFields',
    'CreatePolicy',
    'TransactionCosmetics',
    'CreateSegments',
    'TestData',
];

// ActivitySummary
const ActivitySummary = {
    children: ['MathAndFields', 'ActivityResult'],
};

const InquiryScreen = {
    attrs: { NAME: null, DISPLAYONLOAD: ['Yes', 'No'] },
    children: ['Input', 'Output'],
};

const MathAndFields = {
    children: ['Field'],
};

const Input = {
    children: ['Fields'],
};

const ActivityResult = {
    children: ['Result'],
};

const Output = {
    children: ['Result'],
};

const Result = {
    attrs: { DISPLAY: null },
    children: ['Table'],
};

const Table = {
    attrs: { NAME: null },
    children: ['Results', 'Column'],
};

const Results = {
    children: ['Query'],
};

const Column = {
    children: ['Name', 'Display', 'DataType'],
};

// Business rule packet
const TransactionBusinessRulePacket = {
    children: ['Rule'],
};

// Validate expressions
const ValidateExpressions = {
    children: ['Expression'],
};

const Expression = {
    attrs: {
        TYPE: ['ErrorOnTrue', 'ErrorOnFalse'],
        OVERRIDABLE: ['Yes', 'No', 'Auto'],
        ERRORNUMBER: null,
        MESSAGE: null,
        WARNING: ['Yes', 'No'],
    },
};

// Rules
const AddRequirements = {
    children: ['Requirement'],
};
const Requirement = {
    attrs: { ALLOW_DUPLICATES: ['Yes', 'No'] },
};
const Tests = {
    children: ['Test'],
};

const CreateSegments = {
    children: ['CreateSegment'],
};
const CreateSegment = {
    attrs: { SEGMENTNAME: null, STATUSCODE: null },
    children: ['Tests', 'Fields'],
};

const Rule = {
    attrs: { IF: null },
};

const TransactionCosmetics = {
    children: ['Icon', 'Button', 'Reverse', 'AmountField', 'DetailField'],
};

const DetailField = {
    attrs: { TOOLTIP: null },
};

const AmountField = {
    attrs: { TOOLTIP: null },
};

const Activities = {
    children: ['Activity'],
};

const CreatePolicy = {
    children: ['Policy', 'Segments', 'Roles', 'Comments', 'Activities'],
};

const Comments = {
    children: ['Comment'],
};

const Policy = {
    attrs: { PLAN: null, COPYSOURCE: null },
    children: ['Fields'],
};

const Segments = {
    children: ['Segment'],
};

const Roles = {
    attrs: { PLAN: null, COPYALL: ['Yes', 'No'] },
    children: ['Role'],
};

const Segment = {
    attrs: { SEGMENTNAME: null, COPYSOURCE: null },
    children: ['Fields', 'Tests'],
};

const CopyToSegmentFields = {
    attrs: { SEGMENTGUID: null },
    children: ['Fields'],
};

const PolicyRoles = {
    children: ['PolicyRole'],
};

const PolicyRole = {
    attrs: { ALLROLES: ['Yes', 'No'], ROLECODE: null },
    children: ['Fields'],
};

const SegmentRoles = {
    children: ['SegmentRole'],
};

const SegmentRole = {
    attrs: { ALLROLES: ['Yes', 'No'], ROLECODE: null, SEGMENTGUID: null },
    children: ['Fields'],
};

const ActivityFields = {
    children: ['Tests', 'Fields'],
};

const CopyToPendingActivityFields = {
    children: ['Activity'],
};

const CopyToRoleFields = {
    children: ['PolicyRoles', 'SegmentRoles'],
};

const CopyToClientFields = {
    attrs: { CLIENTGUID: null },
    children: ['Fields'],
};

const CopyToPolicyFields = {
    children: ['Fields'],
};
const CopyToAddressFields = {
    attrs: { ADDRESSGUID: null },
    children: ['Fields'],
};

const ConfirmationScreen = {
    attrs: { TITLE: null },
    children: ['Fields'],
};
const AddRoles = {
    children: ['Role'],
};

const Role = {
    attrs: { CLIENTGUID: null, ROLECODE: null, STATUSCODE: null, ROLEPERCENT: null },
    children: ['Tests', 'Fields'],
};

// Multifields
const MultiFields = {
    attrs: { RULE: null },
    children: ['MultiField'],
};

const MultiField = {
    children: ['Name', 'Title', 'ComboDisplay', 'Start', 'End', 'Fields', 'Events', 'ScreenMath', 'Actions'],
};

// Function
const Function = {
    attrs: { NAME: null, RETURN: null, DATATYPE: ['DATE', 'DECIMAL', 'INTEGER', 'TEXT', 'BOOLEAN'] },
    children: ['Parameters', 'Math', 'CopyBook', 'MultiFields'],
};

const Parameters = {
    children: ['Parameter'],
};

const Parameter = {
    attrs: {
        NAME: null,
        TYPE: ['INPUT', 'OUTPUT'],
        DATATYPE: allDatatypes,
        ISARRAY: ['YES'],
    },
    children: ['Parameters', 'Math', 'CopyBook', 'MultiFields'],
};

// MEMBERSHIP
const Membership = {
    children: ['ClassGroup'],
};

// CLASSGROUP
const ClassGroup = {
    attrs: { TYPE: null, DISPLAYMEMBERSHIPCLASS: null },
    children: ['WriteMembership', 'EffectiveFromDate', 'EffectiveToDate'],
};

// ActivitySequenceProcess
const ActivitySequenceProcess = {
    children: ['ActivitySequence', 'Activity'],
};

const ActivitySequence = {
    attrs: { NAME: null, IF: null },
};

const Activity = {
    attrs: { PROCESSIMMEDIATE: null, IF: null, ACTIVITYGUID: null },
    children: ['ActivityFields'],
};

// Effective date
const EffectiveDate = {
    attrs: { STATUS: ['Enabled', 'Disabled'], TITLE: null, TYPE: ['SYSTEM', 'USER', 'SQL'] },
};

// Suspense
const Suspense = {
    attrs: { OVERRIDABLE: ['Yes', 'No', 'Ignore'], VALUE: ['Sufficient', 'Equals'], REQUIRED: ['Yes', 'No'] },
};

// Fields
const Fields = {
    children: ['Field'],
};

const Field = {
    children: [
        'Name',
        'Group',
        'Display',
        'DataType',
        'Parts',
        'DefaultValue',
        'Query',
        'Options',
        'ToolTip',
        'Calculated',
        'ClearOnRecycle',
        'Disabled',
        'Hidden',
        'Expanded',
        'Required',
        'Currency',
        'DefaultCurrency',
        'Final',
        'Length',
    ],
};

const Name = {
    attrs: { BOLD: ['Yes', 'No'], ITALICS: ['Yes', 'No'] },
};

const Group = {
    attrs: { ROLECODE: null },
};

const DataType = {
    attrs: { MASK: null, CALENDAR: ['Gregorian', 'JP', 'JP_IMP'], FORMAT: null },
};

const Query = {
    attrs: { TYPE: ['SQL', 'FIXED'] },
    children: ['Options'],
};

const Options = {
    children: ['Option'],
};

const Option = {
    children: ['OptionValue', 'OptionText'],
};

const Calculated = {
    attrs: { TYPE: ['SQL', 'REPLACE', 'MESSAGE', 'FUNCTION'], METHOD: ['IFEMPTY', 'FORCE'] },
};

const Parts = {
    children: ['Part'],
};

const Part = {
    attrs: {
        TYPE: ['VALUE', 'SYSTEMDATE', 'SEQUENCE', 'FIELD'],
        FORMAT: null,
        LEFT: null,
        MID: null,
        SEQUENCEDATE: null,
    },
};

const ScreenMath = {
    children: ['Math'],
};

const Math = {
    attrs: {
        GLOBAL: ['Yes', 'No'],
        ID: null,
    },
    children: ['MathVariables'],
};

///////////////////////////////////////////////////////

// ACTIONS EVENTS MATH

///////////////////////////////////////////////////////

const Events = {
    children: ['Event'],
};

const Event = {
    attrs: { TYPE: ['ONLOAD', 'ONCHANGE', 'ONSUBMIT', 'ONCHANGE', 'CALLEDEVENT'], FIELD: null },
    children: ['ActionSet', 'QuerySet', 'Math'],
};

const ActionSet = {
    attrs: { ID: null },
    children: ['Condition', 'Action'],
};

const ElseIf = {
    attrs: { IF: null },
    children: ['Action', 'Condition'],
};

const Else = {
    children: ['Action', 'Condition'],
};

const Action = {
    attrs: {
        FIELD: null,
        ACTIONTYPE: [
            'SQLQUERY',
            'MATHCOLLECTION',
            'CALLEXTERNALEVENT',
            'ERROR',
            'WARNING',
            'SHOW',
            'HIDE',
            'ENABLE',
            'DISABLE',
            'DISABLEALL',
            'ENABLEALL',
            'READONLY',
            'ASSIGN',
        ],
    },
    children: ['Condition', 'Action'],
};

const Actions = {
    children: ['ActionSet', 'QuerySet'],
};

const Condition = {
    attrs: { IF: null },
    children: ['Condition', 'Action', 'Else', 'ElseIf'],
};

const MathIF = {
    attrs: { IF: null },
    children: ['MathVariable', 'MathLoop', 'MathIF'],
};

const MathVariables = {
    children: ['MathVariable', 'MathIF', 'MathLoop', 'CopyBook', 'MultiFields'],
};

const MathVariable = {
    // attrs is so complicated it need it's own intellisense
    children: ['Parameters'],
};

const MathLoop = {
    attrs: {
        VARIABLENAME: null,
        TYPE: ['OBJECTLOOP', 'FOR', 'VALUATION', 'SEGMENT'],
        OBJECTNAME: null,
        KEY: null,
        EFFECTIVEDATE: null,
        CONDITION: null,
        ITERATIONS: null,
        POLICY: ['[Policy:PolicyGUID]'],
    },
    children: ['MathVariable', 'MathLoop', 'MathIF'],
};

///////////////////// SPAWN ///////////////////////////

const Spawns = {
    children: ['Spawn'],
};

const Spawn = {
    attrs: { IF: null },
    children: ['Transaction', 'Allocation', 'SpawnFields'],
};

const Transaction = {
    attrs: { FIELD: null, SPAWNCODE: ['03', '05', '04', '07', '01', '02', '09', '06'], ALLOWQUOTE: ['Yes', 'No'] },
    children: [
        'Membership',
        'ActivitySequenceProcess',
        'CopyBook',
        'EffectiveDate',
        'Suspense',
        'ValuesBlock',
        'Withholding',
        'AllowComments',
        'Transitions',
        'FundLevel',
        'Fields',
        'Actions',
        'Events',
        'MultiFields',
        'Address',
        'ScreenMath',
        'Math',
        'ActivitySequences',
        'Spawns',
        'Buttons',
    ],
};

const Allocation = {
    attrs: {
        TYPE: ['Policy', 'Parent', 'Segment'],
    },
};

const SpawnFields = {
    children: ['SpawnField'],
};

const SpawnField = {
    children: ['From', 'To', 'DataType'],
};

const TestData = {
    children: ['Mocks', 'Assessments'],
};

const Mocks = {
    children: ['Mock'],
};

const Mock = {
    attrs: { VARIABLENAME: null, DATATYPE: allDatatypes, TYPE: ['FUNCTIONCALL'] },
    children: ['Return', 'OutputParameters'],
};

const OutputParameters = {
    children: ['Parameter'],
};

const Assessments = {
    children: ['Assessment'],
};

const Assessment = {
    attrs: { LABEL: null },
    children: ['Observable', 'ExpectedResult'],
};

const ExpectedResult = {
    attrs: { OPERATOR: allAssessmentOperators },
};

export const schema: Tags = {
    InquiryScreen,
    Input,
    Output,
    ActivitySummary,
    MathAndFields,
    ActivityResult,
    Result,
    Table,
    Results,
    Column,
    TransactionBusinessRulePacket,
    ValidateExpressions,
    Expression,
    Function,
    Parameters,
    Parameter,
    Transaction,
    Membership,
    ClassGroup,
    ActivitySequenceProcess,
    ActivitySequence,
    Activity,
    EffectiveDate,
    Suspense,
    Fields,
    Field,
    Name,
    Display: Name,
    DataType,
    Query,
    Options,
    Option,
    Parts,
    Part,
    Calculated,
    ScreenMath,
    Math,
    Else,
    ElseIf,
    Action,
    Actions,
    Condition,
    MathIF,
    MathVariables,
    MathVariable,
    MathLoop,
    Events,
    Event,
    ActionSet,
    QuerySet: ActionSet,
    Spawns,
    Spawn,
    Allocation,
    SpawnFields,
    SpawnField,
    Group,
    MultiFields,
    MultiField,
    Requirement,
    AddRequirements,
    Tests,
    AddRoles,
    Role,
    ConfirmationScreen,
    CopyToAddressFields,
    CopyToClientFields,
    CopyToPolicyFields,
    CopyToRoleFields,
    CopyToPendingActivityFields,
    ActivityFields,
    PolicyRoles,
    SegmentRoles,
    PolicyRole,
    SegmentRole,
    CopyToSegmentFields,
    CreatePolicy,
    Policy,
    Segment,
    Segments,
    Roles,
    Comments,
    Activities,
    TransactionCosmetics,
    AmountField,
    DetailField,
    Rule,
    CreateSegments,
    CreateSegment,
    TestData,
    Mocks,
    Mock,
    OutputParameters,
    Assessments,
    Assessment,
    ExpectedResult,
};

export const methods = ['SUM', 'COUNT', 'INDEX', 'MIN', 'MAX'];

export const mvTypes = [
    'COLLECTION',
    'COLLECTIONVALUE',
    'VALUE',
    'SUSPENSEFIELD',
    'SYSTEMDATE',
    'EXPRESSION',
    'FIELD',
    'POLICYFIELD',
    'SEGMENTFIELD',
    'FUNCTION',
    'MULTIFIELD',
    'SQL',
    'FUNCTIONCALL',
    'AGGREGATEFUNCTION',
    'TEXTARRAY',
    'STRINGARRAY',
    'DATEARRAY',
    'NUMERICARRAY',
    'ACTIVITYARRAY',
    'ACTIVITY',
    'LOOPINDEX',
    'EXIT-LOOP',
    'XML',

    // TODO: those had no autocompletion before
    'OBJECT',
    'OBJECTFIELD',
    'OBJECTARRAY',
    'PLANFIELD',
    'ACTIVITYFIELD',
    'IDENTIFIER',
    'INTEGERARRAY',
    'RATE',
    'RATEARRAY',
    'IIF',
    'PROCESS',
    'XPATH',
];

// Returns the list of built-in OIPA functions
export const getBuiltInFunctionsList = (datatype?: string) => {
    let list: string[] = [];
    const dateList = [
        'CalendarQuarter(Date)',
        'DaysAdd(Date, Integer)',
        'GivesBestDay(Date, Integer)',
        'MaxDateOf(Date, Date)',
        'MinDateOf(Date, Date)',
        'MonthsAdd(Date, Integer)',
        'NextMultipleMode(Date, Integer, Integer)',
        'QuartersAdd(Date, Integer)',
        'ReplaceDayOfMonth(Date, Integer)',
        'ReplaceMonth(Date, Integer)',
        'ReplaceYear(Date, Integer)',
        'ToDate(Object)',
        'YearBeginOf(Date)',
        'YearEndOf(Date)',
        'YearsAdd(Date, Integer)',
    ];

    const textList = [
        'GetCurrencyCode(Currency)',
        'ToText(Object)',
        'PadLeft(TextOrBigText, Text, Integer)',
        'PadRight(TextOrBigText, Text, Integer)',
        'RemoveLeft(TextOrBigText, Integer)',
        'RemoveRight(TextOrBigText, Integer)',
        'Right(TextOrBigText, Integer)',
    ];

    const bigtextList = [
        'Concatenate(TextOrBigText, TextOrBigText)',
        'Left(TextOrBigText, Integer)',
        'PadLeft(TextOrBigText, Text, Integer)',
        'PadRight(TextOrBigText, Text, Integer)',
        'RemoveLeft(TextOrBigText, Integer)',
        'RemoveRight(TextOrBigText, Integer)',
        'Right(TextOrBigText, Integer)',
    ];

    const concatBigtextList = ['Concatenate(TextOrBigText, TextOrBigText)'];

    const integerList = [
        'AbsOf(DecimalOrInteger)',
        'ANBAgeOf(Date, Date)',
        'CalendarMonthsDiffOf(Date, Date)',
        'CalendarYearsDiffOf(Date, Date)',
        'DaysDiffOf(Date, Date)',
        'DaysOf(Date)',
        'DurationOf(Date, Date)',
        'FullMonthsDiffOf(Date, Date)',
        'GetElementCount(IntakeRecordGUID, XPATH)',
        'IndexOf(TextOrBigText, TextOrBigText)',
        'IsLeapYearByYear(Integer)',
        'MaxOf(DecimalOrInteger, DecimalOrInteger)',
        'MinOf(DecimalOrInteger, DecimalOrInteger)',
        'MonthOf(Date)',
        'MonthsDiffOf(Date, Date)',
        'PolMonthOf(Date, Date)',
        'StringLength(TextOrBigText)',
        'ToInteger(Object)',
        'YearOf(Date)',
        'YearsDiffOf(Date, Date)',
    ];

    const decimalList = [
        'AbsOf(DecimalOrInteger)',
        'MaxOf(DecimalOrInteger, DecimalOrInteger)',
        'MinOf(DecimalOrInteger, DecimalOrInteger)',
        'PresentValue(Decimal, Integer, Decimal, Decimal, Decimal)',
        'TableMult(Text)',
        'ToDecimal(Object)',
        'TruncateNumber(Decimal, Integer)',
    ];

    const concatDecimalList = [
        'PresentValue(Decimal, Integer, Decimal, Decimal, Decimal)',
        'TableMult(Text)',
        'ToDecimal(Object)',
        'TruncateNumber(Decimal, Integer)',
    ];

    const booleanList = [
        'IsAlpha(TextOrBigText)',
        'IsAlphaNumeric(TextOrBigText)',
        'IsCurrency(Object)',
        'IsDate(Object)',
        'IsEmpty(Object)',
        'IsNumeric(TextOrBigText)',
    ];

    const currencyList = ['ToCurrency(DecimalOrInteger, Text)'];
    const decimalArrayList = ['ToDecimalArray(Object)'];
    const dateArrayList = ['ToDateArray(Object)'];
    const integerArrayList = ['ToIntegerArray(Object)'];

    const textArrayList = ['ClassMembership(TextArray)', 'ToTextArray(Object)'];

    switch (datatype) {
        case 'DATE':
            list = dateList;
            break;
        case 'TEXT':
            list = textList;
            break;
        case 'BIGTEXT':
            list = bigtextList;
            break;
        case 'INTEGER':
            list = integerList;
            break;
        case 'DECIMAL':
            list = decimalList;
            break;
        case 'BOOLEAN':
            list = booleanList;
            break;
        case 'CURRENCY':
            list = currencyList;
            break;
        case 'DECIMALARRAY':
            list = decimalArrayList;
            break;
        case 'DATEARRAY':
            list = dateArrayList;
            break;
        case 'INTEGERARRAY':
            list = integerArrayList;
            break;
        case 'TEXTARRAY':
            list = textArrayList;
            break;
        case 'STRINGARRAY':
            list = textArrayList;
            break;
        case undefined:
            list = dateList.concat(
                textList.concat(
                    concatBigtextList.concat(
                        integerList.concat(
                            concatDecimalList.concat(
                                booleanList.concat(
                                    currencyList.concat(
                                        decimalArrayList.concat(
                                            dateArrayList.concat(integerArrayList.concat(textArrayList)),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            );
            break;
    }
    return list.sort();
};

export const iconList = [
    '68-text-16x16.gif',
    'accountingIcon.gif',
    'detailIcon.gif',
    'accountingIcon.gif',
    'activityIcon.gif',
    'addActivityIcon.gif',
    'pendingActivityIcon.gif',
    'processedActivityIcon.gif',
    'addPolicyRoleIcon.gif',
    'deleteRoleIcon.gif',
    'editSegmentIcon.gif',
    'addChildSegmentIcon.gif',
    'addSegmentIcon.gif',
    'addSuspenseIcon.gif',
    'allocationsIcon.gif',
    'AsIconABLStop.gif',
    'AsIconABLTransfer.gif',
    '18-ConfirmationDoc-16x16.gif',
    'AsIconConfirm.gif',
    'AsIconDeath.gif',
    'AsIconDelivery.gif',
    'AsIconDirectDepositStatement.gif',
    'AsIconPrenote.gif',
    'AsIconCalendar.gif',
    'AsIconDollarCostAveraging.gif',
    'AsIconFreeLook.gif',
    'AsIconIssue.gif',
    'AsIconPayment.gif',
    'AsIconWithdrawal.gif',
    'configurationIcon.gif',
    'administrationIcon.gif',
    '67-fax-16x16.gif',
    'entryFieldsIcon.gif',
    'printStatusIcon.gif',
    'audioIcon.gif',
    'imagesIcon.gif',
    'calendarIcon.gif',
    'clientAddressIcon.gif',
    'deleteClientAddressIcon.gif',
    'editClientAddressIcon.gif',
    'addAddressIcon.gif',
    'commentsIcon.gif',
    'benefitSplitIcon.gif',
    'disbursementIcon.gif',
    'policyRoleIcon.gif',
    'editPolicyRoleIcon.gif',
    'editClientIcon.gif',
    'newClientIcon.gif',
    'historyTitleIcon.gif',
    'inquiryIcon.gif',
    'mathIcon.gif',
    'AsIconABLTransfer.gif',
    'editIcon.gif',
    'newPolicyIcon.gif',
    'policyIcon.gif',
    'searchPolicyIcon.gif',
    'segmentIcon.gif',
    'calculateSegment.gif',
    'folderIcon.gif',
    'policyPopupMenuImage.gif',
    'recycleIcon.gif',
    'rerunDocumentIcon.gif',
    'restartIcon.gif',
    'saveIcon.gif',
    'searchClientIcon.gif',
    'treeFolderIcon.gif',
    'spawnIcon.gif',
    'suspenseSearchIcon.gif',
    'symbolError16.gif',
    'symbolWarning16.gif',
    'gridInfoIcon.gif',
    'helpIcon.gif',
    'addToListIcon.gif',
    'trashCanIcon.gif',
    'percentIcon.gif',
    'valuationIcon.gif',
    'valuesIcon.gif',
    'windowCloseIcon.gif',
];
