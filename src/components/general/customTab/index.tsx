import React, {ChangeEvent, useState} from "react";
import { Tabs as TabsMaterial, Tab as TabMaterial } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { EnsoSpinner } from "@equisoft/design-elements-react";
import {TabsContainer, TabContainer, TabPanelContainer, ActionTabContainer, ActionTabContent} from "./style";

interface CustomTabPanelProps {
    children: JSX.Element,
    value: number,
    index: number
}
export const CustomTabPanel = ({ children, value, index, ...other } : CustomTabPanelProps) =>
    <TabPanelContainer
         hidden={value !== index}
         id={`tab-panel-${index}`}
         aria-labelledby={`tab-${index}`}
         {...other}
    >
        {value === index && children}
    </TabPanelContainer>;


interface CustomTabsProps {
    listTabs: JSX.Element[],
    value: number,
    actionTab?: JSX.Element,
    handleChange(e: ChangeEvent<{}>, value: number) : void,
}

export const CustomTabs = ({ listTabs, value, handleChange, actionTab } : CustomTabsProps) =>
        <TabsContainer>
            <TabsMaterial value={value} onChange={handleChange} indicatorColor="primary">
                {listTabs.map((TabItem) => TabItem)}
                {actionTab &&
                    <ActionTabContainer>
                        <ActionTabContent>
                            {actionTab}
                        </ActionTabContent>
                    </ActionTabContainer>
                }
            </TabsMaterial>
        </TabsContainer>;

interface CustomTabProps { label: string, id: string, running: boolean }

export const CustomTab = ({ label, id, running, ...others } : CustomTabProps) => {
    const useStyles = makeStyles(() => createStyles({
        labelContainer: {
            width: "auto",
            padding: 0
        },
        iconLabelWrapper: {
            flexDirection: "row-reverse"
        }
    }));

    const classes = useStyles();

    return (
        <TabContainer>
            <TabMaterial
                label={label}
                id={id}
                icon={ running ? <EnsoSpinner/> : <></>}
                classes={{
                    wrapper: classes.iconLabelWrapper,
                    labelIcon: classes.labelContainer
                }}
                {...others}
            />
        </TabContainer>
    )};

interface TabsProps {
    tabs: { label: string,
            panelContent: JSX.Element
          }[],
    running: boolean,
    actionTab?: JSX.Element,
    handleChange?(e: ChangeEvent<{}>, value: number) : void
}
const Tabs = ({ tabs, running, handleChange, actionTab } : TabsProps) => {
    const [indexTab, setIndexTab] = useState(0);

    const listTabs = tabs.map((item, index) => <CustomTab key={index} label={item.label} id={index.toString()} running={running && indexTab === index} />);
    return (
        <div>
            <CustomTabs
                listTabs={listTabs}
                value={indexTab}
                handleChange={(e, index) => {
                    setIndexTab(index);
                    handleChange?.(e, index);
                }}
                actionTab={actionTab}
            />
            {tabs.map((item, index) =>
                <CustomTabPanel key={index} value={indexTab} index={index}>
                    {item.panelContent}
                </CustomTabPanel>
            )}
        </div>
    );
}

export default Tabs;
