import React, {ChangeEvent, useEffect} from 'react';
import produce, { Draft } from 'immer';
import { WindowContainer, Loading, useLoading, Select, TextInput as TextInputRow } from 'equisoft-design-ui-elements';
import { Button } from '@equisoft/design-elements-react'
import { Grid, Divider } from '@material-ui/core';
import {useTabActions, useTabWithId} from "../../../components/editor/tabs/tabContext";
import { toast } from "react-toastify";
import TranslationSession from "../../../lib/domain/entities/tabData/translationSession";
import DataTable, { DataTableColumn } from "../../general/dataTable/table";
import InputText, { Options } from "../../../components/general/inputText";
import TranslationService from "../../../lib/services/translationService";
import { defaultCodeService, defaultTranslationService } from "../../../lib/context";
import Translation from "../../../lib/domain/entities/translation";
import CodeService from "../../../lib/services/codeService";
import { ButtonSearchSection, ButtonActionSection, TextRow } from "./style";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { v4 as uuid } from "uuid";
import CodeList from "../../../lib/domain/entities/codeList";
import { EDIT_TAB_DATA } from "../../../components/editor/tabs/tabReducerTypes";

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            margin: 0,
        },
        styleCell: {
            whiteSpace: 'normal',
            "& div" : {
                margin: '3px 0'
            }
        },
        button: {
            position: 'relative',
        }
    }),
);

interface TranslationsProps {
    tabId: string;
    translationService: TranslationService,
    codeService: CodeService
}

const Translations = ({ tabId, translationService, codeService } : TranslationsProps) => {
    const tab = useTabWithId(tabId);
    const { data } = tab;

    if (!(data instanceof TranslationSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const dispatch = useTabActions();

    const { translationSearch,
            locales,
            translations,
            isUpdated,
            pageTranslation } = data;

    const [loading, load] = useLoading();

    const updateData = (recipe: (draft: Draft<TranslationSession>) => void ) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, recipe)
            }
        });
    };

    const fetchLocaleCodes = load(async () => codeService.getLocaleCodes());

    useEffect(() => {
        if(locales.length === 0){
            fetchLocaleCodes().then((resp: CodeList) => {
                updateData((draft) => {
                    draft.locales = resp.codes.map(({ shortDescription }) =>
                        ({ label: shortDescription, value: shortDescription, checked: false  }))
                });
            });
        }
    }, []);

    const onClickSearch = load( async () =>  {
        const { translationKey, translationValue } = translationSearch;
        const localesChecked = locales.filter(({checked}) => checked).map(({label}) => label);
        const resp  = await translationService.searchTranslation(translationKey, translationValue, localesChecked);

        updateData((draft) => {
            draft.translations = resp;
            draft.isUpdated = false;
            draft.pageTranslation.totalElements = resp.length;
        });
    });

    const handleChangeTranslationSearch = (field : 'translationKey' | 'translationValue', value: string) => {
        updateData((draft) => {
            draft.translationSearch[field] = value;
        });
    };

    const handleChangeLocales = (value: string, checked: boolean) => {
        updateData((draft) => {
            const t = draft.locales.find((l) => l.value === value ) || new Options();
            t.checked = checked;
        });
    }

    const handleChangeRow = (translationGuid: string,
                             field: 'translationKey' | 'translationValue' | 'locale',
                             value: string ) => {

        updateData((draft) => {
            const index = draft.translations.findIndex((t) =>
                t.translationGuid === translationGuid);
            if(index > -1){
                draft.translations[index][field] = value;
                draft.translations[index].modified = true;
                draft.isUpdated = true;
            }
        });
    }

    const onAddRow = () => {
        updateData((draft) => {
            const t = new Translation();
            t.translationGuid = uuid();
            t.created = true;
            draft.translations.unshift(t);
            draft.isUpdated = true;
        });
    };

    const onApplyChanges = load(async () => {
        const translationsModified = translations.filter((t) => t.modified);
        if(translationsModified.length > 0){
            await translationService.updateTranslations(translationsModified);
            toast.success('Translations updated successfully');
        } else {
            toast.error('Nothing to update');
        }
    });

    const onClickCancel = () => {
       const list = translations.filter((t) => t.created);
       if(list.length === translations.length){
           updateData((draft) => {
               draft.translations = [];
               draft.isUpdated = false;
           });
       } else {
           onClickSearch();
       }
    }

    const classes = useStyles();

    const dataTableColumns: DataTableColumn[] = [
        {
            name: 'Translation Key',
            selector: 'translationKey',
            cell: (row: Translation) => {
                return !row.created ?
                    <TextRow>{row.translationKey}</TextRow> :
                    <TextInputRow value={row.translationKey}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleChangeRow(row.translationGuid,
                                            'translationKey',
                                            e.currentTarget.value)} />
            },
            styleCell: classes.styleCell
        },
        {
            name: 'Locale',
            selector: 'locale',
            cell: (row: Translation)=>
                !row.created ?
                    <TextRow>{row.locale}</TextRow> :
                    <Select
                        emptySelectText='Select locale'
                        options={locales}
                        value={row.locale}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            handleChangeRow(row.translationGuid,
                                'locale',
                                e.target.value)}
                    />
            ,
            styleCell: classes.styleCell
        },
        {
            name: 'Translation Value',
            selector: 'translationValue',
            cell: (row: Translation) =>
                <TextInputRow value={row.translationValue}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleChangeRow(row.translationGuid,
                                        'translationValue',
                                        e.currentTarget.value)} />,
            styleCell: classes.styleCell
        },
    ];

    const formTranslation = () =>
            <Grid container spacing={4} className={classes.container}>
                <Grid item sm={4}>
                    <InputText label='Translation Key'
                               value={translationSearch.translationKey}
                               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                   handleChangeTranslationSearch('translationKey', e.currentTarget.value)} />

                    <InputText label='Translation Value'
                               value={translationSearch.translationValue}
                               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                   handleChangeTranslationSearch('translationValue', e.currentTarget.value)} />

                </Grid>
                <Grid item sm={1}>
                    <InputText label='Locales'
                               type='checkbox'
                               options={locales}
                               checkedValues={locales.filter((loc) => loc.checked).map((l) => l.value)}
                               onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                   handleChangeLocales(event.currentTarget.value, event.target.checked)}
                    />
                </Grid>
                <Grid item sm={7} className={classes.button}>
                    <ButtonSearchSection>
                        <Button
                            buttonType="primary"
                            onClick={ onClickSearch }
                            label="Search"
                        />
                    </ButtonSearchSection>
                </Grid>
            </Grid>

    return (
        <WindowContainer>
            <Loading loading={loading} />

            {formTranslation()}

            <Divider />

            <DataTable
                columns={dataTableColumns}
                data={translations}
                keyColumn='translationGuid'
                hasSearchBar
                page={pageTranslation}
                actions={
                    <Button buttonType="tertiary" onClick={onAddRow}>
                        + Add Row
                    </Button>
                }
            />

            <ButtonActionSection>
                <Button buttonType="tertiary"
                        label='Cancel'
                        onClick={onClickCancel}
                        disabled={!isUpdated}
                 />
                <Button buttonType="primary"
                        label='Apply Changes'
                        onClick={onApplyChanges}
                        disabled={!isUpdated}
                />
            </ButtonActionSection>
        </WindowContainer>
    );
};

Translations.defaultProps =  {
    translationService: defaultTranslationService,
    codeService: defaultCodeService
};

export default  Translations;