import React, {useEffect} from "react";
import axios from "axios";
import "./UserManagement.css";
import { DataGrid } from '@mui/x-data-grid';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { userRows } from "../../../fakeData/dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";

import {NODEJS_SERVER} from '../../../env'

function UserManagement() {
    const [data, setData] = useState(userRows);
    let wrapper = React.createRef();    //fix findDOMNode Error

    //UseEffect to avoid memory leak when async task but unmounted
    const [isSubscribed, setIsSubscribed] = useState(true);
    useEffect(() => {
      setIsSubscribed(true);
      return () => setIsSubscribed(false);
    }, []);


    useEffect(() => {

        axios({
          method: 'get',
          url: NODEJS_SERVER + '/admin/getUserList/'
        })
        .then(response => {
          if(response.data.success && isSubscribed){
    
            console.log('lay ve user list',response.data.userList);
            setData(response.data.userList)
            
          } else {
            console.log("project list failed roi bro!")
          }
        }) 

    }, []);
    

    const handleDelete = (userId) => {
      setData(data.filter((item) => item.id !== userId));

      axios({
        method: 'delete',
        url: NODEJS_SERVER + '/admin/deleteUser/' + userId
      })
      .then(response => {
        if(response.data.success && isSubscribed){
  
          console.log(response.data.message);
          
        } else {
          console.log(response.data.message)
        }
      }) 
    };

    const handleLockUser = (userId) => {

      //Lock ở local -> không set trực tiếp vào state của react, vì gây lỗi không re-render
      let newArr = [...data]; // DEEP COPY
      let check = newArr.find((item) => item.id === userId);
      check.role = 'locked_user'
      setData(newArr)

      //gửi request lên server
      axios({
        method: 'put',
        url: NODEJS_SERVER + '/admin/lockUser/' + userId
      })
      .then(response => {
        if(response.data.success && isSubscribed){
  
          console.log(response.data.message);
          
        } else {
          console.log(response.data.message)
        }
      }) 


    }

    const handleUnlockUser = (userId) => {
      //Lock ở local
      let newArr = [...data]; // DEEP COPY
      let check = newArr.find((item) => item.id === userId);
      check.role = 'user'
      setData(newArr)

      //gửi request lên server
      axios({
        method: 'put',
        url: NODEJS_SERVER + '/admin/unlockUser/' + userId
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
        headerName: "User",
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
              <Link to={"/dev_AdminMainPage/dev_EditUser/" + params.row.id}>
                <button className="userListEdit">Edit</button>
              </Link>
              <DeleteOutlineIcon
                className="userListDelete"
                onClick={() => handleDelete(params.row.id)}
              />

              {
                params.row.role === 'user' ?
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
        <Link to="/dev_AdminMainPage/dev_CreateUser">
          <button className="userAddButton">Create New User</button>
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

export default UserManagement;
