// 道具
(function(){
    var ns = Q.use("laputa"),
        game = ns.game,
        Prop = ns.Prop = function(props){
            Prop.superClass.constructor.call(this, props);
            this.oneat = props.oneat;
        }
    Q.inherit(Prop, Q.MovieClip);

	Prop.prototype.init = function(props){
        //this.x = LAPUTA.genRandom(100,game.width-100);
        this.speedX = 2;
        this.speedY = this.speed;
        this.moving = false;
		this.captured = false;
        this.slosh = false;
        this.init_x = this.x;
        this.init_y = this.y;
        this.sloshcount = 5;
		//dump(this.prop_type);
	}
	Prop.prototype.update = function(){
        if(this.moving){
            this.slosh = false;
            this.y +=  this.speedY;
            var r = this.rotation + 4;
            if(r>=360){ r = 0; }
            this.rotation = r;
        }else if(this.slosh){
            //if(--this.sloshcount<0){
                //this.x = LAPUTA.genRandom(this.init_x-2,this.init_x+2);
                //this.y = LAPUTA.genRandom(this.init_y-2,this.init_y+2);
                //var rotation = LAPUTA.genRandom(-3,3);
                var self = this, degree;
                if(!self.rolling){

                    self.rolling = true;
                    degree = self.rollDir == -1 ? 390 : 330;

                    Q.Tween.to(self,{'rotation': degree}, {'time': 200, onComplete: function(){

                        self.rolling = false;
                        self.rollDir = self.rollDir == -1 ? 1 : -1;
                    }});
                }

                this.sloshcount = LAPUTA.genRandom(1,4);
            //}
        }
        if(this.captured){
            // TODO 捕获状态
			//dump(this.prop_type);
        }
    }
    Prop.prototype.die = function(){
        this.oneat();
        game.viewgroup.PContainer.removeChild(this);
    }
    Prop.prototype.isOutscreen = function(){ //检测是否出屏幕
        return (this.x < -50 || this.x > game.width + 50 || this.y < -50 || this.y > game.height + 50);
    }
	Prop.prototype.eat = function(dir){
        var time = Math.sqrt((game.width-this.x)*(game.width-this.x) + this.y*this.y)/1.5,
            x = this.x ,
            y = this.y,
            self = this;
        this.moving = false;
        var effect = new Q.MovieClip(QST.extend(ns.R.effect["prop_eat"],{
                x : x,
                y : y,
                update : function(){
                    if(!this.effcount){
                        this.effcount = this.getNumFrames()*this.getFrame(0).interval
                    }
                    if(--this.effcount<=0){
                        game.viewgroup.UContainer.removeChild(this);
                        Q.Tween.to(self,{ 'scaleX' : 0, 'scaleY': 0 , 'x' : game.width / 2 , 'y' : game.height / 2 , 'alpha' : 0 }, {'time':time, onComplete:function(tween){
                            // TODO 吃到道具的触发效果
                            if(tween.target.prop_type == 'bomb'){
                                //绝处逢生:全屏杀
                                self.selmonsters = game.Manager.monsters;
                                for(var len = self.selmonsters.length - 1; len >= 0; len--) {
                                    var o = self.selmonsters[len];
                                    o.die();
                                    self.selmonsters.splice(len, 1);
                                }
                            }else if(tween.target.prop_type == 'heal'){
                                //治疗：塔加血
                                //dump(game.tower.hp);
                                game.tower.effect('tower_heal');
                                game.tower.addHP(tween.target.healhp);
                                ns.Audio.play('heal',false);
                                //dump(game.tower.hp);
                            }else if(tween.target.prop_type == 'ice'){
                                //零度深结：怪停止移动及攻击
                                self.selmonsters = game.Manager.monsters;
                                ns.Audio.play('frozen',false);
                                for(var len = self.selmonsters.length - 1; len >= 0; len--) {
                                    var o = self.selmonsters[len];
                                    o.ice(tween.target.icetime);
                                }
                            }else if(tween.target.prop_type == 'hurt'){
                                //反攻:全场怪都扣一定血量
                                self.selmonsters = game.Manager.monsters;
                                for(var len = self.selmonsters.length - 1; len >= 0; len--) {
                                    var o = self.selmonsters[len];

                                    if(o.hp <= tween.target.hurthp){
                                        o.die();
                                        self.selmonsters.splice(len, 1);
                                    }else{
                                        o.hurt(tween.target.hurthp);
                                    }
                                }
                            }else if(tween.target.prop_type == 'unbable'){
                                //无敌状态
                                game.tower.unbable = true;
                                game.tower.unbableCount = tween.target.unbabletime;
                                game.tower.gotounbable();
                            }
                            tween.target.die();
                        }});
                    }
                }
        }));
        game.viewgroup.UContainer.addChild(effect);
    }
})();