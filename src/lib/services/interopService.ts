const STUDIO_URL_KEY_NAME = 'OLD_STUDIO_URL';
const DEFAULT_TOMCAT_DEV_URL = 'http://localhost:8080';

export default class InteropService {
    tryGrabOldStudioUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const oldUrl = params.get('studioUrl');
        if (oldUrl) {
            localStorage.setItem(STUDIO_URL_KEY_NAME, oldUrl);
        } else if (!localStorage.getItem(STUDIO_URL_KEY_NAME)) {
            // use current URL
            const context = this.getContextPath();
            const currURL = window.location.href.split('/react')[0];
            localStorage.setItem(
                STUDIO_URL_KEY_NAME,
                currURL.includes('localhost:3333') ? DEFAULT_TOMCAT_DEV_URL + context : currURL, // force 8443 on localhost:3333 to distinguish between webpack & tomcat
            );
        }
    };

    getApiUrl = (): string => {
        return `${this.getBaseApiUrl()}/api/v1/`;
    };

    getApiDocUrl = (): string => {
        return `${this.getBaseApiUrl()}/swagger-ui.html`;
    };

    getContextPath = () => {
        return window.location.pathname.split('/react')[0];
    };

    private getBaseApiUrl = () => {
        let apiUrl = localStorage.getItem(STUDIO_URL_KEY_NAME);
        if (!apiUrl) {
            throw new Error('The /design API url is not set. Aborting.');
        }

        const context = this.getContextPath();
        if (!apiUrl.includes(context)) {
            // somthing happened and the url changed and local storage is outdated
            const currURL = window.location.href.split('/react')[0];
            apiUrl = currURL.includes('localhost:3333') ? DEFAULT_TOMCAT_DEV_URL + context : currURL;
            localStorage.setItem(STUDIO_URL_KEY_NAME, apiUrl);
        }

        return apiUrl;
    };
}
