export const replaceString = (string: string, target = '$', value = '') => {
    return (`${string}` || '').replace(new RegExp(`${target}`, 'g'), value).trim();
}

export const replaceSpecialCharacters = (string: string, ) => {
    return (string).replace(/[^a-zA-Z0-9 ]/g, '');
}
