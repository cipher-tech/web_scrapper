export const replaceString = (string: string, target = '$', value = '') => {
    return (`${string}` || '').replace(new RegExp(`[${target}]`, 'g'), value).trim();
}