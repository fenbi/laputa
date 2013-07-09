/*
    Module 
    入侵者模式
 */
(function(global){
    var log = AT.log;

    var ns = Q.use("laputa"),
        game = ns.game,
        AHS = AT.HotSpot;

    /*
        入侵模式
     */
    var Invader = ns.Invader = function(props){
        var p = props = Q.merge({
            width : 240,
            height: 180,
            r:      240*.5,
            alpha:  .8,
            fillColor: '#999'
        },props);

        Invader.superClass.constructor.call(this, props);

        var w = p.width,
            h = p.height,
            r = p.r,
            bw = w / 7 | 0,
            scale = 1024 / 240;
        
        var r;
        function createDir(density){
            var i = density,
                w = 210,
                l = 5
                mw = w/i ,
                mh = w/i ,
                arr = [];
            r = mw/2;

            var PI = Math.PI;

            while(i--){
                var x = l+mw*1.1*i;
                arr.push({
                    id: 'f'+i,
                    x: x,
                    y: 100*(1 - Math.sin(mw*(i+1)*PI/(w+mw)) ),
                    w: mw,
                    h: mh,
                    maxLife: 100
                });
            }
            
            return arr;
        }


        var cbFlag = true;
        var cbTimeout = 110;
        var cbTimer;
        function callback(spot){
            var c = spot.count;
            
            if( cbFlag ) {
                var bullet = new ns.Skill.bullet1({
                    x: 520,
                    y: 760,
                    attack: 2
                });
                bullet.fire(spot);

                cbFlag = false;
            } else {
                return false;
            }

            cbTimer = setTimeout(function() {
                cbFlag = true;
            }, cbTimeout);
        
            //log(this.id);
        }

        var fireBtns = {
                id: 'fireDir',
                btns: createDir(12),
                fn: callback,
                scale: scale
            },
            weaponBtns = {
                id: 'weapon',
                btns: [
                    {id:'left', x:0, y:bw*4, w:bw, h:bw},
                    {id:'right', x:p.width-bw, y:bw*4, w:bw, h:bw}
                ],
                fn: callback,
                scale: scale
            };

        function createBtnGroup(props) {
            var btns = props.btns,
                i    = btns.length,
                gID  = props.id,
                btn,
                p,
                group = new Q.DisplayObjectContainer({id: gID});

            while(i--){
                p = btns[i];

                btn = new Q.Graphics({
                    x: p.x,
                    y: p.y,
                    width:  p.w,
                    height: p.h
                });
                btn.drawCircle(0, 0, p.w/2).beginFill('#F60').endFill().cache();
                group.addChild(btn);
            }

            return group;
        }

        var video = game.video;
        var mask  = new Q.Graphics(
            {
                width:  p.width,
                height: p.height,
                alpha: .5
            });
        
        mask.drawCircle(0, 0, p.r).beginFill(p.fillColor).endFill().cache();
        this.mask = mask;
        video.width  = p.width;
        video.height = p.height;
        this.addChild(video);
        game.tower.alpha = .2;
        this.addChild(createBtnGroup(fireBtns));
        //game.viewgroup.SContainer.addChild(createBtnGroup(fireBtns));
        this.addChild(createBtnGroup(weaponBtns));

        AHS.addGroup(fireBtns);
        AHS.addGroup(weaponBtns);
        

        AHS.start(fireBtns.id);
    };
    Q.inherit(Invader, Q.DisplayObjectContainer);
    
    Invader.prototype.init = function(){


    };   
})(this);