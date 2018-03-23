require=function t(e,n,i){function o(r,a){if(!n[r]){if(!e[r]){var s="function"==typeof require&&require;if(!a&&s)return s(r,!0);if(c)return c(r,!0);var u=new Error("Cannot find module '"+r+"'");throw u.code="MODULE_NOT_FOUND",u}var h=n[r]={exports:{}};e[r][0].call(h.exports,function(t){var n=e[r][1][t];return o(n||t)},h,h.exports,t,e,n,i)}return n[r].exports}for(var c="function"==typeof require&&require,r=0;r<i.length;r++)o(i[r]);return o}({Game:[function(t,e,n){"use strict";cc._RF.push(e,"3ab08QKaVBPWLcUF4f+NXyl","Game"),cc.Class({extends:cc.Component,properties:{round:!0,leftOrRight:-1,gameOver:!1,scoreDisplay:{default:null,type:cc.Label},starPrefab:{default:null,type:cc.Prefab},playAgainBtnPrefab:{default:null,type:cc.Prefab},maxStarDuration:0,minStarDuration:0,ground:{default:null,type:cc.Node},player:{default:null,type:cc.Node}},onLoad:function(){cc.director.getCollisionManager().enabled=!0,this.score=0,this.groundY=this.ground.y+this.ground.height/2,this.player.getComponent("Player").game=this,this.ground.getComponent("ground").game=this,this.spawnNewStar(),this.touchControl()},newPlayAgainBtn:function(){var t=cc.instantiate(this.playAgainBtnPrefab);this.node.addChild(t),t.setPosition(cc.p(0,30))},spawnNewStar:function(){var t=cc.instantiate(this.starPrefab);this.node.addChild(t),t.setPosition(this.getNewStarPosition()),t.getComponent("Star").game=this,this.ground.getComponent("ground").star=t.getComponent("Star");var e=cc.spawn(cc.cardinalSplineTo(this.newRandomFunc(1.5,1.8),[cc.p(this.leftOrRight*this.node.width/2,this.newRandomFunc(this.groundY+30,this.node.height/3)),cc.p(this.leftOrRight*this.node.width/4,this.node.height/3),cc.p(this.newRandomFunc(0,-this.leftOrRight*this.node.width/4),this.groundY)],0),cc.rotateBy(2,720));t.getComponent("Star").node.runAction(e)},getNewStarPosition:function(){this.groundY,cc.random0To1(),this.player.getComponent("Player").jumpHeight;var t=this.node.width/2;return cc.randomMinus1To1()*t,cc.random0To1()>=.5?(this.leftOrRight=1,cc.p(this.node.width/2,this.node.height/2)):(this.leftOrRight=-1,cc.p(-this.node.width/2,this.node.height/2))},newRandomFunc:function(t,e){var n=e-t,i=Math.random();return t+Math.floor(i*n)},gameOverShow:function(){this.scoreDisplay.string;this.scoreDisplay.string="GAME OVER \nYOUR SCORE IS:"+this.score.toString(),this.newPlayAgainBtn()},touchControl:function(){this.node.on(cc.Node.EventType.TOUCH_START,function(t){this.player.getComponent("Player").playerJump()},this)},start:function(){},gainScore:function(){this.score+=1,this.scoreDisplay.string="Score: "+this.score.toString()}}),cc._RF.pop()},{}],Play_Again_Btn:[function(t,e,n){"use strict";cc._RF.push(e,"e693f3zLBJFv4lp7RDCMiLY","Play_Again_Btn"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){this.touchControl()},touchControl:function(){this.node.on(cc.Node.EventType.TOUCH_START,function(t){cc.director.loadScene("game")},this)},start:function(){}}),cc._RF.pop()},{}],Player:[function(t,e,n){"use strict";cc._RF.push(e,"eee59XVb+lJa4ks52vb3gmq","Player"),cc.Class({extends:cc.Component,properties:{jumpAble:!0,game:{default:null,serializable:!1},jumpHeight:0,jumpDuration:0,maxMoveSpeed:0,accel:0},onLoad:function(){this.accLeft=!1,this.accRight=!1,this.xSpeed=0,this.setInputTouchControl()},setJumpAction:function(){this.jumpAble=!1;var t=cc.moveBy(this.jumpDuration,cc.p(0,this.jumpHeight)).easing(cc.easeCubicActionOut()),e=cc.moveBy(this.jumpDuration,cc.p(0,-this.jumpHeight)).easing(cc.easeCubicActionIn()),n=cc.callFunc(function(){this.jumpAble=!0,this.game.round||(this.game.round=!0)},this);return cc.sequence(t,e,n)},playerJump:function(){this.jumpAble&&!this.game.gameOver&&this.node.runAction(this.setJumpAction())},setInputTouchControl:function(){this.node.on(cc.Node.EventType.TOUCH_START,function(t){this.playerJump()},this)},start:function(){}}),cc._RF.pop()},{}],Star:[function(t,e,n){"use strict";cc._RF.push(e,"21f52S61GZBIL84uaJPWy07","Star"),cc.Class({extends:cc.Component,properties:{testNum:1,pickRadius:0,game:{default:null,serializable:!1}},getPlayerDistance:function(){var t=this.game.player.getPosition();return cc.pDistance(this.node.position,t)},onPicked:function(){this.game.gainScore()},onCollisionEnter:function(){if(this.game.round){this.game.round=!1;var t=cc.callFunc(function(){var t=this;setTimeout(function(){t.game.ground.gameOver?(t.game.player.jumpAble=!1,t.node.destroy()):(t.game.spawnNewStar(),t.game.player.jumpAble=!0,t.game.round=!0,t.node.destroy())},700)},this),e=cc.spawn(cc.moveTo(2,cc.p(750*-this.game.leftOrRight,750)),cc.rotateBy(2,720),t);this.node.runAction(e.easing(cc.easeOut(3))),this.onPicked()}console.log("on collision enter")},start:function(){}}),cc._RF.pop()},{}],ground:[function(t,e,n){"use strict";cc._RF.push(e,"2d2f6lnaKxB9ZL58gLyf1rO","ground"),cc.Class({extends:cc.Component,properties:{game:{default:null,serializable:!1},star:{default:null,serializable:!1}},onCollisionEnter:function(){console.log("ground enter"),this.game.gameOver=!0,this.game.player.jumpAble=!1,this.game.gameOverShow(),this.star.node.destroy()},start:function(){}}),cc._RF.pop()},{}]},{},["Game","Play_Again_Btn","Player","Star","ground"]);