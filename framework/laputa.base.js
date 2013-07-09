(function(win,L) {
    win[L] = L = {
        loader : {
            checkFile : function (s) {
                var suffix = s.lastIndexOf('.');
                suffix = s.substr(suffix);
                if (/png|jpg|jpeg|gif|bmp/.test(suffix)) {
                    return 'image';
                }else if(/ogg|mp3|m4a|wav/.test(suffix)) {
                    return 'sound';
                }
            },
            isImage : function (s) {
                return (this.checkFile(s) == 'image');
            },
            isSound : function (s) {
                return (this.checkFile(s) == 'sound');
            },
            loadedImages : {},
            loadedSounds : {},
            /**
             * 图片 音频资源加载
             * @param {Array} 资源路径
             * @param {Function} callback
             */
            preload : function(fileNames, callback){
                var filelength = fileNames.length,
                    self = this,
                fileLoaded  = 0,
                fileLoadedFC = function () {
                    fileLoaded ++;
                    callback(fileLoaded/filelength);
                };
                for(var i = 0; i < filelength; i ++){
                    var file = fileNames[i].src,
                        id = fileNames[i].id;
                    if(self.isImage(file)){
                        var image = self.loadedImages[file];
                        if (!!image) {
                            fileLoaded ++;
                            continue;
                        }
                        image = new Image();
                        image.src = file;
                        image.onload = fileLoadedFC;
                        image.onerror = fileLoadedFC;
                        self.loadedImages[id] = fileNames[i].image =  image;
                    }else if(self.isSound(file)){
                        //音频预加载
						var sound = self.loadedSounds[id];
						sound = new buzz.sound(file, {
                                //formats: ["wav", "mp3"],
                                preload: true,
                                autoload: true,
                                loop: !! fileNames[i].loop
                            });
						sound.id=id;
						if(fileNames[i].volume){
							sound.volume=fileNames[i].volume;
						}
						self.loadedSounds[id] = sound;
						fileLoaded ++;
                    }
                }
            }
        },
        RandomBezier : (function(){
            function drawBezierByStep(p0, p1, p2, p3, step) {
                var aPoint = [],
                x = p0.x,
                y = p0.y,
                r, pow = Math.pow;
                for (var count = 0; count <= step; count += 1) {
                    i = count / step;
                    r = 1 - i;
                    aPoint.push({
                        x:  p0.x * pow(r, 3) + 3 * p1.x * i * pow(r, 2) + 3 * p2.x * pow(i, 2) * r + p3.x * pow(i, 3) ,
                        y:  p0.y * pow(r, 3) + 3 * p1.y * i * pow(r, 2) + 3 * p2.y * pow(i, 2) * r + p3.y * pow(i, 3)
                    });
                }
                return aPoint;
            }
            function drawRandomBezier(p0,p3,step){
                var aMid = genMiddlePoint(p0, p3);
                return drawBezierByStep(p0, aMid[0], aMid[1], p3, step);
            }
            function getRandom(){
                //return 1;
                return Math.random();
            }
            function genMiddlePoint(src,dest){
                var dx=dest.x-src.x;
                var dy=dest.y-src.y;

                var p1={};
                var p2={};

                var iX1=3/10;
                var iX2=2/3;

                if(dx==0){
                    dx=100;
                }
                if(dy==0){
                    dy=100;
                }
                if(Math.abs(dx)>Math.abs(dy)){
                    p1.x=src.x+dx*(iX1);
                    p2.x=src.x+dx*(iX2);
                    p1.y=src.y+dy*(getRandom()>0.5?(iX1-1):iX1)*(0.7+getRandom());
                    p2.y=src.y+dy*(getRandom()>0.5?(iX2-1):iX2)*(0.7+getRandom());
                }
                else{
                    p1.y=src.y+dy*(iX1);
                    p2.y=src.y+dy*(iX2);
                    p1.x=src.x+dx*(getRandom()>0.5?(iX1-1):iX1)*(0.7+getRandom());
                    p2.x=src.x+dx*(getRandom()>0.5?(iX2-1):iX2)*(0.7+getRandom());
                }
                return [p1,p2];
            }
            return drawRandomBezier;
        })(),
        genRandom: function(d, c) {
            d = d || 0;
            c = c || 9999;
            return Math.floor((c - d + 1) * Math.random()) + d
        },
        calcDirection : function(p1,p2){
            var degree,
                xc = p1.x - p2.x,
                yc = p1.y - p2.y;
            if(yc==0 || xc == 0){
                if(xc == 0 && yc <0){
                    degree = 180;
                }else if(xc == 0 && yc >=0){
                    degree = 0;
                }else if(xc >= 0 && yc == 0){
                    degree = 270;
                }else if(xc < 0 && yc == 0){
                    degree = 90;
                }
            }else{
                degree = Math.atan(Math.abs(xc/yc))/Q.DEG_TO_RAD;
                if( xc >= 0 && yc >=0){
                    degree = 360 - degree;
                }else if( xc >= 0 && yc <0 ){
                    degree = degree + 180;
                }else if( xc < 0 && yc >= 0){
                    degree = degree;
                }else if( xc < 0 && yc <0){
                    degree = 180 - degree;
                }
            }
            var sin = Math.sin(degree * Q.DEG_TO_RAD);
            var cos = Math.cos(degree * Q.DEG_TO_RAD);
            return {degree:degree,sin:sin,cos:cos};
        }
    }
})(this,'LAPUTA');