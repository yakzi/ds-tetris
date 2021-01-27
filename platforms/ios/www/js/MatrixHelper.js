function transpose(matrix) {
    return Object.keys(matrix[0]).map(function(c) {
        return matrix.map(function(r) { return r[c]; });
    });
}

function getCol(matrix, col){
    let column = [];
    for(var i=0; i<matrix.length; i++){
        column.push(matrix[i][col]);
    }
    return column;
}

function rotate(matrix) {
    return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
}

function removeRowZeros(matrix) {
    let array = [];
    for(let i = 0; i < matrix.length; i++) {
        if (matrix[i].includes(1)) {
            array.push(matrix[i]);
        }
    }
    return array;
}

function reduceZeros(matrix) {
    let tempMatrix = removeRowZeros(matrix);
    tempMatrix = transpose(tempMatrix);
    let tempMatrix2 = removeRowZeros(tempMatrix);
    tempMatrix2 = transpose(tempMatrix2);
    return tempMatrix2;
}