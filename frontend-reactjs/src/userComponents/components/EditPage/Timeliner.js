import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Ruler from "@scena/react-ruler";
import "../../styles/EditPage-Timeliner.css";
import { selectVideoPath } from "../../../reduxComponents/videoSlice";
import ThumbnailCut from "../utilsComponents/ThumbnailCut";
import { selectSubData } from "../../../reduxComponents/subDataSlice";
import { changeItem } from "../../../reduxComponents/selectedItemSlice";

function Timeliner({ myVideoRef }) {
  const myVideoPath = useSelector(selectVideoPath);
  const subData = useSelector(selectSubData);
  const dispatch = useDispatch();

  const progress = useRef();
  const pointer = useRef();
  const [videoDuration, setVideoDuration] = useState(400);
  const thumbnailStack = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19.5]; //19 items

  const handleDurationChange = useCallback(() => {
    //if normal setState will return NaN
    setVideoDuration(myVideoRef.current.duration);
  }, [myVideoRef]);

  const handleTimeUpdate = useCallback(() => {
    const percentage = (myVideoRef.current.currentTime / myVideoRef.current.duration) * 100;
    pointer.current.style.left = `${percentage * progress.current.offsetWidth / 100}px`

    //Hiển thị sub chạy theo thời gian cho video -> lấy ra cái đầu tiên trong các cái bị overlay nhau
    if(myVideoRef.current.currentTime && subData.length > 0){
      let found = subData.find((element) => element.start <= myVideoRef.current.currentTime && myVideoRef.current.currentTime <= element.end);

      if(found){  //there could be undefined and still valid
        dispatch(
          changeItem({
            selectedItem: found.text,
          })
        );
      }

    }
  
  }, [myVideoRef, subData]);

  const handleProgressBarClick = useCallback(
    (e) => {
      const progressTime = (e.offsetX / progress.current.offsetWidth) * myVideoRef.current.duration;
      myVideoRef.current.currentTime = progressTime;
    },
    [myVideoRef]
  );

  useEffect(() => {
    if (myVideoRef !== undefined) {
      // console.log('Timeliner video ref success')
      // console.log(myVideoRef)

      myVideoRef.current.addEventListener("durationchange", handleDurationChange);

      myVideoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      progress.current.addEventListener("click", handleProgressBarClick);

      // progress.current.addEventListener('mouseover', (e) =>{
      //   console.log('haha2')
      //   console.log(myVideoRef.current.currentTime)

      //   const progressTime = (e.offsetX / progress.current.offsetWidth) * myVideoRef.current.duration
      //   const percentage = (progressTime / myVideoRef.current.duration) * 100
      //   pointer.current.style.left = `${percentage * progress.current.offsetWidth / 100}px`
      // })

      // progress.current.addEventListener('mouseout', (e) =>{
      //   const percentage = (myVideoRef.current.currentTime / myVideoRef.current.duration) * 100
      //   pointer.current.style.left = `${percentage * progress.current.offsetWidth / 100}px`
      // })

      return () => {
        if (myVideoRef.current !== null && progress.current !== null) {
          myVideoRef.current.removeEventListener("durationchange", handleDurationChange);
          myVideoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          progress.current.removeEventListener("click", handleProgressBarClick);
        }
      };
    }
  }, [myVideoRef, handleDurationChange, handleProgressBarClick, handleTimeUpdate, progress]);

  return (
    <div>
      <div style={{ width: "100%", height: "100px" }}>
        <div style={{ position: "relative", width: "1000px" }} ref={progress}>
          <Ruler
            unit={videoDuration >= 10 ? Math.floor(videoDuration / 10) : (videoDuration / 10).toFixed(1)}
            style={{ position: "relative", width: "100%", height: "30px" }}
            segment="5"
            backgroundColor="white"
            textColor="gray"
            zoom={1000 / videoDuration}
            mainLineSize="15"
            range={[0, videoDuration]}
            type="horizontal"
          />
        </div>
        <div className="thumbnail_stack" style={{ display: "flex", padding: "0", width: "1000px" }}>
          <div className="hinh1">
            <ThumbnailCut videoSrc={myVideoPath} width={50} height={20} stopAt={(videoDuration / 20) * 1} />
          </div>
          <div className="hinh">
            {thumbnailStack.map((item, index) => {
              return <ThumbnailCut key={index} videoSrc={myVideoPath} width={50} height={20} stopAt={(videoDuration / 20) * item} />;
            })}
          </div>
        </div>


            {/* happyscribe sol */}
        <div className='happyscribe_head1'
        ref={pointer} 
        style={{ position: "relative", left: "0px", top: "-100px" }}
        >
          <div
          className="_r1ov9k"></div>
          <div className='happyscribe_head2'></div>
        </div>
      </div>
    </div>
  );
}

export default Timeliner;

// const [ThumbnailFolderPath, setThumbnailFolderPath] = useState("");
// const [ThumbnailStack, setThumbnailStack] = useState([]);

// const handleThumbs = () => {

//http://localhost:5000/api/video/getVideo?videoPath=tempUploads/1650100557525_sample5_5p.mp4
// axios({
//   method: 'post',
//   url: 'http://localhost:5000/api/video/thumbnail',
//   data:{
//     videoPath: myVideoPath
//   }
// })
// .then(response => {
//   if(response.data.success){
//     setThumbnailFolderPath(response.data.thumbsFolderPath)
//     setThumbnailNameList(response.data.thumbsFileNameList)

//     console.log(response.data.thumbsFolderPath)
//   } else {
//     alert("failed thumbnail roi bro")
//   }
// })

//   let arr = []

//   for(let i = 1; i<= 3; i + 1 ){

//     arr.push(<ThumbnailCut
//     videoSrc={myVideoPath}
//     width={50}
//     height={20}
//     stopAt={i}
//   />  )

//   }

//   return arr;
// };
