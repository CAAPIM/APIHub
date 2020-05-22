import React, { useEffect } from 'react';
import { List as RaList, Pagination as RaPagination } from 'react-admin';

import { ViewTitle } from './ViewTitle';
import { useApiHubPreference, readApiHubPreference } from '../preferences';

const Pagination = props => {
    const { resource, perPage, setPerPage } = props;

    const [perPagePreference, setPerPagePreference] = useApiHubPreference(
        `perPage/${resource}`,
        perPage
    );

    useEffect(() => {
        if (perPagePreference !== perPage) {
            setPerPage(perPagePreference);
        }
    }, [perPage, perPagePreference, setPerPage]);

    const handleSetPerPage = newPerPage => {
        setPerPagePreference(newPerPage);
    };

    return (
        <RaPagination
            {...props}
            perPage={parseInt(perPagePreference, 10)}
            setPerPage={handleSetPerPage}
            rowsPerPageOptions={[12, 24, 48]}
        />
    );
};

/**
 * A List component which displays the react-admin list with the title above.
 *
 * @param {*} props The react-admin list properties
 *
 */
export const List = props => {
    const { resource, perPage } = props;

    // Get the initial per page preference per resources
    // The readApiHubPreference method is used
    // instead of the useApiHubPreference hook
    // to not rerender the whole list each time the perPage property changes.
    // See the <Pagination /> component above to understand the complete usage of the per page preferences.
    const perPagePreference = readApiHubPreference(
        `perPage/${resource}`,
        perPage
    );

    return (
        <>
            <ViewTitle />
            <RaList
                {...props}
                perPage={parseInt(perPagePreference, 10)}
                pagination={<Pagination />}
            />
        </>
    );
};
