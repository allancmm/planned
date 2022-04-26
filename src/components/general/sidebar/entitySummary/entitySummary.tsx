import React, { forwardRef, Ref, useState } from 'react';
import { EntityType } from '../../../../lib/domain/enums/entityType';
import { FileType } from '../../../../lib/domain/enums/fileType';
import { TabType } from '../../../editor/tabs/tabTypes';
import { ActionBar } from '../flexibleDataTable/style';
import EntityTypeBadge from './entityTypeBadge';
import { SummaryGutter, SummarySection } from './style';

export interface EntitySummaryProps {
    id: string;
    entityType?: EntityType;
    tabType?: TabType;
    fileType?: FileType;
    name: string;
    extraInformation: string;
    selected?: boolean;
    disableCheckbox?: boolean;
    actionBar?: React.ReactElement;
    actions?: React.ReactElement;
    getGutterProps?(dir: string, track: number): any;
    onClick?(): void;
    onClickCheckbox?(): void;
}

type EntitySummaryDivProps = EntitySummaryProps & React.HTMLAttributes<HTMLDivElement>;
const EntitySummary = forwardRef(
    (
        {
            entityType,
            tabType,
            fileType,
            name,
            extraInformation,
            actionBar,
            actions,
            onClick,
            selected,
            disableCheckbox,
            getGutterProps,
            ...props
        }: EntitySummaryDivProps,
        ref: Ref<HTMLDivElement>,
    ) => {
        const extra = extraInformation ?? 'Global';
        const parts = extra.split(':');
        const badge = parts[0];
        const overrideName = parts.length > 1 ? parts[1] : parts[0];

        const [hover, setHover] = useState(false);

        const getHighlighClassNames = () => {
            return `${selected ? 'selected' : ''} ${hover ? 'hover' : ''}`;
        };

        const handleHover = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };

        return (
            <>
                <SummarySection
                    onClick={onClick}
                    className={getHighlighClassNames()}
                    {...handleHover}
                    {...props}
                    ref={ref}
                >
                    <EntityTypeBadge type={entityType ?? ''} fallback={tabType} />
                    <span title={name} className={'content'}>
                        {name}
                    </span>
                    {fileType && <span> - {fileType}</span>}
                </SummarySection>
                {getGutterProps && <SummaryGutter {...getGutterProps('column', 1)} />}
                {badge && overrideName && (
                    <SummarySection onClick={onClick} className={getHighlighClassNames()} {...handleHover}>
                        <EntityTypeBadge type={badge} />
                        <span title={overrideName} className={'content'}>
                            {overrideName}
                        </span>
                        {actionBar && <ActionBar show={hover}>{actionBar}</ActionBar>}
                    </SummarySection>
                )}
                <SummarySection className={getHighlighClassNames()} {...handleHover}>
                    {actions}
                </SummarySection>
            </>
        );
    },
);

export default EntitySummary;
