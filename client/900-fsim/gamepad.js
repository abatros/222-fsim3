if(!navigator.getGamepads){
  console.log('ALERT Browser does NOT supports the Gamepad API');
  return;
}

console.log('Your Browser supports the Gamepad API');
var haveEvents = 'ongamepadconnected' in window;
var controllers = {};
console.log(' -- gamepad.js haveEvents:', haveEvents);


function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads()
          : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

  console.log(' -- gamepads: ', gamepads);

  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      }
      else {
        addgamepad(gamepads[i]);
      }
    }
  }
}

scangamepads();

//Session.set('roll-req',0);
//Session.set('pitch-req',0);
//Session.set('trim-req',0);
const gpad = Meteor.fsim.gp = new ReactiveDict();

gpad.set('b1',0);
gpad.set('b2',0);
gpad.set('b3',0);
gpad.set('b4',0);
gpad.set('b5',0);
gpad.set('b6',0);
gpad.set('b7',0);
gpad.set('b8',0);
gpad.set('b9',0);
gpad.set('b10',0);

//gpad.set('aoa-elevator', 0);
gpad.set('roll', 0);
gpad.set('trim', 0);



const reportOnGamepad = function () {
  var gp = navigator.getGamepads()[0];
  for(var i=0;i<gp.buttons.length;i++) {
//    if(gp.buttons[i].pressed)
      gpad.set('b'+(i+1), gp.buttons[i].pressed);
    }

  for(var i=0;i<gp.axes.length; i+=1) {
//          html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
//console.log(' -- axe %d =>',i,gp.axes[i]);
    switch(i) {
      case 0: gpad.set('roll', gp.axes[i]);
//      Session.set('roll-req',  gp.axes[i]);
      break;
      case 1:
//        gpad.set('aoa-elevator', gp.axes[i]);
        Meteor.fsim.set('gp-aoa-elevator', gp.axes[i]);  // +/- 100
//      Session.set('pitch-req',  gp.axes[i]);
      break;
      case 2: gpad.set('trim', gp.axes[i]);
//      Session.set('trim-req',  gp.axes[i]);
      break;
    }
  }
} // reportOnGamepad


const repGP = window.setInterval(reportOnGamepad,100);


Tracker.autorun(function(){
  console.log('>> test game-pad aoa-elevator: ', Meteor.fsim.get('gp-aoa-elevator'));
});


return;

Tracker.autorun(function(){
  const b1 = Meteor.fsim.gp.get('b1');
  console.log('>> test game-pad b1 (gun):', b1);
});

Tracker.autorun(function(){ // trim UP
  const b2 = Meteor.fsim.gp.get('b2');
  console.log('>> test game-pad b2 (trim-up):', b2);
});

Tracker.autorun(function(){ // trim DOWN
  const b3 = Meteor.fsim.gp.get('b3');
  console.log('>> test game-pad b3 (trim-down):', b3);
});

Tracker.autorun(function(){ // bank
  const x = Meteor.fsim.gp.get('bank');
  console.log('>> test game-pad x (bank):', x);
});


Tracker.autorun(function(){ // speed or trim
  const y = Meteor.fsim.gp.get('trim');
  console.log('>> test game-pad z (trim):', y);
});

return;

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) { // + debug data infos
  controllers[gamepad.index] = gamepad;
return;

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


// ---------------------------------------------------------------------


// ---------------------------------------------------------------------

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
  setInterval(scangamepads, 500);
  }



var gamepads = navigator.getGamepads();
console.log('gamepads:', gamepads);

var gamepad = navigator.getGamepads()[0];
console.log('gamepad:', gamepad);
