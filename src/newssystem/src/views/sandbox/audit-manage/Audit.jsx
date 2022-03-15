import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Table, Button, notification } from 'antd'
import {CloseOutlined, CheckOutlined } from '@ant-design/icons'

export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      setDataSource(roleObj[roleId] === 'superadmin' ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
      ])
    })
  }, [roleId, region, username])

  const handleAudit = (item, num1, num2) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`,{
      auditState: num1,
      publishState: num2
    }).then(res =>
      notification.info({
        message: `通知`,
        description:
          `您可以到【审核管理/审核列表中】查看您的新闻的审核状态`,
        placement:'bottomRight'
      })
    )
  }
  
  const columns = [
    {
        title: '新闻标题',
        dataIndex: 'title',
        render: (title, item) => {
          return <a href={`#/news-manage/preview/${item.id}` }>{title}</a>
        }
    },
    {
        title: '作者',
        dataIndex: 'author'
    },
    {
        title: "新闻分类",
        dataIndex: 'category',
        render: (category) => {
            return <div>
              { category.title }
            </div>
        }
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          {/* 后面的数字用于修改audit状态 */}
          <Button type='primary' icon={<CheckOutlined />} shape='circle' onClick={()=> handleAudit(item, 2, 1) }></Button>
          <Button danger icon={ <CloseOutlined /> } shape='circle' onClick={()=> handleAudit(item, 3, 0) }></Button>
        </div>
        }
      }
  ];
  return (
    <div>
      <Table
        dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id }
      />
    </div>
  )
}
