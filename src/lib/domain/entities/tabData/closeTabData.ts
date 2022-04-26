export default interface CloseTabData {
    confirmOnClose: boolean;
    saved: boolean;
}

export const instanceOfCloseTabData = (obj: any): obj is CloseTabData => {
    return 'confirmOnClose' in obj && 'saved' in obj;
}