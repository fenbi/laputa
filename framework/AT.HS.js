/*
    base in AT
    热点监听
 */

!function(global){

if(!global.AT){
    console.log('AT framework needed')
    return false;
}

var log = AT.log;

var HS = (function(){

    var _default = {
        life: 1000, //生命周期
        span: 100   //采样间隔 相当于 每秒10次
    };

    var _pause = true;
    var _listened = false;
    var timer;
    var defaultGroup = [];
    var currentGroup = '';
    var groups = [];
    var _fn = function() {};
    var callback = _fn; //全局回调

    /*
        热点 构造函数
     */
    function Spot(props){
        
        this.id = '';
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.enable = true;
        this.area = 0;
        this.count = 0; //触发计数
        
        this.img = null;
        this.actived = false;

        AT.merge(this, props);
 
        this.life = this.maxLife;


        this.area = this.w * this.h * .01 | 0;
        this.len  = this.getImg().length
    }

    Spot.prototype = {
        constructor : Spot,
        callback: _fn,
        getImg: function() {
            return AT.getLocalDiff(this.x, this.y, this.w, this.h);
        },
        // 重设热区
        reset: function(){
            this.actived = false;
            this.count   = 0;
            this.life    = this.maxLife;
        },
        pause: function() {
            this.enable = false;
        },
        start: function() {
            this.enable = true;
        },
        //检测触发临界
        checkTouch: function() {
            var i    = this.len,
                img  = this.getImg(),
                area = this.area,
                c    = 0;

            while(i-=4){
                c += img[i+3] === 60 ? 1 : 0;
            }
            return c > area;
        }
    };

    /*
        热组 构造函数
     */
    function Group(props) {
        AT.merge(this, props);
        this.children = [];
        this.length = 0;
        this.scale = 1;
    }

    Group.prototype = {
        constructor: Group,
        addChild: function(props){
            this.children.push(new Spot(props));
            this.length = this.children.length;
        }
    };

    /*
        新增热点群
     */
    function addGroup(props) {
        
        var gp = {
                    id: props.id,
                    fn: props.fn || callback,
                    scale: props.scale || 1,
                    length: props.btns.length
                },
            sp,
            group = new Group(gp),
            spots = props.btns,
            spot;
            
        var i = spots.length,
            r = gp.scale;
        while(i--){
            spot = spots[i];
            sp = {
                id: spot.id,
                w : (spot.w || spot.width)*r,
                h : (spot.h || spot.height)*r,
                x : spot.x*r,
                y : spot.y*r,
                maxLife: spot.maxLife || _default.life,
                parent: group
            };
            group.addChild(new Spot(sp));
        }

        var i = groups.length;
        while(i--){
            if(groups[i].id === props.id) groups.splice(i, 1);
        }
        
        groups.push(group);
    }

    /*
        核心监听方法
     */
    function coreListener() {
        if(_pause) return;

        var i = groups.length,
            j,
            spot,
            group,
            touch,
            life = 0;

        while(i--){
            group = groups[i];
            j = group.length;

            while(j--){
                spot = group.children[j];

                if(!spot.enable || spot.parent.id !== currentGroup)  
                    continue;

                //life = spot.maxLife || _default.life;

                touch = spot.checkTouch();
                
                if(touch || spot.actived) {
            
                    if(spot.life >= _default.span) {

                        spot.actived = true;
                        spot.life -= _default.span;

                        if(touch) {
                            spot.count ++;
                            group.fn(spot);
                        }

                    } else {
                        spot.reset();
                        group.fn(spot);
                    }
                }

            }
        }
        timer = setTimeout(coreListener, _default.span);
    }

    /*
        暂停监听
     */
    function pause(){
        log('HS: pause listen')
        _pause = true;
        _listened = false;
    }

    /*
        开始监听
     */
    function start(group){
        //log('HS: start listen - '+group);
        currentGroup = group || currentGroup || groups[0].id;
        _pause = false;

        if(!_listened) {
            coreListener();
            _listened = true;
        }
    }
    
    function init(props){
        var groups = props.groups,
            i = groups.length;

        callback = props.fn || _fn;
        while (i--) addGroup(groups[i]);
    }
    
    return {
        init:   init,
        start:  start,
        pause:  pause,
        addGroup: addGroup,
        groups:   groups,
        isPause:  function(){ return _pause},
        current:  function(){ return currentGroup}
    }
})()

global.AT.HotSpot = HS;

}(this)