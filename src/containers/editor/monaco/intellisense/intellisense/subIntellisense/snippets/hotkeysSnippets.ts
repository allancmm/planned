import dedent from 'ts-dedent';
interface HotKeysSnippet {
    hotkeys: string;
    snippet: string;
    details?: string;
}

export const HotKeysSnippets: HotKeysSnippet[] = [
    {
        hotkeys: 'field',
        details: 'Add field',
        snippet: dedent(`
            <Field>
                <Name>\${1:name}</Name>
                <Display>\${2:display}</Display>
                <DataType>\${3:Text}</DataType>
            </Field>
        `),
    },
    {
        hotkeys: 'aloop',
        details: 'Create Array and loop over its indexes',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1:MyArray}" TYPE="STRINGARRAY" DATATYPE="TEXT" OPERATION="FILLBY-SQL">\${2:SELECT DUMMY FROM DUAL}</MathVariable>
            <MathVariable VARIABLENAME="\${3:MyArrayCount}" TYPE="AGGREGATEFUNCTION" METHOD="COUNT" DATATYPE="INTEGER">\${1:MyArray}</MathVariable>
            <MathLoop VARIABLENAME="Loop" TYPE="FOR" ITERATIONS="\${3:MyArrayCount}">
                <MathVariable VARIABLENAME="\${4:LoopIndex}" TYPE="LOOPINDEX" SOURCEARRAY="Loop" DATATYPE="INTEGER"/>
            </MathLoop>
        `),
    },
    {
        hotkeys: 'ase',
        details: 'Actions-ScreenMath-Events',
        snippet: dedent(`
            <Events>
                <Event TYPE="ONLOAD">
                    <ActionSet ID="\${1:OnLoadActionSet}"></ActionSet>
                </Event>
                <Event TYPE="ONSUBMIT">
                    <Math ID="\${2:GlobalScreenMath}"></Math>
                    <ActionSet ID="\${3:OnSubmitActionSet}"></ActionSet>
                </Event>
            </Events>
            <ScreenMath>
                <Math ID="\${2:GlobalScreenMath}">
                    <MathVariables>
                        <MathVariable VARIABLENAME="" TYPE="VALUE" DATATYPE="TEXT">00</MathVariable>
                    </MathVariables>
                </Math>
            </ScreenMath>
            <Actions>
                <ActionSet ID="\${1:OnLoadActionSet}">
                    <Condition IF="">
                        <Action></Action>	
                    </Condition>	
                </ActionSet>
                <ActionSet ID="\${3:OnSubmitActionSet}">
                    <Condition IF="">
                        <Action></Action>	
                    </Condition>	
                </ActionSet>
            </Actions>
        `),
    },
    {
        hotkeys: 'cp',
        details: 'Add CopyBook',
        snippet: dedent(`
            <CopyBook>CopyBook-\${1}</CopyBook>
        `),
    },
    {
        hotkeys: 'mv',
        details: 'Add MathVariable',
        snippet: dedent(`
            <MathVariable VARIABLENAME="\${1}" TYPE="VALUE" DATATYPE="TEXT">00</MathVariable>
        `),
    },
    {
        hotkeys: 'if',
        details: 'Add MathIF',
        snippet: dedent(`
            <MathIF IF="\${1}">
            </MathIF>
        `),
    },
    {
        hotkeys: 'loop',
        details: 'Add MathLoop',
        snippet: dedent(`
            <MathLoop VARIABLENAME="\${1:Loop}" TYPE="FOR" ITERATIONS="\${2:NumberOfIteration}">
                <MathVariable VARIABLENAME="LoopIndex" TYPE="LOOPINDEX" SOURCEARRAY="Loop" DATATYPE="INTEGER"/>			
            </MathLoop>
        `),
    },
    {
        hotkeys: 'segmentloop',
        details: 'Add SegmentLoop',
        snippet: dedent(`
            <MathLoop VARIABLENAME="\${1:SegmentLoop}" TYPE="SEGMENT" POLICY="\${2:[Policy:PolicyGUID]}">
                <MathVariable VARIABLENAME="SegmentGUID" TYPE="SEGMENTFIELD" SOURCEARRAY="SegmentLoop" DATATYPE="TEXT">SegmentGUID</MathVariable>
            </MathLoop>
        `),
    },
    {
        hotkeys: 'roleloop',
        details: 'Add RoleLoop',
        snippet: dedent(`
            <MathLoop VARIABLENAME="\${1:RoleLoop}" TYPE="OBJECTLOOP" OBJECTNAME="Role" CONDITION="\${2:PolicyGUID = '[Policy:PolicyGUID]}' AND StatusCode = '01'" KEY="RoleGUID">
                <MathVariable VARIABLENAME="RoleLoopObject" TYPE="OBJECT" OBJECTNAME="Role" SOURCEARRAY="RoleLoop" DATATYPE="OBJECT"/>
                <MathVariable VARIABLENAME="ClientGUID" TYPE="OBJECTFIELD" OBJECTNAME="Role" SOURCEOBJECT="RoleLoopObject" DATATYPE="TEXT">ClientGUID</MathVariable>
            </MathLoop>
        `),
    },
    {
        hotkeys: 'clientloop',
        details: 'Add ClientLoop',
        snippet: dedent(`
            <MathLoop VARIABLENAME="\${1:ClientLoop}" TYPE="OBJECTLOOP" OBJECTNAME="Client" CONDITION="\${2:ClientGUID = '[ClientGUID]'}" KEY="ClientGUID">
                <MathVariable VARIABLENAME="ClientLoopObject" TYPE="OBJECT" OBJECTNAME="Client" SOURCEARRAY="ClientLoop" DATATYPE="OBJECT"/>
                <MathVariable VARIABLENAME="(variablename)" TYPE="OBJECTFIELD" OBJECTNAME="Client" SOURCEOBJECT="ClientLoopObject" DATATYPE="">(clientfield)</MathVariable>
            </MathLoop>
        `),
    },
    {
        hotkeys: 'unittest',
        details: 'Create a basic test case',
        snippet: dedent(`
            <TestData>
                <Assessments>
                    <Assessment LABEL="\${1}">
                        <Observable>\${2}</Observable>
                        <ExpectedResult>\${3}</ExpectedResult>
                    </Assessment>
                </Assessments>
                <Mocks>
                    <Mock VARIABLENAME="\${4}" DATATYPE="\${5}">
                        <Return>\${6}</Return>
                        <OutputParameters>
                            <Parameter NAME="" DATATYPE=""></Parameter>
                        </OutputParameters>
                    </Mock>
                </Mocks>
            </TestData>
        `),
    },
    {
        hotkeys: 'mf',
        details: 'Add MultiFields',
        snippet: dedent(`
            <Multifields RULE="MultiField-\${1}"></Multifields>
        `),
    },
    {
        hotkeys: 'cdata',
        details: 'Add CDATA',
        snippet: dedent(`
            <![CDATA[\${1}]]>
        `),
    },
];
