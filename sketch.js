var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game;
var playerCount,gameState;
var cars = []
var car1, car2, carImg1, carImg2
var allPlayers
var pista 
var fuels
var powerCoins
var fuelImg
var powerCoinImg
var obstacles
var obstacle1Image
var obstacle2Image
var lifeImage
var blastImage



function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  carImg1 = loadImage("./assets/car1.png")
  carImg2 = loadImage("./assets/car2.png")
  pista = loadImage("./assets/track.jpg")
  fuelImg = loadImage("./assets/fuel.png")
  powerCoinImg = loadImage("./assets/goldCoin.png")
  obstacle1Image = loadImage("./assets/obstacle1.png")
  obstacle2Image = loadImage("./assets/obstacle2.png")
  lifeImage = loadImage("./assets/life.png")
  blastImage = loadImage("./assets/blast.png")
  
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  
  game = new Game();
  game.getState();
  game.start();
  
}

function draw() {
  background(backgroundImage);
  if (playerCount == 2) {
    game.updateState(1)

  }
  if (gameState == 1) {
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
