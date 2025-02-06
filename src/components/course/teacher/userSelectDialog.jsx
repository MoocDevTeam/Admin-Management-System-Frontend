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

export const UserSelectDialog = ({ isOpen, onClose }) => {
  //set the default state for the user data
  const [userdata, setUserdata] = useState(null); 
  const [input, setInput] = useState('');

  //update the user data by adding the username to the data
  const handleSetUserData = (data, username) => {
    setUserdata({...data, username});
  };

  // update the input value
  const handleSetInput = (e) => {
    setInput(e.target.value);
  };

  const navigate = useNavigate();
  const handleConfirm = () => { 
    if(userdata.id){
      navigate('/teacher/add', {state: {userId: userdata.id}});
    } else {
      alert('Please select a user');
    }
  };
  
  // search for the user by name
  const searchUser = async (name) => {
    if (!name.trim()) {
      alert('Please enter a valid name');
      return;
    }

    try {
      let result = await getRequest(`/user/Get/${name}`);
      console.log('get user id', result);
      if (result.status === 200) {
        handleSetUserData(result.data);
        handleSetUserData(result.data, name);
      } else {
        setUserdata(null); // clear the user data when no user is found
      }
    } catch (error) {
      console.error('Error searching user:', error);
      alert('An error occurred while searching for the user');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <Box p={4}>
        {/* search section */}
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

        {/* search result */}
        {userdata && (
          <Box mt={4} >
            <Typography variant="h4" gutterBottom>
              User Information:
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
                  } // default image this part will be modified later when user can offer the own avatar url
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

        {/* Result display for bad request */}
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
