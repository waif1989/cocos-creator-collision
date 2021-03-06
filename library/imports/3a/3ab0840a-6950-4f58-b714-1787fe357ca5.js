"use strict";
cc._RF.push(module, '3ab08QKaVBPWLcUF4f+NXyl', 'Game');
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

cc.Class({
	extends: cc.Component,

	properties: {
		round: true,
		leftOrRight: -1,
		gameOver: false,
		// score label 的引用
		scoreDisplay: {
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
		// 星星产生后消失时间的随机范围
		maxStarDuration: 0,
		minStarDuration: 0,
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
		var manager = cc.director.getCollisionManager();
		manager.enabled = true;
		// manager.enabledDebugDraw = true;
		this.score = 0;
		// 获取地平面的 y 轴坐标
		this.groundY = this.ground.y + this.ground.height / 2;
		this.player.getComponent('Player').game = this;
		this.ground.getComponent('ground').game = this;
		// 生成一个新的星星
		this.spawnNewStar();
		this.touchControl();
	},

	newPlayAgainBtn: function newPlayAgainBtn() {
		var newBtn = cc.instantiate(this.playAgainBtnPrefab);
		this.node.addChild(newBtn);
		newBtn.setPosition(cc.p(0, 30));
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
  );*/
		// var action = cc.moveTo(4, cc.p(this.node.width / 2, this.node.height / 2));
		// var bezierTo = cc.cardinalSplineTo(1.5, [cc.p(-this.node.width / 2, this.node.height / 5), cc.p(-this.node.width / 4, this.node.height / 3), cc.p(0, this.groundY)], 0);

		var actionAll = cc.spawn(cc.cardinalSplineTo(this.newRandomFunc(1.5, 1.8), [cc.p(this.leftOrRight * this.node.width / 2, this.newRandomFunc(this.groundY + 30, this.node.height / 3)), cc.p(this.leftOrRight * this.node.width / 4, this.node.height / 3), cc.p(this.newRandomFunc(0, -this.leftOrRight * this.node.width / 4), this.groundY)], 0), cc.rotateBy(2, 720));
		newStar.getComponent('Star').node.runAction(actionAll);
	},

	getNewStarPosition: function getNewStarPosition() {
		var randX = 0;
		// 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
		var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
		// 根据屏幕宽度，随机得到一个星星 x 坐标
		var maxX = this.node.width / 2;
		randX = cc.randomMinus1To1() * maxX;
		// 返回星星坐标
		// return cc.p(randX, randY);
		// return cc.p(0, this.groundY + this.player.getComponent('Player').jumpHeight);
		if (cc.random0To1() >= 0.5) {
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
		var num = Min + Math.floor(Rand * Range); //舍去
		return num;
	},

	gameOverShow: function gameOverShow() {
		var temp = this.scoreDisplay.string;
		this.scoreDisplay.string = 'GAME OVER \n' + 'YOUR SCORE IS:' + this.score.toString();
		this.newPlayAgainBtn();
	},

	touchControl: function touchControl() {
		this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
			this.player.getComponent('Player').playerJump();
		}, this);
	},
	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	start: function start() {},


	gainScore: function gainScore() {
		this.score += 1;
		// 更新 scoreDisplay Label 的文字
		this.scoreDisplay.string = 'Score: ' + this.score.toString();
	}

	/*update: function (dt) {
  gainScore: function () {
   this.score += 1;
   // 更新 scoreDisplay Label 的文字
   this.scoreDisplay.string = 'Score: ' + this.score.toString();
  }
 },*/
});

cc._RF.pop();