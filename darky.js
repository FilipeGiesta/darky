getStyles("[role=button]");
getStyles("input");
getStyles("button");

function getStyles(selector) {
	let elem = document.querySelectorAll(selector);
	
	for (var i = 0; i < elem.length; i++) {
		
		let elementstyles = window.getComputedStyle(elem[i]);
		let elementparent = elem[i].parentElement;
		let elementparentstyles = window.getComputedStyle(elementparent);
		
		let border = elementstyles.getPropertyValue("border-style");
		let backcolor = elementstyles.getPropertyValue("background-color");		
		let parentcolor = elementparentstyles.getPropertyValue("background-color");
		
		if (border != "none" && border != "hidden") {
			let bordercolor = elementstyles.getPropertyValue("border-color");
			
			let borderrgb = bordercolor.match(/\d+/g).map(num=> parseInt(num, 10));
			
			// Setting the rgb color to 255,255,255 if the alpha channel is 0
			if (borderrgb[3] == 0) {
				borderrgb[0] = 255;
				borderrgb[1] = 255;
				borderrgb[2] = 255;
			}
			
			let parentrgb = parentcolor.match(/\d+/g).map(num=> parseInt(num, 10));
			
			// Setting the rgb color to 255,255,255 if the alpha channel is 0
			if (parentrgb[3] == 0) {
				parentrgb[0] = 255;
				parentrgb[1] = 255;
				parentrgb[2] = 255;
			}
			
			let borderinverted = huerotate(borderrgb, 180);
			let parentinverted = huerotate(parentrgb, 180);
			let bordercontrast = contrast(borderinverted, parentinverted);
			
			if (bordercontrast < 4.5) {
				elem[i].style.borderColor = rgbToHex(parentinverted);
			}
			
		} else {
			let backgroundrgb = backcolor.match(/\d+/g).map(num=> parseInt(num, 10));
			
			// Setting the rgb color to 255,255,255 if the alpha channel is 0
			if (backgroundrgb[3] == 0) {
				backgroundrgb[0] = 255;
				backgroundrgb[1] = 255;
				backgroundrgb[2] = 255;
			}
			
			let parentrgb = parentcolor.match(/\d+/g).map(num=> parseInt(num, 10));
			
			// Setting the rgb color to 255,255,255 if the alpha channel is 0
			if (parentrgb[3] == 0) {
				parentrgb[0] = 255;
				parentrgb[1] = 255;
				parentrgb[2] = 255;
			}
			
			let backgroundinverted = huerotate(backgroundrgb, 180);
			let parentinverted = huerotate(parentrgb, 180);
			let backgroundcontrast = contrast(backgroundinverted, parentinverted);
			
			if (backgroundcontrast < 4.5) {
				elem[i].style.backgroundColor = rgbToHex(parentinverted);
		}
	}
}

function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
	let lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
	let lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
	var brightest = Math.max(lum1, lum2);
	var darkest = Math.min(lum1, lum2);
	return (brightest + 0.05) / (darkest + 0.05);
}

function invertrgb(rgb) {
	return [255 - rgb[0], 255- rgb[1], 255 - rgb[2]];
}

function huerotate (rgb, degrees) {
	let inverted = invertrgb(rgb);
	
	let R = inverted[0] / 255;
	let G = inverted[1] / 255;
	let B = inverted[2] / 255;
	
	let hue = 0;
	let saturation = 0;
	let lightness = 0;
	
	var maxchannel = Math.max(R,G,B);
	var minchannel = Math.min(R,G,B);
	var delta = maxchannel - minchannel;
	
	// Hue calculation
	if ( delta == 0 ) {
		hue = 0;		
	} else if (maxchannel == R) {
		hue = ((G - B) / delta) % 6;
	} else if (maxchannel == G) {
		hue = (B - R) / delta + 2;
	} else if (maxchannel == B) {
		hue = (R - G) / delta + 4;
	}
	
	hue = Math.round(hue*60);
	
	if (hue < 0) {
		hue += 360;
	}
	
	hue = hue + degrees;
	
	if (hue > 360) {
		hue -= 360;
	}
	
	// Lightness calculation
	lightness = (maxchannel + minchannel) / 2;
	
	// Saturation calculation
	if (delta == 0) {
		saturation = 0;
	} else {
		saturation = delta / (1 - Math.abs(2 * lightness - 1));
	}
	
	// Converting back to RGB
	
	let C = (1 - Math.abs(2 * lightness - 1)) * saturation;
	let X = C * (1 - Math.abs((hue / 60) % 2 -1));
	let m = lightness - C/2;
	
	if (hue >= 0 && hue < 60) {
		R = C;
		G = X;
		B = 0;
		
	} else if (hue >= 60 && hue < 120) {
		R = X;
		G = C;
		B = 0;
		
	} else if (hue >= 120 && hue < 180) {
		R = 0;
		G = C;
		B = X;
		
	} else if (hue >= 180 && hue < 240) {
		R = 0;
		G = X;
		B = C;
		
	} else if (hue >= 240 && hue < 300) {
		R = X;
		G = 0;
		B = C;
	
	} else if (hue >= 300 && hue < 360) {
		R = C;
		G = 0;
		B = X;
	}
	
	R = Math.round((R+m) * 255);
	G = Math.round((G+m) * 255);
	B = Math.round((B+m) * 255);
	
	return [R, G, B];

}

 function rgbToHex(colorArray) {
          let r = colorArray[0];
          let g = colorArray[1];
          let b = colorArray[2];

          return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      }