// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.

/**
 * Copy of React Admin ReferenceArrayInput.
 * It adds support for a more complete pagination, sorting and filtering features.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, Labeled } from 'react-admin';
import { TextField } from '@mui/material';
import { useReferenceArrayInputController } from './useReferenceArrayInputController';
import { useInput, useTranslate } from 'react-admin';

/**
 * An Input component for fields containing a list of references to another resource.
 * Useful for 'hasMany' relationship.
 *
 * @example
 * The post object has many tags, so the post resource looks like:
 * {
 *    id: 1234,
 *    tag_ids: [ "1", "23", "4" ]
 * }
 *
 * ReferenceArrayInput component fetches the current resources (using
 * `dataProvider.getMany()`) as well as possible resources (using
 * `dataProvider.getMatching()`) in the reference endpoint. It then
 * delegates rendering to a subcomponent, to which it passes the possible
 * choices as the `choices` attribute.
 *
 * Use it with a selector component as child, like `<SelectArrayInput>`
 * or <CheckboxGroupInput>.
 *
 * @example
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceArrayInput source="tag_ids" reference="tags">
 *                 <SelectArrayInput optionText="name" />
 *             </ReferenceArrayInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      perPage={100}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      sort={{ field: 'name', order: 'ASC' }}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      filter={{ is_public: true }}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 *
 * The enclosed component may filter results. ReferenceArrayInput passes a
 * `setFilter` function as prop to its child component. It uses the value to
 * create a filter for the query - by default { q: [searchText] }. You can
 * customize the mapping searchText => searchQuery by setting a custom
 * `filterToQuery` function prop:
 *
 * @example
 * <ReferenceArrayInput
 *      source="tag_ids"
 *      reference="tags"
 *      filterToQuery={searchText => ({ name: searchText })}>
 *     <SelectArrayInput optionText="name" />
 * </ReferenceArrayInput>
 */
export const ReferenceArrayInput = ({
    children,
    id: idOverride,
    onBlur,
    onChange,
    onFocus,
    validate,
    parse,
    format,
    ...props
}) => {
    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceArrayInput> only accepts a single child (like <Datagrid>)'
        );
    }

    const { id, field, isRequired, fieldState } = useInput({
        id: idOverride,
        onBlur,
        onChange,
        onFocus,
        source: props.source,
        validate,
        parse,
        format,
        ...props,
    });

    const controllerProps = useReferenceArrayInputController({
        ...props,
        input: field,
    });

    const translate = useTranslate();

    return (
        <ReferenceArrayInputView
            id={id}
            input={field}
            isRequired={isRequired}
            meta={fieldState}
            translate={translate}
            children={children}
            {...props}
            {...controllerProps}
        />
    );
};

ReferenceArrayInput.propTypes = {
    allowEmpty: PropTypes.bool,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    filter: PropTypes.object,
    label: PropTypes.string,
    perPage: PropTypes.number,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
};

ReferenceArrayInput.defaultProps = {
    filter: {},
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
};

const sanitizeRestProps = ({
    crudGetMany,
    crudGetMatching,
    perPage,
    referenceSource,
    ...rest
}) => rest;

export const ReferenceArrayInputView = ({
    allowEmpty,
    availableChoices,
    basePath,
    children,
    choices,
    className,
    error,
    filter,
    input,
    isLoading,
    isRequired,
    label,
    meta,
    onChange,
    options,
    page,
    perPage,
    resource,
    selectedChoices,
    setFilter,
    setPage,
    setPagination,
    setPerPage,
    setSort,
    setSortField,
    setSortOrder,
    sort,
    source,
    total,
    translate,
    warning,
    ...rest
}) => {
    const translatedLabel = translate(
        label || `resources.${resource}.fields.${source}`,
        { _: label }
    );

    if (isLoading) {
        return (
            <Labeled
                label={translatedLabel}
                source={source}
                resource={resource}
                className={className}
                isRequired={isRequired}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    if (error) {
        return (
            <TextField
                error
                disabled
                label={label}
                value={error}
                margin="normal"
            />
        );
    }

    return React.cloneElement(children, {
        allowEmpty,
        availableChoices, // CHANGE: Added
        basePath,
        choices,
        className,
        error,
        filter,
        input,
        isRequired,
        label: translatedLabel,
        meta: {
            ...meta,
            helperText: warning || false,
        },
        onChange,
        options,
        page, // CHANGE: Added
        perPage,
        resource,
        selectedChoices, // CHANGE: Added
        setFilter,
        setPage, // CHANGE: Added
        setPagination,
        setPerPage, // CHANGE: Added
        setSort,
        setSortOrder, // CHANGE: Added
        setSortField, // CHANGE: Added
        sort, // CHANGE: Added
        source,
        total, // CHANGE: Added
        translateChoice: false,
        limitChoicesToValue: true,
        ...sanitizeRestProps(rest),
        ...children.props,
    });
};

ReferenceArrayInputView.propTypes = {
    allowEmpty: PropTypes.bool,
    basePath: PropTypes.string,
    children: PropTypes.element,
    choices: PropTypes.array,
    className: PropTypes.string,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    options: PropTypes.object,
    resource: PropTypes.string.isRequired,
    setFilter: PropTypes.func,
    setPagination: PropTypes.func,
    setSort: PropTypes.func,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
    warning: PropTypes.string,
};
