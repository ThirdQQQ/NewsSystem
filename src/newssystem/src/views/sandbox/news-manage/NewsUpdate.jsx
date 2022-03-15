import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { notification, Button, PageHeader, Steps, Form, Select, Input, message } from 'antd'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import style from './News.module.css'
import axios from 'axios'

const { Step } = Steps
const { Option } = Select


export default function NewsUpdate(props) {
  const [currentNum, setcurrentNum] = useState(0)
  const [categoryList, setcategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  // 提交
  const handleSave = (auditState) => {
    axios.patch(`/news/${props.match.params.id}`, {
      ...formInfo,
      'content': content,
      'auditState': auditState,
    }).then(res => {
      props.history.push(auditState === 0 ? '/news-manage/draft' : 'audit-manage.list')
      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0?'草稿箱':'审核列表中查看您的新闻'}`,
        placement:'bottomRight'
      });
    })
  }
  // 步骤跳转到下一步
  const handleNext = () => {
    if (currentNum === 0) {
      newsRef.current.validateFields().then(res => {
        setFormInfo(res)
        setcurrentNum(currentNum+1)
      }).catch(error=> {
        console.log(error);
      })
    } else {
      if (content === "" || content.trim==='<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        setcurrentNum(currentNum+1)
      }
    }
  }
  // 步骤跳转到上异步
  const handleLast = () => {
    setcurrentNum(currentNum-1)
  }
  const newsRef = useRef(null)
  useEffect(() => {
    axios.get('/categories').then(res=>
      setcategoryList(res.data)
    )
  }, [])

  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?&_expand=category&_expand=role`).then(
      res => {
        let { title, categoryId,content } = res.data
        newsRef.current.setFieldsValue({
          title,
          categoryId
        })
        setContent(content)
      }
    )
  }, [props.match.params.id])

  return (
    <div>
      <PageHeader
        className='site-page-header'
        title='更新新闻'
        subTitle='UPDATE'
        onBack={()=> props.history.goBack() }
      ></PageHeader>
      <Steps current={currentNum}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿，提交审核" />
      </Steps>

      
      {/* 显示 */}
      <div style={ {marginTop: '80px'} }>
        <div className={currentNum === 0 ? '' : style.active}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
            ref={ newsRef }
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[{ required: true, message: '请选择新闻分类' }]}
          >
            <Select>
                {
                  categoryList.map(item =>
                    <Option value={item.id} key={ item.id }
                    >{ item.title }</Option>
                  )
                }
            </Select>
          </Form.Item>
        </Form>
      </div>
        
      </div>
      <div className={currentNum === 1 ? '' : style.active}>
        <NewsEditor getContent={(value) => {
          console.log(value);
          setContent(value)
        }} content={content} ></NewsEditor>
      </div>

      <div style={ {marginTop: '80px'} }>
        {
          currentNum>0 &&
          <Button
            onClick={ handleLast }
          >上一步</Button>
        }
        {
          currentNum < 2 && 
          <Button type='primary'
            onClick={ handleNext }
          >下一步</Button>
        }
        {
          currentNum === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        }
  
        
      </div>
    </div>
  )
}
