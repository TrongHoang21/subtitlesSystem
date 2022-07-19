import React from "react";
import "../../styles/EditPage-TimelineArea.css";
import TimelineButtonPalette from "./TimelineButtonPalette";
import Timeliner from "./Timeliner";

function TimelineArea({myVideoRef}) {

  return (
    <div className="FooterControlsstyled__Controls">
      <TimelineButtonPalette myVideoRef={myVideoRef}/>
      <Timeliner myVideoRef={myVideoRef}/>
    </div>
  );
}

export default TimelineArea;
