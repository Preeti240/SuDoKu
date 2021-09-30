
//START TIMER SECTION
        var clicked = false;
        var sec,min;
        function startClock() {
            sec = 0;
            min = 0;
            if (clicked === false) {
                clock = setInterval("stopWatch()", 1000);
                clicked = true;
            }
        }

        function stopWatch() {
            if (sec === 59) {
                ++min;
                sec = 0;
            }
            else sec++;
            document.getElementById("timer").innerHTML = convertToTime(min) + ":" + convertToTime(sec);
        }
        function convertToTime(time){
            if (time > 9) return time;
            else return "0"+time;
        }

        function stopClock() {
            window.clearInterval(clock);
            document.getElementById("timer").innerHTML= convertToTime(min) + ":" + convertToTime(sec);
            clicked = false;
        }
//END TIMER SECTION
/*createSudoku() creates a base board framework and is executed on page load*/
//BEGIN CREATE BOARD
        function createSudoku() {
            var body=document.getElementsByTagName('body')[0];
            var board=document.getElementById('sudokuTable');
            var boardbdy=document.createElement('tbody');
            for(var i = 0; i < 9; ++i){
                var row=document.createElement('tr');
                for(var j = 0; j < 9; ++j){
                    var td=document.createElement('td');
                    var numb = document.createElement("input");
                    numb.readOnly = true;
                    numb.className += "cell";
                    var block;
                    if (i < 3 && j < 3) {
                        block = 'a';
                        numb.className += " grey_block";
                    }
                    else if (i < 3 && j < 6) block = 'b';
                    else if (i < 3 && j > 5) {
                        block = 'c';
                        numb.className += " grey_block";
                    }
                    else if (i < 6 && j < 3) block = 'd';
                    else if (i < 6 && j < 6) {
                        block = 'e';
                        numb.className += " grey_block";
                    }
                    else if (i < 6 && j > 5) block = 'f';
                    else if (i > 5 && j < 3) {
                        block = 'g';
                        numb.className += " grey_block";
                    }
                    else if (i > 5 && j < 6) block = 'h';
                    else {
                        block = 'i';
                        numb.className += " grey_block";
                    }
                    numbID = [i, j, block];
                    numb.id += numbID.join('');
                    td.appendChild(numb);
                    row.appendChild(td)
                }
                boardbdy.appendChild(row);
            }
            board.appendChild(boardbdy);
            body.appendChild(board);
        };
/*fillBoard() fills the board with a complete base sudoku board, it then scrambles the rows/cols/and numbers. 
It is executed on "New Game" press, and calls hideCells(). The algorithm is based on the sudoku generator by 
David J. Rager at http://blog.fourthwoods.com/2011/02/05/sudoku-in-javascript/     
*/
        function fillBoard() {
            var board = document.getElementsByClassName("cell");
            var randomNine = fishYatesShuffle(9);
            //create base sudoku board
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    board[i * 9 + j].value = (i * 3 + Math.floor(i/3) + j) % 9 + 1;
                    board[i * 9 + j].readOnly = true;
                    board[i * 9 + j].style.color = "black";
                }
            }
            //switch corresponding cols (Ex. the 2nd and 5th column)
            for (var i = 0; i < 20; ++i) {
                var col = Math.floor(Math.random() * 3);
                do {
                    var swap = col + (Math.floor(Math.random() * 3) * 3);// + 0, +3, +6
                }while(swap === 0)
                for (var j = 0; j < 9; ++j) {
                    var tmp = board[col + (j*9)].value;
                    board[col + (j*9)].value = board[swap + (j*9)].value;
                    board[swap + (j*9)].value = tmp;
                }
            }
            //switch cols within section blocks (Ex. all columns in the first three 
            //columns will be swapped)
            for (var i = 0; i < 20; ++i) {
                var block = Math.floor(Math.random() * 3);
                do {
                    var swap1 = Math.floor(Math.random() * 3) + block*3;
                    var swap2 = Math.floor(Math.random() * 3) + block*3;
                }while(swap1 === swap2)
                for (var j = 0; j < 9; ++j) {
                    var tmp = board[swap1 + (j*9)].value;
                    board[swap1 + (j*9)].value = board[swap2 + (j*9)].value;
                    board[swap2 + (j*9)].value = tmp;
                }
            }
            //switch rows within section blocks (Ex. all rows in the first three rows will be swapped)
            for (var i = 0; i < 20; ++i) {
                var block = Math.floor(Math.random() * 3);
                do {
                    var swap1 = Math.floor(Math.random() * 3) * 9 + block * 27;
                    var swap2 = Math.floor(Math.random() * 3) * 9 + block * 27;
                }while(swap1 === swap2)
                for (var j = 0; j < 9; ++j) {
                    var tmp = board[swap1 + j].value;
                    board[swap1 + j].value = board[swap2 + j].value;
                    board[swap2 + j].value = tmp;
                }
            }
            //switch numbers (Ex. all 9s will be swapped with all 7s on the board)
            for (var i = 0; i < 20; ++i) {
                do {
                    var numb1 = Math.ceil(Math.random() * 9);
                    var numb2 = Math.ceil(Math.random() * 9);
                }while(numb1 === numb2)
                for (var j = 0; j < board.length; ++j) {
                    if (board[j].value === numb1) board[j].value = numb2;
                    else if (board[j].value === numb2) board[j].value = numb1;
                }
            }
            hideCells();

         };
/*hideCells() naiivly hides 4 squares/block. This will create an easy sudoku puzzle that will normally be unique.*/
        function hideCells() {
            var board = document.getElementsByClassName("cell");
            var block = fishYatesShuffle(9);
            for (var i = 0; i < 9; ++i) {
                var cells = fishYatesShuffle(9);
                var cur_block = block.pop();
                var block_row = Math.floor(cur_block/3);
                var block_col = cur_block - block_row*3;
                for (var j = 0; j < 4; ++ j) { 
                    var cell = cells.pop();
                    var row = Math.floor(cell/3);
                    var col = cell - row*3;
                    cell = row*9 + block_row*27 + col + block_col*3;
                    board[cell].readOnly = false;
                    board[cell].onblur = function(event) { checkValid(this); };
                    board[cell].value = "";
                }
            }
        } 
/*fishYatesShuffle(size) implements the Fisher Yates algorithm to create a scrambled array of length "size".
Returns the scrambled array. */
        function fishYatesShuffle(size) {
            var fishYatesArray = [];
            for (var i = 0; i < size; i++) {
                fishYatesArray.push(i);
            }
            for (var j = size - 1; j >= 0; --j) {
                var k = Math.floor(Math.random() * (j+1));
                var cell1 = fishYatesArray[j];
                var cell2 = fishYatesArray[k];
                fishYatesArray[j] = cell2;
                fishYatesArray[k] = cell1;
            }
            return fishYatesArray;
        }
//END CREATE SUDOKU SECTION
//BEGIN VALIDATION SECTION
/*checkValid(numb) is called everytime a user clicks off of a filled cell entry. Checks to see if entry
matches other cells in the same block, column, or section. Returns bool: true if valid, false if not*/
        function checkValid(numb) {
            var valid = true;
            if(numb.value != "") {
                if (numb.value % 1 != 0 || numb.value > 9 || numb.value < 1) {
                    alert("Invalid Entry: Please enter a number between 1 - 9. You entered " + numb.value);
                }
            }
            var board = document.getElementsByClassName("cell");
            var check = document.getElementById(numb.id);
            check = check.id.split("");
            for (var i = 0; i < board.length; ++i) {
                var boardId = board[i].id;
                boardId = boardId.split("");
                var row = boardId[0];
                var col = boardId[1];
                var block = boardId[2];
                if (row === check[0] && col === check[1]) continue;
                if (row === check[0] || col === check[1] || block === check[2]) {
                    if (numb.value === board[i].value && numb.value != "") {
                        valid = false;
                        document.getElementById(numb.id).style.color = "red";
                        document.getElementById(board[i].id).style.color = "red";
                    }
                    else {
                        document.getElementById(board[i].id).style.color = "black";
                        if (valid) document.getElementById(numb.id).style.color = "black";
                    }
                }
            }
            return valid;
        };
//checkBoard() checks the entire board to see if valid and stops the timer if it the valid
        function checkBoard() {
            var board = document.getElementsByClassName("cell");
            var valid = true;
            for (var i = 0; i < board.length; ++i) {
                if (board[i].value === "" || board[i].value === undefined) {
                    valid = false;
                }
                if (!checkValid(board[i])) {
                    valid = false;
                }
            }
            if (valid) {
               stopClock(); 
               alert("CONGRATS! " + "You finished in: " + convertToTime(min) + ":" + convertToTime(sec));
            } 
            else {
                alert("Not done yet!");
            }
        }
//END VALIDATION SECTION

