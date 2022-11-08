//工具类，图片节点子类
export default class MySprite extends cc.Node
{
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

    }


}