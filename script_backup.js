const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

// CORS will prevent us to cross share origin of pictures
const image1 = new Image();
image1.src = '';



const inputSlider = document.getElementById('resolution');
const inputLabel = document.getElementById('resolutionLabel');
inputSlider.addEventListener('change', handleSlider)

class Cell {
    constructor(x, y, symbol, color){
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    draw(ctx){
        /*
        ctx.fillStyle = 'white';
        ctx.fillText(this.symbol, this.x +0.5, this.y +0.5);*/ // this is for smaller pictures
        ctx.fillStyle = this.color;
        ctx.fillText (this.symbol, this.x, this.y)
    }
}
//private variables starts with #, privacy encapsulation on class features will be enforced by JavaScript
class AsciiEffect {
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height); // classes are not hoisted
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height); // getImageData get's data from the image about each pixel
        //console.log(this.#pixels); // I am inside the class so I have to call it with this.
        console.log(this.#pixels.data) // this will show us a single array with all the colour properties, single pixel is made of 4 each
    }
    // アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴ
    /*
    #convertToSymbol(g){
        if(g > 250) return '@';
        else if (g > 240) return '*';
        else if (g > 220) return '+';
        else if (g > 200) return '#';
        else if (g > 180) return '&';
        else if (g > 160) return '%';
        else if (g > 140) return '_';
        else if (g > 120) return ':';
        else if (g > 100) return '$';
        else if (g > 80) return '/';
        else if (g > 60) return '-';
        else if (g > 40) return 'X';
        else if (g > 20) return 'W';
        else return '';
    }
    */
    #convertToSymbol(g){
        if(g > 250) return 'ア';
        else if (g > 240) return 'ァ';
        else if (g > 220) return 'サ';
        else if (g > 200) return 'ハ';
        else if (g > 180) return 'ラ';
        else if (g > 160) return 'ザ';
        else if (g > 140) return 'キ';
        else if (g > 120) return 'ギ';
        else if (g > 100) return 'ス';
        else if (g > 80) return 'ネ';
        else if (g > 60) return 'ミ';
        else if (g > 40) return 'ォ';
        else if (g > 20) return 'ガ';
        else return '';
    }

    // going through the image and mapping the image with a grid, the "grid" goes from X 0 to X.lenght and for each X value it goes in Y
    #scanImage(cellSize) {
        this.#imageCellArray = [];
        for(let y = 0; y < this.#pixels.height; y += cellSize){
            for(let x = 0; x < this.#pixels.width; x += cellSize){
                const posX = x * 4; // each four are one pixel colour
                const posY = y * 4; 
                const pos = (posY * this.#pixels.width) + posX;

                if(this.#pixels.data[pos + 3] > 128) {
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos + 1];
                    const blue = this.#pixels.data[pos + 2];
                    const total = red + green + blue;
                    const averageColorValue = total /3;
                    const color = "rgb(" + red + "," + green + "," + blue + ")";
                    const symbol = this.#convertToSymbol(averageColorValue);
                    if(total > 200) this.#imageCellArray.push(new Cell(x, y, symbol, color));
                }
            }
        }
        console.log(this.#imageCellArray);
    }
    #drawAscii(){
        this.#ctx.clearRect(0 ,0, this.#width, this.#height);
        for(let i = 0; i < this.#imageCellArray.length; i++){
            this.#imageCellArray[i].draw(this.#ctx);
        }
    }
    draw (cellSize){
        this.#scanImage(cellSize);
        this.#drawAscii();
    }
}
let effect;

function handleSlider(){
    if(inputSlider.value == 1){
        inputLabel.innerHTML = 'Original image';
        ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    } else{
        inputLabel.innerHTML = 'Resolution: ' + inputSlider.value + ' px';
        ctx.font = parseInt(inputSlider.value) + 'px Verdana';
        effect.draw(parseInt(inputSlider.value)); // take string and if possible convert value to int
    }
}

// basical boiler plate code to manipulate image data
image1.onload = function initialize(){
    canvas.width = image1.width;
    canvas.height = image1.height;
    effect = new AsciiEffect(ctx, image1.width, image1.height);
    handleSlider();
    //console.log(effect)
}