import { Dialog } from '@mui/material'
import { useFormik } from 'formik';
import React from 'react'
import * as Yup from "yup";

export const UpdateTeacher = ({open, onClose, data}) => {
    console.log(data);
    const formik = useFormik({
      initialValues: {
        title: data?.title ||"",
        department: data?.department || "",


        
      },
      validationSchema:{},
      onSubmit: () => {console.log("123")}







      });
  return (
    <Dialog open={open} onClose={onClose}>

      




        {"12312"}
        {data&&data.introduction}
        This is a dialog!
    </Dialog>
  )
}
// 