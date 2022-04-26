import axios, { AxiosInstance } from 'axios';
import { notifyErrors } from '../../../components/general/error';
import { APIError } from '../../domain/entities/apiError';
import InteropService from '../../services/interopService';
import { ApiGateway, TypeOptions } from './apiGateway';
import { JsonSerializer } from './jsonSerializer';

export type HeaderType = 'application/json' | 'application/octet-stream' | 'application/vnd.ms-excel' | 'text/plain';

export class AxiosApiGateway implements ApiGateway {
    private axios: AxiosInstance | undefined;
    private onDisconnect: () => void;
    private interceptor?: number;

    constructor(private interopService: InteropService, private objectMapper: JsonSerializer) {
        this.onDisconnect = () => { };
    }

    setDisconnectHandler(onDisconnect: () => void): void {
        this.onDisconnect = onDisconnect;
    }

    getAxios(): AxiosInstance {
        if (!this.axios) {
            this.axios = axios.create({
                baseURL: this.interopService.getApiUrl(),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                withCredentials: true,
            });
        }
        this.interceptor && this.axios.interceptors.response.eject(this.interceptor);
        this.interceptor = this.axios.interceptors.response.use(undefined, (error: any) =>
            this.handleLoginErrors(error),
        );
        return this.axios;
    }

    async head(url: string): Promise<void> {
        return this.getAxios().head(url);
    }

    async get<T>(url: string, options?: TypeOptions<undefined, T>): Promise<T> {
        return this.getAxios()
            .get<T>(url, {
                transformResponse: (data) => this.objectMapper.mapToObject(data, options?.outType),
            })
            .then((response) => response.data)
            .catch((err) => this.processErrorBody(err));
    }

    async getArray<T>(url: string, options?: TypeOptions<undefined, T>): Promise<T[]> {
        return this.getAxios()
            .get<T[]>(url, {
                transformResponse: (data) =>
                    options ? this.objectMapper.mapToArray(data, options.outType) : JSON.parse(data),
            })
            .then((response) => response.data)
            .catch((err) => this.processErrorBody(err));
    }

    async getBlobData(url: string, contentType?: HeaderType, acceptType?: HeaderType): Promise<any> {
        return this.getAxios()
            .get(url, {
                headers: {
                    'Content-Type': contentType ?? 'application/octet-stream',
                    Accept: acceptType ?? 'application/octet-stream',
                },
                responseType: 'blob',
            })
            .then((response) => response.data)
            .catch((err) => this.processErrorBody(err));
    }

    async postBlobData<U>(url: string, data?: any, acceptType?: HeaderType): Promise<any> {
        return this.getAxios()
            .post<U>(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: acceptType ?? 'application/octet-stream',
                },
                responseType: 'blob',
            })
            .then((response) => response)
            .catch((err) => this.processErrorBody(err));
    }

    async post<T, U>(url: string, data?: any, options?: TypeOptions<T, U>, contentType?: HeaderType): Promise<U> {
        return this.getAxios()
            .post<U>(url, data, {
                headers: {
                    'Content-Type': contentType ?? 'application/json',
                },
                transformRequest: (d) => this.objectMapper.mapToJson(d, options?.inType),
                transformResponse: (d) => this.objectMapper.mapToObject(d, options?.outType),
            })
            .then((response) => response.data)
            .catch((err) => this.processErrorBody(err));
    }

    async postReturnArray<T, U>(
        url: string,
        data?: any,
        options?: TypeOptions<T, U>,
        contentType?: HeaderType,
    ): Promise<U[]> {
        return this.getAxios()
            .post<U[]>(url, data, {
                headers: {
                    'Content-Type': contentType ?? 'application/json',
                },
                transformRequest: (d) => this.objectMapper.mapToJson(d, options?.inType),
                transformResponse: (d) => this.objectMapper.mapToArray(d, options?.outType),
            })
            .then((response) => response.data)
            .catch((err) => this.processErrorBody(err));
    }

    async put<T, U>(url: string, data?: any, options?: TypeOptions<T, U>): Promise<U> {
        return this.getAxios()
            .put<U>(url, data, {
                transformRequest: (d) => this.objectMapper.mapToJson(d, options?.inType),
                transformResponse: (d) => this.objectMapper.mapToObject(d, options?.outType),
            })
            .then((response) => response.data)
            .catch((err) => this.processErrorBody(err));
    }

    async delete(url: string): Promise<void> {
        return this.getAxios()
            .delete(url)
            .then((response) => response.data)
            .catch((err) => this.processErrorBody(err));
    }

    private processErrorBody = async (err: any): Promise<any> => {
        let body: APIError;
        if (err.request?.status) {
            if (err.response?.request?.response) {
                const errResponse = err.response.request.response;
                // in case there's a problem parsing the api error message
                try {
                    body = this.objectMapper.mapToObject(errResponse, APIError);
                } catch (e) {
                    body = APIError.build('UnexpectedAPIError', [
                        { message: err.message, extraInformation: err.request.responseURL },
                    ]);
                }
            } else {
                body = APIError.build('UnexpectedAPIError', [
                    { message: err.message, extraInformation: err.request.responseURL },
                ]);
            }
        } else {
            body = APIError.build('APIError', [
                { message: err.message, extraInformation: 'Unable to contact the API' },
            ]);
        }
        if (!err.isAxiosError) {
            body = APIError.build('UnexpectedUnknownError', [{ message: err.message, extraInformation: err.stack }]);
        }
        err.body = body;
        notifyErrors(body);
        return Promise.reject(body);
    };

    private async handleLoginErrors(err: any): Promise<any> {
        if (err.config && err.response && err.response.status === 401) {
            // auth cookie has been thrashed, retry request once
            if (!err.config.__isRetry) {
                err.config.__isRetry = true;
                return axios.request(err.config);
            }
            err.config.__isRetry = false;
            this.onDisconnect();
        }
        return Promise.reject(err);
    }
}
