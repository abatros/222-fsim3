var _Template = Template.compass

var svg;
const x1 = 270;
const y1 = 260;

const cosine1 = new Meteor.dda.cosine(250);
const cosine2 = new Meteor.dda.cosine(100);
const cosine3 = new Meteor.dda.cosine(250);

var ia = 0;

var angle = 0;
const dda1 = new Meteor.dda.DDA(0,200);

/*
Tracker.autorun(function(){
  dda1.x = 200-Session.get('throttle-position');
});
*/

Tracker.autorun(function(){
  dda1.x = Session.get('roll')*200;
});


var dda_pulse = function(dz) { // da controlled by dda
//    cosine1.pulse(1);
dda1.pulse(1);
if (dda1.dy) {
    dda1.log('dda1');
    angle += dda1.dy * 0.05;
    Session.set('angle', angle);
}
}

Session.set('roll',0);
//Session.set('aoa-elevator',0);
Session.set('jthrottle',0);


Session.set('angle',0);
_Template.helpers({
  angle : function(){
    return Session.get('angle');
  }
});


function draw1() {}

// -----------------------------------------------------------------------

function complete_example(){
  var haveEvents = 'ongamepadconnected' in window;
var controllers = {};

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;

  var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);

  var t = document.createElement("h1");
  t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  d.appendChild(t);

  var b = document.createElement("div");
  b.className = "buttons";
  for (var i = 0; i < gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }

  d.appendChild(b);

  var a = document.createElement("div");
  a.className = "axes";

  for (var i = 0; i < gamepad.axes.length; i++) {
    var p = document.createElement("progress");
    p.className = "axis";
    //p.id = "a" + i;
    p.setAttribute("max", "2");
    p.setAttribute("value", "1");
    p.innerHTML = i;
    a.appendChild(p);
  }

  d.appendChild(a);

  // See https://github.com/luser/gamepadtest/blob/master/index.html
  var start = document.getElementById("start");
  if (start) {
    start.style.display = "none";
  }

  document.body.appendChild(d);
  requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}



function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }
}


window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
  setInterval(scangamepads, 500);
}
}


// -----------------------------------------------------------------------


_Template.onRendered(function(){
  const element = this.find('svg.base');
  svg = Snap(element);
  if (!svg) {
    throw new Meteor.error('Unable to locate svg');
  }


  if(!!navigator.getGamepads){
      console.log('Browser supports the Gamepad API');
  }
  else {
      console.log('Browser does NOT supports the Gamepad API');
  }

  var gamepads = navigator.getGamepads();
  console.log('gamepads:', gamepads);
  var gamepad = navigator.getGamepads()[0];
  console.log('gamepad:', gamepad);

complete_example(); // brutal.

  const cp = this.find('svg.rose');
  console.log('rect.rose cp:',cp)
//  var svg2 = Snap(cp);

  const g = this.find('svg.rose g');
  const root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//  var da = Math250*3.1416*2/(36*2);

  const na = Math.round(250*3.1416*2);
  const da = Math.round(250);
  var ia = 0;
  const dda1 = new Meteor.dda.DDA(12,262); // increase 129 to make longer spaces.
  dda1.y=dda1.k;
  for (let i=0; i< na-10; i++) {
      dda1.pulse(1);
      cosine1.pulse(1);
      if (dda1.dy > 0) { // this position is relevant
        if (ia%2 == 0) {
//          var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
          var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
          line.setAttribute("x1", x1+cosine1.sin.x);
          line.setAttribute("y1", y1-cosine1.cos.x);
          line.setAttribute("x2", x1+cosine1.sin.x*0.90);
          line.setAttribute("y2", y1-cosine1.cos.x*0.90);
          line.setAttribute("stroke", 'lightgreen');
          line.setAttribute("stroke-width", '4px');
          g.appendChild(line);
/*
          svg2.line(x1+cosine1.x.x, y1-cosine1.y.x, x1+cosine1.x.x*0.85, y1-cosine1.y.x*0.85).attr({
            stroke: 'lightgreen',
            'stroke-width': '2px'
            //,transform: "rotate(45 50 50)"
          });
*/

    const r = 0.80;

// http://stephen-lowe.blogspot.com/2011/09/setting-text-content-in-svg-element-via.html WOOOOOOOOOOOOWWWWWWWWWWWWW
if(ia%6 == 0) {
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
//        text.setAttribute("x", x1+cosine1.x.x*r);
//        text.setAttribute("y", y1-cosine1.y.x*r);
        text.setAttribute("stroke", 'none');
        text.setAttribute("stroke-width", '0px');
        text.setAttribute("fill", 'lightgreen');
        text.setAttribute('font-size', '26px');
        text.setAttribute('font-family', 'Dosis'); // 400,300,500,600,700,800
        text.setAttribute('font-weight', 600);

        switch(ia/2) {
          case 0:  text.textContent = 'N'; break;
          case 9:  text.textContent = 'E'; break;
          case 18:  text.textContent = 'S'; break;
          case 27:  text.textContent = 'W'; break;
          default:
            text.textContent = (ia/2).toString();
        }
    //    var matrix2 = text.createSVGMatrix();
//        var matrix = root.createSVGMatrix().rotate(10,x1+cosine1.x.x*r,y1-cosine1.y.x*r);
        var matrix = root.createSVGMatrix().translate(x1, y1); //.rotate(10,x1+cosine1.x.x,y1-cosine1.y.x);
//        var matrix = root.createSVGMatrix().rotate(10,0,0);
if (false) {
          matrix.a = cosine1.sin.x/250;
          matrix.b = -cosine1.cos.x/250;
          matrix.c = cosine1.cos.x/250;
          matrix.d = cosine1.sin.x/250;
          matrix.e = x1+cosine1.sin.x*r;
          matrix.f = y1-cosine1.cos.x*r;
}
if (false) {
          matrix.a = cosine1.cos.x/250;
          matrix.b = cosine1.sin.x/250;
          matrix.c = -cosine1.sin.x/250;
          matrix.d = cosine1.cos.x/250;
          matrix.e = x1+cosine1.sin.x*r;
          matrix.f = y1-cosine1.cos.x*r;
}


        var newTransform = root.createSVGTransformFromMatrix(matrix
              .rotateFromVector(cosine1.sin.x/250,cosine1.cos.x/250)
//              .translate(cosine1.y.x*r, cosine1.x.x*r));
              .translate(250*r, -5).rotate(90,0,0));

        //text.transform.baseVal.appendItem(matrix);
        text.transform.baseVal.initialize(newTransform);
//        text.setAttribute("transform", "matrix(1,2,3,4,5,6)");
        // here we need rotation, using matrix.
        g.appendChild(text);
}
        }
        else {
          /*
          svg2.line(x1+cosine1.x.x, y1-cosine1.y.x, x1+cosine1.x.x*0.95, y1-cosine1.y.x*0.95).attr({
            stroke: 'red',
            'stroke-width': '2px'
          });
          */
          var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
          line.setAttribute("x1", x1+cosine1.sin.x);
          line.setAttribute("y1", y1-cosine1.cos.x);
          line.setAttribute("x2", x1+cosine1.sin.x*0.95);
          line.setAttribute("y2", y1-cosine1.cos.x*0.95);
          line.setAttribute("stroke", 'lightgreen');
          line.setAttribute("stroke-width", '2px');
          g.appendChild(line);
        }
      ia += 1;
      }
  }

  var interval = Meteor.setInterval(dda_pulse, 2);

});
