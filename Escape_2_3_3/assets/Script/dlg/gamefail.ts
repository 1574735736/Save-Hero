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
    onLoad () 
    {
        //var guangbi = this.node.getChildByName("guangbi");
        //guangbi.on("click",this.OnBtnExit.bind(this));

        var failads = this.node.getChildByName("ani_failads");
        failads.on("click", this.OnBtnExit.bind(this));

        var replay = this.node.getChildByName("btn_replay");
        replay.on("click", this.OnBtnExit.bind(this));
       
        BackGroundSoundUtils.GetInstance().PlayEffect("fail");

    }
    OnBtnExit()
    {
        this.node.destroy();

        if(this.m_exitbtn_callback )
        {
            this.m_exitbtn_callback();
        }
        
        BackGroundSoundUtils.GetInstance().PlayEffect("dianji");
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
