/**
 * vpn连接弹窗
 */
 import {FirebaseReport, FirebaseKey} from "../utils/FirebaseReport";

const {ccclass, property} = cc._decorator;

@ccclass
export default class vpnView extends cc.Component {

    private pNode: cc.Node = null;

    onLoad () {
        FirebaseReport.reportInformation(FirebaseKey.game_vpn_impression);

        let btnOk = cc.find("vpnBg/btn_vpnOk",this.node);
        let btnClose = cc.find("vpnBg/btn_vpnClose",this.node);
        btnClose.on("click", this.closeView.bind(this));
        btnOk.on("click", this.connectVpn.bind(this));
    }

    private closeView():void {
        this.node.destroy();
    }

    private connectVpn():void {
        let self = this;
        let parent = this.node.parent;
        cc.loader.loadRes("prefab/vpnConnect", cc.Prefab, (e, p) => {
            let pnode:cc.Node =  cc.instantiate(p as cc.Prefab);
            parent.addChild(pnode, 100);
        });
        this.closeView();
    }

}
