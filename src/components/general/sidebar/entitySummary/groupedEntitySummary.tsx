import React, { forwardRef, Ref, useState } from 'react';
import { ActionBar } from '../flexibleDataTable/style';
import { EntitySummaryProps } from './entitySummary';
import EntityTypeBadge from './entityTypeBadge';
import InputText from "../../inputText";
import {EmptyCheckSpace, GroupedSummarySection, SummarySection, CheckboxContent, CheckBoxContainer} from './style';
import classNames from "classnames";

interface GroupedEntitySummaryProps {
    name: string;
    row: EntitySummaryProps[];
    cursor: number;
    baseIndex: number;
    checkbox: boolean;
    displayOverrides: boolean;
}
const GroupedEntitySummary = forwardRef(
    ({ row, name, cursor, baseIndex, checkbox, displayOverrides }: GroupedEntitySummaryProps, ref: Ref<HTMLDivElement>) => {
        const [hover, setHover] = useState(-1);

        const getSelectedClassNames = (i: number) => {
            const overrideSelected = i + baseIndex === cursor;
            const selected = i === -1 ? baseIndex <= cursor && cursor < baseIndex + row.length : overrideSelected;
            return `${selected ? 'selected' : ''}`;
        };

        const getHoverClassNames = (i: number) => {
            const hoverOverride = hover === i;
            return `${(i === -1 ? hover >= 0 : hoverOverride) ? 'hover' : ''}`;
        };

        const handleHover = (i: number) => ({ onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(-1) });

        const displayCheckbox = (onChange: Function | undefined, selected?: boolean, disableCheckbox?: boolean) =>
             checkbox ?
                (disableCheckbox ?
                     <EmptyCheckSpace/> :
                    <CheckboxContent>
                         <InputText
                             type='checkbox'
                             options={[{ value: 'entitySummary', label: '' }]}
                             checkedValues={[ selected ? 'entitySummary' : '' ]}
                             onChange={onChange ?? (() => {})}
                         />
                    </CheckboxContent>
                 )
                : null;

        const displayGroupSummarySection = () => {
            return displayOverrides ? <GroupedSummarySection>
                {row
                    .sort((a, b) => a.extraInformation?.localeCompare(b.extraInformation))
                    .map((r, i) => {
                        const extra = r.extraInformation ?? 'Global';
                        const parts = extra.split(':');
                        const badge = parts[0];
                        const overrideName = parts.length > 1 ? parts[1] : parts[0];
                        return (
                            <SummarySection
                                key={`o-${r.id}`}
                                role="option"
                                ref={cursor === baseIndex + i ? ref : null}
                            >
                                <div className='container-children'>
                                    <CheckBoxContainer>
                                        {displayCheckbox(r.onClickCheckbox, r.selected, r.disableCheckbox)}
                                    </CheckBoxContainer>

                                    <EntityTypeBadge className='type-badge' type={badge} onClick={r.onClick} />

                                    <span title={overrideName} onClick={r.onClick}>
                                            {overrideName}
                                    </span>

                                    {r.actionBar && <ActionBar show>{r.actionBar}</ActionBar>}
                                </div>
                            </SummarySection>
                        );
                    })
                }
            </GroupedSummarySection>
            : null;
        };

        return (
            <>
				<SummarySection className={getSelectedClassNames(-1)} {...handleHover(0)} >
                    <div className={ classNames(displayOverrides ? 'container' : 'container-children', getHoverClassNames(-1)) }>
                        <CheckBoxContainer>
                            {displayOverrides ? null : displayCheckbox(row[0].onClickCheckbox, row[0].selected, row[0].disableCheckbox)}
                        </CheckBoxContainer>

                        <EntityTypeBadge
                            type={row[0].entityType ?? ''}
                            fallback={row[0].tabType}
                            onClick={row[0].onClick}
                            className='entity-type-custom'
                        />
                        <span title={`${name} ${ row[0].fileType ? ' - '  + row[0].fileType : ''}`}
                              className='content'
                              onClick={row[0].onClick}>
                            <span>
                                {name}
                            </span>
                            {row[0].fileType && <span> - {row[0].fileType}</span>}
                        </span>

                        {displayOverrides ? null
                            : row[0].actionBar && <ActionBar show>{row[0].actionBar}</ActionBar>
                        }
                    </div>
                    {displayGroupSummarySection()}
                </SummarySection>
            </>
        );
    },
);

export default GroupedEntitySummary;
