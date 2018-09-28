$fn=100;


module hub() {
    
    module penOuter() {
        translate([0,0,-2]) {
            rotate([0,0,90]) {
                cylinder(d=23, h=17);
            }
        }
    }
    module penInner() {
        rotate([0,0,90]) {
            translate([0,0,-10]) {
                cylinder(d=8.5, h=50);
            }
        }
    }
    
    module slipRing() {
        translate([0,0,4]) {
            difference() {
                cylinder(d=30, h=17);
                cylinder(d=19, h=17);
            }
        }
    }
    
    module weight() {
        hull() {
            rotate([0,0,90]) {
                cylinder(d=23, h=4);
                translate([0,20,0]) cylinder(d=23, h=4);
            }
        }
    }
    
    weight();
    
    difference() {
        penOuter();
        penInner();
        slipRing();
        translate([0,0,-5/2]) {
            cube([75,75,5], center=true);
        }
    }

}

module arm() {
    
    module ring() {
        module gap() {
            translate([0,-7,0]) {
                cube([16,10,14], center=true);
            }
        }
        
        difference() {
            cylinder(d=23, h=2);
            cylinder(d=19.5, h=3);
//            //gap();
        }
    }
    
    module chainHolder() {
        
        module body() {
            translate([0,27.6,0]) {
                translate([0,-17/2,4/2]) {
                    cube([9,17,4], center=true);
                }
                translate([0,0,9/2]) {
                    rotate([90,0,0]) {
                        cylinder(d=9,h=4);
                    }
                }
            }
        }
        
        module chainHole() {
            translate([0,28,10/2]) {
                rotate([90,0,0]) {
                    cylinder(d=5,h=5);
                }
            }
        }
        
        module chainRetentionHole() {
            translate([0,23.5,9/2]) {
                rotate([90,0,0]) {
                    cylinder(d=6,h=15);
                }
            }
        }
        
        difference() {
            body();
            chainHole();
            chainRetentionHole();
        }
        
    }
    
    difference() {
        chainHolder();
        translate([0,0,2]) cylinder(d=23.5, h=2);
    }
    ring();
}

module hubCap() {
    height=4;
    
    module ring() {
        translate([0,0,1]) {
            difference() {
                cylinder(d=23, h=height);
                cylinder(d=19.2, h=8);
            }
        }
    }
    
    module cap() {
        difference() {
            cylinder(d=23, h=1);
            cylinder(d=10, h=3);
        }
    }
    
    ring();
    cap();
    
}


translate([0,30,0]) {
    arm();
}
translate([0,-30,0]) {
    hub();
}


hubCap();