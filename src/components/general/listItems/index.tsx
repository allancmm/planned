import React from "react";
import { ListSection, ListItem} from "./styles";

interface ListProps {
    options: { label: string | JSX.Element, value: string }[],
    className?: string,
    selectedItems?: string[],
    disabled?: boolean,
    onClick(value: string) : void
}
const List = ({ options, onClick, className, selectedItems = [], disabled = false } : ListProps) => {

    const isActive = (itemValue: string): boolean => !!selectedItems?.find(s => s === itemValue);

    return (
        <ListSection className={className ? className : ''} disabled={disabled}>
            {
                options.map((item) =>
                    <ListItem
                        key={item.value}
                        onClick={() => !disabled && onClick(item.value)}
                        role="option"
                        className={ isActive(item.value ) ? 'selected' : ''}
                        active={ isActive(item.value ) }
                        disabled={disabled}
                    >
                        <span>{item.label}</span>
                    </ListItem>
                )
            }
        </ListSection>
    );
}


export default List;

