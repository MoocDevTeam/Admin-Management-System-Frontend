import { selectClasses } from "@mui/material";
import {createSlice} from "@reduxjs/toolkit";

const initialState ={
    currentCategories:[],
    breadcrumbs:[],
    modal:{
        ispen:false,
        isEdit:false,
        selectedCategory:null,
    }
}

const categorySlice = createSlice({
    name : "category",
    initialState,
    reducers:{
        setCurrentCategories:(state,action) => {
            state.currentCategories = action.payload;
        },
        addCategory(state, action) {
            state.currentCategories = [...state.currentCategories, action.payload]; 
          },
        addBreadcumbs:(state,action) => {
            state.breadcrumbs.push(action.payload);
        },
        removeLastBreadcrumb:(state)=>{
            state.breadcrumbs.pop()
        },
        openModal:(state,action) => {
            state.modal.isOpen = true;
            state.modal.isEdit = action.payload.isEdit || false;
            state.modal.selectedCategory = action.payload.selectedCategory || null;
        },
        closeModal:(state) =>{
            state.modal.isOpen = false;
            state.modal.isEdit = false;
            state.modal.selectedCategory = null;
        }
    }
});

export const {setCurrentCategories,addCategory,addBreadcumbs,removeLastBreadcrumb,openModal,closeModal}= categorySlice.actions;
export default categorySlice.reducer;

