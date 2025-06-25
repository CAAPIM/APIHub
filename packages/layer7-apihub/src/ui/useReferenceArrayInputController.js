// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.

/**
 * Copy of React Admin useReferenceArrayInputController.
 * It adds support for a more complete pagination, sorting and filtering features.
 */

import { useMemo, useState, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import {
    useFilterState,
    useGetList,
    usePaginationState,
    useSortState,
    useTranslate,
    getStatusForArrayInput as getDataStatus,
    useGetMany,
} from 'react-admin';

/**
 * Prepare data for the ReferenceArrayInput components
 *
 * @example
 *
 * const { choices, error, loaded, loading } = useReferenceArrayInputController({
 *      basePath: 'resource';
 *      record: { referenceIds: ['id1', 'id2']};
 *      reference: 'reference';
 *      resource: 'resource';
 *      source: 'referenceIds';
 * });
 *
 * @param {Object} option
 * @param {string} option.basePath basepath to current resource
 * @param {Object} option.record The The current resource record
 * @param {string} option.reference The linked resource name
 * @param {string} option.resource The current resource name
 * @param {string} option.source The key of the linked resource identifier
 *
 * @return {Object} controllerProps Fetched data and callbacks for the ReferenceArrayInput components
 */
export const useReferenceArrayInputController = ({
    filter: defaultFilter,
    filterToQuery = defaultFilterToQuery,
    input,
    perPage: defaultPerPage = 25,
    sort: defaultSort = { field: 'id', order: 'DESC' },
    options,
    reference,
    resource,
    source,
}) => {
    const translate = useTranslate();

    // We store the current input value in a ref so that we are able to fetch
    // only the missing references when the input value changes
    const inputValue = useRef(input.value);
    const [idsToFetch, setIdsToFetch] = useState(input.value);
    const [idsToGetFromStore, setIdsToGetFromStore] = useState([]);
    const { data: referenceRecordsFromStore } = useGetMany(resource, {
        ids: idsToGetFromStore,
    });

    // optimization: we fetch selected items only once. When the user selects more items,
    // as we already have the past selected items in the store, we don't fetch them.
    useEffect(() => {
        const newIdsToFetch = difference(input.value, inputValue.current);
        if (newIdsToFetch.length > 0) {
            setIdsToFetch(newIdsToFetch);
            setIdsToGetFromStore(inputValue.current || []);
        }
        inputValue.current = input.value;
    }, [input.value, setIdsToFetch]);

    // CHANGE: Original code has a much simpler pagination handling not suitable for
    // grid like components which needs to display total and to allow to select a specific
    // page
    const { page, pagination, perPage, setPage, setPagination, setPerPage } =
        usePaginationState({
            page: 1,
            perPage: defaultPerPage,
        });

    // CHANGE: Original code has a much simpler sort handling not suitable for
    // grid like components which needs to allows a specific field to be used
    // for sorting AND a specific order
    const { sort, setSort, setSortField, setSortOrder } =
        useSortState(defaultSort);

    // CHANGE: Original code has a much simpler filter handling which was not
    // handling debouncing calls which might be needed for filters such as
    // free text search
    const { filter, setFilter } = useFilterState({
        filterToQuery,
    });

    // Ensure sort can be updated through props too, not just by using the setSort function
    useEffect(() => {
        if (!isEqual(defaultSort, sort)) {
            setSort(defaultSort);
        }
    }, [setSort, defaultSort, sort]);

    // CHANGE: As usePaginationState is used and returns a setPerPage function, we use it
    // Ensure pagination can be updated through props too, not just by using the setPagination function
    useEffect(() => {
        setPerPage(perPage);
    }, [perPage, setPerPage]);

    // Merge the user filters with the default ones
    const finalFilter = useMemo(
        () => ({
            ...defaultFilter,
            // CHANGE: Original code called filterToQuery here and merged the result.
            // However, filterToQuery is applied by useFilterState before now
            ...filter,
        }),
        [defaultFilter, filter]
    );

    // CHANGE: Reset the pagination whenever the filter change
    useEffect(() => {
        setPage(1);
    }, [JSON.stringify(finalFilter), setPage]); // eslint-disable-line

    const { data: referenceRecordsFetched, isLoading } = useGetMany(reference, {
        ids: idsToFetch || [],
    });

    const referenceRecords = referenceRecordsFetched
        ? referenceRecordsFetched.concat(referenceRecordsFromStore)
        : referenceRecordsFromStore;

    // filter out not found references - happens when the dataProvider doesn't guarantee referential integrity
    const finalReferenceRecords = referenceRecords.filter(Boolean);

    const { data: matchingReferences, total } = useGetList(
        resource,
        {
            pagination,
            sort,
            filter: finalFilter,
        },
        options
    );

    let sanitizedTotal = useRef(0);

    // useGetMatching may return null for total whenever the request parameters change
    // and the query has not returned yet.
    useEffect(() => {
        if (total === undefined || total === null) {
            return;
        }

        sanitizedTotal.current = total;
    }, [sanitizedTotal, total]);

    // We merge the currently selected records with the matching ones, otherwise
    // the component displaying the currently selected records may fail
    const finalMatchingReferences =
        matchingReferences && matchingReferences.length > 0
            ? mergeReferences(matchingReferences, finalReferenceRecords)
            : finalReferenceRecords.length > 0
              ? finalReferenceRecords
              : matchingReferences;

    const dataStatus = getDataStatus({
        input,
        matchingReferences: finalMatchingReferences,
        referenceRecords: finalReferenceRecords,
        translate,
    });

    return {
        choices: dataStatus.choices,
        // CHANGE: choices contains both the available choices returned by the API
        // and the choices already selected (which may not be inside the current page
        // of available choices)
        // We added the following two props to allow users to differentiate them
        // and have more freedom regarding how they are displayed
        availableChoices: matchingReferences,
        selectedChoices: referenceRecords,
        error: dataStatus.error,
        filter,
        isLoading,
        loading: dataStatus.waiting,
        page, // CHANGE: Added
        perPage,
        setFilter,
        setPage, // CHANGE: Added
        setPagination,
        setPerPage, // CHANGE: Added
        setSort,
        setSortField, // CHANGE: Added
        setSortOrder, // CHANGE: Added
        sort, // CHANGE: Added
        total: total || sanitizedTotal.current, // CHANGE: Added
        warning: dataStatus.warning,
    };
};

// concatenate and deduplicate two lists of records
const mergeReferences = (ref1, ref2) => {
    const res = [...ref1];
    const ids = ref1.map(ref => ref.id);
    ref2.forEach(ref => {
        if (!ids.includes(ref.id)) {
            ids.push(ref.id);
            res.push(ref);
        }
    });
    return res;
};

const defaultFilterToQuery = v => ({ q: v });
