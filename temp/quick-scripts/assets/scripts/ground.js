(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/ground.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2d2f6lnaKxB9ZL58gLyf1rO', 'ground', __filename);
// scripts/ground.js

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
								star: {
												default: null,
												serializable: false
								},
								// 暂存 Game 对象的引用
								game: {
												default: null,
												serializable: false
								}
				},

				onCollisionEnter: function onCollisionEnter() {
								// console.log('ground enter');
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
        //# sourceMappingURL=ground.js.map
        