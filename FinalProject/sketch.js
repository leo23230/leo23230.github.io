var asteroidImg;
var earthImg;
var laserImg;
var asteroid, earth;
var asteroids;
var bullets;
var spawnExclude = 128;
var centerX;
var centerY;
var population;
var startingPop = 7753000000;
var timerMax = 120;
var timer = timerMax;
var levels = [1,2,3,4,5,6,7,8,9,10];
var totalAsteroids = 0;
var levelCleared = false;
var levelLoaded = false;
var currentLevel = 0;
var timerStarted;
var timePassed;
var explode = false;
var camShake;
var gameOver = false;
var restart = false;
var bulletTimer = 0;
var bulletTimerMax = 20;

var materials = 0;
var score = 0;
var highScore = 0;

var scale = (1,1);
var expansion = (1,1);

var doubleShot;
var rapidFire;
var auto;
var accScale = 1;

var upgrades = [];

var dates;
var y;
var m;
var d;

var neos = null;
var neoCount;
var originalNeoCount;
var neoCountSet = false;
var neoProp = 0;

function preload(){
  asteroidImg = loadImage('assets/asteroid.png');
  earthImg = loadImage('assets/PixelEarth.png');
  laserImg = loadImage('assets/laser.png');
  
  //set dates
  dates = [];
  y = String(year());
  m = + String(month());
  d = + String(day());
  var date = new Date(m+'-'+d+'-'+y);
  var formatted;
  print(date);
  for(var i = 0; i < 7; i++){
    date = new Date(m+'-'+d+'-'+y);
    date.setDate((date.getDate() + i));
    formatted = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
    dates.push(formatted);
  }
  print(dates);
  
  //get data
  fetch('https://api.nasa.gov/neo/rest/v1/feed?start_date='+y+'-'+m+'-'+d+'&api_key=Rjv6qwSAONVqfcBS0fpY6yBZ6OtLT3bvQ1jzKNbD')
    .then(response => response.json())
    .then(data => neos=data);
}

function setup() {
  centerX = windowWidth/2;
  centerY = windowHeight/2;
  
  createCanvas(windowWidth, windowHeight);
  
  doubleShot = new Upgrade("2 Shot", 600, false);
  rapidFire = new Upgrade("Rapid Fire", 300, false);
  auto = new Upgrade("Auto", 2000, false);
  upgrades = [rapidFire, doubleShot, auto];
  
  //create sprites
  earth = createSprite(windowWidth/2, windowHeight/2);
  
  //count total asteroids
  for(i = 0; i < 7; i++){
    totalAsteroids += levels[i]*10;
  }
  
  //resize and add images to sprite
  asteroidImg.resize(32,32);
  earthImg.resize(64,64);
  laserImg.resize(32,16);
  earth.addImage(earthImg);
  
  asteroids = new Group();
  bullets = new Group();
  
  population = startingPop;
  
  //start level 1
  spawnLevel(levels[0]);
  levelLoaded = true;
  
}

function draw() {
  background(0);
  
  //set neo when data is recieved
  if(neos != null && !neoCountSet){
    //originalNeoCount = neos.element_count;
    neoCount = neos.element_count;
    neoProp = neoCount/totalAsteroids;
    print(totalAsteroids);
    print(String(neoCount));
    print(neoProp);
    neoCountSet = true;
  }
  
  //use this for loop to affect all asteroids
  for(i = 0; i < asteroids.length; i++){
    //set asteroid acc
    if(currentLevel > 0 && currentLevel < 4) accScale = currentLevel;
    asteroids[i].attractionPoint(0.0005 * accScale, windowWidth/2, windowHeight/2);
  }
  
  //collisions
  earth.collide(asteroids, collect);
  asteroids.collide(bullets, removeBoth);
  
  //bullet off screen check
  for(i = 0; i < bullets.length; i++){
    if(bullets[i].position.x > windowWidth ||
       bullets[i].position.x < 0 ||
       bullets[i].position.y > windowHeight ||
      bullets[i].position.y < 0){
      bullets[i].remove();
    }
  }
  
  //level loading
  if(levelCleared){
    currentLevel += 1;
    spawnLevel(levels[currentLevel]);
    levelCleared = false;
  }
  
  //Check if game is over
  if(population <= 0) gameOver = true;
  
  //before the game over and restart Text
  drawSprites();
  
  //health and GUI
  textSize(24);
  fill(255);
  text('Population: ' + population, 30, 30);
  textAlign(RIGHT, CENTER);
  text('Score: ' + score, windowWidth - 30, 30);
  textAlign(RIGHT, CENTER);
  text('Materials: ' + materials, windowWidth - 30, 60);
  textAlign(LEFT, CENTER);
  if(neos != null && currentLevel < dates.length)text(dates[currentLevel], 30, 60);
  else text("BONUS!", 30, 60);
  if(neos != null)text('NEO threats this week: '+round(neoCount), 30, 90);
  
  
  //upgrades
  for(i = 0; i < upgrades.length; i++){
    stroke(255);
    strokeWeight(2);
    if(upgrades[i].cost >= materials || upgrades[i].activated) fill(50,50,50,175);
    else fill(100,100,100,175);
    rect(64*i,windowHeight-64, 64, 64);
    
    //text
    strokeWeight(0);
    textSize(12);
    if(upgrades[i].cost >= materials || upgrades[i].activated) fill(150,150,150);
    else fill(255);
    textAlign(CENTER, CENTER);
    text(upgrades[i].name, 64*i + 32, windowHeight-32);
    text("("+upgrades[i].cost+")", 64*i + 32, windowHeight-18);
  }
  
  if(!gameOver && mouseIsPressed && auto.activated && bulletTimer >= bulletTimerMax){
    bulletTimerMax = 5; //cut bullet timer because need it for auto
    if(doubleShot.activated){
      spawnBullet(-15);
      spawnBullet(15);
      }
      else{
        spawnBullet(0);
      }
      bulletTimer = 0;
  }
  
  //Game Over 
  if(gameOver){
    if(score > highScore)highScore = score;
    //draw
    fill(0,0,0,100);
    rect(0, 0, windowWidth, windowHeight);
    
    fill(255);
    textSize(32);
    textAlign(CENTER, BOTTOM);
    text("Game Over", centerX, centerY);
    textSize(24);
    textAlign(CENTER, TOP);
    text("Press Enter to Try Again", centerX, centerY);
    textAlign(CENTER, CENTER);
    text("High Score: " + highScore, centerX, centerY + 80);
        
    for(i = 0; i < asteroids.length; i++){
      asteroids[i].setSpeed(0);
    }
    if(keyIsDown(RETURN)){
      restart = true;
      gameOver = false;
    }
  }
  
  //YOU WON
  if(asteroids.length <= 0 && currentLevel == levels.length){
    //draw
    fill(0,0,0,100);
    rect(0, 0, windowWidth, windowHeight);
    
    fill(255);
    textSize(52);
    textAlign(CENTER, BOTTOM);
    text("YOU WON!", centerX, centerY);
    textSize(24);
    textAlign(CENTER, TOP);
    text("Press Enter to Replay", centerX, centerY + 8);
    
    for(i = 0; i < asteroids.length; i++){
      asteroids[i].setSpeed(0);
    }
    if(keyIsDown(RETURN)){
      restart = true;
      gameOver = false;
    }
  }
  
  //Restart
  if(restart){
    asteroids.removeSprites();
    population = startingPop;
    currentLevel = 0;
    score = 0;
    materials = 0;
    for(i = 0; i < upgrades.length; i++){
      upgrades[i].activated = false;
    }
    neoCountSet = false;
    spawnLevel(levels[currentLevel]);
    levelLoaded = true; 
    // earth.position = (windowWidth/2, windowHeight/2);
    restart = false;
  }
  
  //timers
  if(bulletTimer <= bulletTimerMax) bulletTimer += 1;
}

function mouseClicked(){
  if(!gameOver){
    if((bulletTimer >= bulletTimerMax || rapidFire.activated) && !auto.activated){
      if(doubleShot.activated){
      spawnBullet(-15);
      spawnBullet(15);
      }
      else{
        spawnBullet(0);
      }
      bulletTimer = 0;
    }
    //upgrades
    if(mouseX > 0 && mouseX < 64 && mouseY > windowHeight - 64 &&       mouseY < windowHeight && rapidFire.cost <= materials && !rapidFire.activated){
      materials -= rapidFire.cost;
      rapidFire.activated = true;
    }
    if(mouseX > 64 && mouseX < 128 && mouseY > windowHeight - 64 &&       mouseY < windowHeight && doubleShot.cost <= materials && !doubleShot.activated){
      materials -= doubleShot.cost;
      doubleShot.activated = true;
    }
    if(mouseX > 128 && mouseX < 192 && mouseY > windowHeight - 64 &&       mouseY < windowHeight && auto.cost <= materials && !auto.activated){
      materials -= auto.cost;
      auto.activated = true;
    }
  }
}

function spawnLevel(level){
  var spawnX;
  var spawnY;
  var newAsteroid;
  
  for(i = 0; i < 10*level; i++){
    spawnX = random(16, windowWidth - 16);
    while(spawnX > centerX - spawnExclude && spawnX < centerX + spawnExclude){
      spawnX = random(16, windowWidth - 16);
    }
    spawnY = random(16, windowHeight - 16);
    while(spawnY < centerY - spawnExclude && spawnY > centerY + spawnExclude){
      spawnY = random(16, windowHeight - 16);
    }
    spawnY = random(16, windowHeight - 16);
    newAsteroid = null;
    newAsteroid = createSprite(spawnX, spawnY);
    newAsteroid.addImage(asteroidImg);
    newAsteroid.maxSpeed = 10;
    newAsteroid._rotation = random(0,360);
    var randScale = random(0.5, 1.5);
    newAsteroid.sclae = randScale;
    asteroids.add(newAsteroid);
  }
}

function collect(collector, collected)
{
  collected.remove();
  population -= startingPop/10;
  if(asteroids.length == 0){
    levelCleared = true;
    levelLoaded = false;
  }
  explode = true;
}
//if bullet collides
function removeBoth(collector, collected)
{
  //var randInt;
  var prevNeoCount;
  collected.remove();
  collector.remove();
  //randInt = round(random(1,3));
  prevNeoCount = neoCount;
  if(neoCount > 0) neoCount -= neoProp;
  round(neoCount);
  print(round(neoCount));
  if(round(neoCount) < prevNeoCount){
    score += 2500;
  }
  score += 1000;
  materials += round(random(8,12));
  if(asteroids.length == 0){
    levelCleared = true;
    levelLoaded = false;
  }
  explode = true;
}

function spawnBullet(rotOffset){
  var bullet;
  var v1 = createVector(centerX, centerY);
  var v2 = createVector(mouseX - centerX, mouseY - centerY);
  var direction = degrees(v1.angleBetween(v2));
  //print(direction);
  bullet = createSprite(centerX, centerY);
  bullet.addImage(laserImg);
  bullet._rotation = direction + 25 + rotOffset;
  bullet.setSpeed(5, direction + 25 + rotOffset);
  bullets.add(bullet);
}

function explosion(expX, expY){
  // scale += expansion;
  // ellipse(expX, expY, scale.x, scale.y);
}

function cameraShake(intensity){
  
}

class Upgrade {
  constructor(name, cost, activated) {
    this.name = name;
    this.cost = cost;
    this. activated = activated;
  }
}