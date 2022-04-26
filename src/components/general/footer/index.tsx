import React, { useContext } from 'react';
import { AuthContext } from '../../../page/authContext';
import { BoldFooter, ConnectionLostElement, FooterContainer, FooterElement, FooterSection } from './style';

const Footer = () => {
    const { auth, isAuthenticated } = useContext(AuthContext);
    let extraInfos: string = "";
    let versionControlType: string = "None";

    switch(auth.versionControlType.toUpperCase()){
        case "IVS":
        case "GIT-IVS":
            extraInfos = `Track : ${auth.oipaEnvironment?.ivsEnvironment},${auth.oipaEnvironment?.ivsTrack}`;
            versionControlType = auth.versionControlType.toUpperCase();
            break;
        case 'GIT':
            versionControlType = auth.versionControlType.toUpperCase();
            break;
        case "NONE" || "":
            extraInfos = "";
            break;
    }

    return (
        <FooterContainer>
            <FooterSection>
                <FooterElement>Version: {auth.designVersion}</FooterElement>|
                <FooterElement>{`OIPA:${auth.oipaVersion}`}</FooterElement>|
                <BoldFooter>Equisoft 2021, All rights reserved</BoldFooter>
            </FooterSection>

            {isAuthenticated === 'LOST' && (
                <FooterSection>
                    <ConnectionLostElement>CONNECTION LOST</ConnectionLostElement>
                </FooterSection>
            )}

            <FooterSection>
                <FooterElement>{`Version Control: ${versionControlType}`}</FooterElement>|
                <FooterElement>{extraInfos}</FooterElement>
            </FooterSection>
        </FooterContainer>
    );
};

export default Footer;
