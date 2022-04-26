import React, {useCallback, useMemo, useState} from 'react';
export interface RightbarContextProps {
    rightbarSize: number;
    rightbarType: RightbarType;

    data?: any;

    openRightbar(type?: RightbarType, data?: any): void;
    closeRightbar(): void;
    setRightbarSize(size: number): void;
}

export const RIGHTBAR_MIN_SIZE = 15;
export const RIGHTBAR_DEFAULT_SIZE = 20;

const defaultRightbar: RightbarContextProps = {
    rightbarSize: RIGHTBAR_MIN_SIZE,
    openRightbar: () => { },
    closeRightbar: () => { },
    rightbarType: 'Info',
    setRightbarSize: () => { },
};

export const RightbarContext = React.createContext<RightbarContextProps>(defaultRightbar);

export type RightbarType =
    | 'Info'
    | 'Create_Test_Suite'
    | 'Add_Attached_Rules'
    | 'Add_Map_Criteria'
    | 'Generate_Xml'
    | 'Export_Data_Dictionary'
    | 'Build_Release'
    | 'Deploy_Release'
    | 'Create_Rule_entity'
    | 'Create_Transaction_Entity'
    | 'Import_Maps'
    | 'Export_Maps'
    | 'Import_Security_Groups'
    | 'Export_Security_Groups'
    | 'Import_Rates'
    | 'Export_Rates'
    | 'Create_Plan'
    | 'Create_Program'
    | 'Create_Link_Plan_Program'
    | 'Create_Link_Segment_Program'
    | 'Create_File_Entity'
    | 'Create_File_Output'
    | 'Create_Requirement'
    | 'Create_RequirementGroup'
    | 'Create_Quote'
    | 'Create_Product'
    | 'Create_Company'
    | 'Create_SegmentName'
    | 'Create_InquiryScreen'
    | 'Create_Code'
    | 'Create_Map'
    | 'Create_Fund'
    | 'Create_Plan_Fund'
    | 'Create_Related_Fund'
    | 'Create_Agreement'
    | 'Create_Exposed_Computation'
    | 'Create_Sql'
    | 'Create_IntakeProfileDefinition'
    | 'Config_PackageReviewers'
    | 'Create_Mask'
    | 'Create_Activity_Filter'
    | 'Create_Security_Entity'
    | 'Create_Workflow'
    | 'Create_Batch_Screen'
    | 'Manipulate_Oipa_User'
    | 'Create_Account'
    | 'Create_Entity'
    | 'Create_Entry'
    | 'Duplicate_Entity'
    | 'Create_CommentsTemplate'
    | 'Create_System_Date'
    | 'Manipulate_Config_Package'
    | 'Add_Comment_Config_Package'
    | 'Edit_Migration_Set'
    | '';

const RightbarProvider = (props: any) => {
    const [rightbarSize, setRightbarSize] = useState(RIGHTBAR_DEFAULT_SIZE);
    const [rightbarIsOpen, setRightbarIsOpen] = useState(false);
    const [rightbarType, setRightbarType] = useState<RightbarType>('');
    const [data, setData] = useState<any | undefined>(undefined);

    const openRightbar = useCallback((type: RightbarType, baseData?: any) => {
        setRightbarType(type);
        setData(baseData);
        if (rightbarSize < RIGHTBAR_MIN_SIZE && !rightbarIsOpen) {
            setRightbarSize(RIGHTBAR_MIN_SIZE);
        }
        setRightbarIsOpen(true);
    }, [rightbarSize, rightbarIsOpen]);

    const closeRightbar = () => {
        setRightbarIsOpen(false);
        setRightbarType('');
        setData(undefined);
    };

    const context = useMemo(
        () => {
            let newRightSideBarSize = 0;
            if(rightbarIsOpen) {
                if(rightbarSize < RIGHTBAR_DEFAULT_SIZE) {
                    newRightSideBarSize = RIGHTBAR_DEFAULT_SIZE;
                } else {
                    newRightSideBarSize = rightbarSize;
                }
            }

            return {
                openRightbar,
                closeRightbar,
                rightbarSize: newRightSideBarSize,
                rightbarType,
                setRightbarSize,
                data,
            }
        },
        [rightbarSize, rightbarIsOpen, rightbarType, openRightbar, data],
    );

    return <RightbarContext.Provider value={context} {...props} />;
};

export default RightbarProvider;
