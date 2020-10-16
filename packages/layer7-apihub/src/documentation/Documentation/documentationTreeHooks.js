import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { saveExpandedNodes, selectExpandedNodes } from './documentationReducer';

export const useExpandedNodes = (entityUuid, locale) => {
    const dispatch = useDispatch();
    const expandedNodes = useSelector(
        useCallback(selectExpandedNodes(entityUuid, locale), [
            entityUuid,
            locale,
        ])
    );
    const setExpandedNodes = useCallback(
        expanded => dispatch(saveExpandedNodes(entityUuid, locale, expanded)),
        [dispatch, entityUuid, locale]
    );

    return [expandedNodes, setExpandedNodes];
};
