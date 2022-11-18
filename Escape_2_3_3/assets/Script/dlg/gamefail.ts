import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";


const {ccclass, property} = cc._decorator;

/*
游戏失败弹框

*/
@ccclass
export default class gamefail extends cc.Component {

    m_plisnter = null;
    m_exitbtn_callback = null;
    m_nextbtn_callback = null;


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

        var failads = cc.find("ani_failads/btn_fail", this.node);
        failads.on("click", this.OnNextExit.bind(this));

        var replay = this.node.getChildByName("btn_replay");
        replay.on("click", this.OnBtnExit.bind(this));
       
        BackGroundSoundUtils.GetInstance().PlayEffect("fail");

        replay.setScale(0, 0, 0);
        var pseq = cc.sequence(cc.delayTime(3), cc.scaleTo(0.5, 1, 1), cc.callFunc(() => {

        }));

        replay.runAction(pseq);


    }
    OnBtnExit()
    {
        if (cc.sys.platform === cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['gamefail'].InterstitialCallBack()");
        }
        else {
            this.OnExit();
        }            
    }

    OnExit() {
        this.node.destroy();
        if (this.m_exitbtn_callback) {
            this.m_exitbtn_callback();
        }
        BackGroundSoundUtils.GetInstance().PlayEffect("dianji");
    }

    public static InterstitialCallBack() {
        gamefail.getInstance().OnExit();
    }


    OnNextExit() {

        if (cc.sys.platform === cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['gamefail'].RewardedCallBack()");
        }
        else {
            this.OnNext();
        }      
    }

    OnNext() {
        BackGroundSoundUtils.GetInstance().PlayEffect("dianji");
        this.m_plisnter.FD_Success_Next(true);
    }

    public static RewardedCallBack() {
        gamefail.getInstance().OnNext();
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
}
