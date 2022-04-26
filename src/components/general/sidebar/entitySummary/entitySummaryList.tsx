import { Caret, throttle, useBetterScrollingList, useCombinedRefs } from 'equisoft-design-ui-elements';
import React, { KeyboardEvent, Ref, useRef, useState } from 'react';
import Split from 'react-split-grid';
import { Key } from 'ts-key-enum';
import EntitySummary, { EntitySummaryProps } from './entitySummary';
import { EntitySummaryListContainer, SummaryGutter, SummaryHeaderSection, SummarySection } from './style';

interface EntitySummaryListProps {
    rows: any[];

    sorteable?: boolean;
    defaultCursor?: number;

    rowMapper(r: any, i: number): EntitySummaryProps;
    select(r: any): void;
}
type EntitySummaryDivListProps = EntitySummaryListProps & React.HTMLAttributes<HTMLDivElement>;

type SortType = 'NONE' | 'ASC' | 'DESC';

export const EntitySummaryList = React.forwardRef(
    (
        { rows, rowMapper, select, sorteable, defaultCursor = -1, ...props }: EntitySummaryDivListProps,
        ref: Ref<HTMLDivElement>,
    ) => {
        const [sort, setSort] = useState<SortType>('NONE');
        const [sortBy, setSortBy] = useState<'name' | 'override'>('name');

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

        const toggleSort = () => {
            if (sort === 'NONE') setSort('ASC');
            else if (sort === 'ASC') setSort('DESC');
            else if (sort === 'DESC') setSort('NONE');
        };

        const handleSort = (c: 'name' | 'override') => () => {
            if (sortBy === c) {
                toggleSort();
            } else {
                setSortBy(c);
                setSort('ASC');
            }
        };

        const doSort = (a: EntitySummaryProps, b: EntitySummaryProps) => {
            switch (sortBy) {
                case 'name': {
                    switch (sort) {
                        case 'ASC':
                            return a.name.localeCompare(b.name);
                        case 'DESC':
                            return b.name.localeCompare(a.name);
                        case 'NONE':
                        default:
                            return 0;
                    }
                }
                case 'override': {
                    switch (sort) {
                        case 'ASC':
                            return a.extraInformation.localeCompare(b.extraInformation);
                        case 'DESC':
                            return b.extraInformation.localeCompare(a.extraInformation);
                        case 'NONE':
                        default:
                            return 0;
                    }
                }
            }
        };

        useBetterScrollingList(combinedRef, cursorRef, [cursor]);

        return (
            <Split
                minSize={100}
                render={({ getGridProps, getGutterProps }: any) => (
                    <EntitySummaryListContainer
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        aria-activedescendant={`sr-${cursor}`}
                        role="listbox"
                        ref={combinedRef}
                        onBlur={() => setCursor(-1)}
                        {...getGridProps()}
                        {...props}
                    >
                        {rows.length > 0 ? (
                            <>
                                <SummaryHeaderSection {...(sorteable && { onClick: handleSort('name') })}>
                                    <span title="Name">Name</span>
                                    {sorteable && sortBy === 'name' && sort !== 'NONE' && (
                                        <Caret isExpand={sort === 'ASC'} />
                                    )}
                                </SummaryHeaderSection>
                                <SummaryGutter {...getGutterProps('column', 1)} />
                                <SummaryHeaderSection {...(sorteable && { onClick: handleSort('override') })}>
                                    <span title="Override">Override</span>
                                    {sorteable && sortBy === 'override' && sort !== 'NONE' && (
                                        <Caret isExpand={sort === 'ASC'} />
                                    )}
                                </SummaryHeaderSection>

                                <SummaryHeaderSection />

                                {rows
                                    .map(rowMapper)
                                    .sort(doSort)
                                    .map((r, i) => (
                                        <EntitySummary
                                            id={`sr-${r.id}`}
                                            role="option"
                                            key={r.id}
                                            selected={r.selected || i === cursor}
                                            entityType={r.entityType}
                                            tabType={r.tabType}
                                            fileType={r.fileType}
                                            name={r.name}
                                            extraInformation={r.extraInformation}
                                            ref={cursor === i ? cursorRef : null}
                                            actionBar={r.actionBar}
                                            actions={r.actions}
                                            getGutterProps={getGutterProps}
                                            onClick={() => {
                                                setCursor(i);
                                                r.onClick?.();
                                            }}
                                        />
                                    ))}
                            </>
                        ) : (
                            <SummarySection>NO RESULTS</SummarySection>
                        )}
                    </EntitySummaryListContainer>
                )}
            />
        );
    },
);
