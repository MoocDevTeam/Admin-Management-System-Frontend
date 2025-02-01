import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchUserByName, updateUser } from "../../feature/userSlice/userSlice";
import {
    Container,
    Typography,
    Box,
    TextField,
    Alert,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    FormHelperText,
} from "@mui/material";
import LoadingSpinner from '../../components/loadingSpinner';
import { getGenderName } from '../../components/util/gender';
import * as Yup from "yup";
import { useFormik } from "formik";

export default function UserProfile() {
    const dispatch = useDispatch();
    const { user, status, error } = useSelector((state) => state.user);
    const [isEditMode, setIsEditMode] = useState(false);
    const userName = localStorage.getItem("userName");

    const validationSchema = Yup.object({
        age: Yup.number()
            .required("Age is required")
            .min(1, "Age must be at least 1")
            .max(120, "Age must be at most 120"),
        gender: Yup.number().required("Gender is required"),
        email: Yup.string()
            .required("Email is required")
            .email("Invalid email format"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            age: user.age || "",
            gender: user.gender || "",
            email: user.email || "",
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                id: user.id,
                userName: user.userName,
                password: user.password,
                access: user.access,
                isActive: user.isActive,
                roleIds: user.roleIds || [],
                createdDate: user.createdDate,
                avatar: user.avatar || null,
                age: values.age,
                gender: values.gender,
                email: values.email,
            };
            dispatch(updateUser(payload));
            setIsEditMode(false);
        },
    });

    useEffect(() => {
        if (userName) {
            dispatch(fetchUserByName(userName));
        }
    }, [dispatch, userName]);

    return (
        <Container>
            <Typography variant="h4" sx={{ m: "0 0 24px 0" }}>User Profile</Typography>
            {status === 'loading' && <LoadingSpinner />}
            {status === 'failed' && (
                <Alert severity="error">{error || 'Failed to load user data'}</Alert>
            )}
            {status === 'succeeded' && (
                <>
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <TextField fullWidth label="Username" value={user.userName || ""} disabled={true} />
                        <TextField
                            fullWidth
                            label="Age"
                            name="age"
                            type="number"
                            value={formik.values.age}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.age && Boolean(formik.errors.age)}
                            helperText={formik.touched.age && formik.errors.age}
                            disabled={!isEditMode}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            disabled={!isEditMode}
                        />
                        <FormControl fullWidth required disabled={!isEditMode} error={formik.touched.gender && Boolean(formik.errors.gender)}>
                            <InputLabel id="gender-select-label">Gender</InputLabel>
                            <Select
                                labelId="gender-select-label"
                                label="Gender"
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value={0}>{getGenderName(0)}</MenuItem>
                                <MenuItem value={1}>{getGenderName(1)}</MenuItem>
                                <MenuItem value={2}>{getGenderName(2)}</MenuItem>
                            </Select>
                            {formik.touched.gender && formik.errors.gender && (
                                <FormHelperText>{formik.errors.gender}</FormHelperText>
                            )}
                        </FormControl>

                        {isEditMode && (
                            <Button color="primary" variant="contained" sx={{ m: "24px 0 0 0" }} type="submit">
                                Save
                            </Button>
                        )}
                    </Box>

                    {!isEditMode && (
                        <Button
                            color="secondary"
                            variant="contained"
                            sx={{ m: "24px 0 0 0" }}
                            onClick={() => {
                                setIsEditMode(true);
                            }}
                        >
                            Edit
                        </Button>
                    )}
                </>
            )}
        </Container>
    );
}