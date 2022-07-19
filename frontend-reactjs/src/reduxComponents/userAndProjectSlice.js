import { createSlice } from '@reduxjs/toolkit'

//..define any global state here
const initialState = {
  currentUser:{
    userInfo: {
      id:"",
      username:"",
      email:"",
      policyId:"",
      avaPath:"",
      role:"",
      createdAt: "",
      updatedAt:"",
    },
    currentProject: {
      id: "",
      projectName: "",
      videoUrl: "",
      audioUrl: "",
      subData: "",
      status: "Draft",
      videoStorageName: "",
      audioStorageName: "",
      exportVideoName: "",
      exportVideoUrl: "",
      createdAt:"",
      updatedAt:"",
    },
  }

}

const userAndProjectSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    changeProjectName: (state, action) => {
      if(action.payload.projectName){ 
          state.currentUser.currentProject.projectName = action.payload.projectName
      }

    },

      setProjectVideoUrl: (state, action) => {
        if(action.payload.videoUrl){ 
            state.currentUser.currentProject.videoUrl = action.payload.videoUrl
        }
        if(action.payload.id){ 
          state.currentUser.currentProject.id = action.payload.id
        }
        if(action.payload.videoStorageName){ 
          state.currentUser.currentProject.videoStorageName = action.payload.videoStorageName
        }
      },

      setProjectAudioUrl: (state, action) => {
        if(action.payload.audioUrl){ 
            state.currentUser.currentProject.audioUrl = action.payload.audioUrl
        }
        if(action.payload.id){ 
          state.currentUser.currentProject.id = action.payload.id
        }
        if(action.payload.audioStorageName){ 
          state.currentUser.currentProject.audioStorageName = action.payload.audioStorageName
        }
      },

      setExportVideoUrl: (state, action) => {

        if(action.payload.exportVideoUrl){ 
          state.currentUser.currentProject.exportVideoUrl = action.payload.exportVideoUrl
        }
        if(action.payload.exportVideoName){ 
          state.currentUser.currentProject.exportVideoName = action.payload.exportVideoName
        }
        if(action.payload.status){ 
          state.currentUser.currentProject.status = action.payload.status
        }
      },

      setProjectSubData: (state, action) => {
        if(action.payload.subData){ 
            state.currentUser.currentProject.subData = action.payload.subData
        }
      },

      setUserInfo: (state, action) => {
        if(action.payload.userInfo){  
          
          //delete password field if exists for security
          if(action.payload.userInfo.password){
            delete action.payload.userInfo.password
          }
          state.currentUser.userInfo = action.payload.userInfo
        }
      },
      setCurrentProject: (state, action) => {
        if(action.payload.currentProject){        
            state.currentUser.currentProject = action.payload.currentProject
        }
      },
      resetCurrentProject:(state, action) => {
        let emptyProject= {
          id: "",
          projectName: "",
          videoUrl: "",
          audioUrl: "",
          subData: "",
          status: "Draft",
          videoStorageName: "",
          audioStorageName: "",
          exportVideoName: "",
          exportVideoUrl: "",
          createdAt:"",
          updatedAt:"",
        }
          state.currentUser.currentProject = emptyProject

      },

      resetCurrentUser:(state, action) => {
          state.currentUser = initialState.currentUser
      },

  }
});

export const { setProjectVideoUrl, setProjectAudioUrl, setProjectSubData, setUserInfo, setCurrentProject, 
  resetCurrentProject, setExportVideoUrl, resetCurrentUser, setTempBillingId, changeProjectName} =  userAndProjectSlice.actions;

//export current state
export const selectCurrentUser = state => state.currentUser.currentUser;    //slice name, then state

export default userAndProjectSlice.reducer


