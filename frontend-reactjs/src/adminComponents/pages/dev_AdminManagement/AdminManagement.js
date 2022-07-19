import React, { useEffect } from "react";
import axios from "axios";
import "./AdminManagement.css";
import { DataGrid } from '@mui/x-data-grid';

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { userRows } from "../../../fakeData/dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../reduxComponents/userAndProjectSlice";


import {NODEJS_SERVER} from '../../../env'
// const fakeReduxUser = { id: 4, role: "superadmin" };

function AdminManagement() {
  const currentUser = useSelector(selectCurrentUser);
  const [data, setData] = useState(userRows);
  let wrapper = React.createRef(); //fix findDOMNode Error

  //UseEffect to avoid memory leak when async task but unmounted
  const [isSubscribed, setIsSubscribed] = useState(true);
  useEffect(() => {
    setIsSubscribed(true);
    return () => setIsSubscribed(false);
  }, []);

  useEffect(() => {

    if(currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role !== 'user'){
      axios({
        method: "get",
        url: NODEJS_SERVER + "/admin/getAdminList/" + currentUser.userInfo.id,
      }).then((response) => {
        if(response.data.success && isSubscribed){
          console.log("lay ve admin list", response.data.adminList);
          setData(response.data.adminList);
        } else {
          console.log("admin list failed roi bro!");
        }
      });
    }
    else{
      console.log('UseEffect: No current userinfo');
      
    }


  }, [currentUser]);

  const handleDelete = (adminId) => {
    if(currentUser.userInfo && currentUser.userInfo.id && currentUser.userInfo.role !== 'user'){
      setData(data.filter((item) => item.id !== adminId));

      axios({
        method: "delete",
        url: NODEJS_SERVER + "/admin/deleteAdmin/" + currentUser.userInfo.id + "_" + adminId,
      }).then((response) => {
        if(response.data.success && isSubscribed){
          console.log(response.data.message);
        } else {
          console.log(response.data.message);
        }
      });
    }
    else{
      console.log('handleDelete: No current userinfo');
      
    }
  };

  const handleLockUser = (adminId) => {

    //Lock ở local -> không set trực tiếp vào state của react, vì gây lỗi không re-render
    let newArr = [...data]; // DEEP COPY
    let check = newArr.find((item) => item.id === adminId);
    check.role = 'locked_admin'
    setData(newArr)

    //gửi request lên server
    axios({
      method: 'put',
      url: NODEJS_SERVER + '/admin/lockAdmin/' + currentUser.userInfo.id + "_" + adminId
    })
    .then(response => {
      if(response.data.success && isSubscribed){

        console.log(response.data.message);
        
      } else {
        console.log(response.data.message)
      }
    }) 


  }

  const handleUnlockUser = (adminId) => {
    //Lock ở local
    let newArr = [...data]; // DEEP COPY
    let check = newArr.find((item) => item.id === adminId);
    check.role = 'admin'
    setData(newArr)

    //gửi request lên server
    axios({
      method: 'put',
      url: NODEJS_SERVER + '/admin/unlockAdmin/' + currentUser.userInfo.id + "_" + adminId
    })
    .then(response => {
      if(response.data.success && isSubscribed){

        console.log(response.data.message);
        
      } else {
        console.log(response.data.message)
      }
    }) 
  }

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "Admin",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.avaPath} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "role",
      headerName: "role",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/dev_AdminMainPage/dev_EditAdmin/" + params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutlineIcon className="userListDelete" onClick={() => handleDelete(params.row.id)} />

            {
                params.row.role === 'admin' ?
                <LockIcon
                className="userListLock"
                onClick={() => handleLockUser(params.row.id)}
                />

                :

                <LockOpenIcon
                className="userListLock"
                onClick={() => handleUnlockUser(params.row.id)}
                />
              }

          </>
        );
      },
    },
  ];

  return (
    <div className="userList" ref={wrapper}>
      <Link to="/dev_AdminMainPage/dev_CreateAdmin">
        <button className="userAddButton">Create New Admin</button>
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

export default AdminManagement;
