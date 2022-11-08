 
 export class WMapPair
 {
     m_key_obj = null;
     m_entry_obj = null;
     constructor() {
         this.m_key_obj = null;
           this.m_entry_obj = null;
         
     }
    
 }
 
 //工具类，用于存储键值对,方便操作
 export default  class WMap 
 {
     m_array_map = [];
     constructor() 
     {
         this.m_array_map = [];
     }
     
     putData(key,entry)
     {
         var bexist = false;
         var ilen = this.m_array_map.length;
         for(var ii = 0;ii < ilen;ii++)
         {
             var pair = this.m_array_map[ii];
             if(pair.m_key_obj == key)
             {
                 pair.m_entry_obj = entry;
                 bexist = true;
             }
         }
            
         
         if(!bexist)
         {
             var new_pair = new WMapPair();
             new_pair.m_key_obj = key;
             new_pair.m_entry_obj = entry;
             this.m_array_map.push(new_pair);           
         }
     }
     
      clear(){
         this.m_array_map = [];
     }
     Copy()
     {
         var pmap = new WMap();
         var ilen = this.m_array_map.length;
    
         for(var ii = 0;ii < ilen;ii++) {
             var pair = this.m_array_map[ii];
                         
             var ivalue_key = pair.m_key_obj;
                          
 
             pmap.putData(ivalue_key,pair.m_entry_obj);
 
         }
 
         return pmap;
     }
     OrderedIntKeySet() 
     {
         var imivalue = 0;
         var imaxvalue = 0;
         var keyarray = [];
         var ilen = this.m_array_map.length;
         for(var ii = 0;ii < ilen;ii++) {
             var pair = this.m_array_map[ii];
                         
             var ivalue_key = pair.m_key_obj;
                          
             if(imivalue == null || imaxvalue == null)
             {
                 imivalue = imaxvalue = ivalue_key;
             }
             
             if(ivalue_key > imaxvalue)
             {
                 imaxvalue = ivalue_key;
             }
             if(ivalue_key < imivalue)
             {
                 imivalue = ivalue_key;
             }
                         
             keyarray.push(pair.m_key_obj);
         }
                 
         
         var ordered_key_array =   [];
         
         
         for(var tt = imivalue;tt <= imaxvalue;tt++)
         {
             var ilenj = keyarray.length;
             var bexist = false;
             for(var hh = 0;hh < ilenj;hh++)
             {
                 var g_value = keyarray[hh];
                 if(g_value == tt)
                 {
                     bexist = true;
                     break;
                 }
             }
             
             if(bexist)
             {
                 ordered_key_array.push(tt);
             }
         }
         
         
         
         return ordered_key_array;
     }
     
     KeySet()
     {
          
         
         var keyarray = [];
         var ilen = this.m_array_map.length;
         for(var ii = 0;ii < ilen;ii++) {
             var pair = this.m_array_map[ii];
             
              
             
             keyarray.push(pair.m_key_obj);
         }
         
         return keyarray;
     }
     
      GetDataMapArray()
     {
         return this.m_array_map;
     }
     
     size()
     {
         return this.m_array_map.length;
     }
     
     hasKey(key)
     {
         var ilen = this.m_array_map.length;
         for(var ii = 0;ii < ilen;ii++)
         {
             var pair = this.m_array_map[ii];
             if(pair.m_key_obj == key)
             {
                 return true;
             }
         }
         
         return false;
     }
     
     GetByIndex(iindex)  
     {
         var ilen = this.m_array_map.length;
         if(iindex < 0 || iindex >= ilen)
         {
             return null;
         }
         var pair = this.m_array_map[iindex];
         return pair;
     }
     
     GetKeyByIndex(iindex)    
     {
         var ilen = this.m_array_map.length;
         if(iindex < 0 || iindex >= ilen)
         {
             return null;
         }
         var pair = this.m_array_map[iindex];
         return pair.m_key_obj;
     }
         
      GetEntryByIndex(iindex)
     {
         var ilen = this.m_array_map.length;
         if(iindex < 0 || iindex >= ilen)
         {
             return null;
         }
         var pair = this.m_array_map[iindex];
         return pair.m_entry_obj;
     }
     AddAnotherMap(pmap)
     {
         for(var ff=0;ff<pmap.size();ff++)
         {
             var ff_key = pmap.GetKeyByIndex(ff);
             var ff_obj = pmap.GetEntryByIndex(ff);
             this.putData(ff_key,ff_obj);
         }
     }
     getData(key)
     {
         var ilen = this.m_array_map.length;
         for(var ii = 0;ii < ilen;ii++)
         {
             var pair = this.m_array_map[ii];
             if(pair.m_key_obj == key)
             {
                 return pair.m_entry_obj;
             }
         }
                 
         return null;
     }
     
     DeleteFromArrayByIndex(iindex){
         var ilen = this.m_array_map.length;            
         for(var ii = iindex;ii < ilen - 1;ii++){
             this.m_array_map[ii] = this.m_array_map[ii + 1];
         }
         this.m_array_map.length = ilen - 1;
     }
     
     RmAllMap(parentnode = null){
         var ilen = this.m_array_map.length - 1;
         for(var ii = ilen;ii >= 0;ii--){
             var pair = this.m_array_map[ii];
             //this.DeleteFromArrayByIndex(ii);
             if(parentnode){
                 pair.m_entry_obj.DestroyNodes();
             }
         }
 
         this.m_array_map = [];
     }
     
     RemoveEntry(Entry){
         var ilen = this.m_array_map.length;
         for(var ii = 0;ii < ilen;ii++)
         {
             var pair = this.m_array_map[ii];
             if(pair.m_entry_obj == Entry)
             {             
                 this.DeleteFromArrayByIndex(ii);
                 return true;
             }
         }
                                 
         return false;
     }
     
     RemoveKey(key) {
         var ilen = this.m_array_map.length;
         for(var ii = 0;ii < ilen;ii++)
         {
             if(this.m_array_map[ii].m_key_obj == key)
             {             
                 this.DeleteFromArrayByIndex(ii);
                 return true;
             }
         }     
         return false;
     }
      
 }