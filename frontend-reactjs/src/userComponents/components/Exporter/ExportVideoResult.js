import React from "react";

function ExportVideoResult({videoSrc}) {



  return (
  <div>
      <div className="VideoPreviewstyled__VideoPreviewWrapper-sc-gn096b-0">
          <div className="VideoPlayerstyled__VideoPlayerContainer-sc-1wbv6eo-0 feweHB">
            <video src={videoSrc} controls width={'100%'} height={'100%'}>
            </video>
          </div>
        </div>
      

      <footer className="FooterControlsstyled__FooterControlsContainer-sc-16q5tql-0 fEkua-d">
          <div style={{display: 'flex'}}>
   

            <div className="ProjectDetails__ProjectDetailsContainer-sc-1kuvml1-0 fDWJEj">
              

              <div className="ProjectDetails__PrivacyAndDateWrapper-sc-1kuvml1-4 jsmzLz">
                <div>
                  <div className="PrivacySelectorPresenter__Wrapper-sc-i30gki-0 cFuDtw">
                    <button disabled="" className="PrivacySelectorPresenter__ToggleButton-sc-i30gki-1 gBlLvT">
                      <div className="PrivacySelectorPresenter__StateWrapper-sc-i30gki-2 fJBMod">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="sc-bdvvtL dfyOOG PrivacySelectorPresenter__StyledIcon-sc-i30gki-4 hRgOZB"
                        >
                          <path
                            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                          <path
                            d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10v0z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        Public Video
                      </div>
                      <svg
                        className="PrivacySelectorPresenter__StyledDropdownIcon-sc-i30gki-3 kHPtaT"
                        width="6"
                        height="6"
                        viewBox="0 0 6 6"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5.88862 1.42381C5.81446 1.34958 5.72654 1.3125 5.62495 1.3125H0.375028C0.273401 1.3125 0.185544 1.34958 0.111314 1.42381C0.0370842 1.49813 0 1.58598 0 1.68755C0 1.78909 0.0370842 1.87695 0.111314 1.9512L2.73629 4.57617C2.8106 4.6504 2.89845 4.68757 3 4.68757C3.10155 4.68757 3.18948 4.6504 3.26365 4.57617L5.88862 1.95118C5.96277 1.87695 6 1.78909 6 1.68753C6 1.58598 5.96277 1.49813 5.88862 1.42381Z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <span className="ProjectDetails__DateLabel-sc-1kuvml1-3 Torsb">April 6th, 2022</span>
              </div>
            </div>
          </div>
        </footer>
  </div>);
}

export default ExportVideoResult;
