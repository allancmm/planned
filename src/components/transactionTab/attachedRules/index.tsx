import {Button, Loading, MultiSelect, TextInput, useLoading} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {FormEvent, useContext, useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import {Key} from 'ts-key-enum';
import {useFocusedActiveTab, useTabActions } from '../../editor/tabs/tabContext';
import {OPEN} from '../../editor/tabs/tabReducerTypes';
import {RightbarContext} from '../../general/sidebar/rightbarContext';
import {PanelTitle} from '../../general/sidebar/style';
import {defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import {AttachedRuleDto} from '../../../lib/domain/entities/createTransactionRequest';
import EntityAttachedRulesRequest from '../../../lib/domain/entities/entityAttachedRulesRequest';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import {
    AttachedRulesContainer,
    StyledForm,
    SelectedList,
    SelectedMark,
    PanelLabel,
    SearchLineWrapper,
    SearchFieldIcon,
    SearchButton,
    SearchFieldWrapper, SearchField, LeftButtonWrapper, RightButtonWrapper
} from './style';
import { EntityType } from '../../../lib/domain/enums/entityType';

interface AddAttachedRulesProps {
    ruleData: { ruleGuid: string, ruleType: EntityType };
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const AddAttachedRules = ({ ruleData, entityService, entityInformationService}: AddAttachedRulesProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [request, setRequest] = useState<EntityAttachedRulesRequest>(new EntityAttachedRulesRequest());
    const [selectedAttachedRules, setSelectedAttachedRules] = useState<string[]>([]);
    const [currentAttachedRules, setCurrentAttachedRules] = useState<string[]>([]);
    const [attachedRules, setAttachedRules] = useState<AttachedRuleDto[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, load] = useLoading();
    const [,focusedTabId] = useFocusedActiveTab();

    const { ruleGuid: guid = '', ruleType: type } = ruleData;
    const ref = useRef(false);

    // TODO - Allan - confirm whether we really need to close this component when changing the tab
    useEffect(() => {
        if (ref.current) {
            closeRightbar();
        } else {
            ref.current = true;
        }
    }, [focusedTabId]);

    const fetchAttachedRules = load(async (query: string) => {
        const level = (await entityService.getEntityLevel(guid, type));
        setRequest(
            produce(request, (draft) => {
                draft.guid = guid;
                draft.level = level;
                draft.type = type;
            }),
        );
        const currentSelectedRules = await entityService.getAttachedRulesForEntity(guid, type);
        setCurrentAttachedRules(currentSelectedRules);
        const allAttachedRules = await entityService.getLevelAttachedRules(level, query);
        setAttachedRules(allAttachedRules.filter((s) => !currentSelectedRules.includes(s.name)));
    });

    useEffect(() => {
        fetchAttachedRules(searchQuery);
    }, []);

    const handleAttachedRule = (selected: string[]) => {
        setSelectedAttachedRules(selected);
        setRequest(
            produce(request, (draft) => {
                draft.attachedRules = selected;
            }),
        );
    };

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();
        fetchAttachedRules(searchQuery);
    };

    const clearSearch = (event: FormEvent) => {
        event.preventDefault();
        setSearchQuery( '');
        fetchAttachedRules('');
    };

    const submitAttachedRules = load(async(event: FormEvent) => {
        event.preventDefault();
        const createdRules = await entityService.updateEntityAttachedRules(request);
        for (const rule of createdRules) {
            const entityInformation = await entityInformationService.getEntityInformation(
                rule.entityType,
                rule.getGuid(),
                'XML_DATA',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation }});
        }
        toast.success('Attached rules saved!');
        closeRightbar();
    });

    return (
        <>
            <PanelTitle>Add Attached Rules</PanelTitle>
            <Loading loading={loading} />
            {(currentAttachedRules.length > 0) && (<PanelLabel>Current Attached Rules</PanelLabel>)}
            {currentAttachedRules.length > 0 && (
                <SelectedList>
                    {currentAttachedRules.map((rule) => (
                        <li key={rule}><SelectedMark />{rule}</li>
                    ))}
                </SelectedList>
            )}
            <StyledForm id="AddAttachedRulesForm" onSubmit={submitAttachedRules}>
                {attachedRules.length === 0 && (<AttachedRulesContainer>Search returns no results</AttachedRulesContainer>)}
                {attachedRules.length > 0 && (
                    <AttachedRulesContainer>
                        <MultiSelect
                            name={'Available Attached Rules'}
                            items={attachedRules.map((rule) => ({
                                id: attachedRules.indexOf(rule),
                                label: rule.name,
                            }))}
                            selectedItems={selectedAttachedRules}
                            onChange={handleAttachedRule}
                        />
                    </AttachedRulesContainer>
                )}
                <SearchLineWrapper>
                    <SearchFieldWrapper>
                        <SearchFieldIcon />
                        <SearchField>
                            <TextInput
                                name="Search"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === Key.Enter && handleSearch(e)}
                            />
                        </SearchField>
                    </SearchFieldWrapper>
                    <SearchButton onClick={handleSearch}>Search</SearchButton>
                </SearchLineWrapper>
                <LeftButtonWrapper>
                    <Button type="submit" buttonType="primary" form="AddAttachedRulesForm">Add</Button>
                    <Button type="button" buttonType="tertiary" onClick={closeRightbar}>Cancel</Button>
                </LeftButtonWrapper>
                <RightButtonWrapper>
                    <Button type="button" buttonType="tertiary" onClick={clearSearch}>Clear Search</Button>
                </RightButtonWrapper>
            </StyledForm>
        </>
    );
};

AddAttachedRules.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default AddAttachedRules;