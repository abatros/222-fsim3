// http://goose.ninja/tutorials/pixi-js/keyboard-events/

var _Template = Template.three

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


_Template.onRendered(function(){


  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  this.find('.three').appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 5;


  var material = new THREE.MeshBasicMaterial({
  	color: 0x0000ff
  });

  var radius = 2;
  var segments = 36*2;

  var circleGeometry = new THREE.CircleGeometry( radius, segments );
  var circle = new THREE.Mesh( circleGeometry, material );
  scene.add( circle );

  				renderer.render(scene, camera);
//  var interval = Meteor.setInterval(dda_pulse, 20);
});
