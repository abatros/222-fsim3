
var altitude = 0;

var svg; // only 1 alti-tape.
var svg_index;
// ------------------------------------------------------------

var h_target = 0;
var h_actual = 0;

const handle = function(){
    const dh = h_target - h_actual;

    if ((dh > 10) || (dh < -10)) {
      console.log('> ALERT alti-tape dh:%d',dh);
    }

    if (dh > 1) h_actual += 1;
    else if (dh < -1) h_actual -=1;
    else return;
    svg.clear();
    draw_tape(h_actual);
    svg_index.clear();
    draw_index(h_actual);
}


Tracker.autorun(function () {
  var h = Meteor.fsim.get('altitude');
//  console.log('> Tracker alti-tape h_target:%d => %d',h,h_actual);
  h_target = h; // to convert in ft.

//    console.log('Autorun is auto-running!');
    // replace svg
/****************
    svg.clear();
    svg.text(10,10, alti.toString()).attr({
      'font-size': '22px',
      'font-family': 'Dosis', // 400,300,500,600,700,800
      'font-weight': 600,
      'letter-spacing': '2px',
      'fill' : 'black',
      'stroke-width': 0.2,
      opacity: 0.75
    });
****************/
  });


Template.alti_tape.onCreated(function(){
});

Template.alti_tape.onRendered(function(){
  const element = this.find('svg.alti-tape');
  svg = Snap(element);
  if (!svg) {
    throw new Meteor.error('Unable to locate svg');
  }
  svg_index = Snap(this.find('svg.alti-index'));
  if (!svg_index) {
    throw new Meteor.error('Unable to locate svg-index');
  }
  draw_tape(h_actual);
  draw_index(h_actual)
  setInterval(handle,10);
});

// ------------------------------------------------------------

Session.set('dkz-FL',0);

Template.alti_tape.helpers({
  fl: function(){
    const fl = Math.round(Session.get('dkz-FL')/100);
    return {
      d9:fl-1, y9:175,
      d0:fl, y0:210,
      d1:fl+1, y1:245
    };
  }
});


// ------------------------------------------------------------------

const r = 1;

const draw_tape = function(h) {

  const dh = h%100;
  var hi = h-dh;
  var yi = 210 + dh*r;
  while (yi > 0) {
    hi += 100;
    yi -= 100*r;
  }

  while (yi <= 420+20) {
    svg.line(0,yi, 10,yi).attr({
      stroke: 'white', 'stroke-width':'1px'
    });
    svg.text(90, yi+8, (Math.round(hi)).toString()).attr({
      'font-size': '18px',
      'font-family': 'Droid Sans Mono', // 400,300,500,600,700,800
      'font-weight': 600,
      'letter-spacing': '1px',
      'fill' : 'white',
      'stroke': '#505050',
      'stroke-width': 1,
      'text-anchor': 'end',
      opacity: 0.75
    });
    yi += 100*r;
    hi -= 100;
  } // while
  svg.line(2,210,75-2,210).attr({stroke:'#AAFFDD', 'stroke-width': '2px', opacity:0.5});
}; // draw_tape

// ----------------------------------------------------------------------------------

var y00 = 0; // this is the position of the 00 in index.
// when y00 == 245 and moving up => attach
// when y00 == 175 and moving down => attach
// when y00 == 210 detach.

const draw_index = function(h){

  const clipG = svg_index.rect(30,185,83,50).attr('fill', '#fff'); //This is IMPORTANT;
  //svg_index.attr({viewBox:"760, 455, 132, 78"});
  const g = svg_index.group().attr({
    'clip-path': clipG
  });


  const r100 = h%100;
  /*
  if (r100 == 0) {
    console.log('>>= hundred passing:%d',h);
    Session.set('dkz-FL',h-r100);
  }
  */

  // ht panel 50 px to set 2.3 digits => never more than 2 marks.
  // 50px ~= 40ft => to_y = 50/40
  const to_y = 50/40;
  const dh = h%20; // 00-20-40-60-80-00
  var hi = h-dh; // is first mark below baseline (index)
  //console.log(' -- mark below hi:%d h:%d',hi,h);
  // there is never more than 3 marks in index.
  // we already have one.
  // hi < h
  hi += 20; // to get first above baseline, we can go until h-30
  //console.log(' -- mark above hi:%d h:%d',hi,h);
  // => hi > h
  // if (hi +20 < h +30) == (hi < h-10)
  if (hi < h + 10) hi += 20;
  //console.log(' -- top mark hi:%d h:%d',hi,h);
  // here hi is the top mark visible.
  // lets compute the yi equivalent
  var yi = 210 - (hi-h)*to_y; // yi<210
  //console.log(' --  top mark hi:%d => yi:',hi,yi);
  const dy = dh*to_y;
  // here we have hi, yi, dy

//  var yi = 25 + dh*to_y; // this is the y00
  const attr = {
    'font-size': '18px',
    'font-family': 'Droid Sans Mono', // 400,300,500,600,700,800
    'font-weight': 600,
    'letter-spacing': '1px',
    'fill' : 'white',
    'stroke': '#505050',
    'stroke-width': 1,
    'text-anchor': 'end',
    opacity: 0.75
  }


/*
  while (yi > 0) {
    hi += 20;
    yi -= 20*to_y;
  }
*/

// we start with altitude max, multiple of 20 ft.
//  const y80 = h%80;
  const y00 = h%100;
  const FL = (h-y00)/100;
  // if FL*100+80 <= h < FL*100+99
  //const show_2x = ((FL*100+80<=h)&&(h<=FL*100+99));

/*
  if (!show_2x) {
    g.add(svg_index.text(70, 210+5, (FL).toString().attr(attr));
  }
*/

//  while (yi <= 50+10) {
var mset = false;
  while(hi > h-30) {
    const s = (1000+hi).toString(); //.substring(1);
    //console.log(' --- string:(%s) at yi:',s,yi);
    const ti = svg_index.text(110, yi+8, s.slice(-2)).attr(attr);
    g.add(ti);

//    console.log(' --- hi:%d hi%100:%d h:%d FL:%d y00:%d',hi,hi%100,h,FL,y00);

    if (hi%100 == 80){
      if ((FL*100+81<=h)&&(h<=FL*100+99)) {
//        console.log(' --- FL:%d',FL);
        const line = svg.line(30, yi, 40, yi).attr({
          stroke: 'lightgreen', 'stroke-width':'3px'
        });
//        g.add(line);
        g.add(svg_index.text(80, yi+8, FL.toString()).attr(attr));
      }
    }
    else if (hi%100 == 0) {
      if ((FL*100+81<=h)&&(h<=FL*100+99)) {
//        console.log(' --- FL:%d',FL+1);
        const line = svg.line(30, yi, 40, yi).attr({
          stroke: 'lightgreen', 'stroke-width':'3px'
        });
//        g.add(line);
        g.add(svg_index.text(80, yi+8, (FL+1).toString()).attr(attr));
        mset = true;
      }
    }

    yi += 20*to_y;
    hi -= 20;
  }
  if (!mset) {
    g.add(svg_index.text(80, 210+8, FL.toString()).attr(attr));
  }

}; // draw-index
