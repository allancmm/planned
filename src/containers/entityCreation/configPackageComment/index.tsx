import React, { ChangeEvent } from "react";
import { Loading } from "equisoft-design-ui-elements";
import { PanelBreak, PanelContainer, PanelTitleContent } from "../../../components/general/sidebar/style";
import InputText from "../../../components/general/inputText";
import ConfigPackageService from "../../../lib/services/configPackageService";
import useConfigPackageCommentLogic from "./useConfigPackageCommentLogic";
import {Button} from "@equisoft/design-elements-react";
import {defaultConfigPackageService} from "../../../lib/context";

interface ConfigPackageCommentProps {
    configPackageGuid: string,
    configPackageService: ConfigPackageService,
    callback() : void,
}

const ConfigPackageComment = ({ configPackageGuid, callback, configPackageService } : ConfigPackageCommentProps) => {
    const { comments, addComment, loading, onChange} = useConfigPackageCommentLogic(configPackageService, configPackageGuid, callback);

    return (
        <>
            <Loading loading={loading} />
            <PanelContainer>
                <PanelTitleContent>
                    Add Comment
                </PanelTitleContent>

                <PanelBreak />

                <InputText
                    type='textarea'
                    label='Comment'
                    value={comments}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                    maxLength={255}
                />

                <Button
                   buttonType="primary"
                   disabled={loading}
                   onClick={addComment}
                >
                    Save
                </Button>
            </PanelContainer>
        </>
    );
}

export default ConfigPackageComment;

ConfigPackageComment.defaultProps = {
    configPackageService: defaultConfigPackageService
}