import React, { useContext, useEffect, useState } from 'react';
import { ArrowRight } from 'react-feather';
import { defaultAuthService } from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import { ITabData } from '../../../lib/domain/entities/tabData/iTabData';
import SqlQuerySession from '../../../lib/domain/entities/tabData/sqlQuerySession';
import AuthService from '../../../lib/services/authService';
import { AuthContext } from '../../../page/authContext';
import { useTabActions } from '../tabs/tabContext';
import { OPEN } from '../tabs/tabReducerTypes';
import { NavBarMenuItem } from './style';
import SubMenuButton from './submenubutton';
import { ListSystemFile } from "../../../lib/domain/enums/systemFileType";
import SystemFileSession from "../../../lib/domain/entities/tabData/systemFileSession";

const FileMenu = ({ authService }: { authService: AuthService }) => {
    const { auth, switchEnv } = useContext(AuthContext);
    const [envs, setEnvs] = useState<BasicEntity[]>([]);
    const dispatch = useTabActions();

    useEffect(() => {
        fetchEnvironments();
    }, []);

    const fetchEnvironments = async () => {
        const newEnvs = await authService.loginEnvironments(auth.userName);
        setEnvs(newEnvs);
    };

    const openNewTab = (iTabData: ITabData) => {
        dispatch({ type: OPEN, payload: {data: iTabData}})
    }

    return (
        <NavBarMenuItem>
            <button aria-haspopup="true" aria-expanded="false">
                File
            </button>
            <ul aria-hidden="true">
                <NavBarMenuItem>
                    <SubMenuButton title={'New'} rIcon={<ArrowRight />} />
                    <ul>
                        <li>
                            <SubMenuButton onClick={() => openNewTab(new SqlQuerySession())} title={'New SQL Query'} shortcut={''}
                                           active={!auth.appFunctionDisabled(["SQL_QUERY_VIEW"])}/>
                        </li>
                    </ul>
                </NavBarMenuItem>
                <hr />
                <NavBarMenuItem>
                    <SubMenuButton title='View System Files' rIcon={<ArrowRight />} />
                    <ul>
                        {ListSystemFile.map(({ code, value}) =>
                            <li key={code}>
                                <SubMenuButton title={value}
                                               onClick={() => openNewTab(new SystemFileSession(code, value))}
                                               shortcut=''
                                />
                             </li>
                        )}
                    </ul>
                </NavBarMenuItem>
                <hr />
                <NavBarMenuItem>
                    <SubMenuButton title={'Switch OIPA Environment'} rIcon={<ArrowRight />} />
                    <ul>
                        {envs.map((e) => (
                            <li key={e.value}>
                                <SubMenuButton onClick={() => switchEnv(e.value)} title={e.name} shortcut={''} />
                            </li>
                        ))}
                    </ul>
                </NavBarMenuItem>
            </ul>
        </NavBarMenuItem>
    );
};

FileMenu.defaultProps = {
    authService: defaultAuthService,
};

export default FileMenu;
