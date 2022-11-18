// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import selgk from "../dlg/selgk";
import game from "../game/game";
import {FirebaseReport, FirebaseKey} from "../utils/FirebaseReport";
import start from "./start";
import gamefail from "../dlg/gamefail";
import gamewin from "../dlg/gamewin";
import getSkinView from "../dlg/GetSkinView";
import sdkManager from "../game/SdkManager";
import skinView from "../dlg/SkinView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class loading extends cc.Component {

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    private static _instance: loading = null; 


    loadingTime = 8000;//5秒
    timer = 0;

    updateLock = false;

    public static getInstance(): loading {
        if (loading._instance == null) {
            loading._instance = new loading();
        }
        return loading._instance;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        loading._instance = this;
        this.timer = 0;
        this.updateLock = false;
        this.initClassOnAndroid();
        if (cc.sys.platform === cc.sys.ANDROID) {
            FirebaseReport.reportInformation(FirebaseKey.game_open_success);

            //jsb.reflection.callStaticMethod("org.cocos2dx.javascript.vpn/VpnManager", "JsCall__requestGetBackGroundConfigOfVpn", "()V");
        }
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
        cc["sdkManagerView"] = sdkManager;
        cc["skinView"] = skinView;
    }


    public static JavaCall_OpenAppAdLoadSuccess() {
        if (loading.getInstance().timer < loading.getInstance().loadingTime) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppOpenAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['loading'].JavaCall_loadStartScene()");
        }
    }

    public static JavaCall_loadStartScene() {

        if (loading.getInstance().timer >= loading.getInstance().loadingTime) {
            if (loading.getInstance().updateLock == false) {
                loading.getInstance().updateLock = true;
                loading.getInstance().loadStartScene();
            }
        }
        //loading.getInstance().loadStartScene();
        
    }

    loadStartScene() {
        FirebaseReport.reportInformation(FirebaseKey.game_load_success);
        cc.director.loadScene("start");
    }


    update (dt) {
        if (this.timer >= this.loadingTime) {
            if (!this.updateLock) {
                this.updateLock = true;
                if (cc.sys.platform === cc.sys.ANDROID) {
                
                    let isShowAd = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppOpenAdManager", "JsCall_isShow", "()Z");
                    if (!isShowAd) {                    
                        this.loadStartScene();
                    }
                    //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['loading'].JavaCall_loadStartScene()");
                }
                else {
                    this.loadStartScene();
                }
            }
        }
        else {
            this.timer += dt*1000;
            this.progress.progress = Math.round(this.timer / this.loadingTime * 100) / 100;
        }
    }
}
