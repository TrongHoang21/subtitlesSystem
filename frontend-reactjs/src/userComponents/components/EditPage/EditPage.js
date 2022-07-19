import React, {useRef} from "react";
import "../../styles/EditPage.css";
import Navbar from "./Navbar";
import Preview from "./Preview";
import SubtitlesArea from "./SubtitlesArea";
import Resizer from "./Resizer";
import TimelineArea from "./TimelineArea";
import Uploader from "../Uploader/Uploader";

function EditPage() {
  const myVideoRef = useRef();

  return (
    <div className="Edit-container">
      <Uploader myVideoRef={myVideoRef}/>
      <Navbar width={'6%'}/>
      <div className="app__main">
          <div className="app__main--top">
            <div className="app__main--top--left">
            <SubtitlesArea myVideoRef={myVideoRef}/>
          </div>
          <div className="app__main--top--right">
            <Preview myVideoRef={myVideoRef}/>
          </div>
          </div>

          
          <div className="app__main--bottom">
            <Resizer/>
            <TimelineArea myVideoRef={myVideoRef}/>
          </div>
        </div>
      
    </div>
  );
}

export default EditPage;


