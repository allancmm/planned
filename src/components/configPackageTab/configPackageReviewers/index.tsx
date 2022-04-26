import React, {ChangeEvent, FormEvent, useContext, useEffect, useRef, useState} from 'react';
import { LoadMethod } from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import { toast } from 'react-toastify';
import { defaultConfigPackageService } from '../../../lib/context';
import ConfigPackage from '../../../lib/domain/entities/configPackage';
import ConfigPackageService from '../../../lib/services/configPackageService';
import { useFocusedActiveTab } from '../../editor/tabs/tabContext';
import { RightbarContext } from '../../general/sidebar/rightbarContext';
import { PanelContainer, PanelBreak, PanelTitleContent } from '../../general/sidebar/style';
import {
    ReviewersContainer,
    ReviewerStyle,
    StyledForm,
    UserCheckIcon,
    UserIcon,
    ButtonSection,
    ReviewerEditStyle
} from './style';
import NoRecordsFound from "../../general/noRecordsFound";
import Label from "../../general/label";
import InputText from "../../general/inputText";
import { TextEllipsis } from "../../general";

interface ConfigPackageReviewersDataProps {
    configPackage: ConfigPackage;
    isEditMode: boolean;
    load: LoadMethod;
    assignReviewer(reviewersName: string[], comments: string): void;
}

interface ConfigPackageReviewersProps {
    configData: ConfigPackageReviewersDataProps;
    configPackageService: ConfigPackageService;
}

const ConfigPackageReviewersWizard = ({ configData, configPackageService }: ConfigPackageReviewersProps) => {
    const { configPackage, isEditMode, load, assignReviewer } = configData;
    const { closeRightbar } = useContext(RightbarContext);
    const [possibleReviewers, setPossibleReviewers] = useState<string[]>([]);
    const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
    const [comments, setComments] = useState('');
    const [, focusedTabId] = useFocusedActiveTab();
    const ref = useRef(false);

    useEffect(() => {
        if (ref.current) {
            closeRightbar();
        } else {
            ref.current = true;
        }
    }, [focusedTabId]);

    useEffect(() => {
        fetchPossibleReviewers();
    }, []);

    const fetchPossibleReviewers = load(async () => {
        const newPossibleReviewers = await configPackageService.getPossibleReviewers();
        const defaultReviewers = await configPackageService.getDefaultReviewers();
        setPossibleReviewers(newPossibleReviewers);
        setSelectedReviewers(configPackage.reviewersName.length > 0
            ? newPossibleReviewers.filter((r) => configPackage.reviewersName.includes(r))
            : newPossibleReviewers.filter((r) => defaultReviewers.includes(r))
        );
    });

    const addOrRemoveReviewer = (reviewer: string) => {
        setSelectedReviewers(
            selectedReviewers.indexOf(reviewer) !== -1
                ? selectedReviewers.filter((r) => r !== reviewer)
                : selectedReviewers.concat(reviewer),
        );
    };

    const saveReviewers = (event: FormEvent) => {
        event.preventDefault();
        if (selectedReviewers.length < configPackage.nbApprovalsRequired) {
            toast('At least ' + configPackage.nbApprovalsRequired + ' Reviewer Required');
        } else {
            assignReviewer(selectedReviewers, comments);
            closeRightbar();
        }
    };

    const reviewersList = () => {
        const usersPossibleReviewers = possibleReviewers
            .filter((r) => configPackage.reviewersName.includes(r));
        return (
            <ReviewersContainer>
                {usersPossibleReviewers.length > 0 ? usersPossibleReviewers
                    .map((r) => (
                        <ReviewerStyle key={r} selectable={false}>
                            <UserCheckIcon />
                            <TextEllipsis>{r}</TextEllipsis>
                        </ReviewerStyle>
                    )) : <NoRecordsFound />}
            </ReviewersContainer>
        );
    };

    const reviewersContainerForm = () => {
        return (
            <StyledForm id="AssignReviewersForm" onSubmit={saveReviewers}>
                <InputText
                    type='textarea'
                    label="Comments"
                    value={comments}
                    maxLength={255}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setComments(e.target.value)}
                />
                <ReviewersContainer>
                    <Label text='Reviewers'/>
                    {possibleReviewers.map((r) => (
                        <ReviewerEditStyle key={r}  onClick={() => addOrRemoveReviewer(r)} selectable={isEditMode}>
                            {selectedReviewers.includes(r) ? <UserCheckIcon /> : <UserIcon />}
                            <TextEllipsis>{r}</TextEllipsis>
                        </ReviewerEditStyle>
                    ))}
                </ReviewersContainer>
                <ButtonSection>
                    <Button type="submit" buttonType="primary" form="AssignReviewersForm">
                        Add
                    </Button>
                    <Button type="button" buttonType="tertiary" onClick={closeRightbar}>
                        Cancel
                    </Button>
                </ButtonSection>
            </StyledForm>
        );
    };

    return (
        <>
            {isEditMode ? (
                <PanelContainer>
                    <PanelTitleContent>Package Ready to Review</PanelTitleContent>
                    <PanelBreak />
                    {reviewersContainerForm()}
                </PanelContainer>
            ) : (
                reviewersList()
            )}
        </>
    );
};

ConfigPackageReviewersWizard.defaultProps = {
    configPackageService: defaultConfigPackageService,
};

export default ConfigPackageReviewersWizard;
