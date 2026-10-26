class Point {
  Point.points = [];
  constructor() {
    this.x = 500;
    this.y = 500;
    this.waves = [];
  }
  draw() {
    point(this.x, this.y);
    this.y += 10;
  }
}

function setup() {
  createCanvas(1000, 1000);
  colorMode(HSB, 360, 100, 100, 1);
  background(color(1, 100, 0, 1));
}

function draw() {
  background(color(0, 50, 50, 1));
}