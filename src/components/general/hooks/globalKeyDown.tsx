import { useEffect, DependencyList } from 'react';
import { useFocusedActiveTab } from '../../editor/tabs/tabContext';

interface GlobalKeyDownProps {
    keys: string[];
    tabId?: string; // use this for shortcuts, that are specific to one tab, eg: checkOut (checkout only the current tab, not all of them)
    onKeyDown(): void;
}

const useGlobalKeydown = ({ keys, onKeyDown, tabId }: GlobalKeyDownProps, deps: DependencyList) => {
    const [, focusActiveTab] = useFocusedActiveTab();

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, deps);

    const validateNoExtraKeys = (e: any) => {
        if (e.shiftKey && !keys.includes('shift')) {
            return false;
        }
        if (e.ctrlKey && !keys.includes('ctrl')) {
            return false;
        }
        if (e.altKey && !keys.includes('alt')) {
            return false;
        }
        if (e.metaKey && !keys.includes('meta')) {
            return false;
        }
        return true;
    };

    const handleKeyDown = (e: any) => {
        if (keys.length === 0) return;
        if (tabId && focusActiveTab !== tabId) return;
        if (validateNoExtraKeys(e)) {
            if (
                keys.reduce((next: boolean, k: string) => {
                    if (!next) return next;
                    switch (k) {
                        case 'shift':
                            return e.shiftKey;
                        case 'ctrl':
                            return e.ctrlKey;
                        case 'alt':
                            return e.altKey;
                        case 'meta':
                            return e.metaKey;
                        default:
                            return e.key.toUpperCase() === k.toUpperCase();
                    }
                }, true)
            ) {
                e.preventDefault();
                onKeyDown();
            }
        }
    };
};

export default useGlobalKeydown;
