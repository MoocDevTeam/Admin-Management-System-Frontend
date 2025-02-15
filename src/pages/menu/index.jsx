import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useSelector } from "react-redux";
import Header from "../../components/header";
import colors from "../../theme";
import TableNode from "./tableNode";

function Menus() {
  const [menus, setMenus] = useState();
  const { menuItems } = useSelector((state) => state.auth);
  console.log("in menus:", menuItems);

  return (
    <Box m="20px">
      <Header title="Menus" subtitle="Managing the menus" />
      <Box sx={{ mb: "15px" }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" sx={{}}>
            Add Root Menu
          </Button>
        </Stack>
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: colors.primary[400] }}>
            <TableCell>Menu Name</TableCell>
            <TableCell>Route</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Parent Menu</TableCell>
            <TableCell>Operation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuItems.map((item, index) => (
            <TableNode key={index} node={item} />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default Menus;
