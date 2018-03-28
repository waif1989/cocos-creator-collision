"use strict";
cc._RF.push(module, '21f52S61GZBIL84uaJPWy07', 'Star');
// scripts/Star.js

"use strict";

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
		// 暂存 Game 对象的引用
		game: {
			default: null,
			serializable: false
		},
		// 跳跃音效资源
		jumpAudio: {
			default: null,
			url: cc.AudioClip
		},
		// 星星和主角之间的距离小于这个数值时，就会完成收集
		pickRadius: 0
	},

	getPlayerDistance: function getPlayerDistance() {
		// 根据 player 节点位置判断距离
		var playerPos = this.game.player.getPosition();
		// 根据两点位置计算两点之间距离
		var dist = cc.pDistance(this.node.position, playerPos);
		return dist;
	},

	onPicked: function onPicked() {
		// 调用 Game 脚本的得分方法
		this.game.gainScore();
	},

	newRandomFunc: function newRandomFunc(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.floor(Rand * Range); // 舍去
		return num;
	},

	actionFinishFunc: function actionFinishFunc() {
		return cc.callFunc(function () {
			var self = this;
			setTimeout(function () {
				// 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
				if (!self.game.ground.gameOver) {
					self.game.spawnNewStar();
					self.game.player.jumpAble = true;
					self.game.round = true;
					// 然后销毁当前星星节点
					self.node.destroy();
				} else {
					self.game.player.jumpAble = false;
					self.node.destroy();
				}
			}, 700);
		}, this);
	},

	onCollisionEnter: function onCollisionEnter() {
		if (this.game.round) {
			this.game.round = false;
			var finished = cc.callFunc(function () {
				var self = this;
				setTimeout(function () {
					// 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
					if (!self.game.ground.gameOver) {
						self.game.spawnNewStar();
						self.game.player.jumpAble = true;
						self.game.round = true;
						// 然后销毁当前星星节点
						self.node.destroy();
					} else {
						self.game.player.jumpAble = false;
						self.node.destroy();
					}
				}, 700);
			}, this);
			var t = cc.random0To1() > 0.5 ? -1 : 1;
			// var r = this.newRandomFunc(1, 2);
			var actionAll = cc.spawn(cc.moveTo(2, cc.p(t * 480, 480)), cc.rotateBy(2, 720), finished);
			this.node.runAction(actionAll.easing(cc.easeOut(3.0)));
			this.onPicked();
		}
		// console.log('Star collision')
	},

	/*update: function (dt) {
 	// 每帧判断和主角之间的距离是否小于收集距离
 	if (this.getPlayerDistance() < this.pickRadius) {
 		// 调用收集行为
 		this.onPicked();
 		return;
 	}
 },*/

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();