import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";
import { FirebaseReport, FirebaseKey } from "../utils/FirebaseReport";
import EscapeMng from "../game/EscapeMng";
const { ccclass, property } = cc._decorator;
import SpineManager from "../utils/SpineManager";
import sdkManager from "../game/SdkManager";
/*
游戏失败弹框

*/
@ccclass
export default class gamefail extends cc.Component {

    m_plisnter = null;
    m_exitbtn_callback = null;
    m_nextbtn_callback = null;
    m_CurCoin: cc.Label = null;

    private static _instance: gamefail = null;

    public static getInstance(): gamefail {
        if (gamefail._instance == null) {
            gamefail._instance = new gamefail();
        }
        return gamefail._instance;
    }


    onLoad () 
    {
        gamefail._instance = this;
        //var guangbi = this.node.getChildByName("guangbi");
        //guangbi.on("click",this.OnBtnExit.bind(this));
        this.m_CurCoin = cc.find("jb/Gold", this.node).getComponent(cc.Label);
        var failads = cc.find("btn_fail", this.node);
        failads.on("click", this.OnNextExit.bind(this));

        var replay = this.node.getChildByName("btn_replay");
        replay.on("click", this.OnBtnExit.bind(this));

        var backHome = this.node.getChildByName("btn_back");
        backHome.on("click", this.onReturnHome.bind(this));
       
        BackGroundSoundUtils.GetInstance().PlayEffect("fail");

        replay.active = false;
        this.scheduleOnce(() => {
            replay.active = true;
            replay.opacity = 0;
            var pseq = cc.sequence(cc.fadeTo(0.5, 255), cc.callFunc(() => {
            }));
            replay.runAction(pseq);
        }, 2);

        this.onUpdateCoin();
        this.OnUpdateHero();
    }

    onUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.m_CurCoin.string = "" + coin 
    }

    OnBtnExit()
    {
        var status = EscapeMng.GetInstance().GetIntAdStatus();
        if (cc.sys.platform === cc.sys.ANDROID && status == true) {
            FirebaseReport.reportInformation(FirebaseKey.shengli_playagain);
            //let bAdLoaded = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_hadLoadedAd", "()Z");
            //if (bAdLoaded) {
            //    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['gamefail'].InterstitialCallBack()");
            //}
            //else {
            //    this.OnExit();
            //}  
            sdkManager.GetInstance().JavaInterstitialAds("shengli_playagain", ()=>{this.OnExit();} , ()=>{this.OnExit();})
        }
        else {
            this.OnExit();
        }        
    }

    OnExit() {
        //this.node.destroy();
        if (this.m_exitbtn_callback) {
            this.m_exitbtn_callback();
        }
        BackGroundSoundUtils.GetInstance().PlayEffect("dianji");
    }

    public static InterstitialCallBack() {
        gamefail.getInstance().OnExit();
    }


    OnNextExit() {

        //if (cc.sys.platform === cc.sys.ANDROID) {
        //    FirebaseReport.reportInformation(FirebaseKey.shengli_ad2_skip);
        //    let bAdLoaded = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_hadLoadedAd", "()Z");
        //    if (bAdLoaded) {
        //        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['gamefail'].RewardedCallBack()");
        //    }
        //    else {
        //        FirebaseReport.reportInformation(FirebaseKey.shengli_ad2_skip_2);
        //        this.OnNext();
        //    }
        //}
        //else {
        //    this.OnNext();
        //}  

        sdkManager.GetInstance().JavaRewardedAds("shengli_ad2_skip", () => { this.OnNext(); } , null);
    }

    OnNext() {
        BackGroundSoundUtils.GetInstance().PlayEffect("dianji");
        this.m_plisnter.FD_Success_Next(true);
    }

    public static RewardedCallBack() {
        FirebaseReport.reportInformation(FirebaseKey.shengli_ad2_skip_1);
        gamefail.getInstance().OnNext();
        EscapeMng.GetInstance().SetIntAdStatus();
    }
   
    setCallBack(plisnter,exitbtn_callback)
    {
        this.m_plisnter = plisnter;
        this.m_exitbtn_callback = exitbtn_callback;        
    }
    
    
    SetInitInfo(ilevel:number,init_all_people_count:number, total_killed_people_count:number, total_rescured_people_count:number, total_need_rescur_people_count:number)
    {
        //var levelinfo =  cc.find("panel/levelinfo",this.node);
        //levelinfo.getComponent(cc.Label).string = "第 "+ilevel +"关";

        //var resurcount =  cc.find("panel/resurcount",this.node);
        //resurcount.getComponent(cc.Label).string = "共"+init_all_people_count +"人 失败"+total_killed_people_count+"人";        
    }
    herPrefab: cc.Node = null;
    OnUpdateHero() {
        //var old = cc.find("heroPre", this.node);
     
        var heroId = EscapeMng.GetInstance().Get_Hero();
        var self = this;
        /* var zIndex = cc.find("tz", this.node).zIndex - 1;*/
        cc.loader.loadRes("prefab/p" + heroId, cc.Prefab, (err, sp) => {
            var pnode = cc.instantiate(sp as cc.Prefab);
            self.node.addChild(pnode, 60);
            var p = pnode.getChildByName("p");
            p.setScale(1, 1);
            pnode.setPosition(0, -300);
            this.herPrefab = pnode;
        })
        this.OnHeroPos();
    }

    OnHeroPos() {
        this.scheduleOnce(function () {
            if (this.herPrefab) {
                var wnode = this.herPrefab.getChildByName("p");//("w");
                var sp_com = wnode.getComponent(sp.Skeleton);
                SpineManager.getInstance().playSpinAnimation(sp_com, "shibai", false, function () {
                    SpineManager.getInstance().playSpinAnimation(sp_com, "shibai2", true, null);
                });
            }
        }, 0.5);
    }

    onReturnHome() {      
        cc.director.loadScene("start");
    }
}
