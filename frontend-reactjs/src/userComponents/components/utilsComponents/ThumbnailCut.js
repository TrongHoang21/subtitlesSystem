import React, {useCallback, useEffect } from "react";
import { useRef, useState } from "react";
import './ThumbnailCut.css'
//THIS IS CODE BASED ON react-video-thumbnails


function ThumbnailCut({ videoSrc, width, height, stopAt = 10 }) {
  const [snapshot, setSnapshot] = useState("");
  const videoE1Ref = useRef();
  const canvasRef = useRef();
  const imgRef = useRef();

  const handleDurationChange = useCallback(() => {
    videoE1Ref.current.currentTime = stopAt; //trigger timeupdate, ensure video loaded fully
  }, [videoE1Ref, stopAt])

  const handleTimeUpdate = useCallback(() => {
    canvasRef.current.height = height
    canvasRef.current.width = width
    var video = videoE1Ref.current
    var context = canvasRef.current.getContext("2d")
    context.drawImage(video, 0, 0, width, height);
    // const thumbnailLink = canvasRef.current.toDataURL("image/png").replace("image/png", "image/octet-stream");  //DOM18 warning https://www.youtube.com/watch?v=3CAyk184vd4
    // setSnapshot(thumbnailLink);

    canvasRef.current.toBlob(function(blob){
      const thumbnailLink = URL.createObjectURL(blob);
      setSnapshot(thumbnailLink);
     }, 'image/jpeg', 0.95); // JPEG at 95% quality

    //Remove canvas, remove video
    canvasRef.current.remove();
    videoE1Ref.current.remove();
  }, [videoE1Ref, height, width])

  useEffect(() => {

    //Video have to fully load in order to draw
    videoE1Ref.current.addEventListener('durationchange', handleDurationChange)
    videoE1Ref.current.addEventListener('timeupdate', handleTimeUpdate)

    return (() => {
      if(videoE1Ref.current !== null){
        videoE1Ref.current.removeEventListener('durationchange', handleDurationChange)
        videoE1Ref.current.removeEventListener('timeupdate', handleTimeUpdate)
      }
    })
    
 }, [videoSrc, width, height, stopAt, handleDurationChange, handleTimeUpdate, videoE1Ref]);


  return (
    <>
          {/* lỗi tainted: cors bucket config hết hạn bên backend */}
        <div className="react-thumbnail-generator">
        <canvas  width={50} height={20} className="snapshot-generator1" ref={canvasRef}>
              
              </canvas> 
          <video width={0} height={0} className="snapshot-generator1" ref={videoE1Ref} src={videoSrc} muted={true} crossOrigin= "Anonymous"/>

        { snapshot &&
        <img ref={imgRef} src={snapshot} alt="my video thumbnail" crossOrigin= "Anonymous"></img>
        }
       
        </div>
        </>
  );
}

export default ThumbnailCut;