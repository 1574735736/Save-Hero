
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


    public static reportKeys(reportkey: FireKeys, level: number = 0): void {
        if (cc.sys.platform != cc.sys.ANDROID) {
            return;
        }
        var reportStr = "";
        if (cc.sys.platform == cc.sys.ANDROID) {
            switch (reportkey) {
                case FireKeys.game_Start:
                    for (var i = 0; i < FirebaseKey.game_Start.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.game_Start[i]);
                    }
                    break;
                case FireKeys.game_ToMain:
                    for (var i = 0; i < FirebaseKey.game_ToMain.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.game_ToMain[i]);
                    }
                    break;
                case FireKeys.game_Level:
                    for (var i = 0; i < FirebaseKey.game_Level.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.game_Level[i]);
                    }
                    break;
                case FireKeys.game_Play:
                    for (var i = 0; i < FirebaseKey.game_Play.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.game_Play[i]);
                    }
                    break;
                case FireKeys.game_Skin:
                    for (var i = 0; i < FirebaseKey.game_Skin.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.game_Skin[i]);
                    }
                    break;
                case FireKeys.skin_Ad2:
                    for (var i = 0; i < FirebaseKey.skin_Ad2.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.skin_Ad2[i]);
                    }
                    break;
                case FireKeys.skin_Goumai:
                    for (var i = 0; i < FirebaseKey.skin_Goumai.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.skin_Goumai[i]);
                    }
                    break;
                case FireKeys.skin_BackMain:
                    for (var i = 0; i < FirebaseKey.skin_BackMain.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.skin_BackMain[i]);
                    }
                    break;
                case FireKeys.fight_BackMain:
                    for (var i = 0; i < FirebaseKey.fight_BackMain.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.fight_BackMain[i]);
                    }
                    break;
                case FireKeys.fight_SkipLv:
                    for (var i = 0; i < FirebaseKey.fight_SkipLv.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.fight_SkipLv[i]);
                    }
                    break;
                case FireKeys.win_Beishu:
                    for (var i = 0; i < FirebaseKey.win_Beishu.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.win_Beishu[i]);
                    }
                    break;
                case FireKeys.win_NoThanks:
                    for (var i = 0; i < FirebaseKey.win_NoThanks.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.win_NoThanks[i]);
                    }
                    break;
                case FireKeys.win_ClickSkin:
                    for (var i = 0; i < FirebaseKey.win_ClickSkin.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.win_ClickSkin[i]);
                    }
                    break;
                case FireKeys.win_GetSkin:
                    for (var i = 0; i < FirebaseKey.win_GetSkin.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.win_GetSkin[i]);
                    }
                    break;
                case FireKeys.win_SkinNo:
                    for (var i = 0; i < FirebaseKey.win_SkinNo.length; i++) {
                        FirebaseReport.reportInformation(FirebaseKey.win_SkinNo[i]);
                    }
                    break;
                case FireKeys.level_GoIn:
                    for (var i = 0; i < FirebaseKey.level_GoIn.length; i++) {
                        if (level != 0) {
                            FirebaseReport.reportInformation(FirebaseKey.level_GoIn[i] + level);
                        }
                        else {
                            FirebaseReport.reportInformation(FirebaseKey.level_GoIn[i]);
                        }                        
                    }
                    break;
                default:
            }            
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

    

     static game_Start: string[] = ["game_lcon"];               //点击APPicon，应用启动次数
     static game_ToMain: string[] = ["game_zhujiemlan"];        //游戏加载成功，到达主界面
     static game_Level: string[] = ["shouye_level"];            //主界面点击关卡“LEVEL”选择按钮
     static game_Play: string[] = ["shouye_statrt"];            //主界面点击开始游戏“STATRT”按钮
     static game_Skin: string[] = ["shouye_skin"];              //主界面点击皮肤“SKIN”按钮
     static skin_Ad2: string[] = ["skin_ad2"];                  //点击“激励视频获得皮肤”按钮
     static skin_Goumai: string[] = ["skin_goumai"];            //点击金币购买皮肤按钮
     static skin_BackMain: string[] = ["skin_ranbui"];          //点击返回上级界面
     static fight_BackMain: string[] = ["zhandou_Home"];        //点击返回主界面按钮“Home”按钮次数
     static fight_SkipLv: string[] = ["zhandou_ad2_skip"];      //点击看激励视频跳过本关“SKIP“按钮次数
     static win_Beishu: string[] = ["shengli_ad2_beishu"];      //点击“激励视频抽倍数”按钮次数
     static win_NoThanks: string[] = ["shengli_ad3_next"];      //点击进入“No thanks!”按钮次数
     static win_ClickSkin: string[] = ["shengli_skin"];         //当胜利界面皮肤进度达到100%，主动弹出小窗口获得皮肤界面的次数
     static win_GetSkin: string[] = ["shengli_ad2_skin"];       //皮肤小窗口，点击”看激励视频获得皮肤“按钮
     static win_SkinNo: string[] = ["shengli_ad3_skin"];        //皮肤小窗口，点击”No thanks!“按钮
     static level_GoIn: string[] = ["level-"];                  //进入第n关的次数


}

enum FireKeys {
    game_Start,
    game_ToMain,
    game_Level,
    game_Play,
    game_Skin,
    skin_Ad2,
    skin_Goumai,
    skin_BackMain,
    fight_BackMain,
    fight_SkipLv,
    win_Beishu,
    win_NoThanks,
    win_ClickSkin,
    win_GetSkin,
    win_SkinNo,
    level_GoIn,
}

export { FirebaseReport, FirebaseKey, FireKeys }
