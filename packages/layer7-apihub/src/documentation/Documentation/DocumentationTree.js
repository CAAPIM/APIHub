import React, {
    forwardRef,
    useState,
    useCallback,
    useRef,
    useEffect,
    useContext,
    createContext,
    useMemo,
} from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { makeStyles } from '@material-ui/core';
import { useForkRef } from '@material-ui/core/utils';
import { useTranslate } from 'ra-core';
import Backend from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import classnames from 'classnames';
import FocusTrap from 'focus-trap-react';

import {
    getDocumentationTree,
    sortByOrdinal,
    hasParentWithId,
    getDocumentationTreeForDragDrop,
    getArrayFromTree,
} from './tree';

// We have to import this way otherwise it seems we end up with a different context
// that the one used by MUI TreeView
import TreeViewContext from '@material-ui/lab/esm/TreeView/TreeViewContext';

const TreeViewDragDropContext = createContext();

export const DocumentationTree = ({
    items,
    onDocumentSelected,
    selectedDocumentId,
    expanded: controlledExpanded,
    onExpandedChange,
    onDocumentParentChange,
    canDrag,
    ...props
}) => {
    const [draggedNodeId, setDraggedNodeId] = useState(false);
    const [isDraggingUsingKeyboard, setIsDraggingUsingKeyboard] = useState(
        false
    );

    const [uncontrolledExpanded, setExpanded] = useState([]);

    const expanded = !controlledExpanded
        ? uncontrolledExpanded
        : controlledExpanded;

    const tree = draggedNodeId
        ? getDocumentationTreeForDragDrop(items, draggedNodeId, sortByOrdinal)
        : getDocumentationTree(items, sortByOrdinal);

    const handleExpandedChange = useCallback(
        newExpanded => {
            if (onExpandedChange) {
                onExpandedChange(newExpanded);
            }

            setExpanded(newExpanded);
        },
        [onExpandedChange]
    );

    const handleSelectDocument = useCallback(
        (event, nodeId) => {
            event.preventDefault();

            const node = items.find(item => item.id === nodeId);

            // If the node does not have an uuid, it's a new document
            // and it shouldn't handle collapse, expand or select
            if ((!node || !node.uuid) && !draggedNodeId) {
                return;
            }

            if (canDrag && event.key === ' ') {
                // Manage the keyboard drag and drop if the user is allowed to drag
                if (draggedNodeId) {
                    // Apply the drop
                    const newItems = getArrayFromTree(tree);

                    const dropTarget = newItems.find(
                        item => item.id === nodeId
                    );
                    const droppedItem = newItems.find(
                        item => item.id === draggedNodeId
                    );

                    onDocumentParentChange({
                        documentUuid: droppedItem.uuid,
                        newParentUuid: dropTarget.dropData.parentUuid,
                        ordinal: dropTarget.dropData.ordinal,
                    });

                    setDraggedNodeId(undefined);
                } else {
                    setDraggedNodeId(nodeId);
                    setIsDraggingUsingKeyboard(true);
                }
            } else {
                onDocumentSelected(node);
            }
        },
        [
            canDrag,
            draggedNodeId,
            items,
            onDocumentParentChange,
            onDocumentSelected,
            tree,
        ]
    );

    const handleCollapse = useCallback(
        (event, nodeId) =>
            handleExpandedChange(expanded.filter(item => item !== nodeId)),
        [expanded, handleExpandedChange]
    );

    const handleExpand = useCallback(
        (event, nodeId) => handleExpandedChange([...expanded, nodeId]),
        [expanded, handleExpandedChange]
    );

    const handleNodeToggle = useCallback(
        (event, nodes) => {
            if (draggedNodeId && nodes.length > 0) {
                const node = items.find(item => item.id === nodes[0]);
                const nodeDragged = items.find(
                    item => item.id === draggedNodeId
                );

                if (hasParentWithId(items, nodeDragged.uuid, node.uuid)) {
                    return;
                }
            }

            handleExpandedChange(nodes);
        },
        [draggedNodeId, handleExpandedChange, items]
    );

    const handleNodeDropped = useCallback(
        data => {
            setDraggedNodeId(undefined);
            onDocumentParentChange(data);
        },
        [onDocumentParentChange]
    );

    useEffect(() => {
        const handleKeyDown = event => {
            if (draggedNodeId) {
                if (event.key === 'Escape') {
                    setDraggedNodeId(undefined);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [draggedNodeId, onDocumentParentChange, selectedDocumentId, tree]);

    const dragDropContextValue = useMemo(
        () => ({
            isDragged: id => id === draggedNodeId,
            isDragging: !!draggedNodeId,
            isDraggingUsingKeyboard,
            setDraggedNodeId: id => {
                setDraggedNodeId(id);
                setIsDraggingUsingKeyboard(false);
            },
        }),
        [draggedNodeId, isDraggingUsingKeyboard]
    );

    return (
        <DndProvider backend={Backend} context={window}>
            <TreeViewDragDropContext.Provider value={dragDropContextValue}>
                <FocusTrap active={!!draggedNodeId}>
                    <TreeView
                        defaultEndIcon={<div style={{ width: 24 }} />}
                        expanded={expanded}
                        onNodeToggle={handleNodeToggle}
                        onNodeSelect={handleSelectDocument}
                        selected={selectedDocumentId}
                        {...props}
                    >
                        {tree.map(item => (
                            <RecursiveTreeItem
                                key={item.id}
                                items={items}
                                node={item}
                                nodeId={item.id}
                                onCollapse={handleCollapse}
                                onDropped={handleNodeDropped}
                                onExpand={handleExpand}
                                canDrag={canDrag}
                            />
                        ))}
                    </TreeView>
                </FocusTrap>
            </TreeViewDragDropContext.Provider>
        </DndProvider>
    );
};

const RecursiveTreeItem = forwardRef((props, ref) => {
    const {
        node,
        onExpand,
        onCollapse,
        onDropped,
        items,
        canDrag,
        ...rest
    } = props;
    const {
        isDragging: isDraggingClassName,
        isOver: isOverClassName,
        isOverAfter: isOverAfterClassName,
        isOverBefore: isOverBeforeClassName,
        dropTarget: dropTargetClassName,
        dropTargetFocused: dropTargetFocusedClassName,
        ...classes
    } = useRecursiveTreeItemStyles(props);

    const translate = useTranslate();
    const { isFocused, isExpanded } = useContext(TreeViewContext);
    const {
        isDragged,
        isDragging,
        isDraggingUsingKeyboard,
        setDraggedNodeId,
    } = useContext(TreeViewDragDropContext);

    const isBeingDragged = isDragged(node.id);
    const nodeRef = useRef();
    const handleRef = useForkRef(nodeRef, ref);
    const focused = isFocused ? isFocused(node.id) : false;
    const expanded = isExpanded ? isExpanded(node.id) : false;

    const [, drag] = useDrag({
        item: { type: DRAG_DROP_TYPE, id: node.id, uuid: node.uuid },
        begin: () => {
            // This timeout is necessary to avoid an issue in chrome
            // preventing drag operations after a while
            // See https://github.com/react-dnd/react-dnd/issues/2177#issuecomment-607171231
            setTimeout(() => {
                setDraggedNodeId(node.id);
            }, 0);
        },
        end: () => {
            setDraggedNodeId(undefined);
        },
        canDrag: () => {
            return canDrag && !isDragging;
        },
    });

    const [{ dropAccepted, isOver }, drop] = useDrop({
        accept: DRAG_DROP_TYPE,
        canDrop: item => {
            return !hasParentWithId(items, node.uuid, item.uuid);
        },
        drop: (item, monitor) => {
            // if the drop was already handled by a child, stop right there
            if (monitor.didDrop()) {
                return;
            }
            // prevent accidental drop on parent node:
            // dropping on itself would bubble up to the parent node
            if (!monitor.isOver({ shallow: true })) {
                return;
            }

            onDropped({
                documentUuid: item.uuid,
                newParentUuid: node.dropData.parentUuid,
                ordinal: node.dropData.ordinal,
            });
        },
        collect: monitor => ({
            dropAccepted: monitor.canDrop(),
            // shallow at true means strictly over this node and not its children
            isOver: monitor.isOver({ shallow: true }),
        }),
    });

    const handleCollapse = useCallback(
        event => {
            // Stop event propagation to avoid loading the node
            event.stopPropagation();

            // If the node does not have an uuid, it's a new document
            // and it shouldn't handle collapse, expand or select
            if (node && node.uuid && onCollapse) {
                onCollapse(event, node.id);
            }
        },
        [node, onCollapse]
    );

    const handleExpand = useCallback(
        event => {
            // Stop event propagation to avoid loading the node
            if (event) {
                event.stopPropagation();
            }

            // If the node does not have an uuid, it's a new document
            // and it shouldn't handle collapse, expand or select
            if (node && node.uuid && onExpand) {
                onExpand(event, node.id);
            }
        },
        [node, onExpand]
    );

    const dragEnterTimeout = useRef();

    useEffect(() => {
        if (!isBeingDragged && dropAccepted && isOver && !expanded) {
            dragEnterTimeout.current = setTimeout(() => {
                onExpand(undefined, node.id);
                clearTimeout(dragEnterTimeout.current);
            }, 350);
            return;
        }

        if (!isOver && dragEnterTimeout.current) {
            clearTimeout(dragEnterTimeout.current);
        }
    }, [dropAccepted, expanded, isBeingDragged, isOver, node.id, onExpand]);

    const attachRef = useCallback(
        treeItem => {
            if (!treeItem) {
                return;
            }
            drag(treeItem);
            drop(treeItem);
            handleRef(treeItem);
        },
        [drag, drop, handleRef]
    );

    const isDraggingOver =
        ((isOver && dropAccepted) || (focused && isDraggingUsingKeyboard)) &&
        !isBeingDragged &&
        isDragging;

    return (
        <TreeItem
            ref={attachRef}
            classes={classes}
            className={classnames({
                [dropTargetClassName]: !!node.dropTarget,
                [dropTargetFocusedClassName]:
                    !!node.dropTarget && isDraggingOver,
                [isDraggingClassName]: isBeingDragged,
                [isOverClassName]: !node.dropTarget && isDraggingOver,
            })}
            aria-grabbed={isBeingDragged}
            aria-dropeffect={!isBeingDragged && isDragging ? 'move' : undefined}
            aria-label={
                node.dropTarget
                    ? translate(node.title, { title: node.relatedNode.title })
                    : node.title
            }
            label={!node.dropTarget ? node.title : ''}
            collapseIcon={
                <ArrowDropDownIcon
                    role="button"
                    aria-label={translate(
                        'resources.documents.actions.collapse_documentation',
                        {
                            title: node.title,
                        }
                    )}
                    onClick={handleCollapse}
                />
            }
            expandIcon={
                <ArrowRightIcon
                    role="button"
                    aria-label={translate(
                        'resources.documents.actions.expand_documentation',
                        {
                            title: node.title,
                        }
                    )}
                    onClick={handleExpand}
                />
            }
            {...rest}
        >
            {node.children && node.children.length > 0
                ? node.children.map(child => (
                      <RecursiveTreeItem
                          key={child.id}
                          items={items}
                          node={child}
                          nodeId={child.id}
                          onCollapse={onCollapse}
                          onDropped={onDropped}
                          onExpand={onExpand}
                          canDrag={canDrag}
                      />
                  ))
                : null}
        </TreeItem>
    );
});

const useRecursiveTreeItemStyles = makeStyles(theme => ({
    root: {
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    content: {
        padding: theme.spacing(1),
        paddingLeft: 0,
    },
    label: {},
    isDragging: {
        opacity: 0.5,
    },
    isOver: {
        borderColor: theme.palette.info.main,
    },
    dropTarget: {
        maxHeight: 5,
        minHeight: 5,
        borderWidth: 0,
    },
    dropTargetFocused: {
        backgroundColor: theme.palette.info.main,
    },
}));

export const DRAG_DROP_TYPE = 'document';
