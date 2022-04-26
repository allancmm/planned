import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { APIError, ErrorInformation } from '../../../lib/domain/entities/apiError';
import { Error } from './style';

interface ErrorProps {
    error: ErrorInformation;
}

const ErrorToast = ({ error }: ErrorProps) => {
    const { t } = useTranslation();
    return (
        <Error>
            Error: {t(error.message)}. <br /> {t(error.extraInformation)}
        </Error>
    );
};

export const notifyError = (error: ErrorInformation) => {
    toast(<ErrorToast error={error} />, { type: 'error' });
};

export const notifyErrors = (error: APIError) => {
    if (error.informations.length > 0) {
        error.informations.forEach(notifyError);
    } else {
        notifyError({ message: error.error, extraInformation: error.message ?? '' });
    }
};
