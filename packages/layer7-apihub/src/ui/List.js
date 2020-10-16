import React, { useEffect } from 'react';
import { List as RaList, Pagination as RaPagination } from 'react-admin';

import { ViewTitle } from './ViewTitle';
import { useApiHubPreference, readApiHubPreference } from '../preferences';

/**
 * A List component which displays the react-admin list with the title above.
 *
 * @param {*} props The react-admin list properties
 * @param {string} props.resource The resource to fetch.
 * @param {int} props.perPage The perPage option, default to 12.
 *
 */
export const List = props => {
    const { className, resource, perPage = PER_PAGE_DEFAULT } = props;

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
        <div className={className}>
            <ViewTitle />
            <RaList
                {...props}
                perPage={parseInt(perPagePreference, 10)}
                pagination={<Pagination />}
            />
        </div>
    );
};

const PER_PAGE_DEFAULT = 12;
const PER_PAGE_OPTIONS = [12, 24, 48];

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
            rowsPerPageOptions={PER_PAGE_OPTIONS}
        />
    );
};
