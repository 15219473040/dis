```
import React, { Component } from 'react';
import { connect } from 'dva';
import Echarts from '../libs/Echarts';
import moment from 'moment';
import { Tabs, Select, Form, DatePicker, Table, Popover, Button, Icon } from 'antd';
import { chartNoData, createOperationChartOpt, disabledDate } from '../../utils/common';
import { getExcel } from '../../utils/request';
import { devUrl } from '../../config';

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

const operations = null;
const analyseColumns = [{
  title: '排名',
  dataIndex: 'key',
}, {
  title: '类别',
  dataIndex: 'name',
}, {
  title: '反馈数',
  dataIndex: 'num',
}, {
  title: '占比',
  dataIndex: 'per',
}];
const pieChartsOption = {
  color: ['#53b2b0', '#97c79b', '#e5a2c0', '#a48bb9', '#8faad6', '#e49557', '#eeb763', '#51b5e9', '#da5b5a', '#666666'],
  tooltip: {
    trigger: 'item',
    formatter: '类别{a} <br/>{b} : {c} ({d}%)',
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};

const CHANNELS = [{
  name: '全部',
  value: '-2',
}, {
  name: '未知',
  value: '-1',
}, {
  name: '问答API',
  value: '0',
}, {
  name: '公众号',
  value: '1',
}, {
  name: '桌面网站',
  value: '2',
}, {
  name: '移动网站',
  value: '3',
}];

const analyseTabs = [{
  alias: 'realTimeData',
  title: '实时数据',
  children: [{
    title: '知识点排行',
    index: 'realTimeStandProblems',
  }, {
    title: '问题排行',
    index: 'realTimeProblems',
  }, {
    title: '类别排行',
    index: 'realTimeClass',
  }],
}, {
  alias: 'historyData',
  title: '历史数据',
  children: [{
    title: '知识点排行',
    index: 'historyStandProblems',
  }, {
    title: '问题排行',
    index: 'historyProblems',
  }, {
    title: '类别排行',
    index: 'historyClass',
  }, {
    title: '人工不满意分析',
    index: 'serviceUnSatisfactions',
  }],
}];

class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      popOverViseble: {
        realTimeData: false,
        historyData: false,
      },
      dataChangeTimes: 0,
      tabClickTimes: 0,
      timeRange: [moment().subtract(8, 'days'), moment().subtract(1, 'days')], // start, end:
      channels: {
        realTimeData: undefined,
        historyData: undefined,
      },
    };
  }

  componentWillMount() {
    this.getRealTimeData();
    this.getHistoryData();
  }

  componentWillReceiveProps(next) {
    if (next.overviewData !== this.props.overviewData || next.serviceQualityData !== this.props.serviceQualityData) {
      this.setState({
        dataChangeTimes: this.state.dataChangeTimes + 1,
      });
    }
  }
  //  获取历史问题分析数据
  getHistoryData = () => {
    //  历史数据
    const start = moment().subtract(8, 'days').format('YYYYMMDD');
    const end = moment().subtract(1, 'days').format('YYYYMMDD');
    const payload = { startDate: start, endDate: end, channel: -2 };
    this.props.dispatch({
      type: 'operation/getCateRank',
      payload,
    });
    this.props.dispatch({
      type: 'operation/getStandQuestionRank',
      payload,
    });
    this.props.dispatch({
      type: 'operation/getQuestionRank',
      payload,
    });
    this.props.dispatch({
      type: 'operation/getServiceUnSatisfactionRank',
      payload,
    });
  }
  //  获取实时问题分析数据
  getRealTimeData = () => {
    const payload = { channel: -2 };
    // 实时数据
    this.props.dispatch({
      type: 'operation/getCateRankRealTime',
      payload,
    });
    this.props.dispatch({
      type: 'operation/getStandQuestionRankRealTime',
      payload,
    });
    this.props.dispatch({
      type: 'operation/getQuestionRankRealTime',
      payload,
    });
  }
  //  标签切换
  tabClicked = () => {
    this.setState({
      tabClickTimes: this.state.tabClickTimes + 1,
    });
  }
  //  更新数据
  updateDataByType = (type, payload) => {
    if (type === 'realTimeData') {
      this.props.dispatch({
        type: 'operation/getCateRankRealTime',
        payload,
      });
      this.props.dispatch({
        type: 'operation/getStandQuestionRankRealTime',
        payload,
      });
      this.props.dispatch({
        type: 'operation/getQuestionRankRealTime',
        payload,
      });
    } else {
      this.props.dispatch({
        type: 'operation/getCateRank',
        payload,
      });
      this.props.dispatch({
        type: 'operation/getStandQuestionRank',
        payload,
      });
      this.props.dispatch({
        type: 'operation/getQuestionRank',
        payload,
      });
      this.props.dispatch({
        type: 'operation/getServiceUnSatisfactionRank',
        payload,
      });
    }
  }
  //  日期选择器变更
  onCalendarChange = (type, momentStyle, formatted) => {
    const start = formatted[0];
    const end = formatted[1];
    this.setState({
      ...this.state,
      timeRange: [momentStyle[0], momentStyle[1]],
    });
    const payload = {
      startDate: start.replace(/\//g, ''),
      endDate: end.replace(/\//g, ''),
      channel: this.state.channels[type] || -2,
    };
    this.updateDataByType(type, payload);
  }
  //  渠道变更时更新
  onChannelChange = (type, value) => {
    this.setState({
      ...this.state,
      channels: {
        ...this.state.channels,
        [type]: value,
      },
    });
    if (type === 'historyData') {
      const payload = {
        startDate: this.state.timeRange[0].format('YYYYMMDD'),
        endDate: this.state.timeRange[1].format('YYYYMMDD'),
        channel: value || -2,
      };
      this.updateDataByType(type, payload);
    } else {
      const payload = { channel: value || -2 };
      this.updateDataByType(type, payload);
    }
  }
  //  格式化为饼图数据
  getPieChartData = (chartIndex, dataMap) => {
    const wrapper = $.extend(true, {}, pieChartsOption);
    let chartName = '';
    if (!dataMap[chartIndex] || !dataMap[chartIndex].all || !dataMap[chartIndex].all.length) {
      return chartNoData;
    }

    if (chartIndex === 'realTimeStandProblems' || chartIndex === 'historyStandProblems') {
      chartName = '知识点排行';
    } else if (chartIndex === 'realTimeClass' || chartIndex === 'historyClass') {
      chartName = '类别排行';
    } else if (chartIndex === 'realTimeProblems' || chartIndex === 'historyProblems') {
      chartName = '问题排行';
    } else if (chartIndex === 'serviceUnSatisfactions') {
      chartName = '不满意分析';
    }
    wrapper.tooltip.formatter = '{a} <br/>{b} : {c} ({d}%)';
    wrapper.series[0].name = chartName;
    wrapper.series[0].data = dataMap[chartIndex] && dataMap[chartIndex].all ? dataMap[chartIndex].all : [];
    wrapper.series[0].data.map((item) => {
      item.value = item.num;
    });
    // console.log('wrapper', tabId, chartIndex, wrapper)
    return { ...wrapper };
  }
  //  获取分析结果数据
  getProblemTableData = (chartIndex, dataMap) => {
    const wrapper = {};
    if (chartIndex === 'realTimeClass' || chartIndex === 'historyClass') {
      wrapper.columns = analyseColumns;
    } else if (chartIndex === 'realTimeStandProblems' || chartIndex === 'historyStandProblems') {
      const colCopy = [...analyseColumns];
      colCopy.splice(1, 2, {
        title: '知识点',
        dataIndex: 'name',
      }, {
        title: '调用',
        dataIndex: 'num',
      });
      wrapper.columns = colCopy;
    } else if (chartIndex === 'realTimeProblems' || chartIndex === 'historyProblems') {
      const colCopy = [...analyseColumns];
      colCopy.splice(1, 1, {
        title: '问题',
        dataIndex: 'name',
      });
      wrapper.columns = colCopy;
    } else if (chartIndex === 'serviceUnSatisfactions') {
      const colCopy = [...analyseColumns];
      colCopy.splice(1, 1, {
        title: '不满意原因',
        dataIndex: 'name',
      });
      wrapper.columns = colCopy;
    }
    wrapper.data = (dataMap[chartIndex] && dataMap[chartIndex].all ? dataMap[chartIndex].all : []).map((item, index) => {
      return {
        key: index + 1,
        ...item,
      };
    });
    return wrapper;
  }
  //  导出知识点排行历史数据数据
  exportHistoryStandQuestionRankExcel = () => {
    const url = `${devUrl}data/getStandQuestionRank`;
    const [start, end] = this.state.timeRange;
    const payload = { startDate: start.format('YYYYMMDD'), endDate: end.format('YYYYMMDD'), export: 1 };
    getExcel(url, payload);
  }

  //  问题分析导出
  exportData = (alias, title) => {
    let url = '';
    if (alias !== 'historyData') {
      return;
    } else if (title === '知识点排行') {
      url = `${devUrl}data/getStandQuestionRank`;
    } else if (title === '问题排行') {
      url = `${devUrl}data/getQuestionRank`;
    } else if (title === '类别排行') {
      url = `${devUrl}data/getCateRank`;
    } else if (title === '人工不满意分析') {
      url = `${devUrl}data/getServiceUnSatisfactionRank`;
    }
    const [start, end] = this.state.timeRange;
    const payload = { startDate: start.format('YYYYMMDD'), endDate: end.format('YYYYMMDD'), export: 1 };
    getExcel(url, payload);
  }


  hide = () => {
    this.setState({
      popOverViseble: {
        realTimeData: false,
        historyData: false,
      },

    });
  }
  handleVisibleChange = (tar, visible) => {
    this.setState({ popOverViseble: {
      ...this.state.popOverViseble,
      [tar]: visible,
    } });
  }


  render() {
    const { problemAnalyseClass: realTimeClass, problemAnalyseStandProblems: realTimeStandProblems, problemAnalyseProblems: realTimeProblems } = this.props.overviewData;
    const { problemAnalyseClass: historyClass, problemAnalyseStandProblems: historyStandProblems, problemAnalyseProblems: historyProblems, serviceUnSatisfactions } = this.props.serviceQualityData;
    const { tabClickTimes, dataChangeTimes, channels, timeRange } = this.state;
    const dataSet = {
      realTimeData: {
        realTimeClass, realTimeStandProblems, realTimeProblems,
      },
      historyData: {
        historyClass, historyStandProblems, historyProblems, serviceUnSatisfactions,
      },
    };
    return (
      <div>
        <div>
          <div className="breadcrumb">
            <h3 className="breadcrumb_title">问题分析</h3>
          </div>
          <div className="operate">
            <Tabs type="card" onTabClick={this.tabClicked}>
              {
                analyseTabs.map((item) => {
                  return (
                    <TabPane
                      tab={
                      item.alias && ['realTimeData', 'historyData'].includes(item.alias) ?
                        <span>{item.title}&nbsp;
                          <Popover
                            trigger="click" placement="right" title="指标说明"
                            content={
                              <div>
                                <h4>Tab名称</h4>{item.title}<p>&nbsp;&nbsp;</p>
                                <h4>客服名</h4><p>&nbsp;&nbsp;同人员管理的客服姓名</p>
                                <h4>客服账号</h4><p>&nbsp;&nbsp;同人员管理的邮箱</p>
                                <h4>接入量</h4><p>&nbsp;&nbsp;单位时间内人工客服接入会话的总量</p>
                                <h4>会话量</h4><p>&nbsp;&nbsp;单位时间内人工客服结单会话的总量</p>
                                <h4>有效会话量</h4><p>&nbsp;&nbsp;单位时间内人工客服结单的会话中有进行正常人工回复的会话总量</p>
                                <h4>转接会话量</h4><p>&nbsp;&nbsp;单位时间内人工客服结单会话中主动转接且其他客服成功接收的会话量</p>
                                <h4>被转接会话量</h4><p>&nbsp;&nbsp;单位时间内被动接入其他客服转接成功且结单的会话总量</p>
                                <h4>平均会话时长</h4><p>&nbsp;&nbsp;客服每段会话从接入到结单的时长/会话量</p>
                                <h4>平均响应时长</h4><p>&nbsp;&nbsp;客服每条消息平均响应时长/客服消息量（不包含用户消息量）</p>
                                <h4>平均首次响应时长</h4><p>&nbsp;&nbsp;人工对话中平均每段对话的首次响应时长</p>
                                <h4>参评率</h4><p>&nbsp;&nbsp;（进行评价的会话总量/会话总量）*100%</p>
                                <h4>平均满意度</h4><p>&nbsp;&nbsp;评价分数总和/评价会话总量</p>
                                <h4>登录时长</h4><p>&nbsp;&nbsp;单位时间内客服登录工作台的时长</p>
                                <div style={{ textAlign: 'right' }}><Button type="primary" onClick={this.hide}>确认</Button></div>
                              </div>}
                            visible={this.state.popOverViseble[item.alias]}
                            onVisibleChange={this.handleVisibleChange.bind(null, item.alias)}
                          >
                            <Icon type="question-circle" />
                          </Popover>
                        </span> : item.title
                    } key={item.alias}
                    >
                      <div className="panel">
                        <section className="panel_hd" style={{ border: 0 }}>
                          <div className="panel_filter">
                            <div className="panel_filter_main">
                              <Form layout="inline">
                                {
                                  item.alias === 'realTimeData' ? null :
                                  <FormItem>
                                    <RangePicker
                                      value={timeRange}
                                      disabledDate={disabledDate.bind(null, 180)}
                                      format={dateFormat}
                                      onChange={this.onCalendarChange.bind(null, item.alias)}
                                    />
                                  </FormItem>
                                }
                                <FormItem>
                                  <Select
                                    showSearch allowClear
                                    style={{ width: 200 }}
                                    placeholder="渠道"
                                    optionFilterProp="children"
                                    onChange={this.onChannelChange.bind(null, item.alias)}
                                    value={channels[item.alias]}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0}
                                  >
                                    {
                                      CHANNELS.map((channel) => {
                                        return <Option key={channel.value} value={channel.value}>{channel.name}</Option>;
                                      })
                                    }
                                  </Select>
                                </FormItem>
                              </Form>
                            </div>
                          </div>
                        </section>
                        <section className="panel_bd">
                          <main className="panel_aside">
                            <div className="panel_main_main">
                              <div className="tabs-grid">
                                <Tabs
                                  className="ant-tabs-borderbar" animated={false} onTabClick={this.tabClicked}
                                  type="line"
                                >
                                  {
                                    item.children.map((subItem, index) => {
                                      return (<TabPane
                                        key={index}
                                        tab={subItem.title}
                                      >
                                        <Tabs
                                          onTabClick={this.tabClicked} type="line" animated={false}
                                          tabBarExtraContent={operations}
                                        >
                                          <TabPane tab={null}>
                                            <div
                                              style={{
                                                display: 'flex',
                                              }}
                                            >
                                              <div
                                                style={{
                                                  flex: 1,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                }}
                                              >
                                                <Echarts
                                                  key={`${dataChangeTimes}_${tabClickTimes}`}
                                                  style={{ height: '600px' }}
                                                  option={this.getPieChartData(subItem.index, dataSet[item.alias])}
                                                />
                                              </div>
                                              <div
                                                style={{
                                                  width: '500px',
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    margin: '5px 6px',
                                                    height: '25px',
                                                  }}
                                                >
                                                  <a
                                                    style={{
                                                      float: 'right',
                                                      display: item.alias === 'historyData' ? '' : 'none',
                                                    }} href="javascript:void(0)"
                                                    onClick={this.exportData.bind(null, item.alias, subItem.title)}
                                                  >导出到Excel</a>
                                                </div>
                                                <Table
                                                  key={index}
                                                  rowKey="key"
                                                  columns={this.getProblemTableData(subItem.index, dataSet[item.alias]).columns}
                                                  dataSource={this.getProblemTableData(subItem.index, dataSet[item.alias]).data}
                                                />
                                              </div>
                                            </div>
                                          </TabPane>
                                        </Tabs>
                                      </TabPane>);
                                    })
                                  }
                                </Tabs>
                              </div>
                            </div>
                          </main>
                        </section>
                      </div>
                    </TabPane>
                  );
                })
              }
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { overviewData, serviceQualityData } = state.operation;
  return {
    overviewData,
    serviceQualityData,
  };
}

export default connect(mapStateToProps)(Container);

```
