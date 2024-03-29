// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import selgk from "../dlg/selgk";
import game from "../game/game";
import { FirebaseReport, FirebaseKey, FireKeys } from "../utils/FirebaseReport";
import start from "./start";
import gamefail from "../dlg/gamefail";
import gamewin from "../dlg/gamewin";
import getSkinView from "../dlg/GetSkinView";
import sdkManager from "../game/SdkManager";
import skinView from "../dlg/SkinView";
import EscapeMng from "../game/EscapeMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class loading extends cc.Component {

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    private static _instance: loading = null; 


    loadingTime = 8000;//5秒
    timer = 0;

    updateLock = false;

    canBeShow = false;

    public static getInstance(): loading {
        if (loading._instance == null) {
            loading._instance = new loading();
        }
        return loading._instance;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {      

        loading._instance = this;
        this.timer = 0;
        this.updateLock = false;
        this.initClassOnAndroid();
        if (cc.sys.platform === cc.sys.ANDROID) {
            FirebaseReport.reportKeys(FireKeys.game_Start);
            //FirebaseReport.reportInformation(FirebaseKey.game_lcon_frequency);
            //(FirebaseKey.game_open_success);

            //jsb.reflection.callStaticMethod("org.cocos2dx.javascript.vpn/VpnManager", "JsCall__requestGetBackGroundConfigOfVpn", "()V");
        }

        //cc.debug.setDisplayStats(false);
    }

    public static JavaCall_UpdateConfigValue(value:number) {
        loading._instance.updateConfigValue(value);
    }

    private updateConfigValue(value:number) {
        game.showVpnProportion = value;
    }

    initClassOnAndroid() {
        //将需要在安卓端调用的类赋值给cc
        cc["selgk"] = selgk;
        cc["gameRun"] = game;
        cc["start"] = start;
        cc["loading"] = loading;
        cc["gamefail"] = gamefail;
        cc["gamewin"] = gamewin;
        cc["getSkinView"] = getSkinView;
        cc["sdkManager"] = sdkManager;
        cc["skinView"] = skinView;
    }


    public static JavaCall_OpenAppAdLoadSuccess() {

        loading.getInstance().canBeShow = true;
        if (loading.getInstance().timer < loading.getInstance().loadingTime) {
            //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppOpenAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['loading'].JavaCall_loadStartScene()");
        }
    }

    public static JavaCall_loadStartScene() {

        //if (loading.getInstance().timer >= loading.getInstance().loadingTime) {
        //    if (loading.getInstance().updateLock == false) {
        //        loading.getInstance().updateLock = true;
        //        loading.getInstance().loadStartScene();
        //    }
        //}
        loading.getInstance().loadStartScene();
        
    }

    loadStartScene() {
        if (cc.sys.platform === cc.sys.ANDROID) {
            //FirebaseReport.reportInformation(FirebaseKey.game_load_success);
            FirebaseReport.reportKeys(FireKeys.game_ToMain);
        }            

        cc.director.loadScene("start");
    }

    update (dt) {
        if (this.timer >= this.loadingTime) {            
            this.loadStartScene();
        }
        else {
            this.timer += dt*1000;
            this.progress.progress = Math.round(this.timer / this.loadingTime * 100) / 100;
            if (this.timer >= this.loadingTime * 0.5) {
                if (!this.updateLock) {
                    this.updateLock = true;
                    if (cc.sys.platform === cc.sys.ANDROID && this.canBeShow == true) {

                        //let isShowAd = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppOpenAdManager", "JsCall_isShow", "()Z");
                        //if (!isShowAd ||  EscapeMng.GetInstance().GetPlayeringTimes()) {

                        //if (EscapeMng.GetInstance().GetPlayeringTimes()) {
                        //    this.loadStartScene();
                        //}
                        //else {

                        //}

                        //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppOpenAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['loading'].JavaCall_loadStartScene()");
                        //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['loading'].JavaCall_loadStartScene()");
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AdManage", "showOpenAd", "()V");
                    }
                }
            }
        }
    }
}
