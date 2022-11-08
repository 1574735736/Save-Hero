import {FirebaseReport, FirebaseKey} from "../utils/FirebaseReport";

const {ccclass, property} = cc._decorator;

@ccclass
export default class vpnConnect extends cc.Component {

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    public static bConnected = false;

    private loadingTime = 3000;
    private nowTime = 0;

    onLoad () {
        jsb.reflection.callStaticMethod("org.cocos2dx.javascript.vpn/VpnManager", "JsCall_requestConnectVpn", "(Ljava/lang/String;)V", 'cc["gameRun"].JavaCall_ConnectVpnSuccess()');
        FirebaseReport.reportInformation(FirebaseKey.game_vpn_ok);
    }

    start () {

    }

    update(dt) {
        if (this.nowTime >= this.loadingTime) {
            this.progress.progress = 1;
            this.node.destroy();
        }
        else {
            this.nowTime += dt * 1000;
            this.progress.progress = Math.round(this.nowTime / this.loadingTime * 100) / 100;
        }
    }
}
