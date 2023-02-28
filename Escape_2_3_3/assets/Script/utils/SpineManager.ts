// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseInstanceClass from "./BaseInstanceClass";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpineManager extends BaseInstanceClass {
    /**
        * 播放spin动画
        * @param animationName 动画名称
        * @param completeCallback 播放回调
        * @param isLoop 是否循环
        */
    public playSpinAnimation(spinSkeleton: sp.Skeleton, animationName: string, isLoop: boolean, completeCallback: any = null, startCallBack: any = null, timeScale: number = 1) {
        // console.log('播放动画', animationName, 'spinSkeleton', spinSkeleton, isLoop)
        if (startCallBack) {
            spinSkeleton.setStartListener(startCallBack);
        }
        spinSkeleton.paused = false;
        spinSkeleton.loop = isLoop;
        spinSkeleton.timeScale = timeScale;
        spinSkeleton.animation = animationName;
        
        // spinSkeleton.setAnimation(0,animationName,isLoop);
        if (completeCallback) {
            spinSkeleton.setCompleteListener(completeCallback);
        }       
        // (completeCallback) ? : spinSkeleton.setCompleteListener(null);
    }

    public loadSpine(spinSkeleton: sp.Skeleton, path: string, isLoop: boolean, skinName: string, animationName: string, completeCallback: Function = null) {
        cc.loader.loadRes(path, sp.SkeletonData, (err, spData) => {
            if (err) {
                console.log("LoadSpin ", err)
                return
            }
            spinSkeleton.paused = false;
            spinSkeleton.skeletonData = spData;
            spinSkeleton.defaultSkin = skinName;
            spinSkeleton.setSkin(skinName);
            spinSkeleton.loop = isLoop;
            spinSkeleton.animation = animationName;
            console.log('LoadSpin:****skinName', skinName)
            if (completeCallback != null) {
                completeCallback();
            }
            // spinSkeleton.setSkin(skinName);
        })
    }


    public getAnimationName(spinSkeleton: sp.Skeleton): string {
        return spinSkeleton.animation;
    }
}
