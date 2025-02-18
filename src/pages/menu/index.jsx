import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import Header from "../../components/header";

import { Table, Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Column } = Table;
function Menus() {
  const { menuItems } = useSelector((state) => state.auth);
  const [data, setData] = useState(generateKeys(menuItems));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);

  function generateKeys(data, parentKey = "") {
    return data.map((item, index) => {
      const key = parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`;
      return {
        ...item,
        key,
        children: item.children ? generateKeys(item.children, key) : [],
      };
    });
  }
  const menuDataWithKeys = generateKeys(menuItems);

  console.log("in menu index, get menu is:", menuDataWithKeys);
  const handleAdd = () => {
    form.resetFields();
    setEditingKey(null);
    setIsModalOpen(true);
  };
  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalOpen(true);
  };
  const handleDelete = (key) => {
    const deleteNode = (nodes) => {
      return nodes.filter((node) => {
        if (node.key === key) return false;
        if (node.children) node.children = deleteNode(node.children);
        return true;
      });
    };
    setData(deleteNode(data));
    message.success("Delete Success !");
  };
  const handleSave = () => {
    form.validateFields().then((values) => {
      const newData = [...data];
      const updateNode = (nodes) => {
        return nodes.map((node) => {
          if (node.key === editingKey) {
            return { ...node, ...values };
          }
          if (node.children) node.children = updateNode(node.children);
          return node;
        });
      };
      if (editingKey) {
        setData(updateNode(newData));
        message.success("Update Success !");
      } else {
        const newKey = `new-${Date.now()}`;
        const newNode = { key: newKey, ...values };
        setData([...newData, newNode]);
        message.success("Add Success !");
      }
      setIsModalOpen(false);
    });
  };

  return (
    <Box m="20px">
      <Header title="Menus" subtitle="Managing the menus" />
      <Box sx={{ mb: "15px" }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            type="primary"
            //icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{
              marginBottom: 16,
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: "400",
            }}
          >
            Add Root Menu
          </Button>
        </Stack>
      </Box>
      <Table
        dataSource={data}
        rowKey="key"
        expandable={{
          childrenColumnName: "children",
          defaultExpandAllRows: true,
        }}
      >
        <Column
          title="Menu Name"
          dataIndex="title"
          key="title"
          render={(text, record) => (
            <span
              style={{
                color: "#2E7C67",
              }}
            >
              {text}
            </span>
          )}
        />
        <Column title="Route" dataIndex="route" key="route" />
        <Column title="Level" dataIndex="orderNum" key="orderNum" />
        <Column title="Parent Menu" dataIndex="parentId" key="parentId" />
        <Column
          title="Operation"
          key="action"
          render={(_, record) => (
            <span>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={() => console.log("add child node")}
                style={{ color: "black" }}
              ></Button>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                style={{ color: "green" }}
              ></Button>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
                style={{ color: "red" }}
              ></Button>
            </span>
          )}
        />
      </Table>
      <Modal
        title={editingKey ? "Edit Menu" : "Add Menu"}
        visible={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="menuName"
            label="Menu Name"
            rules={[{ required: true, message: "Please enter the menu name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="path" label="Route">
            <Input />
          </Form.Item>
          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: "Please enter the level" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="parentMenu" label="Parent Menu">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Box>
  );
}

export default Menus;
