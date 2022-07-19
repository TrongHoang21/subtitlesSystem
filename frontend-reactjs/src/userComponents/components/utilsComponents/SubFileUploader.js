import React, { useEffect, useState } from 'react'

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// import { storage, ref, uploadBytes, getDownloadURL , db, collection, addDoc } from '../../firebase'


import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {useDispatch} from 'react-redux'
import { importSubData } from '../../../reduxComponents/subDataSlice';
import { isSRTParsable } from './parseSRTtoJSON';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const SubFileUploader = ({acceptType}) => {
    const dispatch = useDispatch();


    const [open, setOpen] = React.useState(false);
    const [file, setFile] = useState(null)
    const [Message, setMessage] = useState('Select .SRT files you want to upload!');
    

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const handleChange = (e) => {
        
      if (e.target.files[0]) {
          setFile(e.target.files[0])
      }
    }


    const handleSubFileHTMLLoad = () => {
      // this will then display a text file
      //console.log(reader.result)
      
      const newContent = reader.result

      //Check if valid
      if(!isSRTParsable(newContent)){
        setMessage('Please choose a valid SRT file')
        return
      }

      if(newContent){
        dispatch(importSubData({                
          subData: newContent,
        }))
        setOpen(false);
      }


    }

    var reader = new FileReader();
    reader.addEventListener("load", handleSubFileHTMLLoad, false);
    
    const handleUpload = () => {
        if (!file) {
          return;
        }

        reader.readAsText(file);

      }

      useEffect(() => {
  
      //Remove subcription
        return () => {
          reader.removeEventListener("load", handleSubFileHTMLLoad)

        };
      }, []);
      
      

    return (
        <div className='newFile'>
            <button onClick={handleOpen} className="SubtitleOptionButton__Container">
        <svg width="62" height="49" viewBox="0 0 62 49" fill="none" xmlns="http://www.w3.org/2000/svg" className="SubtitleOptionButton__StyledIcon">
          <g clipPath="url(#clip0)">
            <g>
              <path
                d="M62 13.0447C62 8.54833 62 6.30017 61.125 4.5828C60.3552 3.07216 59.1271 1.84397 57.6164 1.07426C55.8991 0.199219 53.6509 0.199219 49.1546 0.199219H12.8454C8.34911 0.199219 6.10095 0.199219 4.38358 1.07426C2.87294 1.84397 1.64475 3.07216 0.875043 4.5828C0 6.30017 0 8.54833 0 13.0447V35.3538C0 39.8501 0 42.0983 0.875043 43.8156C1.64475 45.3263 2.87294 46.5545 4.38358 47.3242C6.10095 48.1992 8.34911 48.1992 12.8454 48.1992H41.0414C42.9971 48.1992 43.975 48.1992 44.8956 47.979C45.7119 47.7838 46.4925 47.4618 47.2091 47.0248C48.0172 46.5318 48.7107 45.8424 50.0977 44.4636L58.2109 36.3979C59.6091 35.0079 60.3082 34.3129 60.8083 33.5007C61.2516 32.7805 61.5784 31.9949 61.7765 31.1728C62 30.2456 62 29.2598 62 27.2882V13.0447Z"
                fill="#DFE0E5"
              ></path>
              <path
                d="M62 13.0447C62 8.54833 62 6.30017 61.125 4.5828C60.3552 3.07216 59.1271 1.84397 57.6164 1.07426C55.8991 0.199219 53.6509 0.199219 49.1546 0.199219H12.8454C8.34911 0.199219 6.10095 0.199219 4.38358 1.07426C2.87294 1.84397 1.64475 3.07216 0.875043 4.5828C0 6.30017 0 8.54833 0 13.0447V35.3538C0 39.8501 0 42.0983 0.875043 43.8156C1.64475 45.3263 2.87294 46.5545 4.38358 47.3242C6.10095 48.1992 8.34911 48.1992 12.8454 48.1992H41.0414C42.9971 48.1992 43.975 48.1992 44.8956 47.979C45.7119 47.7838 46.4925 47.4618 47.2091 47.0248C48.0172 46.5318 48.7107 45.8424 50.0977 44.4636L58.2109 36.3979C59.6091 35.0079 60.3082 34.3129 60.8083 33.5007C61.2516 32.7805 61.5784 31.9949 61.7765 31.1728C62 30.2456 62 29.2598 62 27.2882V13.0447Z"
                fill="url(#paint0_linear)"
                fillOpacity="0.2"
              ></path>
            </g>
            <g>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M29.3282 14.8662C33.4959 14.8662 36.961 17.5371 37.738 21.1693C41.5714 21.0361 44.2595 23.9538 44.2595 27.3107C44.2595 30.75 41.4483 33.5329 37.9727 33.5329H22.9366C19.9037 33.5329 17.4355 31.0901 17.4355 28.0884C17.4355 25.9874 18.7181 24.0533 20.6125 23.1724C20.1379 19.115 24.0231 14.8662 29.3282 14.8662ZM27.7296 25.8385C27.3954 25.5063 27.3954 24.9676 27.7296 24.6354L29.9305 22.4474C30.2647 22.1152 30.8065 22.1152 31.1406 22.4474L33.3416 24.6354C33.6758 24.9676 33.6758 25.5063 33.3416 25.8385C33.0074 26.1707 32.4656 26.1707 32.1315 25.8385L31.4899 25.2007L31.4899 28.8473C31.4899 29.3172 31.1068 29.698 30.6342 29.698C30.1616 29.698 29.7785 29.3172 29.7785 28.8473L29.7785 25.0046L28.9397 25.8385C28.6055 26.1707 28.0637 26.1707 27.7296 25.8385Z"
                fill="white"
              ></path>
            </g>
          </g>
          <defs>
            <filter id="filter1_d" x="11.1912" y="12.3685" width="39.3126" height="31.1553" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
              <feOffset dy="3.74658"></feOffset>
              <feGaussianBlur stdDeviation="3.12215"></feGaussianBlur>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
              <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
            </filter>
            <linearGradient id="paint0_linear" x1="31" y1="0.199219" x2="31" y2="48.1992" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"></stop>
              <stop offset="1" stopColor="white" stopOpacity="0"></stop>
            </linearGradient>
            <clipPath id="clip0">
              <rect width="62" height="48" fill="white" transform="translate(0 0.199219)"></rect>
            </clipPath>
          </defs>
        </svg>
        <h3 size="13" className="SubtitleOptionButton__Title">
          Upload Subtitle File
        </h3>
        <p size="11" className="SubtitleOptionButton__SubTitle">
          Use an existing subtitles file (.SRT)
        </p>
      </button>
      
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                {Message}
                </Typography>

       
                <>
                    <input type="file" onChange={handleChange} accept={acceptType}/>
                    <button onClick={handleUpload}>Upload</button>
                </>
         
                </Box>
            </Modal>
        </div>
    )
}

export default SubFileUploader


// const handleUpload = () => {
//     setUploading(true)


//     const storageRef = ref(storage, `files/${file.name}`);

//     uploadBytes(storageRef, file).then(snapshot => {
//         console.log(snapshot)

//         getDownloadURL(snapshot.ref).then(url => {

//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log('Upload is ' + progress + '% done');
//             switch (snapshot.state) {
//             case 'paused':
//                 console.log('Upload is paused');
//                 break;
//             case 'running':
//                 console.log('Upload is running');
//                 break;
//             }


//             addDoc(collection(db, "myFiles"), {
//                 timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//                 caption: file.name,
//                 fileUrl: url,
//                 size: file.size,        //dummy code, it supposed to be byteTransfferedd
//             });


//             setUploading(false)
//             setOpen(false)
//             setFile(null)
//         })


//     })
// }
