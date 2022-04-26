import React, { useEffect } from 'react';

interface UndoToastProps {
    undo(): void;
    closeToast?(): void;
}

const UndoToast = ({ undo, closeToast }: UndoToastProps) => {
    if (!closeToast) {
        return null;
    }

    useEffect(() => {
        window.addEventListener('beforeunload', closeToast);
    }, []);

    return (
        <div>
            <button
                onClick={() => {
                    undo();
                    closeToast();
                }}
            >
                UNDO
            </button>
        </div>
    );
};

export default UndoToast;
