import React, { useState } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Box, Button, Checkbox, Dialog } from "@mui/material";
import { useSelector } from "react-redux";

function PermissionTree({ onOpen, onClose }) {
  const [checked, setChecked] = useState([]);
  const [indeterminate, setIndeterminate] = useState([]);

  const { menuItems } = useSelector((state) => state.auth);
  const updateChildren = (node, isChecked, checkedSet) => {
    const traverse = (n) => {
      if (isChecked) {
        checkedSet.add(n.id);
      } else {
        checkedSet.delete(n.id);
      }
      if (n.children && n.children.length > 0) {
        n.children.forEach(traverse);
      }
    };
    traverse(node);
  };

  const updateParent = (node, checkedSet) => {
    const traverse = (parentNode) => {
      if (!parentNode) return;

      const allChildrenChecked = parentNode.children.every((child) =>
        checkedSet.has(child.id)
      );
      const anyChildChecked = parentNode.children.some(
        (child) => checkedSet.has(child.id) || indeterminate.includes(child.id)
      );

      if (allChildrenChecked) {
        checkedSet.add(parentNode.id);
        setIndeterminate((prev) => prev.filter((id) => id !== parentNode.id));
      } else if (anyChildChecked) {
        setIndeterminate((prev) => [...new Set([...prev, parentNode.id])]);
        checkedSet.delete(parentNode.id);
      } else {
        setIndeterminate((prev) => prev.filter((id) => id !== parentNode.id));
        checkedSet.delete(parentNode.id);
      }

      const grandParent = findParent(menuItems, parentNode.id);
      if (grandParent) traverse(grandParent);
    };

    const parentNode = findParent(menuItems, node.id);
    traverse(parentNode);
  };

  const findParent = (nodes, childId, parent = null) => {
    for (const node of nodes) {
      if (node.id === childId) {
        return parent;
      }
      if (node.children) {
        const foundParent = findParent(node.children, childId, node);
        if (foundParent) return foundParent;
      }
    }
    return null;
  };

  const handleCheck = (node, isChecked) => {
    const newChecked = new Set(checked);
    updateChildren(node, isChecked, newChecked);
    updateParent(node, newChecked);
    setChecked([...newChecked]);
  };

  const renderTree = (nodes) =>
    nodes.map((node) => (
      <TreeItem
        key={node.id}
        itemId={node.id.toString()}
        label={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              size="small"
              checked={checked.includes(node.id)}
              indeterminate={indeterminate.includes(node.id)}
              onChange={(e) => handleCheck(node, e.target.checked)}
            />
            <span>{node.title}</span>
          </div>
        }
      >
        {node.children && node.children.length > 0 && renderTree(node.children)}
      </TreeItem>
    ));

  return (
    <Dialog open={onOpen} onClose={onClose}>
      <Box sx={{ p: 2, width: 300, border: "1px solid #ccc", borderRadius: 2 }}>
        <SimpleTreeView>{renderTree(menuItems)}</SimpleTreeView>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="success" onClick={onClose}>
            OK
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            CANCEL
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default PermissionTree;
