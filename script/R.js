(function(){

var ns =  Q.use('laputa'),
    game = ns.game,
    R = ns.R = {},
    defaultStep = 400;
    R.sources = [
        // img
        {'id' :'tower' , 'src' : 'res/img/g_castle.png'},
        {'id' :'tower_move' , 'src' : 'res/img/laputa_move.png'},
        {'id' :'monster1' , 'src' : 'res/img/g_monster1.png'},
        {'id' :'monster2' , 'src' : 'res/img/g_monster2.png'},
        {'id' :'monster3' , 'src' : 'res/img/g_monster3.png'},
        {'id' :'nextwave' , 'src' : 'res/img/next_wave.png'},
        {'id' :'lastwave' , 'src' : 'res/img/last_wave.png'},
		{'id' :'prop_heal' , 'src' : 'res/img/prop_heal.png'},
		{'id' :'prop_bomb' , 'src' : 'res/img/prop_bomb.png'},
		{'id' :'aim' , 'src' : 'res/img/aim.png'},
		{'id' :'bullet' , 'src' : 'res/img/bullet2.png'},
        {'id' :'logo' , 'src' : 'res/img/logo_main.png'},
        {'id' :'lock' , 'src' : 'res/img/lock.png'},
        {'id' :'blood' , 'src' : 'res/img/blood.png'},
        {'id' :'nav_reg' , 'src' : 'res/img/nav_reg.png'},
        {'id' :'prop' , 'src' : 'res/img/prop.png'},
        {'id' :'i_bloody_1' , 'src': 'res/img/bloody_1.png'},
        {'id' :'i_bloody_2' , 'src': 'res/img/bloody_2.png'},
        {'id' :'i_bloody_3' , 'src': 'res/img/bloody_3.png'},
        {'id' :'flash' , 'src' : 'res/img/flash2.png'},
        {'id' :'coin' , 'src' : 'res/img/coin.png'},
        {'id' :'ui' , 'src' : 'res/img/ui.png'},
        {'id' :'brick' , 'src' : 'res/img/brick.png'},
        {'id' :'b0' , 'src' : 'res/img/bg0.jpg'},
        {'id' :'b1' , 'src' : 'res/img/bg1.jpg'},
        {'id' :'b2' , 'src' : 'res/img/bg2.jpg'},
        {'id' :'b3' , 'src' : 'res/img/bg3.jpg'},
        {'id' :'b4' , 'src' : 'res/img/bg4.jpg'},
        {'id' :'gameOver' , 'src' : 'res/img/gameover.png'},
        {'id' :'youWin' , 'src' : 'res/img/youwin.png'},
		{'id' :'scoreNum' , 'src' : 'res/img/scoreNum.png'},
        {'id' :'youWin' , 'src' : 'res/img/youwin.png'},
		{'id' :'prop_eat' , 'src' : 'res/img/w210_h210x8.png'},
        {'id' :'tower_heal' , 'src' : 'res/img/w400_h400x15.png'},
        {'id' :'fire_hit' , 'src' : 'res/img/w250_h90x9.png'},

        // audio
		{'id': 'bg1', 'src': 'res/audio/bg1.ogg', 'loop': true,'volume':15},
		{'id': 'bg2', 'src': 'res/audio/bg2.ogg', 'loop': true,'volume':15},
		{'id': 'bg3', 'src': 'res/audio/bg3.ogg', 'loop': true,'volume':15},
        {'id': 'bg4', 'src': 'res/audio/bg4.ogg', 'loop': true,'volume':15},
		{'id': 'm_hurt', 'src' : 'res/audio/m_hurt.ogg','loop' :false},
		{'id': 'm_dead', 'src' : 'res/audio/m_dead.ogg','loop' :false},
		{'id': 'first_meat', 'src' : 'res/audio/first_meat.ogg','loop' :false},
		{'id': 'first_blood','src' : 'res/audio/first_blood.ogg','loop' :false},
        {'id': 'legendary_kill', 'src' : 'res/audio/legendary_kill.wav','loop' :false},
		{'id': 'start', 'src' : 'res/audio/start.ogg','loop' : true},
		{'id': 'click', 'src' : 'res/audio/buttonclick.ogg','loop' :false},
		{'id': 'dg_easy', 'src' : 'res/audio/dg_easy.ogg','loop' :false},
		{'id': 'dg_nor', 'src' : 'res/audio/dg_nor.ogg','loop' :false},
		{'id': 'dg_hard', 'src' : 'res/audio/dg_hard.ogg','loop' :false},
		{'id': 'light', 'src' : 'res/audio/light.ogg','loop' :false},
		{'id': 'heal', 'src' : 'res/audio/heal.ogg','loop' :false},
		{'id': 'falied', 'src':'res/audio/failed.ogg','loop':false},
		{'id': 'finalwave', 'src':'res/audio/finalwave.ogg','loop':false},
		{'id': 'frozen',  'src':'res/audio/frozen.ogg','loop':false},
		{'id': 'chime', 'src':'res/audio/chime.ogg','loop':false},
		{'id': 'gulp', 'src':'res/audio/gulp.ogg','loop':false},
		{'id': 'armour','src':'res/audio/armour.ogg', loop:false},
        {'id': 'a_blood_death','src':'res/audio/blood_death.wav', loop:false}, /* 爆奶 */
        {'id': 'a_alert','src':'res/audio/alert.wav', loop:false}  /* 爆奶 */

    ];

    R.init = function(){
        var self = this;
        this.images = {};
        this.src = {};
        QST.each(R.sources,function(i,o){
            self.images[o.id] = o.image;
            self.src[o.id] = o.src;
        });
        this.initResources();
    }


    R.initResources = function(){

        var defaultScale = game.width/1920,
            HS = game.height/1080, //height scale
            SW = 1920,
            SH = 1080,
            GW = game.width,
            GH = game.height,
            SR = GH*GH/(GH-30)/(GH-30),
            SR = SR*SR;

        this.bg = {
            'b0' : {
                image : this.images['b0'],
                rect  : [0, 0, 1600, 1200],
                scaleX: game.defaultScale,
                scaleY: game.defaultScale
            },
            'b1' : {
                image : this.images['b1'],
                rect  : [0, 0, 1600, 1200],
                scaleX: game.defaultScale,
                scaleY: game.defaultScale
            },
            'b2' : {
                image : this.images['b2'],
                rect  : [0, 0, 1600, 1200],
                scaleX: game.defaultScale,
                scaleY: game.defaultScale
            }
        };

        /**
        * UI
        */
        this.ui = {
            'logo' : {
                image : this.images['logo'],
                rect  : [0, 0, 937, 502],
                scale : defaultScale,
                x: (SW - 937)/2,
                y: SH*.2
            },
            'blood' : {
                image : this.images['blood'],
                rect  : [0, 0, 1024, 768]
            },
            'btnStart' : {
                scale : defaultScale,
                width : 349,
                height: 174,
                x: (SW - 349)/2,
                y: SH - 174*1.8,
                alpha: .3,
                mixin: {
                    id:  'start',
                    type:'Normal',
                    text:'touch',
                    maxLife:1000
                    //text:'点击开始',
                }
            },
            'btnTypeDefend' : {
                id: 'defend',
                image: this.images['ui'],
                frames:[
                    {label:'normal', rect:[0,0,632,473]},
                    {label:'selected',rect:[0,480,632,473]}
                ],
                scale : game.defaultScale,
                width : 632,
                height: 473,
                x: 120,
                y: 160,
                mixin : {
                        //text: '防守模式',
                        type: 'Type',
                        default: true
                }
            },
            'btnTypeInvader' : {
                id: 'invader',
                image:this.images['ui'],
                frames:[
                    {label:'normal',  rect:[660,0,600,500]},
                    {label:'selected',rect:[660,500,600,500]}
                ],
                scale : game.defaultScale,
                width : 600,
                height: 500,
                x: 520,
                y: 140,
                mixin : {
                    //text: '侵略模式',
                    type: 'Type',
                    locked:true
                }
            },
            'btnTypeStart' : {
                 id: 'start',
                image : this.images['ui'],
                frames:[
                    {label:'normal',  rect:[0, 1020, 349, 174]},
                    {label:'selected',rect:[0, 1220, 349, 174]}
                ],
                scale : game.defaultScale,
                width : 349,
                height: 174,
                x:370,
                y:530,
                mixin: {
                    type:'Normal'
                }
            },
            'btnLevelStart' : {
                id:'start',
                image : this.images['ui'],
                frames:[
                    {label:'normal',  rect:[0, 1440, 349, 174]},
                    {label:'selected',rect:[0, 1220, 349, 174]}
                ],
                scale : defaultScale*1.3,
                width : 349,
                height: 174,
                x: (SW - 349*1.5)/1.3,
                y: (SH-174)/2,
                mixin : {
                    type:'Normal'
                }
            },
            'btnBack' : {
                id: 'back',
                image : this.images['ui'],
                frames:[
                    {label:'normal',  rect:[740, 2040, 225, 240]},
                    {label:'selected',rect:[740, 2040, 225, 240]}
                ],
                scale : defaultScale,
                width : 225,
                height: 240,
                x: SW*.01,
                y: SH*.013,
                mixin : {
                    //text:'BACK',
                    type: 'Normal'
                }
            },
            'btnLevel1' : {
                id: 'Level_1',
                image:this.images['ui'],
                frames:[
                    {label:'normal',  rect:[1280,0,391,424]},
                    {label:'selected',rect:[1680,0,391,424]}
                ],
                scale : defaultScale,
                width : 391,
                height: 424,
                x: GW*.09,
                y: 260,
                mixin : {
                    type: 'Level',
                    default: true
                }
            },
            'btnLevel2' : {
                id: 'Level_2',
                image:this.images['ui'],
                frames:[
                    {label:'normal',  rect:[1280,440,445,320]},
                    {label:'selected',rect:[1740,440,445,320]}
                ],
                scale : defaultScale,
                width : 445,
                height: 320,
                x: 510,
                y: 290,
                mixin : {
                    type: 'Level'
                }
            },
            'btnLevel3' : {
                id: 'Level_3',
                image:this.images['ui'],
                frames:[
                    {label:'normal',  rect:[1280,780,373,367]},
                    {label:'selected',rect:[1680,780,373,367]}
                ],
                scale : defaultScale,
                width : 373,
                height: 367,
                x: GW*.1,
                y: 650,
                mixin : {
                    type: 'Level'
                }
            },
            'btnLevel4' : {
                id: 'Level_4',
                image:this.images['ui'],
                frames:[
                    {label:'normal',  rect:[1280,1160,372,359]},
                    {label:'selected',rect:[1660,1160,372,359]}
                ],
                scale : defaultScale,
                hRect : [0, 0, 372, 359],
                width : 372,
                height: 359,
                x: 600,
                y: 580,
                mixin:{
                    type: 'Level'
                }
            },
            'btnReplay' : {
                id: 'replay',
                image : this.images['ui'],
                frames:[
                    {label:'normal',  rect:[0, 1800, 301, 152]},
                    {label:'selected',rect:[0, 1800, 301, 152]}
                ],
                scale : defaultScale * 1.3,
                width : 301,
                height: 152,
                x: SW/4/1.3,
                y: .5*GH*SR,
                mixin : {
                    type:'Normal'
                }
            },
            'btnNext' : {
                id: 'next',
                image : this.images['ui'],
                frames:[
                    {label:'normal',  rect:[740, 1880, 301, 152]},
                    {label:'selected',rect:[0, 1960, 301, 152]}
                ],
                scale : defaultScale * 1.3,
                width : 301,
                height: 152,
                x: SW/4*3/1.3 - 301,
                y: .5*GH*SR,
                mixin:{
                    type:'Normal'
                }
            },
            'lock' : {
                image : this.images['ui'],
                frames:[
                    {label:'lock',  rect:[440, 1220, 113, 124]},
                    {label:'unlock',rect:[560, 1020, 113, 124]}
                ],
                scale : game.defaultScale,
                width : 179,
                height: 196
            },
            'stars' : {
                image : this.images['ui'],
                frames:[
                    {label:'0', rect:[380, 1362, 265, 100]},
                    {label:'1', rect:[380, 1462, 265, 100]},
                    {label:'2', rect:[380, 1562, 265, 100]},
                    {label:'3', rect:[380, 1662, 265, 100]}
                ],
                scale : game.defaultScale,
                width : 265,
                height: 100
            },
            'gameOver' : {
                id: 'gameOver',
                image : this.images['gameOver'],
                frames:[
                    {label:'0', rect:[100, 100, 600, 400]}
                ],
                scale : defaultScale *1.5,
                width : 600,
                height: 400,
                x: -500,
                y: -500
            },
            'youWin' : {
                id: 'youWin',
                image : this.images['youWin'],
                frames:[
                    {label:'0', rect:[100, 100, 600, 400]}
                ],
                scale : defaultScale *1.5,
                width : 600,
                height: 400,
                x: -500,
                y: -500
            },
            mask: {
                id: 'mask',
                scale : 1,
                width : game.width,
                height: game.height,
                alpha : .6,
                x:0,
                y:0,
                fillStyle: '#000'
            }
        };


        /**
        * 怪物属性集
        * @attack_dis      怪物攻击距离
        * @attack          怪物攻击�?
        * @speed           怪物移动速度
        * @hp              怪物生命�?
        * @skill_hit       是否会撞击术
        * @skill_fireball  是否会火球术
        * @skill_shield    是否会护盾术
        * @skill_brick     是否会砖头术
        * @step            到达目标的步�?(移动速度)
        * @score            金币
        */
        var monster1 = {
            name : 'm1',
            image:this.images['monster1'],
            frames:[
                {rect:[0,0,400,400], label:"moving"},//1.正常
                {rect:[400,0,400,400]},
                {rect:[800,0,400,400]},
				{rect:[1600,0,400,400]},
				{rect:[2000,0,400,400]},
				{rect:[2400,0,400,400]},
				{rect:[2800,0,400,400]},
				{rect:[3200,0,400,400]},
                {rect:[3600,0,400,400], jump:"moving"},

                {rect:[0,400,400,400], label:"attack"},//2.攻击
                {rect:[400,400,400,400]},
                {rect:[800,400,400,400]},
				{rect:[1600,400,400,400]},
				{rect:[2000,400,400,400]},
				{rect:[2400,400,400,400]},
				{rect:[2800,400,400,400]},
				{rect:[3200,400,400,400]},
				{rect:[3600,400,400,400]},
				{rect:[4000,400,400,400]},
				{rect:[4400,400,400,400]},
				{rect:[4800,400,400,400]},
				{rect:[5200,400,400,400]},
                {rect:[5600,400,400,400], jump:"moving"},

                {rect:[0,800,400,400], interval : 25 , label:"being_attacked"},//3.被攻�?
                {rect:[400,800,400,400], interval : 25 , jump:"moving"},

                {rect:[0,1200,400,400], label:"freeze"},//4.凝固
                {rect:[400,1200,400,400], jump:"freeze"},

                {rect:[0,1600,400,400], label:"capture"},//5.死亡
                {rect:[400,1600,400,400]},
                {rect:[800,1600,400,400]},
				{rect:[1600,1600,400,400]},
				{rect:[2000,1600,400,400]},
				{rect:[2400,1600,400,400]},
				{rect:[2800,1600,400,400]},
				{rect:[3200,1600,400,400]},
				{rect:[3600,1600,400,400]},
				{rect:[4000,1600,400,400]},
				{rect:[4400,1600,400,400]},
				{rect:[4800,1600,400,400]},
				{rect:[5200,1600,400,400]},
                {rect:[5600,1600,400,400]}
            ],
            scaleX : game.defaultScale,
            scaleY : game.defaultScale,
            polyArea:[{x:103,y:67}, {x:206,y:67}, {x:103,y:166}, {x:206,y:166}],
            mixin:{regX:52, regY:52,useFrames:true, interval:10 , speed:1 , attack_dis:Math.floor(70*game.defaultScale) , skill_hit:true , attack:1 , hp:4 , step : defaultStep , score:40 }
        },monster2 = {
            name : 'm2',
            image:this.images['monster2'],
            frames:[
                {rect:[0,0,200,200], label:"moving"},//1.正常
                {rect:[200,0,200,200]},
                {rect:[400,0,200,200]},
				{rect:[600,0,200,200]},
				{rect:[800,0,200,200]},
				{rect:[1000,0,200,200]},
                {rect:[1200,0,200,200]},
                {rect:[1400,0,200,200]},
				{rect:[1600,0,200,200]},
				{rect:[1800,0,200,200]},
				{rect:[2000,0,200,200]},
                {rect:[2200,0,200,200], jump:"moving"},

                {rect:[0,200,200,200],label:"attack"},//2.攻击
                {rect:[200,200,200,200]},
                {rect:[400,200,200,200]},
				{rect:[600,200,200,200]},
				{rect:[800,200,200,200]},
				{rect:[1000,200,200,200]},
                {rect:[1200,200,200,200], jump:"moving"},

                {rect:[0,400,200,200], interval : 25 , label:"being_attacked"},//3.被攻�?
                {rect:[200,400,200,200], interval : 25 , jump:"moving"},

                {rect:[0,600,200,200], label:"freeze"},//4.凝固
                {rect:[200,600,200,200], jump:"freeze"},

                {rect:[0,800,200,200], label:"capture"},//5.死亡
                {rect:[200,800,200,200]},
                {rect:[400,800,200,200]},
				{rect:[600,800,200,200]},
				{rect:[800,800,200,200]},
				{rect:[1000,800,200,200]},
                {rect:[1200,800,200,200]},
                {rect:[1400,800,200,200]},
				{rect:[1600,800,200,200]},
                {rect:[1800,800,200,200]}
            ],
            scaleX : game.defaultScale,
            scaleY : game.defaultScale,
            polyArea:[{x:81,y:35},{x:180,y:35},{x:81,y:135},{x:180,y:135}],
            mixin:{regX:49,regY:60,useFrames:true, interval:7 , speed:1 , attack_dis:Math.floor(400*game.defaultScale) , attack:3 , hp:20 , skill_fireball:true , step : defaultStep*1.5  , score:60 }
        },monster3 = {
            name : 'm3',
            image:this.images['monster3'],
            frames:[
                {rect:[0,0,450,450], label:"moving"},
                {rect:[450,0,450,450], jump:"moving"},

                {rect:[0,450,450,450],label:"attack"},//2.攻击
                {rect:[450,450,450,450]},
                {rect:[900,450,450,450]},
                {rect:[1350,450,450,450]},
                {rect:[1800,450,450,450]},
                {rect:[2250,450,450,450]},
                {rect:[2700,450,450,450]},
                {rect:[3150,450,450,450]},
                {rect:[3600,450,450,450]},
                {rect:[4050,450,450,450]},
                {rect:[4500,450,450,450]},
                {rect:[4950,450,450,450]},
                {rect:[5400,450,450,450]},
                {rect:[5850,450,450,450], jump:"moving"},

                {rect:[0,900,450,450], interval : 25 , label:"being_attacked"},//3.被攻�?
                {rect:[450,900,450,450], interval : 25 , jump:"moving"},

                {rect:[0,1350,450,450], label:"freeze"},//4.凝固
                {rect:[450,1350,450,450], jump:"freeze"},

                {rect:[0,1800,450,450], label:"capture"},//5.死亡
                {rect:[450,1800,450,450]},
                {rect:[900,1800,450,450]},
                {rect:[1350,1800,450,450]},
                {rect:[1800,1800,450,450]},
                {rect:[2250,1800,450,450]},
                {rect:[2700,1800,450,450]},
                {rect:[3150,1800,450,450]},
                {rect:[3600,1800,450,450]},
                {rect:[4050,1800,450,450]},
                {rect:[4500,1800,450,450]},
            ],
            scaleX : game.defaultScale,
            scaleY : game.defaultScale,
            polyArea:[{x:170, y:175}, {x:293, y:175}, {x:170, y:262}, {x:293, y:262}],
            mixin:{regX:225,regY:225,useFrames:true, interval:7 , speed:1 , attack_dis:Math.floor(140*game.defaultScale) , attack:3 , hp:20 , skill_brick:true , step :defaultStep  , score:60 }
        };

        this.monster = [monster1,monster2,monster3];
		/**
        * 塔属性集�?
        * @hp              当前生命�?
		* @maxhp           最大生命�?
        * @isProtected     是否有受保护
		* @state           塔状态{normal,broken,over}
        */
        this.tower = {
            image:this.images['tower'],
            frames:[
                {rect:[0,0,500,500], label:"normal"},//1.正常
                {rect:[500,0,500,500]},
                {rect:[1000,0,500,500], jump:"normal"},

                {rect:[0,500,500,500], label:"normal_unbable"},//2.正常+护盾
                {rect:[500,500,500,500]},
		        {rect:[1000,500,500,500],label:"normal_unbable_repeat"},
                {rect:[1500,500,500,500], jump:"normal_unbable_repeat"},

                {rect:[0,1000,500,500], label:"broken"},//3.一半血
                {rect:[500,1000,500,500]},
                {rect:[1000,1000,500,500], jump:"broken"},

                {rect:[0,1500,500,500], label:"broken_unbable"},//4.一半血+护盾
                {rect:[500,1500,500,500]},
		        {rect:[1000,1500,500,500],label:"broken_unbable_repeat"},
                {rect:[1500,1500,500,500], jump:"broken_unbable_repeat"},

                {rect:[0,2000,500,500], label:"over"},//5.摧毁
                {rect:[500,2000,500,500]},
                {rect:[1000,2000,500,500], jump:"over"},
            ],
            scaleX : game.defaultScale,
            scaleY : game.defaultScale,
            polyArea : [{x:215,y:150},{x:290,y:150},{x:215,y:330},{x:290,y:330}],
            mixin:{regX:250, regY:250, useFrames:true, interval:7, hp:35, maxhp:35, isProtected:false, state:"normal"}
		};


        this.aim = {
            image : this.images['aim'],
            rect : [ 15,17,94,82 ],
            alpha : 0.5,
            x:-300,
            y:-300,
            polyArea:[{x:0, y:0}, {x:94, y:0}, {x:0, y:82}, {x:94, y:82}],
            scaleX : game.defaultScale,
            scaleY : game.defaultScale,
            mixin : {regX:47, regY:41}
        }

        this.tips = {
            "nextwave" : {
                image:this.images['nextwave'],
                rect:[0,0,485,43],
                x : ns.game.width/2,
                y : ns.game.height/2 - 17,
                scaleX : -1,
                regX : 243,
                regY : 17,
                alpha : 0
            },
            "lastwave" : {
                image:this.images['lastwave'],
                rect:[0,0,258,67],
                x : ns.game.width/2,
                y : ns.game.height/2 - 17,
                scaleX : -1,
                regX : 123,
                regY : 33,
                alpha : 0
            }
        }

        this.effect= {
            "flash" : {
                image:this.images['flash'],
                rect:[0,0,20,358],
                regX : 10,
                regY : 179,
                scaleX : game.defaultScale,
                scaleY : game.defaultScale
            },
            "blood_1" : {
                image:this.images['i_bloody_1'],
                rect:[0,0,1024,768],
                x : 0
            },
            "blood_2" : {
                image:this.images['i_bloody_2'],
                rect:[0,0,1024,768],
                x : 0
            },
            "blood_3" : {
                image:this.images['i_bloody_3'],
                rect:[0,0,1024,768],
                x : 0
            },
            "tower_heal" : {
                image:this.images['tower_heal'],
                frames:[
                    {rect:[0,0,400,400]},
                    {rect:[400,0,400,400]},
                    {rect:[800,0,400,400]},
                    {rect:[1200,0,400,400]},
                    {rect:[1600,0,400,400]},
                    {rect:[2000,0,400,400]},
                    {rect:[2400,0,400,400]},
                    {rect:[2800,0,400,400]},
                    {rect:[3200,0,400,400]},
                    {rect:[3600,0,400,400]},
                    {rect:[4000,0,400,400]},
                    {rect:[4400,0,400,400]},
                    {rect:[4800,0,400,400]},
                    {rect:[5200,0,400,400]},
                    {rect:[5600,0,400,400]}
                ],
                scaleX : game.defaultScale,
                scaleY : game.defaultScale,
                mixin:{regX:200, regY:200, useFrames:true, interval:6}
            },
            "prop_eat" : {
                image:this.images['prop_eat'],
                frames:[
                    {rect:[0,0,210,210]},
                    {rect:[210,0,210,210]},
                    {rect:[420,0,210,210]},
                    {rect:[630,0,210,210]},
                    {rect:[840,0,210,210]},
                    {rect:[1050,0,210,210]},
                    {rect:[1260,0,210,210]}
                ],
                scaleX : game.defaultScale,
                scaleY : game.defaultScale,
                mixin:{regX:105, regY:105, useFrames:true, interval:3}
            },
            "fire_hit" : {
                image:this.images['fire_hit'],
                frames:[
                    {rect:[0,0,250,90]},
                    {rect:[250,0,250,90]},
                    {rect:[500,0,250,90]},
                    {rect:[750,0,250,90]},
                    {rect:[1000,0,250,90]},
                    {rect:[1250,0,250,90]},
                    {rect:[1500,0,250,90]},
                    {rect:[1750,0,250,90]},
                    {rect:[2000,0,250,90]}
                ],
                scaleX : game.defaultScale,
                scaleY : game.defaultScale,
                mixin:{regX:125, regY:45, useFrames:true, interval:3}
            }
        }

        this.icon = {
            'm1' : {
                image : this.images['prop'],
                rect : [ 0, 0, 100, 100 ],
                mixin : {regX:27, regY:31},
                scaleX : game.defaultScale,
                scaleY : game.defaultScale
            },
            'm2' : {
                image : this.images['prop'],
                rect : [ 200,0,100,100 ],
                mixin : {regX:36, regY:31},
                scaleX : game.defaultScale,
                scaleY : game.defaultScale
            },
            'm3' : {
                image : this.images['prop'],
                rect : [ 400,0,100,100 ],
                mixin : {regX:36, regY:31},
                scaleX : game.defaultScale,
                scaleY : game.defaultScale
            },
            'coin' : {
                image : this.images['coin'],
                frames:[
                    {rect:[0,0,30,30]},
                    {rect:[0,30,30,30]},
                    {rect:[0,60,30,30]},
                    {rect:[0,90,30,30]},
                    {rect:[0,120,30,30]},
                    {rect:[0,150,30,30]},
                    {rect:[0,180,30,30]},
                    {rect:[0,210,30,30]},
                    {rect:[0,240,30,30]},
                    {rect:[0,270,30,30]}
                ],
                scaleX : game.defaultScale,
                scaleY : game.defaultScale,
                mixin:{regX:10,regY:10,useFrames:true, interval:4}
            }
        }
        this.skill = {
            'fireball' : {
                image : this.images['bullet'],
                frames:[
                    {rect:[0,0,50,100],label:"moving"},
                    {rect:[50,0,50,100]},
					{rect:[100,0,50,100],jump:"moving"},
					{rect:[100,0,50,100],label:"hit",interval:7},
					{rect:[100,0,50,100],interval:7},
					{rect:[100,0,50,100],interval:7},
					{rect:[100,0,50,100],interval:7},
                    {rect:[100,0,50,100],interval:15},
                ],
                mixin : { regX:25,regY:50,speed:3,interval:2},
                scaleX : game.defaultScale,
                scaleY : game.defaultScale
            },
             // 抛出砖头类型
            'brick0' : {
                image : this.images['brick'],
                rect : [ 0,0,63,51 ],
                mixin : {regX:31, regY:25 },
                scaleX : game.defaultScale,
                scaleY : game.defaultScale
             },
            'brick1' : {
                image : this.images['brick'],
                rect : [ 0,0,63,51 ],
                mixin : {regX:31, regY:25 },
                scaleX : game.defaultScale,
                scaleY : game.defaultScale
             },
            'brick2' : {
                image : this.images['brick'],
                rect : [0,0,63,51],
                mixin : {regX:31,regY:25},
                scaleX : game.defaultScale,
                scaleY : game.defaultScale
             }
        }

		/**
        * 道具属性集�?
        * @hp              当前生命�?
		* @maxhp           最大生命�?
        * @isProtected     是否有受保护
		* @state           状态{normal}
		* @step            到达终点的步伐（移动速度�?
        */
		this.Prop={
			"heal":{
				image:this.images['prop'],
				frames:[
					//{rect:[100,100,100,100],label:"gray",jump:"gray"},
                    {rect:[100,0,100,100],label:"normal",jump:"normal"}
	            ],
                scaleX : game.defaultScale,
                scaleY : game.defaultScale,
				polyArea:[{x:0, y:0}, {x:100, y:0}, {x:100, y:100}, {x:0, y:100}],
				mixin:{regX:50, regY:50, useFrames:true, interval:10, prop_type:"heal", state:"normal",speed:3,healhp:10}
			},
			"bomb":{
				image:this.images['prop_bomb'],
				frames:[
					{rect:[0,0,84,75], label:"normal"}
	            ],
                scaleX : game.defaultScale,
                scaleY : game.defaultScale,
				polyArea:[{x:0, y:0}, {x:84, y:0}, {x:84, y:75}, {x:0, y:84}],
				mixin:{ regX:50, regY:50, useFrames:true, interval:10, prop_type:"bomb", state:"normal",speed:3}
			},
			"ice":{
				image:this.images['prop'],
				frames:[
					//{rect:[300,100,100,100], label:"gray",jump:"gray"},
                    {rect:[300,0,100,100], label:"normal",jump:"normal"}
	            ],
                scaleX : game.defaultScale,
                scaleY : game.defaultScale,
				polyArea:[{x:0, y:0}, {x:100, y:0}, {x:100, y:100}, {x:0, y:100}],
				mixin:{ regX:50, regY:50, useFrames:true, interval:10, prop_type:"ice", state:"normal", speed:3, icetime:ns.game.fps*4}
			},
			"unbable":{
				image:this.images['prop'],
				frames:[
					//{rect:[500,100,100,100], label:"gray",jump:"gray"},
                    {rect:[500,0,100,100], label:"normal",jump:"normal"}
	            ],
                scaleX : game.defaultScale,
                scaleY : game.defaultScale,
				polyArea:[{x:0, y:0}, {x:100, y:0}, {x:100, y:100}, {x:0, y:100}],
				mixin:{ regX:50, regY:50, useFrames:true, interval:10, prop_type:"unbable", state:"normal",speed:3,unbabletime:ns.game.fps*10}
			},
			"hurt":{
				image:this.images['prop_bomb'],
				frames:[
					{rect:[0,0,84,75], label:"normal"}
	            ],
                scaleX : game.defaultScale,
                scaleY : game.defaultScale,
				polyArea:[{x:0, y:0}, {x:84, y:0}, {x:84, y:75}, {x:0, y:84}],
				mixin:{ regX:50, regY:50, useFrames:true, interval:10, prop_type:"hurt", state:"normal",speed:6, hurthp:10}
			}
		};
		/**
        * scoreNum 分数显示
        *
        */
		this.scoreNum =
		{
			image: this.images['scoreNum'],
			9: [0, 0, 20, 24],
			8: [0, 24, 20, 24],
			7: [0, 48, 20, 24],
			6: [0, 72, 20, 24],
			5: [0, 96, 20, 24],
			4: [0, 120, 20, 24],
			3: [0, 144, 20, 24],
			2: [0, 168, 20, 24],
			1: [0, 192, 20, 24],
			0: [0, 216, 20, 24]
		};

	};
})();