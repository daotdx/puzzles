const landingPage = document.querySelector('.landing-page');
const startButton = document.querySelector('#startButton');
const puzzleContainer = document.querySelector('.puzzle-container');
const puzzle = document.querySelector('.puzzle');
let currentElement = "";
let movesCount = 0;
let imagesArr = [];
var initialPositions = [];
var pieces = [];
var userInfo;

// onload game 
window.onload = function() {
    loadingUserInfo();
}

startButton.addEventListener("click", () => {
    new Jigsaw().init({
        container: '.puzzles',
        image: './images/main.jpg',
        gridSize: 3
    });

    landingPage.style.display = 'none';
    puzzleContainer.style.display = 'flex';
   
});


// onclick show result 
// resultButton.addEventListener("click", ()=>{
//     movesCount = 0;
//     initialPositions.forEach(function(initialPiece, index) {
//         pieces[index].movePiece(initialPiece.row, initialPiece.col);
//     });
// })


// loading data 
function loadingGame(){
    // conect db get data[id, image, gridSize, level]
    
}

// loading user info
function loadingUserInfo(){
    userInfo = {
        avatar: "images/jerry1.jpg",
        level: 20,
        userName: "DaoTran"
    }
    document.getElementById("user-name").innerHTML = userInfo.userName;
    document.getElementById("user-level").innerHTML = "Level: " + userInfo.level;
}

var Jigsaw = function () {
    var container;
    var puzzleImg = {};
    var gridSize = 6;
    var widthFactor = 1;
    var heightFactor = 1;
    var puzzleWidht = puzzleHeight = Math.min($(window).width(), 512) - 40;
    console.log(puzzleWidht)
    var successfull;

    var Piece = function (row, col, size) {
        this.row = row;
        this.col = col;
        this.size = size;

        this.movePiece = function (row, col) {
            // movesCount ++;
            // moves.innerText = `Số lượt: ${movesCount}`;
            this.newRow = row;
            this.newCol = col;
            $(this.pieceEle).animate({
                left: this.newRow * size,
                top: this.newCol * size,
            }, {
                duration: 100,
                easing: 'linear',
                complete: function () {
                    isSuccess(); // Gọi hàm isDone sau khi mảnh ghép di chuyển
                }
            });
        }

        this.createPiece = function (container) {
            this.pieceEle = document.createElement('div');
            $(this.pieceEle).css({
                position: 'absolute',
                left: row * size,
                top: col * size,
                height: size - 4 + 'px',
                width: size - 4 + 'px',
                margin: '2px',
                'background-image': 'url(' + puzzleImg.url + ')',
                'background-position-x': this.row * size * -1,
                'background-position-y': this.col * size * -1,
                'background-size': puzzleWidht,
                'background-repeat': 'no-repeat'
            });
            $(container).append(this.pieceEle);
        }

        this.removePiece = function () {
            $(this.pieceEle).remove();
        }
    }

    function initPuzzle(opt) {
        opt = opt || {};
        gridSize = Math.max(opt.gridSize || 3, 3);
        container = opt.container;
        loadPuzzleImage(opt.image);
    }

    function loadPuzzleImage(image) {
        let img = document.createElement('img');
        img.onload = function (e) {
            puzzleImg.height = img.naturalHeight;
            puzzleImg.width = img.naturalWidth;
            widthFactor = puzzleWidht / img.naturalWidth;
            heightFactor = puzzleHeight / img.naturalHeight;
            puzzleImg.url = img.src;
            $(container).css({
                width: puzzleWidht,
                height: puzzleHeight
            });
            preparePieces();
            setTimeout(function () {
                resetGame();
            }, 1000);
        }
        img.src = image || 'images/micky.png';
    }

    function resetGame() {
        shuffle(pieces);
        var index = 0;
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                var piece = pieces[index];
                if (!piece) {
                    return;
                }
                $(piece.pieceEle).on('click', function () {
                    var clickedPiece;
                    for (var i = 0; i < pieces.length; i++) {
                        if (this === pieces[i].pieceEle) {
                            clickedPiece = pieces[i];
                            break;
                        }
                    }

                    if (!clickedPiece) {
                        return;
                    }
                    var newRow = clickedPiece.newRow;
                    var newCol = clickedPiece.newCol - 1;
                    if (newRow >= 0 && newCol >= 0) {
                        if (!getPiece(newRow, newCol)) {
                            clickedPiece.movePiece(newRow, newCol);
                            return;
                        }
                    }
                    newRow = clickedPiece.newRow - 1;
                    newCol = clickedPiece.newCol;
                    if (newRow >= 0 && newCol >= 0) {
                        if (!getPiece(newRow, newCol)) {
                            clickedPiece.movePiece(newRow, newCol);
                            return;
                        }
                    }
                    newRow = clickedPiece.newRow + 1;
                    newCol = clickedPiece.newCol;
                    if (newRow < gridSize && newCol < gridSize) {
                        if (!getPiece(newRow, newCol)) {
                            clickedPiece.movePiece(newRow, newCol);
                            return;
                        }
                    }
                    newRow = clickedPiece.newRow;
                    newCol = clickedPiece.newCol + 1;
                    if (newRow < gridSize && newCol < gridSize) {
                        if (!getPiece(newRow, newCol)) {
                            clickedPiece.movePiece(newRow, newCol);
                            return;
                        }
                    }
                });
                movesCount = -1;
                piece.movePiece(i, j);
                index++;
            }
        }
    }

    function isSuccess() {
       
        successfull = pieces.every(function(piece, index) {
            return piece.row === initialPositions[index].initialRow && piece.col === initialPositions[index].initialCol;
        });
        
        if(movesCount == 5){
         
        // document.getElementById('main-image').src ='./images/612.jpg';
        // movesCount = 0;
        // new Jigsaw().init({
        //             container: '#puzzle',
        //             image: './images/612.jpg',
        //             gridSize: 3
        //         });
        // }else{
        //     console.log("Sai roi ma")
        }
    }

    function getPiece(row, col) {
        for (var i = 0; i < pieces.length; i++) {
            var currPiece = pieces[i];
            if (currPiece.newRow == row && currPiece.newCol == col) {
                return currPiece;
            }
        }
        return null;
    }

    function preparePieces() {
        var piceSize = puzzleWidht / gridSize;
        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                var piece = new Piece(i, j, piceSize);
                piece.createPiece(container);
                pieces.push(piece);
            }
        }
        pieces.pop().removePiece(); // Loại bỏ mảnh ghép cuối để tạo ra chỗ trống
        console.log(pieces);
        initialPositions = pieces;

        console.log(initialPositions);

    }

    function shuffle(array) {
        var m = array.length,
            t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

    return {
        init: initPuzzle
    }
};

