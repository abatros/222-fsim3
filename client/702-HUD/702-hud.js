//import  SVG from 'svg.js';
//const SVG = require('svgjs')
import SVG from 'svgjs'
import * as THREE from 'three';
import {
  Mesh,
  SpotLight,
  Scene, Color, Vector3
} from 'three';

import {cosine} from '../dda.js'
import './702-hud.html';

var TP = Template['702-hud'];

//console.log({Snap})

const heat = new ReactiveVar(0);

function display_grid(container) {
  const {clientWidth:width, clientHeight:height} = container;
  const scene = new Scene();
  scene.background = new Color( 'skyblue' );
  const fov = 150; // AKA Field of View
  const near = 0.00001; // the near clipping plane
  const far = 1000; // the far clipping plane
  const camera = new THREE.PerspectiveCamera( fov, width/height, near, far );

  camera.position.set( 0, 4, 17 );
//  tp.position.set(camera.position)

//  camera.position.set( -4, 4, 10 );
// create a geometry
//  const geometry = new THREE.BoxBufferGeometry( 1, 0.05, 8 );
  const g1 = new THREE.GridHelper(30,60)
// create a default (white) Basic material
//  const material = new THREE.MeshBasicMaterial();
//  const material = new THREE.MeshBasicMaterial( { color: 0x800080 } );
//  const material = new THREE.MeshStandardMaterial( { color: 0x800080 } );

// create a Mesh containing the geometry and material
//  const mesh = new THREE.Mesh( geometry, material );

// add the mesh to the scene
//  scene.add( mesh );
  scene.add(g1)
  const renderer = new THREE.WebGLRenderer( { antialias: true } );


  renderer.setSize( container.clientWidth, container.clientHeight );
//  renderer.setSize(1700, 600 );
  renderer.setPixelRatio( window.devicePixelRatio );

  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );
  renderer.render( scene, camera );
}


function create_svg_and_serialize() {
  const svg3 = document.createElement("svg");
  const draw3 = new SVG(svg3)
  draw3.circle(60,60,50).attr({
    fill: 'none',
    'stroke-width': 2,
    stroke: 'white',
    opacity: 0.73
  });

  var svgData = (new XMLSerializer()).serializeToString(svg3);
  console.log(svgData)
}


TP.onRendered(function() {
  const tp = this;

  const container = tp.find('div.702-hud')
  const renderer2 = display_grid(container);


  // -------------------------------------------------------------------------
  create_svg_and_serialize()
  // -------------------------------------------------------------------------

  const _needle = {
    x:40, y:60, radius:45
  };


  // -------------------------------------------------------------------------




  let last_frame_hit = performance.now();

  function play() {
    renderer.setAnimationLoop( () => {
      const _hit = performance.now();
      //console.log((_hit - last_frame_hit).toFixed(2))
      heat.set((_hit - last_frame_hit).toFixed(2));




      /*
      // Rotate cube.
      cube.rotation.x += 0.01;
      cube.rotation.y -= 0.001;
      cube.rotation.z += 0.0003;

      // Render scene.
      renderer.render(scene, camera);

      // Update HUD graphics.
      if (showing_HUD) {
        renderer.render(sceneHUD, cameraHUD);
      }
      */

      last_frame_hit = _hit;
    })
  }; play();




return;

  const draw = new SVG(div_ep)
  const draw2 = new SVG(div_ep)
  console.log({draw});

  const epr_r = 58;
  const x1 = epr_r + 10; //216;
  const y1 = epr_r + 10; //124; // EPR


  //draw.circle(50).radius(60).fill('#f06')
  //draw.circle(80).move(100,0).fill('#a06')
//  draw.path('M50 0 A20 20 0 1 0 100 50 v25 C50 125 0 85 0 85 z')


  ;

  const needle = (()=>{
    const {x, y, radius:r} = _needle;
//    draw.path(`M ${x} ${y} A ${r} ${r}, 0, 1, 1, ${x+r} ${y+r} L ${x+r} ${y} z`).stroke('#f06').fill('#a06')
//    draw.path(`M ${x} ${y} A ${r} ${r}, 0, 1, 1, ${x+r} ${y+r} L ${x+r} ${y} z`)
    draw.path(`M ${x} ${y} A ${r} ${r}, 0, 1, 1, ${x+r} ${y+r}`)
    .stroke('#f06').attr({
      'stroke-width':2,
      fill:'transparent'
    }).rotate(-45);

    const needle = draw.line(x+r,y,x+r,y-r).attr({
      'stroke-width':2,
      stroke: '#f06'
    })
    return needle;
  })();


  console.log({needle})
  //needle.animate(3).rotate(90)

  async function rotate_needle() {
    return new Promise((resolve,reject) =>{
      setTimeout(()=>{
        resolve()
      }, 10)
    })
  };

  (async ()=>{
    const {x:cx, y:cy, radius:r} = _needle;
    const p1 = new cosine(43);
    for (let j=0; j<43*2*3.14; j++) {
      await rotate_needle()
      const {x,y} = p1.pulse(1);
      //console.log(`x:${x} y:${y}`)
      needle.plot(cx+r,cy, cx+r+y, cy+x)
      //if (y<=0) break;
    }

  })();



return;

  draw.circle(x1,y1,epr_r).attr({
    fill: 'none',
    'stroke-width': 2,
    stroke: 'white',
    opacity: 0.73
  });
return;


return;


  const t_name = tp.data.name;
  var element = this.find("svg");
  console.log('>> onRendered svg element (%s) element:', t_name, element);
  $(element).addClass(t_name); // argument {{> epr_panel name="left"}}
  const svg = Snap(element); // WOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWWWWWWWWWWW
  console.log('onRendered svg (%s):', t_name, svg);
  //  var x = svg.line(10,10,50,50);
  //  svg.rect(100,100,100,100).attr({background-color:'red', color:'yellow'});

  const x2 = 405;

  const y2 = 240; // EGT
  const y3 = 322; // N1

  const att_circle_ = {
  stroke: 'red',
  'stroke-width': '1px',
  fill: 'none'
  };

  const att_circle = {
  stroke: 'white',
  'stroke-width': '2px',
  fill: 'none',
  opacity: 0.75
  };




  // EPR left
  // test circle

  svg.circle(x1,y1,epr_r).attr({
    fill: 'none',
    'stroke-width': 2,
    stroke: 'white',
    opacity: 0.73
  });
return;

  const dw = 33; //28;
  const dz = epr_r;


  const _path = `
  M${x1},${y1}
  m${-dz},${0}
  c${0},${-(dw)}
  ${dz-dw},${-dz}
  ${dz},${-dz}
  c${dw},${0}
  ${dz},${dz-dw}
  ${dz},${dz}

  c${0},${dw}
  ${-dz+dw},${dz}
  ${-dz},${dz}

  c${-dw},${0}
  ${-dz},${-dz+dw}
  ${-dz},${-dz}
  `.replace(/[\n\s]+/g,' ');

  svg.path(_path).attr({
    fill: 'none',
    'stroke-width': 2,
    stroke: 'white',
    opacity: 0.85,
    'stroke-linecap':'circle',
    'stroke-antialiasing':true
  });



});


FlowRouter.route('/702', {
  name: '702-hud',
  action: function(){
      BlazeLayout.render('702-hud');
  }
});
