import {List, Avatar, Divider, Space, Input, Button, message} from 'antd';
import React from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import {HOST_URL} from "../../utils/utils";
import jwt_decode from "jwt-decode";
import {UPDATE_USER_INFO} from "../../redux/constant";
import {connect} from "react-redux";

const {Search} = Input;


class ProblemList extends React.Component {

    state = {
        allproblems: [],
        problems: [],
        records: [],
        pass: [],
        loading: false,
        hasMore: true,
    };
    onSearch = value => {
        let id = parseInt(value);
        let result = []
        let reg = new RegExp('.*' + value + '.*')
        console.log(value)
        console.log()
        // search by id
        // search by title
        // search by difficulty
        for (let j = 0; j < this.state.allproblems.length; j++) {
            if ((id && this.state.allproblems[j].program_id === id) ||
                reg.test(this.state.allproblems[j].program_name) ||
                this.state.allproblems[j].difficulty === value
            ) {
                result.push(this.state.allproblems[j])
            }
        }

        this.setState({problems: result})

    }

    constructor(props) {
        super(props);
        axios.get(HOST_URL + '/api/programs', {
                headers: {
                    'Authorization': localStorage.getItem('jwt') || '',
                }
            }
        ).then(res => {
            console.log(res.data)
            if (res.data.err === 'ok') {
                this.setState({
                    allproblems: res.data.programs,
                    problems: res.data.programs,
                })
            } else {
                alert("获取数据出错")
            }

        }).catch(err => {
            console.log("failed to get problem list")
            console.log(err.response)
        })
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
                for (let j = 0; j < res.data.records.length; j++) {
                    if (res.data.records[j].status === 'pass') {
                        this.state.pass.push(res.data.records[j].program_id)
                    }
                }
            }
            this.setState({records: res.data.records})
        }).catch(err => {
            console.log(err.response)
        })

    }

    render() {
        return (
            <div>
                <Search placeholder="搜索题目 id/标题/难度" onSearch={this.onSearch} style={{width: 350, paddingLeft: '45px'}}/>
                <List
                    itemLayout={"horizontal"}
                    dataSource={this.state.problems}
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 15,
                    }}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar
                                    src={this.state.pass.indexOf(item.program_id) !== -1 ? "/right.png" : "/wrong.png"}/>}
                                title={
                                    <Link to={'/home/problem/detail?id=' + item.program_id}>

                                        <Space split={<Divider type="vertical"/>} size={"large"}>
                                            {"题目" + item.program_id + "： " + " " + item.program_name}
                                            {"难度：" + item.difficulty}
                                        </Space>
                                    </Link>
                                }
                            />
                            <Button onClick={(event) => {
                                console.log(item.program_id)
                                axios.delete(
                                    HOST_URL + '/api/programs/' + item.program_id,
                                    {
                                        headers: {
                                            'Authorization': localStorage.getItem('jwt')
                                        }
                                    }
                                ).then(res => {
                                    console.log(res.data)
                                    if (res.data.err === 'ok') {
                                        message.info("删除成功").then(null)
                                    } else {
                                        message.info("删除失败").then(null)
                                    }
                                }).catch(err => {
                                    console.log("删除失败")
                                })
                            }}>删除</Button>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default connect(state => ({userinfo: state.userinfo}),
    {},)(ProblemList)
