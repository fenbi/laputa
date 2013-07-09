/**
 * Module
 * 界面模块
 */

(function(global){

    var log = dump;

    var ns = Q.use("laputa"),
        game = ns.game,
        R = ns.R;
    var doc = document;
    /*
        是否启用体感模式
    */
    var useCam = game.useCam;

    /*
        空函数
    */
    var _f = function(){};

    /*
        热点模块
     */
    var AHS = AT.HotSpot;

    /**
     *  强化按钮
     *  @name   NormalButton
     *  @class
     */
    var NormalButton = ns._NormalButton = function(props){

        var ui = R.ui;
        var scale = props.scale || 1;
        var mixin = props.mixin;

        var p = Q.merge({
                    id : props.id || null,
                    width  : props.width  * scale,
                    height : props.height * scale,
                    x : props.x * scale,
                    y : props.y * scale,
                    fillStyle:   mixin.fillStyle   || '#000',
                    strokeStyle: mixin.strokeStyle || '#F60',
                    textAlign:   'center',
                    color :  mixin.color || '#FFF',
                    font  :  '60px Microsoft Yahei',
                    radius:  10,
                    alpha : props.alpha || 1,
                    useHandCursor: true,
                    eventChildren: false
                }, props.mixin);

        NormalButton.superClass.constructor.call(this, p);


        /*
            背景图
         */
        if(props.image) {

            var image  = props.image;
            var frames = props.frames;

            this._bg = new Quark.MovieClip({
                        id: "bg",
                        image : image,
                        frames: frames,
                        scaleX: scale,
                        scaleY: scale
                     });

            this.addChild(this._bg);

            if(p.default) {
                this._bg.gotoAndStop(1);
            } else {
                this._bg.stop();
            }
        }

        /*
            进度条
         */
        if(useCam){
            if( p.progress !== false ) {

                this._progress = new Q.Graphics(
                                {
                                    width:  p.width,
                                    height: p.height,
                                    alpha:  .5
                                });

                if(props.image){

                    /*this._progress.mask = new Quark.Bitmap(
                                            {
                                                image:  image,
                                                rect :  frames[0].rect,
                                                scaleX: scale,
                                                scaleY: scale
                                            });*/
                }
                //this.addChild(this._progress);
            }else{

               log(p.id)
            }
        }

        /*
            文本
         */
        if(p.text) {
            this._text = new Q.Text(
                    {
                        text:      p.text,
                        font:      p.font,
                        color:     p.color,
                        lineWidth: p.width,
                        y:         (p.height-60)/2.35,
                        textAlign: p.textAlign
                    });
            this.addChild(this._text);
        }

        /*
            星星-关卡成就
         */

        if(p.stars && p.locked === false) {

            var scale = ui.stars.scale;
            var stars = ui.stars;

            this._stars = new Quark.MovieClip({
                        id: "bg",
                        x: (props.width - stars.width)*.4,
                        y: (props.height - stars.height)*.4,
                        image: stars.image,
                        frames: stars.frames,
                        scaleX: scale,
                        scaleY: scale
                     });

            this.addChild(this._stars);
            this._stars.gotoAndStop(p.stars);
        }

        /*
            锁
         */
        if( p.locked === true ) {
            var scale = ui.lock.scale*.8;
            var lock  = ui.lock;
            this.locked = true;

            var r = p.small ? .7 : .8,
                x = (p.width  - lock.width*scale)*r,
                y = (p.height - lock.height*scale)*r;


            this._lock = new Quark.MovieClip({
                            id: "lock",
                            image: lock.image,
                            frames: lock.frames,
                            x: x,
                            y: y,
                            visible: p.locked,
                            scaleX: scale,
                            scaleY: scale
                         });
            this.addChild(this._lock);
            this._lock.stop();
        }

        /*
            监听click
         */
        this.addEventListener(game.events[0], function(e){

                btnsHandlers.call(this);
        });


    };
    Q.inherit(NormalButton, Q.DisplayObjectContainer);

    /*
        改变状态
     */
    NormalButton.prototype.changeState = function(state){
        this._bg.gotoAndStop(state);
    };

   /*
        改变文本
   */
    NormalButton.prototype.changeText = function(t){
        if(t) this._text.text = t+'';
    };


    /*
        checked 属性
     */
    NormalButton.prototype.check = function(){
         var checked = this.checked = !this.checked;
         //this._bg.drawRoundRect(0, 0, this.w, this.h, this.radius).beginFill(checked?'#EEE':'#F60').endFill().cache();
    };

   /*
        progress
   */
    NormalButton.prototype.setProgress = function(n){

        if(!this._progress) return;

        var p = this._progress,
            w = this.width,
            c = this.fillStyle;

        this.resetProgress();

        p.drawRect(0, 0, w*n, this.height).beginFill(c).endFill();

    };

    /*
        resetProgress
     */
    NormalButton.prototype.resetProgress = function(){

        this._progress.clear();
    };

    /*
        锁定
    */
    NormalButton.prototype.doLock = function(){
        this.locked = this._lock.visible = true;
    };

    /*
        解锁
     */
    NormalButton.prototype.unLock = function(){
        this.locked = this._lock.visible = false;
    };

    //选中态
    NormalButton.prototype.select = function(){

        if(!this.locked){

            QST.each(this.parent.children, function(){
                if(!this.locked && this instanceof xRadio) this.changeState('normal');
            });

           this.changeState('selected');

           ns.mission.setLevel(this.level);
        }

        return this;
    };

    /*
        停止渲染
     */
    NormalButton.prototype.stop = function(){

        this.render = _f;
    };

     /*
        开始渲染
     */
    NormalButton.prototype.stop = function(){

        delete this.render;
    };

    /**
     *  关卡选择按钮
     */
    var xRadio = ns._LevelButton = function(props){
        this.level = props.level || false;
        xRadio.superClass.constructor.call(this, props);

    };
    Q.inherit(xRadio, NormalButton);

    /**
     *  玩法选择按钮
     */
    var tRadio = ns._TypeButton = function(props){
        var p = Q.merge(props, {
                    fillStyle:  '#EEE',
                    strokeStyle:'#F60',
                    color:      '#999'
                });

        tRadio.superClass.constructor.call(this, p);
    };
    Q.inherit(tRadio, xRadio);

    /**
     * 设置类型
     */
    tRadio.prototype.setType = function(){

        if(!this.locked){
            ns.mission.setType(this.id);
        }
    };

    /**
     * Interface 界面构造函数
     * @param {Object} stage
     * @param {Function} callbacks
     *
     */
    var Interface = ns.Interface = function(stage, callbacks){

            this._cbs   = callbacks;
            this.stage  = stage;

            var handler = Q.delegate(handlers, this);

            /*
                界面元素配置
             */
            var uiProps = this.uiProps = {

                //场景：起始画面
                start:
                {
                    id: 'uiStart',
                    btns:[
                        R.ui.btnStart
                    ],
                    //装饰元素
                    bg:[
                        R.ui['logo']
                    ],
                    x: 0,
                    y: 0,
                    fn: handler
                },
                //场景：玩法选择
                type:
                {
                    id: 'uiType',
                    btns:[
                        R.ui.btnTypeDefend,
                        R.ui.btnTypeInvader,
                        R.ui.btnTypeStart
                    ],
                    //装饰元素
                    bg:[],
                    x: -game.width,
                    y: 0,
                    fn: handler
                },
                //场景：关卡选择
                level:
                {
                    id:  'uiLevel',
                    btns: [
                        R.ui.btnLevel1,
                        R.ui.btnLevel2,
                        R.ui.btnLevel3,
                        R.ui.btnLevel4,
                        R.ui.btnLevelStart,
                        R.ui.btnBack
                    ],
                    bg: [],
                    x: game.width,
                    y: 0,
                    fn: handler
                },
                //场景：游戏中
                play:
                {
                    id:  'uiPlay',
                    btns: [],
                    bg:   [],
                    x: game.width,
                    y: 0,
                    fn: handler
                },
                //场景：游戏结束
                end:
                {
                    id: 'uiEnd',
                    btns:[
                        R.ui.btnBack,
                        R.ui.btnReplay,
                        R.ui.btnNext
                    ],
                    bg:[

                        R.ui.gameOver,
                        R.ui.youWin,
                        R.ui.mask
                    ],
                    x: game.width,
                    y: 0,
                    dom : Q.getDOM('g-ui-complete'),
                    fn: handler
                }
            };

            this.domEnd = {
                fail  :  QST.dom.query('.g-ui-complete  .fail')[0],
                img   :  QST.dom.query('.g-ui-complete .shot .img')[0],
                stars :  QST.dom.query('.g-ui-complete .stars div')[0],
                rank  :  QST.dom.query('.g-ui-complete .rank ul')[0],
                latest:  QST.dom.query('.g-ui-complete .latest-round')[0],
                history: QST.dom.query('.g-ui-complete .history-best')[0]
            };

            /*
                更新关卡数据到界面
             */
            this.updateLevel();

            /*
                实例化 UI
            */
            this.instanceUI([
                uiProps.start,
                uiProps.type,
                uiProps.level,
                uiProps.play,
                uiProps.end
            ]);

            /*
                注册热点
             */
            var translate = function (inp) {
                var outp = {
                        id : inp.id,
                        btns: [],
                        fn: handler
                    },
                    btns = inp.getChildById('btns').children,
                    i = inp.getChildById('btns').children.length;

                while(i--) {
                    outp.btns[i] = btns[i];
                }
                return outp;
            };


            /*
                创建所有按钮引用数组
             */
            this.btns = [
                {type: 'uiLevel', btn: this.uiLevel.getChildById('btns')},
                {type: 'uiStart', btn: this.uiStart.getChildById('btns')},
                {type: 'uiType' , btn: this.uiType.getChildById('btns')},
                {type: 'uiEnd'  , btn: this.uiEnd.getChildById('btns')}
            ];


            if(useCam) {
                AHS.addGroup(translate(this.uiStart));
                AHS.addGroup(translate(this.uiType));
                AHS.addGroup(translate(this.uiLevel));
                //AHS.addGroup(translate(this.play));
                AHS.addGroup(translate(this.uiEnd));
            }

        }

    /**
     * stop Render  停止渲染按钮
     * @param
     */
    Interface.prototype.stopRender = function( type ) {
        /*
        var i = this.btns.length;
        while(i--){
            this.btns[i].render = _f;
        }*/

        this.stage.render = _f;
        log('停止UI渲染');
    };


    /**
     * start Render  开始渲染按钮
     * @param
     */
    Interface.prototype.startRender = function(type) {

        var i = this.btns.length;

        while(i--){

            if( this.btns[i].type == type){

                delete this.btns[i].btn.render;

            } else {

                this.btns[i].btn.render = _f;
            }
        }

        delete this.stage.render;

        log('开始渲染 ' + type);
    };

    /**
     * updateLevel  初始化难度选择界面
     * @param  {Array} levels 关卡数据
     */
    Interface.prototype.updateLevel = function(){
        var levels = ns.mission.getCurrentMission();
        var ret = this.uiProps.level.btns.slice(0, 4);
        var len = levels.length;
        var i = len;

        while(i--){

            ret[i].mixin.locked = levels[i].locked;
            ret[i].mixin.stars  = levels[i].stars;
            ret[i].mixin.level  = i;
        }

        /*
             实例化热点
         */
        this.instanceUI([this.uiProps.level]);
        delete this.uiLevel.children[0].render;
    }

   /**
    * instanceUI 实例化界面
    * @param  {Array} props
    */
    Interface.prototype.instanceUI = function(props){

        var i  = props.length;
        var _t = this;

        while(i--) {

            var it = props[i],
                id = it.id;

            this[id] = new Q.DisplayObjectContainer({
                id : id,
                x: it.x,
                y: it.y
            });

            if(it.bg && it.bg.length > 0){
                var k = it.bg.length;
                var bgContainer = new Q.DisplayObjectContainer({id:'bgs'});
                while(k--){
                    var p = it.bg[k], F,
                        scale = p.scale;

                    if(scale) p = Q.merge(p, {
                        scaleX: scale, scaleY: scale,
                        x: p.x* scale, y: p.y* scale
                    });

                    if(p.id == 'mask') {

                        F = Q.Graphics;
                        var child = new F(p);
                        child.drawRect(0, 0, p.width, p.height).beginFill(p.fillStyle).endFill().cache();

                    } else {

                        F = p.frames ? Q.MovieClip : Q.Bitmap;
                        var child = new F(p);
                    }

                    bgContainer.addChild(child);

                }
                this[id].addChild(bgContainer);
            }

            if(it.btns.length > 0) {

                var btnContainer = new Q.DisplayObjectContainer({id: 'btns'});
                //默认暂停渲染
                btnContainer.render = _f;

                var j = it.btns.length;

                while(j--){

                    var p = it.btns[j].mixin;

                    var F = {
                                Type :  tRadio,
                                Level:  xRadio,
                                Normal: NormalButton
                            }[p.type];

                    btnContainer.addChild(new F(it.btns[j]));
                }

                this[id].addChild(btnContainer);
            }

            this.stage.addChild(this[id]);
        }
    }

/*
    按钮回调
 */

var btnsHandlers = this.btnsHandlers = function(type, id, btn) {
    ns.Audio.play('click',false);
    var btn = btn  ? btn  : this;
    var pID = type ? type : this.parent.parent.id;
    var id  = id   ? id   : this.id;
    var self= game.interface;

    var fns = {

        //开场画面
        uiStart: function(){

            //self.jump('uiType');
            self.jump('uiLevel');

        },
        //玩法选择
        uiType: function(){

            if( id === 'start'){

                self.updateLevel();
                self.jump('uiLevel');

            }else{

                btn.select().setType();
            }
        },
        //关卡选择
        uiLevel: function(){

            if(id === 'start'){

                self.jump('uiPlay');
                self._cbs.startLevel();

            } else if(id === 'back'){

                self.jump('uiStart');

            } else {
                log(id.substr(-1));
                game.changeBg('b'+id.substr(-1));
                btn.select();
            }
        },
        //游戏开始
        uiPlay: function() {
            if(id === 'pause'){
                //btn.check();
            }
        },
        //结束画面
        uiEnd: function() {
            if(id === 'back') {

                self._cbs.back();
                self.jump('uiStart');

            }else if(id === 'replay') {

                //开启下一个关卡
                self._cbs.replay();
                self.jump('uiPlay');

            }else if(id === 'next') {

                //开启下一个关卡
                ns.mission.next();
                self._cbs.replay();
                self.jump('uiPlay');

            }
        }
    };

    fns[pID]()
};


/*
    体感接口
 */
var handlers = function(spot) {

    var gid = spot.parent.id,
        id  = spot.id,
        c   = spot.count,       //热点触发计数
        n   = spot.maxLife / 500 | 0; //触发临界值

    var _t  = this;
    var btn = _t[gid].getChildById('btns').getChildById(id);

    btn.setProgress(c / n);

    //到达临界
    if( c >= n ) {
        log('触发热区：' +id);
        btnsHandlers.apply(_t, [gid, id, btn]);
        btn.resetProgress();
    }
}

function setXY(obj,x,y){
    obj.x = x;
    obj.y = y;
}

//界面切换
Interface.prototype.jump = function(type, extra){
    var self = this,
        duration = 230;

    var SW = game.width,
        SH = game.height,
        DS = game.defaultScale;

    ({
        uiStart: function (){

            game.changeBg('b0');
            self.startRender(type);

            Q.Tween.to(self.uiStart, {x: 0, y: 0}, {time:duration});
            Q.Tween.to(self.uiEnd, {x: game.width, y: 0}, {time:duration});

            if(self.uiLevel) Q.Tween.to(self.uiLevel, {x: game.width, y: 0}, {time:duration});

            //self.uiProps.end.dom.style.top = '-50%';
        },
        uiType: function () {

            self.startRender(type);

            Q.Tween.to(self.uiStart, {x: -game.width, y: 0}, {time:duration});
            Q.Tween.to(self.uiType,  {x: 0, y: 0},  {time:duration});

            if(self.uiLevel) Q.Tween.to(self.uiLevel,{x: game.width, y: 0}, {time:duration});

        },
        uiLevel: function (){

            game.changeBg('b1');

            self.startRender(type);

            Q.Tween.to(self.uiStart, {x: -game.width, y: 0}, {time:duration});
            Q.Tween.to(self.uiType, {x: -game.width, y: 0}, {time:duration});
            Q.Tween.to(self.uiLevel,{x: 0, y: 0}, {time:duration});
        },
        uiPlay: function (){

            self.stopRender(type);

            Q.Tween.to(self.uiPlay,{x: 0, y: 0}, {time:duration});
            Q.Tween.to(self.uiLevel,{x: -game.width, y: 0}, {time:duration});
            Q.Tween.to(self.uiEnd,{x: game.width, y: 0}, {time:duration});
            //self.uiProps.end.dom.style.top = '-50%';

        },
        uiEnd: function (){

            if(game.useServe){
                ns.Score.rank(function(dd) {
                    //type : ns.mission.currentType=="defend"?0:1,
                    var dom = _t.domEnd;
                    var url = 'http://localhost/laputa/beta/dev/';
                    //var url = 'http://172.25.36.56/mt/laputa/';
                    var data = {
                            score : ns.Score.tScore,
                            combo : game.Manager.maxcombo,
                            kill_num : game.Manager.kill_num,
                            monster_num : ns.mission.countMonster(),
                            towerStatus : game.tower.hp <= 0 ? 0 : 1,
                            snap : url + game.Manager.snap[0].data,
                            /*best : {
                                kill:  100,
                                score: 100,
                                rank:  100
                            },*/
                            best : dd.hisrank,
                            rank : dd.rank
                        };

                    var htmlR = '',
                        htmlH = '',
                        htmlL = '';

                    dom.stars.className = 's' + Math.round(data.kill_num*3/data.monster_num);

                    if( data.towerStatus === 0 ){
                        dom.fail.style.display = 'block';
                        dom.stars.style.display = 'none';
                    }

                    htmlH = '<ul>'+
                            '<li> <p class="t">总杀总数 ：</p> <p class="n">'+data.best.kill+'</p></li>'+
                            '<li> <p class="t">最大连击 ： </p> <p class="n">'+data.best.score+'</p></li>'+
                            '<li> <p class="t">总成绩排名 ：</p> <p class="n">'+data.best.rank+'</p></li>'+
                            '</ul>';

                    htmlL = '<table>'+
                            '<tr> <th>击杀数 ： </th> <td>'+data.kill_num+'/'+data.monster_num+'</td></tr>'+
                            '<tr> <th>最大连击：</th> <td>'+data.combo+'</td></tr>'+
                            '<tr> <th>获得金币：</th> <td>'+data.score+'</td></tr>'+
                            '</table>';

                    for(var l = data.rank.length, i = 0 , r = data.rank; i < l; i++ ){
                        var me = r[i].me? ' class="me"' : '';
                        htmlR += '<li'+ me +'><strong class="n">'+(i+1)+'</strong> <span class="t">'+ r[i].nick +'</span><strong class="score">'+ r[i].score +'</strong></li>';
                    }

                    dom.img.innerHTML = '<img src="'+ data.snap +'" />';
                    dom.history.innerHTML = htmlH;
                    dom.latest.innerHTML = htmlL;
                    dom.rank.innerHTML = htmlR;

                    Q.Tween.to(_t.uiPlay,{x: -game.width, y: 0}, {time:duration});
                    Q.Tween.to(_t.uiEnd,{x: 0, y: 0}, {time:duration});
                    _t.uiProps.end.dom.style.top = '50%';

                    _t.startRender(type);
                });

            } else {

                var bg = self.uiEnd.getChildById('bgs');
                    lose = bg.getChildById('gameOver'),
                    win  = bg.getChildById('youWin');

                /*
                    判断输赢
                 */
                Q.Tween.to(self.uiPlay, {x: -game.width, y: 0}, {time:duration});
                Q.Tween.to(self.uiEnd, {x: 0, y: 0}, {time:duration, onComplete:function(){

                        if(extra == 'win') {

                            setXY(lose,-500,-500);
                            Q.Tween.to(win, {x:  (SW - win.width*win.scaleX)/2, y: game.height*.1}, {time:duration});

                        } else {

                            setXY(win,-500,-500);

                            Q.Tween.to(lose, {x: (SW - lose.width*lose.scaleX)/2, y: game.height*.1}, {time:duration});

                        }
                }});

                //self.uiProps.end.dom.style.top = '50%';
                self.startRender(type);

            }
        }
    }[type])();

    if(useCam) AHS.start(type);

    log('切换界面：'+type);
};

Interface.prototype.updateLevelUI = function(){
    this.updateLevel();
};

})(this);