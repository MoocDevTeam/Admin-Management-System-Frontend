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
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import colors from "../../theme";
// const initialMenus = [
//   { id: 1, name: "帮助中心", path: "/", level: 1 },
//   {
//     id: 2,
//     name: "标签管理",
//     path: "/tags",
//     level: 2,
//     parent: 1,
//     children: [
//       { id: 3, name: "查看详情", path: "/tags/details", level: 3, parent: 2 },
//       {
//         id: 4,
//         name: "导入导出",
//         path: "/tags/import-export",
//         level: 3,
//         parent: 2,
//       },
//       { id: 5, name: "批量操作", path: "/tags/batch", level: 3, parent: 2 },
//       { id: 6, name: "新增记录", path: "/tags/new", level: 3, parent: 2 },
//     ],
//   },
//   { id: 7, name: "分类管理", path: "/categories", level: 2, parent: 1 },
// ];

// 树形数据
const menuData = [
  {
    name: "帮助中心",
    path: "",
    level: 1,
    children: [
      {
        name: "标签管理",
        path: "",
        level: 2,
        children: [
          { name: "查看详情", path: "/查看详情", level: 3 },
          { name: "导入导出", path: "/导入导出", level: 3 },
          { name: "批量操作", path: "/批量操作", level: 3 },
          { name: "新增记录", path: "/新增记录", level: 3 },
        ],
      },
      {
        name: "分类管理",
        path: "",
        level: 2,
        children: [],
      },
    ],
  },
];

// 树形表格的行组件
const TreeNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false); // 展开/折叠状态
  const [isChecked, setIsChecked] = useState(false); // 复选框状态

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <tr>
        <td>
          {/* 展开/折叠按钮 */}
          {node.children && (
            <button onClick={toggleExpand}>{isExpanded ? "▼" : "▶"}</button>
          )}
        </td>
        {/* <td>
         <input type="checkbox" checked={isChecked} onChange={toggleCheck} />
        </td> */}
        <td>{node.name}</td>
        <td>{node.path}</td>
        <td>{node.level}</td>
        <td>{node.parent || "none"}</td>
      </tr>
      {/* 渲染子节点 */}
      {node.children && isExpanded && (
        <>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </>
      )}
    </>
  );
};

// 树形表格组件
const TreeTable = ({ data }) => {
  return (
    <table border="1" cellPadding="10" cellSpacing="0">
      <thead>
        <tr>
          <th>操作</th>
          <th>选择</th>
          <th>菜单名称</th>
          <th>路径</th>
          <th>层级</th>
          <th>上级菜单</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <TreeNode key={index} node={item} />
        ))}
      </tbody>
    </table>
  );
};

// 主组件
// const Menus = () => {
//   const { menuItems } = useSelector((state) => state.auth);
//   return (
//     <div>
//       <h1>菜单管理系统</h1>
//       <TreeTable data={menuItems} />
//     </div>
//   );
// };

// export default Menus;
const TableNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {node.children && (
            <button onClick={toggleExpand}>{isExpanded ? "▼" : "▶"}</button>
          )}
          {node.title}
        </TableCell>
        {/* <td>
         <input type="checkbox" checked={isChecked} onChange={toggleCheck} />
        </td> */}
        <TableCell>{node.route}</TableCell>
        <TableCell>{node.orderNum}</TableCell>
        <TableCell>{node.parentId || "none"}</TableCell>
        <TableCell>
          <IconButton color="success">
            <Add />
          </IconButton>
          <IconButton color="primary">
            <Edit />
          </IconButton>
          <IconButton color="error">
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
      {node.children && isExpanded && (
        <>
          {node.children.map((child, index) => (
            <TableNode key={index} node={child} />
          ))}
        </>
      )}
    </>
  );
};

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
          {/* {menuItems.map((menu, index) => (
            <TableRow key={index}>
              <TableCell>{menu.title}</TableCell>
              <TableCell>{menu.route}</TableCell>
              <TableCell>{menu.orderNum}</TableCell>
              <TableCell>
                {menu.parentId ? `ID: ${menu.parentId}` : ""}
              </TableCell>
              <TableCell>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
                <IconButton color="success">
                  <Add />
                </IconButton>
                <IconButton color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </Box>
  );
}

export default Menus;
