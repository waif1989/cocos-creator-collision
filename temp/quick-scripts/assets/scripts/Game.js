(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3ab08QKaVBPWLcUF4f+NXyl', 'Game', __filename);
// scripts/Game.js

'use strict';

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
		startPlay: false, // 是否开始游戏
		round: true, // 球发出后的当前回合
		leftOrRight: -1, // 1是左边，-1是右边
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
		}
	},

	onLoad: function onLoad() {
		this.testAxiosFunc();
		this.testJsonpFunc();
		this.initFunc();
	},

	initFunc: function initFunc() {
		var manager = cc.director.getCollisionManager();
		manager.enabled = true;
		this.score = 0;
		// 获取地平面的 y 轴坐标
		this.groundY = this.ground.y + this.ground.height / 2;
		this.player.getComponent('Player').game = this;
		this.ground.getComponent('ground').game = this;
		this.newPlayBtn();
		this.touchControl();
	},

	playScoreSound: function playScoreSound() {
		// 调用声音引擎播放声音
		cc.audioEngine.playEffect(this.scoreAudio, false);
	},

	startGameFunc: function startGameFunc() {
		this.startPlay = false;
		this.gameOver = false;
		this.round = true;
		this.score = 0;
		this.chineseScore.string = '你的得分：0';
		this.player.getComponent('Player').node.opacity = 255;
		// this.chineseScore.node.setPosition(cc.p(0, 260));
		this.chineseScore.node.opacity = 255;
		this.spawnNewStar();
		this.startPlayFunc();
	},

	newPlayAgainBtn: function newPlayAgainBtn() {
		var newBtn = cc.instantiate(this.playAgainBtnPrefab);
		this.node.addChild(newBtn);
		newBtn.getComponent('Play_Again_Btn').game = this;
		// newBtn.setPosition(cc.p(100, 85));
		newBtn.setPosition(cc.p(0, 0));
	},

	newPlayBtn: function newPlayBtn() {
		var newBtn = cc.instantiate(this.playBtnPrefab);
		this.node.addChild(newBtn);
		newBtn.getComponent('Play_Btn').game = this;
		newBtn.setPosition(cc.p(0, 0));
	},

	spawnNewStar: function spawnNewStar() {
		// 使用给定的模板在场景中生成一个新节点
		var newStar = cc.instantiate(this.starPrefab);
		// 将新增的节点添加到 Canvas 节点下面
		this.node.addChild(newStar);
		// 为星星设置一个随机位置
		newStar.setPosition(this.getNewStarPosition());
		newStar.getComponent('Star').game = this;
		this.ground.getComponent('ground').star = newStar.getComponent('Star');

		/*var actionAll = cc.spawn(
  	cc.moveTo(4, cc.p(this.node.width / 2, this.node.height / 2))
  );
  var action = cc.moveTo(4, cc.p(this.node.width / 2, this.node.height / 2));
  var bezierTo = cc.cardinalSplineTo(1.5, [cc.p(-this.node.width / 2, this.node.height / 5), cc.p(-this.node.width / 4, this.node.height / 3), cc.p(0, this.groundY)], 0);*/

		var actionAll = cc.spawn(cc.cardinalSplineTo(this.newRandomFunc(1.2, 1.5), [cc.p(this.leftOrRight * this.node.width / 2, this.newRandomFunc(this.groundY + 30, this.node.height / 4)), cc.p(this.leftOrRight * this.node.width / 4, this.node.height / 3), cc.p(this.newRandomFunc(0, -this.leftOrRight * this.node.width / 4), this.groundY)], 0), cc.rotateBy(2, 720));
		newStar.getComponent('Star').node.runAction(actionAll);
	},

	getNewStarPosition: function getNewStarPosition() {
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
			return cc.p(this.node.width / 2, this.node.height / 2);
		} else {
			this.leftOrRight = -1;
			return cc.p(-this.node.width / 2, this.node.height / 2);
		}
	},

	newRandomFunc: function newRandomFunc(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.floor(Rand * Range); // 舍去
		return num;
	},

	startPlayFunc: function startPlayFunc() {
		var self = this;
		setTimeout(function () {
			self.startPlay = true;
		}, 500);
	},

	gameOverShow: function gameOverShow() {
		/*var temp = this.scoreDisplay.string;
  this.scoreDisplay.string = 'GAME OVER \n' + 'YOUR SCORE IS:' + this.score.toString();*/
		this.player.getComponent('Player').node.opacity = 0;
		this.chineseScore.string = '游戏结束 \n' + '你的最高分是：' + this.score.toString();
		this.newPlayAgainBtn();
	},

	touchControl: function touchControl() {
		this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
			if (this.startPlay) {
				this.player.getComponent('Player').playerJump();
			}
		}, this);
	},

	gainScore: function gainScore() {
		this.playScoreSound();
		this.score += 1;
		this.chineseScore.string = '你的得分：' + this.score.toString();
		// 更新 scoreDisplay Label 的文字
		// this.scoreDisplay.string = 'Score: ' + this.score.toString();
	},

	testAxiosFunc: function testAxiosFunc() {
		axios.get('/testget').then(function (data) {
			console.log('axios succuss:', data);
		}).catch(function (e) {
			console.log('axios error:', e);
		});
	},

	testJsonpFunc: function testJsonpFunc() {
		jsonp('http://220.181.15.239:18086/tryfun-liepin/rank?industry=0&month_salary=0&score=80', {
			name: 'setRank'
		}, function (err, data) {
			console.log('jsonp succuss:', data);
		});
	},
	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	start: function start() {}
}

/*update: function (dt) {
 gainScore: function () {
  this.score += 1;
  // 更新 scoreDisplay Label 的文字
  this.scoreDisplay.string = 'Score: ' + this.score.toString();
 }
},*/
);

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        