import React from 'react'
import { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from '../../views/sandbox/home/Home'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import axios from 'axios'

function NewsRouter(props) {
  const routerMap = {
    '/home': Home,
    '/user-manage/list': UserList,
    '/right-manage/role/list': RoleList,
    '/right-manage/right/list': RightList,
    '/news-manage/preview/:id': NewsPreview,
    '/news-manage/add': NewsAdd,
    '/news-manage/draft': NewsDraft,
    '/news-manage/category': NewsCategory,
    '/news-manage/update/:id': NewsUpdate,
    '/audit-manage/audit': Audit,
    '/audit-manage/list': AuditList,
    '/publish-manage/unpublished': Unpublished,
    '/publish-manage/published': Published,
    '/publish-manage/sunset': Sunset
  }
  const [backRouteList, setBackRouteList] = useState([])
  const { role:{ rights } } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])

  const checkRoute = (item) => {
    return routerMap[item.key] && (item.pagepermisson || item.routepermisson)
   }
  const checkUserPermission = (item) => { 
    return rights.includes(item.key)
  }
  return (
    <div>
      <Spin size="large" spinning={props.isLoading}>
        <Switch>
          {
            backRouteList.map(item => {
              if (checkRoute(item) && checkUserPermission(item)) {
                return <Route key={item.key} path={item.key} component={routerMap[item.key]} exact />
              } else {
                return null
              }
            }
            )
          }
          <Redirect from="/" to="/home" exact />
          <Route path="*" component={Nopermission} />
         </Switch>
       </Spin>
    </div>
  )
}

const mapStateToProps = ({LoadingReducer: {isLoading}})=>{
 return{
  isLoading
 }
}

// const mapStateTo

export default connect(mapStateToProps)(NewsRouter)
