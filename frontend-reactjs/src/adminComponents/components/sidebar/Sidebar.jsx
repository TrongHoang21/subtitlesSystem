import "./sidebar.css";



import LineStyleIcon from '@mui/icons-material/LineStyle';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ReportIcon from '@mui/icons-material/Report';

import { Link } from "react-router-dom";
import { selectCurrentUser } from "../../../reduxComponents/userAndProjectSlice";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const currentUser = useSelector(selectCurrentUser);



  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/dev_adminMainPage" className="link">
            <li className="sidebarListItem">
              <LineStyleIcon className="sidebarIcon" />
              Home
            </li>
            </Link>
            <li className="sidebarListItem">
              <TimelineIcon className="sidebarIcon" />
              Analytics
            </li>
            <li className="sidebarListItem">
              <TrendingUpIcon className="sidebarIcon" />
              Sales
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Administration</h3>
          <ul className="sidebarList">
 

            {/* TrongHoang code */}
            <Link to="dev_UserManagement" className="link">
              <li className="sidebarListItem">
              <PermIdentityIcon className="sidebarIcon" />
                User Management
              </li>
            </Link>

            <Link to="dev_PolicyView" className="link">
              <li className="sidebarListItem">
              <StorefrontIcon className="sidebarIcon" />
                Policy View
              </li>
            </Link>

            <Link to="dev_UPRManagement" className="link">
              <li className="sidebarListItem">
              <AttachMoneyIcon className="sidebarIcon" />
                User Policy Registrations
              </li>
            </Link>

            <Link to="dev_ProjectManagement" className="link">
              <li className="sidebarListItem">
              <WorkOutlineIcon className="sidebarIcon" />
                Project Management
              </li>
            </Link>
            


          </ul>
        </div>

        {
          currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role === 'superadmin' ?

          <div className="sidebarMenu">
          <h3 className="sidebarTitle">Super Admin Area</h3>
          <ul className="sidebarList">

            <Link to="dev_AdminManagement" className="link">
              <li className="sidebarListItem">
              <DynamicFeedIcon className="sidebarIcon" />
                Admin Management
              </li>
            </Link>

            <Link to="dev_PolicyManagement" className="link">
              <li className="sidebarListItem">
              <StorefrontIcon className="sidebarIcon" />
                Policy Management
              </li>
            </Link>

          </ul> 
        </div> : <p className="sidebarTitle"> Super Admin Area Locked </p>
        }
        
        


        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <WorkOutlineIcon className="sidebarIcon" />
              Manage
            </li>
            <li className="sidebarListItem">
              <TimelineIcon className="sidebarIcon" />
              Analytics
            </li>
            <li className="sidebarListItem">
              <ReportIcon className="sidebarIcon" />
              ReportIcons
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
