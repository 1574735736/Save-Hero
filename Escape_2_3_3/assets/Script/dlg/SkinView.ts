

const { ccclass, property } = cc._decorator;
import EscapeMng from "../game/EscapeMng";
import Start from "../load/start";
import Game from "../game/game";

@ccclass
export default class SkinView extends cc.Component {
   

     
    coinCount: cc.Label = null;
    curClick: number = 1;
    content: cc.Node = null;
    item: cc.Node = null;
    tophero: cc.Node = null;
    iconPos: cc.Vec3[] = [
        new cc.Vec3(94.039, 246.665),
        new cc.Vec3(31.8, 206.209),
        new cc.Vec3(28.021, 266.892),
        new cc.Vec3(16.163, 211.972),
        new cc.Vec3(-42.964, 261.764),
        new cc.Vec3(6.828, 261.764),
        new cc.Vec3(-0.952, 261.764),
        new cc.Vec3(-0.952, 215.084),
        new cc.Vec3(-65.51, 207.179),
        new cc.Vec3(-65.51, 202.839),
    ] 
    onLoad() {
        this.node.setScale(0, 0);

        this.node.runAction(cc.scaleTo(0.3, 1, 1));
    }

    start () {

        var jinbi = cc.find("jb/Gold", this.node);
        this.coinCount = jinbi.getComponent(cc.Label)
        this.onUpdateCoin();
        var guangbi = this.node.getChildByName("btn_return");
        guangbi.on("click", this.OnBtnExit.bind(this));
        this.content = cc.find("ScrollView/view/content", this.node);
        this.item = cc.find("Item", this.node)
        this.tophero = cc.find("top/tophero", this.node);
        this.onUpdateTopHero();
        this.onInitScroll();
    }


    onUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.coinCount.string = "" + coin        
    }

    onUpdateTopHero() {

        var curHiroId = EscapeMng.GetInstance().Get_Hero();
        this.onSetIcon("top/tophero", "game/heroicon/noside/" + curHiroId);
        this.tophero.position = this.iconPos[curHiroId - 1];
       
        for (var i = 1; i <= 10; i++) {
            if (curHiroId == i) {
                cc.find("ScrollView/view/content/Item" + i + "/btn_change", this.node).active = false;
            }
            else {
                cc.find("ScrollView/view/content/Item" + i + "/btn_change", this.node).active = true;
            }
        }
    }

    // update (dt) {}

    OnBtnExit() {
        if (cc.director.getScene().name == "start") {
            Start.getInstance().onUpdateHero();
        }        
        else if (cc.director.getScene().name == "game") {
            Game.getInstance().onUpdateHero();
        }
        var actionScale = cc.sequence(cc.scaleTo(0.3, 0, 0), cc.callFunc(() => {
            this.node.destroy();
        }));//.easing(cc.easeQuarticActionOut)
        this.node.runAction(actionScale);
    }

    onSetIcon(nodePath: string, iconPath: string) {
        var nt = cc.find(nodePath, this.node).getComponent(cc.Sprite);
        cc.loader.loadRes(iconPath, cc.SpriteFrame, (err, sp) => {
            nt.spriteFrame = sp as cc.SpriteFrame;
        })
    }

    onInitScroll() {        
        for (var i = 1; i <= 10; i++) {
          
            var btnSkin = cc.find("ScrollView/view/content/Item" + i + "/btn_change", this.node);
            btnSkin.on("click", this.OnBtnAction.bind(this,i));                 
        }
    }

    OnBtnAction(clickID: number) {
        EscapeMng.GetInstance().Set_Hero(clickID);
        this.onUpdateTopHero();
    }


    
}
