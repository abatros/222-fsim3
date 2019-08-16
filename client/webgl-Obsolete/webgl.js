var _Template = Template.webgl

var svg;
const x1 = 270;
const y1 = 260;

const cosine1 = new Meteor.dda.cosine(250);
const cosine2 = new Meteor.dda.cosine(100);
const cosine3 = new Meteor.dda.cosine(250);

var ia = 0;

var angle = 0;
var dda_pulse = function(dz) {
//    cosine1.pulse(1);
angle +=0.1;
Session.set('angle', angle);
}


Session.set('angle',0);
_Template.helpers({
  angle : function(){
    return Session.get('angle');
  }
});


var gl;

_Template.onRendered(function(){

//  var canvas = document.getElementById("glcanvas");
  // Get A WebGL context

  try {
  		var gl = document.getElementById("glcanvas")
  			.getContext("experimental-webgl");
  		if (!gl) { throw "x"; }
  	} catch (err) {
  		throw "Your web browser does not support WebGL!";
  	}
  	gl.clearColor(0.8, 0.8, 0.8, 0.5);
  	gl.clear(gl.COLOR_BUFFER_BIT);


  var interval = Meteor.setInterval(dda_pulse, 20);

});
