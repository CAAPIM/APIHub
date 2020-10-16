import * as React from 'react';
import { SearchInput } from 'react-admin';
import { useTranslate } from 'ra-core';

export function ListArrayInputFilter(props) {
    const { filter, setFilter } = props;
    const translate = useTranslate();

    return (
        <>
            <SearchInput
                source="q"
                onChange={event => setFilter(event?.target?.value || '')}
                placeholder={translate(
                    'resources.applications.actions.searchByApiTitle'
                )}
            />
        </>
    );
}
