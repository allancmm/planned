import React, { useContext } from 'react';
import { ArrowRight } from 'react-feather';
import {defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import Country from '../../../lib/domain/entities/country';
import Currency from '../../../lib/domain/entities/currency';
import ErrorCatalog from '../../../lib/domain/entities/errorCatalog';
import MarketMaker from '../../../lib/domain/entities/marketMaker';
import Sequence from '../../../lib/domain/entities/sequence';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import SystemDateSession from '../../../lib/domain/entities/tabData/SystemDateSession';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import { AuthContext } from '../../../page/authContext';
import { RightbarContext } from '../../general/sidebar/rightbarContext';
import { useTabActions } from '../tabs/tabContext';
import { OPEN } from '../tabs/tabReducerTypes';
import { NavBarMenuItem } from './style';
import SubMenuButton from './submenubutton';
import OipaUserSession from '../../../lib/domain/entities/tabData/oipaUserSession';
import TranslationSession from "../../../lib/domain/entities/tabData/translationSession";
import OIPASecurityGroupSession from '../../../lib/domain/entities/tabData/oipaSecurityGroupSession';

interface EntityMenuProps {
    entityInformationService: EntityInformationService;
    entitiesService: EntityService
}

const EntityMenu = ({ entityInformationService }: EntityMenuProps) => {
    const { openRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const { auth } = useContext(AuthContext);

    const openErrorCatalogs = async () => {
        const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
            'ERROR_CATALOG',
            ErrorCatalog.guid,
            'ERROR_CATALOG',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
    };

    const openCountries = async () => {
        const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
            'COUNTRY',
            Country.guid,
            'COUNTRY',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
    };

    const openCurrencies = async () => {
        const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
            'CURRENCY',
            Currency.guid,
            'CURRENCY',
        );

        dispatch({ type: OPEN, payload: { data: entityInformation } });
    };

    const openMarketMakers = async () => {
        const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
            'MARKET',
            MarketMaker.guid,
            'MARKET_MAKER',
        );

        dispatch({ type: OPEN, payload: { data: entityInformation } });
    };

    const openSequences = async () => {
        const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
            'SEQUENCE',
            Sequence.guid,
            'SEQUENCE',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
    };

    const openSystemDates = async () => {
        const tabData: SystemDateSession = new SystemDateSession()
        dispatch({ type: OPEN, payload: { data: tabData } });
    }

    const openTranslation = async () => {
        dispatch({ type: OPEN, payload: { data: new TranslationSession() } });
    };

    const openOIPAUser = () => {
        dispatch({ type: OPEN, payload: { data: new OipaUserSession() } })
    };

    const openOIPASecurityGroup = async () => {
        dispatch({ type: OPEN, payload: { data: new OIPASecurityGroupSession() } })
    };

    return (
        <NavBarMenuItem>
            <button aria-haspopup="true" aria-expanded="false">
                Entities
            </button>
            <ul aria-hidden="true">
                <li>
                    <SubMenuButton
                        onClick={() => openRightbar('Create_Rule_entity')}
                        title={'New Business Rule'}
                        shortcut={''}
                    />
                </li>
                <li>
                    <SubMenuButton
                        onClick={() => openRightbar('Create_Transaction_Entity')}
                        title={'New Transaction'}
                        shortcut={''}
                    />
                </li>
                <NavBarMenuItem>
                    <SubMenuButton title={'New'} rIcon={<ArrowRight />} />
                    <ul>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_SegmentName')}
                                title={'Segment Name'}
                                shortcut={''}
                            />
                        </li>
                        <NavBarMenuItem>
                            <SubMenuButton title={'Requirement'} rIcon={<ArrowRight />} />
                            <ul>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Requirement')}
                                        title={'Requirement Definition'}
                                        shortcut={''}
                                    />
                                </li>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_RequirementGroup')}
                                        title={'Requirement Group Criteria'}
                                        shortcut={''}
                                    />
                                </li>
                            </ul>
                        </NavBarMenuItem>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_InquiryScreen')}
                                title={'InquiryScreen'}
                                shortcut={''}
                            />
                        </li>

                        <hr />

                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Code')}
                                title={'Code Name'}
                                shortcut={''}
                            />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Map')}
                                title={'Map Group'}
                                shortcut={''}
                            />
                        </li>

                        <NavBarMenuItem>
                            <SubMenuButton title={'Fund'} rIcon={<ArrowRight />} />
                            <ul>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Fund')}
                                        title={'Fund'}
                                        shortcut={''}
                                    />
                                </li>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Plan_Fund')}
                                        title={'Plan Fund'}
                                        shortcut={''}
                                    />
                                </li><li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Related_Fund')}
                                        title={'Related Fund'}
                                        shortcut={''}
                                    />
                                </li>
                            </ul>
                        </NavBarMenuItem>

                        <hr />

                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_File_Entity')}
                                title={'AsFile'}
                                shortcut={''}
                            />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_File_Output')}
                                title={'File Output'}
                                shortcut={''}
                            />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Exposed_Computation')}
                                title={'Exposed Computation'}
                                shortcut={''}
                            />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Agreement')}
                                title={'Agreement'}
                                shortcut={''}
                            />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_IntakeProfileDefinition')}
                                title={'Intake Profile Definition'}
                                shortcut={''}
                            />
                        </li>
                        <NavBarMenuItem>
                            <SubMenuButton title={'Program'} rIcon={<ArrowRight />} />
                            <ul>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Program')}
                                        title={'Program Definition'}
                                        shortcut={''}
                                    />
                                </li>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Link_Plan_Program')}
                                        title={'Link Plan Program'}
                                        shortcut={''}
                                    />
                                </li>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Link_Segment_Program')}
                                        title={'Link Segment Program'}
                                        shortcut={''}
                                    />
                                </li>
                            </ul>
                        </NavBarMenuItem>
                        <li>
                            {auth.oipaVersion === '113' && (
                                <SubMenuButton
                                    onClick={() => openRightbar('Create_Quote')}
                                    title={'Quote Definition'}
                                    shortcut={''}
                                />
                            )}
                        </li>

                        <hr />

                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Mask')}
                                title={'Mask Detail'}
                                shortcut={''}
                            />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Workflow')}
                                title={'Workflow Task Definition'}
                                shortcut={''}
                            />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Sql')}
                                title={'Sql Script'}
                                shortcut={''}
                            />
                        </li>
                        <hr />
                        <NavBarMenuItem>
                            <SubMenuButton title={'Chart Of Accounts'} rIcon={<ArrowRight />} />
                            <ul>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Account')}
                                        title={'Account'}
                                        shortcut={''}
                                    />
                                </li>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Entity')}
                                        title={'Entity'}
                                        shortcut={''}
                                    />
                                </li>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Entry')}
                                        title={'Entry'}
                                        shortcut={''}
                                    />
                                </li>
                            </ul>
                        </NavBarMenuItem>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Security_Entity')}
                                title={'Security Group'}
                                shortcut={''}
                            />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Batch_Screen')}
                                title={'Batch Screen'}
                                shortcut={''}
                            />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_Activity_Filter')}
                                title={'Activity Filter'}
                                shortcut={''}
                            />
                        </li>
                        <hr />
                        <NavBarMenuItem>
                            <SubMenuButton title={'Business Entity'} rIcon={<ArrowRight />} />
                            <ul>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Company')}
                                        title={'Company'}
                                        shortcut={''}
                                    />
                                </li>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Product')}
                                        title={'Product'}
                                        shortcut={''}
                                    />
                                </li>
                                <li>
                                    <SubMenuButton
                                        onClick={() => openRightbar('Create_Plan')}
                                        title={'Plan'}
                                        shortcut={''}
                                    />
                                </li>
                            </ul>
                        </NavBarMenuItem>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Create_CommentsTemplate')}
                                title={'Comments Template'}
                                shortcut={''}
                            />
                        </li>
                    </ul>
                </NavBarMenuItem>
                <hr />
                <li>
                    <SubMenuButton onClick={openTranslation} title='Translation' shortcut='' />
                </li>
                <li>
                    <SubMenuButton onClick={openErrorCatalogs} title='Error Catalog' shortcut='' />
                </li>
                <li>
                    <SubMenuButton onClick={openCountries} title='Countries' shortcut='' />
                </li>
                <li>
                    <SubMenuButton onClick={openCurrencies} title='Currencies' shortcut='' />
                </li>
                <li>
                    <SubMenuButton onClick={openMarketMakers} title='Market Makers' shortcut='' />
                </li>
                <li>
                    <SubMenuButton onClick={openSequences} title='Sequences' shortcut='' />
                </li>
                <li>
                    <SubMenuButton onClick={openSystemDates} title='System Dates' shortcut='' />
                </li>
                <hr />
                <li>
                    <SubMenuButton
                        onClick={openOIPAUser}
                        title='OIPA User'
                        shortcut=''
                        active={!auth.appFunctionDisabled(["ENTITIES_OIPA_USER"])}
                    />
                </li>
                <li>
                    <SubMenuButton
                        onClick={openOIPASecurityGroup}
                        title='OIPA Security Group'
                        shortcut=''
                    />
                </li>
            </ul>
        </NavBarMenuItem>
    );
};

EntityMenu.defaultProps = {
    entityInformationService: defaultEntityInformationService,
    entitiesService: defaultEntitiesService
};

export default EntityMenu;
