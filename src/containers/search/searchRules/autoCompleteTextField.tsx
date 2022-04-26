import { TextInput, useClickOutside } from 'equisoft-design-ui-elements';
import React, { ChangeEvent, KeyboardEvent, RefObject, useEffect, useState } from 'react';
import { AutoCompleteContainer, AutoCompleteOption, AutoCompleteWrapper } from './style';

interface AutoCompleteProps {
    elements?: string[];
    refElement: RefObject<HTMLInputElement>;
    handleChange(value: string): void;
    handleKeyboard(event: KeyboardEvent<HTMLInputElement>): void;
    handleOnclick(value: string): void;
}

const AutocompleteTextField = ({
    handleChange,
    handleKeyboard,
    handleOnclick,
    refElement,
    elements,
}: AutoCompleteProps) => {
    const [display, setDisplay] = useState(false);
    const [options, setOptions] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    const handleClickOutside = () => {
        setDisplay(false);
    };
    const [refDiv] = useClickOutside({ onClickOutside: handleClickOutside });

    useEffect(() => {
        if (elements) {
            setOptions(elements);
        }
    }, []);

    const updating = (query: string) => {
        setSearch(query);
        setDisplay(false);
        handleOnclick(query);
    };

    const handleChangeAuto = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.includes('* in')) {
            setDisplay(true);
        } else {
            setDisplay(false);
        }
        handleChange(e.target.value);
        setSearch(e.target.value);
    };

    return (
        <AutoCompleteWrapper ref={refDiv}>
            <TextInput
                name="Search"
                placeholder="Search"
                value={search}
                autoComplete="off"
                onChange={handleChangeAuto}
                onKeyDown={handleKeyboard}
                ref={refElement}
            />
            {display && (
                <AutoCompleteContainer>
                    {options
                        .filter((name) => name.includes(search))
                        .map((value, i) => {
                            return (
                                <AutoCompleteOption onClick={() => updating(value)} key={i}>
                                    {value}
                                </AutoCompleteOption>
                            );
                        })}
                </AutoCompleteContainer>
            )}
        </AutoCompleteWrapper>
    );
};

export default AutocompleteTextField;
