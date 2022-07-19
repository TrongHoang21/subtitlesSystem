import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
  import { Link, useParams } from "react-router-dom";
import { selectCurrentUser } from "../../../reduxComponents/userAndProjectSlice";
  import "./EditAdmin.css";
  
  import {NODEJS_SERVER} from '../../../env'
  
  export default function EditAdmin() {
    let { userId } = useParams();
    // console.log('lấy ra đúng id: ', userId); --> this will be rerender many time

    const currentUser = useSelector(selectCurrentUser);

    const [Message, setMessage] = useState('Edit User');

    const [Email, setEmail] = useState("");
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("hidden");
    const [ConfirmPassword, setConfirmPassword] = useState("hidden");
    const [AvaPath, setAvaPath] = useState("https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500");
    const [Role, setRole] = useState("");
  
    const handleChangeUsername = (e) => {
      setUsername(e.target.value)
    }
  
    const handleChangePassword = (e) => {
      setPassword(e.target.value)
    }
  
    const handleChangeConfirmPassword = (e) => {
      setConfirmPassword(e.target.value)
    }
    
    const handleChangeAvaPath = (e) => {
        setAvaPath(e.target.value)
    }
  
    const handleUpdateButton = (e) => {
  
      if(Password === ConfirmPassword){
          let userSubmit = {
            userId: userId,
            email: Email,
            username: Username,
            password: Password,
            avaPath: AvaPath
          }
      
          console.log('submit info: ', userSubmit);
          
      
          if(currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role !== 'user'){
            setMessage('please wait for server to response')
            axios({
              method: 'post',
              url: NODEJS_SERVER + '/admin/updateAdmin/' + currentUser.userInfo.id,
              data: userSubmit,
            })
            .then(response => {
              if(response.data.success){ // Axios responses have a `data` property that contains the HTTP response body.
                console.log(response.data.message);
                setMessage(response.data.message)
        
                
              } else {
                console.log(response.data.message);
                setMessage(response.data.message)
              }
            }).catch((error) => {
                console.log('axios có ERROR: ', error);
            });
          }
          else{
            console.log('handleUpdateButton: No current userinfo');
            setMessage('handleUpdateButton: No current userinfo')
          }
        }
        else{
          setMessage('Confirm password does not match')
        }
      }

    useEffect(() => {
      
      if(currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role !== 'user'){
        axios({
          method: 'get',
          url: NODEJS_SERVER + '/admin/getAdminById/' + currentUser.userInfo.id + "_" + userId
        })
        .then(response => {
          if(response.data.success){
    
            console.log('lay ve admin: ',response.data.adminInfo);
            let user = response.data.adminInfo
            setEmail(user.email)
            setUsername(user.username)
            setAvaPath(user.avaPath)
            setRole(user.role)
            setMessage(response.data.message)
            

            
          } else {
            console.log("get admin failed roi bro!")
          }
        }) 
      }
      else{
        console.log('useEffect: No current userinfo');
        setMessage('useEffect: No current userinfo')
      }
  }, [userId, currentUser]);


    return (
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Edit Admin</h1>
          <Link to="/dev_AdminMainPage/dev_AdminManagement">
            <button className="userAddButton">Back to Admin list</button>
          </Link>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <img
                src={AvaPath}
                alt=""
                className="userShowImg"
              />
              <div className="userShowTopTitle">
                <span className="userShowUsername">{Username}</span>
                <span className="userShowUserTitle">Role: {Role}</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Account Details</span>
              <div className="userShowInfo">
                <PermIdentityIcon className="userShowIcon" />
                <span className="userShowInfoTitle">Email: {Email}</span>
              </div>
              <div className="userShowInfo">
                <CalendarTodayIcon className="userShowIcon" />
                <span className="userShowInfoTitle">10.12.1999</span>
              </div>
              <span className="userShowTitle">Contact Details</span>
              <div className="userShowInfo">
                <PhoneAndroidIcon className="userShowIcon" />
                <span className="userShowInfoTitle">+1 123 456 67</span>
              </div>
              <div className="userShowInfo">
                <LocationSearchingIcon className="userShowIcon" />
                <span className="userShowInfoTitle">Ho Chi Minh City | Vietnam</span>
              </div>
            </div>
          </div>
          <div className="userUpdate">
            <span className="userUpdateTitle">{Message}</span>
            <div className="userUpdateForm">
            <div className="userUpdateLeft">
     

    
                <div className="userUpdateItem">
                  <label>Username</label>
                  <input
                    onChange={handleChangeUsername}
                    id="username"
                    placeholder="Enter your name here"
                    type="text"
                    name="username"
                    className="userUpdateInput"
                    value={Username}
                  />
                </div>
               
                <div className="userUpdateItem">
                  <label>Avatar Path</label>
                  <input
                    onChange={handleChangeAvaPath}
                    placeholder="Enter your password here"
                    type="text"
                    className="userUpdateInput"
                    value={AvaPath}
                  />
                </div>

                <div className="userUpdateItem">
                  <label>Password</label>
                  <input
                    onChange={handleChangePassword}
                    id="password"
                    placeholder="Enter your password here"
                    type="password"
                    name="password"
                    className="userUpdateInput"
                    value={Password}
                  />
                </div>

                <div className="userUpdateItem">
                  <label>Confirm password</label>
                  <input
                    onChange={handleChangeConfirmPassword}
                    id="confirmPassword"
                    placeholder="Reconfirm your password here"
                    type="password"
                    name="confirmPassword"
                    className="userUpdateInput"
                    value={ConfirmPassword}
                  />
                </div>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <img
                    className="userUpdateImg"
                    src={AvaPath}
                    alt=""
                  />
 

                </div>
                <button className="userUpdateButton" onClick={handleUpdateButton}>Update</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  