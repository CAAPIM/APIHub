
// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
/**
 * An Hook to clear the react-admin notifications.
 *
 * @example <caption>Simple usage: clear notifications on mount</caption>
 *
 * const MyLayout = props => {
 *     const clearNotifications = useClearNotifications();
 *
 *     useEffect(() => {
 *         clearNotifications();
 *     }, [clearNotifications]);
 *
 *     return <div>{props.children}</div>;
 * };
 *
 */
export const useClearNotifications = () => {
    return () => {};
};
