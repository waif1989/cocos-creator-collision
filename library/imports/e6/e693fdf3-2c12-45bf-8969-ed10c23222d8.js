"use strict";
cc._RF.push(module, 'e693f3zLBJFv4lp7RDCMiLY', 'Play_Again_Btn');
// scripts/Play_Again_Btn.js

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
								}
				},

				onLoad: function onLoad() {
								this.touchControl();
				},

				restartGameFunc: function restartGameFunc() {
								this.game.startGameFunc();
				},

				touchControl: function touchControl() {
								this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
												// cc.director.loadScene('game');
												this.restartGameFunc();
												this.node.destroy();
								}, this);
				},

				// LIFE-CYCLE CALLBACKS:

				// onLoad () {},

				start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();