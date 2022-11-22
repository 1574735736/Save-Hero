
class FirebaseReport {

    public static reportInformation(reportkey:string):void {
        if (cc.sys.platform == cc.sys.ANDROID) {
            console.log("通知java ：" + reportkey);
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
     static game_load_success = "game_load_success"; //游戏加载成功，到达主界面
    static game_open_level1 = "game_open_level1";
    static game_open_level2 = "game_open_level2";
    static game_open_level3 = "game_open_level3";
    static click_skip = "click_skip";
    static click_unlocklevel = "click_unlocklevel";
    static click_nextlevel = "click_nextlevel";

    static game_Level1_time = "game_Level1_time";
     static paramDurationKey = "duration";//时长参数key

     static paramCountKey = "count";//弹出次数

    static game_vpn_impression = "game_vpn_impression";//vpn弹窗弹出次数
    static game_vpn_ok = "game_vpn_ok";//选择连接vpn
     static game_vpn_conntected = "game_vpn_conntected";//连接vpn成功

     //点击APPicon，应用启动
     static game_lcon_frequency = "game_lcon_frequency"; 
     //开屏广告，已有缓存，展示成功
     static game_load_success_1 = "game_load_success_1";
     //开屏广告，没有缓存，展示失败
     static game_load_success_2 = "game_load_success_2";
     //主界面点击“关卡”选择按钮
     static shouye_level = "shouye_level";
     //主界面点击“开始游戏”按钮
     static shouye_play = "shouye_play";
     //主界面点击“皮肤”按钮
     static shouye_skin = "shouye_skin";
     //点击看激励视频获得皮肤按钮
     static skin_ad2 = "skin_ad2";
     //激励视频，已有缓存，展示成功
     static skin_ad2_1 = "skin_ad2_1";
     //激励视频，没有缓存，展示失败
     static skin_ad2_2 = "skin_ad2_2";
     //点击金币购买皮肤按钮
     static skin_goumai = "skin_goumai";
     //点击返回上级界面
     static skin_ranbui = "skin_ranbui";
     //点击返回“主界面”按钮
     static zhandou_shouye = "zhandou_shouye";
     //点击看激励视频“跳过本关“
     static zhandou_ad2_skip = "zhandou_ad2_skip";
     //点击“激励视频抽倍数”按钮
     static shengli_ad2_beishu = "shengli_ad2_beishu";
     //激励视频，已有缓存，展示成功
     static shengli_ad2_beishu_1 = "shengli_ad2_beishu_1";
     //激励视频，没有缓存，展示失败
     static shengli_ad2_beishu_2 = "shengli_ad2_beishu_2";
     //点击进入“No thanks!”按钮
     static shengli_ad3_next = "shengli_ad3_next";
     //插屏，已有缓存，展示成功
     static shengli_ad3_next_1 = "shengli_ad3_next_1";
     //插屏，没有缓存，展示失败
     static shengli_ad3_next_2 = "shengli_ad3_next_2";
     //当胜利界面皮肤进度达到100%，主动弹出小窗口获得皮肤界面的次数
     static shengli_skin = "shengli_skin";
     //皮肤小窗口，点击”看激励视频获得皮肤“按钮
     static shengli_ad2_skin = "shengli_ad2_skin";
     //激励视频，已有缓存，展示成功
     static shengli_ad2_skin_1 = "shengli_ad2_skin_1";
     //激励视频，没有缓存，展示失败
     static shengli_ad2_skin_2 = "shengli_ad2_skin_2";
     //皮肤小窗口，点击”No thanks!“按钮
     static shengli_ad3_skin = "shengli_ad3_skin"
     //插屏，已有缓存，展示成功
     static shengli_ad3_skin_1 = "shengli_ad3_skin_1";
     //插屏，没有缓存，展示失败
     static shengli_ad3_skin_2 = "shengli_ad3_skin_2";
     //看激励视频跳过本关
     static shengli_ad2_skip = "shengli_ad2_skip";
     //激励视频，已有缓存，展示成功
     static shengli_ad2_skip_1 = "shengli_ad2_skip_1";
     //激励视频，没有缓存，展示失败
     static shengli_ad2_skip_2 = "shengli_ad2_skip_2";
     //点击”重玩“按钮
     static shengli_playagain = "shengli_playagain";



}

export {FirebaseReport, FirebaseKey}
