(function() {
    var ns = Q.use('laputa'),
        L = LAPUTA;

    QST.ready(function() {
        setTimeout(function() {
            game.load();
        }, 10);
    });

    var game = ns.game = {
        width: 1024,
        height: 768,
        //width: screen.width,
        //height: screen.height,
        fps: 60,
        frames: 0,
        useCam: true,  //启用摄像头
        useServe: false, //使用服务器
        params: null,
        mod: 1, // use canvas
        events: Q.supportTouch ? ["touchstart", "touchend", "touchmove"] : ["mousedown", "mouseup", "mousemove"],
        load: function() {
            var self = this;
            if(Q.isIpod || Q.isIphone) {
                this.width  = 980;
                this.height = 545;
                Q.addMeta({
                    name: "viewport",
                    content: "user-scalable=no"
                });
            }
            this.container = $('#container');
            var w = this.width,
                h = this.height;
           
            this.container.css({'margin': -h/2+'px auto auto -'+w/2+'px'});

            var $loadinfo  = $('<div>正在加载资源<strong>0%</strong>中，请稍候...</div>').appendTo(this.container);

            /*
                加载关卡数据
             */
            ns.mission = new ns.Mission();

            L.loader.preload(ns.R.sources, function(e) {
                $loadinfo.find('strong').html(e * 100 + '%');
                if(e == 1) {
                    ns.R.init();
                    setTimeout(function() {
                        $loadinfo.remove(); // 加载完成
                        self.startup();
                    }, 10);
                }
            });
            window.scrollTo(0, 1);
            this.defaultScale = this.width / 1920;
        },
        update: function(timeInfo) {
            this.frames++;
            this.Manager.update();
        },
        startup: function() {

         
            /**
             * close window
             * For 客户端
             */
            $('.g-btn-close').click(function(){
                window.close();
            });

            var self = this;

           
            var $canvas = $('<canvas>').attr('id', 'canvas').attr('width', this.width).attr('height', this.height).appendTo(this.container);

            this.context = new Quark.CanvasContext({
                canvas: $canvas[0]
            });

            this.stage = new Q.Stage({
                width: this.width,
                height: this.height,
                context: this.context,
                update: Q.delegate(this.update, this)
            });

            self.initUI();

            //self.bg = [];
            //self.bg.push( new Quark.Bitmap(ns.R.bg['b0']) );
            //self.bg.push( new Quark.Bitmap(ns.R.bg['b1']) );
            //self.viewgroup.BGContainer.addChild( self.bg[1], self.bg[0] );

             this.bg = $('<ul class="bg"><li class="a"></li><li class="b"></li></ul>').css({
                'width' : this.width,
                'height' : this.height
            }).appendTo(this.container);

            this.bg.find('.a').css({
                "background-image" : "url('"+ns.R.src['b0']+"')"
            }).addClass('cur');
            this.bgname = 'b0';


            // 启动怪物管理器
            self.Manager = new ns.MonsterManager(self.viewgroup.MContainer);

            function initAll(){

                var initInterface = function() {

                    self.interface = new ns.Interface(
                        self.viewgroup.UIcontainer,
                        {
                            start: function(){},

                            //选择玩法
                            startType:  function() {
                            },
                            //游戏开始
                            startLevel: function() {
                                self.Manager.start(ns.mission.getLevel());
                            },
                            //重玩本局
                            replay: function() {
                                dump('replay');
                                //dump(this.Manager);
                                self.Manager.replay();
                            },
                            //返回
                            back: function(){
                            }
                        }
                    );
                }

                if(self.useCam){
                    //体感初始化
                    AT.init(
                    {
                        width:  self.width,
                        height: self.height,
                        ctx:    self.context,
                        sync: function(xy) {
                            LAPUTA._aimX = xy[0];
                            LAPUTA._aimY = xy[1];
                        },
                        success: function(){

                            var video = self.video = new Q.Bitmap({
                                    id : 'video',
                                    image: AT.getImage({ type: 'video' }),
                                    alpha:.2
                                    //visible: false
                                });
                            self.stage.addChild(video);
                            self.stage.setChildIndex(video, 2);
                            initInterface();
                            self.interface.jump('uiStart');
                        },
                        error: function() {
                            self.useCam = false;
                            initInterface();
                            self.interface.jump('uiStart');
                        },
                        denied: function() {
                            self.useCam = false;
                            initInterface();
                            self.interface.jump('uiStart');
                        }
                    });

                } else {

                    initInterface();
                    self.interface.jump('uiStart');
                }
            }
            initAll();


            var em = this.evtManager = new Q.EventManager();
                em.registerStage(this.stage, this.events, true, true);

            // 启动定时器
            var timer = this.timer = new Q.Timer(1000 / this.fps);
            timer.addListener(this.stage);
            timer.addListener(Q.Tween);
            timer.start();

            //物体碰撞区域检测
            //Quark.toggleDebugRect(this.stage)
            var Score = ns.Score = new ns.Score();
			ns.Audio.play('bg3',true);
            // 实时查看FPS
            this.showFPS();
        },
        'changeBg' : function(bgname, now, time){
            var self = this,
                time = time ? time : 2000;

            if(self.bgname != bgname){

                if(now){
                    this.bg.find('.cur').css({
                        'opacity':0
                    }).removeClass('cur').siblings().css({
                        "background-image" : 'url('+ns.R.src[bgname]+')',
                        'opacity':1
                    }).addClass('cur');

                }else{

                    this.bg.find('.cur')
                    .animate({'opacity': 0}, time, 'ease')
                    .removeClass('cur')
                    .siblings().css({
                            'background-image': 'url('+ns.R.src[bgname]+')',
                            'opacity':0
                    })
                    .animate({'opacity': 1}, time, 'ease')
                    .addClass('cur');
                }
                self.bgname = bgname;
            }
        },
        'initUI': function() {
            var self = this;
            this.viewgroup = {
                // 背景层
                BGContainer : new Q.DisplayObjectContainer({
                    id: "BGContainer",
                    width: this.width,
                    height: this.height,
                    eventChildren: false,
                    transformEnabled: false
                }),
                // 载入UI层
                UContainer : new Q.DisplayObjectContainer({
                    id: "UContainer",
                    width: this.width,
                    height: this.height,
                    eventChildren: false,
                    transformEnabled: false
                }),
                // 载入怪物层
                MContainer: new Q.DisplayObjectContainer({
                    id: "MContainer",
                    width: this.width,
                    height: this.height,
                    eventChildren: false,
                    transformEnabled: false
                }),
                // 载入道具层
                PContainer: new Q.DisplayObjectContainer({
                    id: "PContainer",
                    width: this.width,
                    height: this.height,
                    eventChildren: false,
                    transformEnabled: false
                }),
                // 载入技能层
                SContainer: new Q.DisplayObjectContainer({
                    id: "SContainer",
                    width: this.width,
                    height: this.height,
                    eventChildren: false,
                    transformEnabled: false
                }),
                // 载入UI层
                UIcontainer : new Q.DisplayObjectContainer({
                    id: "UIContainer",
                    width: this.width,
                    height: this.height,
                    transformEnabled: false
                })
            };
            QST.each(this.viewgroup, function(i, o) {
                self.stage.addChild(o);
            });
        },
        'initTower': function(xy) {
            this.tower = new ns.Tower(QST.extend({
                'x': xy[0],
                'y': xy[1]
            }, ns.R.tower));
            this.tower.init();
        },
        'addProp': function(prop_type) {
            var prop = new ns.Prop(ns.R.Prop[prop_type]);
            prop.init(); // 道具初始化
            this.Manager.props.push(prop);
            this.viewgroup.PContainer.addChild(prop);
        },
        'gushblood' : function(){
            if(!this.blood_ui){
                var scale = game.width/1024,
                    y = game.height - 768*scale,
                    self = this;

                this.blood_ui = new Quark.Bitmap(QST.extend(ns.R.effect['blood_'+(Math.round(Math.random()*2)+1)],{
                    y : y,
                    scaleX : scale,
                    scaleY : scale
                }));
                this.viewgroup.UContainer.addChild(this.blood_ui);
                Q.Tween.to(this.blood_ui, {
                    'alpha': 0
                }, {
                    time: 1500,
                    onComplete: function(tween) {
                        self.blood_ui.parent.removeChild(self.blood_ui);
                        self.blood_ui = null;
                    }
                });

                ns.Audio.play('a_blood_death',false);
            }
        },
        'showFPS': function() {
            var $fps = $('<div class="fps"></div>').appendTo('body'),
                self = this,
                fpshandle = setInterval(function() {
                    $fps.html("FPS:" + self.frames);
                    self.frames = 0;
                }, 1000);
        }
    };

})();