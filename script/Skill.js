// 技能
(function(){
    var ns = Q.use("laputa"),
        game = ns.game,
    Skill = ns.Skill = {
        // 火球
        fireball : function(props){
            props = QST.extend(props,ns.R.skill.fireball);
            this.fire = function(){
                //动画
                var dir = LAPUTA.calcDirection(this,game.tower),
                    degree = dir.degree;
                this.rotation = degree;
                this.hit = false;
                game.viewgroup.SContainer.addChild(this);
                //速度
                this.speedX = this.speed*dir.sin;
                this.speedY = -this.speed*dir.cos;
            }
            this.update = function(){
                if(!this.hit){
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if(game.tower){
                        if(this.hitTestObject(game.tower)){
                            game.tower.hurt(props.attack);
                            this.hit = true;
                            this.hitcount = 1;
                            this.gotoAndPlay("hit");
                            var effect = new Q.MovieClip(QST.extend(ns.R.effect["fire_hit"],{
                                    x : this.x,
                                    y : this.y,
                                    update : function(){
                                        if(!this.effcount){
                                            this.effcount = this.getNumFrames()*this.getFrame(0).interval
                                        }
                                        if(--this.effcount<=0){
                                            game.viewgroup.UContainer.removeChild(this);
                                        }
                                    }
                            }));
                            game.viewgroup.UContainer.addChild(effect);


                        }
                    }
                }else{
                    if(--this.hitcount<=0){
                        this.parent.removeChild(this);
                    }
                }
            }
            Skill.fireball.superClass.constructor.call(this, props);
        },
        // 入侵模式炮弹
        bullet1 : function(props){
            var _t = this;
            var parent = game.viewgroup.SContainer;
            props = QST.extend(props,ns.R.skill.fireball);
            this.fire = function(d){
                //动画
                var dir = LAPUTA.calcDirection(this, d),
                    degree = dir.degree;
                this.rotation = degree;
                game.viewgroup.SContainer.addChild(this);
                //速度
                this.speedX = this.speed*dir.sin;
                this.speedY = -this.speed*dir.cos;
            }
            this.update = function(){
                this.x += this.speedX;
                this.y += this.speedY;
                /*if(this.hitTestObject(game.tower)){
                    game.tower.hurt(props.attack);
                    this.parent.removeChild(this);
                }*/
                setTimeout(function(){
                    parent.removeChild(_t);
                },2000);
            }
            Skill.bullet1.superClass.constructor.call(this, props);
        },
        hit : function(props){

        },
        brick : function(props){
            props = QST.extend(props,ns.R.skill['brick'+LAPUTA.genRandom(0,2)]);
            this.throw = function(){
                game.viewgroup.SContainer.addChild(this);
                this.startSpeed = LAPUTA.genRandom(2,6);
                this.g = 0.4;
                if(props.dir == 'left'){
                    this.startSpeed = -this.startSpeed;
                }
                this.speedY = -LAPUTA.genRandom(5,20);
            }
            this.isOutscreen = function(){ //检测是否出屏幕
                return (this.x < -100 || this.x > game.width + 100 || this.y > game.height + 100);
            }
            this.update = function(){
                if(this.isOutscreen()){
                    game.viewgroup.SContainer.removeChild(this);
                }
                this.lastSpeedY = this.speedY;
		        this.speedY = this.lastSpeedY + this.g;
                var r = this.rotation + 4;
                if(r>=360){ r = 0; }
                this.rotation = r;
                this.x += this.startSpeed;
                this.y += this.speedY;
            }
            Skill.brick.superClass.constructor.call(this, props);
        }
    }
    Q.inherit(Skill.fireball, Q.MovieClip);
    Q.inherit(Skill.bullet1, Q.MovieClip);
    Q.inherit(Skill.brick, Q.Bitmap);
})();