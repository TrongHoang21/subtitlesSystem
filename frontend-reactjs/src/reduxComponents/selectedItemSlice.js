import { createSlice } from '@reduxjs/toolkit'



//..define any global state here
const initialState = {
    selectedItem:""
}

const selectedItemSlice = createSlice({
  name: 'selectedItem',
  initialState,
  reducers: {
      changeItem: (state, action) => {
          state.selectedItem = action.payload.selectedItem
      },

      resetSelectedItem: (state, action) => {
        console.log('SelectedItem reset on leaving');
        state.selectedItem = "" ;
      },
  }
});

export const {changeItem, editItem, resetSelectedItem} = selectedItemSlice.actions

//export current state
export const selectSelectedItem = state => state.selectedItem.selectedItem;    //slice name, then state

export default selectedItemSlice.reducer;

