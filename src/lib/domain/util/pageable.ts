import { immerable } from 'immer';

export default class Pageable {
    public static DEFAULT_RESULTS_PER_PAGE: number = 5;
    // TODO: https://stackoverflow.com/questions/15004944/max-value-of-integer
    public static MAX_SAFE_JAVA_INTEGER: number = 2147483647;

    [immerable] = true;

    public pageNumber: number = 0;
    public size: number = Pageable.DEFAULT_RESULTS_PER_PAGE;
    public totalElements: number = 0;

    static withPageOfSize(
        size: number = Pageable.DEFAULT_RESULTS_PER_PAGE,
        pageNumber: number = 0,
        totalElements: number = 0,
    ): Pageable {
        const page = new Pageable();
        page.pageNumber = pageNumber;
        page.size = size;
        page.totalElements = totalElements;
        return page;
    }

    nextPage(): Pageable {
        const next = new Pageable();
        next.size = this.size;
        next.pageNumber = this.pageNumber + 1;
        next.totalElements = this.totalElements;
        return this.isLast() ? this : next;
    }

    previousPage(): Pageable {
        const previous = new Pageable();
        previous.size = this.size;
        previous.pageNumber = this.pageNumber - 1;
        previous.totalElements = this.totalElements;
        return this.isFirst() ? this : previous;
    }

    getFirstPage(): Pageable {
        const first = new Pageable();
        first.size = this.size;
        first.pageNumber = 0;
        first.totalElements = this.totalElements;
        return first;
    }

    getLastPage(): Pageable {
        const last = new Pageable();
        last.size = this.size;
        last.pageNumber = this.getTotalPage();
        last.totalElements = this.totalElements;
        return last;
    }

    getPage(nb: number): Pageable {
        const page = new Pageable();
        page.size = this.size;
        page.pageNumber = nb;
        page.totalElements = this.totalElements;
        return page;
    }

    getPageNumber(): number {
        return this.pageNumber;
    }

    getTotalPage(): number {
        return Math.ceil(this.totalElements / this.size) - 1;
    }

    isFirst(): boolean {
        return this.pageNumber === 0;
    }

    isLast(): boolean {
        return this.pageNumber === this.getTotalPage() || this.totalElements === 0;
    }
}
