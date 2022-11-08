import EscapeMng from "../game/EscapeMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    coinLable: cc.Label = null;

    start () {
        var Lgold = cc.find("jb/Gold", this.node);
        this.coinLable = Lgold.getComponent(cc.Label);

        var btnStart = cc.find("btn_return", this.node);
        btnStart.on("click", this.OnBtnExit.bind(this));

        this.OnUpdateCoin();
    };

    OnBtnExit() {
        this.node.destroy();
    }

    OnUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.coinLable.string = "" + coin;
    }
}
