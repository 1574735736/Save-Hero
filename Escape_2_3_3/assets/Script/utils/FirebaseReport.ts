
class FirebaseReport {

    public static reportInformation(reportkey:string):void {
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/FirebaseAnalyticsManager", "JsCall_reportInformation", "(Ljava/lang/String;)V", reportkey);
        }
    }

    public static reportInformationWithParam(reportkey:string, paramKey:string, paramValue:number):void {
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/FirebaseAnalyticsManager", "JsCall_reportInformation", "(Ljava/lang/String;Ljava/lang/String;I)V", reportkey, paramKey, paramValue);
        }
    }
}
 class FirebaseKey {
    static game_open_success = "game_open_success";
    static game_load_success = "game_load_success";
    static game_open_level1 = "game_open_level1";
    static game_open_level2 = "game_open_level2";
    static game_open_level3 = "game_open_level3";
    static click_skip = "click_skip";
    static click_unlocklevel = "click_unlocklevel";
    static click_nextlevel = "click_nextlevel";

    static game_Level1_time = "game_Level1_time";
    static paramDurationKey = "duration";//时长参数key

    static game_vpn_impression = "game_vpn_impression";//vpn弹窗弹出次数
    static game_vpn_ok = "game_vpn_ok";//选择连接vpn
    static game_vpn_conntected = "game_vpn_conntected";//连接vpn成功
}

export {FirebaseReport, FirebaseKey}
