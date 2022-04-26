import React, { FormEvent } from 'react';
import { TabButton, TabLabel } from './style';

interface TabProps {
    name: string;
    show: boolean;
    idTab: number;
    setActiveTab(activeTab: number): void;
}

const setTab = (e: FormEvent<HTMLFormElement>, activeTab: number, setActiveTab: (aT: number) => void) => {
    e.preventDefault();
    setActiveTab(activeTab);
};

export const Tab = ({ name, setActiveTab, show, idTab }: TabProps): React.ReactElement => {
    return (
        <TabButton onClick={(e: any) => setTab(e, idTab, setActiveTab)} show={show}>
            <TabLabel>{name}</TabLabel>
        </TabButton>
    );
};
