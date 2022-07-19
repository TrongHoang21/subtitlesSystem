import { createSlice } from '@reduxjs/toolkit'
import parseSRT from 'parse-srt'

//..define any global state here
const initialState = {
    subData: ""          //resetIdByIndex(importedSubDataFromDataJS)
}

//Subdata redux used for in-app usage (UI), 
///only when contact with outsiders (like: export, save,..) then it will be merged to currentUser for performance

const subDataSlice = createSlice({
  name: 'subData',
  initialState,
  reducers: {
//BE CAREFUL, id !== array index, but get resetById below, so they work the same
//BE CAREFUL, id !== array index, but get resetById below, so they work the same
//BE CAREFUL, id !== array index, but get resetById below, so they work the same
      editSubItemText: (state, action) => {
          const currentId = action.payload.id;
          const currentText = action.payload.content;

        if(state.subData[currentId]){ 
            
            state.subData[currentId].text = currentText
        }
      },

      editSubItemStartTime: (state, action) => {
        const currentId = action.payload.id;
        const currentText = action.payload.content;

      if(state.subData[currentId]){
          state.subData[currentId].start = currentText
      } 
    },

    editSubItemEndTime: (state, action) => {
        const currentId = action.payload.id;
        const currentText = action.payload.content;

      if(state.subData[currentId]){ 
          state.subData[currentId].end = currentText
      } 
    },
 
    deleteSubItem: (state, action) => {
        const currentId = action.payload.id;

      if(state.subData[currentId]){ 
          state.subData.splice(currentId, 1);
          resetIdByIndex(state.subData)
          
      } 
    },

    addSubItemAfterId: (state, action) => {
      const currentId = action.payload.id;

    if(state.subData[currentId]){ 
      var newElement = {id: parseInt(currentId)+1, start: 0, end: 0, text: 'Insert text here'}
        //state.subData.splice(currentId+1, 0, newElement); //arr.splice(index, 0, item); will insert item into arr at the specified index (deleting 0 items first, that is, it's just an insert).
        state.subData.push(newElement);
        state.subData.sort(function compareFn(a, b){
          if(a.id > b.id)
            return 1; //b before a
          return -1; //a before b
        })
        resetIdByIndex(state.subData)
    } 
  },

  addSubItemLast: (state, action) => {
    var newElement = {id: 0, start: 0, end: 0, text: 'Insert text here'}
      state.subData.push(newElement);
      resetIdByIndex(state.subData)
},


      importSubData: (state, action) => {
        const newContent = action.payload.subData
          if(newContent){
              state.subData = parseSRTtoJSON(newContent)
              resetIdByIndex(state.subData)
          }
      },

      createNewSubData: (state, action) => {
        var newArr = [{id: 0, start: 0, end: 0, text: 'Insert text here'}]
        state.subData = newArr;
      },

      resetSubData: (state, action) => {
        console.log('subData reset call');
        state.subData = "" ;
      },

      

  }
});

export const { editSubItemText, editSubItemStartTime, editSubItemEndTime, deleteSubItem, 
  addSubItemAfterId, addSubItemLast, createNewSubData, importSubData, resetSubData
   } =
  subDataSlice.actions;

//export current state
export const selectSubData = state => state.subData.subData;    //slice name, then state

export default subDataSlice.reducer

function resetIdByIndex(data){ //Original lib start from 1, reset back to zero
    data.map((item, index) => (
        item.id = index
    ))
    return data
}

const parseSRTtoJSON = (srtData) => {
  var jsonSubs = parseSRT(srtData);
  return jsonSubs;
}

