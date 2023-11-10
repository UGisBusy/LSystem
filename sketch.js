
var CANVA_HEIGHT = 800;
var CANVA_WIDTH = 800;

class LSystem {
  constructor(axiom = "F", p = "FF+[+F-F-F]-[-F+F+F]", angle = PI / 6, len = CANVA_HEIGHT / 4, originX = CANVA_WIDTH / 2, originY = CANVA_HEIGHT) {
    this.axiom = axiom;
    this.sentences = [axiom];
    this.p = p;
    this.angle = angle;
    this.len = len;
    this.originX = originX;
    this.originY = originY;
  }

  generateSentence(iteration = 0) {
    if (iteration > this.sentences.length) {
      this.generateSentence(iteration - 1);
    }
    if (iteration == this.sentences.length) {
      this.sentences.push("");
      for (let i = 0; i < this.sentences[iteration - 1].length; i++) {
        let cur = this.sentences[iteration - 1].charAt(i);
        if (cur == "F") {
          this.sentences[iteration] += this.p;
        } else {
          this.sentences[iteration] += cur;
        }
      }
    }
  }

  draw(iteration = 0) {
    this.generateSentence(iteration);
    // console.log(this.sentences[iteration]);
    let len = this.len >> iteration;
    resetMatrix();
    background(50);
    translate(this.originX, this.originY);
    stroke(255, 100);
    for (let i = 0; i < this.sentences[iteration].length; i++) {
      let cur = this.sentences[iteration].charAt(i);
      if (cur == "F") {
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

  reset({ axiom, p, angle }) {
    this.axiom = axiom;
    this.sentences = [axiom];
    this.p = p;
    this.angle = angle;
    this.draw();
  }
}

function setup() {
  createCanvas(CANVA_HEIGHT, CANVA_WIDTH);

  let ls = new LSystem();

  let rules = [
    { name: "Tree1", axiom: "F", p: "FF+[+F-F-F]-[-F+F+F]", angle: PI / 6 },
    { name: "Tree2", axiom: "F", p: "F[+F]F[-F]F", angle: PI / 7 },
    { name: "Tree3", axiom: "F+F+F+F", p: "F+F-F-FF+F+F-F", angle: PI / 2 },
    { name: "Triangle", axiom: "F+F+F", p: "F[+F+F+F]F", angle: 2 * PI / 3 },
    { name: "Hexagon", axiom: "F+F+F+F+F+F", p: "F+F--F+F", angle: PI / 3 },
  ];

  ls.reset(rules[0]);

  let sliderI = createSlider(0, 10, 0, 1);
  let sliderX = createSlider(0, CANVA_WIDTH, CANVA_WIDTH / 2, 1);
  let sliderY = createSlider(0, CANVA_HEIGHT, CANVA_HEIGHT / 2, 1);
  let sliderL = createSlider(0, CANVA_HEIGHT / 2, CANVA_HEIGHT / 8, 1);
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
