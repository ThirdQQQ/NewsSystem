import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Published() {
  const { dataSource, handleDelete, handlePrePublish} = usePublish(3)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><span>
        <Button danger onClick={()=>handleDelete(id)}>
            删除
        </Button>
        <Button type= 'primary' onClick={()=>handlePrePublish(id)}>
            重新上线
        </Button>
      </span>}>
      </NewsPublish>
    </div>
  )
}
