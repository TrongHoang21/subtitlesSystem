import React, {useEffect} from "react";
import axios from "axios";
import "./ProjectManagement.css";
import { DataGrid } from '@mui/x-data-grid';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { userRows } from "../../../fakeData/dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";

import {NODEJS_SERVER} from '../../../env'

function ProjectManagement() {
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
          url: NODEJS_SERVER + '/admin/getProjectList/'
        })
        .then(response => {
          if(response.data.success && isSubscribed){
    
            console.log(response.data)
            setData(response.data.projectList)
            
          } else {
            console.log(response.data.message)
          }
        }) 

    }, []);
    

    const handleDelete = (projectId) => {
      setData(data.filter((item) => item.id !== projectId));

      axios({
        method: 'delete',
        url: NODEJS_SERVER + '/admin/deleteProject/' + projectId
      })
      .then(response => {
        if(response.data.success){
  
          console.log(response.data.message);
          
        } else {
          console.log(response.data.message)
        }
      }) 
    };
    
    const columns = [
      { field: "id", headerName: "ID", width: 90 },
      {
        field: "projectName",
        headerName: "projectName",
        width: 200,
        renderCell: (params) => {
          return (
            <div className="userListUser">
              <video className="userListImg" src={params.row.videoUrl} alt="" muted/>
              {params.row.projectName}
            </div>
          );
        },
      },
      { field: "status", headerName: "status", width: 150 },
      {
        field: "userId",
        headerName: "userId",
        width: 120,
      },
      {
        field: "createdAt",
        headerName: "createdAt",
        width: 200,
      },
      {
        field: "action",
        headerName: "Action",
        width: 150,
        renderCell: (params) => {
          return (
            <>
              <Link to={"/dev_AdminMainPage/dev_EditProject/" + params.row.id}>
                <button className="userListEdit">Edit</button>
              </Link>
              <DeleteOutlineIcon
                className="userListDelete"
                onClick={() => handleDelete(params.row.id)}
              />
            </>
          );
        },
      },
    ];
  
    return (
      <div className="userList" ref={wrapper}>  
        <Link to="/dev_AdminMainPage/dev_CreateProject">
          <button className="userAddButton">Create New Project</button>
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

export default ProjectManagement;
