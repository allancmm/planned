import React, { FormEvent, ReactNode} from "react";
import { ButtonContent, PanelSectionContainer, PanelTitleContent } from "../../../components/general/sidebar/style";
import { Loading } from "equisoft-design-ui-elements";
import {Button} from "@equisoft/design-elements-react";
import { v4 as uuid } from "uuid";
import {MainContainer} from "../../../components/general";

const ID_FORM = uuid();

interface FrameworkComponentProps {
    title: string,
    loading: boolean,
    labelButtons?: { main?: string, cancel?: string}
    children: ReactNode,
    onSubmit(e: FormEvent<HTMLFormElement>) : void,
    onCancel() : void
}
const FrameworkComponent = ({ title, loading, children, onSubmit, onCancel, labelButtons = { main: 'Create', cancel: 'Cancel'} } : FrameworkComponentProps) =>
    <MainContainer>
        <PanelSectionContainer>
            <PanelTitleContent>{title}</PanelTitleContent>
        </PanelSectionContainer>
        <form id={ID_FORM} onSubmit={onSubmit}>
            <Loading loading={loading} />
            {children}
            <ButtonContent>
                <Button type="submit" buttonType="primary" form={ID_FORM} disabled={loading}>
                    {labelButtons.main}
                </Button>
                <Button type="button" buttonType="tertiary" onClick={onCancel}>
                    {labelButtons.cancel}
                </Button>
            </ButtonContent>
        </form>
    </MainContainer>;

export default FrameworkComponent;