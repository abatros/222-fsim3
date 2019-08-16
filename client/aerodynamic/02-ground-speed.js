/*
    Acceleration and ground-speed

    Interface:

*/


Meteor.gs = {
// ------------------------------------------------------------------------------

gs1: function() {
  this.dda2 = new Meteor.dda.DDA(0,1000); // Thrust

  this.dda4 = new Meteor.dda.DDA(50,100); // dda4.x := Cd = fct(aoa) here 50% of stall angle.
  this.dda5 = new Meteor.dda.DDA(0,1000); // Drag k.v2

  this.dda3 = new Meteor.dda.DDA2(0,4000); // Speed
    // dda3.x == v (speed)
    // dda3.dy == v.dv == 0.5 dv2
    // dda5.x == DRAG
    // dda5.x += dda3.dy
    // dda5.dy = -dv

    // RR - resistance au roulement : inverse Drag (Grag + RR) == approx average 10% during TO.
  this.dda6 = new Meteor.dda.DDA(0,1000); // goes to 0 according to relative weight.
  this.dda7 = new Meteor.dda.DDA(0,1000); // like dda3!!!! dv % to v

  this.dda11 = new Meteor.dda.DDA(0,1000); // dda11.x := CL => dda11.dy == d(lift)
  this.dda13 = new Meteor.dda.DDA(0,2000); // dda13.x == Lift  => dda13.dy == r/t Climb.
  this.elevation = 0;

  this.acc_dv = 0;

  this.pulse = function(){ // dt = 1 always
    this.dda2.pulse(1); // thrust      T.dt
    this.dda4.pulse(1); // Cl.dt
    this.dda5.pulse(this.dda4.dy); // Cl.v2.dt == Drag.dt
    this.dda7.pulse(1); // drag-v1     RR.dt

    this.acc_dv += this.dda2.dy; // thrust
    this.acc_dv -= this.dda5.dy; // drag
    this.acc_dv -= this.dda7.dy; // friction

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
    // update V2
    this.dda5.x += this.dda3.dy;
    this.dda7.x += this.dda6.dy;

// compute the Moving Average on Speed.
/**
    this.N1_rpm = Math.round(this.N1_rpm*0.5 + this.dda3.x*0.5*50); // 200 == 10,000 rpm
    // this.N1_rpm [0...10,000] == 2000*5
    this.N1 = Math.round(this.N1_rpm/100);
**/

    this.speed_ratio = Math.round((this.dda3.x/this.dda3.k)*100);

    /*
        Altimeter.
        Rate-of-descent maxi: 3000 ft/min == 1000 m/min == 16.6 m/sec
        Each tick: (10ms) => 0.166 m.
        Each tick (10ms) => 3000/60 == 50ft/sec => 0.5 ft
        => (elevation/0.166) => meters
        => (elevation/0.5) => ft

        Rate of Climb: % to speed (dda3)
          600 ft/min = 10 ft/sec = 3 m/s
          f = m.a =>
          L = 4 * Drag => 200T = 4 * 50T
          Lift % Drag.


        Rate-of-Climb (or descent) = ((Lift-Weight)/Thrust) * logitudinal speed.
    */


    //this.dda11.x = this.dda5.x - 500; // Lift = k.Drag == Acceleration verticale
    this.dda11.pulse(this.dda3.dy); // was updated by Tracker
    this.dda13.x += this.dda11.dy; // dda13.x == Lift

    if (this.elevation <= 0) {
      if (this.dda13.x < 0) {
        this.dda13.x = 0
      }
    }
    this.dda13.pulse(1);

    this.elevation += this.dda13.dy; // 0.5ft maxi
    if (this.elevation < 0)
      this.elevation = 0;
    this.elevation_ft = Math.round(this.elevation/2);
  }; // pulse

  this.log = function(name) {
    console.log('%s T:%d D:%d V:%d', name,
          this.dda2.x, this.dda5.x,
          this.dda3.x
        );
  }; // log
}
};
