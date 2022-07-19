import React from "react";
import "../../styles/EditPage-SubtitlesArea.css";
import SubtitlesAreaNoData from "./SubtitlesAreaNoData";

function SubtitlesArea({myVideoRef}) {

  return (
  <div width="394" className="styles__OuterPanel">
  <div width="394" className="styles__LeftPanel">
    <div className="PanelLayoutStyled__Container">
      <SubtitlesAreaNoData myVideoRef={myVideoRef}/>

    </div>
    
  </div>
</div>
  );
}

export default SubtitlesArea;
