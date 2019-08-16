// http://goose.ninja/tutorials/pixi-js/keyboard-events/

var _Template = Template.pixi

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
draw2(this.find('.pixi'));
//  var interval = Meteor.setInterval(dda_pulse, 20);

});


function draw2(root) {
  const wd = 540, ht = 520;

  const renderer =
  PIXI.autoDetectRenderer
//    new PIXI.WebGLRenderer
  (wd, ht,
    {
      backgroundColor: 0x202020, antialias: true,
      transparent:false, resolution: 1
    });


    root.appendChild(renderer.view);
    var stage = new PIXI.Container();
    var graphics = new PIXI.Graphics();
//    graphics.beginFill('lightgreen');

    graphics.lineStyle(2, 0xFF00FF);  //(thickness, color)
    graphics.drawCircle(wd/2, ht/2, 200);   //(x,y,radius)
    graphics.endFill();
    stage.addChild(graphics);

    stage.addChild(graphics);
    renderer.render(stage);

};



function draw1(root) {
  var renderer = PIXI.autoDetectRenderer(540, 520,
    {
      backgroundColor: 0x000000, antialias: true,
      transparent:true, resolution: 1
    });
  console.log('renderer:', renderer);

//  document.body.appendChild(renderer.view);
  root.appendChild(renderer.view);
  // Create the main stage for your display objects
  var stage = new PIXI.Container();
  // Initialize the pixi Graphics class
  var graphics = new PIXI.Graphics();

  // Set the fill color
  graphics.beginFill(0xe74c3c); // Red

  // Draw a circle
  graphics.drawCircle(60, 185, 40); // drawCircle(x, y, radius)

  // Applies fill to lines and shapes since the last call to beginFill.
  graphics.endFill();


  // Set a new fill color
  graphics.beginFill(0x3498db); // Blue

  // Draw an ellipse
  graphics.drawEllipse(170, 185, 45, 25); // drawEllipse(x, y, width, height)
  graphics.endFill();

  graphics.beginFill(0x9b59b6); // Purple

  // Draw a rectangle
  graphics.drawRect(240, 150, 75, 75); // drawRect(x, y, width, height)
  graphics.endFill();

  graphics.beginFill(0x2c3e50); // Dark blue-gray 'ish

  // Draw a rectangle with rounded corners
  graphics.drawRoundedRect(350, 160, 75, 50, 10); // drawRoundedRect(x, y, width, height, radius)
  graphics.endFill();


  graphics.beginFill(0xf1c40f); // Yellow

  // Draw a polygon to look like a star
  graphics.drawPolygon([550, 100, // Starting x, y coordinates for the star
                        570, 150, // Star is drawn in a clockwork motion
                        630, 155,
                        585, 195,
                        600, 250,
                        550, 220,
                        500, 250,
                        515, 195,
                        470, 155,
                        530, 150
                      ]);

  graphics.endFill();

  // Add the graphics to the stage
  stage.addChild(graphics);


  // Create player one Text
   var playerOneText = new PIXI.Text('Player 1: 0');

   // Position the text
   playerOneText.x = 20;
   playerOneText.y = 15;

   // Add Player one Text to the stage
   stage.addChild(playerOneText);

   /**
    * Creating Some More Advanced Text
    */

   // Options for our &amp;amp;quot;advanced&amp;amp;quot; text
   var textOptions = {
       font: 'bold 64px Roboto', // Set style, size and font
       fill: '#3498db', // Set fill color to blue
       align: 'center', // Center align the text, since it's multiline
       stroke: '#34495e', // Set stroke color to a dark blue-gray color
       strokeThickness: 20, // Set stroke thickness to 20
       lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
   }

   // Create middleText with the textOptions. Use \n to make the line break
   var middleText = new PIXI.Text('Start Playing\nThe Game', textOptions);

   // Set anchor to the center of the text
   middleText.anchor.x = 0.5;
   middleText.anchor.y = 0.5;

   // Place text in the center of our stage
   middleText.x = renderer.width / 2;
   middleText.y = renderer.height / 2;

   // Add middleText to the stage
   stage.addChild(middleText);

  renderer.render(stage);

/*
  // Start animating
    animate();
    function animate() {
        //Render the stage
        renderer.render(stage);
        requestAnimationFrame(animate);
    }
*/


}
