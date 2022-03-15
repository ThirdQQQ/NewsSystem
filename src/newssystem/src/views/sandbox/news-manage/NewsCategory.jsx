import React, { useState, useEffect, useRef, useContext } from 'react'
import { Button, Table, Modal, Form, Input } from 'antd'
import NewsForm from '../../../components/news-manage/NewsForm'
import axios from 'axios'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

export default function NewsCategory() {
    const [dataSource, setdataSource] = useState([])
    const [isAddVisible, setisAddVisible] = useState(false)
    const addForm = useRef(null)
    useEffect(() => {
        axios.get("/categories").then(res => {
            const list = res.data
            setdataSource(list)
        })
    }, [])
  
  const handleSave = (record) => {
    setdataSource(dataSource.map(item => {
      if (item.id === record.id) {
        return {
          id: item.id,
          title: record.title,
          value: record.title
        }
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.title
    })
  }


    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          render: (id) => {
            return <b>{id}</b>
          }
        },
        {
          title: "新闻名称",
          dataIndex: 'title',
          onCell: (record) => ({
            record,
            editable: true,
            dataIndex: 'title',
            title: '栏目名称',
            handleSave: handleSave,
          }),
          render: (title) => {
            return <b>{ title }</b>
           }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />
                </div>
            }
        }
    ];

    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });

    }
    //删除
    const deleteMethod = (item) => {
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/categories/${item.id}`)
    }

  const addFormOK = () => {
        addForm.current.validateFields().then(value => {
            setisAddVisible(false)
            addForm.current.resetFields()
            //post到后端，生成id，再设置 datasource, 方便后面的删除和更新
          axios.post(`/categories`, {
            ...value,
            'value': value.title
          }

          
            ).then(res=>{
                setdataSource([...dataSource,{
                    ...res.data,
                }])
            })
        }).catch(err => {
            console.log(err)
        })
  }
  
  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };


    return (
        <div>
        <Button type="primary" onClick={() => {
          setisAddVisible(true)
        }} disabled={JSON.parse(localStorage.getItem('token')).role.roleName === '超级管理员' ? false:true }>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
            rowKey={item => item.id}
          components={
            {
              body: {
                row: EditableRow,
                cell: EditableCell,
              }
            }
          }
            />

            <Modal
                visible={isAddVisible}
                title="添加新闻种类"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setisAddVisible(false)
                }}
          onOk={() => addFormOK()}>
          <NewsForm ref={ addForm }></NewsForm>
            </Modal>
        </div>
    )
}
