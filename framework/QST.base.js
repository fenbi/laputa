function dump(s){
	return console.log(s);
}
/**
* QQSHOWTouch - ISUX QQSHOW TEAM
* @fileoverview qst核心代码
* @author ISUX QQSHOW TEAM
* @version 1.0.0
*/
(function(win,Q) {
    var
    document = window.document,
    // domready 是否触发
    readyBound = false,isReady = false,
    // domready 的 function 数组
    readyList = [],
    DOMContentLoaded = function() {
        document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
        QST.ready();
    },
    bindReady = function() {
        if ( readyBound ) {
            return;
        }
        readyBound = true;
        if ( document.readyState === "complete" ) {
            return Q.ready();
        }
        if ( document.addEventListener ) {
            document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            window.addEventListener( "load", ready, false );
        }
    },
    ready = function() {
        if ( !isReady ) {
            if ( !document.body ) {
                return setTimeout( ready, 13 );
            }
            isReady = true;
            if ( readyList ) {
                //dump(readyList);
                var fn, i = 0;
                while ( (fn = readyList[ i++ ]) ) {
                    fn.call( document, Q );
                }
                readyList = null;
            }
        }
    };
    /**
    * QQSHOWTouch全局对象
    * @name QST
    * @namespace QQSHOWTouch全局对象，QST核心工具库对象。
    */
    win[Q] = Q = {
        /**
        * QST 扩展合并方法
        * @name QST.extend
        * @function
        * @param {Object} obj 被扩展的原始对象
        * @param {Object} method 扩展新方法
        * @returns {Object} 返回扩充新方法后的对象
        * @example
        * // 合并对象
        * Q.extend({
        *   'isIOS':'true',
        *   'IOSversion':'4.1'
        * },{
        *   'Mobile':'true',
        *   'IOSversion':'4.2'
        * })
        * // 结果{
        *           'isIOS':'true',
        *           'Mobile':'true',
        *           'IOSversion':'4.2'
        *        }
        */
        extend: function(t , o) {
            for ( var name in o ) {
                if ( o.hasOwnProperty(name)) {
                    t[ name ] = o [ name ];
                }
            }
            return t;
        }
    }

    Q.extend(Q,{
        QST : true ,
        /**
        * QST 版本
        * @name QST.version
        * @constant 版本号 1.0.0
        */
        version : '1.0.0' ,
        /**
        * 将多个对象的成员合并到一个新对象上。(多成员的extend)
        * @name QST.merge
        * @constructor
        * @function
        * @param {Object} arguments/Object  合并成员（成员个数没无限制）
        * @returns {Object} 合成生成新的对象
        * @example
        * // 合并对象
        * Q.merge({
        *   'isIOS':'true',
        *   'IOSversion':'4.1'
        * },{
        *   'Mobile':'true',
        *   'IOSversion':'4.2'
        * },{
            'Mobile':'IOS',
            'game' : 'none'
        * }
        * )
        * // 结果{
        *           'isIOS':'true',
        *           'IOSversion':'4.2',
        *           'Mobile':'IOS',
        *           'game' : 'none'
        *        }
        */
        merge: function() {
            var o = {}, i, l = arguments.length;
            for (i = 0; i < l; i++) {
                Q.extend(o, arguments[i]);
            }
            return o;
        },
        /**
        * 让函数对象 receiver 继承函数对象 supplier.
        * @name QST.inherits
        * @function
        * @param {Function} receiver 子类
        * @param {Function} supplier 父类
        * @returns {Object} 扩展后的子类 receiver
        * @example
        * // 函数对象Chinses 继承 human
        * function Human(name) {
        *     this.name = name;
        * }
        * Human.prototype.eat = function(){
        *     alert(this.name+' eating');
        * };
        * function Chinese(name) {
        *     this.name = name+"(chinese)";
        * }
        * QST.inherits(Chinese, Human);
        * new Chinese('ares').eat()
        * // 结果 ares(chinese) eating
        */
        inherits: function(r, s, px, sx) {
            if (!s || !r) return r;

            var create = function(proto, c) {
                    return Object.create(proto, {
                        constructor: {
                            value: c
                        }
                    });
                },
                sp = s.prototype,
                rp;
            // add prototype chain
            rp = create(sp, r);
            r.prototype = Q.extend(rp, r.prototype);
            r.superclass = create(sp, s);
            // add prototype overrides
            if (px) {
                Q.extend(rp, px);
            }
            // add object overrides
            if (sx) {
                Q.extend(r, sx);
            }
            return r;
        },
        /**
        * 将 obj 对象的成员复制到 self 对象上。（不会覆盖slef原来对象）
        * @name QST.mix
        * @function
        * @param {Function} self
        * @param {Function} obj
        * @returns {Object} self对象
        */
        mix: function ( self, obj, o ) {
            for ( var name in obj ) {
                if ( self[ name ] === undefined || o ) {
                    self[ name ] = obj[ name ];
                }
            }
            return self;
        }
    })
    var toString = Object.prototype.toString,
        push = Array.prototype.push,
        rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g ;

    Q.extend(Q,{
        /**
        * 注册函数，在 DOM 加载完毕时执行。带DOM加载完成之后使用ready,会立刻执行
        * @name QST.ready
        * @function
        * @param {Function} fn
        * @example
        * // 注册函数
        * QST.ready(function(){
        *   alert('test');
        * }
        */
        ready : function( fn ) {
            bindReady();
            if ( isReady ) {
                fn.call( document, Q );
            } else if ( readyList ){
                readyList.push( fn );
            }
            return this;
        },
        /**
        * 遍历数组或者对象中的每一项，执行方法。
        * @name QST.each
        * @function
        * @param {Array|Object} arr 需要遍历的数组或者对象
        * @param {Function} callback 执行时，接收 2 个参数：当前 index(对象名)，当前项（对象属性）函数的this指向当前项（对象属性）
        * @example
        * // 遍历数组
        * var str = '';
        * QST.each(['one','two','three'],function(i,o){
        *   str += i+o+' ';
        * });
        * // 结果 str = '0one 1two 2three';
        * // 遍历对象
        * var str = '';
        * QST.each({'time': '20110418' , 'game' : 'over' },function(i,o){
        *   str += i+o+' ';
        * });
        * // 结果 str = 'time2011418 gameover';
        */
		each: function ( object, callback , log , desc) {
			if ( Q.isFunction( callback ) ) {
                if( object.nodeType ){
                    callback.call(object,0,object);
                    return object;
                }
				if ( object.length === undefined ) {
					for ( var name in object ) {
						if ( callback.call( object, name, object[name] ) === false ) {
							break;
						}
					}
				} else {
                    if(desc){
                        for( var i= object.length ; i >0 ;i--){
                            if ( callback.call( object[i], i , object[i]) === false ) {
                                break;
                            }
                        }
                    }else{
                        for( var i = 0 ,l = object.length ; i < l ;i++)
                        {
                            if ( callback.call( object[i], i , object[i]) === false ) {
                                break;
                            }
                        }
                    }
				}
			}
			return object;
		},
        /**
        * 判断是否为空对象
        * @name QST.isEmptyObject
        * @function
        * @param {Object} obj 需要遍历的数组或者对象
        * @returns {Boolean} true/false
        * @example
        * // 判断是否为空对象
        * QST.isEmptyObject({'empty':'你是空的?你骗谁呢'})
        * // 结果 false
        */
        isEmptyObject: function(o) {
            for (var p in o) {
                return false;
            }
            return true;
        },
        /**
        * 判断是否为null
        * @name QST.isNull
        * @function
        * @param {Object} obj
        * @returns {Boolean} true/false
        * @example
        * // 判断是否为数组
        * QST.isNull()
        * // 结果 false
        */
        isNull: function(o) {
            return o === null;
        },
        /**
        * 判断是否为undefined
        * @name QST.isUndefined
        * @function
        * @returns {Boolean} true/false
        * @example
        * // 判断是否为数组
        * QST.isUndefined()
        * // 结果 true
        */
        isUndefined: function(o) {
            return o === undefined;
        },
        /**
        * 判断是否为字符串
        * @name QST.isString
        * @function
        * @returns {Boolean} true/false
        * @example
        * // 判断是否为字符串
        * QST.isString('test')
        * // 结果 true
        */
        isString : function(o){
            return o.constructor === String;
        },
        /**
        * 判断是否为数组
        * @name QST.isArray
        * @function
        * @returns {Boolean} true/false
        * @example
        * // 判断是否为数组
        * QST.isArray(['QST'])
        * // 结果 true
        */
        isArray : function(o){
            return o.constructor === Array;
        },
        /**
        * 判断是否为布尔值
        * @name QST.isBoolean
        * @function
        * @returns {Boolean} true/false
        * @example
        * // 判断是否为数组
        * QST.isBoolean('true')
        * // 结果 false
        */
        isBoolean : function(o){
            return o.constructor === Boolean;
        },
        /**
        * 判断是否为函数
        * @name QST.isFunction
        * @function
        * @returns {Boolean} true/false
        * @example
        * // 判断是否为数组
        * QST.isFunction(function(){alert('function')})
        * // 结果 true
        */
        isFunction: function ( obj ) {
            return toString.call(obj) === "[object Function]";
        },
        /**
        * 判断对象是否是纯粹的对象
        * @name QST.isPlainObject
        * @function
        * @param {Object} obj
        * @returns {Boolean} true/false
        * @example
        * // 判断是否为纯粹对象
        * QST.isPlainObject({}))
        * QST.isPlainObject(new Object());
        * QST.isPlainObject(new Chinses());
        * // 结果 true true falase
        */
        isPlainObject : function (obj){
            //判断是否非window和DOM对象的对象，
            if ( !obj || obj.toString() !== "[object Object]" || obj.nodeType || obj.setInterval ) {
                return false;
            }
            //constructor是对创建对象的函数的引用（指针）。对于 Object 对象，该指针指向原始的 Object() 函数
            //判断obj是否具有isPrototypeOf属性，isPrototypeOf是挂在Object.prototype上的。通过字面量或自定义类（构造器）创建的对象都会继承该属性方法
            if ( obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf") ) {
                return false;
            }
            var key;
            for ( key in obj ) {}
            return key === undefined || obj.hasOwnProperty(key);
        },
        /**
        * 判断元素item是否在数组arr当中
        * @name QST.inArray
        * @function
        * @param item 数组元素
        * @param {Array} arr 数组
        * @returns {Boolean} true/false
        * @example
        * // 判断'ares'有没在数组中
        * QST.inArray('ares',['tommy','steven','joseph','lansing','ares'])
        * // 返回结果 true
        */
        inArray: function(item, arr) {
            if(Q.isArray(arr))
            {
                return arr.indexOf(item) > -1;
            }
        },
        /**
        * 将对象obj转换为伪数组
        * @name QST.makeArray
        * @function
        * @param {Array} arr 初始数组
        * @param {Object} obj 转换对象obj
        * @returns {Object} 换成后的数组
        * @example
        * // 将对象转换成伪数组
        * QST.makeArray(['tommy','steven','joseph','lansing','ares'],{
        *           title:'show',
        *            length:0
        * })
        * //{
        *       0:'tommy',
        *       1:'steven',
        *       2:'joseph',
        *       3:'lansing',
        *       4:'ares',
        *       length:5,
        *       title:'show'
        *   }
        */
        makeArray : function(arr,results){
            var ret = results || [];
            if ( arr !== null ) {
                if ( arr.length == null || typeof arr === "string" || Q.isFunction(arr) || ( !Q.isFunction(arr) && arr.setInterval) ) {
				    push.call( ret, arr );
			    } else {
                    var i = ret.length, j = 0;
                    //dump(ret)
                    while ( arr[j] !== undefined ) {
                        ret[ i++ ] = arr[ j++ ];
                    }
                    ret.length = i;
                }
            }
            return ret;
        },
        /**
        * 去除字符串头尾处的空白。
        * @name QST.trim
        * @function
        * @param {String} text
        * @returns {String} 处理之后的字符串
        * @example
        * // 将对象转换成伪数组
        * QST.trim(' mingt ')
        * // 结果：mingt
        */
        trim: function( text ) {
            return (text || "").replace( rtrim, "" );
        },
        toElem: function ( elems ) {
            var fragment = document.createDocumentFragment();
            if ( elems.nodeType == 1 ) {
                return elems;
            }
            if (typeof elems == "string" || typeof elems == "number") {
                var div = document.createElement("div");
                div.innerHTML = elems;
                elems = div.childNodes;
                while ( elems[0] ) {
                    //todo：用while危险，这里每次appendel elems的元素就会减少，而下面不会，
                    fragment.appendChild( elems[0] );
                }
            } else if ( elems[0] && elems[0].nodeType ) {
                for ( var i = 0; i < elems.length; i++ ) {
                    fragment.appendChild( elems[i] );
                }
            }
            return fragment;
        },
        /**
        * 转换为JSON
        * @name QST.toJson
        * @function
        * @param {String} str json字符串
        * @returns {JSON} 转换后输出的json
        */
        toJSON : function(str){
            try{
                return JSON.parse(str);
            }catch(e){
                return str;
            }
        },
        /**
        * 转换为JSON字符串
        * @name QST.toJSONString
        * @function
        * @param {JSON} json
        * @returns {String} json字符串
        */
        toJSONString : function(json){
            return JSON.stringify(json);
        },
        /**
        * 获取当前系统时间
        * @name QST.now
        * @function
        * @returns {Number} 当前时间
        * @example
        * // 获取当前系统时间
        * QST.now()
        * // 结果：1303120825547
        */
        now : function(){
            return new Date().getTime();
        },
        is3d :function(){
            var has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix())
            return has3d;
        }
    });
   Q.extend(Q,{
        /**
        * 添加命名空间或者模块
        * @name QST.add
        * @function
        * @param {String|Object} name 添加的命名空间名或者模块名，可以是对QST扩展的方法
        * @param {Object} method 添加命名空间或者模块的方法
        * @param {Object} config 添加模块配置方法（可设置为同时扩展QST.node方法）
        * @example
        * // 为QST添加dom命名空间，并赋予方法mod
        * QST.add('dom',{'mod':function(){}});
        * // 为QST添加方法mod
        * QST.add({'mod':function(){}});
        * @see 示例演示地址 <a href="../../examples/demo/add.html" target="_blank">QST.add()</a>.
        */
       add : function(name,method,config){
            var self = this , mod , o , nodeadd = function(me,config){
                if(Q.isBoolean(config) && config === true || Q.isPlainObject(config)){
                    if(config===true){
                        config = null
                    }else{
                        var temp = Q.extend({},config);
                        if(Q.isUndefined(config.node)||!config.node === true ){
                            return false;
                        }
                        else{
                            delete temp.node;
                            config = temp;
                        }
                    }
                    Q.node.fn.extend(me,config);
                }
            };
            if (Q.isString(name) && Q.isPlainObject(method)) {
                if(Q.isUndefined(Q[name])){
                    o = {};
                    o[name] = method;
                    name = o;
                    method = config ? config : 'false';
                }else{
                    Q.mix(Q[name],method);
                    nodeadd(method,config)
                    return self;
                }
            }
            if (Q.isPlainObject(name)) {
                Q.mix(Q,name);
                method = method || 'false';
            }
            if(Q.isString(name) && Q.isFunction(method)) {
                    Q [name] = method;
                    if(config){
                        o = {};
                        o[name] = method;
                        name = o
                        method = config ? config : 'false';
                    }
            }
            nodeadd(name,method);
            return self;
       }
   });



    (function(win,Q){
        /**
        * ua浏览器检测
        * @name QST.ua
        * @namespace ua浏览器检测
        * @returns {Object} 浏览器检测信息
        * @example
        * // 获取浏览器信息
        * QST.ua();
        * 结果示范：{
        *          'isIOS':true,
        *          'isAndroid':false,
        *          'iswebOS':false,
        *          'webkit':534.16,
        *          'Mobile' : 'IOS',
        *          'iPone' : true
        *        }
        * @see 示例演示地址 <a href="../../examples/demo/ua/ua.html" target="_blank">QST.ua()</a>.
        */

        var uatest = function(){

            var ua = navigator.userAgent,
                temp , o ={
                    isIOS : false ,
                    //isIphone : false ,
                    //isIpad : false ,
                    //isIpod : false ,
                    isAndroid : false ,
                    iswebOS : false ,
                    isIOS : false
                };
            if ((temp = ua.match(/AppleWebKit\/([\d.]*)/)) && temp[1]) {
                o[core = 'webkit'] = temp[1];
                // Chrome
                if ((temp = ua.match(/Chrome\/([\d.]*)/)) && temp[1]) {
                    o[shell = 'chrome'] = temp[1];
                }
                // Safari
                else if ((temp = ua.match(/\/([\d.]*) Safari/)) && temp[1]) {
                    o[shell = 'safari'] = temp[1];
                }
                // Apple Mobile
                if (/ Mobile\//.test(ua)) {
                    //目前还不清楚 iPad, iPhone , iPod Touch的ua差别
                    o['MOBILE'] = 'IOS'; // iPad, iPhone or iPod Touch
                    o['isIOS'] =  true;
                    if(/iPad/.test(ua)){
                        o['isiPad'] = true;
                    }
                    if(/\(iPhobe\;/.test(ua)){
                        o['iPone'] = true;
                    }
                }
                else if ((temp = ua.match(/Android \d\.\d/))) {
                    o['MOBILE'] = temp[0].toLowerCase(); // Android
                    o['isAndroid'] =  true ;
                }
                else if ((m = ua.match(/NokiaN[^\/]*/))) {
                    o['MOBILE'] = temp[0].toLowerCase(); // webOS
                    o['iswebOS'] =  true ;
                }
                else if ((m = ua.match(/NokiaN[^\/]*/))) {
                    o['MOBILE'] = temp[0].toLowerCase(); // Nokia N-series
                }
            }else{
                o['support'] = false;
            }
            return o;

        }

        var t = uatest();

        Q.add('ua',t)
    })(this,Q);

   (function(win,Q) {
       /**
       * css的操作，class的操作，高度宽度位置等
       * @name QST.css
       * @namespace QST的css对象，提供css的操作，class的操作，高度宽度位置等
       */
       var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;
       Q.add('css',{
            /**
            * 为元素添加className
            * @name QST.css.addClass
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String} name className
            * @returns {HTMLElement|Nodelist} 返回元素
            * @example
            * // 为HTMLElement添加class
            * QST.css.addClass(document.getElementById('box'),'mod_box');
            * // 为Nodelist添加class
            * QST.css.addClass(QST.dom.query('.box'),'mod_box');
            * @see 示例演示地址 <a href="../../examples/demo/css/class.html" target="_blank">QST.css.addClass()</a>.
            */
           addClass : function( elem , name ){
                if ( name && typeof name == "string" ) {
                    return Q.each(elem,function(i, o) {
                        var className = " " + o.className + " ";
                        if ( className.indexOf( " " + name + " ") < 0 ) {
                            o.className += o.className? " " + name: name;
                        }
                    });
                }
           },
            /**
            * 为元素删除className
            * @name QST.css.removeClass
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String} name className
            * @returns {HTMLElement|Nodelist} 返回元素
            * @example
            * // 为HTMLElement移除class
            * QST.css.removeClass(document.getElementById('box'),'mod_box');
            * // 为Nodelist移除class
            * QST.css.removeClass(QST.dom.query('.box'),'mod_box');
            * @see 示例演示地址 <a href="../../examples/demo/css/class.html" target="_blank">QST.css.removeClass()</a>.
            */
           removeClass : function( elem , name ){
                return Q.each(elem,function(i, o) {
                    if ( name ) {
                        var className = " " + o.className + " ";
                        className = className.replace(" " + name + " ", " ");
                        o.className = className.substring(1, className.length - 1);
                    } else {
                        o.className = "";
                    }
                });
           },
            /**
            * 判断该元素是否有此className
            * @name QST.css.hasClass
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String} name className
            * @returns {Boolean} true/false
            * @example
            * // 判断元素是否含有此class
            * QST.css.hasClass(QST.dom.query('.box')[2],'box');
            * // 结果 true
            * @see 示例演示地址 <a href="../../examples/demo/css/class.html" target="_blank">QST.css.hasClass()</a>.
            */
           hasClass: function( elem , name ) {
               elem = elem.QST ? elem[0] : elem;
               var className = " " + name + " ";
               if ( (" " + elem.className + " ").indexOf( className ) > -1 ) {
                   return true;
               }
               return false;
           },
            /**
            * 对匹配元素的设置css属性，当属性值缺省时返回该元素css属性值
            * @name QST.css.css
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String} name css属性名(可以不使用驼峰写法)
            * @param {String} value css属性值
            * @returns {HTMLElement|Nodelist/String} 返回elem，当css属性值缺省时返回该元素属性值
            * @example
            * // 设置css属性
            * QST.css.css(QST.dom.query('.box'),'color','red');
            * // 获取css属性
            * QST.css.css(QST.dom.query('.box'),'padding-left');
            * // 结果:'0px'
            * @see 示例演示地址 <a href="../../examples/demo/css/css.html" target="_blank">QST.css.css()</a>.
            */
           css:function(elem , name, value, computed ){
                var setcss = function(node,name,value){
                    var  r  = /opacity|z-?index|font-?weight/i;
                    if ( !node.nodeType) {
                        return ;
                    }
                    name = name.replace(/-([a-z])/ig,function(a,b){
                        return b.toUpperCase();
                    });
                    if ( typeof value === "number" && !rexclude.test(name) ) {
                        value += "px";
                    }
                    node.style[ name ] = value;
                    return this;

                },getcss = function(node , name , computed){
                    var style = node.style, ret;
                    //if(name  == 'width' || name == 'height') {
                    //   return name === "width" ? elem.clientWidth   : elem.scrollHeight;
                    //}
                    if ( style && style[name] && !computed ) {
                        ret = style[name];
                    } else {
                        name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();
                        var s = document.defaultView.getComputedStyle( node, "" );
                        ret = s && s.getPropertyValue( name );
                        if ( name === "opacity" && ret === "" ) {
                            ret = "1";
                        }
                    }
                    return ret;
                };
                if ( value === undefined || Q.isBoolean(value) ) {
                    if ( typeof name == "string" ) {
                        if(value){
                            computed = value;
                        }
                        elem = elem.length ? elem[0] : elem;
                        //alert(elem);
                        return getcss(elem , name , computed)
                    //object
                    } else {
                        Q.each(elem,function(i, o) {
                            for ( var j in name ) {
                                if ( name.hasOwnProperty(j) ) {
                                    setcss(o,j,name[j])
                                }
                            }
                        });
                    }

                } else {
                    Q.each(elem,function(i, o) {
                        setcss(o,name,value)
                    });
                }
                return elem;
            },
            /**
            * 元素位置的查询
            * @name QST.css.offset
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @returns {Object} 返回对象有2个属性 left 和 top
            * @example
            * // 获取元素的左边位置
            * Q.css.offset(QST.dom.query('.box')).left;
            * // 获取元素的上边位置
            * Q.css.offset(QST.dom.query('.box')).top;
            * // 结果:'0px'
            * @see 示例演示地址 <a href="../../examples/demo/css/offset.html" target="_blank">QST.css.offset()</a>.
            */
            offset: function(elem) {
                elem = elem.length ? elem[0] : elem;
                if ( elem ) {
                    var offset = {
                        'left' : elem.offsetLeft,
                        'top' : elem.offsetTop
                    }
                    while ( elem = elem.offsetParent ) {
                        offset.left += elem.offsetLeft;
                        offset.top += elem.offsetTop;
                    }
                    return offset;
                }
                return 0;
            }
       })

       Q.each(['width','height'],function(i,o){
           function UpperFirstLetter(str)
           {
               return str.replace(/\b\w+\b/g, function(word) {
                    return word.substring(0,1).toUpperCase( ) +
                     word.substring(1);
               });
           }
           var name = UpperFirstLetter(o);
            /**
            * 元素外部宽度查询
            * @name QST.css.outerWidth
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String|Number} option 是否计算padding值
            * @returns {HTMLElement|Nodelist/String} 返回宽度（计算border+margin），当option为true时候加上padding值
            * @example
            * // 设置元素的外部宽度
            * Q.css.outerWidth(QST.dom.query('.box'))；
            * // 结果:'300px'
            */

            /**
            * 元素外部高度查询
            * @name QST.css.outerHeight
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String|Number} option 是否计算padding值
            * @returns {HTMLElement|Nodelist/String} 返回高度（计算border+margin），当option为true时候加上padding值
            * @example
            * // 设置元素的外部高度
            * Q.css.outerHeight(QST.dom.query('.box'))；
            * // 结果:'300px'
            */
           Q.css['outer'+name] = function(elem,option){
               elem = elem.length ? elem[0] : elem ;
               function getsize(mod){
                   return parseInt(Q.css.css(elem,mod));
               }
               return name === "Width" ? elem.clientWidth : elem.clientHeight ;
           }
            /**
            * 元素内部宽度查询
            * @name QST.css.innerWidth
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @returns {HTMLElement|Nodelist/String} 返回内部宽度（width+padding）
            * @example
            * // 设置元素的内部宽度
            * Q.css.innerWidth(QST.dom.query('.box'))；
            * // 结果:'220px'
            */

            /**
            * 元素内部高度查询
            * @name QST.css.innerHeight
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @returns {HTMLElement|Nodelist/String} 返回内部高度（height+padding）
            * @example
            * // 设置元素的内部高度
            * QST.css.innerHeight(QST.dom.query('.box'))；
            * // 结果:'220px'
            */
           Q.css['inner'+name] = function(elem){
               elem = elem.length ? elem[0] : elem ;
               return name === "Width" ? elem.clientWidth : elem.clientHeight ;
           }
            /**
            * 元素宽度查询与设置
            * @name QST.css.width
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String|Number} size 宽度的尺寸
            * @returns {HTMLElement|Nodelist/String} 返回elem，当尺寸值缺省时返回该元素实际宽度
            * @example
            * // 设置元素的宽度
            * QST.css.width(QST.dom.query('.box'),200)；
            * // 获取元素的宽度
            * QST.css.width(QST.dom.query('.box'));
            * // 结果:'200px'
            * @see 示例演示地址 <a href="../../examples/demo/css/wh.html" target="_blank">QST.css.width()</a>.
            */

            /**
            * 元素高度查询与设置
            * @name QST.css.height
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String|Number} size 高度的尺寸
            * @returns {HTMLElement|Nodelist/String} 返回elem，当尺寸值缺省时返回该元素实际宽度
            * @example
            * // 设置元素的左边位置
            * QST.css.height(QST.dom.query('.box'),200);
            * // 获取元素的上边位置
            * QST.css.height(QST.dom.query('.box'));
            * // 结果:'200px'
            * @see 示例演示地址 <a href="../../examples/demo/css/wh.html" target="_blank">QST.css.height()</a>.
            */
           Q.css[o.toLowerCase()] = function(elem,size){
               elem = elem.length ? elem[0] : elem ;
               return Q.isUndefined(size) ?   Q.css.css(elem,o) :
                     Q.css.css(elem,o,Q.isString(size)? size : size+"px" );

           }
       })
   })(this,Q);

   (function(win,Q) {
       var quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/;
        /**
        * dom的操作，dom查找复制等。
        * @name QST.dom
        * @namespace QST的dom对象，提供dom查找，复制，插入，修改等操作（注意QST.dom操作以及返回均为Nodelist）
        */
       Q.add("dom",{
            /**
            * 提供DOM的查询
            * @name QST.dom.query
            * @function
            * @param {String} selector 查询规则语句 支持CSS3选择器
            * @param {HTMLElement|Nodelist} context 父级查询容器
            * @returns {Nodelist|Fragment} 返回查询结果
            * @example
            * // 获取class = 'box' 的元素集合
            * QST.dom.query('.box');
            * // 获取id = 'box' 的元素集合
            * QST.dom.query('#box');
            * // 获取有class = 'box' 且 拥有style属性的元素集合
            * QST.dom.query('.test[style]');
            * // 获取body最后一个元素
            * QST.dom.query(‘body:last-child');
            * @see 示例演示地址 <a href="../../examples/demo/dom/query.html" target="_blank">QST.dom.query()</a>.
            */
            query : function(selector, context){
                var ret,match,elem;
                if ( !selector ) {
                    return false;
                }
                if ( selector.QST ) {
                    return selector;
                }
                if( typeof selector == 'string' ){
                    this.selector = selector;
                    match = quickExpr.exec( selector );
                    if ( match && (match[1] || !context) ){
                        if ( match[1] ) {
                            ret = Q.toElem(selector).childNodes;
                            this.context = document;
                        // HANDLE: $("#id")
                        } else {
                            elem = document.getElementById( match[2] );
                            if ( elem ) {
                                return [elem];
                            }
                        }
                    } else if ( !context && /^\w+$/.test( selector ) ) {
                        this.context = document;
                        ret = document.getElementsByTagName( selector );
                    } else if(!!context){
                        return Q.dom.find(context , selector);
                    }
                    else{
                        context = context || document;
                        ret = context.querySelectorAll(selector);
                    }
                    return ret;
                }else if(selector.nodeType){
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }else if(Q.isFunction( selector ) ){
                    return Q.ready(selector);
                }
                return selector;
            },
            /**
            * 对匹配元素的设置值，当属性值缺省时返回该元素值
            * @name QST.dom.val
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String} value 表单元素的值，select可以用value，也可以用index值设置
            * @returns {HTMLElement|Nodelist/String} 返回设置元素，当value缺省时返回元素的val
            * @example
            * // 设置元素的值
            * QST.dom.val(QST.dom.query('input.inp_name'),'这是一个新的值')；
            * QST.dom.width(QST.dom.query('select'),1);
            * QST.dom.width(QST.dom.query('select'),'sel1');
            * // 获取元素的值
            * QST.dom.val(QST.dom.query('input.inp_name'))；
            * QST.dom.width(QST.dom.query('select'));
            * @see 示例演示地址 <a href="../../examples/demo/dom/val.html" target="_blank">QST.dom.val()</a>.
            */
			val : function( node , value ){
				var elem = node.length ? node[0]: node;
				if(value == undefined )
				{
					if( Q.dom.node(elem,'select'))
					{
						var index = elem.selectedIndex,opval;
						if(index<0)
						{
							return null;
						}
                        opval = Q.dom.query( "option", node )[index].value;
						return opval!='' ? opval : index ;
					}
					else if( Q.dom.node(elem,'option'))
					{
						return (elem.attributes.value || {}).specified ? elem.value : elem.text;
					}
					return elem.value;
				}
				return Q.each(node,function(i,o) {
					var val = value;
					if ( this.nodeType !== 1 ) {
						return;
					}
					if ( typeof val === "number" ) {
						val += "";
					}
					if ( Q.dom.node(this,'select')) {
                        if(Q.isString(value)){
                            for(var i = 0 ; i<this.length ; i++){
                                var o = this[i];
                                if(Q.dom.val(o) == val){
                                    o.selected = true;
                                }
                            }
                        }else{
                            this[value].selected = true;
                        }
					} else {
						this.value = val;
					}
				});
			},
            /**
            * DOM查找方法
            * @name QST.dom.find
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @param {String} selector 查询规则语句 支持CSS3选择器
            * @returns {Nodelist|Fragment} 返回查询结果集合
            * @example
            * // 在div.box中查找 p
            * QST.dom.find(QST.dom.query('.box'),"p")
            * @see 示例演示地址 <a href="../../examples/demo/dom/find.html" target="_blank">QST.dom.find()</a>.
            */
            find : function(node , selector){
                var ret = [];
                Q.each(node , function(i, o){
                    var result = o.querySelectorAll(selector);
                    Q.each(result, function(i, o) {
                        var elem = o ;
                        // 删除重复的 dom
                        Q.each(ret,function(i,o){
                            if(o === elem ){
                                ret.splice(i--, 1);
                            }
                        })
                        ret.push(elem);
                    });
                });
                return ret;
            },
            /**
            * 清空每个匹配的元素内部
            * @name QST.dom.empty
            * @function
            * @param {HTMLElement|Nodelist} elem
            * @returns {Nodelist|Fragment} 返回清空dom集合
            * @example
            * // 清空页面元素
            * QST.dom.empty(QST.dom.query('body'))
            * @see 示例演示地址 <a href="../../examples/demo/dom/empty.html" target="_blank">QST.dom.empty()</a>.
            */
            empty: function (elem) {
                return Q.each(elem,function(i, o) {
                    while ( o && o.firstChild ) {
                        o.removeChild( o.firstChild );
                    }
                });
            },
            domManip: function ( node , args, callback ) {
                if ( node.length > 0 ) {
                    var elems = QST.toElem( args );
                    for ( var i = 0, l = node.length; i < l; i++ ) {
                        callback.call( node[i], l > 1? elems.cloneNode(true): elems );
                    }
                }else{
                    var elems = QST.toElem( args );
                    callback.call( node, l > 1? elems.cloneNode(true): elems );
                }
                return node;
            },
            /**
            * 向每个匹配的元素内部追加内容。
            * @name QST.dom.append
            * @function
            * @param {HTMLElement|Nodelist} node
            * @param {HTMLElement|Nodelist|String} elems 追加元素集合
            * @returns {Nodelist} 返回匹配元素node
            * @example
            * // 将div.test追加到body当中
            * QST.dom.append(QST.dom.query('body'),QST.dom.query('.test'))
            * // 结果
            * &lt;body&gt;
            *    &lt;h1>QST.dom.prependTo()&lt;/h1&gt;
            *    &lt;div class='test'&gt;test&lt;/div&gt;
            * &lt;/body&gt;
            * @see 示例演示地址 <a href="../../examples/demo/dom/pend.html" target="_blank">QST.dom.append()</a>.
            */
            append: function ( node , elems ) {
                return Q.dom.domManip( node , elems, function( elem ) {
                    if ( this.nodeType == 1 ) {
                        this.appendChild( elem );
                    }
                });
            },
            /**
            * 把所有匹配的元素追加到另外一个匹配的元素集合中
            * @name QST.dom.appendTo
            * @function
            * @param {HTMLElement|Nodelist|String} node 追加元素集合
            * @param {HTMLElement|Nodelist} elems
            * @returns {Nodelist} 返回匹配元素node
            * @example
            * // 将div.test追加到body当中
            * QST.dom.append(QST.dom.query('.test'),QST.dom.query('body'))
            * // 结果
            * &lt;body&gt;
            *    &lt;h1&gt;QST.dom.prependTo()&lt;/h1&gt;
            *    &lt;div class='test'&gt;test&lt;/div&gt;
            * &lt;/body&gt;
            * @see 示例演示地址 <a href="../../examples/demo/dom/pend.html" target="_blank">QST.dom.appendTo()</a>.
            */
            appendTo : function(node , elems) {
                QST.node(elems).append(node);
                return node;
            },
            /**
            * 向每个匹配的元素内部前置内容。
            * @name QST.dom.prepend
            * @function
            * @param {HTMLElement|Nodelist} node 前置元素集合
            * @param {HTMLElement|Nodelist|String} elems
            * @returns {Nodelist} 返回匹配元素node
            * @example
            * // 将div.test前置到body当中
            * QST.dom.prepend(QST.dom.query('.test'),QST.dom.query('body'))
            * // 结果
            * &lt;body&gt;
            *    &lt;div class='test'&gt;test&lt;/div&gt;
            *    &lt;h1&gt;QST.dom.prependTo()&lt;/h1&gt;
            * &lt;/body&gt;
            * @see 示例演示地址 <a href="../../examples/demo/dom/pend.html" target="_blank">QST.dom.prepend()</a>.
            */
            prepend: function ( node, elems ) {
                return Q.dom.domManip( node , elems, function( elem ) {
                    if ( this.nodeType == 1 ) {
                        this.insertBefore( elem, this.firstChild );
                    }
                });
            },
            /**
            * 把所有匹配的元素前置到另外一个匹配的元素集合中
            * @name QST.dom.prependTo
            * @function
            * @param {HTMLElement|Nodelist|String} node 追加元素集合
            * @param {HTMLElement|Nodelist} elems
            * @returns {Nodelist} 返回匹配元素node
            * @example
            * // 将div.test前置到body当中
            * QST.dom.prependTo(QST.dom.query('body'),QST.dom.query('.test'))
            * // 结果
            * &lt;body&gt;
            *    &lt;div class='test'&gt;test&lt;/div&gt;
            *    &lt;h1&gt;QST.dom.prependTo()&lt;/h1&gt;
            * &lt;/body&gt;
            * @see 示例演示地址 <a href="../../examples/demo/dom/pend.html" target="_blank">QST.dom.prependTo()</a>.
            */
            prependTo : function( node , elems) {
                QST.node(elems).prepend(node);
                return node;
            },
            /**
            * 对每个匹配的元素之前插入内容。
            * @name QST.dom.before
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {HTMLElement|Nodelist|String} elems 插入内容
            * @returns {Nodelist} 返回匹配元素node
            * @example
            * // 将div.test前插入元素<p>我是前插的p</p>
            * QST.dom.before(QST.dom.query('body'),QST.dom.creat('<p>我是前插的p</p>'))
            * // 结果
            *    &lt;p&gt;我是前插的p&lt;/p&gt;
            *    &lt;div class='test'&gt;test&lt;/div&gt;
            */
            before: function ( node , elems ) {
                return Q.dom.domManip( node , elems, function( elem ) {
                    if ( this.parentNode ) {
                        this.parentNode.insertBefore( elem, this );
                    }
                });
            },
            /**
            * 将内容插入到每个匹配的元素之前。
            * @name QST.dom.insertBefore
            * @function
            * @param {HTMLElement|Nodelist|String} node 插入内容
            * @param {HTMLElement|Nodelist} elems 匹配元素
            * @returns {Nodelist} 返回匹配元素node
            * @example
            * // 将div.test前插入元素<p>我是前插的p</p>
            * QST.dom.insertBefore(QST.dom.creat('<p>我是前插的p</p>'),QST.dom.query('body'))
            * // 结果
            *    &lt;p&gt;我是前插的p&lt;/p&gt;
            *    &lt;div class='test'&gt;test&lt;/div&gt;
            */
            insertBefore: function ( node , elems ) {
                QST.node(elems).before(node);
                return node;
            },
            /**
            * 对每个匹配的元素之后插入内容。
            * @name QST.dom.after
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {HTMLElement|Nodelist|String} elems 插入内容
            * @returns {Nodelist} 返回匹配元素node
            * @example
            * // 将div.test前插入元素<p>我是后插的p</p>
            * QST.dom.after(QST.dom.query('body'),QST.dom.creat('<p>我是后插的p</p>'))
            * // 结果
            *    &lt;div class='test'&gt;test&lt;/div&gt;
            *    &lt;p&gt;我是后插的p&lt;/p&gt;
            */
            after: function ( node , elems ) {
                return Q.dom.domManip( node , elems, function( elem ) {
                    if ( this.parentNode ) {
                        this.parentNode.insertBefore( elem, this.nextSibling );
                    }
                });
            },
            /**
            * 将内容插入到每个匹配的元素之后。
            * @name QST.dom.insertAfter
            * @function
            * @param {HTMLElement|Nodelist|String} node 插入内容
            * @param {HTMLElement|Nodelist} elems 匹配元素
            * @returns {Nodelist} 返回匹配元素node
            * @example
            * // 将div.test前插入元素<p>我是后插的p</p>
            * QST.dom.insertAfter(QST.dom.creat('<p>我是后插的p</p>'),QST.dom.query('body'))
            * // 结果
            *    &lt;div class='test'&gt;test&lt;/div&gt;
            *    &lt;p&gt;我是后插的p&lt;/p&gt;
            */
            insertAfter: function ( node , elems ) {
                QST.node(elems).after(node);
                return node;
            },
            /**
            * 创建DOM元素。creat为dom方法,node下无法访问,node类可以直接$('<div>test</div>') 来创建
            * @name QST.dom.creat
            * @function
            * @param {String} str DOM语句
            * @returns {HTMLElement} 返回dom节点
            * @example
            * // 创建元素&lt;div&gt;test</div&gt;
            * QST.dom.creat('<div>test</div>')
            * // 结果
            *    &lt;div&gt;test&lt;/div&gt;
            */
            creat : function(str){
                return Q.toElem(str).childNodes;
            },
            /**
            * 从DOM中删除所有匹配的元素
            * @name QST.dom.remove
            * @function
            * @param {HTMLElement|Nodelist} node 需要删除元素
            * @returns {HTMLElement|Nodelist} 返回被删除元素
            * @example
            * // 初始
            *    &lt;div class='test'&gt;
            *       鄙视楼下的
            *       &lt;p&gt;我预感我要被删除了&lt;/p&gt;
            *    &lt;/div&gt;
            * // 删除div中的p元素
            * QST.dom.remove(QST.dom.query('.test p'))
            * // 结果
            *    &lt;div class='test'&gt;
            *       鄙视楼下的
            *    &lt;/div&gt;
            */
            remove: function (node) {
                return Q.each(node , function( i, o ){
                    if ( o.parentNode ) {
                         o.parentNode.removeChild( o );
                    }
                });
            },
            /**
            * 对所有匹配的元素设置属性值，当属性值缺省时返回该属性值
            * @name QST.dom.attr
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {String} name 属性名
            * @param {String} value 属性值
            * @returns {HTMLElement|Nodelist/String} 返回匹配元素，或者属性值
            * @example
            * // 设置图片的src值
            * QST.dom.attr(QST.dom.query('img.pic_1'),'src','img/pic_1.jpg')；
            * // 获取script的src
            * QST.dom.val(QST.dom.query('script'),'src')；
            * @see 示例演示地址 <a href="../../examples/demo/dom/attr.html" target="_blank">QST.dom.attr()</a>.
            */
            attr: function ( node , name, value ) {
                if ( value === undefined ) {
                    if(Q.isPlainObject(name)){
                        Q.each(name,function(i,o){
                            return Q.dom.attr(node,i,o);
                        })
                    }
                    node = node.length? node[0] : node;
                    return node.getAttribute( name );
                } else {
                    return Q.each( node , function(i, o) {
                        o.setAttribute( name, value );
                    });
                }
            },
            /**
            * 对所有匹配的元素删除属性值
            * @name QST.dom.removeAttr
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {String} name 属性名
            * @returns {HTMLElement|Nodelist} 匹配元素
            * @example
            * // 初始
            *       &lt;div rel="1" &gt;我预感我要被删除了&lt;/p&gt;
            * // 删除元素的rel值
            * QST.dom.removeAttr(QST.dom.query('.test'),'rel')；
            * // 结果
            *       &lt;div rel="" &gt;我预感我要被删除了&lt;/p&gt;
            * @see 示例演示地址 <a href="../../examples/demo/dom/attr.html" target="_blank">QST.dom.removeAttr()</a>.
            */
            removeAttr: function ( node , name ) {
                return Q.each( node , function(i, o) {
                    if ( o.nodeType === 1 ) {
                        o.removeAttribute( name );
                    }
                });
            },
            /**
            * 对匹配元素的设置文本内容，当属性值缺省时返回该元素文本内容
            * @name QST.dom.text
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {String} content 本文内容
            * @returns {HTMLElement|Nodelist/String} 匹配元素，或者文本内容
            * @example
            * // 初始
            *    &lt;a class='test'&gt;我预感马上要被干掉了&lt;/a&gt;
            * // 修改a标签的文本值
            * QST.dom.text(QST.dom.query('a'),'我是替补（无辜~）')；
            * // 结果
            *    &lt;a class='test'&gt;我是替补（无辜~）&lt;/a&gt;
            * // 获取a标签的文本值
            * QST.dom.text(QST.dom.query('a'))；
            * // 结果
            *    我是替补（无辜~）
            * @see 示例演示地址 <a href="../../examples/demo/dom/text.html" target="_blank">QST.dom.text()</a>.
            */
            text: function ( node , content ) {
                var ret = "";
                if ( content === undefined ) {
                     Q.each( node , function(i, o) {
                        ret += o.textContent;
                    });
                    return ret;
                }
                return  Q.each( node , function(i, o) {
                    o.textContent = content;
                });
            },
            /**
            * 设置匹配元素的html内容，当属性值缺省时返回该元素html
            * @name QST.dom.html
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {String} content html文本
            * @returns {HTMLElement|Nodelist/String} 匹配元素，或者html文本
            * @example
            * // 初始
            *    &lt;div class='test'&gt;
            *       &lt;p&gt;look i'm crazy&lt;/p&gt;
            *       &lt;a href="#"&gt;去看看&lt;/a&gt;
            *    &lt;/div&gt;
            * // 修改a标签的文本值
            * QST.dom.html(QST.dom.query('.test'),'<p>看什么？别动</p>')；
            * // 结果
            *    &lt;div class='test'&gt;看什么？别动&lt;/div&gt;
            * // 获取a标签的文本值
            * QST.dom.html(QST.dom.query('.test'))；
            * // 结果
            *    &lt;p&gt;看什么？别动&lt;/p&gt;
            * @see 示例演示地址 <a href="../../examples/demo/dom/html.html" target="_blank">QST.dom.html()</a>.
            */
            html : function( node , content ){
                if ( content === undefined || content === true ) {
                    var ret = "",
                        meth = content === true ? 'outerHTML' : 'innerHTML' ;
                     Q.each( node , function(i, o) {
                        ret += o[meth];
                    });
                    return ret;
                }
                return  Q.each( node , function(i, o) {
                    o.innerHTML = content;
                });
            },
            /**
            * 克隆匹配的DOM元素并且选中这些克隆的副本
            * @name QST.dom.clone
            * @function
            * @param {HTMLElement|Nodelist/String} node 匹配元素或者HTML内容
            * @returns {Nodelist} 返回克隆副本
            * @example
            * // 复制class='test'的元素
            * QST.dom.clone(QST.dom.query('.test'))；
            */
            clone: function( elem , events ) {
                var ret = [];
                if(Q.isString(elem)){
                    elem = QST.toElem( elem );
                }
                Q.each(elem , function(i,o) {
                    var elem = o.cloneNode(true);
                    ret.push(elem);
                });
                if ( events === true ) {
                }
                return ret;
            },
            /**
            * 验证匹配元素的nodeName，当name缺省时返回该元素的nodeName
            * @name QST.dom.node
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {String} name nodeName
            * @returns {Boolean/String} true false / 返回的nodeName
            * @example
            * // 查选class='test'元素名
            * QST.dom.node(QST.dom.query('.test'))；
            * // 结果 div
            * // 验证class='test'元素名是否等于select
            * QST.dom.node(QST.dom.query('.test'),'select')；
            * // 结果 false
            */
            node: function( node , name ) {
                var elem = (node.nodeName) ? node : node[0];
                if( name === undefined ){
                    return elem.nodeName.toLowerCase();
                }
                else{
                    return name == elem.nodeName.toLowerCase();
                }
            },
            /**
            * 查找匹配元素的父级元素
            * @name QST.dom.parent
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @returns {Nodelist} 父级元素集合
            * @example
            * // 查选class='test'的父级元素
            * QST.dom.parent(QST.dom.query('.test'))；
            */
            parent: function(node) {
                var ret = [];
                Q.each(node , function(i, o){
                    ret.push(o.parentNode);
                });
                return ret;
            },
            /**
            * 查找匹配元素的前一个元素
            * @name QST.dom.prev
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @returns {Nodelist} 前一个元素集合
            * @example
            * // 查选class='test'的前一个元素集合
            * QST.dom.prev(QST.dom.query('.test'))；
            */
            prev: function(node) {
                var ret = [];
                Q.each(node , function(i, o){
                    while (o) {
                        o = o.previousSibling;
                        if ( o && o.nodeType == 1 ) {
                            break;
                        }
                    }
                    ret.push(o);
                });
                return ret;
            },
            /**
            * 查找匹配元素的后一个元素
            * @name QST.dom.next
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @returns {Nodelist} 后一个元素集合
            * @example
            * // 查选class='test'的后一个元素集合
            * QST.dom.next(QST.dom.query('.test'))；
            */
            next: function(node) {
                var ret = [];
                Q.each(node , function(i, o){
                    while (o) {
                        o = o.nextSibling;
                        if ( o && o.nodeType == 1 ) {
                            break;
                        }
                    }
                    ret.push(o);
                });
                return ret;
            },
            /**
            * 查找匹配元素的同级元素
            * @name QST.dom.siblings
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @returns {Nodelist} 同级元素集合
            * @example
            * // 查选class='test'中p的同级元素
            * QST.dom.siblings(QST.dom.query('.test p'))；
            */
            siblings: function(node) {
                var ret = [];
                Q.each(node, function(i, o){
                    var elem = o.parentNode.firstChild;
                    while (elem) {
                        if ( elem.nodeType == 1 && elem != o ) {
                            Q.each(ret,function(i,o){
                                if(o === elem ){
                                    ret.splice(i--, 1);
                                }
                            })
                            ret.push(elem);
                        }
                        elem = elem.nextSibling;
                    }
                });
                return ret;
            },
            /**
            * 查找匹配元素的子元素
            * @name QST.dom.children
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @returns {Nodelist} 子元素集合
            * @example
            * // 查选class='test'的子元素集合
            * QST.dom.children(QST.dom.query('.test'))；
            */
            children: function(node) {
                var ret = [];
                Q.each(node , function(i, o){
                    var elem = o.firstChild;
                    while (elem) {
                        if ( elem.nodeType == 1 ) {
                            ret.push(elem);
                        }
                        elem = elem.nextSibling;
                    }
                });
                return  ret ;
            },
            /**
            * 描述：与children相比较，contents会获取文本节点
            */
            /**
            * 查找匹配元素内部所有的子节点（包括文本节点）。
            * @name QST.dom.contents
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @returns {Nodelist} 子节点（包括文本节点）
            * @example
            * // 查选class='test'的子节点（同children对比）
            * QST.dom.contents(QST.dom.query('.test'))；
            */
            contents: function(node) {
                var elem = node.QST ? node[0] : node ;
                return Q.dom.node( node , "iframe" ) ?
                    elem.contentDocument || elem.contentWindow.document :
                    elem.childNodes;
            },
            wrapAll : function(node,html ){
                if ( Q.isFunction( html ) ) {
                    return Q.each(node,function(i) {
                        QST.dom.wrapAll( node , html.call(this, i) );
                    });
                }
                var elem  = node.length ? node[0] : node;
                if ( elem ) {
                    // The elements to wrap the target around
                    var wrap = QST.node( html, elem.ownerDocument ).eq(0).clone();
                    if ( elem.parentNode ) {
                        wrap.insertBefore( elem );
                    }
                    wrap.each(function() {
                        var elem = this;
                        while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                            elem = elem.firstChild;
                        }
                        return elem;
                    }).append(this);
                }
                return this;
            },
            wrap: function( node,html ) {
                return Q.each(node,function() {
                    QST.dom.wrapAll(this,html );
                });
            }

       });




   })(this,Q);

    (function(win,Q) {
        /**
        * 提供事件绑定，事件移除等
        * @name QST.event
        * @namespace QST的event对象，提供事件绑定等
        */
        var u = Q.ua,
            mobile_set = function(elem,name,type,fn,useCapture){
                if(type=='touchstart'){
                    Q.event[name]( elem , 'mousedown' , fn, useCapture );
                }
                if(type=='touchmove'){
                    Q.event[name]( elem , 'mousemove' , fn, useCapture );
                }
                if(type=='touchend'){
                    Q.event[name]( elem , 'mouseup' , fn, useCapture );
                }
            }
        Q.add('event',{
            /**
            * 为每一个匹配元素绑定事件处理器函数。如果为touch事件pc会默认绑定mouse事件兼容
            * @name QST.event.bind
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {String} type 事件类型
            * @param {Function} fn 触发函数
            * @returns {Nodelist} 匹配元素集合
            * @example
            * // 对所有的button绑定点击事件clickFunc
            * QST.event.bind(QST.dom.query('button'),'click',clickFunc)；
            */
            bind: function( node , type, fn, useCapture ) {
                useCapture = useCapture? true: false;
                return Q.each(node,function(i, o){
                    if (o){
                        o.addEventListener( type, fn, useCapture );
                        if(Q.isUndefined(u['MOBILE'])&&/touch/.test(type)){
                            mobile_set(o,'bind',type,fn,useCapture);
                        }
                    }
                },true);
            },
            /**
            * 为每一个匹配元素删除绑定事件处理器函数。如果为touch事件pc会默认绑定mouse事件兼容
            * @name QST.event.unbind
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {String} type 事件类型
            * @param {Function} fn 触发函数
            * @returns {Nodelist} 匹配元素集合
            * @example
            * // 对所有的button接触绑定点击事件clickFunc
            * QST.event.unbind(QST.dom.query('button'),'click',clickFunc)；
            */
            unbind: function( node , type, fn, useCapture ) {
                useCapture = useCapture? true: false;
                return Q.each(node , function(i, o){
                    if (o){
                        o.removeEventListener( type, fn, useCapture );
                        if(Q.isUndefined(u['MOBILE']&&/touch/.test(type))){
                            mobile_set(o,'unbind',type,fn,useCapture);
                        }
                    }
                });
            },
            /**
            * 为每一个匹配元素绑定touch事件。
            * @name QST.event.touch
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {Function} starfn 触发函数
            * @param {Function} movefn 触发函数
            * @param {Function} endfn 触发函数
            * @returns {Nodelist} 匹配元素集合
            * @example
            * // 对图片绑定touchstart,touchmove,touchend事件
            * QST.event.touch(QST.dom.query('img'),starfn,movefn,endfn)；
            */
            touch : function(node , starfn , movefn , endfn ){
                if(starfn){
                    Q.event.bind(node,'touchstart',function(){
                        starfn();
                        if(movefn){
                            Q.event.bind(node,'touchmove',movefn);
                        }
                    });
                }
                if(endfn){
                    Q.event.bind(node,'touchend',function(){
                        endfn();
                        if(movefn){
                            Q.event.unbind(node,'touchmove',movefn);
                        }
                    });
                }
                return node;
            },
            swipe : function(node,callback){
                var defaults = {
                    threshold: {
                        x: 10,
                        y: 10
                    }
                };
                var originalCoord = { x: 0, y: 0 },
                    finalCoord = { x: 0, y: 0 };
                function touchMove(event) {
                    event.preventDefault();
                    // Updated X,Y coordinates
                    if(Q.isUndefined(u['MOBILE'])){
                        finalCoord.x = event.pageX;
                        finalCoord.y = event.pageY;
                    }else{
                        finalCoord.x = event.targetTouches[0].pageX;
                        finalCoord.y = event.targetTouches[0].pageY;
                    }
                }
                function touchEnd(event) {
                    //console.log('Ending swipe gesture...')
                    var changeY = originalCoord.y - finalCoord.y,
                        changeX = originalCoord.x - finalCoord.x,
                        directX,directY;
                    if( Math.abs(changeX)> 50 ){
                        if(changeX>0){
                            directX = 'left';
                        }else{
                            directX = 'right';
                        }
                        Q.extend(event,{
                            'directX' : directX,
                            'changeX' : changeX,
                            'changeY' : changeY
                        })
                        callback.call(node,event);
                    }

                }
                function touchStart(event) {
                    if(Q.isUndefined(u['MOBILE'])){
                        originalCoord.x = event.pageX;
                        originalCoord.y = event.pageY;
                    }else{
                        originalCoord.x = event.targetTouches[0].pageX;
                        originalCoord.y = event.targetTouches[0].pageY;
                    }
                    finalCoord.x = originalCoord.x
                    finalCoord.y = originalCoord.y
                }
                Q.event.bind(node,'touchstart',touchStart);
                Q.event.bind(node,'touchmove',touchMove);
                Q.event.bind(node,'touchend',touchEnd);


                return node;
            }
        })
        /**
        * 为每一个匹配元素删除绑定事件处理器函数。
        * @name QST.event.touchstart
        * @function
        * @param {HTMLElement|Nodelist} node 匹配元素
        * @param {Function} fn 触发函数
        * @returns {Nodelist} 匹配元素集合
        */
        /**
        * 为每一个匹配元素删除绑定事件处理器函数。
        * @name QST.event.touchmove
        * @function
        * @param {HTMLElement|Nodelist} node 匹配元素
        * @param {Function} fn 触发函数
        * @returns {Nodelist} 匹配元素集合
        */
        /**
        * 为每一个匹配元素删除绑定事件处理器函数。
        * @name QST.event.touchend
        * @function
        * @param {HTMLElement|Nodelist} node 匹配元素
        * @param {Function} fn 触发函数
        * @returns {Nodelist} 匹配元素集合
        */
        /**
        * 为每一个匹配元素删除绑定事件处理器函数。
        * @name QST.event.gesturestart
        * @function
        * @param {HTMLElement|Nodelist} node 匹配元素
        * @param {Function} fn 触发函数
        * @returns {Nodelist} 匹配元素集合
        */
        /**
        * 为每一个匹配元素删除绑定事件处理器函数。
        * @name QST.event.gesturechange
        * @function
        * @param {HTMLElement|Nodelist} node 匹配元素
        * @param {Function} fn 触发函数
        * @returns {Nodelist} 匹配元素集合
        */
        /**
        * 为每一个匹配元素删除绑定事件处理器函数。
        * @name QST.event.gestureend
        * @function
        * @param {HTMLElement|Nodelist} node 匹配元素
        * @param {Function} fn 触发函数
        * @returns {Nodelist} 匹配元素集合
        */
        /**
        * 为每一个匹配元素删除绑定事件处理器函数。
        * @name QST.event.click
        * @function
        * @param {HTMLElement|Nodelist} node 匹配元素
        * @param {Function} fn 触发函数
        * @returns {Nodelist} 匹配元素集合
        */
        /**
        * 为每一个匹配元素删除绑定事件处理器函数。
        * @name QST.event.submit
        * @function
        * @param {HTMLElement|Nodelist} node 匹配元素
        * @param {Function} fn 触发函数
        * @returns {Nodelist} 匹配元素集合
        */
        Q.each(['touchstart','touchmove','touchend','touchcancel','gesturestart','gesturechange','gestureend','click','mousemove','mousedown','mouseup','mouseover','mouseout','mouseover','mouseout','submit'],function(i,o){
            Q.event[o] = function ( node , fn, useCapture ) {
		        Q.event.bind( node , o, fn, useCapture );
		        return this;
	        };
        });
    })(this,Q);

    (function(win,Q) {
        var expando = "QST" + Q.now(), uuid = 0, windowData = {};
        /**
        * 提供dom存储，cookie，本地存储等操作
        * @name QST.cache
        * @namespace QST的cache对象，提供dom存储，cookie，本地存储等操作
        */
        Q.add('cache',{
            datacache: {},
            /**
            * 在匹配元素上存储数据，当data缺省时候返回该数据值，自动处理JSON与数组
            * @name QST.cache.storage
            * @function
            * @param {String|object} name 数据名
            * @param {String|Object|Array} data 数据值
            * @returns {Number|String|Object} 匹配元素，数据值
            * @example
            * // 存储一个名为'data'对象数据
            * QST.cache.storage('data',{uin:'463435681',
            * pas:'123456'});
            * // 存储一组数据
            * QST.cache.storage({
            *       'name':'ares',
            *       'age':22,
            *       'sex':'male'
            * });
            * // 获取'data'数据
            * QST.cache.storage('data');
            * // 结果 {
            *   uin:'463435681',
            *   pas:'123456'
            * }
            * // 获取有'name'数据
            * QST.cache.storage('name');
            * // 结果 'ares'
            */
            storage : function(name , value){
                if(Q.isUndefined(value)){
                    if(Q.isPlainObject(name)){
                       return Q.each(name,function(i,o){
                           Q.cache.storage(i,o)
                       })
                    }
                    var res = localStorage.getItem(name);
                    return Q.toJSON(res);
                }else{
                    if(Q.isArray(value)){
                        value =  Q.makeArray(value,{length:0});
                    }
                    if(Q.isPlainObject(value)){
                        value = Q.toJSONString(value);
                    }
                    localStorage.setItem(name,value)
                    return Q;
                }
            },
            /**
            * 删除本地数据
            * @name QST.cache.removeStorage
            * @function
            * @param {String} name 数据名
            * @returns {Nodelist/String|Object|Array} 匹配元素，数据值
            * @example
            * // 删除名为'data'的本地数据
            * QST.cache.removeStorage('data');
            */
            removeStorage : function(name){
                localStorage.removeItem(name);
            },
            /**
            * 在匹配元素上存储数据，当data缺省时候返回该数据值
            * @name QST.cache.data
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {String|object} name 数据名/数据object
            * @param {String|Object|Array} data 数据值
            * @returns {Nodelist/String|Object} 匹配元素，数据值
            * @example
            * // 对第一个div.box 存储对象数据
            * QST.cache.data(QST.dom.query('.box')[0],{uin:'463435681',
            * pas:'123456'});
            * // 对所有div.box 存储名为'data'数组数据
            * QST.cache.data(QST.dom.query('.box'),'data',[1,2,3]);
            * // 获取第一个div.box数据
            * QST.cache.data(QST.dom.query('.box')[0]);
            * // 结果 {
            *   uin:'463435681',
            *   pas:'123456'
            * }
            * // 获取有div.box 'data'数据
            * QST.cache.data(QST.dom.query('.box'),'data');
            * // 结果 {
            *   0:1,
            *   1:2,
            *   2:3
            * }
            */
            data: function( elem, name, data ) {
                elem = elem == window ? windowData : elem;

                var id = elem[ expando ], cache = Q.cache.datacache;

                if ( !id && typeof name === "string" && data === undefined ) {
                    return null;
                }

                if ( !id ) {
                    elem[ expando ] = id = ++uuid;
                }

                if ( typeof name === "object" ) {
                    cache[id] = Q.mix( {}, name );

                } else if ( !cache[id] ) {
                    cache[ id ] = {};
                }

                if ( data !== undefined ) {
                    cache[ id ][ name ] = data;
                    return elem;
                }
                return typeof name === "string"? cache[ id ][ name ] : cache[ id ];
            },
            /**
            * 在匹配元素上删除数据
            * @name QST.cache.removeData
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {String} name 数据名
            * @returns {Nodelist/String|Object|Array} 匹配元素，数据值
            * @example
            * // 删除第一个div.box的数据
            * QST.cache.data(QST.dom.query('.box')[0]);
            * // 删除所有div.box 名为'data'的数据
            * QST.cache.data(QST.dom.query('.box'),'data');
            */
            removeData: function( elem, name ) {
                elem = elem == window ? windowData : elem;

                var id = elem[ expando ], cache = Q.cache.datacache, thisCache = cache[ id ];

                if ( name ) {
                    if ( thisCache ) {
                        delete thisCache[ name ];
                        if ( Q.isEmptyObject(thisCache) ) {
                            Q.cache.removeData( elem );
                        }
                    }
                } else {
                    delete elem[ expando ];
                    delete cache[ id ];
                }
                return elem;
            },
            cookie:function(name,key,options){
                if (typeof key != 'undefined') { // name and value given, set cookie
                    options = options || {};
                    if (key === null) {
                        key = '';
                        options.expires = -1;
                    }
                    var expires = '';
                    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                        var date;
                        if (typeof options.expires == 'number') {
                            date = new Date();
                            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                        } else {
                            date = options.expires;
                        }
                        expires = '; expires=' + date.toUTCString();
                    }
                    var path = options.path ? '; path=' + options.path : '';
                    var domain = options.domain ? '; domain=' + options.domain : '';
                    var secure = options.secure ? '; secure' : '';
                    document.cookie = [name, '=', encodeURIComponent(key), expires, path, domain, secure].join('');
                } else { // only name given, get cookie
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = Q.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
            }
        })

    })(this,Q);

    (function(win,Q) {
        /**
        * 在phonegap的配合之下，提供手机端原生应用的支持
        * @name QST.native
        * @namespace QST的native对象，在phonegap的配合之下，提供手机端原生应用的支持
        */
        Q.add('native',{
            /**
            * 当native载入就绪可以绑定一个函数。
            * @name QST.native.ready
            * @function
            * @param {Function} fn 绑定函数
            */
            ready : function(fn){
               document.addEventListener("deviceready",Q.ready(fn), false);
            },
            /**
            * 检查当前网络状态
            * @name QST.native.network
            * @function
            * @param {String} url 目标网址（默认为“show.qq.com”）
            * @returns {Number} 网络连接状态
                        0 为 没有网络连接
                        1 为 移动网络连接
                        2 为 WIFI网络连接
            * @example
            * // 检查当前网络状态,是否能连上"nbavip.qq.com"
            * QST.native.network('nbavip.qq.com');
            */
            network : function(url){
                function reachableCallback(reachability) {
                    var networkState = reachability.code || reachability;
                    var states = {};
                    // 返回码  0 为 没有网络连接
                    states[NetworkStatus.NOT_REACHABLE] = 0;
                    // 返回码  1 为 移动网络连接
                    states[NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK] = 1;
                    // 返回码  2 为 WIFI网络连接
                    states[NetworkStatus.REACHABLE_VIA_WIFI_NETWORK] = 'WiFi connection';
                    return(states[networkState]);
                }
                url = url || 'show.qq.com';
                navigator.network.isReachable(url, reachableCallback, {});
            },
            /**
            * 返回手机版本。
            * @name QST.native.version
            * @function
            * @returns {String} 手机版本 iOS 4.1 returns "4.1"
            */
            version : function(){
                return device.version;
            }
        })

    })(this,Q);

    (function(win,Q) {
         var getAnimateOpt = function( speed, easing, fn ) {
            var opt = speed && typeof speed === "object" ? speed : {
                complete: fn || !fn && easing || Q.isFunction( speed ) && speed,
                duration: speed,
                easing: fn && easing || easing && typeof easing === "string" && easing || "linear"
            };

            opt.duration = typeof opt.duration === "number" ? opt.duration :
                speedslist[opt.duration] || speedslist._default;
            opt.old = opt.complete;
            opt.complete = function() {
                if ( Q.isFunction( opt.old ) ) {
                    opt.old.call( this );
                }
            };
            return opt;
        }, speedslist = {
            slow: 600,
            fast: 200,
            _default: 400
	    },rfxnum = /^([+-]=)?([\d+-.]+)(.*)$/,
        fnFlag = "_fxCallback_",
        timeIdFlag = "_fxTimeId_",
        rdashAlpha = /-([a-z])/ig;
        /**
        * 动画效果类，用CSS3封装的动画效果类
        * @name QST.effect
        * @namespace QST的effect对象， 动画效果类，用CSS3封装的动画效果类
        */
        Q.add('effect',{
            /**
            * 对每一个匹配元素停止动画
            * @name QST.effect.stop
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {Bollean} end 是否运行到动画最终状态并执行终止动画
            */
            stop : function(elem,end){
                return Q.each(elem,function(i, o){
                    var trsProp = Q.css.css(o, "webkitTransitionProperty"),
                        anilist = trsProp && trsProp.split(",") || [],
                        obj = {},computed = end == true ? false : true;
                    for (var i = 0; i < anilist.length; i++) {
                        var name = Q.trim(anilist[i]);
                        obj[name] = Q.css.css( o , name , computed);
                    }
                    obj["webkitTransitionProperty"] = "none";
                    Q.css.css(o, obj);

                    if ( end && Q.cache.data(o, fnFlag) ) {
                        Q.cache.data(o, fnFlag).call(o);
                    }
                    clearTimeout( Q.cache.data(o, timeIdFlag) );
                    Q.cache.removeData(o, fnFlag);
                    Q.cache.removeData(o, timeIdFlag);
                });
            },
            /**
            * 对每一个匹配元素创建自定义动画的函数。
            * @name QST.effect.animate
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {Object} params 动画效果方式
            * @param {Object/Number} options 动画设置/运动时间
            * @param {String} easing -webkit-transition-timing-function 值，可自定义贝塞尔缓动曲线
            * @param {Function} fn 动画结束之后执行的函数
            */
            animate: function( elem , prop, speed, easing, fn ) {
                var names = [], name, trsProp, timeId,
                    opt = getAnimateOpt( speed, easing, fn );
                for ( name in prop ) {
                    names.push(name);
                }
                trsProp = names.join(", ");
                Q.css.css(elem, "webkitTransitionProperty", trsProp);
                Q.css.css(elem, "webkitTransitionDuration", opt.duration + "ms")
                Q.css.css(elem, "webkitTransitionTimingFunction", opt.easing);
                return Q.each(elem , function(i,o){
                    var self = o;
                    if ( opt.start ) {
                        opt.start.call(self)
                    }
                    for (name in prop) {
                        var parts = rfxnum.exec(prop[name]);
                        if ( parts && parts[1]) {
                            var end = parseFloat( parts[2] ),
                                start = parseFloat(Q.css.css(self, name)) || 0,
                                unit = parts[3];

                            end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
                            prop[name] = end + unit;
                        }
                    }
                    timeId = window.setTimeout(function() {
                        Q.cache.removeData( self, timeIdFlag );
                        Q.cache.removeData( self, fnFlag )
                        Q.css.css(self, "webkitTransitionProperty", "none");
                        opt.complete.call(self);
                    }, opt.duration);
                    //存储callback和timeId 在stop时可以调用和clearTimeout
                    Q.cache.data( self, fnFlag, opt.complete );
                    Q.cache.data( self, timeIdFlag, timeId )
                    if ( Q.css.css( self, "display" ) == "none" ) {
                        Q.css.css( self, "display", "block" );
                    }
                    //display=none时，在上面设成block显示后直接修改css属性不会触发transition
                    //需要用setTimeout将操作提到js操作队列最后执行。
                    window.setTimeout(function(){
                        for ( name in prop ) {
                            Q.css.css(self, name, prop[name]);
                        }
                    }, 0);
                });
            },
            /**
            * 显示每一个匹配元素
            * @name QST.effect.show
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {Number} options 运动时间
            * @param {Function} fn 动画结束之后执行的函数
            */
            show: function( elem , speed , fn ) {
                if (!speed) {
                    return Q.css.css(elem , "display","block");
                } else {
                    Q.effect.fadeIn( elem , speed, fn );
                }
            },
            /**
            * 隐藏每一个匹配元素
            * @name QST.effect.hide
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {Number} options 运动时间
            * @param {Function} fn 动画结束之后执行的函数
            */
            hide: function( elem , speed, fn ) {
                if (!speed) {
                    //return Q.each(function(i, o) {
                    return Q.css.css(elem , "display", "none");
                    //});
                } else {
                     Q.effect.fadeOut( elem , speed, fn );
                }
            },
            /**
            * 对每一个匹配元素进行渐隐
            * @name QST.effect.fadeIn
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {Number} options 运动时间
            * @param {Function} fn 动画结束之后执行的函数
            */
            fadeIn: function( elem , speed, fn ) {
                return Q.effect.animate(elem , { opacity : 1 }, speed, fn)
            },
            /**
            * 对每一个匹配元素进行渐显
            * @name QST.effect.fadeOut
            * @function
            * @param {HTMLElement|Nodelist} node 匹配元素
            * @param {Number} options 运动时间
            * @param {Function} fn 动画结束之后执行的函数
            */
            fadeOut: function( elem , speed, fn ) {
                return Q.effect.animate(elem , { opacity : 0 }, speed, function(){
                    Q.css.css(this, "display", "none");
                    if(fn){
                        fn();
                    }
                })
            }
        })

    })(this,Q);

    (function(win,Q) {
        /**
        * ajax类
        * @name QST.ajax
        * @class 发送ajax请求
        * @example
        * // 发送ajax请求
        */
        Q.add('ajax',function ( options ) {
                var xhr = new XMLHttpRequest(),
                    //method默认为GET
                    method = options.method? (options.method.toUpperCase() == "POST"? "POST": "GET") : "GET",
                    timeout = options.timeout || false,
                    url = options.url,
                    type = options.type,
                    postData, hasCompleted;

                if ( options.data ) {
                    postData = [];
                    for ( var d in options.data ) {
                        if ( d && options.data.hasOwnProperty(d) ) {
                            postData.push( d + "=" + encodeURIComponent( options.data[d] ) );
                        }
                    }
                    postData = postData.join("&").replace(/%20/g, "+");
                }

                if ( options.timeout && options.timeout > 0 ) {
                    setTimeout(function() {
                            if (!hasCompleted) {
                                xhr.abort();
                                timeout = "absort";
                                if ( options.error ) {
                                    options.error( xhr, "timeout" );
                                }
                            }
                    }, options.timeout
                    );
                }

                xhr.onreadystatechange = function () {
                    if ( xhr.readyState == 4 ) {
                        if ( xhr.status == 200 ) {
                            var ct = xhr.getResponseHeader("content-type") || "",
                                xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
                                data = xhr.responseText;
                            options.success && options.success( data, xhr );
                        } else {
                            options.error && options.error();
                        }
                    }
                };

                if (postData && method === "GET" ) {
                    url += ("?" + postData);
                    postData = null;
                }

                xhr.open( method, url, true, options.username, options.password );

                // 设置header
                if (options.headers) {
                    for (var h in options.headers) {
                        if ( options.headers.hasOwnProperty(h) ) {
                            xhr.setRequestHeader(h, options.headers[h]);
                        }
                    }
                }
                method === "POST" && xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                xhr.send(postData);
                return xhr;
            })
    })(this,Q);



    (function(win,Q) {
        var slice = Array.prototype.slice;
        /**
        * 可以提供类似jquery形式的链式操作，封装了QST.dom,QST.css,QST.event,QST.cache,QST.effect方法 封装生成QST.node对象，封装html，绑定window.$命名
        * @name QST.node
        * @class QST的node对象，封装node对象，可以提供jquery形式的链式操作，封装了QST.dom,QST.css,QST.event,QST.cache,QST.effect方法
        * @param {HTMLElement|Nodelist/String/Function/null} selector dom元素/ 匹配规则支持css3选择器 / 绑定QST.ready(fn) 函数
        * @param {HTMLElement|Nodelist|Object} context 父级查找元素
        * @returns {Object} QST.node对象
        */
        win.$ = Q.node = function(selector , context ){
           return new Q.node.fn.init(selector , context);
        };
        Q.node.fn = {
            length:0,
            selector: "",
            init: function(selector, context){
                var self = this;
                //alert(this.preventDefaulty)
                this['QST'] = Q.version;
                var ret = Q.dom.query(selector, context);
                //ret = ret == false ? this : ret ;
                return Q.makeArray(ret,this);
            },
            pushStack: function( elems, name, selector ) {
                var ret = Q.node( elems || null );
                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;
                ret.context = this.context;
                if ( name === "find" ) {
                    ret.selector = this.selector + (this.selector ? " " : "") + selector;
                } else if ( name ) {
                    ret.selector = this.selector + "." + name + "(" + selector + ")";
                }
                // Return the newly-formed element set
                return ret;
            },
            /**
            * 以每一个匹配的元素作为上下文来执行一个函数。
            * @name each
            * @function
            * @memberOf QST.node
            * @param {Function} callback dom元素/ 匹配规则支持css3选择器 / 绑定QST.ready(fn) 函数
            * @returns {Object} QST.node对象
            */
            each: function ( callback ) {
                if(this.length === undefined ){
                    callback.call( this, 0 , this );
                    return this;
                }
                return Q.each( this, callback );
            },
            /**
            * 获取第N个元素(元素的位置是从0算起。)
            * @name eq
            * @function
            * @memberOf QST.node
            * @param {Number} index 元素下标(元素的位置是从0算起。)
            * @returns {Object} QST.node对象
            */
            eq: function( i ) {
                return i === -1 ?
                    this.slice( i ) :
                    this.slice( i, +i + 1 );
            },
            /**
            * 选取一个匹配的子集
            * @name slice
            * @function
            * @memberOf QST.node
            * @param {Number} start 初始元素下标
            * @param {Number} end 可选
            * @returns {Object} QST.node对象
            */
            slice: function() {
                return this.pushStack( slice.apply( this, arguments ),
                    "slice", slice.call(arguments).join(",") );
            },
            /**
            * 将匹配的元素列表变为前一次的状态。
            * @name end
            * @function
            * @memberOf QST.node
            * @returns {Object} QST.node对象
            */
            end : function(){
                return this.prevObject ? this.prevObject : this ;
            },
            /**
            * 对QST.node扩展方法（不建议使用）
            * @name extend
            * @function
            * @memberOf QST.node
            * @param {Object} method 扩展方法集合
            * @param {method} config 扩展配置文件
            * @returns {Object} config 扩展方法配置方法
            */
            extend:function(method,config){
                //dump(method)
                var self = this , obj = Q.extend({},method);
                if(config && !Q.isUndefined(config.Q_dele)){
                    Q.each(config.Q_dele,function(i,o){
                        delete obj[o];
                    })
                }
                if(Q.isPlainObject(obj)) {
                    Q.each(obj,function(i,o){
                        var callback = o,name = i;
                            Q.node.fn[name] = (function(){
                                var ret = [this],arg = arguments;
                                Q.each(arg,function(i,o){
                                    ret.push(arg[i]);
                                });
                                if( config && !Q.isUndefined(config.Q_wrap) && Q.inArray(name,config.Q_wrap) && ( arg.length > 0 || name =='clone' || name =='children' || name =='parent' || name =='siblings' || name =='prev' || name =='next' || name  == 'find')){
                                   var node = callback.apply(this,ret);
                                   return this.pushStack(node , name , ret[0]);
                                   //20121028 fix find stack error
                                }
                                return callback.apply(this,ret);
                            });
                    })
                }
            }
        };
        Q.node.fn.extend(Q.css,{
            'Q_wrap' : ['width','height']
        });
        Q.node.fn.extend(Q.dom,{
           'Q_dele' : ['creat'] ,
           'Q_wrap' : ['find','clone','parent','prev','next','siblings','children']
        });
        Q.node.fn.extend(Q.event);
        Q.node.fn.extend(Q.cache);
        Q.node.fn.extend(Q.effect);
        Q.node.fn.init.prototype = Q.node.fn;
    })(this,Q);
})(this,'QST');