import React, {useEffect, useRef, useState} from "react";
import '../../styles/Exporter-ResultPage.css'
import '../../styles/Exporter-ResultPage_finish.css'
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";
import '../../styles/Exporter-ExportDrawer.css'
import {selectCurrentUser, setExportVideoUrl, resetCurrentUser, setUserInfo} from '../../../reduxComponents/userAndProjectSlice'
import {useDispatch, useSelector} from 'react-redux'
import ExportThumbnailPreview from "./ExportThumbnailPreview";
import ExportVideoResult from "./ExportVideoResult";
import AutoSave from "../utilsComponents/AutoSave";
import { Link, useNavigate } from "react-router-dom";
import { hide, selectLoadingStatus, setAll } from "../../../reduxComponents/loadingStatusSlice";
import { ClipLoader } from "react-spinners";
import { Button } from "@mui/material";

function ResultPage() {
  const currentUser = useSelector(selectCurrentUser);
  const loadingStatus = useSelector(selectLoadingStatus)
  const dispatch = useDispatch();
  const downloadButton = useRef()
  const [resultVideoSrc, setResultVideoSrc] = useState(null)
  const [AllowBackToWorkspace, setAllowBackToWorkspace] = useState(false);
  const pageRouter = useNavigate();
  
  const [isSubscribed, setIsSubscribed] = useState(true);
  //UseEffect to avoid memory leak when async task but unmounted
  useEffect(() => {
    setIsSubscribed(true);
    return () => setIsSubscribed(false);
  }, []);

  const handleLogOut = () => {
    console.log('Log out click, reset currentUser');


    //Các trạng thái của editpage, editpage đã reset khi vào editpage
    //workspace có useState projectList được cập nhật theo useEffect ngay từ lúc vào workspace. nên không cần reset

    //gửi request lên server báo, sau này implement JWT
    axios({
      method: 'post',
      url: NODEJS_SERVER + '/logout',
      data: currentUser
    })
    .then(response => {
      if(response.data.success){

        console.log('NODEJS: log out success');

        console.log('currentUser cleared');
        dispatch(resetCurrentUser())
        
        //clear localStorage (userId)
        localStorage.removeItem('userId')

        //redirect to mainPage
        pageRouter('/')
        
      } else {
        console.log("NODEJS: log out failed")
      }
    }) 
  }

  //CSR session (localStorage)
  useEffect(() => {
    let userId = localStorage.getItem('userId')
    
    if(userId && (currentUser.currentProject && currentUser.currentProject.status !== 'Rendered')){

      //get login infor
      axios({
        url: NODEJS_SERVER + '/login/' + userId,
        method: 'get',
      })
      .then(response => {
        if(response.data.success && isSubscribed){
          console.log('get login', response.data.userInfo);
          
          //set to current user
          dispatch(setUserInfo({
            userInfo: response.data.userInfo
          }))

          //redirect to workspace
          // pageRouter('/dev_workspacePage')
        }
        else{
          pageRouter('/dev_login')
        }
      })

    } 
  }, []);

    //Check if not login, login
  useEffect(() => {

    if(currentUser.userInfo && currentUser.userInfo.username !== ""){
      if(!currentUser.currentProject.id){
        pageRouter('/dev_login')
      }
    }
    else if(currentUser.userInfo && currentUser.userInfo.username){
      if(!currentUser.currentProject.id || currentUser.userInfo.role !== 'user'){
        pageRouter('/dev_login')
      }
    }

    //Reset redux
    dispatch(hide())
    
  }, [currentUser]);

  useEffect(() => {
    downloadButton.current.disabled = true
    console.log('effect user đc gọi', currentUser)


    if(!resultVideoSrc){  //is null

      if(currentUser.currentProject &&  currentUser.currentProject.id){
        if( currentUser.currentProject.exportVideoUrl === '' ){

            console.log('Request for export in use effect sent')
            dispatch(setAll({
              isLoading: true,
              loadingMessage: 'We are rendering your video'
            }))
            
            axios({
              method: 'post',
              url: NODEJS_SERVER + '/export',
              data: currentUser,
            })
            .then(response => {
              if(response.data.success && isSubscribed){
                console.log('message: ', response.data)
                dispatch(hide())
      
                //for display -> trigger 1 render
                setResultVideoSrc(response.data.exportVideoUrl)
      
                //currentUser set -> trigger 1 render
                dispatch(setExportVideoUrl({
                  exportVideoUrl: response.data.exportVideoUrl,
                  exportVideoName: response.data.exportVideoName,
                  status: response.data.status,
                }))
      
              } else {
                console.log("exportPage: " + response.data.message)
                dispatch(setAll({
                  loadingMessage: "exportPage: " + response.data.message
                }))

              }

              
              //cho phép người dùng về trang workspace bằng nút bấm
              setAllowBackToWorkspace(true);
            })
  
        }
        else{
          console.log("exportUrl already exists")
          setResultVideoSrc(currentUser.currentProject.exportVideoUrl)
          setAllowBackToWorkspace(true);
        }
      }
    }

  }, [currentUser, resultVideoSrc]);






  return (
    <div className="VideoViewPagestyled__VideoViewPageWrapper-sc-1ubtiml-0 cEWXaV">
      <AutoSave flagSaveSub={false} flagHidden={true} delayTime={1000}/>
      <div className="VideoViewPagestyled__MainContainer-sc-1ubtiml-1 ituVHX">
        <section data-testid="header" className="HeaderControlsstyled__HeaderControlsContainer-sc-1rnmot5-0 fgiJpb">
          <div className="HeaderControlsstyled__LeftWrapper-sc-1rnmot5-9 khVaZr">



            <h1 className="logo1" style={{fontWeight: 'bold', fontSize: '30px',
                    color: 'rgb(25, 32, 51)', cursor: 'pointer',
                    fontFamily: 'Euclidcirculara webfont, Arial, sans-serif'
                    }}>ORANGESUB</h1>


            {/* <div className="HeaderControlsstyled__BreadcrumbWrapper-sc-1rnmot5-12 dAXA-Dp">
              <span title="sample5_5p" className="HeaderControlsstyled__ProjectName-sc-1rnmot5-5 bqgdir">
                sample5_5p
              </span>
            </div> */}
          </div>
          <div className="HeaderControlsstyled__RightWrapper-sc-1rnmot5-10 kuWnDv">

          {
            loadingStatus && loadingStatus.isLoading 
            ?

            <div>
              <span className="InviteBar__InviteButton-sc-xgawj2-1 dOgnW">Do not refresh this page while processing ...</span>

            </div>

            :

            <>
            {
              currentUser.userInfo && currentUser.userInfo.id ?
        
              <div className="InviteBar__InviteBarContainer-sc-xgawj2-0 jpjfiA">
                <button style={{backgroundColor:'transparent', border:'none'}} onClick={handleLogOut}>
                  <span className="InviteBar__InviteButton-sc-xgawj2-1 dOgnW">Log out</span>
                </button>
                

                <div className="InviteBar__AvatarContainer-sc-xgawj2-2 fDnhXJ">

                  <img
                    src={currentUser.userInfo && (currentUser.userInfo.avaPath ? currentUser.userInfo.avaPath : "https://lh3.googleusercontent.com/a/AATXAJym5F0Tn72u4RtYs1MTO7CeD0MVfWoijlSr8Jzi=s96-c")}
                    alt=""
                    size="40"
                    className="Avatar__Icon-sc-1yzjx87-0 jXemal"
                  ></img>
                </div>
            </div>
              :
              <div className="AuthButtons__RootWrapper-sc-wos0wr-0 SjOnt">
              <Link style={{ textDecoration: "none"}} to="/dev_login">
                <button aria-label="Log in" className="sc-fFeiMQ eiuSHM AuthButtons__StyledTextButton-sc-wos0wr-1 hZIsEy">
                  Log in
                </button>
                </Link>
              </div>
            }

            </>
            }

          </div>

        </section>

        {/* <!-- VIDEO PART --> */}
        {
          resultVideoSrc ? 
          <ExportVideoResult videoSrc={resultVideoSrc}/> 
          :
          <ExportThumbnailPreview/>
        }
 
      </div>

      {/* <!-- SIDEBAR --> */}
      <div className="AnonymousSidebarStyled__Container-sc-lj3znv-0 gyYPxV">
        
        {
          currentUser.currentProject && currentUser.currentProject.exportVideoUrl ?

          <div className="HeaderStateBarStyled__Container-sc-18ome02-0 kIWcTW">
              <div color="#20E391" className="HeaderStateBarStyled__Gradient-sc-18ome02-1 fNcpeY"></div>
              <svg className="HeaderStateBarStyled__GreenTick-sc-18ome02-3 gxZdBb" viewBox="13.802 0 56.373 56.095" fill="none" xmlns="http:www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="a" x1="42" y1="0" x2="42" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#96FFCD"></stop>
                    <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
                  </linearGradient>
                  <linearGradient id="c" x1="42.0018" y1="5.874" x2="42.0018" y2="50.1258" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#96FFCD"></stop>
                    <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
                  </linearGradient>
                  <linearGradient id="e" x1="42.0018" y1="5.874" x2="42.0018" y2="50.1258" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#77FFBE"></stop>
                    <stop offset=".0001" stopColor="#fff" stopOpacity="0"></stop>
                    <stop offset="1" stopColor="#007A71"></stop>
                  </linearGradient>
                  <linearGradient id="g" x1="43.1366" y1="22.2822" x2="43.1366" y2="33.8221" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff" stopOpacity="0"></stop>
                    <stop offset="1" stopColor="#fff"></stop>
                  </linearGradient>
                  <filter id="b" x="8.8796" y="5.874" width="66.2446" height="68.9935" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="1.7029"></feOffset>
                    <feGaussianBlur stdDeviation=".6812"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0.462745 0 0 0 0 0.301961 0 0 0 0.0196802 0"></feColorMatrix>
                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2573_4868"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="4.0924"></feOffset>
                    <feGaussianBlur stdDeviation="1.6369"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0.462745 0 0 0 0 0.301961 0 0 0 0.0282725 0"></feColorMatrix>
                    <feBlend in2="effect1_dropShadow_2573_4868" result="effect2_dropShadow_2573_4868"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="7.7056"></feOffset>
                    <feGaussianBlur stdDeviation="3.0822"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0.462745 0 0 0 0 0.301961 0 0 0 0.035 0"></feColorMatrix>
                    <feBlend in2="effect2_dropShadow_2573_4868" result="effect3_dropShadow_2573_4868"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="13.7454"></feOffset>
                    <feGaussianBlur stdDeviation="5.4982"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0.462745 0 0 0 0 0.301961 0 0 0 0.0417275 0"></feColorMatrix>
                    <feBlend in2="effect3_dropShadow_2573_4868" result="effect4_dropShadow_2573_4868"></feBlend>
                    <feBlend in="SourceGraphic" in2="effect4_dropShadow_2573_4868" result="shape"></feBlend>
                  </filter>
                  <filter id="d" x="15.5568" y="4.7027" width="52.8903" height="52.8901" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="3.1479"></feOffset>
                    <feGaussianBlur stdDeviation="2.1596"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
                    <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_2573_4868"></feBlend>
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_2573_4868" result="shape"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy=".6296"></feOffset>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                    <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></feColorMatrix>
                    <feBlend in2="shape" result="effect2_innerShadow_2573_4868"></feBlend>
                  </filter>
                  <filter id="f" x=".8442" y="22.2822" width="84.5851" height="89.2848" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="1.1952"></feOffset>
                    <feGaussianBlur stdDeviation=".4781"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0196802 0"></feColorMatrix>
                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2573_4868"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="2.8723"></feOffset>
                    <feGaussianBlur stdDeviation="1.1489"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0282725 0"></feColorMatrix>
                    <feBlend in2="effect1_dropShadow_2573_4868" result="effect2_dropShadow_2573_4868"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="5.4083"></feOffset>
                    <feGaussianBlur stdDeviation="2.1633"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.035 0"></feColorMatrix>
                    <feBlend in2="effect2_dropShadow_2573_4868" result="effect3_dropShadow_2573_4868"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="9.6474"></feOffset>
                    <feGaussianBlur stdDeviation="3.859"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0417275 0"></feColorMatrix>
                    <feBlend in2="effect3_dropShadow_2573_4868" result="effect4_dropShadow_2573_4868"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="18.0444"></feOffset>
                    <feGaussianBlur stdDeviation="7.2178"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0503198 0"></feColorMatrix>
                    <feBlend in2="effect4_dropShadow_2573_4868" result="effect5_dropShadow_2573_4868"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="43.1916"></feOffset>
                    <feGaussianBlur stdDeviation="17.2766"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"></feColorMatrix>
                    <feBlend in2="effect5_dropShadow_2573_4868" result="effect6_dropShadow_2573_4868"></feBlend>
                    <feBlend in="SourceGraphic" in2="effect6_dropShadow_2573_4868" result="shape"></feBlend>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy=".8638"></feOffset>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                    <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></feColorMatrix>
                    <feBlend in2="shape" result="effect7_innerShadow_2573_4868"></feBlend>
                  </filter>
                </defs>
                <circle cx="42" cy="28" r="28" fill="#23ECA4"></circle>
                <circle cx="42" cy="28" r="28" fill="url(#a)" fillOpacity=".3" style={{mixBlendMode: 'screen'}}></circle>
                <g filter="url(#b)">
                  <circle cx="42.0018" cy="27.9999" r="22.1259" fill="#23ECA4"></circle>
                  <circle cx="42.0018" cy="27.9999" r="22.1259" fill="url(#c)" fillOpacity=".3" style={{mixBlendMode: 'screen'}}></circle>
                </g>
                <g filter="url(#d)" strokeWidth="4.32">
                  <circle cx="42.0018" cy="27.9999" r="19.9659" stroke="#77FFBE"></circle>
                  <circle cx="42.0018" cy="27.9999" r="19.9659" stroke="url(#e)" strokeOpacity=".1"></circle>
                </g>
                <g filter="url(#f)">
                  <path
                    d="M42.4038 33.2957c-.7017.7018-1.8404.7018-2.5418 0l-3.9382-3.9383c-.7018-.7014-.7018-1.8401 0-2.5415.7014-.7018 1.84-.7018 2.5418 0l2.3464 2.3461a.455.455 0 0 0 .6421 0l6.3534-6.3535c.7014-.7018 1.8401-.7018 2.5418 0a1.7974 1.7974 0 0 1 0 2.5415l-7.9455 7.9457Z"
                    fill="#A0FFDD"
                  ></path>
                  <path
                    d="M42.4038 33.2957c-.7017.7018-1.8404.7018-2.5418 0l-3.9382-3.9383c-.7018-.7014-.7018-1.8401 0-2.5415.7014-.7018 1.84-.7018 2.5418 0l2.3464 2.3461a.455.455 0 0 0 .6421 0l6.3534-6.3535c.7014-.7018 1.8401-.7018 2.5418 0a1.7974 1.7974 0 0 1 0 2.5415l-7.9455 7.9457Z"
                    fill="url(#g)"
                    fillOpacity=".8"
                  ></path>
                </g>
              </svg>
              <span data-testid="@statebar/Ready" className="HeaderStateBarStyled__Title-sc-18ome02-5 JjQbw">
                Your video is ready
              </span>
            </div>
          
          :

          <div className="HeaderStateBarStyled__Container-sc-18ome02-0 kIWcTW">

        
          {
            loadingStatus && loadingStatus.isLoading 
            &&
            <div>
              <div color="#0098FD" className="HeaderStateBarStyled__Gradient-sc-18ome02-1 ghhoiT"></div>
                <ClipLoader color={'#0098FD'} loading={loadingStatus.isLoading} size={'35px'}/>
                <span data-testid="@statebar/GettingReady" className="HeaderStateBarStyled__Title-sc-18ome02-5 JjQbw">
                  {loadingStatus.loadingMessage ? loadingStatus.loadingMessage : 'We are rendering your video'} 
                </span>
            </div>
            
          }
           {/* <div color="#0098FD" className="HeaderStateBarStyled__Gradient-sc-18ome02-1 ghhoiT"></div>
          <svg className="sc-pVTFL HeaderStateBarStyled__Spinner-sc-18ome02-2 bdwykd glRcGe" height="24" width="24" viewBox="0 0 24 24" data-testid="@design-system/spinner">
            <circle opacity=".25" cx="12" cy="12" r="10.5"></circle>
            <circle cx="12" cy="12" r="10.5" strokeDasharray="32.98672286269283"></circle>
          </svg>
          <span data-testid="@statebar/GettingReady" className="HeaderStateBarStyled__Title-sc-18ome02-5 JjQbw">
            We are rendering your video
          </span>
          <span className="HeaderStateBarStyled__Subtitle-sc-18ome02-6 knpZXm">You can share your video online in the meantime.</span> */}


        </div>
        }
     


        <ul className="ShareLinksStyled__LinksContainer-sc-1of8yx5-0 lkltdJ AnonymousSidebarStyled__ShareLinks-sc-lj3znv-3 jNPJwP">
          <li role="button" aria-label="Copy Link" className="ShareLinksStyled__LinkItem-sc-1of8yx5-1 kDGwEl">
            <div className="ShareLinksStyled__IconContainer-sc-1of8yx5-3 knkmpd">
              <svg
                width="24"
                height="24"
                color="#FF9E0D"
                className="sc-bdvvtL dfyOOG ShareLinksStyled__ItemIcon-sc-1of8yx5-2 YEWNA"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m10.195 4.944.91-.91a3.438 3.438 0 1 1 4.862 4.86l-2.21 2.21a3.439 3.439 0 0 1-4.861 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="m9.807 15.056-.91.91a3.437 3.437 0 1 1-4.862-4.861l2.21-2.21a3.437 3.437 0 0 1 4.861 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <div className="ShareLinksStyled__Itemlabel-sc-1of8yx5-4 hQuQKb"> Copy Link</div>
          </li>
          <li role="button" aria-label="Facebook" className="ShareLinksStyled__LinkItem-sc-1of8yx5-1 kDGwEl">
            <div className="ShareLinksStyled__IconContainer-sc-1of8yx5-3 jRoXud">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                color="#237EEF"
                className="sc-bdvvtL dfyOOG ShareLinksStyled__ItemIcon-sc-1of8yx5-2 fuZgPQ"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 12.069C24 5.409 18.632 0 12 0S0 5.41 0 12.069C0 18.099 4.389 23.095 10.129 24v-8.44H7.082V12.07h3.047V9.413c0-3.03 1.793-4.702 4.536-4.702 1.312 0 2.684.237 2.684.237v2.97H15.84c-1.489 0-1.96.934-1.96 1.889v2.262h3.331l-.529 3.492h-2.791V24C19.61 23.095 24 18.098 24 12.069z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="ShareLinksStyled__Itemlabel-sc-1of8yx5-4 hQuQKb"> Facebook</div>
          </li>
          <li role="button" aria-label="Twitter" className="ShareLinksStyled__LinkItem-sc-1of8yx5-1 kDGwEl">
            <div className="ShareLinksStyled__IconContainer-sc-1of8yx5-3 gzxiPo">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#1FA0F2"
                className="sc-bdvvtL dfyOOG ShareLinksStyled__ItemIcon-sc-1of8yx5-2 iCILIK"
              >
                <path
                  d="M21.626 8.214c0 .214.021.406.021.62 0 6.31-4.813 13.583-13.583 13.583-2.695 0-5.198-.792-7.315-2.14.363.044.748.065 1.133.065 2.246 0 4.3-.77 5.925-2.053a4.795 4.795 0 01-4.47-3.316c.3.064.599.085.898.085.428 0 .856-.064 1.262-.17-2.181-.428-3.829-2.375-3.829-4.685v-.064c.642.363 1.39.577 2.16.599a4.753 4.753 0 01-2.117-3.979c0-.877.236-1.69.642-2.396a13.526 13.526 0 009.84 5.006 4.483 4.483 0 01-.129-1.091 4.774 4.774 0 014.77-4.77c1.37 0 2.61.577 3.487 1.497a9.825 9.825 0 003.037-1.155 4.884 4.884 0 01-2.096 2.652A9.114 9.114 0 0024 5.754a10.37 10.37 0 01-2.374 2.46z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="ShareLinksStyled__Itemlabel-sc-1of8yx5-4 hQuQKb"> Twitter</div>
          </li>
          <li role="button" aria-label="Email" className="ShareLinksStyled__LinkItem-sc-1of8yx5-1 kDGwEl">
            <div className="ShareLinksStyled__IconContainer-sc-1of8yx5-3 bRNfCz">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#FF7434"
                className="sc-bdvvtL dfyOOG ShareLinksStyled__ItemIcon-sc-1of8yx5-2 gIyscI"
              >
                <path
                  d="M20.8 3.2H3.2C1.99 3.2 1 4.19 1 5.4v13.2c0 1.21.99 2.2 2.2 2.2h17.6c1.21 0 2.2-.99 2.2-2.2V5.4c0-1.21-.99-2.2-2.2-2.2zm0 4.4L12 13.1 3.2 7.6V5.4l8.8 5.5 8.8-5.5v2.2z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="ShareLinksStyled__Itemlabel-sc-1of8yx5-4 hQuQKb"> Email</div>
          </li>
          <li role="button" aria-label="More" className="ShareLinksStyled__LinkItem-sc-1of8yx5-1 kDGwEl">
            <div className="ShareLinksStyled__IconContainer-sc-1of8yx5-3 iTEHUR">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#5D647B"
                className="sc-bdvvtL dfyOOG ShareLinksStyled__ItemIcon-sc-1of8yx5-2 jEPXhS"
              >
                <circle cx="5.6" cy="11.6" r="1" stroke="currentColor" fill="currentColor"></circle>
                <circle cx="12" cy="11.6" r="1" stroke="currentColor" fill="currentColor"></circle>
                <circle cx="18.4" cy="11.6" r="1" stroke="currentColor" fill="currentColor"></circle>
              </svg>
            </div>
            <div className="ShareLinksStyled__Itemlabel-sc-1of8yx5-4 hQuQKb"> More</div>
          </li>
        </ul>
        <div className="AnonymousSidebarStyled__SidebarSignUpPrompt-sc-lj3znv-4 dsnqQd">
          <div className="SidebarSignUpPromptStyled__Container-sc-1q77v22-10 ixznAL">

            {/* <div className="SidebarSignUpPromptStyled__CountdownWrapper-sc-1q77v22-9 fuLpkE">
              <div className="CountdownPresenterStyled__CountdownContainer-sc-1b90tq5-7 LycrA">
                <div className="CountdownPresenterStyled__TimePartContainer-sc-1b90tq5-3 CountdownPresenterStyled__HoursContainer-sc-1b90tq5-4 fGvzIc dhIqCP">
                  <div className="CountdownPresenterStyled__TimePartValue-sc-1b90tq5-0 boDJuS">--</div>
                  <div className="CountdownPresenterStyled__TimePartLabel-sc-1b90tq5-1 eYpuSM">Hours</div>
                </div>
                <div className="CountdownPresenterStyled__Separator-sc-1b90tq5-2 bNhWwa"></div>
                <div className="CountdownPresenterStyled__TimePartContainer-sc-1b90tq5-3 CountdownPresenterStyled__MinutesContainer-sc-1b90tq5-5 fGvzIc kmdWwE">
                  <div className="CountdownPresenterStyled__TimePartValue-sc-1b90tq5-0 boDJuS">--</div>
                  <div className="CountdownPresenterStyled__TimePartLabel-sc-1b90tq5-1 eYpuSM">Minutes</div>
                </div>
                <div className="CountdownPresenterStyled__Separator-sc-1b90tq5-2 bNhWwa"></div>
                <div className="CountdownPresenterStyled__TimePartContainer-sc-1b90tq5-3 CountdownPresenterStyled__SecondsContainer-sc-1b90tq5-6 fGvzIc kXnsyR">
                  <div className="CountdownPresenterStyled__TimePartValue-sc-1b90tq5-0 boDJuS">--</div>
                  <div className="CountdownPresenterStyled__TimePartLabel-sc-1b90tq5-1 eYpuSM">Seconds</div>
                </div>
              </div>
            </div> */}

            {
              currentUser.userInfo && currentUser.userInfo.id ?
                <div className="SidebarSignUpPromptStyled__Copy-sc-1q77v22-2 fCaoDy">
                  {
                    AllowBackToWorkspace && <Link to='/dev_WorkspacePage'>
                    <Button className='navbar__button buttonSignUp' variant="outline-success">Back to Workspace</Button>
                  </Link>
                  }

                </div>
              :
              <div className="SidebarSignUpPromptStyled__Copy-sc-1q77v22-2 fCaoDy">
                {
                  AllowBackToWorkspace ? 
  
                  <span className="SidebarSignUpPromptStyled__CopyLine-sc-1q77v22-1 dFsMCc">
                    <span>Your video will be deleted in 24 hours. </span>
                    <span>Log in now to save your video. We will keep this project if it's not exceed your pricing limit</span>
                  </span>

                  :

                  loadingStatus && loadingStatus.isLoading  ?
                  <span className="SidebarSignUpPromptStyled__CopyLine-sc-1q77v22-1 dFsMCc">
                    {/* show nothing */}
                    <span></span>
                  </span>
                  :
                  <span className="SidebarSignUpPromptStyled__CopyLine-sc-1q77v22-1 dFsMCc">
                    <span>There is an error in our server, please turn back later</span>
                  </span>
                }

            </div>
            }


          </div>
        </div>


        <div className="AnonymousSidebarStyled__ResponsiveButtonsContainer-sc-lj3znv-7 bZUFrT">
          <div>
            <button ref={downloadButton} className="sc-jrQzAO sc-kDTinF fBjQgG dZFpgX AnonymousSidebarStyled__DownloadButton-sc-lj3znv-9 rPlxM">
              Download
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sc-bdvvtL PYKWr">
                <path d="M21 17v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          <button className="sc-jrQzAO sc-kDTinF fBjQgG jwoGyr EditVideoButton__StyledCTA-sc-1irgfof-0 fLKXLc AnonymousSidebarStyled__EditVideoButton-sc-lj3znv-8 chbsKn">
            Re-edit video
            <div className="sc-iqseJM jDvcCQ">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="sc-bdvvtL dfyOOG" style={{width: '1rem', height: '1rem'}}>
                <path
                  d="M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </button>
        </div>
        <button className="sc-jrQzAO sc-kDTinF fBjQgG jwoGyr AnonymousSidebarStyled__RemoveWatermark-sc-lj3znv-6 jNkOTm">
          Remove watermark
          <div className="sc-iqseJM jDvcCQ">
            <svg height="16" width="16" color="#FFC369" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.882 10.8001H19.0576C19.7847 10.8001 20.2371 11.4713 19.8694 12.0046L11.8708 23.6033C11.3856 24.3069 10.118 24.0143 10.118 23.1987V13.1999H4.94243C4.21528 13.1999 3.76289 12.5287 4.13063 11.9954L12.1292 0.396745C12.6144 -0.306862 13.882 -0.014325 13.882 0.801265V10.8001Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </button>
        <div className="AnonymousSidebarStyled__FooterReservedWhitespace-sc-lj3znv-1 cXkKYo"></div>
    
      </div>
    </div>
  );
}

export default ResultPage;
