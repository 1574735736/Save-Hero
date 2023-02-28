  
import MyLocalStorge from "./MyLocalStorge";
import WMap from "./WMap";

 
//工具类，保存音效音乐音量，播放音乐音效等
export default class BackGroundSoundUtils 
{
    static _instance = null;
    m_sound_kai = true;
       
    m_bk_music_sound_volum = 1;
    m_effect_sound_volum = 0.8;
    m_b_record_or_playing_user_sound = false;
    m_bkMusics = null;


    m_filename_audio_map = new WMap();

    static GetInstance() 
    {
        if (!BackGroundSoundUtils._instance) {
            // doSomething
            BackGroundSoundUtils._instance = new BackGroundSoundUtils();
             
        }
        return BackGroundSoundUtils._instance;
    }

    constructor() {

        this.m_sound_kai = true;
       
        this.m_bk_music_sound_volum = 1;
        this.m_effect_sound_volum = 0.8;
        this.initMusicSound();


        this.m_b_record_or_playing_user_sound = false;
    }
 

    // 初始读取声音保存的值
    initMusicSound() {
        const music = MyLocalStorge.getItem("bk_music_shaonaomukuai_volum");
        if (music != null && music != undefined && music != "") this.m_bk_music_sound_volum = 0;// Number(music);
        else {
            this.m_bk_music_sound_volum = 1;
            this.saveMusic();
        }
        const sound = MyLocalStorge.getItem("bk_sound_shaonaomukuai_volum");
        if (sound != null && sound != undefined && sound != "") this.m_effect_sound_volum = 0;// Number(sound);
        else {
            this.m_effect_sound_volum = 0.8;
            this.saveSound();
        } 
    }

    PlayMusic(strfilename)  
    {
        this.playBakMusic(strfilename) 
    }
    playBakMusic(strfilename)    //循环播放
    {
        
        var endfix = strfilename.substr(strfilename.length - 4, 4);
        if (endfix == ".mp3") {
            strfilename = strfilename.substr(0, strfilename.length - 4);
        }

        let self = this;

        strfilename = "music/" + strfilename;

        cc.loader.loadRes(strfilename, cc.AudioClip, (err: Error, audioClip: cc.AudioClip) =>
        {
            if (!err) {
                if (self.m_bkMusics !== null) {
                    cc.audioEngine.stop(self.m_bkMusics);
                    self.m_bkMusics = null;
                }
                cc.log("audio is load " + audioClip);
                //self.m_bkMusics = cc.audioEngine.playMusic(audioClip, true);//play(audioClip as cc.AudioClip, true, self.m_bk_music_sound_volum);            
                let m_bkMusics  = cc.audioEngine.playMusic(audioClip, true);
                cc.audioEngine.setVolume(m_bkMusics, self.m_bk_music_sound_volum);
            }
        });
    
        
    }

    PlayEffect(str,ivlummul = 1) {
        this.PlayFullNameEffect(str,ivlummul  );
    }


    PlayTapButtonEffect()
    {
        this.PlayEffect("Sounds/TapButton1") ;
    }

    PlayFullNameEffect(str,ivlummul = 1)    //播放一遍
    {
        if(this.m_b_record_or_playing_user_sound)
        {
            return;
        }

        var strfilename = str;
       // var endfix = strfilename.substr(strfilename.length - 4, 4);
       // if (endfix == ".mp3") {
          //  strfilename = strfilename.substr(0, strfilename.length - 4);
        //}
        strfilename = "music/" + strfilename;

        if (this.m_sound_kai) 
        {
            


            if(this.m_filename_audio_map.hasKey(strfilename))
            {
                var audip = this.m_filename_audio_map.getData(strfilename);
                cc.audioEngine.play(audip as cc.AudioClip, false, BackGroundSoundUtils.GetInstance().m_effect_sound_volum*ivlummul);
            }
            else{
                var self = this;

                cc.loader.loadRes(strfilename, cc.AudioClip, (err, audioClip)=>
                {
                    if (!err) {

                        self.m_filename_audio_map.putData(strfilename,audioClip);
                        cc.audioEngine.play(audioClip as cc.AudioClip, false, BackGroundSoundUtils.GetInstance().m_effect_sound_volum*ivlummul);

                    }
                });

            }

        

        }
    }

    PlayEffect_Audio_Clip(music_audio_clip)
    {
        if(this.m_b_record_or_playing_user_sound)
        {
            return;
        }
        cc.audioEngine.play(music_audio_clip, false, BackGroundSoundUtils.GetInstance().m_effect_sound_volum);
    }

    StopBkMusic() {
        let self = this;
        if (self.m_bkMusics !== undefined) {
            cc.audioEngine.stop(self.m_bkMusics);
            self.m_bkMusics = undefined;
        }
    }
    
    ResumeBkMusic() {
        let self = this;
        if (self.m_bkMusics !== undefined) {
            cc.audioEngine.resume(self.m_bkMusics);
        }
    }

    PauseBkMusic() {
        let self = this;
        if (self.m_bkMusics !== undefined) {
            cc.audioEngine.pause(self.m_bkMusics);
        }
    }

    ResumeBkMusic_On_Record_Playing_Other_User_Sound_Finish()
    {
        this.m_b_record_or_playing_user_sound = false;
        this.ResumeBkMusic();
      
    }

    StopAllOtherSound_On_Record_Playing_Other_User_Sound()
    {
        this.m_b_record_or_playing_user_sound = true;
        this.PauseBkMusic();
        
    }


    PlayButtonSound() {
        this.PlayFullNameEffect('music/niuniu/anniu.mp3');
    }

    

    playSound(str) {
        this.PlayFullNameEffect(str);
    }

    PlaySoundEffect(str)
    {
        this.PlayEffect("Sounds/"+str);

    }

    PlaySoundEffectMulVoum(str,ivlummul)
    {
        this.PlayEffect("Sounds/"+str,ivlummul);

    }
    playGameSound(str) {
        //var strallfilename = 'Games/shisanshui/audio/' + str; 
        this.PlayFullNameEffect(str);

    }

    SetBkMusicVolum(ivolum) {
        this.m_bk_music_sound_volum = ivolum;
        if (this.m_bkMusics !== undefined) cc.audioEngine.setVolume(this.m_bkMusics, this.m_bk_music_sound_volum);

        MyLocalStorge.setItem('bk_music_shaonaomukuai_volum', ivolum);
    }

    SetEffectVolum(ivolum) {
        this.m_effect_sound_volum = ivolum;
        
        MyLocalStorge.setItem('bk_sound_shaonaomukuai_volum', ivolum);
    }

    GetEffectVolum() {
        return this.m_effect_sound_volum;
    }

    GetBkMusicVolum() {
        return this.m_bk_music_sound_volum;
    }

    // 保存音乐的声音
    saveMusic() {
        MyLocalStorge.setItem("bk_music_shaonaomukuai_volum", this.m_bk_music_sound_volum);
    }

    // 保存音效的声音
    saveSound() {
        MyLocalStorge.setItem("bk_sound_shaonaomukuai_volum", this.m_effect_sound_volum);
    }
 
}
