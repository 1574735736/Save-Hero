import EscapeMng from "../game/EscapeMng";
import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";
import { FirebaseReport, FirebaseKey } from "../utils/FirebaseReport";

 

const {ccclass, property} = cc._decorator;

@ccclass
export default class start extends cc.Component {

    private static _instance: start = null; 

    coinCount: cc.Label = null;

    peoplePos: cc.Vec3 = null;

    prefabP: cc.Node = null;

    curShowID: number = 0;

    public static getInstance(): start {
        if (start._instance == null) {
            start._instance = new start();
        }
        return start._instance;
    }
   
    
    onLoad () 
    {
        start._instance = this;
        //var startgame = this.node.getChildByName("startgame");
        //startgame.on("click",this.OnBtnStartGame.bind(this));
    
        EscapeMng.GetInstance().InitLoad_All_Config_Files(()=>{} );
        EscapeMng.GetInstance().InitLoadLevelInfo();
        EscapeMng.GetInstance().InitAllInfos();

        var ilevel = EscapeMng.GetInstance().Get_Last_Enter_Level();
   
        var startgame_l = cc.find("btn_startbg/startgame/l",this.node);
        startgame_l.getComponent(cc.Label).string = "LEVEL "+ilevel;

        var startgame = cc.find("btn_startbg/startgame",this.node);
        startgame.on("click", this.OnBtnStartGame.bind(this));

        var selgkComp = cc.find("selgk",this.node);
        selgkComp.on("click", this.OnBtnSelGK.bind(this));

        var btnSkin = cc.find("btn_skin", this.node);
        btnSkin.on("click", this.OnBtnSkin.bind(this));

        var jinbi = cc.find("jb/Gold", this.node);
        this.coinCount = jinbi.getComponent(cc.Label)

        this.peoplePos = cc.find("people", this.node).position;


        this.onUpdateCoin();
        this.onUpdateHero();
        BackGroundSoundUtils.GetInstance().PlayMusic("datingbj");
        
    }

    start() {
        if (cc.sys.platform === cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BannerAdManager", "JsCall_showAdIfAvailable", "()V");
        }
    }

    
    public static JavaCall_StartGame():void {
        start.getInstance().OnBtnStartGame();
    }
    OnBtnStartGame()
    {
      
       //读取最新的关卡，加载进入游戏
       var ilevel = EscapeMng.GetInstance().Get_Last_Enter_Level();
       EscapeMng.GetInstance().LoadLevelConfig(ilevel,(error,pobj)=>
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

           if (cc.sys.platform === cc.sys.ANDROID) {
               FirebaseReport.reportInformation(FirebaseKey.shouye_play);
           }           
           EscapeMng.GetInstance().m_enter_level = ilevel;
           EscapeMng.GetInstance().m_enter_level_config = pobj;

           cc.director.loadScene("game");
       });
       BackGroundSoundUtils.GetInstance().PlayEffect("dianji");
    }
    OnBtnSelGK()
    {
        var self = this;
        cc.loader.loadRes("prefab/selgk",cc.Prefab,(e,p)=>
        {
            var pnode=  cc.instantiate(p as cc.Prefab);
            self.node.addChild(pnode, 50);
            if (cc.sys.platform === cc.sys.ANDROID) {
                FirebaseReport.reportInformation(FirebaseKey.shouye_level);
            }            
        });
    }

    OnBtnSkin() {
        var self = this;
        cc.loader.loadRes("prefab/SkinView", cc.Prefab, (e, p) => {
            var pnode = cc.instantiate(p as cc.Prefab);
            self.node.addChild(pnode, 50);
            if (cc.sys.platform === cc.sys.ANDROID) {
                FirebaseReport.reportInformation(FirebaseKey.shouye_skin);
            }            
        });
    }

    onUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.coinCount.string = "" + coin
    }
    onUpdateHero() {
        var hero = EscapeMng.GetInstance().Get_Hero();
        if (this.curShowID == Number(hero)) {
            return;
        }
        if (this.prefabP) {
            for (var i = 0; i < this.prefabP.childrenCount; i++) {
                this.prefabP.children[i].active = false;
            }
            this.prefabP.children[hero - 1].active = true;
            this.prefabP.getChildByName("p" + hero).setScale(1, 1);
            return
        }
        this.prefabP = null;
        
        
        var self = this;
        cc.loader.loadRes("prefab/pre", cc.Prefab, (e, p) => {
            var pnode = cc.instantiate(p as cc.Prefab);
            self.node.addChild(pnode, 50);
            pnode.position = this.peoplePos;
            pnode.getChildByName("p" + hero).setScale(1, 1);
            this.prefabP = pnode;       
            for (var i = 0; i < this.prefabP.childrenCount; i++) {
                this.prefabP.children[i].active = false;
            }
            this.prefabP.children[hero - 1].active = true;
        });

    }
}
