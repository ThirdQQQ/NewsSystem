import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd'
import moment from 'moment'
import axios from 'axios'
import {HeartOutlined} from '@ant-design/icons'

export default function NewsPreview(props) {
  const [newsInfo, setNewsInfo] = useState(null)
  // const [style, setStyle] = useState(0)
  const handleHeart = ()=>{
    setNewsInfo({
      ...newsInfo,
      star: newsInfo.star+1
    })
    axios.patch(`/news/${props.match.params.id}`, {
      star: newsInfo.star+1
    })
  }
  useEffect(() => {
    
    axios.get(`/news/${props.match.params.id}?&_expand=category&_expand=role`).then(
      res => {
        setNewsInfo({
          ...res.data,
          view: res.data.view+1
        })
        return res.data
      }
    ).then(res=>
      axios.patch(`/news/${props.match.params.id}`, {
        view: res.view+1
      })
    )
  }, [props.match.params.id])
  return (
    <div>
        {
        newsInfo && <div>
           <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={<div>
              {newsInfo.category.title} 
              <span style={{paddingLeft: '20px'}}>
                <HeartOutlined style={{color:"#eb2f96"}} onClick={()=>handleHeart()} />
              </span>
            </div>  }
      >   
             <Descriptions size="small" column={3}>
             <Descriptions.Item label="创建者">{ newsInfo?.author }</Descriptions.Item>
             <Descriptions.Item label="发布时间">{newsInfo.publishTime?moment(newsInfo?.publishTime).format("YYY/MMM/DD HH-mm:ss"):'-'}</Descriptions.Item>
             <Descriptions.Item label="区域">{ newsInfo.region }</Descriptions.Item>
             <Descriptions.Item label="访问数量"><span style={{ color: "green" } }>{ newsInfo.view }</span></Descriptions.Item>
             <Descriptions.Item label="点赞数量"><span style={{ color: "green" } }>{ newsInfo.star }</span></Descriptions.Item>
            <Descriptions.Item label="评论数量">0</Descriptions.Item>
            <Descriptions.Item label="文本内容"></Descriptions.Item>
            </Descriptions>
            <div dangerouslySetInnerHTML={{
              __html: newsInfo.content
            }} style={{ marginTop: '5px' }}>
          </div>
          </PageHeader>
          </div>
      }
    </div>
    
  )
}
