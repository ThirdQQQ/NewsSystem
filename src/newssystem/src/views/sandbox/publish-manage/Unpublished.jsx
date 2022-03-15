import React from 'react'
import {Button} from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Published() {
  const { dataSource, handlePublish} = usePublish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource}
        button={(id) =>
        <Button onClick={() => handlePublish(id)}>
        </Button> }></NewsPublish>
    </div>
  )
}
