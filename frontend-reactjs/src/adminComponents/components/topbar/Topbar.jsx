import React, { useEffect } from "react";
import "./topbar.css";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";
import { resetCurrentUser, selectCurrentUser, setUserInfo } from "../../../reduxComponents/userAndProjectSlice";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const currentUser = useSelector(selectCurrentUser);
  const pageRouter = useNavigate();
  const dispatch = useDispatch()

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
      
      if(userId){
  
        //get login infor
        axios({
          url: NODEJS_SERVER + '/login/' + userId,
          method: 'get',
        })
        .then(response => {
          if(response.data.success){
            console.log('get login', response.data.userInfo);
            
            //set to current user
            dispatch(setUserInfo({
              userInfo: response.data.userInfo
            }))
  
            //redirect to admin page
            pageRouter('/dev_adminMainPage')
          }
          else{
            pageRouter('/dev_login')
          }
        })
  
      } 
    }, []);

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">OrangeSubAdmin</span>
        </div>

        <div className="topRight">
          <div className="InviteBar__InviteBarContainer-sc-xgawj2-0 jpjfiA">
            <button style={{backgroundColor:'transparent', border:'none'}} onClick={handleLogOut}>
              <span className="InviteBar__InviteButton-sc-xgawj2-1 dOgnW">Log out</span>
            </button>
            


            <div className="InviteBar__AvatarContainer-sc-xgawj2-2 fDnhXJ">

              <img
                src={currentUser.userInfo && (currentUser.userInfo.avaPath ? currentUser.userInfo.avaPath : "https://lh3.googleusercontent.com/a/AATXAJym5F0Tn72u4RtYs1MTO7CeD0MVfWoijlSr8Jzi=s96-c")}
                alt=""
                className="topAvatar"
              ></img>
            </div>

            <span>{currentUser.userInfo ? currentUser.userInfo.username : "noname"}</span>
          </div>

          {/* <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <img src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="topAvatar" />
        */}
       
        </div>

      </div>
    </div>
  );
}
