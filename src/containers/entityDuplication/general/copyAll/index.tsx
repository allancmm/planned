import React from "react";
import { ToggleSwitch } from "@equisoft/design-elements-react";
import { CopyAllContent } from "./styles";

interface CopyAllProps {
    copyAllRules: boolean,
    onChange: Function
}

export const CopyAllSwitch = ({ copyAllRules, onChange } : CopyAllProps) =>
        <CopyAllContent>
            <ToggleSwitch label='Copy All'
                          toggled={copyAllRules}
                          onToggle={(value: boolean) => onChange('copyAllRules', value)}
                          required />
        </CopyAllContent>

