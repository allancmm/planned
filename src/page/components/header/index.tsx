import React from "react";
import { Heading } from "@equisoft/design-elements-react";
import { HeaderContainer } from "./style";

export const Header = ({ title } : { title?: string}) => {
    return(
        <HeaderContainer>
            <img src="./Equisoft-design-rgb.svg" alt="Equisoft/design" />
            {title && <Heading type="large">{title}</Heading>}
        </HeaderContainer>
    );
}

export default Header;