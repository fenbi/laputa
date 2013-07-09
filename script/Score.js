(function(){
    
	var ns = Q.use("laputa"),
        game = ns.game,
		tScore = 0,
        Score = ns.Score = function(props){
           	//Score.superClass.constructor.call(this, props);
			this.tScore=tScore;
			this.scoreNum=null;
			this.init();
        };
	Score.prototype.init = function()
	{
		this.scoreNum = new ns.Num({id:"scoreNum", src:ns.R.scoreNum, max:6, gap:3, autoAddZero:false});
		this.scoreNum.x = 20;
		this.scoreNum.y = 35;
		this.updateScoreNum();
		this.reset();
	};

	Score.prototype.show = function()
	{
		game.viewgroup.UContainer.addChild(this.scoreNum);

	};	
	Score.prototype.reset = function(props){
        this.tScore=0;
		this.updateScoreNum();
	};
	Score.prototype.minus = function(s){
	    // TODO minus score
		this.tScore = (this.tScore-s)<=0 ? 0 : (this.tScore-s);
	    return this.tScore;
	};
	Score.prototype.add = function(s){
	    // TODO  add score
		if(s<=0){
			return;
		}else{
			this.tScore = this.tScore + s;
			this.updateScoreNum();
			return this.tScore;
		}		
	};
	Score.prototype.rank = function(h){
	    // TODO  get score desc
		
		//return this;

	};
    Score.prototype.save = function(){
        // TODO  save score to database
        var path = '/laputa/';
		QST.ajax({
            method: "POST",
            url: path+"data/index.php/Index/addScore",
			data: {
				score : this.tScore,
				level : ns.mission.currentLevel,
				type : ns.mission.currentType=="defend"?0:1,
				combo : ns.game.Manager.maxcombo,
				kill_num : ns.game.Manager.kill_num,
				monster_num : ns.game.Manager.monster_num,
				img : QST.toJSONString(ns.game.Manager.snap)
			},
            type: 'json',
            success: function(msg) {
                var data = QST.toJSON(msg);
				if (data.state) {
                    //that.getRank();
					dump(data.state);
                } else {
                    dump('服务器链接出错~');
                }
            },
            error: function(msg) {
                dump('数据插入失败~');
            }
        });
    };
	Score.prototype.updateScoreNum = function()
	{
		this.scoreNum.setValue(this.tScore);
	};
	Score.prototype.distory = function(){
        game.viewgroup.UContainer.removeChild(this.scoreNum);
	}

	var	Num = ns.Num = function(props){
			this.max = 1;
			this.gap = 2;
			this.addSign = false;
			this.autoAddZero = false;
			this.src = null;
			
			Num.superClass.constructor.call(this, props);

			this.eventEnabled = this.eventChildren = false;
			this.autoSize = true;
			this.init();
		};

	Q.inherit(Num, Q.DisplayObjectContainer);

	Num.prototype.init = function()
	{	
		var count = this.addSign ? this.max + 1 : this.max;
		for(var i = 0; i < count; i++)
		{
			var rect = this.src[0];
			var n = new Q.Bitmap({image:this.src.image, rect:rect, x:(rect[2]+this.gap)*i});
			this.addChild(n);
		}
	};

	Num.prototype.setValue = function(val)
	{
		var str = val.toString(), len = this.children.length, positive = val > 0;
		if(this.autoAddZero)
		{
			var count = this.addSign ? len - 1 : len;
			while(str.length < count) str = "0" + str;
		}	
		if(this.addSign && positive) str = "+" + str;
		
		for(var i = len - 1, j = str.length - 1; i >= 0; i--)
		{
			var n = this.getChildAt(i), valid = j >= 0;
			n.visible = valid;
			if(valid) n.setRect(this.src[str.charAt(j)]);
			j--;
		}
	};
})();