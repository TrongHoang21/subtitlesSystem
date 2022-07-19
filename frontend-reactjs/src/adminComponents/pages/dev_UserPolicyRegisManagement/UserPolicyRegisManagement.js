import React, {useEffect} from "react";
import axios from "axios";
import "./UserPolicyRegisManagement.css";
import { DataGrid } from '@mui/x-data-grid';


import { userRows } from "../../../fakeData/dummyData";
import { useState } from "react";

import {NODEJS_SERVER} from '../../../env'

function UserPolicyRegisManagement() {
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
          url: NODEJS_SERVER + '/admin/getUPRegisList/'
        })
        .then(response => {
          if(response.data.success && isSubscribed){
    
            console.log('lay ve user-policy-regis list',response.data.policyList);
            setData(response.data.policyList)
            
          } else {
            console.log("policy list failed roi bro!")
          }
        }) 

    }, []);
    

    
    const columns = [
      { field: "id", headerName: "ID", width: 120 },
      {
        field: "Policy.policyName",
        headerName: "policyName",
        width: 200,
        renderCell: (params) => {       
          return (
            <div >
              {
                  params.row.Policy &&
                <div className="userListUser">
                    <img className="userListImg" src={params.row.Policy.imgSrc} alt="imgSrc" />
                    {params.row.Policy.policyName}
                </div>
                
              }
              </div>

          );
        },
      },
      { field: "userId", headerName: "userId", width: 150 },
      { field: "purchaseDate", headerName: "purchaseDate", width: 300 },
      {
        field: "expireDate",
        headerName: "expireDate",
        width: 150,
      },
      { field: "used_StorageMB", headerName: "used StorageMB", width: 200 },
      { field: "total_uploadFileSizeMB", headerName: "total uploadFileSizeMB", width: 200 },
      { field: "used_AutoSubMinutes", headerName: "used AutoSubMinutes", width: 200 },
      { field: "total_videoExportLengthMinutes", headerName: "total videoExportLengthMinutes", width: 200 },

    ];
  

    return (
      <div className="userList" ref={wrapper}>  
        {/* <Link to="/dev_CreateUser">
          <button className="userAddButton">Create New User</button>
        </Link> */}
        <h1 className="newUserTitle">This site is read-only</h1>
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

export default UserPolicyRegisManagement;
