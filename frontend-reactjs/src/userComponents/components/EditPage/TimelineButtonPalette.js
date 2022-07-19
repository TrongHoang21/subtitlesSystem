import React, {useCallback, useEffect, useRef, useState} from "react";
import '../../styles/EditPage-TimelineButtonPalette.css'
import SrtDownloader from "../utilsComponents/SrtDownloader";

function TimelineButtonPalette({myVideoRef}) {

  const currentTimeElement = useRef();
  const durationTimeElement = useRef();
  const playButton = useRef();
  const [volumeState, setVolumeState] = useState(50);

  const handleVolume = (e) => {
    myVideoRef.current.volume = e.target.value/100;
    setVolumeState(e.target.value)
  }

  const currentTime = useCallback(() => {
    let currentMinutes = Math.floor(myVideoRef.current.currentTime / 60)
    let currentSeconds = Math.floor(myVideoRef.current.currentTime - currentMinutes * 60)
    let durationMinutes = Math.floor(myVideoRef.current.duration / 60)
    let durationSeconds = Math.floor(myVideoRef.current.duration - durationMinutes * 60)
    
  
    currentTimeElement.current.innerHTML = `${currentMinutes}:${currentSeconds < 10 ? '0'+currentSeconds : currentSeconds}`
    durationTimeElement.current.innerHTML =  (!isNaN(durationMinutes) && !isNaN(durationSeconds)) ? `${durationMinutes}:${durationSeconds < 10 ? '0'+durationSeconds : durationSeconds}` : '0:00'
  }, [myVideoRef])

  const handleDurationChange = useCallback(() => {
    let durationMinutes = Math.floor(myVideoRef.current.duration / 60)
    let durationSeconds = Math.floor(myVideoRef.current.duration - durationMinutes * 60)
    
    durationTimeElement.current.innerHTML =  (!isNaN(durationMinutes) && !isNaN(durationSeconds)) ? `${durationMinutes}:${durationSeconds < 10 ? '0'+durationSeconds : durationSeconds}` : '0:00'
    
  }, [myVideoRef]);

  const handlePlayButtonClick =  useCallback((e) => {
    if(myVideoRef.current.paused){
      myVideoRef.current.play()
      e.target.textContent = '❚ ❚'
    } else {
      myVideoRef.current.pause()
      e.target.textContent = '►'
    }
  }, [myVideoRef])


  useEffect(() => {
    if(myVideoRef !== undefined){
      myVideoRef.current.addEventListener('timeupdate', currentTime)
      playButton.current.addEventListener('click',handlePlayButtonClick)
      myVideoRef.current.addEventListener("durationchange", handleDurationChange);
    }

    return(()=> {
      if(myVideoRef.current !== null &&  playButton.current !== null){
        myVideoRef.current.removeEventListener('timeupdate', currentTime)
        playButton.current.removeEventListener('click', handlePlayButtonClick)
        myVideoRef.current.removeEventListener("durationchange", handleDurationChange);
      }
    })
  }, [currentTime, myVideoRef, handlePlayButtonClick, playButton])

  return (
    <div height="54px" className="TimelineControlsstyled__Box">
    <div display="grid" className="TimelineControlsstyled__Container">
      <div width="200px" className="TimelineControlsstyled__Box-1">

      {/* SRT DOWNLOAD FILE FUNCTION */}
        <SrtDownloader/>
        <div className="TimelineControlsstyled__Divider"></div>
        <button data-testid="@timeline-controls/split-button" className="commonStyles__Button">
          <svg width="18px" height="18px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" color="#5D647B">
            <path
              d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M4 14C5.10457 14 6 13.1046 6 12C6 10.8954 5.10457 10 4 10C2.89543 10 2 10.8954 2 12C2 13.1046 2.89543 14 4 14Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path d="M13.3336 2.66602L5.41357 10.586" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M9.64648 9.6543L13.3332 13.3343" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M5.41357 5.41406L8.00024 8.00073" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span className="commonStyles__Text">Split</span>
        </button>
      </div>
      <div className="TimelineControlsstyled__Box-2">
        <button data-testid="@timeline-controls/skip-back-button" aria-label="Skip Back" className="commonStyles__Button">
          <svg width="15px" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.8333 10.6263C12.8333 11.0455 12.3484 11.2786 12.021 11.0167L7.48804 7.39035C7.23784 7.19019 7.23784 6.80965 7.48804 6.60948L12.021 2.98313C12.3484 2.72122 12.8333 2.95431 12.8333 3.37356V10.6263Z"
              fill="#9094A5"
              stroke="#9094A5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M6.99996 10.6263C6.99996 11.0455 6.51499 11.2786 6.18761 11.0167L1.65467 7.39035C1.40447 7.19019 1.40447 6.80965 1.65467 6.60948L6.18761 2.98313C6.51499 2.72122 6.99996 2.95431 6.99996 3.37356V10.6263Z"
              fill="#9094A5"
              stroke="#9094A5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <button ref={playButton} height="38" style={{fontSize:"20px", padding:'0', position: 'relative',  top:'5px'}} data-testid="@timeline-controls/play-button" className="commonStyles__Button">
                ► 
        </button>
        <span className="CurrentTime__Container">
          <span className="current" ref={currentTimeElement}>
            0:00
          </span>{" "}
          /{" "}
          <span className="duration" ref={durationTimeElement}>
            0:00
          </span>
        </span>
        <button data-testid="@timeline-controls/skip-forward-button" aria-label="Skip Forward" className="commonStyles__Button">
          <svg width="15px" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0)">
              <path
                d="M1.16667 3.37373C1.16667 2.95447 1.65163 2.72139 1.97901 2.98329L6.51196 6.60965C6.76216 6.80981 6.76216 7.19035 6.51196 7.39052L1.97901 11.0169C1.65163 11.2788 1.16667 11.0457 1.16667 10.6264L1.16667 3.37373Z"
                fill="#9094A5"
                stroke="#9094A5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M7.00004 3.37373C7.00004 2.95447 7.48501 2.72139 7.81239 2.98329L12.3453 6.60965C12.5955 6.80981 12.5955 7.19035 12.3453 7.39052L7.81239 11.0169C7.48501 11.2788 7.00004 11.0457 7.00004 10.6264L7.00004 3.37373Z"
                fill="#9094A5"
                stroke="#9094A5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="14" height="14" fill="white" transform="translate(14 14) rotate(-180)"></rect>
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
      <div width="330px" className="TimelineControlsstyled__Box-3">
        <span aria-label="Mute" data-testid="@timeline-controls/mute-button" className="commonStyles__Span">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 6.13503C12 5.28719 11.0111 4.82404 10.3598 5.36681L6 8.99999H5C3.34315 8.99999 2 10.3431 2 12V12C2 13.6568 3.34315 15 5 15H6L10.3598 18.6332C11.0111 19.1759 12 18.7128 12 17.8649V6.13503Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M19.07 4.92999C20.9447 6.80527 21.9979 9.34835 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.45999C16.4774 9.39763 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </span>
        <div className="TimelineControlsstyled__Divider"></div>
        <div className="TimelineControlsstyled__Box-3">
          <div className="Zoomstyled__FlexWrapper-1">
            <div className="Zoomstyled__FlexWrapper-2">
              
        <div> 
          <input type="range" 
          min={0} max={100} 
          value={volumeState} 
          onChange={handleVolume} 
          step={1}
          /> 
        </div>
              
            </div>
            <button data-testid="@timeline-controls/fit-to-screen" className="commonStyles__Button-fit">Fit</button>
          </div>
        </div>
        <div className="TimelineControlsstyled__Divider-2"></div>
        <button data-testid="@timeline-controls/show-audio-button" aria-label="Show sound wave on timeline" className="commonStyles__Button">
          <svg width="16px" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" color="#5D647B">
            <path d="M14.6668 8H12.0002L10.0002 14L6.00016 2L4.00016 8H1.3335" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  );
}

export default TimelineButtonPalette;
