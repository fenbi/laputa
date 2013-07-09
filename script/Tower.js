(function(){
    var ns = Q.use("laputa"),
        game = ns.game,
        Tower = ns.Tower = function(props){
            Tower.superClass.constructor.call(this, props);
        };
    Q.inherit(Tower, Q.MovieClip);


	Tower.prototype.init = function(){
        this._defaultx = this.x;
        this.able = true;
        game.viewgroup.UContainer.addChild(this);
        this.bound = this.getBounds();

        this.bloodcont = new Q.Graphics({width:this.bound.width+80,height:18,x:this.bound.x-40,'y':this.bound.y-56,update:function(){
        }});
        this.bloodcont.drawRoundRect(0,0,this.bound.width+80,12,6).beginFill("#fff").endFill().cache();
        this.blood = new Q.Graphics({width:this.bound.width+80,height:18,x:this.bound.x-40,'y':this.bound.y-56,update:function(){
        }});
        game.viewgroup.UContainer.addChild(this.bloodcont);
        game.viewgroup.UContainer.addChild(this.blood);
        this.drawHP(this.hp/this.maxhp);

        this.state = 'normal';
	};
	Tower.prototype.setHP = function(h){
	    this.maxhp = h;
	    this.hp    = h;
	    return this;
	};
	Tower.prototype.addHP = function(h){
	    this.hp = this.hp + h > this.maxhp ? this.maxhp : this.hp + h;
		var hppre = this.hp / this.maxhp;
		this.drawHP(hppre);
		return this;
	};
    Tower.prototype.update = function(){
        if(this.unbable){
            if(--this.unbableCount <=0){
                this.unbable = false;
                this.gotoAndPlay(this.state);
            }
        }
    };
    Tower.prototype.die = function(){
        // TODO  game over
        this.able = false;
        dump('game over');
		ns.Audio.play('falied',false);
        game.Manager.gameend('fail');
    };
	Tower.prototype.hurt = function(h){
        if(!this.unbable && this.able){
            var self = this;
            this.hp = this.hp - h > this.maxhp ? this.maxhp : this.hp - h;
            //塔状态判定
            var hppre = this.hp / this.maxhp;
            if ( hppre <= 0 ) {
                this.state = "over";
                this.gotoAndPlay("over");
                hppre = 0;
                this.die();
            }
			ns.Audio.play('gulp',false);
            if(!this.hurtstate){
                this.hurtstate = true;
                Q.Tween.to(this,{ x : this._defaultx+(8*this.scaleX) , scaleX : 0.99*this.scaleX, scaleY: 0.99*this.scaleY }, {time:230, reverse:true, onComplete:function(tween){
                    if(tween.reversing){
                        self.hurtstate = false;
                    };
                    tween.reversing = true;
                }});
            }
            self.drawHP(hppre);
            return this;
        }else{
			ns.Audio.play('armour',false);
			return this;
		}
	};
	Tower.prototype.drawHP = function(r){
		this.blood.clear();
        if(r>0){
            if(r<=0.65 && this.state == 'normal' ){
                this.state = 'broken';
                this.gotoAndPlay("broken");
            }
            this.blood.drawRoundRect(2,2,(this.bound.width+80-4)*r,8,4).beginFill("#64d567").endFill().cache();
        }
	}
    Tower.prototype.gotounbable = function(r){
        this.gotoAndPlay(this.state + '_unbable');
	}
	Tower.prototype.distory = function(){
        game.viewgroup.UContainer.removeChild(this);
        game.viewgroup.UContainer.removeChild(this.bloodcont);
        game.viewgroup.UContainer.removeChild(this.blood);
	}
	Tower.prototype.effect = function(type){
        var effect = new Q.MovieClip(QST.extend(ns.R.effect[type],{
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


})();