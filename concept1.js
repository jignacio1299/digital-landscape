// Jarrette Ignacio's Digital Landscape: The Sonic Washing Machine

// ----------------------------------------- References -----------------------------------------
// (1) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
// (2) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor
// (3) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// (4) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
// (5) https://www.geeksforgeeks.org/javascript/how-to-work-with-structs-in-javascript/
// (6) https://producelikeapro.com/blog/wp-content/uploads/2022/01/Understanding-Note-Frequency-Charts-And-Why-You-Should-Be-Using-One_2.jpg
// (7) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
// (8) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
// (9) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
// (10) https://iter.ca/post/hue-avg/#calculating-the-circular-average




class Chord {
  constructor(notes) {
    this.notes = [];
    this.active = true;
    
    for(let note of notes) {
      this.notes.push(new MusicNote(note));
    }
    
    this.fillHue = this.averageHues();
    this.fillAlpha = 0.3;
    this.strokeAlpha = 1;
  }
  
  draw() {
    if(this.fillAlpha < 0.01) { return; }
    push();
    
    if(this.active) {
      this.fillAlpha = 0.3;
      this.strokeAlpha = 1;
    }
    else {
      this.fillAlpha = 0.1;
      this.strokeAlpha = 0.1;
    }
    translate(500, 500);
    fill(color(this.fillHue, 100, 100, this.fillAlpha));
    strokeWeight(2);
    stroke(color(this.fillHue, 100, 100, this.strokeAlpha));
    
    beginShape();
    
    this.notes.sort(MusicNote.comparePoints);
    
    
    for(let note of this.notes) {
      vertex(Math.cos(note.t) * 125, Math.sin(note.t) * 125);
      note.draw();
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Computes the average hue of the points composing the chord
  // Uses a radial average because the hue in HSB is circular
  // Reference (10) is a helpful website demonstrating how to do this
  averageHues() {
    if(this.notes.length === 0) { return 0; }
    
    let avgX = 0;
    let avgY = 0;
    let hueResult = 0;
    
    for(let note of this.notes) {
      avgX += Math.cos(note.offset);
      avgY += Math.sin(note.offset);
    }
    
    avgX /= this.notes.length;
    avgY /= this.notes.length;
    
    // console.log(this.notes, avgX, avgY, Math.atan2(avgY, avgX));
    hueResult = Math.atan2(avgY, avgX);
    
    if(hueResult < 0) {
      hueResult += TWO_PI;
    }
    
    return hueResult;
  }
  
  mute() {
    this.active = false;
    // this.strokeAlpha *= 0.7;
    // this.fillAlpha *= 0.9;
    for(let note of this.notes) {
      note.active = false;
      note.osc.stop();
      note.strokeAlpha *= 0.7
    }
  }
  
  // changeBrightness(mult) {
  //   this.fillAlpha *= mult;
  // }
  
} // End Chord class

class MusicNote {
  
  constructor(note) {
    this.offset; // Gets set in the noteToFreq function
    this.freq = this.noteToFreq(note);
    // Order of which notes are drawn on the circle of fifths
    this.notesArr = ["A", "E", "B", "F#", "C#", "Ab", "Eb", "Bb", "F", "C", "G", "D"];
    
    this.t = this.offset;
    this.speedMult = this.freq / 150;
    MusicNote.d = 0.01; // Distance travelled per frame, scaled by speedMult
    
    // Play the note
    this.osc = new p5.Oscillator("triangle");
    this.osc.amp(0.05);
    this.osc.freq(this.freq);
    this.osc.start();
    this.pitchBend = 1;
    
    this.active = true;
    this.strokeAlpha = 1;
  }
  
  draw() {
    push();
    this.setPitchBend()
    this.osc.freq(this.freq * this.pitchBend);
    
    strokeWeight(15);
    stroke(color(this.offset, 80, 100, this.strokeAlpha));
    point(Math.cos(this.t) * 125, Math.sin(this.t) * 125);
    this.t += this.speedMult * MusicNote.d;
    
    pop();
  }
  
  setPitchBend() {
    if(!this.active) { return 0; }
    this.pitchBend = map(gamePad.rt - gamePad.lt, -1, 1, 1 / Math.pow(2, 1/12), Math.pow(2, 1/12));
  }
  
  static comparePoints(point1, point2) {
    
    let t1 = point1.t % 360;
    let t2 = point2.t % 360;
    if(t1 > t2) { return -1; }
    else if(t1 < t2) { return 1; }
    else { return 0; }
  }
  
    // Note frequency 2D array. Reference (6) has the chart I copied
  static freqs = [
/*--------- 0 ----- 1 ----- 2 ----- 3 ----- 4 ----- 5 ------ 6 ------ 7 --*/
/* A  */ [27.500, 55.000, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00],
/* A# */ [29.140, 58.270, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
/* B  */ [30.870, 61.740, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07],
/* C  */ [16.350, 32.700, 65.410, 130.81, 261.63, 523.25, 1046.50, 2093.00],
/* C# */ [17.320, 34.650, 69.300, 138.59, 277.18, 554.37, 1108.73, 2217.46],
/* D  */ [18.350, 36.710, 73.420, 146.83, 293.66, 587.33, 1174.66, 2349.32],
/* D# */ [19.450, 38.890, 77.780, 155.56, 311.13, 622.25, 1244.51, 2489.02],
/* E  */ [20.600, 41.200, 82.410, 164.81, 329.63, 659.26, 1318.51, 2637.02],
/* F  */ [21.830, 43.650, 87.310, 174.61, 349.23, 698.46, 1396.91, 2793.83],
/* F# */ [23.120, 46.250, 92.500, 185.00, 369.99, 739.99, 1479.98, 2959.96],
/* G  */ [24.500, 49.000, 98.000, 196.00, 392.00, 783.99, 1567.98, 3135.96],
/* G# */ [25.960, 51.910, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44]];  
  
// Array containing every note and its enharmonics as its own array.
// Its indicies correspond to the freqs array above.
// The first index in each row indicates the twelfth of the circle at which it's located
// This twelfth will position the new note next to its note name on the circle
  static noteNames = [
    [0,  "A", "G##", "Bbb"],
    [7,  "A#", "Bb", "Cbb"],
    [2,  "B", "A##", "Cb"],
    [9,  "C", "B#", "Dbb"],
    [4,  "C#", "B##", "Db"],
    [11, "D", "C##", "Ebb"],
    [6,  "D#", "Eb", "Fbb"],
    [1,  "E", "D##", "Fb"],
    [8,  "F", "E#", "Gbb"],
    [3,  "F#", "E##", "Gb"],
    [10, "G", "F##", "Abb"],
    [5,  "G#", "Ab"]
  ]
  
  // Converts a note string (e.g. "C4", "Bb2", "A#7") into a frequency from the freqs 2D array
  //  bb = double flat
  //  b  = flat
  //  #  = sharp
  //  ## = double sharp
  // Also stores the index this note is contained in from the noteNames array into this.noteInd
  noteToFreq(noteStr) {
    
    let octave = noteStr.charAt(noteStr.length - 1);      // The octave is the last char in the string. Reference (7) for parsing
    let note = noteStr.substring(0, noteStr.length - 1);  // The note is everything before the octave. Reference (8) for parsing
    
    // Traverse the rows in the noteNames array
    for(let noteInd = 0; noteInd < MusicNote.noteNames.length; noteInd++) {
      
      // Then, traverse the entries in each row
      let currNames = MusicNote.noteNames[noteInd];
      for(let noteName of currNames) {
        
        // If any entry in noteNames matches note, then that row's is the row in the freqs table
        if(note === noteName) {
          
          // Navigate to that row in the freqs table with the index found,
          // and return the corresponding octave
          this.offset = MusicNote.noteNames[noteInd][0] * (PI / 6);
          return MusicNote.freqs[noteInd][octave];
        }
      }
    }
  }
  
} // End MusicNote class


class MusicCircle {
  
  
  constructor() {
    this.outerCircleR = 550;
    this.innerCircleR = 400;
    this.middleCircleR = (this.outerCircle + this.innerCircleR) / 2;
    
    // Note order to be drawn on circle starting at 0 degrees
    this.notesArr = ["A", "E", "B", "F#", "C#", "Ab", "Eb", "Bb", "F", "C", "G", "D"]; 
    this.selectedNotes = [];
    this.selectedOctave = 5;
    
    // Ripple effect every time a chord is played. A circle with radius parameterized by t.
    // Each element is a struct with color and t
    this.ripples = []; 
  }
  
  draw() {
    push();
    
    translate(500, 500);
    noFill();
    strokeWeight(5);
    stroke(color(0, 0, 30, 1));
    textSize(40);
    textAlign(CENTER, CENTER);
    
    circle(0, 0, this.innerCircleR);
    circle(0, 0, this.outerCircleR);
    
    for(let i = 0; i < 12; i++) {
      let angle = PI / 6 * i;
      {
        push();
        noStroke();
        fill(color(0, 0, 100, 1));
        text(this.notesArr[i], 475 / 2 * Math.cos(angle), 475 / 2 * Math.sin(angle));
        pop();
      }
      
      // This note of some octave was selected. Highlight the arc
      for(let note of this.selectedNotes) {
        let noteName = note.substring(0, note.length - 1);
        if(this.notesArr[i] === noteName) {
          // console.log(this.notesArr[i]);
          
          push();
          
          noStroke();
          fill(color(angle, 50, 100, 0.3));
          arc(0, 0, this.outerCircleR, this.outerCircleR, angle - PI / 12, angle + PI / 12);
          
          pop();
        }
      }
      
      angle += PI / 12;
      
      line(this.innerCircleR / 2 * Math.cos(angle), this.innerCircleR / 2 * Math.sin(angle), 
           this.outerCircleR / 2 * Math.cos(angle), this.outerCircleR / 2 * Math.sin(angle));
    }
    
    let selectedNotesStr = "";
    {
      push();
      noStroke();
      fill(color(0, 0, 100, 1));
      
      for(let note of this.selectedNotes) {
        selectedNotesStr += note + " ";
      }
      
      text(selectedNotesStr, 0, 350);
      text("Octave: " + this.selectedOctave, 0, 450);
      
      pop();
    }
    push();
      fill("black");
      circle(0, 0, this.innerCircleR);
    pop();
    
    pop();
    
    this.drawRipples();
  }
  
  // Depending on the cursor, selects a note
  selectNote(cursorX, cursorY) {
    // Using Math.atan2() to handle edge cases for the arctan calculation (i.e. infinity or divide by 0)
    // Reference (9)
    let angle = Math.atan2(cursorY, cursorX) + (PI / 12);
    
    if(angle < 0) {
      angle += 2 * PI;
    }
    //https://p5js.org/reference/p5/dist/
    let distFromCenter = dist(0, 0, cursorX, cursorY);
    
    let selectedInd = (int) (angle * 6 / PI);
    
    // console.log(angle, distFromCenter, selectedInd);
    
    if(distFromCenter < 200) { return; }
    
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
    // console.log(this.notesArr[selectedInd] + this.selectedOctave);
    
    let newNote = this.notesArr[selectedInd] + this.selectedOctave;
    
    let noteInd = this.selectedNotes.indexOf(newNote) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    if(this.selectedNotes.indexOf(newNote) !== -1) {
      this.selectedNotes.splice(noteInd, 1); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    }
    else {
      this.selectedNotes.push(newNote);
    }
  }
  
  moveOctave(diff) {
    this.selectedOctave += diff;
    
    if(this.selectedOctave < 0 || this.selectedOctave > 7) {
      this.selectedOctave -= diff;
    }
  }
  
  playChord() {
    for(let chord of chords) {
      chord.mute();
    }
    if(this.selectedNotes.length === 0) { return; }
    
    chords.push(new Chord(this.selectedNotes));
    
    let newChordHue = chords[chords.length - 1].fillHue;
    let newRipple = {
      hue: newChordHue,
      t: this.outerCircleR
    };
    this.ripples.push(newRipple);
  }
  
  clearChords() {
    if(chords.length === 0) { return; }
    chords[chords.length - 1].mute();
    chords = [];
  }
  
  // Removes any notes that are of the selected octave from this.selectedNotes
  clearOctave() {
    // Iterate backwards so the splice doesn't effect the elements that need to be tracked
    for(let i = this.selectedNotes.length - 1; i >= 0; i--) {
      // Convert the last char of the note's name to an int and compare it to the octave
      if(+this.selectedNotes[i].at(-1) == this.selectedOctave) {
        this.selectedNotes.splice(i, 1); // Remove this note from the array if so
      }
    }
  }
  
  clearSelection() {
    this.selectedNotes = [];
  }
  
  // Removes last chord from the chords array and mutes it
  popChord() {
    
    let lastChord = chords.pop();
    
    if(lastChord) {
      lastChord.mute();
    }
  }
  
  drawRipples() {
    push();
    
    translate(500, 500);
    noFill();
    strokeWeight(40);
    for(let ripple of this.ripples) {
      // let strokeAlpha = map(, 1)
      stroke(ripple.hue, 25, 100, 3 / Math.sqrt(ripple.t));
      
      circle(0, 0, ripple.t + strokeWeight());
      ripple.t += 15;
    }
    
    pop();
  }
} // End MusicCircle class

class Gamepad {
  
  constructor() {
    this.deadzone = 0;
    this.isConnected = navigator.getGamepads()[0] != null;
    
    this.cursorVisible = true;
    this.cursorX = 0;
    this.cursorY = 0;
    
    this.lt = 0;
    this.rt = 0;
    
    this.prevButtons = [];
  }
  
  checkConnection() {
    this.isConnected = navigator.getGamepads()[0] != null;
  }
  
  processInputs() {
    let gp = navigator.getGamepads()[0];
    
    
    if(!gp) {
      this.isConnected = false;
      return;
    }
    
    // For left joystick:
    let inputX = gp.axes[0];
    let inputY = gp.axes[1];
    
    // Triggers
    this.lt = gp.buttons[6].value;
    this.rt = gp.buttons[7].value;
    
    // console.log(this.lt, this.rt);
    
    // Apparently, the inputs for joysticks on controllers map to a squircle rather than a circle
    // This code down below is here to try to accommodate that by fixing it at its extremes
    if(inputX === 1) {
      let trueAngle = Math.asin(inputY);
      this.cursorX = Math.cos(trueAngle) * 475 / 2;
      this.cursorY = inputY * 475 / 2;
    }
    else if(inputX === -1) {
      let trueAngle = Math.asin(inputY);
      this.cursorX = -Math.cos(trueAngle) * 475 / 2;
      this.cursorY = inputY * 475 / 2;
    }
    else if(inputY === 1) {
      let trueAngle = Math.acos(inputX);
      this.cursorX = inputX * 475 / 2;
      this.cursorY = Math.sin(trueAngle) * 475 / 2;
    }
    else if(inputY === -1) {
      let trueAngle = Math.acos(inputX);
      this.cursorX = inputX * 475 / 2;
      this.cursorY = -Math.sin(trueAngle) * 475 / 2;
    }
    else {
      this.cursorX = inputX * 475 / 2;
      this.cursorY = inputY * 475 / 2;
    }
    
    
    gp.buttons.forEach((button, index) => {
      let currPressed = button.pressed;
      let prevPressed = this.prevButtons[index] || false;
      
      if(currPressed && !prevPressed) {
        switch(index) {
          case 0: // B
            musicCircle.selectNote(this.cursorX, this.cursorY);
            break;
          case 1:
            musicCircle.popChord();
            break;
          case 2: // Y
            this.cursorVisible = !this.cursorVisible;
            break;
          case 3: // X
            musicCircle.clearOctave();
            break;
          case 4: // LB
            musicCircle.moveOctave(-1);
            break;
          case 5: // RB
            musicCircle.moveOctave(1);
            break;
          case 9:
            musicCircle.clearChords();
            break;
          case 10: // Left joystick press
            musicCircle.playChord();
            break;
          case 11: // Right joystick press
            musicCircle.clearSelection();
            break;
          // case 14:
          //   musicCircle.changeBrightness(0.9);
          //   break;
          // case 15:
          //   musicCircle.changeBrightness(1.1);
          //   break;
        }
      }
      
      this.prevButtons[index] = currPressed;
    })
    
  }
  
  drawCursor() {
    
    let alpha;
    this.cursorVisible ? alpha = 1 : alpha = 0.2
    const cursorSize = 30;
    push();
    
    translate(500, 500);
    fill(color(0, 0, 100, alpha));
    noStroke();
    
    circle(this.cursorX, this.cursorY, 15);
    
    pop();
  }
}

// Global objects \\
let chords;
let musicCircle;
let gamePad;


function setup() {
  chords = [];
  gamePad = new Gamepad();
  musicCircle = new MusicCircle();
  createCanvas(1000, 1000);
  colorMode(HSB, TWO_PI, 100, 100, 1); // Using radians for the hue to simplify trig operations later
  background(color(0, 100, 0, 1));
}

function draw() {
  
  background(color(0, 100, 0, 0.5));
  
  if(!gamePad.isConnected) { 
    gamePad.checkConnection();
    
    push();
    
    translate(500, 500);
    textSize(50);
    textAlign(CENTER, CENTER);
    fill("white");
    
    text("Controller not connected", 0, 0);
    
    pop();
    return;
  }
  
  musicCircle.draw();
  
  for(let chord of chords) {
    chord.draw();
  }
  
  gamePad.processInputs();
  gamePad.drawCursor();
  
  
}
