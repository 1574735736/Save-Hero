// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SdkManager{

    static _instance = null;
    static GetInstance() {
        if (!SdkManager._instance) {
            // doSomething
            SdkManager._instance = new SdkManager();

        }
        return SdkManager._instance;
    }

    callback: Function = null;

    //插页广告



    //激励广告


}
