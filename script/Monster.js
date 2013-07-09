(function() {
    var ns = Q.use("laputa"),
        game = ns.game,
        mid = {
            x: game.width / 2,
            y: game.height / 2
        },
        Monster = ns.Monster = function(props,type) {
            this.type = type;
            Monster.superClass.constructor.call(this, props);
        }
    Q.inherit(Monster, Q.MovieClip);
    Monster.prototype.init = function(props){
        var dir = Math.floor(Math.random() * 4 + 1),
            x, y, axfz = 0,
            ayfz = 0,
            atk_pos = {
                x: game.width / 2 + this.width/2,
                y: game.height / 2 + this.height/2+30
            };
        if(this.type == 'invader'){ // 入侵模式  怪物从上方来
            dir = 2;
            atk_pos = {
                x: game.width / 2,
                y: game.height-200
            }
        }
        if(this.attack_dis > 0) {
            if(this.name == 'm1'){
                // 如果是m1  撞击怪，上下不可现
                axfz = Math.random() * (this.attack_dis-30) + 30;
            }else if(this.name == 'm3'){
                // 如果是m3  拆墙怪，左右出现
                var tempdis = this.scaleY * 50;
                axfz = Math.random() * tempdis + this.attack_dis - tempdis;
            }else{
                axfz = Math.random() * this.attack_dis;
            }
            ayfz = Math.sqrt(this.attack_dis * this.attack_dis - axfz * axfz);
        }
        switch(dir) {
        case 1:
            //左方出现
            x = -200;
            y = Math.floor(Math.random() * game.height);
            atk_pos.x -= axfz;
            if(y >= mid.y) {
                atk_pos.y += ayfz;
            } else {
                atk_pos.y -= ayfz;
            }
            break;
        case 2:
            //上方出现
            x = Math.floor(Math.random() * game.width);
            y = -200;
            if(x >= mid.x) {
                atk_pos.x += axfz;
            } else {
                atk_pos.x -= axfz;
            }
            atk_pos.y -= ayfz;
            break;
        case 3:
            //右方出现
            x = game.width + 200;
            y = Math.floor(Math.random() * game.height);
            atk_pos.x += axfz;
            if(y >= mid.y) {
                atk_pos.y += ayfz;
            } else {
                atk_pos.y -= ayfz;
            }
            break;
        case 4:
            //下方出现
            x = Math.floor(Math.random() * game.width);
            y = game.height + 200;
            if(x >= mid.x) {
                atk_pos.x += axfz;
            } else {
                atk_pos.x -= axfz;
            }
            atk_pos.y += ayfz;
            break;
        }

        this.x = x;
        this.y = y;

        if(x < game.width/2){
            this.scaleX = -this.scaleX;
        }
		this.iceState= false;
		this.iceCount = 0;
        this.moving = true;
        this.skillable = true;
        this.step += Math.round((Math.random() * 2 - 1) * 100);
        this.besierPoint = LAPUTA.RandomBezier(this, atk_pos, this.step);
        this.stepCount = 1;

        this._maxhp = this.hp;

        this.bloodcont = new Q.Graphics({
            width : this.getBounds().width,
            height : 50,
            x : -3000,
            y : -3000,
            update: function() {}
        });
        this.bloodcont.drawRoundRect(0, 0, this.getBounds().width*Math.abs(this.scaleX), 8, 4).beginFill("#fff").endFill().cache();

        this.blood = new Q.Graphics({
            width : this.getBounds().width,
            height : 50,
            x : -3000,
            y : -3000,
            update : function() {}
        });

        if(this.skill_fireball) {
            this._skillfirecount = LAPUTA.genRandom(game.fps*0.5, (game.fps * 1.5));
        }
        if(this.skill_hit){
            this._skillhitcount = LAPUTA.genRandom(0, (game.fps * 0.5));
            this._skillhitcountfz = null;
        }
        if(this.skill_brick){
            this._skillbrickcount = LAPUTA.genRandom(0, (game.fps * 0.5));
        }
        this.cutinf = false;
        this.cutinfocount = 10;
        //dump(game.viewgroup.MContainer)
        game.viewgroup.MContainer.addChild(this.bloodcont);
        game.viewgroup.MContainer.addChild(this.blood);

        this.drawHP(1);
    }
    Monster.prototype.setSpeed = function(r){
        var radian = r * Q.DEG_TO_RAD
        dir = {
            degree: r,
            sin: Math.sin(radian),
            cos: Math.cos(radian)
        };
        this.rotation = dir.degree % 360;
    }
    Monster.prototype.setPos = function(p){
        this.x = p.x - this.rectWidth / 2;
        this.y = p.y - this.rectHeight / 2;

        /*
        if(this.name == 'm1'){
            var dir = LAPUTA.calcDirection(this,game.tower),
                degree = dir.degree;
            if(this.scaleX < 0){
                this.rotation = degree-90;
            }else{
                this.rotation = degree+90;
            }
        }
        */
        this.blood.x = this.bloodcont.x = this.getBounds().x;
        this.blood.y = this.bloodcont.y = this.getBounds().y-15;
    }
    Monster.prototype.setCounter = function(){
        var fps = game.fps,
            min = fps * 1,
            max = fps * 1;
        this.changeDirCounter = Math.random() * (max - min + 1) + min >> 1;
    }
    Monster.prototype.drawHP = function(r){
        this.blood.clear();
        if(r > 0) {
            this.blood.drawRoundRect(1, 1, (this.getBounds().width*Math.abs(this.scaleX) - 2) * r, 6, 3).beginFill("#cb0000").endFill().cache();
        }
    }
    Monster.prototype.hurt = function(h){
        if(h >= this.hp) {
            this.hp = 0;
            this.die();
            this.drawHP(0);
            return true;
        } else {
            this.drawHP(this.hp / this._maxhp);
            this.hp -= h;
            this.gotoAndPlay("being_attacked");
        }
    }
    // TODO 怪物扣血计算
    // 怪物死亡
    Monster.prototype.die = function() {
        //动画
        var framecount = this.getNumFrames()-this.getFrameIndex("capture");
        this.captured = true;
        this.captureCount = (framecount-1)/2 * this.getFrame("capture").interval;
        this.moving = false;
        this.gotoAndPlay("capture");
        //移除
    }
	//怪物消失
	Monster.prototype.hiden = function() {
        //动画
        this.captured = true;
        this.captureCount = 2;
        this.moving = false;
        //移除
    }
	// 怪物冰冻
	Monster.prototype.ice = function(icetime) {
        this.iceState = true;
		this.iceCount = icetime;
        this.gotoAndPlay("freeze");
        this.moving = false;
        this.skillable = false;
	}
    Monster.prototype.update = function() {
        if(this.captured) {
            // 被击杀
            if(--this.captureCount <= 0) {
                this.parent.removeChild(this.blood);
                this.parent.removeChild(this.bloodcont);
                this.parent.removeChild(this);
                delete this;
            }
        }else{
            if(this.moving) {
                var currentPos;
                if(this.stepCount >= this.besierPoint.length) {
                    currentPos = this.besierPoint[this.besierPoint.length - 1];
                    this.moving = false;
                } else {
                    currentPos = this.besierPoint[this.stepCount];
                }
                //if(this.stepCount%5 == 0 && this.stepCount <= this.step-6){
                //    var lastPos = this.besierPoint[this.stepCount+5],
                //        difPosx = currentPos.x-lastPos.x,
                //        difPosy = currentPos.y-lastPos.y;
                //    if( difPosx !=0 && difPosy !=0 ){
                //        var r = Math.atan(difPosx,difPosy)/Q.DEG_TO_RAD;
                //        if(difPosx/difPosy==-1){
                //            r -= Math.PI/2;
                //        }
                //        this.rotation = r % 360;
                //    }
                //}
                this.setPos(currentPos);
                this.stepCount++;
            }
            if(this.skillable){
                // 技能 : 远程火球术
                if(this.skill_fireball && !this.moving) {
                    if(--this._skillfirecount <= 0) {
                        // 触发火球
                        var disx_bu = this.scaleX < 0 ? -30 : 30;
                        var fireball = new ns.Skill.fireball({
                            'x': this.x + disx_bu,
                            'y': this.y + 25,
                            'attack': this.attack
                        });
                        this.gotoAndPlay("attack");
                        fireball.fire();
                        // 火球cd时间
                        this._skillfirecount = LAPUTA.genRandom((game.fps * 2), (game.fps * 3));
                    }
                }
                // 技能 : 撞击术
                if(this.skill_hit && !this.moving) {
                    if(--this._skillhitcount<=0){

                        var dir = LAPUTA.calcDirection(this,game.tower),
                            degree = dir.degree;
                        if(this.scaleX < 0){
                            this.rotation = degree-90;
                        }else{
                            this.rotation = degree+90;
                        }

                        // 触发撞击
                        this._skillhitstate = true;
                        this.gotoAndPlay("attack");
                        this._skillhitcount = LAPUTA.genRandom((game.fps * 1), (game.fps * 1.5));
                        this._skillhitcountfz = 7 * 14;
                    }else{
                        if(--this._skillhitcount===0){
                            this.hurt(this.attack);
                            game.tower.hurt(this.attack);
                            this._skillhitcountfz = null;
                        }
                    }
                }
                // 技能 : 拆墙术
                if(this.skill_brick && !this.moving) {
                    if(--this._skillbrickcount <= 0) {
                        this.gotoAndPlay("attack");
                        this._skillbrickcount = LAPUTA.genRandom((game.fps * 0.5), (game.fps * 2));
                        this._skillbrickcountfz = 45;
                    }else if( --this._skillbrickcountfz == 0 ){
                        var dir = this.scaleX < 0 ? 'left' : 'right';
                        var brick = new ns.Skill.brick({
                            'x': this.x+10,
                            'y': this.y-30,
                            'dir' : dir,
                            'attack': this.attack
                        });
                        brick.throw();
                        game.tower.hurt(this.attack);
                    }
                }
            }
            if(this.iceState) {
                // 被冰冻
                if(--this.iceCount <= 0) {
                    this.iceState = false;
                    this.moving = true;
                    this.skillable = true;
                    this.gotoAndPlay("moving");
                }
            }
            if(this.cutinf){
                // 受伤
                if(--this.cutinfcount <= 0){
                    this.cutinf = false;
                }
            }
        }
    }
})();