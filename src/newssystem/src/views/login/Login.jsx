import React from 'react'
import { Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import mp4 from '../../asset/video/video.mp4'
import axios from 'axios'
export default function Login(props) {

    const onFinish = (values) => {
        console.log(values)

        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
            console.log(res.data)
            if(res.data.length===0){
                message.error("用户名或密码不匹配")
            }else{
                localStorage.setItem("token",JSON.stringify(res.data[0]))
                props.history.push("/")
            }
        })                                  
    }
    return (
        <div className='contain'> 
        <div className='mainContain'>
          <div className='videoContainer'>
            <video muted loop autoPlay className='video'>
              <source src={mp4} />
            </video>
          </div>
          <div className="formContainer">
              <div className="logintitle">新闻管理系统</div>
              <Form
                  name="normal_login"
                  onFinish={onFinish}
              >
                  <Form.Item
                      name="username"
                      rules={[{ required: true, message: 'Please input your Username!' }]}
                  >
                      <Input 
                      style={{width: '200px'}}
                      className="item-form1" 
                      prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Please input your Password!' }]}
                  >
                      <Input
                          prefix={<LockOutlined className="site-form-item-icon" />}
                          className="item-form2"
                          style={{width: '200px'}}
                          type="password"
                          placeholder="Password"
                      />
                  </Form.Item>
                  <Form.Item>
                      <button htmlType="submit" className="login-form-button">
                          Login
                   </button>
                  </Form.Item>
              </Form>
          </div>
          </div>
        </div>
    )
}
