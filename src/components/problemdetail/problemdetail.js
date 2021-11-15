import {
    message,
    Descriptions,
    Popconfirm,
    Button,
    Affix,
    BackTop, Spin
} from 'antd';
import React, {useState} from 'react';
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import * as querystring from "querystring";
import {HOST_URL} from "../../utils/utils";
import {connect} from "react-redux";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
const markdown = `
# Head1
## Head2
### Head3
A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`
class ProblemDetail extends React.Component {

    constructor(props) {
        super(props);
        this.setState({})
        this.state = {
            loading:false,
            id: '',
            name: '',
            content: '',
            difficulty: '',
            answer: '',
        }
        let id = querystring.parse(this.props.history.location.search.substr(1)).id
        this.setState({id: id})
        axios.get(
            HOST_URL + '/api/programs/' + id,
            {
                headers: {
                    'Authorization': localStorage.getItem('jwt')
                }
            }
        ).then(res => {
            console.log(res.data)
            if (res.data.err === 'ok') {
                this.setState({
                    ...res.data
                })
            }
        }).catch(err => {
            console.log(err.response)
        })
    }

    handleContent = e => {
        this.setState({
            answer: e.target.value
        })
    }

    confirm = e => {
        this.setState({
            loading:true
        })
        axios.post(
            HOST_URL + '/api/programsDocker/' + this.state.id,
            {
                program_id: this.state.id,
                user_id: this.props.userinfo.id,
                answerCode: this.state.answer
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('jwt') || '',
                }
            },
        ).then(res => {
            this.setState({
                loading:false
            })
            // console.log(Res.data.status)
            if (res.data.err === 'ok') {
                if (res.data.status === 'pass') {
                    message.success('答案正确');
                   // this.props.history.push('/home/problems')
                }else{
                    console.log(res.data)
                    if (res.data.status === 'wrong answer') {
                        message.warning('答案错误');
                    }else{
                        message.warning('编译错误\n'+res.data.data);
                    }
                }
            } else {
                message.error('提交失败');
            }
        }).catch(err => {
            this.setState({
                loading:false
            })
            message.error('网络请求失败');
            console.log(err)
        })
    }

    render() {
        return (
            <Spin spinning={this.state.loading} delay={500}>
                <div>
                    {/*题目信息*/}
                    <Descriptions
                        bordered
                        column={{xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}
                        datSource={this.state.data}
                    >
                        <Descriptions.Item label="题目序号">{this.state.id}</Descriptions.Item>
                        <Descriptions.Item label="题目名称">{this.state.name}</Descriptions.Item>
                        <Descriptions.Item label="题目难度">{this.state.difficulty}</Descriptions.Item>
                        <Descriptions.Item label="题目内容">
                            <ReactMarkdown children={this.state.content} remarkPlugins={[remarkGfm]} />
                        </Descriptions.Item>
                    </Descriptions>

                    {/*答案 富文本框*/}
                    <TextArea placeholder={"请输入您的答案"} rows={40} showCount value={this.state.answer} allowClear
                              onChange={this.handleContent}/>
                    <br/>
                    {/*提交按钮*/}
                    <Affix offsetBottom={10}>
                        <Popconfirm
                            title={"确认提交答案吗"}
                            onConfirm={this.confirm}
                            okText={"确认"}
                            cancelText={"取消"}
                        >
                            <Button type={"primary"}>提交</Button>
                        </Popconfirm>
                    </Affix>
                    {/*点击回到顶部*/}
                    <BackTop>
                        <strong>BackTop</strong>
                    </BackTop>
                </div>
            </Spin>


        );
    }
}

export default connect(state => ({userinfo: state.userinfo}),
    {},)(ProblemDetail)
