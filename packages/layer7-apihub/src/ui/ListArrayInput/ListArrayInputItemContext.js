// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';

export const ListArrayInputItemContext = React.createContext();

/**
 * This hook is meant to be used inside the children passed to the
 * <ListArrayInput /> component in order to get the current record
 * as well as two functions to add or remove this record from the
 * selected items.
 *
 * @example <caption>Example of a child for <ListArrayInput /></caption>
 * import { useListArrayInputItem } from 'layer7-apihub';
 * import { IconButton, ListItemIcon, ListItemText } from 'material-ui';
 * import AddIcon from '@mui/icons-material/Add';
 * import DeleteIcon from '@mui/icons-material/Delete';
 *
 * function ApiChoiceItem(props) {
 *     const { onAdd, onRemove, record, selected } = useListArrayInputItem();
 *
 *     return (
 *         <>
 *             <ListItemIcon>
 *                 {selected ? (
 *                     <IconButton
 *                         aria-label="remove"
 *                         onClick={onRemove}
 *                     >
 *                         <DeleteIcon />
 *                     </IconButton>
 *                 ) : (
 *                     <IconButton
 *                         aria-label="add"
 *                         onClick={onAdd}
 *                     >
 *                         <AddIcon />
 *                     </IconButton>
 *                 )}
 *             </ListItemIcon>
 *             <ListItemText>{record.name}</ListItemText>
 *         </>
 *     )
 * }
 */
export function useListArrayInputItem() {
    const context = React.useContext(ListArrayInputItemContext);

    if (context === undefined) {
        throw new Error(
            'useListArrayInputItem must be used within a ListArrayInputItemContext'
        );
    }

    return context;
}
