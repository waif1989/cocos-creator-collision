"use strict";
cc._RF.push(module, '2d2f6lnaKxB9ZL58gLyf1rO', 'ground');
// scripts/ground.js

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
								// 暂存 Game 对象的引用
								game: {
												default: null,
												serializable: false
								},
								star: {
												default: null,
												serializable: false
								}
				},

				onCollisionEnter: function onCollisionEnter() {
								console.log('ground enter');
								this.game.gameOver = true;
								this.game.player.jumpAble = false;
								this.game.gameOverShow();
								this.star.node.destroy();
				},

				// LIFE-CYCLE CALLBACKS:

				// onLoad () {},

				start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();