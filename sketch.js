let c, g, y, r, gr;
let timerSet = 5;
let timer = timerSet;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gr = color(200);
  g = color(0, 255, 0);
  y = color(255, 204, 0);
  r = color(255, 0, 0);
  c = gr;
}



function draw() {
  background(c);
  if(c == gr) beginningText();
  
  if(c == y){
    //time
    print(round(millis()/1000) % 1)
      timer = timerSet - millis()/1000
    
    //if timer is < 60 secs, count down
    if(timer <= 60){
      textSize(64);
      textAlign(CENTER, CENTER);
      text(round(timer), width/2, height/2);
    }
  }
  
  //time is up
  if (round(timer) == 0) {
    c = r;
    textSize(64);
    textAlign(CENTER, CENTER);
    text("0", width/2, height*0.5);
    text("TIME IS UP!", width/2, height*0.5 + 64);
    textSize(24);
    text("Click to play again", width/2, height*0.5 + 116);
  }
  
}

function mouseClicked() {
  if(c == gr){
    c = g;
  }
  else if (c == g){
    c = y;
  }
  else if(c == r){
    c = gr;
    timer = timerSet;
  }
  
}

function beginningText(){
  textSize(32*2);
  textAlign(CENTER, CENTER);
  fill(255);
  text('Welcome to Imagine', windowWidth/2, windowHeight/2);
  textSize(16*2);
  text('Rules:', windowWidth/2, windowHeight/2 + 32*2);
  text('1) Pick a card', windowWidth/2, windowHeight/2 + 52*2);
  text('2) Click or tap the screen. This will let others know you want to collaborate.', windowWidth/2, windowHeight/2 + 72*2);
  text('3) Click again to start timer, you will have 15 minutes to come up with an idea.', windowWidth/2, windowHeight/2 + 92*2);
  text('Good Luck!', windowWidth/2, windowHeight/2 + 112*2);
  
}
