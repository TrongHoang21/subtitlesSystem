import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";

import "./AdminMainPage.css";
import { Route, Routes, Link, useNavigate } from "react-router-dom";

//ADMIN PAGE IMPORTS

import Home from "../home/Home";


// TrongHoang code
import UserManagement from "../dev_UserManagement/UserManagement";
import CreateUser from "../dev_UserManagement/CreateUser";
import EditUser from "../dev_UserManagement/EditUser";

import PolicyManagement from "../dev_PolicyManagement/PolicyManagement";
import UserPolicyRegisManagement from "../dev_UserPolicyRegisManagement/UserPolicyRegisManagement";
import ProjectManagement from "../dev_ProjectManagement/ProjectManagement";
import EditProject from "../dev_ProjectManagement/EditProject";
import CreateProject from "../dev_ProjectManagement/CreateProject";
import AdminManagement from "../dev_AdminManagement/AdminManagement";
import CreateAdmin from "../dev_AdminManagement/CreateAdmin";
import EditAdmin from "../dev_AdminManagement/EditAdmin";
import PolicyView from "../dev_PolicyManagement/PolicyView";
import CreatePolicy from "../dev_PolicyManagement/CreatePolicy";
import EditPolicy from "../dev_PolicyManagement/EditPolicy";
import { selectCurrentUser, setUserInfo } from "../../../reduxComponents/userAndProjectSlice";
import {useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from 'axios'
import { NODEJS_SERVER } from "../../../env";
import { useDispatch } from "react-redux";


function AdminMainPage() {
  const currentUser = useSelector(selectCurrentUser);
  const pageRouter = useNavigate();
  const dispatch = useDispatch();
  
  //UseEffect to avoid memory leak when async task but unmounted
  const [isSubscribed, setIsSubscribed] = useState(true);
  useEffect(() => {
    setIsSubscribed(true);
    return () => setIsSubscribed(false);
  }, []);

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
          if(response.data.success && isSubscribed){
            console.log('get login', response.data.userInfo);
            
            //set to current user
            dispatch(setUserInfo({
              userInfo: response.data.userInfo
            }))


            //
            pageRouter('/dev_AdminMainPage')
          }
          else{
            pageRouter('/dev_login')
          }
        })
  
      } 
    }, []);


  return (
    <div>
      {
        currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role !== 'user' ? <div>
      <Topbar />

      {/* container only will suffer from other css */}
      <div className="container1"> 
        <Sidebar />

        {/* /dev_AdminMainPage/... */}
        <Routes>
          <Route exact path="/" element={<Home />}/>
            
            {/* TrongHoang code */}
          <Route exact path="/dev_UserManagement" element={<UserManagement />} />
          <Route exact path="dev_CreateUser" element={<CreateUser />} />
          <Route exact path="dev_EditUser/:userId" element={<EditUser />} />

          <Route exact path="/dev_PolicyView" element={<PolicyView />} />

          <Route exact path="/dev_UPRManagement" element={<UserPolicyRegisManagement />} />

          <Route exact path="/dev_ProjectManagement" element={<ProjectManagement />} />
          <Route exact path="dev_EditProject/:projectId" element={<EditProject />} />
          <Route exact path="dev_CreateProject" element={<CreateProject />} />


        </Routes>

        {
          currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role === 'superadmin' &&
            <Routes>
            {/* SUPER ADMIN ROUTES */}
          <Route exact path="/dev_AdminManagement" element={<AdminManagement />} />
          <Route exact path="dev_CreateAdmin" element={<CreateAdmin />} />
          <Route exact path="dev_EditAdmin/:userId" element={<EditAdmin />} />

          <Route exact path="/dev_PolicyManagement" element={<PolicyManagement />} />
          <Route exact path="dev_CreatePolicy" element={<CreatePolicy />} />
          <Route exact path="dev_EditPolicy/:policyId" element={<EditPolicy />} />


        </Routes>
        }



      </div>
      </div>
        : <div>
           <h1>Require Login</h1>
           <Link to="/dev_login">
             <button>To login page</button>
           </Link>
        </div>

    
        
      }
   
    </div>
  );
}

export default AdminMainPage;
