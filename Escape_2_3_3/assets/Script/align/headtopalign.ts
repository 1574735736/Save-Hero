 

const {ccclass, property} = cc._decorator;

/*
适配工具类，加上这个脚本的节点自动对齐上方

*/

@ccclass
export default class headtopalign extends cc.Component {

    @property
    algintop: number = 80;

    @property
    heipingalgintop: number = 100;

    
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

        var algint = this.algintop;

        var caculate_topy = cy/2;
        if(ireals > icomss)
        {
            //宽比实际宽
            caculate_topy = cy/2;
        }
        else if(ireals < icomss)
        {
            //高比实际高

            caculate_topy = cy/2 * icomss/ireals;

            if(icomss/ireals > 1.1)
            {
                algint = this.heipingalgintop;
            }


           
        }else
        {
            caculate_topy = cy/2;
        }

        this.node.y = caculate_topy - algint;


    }
 
}
