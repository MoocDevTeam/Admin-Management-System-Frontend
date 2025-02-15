import React, { useState } from "react";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
function TableNode({ node }) {
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
            // <button onClick={toggleExpand}>{isExpanded ? "▼" : "▶"}</button>
            <button onClick={toggleExpand}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
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
}

export default TableNode;
