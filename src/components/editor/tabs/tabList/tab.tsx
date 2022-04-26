import React, { useContext, useRef } from 'react';
import { DragObjectWithType, DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import EntityInformation from '../../../../lib/domain/entities/tabData/entityInformation';
import HistoryDocument from '../../../../lib/domain/entities/tabData/historyDocument';
import EntityTypeBadge from '../../../general/sidebar/entitySummary/entityTypeBadge';
import { TabContext, useTabWithId } from '../tabContext';
import CloseTabIcon from './closeTab';
import {CheckedInBadge, CheckedOutBadge, CheckedOutByMeBadge, IconLock, TabButton} from './style';
import { STATUS_LOCKED } from "../../../../lib/domain/entities/entityLockStatus";
import { useAppSettings } from "../../../../page/authContext";
import { instanceOfCloseTabData } from '../../../../lib/domain/entities/tabData/closeTabData';

interface TabProps {
    tabId: string;
    layoutId: number;
    index: number;
    active: boolean;
    focus: boolean;
    handleCloseTab(): void;
    setActiveTab(): void;
    onTabDrag(tabId: string, position: number): void;
}

const Tab = ({ tabId, layoutId, index, handleCloseTab, setActiveTab, active, focus, onTabDrag }: TabProps) => {
    const { name, data, tabType } = useTabWithId(tabId);
    const { isLockActivated } = useAppSettings();
    const { useConfirmClose: {  openModal }} = useContext(TabContext);

    const { status: { status }, lockStatus: { status: lockStatus } } = data;

    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: 'Tab',
        hover: (
            item: DragObjectWithType & { index: number; tabId: string; layoutId: number },
            monitor: DropTargetMonitor,
        ) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex || item.layoutId !== layoutId) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.right;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
                return;
            }

            // Time to actually perform the action
            onTabDrag(item.tabId, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [, drag] = useDrag({
        item: { type: 'Tab', tabId, layoutId, index },
    });
    drag(drop(ref));

    const getIsStatusLocked = (): boolean =>
        isLockActivated && lockStatus === STATUS_LOCKED && status === 'checkIn';

    const ScmStatusBadgeContainer = () => {
        switch (status) {
            case 'checkIn':
                return getIsStatusLocked() ?
                        <>
                            <IconLock />
                            <CheckedOutByMeBadge />
                        </>
                    : <CheckedInBadge />;
            case 'checkedBy':
                return <CheckedOutBadge />;
            case 'checkOut':
                return <CheckedOutByMeBadge />;
            case 'unknown':
            default:
                return null;
        }
    };
    const displayClose: boolean = !(data instanceof EntityInformation) || data.status.status !== 'checkOut';

    const displayName: boolean = !['COUNTRY', 'ERROR_CATALOG', 'CURRENCY', 'SEQUENCE', 'WORKFLOW_QUEUE_ROLE'].includes(
        data instanceof EntityInformation || data instanceof HistoryDocument ? data.entityType : '',
    );

    let title : string;
    if (!displayName && data instanceof EntityInformation) {
        title = data.fileType;
    } else if (!displayName && data instanceof HistoryDocument) {
        title = data.fileType + data.getLabelExtension();
    } else {
        title = name;
        if (data instanceof EntityInformation) {
            title += ` - ${data.fileType}`;
        }
    }

    const onClickClose = () => {
        if(instanceOfCloseTabData(data) && data.confirmOnClose && !data.saved) {
            setActiveTab();
            openModal();
        } else {
            handleCloseTab();
        }

    }
    return (
        <TabButton ref={ref} focus={focus} show={active} onClick={setActiveTab} title={title}>
            <EntityTypeBadge type={data.getType()} fallback={tabType} />
            <span>{title}</span>
            {data instanceof EntityInformation && <ScmStatusBadgeContainer />}

            {displayClose && <CloseTabIcon onClick={onClickClose} />}
        </TabButton>
    );
};

export default Tab;
