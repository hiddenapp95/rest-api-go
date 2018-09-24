
export const deleteFromArrayByIndexes = (array,indexes) => {
    let notDeletedItems = [];

    for(let i = 0 ; i < array.length ; i++){
        if( ! indexes.includes(i) )
            notDeletedItems.push(array[i]);
    }

    return notDeletedItems
};

export const deleteFromArrayByIndex = (array,index) => {
    let newArray = [...array];
    newArray.splice(index, 1);
    return newArray
};
