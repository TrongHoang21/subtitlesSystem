import React, {useEffect} from "react";
import axios from "axios";
import "./PolicyView.css";
import { DataGrid } from '@mui/x-data-grid';


import { userRows } from "../../../fakeData/dummyData";
import { useState } from "react";

import {NODEJS_SERVER} from '../../../env'

function PolicyView() {
    const [data, setData] = useState(userRows);
    let wrapper = React.createRef();    //fix findDOMNode Error

    useEffect(() => {

        axios({
          method: 'get',
          url: NODEJS_SERVER + '/admin/getPolicyList/'
        })
        .then(response => {
          if(response.data.success){
    
            console.log('lay ve policy list',response.data.policyList);
            setData(response.data.policyList)
            
          } else {
            console.log("policy list failed roi bro!")
          }
        }) 

    }, []);
    

    
    const columns = [
      { field: "id", headerName: "ID", width: 90 },
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
        headerName: "priceVND",
        width: 150,
      },
      { field: "rule_isSubDownloadable", headerName: "SubDownloadable", width: 200 },
      { field: "rule_maxStorageMB", headerName: "maxStorage", width: 200 },
      { field: "rule_maxAutoSubMinutes", headerName: "maxAutoSubMin", width: 200 },
      { field: "rule_maxUploadFileSizeMB", headerName: "maxUploadFileSize", width: 200 },
      { field: "rule_maxVideoExportLengthMinutes", headerName: "maxVideoExportLengthMin", width: 200 },
    //   {
    //     field: "action",
    //     headerName: "Action",
    //     width: 150,
    //     renderCell: (params) => {
    //       return (
    //         <>
    //           <Link to={"/dev_EditUser/" + params.row.id}>
    //             <button className="userListEdit">Edit</button>
    //           </Link>
    //         </>
    //       );
    //     },
    //   },
    ];
  
    return (
      <div className="userList" ref={wrapper}>  
        {/* <Link to="/dev_CreateUser">
          <button className="userAddButton">Create New User</button>
        </Link> */}
        <h1 className="newUserTitle">Edit for SUPER-ADMIN only</h1>
        <DataGrid
          rows={data}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8, 10, 20]}
          // checkboxSelection
        />
      </div>
    );
}

export default PolicyView;
