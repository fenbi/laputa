// requestAnimationFrame shim
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};

	if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}());


/*
	Air Touch
	version 0.1
*/
(function(global) {

var AT = {};

//console
var log = AT.log = function(x) {
		if (console) console.log(x);
	}

/*
	Detect Browser
*/
var browser = AT.browser = (function(ua) {
	ua = ua.toLowerCase();
	var rwebkit = /(webkit)[ \/]([\w.]+)/,
		ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
		rmsie = /(msie) ([\w.]+)/,
		rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

	var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];
	return {
		browser: match[1] || "",
		version: match[2] || "0"
	};
})(navigator.userAgent);


/**
 *	Merge object
 *	@param  {Object}
 *	@param  {Object}
 *	@param  {Boolean}
 *	@return {Object}
 */
var merge = AT.merge = function merge(obj, props) {
        for (var k in props) {
            if (props.hasOwnProperty(k)) {
                obj[k] = props[k];
            }
        }
        return obj;
    }

/**
 *	Create DOM
 *	@param  {String} tag
 *	@param  {Object} props
 *	@param  {Object} context
 *	@return {DOM}
 */
var createDOM = AT.createDOM = function(tag, props, context) {

	var tag = tag || 'div',
		//special property map
		map = {
			"Class":    "className",
			"checked":  "defaultChecked",
			"selected": "defaultSelected",
			"for":      "htmlFor"
		},
		dom = (context || document).createElement(tag),
		handlerArr = ['style','html','text'],
		handler = {
			'style': function(){
				dom.style.cssText = props[prop] || dom.setAttribute("style", props[prop]);
			},
			'html': function(){
				dom.innerHTML = props[prop];
			},
			'text': function(){
				browser == 'mozilla' ? (dom.innerHTML = props[prop]) : (dom.innerText = props[prop]);
			}
		}

	for (var prop in props) {
		if(handlerArr.indexOf(prop) > -1){
			handler[prop]();
		}else{
			dom.setAttribute(prop, props[prop]) || browser === 'msie' && dom.setAttribute(map[prop], props[prop]);
		}
	}
	return dom;
};

var createCanvas = function(props) {
	return createDOM('canvas', props);
}

/*
	bitwise
	fast Math.floor:  n | 0   
*/

var ImageArray, ZeroFilledImageArray;

if (typeof Float32Array !== "undefined") {
	ImageArray = ZeroFilledImageArray = Float32Array;
} else {
	ZeroFilledImageArray = function(length) {
		Array(length);
		for (var i = 0; i < length; ++i) this[i] = 0;
	};
	ZeroFilledImageArray.prototype = ImageArray = Array;
}

var 
fps = 1000 / 30,
//main canvas
canvas, ctx, imageSrc,
//diff canvas
canvasDiff, ctxDiff, imageDataDiff,
//output canvas
canvasOut, ctxOut,
//skin canvas
canvasSkin, ctxSkin,
//transform canvas
canvasTransform, ctxTransform,
//diff temp
imageDataLast,
share = {},
_pause = false,
_timeid, _sens, video,  
cw, ch, 
vw, vh, 
w, h, 
n, scale, _typeout = 'video',
//栅格
grid, gw, gh, gs,
//噪点
threhold, _noise,
hsv = {};

function fastAbs(value) {
	return (value ^ (value >> 31)) - (value >> 31);
}

function rgbToGrayscale(r, g, b) {
	return r * .299 + g * .587 + b * .114;
}

function skinMask(imageSrc, imageDst) {
	var src = imageSrc.data,
		dst = imageDst.data,
		len = src.length,
		i = len,
		j = 0,
		r, g, b, h, s, v, value;

	while (i -= 4) {
		r = src[i];
		g = src[i + 1];
		b = src[i + 2];

		v = Math.max(r, g, b);
		s = v === 0 ? 0 : 255 * (v - Math.min(r, g, b)) / v;
		h = 0;

		if (0 !== s) {
			if (v === r) {
				h = 30 * (g - b) / s;
			} else if (v === g) {
				h = 60 + ((b - r) / s);
			} else {
				h = 120 + ((r - g) / s);
			}
			if (h < 0) {
				h += 360;
			}
		}

		value = 0;

		var vmin = hsv.vmin || 65,
			vmax = hsv.vmax || 250,
			hmin = hsv.hmin || 0,
			hmax = hsv.hmax || 13;

		if (v >= vmin && v <= vmax) {
			if (h >= hmin && h <= hmax) {
				value = 255;
			}
		}
		dst[i + 3] = 255;
		dst[i] = dst[i + 1] = dst[i + 2] = value;
	}

	imageDst.width = imageSrc.width;
	imageDst.height = imageSrc.height;

	return imageDst;
}

function _frameDiff(target, d1, d2) {
	var i = d1.length >> 2,
		avg1, avg2, diff, 
		n = 0;

	while (i--) {
		n = i << 2;
		avg1 = rgbToGrayscale(d1[n], d1[n + 1], d1[n + 2]);
		avg2 = rgbToGrayscale(d2[n], d2[n + 1], d2[n + 2]);

		diff = fastAbs(avg1 - avg2) > _sens ? 255 : 0;

		target[n] = diff;
		target[n + 1] = diff;
		target[n + 2] = diff;
		target[n + 3] = diff ? 60 : 0xFF;
	}

	return target;
}

function diff() {
	imageSrc = ctx.getImageData(0, 0, w, h);
	imageDataDiff = ctx.createImageData(w, h);

	if (!imageDataLast) {
		imageDataLast = ctx.getImageData(0, 0, w, h);
	}

	_frameDiff(imageDataDiff.data, imageSrc.data, imageDataLast.data);

	ctxDiff.putImageData(imageDataDiff, 0, 0);
	imageDataLast = imageSrc;
}

//降噪
function reduceNoise() {
	
	var j = gs;
	var	arr = [],
		//方向系数
		dir = [0, 0],
		
		x, y, k, i, d, c = 0;
	
	while (j--) {
		x = j % gw;
		y = (j / gw) | 0;
		c = 0;
		i = ctxDiff.getImageData(x * n, y * n, n, n);
		d = i.data;
		k = d.length >> 2;

		while (k--) {
			if (d[k + 3] == 60) c++;
		}

		if (c > threhold) {
			dir[0] += x < gw * .3 && -1 || x > gw * .7 && 1 || 0;
			dir[1] += y < gh * .3 && -1 || y > gh * .7 && 1 || 0;
			arr.push([x, y, d]);
			/*}else{
			ctxDiff.fillRect(x*n, y*n, n, n);*/
		}
	}

	arr.or = [-dir[0], -dir[1]]
	return arr;
}

//唯一坐标确定
function coor(arr) {
	if (arr.length == 0) return;

	var i = arr.length,
		xy = [],
		d, jj = arr[0][2].length >> 2,
		j, x, y, 
		r = scale, 
		or = arr.or, 
		xs, ys;

	while (i--) {
		d = arr[i][2];
		j = jj;
		while (j--) {
			if (d[j + 3] == 60) {
				x = arr[i][0] * n + j % n;
				y = arr[i][1] * n + (j / n) | 0;
				xy.push([x, y]);
			}
		}
	}

	i = xy.length;
	xy.sort(function(a, b) {
		return a[0] - b[0];
	});
	x = !or[0] && fastAbs((xy[0][0] + xy[i - 1][0]) * .5) || or[0] > 0 ? xy[0][0] : xy[i - 1][0];

	xy.sort(function(a, b) {
		return a[1] - b[1];
	});
	y = !or[1] && fastAbs((xy[0][1] + xy[i - 1][0]) * .5) || or[1] > 0 ? xy[0][1] : xy[i - 1][1];

	x = Math.round(cw - x / r);
	y = Math.round(y / r);

	//log([x,y]);
	//share.xy = [x, y];
	sync([x, y]);
}

//水平翻转
function transform(image, direction) {

	canvasTransform.width = image.width;
	canvasTransform.height = image.height;

	ctxTransform.save();
	ctxTransform.translate(image.width, 0);
	ctxTransform.scale(-1, 1);
	ctxTransform.drawImage(image, 0, 0);
	ctxTransform.restore();

	return canvasTransform;
}


function drawRect(ctx, x, y, w, h) {

	ctx.strokeStyle = '#F60';
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, w, h);
}

function updateFrames() {

	if (_pause) {
		clearTimeout(_timeid);
		//cancelAnimationFrame(_timeid);
	} else {
		_timeid = setTimeout(updateFrames, fps);
		//_timeid = requestAnimationFrame(updateFrames);
	}

	//stats.begin();

	ctx.drawImage(video, 0, 0, w, h);
	diff();
	coor(reduceNoise());

	if (_typeout === 'video') {

		ctxOut.drawImage(transform(video), 0, 0, cw, ch);

	} else if (_typeout === 'skin') {

		ctxSkin.putImageData(skinMask(imageSrc, ctxSkin.getImageData(0, 0, w, h)), 0, 0);
		ctxOut.drawImage(transform(canvasSkin), 0, 0, cw, ch);

	} else {

		ctxOut.drawImage(transform(canvasDiff), 0, 0, cw, ch);
	}

	//stats.end();
}


//等比缩放
function coorScale(a) {
	return Math.round(a * scale);
}

//局部运动区域
var getLocalDiff = AT.getLocalDiff = function(x, y, w, h) {

	x = (x + w) > cw / 2 ? coorScale(cw - w - x) : coorScale(cw - x - w);
	y = coorScale(y);
	w = coorScale(w);
	h = coorScale(h);

	return ctxDiff.getImageData(x, y, w, h).data;
}


//暂停捕获
var pause = AT.pause = function pause() {
	_pause = true;
	clearTimeout(_timeid);
	//cancelAnimationFrame(_pause);
	log('pause');
}

//启动捕获
var reStart = AT.reStart = function() {
	_pause = false;
	updateFrames();
}

var setHSV = AT.setHSV = function(props) {
	hsv = props;
}

/*
	start detect
 */
var start = AT.start =  function(stream) {

	video.addEventListener('canplay', function() {
		video.removeEventListener('canplay');
		video.height = vh = video.videoHeight;
		video.width  = vw = video.videoWidth;

		updateFrames();
		success();
	});

	var domURL = window.URL || window.webkitURL;
	video.src = domURL ? domURL.createObjectURL(stream) : stream;
}

/*
	error handler
 */
var error = AT.error = function() {
	log('Please go to about:flags in Google Chrome and enable the MediaStream  flag.');
	return false;
}

var denied = AT.denied = function() {
	log('Camera access denied!<br>Please reload and try again.');
}

function sync() {

}

function success() {

}

var getImage = AT.getImage = function(param) {

	if (param) {
		_typeout = param.type;
	} else {
		_typeout = '';
	}

	return canvasOut;
}

var getSkin = AT.getSkin = function(props) {
	_typeout = props.type;
	return canvasSkin;
}

var resize = AT.resize = function() {}

AT.init = function(conf) {
	if (!conf.canvas) {
		log('canvas needed')
		conf.canvas = {
			width:  conf.width,
			height: conf.height
		}
		//return;
	}

	video = createDOM('video', {
		autoplay: true,
		loop: true
	});
	
	canvasStage = conf.canvas;
	//ctxStage 	= conf.canvas.getContext('2d');
	ch = conf.canvas.height;
	cw = conf.canvas.width;

	//w = Math.round(cw * scale);
	//h = Math.round(ch * scale);
	var nn = 70;
	w = 4 * nn;
	h = 3 * nn;

	scale = (w / cw).toFixed(2);

	//栅格
	grid = 16;
	n = Math.round(w / grid);
	gw = Math.round(w / n);
	//垂直栅格数
	gh = Math.round(h / n);
	//栅格数
	gs = gw * gh;
	//log([gw,gh,gs])
	//降噪
	_noise = .15;
	_sens = 22;
	threhold = Math.round(n * n * _noise);

	sync    = conf.sync || sync;
	success = conf.success || success;
	error 	= conf.error || error;
	denied 	= conf.denied || denied;

	canvas = createCanvas({
		width: w,
		height: h
	});
	ctx = canvas.getContext('2d');

	canvasDiff = createCanvas({
		width: w,
		height: h
	});
	ctxDiff = canvasDiff.getContext('2d');

	canvasTransform = createCanvas({
		width: w,
		height: h
	});
	ctxTransform = canvasTransform.getContext('2d');

	canvasSkin = createCanvas({
		width: w,
		height: h
	});
	ctxSkin = canvasSkin.getContext('2d');

	canvasOut = createCanvas({
		width: cw,
		height: ch
	});
	ctxOut = canvasOut.getContext('2d');

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	try {
		navigator.getUserMedia({
			video: true,
			audio: false
		}, start, denied);
	} catch (e) {
		try {
			log(11)
			navigator.getUserMedia('video', start, denied);
		} catch (e) {
			error(e);
		}
	}
}

AT.video = function(){return video};

	global.AT = AT;
	
}(this))