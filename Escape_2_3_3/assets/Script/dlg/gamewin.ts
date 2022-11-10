 
 /*
游戏胜利弹框

*/

import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";
import EscapeMng from "../game/EscapeMng";

const {ccclass, property} = cc._decorator;


/*
游戏胜利弹框
*/


@ccclass
export default class gamewin extends cc.Component {

    m_plisnter = null; 
    m_nextbtn_callback = null;

    m_win_money = 0;

    m_touchAds: boolean = false;

    m_AdsGetCoin: cc.Label = null; //看广告能获得的收入
    m_CurCoin: cc.Label = null; //当前的金币
    m_NoAdsCoin: cc.Label = null; //不看广告的收入
    m_CurProLable: cc.Label = null;//当前进度显示
    m_GetCoin: cc.Node = null; //最终获得金币的飘字动画

    m_HeroIconBg: cc.Sprite = null; //带光圈的英雄图
    m_HeroIcon: cc.Sprite = null; //不带光圈的英雄图

    m_BtnNext: cc.Node = null; //下一关

    m_arrow: cc.Node = null;//箭头
    m_StartX: number = -205;
    m_StartY: number = -210;
    m_EndX: number = 225
    m_CurX: number = 0;
    m_CanMove: boolean = false;
    m_Direction: number = 3; //位移速度  1正方向，-1负方向
    m_CurMul: number = 0;//当前的倍数

    m_PosXs: number[] = [-155, -95, -30, 45, 110, 170, 226];
    m_Muls: number[] = [2, 3, 4, 5, 4, 3, 2];
    m_HerPosX: number[] = [90.046, 14.179, -1.383, -1.383, -28.617, 33.633, 33.633, 4.453, -34.453, -55.851];

    m_CoinFly: cc.Node = null;

    
    onLoad () 
    {
        this.m_BtnNext = cc.find("btn_next", this.node);
        this.m_BtnNext.on("click", this.onClickNormal.bind(this));

        var home = cc.find("btn_home", this.node);
        home.on("click", this.onReturnHome.bind(this));

        var winads = cc.find("ani_winads", this.node);
        winads.on("click", this.onClickAds.bind(this));

        
       
        
        BackGroundSoundUtils.GetInstance().PlayEffect("victory");        
    }

    start() {
        this.m_AdsGetCoin = cc.find("txt_winCount", this.node).getComponent(cc.Label);
        this.m_CurCoin = cc.find("jb/Gold", this.node).getComponent(cc.Label);
        this.m_NoAdsCoin = cc.find("img_noadscount/txt_noadscount", this.node).getComponent(cc.Label);
        this.m_CurProLable = cc.find("txt_curProgress", this.node).getComponent(cc.Label);
        this.m_GetCoin = cc.find("txt_getCount", this.node);
        this.m_CoinFly = cc.find("ani_coinfly", this.node);

        this.m_HeroIconBg = cc.find("img_herobg", this.node).getComponent(cc.Sprite);
        this.m_HeroIcon = cc.find("img_herobg/img_hero", this.node).getComponent(cc.Sprite);


        this.m_arrow = cc.find("img_arrow", this.node)

        this.m_NoAdsCoin.string = "" + EscapeMng.GetInstance().m_Default_Coin;

        this.m_CurX = this.m_StartX;
        this.m_CanMove = true;

        this.onSetIcon();
        this.onUpdateCoin();

        //this.scheduleOnce(() => {
        //    var actFade = cc.sequence(cc.fadeTo(1, 0.5));
        //    this.m_BtnNext.runAction(actFade)
        //}, 3);
        this.m_BtnNext.setScale(0, 0,0);
        //this.m_BtnNext.runAction(cc.fadeTo(0.1, 0));
        var pseq = cc.sequence(cc.delayTime(3), cc.scaleTo(0.5, 1,1), cc.callFunc(() => {

        }));

        this.m_BtnNext.runAction(pseq);

    }

    ExitWithMoney( win_money)
    {
       
        this.node.destroy();

        if(this.m_nextbtn_callback )
        {
            this.m_nextbtn_callback();
        }
    }
   
    OnBtnExit()
    {
        this.ExitWithMoney(this.m_win_money);       
        BackGroundSoundUtils.GetInstance().PlayEffect("dianji");
    }
     
    setCallBack(plisnter, nextbtn_callback)
    {
        this.m_plisnter = plisnter; 
        this.m_nextbtn_callback = nextbtn_callback;
        
    }

    SetInitInfo(ilevel:number,init_all_people_count:number, total_killed_people_count:number, total_rescured_people_count:number, total_need_rescur_people_count:number)
    {
        //var levelinfo =  cc.find("panel/levelinfo",this.node);
        //levelinfo.getComponent(cc.Label).string = "第 "+ilevel +"关";

        //var resurcount =  cc.find("panel/resurcount",this.node);
        //resurcount.getComponent(cc.Label).string = "共"+init_all_people_count +"人 救"+total_rescured_people_count+"人";        

    }

    
    onReturnHome() {
        this.m_plisnter.FD_Success_Next(false);
        var getCount = EscapeMng.GetInstance().m_Default_Coin;
        var nowCoin = getCount + EscapeMng.GetInstance().Get_Gold_Coin()
        EscapeMng.GetInstance().Set_Gold_Coin(nowCoin);

        cc.director.loadScene("start");
    }

    update() {
        if (this.m_CanMove) {
            this.m_CurX = this.m_CurX + this.m_Direction;
            this.m_arrow.setPosition(this.m_CurX, this.m_StartY);
            if (this.m_CurX >= this.m_EndX) {
                this.m_Direction = this.m_Direction * -1;                
            }
            else if (this.m_CurX <= this.m_StartX) {
                this.m_Direction = this.m_Direction * -1;       
            }
            this.onUpdateAdsCoin(this.getCurMultiple()); 
        }
    }

    getCurMultiple(): number{
        var x = this.m_arrow.position.x;
        var mul = this.m_Muls[0];
        for (var i = 0; i < this.m_PosXs.length; i++) {
            if (x < this.m_PosXs[i]) {
                mul = this.m_Muls[i];
                break;
            }
        }
        return mul;
    }

    onUpdateAdsCoin(mul: number) {
        if (this.m_CurMul == mul) {
            return;
        }
        this.m_CurMul = mul;
        this.m_AdsGetCoin.string = (EscapeMng.GetInstance().m_Default_Coin * this.m_CurMul) + "";
    }

    onSetIcon() {
        var nextID = EscapeMng.GetInstance().Get_NoHasHero();
        var iconPath1 = "game/heroicon/noside/" + nextID;
        var iconPath2 = "game/heroicon/side/" + nextID;
        cc.loader.loadRes(iconPath1, cc.SpriteFrame, (err, sp) => {
            this.m_HeroIcon.spriteFrame = sp as cc.SpriteFrame;
        })
        cc.loader.loadRes(iconPath2, cc.SpriteFrame, (err, sp) => {
            this.m_HeroIconBg.spriteFrame = sp as cc.SpriteFrame;
        })

        var curProgress = EscapeMng.GetInstance().Get_SkinProgress();
        curProgress = curProgress + EscapeMng.GetInstance().m_Skin_AddProgress;
        if (curProgress >= 1) {
            curProgress = 1;
        }
        this.m_HeroIcon.fillStart = curProgress;
        EscapeMng.GetInstance().Set_SkinProgress();
        this.m_CurProLable.string = Math.floor(curProgress * 100) + "%"
        cc.find("img_herobg", this.node).setPosition(this.m_HerPosX[nextID - 1], 80.788) ;
    }

    onUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.m_CurCoin.string = "" + coin
    }
    //广告按钮点击
    onClickAds() {
        //this.m_GetCoin.zIndex = 10;
        this.m_CanMove = false;        
        var getCount = (EscapeMng.GetInstance().m_Default_Coin * this.m_CurMul);
        //this.m_GetCoin.getComponent(cc.Label).string = "+" + getCount + "";
        var startPos = cc.find("txt_winCount", this.node);
        //this.m_GetCoin.setPosition(startPos.position.x, startPos.position.y);
        var winads = cc.find("ani_winads", this.node).getComponent(cc.Button);
        winads.interactable = false;
        var next = cc.find("btn_next", this.node).getComponent(cc.Button);
        next.interactable = false;
        this.onEndAni(getCount)
             
    }
    //No thanks 按钮点击
    onClickNormal() {
        //this.m_GetCoin.zIndex = 10;
        this.m_CanMove = false;
        var getCount = EscapeMng.GetInstance().m_Default_Coin;
        var startPos = cc.find("img_noadscount", this.node);
        //var lab = this.m_GetCoin.getComponent(cc.Label).string = "+" + getCount + "";
        
        //this.m_GetCoin.setPosition(startPos.position.x, startPos.position.y);
        var winads = cc.find("ani_winads", this.node).getComponent(cc.Button);
        winads.interactable = false;
        var next = cc.find("btn_next", this.node).getComponent(cc.Button);
        next.interactable = false;
        this.onEndAni(getCount);
    }
    onEndAni(getCount: number) {
        //var endPos = cc.find("jb", this.node);
        //var func = cc.sequence(cc.scaleTo(1, 1.2, 1.2), cc.delayTime(0.5), cc.moveTo(1, endPos.position.x, endPos.position.y), cc.delayTime(0.8), cc.callFunc(() => {
        //    this.m_GetCoin.getComponent(cc.Label).string = "";
        //    var nowCoin = getCount + EscapeMng.GetInstance().Get_Gold_Coin()
        //    EscapeMng.GetInstance().Set_Gold_Coin(nowCoin);
        //    this.onUpdateCoin();
        //}), cc.delayTime(1), cc.callFunc(() => { this.OnBtnExit(); }))
        //this.m_GetCoin.runAction(func);  
        this.m_CoinFly.active = true;
        var func = cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
            var nowCoin = getCount + EscapeMng.GetInstance().Get_Gold_Coin();
            EscapeMng.GetInstance().Set_Gold_Coin(nowCoin);
            this.onUpdateCoin();
        }), cc.delayTime(1), cc.callFunc(() => { this.OnBtnExit(); }))
        this.m_GetCoin.runAction(func);  
    }


}
