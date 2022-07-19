import React, {useEffect, useState} from "react";
import "../../styles/EditPage-Preview.css";
import ExportDrawer from "../Exporter/ExportDrawer";
import { useDispatch, useSelector } from "react-redux";
import { selectVideoPath } from "../../../reduxComponents/videoSlice";
import { selectSelectedItem } from "../../../reduxComponents/selectedItemSlice";
import { Link, useNavigate } from "react-router-dom";
import { selectCurrentUser, setUserInfo, resetCurrentProject, changeProjectName } from "../../../reduxComponents/userAndProjectSlice";
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";

// SPINNER https://www.davidhu.io/react-spinners/
import ClipLoader from "react-spinners/ClipLoader";
import { hide, selectLoadingStatus } from "../../../reduxComponents/loadingStatusSlice";



function Preview({ myVideoRef }) {
  const loadingStatus = useSelector(selectLoadingStatus)
  const myVideoPath = useSelector(selectVideoPath);
  const selectedItem = useSelector(selectSelectedItem);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const pageRouter = useNavigate();

  const [ProjectName, setProjectName] = useState(currentUser.currentProject ? currentUser.currentProject.projectName : "Project Preview");
  
  

  const handleBackToWorkspace = () => {
    console.log("handleBackToWorkspace click");
    dispatch(resetCurrentProject())
    pageRouter("/dev_WorkspacePage");
  };

  const handleChangeProjectName = (e) => {
    setProjectName(e.target.value)
  };
  

  const handleSaveProjectName = (e) => {
    console.log('Tên project được chốt đơn nè: ', ProjectName);
    let newName = ProjectName

    if(newName.trim() === ""){
      setProjectName('untitled')
      newName = 'untitled'
    }

    if(currentUser.currentProject){
      axios({
        url: NODEJS_SERVER + '/changeProjectName/' + currentUser.currentProject.id,
        method: 'post',
        data: {
          newName: newName
        }
      })
      .then(response => {
        if(response.data.success){
          console.log('changed project name to: ', response.data.projectName);
          
          //set to current user
          dispatch(changeProjectName({
            projectName: response.data.projectName
          }))
  


        } else{
          console.log('Lỗi change project name ', response.data.message);
        }
      })
    }

    



    
    
  };

  //reset redux
  useEffect(() => {
    dispatch(hide())
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
        if(response.data.success){
          console.log('get login', response.data.userInfo);
          
          //set to current user
          dispatch(setUserInfo({
            userInfo: response.data.userInfo
          }))

          //redirect to workspace
          // pageRouter('/dev_workspacePage')
          if(response.data.userInfo.role !== '' && response.data.userInfo.role !== 'user'){
            pageRouter('/dev_login')
          }
        } else{
          pageRouter('/dev_login')
        }
      })

      

      
    } 
  }, []);
  

  return (
    <div className="Editstyled__PreviewWrapper">
      <div className="HeaderControls__Container">
        <div className="HeaderControls__NameContainer">
          {/* <label className="InlineEdit__Label">Project:</label> */}
          <input
            data-testid="@inline-edit/input"
            className="InlineEdit__Input"
            type="text"
            id="inline-edit--fPRzTvjs4lYGG3zk09IUz"
            value= {ProjectName}
            onChange={handleChangeProjectName}
            onBlur={handleSaveProjectName}
            spellCheck='false'
          ></input>

          {/* UPLOADING NOTIFICATION */}
          {
            loadingStatus.isLoading ? 
            <div className="UploadingStatus__Container-sc-h1gbco-0">
              <ClipLoader color={loadingStatus.color} loading={loadingStatus.isLoading} size={loadingStatus.size} />
              <span className="StatusUpload__StyledText">{loadingStatus.loadingMessage}</span>
            </div>

            :
            <div></div>
          }



        </div>
        <div className="HeaderControls__ToolsContainer">
          <button aria-label="undo" data-testid="@header-controls/undo-button" className="HeaderControlsStyled__UndoButton">
            <svg width="2rem" height="2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8L4 12L8 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
              <path
                d="M19 16C19 14.9391 18.5786 13.9217 17.8284 13.1716C17.0783 12.4214 16.0609 12 15 12H4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <button disabled="" aria-label="redo" data-testid="@header-controls/redo-button" className="HeaderControlsStyled__UndoButton">
            <svg width="2rem" height="2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8L20 12L16 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
              <path
                d="M5 16C5 14.9391 5.42143 13.9217 6.17157 13.1716C6.92172 12.4214 7.93913 12 9 12L20 12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <div className="HeaderControls__Separator"></div>

          {currentUser.userInfo && currentUser.userInfo.id ? (
            <div className="InviteBar__InviteBarContainer-sc-xgawj2-0 jpjfiA">
              <button style={{ backgroundColor: "transparent", border: "none" }} onClick={handleBackToWorkspace}>
                <span className="InviteBar__InviteButton-sc-xgawj2-1 dOgnW">Workspace</span>
              </button>

              <div className="InviteBar__AvatarContainer-sc-xgawj2-2 fDnhXJ">
                <img
                  src={
                    currentUser.userInfo &&
                    (currentUser.userInfo.avaPath ? currentUser.userInfo.avaPath : "https://lh3.googleusercontent.com/a/AATXAJym5F0Tn72u4RtYs1MTO7CeD0MVfWoijlSr8Jzi=s96-c")
                  }
                  alt=""
                  size="40"
                  className="Avatar__Icon-sc-1yzjx87-0 jXemal"
                ></img>
              </div>
            </div>
          ) : (
            <div className="AnonymousAccountstyled__Container">
              <span className="AnonymousAccountstyled__SaveProjectText">Save your project for later —</span>

              <Link style={{ textDecoration: "none" }} to="/dev_register">
                <button className="AnonymousAccountstyled__Button">sign up</button>
              </Link>

              <span className="AnonymousAccountstyled__OrText">or</span>
              <span className="AnonymousAccountstyled__Middot">·</span>

              <Link style={{ textDecoration: "none" }} to="/dev_login">
                <button className="AnonymousAccountstyled__Button">log in</button>
              </Link>
            </div>
          )}

          <ExportDrawer />
        </div>
      </div>

      {/* VIDEO PART */}
      <div id="video-preview-area" className="_buffvy" role="button" tabIndex="-1">
        <div className="_qjtguh" >
          <video src={myVideoPath} ref={myVideoRef} style={{ display: "block" }} preload="auto" className="video-player"></video>
        </div>
        <div className="_oojfkv" style={{ maxWidth: "100%", justifyContent: "center", bottom: "5%", padding: "0px 3.90625%" }}>
          <div className="_1mdv3a1" style={{ textAlign: "center" }}>
            <span id="subtitle-box-spanfalse" className="_19gc20h" style={{ fontSize: `${myVideoRef.current ? myVideoRef.current.clientWidth / 10 / 3 + "px" : "20px"}` }}>
              <span>{selectedItem}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;

//Bỏ 1, code video preivew cũ, trước happy scribe
{
  /* <div className="Preview__PreviewContainer">
<div id="dropWrapper-editor" className="DropWrapperstyled__Wrapper">
  <div data-testid="@editor/video-canvas-wrapper" className="Canvas__CanvasWrapper">
    <div id="videoBox" className="Canvas__CanvasContainer" style={{display:'flex', flexDirection: 'column'}}>
      {/* <canvas
        data-testid="@editor/video-canvas"
        id="webgl-preview-canvas"
        className="Canvas__VideoCanvas"
        width="658"
        height="369"
        style={{width: '526px', height: '295px', cursor: 'auto',}}
      ></canvas> */
}

{
  /* <video src={myVideoPath} ref={myVideoRef} width="800px" height="400px" >
        Your browser does not support the video tag.
      </video>

      <div className="overlayed_text" width="100px" height="100px" >
        <p>{selectedItem}</p>
      </div> */
}

//     </div>
//   </div>
// </div>
// </div> */}

//Bỏ 2
{
  /* <div className="indexstyled__MeasureContainer-sc-4t3bk8-0 hhTDA-d">
                <div data-testid="@editor/video-canvas/selection-container" className="indexstyled__Container-sc-4t3bk8-1 gEzKxH">
                  <div>
                    <div
                      className="StyledRect-sc-vocraq-0 geVugf rect single-resizer"
                      draggable="false"
                      data-testid="@editor/video-canvas/selection-box/BRcuV5igTZlr3Jbt8whPR"
                      style={{width: '453.76px', height: '88.3237px', transform: 'rotate(0deg)', left: '56.72px', top: '327.478px'}}
                    >
                      <div data-testid="@editor/video-canvas/selection-box/BRcuV5igTZlr3Jbt8whPR/rotate" className="rotate">
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M6.99842 10.5799C4.90011 10.5799 3.13324 9.17078 2.58898 7.24861H3.94317C4.07184 7.12369 4.13929 6.95463 4.01062 6.82968L2.44656 5.2498C2.31789 5.12488 2.10926 5.12488 1.98059 5.2498L0.426966 6.82968C0.242479 7.04622 0.365746 7.12367 0.494416 7.24861H1.73576C2.30083 9.63467 4.43704 11.4128 6.99842 11.4128C8.94684 11.4128 10.6504 10.3817 11.6052 8.83971L10.8211 8.52658C9.99994 9.76334 8.59538 10.5799 6.99842 10.5799ZM13.5299 5.16651H12.346C11.9442 2.57307 9.70676 0.585938 6.99842 0.585938C4.90968 0.585938 3.10034 1.76815 2.19588 3.49711L2.97209 3.80735C3.74956 2.38444 5.26113 1.41879 6.99842 1.41879C9.2454 1.41879 11.1118 3.0349 11.5041 5.16651H10.0816C9.95291 5.29144 9.82964 5.36891 10.0141 5.58544L11.5677 7.16534C11.6964 7.29025 11.905 7.29025 12.0337 7.16534L13.5978 5.58544C13.726 5.46052 13.6586 5.29146 13.5299 5.16651Z"
                            fill="#5D647B"
                          ></path>
                        </svg>
                      </div>
                      {/* <div className="move"></div>
                      <div className="large l resizable-wrapper" style={{cursor: w-resize}}></div>
                      <div className="large r resizable-wrapper" style="cursor: e-resize;"></div>
                      <div className="large tl resizable-handler" style="cursor: nw-resize;"></div>
                      <div className="large tr resizable-handler" style="cursor: ne-resize;"></div>
                      <div className="large bl resizable-handler" style="cursor: sw-resize;"></div>
                      <div className="large br resizable-handler" style="cursor: se-resize;"></div> */
}
{
  /* </div>
                  </div>
                </div>
              </div> */
}
