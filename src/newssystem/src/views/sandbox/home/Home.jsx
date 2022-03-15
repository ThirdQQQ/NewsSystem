import React, {useState, useEffect, useRef} from 'react'
import { Row, Col, Card, List, Avatar, Drawer } from 'antd';
import axios from 'axios'
import {SettingOutlined, EditOutlined, EllipsisOutlined} from '@ant-design/icons'
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;

export default function Home() {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const {username, region, role:{roleName}} = JSON.parse(localStorage.getItem('token'))
  const [visible, setVisible] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const [allList, setAllList] = useState([])
  const barRef = useRef()
  const pieRef = useRef()
  
  useEffect(() => {
    axios.get(`/news?piblishedState=2&_expand=category&_sort=view&_limit=6&_order=desc`).then(res=>{
      setviewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news?piblishedState=2&_expand=category&_sort=star&_limit=6&_order=desc`).then(res=>{
      setstarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news?piblishedState=2&_expand=category`).then(res=>{
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setAllList(res.data)
    })

    return ()=>{
      window.onresize = null
    }
  }, [])

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = ()=>{
    setVisible(false);
  }

  const renderBarView = (obj)=>{
    var myChart = echarts.init(barRef.current)
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '新闻分类'
        },
        tooltip: {},
        legend: {
          data: ['数量']
        },
        xAxis: {
          data: Object.keys(obj),
          axisLabel:{
            interval: 0
          }
        },
        yAxis: {minInterval:1},
        series: [
          {
            name: '数量',
            type: 'bar',
            data: Object.values(obj).map(item => item.length)
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      window.onresize= ()=>{
        myChart.resize()
      }
  }

    const renderPieView = (obj) => {
      let myChart
      let currentList = allList.filter(item => item.author === username)
      let groupOnj = _.groupBy(currentList, item => item.category.title)
      const list = []
      for(let i in groupOnj){
        list.push({
          name: i,
          value: groupOnj[i].length,

        })
      }
      console.log(list);
      if (!pieChart) {
        myChart = echarts.init(pieRef.current)
        setPieChart(myChart)
      }else{
        myChart=pieChart
      }
      let option = {
        title:{
          text: '当前用户新闻发布图示'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '发布数量',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: list
          }
        ]
      };
      
      myChart.setOption(option);

      window.onresize= ()=>{
        myChart.resize()
      }
    } 
    return (
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户常用浏览" bordered={false}>
            <List
               size="small"
               bordered
               dataSource={viewList}
               renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="点赞最多浏览" bordered={false}>
              <List
                 size="small"
                 bordered
                 dataSource={starList}
                 renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                />
            </Card>
          </Col>
          <Col span={8}>
          <Card
           cover={
             <img
               alt="example"
               src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
             />
           }
           actions={[
             <SettingOutlined key="setting"  onClick={()=>
              {
                setTimeout(() => {
                  showDrawer()
                  renderPieView()
                }, 0);
                }}
              />,
             <EditOutlined key="edit" />,
             <EllipsisOutlined key="ellipsis" />,
           ]}
         >
           <Meta
             avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
             title={username}
             description={<div>
               <b >
                 {region ? region: '全球'}
               </b>
               <span style={{paddingLeft:'30px'}}>{roleName}</span>
             </div>}
           />
         </Card>
         </Col>
        </Row>
        <div ref={barRef} style={{
            width:'100%',
            height: '400px',
            marginTop: '30px',
            paddingTop: '30px'
          }}>
          
        </div>
        <Drawer 
        width='500px'
        height='100%'
        title="个人新闻分类" 
        placement="right" 
        onClose={onClose} 
        visible={visible}
        >
        <div ref={pieRef} style={
          {
            width: '100%',
            height: '400px',
            marginTop: '30px'
          }
        }
        
        >
          
        </div>
      </Drawer>
    </div>
    )
}
