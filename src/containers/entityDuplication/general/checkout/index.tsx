import React from "react";
import { ToggleSwitch } from "@equisoft/design-elements-react";
import { CheckedOutContent } from "./styles";

interface CheckoutSwitchProps {
    createCheckedOut: boolean,
    onChange: Function
}

export const CheckoutSwitch = ({ createCheckedOut, onChange } : CheckoutSwitchProps) =>
        <CheckedOutContent>
            <ToggleSwitch label='Checked Out'
                          toggled={createCheckedOut}
                          onToggle={(value: boolean) => onChange('createCheckedOut', value)}
                          required />
        </CheckedOutContent>

