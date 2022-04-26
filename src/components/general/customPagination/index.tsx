import React from "react";
import { Pagination } from "@equisoft/design-elements-react";
import useStyles from "./useStyles";
import classNames from "classnames";

interface PaginationPros {
    activePage: number,
    totalPages: number,
    numberOfResults: number,
    pagesShown: number;
    disabled?: boolean
    className?: string,
    onPageChange(pageNumber: number) : void
}


const CustomPagination = ({ activePage, totalPages, numberOfResults, pagesShown, disabled = false, className = '', onPageChange} : PaginationPros) => {
    const classes = useStyles();
    return (
        <Pagination
            activePage={activePage}
            totalPages={totalPages}
            numberOfResults={numberOfResults}
            pagesShown={pagesShown}
            className={classNames(className, disabled ? classes.disabled : '')}
            onPageChange={onPageChange}
        />
    );
}

export default CustomPagination;