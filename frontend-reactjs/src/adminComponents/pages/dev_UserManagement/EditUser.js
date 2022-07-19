
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

import axios from "axios";
import { useEffect, useState } from "react";
  import { Link, useParams } from "react-router-dom";
  import "./EditUser.css";
  
  import {NODEJS_SERVER} from '../../../env'
  
  export default function EditUser() {
    let { userId } = useParams();
    // console.log('lấy ra đúng id: ', userId); --> this will be rerender many time

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

      if(!Username){
        setMessage('please set an Username')
        return
      }
      if(!AvaPath){
        setMessage('please set an AvaPath')
        return
      }
      if(!Password){
        setMessage('please set a Password')
        return
      }

  
      if(Password === ConfirmPassword){
          let userSubmit = {
            userId: userId,
            email: Email,
            username: Username,
            password: Password,
            avaPath: AvaPath
          }
      
          console.log('submit info: ', userSubmit);
          
      
          setMessage('please wait for server to response')
          axios({
            method: 'post',
            url: NODEJS_SERVER + '/admin/updateUser',
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
          setMessage('Confirm password does not match')
        }
      }

    useEffect(() => {

      axios({
        method: 'get',
        url: NODEJS_SERVER + '/admin/getUserById/' + userId
      })
      .then(response => {
        if(response.data.success){
  
          console.log('lay ve user: ',response.data.user);
          let user = response.data.user
          setEmail(user.email)
          setUsername(user.username)
          setAvaPath(user.avaPath)
          setRole(user.role)
          setMessage(response.data.message)

          
        } else {
          console.log("get user failed roi bro!")
        }
      }) 

  }, [userId]);


    return (
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Edit User</h1>
          <Link to="/dev_AdminMainPage/dev_UserManagement">
            <button className="userAddButton">Back to User list</button>
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
  