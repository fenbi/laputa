
(function(global){


    var MAXNUM = 10;  //暂时放置这里，掉道具杀怪数量

    var ns = Q.use("laputa"),
        game = ns.game,

        Defend = ns.Defend = {
            'skillSlot' : function(props){
                var props = Q.merge({
                        width : 240,
                        height: 180,
                        maxnum : 10
                    },props),
                    cur = 0,
                    total = 0,
                    prop,
                    newprop,
                    capture = false,
                    capturecount = 2;
                Defend.skillSlot.superClass.constructor.call(this, props);
                var self = this;

                var bg = new Q.Graphics({
                    width: this.width,
                    height: 50,
                    x: 0,
                    y: this.y+10
                });

                bg.lineStyle(6, '#552609', 1, false, false, false);
                bg.drawRoundRect(6, 6, this.width - 10, 18, 8).beginFill("#FFF").endFill().cache();

                var progress = new Q.Graphics({
                    width: this.width,
                    height: 50,
                    x: 0,
                    y: this.y+10
                });
                var icon = new Quark.Bitmap(QST.extend(ns.R.icon[props.icon],{
                    x : 0 ,
                    y : this.y + 14
                }));
                this.addChild(bg);
                this.addChild(progress);
                this.addChild(icon);
                this.addprop = function(){
                    var self = this;
                    prop = new ns.Prop(QST.extend(ns.R.Prop[props.prop],{
                        x : this.x + this.width-20*game.defaultScale,
                        y : this.getBounds().y + 65*game.defaultScale,
                        oneat : function(){
                            self.addprop();
                        },
                        scaleX : 0,
                        scaleY : 0
                    }));
                    prop.init(); // 道具初始化
                    game.viewgroup.PContainer.addChild(prop);
                    //game.viewgroup.PContainer.setChildIndex(prop,100);
                }
                this.addprogress = function(){
                    cur += 1;
                    total += 1;
                    var p = cur/props.maxnum;
                    if(p == 1){
                        capture = true;
                        prop.moving = true;
                        prop.gotoAndPlay("normal");
                        game.Manager.props.push(prop);
                        prop = {};
                        cur = cur - props.maxnum - 1;
                    }else if( p > 0.65 ){
                        prop.slosh = true;
                    }
                    if(p >= 0) {
                        prop.scaleX = game.defaultScale * p * 1.1;
                        prop.scaleY = game.defaultScale * p * 1.1;
                        progress.clear();
                        progress.drawRoundRect(6, 6, (this.width - 12) * p, 18, 8).beginFill("#ffcc00").endFill();
                    }
                }
                this.update = function(){
                    if(capture){
                        if(--capturecount <= 0) {
                            this.addprogress();
                            capture = false;
                            capturecount = 2;
                        }
                    }
                }
                this.distory = function(){
                    this.removeChild(bg);
                    this.removeChild(progress);
                    this.removeChild(icon);
                    game.viewgroup.PContainer.removeChild(prop);
                    this.parent.removeChild(this);
                }
                this.addprop();
                game.viewgroup.UContainer.addChild(self);
            },
            'coinfly' : function(ctx){
                var fx = ctx.x,
                    fy = ctx.y,
                    coinnum = ctx.num,
                    coin = new Q.MovieClip(QST.extend(ns.R.icon["coin"],{
                        x : fx - 20,
                        y : fy - 90
                })),text = new Q.Text({
                    text : coinnum,
                    x : fx+5,
                    y : fy - 99,
                    font : '22px tahoma',
                    outline : true,
                    color : '#fff'
                })
                game.viewgroup.UContainer.addChild(coin);
                game.viewgroup.UContainer.addChild(text);
                Q.Tween.to(coin, {
                    'y': fy - 150
                }, {
                    time: 600,
                    onComplete: function(tween) {
                        coin.parent.removeChild(coin);
                        coin = null;
                    }
                });
                Q.Tween.to(text, {
                    'y': fy - 159
                    //'alpha': 0.5
                }, {
                    time: 600,
                    onComplete: function(tween) {
                        text.parent.removeChild(text);
                        text = null;
                    }
                });
            }
        }

    Q.inherit(Defend.skillSlot, Q.DisplayObjectContainer);



})(this);