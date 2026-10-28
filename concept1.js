class MusicPoint {
  // static speed = 0;
  constructor(freq) {
    this.t = 0;
    this.speedMult = freq / 440;
    MusicPoint.d = 0.01;
    
    this.osc = new p5.Oscillator("triangle");
    this.osc.amp(0.05);
    this.osc.freq(freq);
    
    this.osc.start();
  }
  
  draw() {
    push();
    
    fill(color(0, 100, 100));
    strokeWeight(15);
    stroke(color(0, 0, 100));
    point(Math.cos(this.t) * 125, Math.sin(this.t) * 125);
    this.t += this.speedMult * MusicPoint.d;
    
    pop();
  }
  
  // static comparePoints(point1, point2) {
  //   if(point1.t > point2.t) { return -1; }
  //   else if(point1.t < point2.t) { return 1; }
  //   else { return 0; }
  // }
}

let verts;

function setup() {
  verts = [];
  createCanvas(1000, 1000);
  colorMode(HSB, 360, 100, 100, 1);
  angleMode(DEGREES);
  background(color(0, 100, 0, 1));
  
  
  // for(let i = 0; i < 4; i++) {
  //   verts.push(new MusicPoint(440));
  // }
  verts.push(new MusicPoint(0));
  verts.push(new MusicPoint(0));
  verts.push(new MusicPoint(0));
  verts.push(new MusicPoint(0));
  
}

function draw() {
  
  /* if !connected { 
    display not connected message
    return;
  }
  */
  background(color(0, 100, 0, 1));
  {
    push();
    
    // verts.sort(MusicPoint.comparePoints);
    console.log(verts);
    
    translate(500, 500);
    fill(color(0, 100, 100, 1));
    strokeWeight(1);
    stroke(color(0, 100, 100, 1));
    beginShape();
  
    
    for(let vert of verts) {
      vertex(Math.cos(vert.t) * 125, Math.sin(vert.t) * 125);
      vert.draw();
    }
    endShape(CLOSE);
    
    pop();
  }
  
}
