// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

    properties: {
	    socket: null,
	    // 暂存 Game 对象的引用
	    game: {
		    default: null,
		    serializable: false
	    },
	    star: {
		    default: null,
		    serializable: false
	    },
	    // 跳跃音效资源
	    jumpAudio: {
		    default: null,
		    url: cc.AudioClip
	    },
	    // 是否可以起跳
	    jumpAble: true,
	    // 主角跳跃高度
	    jumpHeight: 0,
	    // 主角跳跃持续时间
	    jumpDuration: 0,
	    // 最大移动速度
	    maxMoveSpeed: 0,
	    // 加速度
	    accel: 0
    },
	
	onLoad: function () {
		// this.socket = io('http://10.254.102.203:8080');
		var player = this.getQueryStringFunc('player');
		// this.testSocketFunc(player);
		this.setInputTouchControl(player);
		// 加速度方向开关
		this.accLeft = false;
		this.accRight = false;
		// 主角当前水平方向速度
		this.xSpeed = 0;
	},
	
	getQueryStringFunc: function (name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	},
	
	playJumpSound: function () {
		// 调用声音引擎播放声音
		cc.audioEngine.playEffect(this.jumpAudio, false);
	},
 
	setJumpAction: function () {
		this.jumpAble = false;
		// 跳跃上升
		var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
		// 下落
		var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
		// 不断重复
		// return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
		var finished = cc.callFunc(function() {
			this.jumpAble = true;
			this.playJumpSound();
		}, this);
		return cc.sequence(jumpUp, jumpDown, finished);
	},
	
	/*setInputControl: function () {
		var self = this;
		// 添加键盘事件监听
		// 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event){
			switch(event.keyCode) {
				case cc.KEY.a:
					self.accLeft = true;
					break;
				case cc.KEY.d:
					self.accRight = true;
					break;
			}
		});
		
		// 松开按键时，停止向该方向的加速
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event){
			switch(event.keyCode) {
				case cc.KEY.a:
					self.accLeft = false;
					break;
				case cc.KEY.d:
					self.accRight = false;
					break;
			}
		});
	},*/
	
	playerJump: function () {
		if (this.jumpAble && !this.game.gameOver) {
			this.node.runAction(this.setJumpAction());
			this.game.socket.send({
				player: '0',
				jump: true
			});
		}
	},
	
	setInputTouchControl: function (player) {
		this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
			/*if (this.game.startPlay) {
				this.playerJump();
			}*/
			if (this.game.startPlay && player === '0') {
				this.playerJump();
			}
		}, this);
	},
	
	newRandomFunc: function (Min, Max) {
		return Math.random() * (Max - Min) + Min;
	},
	
	testSocketFunc: function (player) {
		var self = this;
		
		this.socket.on('connect', function () {
			if (player === '0') {
				self.socket.send({
					player: '0',
					join: true
				});
			}
		});
		
		this.socket.on('message', function (msg) {
			if (msg.player === '0' && msg.jump) {
				self.playerJump();
			}
			/*if (msg.join && msg.player === '0') {
				self.node.opacity = 255;
			}*/
			if (msg.ask === '0' && msg.player === '1') {
				self.node.opacity = 255;
			}
		});
		
		/*socket.on('greeting', function (msg) {
			console.log('greeting---', msg);
			socket.send('hi');
		});*/
		
	},
	
	onCollisionEnter: function () {
		this.game.leftOrRight = -1;
		
		var y0 = 0;
		var y1 = 250;
		var y2 = -110;
		
		var x0 = 250;
		var x1 = 0;
		var x2 = this.game.leftOrRight * 500;
		
		var time = this.newRandomFunc(1, 1.5);
		
		this.game.socket.send({
			player: this.getQueryStringFunc('player'),
			cbActionAll: {
				time: time,
				xArr: [x0, x1, x2],
				yArr: [y0, y1, y2]
			}
		});
		// this.star.flyAwayFunc();
	},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
