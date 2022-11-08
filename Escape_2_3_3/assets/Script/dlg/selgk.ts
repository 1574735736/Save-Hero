import EscapeMng from "../game/EscapeMng";

import {FirebaseReport, FirebaseKey} from "../utils/FirebaseReport";

 
 
//选关卡弹框界面，正式上线不使用这个弹框
const {ccclass, property} = cc._decorator;

@ccclass
export default class selgk extends cc.Component {

    @property(cc.Node)
    tip_cantShowAd: cc.Node = null;

    private static _instance: selgk = null; 

    m_i_page_index = 0;
    selectedIndex = 0;
    playerUnlockLevel = 0;

    //是否可以点击下一关卡按钮
    bCanClickNextLevel = true;

    public static getInstance(): selgk {
        if (selgk._instance == null) {
            selgk._instance = new selgk();
        }
        return selgk._instance;
    }

    onLoad () 
    {
        selgk._instance = this;
        this.playerUnlockLevel = EscapeMng.GetInstance().Get_Unlock_level();
        var guangbi = this.node.getChildByName("guangbi");
        guangbi.on("click",this.OnBtnExit.bind(this));



        var left = this.node.getChildByName("left");
        left.on("click",this.OnBtnLeftPage.bind(this));

        var right = this.node.getChildByName("right");
        right.on("click",this.OnBtnRightPage.bind(this));
        for(var ff=1;ff<=15;ff++)
        {
            let ff_node_t =  cc.find("gknode/"+ff+"",this.node);
            ff_node_t.on("click",this.OnBtnEnter.bind(this,ff));
        }

        this.updateSelgk();
    }
    OnBtnEnter(iindex)
    {   
        this.selectedIndex = iindex;
        let clickLevel = this.m_i_page_index * 15 + iindex;
        if (clickLevel <= this.playerUnlockLevel) {
            this.EnTerSelectedLevel();
        }
        else if (clickLevel == this.playerUnlockLevel + 1) {
            if (this.bCanClickNextLevel) {
                this.bCanClickNextLevel = false;
                this.scheduleOnce(() => {
                    this.bCanClickNextLevel = true;
                }, 0.5);//限制0.5秒点一次
                if (cc.sys.platform === cc.sys.ANDROID) {
                    FirebaseReport.reportInformation(FirebaseKey.click_unlocklevel);
                    let bAdLoaded = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_hadLoadedAd", "()Z");
                    if (bAdLoaded) {
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V","cc['selgk'].JavaCall_EnTerSelectedLevel()");
                    }
                    else {
                        this.tip_cantShowAd.active = true;
                        this.scheduleOnce(() => {
                            this.tip_cantShowAd.active = false;
                        }, 0.5);
                    }
                    
                }
                else {
                    this.EnTerSelectedLevel();
                }
            }
        }
        else {
            //暂时无提示
        }
       
    }
    public static JavaCall_EnTerSelectedLevel() {
        selgk.getInstance().EnTerSelectedLevel();
    }

    EnTerSelectedLevel() {
        
        let iindex = this.selectedIndex;
        var ipage_gk = this.m_i_page_index*15 + iindex;
  
        EscapeMng.GetInstance().LoadLevelConfig(ipage_gk,(error,pobj)=>
        {
                if(error)
                {
                    console.log("关卡配置错误");
                    return;
                }

                if(!pobj)
                {
                    console.log("关卡配置错误");
                    return;
                }

                EscapeMng.GetInstance().m_enter_level = ipage_gk;
                EscapeMng.GetInstance().m_enter_level_config = pobj;

                //更新最大解锁关卡
                EscapeMng.GetInstance().On_Change_Unlock_Level(ipage_gk);

                cc.director.loadScene("game");

            }
        );
    }

    OnBtnExit()
    {
        this.node.destroy();
    }
    updateSelgk()
    {
        let unlockUrl = "temp/home_btn_setting";
        let lockUrl = "temp/suo";
        
        let playerLevelIndex = this.playerUnlockLevel % 15;
        playerLevelIndex = playerLevelIndex == 0 ? 15 : playerLevelIndex;

        let levelBase = this.m_i_page_index*15;
        for(var ff=1;ff<=15;ff++)
        {
            let ff_node_t =  cc.find("gknode/"+ff+"/t",this.node);

            let ipage_gk = levelBase + ff;
            ff_node_t.getComponent(cc.Label).string = "" + ipage_gk;
        }
        let self = this;
        if (this.playerUnlockLevel > levelBase) {
            cc.loader.loadRes(unlockUrl, cc.SpriteFrame, function(err, spriteFrame) {
                for (let i = 1; i <= playerLevelIndex; i++) {
                    if (levelBase + i <= self.playerUnlockLevel ) {
                        let ff_node =  cc.find("gknode/"+ i +"", self.node);
                        ff_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    }
                    else {
                        break;
                    }
                }
            });
        }
        
        cc.loader.loadRes(lockUrl, cc.SpriteFrame, function(err, spriteFrame) {
            for (let i = 15; i >= 1; i--) {
                if (levelBase + i > self.playerUnlockLevel) {
                    let ff_node =  cc.find("gknode/"+ i +"", self.node);
                    ff_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
                else {
                    break;
                }
            }
        });
    }
    
    OnBtnLeftPage()
    {
        if(this.m_i_page_index <= 0)
        {
            return;
        }
        this.m_i_page_index --;
        this.updateSelgk();

    }
    OnBtnRightPage()
    {
        if(this.m_i_page_index  >= 3)
        {
            return;
        }
        this.m_i_page_index ++;
        this.updateSelgk();
    }
}
