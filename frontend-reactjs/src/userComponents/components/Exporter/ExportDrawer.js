import { Drawer } from "@mui/material";
import React, {useState} from "react";
import { Link } from "react-router-dom";
import '../../styles/Exporter-ExportDrawer.css'
import {setProjectSubData} from '../../../reduxComponents/userAndProjectSlice'
import {useDispatch, useSelector} from 'react-redux'
import {selectSubData} from '../../../reduxComponents/subDataSlice'
import {makeChunk } from "../utilsComponents/SavingSubData";
import { selectVideoPath } from "../../../reduxComponents/videoSlice";
import ThumbnailCut from "../utilsComponents/ThumbnailCut";

function ExportDrawer() {
  const [open, setOpen] = useState(false);
  const subData = useSelector(selectSubData);
  const myVideoPath = useSelector(selectVideoPath);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const SubArrayToSrtFormat = (data) => { //use param, dont use subData redux directly (empty subData)
    let result = "";
    data && data.map((item, index) => (
        <div>
        {
            result += makeChunk(item.id, item.start, item.end, item.text)
        }
        </div>
    
    ))     
    return result
    
  }

  const handleExport = () => {
    // console.log('Export button clicked, set subData to currentUser');

    //SET CURRENT SUBCONTENT FOR REQUEST EXPORT
    let result = SubArrayToSrtFormat(subData)
    dispatch(setProjectSubData({
      subData: result
    }))

    // console.log(result);
    
  }



  

  return (
    <div>
      <>
        {
          <div>
            <button
              className="CallToAction__ResetButton CallToAction__RootWrapper PublishButton__StyledCallToAction"
              data-testid="@header-controls/publish-button"
              onClick={() => handleOpen()}
            >
              <span className="PublishButton__StyledSpan">Export</span>
              <div className="CallToAction__IconWrapper">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </button>

            <Drawer open={open} onClose={() => handleClose()}>
              <div className="Overlay-sc-2pwypl-0 fzGOgQ modalOverlay">
                <div className="drawer1">
                  <div width="384px" className="sc-fIosxK sc-eWfVMQ Card__StyledRebassCard-sc-1gcrrp6-0 jQHrjq gmHRFa bndWtT">
                    <div className="sharedStyles__ModalHeader-sc-pr2l6y-7 llklxk">
                      <span className="sharedStyles__Headline-sc-pr2l6y-10 fvhqhc">Export Options</span>
                      <button className="sharedStyles__CloseButton-sc-pr2l6y-12 gpLwIG" onClick={() => handleClose()}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="sharedStyles__OptionsSection-sc-pr2l6y-2 goVVqS">
                      <div className="Preview__PreviewWrapper-sc-1v0c1ec-0 hiCiyj">
                        <div className="Preview__ImageWrapper-sc-1v0c1ec-1 gkQNSB">
                        <ThumbnailCut videoSrc={myVideoPath} width={150} height={120} stopAt={1} />
                          {/* <img
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Patrick_Star.svg/1200px-Patrick_Star.svg.png"
                            alt=""
                            className="Preview__StyledImage-sc-1v0c1ec-2 iXARnx"
                          /> */}
                        </div>
                        <div className="Preview__PreviewInfoWrapper-sc-1v0c1ec-3 hnvLRu">
                          <div className="Preview__TimeWrapper-sc-1v0c1ec-4 itBXtD">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path d="M12 8V12L14 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            05:00.0
                          </div>
                          <div className="Preview__FileSizeWrapper-sc-1v0c1ec-5 igWa-DH">
                            236.0MB
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M4.5 3.5C4.5 2.39543 5.39543 1.5 6.5 1.5H13.1716C13.5694 1.5 13.9509 1.65804 14.2322 1.93934L19.0607 6.76777C19.342 7.04907 19.5 7.4306 19.5 7.82843V20.5C19.5 21.6046 18.6046 22.5 17.5 22.5H6.5C5.39543 22.5 4.5 21.6046 4.5 20.5V3.5Z"
                                stroke="currentColor"
                              ></path>
                              <path d="M13 2V6.63908C13 7.87496 14.1097 8.81504 15.3288 8.61187L19 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="sharedStyles__OptionsHeader-sc-pr2l6y-8 lqISM">
                        <span className="sharedStyles__OptionsHeadline-sc-pr2l6y-9 iheUWj">Preset</span>
                        <button data-testid="@export/mode-switcher" className="sharedStyles__TextButton-sc-pr2l6y-11 kVJzpl">
                          + Switch to Advanced
                        </button>
                      </div>
                      <div className="sc-jRQBWg cHgWxS Dropdown__CustomBox-sc-1huw097-1 Srdpu BasicOptions__StyledDropdown-sc-1wz34vr-0 cDuYcQ" radius="0.625rem">
                        <div className="Dropdown__RootWrapper-sc-1huw097-0 dquVnf">
                          <div className="Item__RootWrapper-sc-rot15e-0 goiZsk Dropdown__SelectedItem-sc-1huw097-2 kEhTot" data-testid="@component/dropdown/item">
                            <div className="Item__Header-sc-rot15e-1 fLILAl">
                              <button className="Item__TitleContainer-sc-rot15e-5 dZdQix">
                                <span className="Item__Title-sc-rot15e-2 fTnAs">HD</span>
                              </button>
                              <button className="Item__IconContainer-sc-rot15e-4 hiLzkT">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5 8.5l7 7 7-7"></path>
                                </svg>
                              </button>
                            </div>
                            <div className="Item__Description-sc-rot15e-3 iHNAjD">Default: High quality with longer render times</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sharedStyles__CtaSection-sc-pr2l6y-3 fAVOgu">
                      <button className="sc-gGCDDS bYNRNv sharedStyles__StyledUpgradeButton-sc-pr2l6y-13 iiuKyY">
                        <span className="sc-clIzBv cuXbrX">Remove Watermark</span>
                        <div className="sc-hiwPVj eZFkKO sc-lcepkR evBvrA">
                          <svg width="15" height="15" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-bdvvtL PYKWr sc-ehCJOs bQIAgB">
                            <g filter="url(#zapPrimaryIcon_svg__filter0_i_23447_2603)">
                              <path
                                d="M6.098 6.3h3.019c.424 0 .688.392.473.703l-4.666 6.766c-.283.41-1.022.24-1.022-.236V7.7H.882C.46 7.7.196 7.308.41 6.997L5.075.231c.283-.41 1.023-.24 1.023.236V6.3z"
                                fill="#fff"
                              ></path>
                              <path
                                d="M6.098 6.3h3.019c.424 0 .688.392.473.703l-4.666 6.766c-.283.41-1.022.24-1.022-.236V7.7H.882C.46 7.7.196 7.308.41 6.997L5.075.231c.283-.41 1.023-.24 1.023.236V6.3z"
                                fill="url(#zapPrimaryIcon_svg__paint0_linear_23447_2603)"
                              ></path>
                            </g>
                            <defs>
                              <linearGradient id="zapPrimaryIcon_svg__paint0_linear_23447_2603" x1="4.319" y1="12.783" x2="4.527" y2="0.621" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FFA723" stopOpacity="0.2"></stop>
                                <stop offset="1" stopColor="#FFA723" stopOpacity="0.2"></stop>
                              </linearGradient>
                              <filter
                                id="zapPrimaryIcon_svg__filter0_i_23447_2603"
                                x="0.333"
                                y="0"
                                width="9.333"
                                height="14"
                                filterUnits="userSpaceOnUse"
                                colorInterpolationFilters="sRGB"
                              >
                                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                                <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                                <feOffset dy="1"></feOffset>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"></feColorMatrix>
                                <feBlend in2="shape" result="effect1_innerShadow_23447_2603"></feBlend>
                              </filter>
                            </defs>
                          </svg>
                        </div>
                      </button>
                      <Link style={{ textDecoration: "none", color: "white" }} to="/ResultPage">
                        <button className="CallToAction__ResetButton-sc-ino687-0 CallToAction__RootWrapper-sc-ino687-1 iLqPMI dbcefh" onClick={handleExport}>
                          Export Video
                          <div className="CallToAction__IconWrapper-sc-ino687-2 jaHKcN">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                          </div>
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div width="328.8000183105469" className="Dropdown__PortalList-sc-1huw097-4 bBwYsR">
                    <div className="Item__RootWrapper-sc-rot15e-0 goiZsk" data-testid="@component/dropdown/item">
                      <div className="Item__Header-sc-rot15e-1 fLILAl">
                        <button className="Item__TitleContainer-sc-rot15e-5 dZdQix">
                          <span className="Item__Title-sc-rot15e-2 fTnAs">Draft</span>
                        </button>
                      </div>
                      <div className="Item__Description-sc-rot15e-3 iHNAjD">Low quality for quick render times and small files</div>
                    </div>
                    <div className="Item__RootWrapper-sc-rot15e-0 goiZsk" data-testid="@component/dropdown/item">
                      <div className="Item__Header-sc-rot15e-1 fLILAl">
                        <button className="Item__TitleContainer-sc-rot15e-5 dZdQix">
                          <span className="Item__Title-sc-rot15e-2 fTnAs">Standard</span>
                        </button>
                      </div>
                      <div className="Item__Description-sc-rot15e-3 iHNAjD">Tradeoff between quality and render times</div>
                    </div>
                    <div className="Item__RootWrapper-sc-rot15e-0 goiZsk" data-testid="@component/dropdown/item">
                      <div className="Item__Header-sc-rot15e-1 fLILAl">
                        <button className="Item__TitleContainer-sc-rot15e-5 dZdQix">
                          <span className="Item__Title-sc-rot15e-2 fTnAs">Youtube 720p</span>
                        </button>
                      </div>
                      <div className="Item__Description-sc-rot15e-3 iHNAjD">Uses Youtube recommended settings for 720p 60fps videos</div>
                    </div>
                    <div className="Item__RootWrapper-sc-rot15e-0 goiZsk" data-testid="@component/dropdown/item">
                      <div className="Item__Header-sc-rot15e-1 fLILAl">
                        <button className="Item__TitleContainer-sc-rot15e-5 dZdQix">
                          <span className="Item__Title-sc-rot15e-2 fTnAs">Instagram</span>
                        </button>
                      </div>
                      <div className="Item__Description-sc-rot15e-3 iHNAjD">Uses Instagram recommended settings</div>
                    </div>
                    <div className="Item__RootWrapper-sc-rot15e-0 goiZsk" data-testid="@component/dropdown/item">
                      <div className="Item__Header-sc-rot15e-1 fLILAl">
                        <button className="Item__TitleContainer-sc-rot15e-5 dZdQix">
                          <span className="Item__Title-sc-rot15e-2 fTnAs">Hootsuite Twitter</span>
                        </button>
                      </div>
                      <div className="Item__Description-sc-rot15e-3 iHNAjD">Uses hootsuite recommended settings for twitter</div>
                    </div>
                  </div>
                </div>
              </div>
            </Drawer>
          </div>
        }
      </>
    </div>
  );
}

export default ExportDrawer;
