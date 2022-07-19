import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectCurrentUser } from "../../../reduxComponents/userAndProjectSlice";
import "./EditPolicy.css";

import {NODEJS_SERVER} from '../../../env'

export default function EditPolicy() {
  let { policyId } = useParams();
  // console.log('lấy ra đúng id: ', userId); --> this will be rerender many time

  const currentUser = useSelector(selectCurrentUser);

  const [Message, setMessage] = useState("Edit User");

  const [PolicyId, setPolicyId] = useState("");
  const [PolicyName, setPolicyName] = useState("");
  const [PriceVND, setPriceVND] = useState(0);
  const [ImgSrc, setImgSrc] = useState("https://www.nicepng.com/png/detail/223-2234062_the-godfather-godfather-logo.png");
  const [Description, setDescription] = useState("");
  const [IsSubDown, setIsSubDown] = useState(false);
  const [MaxUpload, setMaxUpload] = useState(0);
  const [MaxAutoSub, setMaxAutoSub] = useState(0);
  const [MaxStorage, setMaxStorage] = useState(0);
  const [MaxExportLength, setMaxExportLength] = useState(0);

  const handleChangePolicyName = (e) => {
    setPolicyName(e.target.value);
  };

  const handleChangePriceVND = (e) => {
    setPriceVND(Math.floor(e.target.value));
  };

  const handleChangeImgSrc = (e) => {
    setImgSrc(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeIsSubDown = (e) => {
    setIsSubDown(e.target.value);
  };

  const handleChangeMaxUpload = (e) => {
    setMaxUpload(Math.floor(e.target.value));
  };

  const handleChangeMaxAutoSub = (e) => {
    setMaxAutoSub(Math.floor(e.target.value));
  };

  const handleChangeMaxStorage = (e) => {
    setMaxStorage(Math.floor(e.target.value));
  };

  const handleChangeMaxExportLength = (e) => {
    setMaxExportLength(Math.floor(e.target.value));
  };

  const handleUpdateButton = (e) => {
    if (PolicyName === "" || ImgSrc === "") {
      setMessage("Please set policy name and image source!");
      return;
    }

    let userSubmit = {
      policyId: PolicyId,
      policyName: PolicyName,
      priceVND: PriceVND,
      imgSrc: ImgSrc,
      description: Description,
      rule_isSubDownloadable: IsSubDown,
      rule_maxUploadFileSizeMB: MaxUpload,
      rule_maxAutoSubMinutes: MaxAutoSub,
      rule_maxStorageMB: MaxStorage,
      rule_maxVideoExportLengthMinutes: MaxExportLength,
    };

    console.log("submit info: ", userSubmit);

    if (currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role !== "user") {
      setMessage("please wait for server to response");
      axios({
        method: "post",
        url: NODEJS_SERVER + "/admin/updatePolicy/" + currentUser.userInfo.id,
        data: userSubmit,
      })
        .then((response) => {
          if (response.data.success) {
            // Axios responses have a `data` property that contains the HTTP response body.
            console.log(response.data.message);
            setMessage(response.data.message);
          } else {
            console.log(response.data.message);
            setMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.log("axios có ERROR: ", error);
        });
    }
  };

  useEffect(() => {
    if (currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role !== "user") {
      axios({
        method: "get",
        url: NODEJS_SERVER + "/admin/getPolicyById/" + currentUser.userInfo.id + "_" + policyId,
      }).then((response) => {
        if (response.data.success) {
          console.log("lay ve policy: ", response.data.policyInfo);
          let policyInfo = response.data.policyInfo;

          setPolicyId(policyInfo.id);
          setPolicyName(policyInfo.policyName);
          setPriceVND(policyInfo.priceVND);
          setImgSrc(policyInfo.imgSrc);
          setDescription(policyInfo.description);
          setIsSubDown(policyInfo.rule_isSubDownloadable);
          setMaxUpload(policyInfo.rule_maxUploadFileSizeMB);
          setMaxAutoSub(policyInfo.rule_maxAutoSubMinutes);
          setMaxStorage(policyInfo.rule_maxStorageMB);
          setMaxExportLength(policyInfo.rule_maxVideoExportLengthMinutes);
        } else {
          console.log("get policy failed roi bro!");
        }
      });
    }
  }, [policyId, currentUser]);

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit Policy</h1>
        <Link to="/dev_AdminMainPage/dev_PolicyManagement">
          <button className="userAddButton">Back to Policy list</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img src={ImgSrc} alt="" className="userShowImg" />
            <div className="userShowTopTitle">
              <span className="userShowUsername"></span>
              <span className="userShowUserTitle">Name: {PolicyName} </span>
            </div>
          </div>

          <div className="userShowBottom">
            <span className="userShowTitle">Plan Details</span>
            <div className="userShowInfo">
              <PermIdentityIcon className="userShowIcon" />
              <span className="userShowInfoTitle">SubDownloadable: {IsSubDown ? "YES" : "NO"}</span>
            </div>
            <div className="userShowInfo">
              <CalendarTodayIcon className="userShowIcon" />
              <span className="userShowInfoTitle">maxStorage (MB): {MaxStorage}</span>
            </div>

            <div className="userShowInfo">
              <PhoneAndroidIcon className="userShowIcon" />
              <span className="userShowInfoTitle">maxAutoSub (Minutes): {MaxAutoSub}</span>
            </div>

            <div className="userShowInfo">
              <LocationSearchingIcon className="userShowIcon" />
              <span className="userShowInfoTitle">maxUploadFileSize (MB): {MaxUpload}</span>
            </div>

            <div className="userShowInfo">
              <LocationSearchingIcon className="userShowIcon" />
              <span className="userShowInfoTitle">maxVideoExportLength (Minutes): {MaxExportLength}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">{Message}</span>
          <div className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Policy Name</label>
                <input onChange={handleChangePolicyName} placeholder="Enter your Policy Name here" className="Input__StyledInput-sc-mdxq3k-2 cibaxs" value={PolicyName} />
              </div>

              <div className="userUpdateItem">
                <label>Price (USD)</label>
                <input
                  onChange={handleChangePriceVND}
                  id="priceVND"
                  placeholder="Enter your plan price here"
                  type="number"
                  min="0"
                  step="1"
                  name="priceVND"
                  className="Input__StyledInput-sc-mdxq3k-2 cibaxs"
                  value={PriceVND}
                />
              </div>

              <div className="userUpdateItem">
                <label>Image Source</label>
                <input onChange={handleChangeImgSrc} type="text" className="Input__StyledInput-sc-mdxq3k-2 cibaxs" value={ImgSrc} />
              </div>

              <div className="userUpdateItem">
                <label>Is Subtitles Downloadable?</label>
                <select className="newUserSelect" name="active" value={IsSubDown} onChange={handleChangeIsSubDown}>
                  <option value={false}>FALSE</option>
                  <option value={true}>TRUE</option>
                </select>
              </div>

              <div className="userUpdateItem">
                <label>Max Upload File Size (MB) </label>
                <input onChange={handleChangeMaxUpload} type="number" min="0" step="1" className="Input__StyledInput-sc-mdxq3k-2 cibaxs" value={MaxUpload} />
              </div>

              <div className="userUpdateItem">
                <label>Max Storage (MB) </label>
                <input onChange={handleChangeMaxStorage} type="number" min="0" step="1" className="Input__StyledInput-sc-mdxq3k-2 cibaxs" value={MaxStorage} />
              </div>

              <div className="userUpdateItem">
                <label>Max Auto Subtitles (Minutes) </label>
                <input onChange={handleChangeMaxAutoSub} type="number" min="0" step="1" className="Input__StyledInput-sc-mdxq3k-2 cibaxs" value={MaxAutoSub} />
              </div>

              <div className="userUpdateItem">
                <label>Max Export Length (Minutes) </label>
                <input onChange={handleChangeMaxExportLength} type="number" min="0" step="1" className="Input__StyledInput-sc-mdxq3k-2 cibaxs" value={MaxExportLength} />
              </div>

              <div className="userUpdateItem">
                <label>Description</label>
                <textarea rows="10" cols="65" onChange={handleChangeDescription} value={Description}></textarea>
              </div>
            </div>

            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img className="userUpdateImg" src={ImgSrc} alt="" />
              </div>
              <button className="userUpdateButton" onClick={handleUpdateButton}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
