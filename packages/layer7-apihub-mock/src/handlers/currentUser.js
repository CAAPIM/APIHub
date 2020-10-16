const CurrentUserKey = '@mock/currentUser';

export function setCurrentUser(user) {
    return localStorage.setItem(CurrentUserKey, JSON.stringify(user));
}

export function deleteCurrentUser() {
    localStorage.removeItem(CurrentUserKey);
}

export function getCurrentUser() {
    const str = localStorage.getItem(CurrentUserKey);

    if (str) {
        return JSON.parse(str);
    }

    return null;
}
