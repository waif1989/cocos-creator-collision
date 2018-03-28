(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Star.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '21f52S61GZBIL84uaJPWy07', 'Star', __filename);
// scripts/Star.js

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
		// 碰撞状态
		checkCollision: true,
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

	flyAwayFunc: function flyAwayFunc() {
		this.game.flyAwayFunc();
	},

	newRandomFunc: function newRandomFunc(Min, Max) {
		return Math.random() * (Max - Min) + Min;
	},

	actionFinishFunc: function actionFinishFunc() {
		var self = this;
		return cc.callFunc(function () {
			setTimeout(function () {
				// 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
				if (!self.game.gameOver) {
					self.game.spawnNewStar();
					self.game.player.jumpAble = true;
					// 然后销毁当前星星节点
					self.node.destroy();
				} else {
					self.game.player.jumpAble = false;
					self.node.destroy();
				}
			}, 2000);
		}, this);
	},

	onCollisionEnter: function onCollisionEnter() {
		console.log('Star collision', this.node.position);
		if (this.checkCollision) {
			this.checkCollision = false;
			this.flyAwayFunc();
			/*var t = cc.random0To1() > 0.5 ? -1 : 1;
   var actionAll = cc.spawn(
    cc.moveTo(2, cc.p(0, 0)),
    cc.rotateBy(2, 720),
    this.actionFinishFunc()
   );
   this.node.runAction(actionAll.easing(cc.easeIn(0.5)));*/
			this.onPicked();
		}
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
        //# sourceMappingURL=Star.js.map
        