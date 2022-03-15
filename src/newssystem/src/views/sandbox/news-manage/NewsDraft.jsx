import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, notification } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function RoleList(props) {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          render: (id) => {
              return <b>{id}</b>
          }
        },
        {
          title: '新闻标题',
          dataIndex: 'title',
          render: (title,item) => {
            return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
          }
        },
        {
          title: '作者',
          dataIndex: 'author'
        },
        {
          title: '分类',
          dataIndex: 'category',
          render: (category)=> {
            return category.title
          }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                  <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                  <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
                      props.history.push(`/news-manage/update/${item.id}`)
                  }} />
                  <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)} />
                </div>
            }
        }
  ]
  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      props.history.push('/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以到审核列表中查看您的新闻`,
        placement:'bottomRight'
      });
    })
  }

  const confirmMethod = (item) => {
        // console.log(item)
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                //   console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });

    }
    //删除
    const deleteMethod = (item) => {
        // console.log(item)
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
    }

    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
          const list = res.data
            setdataSource(list)
        })
    }, [username])

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                rowKey={(item) => item.id}></Table>

        </div>
    )
}
