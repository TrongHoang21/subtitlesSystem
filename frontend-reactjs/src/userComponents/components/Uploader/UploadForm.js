import { Dialog, DialogTitle } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import React, { useEffect, useCallback, useState } from "react";
import "../../styles/UploadForm.css";
import { setVideoPath } from "../../../reduxComponents/videoSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setProjectVideoUrl } from "../../../reduxComponents/userAndProjectSlice";
import { importSubData, selectSubData } from "../../../reduxComponents/subDataSlice";
import { Form } from "antd";
import Dropzone from "react-dropzone";
import axios from "axios";
import { NODEJS_SERVER } from "../../../env";

import { resetSubData } from "../../../reduxComponents/subDataSlice";
import { resetSelectedItem, selectSelectedItem } from "../../../reduxComponents/selectedItemSlice";
import { selectVideoPath, resetVideoPath } from "../../../reduxComponents/videoSlice";
import { hide, setAll, setLoadingMessage } from "../../../reduxComponents/loadingStatusSlice";
import PopupError from "./PopupError";
import { useNavigate } from "react-router-dom";

function UploadForm({ openPopup, myVideoRef }) {
  const [open, setOpen] = React.useState(openPopup);
  const [PopupHidden, setPopupHidden] = useState(true);
  const [PopupMessage, setPopupMessage] = useState("");
  const [PricingInfo, setPricingInfo] = useState("");

  const currentUser = useSelector(selectCurrentUser);
  const subData = useSelector(selectSubData);
  const selectedItem = useSelector(selectSelectedItem);
  const myVideoPath = useSelector(selectVideoPath);

  const pageRouter = useNavigate();

  //redux
  const dispatch = useDispatch();

  const handleClose = () => {
    // hide this so that user must upload a video then can close the form
    // setOpen(false);
  };

  const handlePopupClose = () => {
    setPopupHidden(true);
    setPopupMessage("");
    // console.log('handlePopupClose called');
  };

  const onSubmit = () => {};

  const uploadTemp = (files) => {
    console.log("upload temp called");

    //Check limit before upload -> cải tiến, thay vì đợi server check rồi mới biết
    let VideoFile = files[0];
    let filesize = Math.ceil(VideoFile.size / 1000 / 1000); //Convert to MB

    if (!VideoFile) {
      console.log("no file before upload");
      return;
    } else if(!isVideo(VideoFile.name)){
      console.log("not a video file");
      setPopupMessage("Please upload a video file");
      setPopupHidden(false);
      return;

    } else if (PricingInfo) {
      // console.log("Max size MB:", PricingInfo.rule_maxUploadFileSizeMB);

      if (filesize > PricingInfo.rule_maxUploadFileSizeMB) {
        console.log("Video size MB (When upload will be ceil()):", filesize);
        setPopupMessage("Your file exceeded max upload file size of your plan");
        setPopupHidden(false);
        return;
      }
    }

    //done check, start upload
    setOpen(false);

    //Prepare to upload
    let formData = new FormData();
    dispatch(setVideoPath(URL.createObjectURL(files[0])));
    formData.append("file", files[0]);

    //UPLOAD VIDEO
    const config = {
      header: { "content-type": "multipart/form-data", enctype: "multipart/form-data" },
    };

    axios({
      method: "post",
      url: NODEJS_SERVER + "/uploadTemp",
      data: formData,
      config: config,
      onUploadProgress: (progressEvent) => {
        const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));

        // Update state here
        console.log("uploading: " + progress + "%");
        dispatch(
          setAll({
            loadingMessage: progress + "% uploaded",
            isLoading: true,
          })
        );
      },
    }).then((response) => {
      if (response.data.success) {
        console.log(response.data.message, response.data.url);
        //hide loading status when fully uploaded
        dispatch(hide());

        dispatch(
          setProjectVideoUrl({
            videoUrl: response.data.url,
            id: response.data.projectId,
            videoStorageName: response.data.videoStorageName, //currently not used
          })
        );
      } else {
        console.log("video upload failed roi: ", response.data.message);
        dispatch(
          setLoadingMessage({
            loadingMessage: response.data.message,
          })
        );

        if (response.data.popUpUpgrade) {
          setPopupHidden(false);
          setPopupMessage(response.data.message);
        }
      }
    });
  };

  const uploadWithUser = (files) => {
    console.log("Upload with User");

    //Check limit before upload -> cải tiến, thay vì đợi server check rồi mới biết
    let VideoFile = files[0];
    let filesize = Math.ceil(VideoFile.size / 1000 / 1000); //Convert to MB
    let currentStorage = PricingInfo.used_storageMB;

    if (!VideoFile) {
      console.log("no file before upload");
      return;
    } else if(!isVideo(VideoFile.name)){
      console.log("not a video file");
      setPopupMessage("Please upload a video file");
      setPopupHidden(false);
      return;

    } else if (PricingInfo.Policy) {
      // console.log("Max size MB:", PricingInfo.Policy.rule_maxUploadFileSizeMB);

      if (filesize > PricingInfo.Policy.rule_maxUploadFileSizeMB) {
        console.log("Video size MB (When upload will be ceil()):", filesize);
        setPopupMessage("Your file exceeded max upload file size of your plan");
        setPopupHidden(false);
        return;
      }

      if (filesize + currentStorage > PricingInfo.Policy.rule_maxUploadFileSizeMB) {
        console.log("Video size MB (When upload will be ceil()):", filesize);
        setPopupMessage("Your file exceeded max limitation of your current storage");
        setPopupHidden(false);
        return;
      }
    }

    //done check, start upload
    setOpen(false);

    //PREPARE TO UPLOAD
    let formData = new FormData();
    dispatch(setVideoPath(URL.createObjectURL(files[0])));
    formData.append("file", files[0]);

    //UPLOAD VIDEO
    const config = {
      header: { "content-type": "multipart/form-data", enctype: "multipart/form-data" },
    };

    formData.append("userId", currentUser.userInfo.id);
    formData.append("projectId", currentUser.currentProject.id);

    axios({
      method: "post",
      url: NODEJS_SERVER + "/upload/" + currentUser.currentProject.id,
      data: formData,
      config: config,
      onUploadProgress: (progressEvent) => {
        const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        // Update state here
        console.log("uploading: " + progress + "%");
        dispatch(
          setAll({
            loadingMessage: progress + "% uploaded",
            isLoading: true,
          })
        );
      },
    }).then((response) => {
      if (response.data.success) {
        console.log(response.data.message, response.data.url);
        //hide loading status when fully uploaded
        dispatch(hide());

        dispatch(
          setProjectVideoUrl({
            videoUrl: response.data.url,
            id: response.data.projectId,
            videoStorageName: response.data.videoStorageName, //currently not used
          })
        );
      } else {
        console.log("video upload failed roi: ", response.data.message);

        if (response.data.popUpUpgrade) {
          setPopupHidden(false);
          setPopupMessage(response.data.message);
        }
      }
    });
  };

  const onDrop = (files) => {
    if (currentUser.userInfo && currentUser.userInfo.id) {
      uploadWithUser(files);
    } else {
      uploadTemp(files);
    }
  };

  //This is to reset on leaving the edit page
  const handleReset = useCallback(() => {
    if (myVideoPath) {
      dispatch(resetVideoPath());
    }
    if (subData) {
      dispatch(resetSubData());
    }
    if (selectedItem) {
      dispatch(resetSelectedItem());
    }

    console.log("reset func in EditPage called");
  }, []);

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

  useEffect(() => {
    //call only once
    handleReset();
  }, []);

  //this is for select project from workspace page
  useEffect(() => {
    console.log(currentUser);
    if (open === true) {
      //this is to prevent this useEffect called after closed, triggering  dispatch(importSubData({  <-- error from AutoSave

      if (currentUser.currentProject !== undefined && currentUser.currentProject.videoUrl) {
        setOpen(false); //code below still run

        dispatch(setVideoPath(currentUser.currentProject.videoUrl));

        if (currentUser.currentProject.subData) {
          dispatch(
            importSubData({
              subData: currentUser.currentProject.subData,
            })
          );
        }
      }
    }

    return () => {};
  }, [myVideoRef, currentUser]);

  //for userpolicy check
  useEffect(() => {
    //get
    //undefined and '' will not pass

    // avoid memory leak warning
    let isSubscribed = true

    axios({
      method: "get",
      url: NODEJS_SERVER + "/getPricingPlanInfo/" + (currentUser.userInfo && currentUser.userInfo.id ? currentUser.userInfo.id : "nouser"),
    }).then((response) => {
      if (response.data.success && isSubscribed) {
        if (response.data.pricingInfo) {
          // console.log('useEffect getPricingPlanInfo: ', response.data.pricingInfo);
          setPricingInfo(response.data.pricingInfo);
        } else {
          //no user
          // console.log('useEffect getPricingPlanInfo: ', response.data.nouser_pricingInfo);
          setPricingInfo(response.data.nouser_pricingInfo);
        }
      } else {
        console.log("useEffect getPricingPlanInfo err: ", response.data.message);
      }
    });

    return(() => {
      isSubscribed = false
    })
  }, []);

  //CSR session (localStorage) -> login user have to use create project, not upload your video
  useEffect(() => {
    let userId = localStorage.getItem('userId')
    
    if(userId){
      if(currentUser.currentProject && currentUser.currentProject.id === ''){
        pageRouter('/dev_login')
      }
      
    }
  }, []);


  return (
    <div>
      <PopupError isHidden={PopupHidden} message={PopupMessage} handlePopupClose={handlePopupClose} />
      <StyledEngineProvider injectFirst>
        {/* Your component tree. Now you can override MUI's styles. */}
        <Dialog sx={{ backdropFilter: "blur" }} open={open} onClose={handleClose} className="mui-dialog-content">
          <div className="dialog-content">
            <div className="left-section">
              <DialogTitle>
                <div>New Project</div>
              </DialogTitle>
              <h1 style={{ marginLeft: "20px", marginRight: "10px" }}>Please upload your video!</h1>
              <h2 style={{ marginLeft: "20px", marginRight: "10px" }}>
                {`You have max upload file size: 
                ${PricingInfo ? (PricingInfo.rule_maxUploadFileSizeMB ? PricingInfo.rule_maxUploadFileSizeMB : PricingInfo.Policy.rule_maxUploadFileSizeMB) : "processing..."} MB`}
              </h2>
              {/* <h1>Use templates B</h1> */}
            </div>
            <div className="right-section">
                {
                  // Check if PricingInfo before you are able to click any button
                  PricingInfo &&   

                  <div className="Button-Pallete">
    
                  {/* <Link style={{textDecoration: 'none', color: 'black'}} to="/EditPage"> */}
                  <Form onSubmit={onSubmit}>
                    <Dropzone onDrop={onDrop} multiple={false} maxSize={800200011410}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div className="Upload-button" {...getRootProps()}>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" color="#5D647B" className="sc-bdvvtL dfyOOG">
                              <path d="M16 16l-4-4-4 4M12 12v9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M16 16l-4-4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
  
                            <span className="DropzoneCTAStyled__Heading-sc-1h1n7xu-1 fPCsUz">Upload a File</span>
                            <span className="DropzoneCTAStyled__Subheading-sc-1h1n7xu-2 hPHeA-d">
                              Click to
                              <span className="browse-link">browse</span>, or drag &amp; drop your file here
                            </span>
                            <input {...getInputProps()} />
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </Form>
  
                  {/* </Link> */}
                  <div className="d">
                    <div className="Another-Options-Pallete">
                      <button className="Record-Button">
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" color="#5D647B" className="sc-bdvvtL dfyOOG">
                            <path
                              stroke="currentColor"
                              strokeLinejoin="round"
                              d="M17.286 9.443l4.68-2.367a.708.708 0 01.695.032c.211.132.34.364.339.615v8.666a.728.728 0 01-.075.327.71.71 0 01-.959.323l-4.68-2.37"
                            ></path>
                            <rect width="17" height="17" x="0.5" y="3.5" stroke="currentColor" rx="3.5"></rect>
                          </svg>
                        </span>
                        Record
                      </button>
  
                      <button className="BrandKit-Button">
                        <span>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#5D647B" className="sc-bdvvtL dfyOOG">
                            <path
                              d="M5.889 23A4.888 4.888 0 011 18.111V3.444A2.444 2.444 0 013.444 1h4.89a2.444 2.444 0 012.444 2.444v14.667c0 1.297-.515 2.54-1.432 3.457M5.889 23c1.297 0 2.54-.515 3.457-1.432M5.889 23h14.667A2.444 2.444 0 0023 20.556v-4.89a2.444 2.444 0 00-2.444-2.444h-2.864m-8.346 8.346l10.371-10.371a2.445 2.445 0 000-3.456L16.26 4.283a2.444 2.444 0 00-3.456 0l-2.025 2.025v7.63m-4.89 4.173h.013"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                          <img className="img-brand" src="https://www.veed.io/static/media/pro.c38016c8d20cdd579439.png" alt="" />
                        </span>
                        Brand Kit
                      </button>
  
                      <button className="Dropbox-Button">
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" color="#5D647B" className="sc-bdvvtL bAOjGk">
                            <path
                              d="M17 18l-5 3-5-3M17.727 2.756l-4.8 3.002 5.05 3.159 4.398-2.737a.5.5 0 00.001-.848l-4.119-2.576a.5.5 0 00-.53 0zm-6.685 3l-4.77-2.999a.5.5 0 00-.53 0L1.62 5.334a.5.5 0 000 .848l4.357 2.725 5.065-3.151zm6.967 4.34l-5.082 3.179 4.799 3.001a.5.5 0 00.531 0l4.127-2.596a.5.5 0 000-.847l-4.375-2.737zm-6.964 3.16l-5.036-3.15L1.62 12.85a.5.5 0 000 .848l4.12 2.577a.5.5 0 00.532-.002l4.773-3.017z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </span>
                        Dropbox
                      </button>
  
                      <button className="Youtube-Button">
                        <span>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#5D647B" className="sc-bdvvtL bAOjGk">
                            <path
                              d="M21.151 5.237h.003c.77.21 1.388.83 1.597 1.618v.001c.232.866.361 2.254.429 3.479a49.852 49.852 0 01.07 2.126v.081a24.157 24.157 0 01-.008.59c-.008.395-.023.94-.055 1.542-.063 1.227-.189 2.613-.42 3.468v.003a2.289 2.289 0 01-1.598 1.617l-.002.001c-.386.107-1.135.2-2.107.272-.95.071-2.05.12-3.099.151a145.225 145.225 0 01-3.878.064h-.082 0H12V21v-.75h0-.083a86.305 86.305 0 01-1.11-.008c-.73-.008-1.72-.024-2.768-.056a73.09 73.09 0 01-3.1-.15c-.97-.073-1.72-.166-2.106-.273h-.002a2.289 2.289 0 01-1.598-1.618v-.001C1 17.279.876 15.892.813 14.668A48.781 48.781 0 01.75 12.54v-.04h0v0h0v-.042a27.817 27.817 0 01.008-.588c.007-.393.022-.937.053-1.537.061-1.222.183-2.606.407-3.464a2.289 2.289 0 011.597-1.616h.003c.387-.107 1.136-.201 2.108-.275.95-.073 2.05-.122 3.099-.156a146.11 146.11 0 013.878-.072h.165a102.341 102.341 0 011.11.008c.729.008 1.72.024 2.768.056a75.04 75.04 0 013.099.15c.971.073 1.72.166 2.106.273z"
                              stroke="currentColor"
                            ></path>
                            <path d="M10.8 15.479c-.3.2-.7 0-.7-.4v-5.6c0-.4.4-.6.7-.4l4.8 2.8c.3.2.3.6 0 .8l-4.8 2.8z" stroke="currentColor"></path>
                          </svg>
                        </span>
                        YouTube
                      </button>
                    </div>
                  </div>
                </div>

                

                
                }


            </div>
          </div>
        </Dialog>
      </StyledEngineProvider>
    </div>
  );
}

export default UploadForm;
