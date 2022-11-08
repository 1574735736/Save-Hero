// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;


/*
适配工具类，加上这个脚本的节点自动缩放

*/


@ccclass
export default class fitscale extends cc.Component {

   

    onLoad () 
    {

     

        var winsize = cc.director.getWinSize();
        var cx = winsize.width;
        var cy=  winsize.height;

        let size1 = cc.view.getFrameSize();
        var cx2 = size1.width;
        var cy2=  size1.height;

        
        var icomss = cx/cy;
        var ireals = cx2/cy2;

        var realscale = 1;

        var caculate_topy = cy/2;
        if(ireals > icomss)
        {
            //宽比实际宽
            caculate_topy = cy/2;

            realscale = ireals/icomss;
            
        }
        else if(ireals < icomss)
        {
            //高比实际高
            realscale = icomss/ireals;
            caculate_topy = cy/2 * icomss/ireals;

        }else
        {
            caculate_topy = cy/2;
        }

        this.node.scale = realscale;

    }
 
}
