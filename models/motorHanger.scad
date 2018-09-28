$fn=60; 

$shaftLength=22;
$distanceBetweenHoles=31;
$centerHoleHeight=2.25;
$plateThickness=$centerHoleHeight;
$plateWidth=42;
$plateDepth=$plateWidth;

$gap=$shaftLength+$centerHoleHeight+1;
$bridgeHeight=$plateThickness+$gap;

module motorMountPlate() {
    
    module plate() {
        translate([0,0,$plateThickness/2]) {
            
            intersection() {
                rotate([0,0,45]) {
                    cube([53.6,53.6,$plateThickness], center=true);
                }
                cube([$plateDepth,$plateWidth,$plateThickness], center=true);
            }
        }
    }
    
    module centerHole() {
        $centerHoleDiameter=23;
        
        cylinder(h=$centerHoleHeight+1,d=$centerHoleDiameter);
    }
    
    module screwHoles() {
        module screwHole() {
            translate([$distanceBetweenHoles/2,$distanceBetweenHoles/2,0]) {
                cylinder(d=3.5,h=$plateThickness+1);
            }
        }
        screwHole();
        rotate([0,0,90]) screwHole();
        rotate([0,0,180]) screwHole();
        rotate([0,0,270]) screwHole();
    }
    
    difference() {
        plate();
        centerHole();
        screwHoles();
    }
}

module bridge() {
    module stem() {
        translate([($plateWidth/2)+5/2,0,$bridgeHeight/2]) {
            cube([5,$plateWidth-8.2,$bridgeHeight], center=true);
        }
    }
    
    module clearance() {
        translate([0,-46/2,$plateThickness]) {
            cube([46/2,46,$gap]);
        }
    }
    
    module fillets() {
        translate([23,0,2.2]) {
            rotate([0,45,0]) {
                cube([3,$plateWidth-8.2,3], center=true);
            }
        }
//        
        translate([23,0,2.2+$gap]) {
            rotate([0,45,0]) {
                cube([3,$plateWidth-8.2,3], center=true);
            }
        }
    }
    
    difference() {
        stem();
        clearance();
    }
    
    fillets();
}

module hook() {
    $edgeDiameter=12;
    $edgeRadius=$edgeDiameter/2;
    
    $hookDepth=19;
    $height=25;
    $length=$plateWidth-8.2;
    
    module hookHollow() {
        translate([-($length+2)/2,0,$hookDepth-$edgeRadius]) {
            rotate([0,90,0]) {
                cylinder(d=$edgeDiameter,h=$length+2);
            }
            translate([0,-$edgeRadius,-$hookDepth]) {
                cube([$length+2,$edgeDiameter,$hookDepth]);
            }
        }
    }
    
    module hookBody() {
        translate([0,0,$height/2]) {
            cube([$length,$edgeDiameter+4,$height], center=true);
        }
    }
    
    module hookNotch() {
        translate([-$length/2,-$edgeRadius,$hookDepth-7.5]) {
            rotate([0,90,0]) {
                cylinder(d=3,h=$length);
            }
        }
    }

    difference() {
        hookBody();
        hookHollow();
    }
    
//    hookNotch();
}

bridge();

motorMountPlate();

translate([1,0,$bridgeHeight+8]) {
    rotate([90,0,90]) {
        hook();
    }
}