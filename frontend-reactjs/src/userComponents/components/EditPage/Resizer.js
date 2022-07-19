import React from "react";
import '../../styles/EditPage-Resizer.css'


function Resizer() {
  return (
    <div className="TimelineResizer__Resizer">
      <button opacity="0" className="TimelineResizer__Button" style={{opacity: '0', left: '307.8px'}}>
        <svg width="6" height="8px" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3L3 1L1 3" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M1 7L3 9L5 7" stroke="white" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </button>
    </div>
  );
}

export default Resizer;
