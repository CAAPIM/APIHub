import * as React from 'react';
import { List } from '@material-ui/core';
import { Pagination } from 'react-admin';
import { ListArrayInputItem } from './ListArrayInputItem';

const DefaultPagination = <Pagination />;

/**
 * An input component allowing to select multiple records, using an array of objects for the options.
 * Pass possible options as an array of objects in the 'choices' attribute. It is compatible with
 * the <ReferenceArrayInput /> component from React Admin.
 *
 * It will render its children once for each choice it receives, wrapped inside a Material UI
 * <ListItem />. You are responsible for what to put inside this <ListItem />.
 *
 * @example <caption>Usage inside a <ReferenceArrayInput /></caption>
Y *
 * By default, this component does not provide any UI for adding/removing items. However, you
 * can leverage the `useListArrayInputItem` hook to get the record to display as well as two
 * helper fonctions to add or remove it from the selection.
 *
 * @example <caption>Example of a child for <ListArrayInput /></caption>
 * import { useListArrayInputItem } from 'layer7-apihub';
 * import { IconButton, ListItemIcon, ListItemText } from 'material-ui';
 * import AddIcon from '@material-ui/icons/Add';
 * import DeleteIcon from '@material-ui/icons/Delete';
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
 *
 * It also accept a component as its filters prop. This component will be cloned with two
 * additional props: filter and setFilter.
 * @example <caption>Filter component</caption>
 * 
 * import { SearchInput } from 'react-admin';
 * 
 * function ListArrayInputFilter(props) {
 *     const { filter, setFilter } = props;
 *     
 *     return (
 *         <SearchInput
 *             source="q"
 *             onChange={event =>
 *                 setFilter({ ...filter, q: event?.target?.value || '' })
 *             }
 *         />
 *     );
 * }
 * 
 * // Then use it like this:
 * <ReferenceArrayInput
 *     label=""
 *     source="ApiIds"
 *     reference="apis"
 *     resource={props.resource}
 *     perPage={5}
 * >
 *     <ListArrayInput
 *         filters={<ListArrayInputFilter />}
 *     >
 *         <ApiChoiceItem />
 *     </ListArrayInput>
 * </ReferenceArrayInput>
 */
export function ListArrayInput(props) {
    const {
        availableChoices,
        children,
        filter,
        filters,
        input,
        onAdd,
        onRemove,
        page,
        pagination = DefaultPagination,
        setFilter,
        setPage,
        perPage,
        setPerPage,
        total,
    } = props;

    const handleAdd = (event, item) => {
        let cancelled = false;

        if (onAdd) {
            // If the handler returns false, prevent the addition
            if (onAdd(event, item) === false) {
                cancelled = true;
            }
        }

        cancelled = cancelled || event.defaultPrevented;

        if (!cancelled) {
            input.onChange([...input.value, item.id]);
        }
    };

    const handleRemove = (event, item) => {
        let cancelled = false;

        if (onRemove) {
            // If the handler returns false, prevent the addition
            if (onRemove(event, item) === false) {
                cancelled = true;
            }
        }

        cancelled = cancelled || event.defaultPrevented;

        if (!cancelled) {
            input.onChange(
                input.value.filter(selectedItem => selectedItem.id !== item.id)
            );
        }
    };

    return (
        <>
            {!!filters && React.cloneElement(filters, { filter, setFilter })}
            <List>
                {availableChoices &&
                    availableChoices.map((choice, index) => (
                        <ListArrayInputItem
                            key={choice.id}
                            selected={
                                !!input.value && input.value.includes(choice.id)
                            }
                            record={choice}
                            onAdd={handleAdd}
                            onRemove={handleRemove}
                        >
                            {React.Children.only(children)}
                        </ListArrayInputItem>
                    ))}
            </List>
            {React.cloneElement(pagination, {
                page,
                perPage,
                total,
                setPage,
                setPerPage,
            })}
        </>
    );
}
