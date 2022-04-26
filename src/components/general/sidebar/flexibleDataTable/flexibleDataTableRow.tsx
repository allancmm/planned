import React, {ReactNode, Ref, useState} from 'react';
import InputText from "../../inputText";
import { findValue, FlexibleDataTableColumn } from '.';
import { ActionBar, FlexibleDataTableGutter, FlexibleDataTableMain, CheckboxContainer } from './style';

export interface FlexibleDataTableRowProps {
    id: string;
    columns: FlexibleDataTableColumn[];
    value: any;
    actionBar?: React.ReactElement;
    selected?: boolean;
    checkbox?: boolean;
    getGutterProps?(dir: string, track: number): any;
    onRowClick?(): void;
}

type FlexibleDataTableRowDivProps = FlexibleDataTableRowProps & React.HTMLAttributes<HTMLDivElement>;

export const FlexibleDataTableRow = React.forwardRef(
    (
        { value, columns, actionBar, selected, checkbox, getGutterProps, onRowClick }: FlexibleDataTableRowDivProps,
        ref: Ref<HTMLDivElement>,
    ) => {
        const [hover, setHover] = useState(false);

        const getHighlightClassNames = () => {
            return `${hover ? 'hover' : ''} ${selected ? 'selected' : ''}`;
        };

        const handleHover = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };

        const displayCell = (col: FlexibleDataTableColumn): ReactNode => {
            if (col.cell) {
                return col.cell(value);
            }

            return getValueString(col);
        };

        const displayCheckbox = (index: number, onChange: Function | undefined) =>
            checkbox && index === 0 ?
                <CheckboxContainer>
                    <InputText
                        type='checkbox'
                        options={[{ value: 'flexibleDataTable', label: '' }]}
                        checkedValues={[ selected ? 'flexibleDataTable' : '' ]}
                        onChange={onChange ?? (() => {})}
                    />
                </CheckboxContainer> : null;

        const getValueString = (col: FlexibleDataTableColumn): string => {
            if (col.selector) {
                return col.format ? col.format(value) : findValue(value, col.selector);
            }
            return '';
        };

        return (
            <>
                {columns.reduce((acc: ReactNode[], col: FlexibleDataTableColumn, index: number) => {

                    acc.push(
                        <FlexibleDataTableMain
                            key={`${col.selector} - ${index}`}
                            className={getHighlightClassNames()}
                            {...handleHover}
                            ref={ref}

                        >
                            {displayCheckbox(index, onRowClick)}
                            <span onClick={onRowClick}>{displayCell(col)}</span>
                            {columns.length - 1 === index && actionBar && (
                                <ActionBar show={hover}>{actionBar}</ActionBar>
                            )}
                        </FlexibleDataTableMain>,
                    );
                    if (columns.length - 1 !== index && getGutterProps) {
                        acc.push(
                            <FlexibleDataTableGutter
                                key={`gutter-${acc.length}`}
                                {...getGutterProps('column', acc.length)}
                            />,
                        );
                    }
                    return acc;
                }, [])}
            </>
        );
    },
);
