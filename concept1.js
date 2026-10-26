class Point {
  // static speed = 0;
  constructor(speedMult) {
    this.x = Math.cos(0);
    this.y = Math.sin(0);
    
    this.t = 0;
    this.speedMult = speedMult;
    Point.d = 0.05;
  }
  
  draw() {
    point(this.x, this.y);
  }
}

let verts = [];

function setup() {
  createCanvas(1000, 1000);
  colorMode(HSB, 360, 100, 100, 1);
  angleMode(DEGREES);
  
  translate(width, height);
  
  for(let i = 0; i < 4; i++) {
    verts.push(new Point(i + 1));
  }
}

function draw() {
  for(let vert of verts) {
    point(vert.x, vert.y);
  }
}
