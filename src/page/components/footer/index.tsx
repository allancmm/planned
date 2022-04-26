import React, {useContext} from "react";
import { AuthContext } from '../../authContext';
import { FooterContainer, Build, Legal } from "./style";

export const Footer = () => {
    const { auth } = useContext(AuthContext);

    return (
        <FooterContainer>
            <Build>{auth.environment}</Build>
            <Build>
                Version {auth.designVersion} (Oipa {auth.oipaVersion} build)
            </Build>
            <Legal>Legal & Privacy</Legal>
        </FooterContainer>
    );
}

export default Footer;