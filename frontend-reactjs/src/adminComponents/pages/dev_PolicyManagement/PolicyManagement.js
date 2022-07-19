import React, { useEffect } from "react";
import axios from "axios";
import "./PolicyManagement.css";
import { DataGrid } from '@mui/x-data-grid';


import { userRows } from "../../../fakeData/dummyData";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../reduxComponents/userAndProjectSlice";

import {NODEJS_SERVER} from '../../../env'

function PolicyManagement() {
  const currentUser = useSelector(selectCurrentUser);

  const [data, setData] = useState(userRows);
  let wrapper = React.createRef(); //fix findDOMNode Error <DataGrid

  //UseEffect to avoid memory leak when async task but unmounted
  const [isSubscribed, setIsSubscribed] = useState(true);
  useEffect(() => {
    setIsSubscribed(true);
    return () => setIsSubscribed(false);
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: NODEJS_SERVER + "/admin/getPolicyList/",
    }).then((response) => {
      if(response.data.success && isSubscribed){
        console.log("lay ve policy list", response.data.policyList);
        setData(response.data.policyList);
      } else {
        console.log("policy list failed roi bro!");
      }
    });
  }, []);

  const handleDelete = (adminId) => {
    if (currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role !== "user") {
      setData(data.filter((item) => item.id !== adminId));

      axios({
        method: "delete",
        url: NODEJS_SERVER + "/admin/deletePolicy/" + currentUser.userInfo.id + "_" + adminId,
      }).then((response) => {
        if (response.data.success) {
          console.log(response.data.message);
        } else {
          console.log(response.data.message);
        }
      });
    }
    else{
      console.log('handleDelete: No user info');
      
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/dev_AdminMainPage/dev_EditPolicy/" + params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutlineIcon className="userListDelete" onClick={() => handleDelete(params.row.id)} />
          </>
        );
      },
    },
    {
      field: "policyName",
      headerName: "policyName",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.imgSrc} alt="" />
            {params.row.policyName}
          </div>
        );
      },
    },
    { field: "description", headerName: "description", width: 300 },
    {
      field: "priceVND",
      headerName: "price (USD)",
      width: 150,
    },
    { field: "rule_isSubDownloadable", headerName: "SubDownloadable", width: 200 },
    { field: "rule_maxStorageMB", headerName: "maxStorage (MB)", width: 200 },
    { field: "rule_maxAutoSubMinutes", headerName: "maxAutoSub (Minutes)", width: 300 },
    { field: "rule_maxUploadFileSizeMB", headerName: "maxUploadFileSize (MB)", width: 300 },
    { field: "rule_maxVideoExportLengthMinutes", headerName: "maxVideoExportLength (Minutes)", width: 300 },
  ];

  return (
    <div className="userList" ref={wrapper}>
      <Link to="/dev_AdminMainPage/dev_CreatePolicy">
        <button className="userAddButton">Create New Policy</button>
      </Link>
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8]}
        // checkboxSelection
      />
    </div>
  );
}

export default PolicyManagement;
