import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import Header from "../../components/header";

import { Table, Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import getRequest from "../../request/getRequest";
import postRequest from "../../request/postRequest";
import { TreeSelect } from 'antd';
import { Select } from 'antd';
import { InputNumber } from "antd";
const { Column } = Table;

function Menus() {
  //const { menuItems } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
  // const menuDataWithKeys = generateKeys(menuItems);
  // console.log("in menu index, get menu is:", menuDataWithKeys);
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
  const handleSave = async () => {
    try {

      let values = await form.validateFields();

      let resp = await postRequest('/Menu/Add', {
        ParentId: selectParentId == 0 ? null : selectParentId,
        title: values.menuName,
        Route: values.path,
        Permission: values.Permission,
        MenuType: +selectMenuTypeValue,
        OrderNum: values.OrderNum,
        ComponentPath: values.ComponentPath
      });
      if (resp.isSuccess) {
        setRefresh(!refresh);
      }
      setSelectParentId(0);
      debugger
      // const newData = [...data];
      // const updateNode = (nodes) => {
      //   return nodes.map((node) => {
      //     if (node.key === editingKey) {
      //       return { ...node, ...values };
      //     }
      //     if (node.children) node.children = updateNode(node.children);
      //     return node;
      //   });
      // };
      // if (editingKey) {
      //   setData(updateNode(newData));
      //   message.success("Update Success !");
      // } else {
      //   const newKey = `new-${Date.now()}`;
      //   const newNode = { key: newKey, ...values };
      //   setData([...newData, newNode]);
      //   message.success("Add Success !");
      // }
      setIsModalOpen(false);
    } catch (e) {

    }
  };
  useEffect(() => {
    async function getMenu() {
      const res = await getRequest("menu/GetMenuTree");
      if (res.isSuccess) {
        setData(generateKeys(res.data));
        setSelectTreeData(res.data);
        // tmpMenuList = [];
        // let tmpMemuList = buildSelect(res.data);
        // setSelectMemu(tmpMemuList);
        // console.log("res.data is:", res.data);
        // console.log("tmpMemuList:", tmpMemuList);
      }
    }
    getMenu();

    async function getMenuType() {
      const res = await getRequest("menu/GetMenuType");
      if (res.isSuccess) {
        if (res.data.items) {
          setSelectMenuTypes(res.data.items);
          setDefalutSelectMenuType(res.data.items[0].value);
          setSelectMenuTypeValue(res.data.items[0].value);
        } else {
          setDefalutSelectMenuType('');
          setSelectMenuTypes([]);
          setSelectMenuTypeValue('');
        }
      }
    }
    getMenuType();

  }, [refresh]);

  const [selectParentId, setSelectParentId] = useState(0);
  const [selectTreeData, setSelectTreeData] = useState([]);

  const onChange = (value) => {
    setSelectParentId(value);
    console.log(`selected ${value}`);
  };


  const [defalutSelectMenuType, setDefalutSelectMenuType] = useState('');
  const [selectMenuTypeValue, setSelectMenuTypeValue] = useState('');
  const [selectMenuTypes, setSelectMenuTypes] = useState([]);

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const handleSelectMenuTypeChange = (value) => {
    //setSelectMenuTypeValue(value);
  }

  const [orderNum, setOrderNum] = useState(0);
  const onOrderNumChange = (value) => {
    setOrderNum(value);
  }

  const [selectMemu, setSelectMemu] = useState([]);

  let tmpMenuList = [];
  function buildSelect(menuList, level = 0) {
    menuList.forEach(element => {
      const sp = '--'.repeat(level);
      tmpMenuList.push({ value: element.id, label: sp + element.title });
      if (element.children && element.children.length > 0) {
        buildSelect(element.children, level + 1); // Corrected increment
      }
    });
    return tmpMenuList;
  }


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
        <Form form={form} layout="vertical"
          initialValues={{
            OrderNum: '0',
            menuType: 'Directory'
          }}>
          <Form.Item name="parentMenu" label="Parent Menu">
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={selectParentId}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
              onChange={onChange}
              treeData={selectTreeData}
              fieldNames={{ label: 'title', value: 'id', children: 'children' }}
            />
          </Form.Item>
          <Form.Item
            name="menuName"
            label="Menu Name"
            rules={[{ required: true, message: "Please enter the menu name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="Permission" label="Permission">
            <Input />
          </Form.Item>
          <Form.Item name="menuType" label="Menu Type"
            rules={[{ required: true, message: "Please enter the menu type" }]}
          >
            <Select
              defaultValue={defalutSelectMenuType}
              value={selectMenuTypeValue}
              style={{ width: '100%' }}
              onChange={handleSelectMenuTypeChange}
              options={selectMenuTypes}
            />
          </Form.Item>
          <Form.Item name="OrderNum" label="OrderNum">
            <InputNumber min={0} max={10000} defaultValue={0} value={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="Route" label="Route">
            <Input />
          </Form.Item>
          <Form.Item name="ComponentPath" label="ComponentPath">
            <Input />
          </Form.Item>

        </Form>
      </Modal>
    </Box>
  );
}

export default Menus;
