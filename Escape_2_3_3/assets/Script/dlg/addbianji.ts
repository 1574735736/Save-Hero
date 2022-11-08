// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EscapeMng from "../game/EscapeMng";

const {ccclass, property} = cc._decorator;

/*
工具脚本，配置的时候，复制文字到编辑框里面，确定后，界面显示对应的表现,
正式上线不使用

*/

@ccclass
export default class addbianji extends cc.Component {

    

    // 
    onLoad () 
    {
        var guangbi = this.node.getChildByName("guangbi");
        guangbi.on("click",this.OnBtnExit.bind(this));

        var ok = this.node.getChildByName("ok");
        ok.on("click",this.OnBtnConfirm.bind(this));

        
    }
    OnBtnExit()
    {
        this.node.destroy();
    }

    OnBtnConfirm()
    {
        var editb  = cc.find("editb",this.node);
        var input_str = editb.getComponent(cc.EditBox).string;
        if(!input_str)
        {
            return;
        }

        var jobj = JSON.parse(input_str);
        if(!jobj)
        {
            return;
        }

        EscapeMng.GetInstance().m_enter_level = 0;
        EscapeMng.GetInstance().m_enter_level_config = jobj;

 
        cc.director.loadScene("game");
    
    }
}
