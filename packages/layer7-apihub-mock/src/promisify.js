export function promisify(func, ...params) {
    return new Promise(function(resolve, reject) {
        func(...params, resolve, reject);
    });
}
