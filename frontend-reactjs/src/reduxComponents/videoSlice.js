import { createSlice } from '@reduxjs/toolkit'

//..define any global state here
const initialState = {
    videoPath:''
}


const videoSlice = createSlice({
    name: 'myVideoPath',
    initialState,
    reducers: {
        setVideoPath: (state, action) => {
            // if (state.videoPath === ""){
            //     state.videoPath = handleSpecialCharSlash(`${BASE_URL_GET_VIDEO}${action.payload}`);    
            // }
            state.videoPath = action.payload
          //  console.log(state.videoPath)
          //  console.log('video sau if roi ne')
        },

        resetVideoPath: (state, action) => {
  
            state.videoPath = "";  
          
        }
    }
});

export const {setVideoPath, resetVideoPath} = videoSlice.actions

//export current state
export const selectVideoPath = (state) => state.videoPath.videoPath;

export default videoSlice.reducer
