export const reorder = (list: any[], startIndex: number, endIndex: number) => {
    let endPosition;
    if(endIndex < startIndex) {
        endPosition = endIndex;
    } else {
        endPosition = endIndex - 1;
    }
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endPosition, 0, removed); // inserting task in new index
    return result;
};

export const calculateLengthCollision = (list: any[], field: string, value: string) => {
    const re =  new RegExp(`${value}+([\\_][0-9]+)?`);
    const listCollision = list.filter((item) => re.exec(item[field]));
    return listCollision.length;
}
