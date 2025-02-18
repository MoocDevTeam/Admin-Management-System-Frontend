import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  // Table,
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
import { Table } from "antd";

function Menusold() {
  const [menus, setMenus] = useState();
  const { menuItems } = useSelector((state) => state.auth);
  console.log("in menus:", menuItems);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    // {
    //   title: 'Permission',
    //   dataIndex: 'permission',
    //   key: 'permission',
    // },
    // {
    //   title: 'Menu Type',
    //   dataIndex: 'menuType',
    //   key: 'menuType',
    // },
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   key: 'description',
    // },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Order Number",
      dataIndex: "orderNum",
      key: "orderNum",
    },

    // {
    //   title: "Component Path",
    //   dataIndex: "componentPath",
    //   key: "componentPath",
    // },
    {
      title: "Parent Menu",
      dataIndex: "parentId",
      key: "parentId",
    },
  ];

  const generateKeys = (data, parentKey = "") => {
    return data.map((item, index) => {
      const key = parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`;
      return {
        ...item,
        key,
        children: item.children ? generateKeys(item.children, key) : [],
      };
    });
  };

  const menuDataWithKeys = generateKeys(menuItems);

  console.log("in menu index,get menu is:", menuDataWithKeys);

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
      <Table
        dataSource={menuDataWithKeys}
        columns={columns}
        rowKey="key"
        pagination={true}
        expandable={{
          childrenColumnName: "children",
          defaultExpandAllRows: true,
        }}
      />
      {/* <Table>
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
      </Table> */}
    </Box>
  );
}

export default Menusold;
