import debounce from "debounce";
import React, {useCallback, useEffect, useState} from "react";
import {selectCurrentUser, setProjectSubData} from '../../../reduxComponents/userAndProjectSlice'
import {useSelector, useDispatch} from 'react-redux'
import {selectSubData} from '../../../reduxComponents/subDataSlice'
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";
import {ArrayToSrtFormat} from '../utilsComponents/SavingSubData'

const DEBOUNCE_SAVE_DELAY_MS = 3000 // 3s delay

function AutoSave({flagSaveSub = false, flagHidden = false, delayTime}) {

    const subData = useSelector(selectSubData);
    const currentUser = useSelector(selectCurrentUser)
    const dispatch = useDispatch();
    const [SavingStatus, setSavingStatus] = useState("unsaved");  
    const [isSubscribed, setIsSubscribed] = useState(true);

    //UseEffect to avoid memory leak when async task but unmounted
    useEffect(() => {
      setIsSubscribed(true);
      return () => setIsSubscribed(false);
    }, []);

    //SAVE FUNCTION: CTR+S / AUTOSAVE using Debounce

    //use param, dont use subData redux directly (empty subData)
    function saveToServer(data, currUser) {

      //this to make only one request
      if(currUser.currentProject && currUser.currentProject.id){
      console.log('request save duoc gui curUserId: ' + currUser.currentProject.id);

      let StrSub
      let savingData = {}

      if(flagSaveSub){
        StrSub = ArrayToSrtFormat(data)


        // ẩn chỗ này đi, nghĩa là sub trống thì vẫn lưu
        // if (StrSub === "") {
        //   setSavingStatus("không có dữ liệu sub")
        //   console.log('không có dữ liệu sub: ', StrSub)
        // }

        savingData = {
          currentUser: currUser,
          newSubData: StrSub
        }
      }
      else{
        //save currentUser only
        savingData = {
          currentUser: currUser
        }
      }

      
    // avoid memory leak warning

          axios({
            method: 'post',
            url: NODEJS_SERVER + '/saveProjectWork',
            data: savingData
          })
          .then(response => {
            if(response.data.success && isSubscribed){
              setSavingStatus("saved")
              console.log('setSavingStatus("saved")');      
              
              //dont know if this is refresh --> no (subData không kịp cập nhật trong cùng lần render)
              dispatch(setProjectSubData({
                subData: StrSub
              }))

            } else {
              console.log('lỗi lưu: ', response.data);
              
              setSavingStatus("lưu không thành công")
              console.log('setSavingStatus("lưu không thành công")');
            }
          })
        }

      
    }

    const debouncedSave = useCallback(
      debounce((nextValue, next2) => saveToServer(nextValue, next2), 
      delayTime ? delayTime : DEBOUNCE_SAVE_DELAY_MS)
      ,[]
    );
    

    // The magic useEffect hook. This runs only when `subData` changes.
    // We could add more properties, should we want to listen for their changes.
    useEffect(() => {
      // console.log('effect:', subData);

      setSavingStatus("unsaved")
      
      debouncedSave(subData, currentUser);
      // debouncedSave is wrapped in a useCallback with an empty dependency list,
      // thus it will not change and in turn will not re-trigger this effect.

    }, [subData]);


    
    //END SAVING FUNCTION




  
    // Do not display anything on the screen.
    return (
        <div >
          <p hidden={flagHidden} style={{fontSize:'10px'}}>{SavingStatus}</p>
        </div>
    );
  }

  export default AutoSave;

//DUMMY CODE
    // useEffect(() => {
    //   console.log("effec2 duoc goi");

    //   if(SavingStatus === "saved"){
    //     console.log("dispatched in another effect");
        
    //       dispatch(setProjectSubData({
    //         subData: StrSub
    //       }))
    //   }
    
    // }, [SavingStatus]);




      
//MATERIAL FOR CTR + S, bugs is only e ctrs accept, ignore edit sub, true/false event flow the same bugs
  // const saveCtrS = useRef();

  // const handleKeyDown = (event)=>{  //SAVING CTR+S
  //   event.preventDefault();
  //   let charCode = String.fromCharCode(event.which).toLowerCase();
  //   if(charCode === 's' &&  (event.ctrlKey || event.metaKey)) {
  //     console.log ("CTRL+S Pressed");

  //     // debouncedSave("CTRL+S Pressed");
  //   }
  // };

  //   USE EFFECT

  // if(saveCtrS.current){
  //   saveCtrS.current.addEventListener('keydown', handleKeyDown, false)  //BUBBLING EVENT: false, FLOWDOWN: true
  // }

  // if(saveCtrS.current){
  //   saveCtrS.current.removeEventListener('keydown', handleKeyDown, false)
  // }
// CONTENT
  //ref={saveCtrS} onKeyDown={handleKeyDown}