(function() {
    var ns = Q.use("laputa"),
        game = ns.game,
        _aimX = -300,
        _aimY = -300;

    var MonsterManager = ns.MonsterManager = function(c) {
            this.pasued = false; // 暂停
            this.container = c;
            this.maxScreen = 12; //  最大同屏怪物显示数
            this.monsters = []; //  怪物池
            this.props = []; // 道具池
            this.hasmonster = false;
            this.makeCounter = 0;
            this.addCounter = 0;
            this._defaultCounter = game.fps * 5; // 乳沟宽度
            this.combomdom = null;
            this.kill_num = 0;
            this.monster_num = 0;
            this.maxcombo=0;
            this.snap=[];
            var combo = 0;
                //maxcombo = 0;
            this.addCombo = function() {
                if(this.comboCounter <= 0) {
                    combo = 0;
                }
                this.comboCounter = game.fps;
                combo += 1;
                if(combo > this.maxcombo || combo > 4) {
                    this.maxcombo = combo;
                    game.gushblood();
                }
                this.combomshow(combo)
            }
            this.getCombo = function(c) {
                if(c == 'max') {
                    return this.maxcombo;
                }
                return combo;
            }
    }
    var starttips = function(callback){
        var textlist= ['3','2','1','fight'],
            cur = 0,
            len = textlist.length;
        var e = function(){
            var word = textlist[cur]
                text = new Q.Text({
                text : word,
                x : game.width/2- word.length * 10,
                y : game.height/2-40,
                font : '50px tahoma',
                color : '#f00'
            });
            game.stage.addChild(text);
            Q.Tween.to(text,
                { scaleX : 3 , scaleY : 3 ,alpha : 0, x : game.width/2- word.length*30 , y : game.height/2 - 150 },
                {time:1500,
                onComplete:function(tween){
                    game.stage.removeChild(text);
                    cur ++;
                    if(cur < len){
                        e();
                    }else{
                        callback();
                    }
            }});
        }
        e();
    }
    MonsterManager.prototype.start = function(obj){
        if(obj.waves){

            this.type = ns.mission.currentType;
            if(this.type == 'defend'){
                // TODO 塔防模式
                var self = this;
                game.initTower([game.width/2,game.height/2]);
                self.initDefendui();
                self.initAim();
                starttips(function(){
                    self.initWave(obj.waves);
                });
            }else{
                game.initTower([game.width/2,game.height-100]);
                var invader = ns.invader = new ns.Invader();
                    game.stage.addChild(invader);
                    self = this;
                var video = game.video;
                Q.Tween.to(invader,{x: game.width/2-120, y: game.height-180}, {time:230, onComplete:function(tween){
                    self.initWave(obj.waves);
                }});
            }
            // 重置
            this.pasued = false;
            this.kill_num = 0;
            this.maxcombo=0;
            this.monsters = [];
			ns.Score.reset();
        }
    };
    MonsterManager.prototype.initDefendui = function(){

        //背景UI
        this.bgui = new Q.Bitmap({image:ns.R.images['nav_reg'], rect:[0,0,425,80], x: 10 , y:10 });

       // game.viewgroup.UContainer.addChild(this.bgui);

        this.heal_slot = new ns.Defend.skillSlot({
            'x': game.width/5*1,
            'y': 15*game.defaultScale,
            'width' : game.width/6,
            'prop' : 'heal',
            'maxnum' : 8,
            'icon' : 'm1'
        });

        this.ice_slot = new ns.Defend.skillSlot({
            'x': game.width/5*2,
            'y': 15*game.defaultScale,
            'width' : game.width/6,
            'prop' : 'ice',
             'maxnum' : 12,
            'icon' : 'm2'
        });

        this.unbable_slot = new ns.Defend.skillSlot({
            'x': game.width/5*3,
            'y': 15*game.defaultScale,
            'width' : game.width/6,
            'prop' : 'unbable',
            'maxnum' : 12,
            'icon' : 'm3'
        });
		//显示分数
		ns.Score.show();
    };
    MonsterManager.prototype.initAim = function(){

        game.viewgroup.aim = new Quark.Bitmap(QST.extend(ns.R.aim,{
            update: function() {
                this.x = LAPUTA._aimX;
                this.y = LAPUTA._aimY;
            },
            visible: !game.useCam
        }));

        game.viewgroup.SContainer.addChild(game.viewgroup.aim);

        game.stage.addEventListener(game.events[2], function(e){
            if(e.type == game.events[2])
            {
                //dump(e)
                LAPUTA._aimX = e.offsetX;
                LAPUTA._aimY = e.offsetY;
            }

        });
    };
    MonsterManager.prototype.combomshow = function(m) {
        var lastm = m - 1,
            m_str = String(m),
            lm_str = String(lastm),
            fomortarr = [],
            fomortelem = '',
            self = this;

        if(!this.combomdom) {
            this.combomdom = $('<div class="g_mod_combo"><div class="combo_main"></div></div>').appendTo('body');
        }
        if(m_str.length == lm_str.length) {
            QST.each(m_str, function(i, o) {
                var es = '';
                if(o != lm_str[i]) {
                    es = ' data-noscroll="true" ';
                }
                fomortelem += '<div class="combo_item"><ul ' + es + '><li>' + lm_str[i] + '</li><li>' + o + '</li></ul></div>';
            });
        } else {
            QST.each(m_str, function(i, o) {
                var es = '',
                    lmitem = i == 0 ? '' : lm_str[i - 1];
                if(o != lmitem) {
                    es = ' data-noscroll="true" ';
                }
                fomortelem += '<div class="combo_item"><ul ' + es + '><li>' + lmitem + '</li><li>' + o + '</li></ul></div>';
            });
        }
        this.combomdom.find('.combo_main').html(fomortelem).end().show();
        window.setTimeout(function() {
            self.combomdom.find('ul[data-noscroll]').css({
                'top': '-30px'
            });
        }, 0);
    };
    MonsterManager.prototype.initWave = function(w) {
        var self = this;
        this.wave = {
            num: w.length,
            list: [],
            cur: 0
        }
        QST.each(w, function(i, o) {
            var wl = [];
            QST.each(o.monster, function(i, o) {
                QST.each(o, function(i, o) {
                    for(var c = 0; c < o; c++) {
                        wl.push(i);
                    }
                });
            });
            wl.sort(function() {
                return Math.random() > 0.5 ? -1 : 1;
            });
            self.wave.list.push(wl);
            self.monster_num += wl.length;
        });
        this.hasmonster = true;
    };
    MonsterManager.prototype.update = function() {
        if(!this.pasued){
            // 怪物检测方法
            if(this.hasmonster) {
                var self = this;
                if(self.monsters.length) {
                    for(var len = self.monsters.length - 1; len >= 0; len--) {
                        var o = self.monsters[len];

                        if(o.captured){
                            self.monsters.splice(len, 1);
                        }
                        if(this.type == 'defend'){
                            if(o.hitTestObject(game.viewgroup.aim) && !o.captured) {
                                var isdie = o.hurt(1),
                                    bound = o.getBounds();
                                if(isdie) {
                                    self.kill_num+=1;
									ns.Audio.play('m_dead',false);
                                    var flyiconx = 0,
                                        self = this;
                                        flyiconcallback = function(){};
                                    if(o.name == 'm1'){
                                        flyiconcallback = function(){self.heal_slot.addprogress();}
                                        flyiconx = game.width/4*1;
                                    }
                                    if(o.name == 'm2'){
                                        flyiconcallback = function(){self.ice_slot.addprogress();}
                                        flyiconx = game.width/4*2;
                                    }
                                    if(o.name == 'm3'){
                                        flyiconcallback = function(){self.unbable_slot.addprogress();}
                                        flyiconx = game.width/4*3;
                                    }
                                    // 金币 start
                                    var coinfly = ns.Defend.coinfly({
                                        'x' : bound.x + bound.width/2,
                                        'y' : bound.y,
                                        'num' : '+'+o.score
                                    });
                                    // 金币 start
                                    // 战利品 start
                                    var flyicon = new Quark.Bitmap(QST.extend(ns.R.icon[o.name],{
                                        'x' : bound.x + bound.width/2,
                                        'y' : bound.y
                                    }));
                                    game.viewgroup.UContainer.addChild(flyicon);
                                    Q.Tween.to(flyicon, {
                                        'x': flyiconx,
                                        'y': 24,
                                        'alpha': 0.5
                                    }, {
                                        time: 600,
                                        onComplete: function(tween) {
                                            tween.target.parent.removeChild(tween.target);
                                            flyicon = null;
                                            flyiconcallback();
                                        }
                                    });
                                    // 战利品 end
                                    self.addCombo();
									if(self.getCombo()==1) ns.Score.add(o.score);
                                    else ns.Score.add(o.score * Math.pow(self.getCombo(),2));
                                }else{
                                    if(!o.cutinf){
                                        var dir = LAPUTA.calcDirection(  game.viewgroup.aim , o ),
                                            degree = dir.degree;
                                        o.hurtflash = new Quark.Bitmap(QST.extend(ns.R.effect.flash,{
                                            update : function(){
                                                if(--this.hidecount <= 0){
                                                    this.parent.removeChild(this);
                                                }
                                            },
                                            x : bound.x + bound.width/2,
                                            y : bound.y + bound.height/2,
                                            rotation : degree,
                                        }));
                                        o.hurtflash.hidecount = 20 ;
                                        ns.game.viewgroup.UContainer.addChild(o.hurtflash);
                                        o.cutinf = true;  // 受伤状态
                                        o.cutinfcount = 10;  // 受伤状态
										ns.Audio.play('m_hurt',false);
                                    }
                                }
                            }
                        }
                }
            }else{
                var thatwave = self.wave.list[self.wave.cur];
                if(thatwave.length == 0){
                    if(self.wave.cur == self.wave.num - 1) {
                        //TODO 怪物结束
                        dump('wave over');
                        this.hasmonster = false;
                        this.pasued = true;
                        //ns.Score.save();
                        this.gameend('win');
                    } else {
                        self.makeCounter--;
                        if(self.makeCounter == self._defaultCounter - 1) {
                            var _tips;
                            if(self.wave.cur == self.wave.num - 2) {
                                //TODO 最后1波怪
                                dump('last wave');
								ns.Audio.play('finalwave',false);
                                this.initTiplast();
                                _tips = self._tips_lastwave;
                            } else {
                                this.initTipnext();
                                _tips = self._tips_nextwave;
                            }
                            Q.Tween.to(_tips, {
                                'scaleX': 1,
                                'alpha': 1
                            }, {
                                time: 500
                            });
                            setTimeout(function() {
                                    Q.Tween.to(_tips, {
                                        'scaleX': -1,
                                        'alpha': 0
                                    }, {
                                        time: 400,
                                        onComplete: function(tween) {
                                            _tips.parent.removeChild(_tips);
                                        }
                                    });
                                }, self._defaultCounter / game.fps * 700);
                            }
                            if(self.makeCounter == 0) {
                                self.wave.cur += 1;
                                dump('next wave');
                            }
                        }
                        //  大于0 并且 计时器到期
                    } else if(self.wave.cur >= 0 && self.makeCounter == 0) {
                        var thatwave = self.wave.list[self.wave.cur],
                            MAX = LAPUTA.genRandom(1, this.maxScreen),
                            loopn = thatwave.length >= MAX ? MAX : thatwave.length;
                        for(var i = 0; i < loopn; i++) {
                            var m = new ns.Monster(ns.R.monster[thatwave[i]],this.type);
                            m.init();
                            this.container.addChild(m);
                            this.monsters.push(m);
                        }
                        thatwave.splice(0, loopn);
                        self.makeCounter = self._defaultCounter;
                        self.addCounter = Math.floor(game.fps * 2);
                    }
                }
                if(--self.addCounter <= 0){
                    var MAX = LAPUTA.genRandom(1, this.maxScreen),
                        leftnum = MAX - self.monsters.length
                    if(leftnum > 0) {
                        var thatwave = self.wave.list[self.wave.cur],
                            leftlistnum = self.wave.list[self.wave.cur].length,
                            loopn = leftnum >= leftlistnum ? leftlistnum : leftnum;
                        for(var i = 0; i < loopn; i++) {
                            var m = new ns.Monster(ns.R.monster[thatwave[i]],this.type);
                            m.init();
                            this.container.addChild(m);
                            this.monsters.push(m);
                        }
                        self.wave.list[self.wave.cur].splice(0, loopn);
                        self.addCounter = Math.floor(game.fps * 2);
                    }
                }
            }
            // 道具检测方法
            if(this.props.length) {
                for(var len = this.props.length - 1; len >= 0; len--) {
                    var o = this.props[len];
                    if(o.isOutscreen()){
                        o.die();
                        self.props.splice(len, 1);
                        return false;
                    }
                    if(o.hitTestObject(game.viewgroup.aim) && !o.captured) {
                        o.captured = true;
                        o.eat(game.viewgroup.aim.x - o.x);
                        self.props.splice(len, 1);
                    }
                };
            }
            // combom 隐藏
            if(this.comboCounter > 0) {
                this.comboCounter--;
                if(this.comboCounter == 0) {
                    this.combomdom.hide();
                }
            }
        }
    };
    MonsterManager.prototype.gameover = function(){
        //清除怪物
        for(var len = this.monsters.length-1 ; len >=0 ; len--){
            var o = this.monsters[len];
            o.hiden();
        }
        // 删除塔
        game.tower.distory();
        delete game.tower;
        if(this.type == 'defend'){
            // 删除光标
            game.stage.removeChild(game.viewgroup.aim);
            delete game.viewgroup.aim;
            // 删除背景
            game.viewgroup.UContainer.removeChild(this.bgui);
            this.heal_slot.distory();
            this.ice_slot.distory();
            this.unbable_slot.distory();
            delete this.heal_slot;
            delete this.ice_slot;
        }
    };
    MonsterManager.prototype.replay = function(){
        // 结束游戏
        this.start(ns.mission.getLevel());
		ns.Score.reset();
    }
    MonsterManager.prototype.gameend = function(type){
        game.interface.jump('uiEnd', type);
        this.pasued = true;
        this.gameover();
    }
    MonsterManager.prototype.initTipnext = function() {
        if(!this._tips_nextwave) {
            this._tips_nextwave = new Quark.Bitmap(ns.R.tips.nextwave);
        }
        ns.game.stage.addChild(this._tips_nextwave);
    }
    MonsterManager.prototype.initTiplast = function() {
        if(!this._tips_lastwave) {
            this._tips_lastwave = new Quark.Bitmap(ns.R.tips.lastwave);
        }
        ns.game.stage.addChild(this._tips_lastwave);
    }
    MonsterManager.prototype.snapshot = function(){}
})();