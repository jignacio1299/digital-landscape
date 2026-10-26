class Point {
  // static speed = 0;
  constructor(speedMult) {
    this.t = 0;
    this.speedMult = speedMult;
    Point.d = 0.01;
  }
  
  draw() {
    push();
    
    fill(color(0, 100, 100));
    strokeWeight(15);
    stroke(color(0, 0, 100));
    point(Math.cos(this.t) * 100, Math.sin(this.t) * 100);
    this.t += this.speedMult * Point.d;
    
    pop();
  }
  
  static comparePoints(point1, point2) {
    
    if(point1.t > point2.t) { return -1; }
    else if(point1.t < point2.t) { return 1; }
    else { return 0; }
  }
}

let verts;

function setup() {
  verts = [];
  createCanvas(1000, 1000);
  colorMode(HSB, 360, 100, 100, 1);
  angleMode(DEGREES);
  background(color(0, 100, 0, 1));
  
  
  for(let i = 0; i < 4; i++) {
    verts.push(new Point(i + 0.33));
  }
}

function draw() {
  background(color(0, 100, 0, 0.1));
  {
    push();
    
    verts.sort(Point.comparePoints);
    console.log(verts);
    
    translate(500, 500);
    fill(color(0, 100, 100, 1));
    beginShape();
  
    
    for(let vert of verts) {
      vert.draw();
      vertex(Math.cos(vert.t) * 100, Math.sin(vert.t) * 100);
    }
    endShape(CLOSE);
    
    pop();
  }
  
}
