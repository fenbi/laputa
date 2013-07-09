/*
    Module
    关卡模块
 */
(function(){
    var log = dump;

    var ns = Q.use("laputa"),
        game = ns.game;

    var currentType = 'defend',
        currentLevel = 0;

    var Mission = ns.Mission = function(fn){

        //默认关卡模式 防守
    	this.currentType = currentType;
    	// 关卡从0开始
    	this.currentLevel = currentLevel;
    	this.init(fn);
    };

    /*
        初始化
    */
    Mission.prototype.init = function(fn){

        //数据配置
    	var Levels = this.Levels = {
            //防守关卡
            defend: [
                {
                    id:'n1',
                    locked: false,
                    ready : true,
                    stars : 1,
                    waves:[
                        //wave 1
                        {
                            monster: [{0: 3},{1: 3},{0: 6},{1: 6},{0: 10},{1: 10}]
                        },
                        //wave 2
                        {
                            monster: [{0: 15}]
                        },
                        //wave 3
                        {
                            monster: [{1: 20}]
                        }
                    ]
                },
                {
                    id:'n2',
                    locked: false,
                    ready : true,
                    stars : 2,
                    waves:[
                        //wave 1
                        {
                            monster: [{0: 15}]
                        },
                        //wave 2
                        {
                            monster: [{1: 10}]
                        },
                        //wave 3
                        {
                            monster: [{0: 15}, {1: 10}]
                        }
                    ]
                },
                {
                    id:'n3',
                    locked: false,
                    ready : true,
                    stars : 3,
					waves:[
                        //wave 1
                        {
                            monster: [{0: 10}, {1: 8}]
                        },
                        //wave 2
                        {
                            monster: [{0: 8}, {2: 10}]
                        },
                        //wave 3
                        {
                            monster: [{0:8},{1: 8}, {2: 8}]
                        }
                    ]
                },
                {
                    id:'n4',
                    locked: true,
                    ready : false, //还未开发完成
                    stars : 0,
                    waves:[
                        //wave 1
                        {
                            monster: [{0: 20}, {1: 20}]
                        },
                        //wave 2
                        {
                            monster: [{0: 10}, {1: 10}, {2: 10}]
                        },
                        //wave 3
                        {
                            monster: [{0: 15}, {1: 15}, {2: 15}]
                        },
                        //wave 4
                        {
                            monster: [{0: 10}, {1: 10}, {2: 10}, {3: 1}]
                        }
                    ]
                }
            ],
            //侵略关卡
            invader:[
                {
                    id:'n1',
                    locked: true,
                    ready : false, //还未开发完成
                    stars : 0,
                    waves:[
                        //wave 1
                        {
                            monster: [{0: 5}]
                        },
                        //wave 2
                        {
                            monster: [{0: 10}]
                        }
                    ]
                },
                {
                    id:'n2',
                    locked: true,
                    ready : false, //还未开发完成
                    stars : 0,
                    waves:[
                        //wave 1
                        {
                            monster: [{0: 5}, {1: 5}]
                        },
                        //wave 2
                        {
                            monster: [{0: 10}, {1: 10}]
                        }
                    ]
                },
                {
                    id:'n3',
                    locked: true,
                    ready : false, //还未开发完成
                    stars : 0,
                    waves:[
                        //wave 1
                        {
                            monster: [{0: 5}, {1: 5}, {2: 5}]
                        },
                        //wave 2
                        {
                            monster: [{0: 10}, {1: 10}, {2: 10}]
                        },
                        //wave 3
                        {
                            monster: [{0: 15}, {1: 15}, {2: 15}]
                        }
                    ]
                },
                {
                    id:'n4',
                    locked: true,
                    ready : false, //还未开发完成
                    stars : 0,
                    waves:[
                        //wave 1
                        {
                            monster: [{0: 5}, {1: 5}, {2: 5}]
                        },
                        //wave 2
                        {
                            monster: [{0: 10}, {1: 10}, {2: 10}]
                        },
                        //wave 3
                        {
                            monster: [{0: 15}, {1: 15}, {2: 15}]
                        },
                        //wave 4
                        {
                            monster: [{0: 10}, {1: 10}, {2: 10}, {3: 1}]
                        }
                    ]
                }
            ]
        };

        
        if(game.useServe){
            /*
                初始化
             */
            var self  = this;
            ns.Score.prototype.level(function(d) {

                self.loaded = true;

                var i = d.length;
                var defend  = Levels.defend;
                var invader = Levels.invader;
                var dd;

                while(i--){
                    dd = d[i];
                    
                
                    if( dd.type === 0 ) {

                        if(defend[dd.level].ready) defend[dd.level].locked = false;
                        defend[dd.level].stars    = Math.round(parseInt(dd.kill_num)*3/self.countMonster(dd.level));
                        defend[dd.level].maxScore = dd.maxScore;

                    } else {

                        if(invader[dd.level].ready) invader[dd.level].locked = false;
                        invader[dd.level].stars    = Math.round(parseInt(dd.kill_num)*3/self.countMonster(dd.level));
                        invader[dd.level].maxScore = dd.maxScore;
                    }
                }

                //log(Levels)
            });
        }
        

    	this.length = function() {
            return Levels[currentType].length;
        };
    };

   /**
    * 下一关
    * @return {Object}
    */
    Mission.prototype.next = function(){

    	if (this.currentLevel === this.length() - 1) {

    		log('已经是最后一关,返回当前关');

    	}else if( this.getLevel(this.currentLevel+1).ready ) {

            this._unLock();
            this.currentLevel ++;
            
    	}
        
        log('下个关卡还在开发中');

        return this.getLevel();
    };

   /**
    * 上一关
    * @return {Object}
    */
    Mission.prototype.prev = function(){

    	if ( this.currentLevel === 0 ) {

    		log('已经是第一关');
    		
    	}else{

    		this.currentLevel --;

    	}

        return this.getLevel();
    };


   /**
    * 激活下个关卡
    * @return {Boolean}
    */
    Mission.prototype._unLock = function(){

        //监测下一关卡是否激活
        var nextLevel = this.Levels[currentType][this.currentLevel+1];
        if(nextLevel.locked === true && nextLevel.ready){

            this.Levels[currentType][this.currentLevel+1].locked = false;
            /*
                更新UI
             */
            game.interface.updateLevelUI();

            return true;
        }
        return false;
    };

   /**
    * 是否锁定
    * @param  {Number}
    * @return {Boolean}
    */
    Mission.prototype.isLocked = function(n){

        return this.Levels[currentType][n].locked;
    };

   /**
    * 设定当前关卡
    * @param  {Number}
    * @return {Boolean}
    */
    Mission.prototype.setLevel = function(n){
        return this.currentLevel = isNaN(n) ? this.currentLevel : n;
    };

    /**
    * 选择关卡
    * @param  {Number} n 可选
    * @return {Object} 关卡数据
    */
    Mission.prototype.getLevel = function(n){
        if(isNaN(n)){
            //log(this.Levels[this.currentLevel]);
            return this.Levels[currentType][this.currentLevel];

        }else if(n >= 0 && n < this.length() && !this.isLocked(n)){
            log('选择了关卡: ' + n);
            return this.Levels[currentType][n];
        }
        log('out of range');
        return false;
    };


   /**
    * 设定当前模式
    * @param  {String}
    * @return {String}
    */
    Mission.prototype.setType = function(type){
        return currentType = this.currentType = type || this.currentType;
    };

   /**
    * 获取当前类型所有关卡数据
    * @param  {Number} n 可选
    * @return {Array}
    */
    Mission.prototype.getCurrentMission = function(){
        return this.Levels[currentType];
    };



    /**
    * 计算当前关卡怪物总数
    * @return  {Number}
    */
    Mission.prototype.countMonster = function(n){

        var n = isNaN(n)? this.currentLevel : n;
        var waves = this.Levels[currentType][n].waves,
            i = waves.length,
            c = 0,
            m, j = 0, k;

        while(i--) {
            m = waves[i].monster;
            j = m.length;

            while(j--){

                c += m[j]['0'] ? m[j]['0'] : 0;
                c += m[j]['1'] ? m[j]['1'] : 0;
                c += m[j]['2'] ? m[j]['2'] : 0;
                c += m[j]['3'] ? m[j]['3'] : 0;
            }
        }

        return c;
    };

})();