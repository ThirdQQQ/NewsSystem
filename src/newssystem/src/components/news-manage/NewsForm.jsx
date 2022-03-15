import React, { forwardRef} from 'react'
import {Form,Input} from 'antd'
const UserForm = forwardRef((props,ref) => {  
    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
            name="title"
            label="新闻名称"
            rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>
        </Form>
    )
})
export default UserForm