import { throttle, useBetterScrollingList, useCombinedRefs } from 'equisoft-design-ui-elements';
import React, { KeyboardEvent, Ref, useRef, useState } from 'react';
import { Key } from 'ts-key-enum';
import { EntitySummaryProps } from './entitySummary';
import GroupedEntitySummary from './groupedEntitySummary';
import { GroupedEntityListContainer } from './style';

interface GroupedEntitySummaryProps {
    rows: any[];
    defaultCursor?: number;
    checkbox?: boolean;
    displayOverrides?: boolean;
    rowMapper(r: any, i: number): EntitySummaryProps;
    select(r: any): void;
}

interface GroupedEntities {
    [name: string]: EntitySummaryProps[];
}

const GroupedEntitySummaryList = React.forwardRef(
    ({ rows, defaultCursor = -1, checkbox = false, displayOverrides = true, rowMapper, select }: GroupedEntitySummaryProps, ref: Ref<HTMLDivElement>) => {
        const [cursor, setCursor] = useState(defaultCursor);
        const innerRef = useRef<HTMLDivElement>(null);
        const combinedRef = useCombinedRefs<HTMLDivElement>(innerRef, ref);

        const cursorRef = useRef<HTMLDivElement>(null);

        const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.persist();

            const doHandleKeyDown = throttle(() => {
                if (e.key === Key.ArrowDown && cursor < rows.length - 1) {
                    setCursor(cursor + 1);
                } else if (e.key === Key.ArrowUp && cursor > 0) {
                    setCursor(cursor - 1);
                } else if (e.key === Key.Enter) {
                    select(rows[cursor]);
                }
            }, 50);

            doHandleKeyDown();
        };

        useBetterScrollingList(combinedRef, cursorRef, [cursor]);

        const grouped: GroupedEntities = rows.map(rowMapper).reduce((acc: GroupedEntities, row: EntitySummaryProps) => {
            const key = `${row.name}-${row.entityType}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(row);
            return acc;
        }, {});

        let baseIndex = 0;
        const getAndIncrement = (rowLength: number) => {
            const old = baseIndex;
            baseIndex += rowLength;
            return old;
        };
        return (
            <GroupedEntityListContainer
                tabIndex={0}
                aria-activedescendant={`sr-${cursor}`}
                role="listbox"
                onBlur={() => setCursor(-1)}
                ref={combinedRef}
                onKeyDown={handleKeyDown}
            >
                {Object.entries(grouped).map(([, row]) => (
                    <GroupedEntitySummary
                        key={row[0].id}
                        name={row[0].name}
                        row={row}
                        ref={cursorRef}
                        cursor={cursor}
                        baseIndex={getAndIncrement(row.length)}
                        displayOverrides={displayOverrides}
                        checkbox={checkbox}
                    />
                ))}
            </GroupedEntityListContainer>
        );
    },
);

export default GroupedEntitySummaryList;
