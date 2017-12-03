
export const SortByAlpha = (a, b) => {
    if(a < b){
        return -1;
    }
    if(a > b){
        return 1;
    }
    return 0;
};

// http://www.jacklmoore.com/notes/rounding-in-javascript/
export const Round = (value) => {
    return Number(Math.round(value + 'e'+ 2) + 'e-'+ 2);
};
