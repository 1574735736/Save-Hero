
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

    callBackSuccess: Function = null;
    callBackFail: Function = null;


    //��ҳ���
    public JavaInterstitialAds(order: string, callSuccess: Function = null, callFail: Function = null) {
        this.callBackSuccess = callSuccess;
        this.callBackFail = callFail;
        if (cc.sys.platform == cc.sys.ANDROID) {
            //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;Ljava/lang/String;)V", 'cc["sdkManager"].JavaCall_AdLoadSuccess()', order);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AdManage", "showInterstitialAd", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                'cc["sdkManager"].JavaCall_AdLoadSuccess()', 'cc["sdkManager"].JavaCall_AdLoadSuccess()', order);
        }
        else {
            if (this.callBackSuccess) {
                this.callBackSuccess();
            }
        }   
    }


    //�������
    public JavaRewardedAds(order: string, callSuccess: Function = null, callFail: Function = null) {
        this.callBackSuccess = callSuccess;
        this.callBackFail = callFail;
        if (cc.sys.platform == cc.sys.ANDROID) {
            //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", 'cc["sdkManager"].JavaCall_AdLoadSuccess()', 'cc["sdkManager"].JavaCall_AdLoadFail()', order, "");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AdManage", "showRewardVideoAd", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                'cc["sdkManager"].JavaCall_AdLoadSuccess()', 'cc["sdkManager"].JavaCall_AdLoadFail()', order);
        }
        else {
            if (this.callBackSuccess) {
                this.callBackSuccess();
            }
        }  

    }

    // 震动效果
    public vibrationEffect() {
        if (cc.sys.os === cc.sys.OS_IOS) {
            //调用苹果的方法;
        }
        else if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "vibrator", "(I)V", 100);
        }
    }


    public static JavaCall_AdLoadSuccess(): void  {
        if (SdkManager.GetInstance().callBackSuccess) {
            SdkManager.GetInstance().callBackSuccess();
        }
    }

    public static JavaCall_AdLoadFail(): void {
        if (SdkManager.GetInstance().callBackFail) {
            SdkManager.GetInstance().callBackFail();
        }
    }

}
