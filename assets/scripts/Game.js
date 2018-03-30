// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var jsonp = require('jsonp');

cc.Class({
    extends: cc.Component,

    properties: {
	    socket: null,
	    playBtn: null,
	    star: null,
	    entryDirect: -1, // 球初始进入方向
        serveInterval: 700, // 发球间隔时间
    	startPlay: false, // 是否开始游戏
	    leftOrRight: 0, // 1是左边，-1是右边
	    gameOver: false, // 游戏是否结束
	    // 星星产生后消失时间的随机范围
	    maxStarDuration: 0,
	    minStarDuration: 0,
	    // 跳跃音效资源
	    scoreAudio: {
		    default: null,
		    url: cc.AudioClip
	    },
	    // score label 的引用
	    scoreDisplay: {
		    default: null,
		    type: cc.Label
	    },
	    // 这个属性引用了分数文字
	    chineseScore: {
		    default: null,
		    type: cc.Label
	    },
	    // 这个属性引用了星星预制资源
	    starPrefab: {
		    default: null,
		    type: cc.Prefab
	    },
	    // 这个属性引用了重新开始按钮
	    playAgainBtnPrefab: {
		    default: null,
		    type: cc.Prefab
	    },
	    // 这个属性引用了开始按钮
	    playBtnPrefab: {
		    default: null,
		    type: cc.Prefab
	    },
	    // 地面节点，用于确定星星生成的高度
	    ground: {
		    default: null,
		    type: cc.Node
	    },
	    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
	    player: {
		    default: null,
		    type: cc.Node
	    },
	    // 对手节点
	    player2: {
		    default: null,
		    type: cc.Node
	    }
    },
	
	onLoad: function () {
		// this.testAxiosFunc(); // TODO 保留
		// this.testJsonpFunc(); // TODO 保留
		this.initFunc();
	},
	
	getQueryStringFunc: function (name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	},
	
	noticeFunc: function () {
		this.socket.send({
			player: this.getQueryStringFunc('player'),
			start: true
		});
	},
	
	connectWebSocketFunc: function () {
    	var self = this;
		var playerId = this.getQueryStringFunc('player');
		this.socket = io('http://10.254.102.203:8080');
		this.socket.on('connect', function () {
			self.socket.send({
				player: playerId,
				join: true
			});
		});
		this.socket.on('message', function (msg) {
			if (msg.player === '0' && msg.jump) {
				self.player.getComponent('Player').playerJump();
			} else if (msg.player === '1' && msg.jump) {
				self.player2.getComponent('Player2').playerJump();
			}
			if (msg.start) {
				self.playBtn.destroyFunc();
				self.startPlayFunc();
				self.chineseScore.string = '你的得分：0';
				self.chineseScore.node.opacity = 255;
				self.serveInterval = 700;
				self.spawnNewStar();
			}
			if (msg.actionAll && msg.player === '0') {
				var actionAll = cc.spawn(
					cc.cardinalSplineTo(msg.actionAll.time, [cc.p(msg.actionAll.xArr[0], msg.actionAll.yArr[0]), cc.p(msg.actionAll.xArr[1], msg.actionAll.yArr[1]), cc.p(msg.actionAll.xArr[2], msg.actionAll.yArr[2])], 0),
					cc.rotateBy(2, 720),
				);
				self.star.getComponent('Star').nowAction = actionAll;
				self.star.node.runAction(actionAll);
			}
		});
	},
	
	initFunc: function () {
		var manager = cc.director.getCollisionManager();
		manager.enabled = true;
		this.score = 0;
		// 获取地平面的 y 轴坐标
		this.groundY = this.ground.y + this.ground.height / 2;
		this.player.getComponent('Player').game = this;
		this.player2.getComponent('Player2').game = this;
		this.ground.getComponent('ground').game = this;
		
		this.newPlayBtn();
		this.connectWebSocketFunc();
		// this.touchControl(); // TODO
	},
	
	startGameFunc: function () {
    	var self = this;
    	this.startPlay = false;
    	this.gameOver = false;
    	this.round = true;
		this.score = 0;
		this.chineseScore.string = '你的得分：0';
		// this.player.getComponent('Player').node.opacity = 255; // TODO
		this.chineseScore.node.opacity = 255;
        this.serveInterval = 700;
        // TODO
        /*setInterval(function () {
            self.reduceTimeFunc()
        }, 2000);*/
		// this.spawnNewStar(); // TODO
		this.noticeFunc();
		this.startPlayFunc();
	},

    reduceTimeFunc: function () {
    	if (this.serveInterval > 300) {
            this.serveInterval = this.serveInterval - 100;
		}
    },
	
	playScoreSound: function () {
		// 调用声音引擎播放声音
		cc.audioEngine.playEffect(this.scoreAudio, false);
	},
	
	newPlayAgainBtn: function () {
		var newBtn = cc.instantiate(this.playAgainBtnPrefab);
		this.node.addChild(newBtn);
		newBtn.getComponent('Play_Again_Btn').game = this;
		newBtn.setPosition(cc.p(0, 0));
	},
	
	newPlayBtn: function () {
		var newBtn = cc.instantiate(this.playBtnPrefab);
		this.node.addChild(newBtn);
		this.playBtn = newBtn.getComponent('Play_Btn');
		newBtn.getComponent('Play_Btn').game = this;
		newBtn.setPosition(cc.p(0, 0));
	},
	
	spawnNewStar: function() {
		// 使用给定的模板在场景中生成一个新节点
		var newStar = cc.instantiate(this.starPrefab);
		// 将新增的节点添加到 Canvas 节点下面
		this.node.addChild(newStar);
		newStar.getComponent('Star').game = this;
		this.ground.getComponent('ground').star = newStar.getComponent('Star');
		this.player.getComponent('Player').star = newStar.getComponent('Star');
		this.player2.getComponent('Player2').star = newStar.getComponent('Star');
		// 为星星设置一个随机位置
		// newStar.setPosition(this.getNewStarPosition());
		cc.random0To1() > 0.5 ? this.entryDirect = 1 : this.entryDirect = -1;
		this.star =  newStar.getComponent('Star');
		this.newStarRunActionFunc(newStar);
		/*var actionAll = cc.spawn(
			cc.moveTo(4, cc.p(this.node.width / 2, this.node.height / 2))
		);
		var action = cc.moveTo(4, cc.p(this.node.width / 2, this.node.height / 2));
		var bezierTo = cc.cardinalSplineTo(1.5, [cc.p(-this.node.width / 2, this.node.height / 5), cc.p(-this.node.width / 4, this.node.height / 3), cc.p(0, this.groundY)], 0);*/
	},
	
	getNewStarPosition: function () {
		/*var randX = 0;
		// 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
		var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
		// 根据屏幕宽度，随机得到一个星星 x 坐标
		var maxX = this.node.width / 2;
		randX = cc.randomMinus1To1() * maxX;
		// 返回星星坐标
		return cc.p(randX, randY);
		return cc.p(0, this.groundY + this.player.getComponent('Player').jumpHeight);*/
		if (cc.random0To1() > 0.5) {
			this.leftOrRight = 1;
			// return cc.p(this.node.width / 2, this.node.height / 2);
			// return cc.p(480, 320);
		} else {
			this.leftOrRight = -1;
			// return cc.p(-this.node.width / 2, this.node.height / 2);
			// return cc.p(-480, -320);
		}
	},
	
	newStarRunActionFunc: function (star) {
		/*var actionAll = cc.spawn(
			cc.cardinalSplineTo(this.newRandomFunc(1.2, 1.5), [cc.p(this.leftOrRight * this.node.width / 2, this.newRandomFunc(this.groundY + 30, this.node.height / 4)), cc.p(this.leftOrRight * this.node.width / 4, this.node.height / 3), cc.p(this.newRandomFunc(0, -this.leftOrRight * this.node.width / 4), this.groundY)], 0),
			cc.rotateBy(2, 720),
		);*/
		// 球的直径是225*0.25,半径约等于30
		// var y0 = this.newRandomFunc(this.groundY + 30, 90);
		var y0 = 90;
		var y1 = this.newRandomFunc(180, 190);
		var y2 = this.groundY + 20;
		
		var x0 = this.entryDirect * 480;
		var x1 = 0;
		var x2 = -1 * this.entryDirect * 480;
		
		var time = this.newRandomFunc(1.5, 1.8);
		
		/*var actionAll = cc.spawn(
			cc.cardinalSplineTo(this.newRandomFunc(1.2, 1.5), [cc.p(this.leftOrRight * 480, y0), cc.p(this.leftOrRight * this.node.width / 4, y1), cc.p(this.newRandomFunc(0, -this.leftOrRight * this.node.width / 4), y2)], 0),
			cc.rotateBy(2, 720),
		);*/
		/*var actionAll = cc.spawn(
			cc.cardinalSplineTo(time, [cc.p(x0, y0), cc.p(x1, y1), cc.p(x2, y2)], 0),
			cc.rotateBy(2, 720),
		);*/
        // star.getComponent('Star').nowAction = actionAll;
		this.socket.send({
			player: this.getQueryStringFunc('player'),
			actionAll: {
				time: time,
				xArr: [x0, x1, x2],
				yArr: [y0, y1, y2]
			}
		});
		// star.getComponent('Star').node.runAction(actionAll); // TODO
	},
	
	newRandomFunc: function (Min, Max) {
		return Math.random() * (Max - Min) + Min;
	},
	
	startPlayFunc: function () {
    	var self = this;
		setTimeout(function () {
			self.startPlay = true;
		}, 500);
	},
	
	gameOverShow: function () {
		/*var temp = this.scoreDisplay.string;
		this.scoreDisplay.string = 'GAME OVER \n' + 'YOUR SCORE IS:' + this.score.toString();*/
		this.player.getComponent('Player').node.opacity = 0;
		this.chineseScore.string = '游戏结束 \n' + '你的最高分是：' + this.score.toString();
		this.newPlayAgainBtn();
	},
	
	touchControl: function () {
		this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
			if (this.startPlay) {
				this.player.getComponent('Player').playerJump();
			}
		}, this);
	},
	
	gainScore: function () {
    	this.playScoreSound();
		this.score += 1;
		this.chineseScore.string = '你的得分：' + this.score.toString();
		// 更新 scoreDisplay Label 的文字
		// this.scoreDisplay.string = 'Score: ' + this.score.toString();
	},
	
	testAxiosFunc: function () {
		axios.get('/testget').then(function (data) {
			console.log('axios succuss:', data);
		}).catch(e => {
			console.log('axios error:', e);
		});
	},
	
	testJsonpFunc: function () {
		jsonp('http://220.181.15.239:18086/tryfun-liepin/rank?industry=0&month_salary=0&score=80', {
			name: 'setRank'
		}, (err, data) => {
			console.log('jsonp succuss:', data);
		});
	},
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
	
    /*update: function (dt) {
	    gainScore: function () {
		    this.score += 1;
		    // 更新 scoreDisplay Label 的文字
		    this.scoreDisplay.string = 'Score: ' + this.score.toString();
	    }
    },*/
});
