
export const EnsureEmpty = (value) => {
    return value ? value : '';
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
