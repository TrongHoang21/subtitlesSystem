import React, {useEffect, useState} from "react";
import '../../styles/User-WorkspacePage.css'
import {useDispatch, useSelector} from 'react-redux'
import {selectCurrentUser, setCurrentProject, resetCurrentProject, resetCurrentUser} from '../../../reduxComponents/userAndProjectSlice'
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function WorkspacePage() {
  const pageRouter = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [ProjectList, setProjectList] = useState([]);
  const [PricingInfo, setPricingInfo] = useState('');
  const [IsDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);

  //UseEffect to avoid memory leak when async task but unmounted
  useEffect(() => {
    setIsSubscribed(true);
    return () => setIsSubscribed(false);
  }, []);
  
  const dispatch = useDispatch();

  const handleChange = () => {

  }

  const handleProjectClick = (projectId) => {

    const chosenItem = ProjectList.find(element => element.id === projectId)
    dispatch(setCurrentProject({
      currentProject: chosenItem
    }))

    //redirect
    

    if(chosenItem.status === "Rendered"){
      pageRouter('/ResultPage')
    }
    else{
      pageRouter('/EditPage')
    }

  }

  const handleCreateNewProject = () => {
    //Kiem tra xem co userId
    // console.log(currentUser.userInfo.id);

    if(currentUser.userInfo && currentUser.userInfo.id){
      //request len
      axios({
        method: 'post',
        url: NODEJS_SERVER + '/createNewProject',
        data: currentUser
      })
      .then(response => {
        if(response.data.success && isSubscribed){
  
          console.log('lay ve project ', response.data);

          //add kqtra ve vao redux currentUser (prj list se duoc useEffect cap nhat tu dong, khong can update giao dien ngay, vi qua editpage r)
          dispatch(setCurrentProject({
            currentProject: response.data.newProject
          }))

          //redirect sang editpage luon
          pageRouter('/EditPage')
          
        } else {
          console.log("project create new failed roi bro!")
        }
      }) 

    }

  }
  
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
        dispatch(resetCurrentUser())  //useEffect will turn to login 
        
        //clear localStorage (userId)
        localStorage.removeItem('userId')
        
        //redirect to mainPage
        pageRouter('/')
        
      } else {
        console.log("NODEJS: log out failed")
      }
    }) 
  }
  
  const handleUpgradePlan = () => {
    pageRouter('/dev_pricing')
  }

  //delete Project
  const handleEnableDelete = () => {
    setIsDeleteEnabled(!IsDeleteEnabled)
  }

  const handleDeleteProject = (projectId) => {
    console.log('Xoa project co id: ', projectId);
    
    setProjectList(ProjectList.filter((item) => item.id !== projectId));

    axios({
      method: 'delete',
      url: NODEJS_SERVER + '/deleteProject/' + projectId
    })
    .then(response => {
      if(response.data.success && isSubscribed){

        console.log(response.data.message);
        
      } else {
        console.log(response.data.message)
      }
    }) 



  }
  


  //Check if not login, login + not user -> to admin page
  useEffect(() => {
    if(currentUser.userInfo && (currentUser.userInfo.role !== "user")){
      pageRouter('/dev_login')
    }
    // else if(currentUser.userInfo && (currentUser.userInfo.role === "admin" || currentUser.userInfo.role === "superadmin")){
    //   pageRouter('/dev_AdminMainPage')
    // }
  
  }, [currentUser]);
  

  //project list + pricing info
  useEffect(() => {
    // console.log('useEffect', currentUser);


    if(currentUser.userInfo && currentUser.userInfo.id){
      axios({
        method: 'get',
        url: NODEJS_SERVER + '/getProjectListOnUserId/' + currentUser.userInfo.id //'user001'
      })
      .then(response => {
        if(response.data.success && isSubscribed){
  
          console.log('lay ve project list', response.data.projectList);
          setProjectList(response.data.projectList)
          
        } else {
          console.log("project list failed roi bro!") 
        }
      }) 

      
      axios({
        method: 'get',
        url: NODEJS_SERVER + '/getPricingPlanInfo/' + currentUser.userInfo.id //'user001'
      })
      .then(response => {
        if(response.data.success && isSubscribed){
  
          console.log('lay ve pricing info', response.data.pricingInfo);
          setPricingInfo(response.data.pricingInfo)
          
        } else {
          console.log("pricing plan failed roi bro!: ", response.data.message)
        }
      }) 
      
    
    }

    return () => {
      
    };
  }, [currentUser]);

  //this to avoid user turn back from editpage and create error on click on another project
  useEffect(() => {
    if(currentUser.currentProject && currentUser.currentProject.id){
      dispatch(resetCurrentProject())
    }

  }, []);
  
  
  return (

   <div id="root_userpage">
      <div >
        <main className="app_userpage" data-testid="@main/container">
          <div className="DashboardPage__Container-sc-3yhjw6-0 iHFMtS">

            {/* Sidebar workspace (HIDE) */}
            <div>
            {/*<div className="DashboardPage__Sidebar-sc-3yhjw6-3 ejelvk">
               <div className="DashboardPage__Workspaces-sc-3yhjw6-4 tygxj">
                <section className="WorkspaceSwitcherstyled__Container-sc-19le8g2-0 knjqdc">
                  <a className="WorkspaceSwitcherstyled__StyledNavLink-sc-19le8g2-1 kwoRMJ active" href="/workspaces/b8483ed5-8c96-486a-a4c8-f7cc68916cfa" aria-current="page">
                    <div color="#FF6E6E" className="WorkspaceSwitcherstyled__DefaultWorkspaceIcon-sc-19le8g2-4 hviNjU">
                      <span className="WorkspaceSwitcherstyled__IconLabel-sc-19le8g2-5 jLhSAr">M</span>
                    </div>
                  </a>
                  <a className="WorkspaceSwitcherstyled__StyledNavLink-sc-19le8g2-1 kwoRMJ" href="/workspaces/fca8f1b5-4763-4ecb-a538-6b17ad695ef3">
                    <div color="#FFA26E" className="WorkspaceSwitcherstyled__DefaultWorkspaceIcon-sc-19le8g2-4 hBqLbo">
                      <span className="WorkspaceSwitcherstyled__IconLabel-sc-19le8g2-5 jLhSAr">M</span>
                    </div>
                  </a>
                  <button className="WorkspaceSwitcherstyled__StyledButton-sc-19le8g2-2 liloWO">
                    <div color="#F7F7F8" className="WorkspaceSwitcherstyled__DefaultWorkspaceIcon-sc-19le8g2-4 ipPQWS">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2.5V9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M2.5 6H9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </div>
                  </button>
                </section>
              </div> 
             </div> */}
            </div>


            {/* Container Info */}
            <div className="Sidebarstyled__Container-sc-7ti4rp-0 jJZQwQ">
              <section className="Sidebarstyled__ScrollContainer-sc-7ti4rp-1 VhBLC">
                <h1 className="logo1" style={{fontWeight: 'bold', fontSize: '30px',
                    color: 'rgb(25, 32, 51)', cursor: 'pointer',
                    fontFamily: 'Euclidcirculara webfont, Arial, sans-serif'
                    }}>ORANGESUB</h1>

                {/* <svg width="167" height="31" viewBox="0 0 167 31" fill="none" xmlns="http://www.w3.org/2000/svg" className="Sidebarstyled__Logo">
                  <path d="M19.5939 29.3733H11.7147L0 0.658971H8.92148L15.6751 17.8018L22.3871 0.658971H31.3086L19.5939 29.3733Z" fill="currentColor"></path>
                  <path d="M55.6065 29.3733H33.3862V0.658971H55.4398V7.60183H41.3905V11.8447H54.3142V18.1447H41.3905V22.4304H55.6065V29.3733Z" fill="currentColor"></path>
                  <path d="M81.3366 29.3733H59.1162V0.658971H81.1698V7.60183H67.1205V11.8447H80.0442V18.1447H67.1205V22.4304H81.3366V29.3733Z" fill="currentColor"></path>
                  <path
                    d="M96.6443 0.658971C101.202 0.658971 104.885 1.97326 107.692 4.60183C110.471 7.25897 111.861 10.7304 111.861 15.0161C111.861 19.3018 110.471 22.759 107.692 25.3875C104.885 28.0447 101.202 29.3733 96.6443 29.3733H84.8463V0.658971H96.6443ZM96.0607 22.4304C98.3675 22.4304 100.23 21.7447 101.647 20.3733C103.064 19.0018 103.773 17.2161 103.773 15.0161C103.773 12.8161 103.064 11.0304 101.647 9.65897C100.23 8.28754 98.3675 7.60183 96.0607 7.60183H92.8506V22.4304H96.0607Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M118.39 20.759C119.64 20.759 120.683 21.2018 121.516 22.0875C122.322 22.9733 122.725 24.0161 122.725 25.2161C122.725 26.4733 122.322 27.5161 121.516 28.3447C120.683 29.1733 119.64 29.5875 118.39 29.5875C117.139 29.5875 116.111 29.1733 115.305 28.3447C114.471 27.5161 114.054 26.4733 114.054 25.2161C114.054 24.0161 114.471 22.9733 115.305 22.0875C116.111 21.2018 117.139 20.759 118.39 20.759Z"
                    fill="currentColor"
                  ></path>
                  <path d="M125.68 29.3733V0.658971H133.685V29.3733H125.68Z" fill="currentColor"></path>
                  <path
                    d="M151.95 0.0161133C156.175 0.0161133 159.746 1.45897 162.664 4.34468C165.555 7.25897 167 10.8161 167 15.0161C167 19.2161 165.555 22.759 162.664 25.6447C159.746 28.559 156.175 30.0161 151.95 30.0161C147.726 30.0161 144.168 28.559 141.278 25.6447C138.36 22.759 136.9 19.2161 136.9 15.0161C136.9 10.8161 138.36 7.25897 141.278 4.34468C144.168 1.45897 147.726 0.0161133 151.95 0.0161133ZM151.95 22.6018C153.951 22.6018 155.619 21.8733 156.953 20.4161C158.259 18.9875 158.912 17.1875 158.912 15.0161C158.912 12.8733 158.259 11.0733 156.953 9.61611C155.619 8.15897 153.951 7.4304 151.95 7.4304C149.949 7.4304 148.295 8.15897 146.989 9.61611C145.655 11.0733 144.988 12.8733 144.988 15.0161C144.988 17.1875 145.655 18.9875 146.989 20.4161C148.295 21.8733 149.949 22.6018 151.95 22.6018Z"
                    fill="currentColor"
                  ></path>
                </svg> */}
                <div className="AccountHeaderstyled__Container-sc-yp7xxf-0 flGgtc">
                  <div
                    color="#FF6E6E"
                    className="WorkspaceSwitcherstyled__DefaultWorkspaceIcon-sc-19le8g2-4 AccountHeaderstyled__StyledDefaultWorkspaceIcon-sc-yp7xxf-6 hviNjU kjPFZS"
                    style={{marginBottom: '0px'}}
                  >
                    <span className="WorkspaceSwitcherstyled__IconLabel-sc-19le8g2-5 jLhSAr">M</span>
                  </div>
                  <div className="AccountHeaderstyled__NameContainer-sc-yp7xxf-1 fixgre">
                    <span className="AccountHeaderstyled__PlanName-sc-yp7xxf-2 kqULBI">{PricingInfo.Policy ? PricingInfo.Policy.policyName : "" } Plan</span>
                    <span className="AccountHeaderstyled__WorkspaceName-sc-yp7xxf-3 hEiYAr">My Workspace</span>
                  </div>
                  <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="AccountHeaderstyled__DropDownArrow-sc-yp7xxf-5 kLruDo">
                    <path d="M5.88862 1.42381C5.81446 1.34958 5.72654 1.3125 5.62495 1.3125H0.375028C0.273401 1.3125 0.185544 1.34958 0.111314 1.42381C0.0370842 1.49813 0 1.58598 0 1.68755C0 1.78909 0.0370842 1.87695 0.111314 1.9512L2.73629 4.57617C2.8106 4.6504 2.89845 4.68757 3 4.68757C3.10155 4.68757 3.18948 4.6504 3.26365 4.57617L5.88862 1.95118C5.96277 1.87695 6 1.78909 6 1.68753C6 1.58598 5.96277 1.49813 5.88862 1.42381Z"></path>
                  </svg>
                </div>
                <div className="Sidebarstyled__CreateVideoSidebarButtonStyled-sc-7ti4rp-7 boYwLp">
                  <div className="desktopStyled__OverlayRiser-sc-11u9ifa-0 eqbrbz">
                    <button className="sc-jrQzAO sc-kDTinF fBjQgG jRAXgT" onClick={handleCreateNewProject}>
                      Create New Project
                      <div className="sc-iqseJM jDvcCQ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-bdvvtL PYKWr">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="sc-cxpSdN jAMHOQ"></div>
                {/* improve for billing reports or project listview */}

                {
                  PricingInfo ? 
                  <div>
                  <span className="AccountHeaderstyled__PlanName-sc-yp7xxf-2 kqULBI">{`Storage: ${PricingInfo.used_StorageMB} of ${PricingInfo.Policy.rule_maxStorageMB} MB`}</span>
                  <progress className="AccountHeaderstyled__PlanName-sc-yp7xxf-2 kqULBI" value={PricingInfo.used_StorageMB} max={PricingInfo.Policy.rule_maxStorageMB}/> 

                  <br/>
                  <span className="AccountHeaderstyled__PlanName-sc-yp7xxf-2 kqULBI">{`Auto Subtitles: ${PricingInfo.used_AutoSubMinutes} of ${PricingInfo.Policy.rule_maxAutoSubMinutes} Minutes`}</span>
                  <progress className="AccountHeaderstyled__PlanName-sc-yp7xxf-2 kqULBI" value={PricingInfo.used_AutoSubMinutes} max={PricingInfo.Policy.rule_maxAutoSubMinutes}/> 
 
                  <br/>
                  <span className="AccountHeaderstyled__PlanName-sc-yp7xxf-2 kqULBI">{`Max upload size: ${PricingInfo.Policy.rule_maxUploadFileSizeMB} MB`}</span>


                                   
                  </div>
                  :
                  <div></div>
                }








                {/* <div className="dashboard_part1_manualcss">
                  <div className="RootFolderTilestyled__Container-sc-1ya13ul-0 hOsyUx">
                    <span className="RootFolderTilestyled__FolderName-sc-1ya13ul-2 CKMbd">All Folders</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="RootFolderTilestyled__PlusIcon-sc-1ya13ul-3 eLXJrV">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                  <div className="FolderTilestyled__Container-sc-1i5oqmy-1 fCdWho">
                    <div className="FolderTilestyled__NavLink-sc-1i5oqmy-6 kCFsRt">
                      <div className="FolderTilestyled__FolderNameContainer-sc-1i5oqmy-0 eDMTYr">
                        <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg" className="FolderTilestyled__TypeIcon-sc-1i5oqmy-3 pXCiT">
                          <path
                            d="m14.6663 12.6667c0 .3536-.1404.6927-.3905.9428-.25.25-.5892.3905-.9428.3905h-10.66666c-.35362 0-.69276-.1405-.94281-.3905-.25005-.2501-.39052-.5892-.39052-.9428v-9.33337c0-.35362.14047-.69276.39052-.94281.25005-.25004.58919-.39052.94281-.39052h2.26297c.6687 0 1.29317.3342 1.6641.8906l.44273.6641c.18547.2782.4977.4453.83205.4453h5.46481c.3536 0 .6928.14048.9428.39052.2501.25005.3905.58919.3905.94281z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <label htmlFor="inline-edit--uHQZUFGQcrJUky6moqV2e" className="InlineEdit__Label-sc-2i0ugd-1 jBsfQX">
                          New Folder
                        </label>
                        <input
                          onChange = {handleChange}
                          data-testid="@inline-edit/input"
                          className="InlineEdit__Input-sc-2i0ugd-0 bDZWMA FolderTilestyled__FolderName-sc-1i5oqmy-2 cEDOpE"
                          type="text"
                          id="inline-edit--uHQZUFGQcrJUky6moqV2e"
                          placeholder="New Folder"
                          disabled=""
                          value="New Folder"
                        />
                      </div>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="FolderTilestyled__MenuIcon-sc-1i5oqmy-4 hlPAMr">
                        <circle cx="12.4" cy="5.6" r="1.6" transform="rotate(90 12.4 5.6)" fill="currentColor"></circle>
                        <circle cx="12.4" cy="12" r="1.6" transform="rotate(90 12.4 12)" fill="currentColor"></circle>
                        <circle cx="12.4" cy="18.4" r="1.6" transform="rotate(90 12.4 18.4)" fill="currentColor"></circle>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="FolderTilestyled__Container-sc-1i5oqmy-1 fCdWho">
                  <div className="FolderTilestyled__NavLink-sc-1i5oqmy-6 kCFsRt">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="FolderTilestyled__TypeIcon-sc-1i5oqmy-3 pXCiT">
                      <path
                        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path opacity="0.5" d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="DeleteTilestyled__DeleteName-sc-1vnhv2f-0 jLOJYv">Deleted Projects</span>
                  </div>
                </div> */}
              </section>
              <div className="Sidebarstyled__CTAWrapper-sc-7ti4rp-6 gIZwoA">
                <button className="sc-gGCDDS bYNRNv" onClick={handleUpgradePlan}>
                  <span className="sc-clIzBv cuXbrX">Upgrade Plan</span>
                  <div className="sc-hiwPVj eZFkKO sc-lcepkR evBvrA">
                    <svg width="15" height="15" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-bdvvtL PYKWr sc-ehCJOs bQIAgB">
                      <g filter="url(#zapPrimaryIcon_svg__filter0_i_23447_2603)">
                        <path
                          d="M6.098 6.3h3.019c.424 0 .688.392.473.703l-4.666 6.766c-.283.41-1.022.24-1.022-.236V7.7H.882C.46 7.7.196 7.308.41 6.997L5.075.231c.283-.41 1.023-.24 1.023.236V6.3z"
                          fill="#fff"
                        ></path>
                        <path
                          d="M6.098 6.3h3.019c.424 0 .688.392.473.703l-4.666 6.766c-.283.41-1.022.24-1.022-.236V7.7H.882C.46 7.7.196 7.308.41 6.997L5.075.231c.283-.41 1.023-.24 1.023.236V6.3z"
                          fill="url(#zapPrimaryIcon_svg__paint0_linear_23447_2603)"
                        ></path>
                      </g>
                      <defs>
                        <linearGradient id="zapPrimaryIcon_svg__paint0_linear_23447_2603" x1="4.319" y1="12.783" x2="4.527" y2="0.621" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FFA723" stopOpacity="0.2"></stop>
                          <stop offset="1" stopColor="#FFA723" stopOpacity="0.2"></stop>
                        </linearGradient>
                        <filter
                          id="zapPrimaryIcon_svg__filter0_i_23447_2603"
                          x="0.333"
                          y="0"
                          width="9.333"
                          height="14"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                          <feOffset dy="1"></feOffset>
                          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"></feColorMatrix>
                          <feBlend in2="shape" result="effect1_innerShadow_23447_2603"></feBlend>
                        </filter>
                      </defs>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Dashboard */}
            <div className="DashboardPage__ContentContainer-sc-3yhjw6-1">
              <div className="DashboardPage__Content-sc-3yhjw6-2 fOUaWG">
                <div height="100%" className="manualcss_part2">
                  <div className="ProjectsPage__Container-sc-qkak3d-0">
                    <div className="ProjectsPagestyled__Header-sc-1ansn4h-0 dDefer">
                      <div className="Breadcrumbsstyled__Container-sc-1722o6r-0 ccVLro">
                        <a className="Breadcrumbsstyled__NavLink-sc-1722o6r-1 gbZLyq" href="">
                          Home
                        </a>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="Breadcrumbsstyled__Separator-sc-1722o6r-2 DNkSi">
                          <path d="M10.2852 16.2863L14.5709 12.0006L10.2852 7.71484" stroke="#192033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </div>
                      <div className="ProjectsPagestyled__ActionContainer-sc-1ansn4h-1 bkwRXN">

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


                        <div className="ProjectsPagestyled__MagicBellWrapper-sc-1ansn4h-2 intcmR">
                          <div>
                            <div aria-expanded="false">
                              <a role="button" aria-label="Notifications" data-testid="bell" data-magicbell-bell="true" className="css-ujd0de">
                                <div className="css-l12v88">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.89" clipPath="url(#clip0_1258_4060)">
                                      <path
                                        d="M11.9211 4.11328C15.6799 4.11328 18.727 7.1604 18.727 10.9192V16.452C18.727 17.0279 19.1939 17.4949 19.7699 17.4949C19.8098 17.4949 19.8421 17.5272 19.8421 17.5671V18.1676C19.8421 18.5391 19.5409 18.8403 19.1694 18.8403H4.6727C4.30118 18.8403 4 18.5391 4 18.1676V17.5671C4 17.5272 4.03234 17.4949 4.07224 17.4949C4.64824 17.4949 5.11513 17.0279 5.11513 16.452V10.9192C5.11513 7.16039 8.16225 4.11328 11.9211 4.11328Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      ></path>
                                      <path
                                        d="M8.38672 19.2852V19.2852C8.38672 21.4398 10.1334 23.1866 12.2881 23.1866V23.1866C14.4428 23.1866 16.1895 21.4398 16.1895 19.2852V19.2852"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      ></path>
                                      <path
                                        d="M14.1504 4.23047V4.23047C14.1504 2.99873 13.1519 2.00021 11.9201 2.00021V2.00021C10.6884 2.00021 9.68986 2.99873 9.68986 4.23047V4.23047"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      ></path>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_1258_4060">
                                        <rect width="24" height="24" fill="currentColor"></rect>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ProjectsPage__Content-sc-qkak3d-1 iKwHiV">
                      <div className="ProjectsToolbarstyled__Container-sc-1gqabj-0 GTgZH">
                        <div className="ProjectsSearch__SearchWrapper-sc-1oxbyjl-0 mqsTu">
                          <button aria-label="Search" className="sc-furwcr fZVnoR ProjectsSearch__StyledClickableIcon-sc-1oxbyjl-2 gzQfug" type="button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            <span className="ProjectsSearch__SearchText-sc-1oxbyjl-4 gePgoq">Search Projects...</span>
                          </button>
                        </div>

                      <>
                      {
                        IsDeleteEnabled

                        ?
     
                        <CloseIcon
                        className="DeleteButton_Cancel"
                        onClick={(e) => handleEnableDelete()}
                      />

                        :

                        <DeleteOutlineIcon
                        className="DeleteButton_Enable"
                        onClick={(e) => handleEnableDelete()}
                      />
                      }
                      </>
            


                        <div className="SortBy__SortByWrapper-sc-hnhqkb-2 cUoTsM">
                          <button className="Button__ResetButton-sc-pgw80u-0 InlineDropdown__Root-sc-thr1jl-0 bHWzHe YRVte SortBy__StyledInlineDropdown-sc-hnhqkb-1 juBCDV">
                            <div className="InlineDropdown__NormalWrapper-sc-thr1jl-1 hGSSa-D">
                              <span className="InlineDropdown__NormalLabel-sc-thr1jl-2 kQKuMB">Sort By</span>
                              <span className="InlineDropdown__NormalSelectedLabel-sc-thr1jl-3 jnlhbD">Date Created</span>
                              <svg width="16" height="6" viewBox="0 0 6 6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="InlineDropdown__Icon-sc-thr1jl-5 lbsccz">
                                <path d="M5.88862 1.42381C5.81446 1.34958 5.72654 1.3125 5.62495 1.3125H0.375028C0.273401 1.3125 0.185544 1.34958 0.111314 1.42381C0.0370842 1.49813 0 1.58598 0 1.68755C0 1.78909 0.0370842 1.87695 0.111314 1.9512L2.73629 4.57617C2.8106 4.6504 2.89845 4.68757 3 4.68757C3.10155 4.68757 3.18948 4.6504 3.26365 4.57617L5.88862 1.95118C5.96277 1.87695 6 1.78909 6 1.68753C6 1.58598 5.96277 1.49813 5.88862 1.42381Z"></path>
                              </svg>
                            </div>
                          </button>
                        </div>

                
                      </div>

                      {/* Projects */}
                      <section className="Projectsstyled__GridView-sc-1n6z59b-0 gHdfCc">              
                      {
                          ProjectList && ProjectList.map((item, index) => (
                            <div key={index}>
                              <div className="sharedTileStyled__TileContainer-sc-1di0vkm-0 sharedTileStyled__GridTileContainer-sc-1di0vkm-1 bDVQzV hCTnZF">
    
                                <div className="ProjectTilestyled__Thumbnail-sc-12bytdr-0 kXzXyC" onClick={(e) => handleProjectClick(item.id)}>
                                
                                    { item.videoUrl ?
                                      <video src={item.videoUrl} muted loading="lazy" style={{maxHeight:'160px'}} width='100%' height='100%' />
                                      : <img alt="" width='100%' height='100%' style={{maxHeight:'160px'}} src='https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Patrick_Star.svg/1200px-Patrick_Star.svg.png'></img>
                                  }                            
                  
                                </div>

                                  {
                                    IsDeleteEnabled &&
                                    <div className="DeleteOverlay" onClick={(e) => handleDeleteProject(item.id)}>
                                    <DeleteForeverIcon className="DeleteOverlay_Item" sx={{ fontSize: 30}}/>
                                    </div>
                                  }

               

                                
                          
    
                                <div className="sharedTileStyled__TileFooter-sc-1di0vkm-3 ProjectTilestyled__ProjectTileFooter-sc-12bytdr-2 hEAfoW iYNvKZ">
                                  <label className="InlineEdit__Label-sc-2i0ugd-1 jBsfQX">
                                    Project Name
                                  </label>
                                  <input
                                    onChange = {handleChange}
                                    data-testid="@inline-edit/input"
                                    className="InlineEdit__Input-sc-2i0ugd-0 bDZWMA sharedTileStyled__TileItemName-sc-1di0vkm-6 ProjectTilestyled__ProjectTileName-sc-12bytdr-4 cVtyiq gGUDJh"
                                    type="text"
                                    id="inline-edit--sonw7h5GH7N2BZ5LQc6Rq"
                                    placeholder="Project Name"
                                  value={item.projectName}
                                  />
                                  <span className="ProjectTilestyled__ProjectTileStatus-sc-12bytdr-5 hYlLHT">{item.status}</span>
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    data-testid="project-tile-hamburger-menu"
                                    className="sharedTileStyled__TileMenuDots-sc-1di0vkm-5 jrMZdU"
                                  >
                                    <ellipse cx="3.73366" cy="7.73268" rx="1.06667" ry="1.06667" fill="currentColor"></ellipse>
                                    <ellipse cx="8.00026" cy="7.73268" rx="1.06667" ry="1.06667" fill="currentColor"></ellipse>
                                    <ellipse cx="12.2669" cy="7.73268" rx="1.06667" ry="1.06667" fill="currentColor"></ellipse>
                                  </svg>
                                  <span className="sharedTileStyled__ProjectItemDate-sc-1di0vkm-8 ProjectTilestyled__ProjectEditDate-sc-12bytdr-6 hqmxmo hUfMSC">{item.lastEdit}</span>
                                </div>
                              </div>
                          </div>
                          ))
                        
                      }
                    
                        
                        {/* <div>
                          <div data-testid="project-tile" className="sharedTileStyled__TileContainer-sc-1di0vkm-0 sharedTileStyled__GridTileContainer-sc-1di0vkm-1 bDVQzV hCTnZF">
                            <div className="ProjectTilestyled__FallbackThumbnail-sc-12bytdr-1 ixSzuV"></div>
                            <div className="sharedTileStyled__TileFooter-sc-1di0vkm-3 ProjectTilestyled__ProjectTileFooter-sc-12bytdr-2 hEAfoW iYNvKZ">
                              <label htmlFor="inline-edit--K0Jd9ooBdCZ3aNXDkrbky" className="InlineEdit__Label-sc-2i0ugd-1 jBsfQX">
                                Project Name
                              </label>
                              <input
                                onChange = {handleChange}
                                data-testid="@inline-edit/input"
                                className="InlineEdit__Input-sc-2i0ugd-0 bDZWMA sharedTileStyled__TileItemName-sc-1di0vkm-6 ProjectTilestyled__ProjectTileName-sc-12bytdr-4 cVtyiq gGUDJh"
                                type="text"
                                id="inline-edit--K0Jd9ooBdCZ3aNXDkrbky"
                                placeholder="Project Name"
                                value="Untitled Project"
                              />
                              <span className="ProjectTilestyled__ProjectTileStatus-sc-12bytdr-5 lmLoLY">Draft</span>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                data-testid="project-tile-hamburger-menu"
                                className="sharedTileStyled__TileMenuDots-sc-1di0vkm-5 jrMZdU"
                              >
                                <ellipse cx="3.73366" cy="7.73268" rx="1.06667" ry="1.06667" fill="currentColor"></ellipse>
                                <ellipse cx="8.00026" cy="7.73268" rx="1.06667" ry="1.06667" fill="currentColor"></ellipse>
                                <ellipse cx="12.2669" cy="7.73268" rx="1.06667" ry="1.06667" fill="currentColor"></ellipse>
                              </svg>
                              <span className="sharedTileStyled__ProjectItemDate-sc-1di0vkm-8 ProjectTilestyled__ProjectEditDate-sc-12bytdr-6 hqmxmo hUfMSC">about 1 month ago</span>
                            </div>
                          </div>
                        </div> */}

      

                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div style={{position: 'fixed', zIndex: '9999', inset: '16px', pointerEvents: 'none'}}></div>
     
    
      <div className="crisp-client">
        <div className="cc-l3zb">
          <div className="cc-lcor">
            <style type="text/css">.crisp-client .cc-kv6t .cc-6zjc,</style>
          </div>
          <div className="cc-1kny">
            <style type="text/css"></style>
          </div>
        </div>
        <div
          id="crisp-chatbox"
          lang="vi"
          dir="ltr"
          translate="no"
          data-blocked="false"
          data-lock-maximized="false"
          data-last-operator-face="false"
          data-availability-tooltip="false"
          data-hide-vacation="false"
          data-hide-on-away="false"
          data-hide-on-mobile="false"
          data-position-reverse="false"
          data-full-view="false"
          data-small-view="false"
          data-large-view="true"
          data-availability="online"
          data-is-activity-ongoing="false"
          data-was-availability-online="true"
          data-has-local-messages="false"
          className="cc-kv6t"
        >
          <div className="cc-1xry cc-1gmp">
            <a data-maximized="false" data-is-failure="false" role="button" className="cc-unoo" data-cshid="9a7abfd0-3016-677d-9aa0-e861994d7267">
              <span className="cc-1c9v">
                <span data-id="general_entice" data-with-helpdesk="true" data-is-concealed="false" className="cc-1bue">
                  <span className="cc-1bcp">
                    <span className="cc-1s28 cc-kgeu">
                      <span className="cc-tkyh">
                        <span className="cc-1t9t">
                          <span className="cc-g0ak cc-hy0f"></span>
                          <span data-has-avatar="true" className="cc-xc93">
                            <span className="cc-17df">
                              <span className="cc-od26 cc-151q">Bạn có câu hỏi? Hãy trò chuyện với tôi!</span>
                              <span data-id="online" className="cc-1rau cc-kgeu">
                                Nhóm của chúng tôi đang trực tuyến.
                              </span>
                              <span data-id="away" className="cc-1rau cc-kgeu">
                                Nhóm của chúng tôi là đi.
                              </span>
                            </span>
                            <span className="cc-56dg">
                              <span className="cc-8exe cc-he6y">
                                <span
                                  style={{backgroundImage: `url('https://image.crisp.chat/process/thumbnail/?url=https%3A%2F%2Fstorage.crisp.chat%2Fusers%2Favatar%2Foperator%2Fb4a24903cece9000%2Funtitled-design_1adyhkl.jpg&amp;width=240&amp;height=240&amp;1649076262819') !important`}}
                                  className="cc-1h5w cc-wsm4"
                                ></span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                      <span data-when="online" className="cc-rzi5">
                        <span className="cc-1yk0 cc-183m">
                          <span className="cc-1viy">
                            <span className="cc-16up cc-jq4y cc-151q">Trò chuyện với đội tư vấn của chúng tôi</span>
                          </span>
                        </span>
                      </span>
                      <span data-when="away" className="cc-rzi5">
                        <span data-pop="spotlight" className="cc-1yk0 cc-183m">
                          <span className="cc-1viy">
                            <span className="cc-16up cc-jq4y cc-151q">Trung tâm trợ giúp</span>
                          </span>
                        </span>
                        <span className="cc-1yk0 cc-183m">
                          <span className="cc-1viy">
                            <span className="cc-16up cc-151q">Trò chuyện</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
              <span className="cc-7doi cc-1ada">
                <span data-id="chat_closed" className="cc-1iv2">
                  <span className="cc-1yxw">
                    <span className="cc-16qx cc-1eqr"></span>
                  </span>
                  <span data-is-ongoing="false" className="cc-15mo"></span>
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div>
          <div className="rc-tooltip rc-tooltip-placement-right  rc-tooltip-hidden" style={{left: '-931px', top: '-976px'}}>
            <div className="rc-tooltip-content">
              <div className="rc-tooltip-arrow"></div>
              <div className="rc-tooltip-inner" role="tooltip">
                <span>My Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div>
          <div className="rc-tooltip rc-tooltip-placement-right  rc-tooltip-hidden" style={{left: '-931px', top: '-816px'}}>
            <div className="rc-tooltip-content">
              <div className="rc-tooltip-arrow"></div>
              <div className="rc-tooltip-inner" role="tooltip">
                <span>Create a new workspace</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: '0px', left: '0px', width: '100%'}}>
        <div>
          <div className="rc-tooltip rc-tooltip-placement-right  rc-tooltip-hidden" style={{left: '-931px', top: '-896px'}}>
            <div className="rc-tooltip-content">
              <div className="rc-tooltip-arrow"></div>
              <div className="rc-tooltip-inner" role="tooltip">
                <span>My Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}

export default WorkspacePage;
