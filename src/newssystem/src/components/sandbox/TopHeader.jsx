import React from 'react'
import { Layout, Dropdown,Menu ,Avatar} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props) {
    const changeCollapsed = () => {
        props.changeCollapsed()
    }

    const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))

    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger onClick={()=>{
                localStorage.removeItem("token")
                // console.log(props.history)
                props.history.replace("/login")
            }}>退出</Menu.Item>
        </Menu>
    );

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                props.isCollapse ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <div style={{ float: "right" }}>
              <span>欢迎<span style={ {'color': 'blue' } }>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>

    )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapse } }) => {
  return {
    isCollapse
  } 
}

const mapDispatchToprops ={
  changeCollapsed() {
    return {
      type: 'change_collapsed',
    }
  }
}
// connect(mapStateToProps  mapDispatchToprops)(被包装的组件)
export default connect(mapStateToProps, mapDispatchToprops)(withRouter(TopHeader))