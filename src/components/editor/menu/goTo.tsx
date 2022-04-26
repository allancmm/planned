import React, {useContext} from "react";
import SubMenuButton from "./submenubutton";
import { AuthContext } from "../../../page/authContext";
import { NavBarMenuItem } from './style';

const GoTo = () => {
    const { auth: { oipaEnvironment } } = useContext(AuthContext);

    const urlOIPA = oipaEnvironment?.urlOIPA || '';

    return (
        <NavBarMenuItem>
            <button aria-haspopup="true" aria-expanded="false">
                Go To
            </button>
            <ul>
                <NavBarMenuItem>
                    <SubMenuButton
                        active={!!oipaEnvironment?.urlOIPA}
                        shortcut=''
                        title={`OIPA ${!oipaEnvironment?.urlOIPA ? `(URL not defined for ${oipaEnvironment?.displayName})` : ''}`}
                        href={/^https?/.test(urlOIPA) ? urlOIPA : `//${urlOIPA}`}
                        target='_blank'
                    />
                </NavBarMenuItem>
            </ul>
        </NavBarMenuItem>
    );
}

export default GoTo;