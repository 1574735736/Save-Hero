 
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

    m_HeroIconBg: cc.Sprite = null; //带光圈的英雄图
    m_HeroIcon: cc.Sprite = null; //不带光圈的英雄图

    m_BtnNext: cc.Node = null; //下一关

    m_arrow: cc.Node = null;//箭头
    m_StartX: number = -205;
    m_StartY: number = -210;
    m_EndX: number = 225
    m_CurX: number = 0;
    m_CanMove: boolean = false;
    m_Direction: number = 1; //位移速度  1正方向，-1负方向



    
    onLoad () 
    {
        this.m_BtnNext = cc.find("btn_next", this.node);
        this.m_BtnNext.on("click", this.OnBtnExit.bind(this));

        var home = cc.find("btn_home", this.node);
        home.on("click", this.onReturnHome.bind(this));

        this.m_BtnNext.color = cc.color(255, 255, 255, 0);
       
        
        BackGroundSoundUtils.GetInstance().PlayEffect("victory");        
    }

    start() {
        this.m_AdsGetCoin = cc.find("txt_winCount", this.node).getComponent(cc.Label);
        this.m_CurCoin = cc.find("jb/Gold", this.node).getComponent(cc.Label);
        this.m_NoAdsCoin = cc.find("img_noadscount/txt_noadscount", this.node).getComponent(cc.Label);

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
        }
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
    }

    onUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.m_CurCoin.string = "" + coin
    }
}
