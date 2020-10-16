import { hideNotification } from 'ra-core';
import { useDispatch } from 'react-redux';

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
    const dispatch = useDispatch();
    return () => dispatch(hideNotification());
};
