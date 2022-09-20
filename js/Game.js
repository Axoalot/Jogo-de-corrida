class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
    this.leadeboardTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playerMove = false
    this.leftKeyActive = false
    this.blast = false
  }
  
  getState(){
    database.ref("gameState").on("value",(data) =>{
      gameState = data.val()
    })

  }

  updateState(state){
    database.ref("/").update({
      gameState:state
    })

  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount()
    car1 = createSprite(width/2 -50, height -100);
    car1.addImage("carImg1", carImg1);
    car1.addImage("blast",blastImage)
    car1.scale = 0.07;
    car2 = createSprite(width/2 +100, height -100);
    car2.addImage("carImg2", carImg2);
    car2.addImage("blast",blastImage)
    car2.scale = 0.07;
    cars = [car1, car2];
    fuels = new Group();
    powerCoins = new Group();
    this.addSprites(powerCoins,18,powerCoinImg,0.09)
    this.addSprites(fuels,4,fuelImg,0.02)
    obstacles = new Group();
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions)
  }

  addSprites(spriteGroup,numberOfSprites,spriteImage,spriteScale,positions = []){;
    for (let i = 0; i < numberOfSprites; i++) {;
     var x, y ;
     if (positions.length > 0 ) {
      x = positions [i].x
      y = positions [i].y
      spriteImage = positions [i].image
     } else {
      x = random(width/2 + 150,width/2 -150);
      y= random(-height*4.5,height - 400);
     }
    
      var sprite = createSprite(x,y);
      sprite.addImage("sprite",spriteImage);
      sprite.scale = spriteScale;
      spriteGroup.add(sprite);
    }
  }

  handleElement(){
    form.hide()
    form.titleImg.position(40, 50)
    form.titleImg.class("gameTitleAfterEffect")
    
    this.resetTitle.html("Reset")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+230, 40)

    this.resetButton.class("resetButton")
    this.resetButton.position(width/2+230, 100)

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }
  play(){
    this.handleElement()
    this.handleResetButton()
    Player.getPlayerInfo()
    player.getCarsAtEnd()
    
    if (allPlayers !== undefined) {
      image(pista,0, -height *5, width , height*6)
      this.showLeaderboard()
      this.showLife()
      this.showFuelBar()
      var index = 0
      for (const plr in allPlayers) {
        index++
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY
        cars[index-1].position.x = x
        cars[index-1].position.y = y
        var currentLife = allPlayers [plr].life
        if (currentLife <= 0 ) {
          cars [index -1].changeImage("blast")
          cars[index -1].scale = 0.3
        }
        if (index == player.index) {
          stroke(10)
          fill("green")
          ellipse(x, y, 60, 60)
          camera.position.y = cars[index-1].position.y
          this.handlePowerCoins(index)
          this.handleFuel(index)
          this.handleObstacleCollision(index)
          this.handleCarACollisionWithCarB(index)
          if (player.life <= 0) {
            this.blast = true
            this.playerMove = false
            
            setTimeout(() => {
              
              gameState = 2
              this.gameOver()
              
            }, 1000);
            
          }
        }
      }
      if (this.playerMove) {
        player.positionY +=5
        player.update()
      }
      this.handlePlayerControl()
      const finishLine = height*6 - 100
      if (player.positionY > finishLine) {
        gameState = 2
        player.rank += 1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }
      
      drawSprites()
    }
  }
  handlePlayerControl(){
    if ( ! this.blast) {
      
     if (keyIsDown(UP_ARROW)) {
      player.positionY += 10
      player.update()
      this.playerMove = true
      }
      if (keyIsDown(RIGHT_ARROW)&& player.positionX < width/2+300) {
      player.positionX += 5
      player.update()
      this.leftKeyActive = false
      }
      if (keyIsDown(LEFT_ARROW)&& player.positionX > width/3-50) {
      player.positionX += -5
      player.update()
      this.leftKeyActive = true
      }
  }
  }
  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        gameState:0,
        playerCount:0,
        players: {},
        carsAtEnd:0,
      })
      window.location.reload()
    })
  }
  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  handlePowerCoins(index){
    cars[index-1].overlap(powerCoins,function(collector,collected){
      player.score += 21
      player.update()
      collected.remove()
    })
  }
  handleFuel(index){
    cars[index-1].overlap(fuels,function(collector,collected){
      player.fuel = 185
      collected.remove()
    })
    if (player.fuel > 0 && this.playerMove) {
      player.fuel -= 0.3

    }
    if (player.fuel <= 0) {
      gameState = 2
      this.gameOver()
    }
  }
  showRank() {
    swal({
      //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      title: `Incrível!${"\n"}${player.rank}º lugar`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }
  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
    noStroke();
    pop();
  }

  showFuelBar() {
    push();
    image(fuelImg, width / 2 - 130, height - player.positionY - 250, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 250, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 250, player.fuel, 20);
    noStroke();
    pop();
  }
  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //Reduzindo a vida do jogador
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }
  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }

}
