import React, {
    useState,
    Children,
    cloneElement,
    useEffect,
    forwardRef,
} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SortIcon from '@material-ui/icons/Sort';
import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeListParams, useTranslate } from 'ra-core';
import { useHistory } from 'react-router-dom';
import { stringify } from 'query-string';

/**
 * A sort button to use on a list which does not display a datagrid.
 *
 * @param {String} resource The resource on which to apply the sort
 * @param {Object} currentSort The current sort
 * @param {Object} currentSort.field The currently sorted field (eg: "name")
 * @param {Object} currentSort.order The current sort order (eg: "ASC")
 *
 * @example <caption>Usage inside a custom toolbar for a <List></caption>
 * import { TopToolbar } from 'react-admin';
 *
 * const ApiListActions = ({
 *     currentSort, // injected by react-admin
 *     resource, // injected by react-admin
 *     ...props
 * }) => {
 *     return (
 *         <TopToolbar
 *             className={classnames(classes.root, className)}
 *             {...sanitizeListRestProps(props)}
 *         >
 *             <SortButton resource={resource} currentSort={currentSort}>
 *                 <SortMenuItem
 *                     label="resources.apis.list.sort.name.asc" // Will be translated
 *                     sort={{ field: 'name', order: 'ASC' }}
 *                 />
 *                 <SortMenuItem
 *                     label="resources.apis.list.sort.name.desc" // Will be translated
 *                     sort={{ field: 'name', order: 'DESC' }}
 *                 />
 *             </SortButton>
 *         </TopToolbar>
 *     );
 * };
 */
export const SortButton = ({ children, resource, currentSort }) => {
    const [currentSortLabel, setCurrentSortLabel] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const translate = useTranslate();
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    const listParams = useSelector(
        reduxState =>
            reduxState.admin.resources[resource]
                ? reduxState.admin.resources[resource].list.params
                : {},
        shallowEqual
    );

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (event, sortData) => {
        history.push({
            search: `?${stringify({
                ...listParams,
                filter: JSON.stringify(listParams.filter),
                sort: sortData.sort.field,
                order: sortData.sort.order,
            })}`,
        });

        dispatch(
            changeListParams(resource, {
                ...listParams,
                sort: sortData.sort.field,
                order: sortData.sort.order,
            })
        );
        handleClose();
    };

    useEffect(() => {
        const childrenAsArray = Children.toArray(children);

        if (childrenAsArray.length === 0) {
            return;
        }

        let selectedChild = childrenAsArray.find(
            child =>
                child.props.sort.field === currentSort.field &&
                child.props.sort.order === currentSort.order
        );

        if (!selectedChild) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    'The current sort parameters do not match the provided children'
                );
            }
            selectedChild = childrenAsArray[0];
        }

        setCurrentSortLabel(translate(selectedChild.props.label));
    }, [children, currentSort, translate]);

    return currentSortLabel ? (
        <>
            <Button
                aria-controls="sort-menu"
                aria-label={currentSortLabel}
                aria-haspopup="true"
                onClick={handleClick}
                startIcon={<SortIcon />}
                endIcon={<ArrowDropDownIcon />}
                className={classes.root}
                size="small"
                color="primary"
            >
                {currentSortLabel}
            </Button>
            <Menu
                id="sort-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {Children.map(children, child =>
                    cloneElement(child, {
                        onClick: handleMenuItemClick,
                        ...child.props,
                    })
                )}
            </Menu>
        </>
    ) : null;
};

const useStyles = makeStyles(theme => ({
    root: {
        marginLeft: theme.spacing(),
    },
}));

export const SortMenuItem = forwardRef(({ label, sort, onClick }, ref) => {
    const translate = useTranslate();

    const handleClick = event => {
        onClick(event, { label, sort });
    };

    return (
        <MenuItem ref={ref} onClick={handleClick}>
            {translate(label, { _: label })}
        </MenuItem>
    );
});
