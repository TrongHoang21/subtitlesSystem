import axios from "axios";
import {useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../reduxComponents/userAndProjectSlice";
import "./CreatePolicy.css";

import {NODEJS_SERVER} from '../../../env'


export default function CreatePolicy() {

  const currentUser = useSelector(selectCurrentUser);

  const [Message, setMessage] = useState('Create New Policy');
  const [PolicyName, setPolicyName] = useState('');
  const [PriceVND, setPriceVND] = useState(0);
  const [ImgSrc, setImgSrc] = useState('https://www.nicepng.com/png/detail/223-2234062_the-godfather-godfather-logo.png');
  const [Description, setDescription] = useState('');
  const [IsSubDown, setIsSubDown] = useState(false);
  const [MaxUpload, setMaxUpload] = useState(0);
  const [MaxAutoSub, setMaxAutoSub] = useState(0);
  const [MaxStorage, setMaxStorage] = useState(0);
  const [MaxExportLength, setMaxExportLength] = useState(0);

  const handleChangePolicyName = (e) => {
    setPolicyName(e.target.value)
  }

  const handleChangePriceVND = (e) => {
    setPriceVND(Math.floor(e.target.value))
  }

  const handleChangeImgSrc = (e) => {
    setImgSrc(e.target.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const handleChangeIsSubDown = (e) => {
    setIsSubDown(e.target.value)
  }

  const handleChangeMaxUpload= (e) => {
    setMaxUpload(Math.floor(e.target.value))
    
  }

  const handleChangeMaxAutoSub= (e) => {
    setMaxAutoSub(Math.floor(e.target.value))
  }

  const handleChangeMaxStorage= (e) => {
    setMaxStorage(Math.floor(e.target.value))
  }

  const handleChangeMaxExportLength= (e) => {
    setMaxExportLength(Math.floor(e.target.value))
  }

  const handleSubmitButton = (e) => {

    if(PolicyName === "" || ImgSrc === ""){
      setMessage('Please set policy name and image source!')
      return;
    }

    let userSubmit = {
      policyName: PolicyName,
      priceVND: PriceVND,
      imgSrc: ImgSrc,
      description: Description,
      rule_isSubDownloadable: IsSubDown,
      rule_maxUploadFileSizeMB: MaxUpload,
      rule_maxAutoSubMinutes: MaxAutoSub,
      rule_maxStorageMB: MaxStorage,
      rule_maxVideoExportLengthMinutes: MaxExportLength,
    }

    console.log('submit info: ', userSubmit);
    
    if(currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role !== 'user'){
      setMessage('please wait for server to response')
      axios({
        method: 'post',
        url: NODEJS_SERVER + '/admin/createPolicy/' + currentUser.userInfo.id,
        data: userSubmit,
      })
      .then(response => {
        if(response.data.success){ // Axios responses have a `data` property that contains the HTTP response body.
          console.log(response.data.message);
          setMessage(response.data.message)

          
        } else {
          console.log(response.data.message);
          setMessage(response.data.message)
        }
      }).catch((error) => {
          console.log('axios có ERROR: ', error);
      });
    }
    else{
      console.log('handleSubmitButton: No current userinfo');
      setMessage('handleSubmitButton: No current userinfo')
    }
  }



  return (
    <div className="newUser">
      <h1 className="newUserTitle">{Message}</h1>
      <div className="newUserForm">

        <div className="newUserItem">
          <label>Policy Name</label>
          <input
            onChange={handleChangePolicyName}
            placeholder="Enter your Policy Name here"
            className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
            value={PolicyName}
          />
        </div>

        <div className="newUserItem">
          <label>Price (USD)</label>
          <input
              onChange={handleChangePriceVND}
              id="priceVND"
              placeholder="Enter your plan price here"
              type="number" min="0" step="1"
              name="priceVND"
              className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
              value={PriceVND}
            />
        </div>

        <div className="newUserItem">
          <label>Image Source</label>
          <input
              onChange={handleChangeImgSrc}
              type="text"
              className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
              value={ImgSrc}
            />
        </div>
        
        <div className="newUserItem">
        <label>Is Subtitles Downloadable?</label>
          <select className="newUserSelect" name="active" value={IsSubDown} onChange={handleChangeIsSubDown}>
            <option value={false}>FALSE</option>
            <option value={true}>TRUE</option>
          </select>
        </div>

        <div className="newUserItem">
          <label>Max Upload File Size (MB) </label>
          <input
              onChange={handleChangeMaxUpload}
              type="number" min="0" step="1"
              className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
              value={MaxUpload}
            />
        </div>

        <div className="newUserItem">
          <label>Max Storage (MB) </label>
          <input
              onChange={handleChangeMaxStorage}
              type="number" min="0" step="1"
              className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
              value={MaxStorage}
            />
        </div>

        <div className="newUserItem">
          <label>Max Auto Subtitles (Minutes) </label>
          <input
              onChange={handleChangeMaxAutoSub}
              type="number" min="0" step="1"
              className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
              value={MaxAutoSub}
            />
        </div>

        <div className="newUserItem">
          <label>Max Export Length (Minutes) </label>
          <input
              onChange={handleChangeMaxExportLength}
              type="number" min="0" step="1"
              className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
              value={MaxExportLength}
            />
        </div>   

        <div className="userUpdateItem">
            <label>Description</label>
            <textarea 
            rows="10" cols="65" 
            onChange={handleChangeDescription}
            value={Description}>
            </textarea>
        </div>



       
      </div>
      <button className="newUserButton" onClick={handleSubmitButton}>Create now !</button>

    </div>
  );
}