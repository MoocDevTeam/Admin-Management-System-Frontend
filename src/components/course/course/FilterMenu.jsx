import { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import colors from "../../../theme";

const FilterMenu = ({ categories, handleChipClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category, index) => {
    setSelectedCategory(category);
    handleChipClick(index)
    handleMenuClose();
  };

  return (
    <>
      <Button
        variant="filled"
        onClick={handleMenuOpen}
        startIcon={<FilterListIcon />}
        sx={{
          backgroundColor: colors.primary[400],
          border: `1px solid ${colors.primary[700]}`
        }}
      >
        {selectedCategory?.categoryName ? `Filter: ${selectedCategory.categoryName}` : "Select Category"}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleCategorySelect("All Courses", null)}>
          All Courses
        </MenuItem>
        {categories.map((category, index) => (
          <MenuItem key={category.id} onClick={() => handleCategorySelect(category, index)}>
            {category.categoryName}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default FilterMenu