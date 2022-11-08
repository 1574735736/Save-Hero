export default class MyLocalStorge 
{
    static setItem( strkey, strvalue)
    {
        if(cc.sys.isBrowser)
        {
            cc.sys.localStorage.setItem(strkey,strvalue);
        }
       // if(cc.sys.os == cc.sys.OS_ANDROID)
       else
        { 
            var stwrpath = jsb.fileUtils.getWritablePath();
            jsb.fileUtils.writeStringToFile(strvalue, stwrpath+strkey+'.json')
        }
         
    }

    static getItem( strkey, defaiultv="")
    {
        if(cc.sys.isBrowser)
        { 
            return cc.sys.localStorage.getItem(strkey,defaiultv);
        }
        else{
            var stwrpath = jsb.fileUtils.getWritablePath(); 
            var strinfo = jsb.fileUtils.getStringFromFile(stwrpath+strkey+'.json');

            if(!strinfo)
            {
                strinfo = defaiultv;
            }

            return strinfo;
          
        }
    }
    
}