
var CANVA_HEIGHT = 800;
var CANVA_WIDTH = 800;

class LSystem {
  constructor(axiom = "F", rules = {"F": "FF+[+F-F-F]-[-F+F+F]"} , angle = PI / 6, len = CANVA_HEIGHT / 4, originX = CANVA_WIDTH / 2, originY = CANVA_HEIGHT) {
    this.axiom = axiom;
    this.sentences = [axiom];
    this.angle = angle;
    this.rules = rules;
    this.len = len;
    this.originX = originX;
    this.originY = originY;
    this.isDragon = false;
  }

  generateSentence(iteration = 0) {
    if (iteration > this.sentences.length) {
      this.generateSentence(iteration - 1);
    }
    if (iteration == this.sentences.length) {
      this.sentences.push("");
      let flag = false;
      for (let i = 0; i < this.sentences[iteration - 1].length; i++) {
        flag = false;
        let cur = this.sentences[iteration - 1].charAt(i);
        for (let j in this.rules){
          if (cur == j) {
            this.sentences[iteration] += this.rules[j];
            flag = true;
            break;
          }
        }
        if (!flag) {
          this.sentences[iteration] += cur;
        }
      }
    }
  }

  draw(iteration = 0) {
    this.generateSentence(iteration);
    // console.log(this.sentences[iteration]);
    let len = this.len;
    if(this.isDragon) {
      for (let i=0;i<iteration;i++){
        len /= sqrt(2);
      }
    }else{
      len >>= iteration;
    }
    resetMatrix();
    background(50);
    translate(this.originX, this.originY);
    stroke(255, 100);
    for (let i = 0; i < this.sentences[iteration].length; i++) {
      let cur = this.sentences[iteration].charAt(i);
      if (cur == "F" || cur == "G" ) {
        line(0, 0, 0, -len);
        translate(0, -len);
      }
      else if (cur == "+") {
        rotate(this.angle);
      }
      else if (cur == "-") {
        rotate(-this.angle);
      }
      else if (cur == "[") {
        push();
      }
      else if (cur == "]") {
        pop();
      }
    }
  }

  reset({ axiom, rules, angle, name }) {
    this.axiom = axiom;
    this.sentences = [axiom];
    this.rules = rules;
    this.angle = angle;
    this.isDragon = (name == "Dragon curve");
  }
}

function setup() {
  createCanvas(CANVA_HEIGHT, CANVA_WIDTH);

  let ls = new LSystem();

  let rules = [
    { name: "Tree1", axiom: "F", rules: {"F": "FF+[+F-F-F]-[-F+F+F]"}, angle: PI / 6 },
    { name: "Tree2", axiom: "F", rules : {"F": "F[+F]F[-F]F"}, angle: PI / 7 },
    { name: "Tree3", axiom: "F+F+F+F", rules : {"F": "F+F-F-FF+F+F-F"}, angle: PI / 2 },
    { name: "Hexagon", axiom: "F+F+F+F+F+F", rules : {"F": "F+F--F+F"}, angle: PI / 3 },
    { name: "Koch curve", axiom: "F", rules : {"F": "F+F-F-F+F"}, angle: PI / 2 },
    { name: "Sierpinski triangle", axiom: "F-G-G", rules : {"F": "F-G+F+G-F", "G": "GG"}, angle: 2 * PI / 3 },
    { name: "Approximate Sierpinski triangle", axiom: "F", rules : {"F": "G-F-G", "G":"F+G+F"}, angle: PI / 3 },
    { name: "Dragon curve", axiom: "F", rules : {"F": "F+G", "G": "F-G"}, angle: PI / 2 },
  ];

  ls.reset(rules[0]);
  ls.draw();

  let sliderI = createSlider(0, 15, 0, 1);
  let sliderX = createSlider(0, CANVA_WIDTH, CANVA_WIDTH / 2, 1);
  let sliderY = createSlider(0, CANVA_HEIGHT, CANVA_HEIGHT / 2, 1);
  let sliderL = createSlider(0, CANVA_HEIGHT / 4, CANVA_HEIGHT / 8, 1);
  sliderI.input(() => { ls.draw(sliderI.value()); });
  sliderX.input(() => { ls.originX = sliderX.value(); ls.draw(sliderI.value()); });
  sliderY.input(() => { ls.originY = sliderY.value(); ls.draw(sliderI.value()); });
  sliderL.input(() => { ls.len = sliderL.value(); ls.draw(sliderI.value()); });

  let select = createSelect();
  for (let i = 0; i < rules.length; i++) {
    select.option(rules[i].name, i);
  }
  select.changed(() => { ls.reset(rules[select.value()]); });
}
