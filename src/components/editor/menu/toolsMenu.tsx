import React, { useContext } from 'react';
import { RightbarContext } from '../../general/sidebar/rightbarContext';
import { NavBarMenuItem } from './style';
import SubMenuButton from './submenubutton';
import { ArrowRight } from 'react-feather';
import UserStatisticsData from '../../../lib/domain/entities/tabData/userStatisticsData';
import { OPEN } from '../tabs/tabReducerTypes';
import { useTabActions } from '../tabs/tabContext';
import {AuthContext} from "../../../page/authContext";
import ReleaseReportsData from '../../../lib/domain/entities/tabData/releaseReportsData';
import TransactionProcessSession from '../../../lib/domain/entities/tabData/transactionProcessSession';

const ToolsMenu = () => {
    const dispatch = useTabActions();
    const { openRightbar } = useContext(RightbarContext);
    const { auth } = useContext(AuthContext);
    const openTransactionProcess = async () => {
        dispatch({ type: OPEN, payload: { data: new TransactionProcessSession('') } });
    };

    return (
        <NavBarMenuItem>
            <button aria-haspopup="true" aria-expanded="false">
                Tools
            </button>
            <ul>
                <NavBarMenuItem>
                    <SubMenuButton title={'Export'} rIcon={<ArrowRight />} />
                    <ul>
                        <li>
                            <SubMenuButton onClick={() => openRightbar('Export_Maps')} title={'Maps'} shortcut={''} />
                        </li>
                        <li>
                            <SubMenuButton onClick={() => openRightbar('Export_Rates')} title={'Rates'} shortcut={''} />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Export_Security_Groups')}
                                title={'OIPA Security Groups'}
                                shortcut={''}
                                active={!auth.appFunctionDisabled(['TOOLS_OIPA_SECURITY_GROUP_EXPORT'])}
                            />
                        </li>
                    </ul>
                </NavBarMenuItem>
                <NavBarMenuItem>
                    <SubMenuButton title={'Import'} rIcon={<ArrowRight />} />
                    <ul>
                        <li>
                            <SubMenuButton onClick={() => openRightbar('Import_Maps')} title={'Maps'} shortcut={''} />
                        </li>
                        <li>
                            <SubMenuButton onClick={() => openRightbar('Import_Rates')} title={'Rates'} shortcut={''} />
                        </li>
                        <li>
                            <SubMenuButton
                                onClick={() => openRightbar('Import_Security_Groups')}
                                title={'OIPA Security Groups'}
                                shortcut={''}
                                active={!auth.appFunctionDisabled(['TOOLS_OIPA_SECURITY_GROUP_IMPORT'])}
                            />
                        </li>
                    </ul>
                </NavBarMenuItem>
                <hr />
                <li>
                    <SubMenuButton
                        shortcut=''
                        title='User Statistics'
                        onClick={() => dispatch({ type: OPEN, payload: { data: new UserStatisticsData() } })}
                    />
                </li>
                <li>
                    <SubMenuButton
                        shortcut=''
                        title='Transaction Processing Order'
                        onClick={openTransactionProcess}
                    />
                </li>
                <li>
                    <SubMenuButton
                        shortcut={''}
                        title={'Release Reports'}
                        onClick={() => dispatch({ type: OPEN, payload: { data: new ReleaseReportsData() } })}
                    />
                </li>
            </ul>
        </NavBarMenuItem>
    );
};

export default ToolsMenu;