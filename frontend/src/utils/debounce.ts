// foreverflower/frontend/src/utils/debounce.ts

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have passed since the last time the debounced function was invoked.
 *
 * The debounced function comes with a `cancel` method to cancel delayed `func` invocations.
 *
 * @param func The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @returns A new debounced function with a `cancel` method.
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel(): void;
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): DebouncedFunction<T> {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = function(this: any, ...args: Parameters<T>) {
        const context = this;
        const later = () => {
            timeout = null;
            func.apply(context, args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };

    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
}