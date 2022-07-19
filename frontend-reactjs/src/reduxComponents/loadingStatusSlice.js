import { createSlice } from '@reduxjs/toolkit'

//..define any global state here
const initialState = {
    color:'#20E391',
    size: '15px',
    isLoading: false,
    loadingMessage: ""
}


const loadingStatusSlice = createSlice({
    name: 'loadingStatus',
    initialState,
    reducers: {
        setAll: (state, action) => {
            if(action.payload.loadingMessage) state.loadingMessage = action.payload.loadingMessage
            if(action.payload.isLoading) state.isLoading = action.payload.isLoading
            if(action.payload.color) state.color = action.payload.color
            if(action.payload.size) state.size = action.payload.size

        },

        setSize: (state, action) => {
            state.size = action.payload.size;  
        },

        setIsLoading: (state, action) => {
            state.isLoading = action.payload.isLoading;  
        },

        setColor: (state, action) => {
            state.color = action.payload.color;  
        },

        setLoadingMessage: (state, action) => {
            state.loadingMessage = action.payload.loadingMessage;  
        },


        hide: (state, action) => {
            state.loadingMessage = ""
            state.isLoading = false
            state.color = '#20E391'
            state.size = '15px'
        },
    }
});

export const {setAll, setSize, setIsLoading, setColor, setLoadingMessage, hide} = loadingStatusSlice.actions

//export current state
export const selectLoadingStatus = (state) => state.loadingStatus;

export default loadingStatusSlice.reducer
