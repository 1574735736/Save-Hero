// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseInstanceClass extends cc.Component {
    public static instance: BaseInstanceClass = null;

    public static getInstance(): any {
        if (this.instance == null) {
            this.instance = new this();
        }
        return this.instance;
    }

    // update (dt) {}
}
