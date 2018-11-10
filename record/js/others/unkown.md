```

  import React, {Component} from 'react';
  import PropTypes from 'prop-types';
  import {connect} from 'dva';
  import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Radio,
    Select,
    Table,
    Icon,
    Switch,
    DatePicker,
    TimePicker,
    Row,
    Col,
    Pagination,
  } from "antd";
  import {getRecordList,exportRecordList} from '../../services/Records'
  import {RecordDetail} from '../../components/CallingTask/Modal'
  import {getTaskCallDetail, updateTaskCall,} from '../../services/CallingTask'
  import queryString from 'query-string'
  import {sanityParam,} from "../../utils/common";
  import {calloutUrl,} from "../../config";

  const { RangePicker } = DatePicker;
  const FormItem = Form.Item;
  const Option = Select.Option;
  const Search = Input.Search;

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
  };
  class Records extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        filters: {
          status: undefined,
          task: undefined,
          tel: null,
          intention: null,
          result: null,
          startTime: null,
          endTime: null,
          minDuration: null,
          maxDuration: null,
          minReplyNum: null,
          maxReplyNum: null
        },
        detailModal: {
          id: null,
          open: false,
          title: '',
          data: {},
          onOk: () => {
            this.setState({
              detailModal: {
                ...this.state.detailModal,
                open: false
              }
            });
          },
          onClose: () => {
            this.setState({
              detailModal: {
                ...this.state.detailModal,
                open: false
              }
            });
          }
        },
        pagination: {total: 0, pageSize: 10, current: 1, offset: 0},
        list: [],
      }
    }
    componentWillMount() {
      //获取任务列表
      this.props.dispatch({
        type: 'callingTask/taskList',
        payload: {}
      });
      //获取状态列表
      this.props.dispatch({
        type: 'callingTask/statusList',
        payload: {}
      });
      //获取拨打结果列表
      this.props.dispatch({
        type: 'callingTask/resultList',
        payload: {}
      });
      //获取用户意向列表
      this.props.dispatch({
        type: 'callingTask/intentionList',
        payload: {}
      })
      this.getRenderData();
    }
    getRenderData = (params) => {
      const {filters, pagination} = this.state;
      const rawParams = {
        ...filters,
        ...pagination,
        ...params,
      };
      getRecordList(sanityParam(rawParams)).then(res => {
        if(res && res.data && res.data.code == 0){
          this.setState({
            list: res.data.data.list,
            pagination: {...this.state.pagination, total: res.data.data.total}
          });
        }else {
          message.error(res.data.msg || '列表数据请求出错')
        }
      })
    }
    onChange = (value, dateString) => {
      // console.log('Selected Time: ', value);
      // console.log('Formatted Selected Time: ', dateString);
    }
    onOk = ([start, end]) => {
     this.setState({
       filters: {
         ...this.state.filters,
         startTime: start,
         endTime: end
       }
     });
    }
    onDurationChange = (type,value) => {
      const {minDuration, maxDuration} = this.state.filters;
      this.setState({
        filters: {
          ...this.state.filters,
          minDuration: type == 'min' ? value : minDuration,
          maxDuration: type == 'max' ? value : maxDuration,
        }
      });
    }
    onReplyNumChange = (type,value) => {
      const {minReplyNum, maxReplyNum} = this.state.filters;
      this.setState({
        filters: {
          ...this.state.filters,
          minReplyNum: type == 'min' ? value : minReplyNum,
          maxReplyNum: type == 'max' ? value : maxReplyNum,
        }
      });
    }
    onStatusChange = (val) => {
      this.setState({
        filters: {
          ...this.state.filters,
          status: val,
        }
      });
    }
    onTaskChange = (val) => {
      this.setState({
        filters: {
          ...this.state.filters,
          task: val
        }
      });
    }
    telChange = (e) => {
      this.setState({
        filters: {
          ...this.state.filters,
          tel: e.target.value,
        }
      });
    }
    onIntentionChange = (val) => {
      this.setState({
        filters: {
          ...this.state.filters,
          intention: val,
        }
      });
    }
    onResultChange = (val) => {
      this.setState({
        filters: {
          ...this.state.filters,
          result: val,
        }
      });
    }
    exportTable = () => {
      const {filters,} = this.state;
      const rawParams = {
        ...filters,
        offset: 0,
        pageSize: 1000,
        export: 1
      };
      const searchStr = queryString.stringify(sanityParam(rawParams));
      window.open(calloutUrl + 'record/list?' + searchStr);
    }
    showDetail = (record) => {
      getTaskCallDetail({taskId:record.taskId, tel:record.tel, recordId: record.id}).then((res) => {
        if(res && res.data && res.data.code === 0) {
          this.setState({
            detailModal: {
              ...this.state.detailModal,
              id: record.tel,
              open: true,
              editable: false,
              title: <div>通话详情&nbsp;<a href="javascript:void(0);" onClick={this.handleEdit.bind(null,record)}>编辑</a></div>,
              data: res.data.data
            }
          })
        } else {
          message.error(res.data.msg || '数据请求失败')
        }
      })
    }
    handleEdit = (record) => {
      this.setState({
        detailModal: {
          ...this.state.detailModal,
          editable: true,
          onEdit: (params) => {
            updateTaskCall({...params,recordId: record.id, taskId: record.taskId }).then(res => {
              if(res && res.data && res.data.code === 0) {
                message.success('修改成功');
                this.setState({
                  detailModal: {
                    ...this.state.detailModal,
                    editable: false,
                    open: false
                  }
                });
              }else {
                message.error(res.data.msg || '修改失败')
              }
            })

          },
        }
      })
    }
    handleSearch = () => {
       this.getRenderData({offset:0,current:1})
    }
    handlePaginationChange = (page) => {
      this.setState({
        pagination: {
          ...this.state.pagination,
          current: page,
          offset: page - 1,
        }
      }, () => {
        this.getRenderData()
      })
    }
    render() {
      const {taskList,taskResults,taskStatus,intentions} = this.props;
      const {filters,list,pagination} = this.state;
      const {status,task,tel,intention,result,startTime,endTime,minDuration,maxDuration,minReplyNum,maxReplyNum} = filters;
      const columns = [{
        title: '电话号码',
        dataIndex: 'tel',
        key: 'tel'
      },{
        title: '拨打结果',
        dataIndex: 'callResult',
        key: 'callResult'
      },{
        title: '客户意向',
        dataIndex: 'intention',
        key: 'intention'
      },{
        title: '话术模版',
        dataIndex: 'taskTemp',
        key: 'taskTemp'
      },{
        title: '任务',
        dataIndex: 'taskName',
        key: 'taskName'
      },{
        title: '通话时长(秒)',
        dataIndex: 'callDuration',
        key: 'callDuration'
      },{
        title: '用户回复数',
        dataIndex: 'replyNum',
        key: 'replyNum'
      },{
        title: '拨打时间',
        dataIndex: 'callTime',
        key: 'callTime'
      },,{
        title: '操作',
        render: (text, record) => (
          <span className="table_handle table-action">
            <a href="javascript:void(0)" onClick={this.showDetail.bind(null, record)}>查看</a>
          </span>
        ),
      }];
      return (
        <div>
          <div className="breadcrumb">
            <h3 className="breadcrumb_title">通话记录</h3>
          </div>
          <div>
            <div className="panel">
              <section className="panel_bd">
                <main className="panel_aside">
                  <section className="panel_hd" style={{border: 0}}>
                    <div className="panel_filter">
                      <Form style={{width:'100%'}}>
                        <Row>
                          <Col span={12}>
                            <FormItem
                              {...formItemLayout}
                              label="拨打时间："
                            >
                              <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['Start Time', 'End Time']}
                                onChange={this.onChange}
                                onOk={this.onOk}
                              />
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem
                              {...formItemLayout}
                              label="通话时长(单位:秒)："
                            >
                              <InputNumber min={0} style={{width: 140}} onChange={this.onDurationChange.bind(null,'min')}/>
                              <span className="form-divide">~</span>
                              <InputNumber min={0} style={{width: 140}} onChange={this.onDurationChange.bind(null,'max')}/>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <FormItem
                              {...formItemLayout}
                              label="任务："
                            >
                              <Select
                                showSearch allowClear
                                style={{width: 140, marginRight: 20}}
                                placeholder="全部状态"
                                optionFilterProp="children"
                                onChange={this.onStatusChange}
                                value={status}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0}
                              >
                                {
                                  taskStatus.map((item,index) => {
                                    return <Option key={'status_' + index} value={item.id}>{item.name}</Option>
                                  })
                                }
                              </Select>
                              <Select
                                showSearch allowClear
                                style={{width: 140}}
                                placeholder="全部任务"
                                optionFilterProp="children"
                                onChange={this.onTaskChange}
                                value={task}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0}
                              >
                                {
                                  taskList.map((item,index) => {
                                    return <Option key={'task_' + index} value={item.id}>{item.name}</Option>
                                  })
                                }
                              </Select>
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem
                              {...formItemLayout}
                              label="用户回复数："
                            >
                              <InputNumber min={0} style={{width: 140}} onChange={this.onReplyNumChange.bind(null,'min')}/>
                              <span className="form-divide">~</span>
                              <InputNumber min={0} style={{width: 140}} onChange={this.onReplyNumChange.bind(null,'max')}/>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <FormItem
                              {...formItemLayout}
                              label="用户意向："
                            >
                              <Select
                                showSearch allowClear
                                style={{width: 140}}
                                placeholder=""
                                optionFilterProp="children"
                                onChange={this.onIntentionChange}
                                value={intention}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0}
                              >
                                {
                                  intentions.map((item,index) => {
                                    return <Option key={'intention_' + index} value={item.id}>{item.name}</Option>
                                  })
                                }
                              </Select>
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem
                              {...formItemLayout}
                              label="电话号码："
                            >
                              <Input onChange={this.telChange}/>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <FormItem
                              {...formItemLayout}
                              label="拨打结果："
                            >
                              <Select
                                showSearch allowClear
                                style={{width: 140}}
                                placeholder=""
                                optionFilterProp="children"
                                onChange={this.onResultChange}
                                value={result}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0}
                              >
                                {
                                  taskResults.map((item,index) => {
                                    return <Option key={'result_' + index} value={item.id}>{item.name}</Option>
                                  })
                                }
                              </Select>
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem
                              {...formItemLayout}
                              label=" "
                             >
                              <Button key="submit" type="primary" size="large" onClick={this.handleSearch}>查询</Button>,
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>

                    </div>

                    <div style={{'textAlign': 'right'}}>
                      <a href="javascript:void (0);" onClick={this.exportTable}><i className="iconfont icon-excel" style={{marginRight: 5}}></i>导出到excel</a>
                    </div>
                  </section>
                  <div className="panel_main_main">
                    <div className="panel_content">
                      <Table locale={{
                        emptyText: '暂无数据'
                      }} columns={columns} dataSource={list} pagination={false} rowKey={(record,index) => index}/>
                    </div>
                  </div>
                  <div className="panel_footer">
                    <div className="panel_footer_main">
                    </div>
                    <div className="panel_footer_aside">
                      <Pagination showTotal={(total, range) => `共 ${total} 条`}
                                  onChange={this.handlePaginationChange} {...pagination} showQuickJumper/>
                    </div>
                  </div>
                </main>
              </section>
            </div>
          </div>
          <RecordDetail {...this.state.detailModal} />
        </div>
      );
    }
  }

  Records.propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
  };
  function mapStateToProps(state) {
    const {taskStatus,taskList,taskResults,intentions,} = state.callingTask
    return {
      taskStatus,
      taskList,
      taskResults,
      intentions,
    };
  }

  export default connect(mapStateToProps)(Records)


```
