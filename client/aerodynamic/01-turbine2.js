/*

    Interface:
        Must compute Moving Average for rpm

*/


Meteor.turbine = {
// ------------------------------------------------------------------------------
turbine2: function() {
  this.dda2 = new Meteor.dda.DDA(1000,1000); // Thrust 100% Blue
  this.dda5 = new Meteor.dda.DDA(0,1000); // Drag k.v2

  this.dda3 = new Meteor.dda.DDA2(0,2000); // Speed
    // dda3.x == v (speed)
    // dda3.dy == v.dv == 0.5 dv2
    // dda5.x == DRAG
    // dda5.x += dda3.dy
    // dda5.dy = -dv

    // this is important for turbine - Not for flight */
  this.dda6 = new Meteor.dda.DDA(10,100); // 10% resistance prop to rpm
  this.dda7 = new Meteor.dda.DDA(0,2000); // like dda3!!!! dv % to v

  this.N1_rpm = 0; // [0...10,000]
  this.N1 = 0;     // [0...100]

  this.dv;
  this.sum7 = 0;
  this.ref = {x:10, y:600};
  this.acc_dv = 0;
//  this.mva_speed = 0;

  this.pulse = function(){ // dt = 1 always
    this.dda2.pulse(1); // thrust
    this.dda5.pulse(1); // drag

  // DRAG: kv
    this.dda6.pulse(1);
    this.dda7.pulse(this.dda6.dy);

    this.acc_dv += this.dda2.dy; // thrust
    this.acc_dv -= this.dda5.dy; // drag
    this.acc_dv -= this.dda7.dy; // friction

    // ok, but we need to filter the output to display. => display value should be a moving average.


    if ((this.acc_dv > 2)||(this.acc_dv < -2)) {
      console.log('ALERT acc_dv:', this.acc_dv);
    }
    //  console.log(' -- dv:%d',dv);
    if (this.acc_dv > 0) {
      this.dda3.pulse(1); this.acc_dv -=1; this.dda7.x +=1;
    }
    else if (this.acc_dv < 0) {
      this.dda3.pulse(-1); this.acc_dv +=1;
      if (this.dda7.x > 0) this.dda7.x -=1;
    }
    else {
      this.dda3.pulse(0); // to reset dy
    }

// compute the Moving Average on Speed.
    this.N1_rpm = Math.round(this.N1_rpm*0.3 + this.dda3.x*0.7*5); // 2000 == 10,000 rpm
    // this.N1_rpm [0...10,000] == 2000*5
    this.N1 = Math.round(this.N1_rpm/100);

    this.dda5.x += this.dda3.dy;
    this.sum7 += this.dda7.dy



    if (this.dda7.x != this.dda3.x) {
      console.log('alert dda7.x:%d != dda3.x:%d',this.dda7.x, this.dda3.x);
    }

  }; // pulse

  this.log = function(name) {
    console.log('%s t:%d d:%d v:%d', name,
          this.dda2.x, this.dda5.x,
          this.dda3.x
        );
  }; // log
},
// ------------------------------------------------------------------------------

turbine3: function() {
  this.dda2 = new Meteor.dda.DDA(0,100); // Thrust 100% Blue
  this.dda5 = new Meteor.dda.DDA(0,100); // Drag k.v2

  this.dda3 = new Meteor.dda.DDA2(0,200); // Speed
    // dda3.x == v (speed)
    // dda3.dy == v.dv == 0.5 dv2
    // dda5.x == DRAG
    // dda5.x += dda3.dy
    // dda5.dy = -dv

    // this is important for turbine - Not for flight */
  this.dda6 = new Meteor.dda.DDA(10,100); // 10% resistance prop to rpm
  this.dda7 = new Meteor.dda.DDA(0,100); // like dda3!!!! dv % to v

//  this.dv;
//  this.sum7 = 0;
  this.ref = {x:10, y:600};
  this.acc_dv = 0;
//  this.mva_speed = 0;
  this.N1_rpm = 0;
  this.N1 = 0;
  this.egt_celsius = 0; // normal range [700-1100]
  this.fuel_flow = 0; // normal range [0..9000] kg/h

// to be set by caller.
  this.N1_ = 0;
  this.N1_rpm_ = 0;
  this.egt_celsius_ = 0;
  this.fuel_flow_ = 0;

  this.pulse = function(){ // dt = 1 always
    this.dda2.pulse(1); // thrust
    this.dda5.pulse(1); // drag-v2
    this.dda7.pulse(1); // drag-v1

    this.acc_dv += this.dda2.dy; // thrust
    this.acc_dv -= this.dda5.dy; // drag
    this.acc_dv -= this.dda7.dy; // friction

    // ok, but we need to filter the output to display. => display value should be a moving average.


    if ((this.acc_dv > 2)||(this.acc_dv < -2)) {
      console.log('ALERT acc_dv:', this.acc_dv);
    }

    //  console.log(' -- dv:%d',dv);
    if (this.acc_dv > 0) {
      this.dda3.pulse(1); this.acc_dv -=1; // this.dda7.x +=1;
      this.dda6.pulse(1);
    }
    else if (this.acc_dv < 0) {
      this.dda3.pulse(-1); this.acc_dv +=1;
      this.dda6.pulse(-1);
    }
    else {
      this.dda3.pulse(0); // to reset dy
      this.dda6.pulse(0);
    }
    this.dda5.x += this.dda3.dy;
    this.dda7.x += this.dda6.dy;

// compute the Moving Average on Speed.
    this.N1_rpm = Math.round(this.N1_rpm*0.5 + this.dda3.x*0.5*50); // 200 == 10,000 rpm
    // this.N1_rpm [0...10,000] == 2000*5
    this.N1 = Math.round(this.N1_rpm/100);
    this.egt_celsius = Math.round(this.egt_celsius*0.4 + this.N1_rpm*0.13*0.6);
//    this.egt = Math.round(this.N1_rpm*0.13); // thermal inertie.
//    this.fuel_flow = Math.round(this.fuel_flow*0.3 + this.N1_rpm*0.91*0.2 + this.dda2.x*100*0.5);
//    this.fuel_flow = Math.round(this.fuel_flow*0.5 + this.dda2.x*100*0.5);
    this.fuel_flow = Math.round(this.dda2.x*100*0.94 * this.N1_rpm*0.0001);

  }; // pulse

  this.log = function(name) {
    console.log('%s t:%d d:%d v:%d', name,
          this.dda2.x, this.dda5.x,
          this.dda3.x
        );
  }; // log
}
};
