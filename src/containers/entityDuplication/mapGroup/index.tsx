import { Button } from '@equisoft/design-elements-react';
import { Loading, TextInput, useLoading } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { ButtonSection } from '../../../components/general';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelTitle } from '../../../components/general/sidebar/style';
import {
    defaultEntitiesService,
    defaultEntityDuplicateService,
    defaultEntityInformationService,
    defaultSearchRulesService,
} from '../../../lib/context';
import { DuplicateMapsRule } from '../../../lib/domain/entities/duplicateMapRule';
import EntityService from '../../../lib/services/entitiesService';
import EntityDuplicateService from '../../../lib/services/entityDuplicateService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import SearchRulesService from '../../../lib/services/searchRulesService';
import { DuplicateContainer } from '../styles';

interface MapGroupProp {
    sourceMapGroup: DuplicateMapsRule;
    entityDuplicateService: EntityDuplicateService;
    entityService: EntityService;
    searchRulesService: SearchRulesService;
    entityInformationService: EntityInformationService;
}
type TypeAllowBusinessRules = string | Boolean;

const MapGroup = ({
    sourceMapGroup,
    entityDuplicateService,
    entityInformationService,
    searchRulesService,
}: MapGroupProp) => {
    const [loading, load] = useLoading();
    const { closeRightbar } = useContext(RightbarContext);
    const [map, setMap] = useState<DuplicateMapsRule>(sourceMapGroup);
    const dispatch = useTabActions();

    const duplicateMap = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const mapGroupExist = await searchRulesService.isMapGroupExist(map.newEntityName);
        if (mapGroupExist) {
            toast.error('Map Group already exists');
        } else {
            const mapCreated = await entityDuplicateService.duplicateMap(map);
            const entityInformation = await entityInformationService.getEntityInformation(
                mapCreated.entityType,
                mapCreated.getGuid(),
                'MAP',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            toast.success('Map Group duplicated successfully');
            closeRightbar();
        }
    });

    useEffect(() => {
        setMap(
            produce(map, (draft) => {
                draft.createCheckedOut = sourceMapGroup.createCheckedOut;
            }),
        );
    }, [sourceMapGroup.sourceEntityGuid]);

    const onChange = (field: keyof DuplicateMapsRule, value: TypeAllowBusinessRules) => {
        setMap(
            produce(map, (draft) => {
                (draft[field] as TypeAllowBusinessRules) = value;
            }),
        );
    };

    return (
        <>
            <PanelTitle>Duplicate Map</PanelTitle>
            <DuplicateContainer onSubmit={duplicateMap}>
                <Loading loading={loading} />
                <TextInput
                    defaultValue={map.newEntityName}
                    label="Map Group Name"
                    required
                    onChange={(e) => onChange('newEntityName', e.target.value)}
                />
                <ButtonSection>
                    <Button buttonType="primary" label="Save" />
                </ButtonSection>
            </DuplicateContainer>
        </>
    );
};

MapGroup.defaultProps = {
    entityDuplicateService: defaultEntityDuplicateService,
    entityService: defaultEntitiesService,
    searchRulesService: defaultSearchRulesService,
    entityInformationService: defaultEntityInformationService,
};

export default MapGroup;
