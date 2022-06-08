export const waitFor = (time: number) => new Promise<void>((resolve) => {
    setTimeout(() => {
        resolve();
    }, time);
})