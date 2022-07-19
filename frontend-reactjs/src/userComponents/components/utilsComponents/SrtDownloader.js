import React, { useEffect, useState } from "react";
import '../../styles/EditPage-TimelineButtonPalette.css'
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { selectSubData } from "../../../reduxComponents/subDataSlice";
import { ArrayToSrtFormat } from "./SavingSubData";
import { selectCurrentUser } from "../../../reduxComponents/userAndProjectSlice";
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";
import PopupError from "../Uploader/PopupError";

function SrtDownloader({allowed}) {
  const subData = useSelector(selectSubData);
  const currentUser = useSelector(selectCurrentUser);
    const [PricingInfo, setPricingInfo] = useState("");

  const handleDownloadSubtitles = () => {

    //check login
    if(PricingInfo.policyName === undefined && PricingInfo.Policy === undefined){
        setPopupHidden(false)
        setPopupMessage('Download SRT is only for PRO Plan')   
        return;
    }


    //check if plan PRO, both no user or user
    if(PricingInfo.policyName && PricingInfo.policyName !== "PRO"){
        setPopupHidden(false)
        setPopupMessage('Download SRT is only for PRO Plan')   
        return;
    }

    if(PricingInfo.Policy && PricingInfo.Policy.policyName !== "PRO"){
        setPopupHidden(false)
        setPopupMessage('Download SRT is only for PRO Plan')   
        return;
    }

    if(!subData){
        setPopupHidden(false)
        setPopupMessage('No Subtitles found!')   
        return;
    }    

    // //allowed
    var blob = new Blob([ArrayToSrtFormat(subData)], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "subtitles.srt");


  };

  //pop up error
  const [PopupHidden, setPopupHidden] = useState(true);
  const [PopupMessage, setPopupMessage] = useState('');

  const handlePopupClose = () => {
    setPopupHidden(true)
    setPopupMessage('')    
  }


    //for userpolicy check
    useEffect(() => {
        //get
        //undefined and '' will not pass

            // clean up controller
    let isSubscribed = true;
    
        axios({
          method: "get",
          url: NODEJS_SERVER + "/getPricingPlanInfo/" + (currentUser.userInfo && currentUser.userInfo.id ? currentUser.userInfo.id : "nouser"),
        }).then((response) => {
          if (response.data.success && isSubscribed) {
            if (response.data.pricingInfo) {
              console.log('useEffect getPricingPlanInfo: ', response.data.pricingInfo);
              setPricingInfo(response.data.pricingInfo);
            } else {
              //no user
              console.log('useEffect getPricingPlanInfo: ', response.data.nouser_pricingInfo);
              setPricingInfo(response.data.nouser_pricingInfo);
            }
          } else {
            console.log("useEffect getPricingPlanInfo err: ", response.data.message);
          }
        });

        return(() => {
          isSubscribed = false
        })
      },[]);


  return (
    <div>
        <PopupError isHidden={PopupHidden} message={PopupMessage} handlePopupClose={handlePopupClose}/>
      <button onClick={handleDownloadSubtitles} className="commonStyles__Button">
        <img src="https://img.icons8.com/bubbles/100/download.png" alt="Download" 
        loading="lazy" lazy="loaded" 
        style={{width: '38px', height: '38px'}}/>
        <span className="commonStyles__Text">Download SRT File</span>
      </button>
    </div>
  );
}

export default SrtDownloader;
