import React, { RefObject, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CollapseContainer, useLoading, Loading } from 'equisoft-design-ui-elements';
import { IconButton } from "@equisoft/design-elements-react";
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { defaultReleaseService } from '../../../lib/context';
import Release from '../../../lib/domain/entities/release';
import { ReleaseStatusCodeEnum } from '../../../lib/domain/enums/releaseStatus';
import Pageable from '../../../lib/domain/util/pageable';
import ReleaseService from '../../../lib/services/releaseService';
import {PackagingControlContent, ReleaseContainer} from "../style";
import PopOverMenu, { ButtonAction } from "../../../components/general/popOverMenu";
import DataGrid from "../../../components/general/dataGrid";
import { GridColumns, GridPageChangeParams, GridResizeParams, GridValueGetterParams } from "@material-ui/data-grid";
import useDebouncedSearch from "../../../components/general/hooks/useDebounceSearch";
import {SearchWrapper} from "../../../components/general/sidebar/flexibleDataTable/style";
import InputSearch from "../../../components/general/inputSearch";
import ReleaseList from "../../../lib/domain/entities/releaseList";
import {OPEN} from "../../../components/editor/tabs/tabReducerTypes";
import { useTabActions } from "../../../components/editor/tabs/tabContext";
import ViewManifestSession from "../../../lib/domain/entities/tabData/viewManifestSession";
import {downloadFile} from "../../../lib/util/miscellaneous";

interface ReleasesProps {
    releaseService: ReleaseService;
}

const Releases = ({ releaseService }: ReleasesProps) => {
    const { openRightbar } = useContext(RightbarContext);
    const { refreshSidebar } = useContext(SidebarContext);
    const dispatch = useTabActions();

    const [loading, load] = useLoading();

    const [releaseList, setReleaseList] = useState<Release[]>([]);
    const [releasePage, setReleasePage] = useState(Pageable.withPageOfSize());
    const [openMainAction, setOpenMainAction] = useState(false);
    const anchorRefMain = useRef<HTMLDivElement>(null);
    const [isMainMenu, setIsMainMenu] = useState(true);
    const [anchorMenu, setAnchorMenu] = useState<RefObject<HTMLDivElement>>(anchorRefMain);
    const [isOpen, setIsOpen] = useState(true);
    const [releaseChosen, setReleaseChosen] = useState<Release>(new Release());

    const dataGridRef = useRef<HTMLDivElement>(null);

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const useReleaseSearch = () => useDebouncedSearch((searchParam: string) => {
        fetchReleaseList(searchParam);
    });

    const { inputText, setInputText, searchResults } = useReleaseSearch();

    useLayoutEffect(() => {
        setContainerSize({ width: dataGridRef?.current?.offsetWidth || 0, height: dataGridRef?.current?.offsetHeight || 0})
    }, [dataGridRef]);

    useEffect(() => {
        if(!searchResults.loading){
            fetchReleaseList(inputText);
        }
    }, [releasePage.pageNumber, refreshSidebar]);

    const fetchReleaseList = (searchParam = '') => {
        load(async (newPage: Pageable) =>
            releaseService.getReleaseList(searchParam, newPage))(releasePage)
            .then(({ releases, page } : ReleaseList) => {
                setReleasePage(Pageable.withPageOfSize(page.size, page.pageNumber, page.totalElements));
                setReleaseList(releases);
            });
    };

    const downloadArtifactAsZip = async (name: string, releasePath: string) => {
        const blobFile = await load(releaseService.downloadRelease)(releasePath, name);
        downloadFile(name, blobFile);
    }

    const getManifest = load(async (release: Release) => {
        const manifest = await releaseService.getManifest(release);
        dispatch({ type: OPEN, payload: { data:  new ViewManifestSession(manifest) } });
    });

    const itemsMenuAction = useMemo(() => {
        if(isMainMenu) {
            return [
                { label: 'Build Release',
                    value: 'build',
                    onClick: () => {
                        handleCloseMainAction();
                        openRightbar('Build_Release', new Release());
                    }
                }
            ]
        }

        return [
            { label: 'Release',
                value: 'build',
                onClick: () => {
                    handleCloseMainAction();
                    openRightbar('Deploy_Release', releaseChosen);
                }
            },
            { label: 'Download Package',
                value: 'build',
                onClick: () => {
                    handleCloseMainAction();
                    downloadArtifactAsZip(releaseChosen.name, releaseChosen.releasePath)
                }
            },
            { label: 'View Manifest',
                value: 'build',
                onClick: () => {
                    handleCloseMainAction();
                    getManifest(releaseChosen);
                }
            }
        ]

    }, [isMainMenu, releaseChosen]);

    const handleCloseMainAction = () => {
        setOpenMainAction(false);
    };

    const columnsRelease: GridColumns = [
        { field: 'name',
          headerName: 'Name',
          description: 'Release name',
          width: containerSize.width * 0.4,
          hideSortIcons: true,
          sortable: false
        },
        { field: 'status',
          headerName: 'Status',
          description: 'Release status',
          width: containerSize.width * 0.4,
          hideSortIcons: true,
          sortable: false,
          renderCell: ({ row } : GridValueGetterParams) => <span title={ReleaseStatusCodeEnum.getEnumFromCode(row.status).value}>{ReleaseStatusCodeEnum.getEnumFromCode(row.status).value}</span>
        },
        { field: '',
          headerName: '',
          description: '',
          width: containerSize.width * 0.2,
          hideSortIcons: true,
          sortable: false,
          align: 'right',
          renderCell: ({ row }  : GridValueGetterParams) => {
              const refRow = useRef<HTMLDivElement>(null);
              return <IconButton
                        ref={refRow}
                        iconName='moreVertical'
                        buttonType="tertiary"
                        onClick={() => {
                          setAnchorMenu(refRow);
                          setIsMainMenu(false);
                          setOpenMainAction(prev => !prev);
                          setReleaseChosen(row as Release);
                       }}
                   />
          }
        },
    ];

    const heightDataGrid = useMemo(() => releaseList.length > 0 ? ((releaseList.length - 1) * 36 + 210) : 200, [releaseList.length]);

    return (
        <CollapseContainer
            title='Release Artifacts'
            open={isOpen}
            toggleOpen={() => setIsOpen((prevIsOpen) => {
                if(prevIsOpen) {
                    setOpenMainAction(false);
                }
                return !prevIsOpen;
            })}
            actions={
                <ButtonAction
                    type='secondary'
                    anchorRef={anchorRefMain}
                    disabled={loading}
                    openAction={openMainAction}
                    onClick={() => {
                        setIsMainMenu(true);
                        setAnchorMenu(anchorRefMain);
                        setOpenMainAction(prev => !prev);
                        setIsOpen(true);
                    }}
                />
            }
        >
            <>
                <Loading loading={loading} />

                <PackagingControlContent>
                    <SearchWrapper>
                        <InputSearch
                            value={inputText}
                            placeholder='Search artifacts...'
                            onChange={setInputText}
                        />
                    </SearchWrapper>
                    <ReleaseContainer heightDataGrid={heightDataGrid} ref={dataGridRef}>
                        <DataGrid
                            id='releaseGuid'
                            rows={releaseList}
                            columns={columnsRelease}
                            pageSize={5}
                            onResize={(param : GridResizeParams) => {
                                param.containerSize && setContainerSize(param.containerSize);
                            }}
                            disableColumnMenu
                            paginationMode='server'
                            rowCount={releasePage.totalElements}
                            onPageChange={(param: GridPageChangeParams) => {
                                setReleasePage(Pageable.withPageOfSize(param.pageSize, param.page, param.rowCount));
                            }}
                        />
                    </ReleaseContainer>

                </PackagingControlContent>

                <PopOverMenu
                    openAction={openMainAction}
                    setOpenAction={setOpenMainAction}
                    anchorRef={anchorMenu}
                    itemsMenu={itemsMenuAction}
                    handleClose={handleCloseMainAction}
                />
            </>
        </CollapseContainer>
    );
};

Releases.defaultProps = {
    releaseService: defaultReleaseService,
};

export default Releases;
