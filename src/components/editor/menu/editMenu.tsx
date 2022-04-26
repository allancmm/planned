import React from 'react';
import { defaultEntityInformationService } from '../../../lib/context';
import { NavBarMenuItem } from './style';

const EditMenu = () => {
    return (
        <NavBarMenuItem>
            <button aria-haspopup="true" aria-expanded="false">
                Edit
            </button>
        </NavBarMenuItem>
    );
};

EditMenu.defaultProps = {
    entityInformationService: defaultEntityInformationService,
};

export default EditMenu;
