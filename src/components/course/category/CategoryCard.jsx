import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import toast from "react-hot-toast";
import {
  openModal,
  setCurrentCategories,
} from "../../../store/categorySlice";
import { useSelector, useDispatch } from "react-redux";
import deleteRequest from "../../../request/delRequest";



const ITEM_HEIGHT = 48;

export default function CategoryCard({ categoryName, description, imageUrl, subCategoryCounts, onClick, categoryId }) {


  const dispatch = useDispatch();
  const { currentCategories } = useSelector((state) => state.category);
 

  const handleDelete = async () => {

    const category = currentCategories.find((cat) => cat.id === categoryId);
   
    if (category && category.childrenCategories?.length > 0) {
      toast.error("Cannot delete a category that has subcategories.");
      return;
    }
    
      try {
      const response = await deleteRequest(`/Category/Delete/${categoryId}`);
      console.log("Delete Response:", response);
      if (response.isSuccess) {
        toast.success("Category deleted successfully!");
        const updatedCategories = currentCategories.filter((cat) => cat.id !== categoryId);
        dispatch(setCurrentCategories(updatedCategories));
      } else {
        console.error("Error from backend:", response);
        toast.error(response.message || "Failed to delete category.");
      }
    } catch (error) {
      console.error("Error in catch block:", error);
      toast.error("Failed to delete category.");
    }
    
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleButtonClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ maxWidth: 300 }}>

      <CardHeader
        action={
          <><IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleButtonClick}>
            <MoreVertIcon />
          </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                },
              }}
            >
              <MenuItem onClick={()=>dispatch(
                openModal({
                  isEdit:true,
                  selectedCategory:{
                    id:categoryId,
                    categoryName,
                    description,
                    imageUrl
                  }
                })

              )} >Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu></>
        }
        title={categoryName}
        subheader={`Includes a total of ${subCategoryCounts} subcategories`}

      />
      < CardActionArea onClick={onClick} >
        <CardMedia
          component="img"
          height="194"
          image={imageUrl}
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

}

      

