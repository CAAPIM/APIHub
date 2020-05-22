import React, { createContext, useContext } from 'react';

import { useApiHubPreference } from '../../preferences';

export const ListDisplayContext = createContext();

export const LIST_DISPLAY_CARDS = 'cards';
export const LIST_DISPLAY_DATAGRID = 'datagrid';

export const ListDisplayProvider = ({
    children,
    preferenceName = 'listDisplay',
    initialListDisplay = LIST_DISPLAY_CARDS,
}) => {
    const value = useApiHubPreference(preferenceName, initialListDisplay);

    return (
        <ListDisplayContext.Provider value={value}>
            {children}
        </ListDisplayContext.Provider>
    );
};

export const useListDisplay = () => {
    const context = useContext(ListDisplayContext);

    if (context === undefined) {
        throw new Error(
            'useListDisplay must be used within a ListDisplayProvider'
        );
    }

    return context;
};
