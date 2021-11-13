import React from "react";
import {Layout, Menu, Breadcrumb, Avatar, Modal} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import {Route, Redirect, Switch} from "react-router-dom";
import ProblemList from "../../components/problemlist/problemList";
import './home.css'
import UserInfo from "../../components/userinfo/userinfo";
import Welcome from "../../components/welcome/welcome";
import ProblemDetail from "../../components/problemdetail/problemdetail";
import Userinfochange from "../../components/userinfo/Userinfochange";
import {connect} from "react-redux";
import UploadProblem from "../../components/uploadproblem/uploadproblem";

const {Header, Content, Footer, Sider} = Layout;


class HomePage extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            IsModalVisible: false,
            avatarConfirmLoading:false,
            avatarConfirmText:'',
        };
    }

    showModal = () => {
        this.setState({IsModalVisible: true})
        this.setState({avatarConfirmLoading: true})
        this.setState({avatarConfirmText: '3'})
        this.setState({avatarConfirmLoading: false})
        this.setState({avatarConfirmText: 'ok'})
        // setTimeout(()=>{
        //     this.setState({avatarConfirmText: '2'})
        //     setTimeout(()=>{
        //         this.setState({avatarConfirmText: '1'})
        //         setTimeout(()=>{
        //             this.setState({avatarConfirmLoading: false})
        //             this.setState({avatarConfirmText: 'ok'})
        //         },1000)
        //     },1000)
        // }, 1000);
    }


    handleCancel = () => {
        this.setState({IsModalVisible: false})
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({collapsed});
    }

    handleOk = () => {
        this.setState({IsModalVisible: false})
        localStorage.removeItem('jwt')
        this.props.history.replace('/auth/login')
    }

    avatarClick = () => {
        this.showModal()
    }
    render() {
        const isAdmin=(this.props.userinfo.privilege===1);
        const {collapsed} = this.state;
        let postProblem;
        if (isAdmin){
            postProblem =  <Menu.Item key="3" icon={<DesktopOutlined/>}>上传题目</Menu.Item>
        }else {
            postProblem = <div></div>
        }
        return (
            <div>
                <Layout style={{minHeight: '100vh'}}>
                    <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                        <div className="logo" style={{textAlign: "center", lineHeight: '20px%'}}>GroundHog OJ</div>
                        <Menu theme="dark" mode="inline" onSelect={(info) => {
                            switch (info.key) {
                                case '1':
                                    this.props.history.push(`/home/userinfo`);
                                    break;
                                case '2':
                                    this.props.history.push(`/home/problems`);
                                    break;
                                case '3':
                                    this.props.history.push(`/home/upload`);
                                    break;
                                default:
                                    console.log('default')
                                    break;
                            }
                        }}>
                            <Menu.Item key="1" icon={<PieChartOutlined/>}>
                                用户信息
                            </Menu.Item>
                            <Menu.Item key="2" icon={<DesktopOutlined/>}>
                                题目列表
                            </Menu.Item>
                            {postProblem}
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background"
                                style={{padding: 0, paddingTop: '15px', paddingRight: '3%'}}>
                            <div onClick={this.avatarClick}>
                                <Avatar className="avatar" src="https://joeschmoe.io/api/v1/random"/>
                            </div>
                            <Modal title="退出" visible={this.state.IsModalVisible} onOk={this.handleOk}
                                   onCancel={this.handleCancel} confirmLoading={this.state.avatarConfirmLoading} okText={this.state.avatarConfirmText}>

                                <p>确定要退出吗？</p>

                            </Modal>
                        </Header>
                        <Content style={{margin: '0 16px'}}>
                            <Breadcrumb style={{margin: '16px 0'}}>
                                <Breadcrumb.Item> </Breadcrumb.Item>
                            </Breadcrumb>

                            <div className="site-layout-background" style={{padding: 24, height: '100%'}}>
                                <Switch>
                                    <Route exact path="/home/userinfo/moddify" component={Userinfochange}/>
                                    <Route exact path="/home/userinfo" component={UserInfo}/>
                                    <Route exact path="/home/problem/detail" component={ProblemDetail}/>
                                    <Route path="/home/problems" component={ProblemList}/>
                                    <Route path="/home/upload" component={UploadProblem}/>
                                    <Route path="/home/welcome" component={Welcome}/>
                                    <Redirect to='/home/welcome'/>
                                </Switch>

                            </div>
                        </Content>
                        <Footer>Created by Gruop3</Footer>
                    </Layout>
                </Layout>
            </div>

        );
    }
}

export default connect(
    state=>({userinfo:state.userinfo}),
    )(HomePage);
