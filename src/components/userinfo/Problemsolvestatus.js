import React from 'react';
import echarts from 'echarts/lib/echarts';
import { Card } from 'antd'
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import ReactEcharts from 'echarts-for-react'
import {connect, useSelector} from "react-redux";
import axios from "axios";
import {HOST_URL} from "../../utils/utils";

class Userinfochart extends React.Component {
    state ={
        Pass : 0,
        NotPass: 0,
    }
    constructor(props) {
        super(props);
        axios.get(
            HOST_URL + '/api/records/' + this.props.userinfo.id,
            {
                headers: {
                    'Authorization': localStorage.getItem('jwt')
                }
            }
        ).then(res => {
            console.log(res.data)
            if (res.data.err === 'ok') {
                let localPass = 0;
                let localNotPass = 0;
                for (let j = 0; j < res.data.records.length; j++) {
                    if (res.data.records[j].status === 'pass') {
                        localPass+=1;
                    }else{
                        localNotPass+=1;
                    }
                }
                this.setState({Pass:localPass,NotPass:localNotPass})
            }
            console.log(this.state.Pass)
            console.log(this.state.NotPass)
        }).catch(err => {
            console.log(err.response)
        })
    }

    getOption = ()=>{
        let option = {
            title: {
                text: '做题情况',
                x: 'center'
            },
            tooltip : {
                trigger: 'item',
                //提示框浮层内容格式器，支持字符串模板和回调函数形式。
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                top: 20,
                right: 4,
                data: ['通过','没过']
            },
            series : [
                {
                    name:'做题情况',
                    type:'pie',
                    data:[
                        {value:this.state.Pass, name:'通过'},
                        {value:this.state.NotPass, name:'没过'},
                    ],
                }
            ]
        }
        console.log(this.state.Pass)
        console.log(this.state.NotPass)
        return option;
    }
    render() {
        return (
            <ReactEcharts option={this.getOption()} style={{
                height: 400,
            }}/>
        );
    }
}

export default connect(state => ({userinfo: state.userinfo}),
    {},)(Userinfochart)