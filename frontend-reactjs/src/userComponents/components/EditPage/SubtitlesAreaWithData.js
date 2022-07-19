import React, {useState } from "react";
import "../../styles/EditPage-SubtitlesAreaWithData.css";

import { useSelector } from "react-redux";
import { resetSubData, selectSubData } from "../../../reduxComponents/subDataSlice";
import { useDispatch } from "react-redux";
import { editSubItemText, editSubItemStartTime, editSubItemEndTime, 
  deleteSubItem, addSubItemAfterId, addSubItemLast } from "../../../reduxComponents/subDataSlice";
import { changeItem } from "../../../reduxComponents/selectedItemSlice";

function SubtitlesAreaWithData({ myVideoRef }) {
  const subData = useSelector(selectSubData);
  const dispatch = useDispatch();
  const [historyValidValue, setHistoryValidValue] = useState("");

  const handleChangeSubItemText = (e) => {
    dispatch(
      editSubItemText({
        id: e.target.id,
        content: e.target.value,
      })
    );

    dispatch(changeItem({
      selectedItem: e.target.value
    }))
  };

  const handleChangeSubItemStartTime = (e) => {
    dispatch(
      editSubItemStartTime({
        id: e.target.id,
        content: e.target.value,
      })
    );
  };

  const handleChangeSubItemEndTime = (e) => {
    dispatch(
      editSubItemEndTime({
        id: e.target.id,
        content: e.target.value,
      })
    );
  };

  const handleFocus = (e) => {
    if (!isNaN(e.target.value)) {
      setHistoryValidValue(parseFloat(e.target.value));
    }
  };

  const handleLeaveStart = (e) => {
    if (isNaN(e.target.value) || e.target.value.trim() === "" || e.target.value < 0 || e.target.value > myVideoRef.current.duration) {
      dispatch(
        editSubItemStartTime({
          id: e.target.id,
          content: historyValidValue,
        })
      );
    } else {
      dispatch(
        editSubItemStartTime({
          id: e.target.id,
          content: parseFloat(e.target.value),
        })
      );
    }
  };

  const handleLeaveEnd = (e) => {
    if (isNaN(e.target.value) || e.target.value.trim() === "" || e.target.value < 0 || e.target.value > myVideoRef.current.duration) {
      dispatch(
        editSubItemEndTime({
          id: e.target.id,
          content: historyValidValue,
        })
      );
    } else {
      dispatch(
        editSubItemEndTime({
          id: e.target.id,
          content: parseFloat(e.target.value),
        })
      );
    }
  };

  const handleDeleteItem = (selectedId) => {
    dispatch(
      deleteSubItem({
        id: selectedId,
      })
    );

    dispatch(changeItem({
      selectedItem: ""
    }))
  };

  const handleInsertSub = (e) => {
    dispatch(
      addSubItemAfterId({
        id: e.target.id,
      })
    );
    
  }

  const handleAddSubAtLast = () => {
    dispatch(
      addSubItemLast()
    );
    
  }
  
  const handleClickSubItem = (selectedOne) => {
    dispatch(changeItem({
      selectedItem: selectedOne.text
    }))
    
    //change currentTime according to start time of subItem
    myVideoRef.current.currentTime = selectedOne.start;
  }

  const handleResetAll = () => {
    console.log('Back to subtitles upload menu');
    dispatch(resetSubData())

    dispatch(changeItem({
      selectedItem: ""
    }))
    
  }

  return (
    <div width="394" className="styles__OuterPanel-sc-1okj91t-0 gWlLSs">
      <div width="394" className="styles__LeftPanel-sc-1okj91t-1 dTORaf">
        <div className="PanelLayoutStyled__Container-sc-1kjgn7f-0 dCNiIB">
 
          <div data-testid="@panel-layout/tabs-wrapper" className="PanelLayoutStyled__TabsWrapper-sc-1kjgn7f-4 gsuGvn">
            <nav className="Tabs__RootWrapper-sc-18uh7qo-0 fQDeyx">
              <div className="Tabs__Tab-sc-18uh7qo-1 iQRlrO">Subtitles</div>
              <div className="Tabs__Tab-sc-18uh7qo-1 hXTQZy">Translate</div>
              <div className="Tabs__Tab-sc-18uh7qo-1 hXTQZy">Styles</div>
              <div className="Tabs__Tab-sc-18uh7qo-1 hXTQZy" style={{ backgroundColor: "#c26c61", color: 'black'}} onClick={handleResetAll}>Reset All</div>
            </nav>
          </div>

          <div className="PanelLayoutStyled__Content-sc-1kjgn7f-1 idvxor panel-content" style={{ position: "relative" }}>
            <div style={{ overflow: "visible", height: "0px", width: "0px" }}>
              <div className="subtitle-rows-list" style={{ position: "relative", height: "455px", width: "361px", overflow: "auto", willChange: "transform", direction: "ltr" }}>
                <div style={{ height: "840px", width: "100%" }}>
                  {subData.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="TextEditorStyled__Group-sc-nw7y0k-5 dDCwC"
                        id={item.text}
                        style={{ position: "absolute", left: "0px", top: `calc(140px * ${index})`, height: "140px", width: "100%" }}
                      >
                        <div className="TextEditorStyled__RootWrapper-sc-nw7y0k-4 kPLUVP">
                          <div className="TextEditorStyled__TextWrapper-sc-nw7y0k-0 hVKzMM subtitle-row" 
                          onClick={(e) => handleClickSubItem(item)}>
                            
                            <textarea
                              onChange={handleChangeSubItemText}
                              value={item.text}
                              id={item.id}
                              spellCheck="false"
                              placeholder="New Text"
                              dir="auto"
                              className="TextEditorStyled__TextArea-sc-nw7y0k-1 iBnmpX"
                            ></textarea>
                          </div>
                          <div className="TextEditorStyled__SubtitleRowTools-sc-nw7y0k-2 dmpmYH">
                            <div className="TextEditorStyled__ToolGroup-sc-nw7y0k-3 ehCsrg">
                              <div className="EditTime__TimeFrom-sc-o7lubo-0 iLiasP">
                                <button
                                  aria-label="Set start to timeline cursor"
                                  data-testid="@subtitle-row/edit-time/stopwatch-button/from"
                                  className="EditTime__StopwatchButton-sc-o7lubo-2 eByLQe"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M12 22C16.9706 22 21 17.9706 21 13C21 8.02944 16.9706 4 12 4C7.02944 4 3 8.02944 3 13C3 17.9706 7.02944 22 12 22Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                    <path d="M12 8L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M15 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M15 2L9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M12 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                  </svg>
                                </button>
                                <div onClick={(e) => handleClickSubItem(item)}>
                                  <input
                                    onChange={handleChangeSubItemStartTime}
                                    id={item.id}
                                    onBlur={handleLeaveStart}
                                    onFocus={handleFocus}
                                    className="TimeInput__StyledInput-sc-3qy9xb-0 fYJwAF"
                                    value={item.start}
                                    spellCheck="false"
                                  />
                                </div>
                              </div>
                              <div className="Divider-sc-1gwt5fo-0 eFbsVf"></div>
                              <div className="EditTime__TimeTo-sc-o7lubo-1 jQBLkU">
                                <div onClick={(e) => handleClickSubItem(item)}>
                                  <input
                                    onChange={handleChangeSubItemEndTime}
                                    id={item.id}
                                    onBlur={handleLeaveEnd}
                                    onFocus={handleFocus}
                                    className="TimeInput__StyledInput-sc-3qy9xb-0 fYJwAF"
                                    value={item.end}
                                    spellCheck="false"
                                  />
                                </div>
                                <button
                                  aria-label="Set end to timeline cursor"
                                  data-testid="@subtitle-row/edit-time/stopwatch-button/to"
                                  className="EditTime__StopwatchButton-sc-o7lubo-2 eByLQe"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M12 22C16.9706 22 21 17.9706 21 13C21 8.02944 16.9706 4 12 4C7.02944 4 3 8.02944 3 13C3 17.9706 7.02944 22 12 22Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                    <path d="M12 8L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M15 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M15 2L9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M12 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className={`TextEditorStyled__ToolGroup-sc-nw7y0k-3 ehCsrg`} onClick={(e) => handleDeleteItem(item.id)}>
                              <div className="Divider-sc-1gwt5fo-0 eFbsVf"></div>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                data-testid="@design-system/text-editor-0/delete-button"
                                role="button"
                                aria-label="Delete subtitle row"
                                className="TextEditorStyled__DeleteButton-sc-nw7y0k-6 hWVLYj"
                              >
                                <path
                                  d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                                <path opacity="0.5" d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="InsertSubtitle__RootWrapper-sc-gtdont-0 bUBmMD">
                          <div className="InsertSubtitle__InsertHighlight-sc-gtdont-1 knYapm" id={item.id} onClick={handleInsertSub}>
                            <div className="InsertSubtitle__HoverPos-sc-gtdont-2 kswrWu" >
                              <button className="sc-bBHxTw huUywf" aria-label="Add subtitle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 5V19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                  <path d="M4.99998 12H19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div style={{ marginTop: "40px", paddingRight: "6px", position: "absolute", left: "0px", top:`calc(140px * ${subData.length})`, height: "140px", width: "100%" }}>
                    <button onClick={handleAddSubAtLast} className="AddNewRow__ButtonContainer-sc-yi9wxv-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-bdvvtL PYKWr sc-hKwDye dfRKuZ">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      Add New Line
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="resize-triggers">
              <div className="expand-trigger">
                <div style={{ width: "388px", height: "473px" }}></div>
              </div>
              <div className="contract-trigger"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubtitlesAreaWithData;

//SAMPLE SUB COMPONENT

// <div className="TextEditorStyled__Group-sc-nw7y0k-5 dDCwC" style={{position: 'absolute', left: '0px', top: '140px', height: '140px', width: '100%'}}>
// <div className="TextEditorStyled__RootWrapper-sc-nw7y0k-4 kPLUVP">
//   <div className="TextEditorStyled__TextWrapper-sc-nw7y0k-0 hVKzMM subtitle-row">
//     <textarea onChange={handleChange} value={`one of the most important aspects of finance is interest.`} data-testid="@design-system/text-editor-1/textarea" placeholder="New Text" dir="auto" className="TextEditorStyled__TextArea-sc-nw7y0k-1 iBnmpX">

//     </textarea>
//   </div>
//   <div className="TextEditorStyled__SubtitleRowTools-sc-nw7y0k-2 dmpmYH">
//     <div className="TextEditorStyled__ToolGroup-sc-nw7y0k-3 ehCsrg">
//       <div className="EditTime__TimeFrom-sc-o7lubo-0 iLiasP">
//         <button
//           aria-label="Set start to timeline cursor"
//           data-testid="@subtitle-row/edit-time/stopwatch-button/from"
//           className="EditTime__StopwatchButton-sc-o7lubo-2 eByLQe"
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path
//               d="M12 22C16.9706 22 21 17.9706 21 13C21 8.02944 16.9706 4 12 4C7.02944 4 3 8.02944 3 13C3 17.9706 7.02944 22 12 22Z"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             ></path>
//             <path d="M12 8L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//             <path d="M15 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//             <path d="M15 2L9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//             <path d="M12 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//           </svg>
//         </button>
//         <div>
//           <input onChange={handleChange} data-testid="@editor/subtitle-row/styled-input-mask" className="TimeInput__StyledInput-sc-3qy9xb-0 fYJwAF" value="00:06.1" />
//         </div>
//       </div>
//       <div className="Divider-sc-1gwt5fo-0 eFbsVf"></div>
//       <div className="EditTime__TimeTo-sc-o7lubo-1 jQBLkU">
//         <div>
//           <input onChange={handleChange} data-testid="@editor/subtitle-row/styled-input-mask" className="TimeInput__StyledInput-sc-3qy9xb-0 fYJwAF" value="00:10.0" />
//         </div>
//         <button
//           aria-label="Set end to timeline cursor"
//           data-testid="@subtitle-row/edit-time/stopwatch-button/to"
//           className="EditTime__StopwatchButton-sc-o7lubo-2 eByLQe"
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path
//               d="M12 22C16.9706 22 21 17.9706 21 13C21 8.02944 16.9706 4 12 4C7.02944 4 3 8.02944 3 13C3 17.9706 7.02944 22 12 22Z"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             ></path>
//             <path d="M12 8L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//             <path d="M15 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//             <path d="M15 2L9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//             <path d="M12 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//           </svg>
//         </button>
//       </div>
//     </div>
//     <div className="TextEditorStyled__ToolGroup-sc-nw7y0k-3 ehCsrg">
//       <div className="CharacterCount__NumberWrapper-sc-g7lcod-0 PVHVx">
//         <span>-20</span>
//       </div>
//       <div className="Divider-sc-1gwt5fo-0 eFbsVf"></div>
//       <svg
//         width="16"
//         height="16"
//         viewBox="0 0 24 24"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         data-testid="@design-system/text-editor-1/delete-button"
//         role="button"
//         aria-label="Delete subtitle row"
//         className="TextEditorStyled__DeleteButton-sc-nw7y0k-6 hWVLYj"
//       >
//         <path
//           d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         ></path>
//         <path opacity="0.5" d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//       </svg>
//     </div>
//   </div>
// </div>
// <div className="InsertSubtitle__RootWrapper-sc-gtdont-0 bUBmMD">
//   <div className="InsertSubtitle__InsertHighlight-sc-gtdont-1 knYapm"></div>
// </div>
// </div>
