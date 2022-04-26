import React, { FormEvent } from 'react';
import { MultiSelectDropdown, SelectedField } from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import { Grid } from "@material-ui/core";
import { produce } from 'immer';
import StatsHeaderData from '../../../lib/domain/entities/statsHeaderData';
import { ButtonContent, MultiSelectContainer, ButtonContainer } from './style';
import InputText from "../../../components/general/inputText";
import Label from "../../../components/general/label";
import { dateToString } from "../../../lib/util/date";
import { toast } from "react-toastify";

interface PanelHeaderProps {
    data: StatsHeaderData;
    selectableFields: SelectedField[];
    refreshPanel(): void;
    setHeaderData(data: StatsHeaderData): void;
}

const PanelHeader = ({ data, selectableFields, refreshPanel, setHeaderData }: PanelHeaderProps) => {
    const renderDate = (label: string, field: 'start' | 'end') => {
        return <InputText type="date"
                          label={label}
                          value={dateToString(data[field])}
                          onChange={(date: Date) => {
                              setHeaderData(
                                  produce(data, (draft) => {
                                      draft[field] = date;
                                  }),
                              )
                          }}
        />
    }

    const renderUsernameList = () => {
        return (
            <div>
                <Label text='User' />
                <MultiSelectContainer>
                    <MultiSelectDropdown
                        selectedFields={data.selectedUsernames}
                        selectableFields={selectableFields}
                        setSelectedFields={setSelectedFields}
                        getSelectedFieldFromName={(name) => ({name, displayName: name})}
                        selectAll={false}
                        defaultSelectMessage={'Select an option'}
                    />
                </MultiSelectContainer>
            </div>
        );
    };

    const setSelectedFields = (fields: SelectedField[]) => {
        setHeaderData(
            produce(data, (draft) => {
                draft.selectedUsernames = fields;
            }),
        );
    };

    const tryRefreshPanel = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (data.selectedUsernames.length > 0) {
            refreshPanel();
        } else {
            toast.error('Select at least one user');
        }
    };

    return (
        <Grid container spacing={2}>
             <Grid item xs={12} sm={12} md={2}>
                 {renderDate('Start Period', 'start')}
             </Grid>
            <Grid item xs={12} sm={12} md={2}>
                {renderDate('End Period', 'end')}
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
                {renderUsernameList()}
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
                <ButtonContainer>
                    <ButtonContent>
                        <Button type="submit" buttonType="primary" onClick={tryRefreshPanel}>
                            Refresh
                        </Button>
                    </ButtonContent>
                </ButtonContainer>
            </Grid>
        </Grid>
    );
};

export default PanelHeader;
