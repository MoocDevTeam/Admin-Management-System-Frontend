import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid,
} from '@mui/material';
import getRequest from '../../../request/getRequest';
import { useNavigate } from 'react-router-dom';

export const UserSelectDialog = ({ isOpen, onClose, onUserIdObtained }) => {
  const [userdata, setUserdata] = useState(null); // 初始为空，方便判断是否有搜索结果
  const [input, setInput] = useState('');

  // 更新用户数据
  const handleSetUserData = (data, username) => {
    setUserdata({...data, username});
  };

  // 更新输入框内容
  const handleSetInput = (e) => {
    setInput(e.target.value);
  };

  const navigate = useNavigate();
  const handleConfirm = () => { 
    if(userdata.id){
      navigate('/user/teacher/add');
    } else {
      alert('Please select a user');
    }
  };
  

  // 搜索用户
  const searchUser = async (name) => {
    if (!name.trim()) {
      alert('Please enter a valid name');
      return;
    }

    try {
      let result = await getRequest(`/user/Get/${name}`);
      console.log('get user id', result);
      if (result.status === 200) {
        onUserIdObtained(result.data.id);
        handleSetUserData(result.data);
        handleSetUserData(result.data, name);
      } else {
        alert('User not found');
        setUserdata(null); // 清空之前的搜索结果
      }
    } catch (error) {
      console.error('Error searching user:', error);
      alert('An error occurred while searching for the user');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <Box p={4}>
        {/* 搜索区域 */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <TextField
              fullWidth
              label="Search User"
              value={input}
              onChange={handleSetInput}
              variant="outlined"
              placeholder='Enter the name of the user you want to search'
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => searchUser(input)}
              sx={{
                height: '50px'
              }}
              
              
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {/* 搜索结果区域 */}
        {userdata && (
          <Box mt={4} >
            <Typography variant="h6" gutterBottom>
              Search Result
            </Typography>
            <Card
              sx={{
                maxWidth: 400,
                mx: 'auto',
                boxShadow: 3,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    userdata.image ||
                    'https://mui.com/static/images/cards/contemplative-reptile.jpg'
                  } // 动态显示图片或占位符
                  alt="User Image"
                />
                <CardContent>
                  <Typography variant="h3" textAlign="left" gutterBottom>
                   {userdata.username || 'No Name'}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>ID:</strong> {userdata.id || 'N/A'}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Email:</strong> {userdata.email || 'N/A'}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Status:</strong> {userdata.isActivce ?  'Active' : 'Inactive'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={onClose}
          >
            Close
          </Button>

        </Box>
          </Box>
        )}

        {/* 无结果提示 */}
        {!userdata && (
          <Box mt={4} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              No results found. Please search for a valid user.
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};
