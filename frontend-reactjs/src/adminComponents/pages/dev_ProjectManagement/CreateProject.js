import axios from "axios";
import FormData from "form-data";
import {useState, useEffect } from "react";
import "./CreateProject.css";

import {NODEJS_SERVER} from '../../../env'
import { isSRTParsable } from "../../../userComponents/components/utilsComponents/parseSRTtoJSON";

export default function CreateProject() {

  const [Message, setMessage] = useState('Create New Project');

  const [ProjectName, setProjectName] = useState("");
  const [SubData, setSubData] = useState("");
  const [VideoFile, setVideoFile] = useState('');
  const [SelectedIndex, setSelectedIndex] = useState(0);
  const [AvailableUser, setAvailableUser] = useState(0);
  
 
  const handleProjectName = (e) => {
    setProjectName(e.target.value)
  }

  const handleChangeSubtitlesFile = (e) => {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;

      if(!isSRTParsable(contents)){
        setMessage('parse SRT file error')
        return
      }

      setMessage('parse SRT file done')
      setSubData(contents)
    };
    reader.readAsText(file);

  }

  const handleChangeSubData = (e) => {
    setSubData(e.target.value)
  }

  const handleChangeVideoFile = (e) => {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    console.log('file: ', file);
    console.log('file size MB: ', file.size / 1000 / 1000);
    
    setVideoFile(file)
  }

  const handleChangeSelectedItem = (e) => {
      let index = e.target.value

      if(AvailableUser.length){
        setSelectedIndex(index)

        if(index >= 0){  //not NONE
          console.log('Selected User: ', AvailableUser[index].userId);
        }
        
      }

      
  }


  // Hàm này thực hiện 3 request:
  //   1. gửi thông tin video file lên server NODEJS lấy signurl 
  //-> 2. nhận đc s.url, gửi request upload lên storage 
  //-> 3. up thành công thì gửi req lên NODEJS cộng vào uploadfilesize
  const handleSubmitButton = (e) => {

    if(!AvailableUser.length){
      setMessage('There is no user to process')
      return;
    }
    //Check video file size (NO file or FILE UNDER LIMIT is ok)
    else if(!VideoFile){
      setMessage('project with no video file')
      return
    }else if(!isVideo(VideoFile.name)){
      console.log("not a video file");
      setMessage("Please upload a video file");
      return;

    } else if(!isSRTParsable(SubData)){
      setMessage('parse SRT file error')
      return
    }
    else if(SelectedIndex < 0){
      setMessage('please select a user')
      return
    }

    let currentStorage = AvailableUser[SelectedIndex].used_StorageMB
    let totalUploadFileSize = AvailableUser[SelectedIndex].total_uploadFileSizeMB
    let filesize = Math.ceil(VideoFile.size / 1000000);

      if(AvailableUser[SelectedIndex].Policy){
        console.log('Max size MB:', AvailableUser[SelectedIndex].Policy.rule_maxUploadFileSizeMB);

        if(filesize > AvailableUser[SelectedIndex].Policy.rule_maxUploadFileSizeMB ){
            console.log('Video size MB (When upload will be ceil()):', filesize);
            setMessage('Your file exceeded max upload file size of your plan')
            return;
        }

        if(filesize + currentStorage > AvailableUser[SelectedIndex].Policy.rule_maxUploadFileSizeMB){
          console.log('Video size MB (When upload will be ceil()):', filesize);
          setMessage('Your file exceeded max limitation of your current storage')
          return;
        }
    }
    //end check


    //task to do -> submit info to get sign url (BE save DB info), -> upload to signurl
    let userSubmit = {
      userId: AvailableUser[SelectedIndex].userId,
      recordId: AvailableUser[SelectedIndex].id,
      filename: VideoFile.name,
      new_used_StorageMB: currentStorage + filesize,
      new_total_uploadFileSizeMB: totalUploadFileSize + filesize,
      projectName: ProjectName,
      subData: SubData
    }

    console.log('submit info: ', userSubmit);
    

    setMessage('please wait for server to response')
    axios({
      method: 'post',
      url: NODEJS_SERVER + '/admin/createProject',
      data: userSubmit,
    })
    .then(response => {
      if(response.data.success){ // Axios responses have a `data` property that contains the HTTP response body.
        console.log(response.data.message);
        setMessage('Updating to GCS by Signed Url receiveds')

        let signurl = response.data.signurl
        let newProjectId = response.data.newProjectId

        console.log('received signurl: ', signurl[0]);


        let formData = new FormData()
        formData.append("file", VideoFile);


          axios({
            method: 'PUT',
            url: signurl[0],
            config: {
              header: { 
              'origin': '*', 
               },
            },
            data: VideoFile,
            onUploadProgress : (progressEvent) => {
              const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
              // Update state here
              setMessage('uploading: ' + progress + "%")
            },
          })
          .then(response => {
            if(response.status === 200){
              //final request to server to add to UPRegis

              axios({
                method: 'post',
                url: NODEJS_SERVER + '/admin/createProjectAfterSignedUrl/' + newProjectId,
                data: userSubmit,
              })
              .then(response => {
                if(response.data.success){
                  console.log(response.data);
                  setMessage(response.data.message);
                }
                else{
                  console.log(response.data.message);
                  setMessage(response.data.message);
                }

            })


            }
            else{
              console.log('upload to GCS failed: ', response);
            }
            
  
          })

        
      } else {
        console.log(response.data.message);
        setMessage(response.data.message)
      }
    }).catch((error) => {
        console.log('axios có ERROR: ', error);
    });
  }

  //Check file type
  function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        // etc
        return true;
    }
    return false;
  }

  //get user policy here
  useEffect(() => {
    axios({
        method: 'get',
        url: NODEJS_SERVER + '/admin/getUPRegisList/',
      })
      .then(response => {
        if(response.data.success){
  
          console.log('CreateProject lay ve user-policy-regis list',response.data.policyList);
          setAvailableUser(response.data.policyList)
          
        } else {
          console.log("CreateProject user-policy-regis list failed roi bro!")
        }
      }) 
  

  }, []);
  


  return (
    <div className="newUser">
      <h1 className="newUserTitle">{Message}</h1>
      <div className="newUserForm">
          
        <div className="newUserItem">
          <label>Project Name</label>
          <input
            onChange={handleProjectName}
            placeholder="Enter your Project Name here"
            type="text"
            className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
            value={ProjectName}
          />
        </div>

        <div className="newUserItem">
          <label>UserId</label>
          <select className="newUserSelect" name="active" value={SelectedIndex} onChange={handleChangeSelectedItem}>
            <option value={-1}>NONE</option>
          {
              AvailableUser.length && AvailableUser.map((item, index) => (
                <option key={index} value={index}>{item.userId}</option>
              ))
          }
          
          </select>
          <label>Plan: {AvailableUser[SelectedIndex] && AvailableUser[SelectedIndex].Policy ? AvailableUser[SelectedIndex].Policy.policyName : "NONE"}</label>
        </div>

        <div className="newUserItem_createproject">
          <label>Subtitles File</label>
          <input
            onChange={handleChangeSubtitlesFile}
            type="file"
            className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
          />
        </div>

        <div className="newUserItem_createproject">
          <label>Video File</label>
          <input
            onChange={handleChangeVideoFile}
            type="file"
            className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
            accept='video/mp4,video/x-m4v,video/*'
            value={VideoFile.filename}
          />
        </div>

        <div className="newUserItem">
            <label>Subtitles</label>
            <textarea 
            rows="10" cols="30" 
            onChange={handleChangeSubData}
            value={SubData}>
            </textarea>
        </div>


       
      </div>



      <button className="newUserButton" onClick={handleSubmitButton}>Create now !</button>

    </div>
  );
}