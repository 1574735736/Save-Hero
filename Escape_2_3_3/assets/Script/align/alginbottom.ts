
const {ccclass, property} = cc._decorator;


/*
适配工具类，加上这个脚本的节点自动对齐下方

*/


@ccclass
export default class alginbottom extends cc.Component {

 
    @property
    alginbottom: number = 56;

    
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


        var caculate_topy = cy/3;
        if(ireals > icomss)
        {
            //宽比实际宽
            caculate_topy = cy/2;
        }
        else if(ireals < icomss)
        {
            //高比实际高

            caculate_topy = cy/2 * icomss/ireals;

        }else
        {
            caculate_topy = cy/2;
        }

         this.node.y = -1* caculate_topy  + this.alginbottom;
       // this.node.y = -508;



    }


}
