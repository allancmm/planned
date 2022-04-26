import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from "react";
import {immerable, produce} from 'immer';
import { CollapseContainer, useLoading, AsyncSelect } from "equisoft-design-ui-elements";
import { InputText, Options } from "../../../components/general";
import { RightbarContext } from "../../../components/general/sidebar/rightbarContext";
import { PanelSectionContainer } from "../../../components/general/sidebar/style";
import { defaultEntitiesService, defaultEntityInformationService, defaultOipaUserService } from "../../../lib/context";
import EntityService from "../../../lib/services/entitiesService";
import EntityInformationService from "../../../lib/services/entityInformationService";
import { EntityLevel } from "../../../lib/domain/enums/entityLevel";
import CreateActivityFilterRequest from "../../../lib/domain/entities/createActivityFilterRequest";
import BasicEntity from "../../../lib/domain/entities/basicEntity";
import { OverrideEnumType } from "../../general/components/overrideEnum";
import StateGeneralProps from "../../general/components/stateGeneralProps";
import GeneralComponent from "../../general/components/generalComponent";
import { useTabActions } from "../../../components/editor/tabs/tabContext";
import { OPEN } from "../../../components/editor/tabs/tabReducerTypes";
import OipaUserService from "../../../lib/services/oipaUserService";
import OipaUser from "../../../lib/domain/entities/oipaUser";
import Pageable from "../../../lib/domain/util/pageable";
import { OptionsList, Response } from "react-select-async-paginate";
import FrameworkComponent from "../frameworkComponent";
import {UserNameContainer} from "./styles";
import {validateRequiredFields} from "../util";

const optionsLevel: Options[] = [
    { label: 'Select Level', value: '' },
    { label: 'Client', value: 'CLIENT' },
    { label: 'Policy', value: 'POLICY' },
    { label: 'Plan', value: 'PLAN' }
];

class ErrorActivityFilter {
    [immerable] = true;
    filterName = '';
    level = '';
}

interface ActivityFilterProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
    oipaUserService: OipaUserService;
}
const ActivityFilterCreationWizard = ({ entityService, entityInformationService, oipaUserService,
}: ActivityFilterProps) => {

    const { closeRightbar } = useContext(RightbarContext);
    const [request, setRequest] = useState<CreateActivityFilterRequest>(new CreateActivityFilterRequest());
    const [loading, load] = useLoading();
    const [selectLevel, setSelectLevel] = useState<EntityLevel>();
    const [securityGroups, setSecurityGroups] = useState<BasicEntity[]>([]);
    const [generalComponentState, setGeneralComponentState] = useState<StateGeneralProps>();
    const [overridesList, setOverridesList] = useState<BasicEntity[]>([]);
    const [renderGeneralComponent, setRenderGeneralCommponent] = useState<React.ReactElement>();
    const dispatch = useTabActions();
    const [user] = useState<OipaUser>();
    const [isUser, setIsUser] = useState<boolean>(false);
    const [isSecurityGroup, setIsSecurityGroup] = useState<boolean>(false);

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorActivityFilter());

    const optionsSecurityGroup = useMemo(() => [
        { label: securityGroups.length > 0 ? 'Security Group' : ' No Security Group Available', value: ''},
        ...securityGroups.map((s) => ({
            label: s.name,
            value: s.value,
        }))
    ], [securityGroups]);

    useEffect(() => {
        setRenderGeneralCommponent(
            <GeneralComponent
                data={request}
                filteredOverrides={overridesList}
                setOverridesList={setOverridesList}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={(state) => {
                    setShowMessageOverride(false);
                    setGeneralComponentState(state);
                }}
            />
        );
    }, [selectLevel, overridesList, showMessageOverride]);

    useEffect(() => {
        fetchSecurity();
    }, [generalComponentState]);

    const fetchSecurity = load(async () => {
        if (generalComponentState &&
            (generalComponentState.code === OverrideEnumType.PCOMPANY.code)) {
            setSecurityGroups(await entityService.getSecurityGroups(generalComponentState.guid));
        }
    });

    const handleNameChanged = async (val: string) => {
        setRequest(
            produce(request, (draft) => {
                draft.filterName = val;
            }),
        );
        setError(produce(error, (draft => {
            draft.filterName = '';
        })));
    };

    const createActivityFilter = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let typeCode = '';
        if (request.level === 'POLICY') {
            switch (request.overrideLevel) {
                case 'COMPANY':
                    if (isUser) {
                        typeCode = '04'
                    } else if (isSecurityGroup) {
                        typeCode = '03'
                    } else {
                        typeCode = '02'
                    }
                    break;
                case 'PLAN':
                    typeCode = '01'
                    break;
            }
        } else if (request.level === 'PLAN') {
            switch (request.overrideLevel) {
                case 'COMPANY':
                    if (isUser) {
                        typeCode = '08'
                    } else if (isSecurityGroup) {
                        typeCode = '07'
                    } else {
                        typeCode = '06'
                    }
                    break;
                case 'PLAN':
                    typeCode = '05'
                    break;
            }
        } else if (request.level === 'CLIENT') {
            switch (request.overrideLevel) {
                case 'COMPANY':
                    if (isUser) {
                        typeCode = '12'
                    } else if (isSecurityGroup) {
                        typeCode = '11'
                    } else {
                        typeCode = '10'
                    }
                    break;
                case 'PLAN':
                    typeCode = '09'
                    break;
            }
        }
        request.typeCode = typeCode;
        doCreation(e);
    };

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const doCreation = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }
        const filter = await entityService.createActivityFilter(request);
        const entityInformation = await entityInformationService.getEntityInformation(
            filter.entityType,
            filter.getGuid(),
            'XML_DATA',
        );

        dispatch({ type: OPEN, payload: { data: entityInformation } });

        closeRightbar();
    });

    const handleLevelChanged = load(async (value: EntityLevel) => {
        setSelectLevel(value);
        setRequest(
            produce(request, (draft) => {
                draft.level = value;
            }),
        );
        if (value) {
            switch (value) {
                case 'CLIENT':
                    setOverridesList([
                        { name: 'Select one', value: 'NONE' },
                        { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code }
                    ]);
                    break;
                case 'PLAN':
                case 'POLICY':
                    setOverridesList([
                        { name: 'Select one', value: 'NONE' },
                        { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code },
                        { name: OverrideEnumType.SCOMPANY.value, value: OverrideEnumType.SCOMPANY.code },
                        { name: OverrideEnumType.PLAN.value, value: OverrideEnumType.PLAN.code }
                    ]);
                    break;
                default:
                    setOverridesList([]);
                    break;
            }
        }
        setError(produce(error, (draft => {
            draft.level = '';
        })))
    });

    const handleSecurityGroupField = (group: string) => {
        if (group) {
            setIsUser(false);
            setIsSecurityGroup(true);
            setRequest(
                produce(request, (draft) => {
                    draft.securityGroupGuid = group;
                }),
            );
        }
    };

    const handleUserSelect = (client: OipaUser) => {
        setRequest(
            produce(request, (draft) => {
                draft.clientGuid = client.clientGuid;
            }),
        );
        setIsUser(true);
        setIsSecurityGroup(false);
    };

    const entitiesOptions = async (
        inputValue: string,
        _: OptionsList,
        { page }: { page: Pageable },
    ): Promise<Response> => {
        const response = await oipaUserService.getUserListForSelect(page, inputValue);

        return {
            options: response.users,
            hasMore: !response.page.isLast(),
            additional: {
                page: response.page.nextPage(),
            },
        };
    };

    return (
        <FrameworkComponent
            title='Create Activity Filter'
            loading={loading}
            onSubmit={createActivityFilter}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='text'
                        value={request.filterName}
                        label="Filter Name"
                        required
                        feedbackMsg={error.filterName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChanged(e.target.value)}
                    />

                    <InputText
                        type='custom-select'
                        value={request.level}
                        label="Activity Screen"
                        options={optionsLevel}
                        required
                        feedbackMsg={error.level}
                        onChange={(o: Options) => handleLevelChanged(o.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title="Override" defaultOpened>
                <PanelSectionContainer>
                    {renderGeneralComponent}
                </PanelSectionContainer>
            </CollapseContainer>

            {generalComponentState &&
                (generalComponentState.code === OverrideEnumType.PCOMPANY.code) && (
                    <CollapseContainer title="User">
                        <UserNameContainer>
                            <AsyncSelect
                                label="User name"
                                value={user}
                                getOptionLabel={(o: OipaUser) => o.firstName + ' ' + o.lastName}
                                getOptionValue={(o: OipaUser) => o.clientGuid}
                                emptySelectText={'Select user'}
                                loadOptions={entitiesOptions}
                                additional={{
                                    page: Pageable.withPageOfSize(10),
                                }}
                                disabled={isSecurityGroup}
                                onChange={handleUserSelect}
                            />
                        </UserNameContainer>
                    </CollapseContainer>
                )}

            {generalComponentState &&
                (generalComponentState.code === OverrideEnumType.PCOMPANY.code) && (

                    <CollapseContainer title="Security">
                        <PanelSectionContainer>
                            <InputText
                                type='custom-select'
                                label="Security Group"
                                value={request.securityGroupGuid}
                                options={optionsSecurityGroup}
                                onChange={(o: Options) => handleSecurityGroupField(o.value)}
                                disabled={isUser}
                            />
                        </PanelSectionContainer>
                    </CollapseContainer>
                )}
        </FrameworkComponent>
    );
};

ActivityFilterCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
    oipaUserService: defaultOipaUserService,
};

export default ActivityFilterCreationWizard;