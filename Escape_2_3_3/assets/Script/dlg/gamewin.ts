 
 /*
游戏胜利弹框

*/

import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";

const {ccclass, property} = cc._decorator;


/*
游戏胜利弹框
*/


@ccclass
export default class gamewin extends cc.Component {

    m_plisnter = null; 
    m_nextbtn_callback = null;

    m_win_money = 0;
    
    onLoad () 
    {

          
    
        var guangbi = cc.find("guangbi",this.node);
        guangbi.on("click",this.OnBtnExit.bind(this));

      
        BackGroundSoundUtils.GetInstance().PlayEffect("victory");

         
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
        var levelinfo =  cc.find("panel/levelinfo",this.node);
        levelinfo.getComponent(cc.Label).string = "第 "+ilevel +"关";

        var resurcount =  cc.find("panel/resurcount",this.node);
        resurcount.getComponent(cc.Label).string = "共"+init_all_people_count +"人 救"+total_rescured_people_count+"人";

        

    }
}
