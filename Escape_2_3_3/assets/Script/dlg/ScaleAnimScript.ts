// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScaleAnimScript extends cc.Component {

    private initScaleX:number;
    private initScaleY:number;
    
    private minScale:number;
    /**缩放比例 */
    private scaleProportion:number = 0.85;

    onLoad () {
        this.initScaleX = 1;//this.target.scaleX;
        this.initScaleY = 1;//this.target.scaleY;
        this.minScale = this.initScaleX * this.scaleProportion;
        this.changeScale();
    }

    private changeScale():void {
        cc.tween(this.node)
            .to(0.3, {scale: this.minScale})
            .to(0.3, {scale: this.initScaleX})
            .call(() => {
                this.changeScale();
            })
            .start();
    }

    // start () {

    // }

    // update (dt) {}
}
