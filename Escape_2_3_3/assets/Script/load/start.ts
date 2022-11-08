import EscapeMng from "../game/EscapeMng";
import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";

 

const {ccclass, property} = cc._decorator;

@ccclass
export default class start extends cc.Component {

    private static _instance: start = null; 

    public static getInstance(): start {
        if (start._instance == null) {
            start._instance = new start();
        }
        return start._instance;
    }

    coinLable: cc.Label = null;
    
    onLoad () 
    {
        start._instance = this;
        //var startgame = this.node.getChildByName("nstartgame");
        //startgame.on("click",this.OnBtnStartGame.bind(this));

        var btnStart = cc.find("btstart/startgame", this.node);
        btnStart.on("click", this.OnBtnStartGame.bind(this));
    
        EscapeMng.GetInstance().InitLoad_All_Config_Files(()=>{} );
        EscapeMng.GetInstance().InitLoadLevelInfo();

        var ilevel = EscapeMng.GetInstance().Get_Last_Enter_Level();
   
        var startgame_l = cc.find("btstart/startgame/l",this.node);
        startgame_l.getComponent(cc.Label).string = "LEVEL "+ilevel;

        var selgkComp = cc.find("selgk",this.node);
        selgkComp.on("click", this.OnBtnSelGK.bind(this));

        var zhuComp = cc.find("zhu", this.node);
        zhuComp.on("click", this.OnBtnSkinView.bind(this));

        var Lgold = cc.find("jb/Gold", this.node);
        this.coinLable = Lgold.getComponent(cc.Label)
        

        BackGroundSoundUtils.GetInstance().PlayMusic("datingbj");
        this.OnUpdateCoin();
        
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
            self.node.addChild(pnode,50);

        });
    }
    OnBtnSkinView(): void {
        var self = this;
        cc.loader.loadRes("prefab/SkinView", cc.Prefab, (e, p) => {
            var pnode = cc.instantiate(p as cc.Prefab);
            self.node.addChild(pnode, 50);

        });
    }

    OnUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.coinLable.string = "" + coin;
    }

}
