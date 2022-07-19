import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {selectSubData} from '../../../reduxComponents/subDataSlice'
import '../../styles/EditPage-SubtitlesAreaNoData.css'
import SubFileUploader from "../utilsComponents/SubFileUploader";
import SubtitlesAreaWithData from "./SubtitlesAreaWithData";
import axios from 'axios'
import {createNewSubData, importSubData} from "../../../reduxComponents/subDataSlice";
import {selectCurrentUser} from '../../../reduxComponents/userAndProjectSlice'
import { NODEJS_SERVER } from "../../../env";
import AutoSave from "../utilsComponents/AutoSave";
import PopupError from "../Uploader/PopupError";
import { hide, setAll } from "../../../reduxComponents/loadingStatusSlice";


function SubtitlesAreaNoData({myVideoRef}) {
  const subData = useSelector(selectSubData);
  const currentUser = useSelector(selectCurrentUser);
  // const loadingStatus = useSelector(selectLoadingStatus)
  const [ShowSubtitlesButton, setShowSubtitlesButton] = useState(true);
  
  const dispatch = useDispatch()
  
  const handleCreateNew = useCallback(() => {
    dispatch(
      createNewSubData()
    );
  }, [dispatch])

  const handleAutoGenSub = useCallback(() => {
    console.log('auto gen click');

    // kiểm tra chưa upload xong video thì không cho thực hiện, vì gây lỗi FFMPEG PROBE: No input
    if(currentUser.currentProject && currentUser.currentProject.videoUrl === ''){
      console.log('Chưa có URL đâu, đợi upload video xong đã nhé');
      setPopupHidden(false);
      setPopupMessage('Vui lòng chờ để video upload xong nhé');
      return;
    }
    
   // if(currentUser.currentProject !== undefined && currentUser.currentProject.videoUrl !== ''){
    dispatch(setAll({
      loadingMessage: "Request autogen to server ...",
      isLoading: true,

    }))

    //disable SubtitlesButton
    setShowSubtitlesButton(false)

      axios({
        method: 'post',
        url: NODEJS_SERVER + '/autoGen',
        data: currentUser,
      })
      .then(response => {
        if(response.data.success[0]){
          dispatch(importSubData({
            subData: response.data.data
          }))
          console.log('after post autogen: ', response.data)

          //hide the loading status message
          dispatch(hide())

          //re-enable SubtitlesButton
          setShowSubtitlesButton(true)
  
        } else {
          console.log("auto gen failed roi bro: ", response.data.message);

          //Show error to user
          dispatch(setAll({
            loadingMessage: "auto gen failed: " + response.data.message,
            isLoading: false,
      
          }))

          //re-enable SubtitlesButton
          setShowSubtitlesButton(true)

          if (response.data.popUpUpgrade) {
            setPopupHidden(false);
            setPopupMessage(response.data.message);
          }
        }
      })
 //   }

  }, [currentUser, dispatch])


  //pop up error
  const [PopupHidden, setPopupHidden] = useState(true);
  const [PopupMessage, setPopupMessage] = useState('');

  const handlePopupClose = () => {
    setPopupHidden(true)
    setPopupMessage('')    
  }



  return (
      <div>
      <PopupError isHidden={PopupHidden} message={PopupMessage} handlePopupClose={handlePopupClose}/>
    <div className="PanelLayoutStyled__Header">
    <div className="PanelLayoutStyled__TitleWrapper-sc-1kjgn7f-9 kmDIgC">
      <h2 className="PanelLayoutStyled__Title-sc-1kjgn7f-5 gzRXxl">
        Subtitles
      </h2>
      <AutoSave flagSaveSub={true}/>
    </div>
  </div>
  
  {subData ? <SubtitlesAreaWithData myVideoRef={myVideoRef}/> : 

    ShowSubtitlesButton ?
    <div data-testid="@panel-layout/content" className="PanelLayoutStyled__Content">
    <span className="SubtitleOptionsModal__Subheading">How do you want to add subtitles?</span>
    <button className="SubtitleOptionButton__Container" onClick={handleAutoGenSub}>
      <svg width="62" height="48" viewBox="0 0 62 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="SubtitleOptionButton__StyledIcon">
        <g>
          <rect width="62" height="48" rx="8.02839" fill="#DFE0E5"></rect>
          <rect width="62" height="48" rx="8.02839" fill="url(#paint0_linear)" fillOpacity="0.2"></rect>
        </g>
        <g>
          <path
            d="M20.7913 25.1017C20.7913 25.3655 20.6924 25.6104 20.4946 25.8365C20.3062 26.0626 20.0471 26.1756 19.7174 26.1756C19.5008 26.1756 19.3029 26.1191 19.124 26.006C18.945 25.8836 18.8178 25.7187 18.7425 25.5115L18.3751 24.4941H14.3339L13.9524 25.5115C13.877 25.7187 13.7451 25.8836 13.5568 26.006C13.3778 26.1191 13.18 26.1756 12.9633 26.1756C12.643 26.1756 12.384 26.0673 12.1861 25.8506C11.9977 25.6245 11.9035 25.3749 11.9035 25.1017C11.9035 24.951 11.9271 24.8238 11.9742 24.7202L14.7295 17.6411C14.852 17.3208 15.0545 17.0665 15.3371 16.8781C15.6291 16.6803 15.94 16.5813 16.2697 16.5813C16.6277 16.5531 16.9668 16.6379 17.2871 16.8357C17.6168 17.0241 17.8476 17.2926 17.9794 17.6411L20.7206 24.7202C20.7677 24.8615 20.7913 24.9887 20.7913 25.1017ZM17.824 22.7279L16.3545 18.6726L14.885 22.7279H17.824ZM30.1509 22.3181C30.1509 22.9022 30.0614 23.4391 29.8824 23.9289C29.7128 24.4094 29.4491 24.8238 29.0911 25.1724C28.7426 25.5209 28.2998 25.7894 27.7629 25.9778C27.2354 26.1662 26.6137 26.2604 25.8977 26.2604C25.1818 26.2604 24.5554 26.1662 24.0185 25.9778C23.4909 25.78 23.0482 25.5115 22.6902 25.1724C22.3417 24.8238 22.0779 24.4094 21.899 23.9289C21.7294 23.4485 21.6446 22.9163 21.6446 22.3322V17.5846C21.6446 17.3114 21.7435 17.0759 21.9413 16.8781C22.1392 16.6803 22.3841 16.5813 22.6761 16.5813C22.9493 16.5813 23.1848 16.6803 23.3826 16.8781C23.5804 17.0759 23.6793 17.3114 23.6793 17.5846V22.2616C23.6793 22.921 23.863 23.4579 24.2304 23.8724C24.6072 24.2775 25.163 24.48 25.8977 24.48C26.6325 24.48 27.1836 24.2775 27.5509 23.8724C27.9183 23.4579 28.102 22.921 28.102 22.2616V17.5846C28.102 17.3114 28.2009 17.0759 28.3987 16.8781C28.5966 16.6803 28.8462 16.5813 29.1476 16.5813C29.4208 16.5813 29.6563 16.6803 29.8541 16.8781C30.052 17.0759 30.1509 17.3114 30.1509 17.5846V22.3181ZM39.0301 17.5563C39.0301 17.8012 38.9453 18.0085 38.7758 18.178C38.6062 18.3476 38.4037 18.4324 38.1682 18.4324H36.2041V25.1724C36.2041 25.4456 36.1052 25.6811 35.9074 25.8789C35.7096 26.0767 35.4694 26.1756 35.1868 26.1756C34.9136 26.1756 34.6781 26.0767 34.4803 25.8789C34.2824 25.6811 34.1835 25.4456 34.1835 25.1724V18.4324H32.2195C31.9745 18.4324 31.7673 18.3476 31.5977 18.178C31.4282 17.9991 31.3434 17.7824 31.3434 17.5281C31.3434 17.2926 31.4282 17.09 31.5977 16.9205C31.7673 16.7509 31.9745 16.6661 32.2195 16.6661H38.1682C38.4037 16.6661 38.6062 16.7556 38.7758 16.9346C38.9453 17.1042 39.0301 17.3114 39.0301 17.5563ZM49.2831 21.3855C49.2831 22.092 49.1606 22.7467 48.9157 23.3496C48.6708 23.9431 48.3269 24.4565 47.8842 24.8898C47.4509 25.3231 46.9328 25.6622 46.3299 25.9071C45.727 26.1426 45.0676 26.2604 44.3517 26.2604C43.6452 26.2604 42.9905 26.1426 42.3876 25.9071C41.7848 25.6622 41.262 25.3231 40.8192 24.8898C40.3859 24.4565 40.0468 23.9431 39.8019 23.3496C39.5569 22.7467 39.4345 22.092 39.4345 21.3855C39.4345 20.679 39.5569 20.0291 39.8019 19.4356C40.0468 18.8327 40.3859 18.3146 40.8192 17.8813C41.262 17.448 41.7848 17.1136 42.3876 16.8781C42.9905 16.6332 43.6452 16.5107 44.3517 16.5107C45.0676 16.5107 45.727 16.6332 46.3299 16.8781C46.9328 17.1136 47.4509 17.448 47.8842 17.8813C48.3269 18.3146 48.6708 18.8327 48.9157 19.4356C49.1606 20.0291 49.2831 20.679 49.2831 21.3855ZM47.2201 21.3855C47.2201 20.9428 47.1494 20.533 47.0081 20.1562C46.8763 19.7794 46.6832 19.4544 46.4288 19.1813C46.1839 18.8987 45.8825 18.682 45.5245 18.5313C45.176 18.3711 44.785 18.2911 44.3517 18.2911C43.9184 18.2911 43.5227 18.3711 43.1648 18.5313C42.8162 18.682 42.5195 18.8987 42.2746 19.1813C42.0297 19.4544 41.8366 19.7794 41.6953 20.1562C41.5634 20.533 41.4975 20.9428 41.4975 21.3855C41.4975 21.8283 41.5634 22.238 41.6953 22.6148C41.8366 22.9916 42.0297 23.3166 42.2746 23.5898C42.5195 23.863 42.8162 24.0797 43.1648 24.2398C43.5227 24.3999 43.9184 24.48 44.3517 24.48C44.785 24.48 45.176 24.3999 45.5245 24.2398C45.8825 24.0797 46.1839 23.863 46.4288 23.5898C46.6832 23.3166 46.8763 22.9916 47.0081 22.6148C47.1494 22.238 47.2201 21.8283 47.2201 21.3855Z"
            fill="white"
          ></path>
        </g>
        <rect x="8.77872" y="36" width="44.9911" height="2.72727" rx="1.36364" fill="white"></rect>
        <defs>
          <filter id="filter1_d" x="6.55127" y="14.3698" width="48.084" height="20.4542" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
            <feOffset dy="3.21136"></feOffset>
            <feGaussianBlur stdDeviation="2.67613"></feGaussianBlur>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
            <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
          </filter>
          <linearGradient id="paint0_linear" x1="31" y1="0" x2="31" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"></stop>
            <stop offset="1" stopColor="white" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>
      <h3 size="13" className="SubtitleOptionButton__Title">
        Auto Subtitle
      </h3>
      <p size="11" className="SubtitleOptionButton__SubTitle">
        Automatically add subtitles to video
      </p>
 
    </button>
 
    <div className="SubtitleOptionsModal__OptionsWrapper">
      <button className="SubtitleOptionButton__Container" onClick={handleCreateNew}>
        <svg width="62" height="49" viewBox="0 0 62 49" fill="none" xmlns="http://www.w3.org/2000/svg" className="SubtitleOptionButton__StyledIcon">
          <g clipPath="url(#clip0)">
            <g>
              <rect y="0.0996094" width="62" height="48" rx="8.02839" fill="#DFE0E5"></rect>
              <rect y="0.0996094" width="62" height="48" rx="8.02839" fill="url(#paint0_linear)" fillOpacity="0.2"></rect>
            </g>
            <g>
              <path
                d="M18.2107 27.0163C18.2107 27.4844 18.1242 27.9169 17.9512 28.3137C17.7884 28.7106 17.5391 29.0566 17.2033 29.3517C16.8675 29.6366 16.4401 29.8656 15.9211 30.0386C15.4123 30.2014 14.817 30.2828 14.1352 30.2828C13.7689 30.2828 13.3873 30.2522 12.9904 30.1912C12.5936 30.1301 12.212 30.0436 11.8457 29.9317C11.4895 29.8198 11.169 29.6824 10.884 29.5196C10.6093 29.3568 10.4007 29.1685 10.2582 28.9548C10.1463 28.792 10.0903 28.619 10.0903 28.4358C10.0903 28.1407 10.1921 27.9016 10.3956 27.7184C10.6093 27.5251 10.8484 27.4284 11.113 27.4284C11.2147 27.4284 11.3165 27.4437 11.4183 27.4742C11.52 27.4946 11.6116 27.5353 11.693 27.5963C12.039 27.8304 12.4257 28.0237 12.8531 28.1764C13.2805 28.3188 13.7435 28.3901 14.2421 28.3901C14.5372 28.3901 14.7967 28.3595 15.0205 28.2985C15.2444 28.2374 15.4276 28.156 15.57 28.0543C15.7227 27.9423 15.8346 27.8202 15.9058 27.6879C15.9771 27.5455 16.0127 27.403 16.0127 27.2605C16.0127 27.0367 15.9262 26.8535 15.7532 26.711C15.5904 26.5686 15.3716 26.4515 15.0969 26.36C14.8221 26.2582 14.5067 26.1717 14.1505 26.1005C13.8045 26.0191 13.4484 25.9275 13.082 25.8257C12.7157 25.724 12.3545 25.6019 11.9983 25.4594C11.6523 25.3169 11.3419 25.1338 11.0672 24.9099C10.7924 24.686 10.5686 24.4113 10.3956 24.0856C10.2328 23.7498 10.1514 23.3428 10.1514 22.8645C10.1514 22.4371 10.2379 22.0403 10.4109 21.674C10.594 21.2974 10.8484 20.9667 11.174 20.6818C11.5099 20.3969 11.9169 20.173 12.3952 20.0102C12.8734 19.8474 13.4127 19.766 14.0131 19.766C14.298 19.766 14.6135 19.7914 14.9595 19.8423C15.3156 19.883 15.6565 19.9542 15.9822 20.056C16.3078 20.1476 16.608 20.2646 16.8827 20.4071C17.1575 20.5495 17.3661 20.7123 17.5085 20.8955C17.6307 21.0481 17.6917 21.2211 17.6917 21.4145C17.6917 21.7096 17.5747 21.9487 17.3406 22.1319C17.1168 22.3049 16.8726 22.3914 16.608 22.3914C16.4146 22.3914 16.2315 22.3405 16.0585 22.2387C15.7023 22.0352 15.3309 21.8877 14.9442 21.7961C14.5677 21.7045 14.1912 21.6587 13.8147 21.6587C13.3466 21.6587 12.9854 21.7554 12.731 21.9487C12.4867 22.1319 12.3646 22.3761 12.3646 22.6814C12.3646 22.8849 12.446 23.0528 12.6088 23.1851C12.7818 23.3072 13.0057 23.414 13.2805 23.5056C13.5552 23.5972 13.8656 23.6837 14.2116 23.7651C14.5677 23.8363 14.9239 23.9228 15.28 24.0246C15.6464 24.1264 16.0025 24.2535 16.3485 24.4062C16.7047 24.5487 17.0201 24.7369 17.2949 24.971C17.5696 25.1948 17.7884 25.4747 17.9512 25.8105C18.1242 26.1361 18.2107 26.538 18.2107 27.0163ZM28.8589 26.0242C28.8589 26.6551 28.7622 27.2351 28.5689 27.7642C28.3857 28.2832 28.1008 28.7309 27.7141 29.1075C27.3376 29.484 26.8593 29.774 26.2793 29.9775C25.7095 30.181 25.0378 30.2828 24.2645 30.2828C23.4911 30.2828 22.8144 30.181 22.2344 29.9775C21.6645 29.7638 21.1863 29.4738 20.7996 29.1075C20.4231 28.7309 20.1381 28.2832 19.9448 27.7642C19.7616 27.2453 19.6701 26.6703 19.6701 26.0394V20.9108C19.6701 20.6157 19.7769 20.3613 19.9906 20.1476C20.2043 19.9339 20.4689 19.827 20.7843 19.827C21.0794 19.827 21.3338 19.9339 21.5475 20.1476C21.7612 20.3613 21.8681 20.6157 21.8681 20.9108V25.9631C21.8681 26.6754 22.0665 27.2554 22.4633 27.7032C22.8704 28.1407 23.4708 28.3595 24.2645 28.3595C25.0582 28.3595 25.6535 28.1407 26.0504 27.7032C26.4472 27.2554 26.6456 26.6754 26.6456 25.9631V20.9108C26.6456 20.6157 26.7525 20.3613 26.9662 20.1476C27.1799 19.9339 27.4495 19.827 27.7752 19.827C28.0703 19.827 28.3247 19.9339 28.5384 20.1476C28.7521 20.3613 28.8589 20.6157 28.8589 20.9108V26.0242ZM39.3513 27.3521C39.3513 27.7388 39.2851 28.1 39.1528 28.4358C39.0307 28.7615 38.8425 29.0515 38.5881 29.3059C38.3438 29.5501 38.0386 29.7435 37.6722 29.8859C37.3059 30.0284 36.8785 30.0996 36.3901 30.0996H32.0857C31.7499 30.0996 31.4598 29.9826 31.2156 29.7485C30.9816 29.5043 30.8645 29.2143 30.8645 28.8785V21.1397C30.8645 20.8039 30.9816 20.519 31.2156 20.2849C31.4598 20.0407 31.7499 19.9186 32.0857 19.9186H36.2222C36.7106 19.9186 37.138 19.9898 37.5043 20.1323C37.8707 20.2748 38.1759 20.4681 38.4202 20.7123C38.6644 20.9464 38.8475 21.2211 38.9697 21.5366C39.0918 21.852 39.1528 22.1777 39.1528 22.5135C39.1528 22.8391 39.107 23.1342 39.0155 23.3988C38.9239 23.6633 38.7967 23.8974 38.6339 24.1009C38.471 24.2943 38.2828 24.4571 38.0691 24.5894C37.8656 24.7115 37.6417 24.798 37.3975 24.8488C37.6722 24.8895 37.9266 24.9862 38.1607 25.1389C38.3947 25.2813 38.5982 25.4645 38.7712 25.6884C38.9544 25.902 39.0969 26.1564 39.1986 26.4515C39.3004 26.7365 39.3513 27.0367 39.3513 27.3521ZM36.9396 22.8951C36.9396 22.5694 36.8327 22.3049 36.619 22.1013C36.4053 21.8877 36.1153 21.7808 35.749 21.7808H33.032V23.9941H35.749C36.1153 23.9941 36.4053 23.8923 36.619 23.6888C36.8327 23.4853 36.9396 23.2207 36.9396 22.8951ZM37.138 27.0468C37.138 26.884 37.1075 26.7314 37.0464 26.5889C36.9955 26.4465 36.9141 26.3243 36.8022 26.2226C36.6903 26.1107 36.5529 26.0242 36.3901 25.9631C36.2273 25.8919 36.039 25.8563 35.8253 25.8563H33.032V28.2222H35.8253C36.2425 28.2222 36.5631 28.1204 36.7869 27.9169C37.021 27.7032 37.138 27.4132 37.138 27.0468Z"
                fill="white"
              ></path>
            </g>
            <g filter="url(#filter2_d)">
              <rect x="47.0272" y="34.7656" width="21.3333" height="2.14592" rx="1.07296" transform="rotate(-90 47.0272 34.7656)" fill="white"></rect>
              <rect x="43.8085" y="13.4336" width="8.58368" height="2.13333" rx="1.06667" fill="white"></rect>
              <rect x="43.8085" y="32.6328" width="8.58368" height="2.13333" rx="1.06667" fill="white"></rect>
            </g>
          </g>
          <defs>
            <filter id="filter1_d" x="3.84599" y="17.2679" width="41.7496" height="23.0054" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
              <feOffset dy="3.74658"></feOffset>
              <feGaussianBlur stdDeviation="3.12215"></feGaussianBlur>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
              <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
            </filter>
            <filter id="filter2_d" x="38.4562" y="11.2917" width="19.2882" height="32.0381" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
              <feOffset dy="3.21136"></feOffset>
              <feGaussianBlur stdDeviation="2.67613"></feGaussianBlur>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
              <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
            </filter>
            <linearGradient id="paint0_linear" x1="31" y1="0.0996094" x2="31" y2="48.0996" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"></stop>
              <stop offset="1" stopColor="white" stopOpacity="0"></stop>
            </linearGradient>
            <clipPath id="clip0">
              <rect width="62" height="48" fill="white" transform="translate(0 0.0996094)"></rect>
            </clipPath>
          </defs>
        </svg>
        <h3 size="13" className="SubtitleOptionButton__Title">
          Manual Subtitles
        </h3>
        <p size="11" className="SubtitleOptionButton__SubTitle">
          Type your subtitles manually
        </p>
      </button>
 
      <SubFileUploader acceptType='.srt'/>
    </div>
  </div>
    :

    <div data-testid="@panel-layout/content" className="PanelLayoutStyled__Content">
    <span className="SubtitleOptionsModal__Subheading">Please wait for server to response...</span>
  </div>

 }

 
  </div>
  );
}

export default SubtitlesAreaNoData;
