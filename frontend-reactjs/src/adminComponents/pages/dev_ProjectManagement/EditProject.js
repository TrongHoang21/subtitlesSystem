
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';

import axios from "axios";
import { useEffect, useState } from "react";
  import { Link, useParams } from "react-router-dom";
  import "./EditProject.css";
  
  import {NODEJS_SERVER} from '../../../env'
import { isSRTParsable } from '../../../userComponents/components/utilsComponents/parseSRTtoJSON';
  
  export default function EditProject() {
    let { projectId } = useParams();

    const [Message, setMessage] = useState('Edit Project');

    const [ProjectName, setProjectName] = useState("");
    const [SubData, setSubData] = useState("");
    const [ProjectInfo, setProjectInfo] = useState("hidden");
    const [Status, setStatus] = useState("Render");
    
    
    const handleChangeProjectName = (e) => {
      setProjectName(e.target.value)
    }
  
    const handleChangeSubData = (e) => {
      setSubData(e.target.value)
    }
  
  
    const handleUpdateButton = (e) => {

      if(!isSRTParsable(SubData)){
        setMessage('parse SRT file error')
        return
      }
  
          let projectSubmit = {
            id: projectId,
            projectName: ProjectName,
            subData: SubData,
          }
      
          console.log('submit info: ', projectSubmit);
          
      
          setMessage('please wait for server to response')
          axios({
            method: 'post',
            url: NODEJS_SERVER + '/admin/updateProject',
            data: projectSubmit,
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

    useEffect(() => {
      console.log('lấy ra đúng id: ', projectId);
      axios({
        method: 'get',
        url: NODEJS_SERVER + '/admin/getProjectById/' + projectId
      })
      .then(response => {
        if(response.data.success){
  
          console.log('lay ve project: ',response.data.project);
          setProjectInfo(response.data.project)
          setStatus(response.data.project.status)
          setSubData(response.data.project.subData)
          setProjectName(response.data.project.projectName)

          
        } else {
          console.log("get user failed roi bro!")
        }
      }) 

  }, [projectId]);


    return (
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Edit Project</h1>
          <Link to="/dev_AdminMainPage/dev_ProjectManagement">
            <button className="userAddButton">Back to Project list</button>
          </Link>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <video className="userListImg" src={ProjectInfo.videoUrl} alt="" muted/>
              <div className="userShowTopTitle">
                <span className="userShowUsername">{ProjectName}</span>
                <span className="userShowUserTitle">Status: {Status}</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Belong to user</span>
              <div className="userShowInfo">
                <PhoneAndroidIcon className="userShowIcon" />
                <span className="userShowInfoTitle">UserId: {ProjectInfo.userId} </span>
              </div>

              <span className="userShowTitle">Video Input Details</span>
              <div className="userShowInfo">
                <PhoneAndroidIcon className="userShowIcon" />
                <span className="userShowInfoTitle">Filename: {ProjectInfo.videoStorageName} </span>
              </div>
              <div className="userShowInfo">
                <LocationSearchingIcon className="userShowIcon" />
                <span className="userShowInfoTitle" width='50px'>Storage URI: {ProjectInfo.videoUrl}  </span>
              </div>

              <span className="userShowTitle">Video Output Details</span>
              <div className="userShowInfo">
                <PhoneAndroidIcon className="userShowIcon" />
                <span className="userShowInfoTitle">Filename: {ProjectInfo.exportVideoName}</span>
              </div>
              <div className="userShowInfo">
                <LocationSearchingIcon className="userShowIcon" />
                <span className="userShowVideoLink">Storage URI: {ProjectInfo.exportVideoUrl}</span>
              </div>
            </div>
          </div>
          <div className="userUpdate">
            <span className="userUpdateTitle">{Message}</span>
            <div className="userUpdateForm">
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Project Name</label>
                  <input
                    onChange={handleChangeProjectName}
                    id="ProjectName"
                    placeholder="Enter your Project Name here"
                    name="ProjectName"
                    className="userUpdateInput"
                    value={ProjectName}
                  />
                </div>

  
                <div className="userUpdateItem">
                  <label>Subtitles</label>
                  <textarea 
                    rows="10" cols="30" 
                    onChange={handleChangeSubData}
                    value={SubData}>
                  </textarea>
                
                </div>
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <video className="userUpdateImg" src={ProjectInfo.videoUrl} alt="" muted/>
                </div>
                <button className="userUpdateButton" onClick={handleUpdateButton}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  