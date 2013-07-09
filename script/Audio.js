/**
 * 音乐控制
 */
(function() {
	var ns = Q.use("laputa"),
		L = LAPUTA;
        game = ns.game;
		
    var Audio = {
        /**
         * 静音模式
         */
        mute : false,
        /**
         * buzz group对象
         */
        buzzGroup : null,
        /**
         * 音频列表
         */
        list : L.loader.loadedSounds,
        /**
         * 播放音乐
         * @param {Number} id
         * @param {Boolean} resumePlay
         */
        play : function(id, resumePlay){
            if(this.list[id] && !this.mute) {
                if(!resumePlay) {
                    this.list[id].setTime(0);
                }
				if(this.list[id].volume){
					this.list[id].setVolume(this.list[id].volume);
				}
								
                this.list[id].play();
            }
        },
        /**
         * 暂停播放
         * @param {Number} id
         */
        pause : function(id) {
            this.list[id].pause();
        },
        /**
         * 暂停所有音频
         */
        pauseAll : function() {
            buzz.all().pause();
        }
    }

    ns.Audio = Audio;

})();