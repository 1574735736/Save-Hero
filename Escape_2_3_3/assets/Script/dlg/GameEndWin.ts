
import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";
import EscapeMng from "../game/EscapeMng";

const { ccclass, property } = cc._decorator;
import { FirebaseReport, FirebaseKey, FireKeys } from "../utils/FirebaseReport";
import SpineManager from "../utils/SpineManager";
import sdkManager from "../game/SdkManager";
@ccclass
export default class GameEndWin extends cc.Component {

    m_plisnter = null;
    m_nextbtn_callback = null;

    m_BtnNext: cc.Node = null; //��һ��
    m_CurCoin: cc.Label = null; //��ǰ�Ľ��
    //m_AdCoin: cc.Label = null; //������ܵõ��Ľ��
    m_BtnAds: cc.Node = null;//�����İ�ť
    m_Row: cc.Node = null;
    m_CoinFly: cc.Node = null;//���еĽ��
    m_SkinSlider: cc.Sprite = null;//��ɫ����
    m_SkinProgress: cc.Label = null;//Ƥ����������
    //m_RowSkeleton: sp.Skeleton = null;

    //m_MainRow: cc.Node = null;
    //m_MainPointer: cc.Node = null;
    m_NoAds: cc.Node = null;
    m_RowSpeed: number = 2;
    m_RowCurAng: number = 0;
    TempGetCount: number = 0;//��ȡ���Ľ��
    m_CurMul: number = 0;//��ǰת���ı���λ��
    stopRotation: boolean = false;
    canAddProgress: boolean = false;

    ani_zhuanPan: sp.Skeleton = null;
    ani_reward: sp.Skeleton = null;
    ani_coinflay: sp.Skeleton = null;

    startRowTimer: number = 0; //开始旋转时的时间戳；
    rowMilTimer: number = 667; //旋转一圈所有的时间；

    // onLoad () {}
    m_Muls: number[] = [2, 3, 2, 4, 2, 3, 5, 4];//[3, 2, 4, 2, 3, 2, 4, 5];//[5, 4, 2, 3, 2, 4, 2, 3];


    start() {
        this.m_CurCoin = cc.find("jb/Gold", this.node).getComponent(cc.Label);
        //this.m_AdCoin = cc.find("btn_ads/txt_adCoin", this.node).getComponent(cc.Label);

        this.m_BtnNext = cc.find("btn_noads", this.node);
        this.m_BtnNext.on("click", this.OnClickNoAds.bind(this));

        this.m_BtnAds = cc.find("btn_ads", this.node);
        this.m_BtnAds.on("click", this.OnClickAds.bind(this));

        var home = cc.find("btn_back", this.node);
        home.on("click", this.onReturnHome.bind(this));

        var skin = cc.find("btn_skin", this.node);
        skin.on("click", this.OnBtnSkin.bind(this));

        this.m_Row = cc.find("row", this.node);

        //this.m_MainRow = cc.find("img_row", this.node);
        //this.m_MainPointer = cc.find("pointer", this.node);

        this.m_CoinFly = cc.find("ani_coinfly", this.node);
        this.m_SkinSlider = cc.find("btn_skin/img_slider", this.node).getComponent(cc.Sprite);
        this.m_SkinProgress = cc.find("btn_skin/img_top/txt_progress", this.node).getComponent(cc.Label);
        this.m_NoAds = cc.find("btn_noads", this.node);

        this.ani_zhuanPan = cc.find("ani_zhuanpan", this.node).getComponent(sp.Skeleton);
        this.ani_reward = cc.find("ani_reward", this.node).getComponent(sp.Skeleton);
        this.ani_coinflay = cc.find("ani_flayani", this.node).getComponent(sp.Skeleton);

        this.onUpdateCoin();
        this.onTitleAction();
        this.onUpdateSkinAni();
        this.OnNoAdsAction();
        this.OnFistOneAction();
        this.OnUpdateHero();
        this.onUpdateSpin();

        
    }


    onUpdateSpin() {
        SpineManager.getInstance().playSpinAnimation(this.ani_zhuanPan, "xuanzhuan", true, () => {
            this.startRowTimer = new Date().getTime();
        }, () => {
            this.startRowTimer = new Date().getTime();            
        });
    }

    // update (dt) {}

    onUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.m_CurCoin.string = "" + coin
    }

    setCallBack(plisnter, nextbtn_callback) {
        this.m_plisnter = plisnter;
        this.m_nextbtn_callback = nextbtn_callback;
    }

    ExitWithMoney() {        
        if (this.m_nextbtn_callback) {
            this.m_nextbtn_callback();
        }
        this.node.destroy();
    }

    OnBtnExit() {
        this.ExitWithMoney();
        BackGroundSoundUtils.GetInstance().PlayEffect("dianji");       
    }

    onReturnHome() {
        if (this.stopRotation) {
            return;
        }
        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");
        this.m_plisnter.FD_Success_Next(false);
        var getCount = EscapeMng.GetInstance().m_Default_Coin;
        var nowCoin = getCount + EscapeMng.GetInstance().Get_Gold_Coin()
        EscapeMng.GetInstance().Set_Gold_Coin(nowCoin);

        cc.director.loadScene("start");
    }

    update(dt: number) {
        //this.onUpdateRotate();
        this.onUpdateSkinPro(dt);
    }
    
    //onUpdateRotate() {
    //    //var que = cc.repeatForever(cc.rotateBy(10 / this.m_RowSpeed, 360));
    //    //this.m_MainRow.runAction(que);
    //    //var que2 = cc.repeatForever(cc.rotateBy(10 / this.m_RowSpeed, -360));
    //    //this.m_MainPointer.runAction(que2);
    //    //var que = new cc.Quat(0, 0, 10)
    //    //this.m_MainRow.setRotation(que);
    //    if (this.stopRotation) {
    //        return;
    //    }
    //    this.m_RowCurAng += this.m_RowSpeed;
    //    this.m_MainRow.rotation = this.m_RowCurAng;
    //    this.m_MainPointer.rotation = this.m_RowCurAng * -1;
    //    if (this.m_RowCurAng >= 360) {
    //        this.m_RowCurAng = 0;
    //    }

    //    this.m_CurMul = (Math.floor(this.m_RowCurAng * 2 / 45) % this.m_Muls.length);
    //    if (this.m_Muls[this.m_CurMul]) {
    //        this.m_AdCoin.string = String(this.m_Muls[this.m_CurMul] * 100);
    //    }
        

    //}
    curProgress: number = 0;
    nextID: number = 0;
    m_CurAddPro: number = 0;
    onUpdateSkinAni() {

        var has: boolean = EscapeMng.GetInstance().Get_IsHasAllSkin();
        if (has) {
            var skin = cc.find("btn_skin", this.node);
            skin.active = false;
            return;
        }

        this.nextID = EscapeMng.GetInstance().Get_NoHasHero();
        this.m_CurAddPro = EscapeMng.GetInstance().Get_SkinProgress();
        this.curProgress = this.m_CurAddPro + EscapeMng.GetInstance().m_Skin_AddProgress;
        if (this.curProgress >= 1) {
            this.curProgress = 1;
        }
        this.m_SkinProgress.string = Math.floor(this.m_CurAddPro * 100) + "%";
        this.m_SkinSlider.fillStart = this.m_CurAddPro;
        if (this.m_CurAddPro >= 1) {
            return;
        }
        EscapeMng.GetInstance().Set_SkinProgress();
        this.canAddProgress = true;
        //cc.tween(this.m_SkinSlider)
        //    .to(2, { fillStart: this.curProgress })
        //    .call(() => {
        //        this.m_SkinProgress.string = Math.floor(this.curProgress * 100) + "%";
        //    })
        //    .start()
    }
    tinmer: number = 0;
    onUpdateSkinPro(number) {
        if (this.canAddProgress == false) {
            return;
        }
        this.tinmer = this.tinmer + number
        if (this.tinmer >= 0.1) {
            this.tinmer = 0;
            this.m_SkinProgress.string = Math.floor(this.m_CurAddPro * 100) + "%";
            this.m_SkinSlider.fillStart = this.m_CurAddPro;
            this.m_CurAddPro += number;
            if (this.m_CurAddPro >= this.curProgress) {
                this.canAddProgress = false;
                this.m_SkinProgress.string = Math.floor(this.curProgress * 100) + "%";
                if (this.m_CurAddPro >= 1) {
                    this.OnBtnSkin();
                    var light = cc.find("btn_skin/ani_light", this.node);
                    light.active = true;
                }
            }
        }        
    }


    topSkeleton: sp.Skeleton = null;
    onTitleAction() {      
        var title = cc.find("title", this.node);
        this.topSkeleton = title.getComponent(sp.Skeleton);
        SpineManager.getInstance().playSpinAnimation(this.topSkeleton, "biaoti2", false, null);
        this.scheduleOnce(function () {
            SpineManager.getInstance().playSpinAnimation(this.topSkeleton, "biaoti", true, null);
        }, 1.5);
    }

    OnClickAds() {
       
        if (this.stopRotation) {
            return;
        }
        this.stopRotation = true;

        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");

        this.ani_zhuanPan.timeScale = 0;
        var endTimer = new Date().getTime();
        var tmp = endTimer - this.startRowTimer;
        var index = Math.floor(tmp / this.rowMilTimer  * 8); 

        if (this.m_Muls[index]) {
            this.TempGetCount = this.m_Muls[index] * EscapeMng.GetInstance().m_Default_Coin;
        }

        FirebaseReport.reportKeys(FireKeys.win_Beishu);
       
        var num = EscapeMng.GetInstance().Get_Unlock_level();
        if (cc.sys.platform === cc.sys.ANDROID && num > 1) {
            sdkManager.GetInstance().JavaRewardedAds("shengli_ad2_beishu",()=>{this.OnEndAni();} ,()=>{this.OnEndAni();} );
        }
        else {
            this.OnEndAni();
        }
        
    }
    OnClickNoAds() {
        if (this.stopRotation) {
            return;
        }

        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");
        this.ani_zhuanPan.timeScale = 0;
        this.TempGetCount = EscapeMng.GetInstance().m_Default_Coin;
        this.stopRotation = true;

        var status = EscapeMng.GetInstance().GetIntAdStatus();

        FirebaseReport.reportKeys(FireKeys.win_NoThanks);

        if (cc.sys.platform === cc.sys.ANDROID && status == true) {
            sdkManager.GetInstance().JavaInterstitialAds("shengli_ad3_next", ()=>{this.OnEndAni();} ,()=>{this.OnEndAni();} );
        }
        else {
            this.OnEndAni();
        }        
    }

    OnEndAni() {
        //this.m_CoinFly.active = true;
        //var func = cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
        //    var nowCoin = this.TempGetCount + EscapeMng.GetInstance().Get_Gold_Coin();
        //    EscapeMng.GetInstance().Set_Gold_Coin(nowCoin);
        //    this.onUpdateCoin();
        //}), cc.delayTime(1.5), cc.callFunc(() => { this.OnBtnExit(); }))
        //this.node.runAction(func);
        var self = this;
        var func = cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(() => {
                BackGroundSoundUtils.GetInstance().PlayEffect("success_coin");
                this.ani_reward.node.active = true;    
                SpineManager.getInstance().playSpinAnimation(this.ani_reward, "" + this.TempGetCount, false);
            }),
            cc.delayTime(1.5),
            cc.callFunc(() => {
                this.ani_coinflay.node.active = true;
                SpineManager.getInstance().playSpinAnimation(this.ani_coinflay, "jinbi", false, function () {
                   
                });
            }), cc.delayTime(1.5), cc.callFunc(() => {
                var nowCoin = this.TempGetCount + EscapeMng.GetInstance().Get_Gold_Coin();
                EscapeMng.GetInstance().Set_Gold_Coin(nowCoin);
                self.onUpdateCoin();
            })
            , cc.delayTime(1), cc.callFunc(() => {     

                this.OnBtnExit();
            })
        );
        this.node.runAction(func);
        
    }

    OnBtnSkin() {
        if (this.curProgress < 1) {
            return;
        }
        var status = EscapeMng.GetInstance().Get_SkinStatusType(this.nextID);
        console.log("status     : " + status);
        if (status == 0) {
            return;
        }

        FirebaseReport.reportKeys(FireKeys.win_ClickSkin);

        var self = this;
        cc.loader.loadRes("prefab/getSkinView", cc.Prefab, (e, p) => {
            var pnode = cc.instantiate(p as cc.Prefab);
            self.m_plisnter.node.addChild(pnode, 90);
            var getskin = pnode.getComponent("GetSkinView");
            if (getskin) {
                getskin.onInitView(this, this.nextID);
            }
        });
    }

    OnNoAdsAction() {
        this.m_NoAds.active = false;
        var num = EscapeMng.GetInstance().Get_Unlock_level();
        if (num <= 1) {
            return;
        }
        this.scheduleOnce(() => {
            this.m_NoAds.active = true;
            this.m_NoAds.opacity = 0;
            var pseq = cc.sequence(cc.fadeTo(0.5, 255), cc.callFunc(() => {
            }));
            this.m_NoAds.runAction(pseq);
        }, 2);
    }

    OnFistOneAction() {
        var num = EscapeMng.GetInstance().Get_Unlock_level();
        if (num == 1) {
            var sprite = cc.find("btn_ads", this.node).getComponent(cc.Sprite);
            cc.loader.loadRes("temp/btn_noad", cc.SpriteFrame, (err, sp) => {
                sprite.spriteFrame = sp as cc.SpriteFrame;
            })
        }
    }
    herPrefab: cc.Node = null;
    OnUpdateHero() {
        //var old = cc.find("heroPre", this.node);
        if (this.herPrefab) {
            this.herPrefab.destroy();
        }
        var heroId = EscapeMng.GetInstance().Get_Hero();
        var self = this;
       /* var zIndex = cc.find("tz", this.node).zIndex - 1;*/
        cc.loader.loadRes("prefab/p" + heroId, cc.Prefab, (err, sp) => {
            var pnode = cc.instantiate(sp as cc.Prefab);
            self.node.addChild(pnode, 60);
            var p = pnode.getChildByName("p");
            pnode.name = "heroPre";
            p.setScale(1, 1);
            pnode.setPosition(0, 100);
            self.herPrefab = pnode
        })
        this.OnHeroPos();
    }
    OnHeroPos() {
        this.scheduleOnce(function () {
            if (this.herPrefab) {
                var wnode = this.herPrefab.getChildByName("p");//("w");
                var sp_com = wnode.getComponent(sp.Skeleton);
                SpineManager.getInstance().playSpinAnimation(sp_com, "shengli", true, null);
            }   
        }, 0.5);            
    }

    OnGoBack() {
        this.OnUpdateHero()
    }
}
