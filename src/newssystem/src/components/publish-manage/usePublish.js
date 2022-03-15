import { useEffect, useState } from "react"
import axios from "axios"
import { notification } from 'antd'

function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setdataSource] = useState([])
  const handlePublish = (id) => {

    setdataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`/news/${id}`, {
      'publishState': 2,
      'publishTime':Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已经发布】查看`,
        placement:'bottomRight'
      });
    })
  }
  const handleDelete = (id) => {
    setdataSource(dataSource.filter(item => item.id !== id))
    axios.delete(`/news/${id}`).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您已删除新闻`,
        placement:'bottomRight'
      });
    })
    
   }
  const handleSunset = (id) => {
    setdataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`/news/${id}`, {
      'publishState': 3,
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已下线】查看`,
        placement:'bottomRight'
      });
    })
  }
  const handlePrePublish = (id) => {
    setdataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`/news/${id}`, {
      'publishState': 2,
      'publishTime':Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您已重新上线，可以到【发布管理/已经发布】查看`,
        placement:'bottomRight'
      });
    })
  }

  useEffect(() => {
    // 1未发布 2已发布 3下线

    axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(
      res => {
        setdataSource(res.data)
      }
    )

  }, [username, type])


  return {
    dataSource,
    handlePublish,
    handleDelete,
    handleSunset,
    handlePrePublish 
  }
}

export default usePublish