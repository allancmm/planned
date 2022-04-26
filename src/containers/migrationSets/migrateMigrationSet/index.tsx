import React, { useEffect } from 'react';
import { Loading, WindowContainer } from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import { InputText, ModalDialog, ContainerCenterRight, Label, TabContainer } from "../../../components/general";
import {
    FileHeaderContainer,
    FileHeaderSection,
    FileHeaderLabel,
    FileHeaderValue,
} from "../../../components/editor/fileHeader/style";
import { defaultEnvironmentService, defaultMigrationSetService } from '../../../lib/context';
import EnvironmentService from '../../../lib/services/environmentService';
import MigrationSetService from '../../../lib/services/migrationSetService';
import ReviewMigrationSet from './reviewMigrationSet';
import {MigrationResponse} from "../../../lib/domain/entities/migrationResponse";
import useMigrationSetLogic from "./useMigrationSetLogic";
import useStyles from "./useStyles";
import MigrationSet from "../../../lib/domain/entities/migrationSet";
import {
    ButtonSection,
    CreateMigrationSetForm,
    PackageListContainer,
    PackageListSection,
    ListMigrationContainer,
    TargetContainer
} from './styles';

interface MigrateMigrationSet {
    tabId: string;
    environmentService: EnvironmentService;
    migrationSetService: MigrationSetService;
}

const MigrateMigrationSet = ({ environmentService, migrationSetService, tabId }: MigrateMigrationSet) => {
    const { fetchEnvironments,
            migrateMigrationSets,
            loading, target,
            targetOptions, migrationSets, onTargetChange,
            fetchReviews, reviews, show, toggle, migrationResponse, isDisableMigrate
          } = useMigrationSetLogic(tabId, environmentService, migrationSetService);

    const classes = useStyles();

    useEffect(() => {
        fetchEnvironments();
    }, []);


    return (
        <WindowContainer>
            <Loading loading={loading} />
            <TabContainer style={{ height: 'fit-content'}}>
                <FileHeaderContainer>
                    <FileHeaderSection>
                        <div>
                            <FileHeaderLabel>Type:</FileHeaderLabel>
                            <FileHeaderValue>Migrate Migration Set</FileHeaderValue>
                        </div>
                    </FileHeaderSection>
                </FileHeaderContainer>
            </TabContainer>
            <CreateMigrationSetForm onSubmit={migrateMigrationSets}>
                <TargetContainer>
                    <InputText
                        type='select'
                        label='Target'
                        value={target}
                        options={targetOptions}
                        onChange={onTargetChange}
                    />
                </TargetContainer>

                <ListMigrationContainer>
                    <Label text='Migration sets to be migrated' />
                    {migrationSets.map((m: MigrationSet) =>
                        <div key={m.migrationSetGuid}>
                            {m.migrationSetName}
                        </div>
                    )}
                </ListMigrationContainer>

                <ContainerCenterRight className={classes.containerButtons}>
                    <ButtonSection>
                        <Button
                            buttonType="secondary"
                            type="button"
                            onClick={fetchReviews} label="Load Conflicts"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            buttonType="primary"
                            disabled={isDisableMigrate}
                            label="Migrate"
                        />
                    </ButtonSection>
                </ContainerCenterRight>

                <ReviewMigrationSet reviews={reviews} />

                <ModalDialog
                    title="Migration Result"
                    isOpen={show}
                    onRequestClose={toggle}
                    footerContent={<Button buttonType='primary' onClick={toggle}>Close</Button>}
                >
                    <PackageListSection>
                        {migrationResponse.migrationResponses.map((r : MigrationResponse) => (
                            <PackageListContainer key={r.name}>
                                <span>{`${r.name} - ${r.status}`}</span>
                            </PackageListContainer>
                        ))}
                    </PackageListSection>
                </ModalDialog>
            </CreateMigrationSetForm>
        </WindowContainer>
    );
};

MigrateMigrationSet.defaultProps = {
    environmentService: defaultEnvironmentService,
    migrationSetService: defaultMigrationSetService,
};

export default MigrateMigrationSet;
