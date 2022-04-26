import React, {ChangeEvent} from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Clear, Search } from "@material-ui/icons";
import { GridToolbarFilterButton } from "@material-ui/data-grid";
import useStyles from "./useStyles";

interface QuickSearchToolbarProps {
    value: string;
    isShowToolbarFilter: boolean,
    isShowInputFilter: boolean,
    clearSearch() : void;
    onChange(event: ChangeEvent<HTMLInputElement>) : void;
}

const QuickSearchToolbar = ({ value,
                              isShowToolbarFilter = false,
                              isShowInputFilter = false,
                              clearSearch,
                              onChange } : QuickSearchToolbarProps) => {

    const { rootStyle, textFieldStyle} = useStyles();

    return (
        <div className={rootStyle}>
            {isShowToolbarFilter && <GridToolbarFilterButton/>}

            {isShowInputFilter &&
                <TextField
                    variant="standard"
                    value={value}
                    onChange={onChange}
                    placeholder="Quick search…"
                    className={textFieldStyle}
                    InputProps={{
                        startAdornment: <Search fontSize="small"/>,
                        endAdornment: (
                            <IconButton
                                title="Clear"
                                aria-label="Clear"
                                size="small"
                                style={{visibility: value ? 'visible' : 'hidden'}}
                                onClick={clearSearch}
                            >
                                <Clear fontSize="small"/>
                            </IconButton>
                        ),
                    }}
                />
            }
        </div>
    );
}

export default QuickSearchToolbar;