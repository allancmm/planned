import React from "react";
import { CustomTabContainer } from "./style";
import { EnsoSpinner } from "@equisoft/design-elements-react";

interface TabsProps {
    nameTab: string,
    running?: boolean,
    children: JSX.Element
}

// TODO - Allan - use Tabs from DS as soon as they fix the bug that prevents the tab to update its value
const Tabs = ({ nameTab, children, running = false } : TabsProps) =>
    (
        <CustomTabContainer>
            <div role="tablist"
                 aria-label="tabs label"
                 className="tab-buttons-container">
                <button role="tab"
                        aria-selected="true"
                        className="tab-button"
                >
                      <span className="tab-name">
                         {nameTab}
                      </span>
                    {running && <EnsoSpinner/>}
                </button>
            </div>
            <div className='tab-content'>
                {children}
            </div>
        </CustomTabContainer>
    );

export default Tabs;