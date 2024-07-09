const slices = 36;
const numShapes = 700;


var shape, mask, img, bg;

function preload() {
  img1 = loadImage('img1.jpg'),
  img2 = loadImage('img2.jpg'),
  img3 = loadImage('img3.jpg')
}

function setup() {
  createCanvas(windowWidth, windowHeight-5);
  noStroke();

  shape = calcStuff(width+150, height, slices);
  mask = createMask(shape.a, shape.o);
  bg = new BG();
}

function draw() {
  // your "draw loop" code goes here
  background(255);

  // draw lots of random moving shapes on the canvas
  drawShapes();

  // try removing this line to see what happens
  mirror();
}

function drawShapes() {
  background(0)
  bg.move();
  // bg.update();
}

function mirror() {
  // copy a section of the canvas
  img = get(0, 0, shape.a, shape.o);
  // cut it into a triangular shape
  background(0)
  img.mask(mask);
  // image(img, 0,0)

  push();
  // move origin to centre
  translate(width / 2, height/2);
  // turn the whole sketch over time
  rotate(radians(frameCount / 20));

  for (var i = 0; i < slices; i++) {
    if (i % 2 == 0) {
      push();
      scale(1, -1); // mirror
      image(img, 0, 0); // draw slice
      pop();
    } else {
      rotate(radians(360 / slices) * 2); // rotate
      image(img, 0, 0); // draw slice
    }
  }
  pop();
}

function calcStuff(width, height, s) {
  // because pythagorean theorem
  // h = sqrt(a^2 + b^2)
  // a = sqrt(h^2 - b^2)
  // b = sqrt(h^2 - a^2)
  let a = sqrt(sq(width / 2) + sq(height / 2));
  let theta = radians(360 / s);
  let o = tan(theta) * a;
  let h = a / cos(theta);

  return { a: round(a), o: round(o), h: round(h) };
}


function createMask(w, h) {
  // create triangular mask so that the parts of the 
  // kaleidoscope don't draw over one another

  mask = createImage(w, h);
  mask.loadPixels();
  for (i = 0; i < mask.width; i++) {
    for (j = 0; j < mask.height; j++) {
      if (i >= map(j, 0, h, 0, w) - 1) // -1 removes some breaks
        mask.set(i, j, color(255));
    }
  }
  mask.updatePixels();
  return mask;
}

class BG {
  constructor() {
    this.images = [img1, img2, img3]
    this.bg = random(this.images)
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.easing = .04;
    // image(bg, 0, 0);
    this.reset()
  }
  move() {
    let nx = this.dx - this.x;
    let ny = this.dy - this.y;

    this.x += nx * this.easing;
    this.y += ny * this.easing * .5;

    if (abs(this.dx - this.x) < 5 ) {
      this.resetX();
    }
    if (abs(this.dy - this.y) < 5 ) {
      this.resetY();
    }

    image(this.bg, this.x, this.y);

    if(frameCount % 1000 == 0){
      this.resetImage();
    }

  }
  resetX(){
    let w = shape.a - this.bg.width;
    this.dx = random(w, 0);
  }
  resetY(){
    let h = shape.o - this.bg.height;
    this.dy = random(h, 0);
  }
  resetImage(){
    this.bg = random(this.images);
    this.resetX();
    this.resetY();
    this.x = 0;
    this.y = 0;
  }
  reset(){
    this.bg = random(this.images)
    let w = shape.a - this.bg.width;
    let h = shape.o - this.bg.height;
    this.dx = random(w, 0)
    this.dy = random(h, 0);
    this.x = 0;
    this.y = 0;

  }
}