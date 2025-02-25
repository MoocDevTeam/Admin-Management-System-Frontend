import React, { useState, useEffect } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Box, Button, Checkbox, Dialog } from "@mui/material";
import getRequest from "../../request/getRequest";
function PermissionTree({ onOpen, onClose }) {
  const [checked, setChecked] = useState([]);
  const [indeterminate, setIndeterminate] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [defaultCheckedIds, setDefaultCheckedIds] = useState([]);
  const [buttonTotalData, setButtonTotalData] = useState([]);
  const [allButtonIds, setAllButtonIds] = useState([]);

  useEffect(() => {
    async function getMenu() {
      const res = await getRequest("menu/GetMenuTree");
      if (res.isSuccess) {
        setMenuItems(res.data);
        console.log("res.data is:", res.data);
        let menuData = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].children.length > 0) {
            for (let j = 0; j < res.data[i].children.length; j++) {
              if (res.data[i].children[j].menuType === 2) {
                menuData.push(res.data[i].children[j]);
              }
            }
          }
        }
        console.log("menu Data is:", menuData);
        const allMenuIds = menuData.map((node) => node.id);
        console.log("all menu ids are:", allMenuIds);

        let buttonData = [];
        for (let i = 0; i < menuData.length; i++) {
          if (menuData[i].children.length > 0) {
            for (let j = 0; j < menuData[i].children.length; j++) {
              if (menuData[i].children[j].menuType === 3) {
                buttonData.push(menuData[i].children[j]);
              }
            }
          }
        }

        console.log("button data is", buttonData);
        setButtonTotalData([...buttonData]);
        let buttonIds = buttonData.map((node) => node.id);
        setAllButtonIds([...buttonIds]);
        console.log("all button ids are:", buttonIds);

        const defaultCheckedIds = buttonData
          .filter((node) => {
            if (node.permission == null) {
              return false;
            }
            const permissionArray = node.permission.split(".");
            console.log("permission array is:", permissionArray);
            if (node.title === permissionArray[permissionArray.length - 1]) {
              return true;
            } else {
              return false;
            }
          })
          .map((node) => node.id);
        console.log("default selected ids are:", defaultCheckedIds);
        setChecked(defaultCheckedIds);
        setDefaultCheckedIds(defaultCheckedIds);
      }
    }
    getMenu();
  }, []);

  const getChangedNodes = () => {
    const addedNodes = checked.filter((id) => !defaultCheckedIds.includes(id));
    const removedNodes = defaultCheckedIds.filter(
      (id) => !checked.includes(id)
    );
    return { addedNodes, removedNodes };
  };

  const handleSave = () => {
    const { addedNodes, removedNodes } = getChangedNodes();
    console.log("Added Nodes:", addedNodes);
    console.log("Removed Nodes:", removedNodes);
    if (addedNodes.length === 0 && removedNodes.length === 0) {
      return;
    }
    console.log("in handle save, all button ids:", allButtonIds);
    onClose();
  };

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
    console.log("in handleCheck node is:", node);
    console.log("in handleCheck, before isChecked:", isChecked);
    const newChecked = new Set(checked);
    updateChildren(node, isChecked, newChecked);
    updateParent(node, newChecked);
    console.log("in handleCheck, newChecked:", newChecked);
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
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSave}>
            OK
          </Button>
          {/* <Button variant="contained" color="success" onClick={()=>onClose({status:'ok',permission:checked})}>
            OK
          </Button>
          <Button variant="outlined" color="error" onClick={()=>onClose({status:'cancel'})}>
            CANCEL
          </Button> */}
        </Box>
      </Box>
    </Dialog>
  );
}

export default PermissionTree;
