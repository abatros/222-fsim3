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
import './epr-panel.html';

var TP = Template['701-epr-panel'];

//console.log({Snap})

TP.onRendered(function() {
  const tp = this;
  const div_ep = tp.find('div.epr-panel')
  const {clientWidth:width, clientHeight:height} = div_ep;
  console.log({div_ep})
  console.log(`wd:${width} ht:${height}`);


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
  const _needle = {
    x:40, y:60, radius:45
  };

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


  // *****************************************************

  const container = tp.find('#scene-container' );



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


FlowRouter.route('/701', {
  name: '701-epr-panel',
  action: function(){
      BlazeLayout.render('701-epr-panel');
  }
});
