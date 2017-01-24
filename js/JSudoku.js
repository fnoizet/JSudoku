Array.prototype.copy = function()
{
    var arrayCp = [];
    for (var i = 0; i < this.length; i++) {
        arrayCp.push(this[i]);
    }
    return arrayCp;
};

//Array.prototype.contains = function (valeur)
//{
//    for (var i = 0; i < this.length; i++) {
//        if (this[i] == valeur) {
//            return true;
//        }
//    }
//        return false;
//};

Array.prototype.popElement = function()
{
    if (typeof(arguments[0]) === "object") {
        if (arguments[0].length) {
            var cpArg = arguments[0];
            for (var i = 0; i < cpArg.length; i++) {
                this.popElement(cpArg[i]);
            }
            return;
        } else {
            return this;
        }
    }
    var element;
    var cpArray = this.copy();
    while(this.length > 0){this.pop();}
    for (i = 0; i < arguments.length; i++) {
        element = arguments[i];
        for (var j = 0; j < cpArray.length; j++){
            if(cpArray[j] !== element){this.push(cpArray[j]);}
        }
    }
    return this;
};
//
//Array.prototype.intersect = function (array)
//{
//    var initial;
//    var temoin;
//
//    if(array.length > this.length){
//        initial = array;
//        temoin = this.copy();
//    }else{
//        initial = this.copy();
//        temoin = array;
//    }
//    for(var i = initial.length; i > 0; i--){
//        if(!temoin.contains(this[i])){
//            initial.popElement(this[i]);
//        }
//    }
//    return initial;
//};

// un parametre : renvoi un rand entre zero et parametre inclus
// deux parametres : renvoi un rand entre param1 et param2 inclus
// autre : renvoi false;
function randN()
{
    var max;
    var min;
    var res;
    if(arguments.length === 2){
        max = arguments[1];
        min = arguments[0];
    }else if(arguments.length === 1){
        max = arguments[0];
        min = 0;
    }else{
        return 0;
    }
    if(min > max){
        var tmp = min;
        min = max;
        max = tmp;
    }
    max ++;
    res = Math.floor(Math.random() * (max - min)) + min;
    return res;
}

function sudoku()
{
    var LENGTH = 9;
    var oSudoku = {
        //properties
        matrix : [],
        pattern : [
            [1,0,1,0,0,0,1,0,1],
            [0,0,1,0,0,0,1,0,0],
            [1,0,0,1,0,1,0,0,1],
            [0,1,0,1,0,1,0,1,0],
            [0,0,0,0,1,0,0,0,0],
            [0,1,0,1,0,1,0,1,0],
            [1,0,0,1,0,1,0,0,1],
            [0,0,1,0,0,0,1,0,0],
            [1,0,1,0,0,0,1,0,1]
        ],
        replayCreateLine: false,
        currentLineRecursion: 0,
        //methods,
        init: function(){
            var i, j;
            for (i = 0; i < LENGTH; i++) {
                this.matrix[i] = [];
                for (j = 0; j < LENGTH; j++) {
                    this.matrix[i][j] = 0;
                }
            }
            //this.fill();
        },
        reset: function()
        {
            for (var i = 0; i < LENGTH; i++) {
                this.matrix[i] = [];
                for (var j = 0; j < LENGTH; j++) {
                    this.matrix[i][j] = 0;
                }
            }
        },
        fill: function ()
        {
            for (var i = 0; i < 9; i++) {
                this.createLine(i);
            }
        },
        display: function ()
        {
            var matrice = this.matrix;
            var ssMatrice = null;
            this.table = document.createElement("table");
            this.table.id = "grille_sudoku";
            this.table.className = "grille_sudoku";
            this.table.cellSpacing = "0";
            var tbody = document.createElement("tbody");
            this.table.appendChild(tbody);
            
            var newLine = null;
            var newCell = null;
            for(var i = 0; i < matrice.length; i++){
                newLine = document.createElement("tr");
                ssMatrice = matrice[i];
                for(var j = 0; j < ssMatrice.length; j++){
                    newCell = document.createElement("td");
                    newCell.id = "cell_" + i + '_' + j;
                    if (this.pattern[i][j] === 1) {
                        newCell.innerHTML = ssMatrice[j];
                    } else {
                        this.bindPopinChoice(newCell);
                    }
                    
                    newLine.appendChild(newCell);
                }

                this.table.appendChild(newLine);
            }

            document.body.appendChild(this.table);
            
            this.popin = document.createElement('div');
            this.popin.id = 'popin';
            
            for (var i = 1; i < 10; i++) {
                var popinChoiceElt = document.createElement('div');
                popinChoiceElt.id = i;
                popinChoiceElt.className = "popinChoice";
                popinChoiceElt.innerHTML = i;
                this.popin.appendChild(popinChoiceElt);
            }
            
            document.body.appendChild(this.popin);
        },
        /* renvoit la r�gion de 3x3 dans lequel est la cellule en indexLine x indexCol */
        getRegion: function (indexLine, indexCol)
        {
            var matrice = [];
            var interval = {};
            interval.i = ((indexLine - indexLine % 3) / 3);
            interval.j = ((indexCol - indexCol % 3) / 3);

            if(interval.i > 8){interval.i = 8;}
            if(interval.j > 8){interval.j = 8;}

            for(var i = 0; i < 3; i++){
                matrice[i] = [];
                for(var j = 0; j < 3; j++){
                    matrice[i][j] = this.matrix[i + (interval.i * 3)][j + (interval.j * 3)];
                }
            }
            return matrice;
        },
        setCellValue: function (value, iLine, iCol) {
            if (typeof(value) === 'undefined') {
                this.replayCreateLine = true;
            }
            this.matrix[iLine][iCol] = value;
        },
        cleanLine: function (iLine) {
            for (var iCol = 0; iCol < this.matrix[iLine].length; iCol++) {
                this.matrix[iLine][iCol] = null;
            }
        },
        createLine: function (ligne)
        {
            var purpose;
            var arrayPurposes = [];
            for (var j = 0; j < 9; j++) {
                arrayPurposes.push(this.getPurposes(ligne, j));
            }

            for (j = 0; j < this.matrix[ligne].length; j++) {
                purpose = arrayPurposes[j][randN(arrayPurposes[j].length - 1)];
                this.setCellValue(purpose, ligne, j);
                for (var k = 0; k < this.matrix[ligne].length; k++) {
                    arrayPurposes[k].popElement(purpose);
                }
            }

            if (this.replayCreateLine) {
                this.replayCreateLine = false;
                this.cleanLine(ligne);
                if (this.currentLineRecursion > 10) {
                    this.cleanLine(ligne - 1);
                    this.createLine(ligne - 1);
                }
                this.currentLineRecursion++;
                this.createLine(ligne);
            } else {
                this.currentLineRecursion = 0;
            }
        },
        /* Returns possible values for a cell */
        getPurposes: function(indexLine, indexCol)
        {
            var res = [];
            for(var nb = 1; nb <= 9; nb++){
                if(this.isSettable(nb, indexLine, indexCol)){
                    res.push(nb);
                }
            }
            return res;
        },
        /* return true / false renvoit si la valeur est présente */
        isInSquare: function (number, indexLine, indexCol)
        {
            var square = this.getRegion(indexLine, indexCol);
            var ssMatrice;
            for(var i = 0; i < square.length; i++){
                ssMatrice = square[i];
                for(var j=0; j < ssMatrice.length; j++){
                    if(number === ssMatrice[j]){
                        return true;
                    }
                }
            }
            return false;
        },
        isInLine: function (number, indexLine)
        {
            for(var j = 0; j < this.matrix[indexLine].length; j++){
                if(number === this.matrix[indexLine][j]){
                    return true;
                }
            }
            return false;
        },
        isInColumn: function (number, indexCol)
        {
            for(var i = 0; i < this.matrix.length; i++){
                if(number === this.matrix[i][indexCol]){
                    return true;
                }
            }
            return false;
        },
        /**
         * Return true or false whether the value can be set in iLine x iCol
         * @param value The value to check
         * @param iLine the line to check
         * @param iCol the column to check
         * @return boolean
         */
        isSettable: function (value, iLine, iCol)
        {
            if(!this.isInLine(value, iLine) && !this.isInColumn(value, iCol) && !this.isInSquare(value, iLine, iCol)){
                return true;
            }else{
                return false;
            }
        },
        bindPopinChoice: function(cell) {
            var that = this;
            cell.addEventListener('click', function(e) {
                cell.appendChild(that.popin);
                that.popin.style.display = 'block';
            }, false);
        }
    };

    oSudoku.init();
    return oSudoku;
}

function initSudoku()
{
    mySudoku = new sudoku();
    mySudoku.fill();
    mySudoku.display();
}