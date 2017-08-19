
export const EnsureEmpty = (value) => {
    return value ? value : '';
};

export const EnsureZero = (value) => {
    return value ? value : 0;
};

export const SortByAlpha = (a, b) => {
    if(a < b){
        return -1;
    }
    if(a > b){
        return 1;
    }
    return 0;
};
