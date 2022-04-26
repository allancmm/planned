import React from 'react';
import Pageable from '../../../../lib/domain/util/pageable';
import { PaginatorBar, PaginatorItem, PaginatorNumber, PaginatorStyle, ShowSelect, ShowStyle, ShowText } from './style';

const OPTIONS_SIZE = [5, 10, 15];

const pageNumbers = (currPage: Pageable): number[] => {
    const maxNbPage = currPage.getPageNumber() < 10 ? 4 : currPage.getPageNumber() < 100 ? 3 : 2;
    const subNbPage = 1;
    const list: number[] = [];
    const maxPage = currPage.getTotalPage() + 1;

    let start = currPage.getPageNumber() > 1 ? currPage.getPageNumber() - subNbPage : 0;
    start = start + maxNbPage > maxPage ? maxPage - maxNbPage : start;
    start = start > 0 ? start : 0;

    let totalPage = start + maxNbPage;
    totalPage = totalPage < maxPage ? totalPage : maxPage;

    for (let i = start; i < totalPage; i++) {
        list.push(i);
    }

    return list;
};

interface PaginatorProps {
    className?: string;
    page: Pageable;
    setPage(page: Pageable): void;
}

const Paginator = ({ className, page, setPage }: PaginatorProps) => {
    return (
        <PaginatorStyle className={className ?? ''}>
            <ShowStyle>
                <ShowText>Show</ShowText>
                <ShowSelect
                    onChange={(e) =>
                        setPage(Pageable.withPageOfSize(+e.target.value, 0, page.totalElements))
                    }
                    value={page.size}
                >
                    {OPTIONS_SIZE.map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </ShowSelect>
            </ShowStyle>

            <PaginatorBar>
                <PaginatorItem onClick={() => setPage(page.getFirstPage())}>⟪</PaginatorItem>
                <PaginatorItem onClick={() => setPage(page.previousPage())}>⟨</PaginatorItem>
                {pageNumbers(page).map((value) => (
                    <PaginatorItem key={'pin' + value} onClick={() => setPage(page.getPage(value))}>
                        <PaginatorNumber selectedPage={page.getPageNumber() === value}>{value + 1}</PaginatorNumber>
                    </PaginatorItem>
                ))}
                <PaginatorItem onClick={() => setPage(page.nextPage())}>⟩</PaginatorItem>
                <PaginatorItem onClick={() => setPage(page.getLastPage())}>⟫</PaginatorItem>
            </PaginatorBar>
        </PaginatorStyle>
    );
};

export default Paginator;
