//工具类，图片节点子类
export default class MyButton extends cc.Node
{
    m_callback_func=  null;
    constructor(sfilename:string,cx:number = null,cy:number = null)
    {
        super();
        var self = this;
        var com_sprite = this.addComponent(cc.Sprite);
        cc.loader.loadRes(sfilename,cc.SpriteFrame,(err,sp)=>
        {
            com_sprite.spriteFrame = sp as cc.SpriteFrame;

            if(cx)
            {
                self.width = cx;
            }

            if(cy)
            {
                self.height = cy;
            }
        })

        this.addComponent(cc.Button);
    }

    AddCallback(callbck)
    {
        this.m_callback_func = callbck;
        this.on("click",callbck);

    }


}