## create treeNode methods

```
/**
 * Created by woodsding on 2017/07
 */
import React, {Component} from 'react';
import {
  Popconfirm,
  message,
  Input,
  Form,
  Select,
  DatePicker,
  Icon,
  Table,
  Button,
  Pagination,
  Tree,
  Tag,
  Modal,
  Row,
  Col
} from 'antd';
import {connect} from 'dva';
import {
  getHistory,
  deleteItem,
  transfer,
  exchgTemplateTopic,
  changeStatus,
  setValidDate,
  clearAllQues,
} from '../../services/KnowledgeManageService';
import {NeedLearning} from "../../components/common/defaultStatus";
import {
  sanityParam,
  reactHighLight,
  throttle,
  fixPageOffset,
  findAdjacentId,
  processRichTextAnsw,
} from "../../utils/common";
import {changeTopic} from "../../services/SystemManageService";
import Modals from './Modals'
import {
  getSimilarQuestion,
  addSimilarQuestion,
  deleteSimilarQuestion,
  updateSimilarQuestion,
} from "../../services/KnowledgeManageTaskService";
import UploadCreate from '../common/UploadCreate';
import {trimStr} from "../../utils/common"
import {devUrl} from "../../config";
import {getExcel} from "../../utils/request";

const Search = Input.Search;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const {Option, OptGroup} = Select;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const History = Modals.History;
const Transfer = Modals.Transfer;
const SimilarQuestionEditor = Modals.SimilarQuestionEditor;
const ValidDate = Modals.ValidDate;
const Authentication = Modals.Authentication;

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6},
  },
  wrapperCol: {
    xs: {span: 12},
    sm: {span: 16},
  },
};
const isSuggestOptions = [{id: '0', name: '推荐'}, {id: '1', name: '不推荐'}];
const dateFormat = 'YYYY/MM/DD';
// 0启用（永久有效）1启用(有效期) 2停用
const statusMap = {
  0: '启用（永久有效）',
  1: '启用（有效期）',
  2: '停用',
}

class TabProChatContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: {},
      selectedCategory: ['所有分类'],
      uploadModal: {
        open: false,
        title: '上传对话',
        uploadSettings: {from: 'taskPool'},
        onClose: () => {
          this.setState({
            uploadModal: {
              ...this.state.uploadModal,
              open: false,
            }
          })
        },
        onOpen: () => {
          this.setState({
            uploadModal: {
              ...this.state.uploadModal,
              isAdmin: this.props.user.role - 1 === 0 || this.props.user.role - 9 === 0,
              open: true,
            }
          })
        },
        onAnalyseDone: () => {
          this.getTabRenderData()
        },
      },
      curEditQuestionId: null,
      similarQuestions: {},
      similarQuestionModal: {
        open: false,
        title: '知识点详情',
        questionId: null,
        questions: [],
        curRecord: {},
        onClose: () => {
          this.setState({
            similarQuestionModal: {
              ...this.state.similarQuestionModal,
              open: false,
            }
          })
        },
        update: (params) => {
          updateSimilarQuestion(params).then(res => {
            if (res.data.code === 0) {
              message.success('相似问法修改成功')
              const questions = [...this.state.similarQuestionModal.questions]
              questions.map(item => {
                if (item.id === params.questionId) {
                  item.question = params.similarQues
                }
              })
              this.setState({
                ...this.state,
                similarQuestions: {
                  ...this.state.similarQuestions,
                  [params.standId]: questions,
                },
                similarQuestionModal: {
                  ...this.state.similarQuestionModal,
                  questions: questions,
                }
              })
            } else {
              message.error('相似问法修改失败')
            }
          })
        },
        del: (params) => {
          deleteSimilarQuestion(params).then(res => {
            if (res.data.code === 0) {
              message.success('删除相似问法成功')
              const questions = [...this.state.similarQuestionModal.questions]
              for (let i = 0; i < questions.length; i++) {
                if (questions[i].id === params.questionId) {
                  questions.splice(i, 1)
                  break;
                }
              }
              this.setState({
                ...this.state,
                similarQuestions: {
                  ...this.state.similarQuestions,
                  [params.standId]: questions,
                },
                similarQuestionModal: {
                  ...this.state.similarQuestionModal,
                  questions: questions,
                }
              })
            } else {
              message.error('删除相似问法失败')
            }
          })
        },
        add: (params) => {
          addSimilarQuestion(params).then(res => {
            if (res.data.code === 0) {
              this.setState({
                ...this.state,
                similarQuestions: {
                  ...this.state.similarQuestions,
                  [params.standId]: [
                    ...this.state.similarQuestionModal.questions,
                    res.data.data,
                  ],
                },
                similarQuestionModal: {
                  ...this.state.similarQuestionModal,
                  questions: [
                    ...this.state.similarQuestionModal.questions,
                    res.data.data,
                  ]
                }
              })
              message.success('添加相似问法成功')
            } else {
              message.error('添加相似问法失败')
            }
          })
        },
      },
      rowSelection: {
        selectedRowKeys: [],
        onChange: this.onSelectChange,
      },
      filters: {
        isSuggest: undefined,
        keyword: '',
        topic: undefined,
        operator: undefined,
        startDate: null,
        endDate: null,
        from: null,
        status: null,
        v_startDate: null,
        v_endDate: null,
      },
      data: [],
      pagination: {total: 0, pageSize: 10, current: 1, offset: 0},

      detailModal: {
        open: false,
        onClose: () => {
          this.setState({
            detailModal: {
              ...this.state.detailModal,
              open: false,
            }
          })
        },
        onOpen: () => {
          this.setState({
            detailModal: {
              ...this.state.detailModal,
              open: true,
              editable: false,
            }
          })
        },
        onOk: (answer) => {
        },
        record: {
          title: '',
          question: '',
          answer: '',
        }
      },
      historyModal: {
        open: false,
        onClose: () => {
          this.setState({
            historyModal: {
              ...this.state.historyModal,
              open: false,
            }
          })
        },
        onOpen: () => {
          this.setState({
            historyModal: {
              ...this.state.historyModal,
              open: true,
            }
          })
        },
      },
      transferModal: {
        open: false,
        staffList: [],
        total: 0,
        title: '批量转派',
        tips: '若选择转派对象重新编辑答案，原问题将移出到待处理任务',
        onClose: () => {
          this.setState({
            transferModal: {
              ...this.state.transferModal,
              open: false,
            }
          })
        },
        onOpen: () => {
          this.setState({
            transferModal: {
              ...this.state.transferModal,
              open: true,
            }
          })
        },
      },
      validDateModal: {
        open: false,
        title: '设定有效期',
        onClose: () => {
          this.setState({
            validDateModal: {
              ...this.state.validDateModal,
              open: false,
            }
          })
        },
        onOk: (date) => {
          setValidDate({date, ids: JSON.stringify(this.state.rowSelection.selectedRowKeys)}).then((res) => {
            if (res.data.code == 0) {
              message.success('设置成功');
              this.setState({
                ...this.state,
                validDateModal: {
                  ...this.state.validDateModal,
                  open: false,
                },
                rowSelection: {
                  ...this.state.rowSelection,
                  selectedRowKeys: [],
                },
              });
              const {current, pageSize, total,} = this.state.pagination
              const len = this.state.rowSelection.selectedRowKeys.length
              this.handlePaginationChange(fixPageOffset(current, pageSize, total, len))
            } else {
              message.error('设置失败');
            }
          })
        }
      },
      AuthenticationModal: {
        open: false,
        title: '身份校验',
        onClose: () => {
          this.setState({
            AuthenticationModal: {
              ...this.state.AuthenticationModal,
              open: false,
            }
          })
        },
        onOk: (params) => {
          clearAllQues({...params, type: 'professional'}).then((res) => {
            if (res.data.code == 0) {
              message.success('操作成功');
              this.getTabRenderData({current: 1, offset: 0});
              this.setState({
                AuthenticationModal: {
                  ...this.state.AuthenticationModal,
                  open: false,
                }
              })
            } else {
              message.error(res.data.msg ? res.data.msg : '操作失败')
            }
          });
        }
      },
    };
  }

  componentWillMount() {
    this.getTabRenderData();
    this.getEditors();
  }

  getCategoryCascade = () => {
    this.props.dispatch({
      type: 'common/getCategoryCascade',
    });
  }

  moveClass = (targetId, dir, e) => {
    e && this.cancelBubble(e)
    let distId = findAdjacentId(this.props.categories, targetId, 'value', dir)
    // console.log(targetId, distId)
    if (distId === null) {
      message.error('无法向' + (dir === 0 ? '上' : '下') + '移动')
    } else {
      exchgTemplateTopic({motifId: targetId, exmotifId: distId}).then(res => {
        if (res && res.data.code === 0) {
          // 交换成功，重新拉取 hotClass
          this.getCategoryCascade()
        } else {
          message.error(res ? res.data.msg : '位置移动失败')
        }
      })
    }
  }

  exportExcel = (params) => {
    var url = devUrl + 'template/getTemplateList'
    getExcel(url, params)
  }

  getTabRenderData = (params = {}) => {
    const {filters, pagination} = this.state;
    const rawParams = {
      ...filters,
      ...pagination,
      ...params,
    };
    if (rawParams.v_endDate) {
      rawParams.v_startDate = rawParams.v_startDate.format('YYYY/MM/DD h:mm:ss')
      rawParams.v_endDate = rawParams.v_endDate.format('YYYY/MM/DD h:mm:ss')
    }
    if (params.export === 1) {
      this.exportExcel(sanityParam(rawParams))
      return
    }
    this.props.dispatch({
      type: 'knowledgeManage/getDataList',
      payload: {
        type: this.props.type,
        params: sanityParam(rawParams),
      }
    });
  }

  getEditors = () => {
    this.props.dispatch({
      type: 'knowledgeManage/getAllEditors',
      payload: {
        type: this.props.type,
      },
    });
  }

  handlePaginationChange = (page) => {
    this.setState({
      ...this.state,
      pagination: {
        ...this.state.pagination,
        current: page,
        offset: page - 1,
      }
    })
    this.getTabRenderData({
      ...this.state.pagination,
      current: page,
      offset: page - 1,
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        sortField: sorter.field,
        sortOrder: sorter.order ? sorter.order.slice(0, -3) : '',
      },
    });
    this.getTabRenderData({
      ...filters,
      sortField: sorter.field,
      sortOrder: sorter.order ? sorter.order.slice(0, -3) : '',
    });
  }
  onSearchChange = (e) => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        keyword: e.target.value,
      }
    });
    // this.throttleSearch(e.target.value)
  }

  onSearch = (value) => {
    this.getTabRenderData({
      keyword: value,
      offset: 0,
    });
  }
  throttleSearch = throttle(this.onSearch, 500, false)

  onEditorChange = (value) => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        operator: value,
      },
      pagination: {
        ...this.state.pagination,
        current: 1,
        offset: 0,
      },
    });
    this.getTabRenderData({
      operator: value,
      current: 1,
      offset: 0,
    });
  }

  onRecommendChange = (value) => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        isSuggest: value,
      }
    });
    this.getTabRenderData({
      isSuggest: value
    });
  }

  onCalendarChange = ([start, end]) => {
    // console.log(`onCalendarChange ${start}, ${end}`);
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        startDate: start,
        endDate: end,
      },
      pagination: {
        ...this.state.pagination,
        current: 1,
        offset: 0,
      },
    });
    this.getTabRenderData({
      startDate: start,
      endDate: end,
      current: 1,
      offset: 0,
    });
  }
  onValidateChange = ([start, end]) => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        v_startDate: start,
        v_endDate: end,
      },
      pagination: {
        ...this.state.pagination,
        current: 1,
        offset: 0,
      },
    });
    this.getTabRenderData({
      v_startDate: start,
      v_endDate: end,
      current: 1,
      offset: 0,
    });
  }
  fromChange = (value) => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        from: value,
      },
      pagination: {
        ...this.state.pagination,
        current: 1,
        offset: 0,
      },
    });
    this.getTabRenderData({
      from: value,
      current: 1,
      offset: 0,
    });
  }
  statusChange = (value) => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        status: value,
      },
      pagination: {
        ...this.state.pagination,
        current: 1,
        offset: 0,
      },
    });
    this.getTabRenderData({
      status: value,
      current: 1,
      offset: 0,
    });
  }
  showDetail = (record) => {
    // 获取相似问法数据
    if (!this.state.similarQuestions[record.questionId]) {
      this.setState({
        fetchSimilarQuestions: true,
      })
      getSimilarQuestion({standId: record.questionId}).then(res => {
        if (res.data.code === 0) {
          this.setState({
            ...this.state,
            fetchSimilarQuestions: false,
            similarQuestions: {
              ...this.state.similarQuestions,
              [record.questionId]: res.data.data,
            },
          })
        }
      })
    }
    this.setState({
      curEditQuestionId: record.questionId,
      detailModal: {
        ...this.state.detailModal,
        open: true,
        record: record,
        title: '问题详情',
        editable: false,
        categories: this.props.categories,
        isAdmin: (this.props.user.role - 1 === 0 || this.props.user.role - 9 === 0),
        editQuestion: false,
        beginEdit: () => {
          this.editQuestion(record)
        }
      }
    });
  }

  editQuestion = (record) => {
    const id = record.questionId;
    const {dispatch} = this.props;
    dispatch({
      type: 'knowledgeManage/questionHandle',
      payload: {
        model: 2,
        type: 2,
        id,
        toPath: '/kbmanage/base/question?',
        originPath: '/kbmanage/base?',
        origin: 'base',
        answer: record.answer,
      }
    })
  }

  addQuestion = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'knowledgeManage/questionHandle',
      payload: {
        model: 2,
        type: 1,
        toPath: '/kbmanage/base/question?',
        originPath: '/kbmanage/base?',
        origin: 'base'
      }
    })
  }

  showHistory = (record) => {
    getHistory(this.props.type, {id: record.questionId}).then((data) => {
      const history = data.data.data;
      this.setState({
        historyModal: {
          ...this.state.historyModal,
          open: true,
          record: record,
          history: history,
          title: '历史',
        }
      });
    })
  }

  deleteQuestion = (record) => {
    // console.log(record)
    const id = [];
    id.push(record.questionId);
    deleteItem(this.props.type, {ids: JSON.stringify(id)}).then((data) => {
      if (data.data.code === 0) {
        message.success('删除成功');
        const {current, pageSize, total} = this.state.pagination
        this.handlePaginationChange(fixPageOffset(current, pageSize, total, 1))
      } else {
        message.error('删除失败, ' + data.data.msg);
      }
    });
  }
  setStatus = (record) => {
    let type = ''
    if (record.status - 2 === 0) {
      type = 'start'
    } else {
      type = 'stop';
    }
    const id = [];
    id.push(record.questionId);
    changeStatus({ids: JSON.stringify(id), type}).then((data) => {
      if (data.data.code === 0) {
        message.success('操作成功');
        const {current, pageSize, total} = this.state.pagination
        this.handlePaginationChange(fixPageOffset(current, pageSize, total, 1))
      } else {
        message.error('操作失败, ' + data.data.msg);
      }
    })
  }
  popStart = () => {
    const selectedRowKeys = this.state.rowSelection.selectedRowKeys
    const len = selectedRowKeys.length
    confirm({
      title: '确认启用选中的问题吗？',
      content: '',
      onOk: () => {
        changeStatus({ids: JSON.stringify(selectedRowKeys), type: 'start'}).then((data) => {
          if (data.data.code === 0) {
            message.success('启用成功');
            this.setState({
              ...this.state,
              rowSelection: {
                ...this.state.rowSelection,
                selectedRowKeys: [],
              },
            })
            const {current, pageSize, total} = this.state.pagination
            this.handlePaginationChange(fixPageOffset(current, pageSize, total, len))
          } else {
            message.error('启用失败, ' + data.data.msg);
          }
        });
      },
      onCancel: () => {
      }
    })
  }
  popStop = () => {
    const selectedRowKeys = this.state.rowSelection.selectedRowKeys
    const len = selectedRowKeys.length
    confirm({
      title: '确认停用选中的问题吗？',
      content: '',
      onOk: () => {
        changeStatus({ids: JSON.stringify(selectedRowKeys), type: 'stop'}).then((data) => {
          if (data.data.code === 0) {
            message.success('停用成功');
            this.setState({
              ...this.state,
              rowSelection: {
                ...this.state.rowSelection,
                selectedRowKeys: [],
              },
            })
            const {current, pageSize, total} = this.state.pagination
            this.handlePaginationChange(fixPageOffset(current, pageSize, total, len))
          } else {
            message.error('停用失败, ' + data.data.msg);
          }
        });
      },
      onCancel: () => {
      }
    })
  }
  handleValidDate = () => {
    this.setState({
      validDateModal: {...this.state.validDateModal, open: true}
    });
  }
  clearAll = () => {
    confirm({
      title: '确定清空知识库吗？',
      content: '',
      onOk: () => {
        this.setState({
          AuthenticationModal: {...this.state.AuthenticationModal, open: true}
        });
      }
    })

  }
  popDeleteQuestion = () => {
    const selectedRowKeys = this.state.rowSelection.selectedRowKeys
    const len = selectedRowKeys.length
    confirm({
      title: '确认删除这' + len + '条记录吗？',
      content: '',
      onOk: () => {
        deleteItem(this.props.type, {ids: JSON.stringify(selectedRowKeys)}).then((data) => {
          if (data.data.code === 0) {
            message.success('删除成功');
            this.setState({
              ...this.state,
              rowSelection: {
                ...this.state.rowSelection,
                selectedRowKeys: [],
              },
            })
            const {current, pageSize, total} = this.state.pagination
            this.handlePaginationChange(fixPageOffset(current, pageSize, total, len))
          } else {
            message.error('删除失败, ' + data.data.msg);
          }
        });
      },
      onCancel: () => {
      }
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({
      rowSelection: {
        ...this.state.rowSelection,
        selectedRowKeys,
      }
    });
  }

  popTransfer = (record) => {
    // const selectedRowKeys = record && record.questionId ? [record.questionId] : this.state.rowSelection.selectedRowKeys
    const selectedRowKeys = this.state.rowSelection.selectedRowKeys
    const len = selectedRowKeys.length
    this.setState({
      ...this.state,
      transferModal: {
        ...this.state.transferModal,
        staffList: this.props.staffList,
        total: len,
        open: true,
        onOk: (to, toName) => {
          transfer({
            staffId: to,
            staffName: toName,
            ids: JSON.stringify(selectedRowKeys),
            taskType: this.props.chatType,
          }).then(res => {
            if (res.data.code === 0) {
              message.success('转派成功');
              this.setState({
                ...this.state,
                rowSelection: {
                  ...this.state.rowSelection,
                  selectedRowKeys: [],
                },
              })
              const {current, pageSize, total} = this.state.pagination
              this.handlePaginationChange(fixPageOffset(current, pageSize, total, len))
            } else {
              message.error('转派失败 ' + res.data.msg || '');
            }
          })
        }
      }
    })
  }

  cancelBubble = (e) => {
    e.stopPropagation()
  }

  setCurClass = (selectedKeys, e) => {
    if (!selectedKeys || !selectedKeys.length) {
      return
    }
    // 根据分类，重新拉取表数据
    const classType = e.node.props.type;
    const categoryValue = e.node.props.categoryValue;
    // console.log(classType, categoryValue, selectedKeys, 'onSelect')
    if (classType === 'add_button') {
      return
    } else {
      const selectTopic = selectedKeys[0]
      const selectTopicSplit = selectTopic.split('_')
      const topicTranslate = selectTopicSplit[0] === '未分类' ? '__noneClass__' : selectTopicSplit[0]
      const topicLvl = (selectTopic.indexOf('所有分类') !== -1 || topicTranslate === '__noneClass__') ? 1 : 2
      this.setState({
        selectedCategory: selectedKeys,
        categoryValue: categoryValue === '-00009999' ? '' : categoryValue,
        filters: {
          ...this.state.filters,
          topic: selectTopic === '所有分类' ? '' : topicTranslate,
          topicLevel: topicLvl,
          parentTopic: topicLvl === 2 ? selectTopicSplit[1] : '',
        },
        pagination: {
          ...this.state.pagination,
          current: 1,
          offset: 0,
        },
      })
      if (selectTopic === '所有分类') {
        this.getTabRenderData({topic: '', topicLevel: 1, offset: 0, parentTopic: '',})
      } else if (selectTopic) {
        this.getTabRenderData({
          topic: topicTranslate,
          topicLevel: topicLvl,
          offset: 0,
          parentTopic: topicLvl === 2 ? selectTopicSplit[1] : '',
        })
      }
    }
  }

  editClass = (item, parent) => {
    // clear curEditClassId
    this.setState({
      curEditClassId: '',
    })
    const curEditClassName = trimStr(this.state.curEditClassName)
    if (curEditClassName.indexOf('_') !== -1) {
      message.error('分类名称不能含有下划线')
      return
    }
    if (!curEditClassName) {
      return
    }
    // if (curEditClassName === '其他') {
    //   message.error('不能以 “其他” 命名分类')
    //   return
    // }
    if (curEditClassName === '未分类') {
      message.error('不能以 “未分类” 命名分类')
      return
    }
    if (item.label === curEditClassName) {
      return
    }
    const params = {"del": [], "add": [], "edit": []}
    if (parent && parent.label !== '所有分类') {
      params.edit.push({
        firstTopic: parent.label,
        secondTopicOld: item.label,
        secondTopic: curEditClassName
      })
    } else {
      params.edit.push({
        firstTopicOld: item.label,
        firstTopic: curEditClassName,
        secondTopicOld: '',
        secondTopic: ''
      })
    }
    this.modifyCategories(params);
  }

  editClassKeyUp = (item, parent, e) => {
    e.stopPropagation()
    if (e.keyCode === 13) {
      this.editClass(item, parent)
    }
  }

  deleteClass = (item, parent, e) => {
    e.stopPropagation()
    const params = {"del": [], "add": [], "edit": []}
    if (parent && parent.label !== '所有分类') {
      params.del.push({firstTopic: parent.label, secondTopic: item.label})
    } else {
      params.del.push({firstTopic: item.label, secondTopic: ''})
    }
    this.modifyCategories(params);
  }

  addClass = (item, parent) => {
    // const [sonLabel, parentLabel] = uKey.split('_')
    const sonLabel = item.label;
    const parentLabel = parent ? parent.label : null;
    const uKey = item.label + '_' + (parent ? parent.label : '_p_add')
    const curEditClassName = trimStr(this.state.curEditClassName)
    const params = {"del": [], "add": [], "edit": []}
    this.toggleInputShowHide(uKey, false)
    if (curEditClassName.indexOf('_') !== -1) {
      message.error('分类名称不能含有下划线')
      return
    }
    if (!curEditClassName) {
      return
    }
    if (curEditClassName === '默认分类') {
      message.error('不能添加名称为 “默认分类” 的分类')
      return
    }
    // if (curEditClassName === '其他') {
    //   message.error('不能添加名称为 “其他” 的分类')
    //   return
    // }
    if (curEditClassName === '未分类') {
      message.error('不能添加名称为 “未分类” 的分类')
      return
    }
    if (parentLabel) {
      params.add.push({firstTopic: sonLabel, secondTopic: curEditClassName})
    } else {
      params.add.push({firstTopic: curEditClassName, secondTopic: ''})
    }
    this.modifyCategories(params);
  }

  addInputKeyUp = (item, parent, e) => {
    e.stopPropagation()
    if (e.keyCode === 13) {
      this.addClass(item, parent)
    }
  }

  toggleInputShowHide = (uKey, show) => {
    this.setState({
      showInput: {
        ...this.state.showInput,
        [uKey]: show,
      },
      curEditClassName: '',
    })
    if (show) {
      setTimeout(() => {
        this.refs[uKey].focus();
      })
    } else {
      this.refs[uKey].value = ''
    }
  }

  getCategories = () => {
    this.props.dispatch({
      type: 'common/getCategoryCascade',
    });
  }

  modifyCategories = (params) => {
    changeTopic({
      data: JSON.stringify(params)
    }).then((data) => {
      if (data.data.code === 0) {
        message.success('修改成功')
        // 修改topic后，拉取categories数据
        this.getCategories()
      } else {
        message.error(data.data.msg || '修改失败')
      }
    })
  }

  setEditClassId = (key, item, e) => {
    e.stopPropagation()
    this.setState({
      curEditClassId: key,
      curEditClassName: item.label,
    })

    setTimeout(() => {
      this.textInput.focus();
    })
  }

  setCurEditClassName = (e) => {
    this.setState({
      curEditClassName: e.target.value,
    })
  }

  addTreeNode = (item, parent) => {
    const uKey = item.label + '_' + (parent ? parent.label : '_p_add')
    const showInput = this.state.showInput
    return <TreeNode key={uKey} type="add_button"
                     title={<div>
                       <input style={{display: showInput[uKey] ? '' : 'none', width: '130px'}} defaultValue={''}
                              onClick={this.cancelBubble}
                              ref={uKey}
                              onBlur={this.addClass.bind(null, item, parent)}
                              onKeyUp={this.addInputKeyUp.bind(null, item, parent)}
                              onChange={this.setCurEditClassName}
                       />
                       <Button
                         onClick={this.toggleInputShowHide.bind(null, uKey, true)}
                         className="tag_add"
                         ref={uKey + '_button'}
                         style={{display: showInput[uKey] ? 'none' : ''}} size="default"
                         type="dashed">添加分类</Button>
                     </div>}></TreeNode>
  }

  createTreeNode = (item, parent = null, isAdmin) => {
    const uKey = item.label + '_' + (parent ? parent.label : '_parent')
    if (parent === null) {
      return <TreeNode title={<span title={item.label}>{item.label}</span>} key={item.label.toString()} type={0}>
        {
          item.children.map(subItem => {
            return this.createTreeNode(subItem, item, isAdmin)
          })
        }
        {isAdmin ? this.addTreeNode(item, parent) : null}
      </TreeNode>
    }
    if (item.label === '未分类') {
      return <TreeNode title={<span title={item.label}>{item.label}</span>} key={item.label.toString()}
                       type={0}></TreeNode>
    }
    if (item.children && item.children.length) {
      if (uKey !== this.state.curEditClassId) {
        return <TreeNode
          title={
            <div className="treenode">
              <a href="javascript:void(0)" className="treenode_action iconfont"
                 title="上移" onClick={this.moveClass.bind(null, item.value, 0)}
              ><Icon type="arrow-up"/></a>
              <a href="javascript:void(0)" className="treenode_action iconfont"
                 title="下移" onClick={this.moveClass.bind(null, item.value, 1)}
              ><Icon type="arrow-down"/></a>
              <Popconfirm title="确认删除?" onClick={this.cancelBubble}
                          onConfirm={this.deleteClass.bind(null, item, parent)} okText="删除"
                          cancelText="取消" style={{display: isAdmin ? '' : 'none'}}>
                <a href="javascript:void(0)" style={{display: isAdmin ? '' : 'none'}}
                   className="treenode_action iconfont icon-delete" title="删除"></a>
              </Popconfirm>
              <a href="javascript:void(0)" style={{display: isAdmin ? '' : 'none'}}
                 title="编辑" onClick={this.setEditClassId.bind(null, uKey, item)}
                 className="treenode_action iconfont icon-edit"></a>
              <span className="treenode_title" title={item.label}>{item.label}</span>
            </div>
          }
          key={uKey} type={1} categoryValue={item.value}>
          {
            item.children.map(subItem => {
              return this.createTreeNode(subItem, item, isAdmin)
            })
          }
          {isAdmin ? this.addTreeNode(item, parent) : null}
        </TreeNode>
      } else {
        return <TreeNode
          title={<input
            onClick={this.cancelBubble}
            style={{width: '130px'}}
            value={this.state.curEditClassName}
            onBlur={this.editClass.bind(null, item, parent)}
            onKeyUp={this.editClassKeyUp.bind(null, item, parent)}
            ref={(input) => {
              this.textInput = input;
            }}
            onChange={this.setCurEditClassName}/>}
          key={uKey} type={1} categoryValue={item.value}>
          {
            item.children.map(subItem => {
              return this.createTreeNode(subItem, item, isAdmin)
            })
          }
          {isAdmin ? this.addTreeNode(item, parent) : null}
        </TreeNode>
      }
    } else {
      if (uKey !== this.state.curEditClassId) {
        if (parent === null) {
          return <TreeNode title={<div className="treenode">
            <a href="javascript:void(0)" className="treenode_action iconfont"
               title="上移" onClick={this.moveClass.bind(null, item.value, 0)}
            ><Icon type="arrow-up"/></a>
            <a href="javascript:void(0)" className="treenode_action iconfont"
               title="下移" onClick={this.moveClass.bind(null, item.value, 1)}
            ><Icon type="arrow-down"/></a>
            <Popconfirm title="确认删除?" onClick={this.cancelBubble} onConfirm={this.deleteClass.bind(null, item, parent)}
                        okText="删除"
                        cancelText="取消" style={{display: isAdmin ? '' : 'none'}}>
              <a href="javascript:void(0)" style={{display: isAdmin ? '' : 'none'}}
                 className="treenode_action iconfont icon-delete" title="删除"></a>
            </Popconfirm>
            <a href="javascript:void(0)" style={{display: isAdmin ? '' : 'none'}}
               title="编辑" onClick={this.setEditClassId.bind(null, uKey, item)}
               className="treenode_action iconfont icon-edit"></a>
            <span className="treenode_title" title={item.label}>{item.label}</span>
          </div>} key={uKey} type={1} categoryValue={item.value}>
          </TreeNode>
        } else {
          if (parent.label === '所有分类' && isAdmin) {
            return <TreeNode title={<div className="treenode">
              <a href="javascript:void(0)" className="treenode_action iconfont"
                 title="上移" onClick={this.moveClass.bind(null, item.value, 0)}
              ><Icon type="arrow-up"/></a>
              <a href="javascript:void(0)" className="treenode_action iconfont"
                 title="下移" onClick={this.moveClass.bind(null, item.value, 1)}
              ><Icon type="arrow-down"/></a>
              <Popconfirm title="确认删除?" onClick={this.cancelBubble}
                          onConfirm={this.deleteClass.bind(null, item, parent)} okText="删除"
                          cancelText="取消" style={{display: isAdmin ? '' : 'none'}}>
                <a href="javascript:void(0)" style={{display: isAdmin ? '' : 'none'}}
                   className="treenode_action iconfont icon-delete" title="删除"></a>
              </Popconfirm>
              <a href="javascript:void(0)" style={{display: isAdmin ? '' : 'none'}}
                 title="编辑" onClick={this.setEditClassId.bind(null, uKey, item)}
                 className="treenode_action iconfont icon-edit"></a>
              <span className="treenode_title" title={item.label}>{item.label}</span>
            </div>} key={uKey} type={1} categoryValue={item.value}>
              {this.addTreeNode(item, parent)}
            </TreeNode>
          }
          return <TreeNode title={<div className="treenode">
            <a href="javascript:void(0)" className="treenode_action iconfont"
               title="上移" onClick={this.moveClass.bind(null, item.value, 0)}
            ><Icon type="arrow-up"/></a>
            <a href="javascript:void(0)" className="treenode_action iconfont"
               title="下移" onClick={this.moveClass.bind(null, item.value, 1)}
            ><Icon type="arrow-down"/></a>
            <Popconfirm title="确认删除?" onClick={this.cancelBubble} onConfirm={this.deleteClass.bind(null, item, parent)}
                        okText="删除"
                        cancelText="取消" style={{display: isAdmin ? '' : 'none'}}>
              <a href="javascript:void(0)" style={{display: isAdmin ? '' : 'none'}}
                 className="treenode_action iconfont icon-delete" title="删除"></a>
            </Popconfirm>
            <a href="javascript:void(0)" style={{display: isAdmin ? '' : 'none'}}
               title="编辑" onClick={this.setEditClassId.bind(null, uKey, item)}
               className="treenode_action iconfont icon-edit"></a>
            <span className="treenode_title" title={item.label}>{item.label}</span>
          </div>} key={uKey} type={1} categoryValue={item.value}>
          </TreeNode>
        }
      } else {
        if (parent === null) {
          return <TreeNode
            title={<input
              onClick={this.cancelBubble}
              style={{width: '130px'}}
              value={this.state.curEditClassName}
              onBlur={this.editClass.bind(null, item, parent)}
              onKeyUp={this.editClassKeyUp.bind(null, item, parent)}
              ref={(input) => {
                this.textInput = input;
              }}
              onChange={this.setCurEditClassName}/>}
            key={uKey} type={1} categoryValue={item.value}>
          </TreeNode>
        } else {
          if (parent.label === '所有分类' && isAdmin) {
            return <TreeNode
              title={<input
                onClick={this.cancelBubble}
                style={{width: '130px'}}
                value={this.state.curEditClassName}
                onBlur={this.editClass.bind(null, item, parent)}
                onKeyUp={this.editClassKeyUp.bind(null, item, parent)}
                ref={(input) => {
                  this.textInput = input;
                }}
                onChange={this.setCurEditClassName}/>}
              key={uKey} type={1} categoryValue={item.value}>
              {this.addTreeNode(item, parent)}
            </TreeNode>
          }
          return <TreeNode
            title={<input
              onClick={this.cancelBubble}
              style={{width: '130px'}}
              value={this.state.curEditClassName}
              onBlur={this.editClass.bind(null, item, parent)}
              onKeyUp={this.editClassKeyUp.bind(null, item, parent)}
              ref={(input) => {
                this.textInput = input;
              }}
              onChange={this.setCurEditClassName}/>}
            key={uKey} type={1} categoryValue={item.value}>
          </TreeNode>
        }
      }
    }
  }
  popSimilarQuestion = (record, isAdmin, retryTimes = 0, e) => {
    e.stopPropagation()

    const {questionId, answerId} = record;
    // 增加相似问法缓存
    // +设置当前record
    if (this.state.similarQuestions[questionId]) {
      this.setState({
        ...this.state,
        similarQuestionModal: {
          ...this.state.similarQuestionModal,
          open: true,
          isAdmin,
          questionId,
          answerId,
          questions: this.state.similarQuestions[questionId],
          curRecord: record,
        }
      })
    } else {
      this.setState({
        fetchSimilarQuestions: true,
      })
      getSimilarQuestion({standId: questionId}).then(res => {
        if (res.data.code === 0) {
          this.setState({
            ...this.state,
            fetchSimilarQuestions: false,
            similarQuestions: {
              ...this.state.similarQuestions,
              [questionId]: res.data.data,
            },
            similarQuestionModal: {
              ...this.state.similarQuestionModal,
              open: true,
              isAdmin,
              questionId,
              answerId,
              questions: res.data.data,
              curRecord: record,
            },
          })
        } else {
          if (retryTimes < 1) {
            this.popSimilarQuestion(record, isAdmin, retryTimes + 1)
          }
        }
      })
    }
  }

  renderQuestion = (record, keyword, type, isAdmin) => {
    const raw = <div style={{display: 'inline-block'}}
                     dangerouslySetInnerHTML={{__html: reactHighLight(record.question, keyword)}}></div>
    // console.log('type', type)
    if (type === 'professional') {
      if (Array.isArray(raw)) {
        raw.push(<Tag style={{paddingLeft: '5px', paddingRight: '5px '}}
                      onClick={this.popSimilarQuestion.bind(null, record, isAdmin, 1)}
                      key="911111" color="blue">相似问法：
          {this.state.similarQuestions[record.questionId] ?
            this.state.similarQuestions[record.questionId].length : record.similarQues}</Tag>)
        return raw
      } else {
        return [raw, <Tag style={{paddingLeft: '5px', paddingRight: '5px '}}
                          onClick={this.popSimilarQuestion.bind(null, record, isAdmin, 1)}
                          key="911111" color="blue">相似问法：
          {this.state.similarQuestions[record.questionId] ?
            this.state.similarQuestions[record.questionId].length : record.similarQues}</Tag>]
      }
    } else {
      return raw
    }
  }

  render() {
    const {type, categories, loading, user} = this.props;
    console.log(categories)
    const data = this.props[type];
    const {
      pagination, filters, rowSelection, selectedCategory,
      fetchSimilarQuestions,
    } = this.state;
    const {startDate, endDate, topic, isSuggest, status,} = filters;
    const role = user.role;
    const isAdmin = role - 1 === 0 || this.props.user.role - 9 === 0

    let list, editors;
    if (!data) {
      list = [];
      editors = [];
      // loading = false;
    } else {
      list = data.list;
      pagination.total = parseInt(data.total) || 0;
      // loading = data.loading;
      editors = data.editors ? data.editors : [];
      categories.map((item, index) => {
        if (!item.key) {
          item.key = index.toString();
        }
        if (item.children) {
          item.children.map((subItem, subIndex) => {
            if (!subItem.key) {
              subItem.key = index.toString() + '-' + subIndex;
            }
          })
        }
      })
    }

    const {keyword, operator} = this.state.filters;
    const columns = [{
      title: '标准问题',
      dataIndex: 'question',
      // sorter: true,
      width: '20%',
      render: (text, record, index) => {
        return <span key={index}>{this.renderQuestion(record, keyword, type, isAdmin)}</span>;
      },
    }, {
      title: '答案',
      dataIndex: 'answer',
      // sorter: true,
      // width: '40%',
      render: (text, record) => {
        const newText = processRichTextAnsw(text, record.answerType, true, true);
        return <div dangerouslySetInnerHTML={{__html: reactHighLight(newText, keyword)}}></div>
      },
    }, {
      title: '编辑人',
      dataIndex: 'editor',
      // sorter: true,
    }, {
      title: '编辑时间',
      dataIndex: 'editTime',
      sorter: true,
    },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status) => {
          return statusMap[status] || '未知状态'
        }
      }, {
        title: '有效期',
        dataIndex: 'validity',
        width: '170px',
      },
      {
        title: '操作',
        render: (text, record) => {
          if (isAdmin) {
            return <div className="table-action">
              <a href="javascript:void(0)" onClick={this.editQuestion.bind(null, record)}>编辑</a>
              {/*<a href="javascript:void(0)" onClick={this.showHistory.bind(null, record)}>历史</a>*/}
              {/*<a href="javascript:void(0)" onClick={this.popTransfer.bind(null, record)}>转派</a>*/}
              <Popconfirm title="确认删除?" onClick={this.cancelBubble} onConfirm={this.deleteQuestion.bind(null, record)}
                          okText="删除"
                          cancelText="取消">
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
              <Popconfirm title={record.status - 2 === 0 ? '确认启用' : '确认停用'} onClick={this.cancelBubble}
                          onConfirm={this.setStatus.bind(null, record)}
                          okText={record.status - 2 === 0 ? '启用' : '停用'}
                          cancelText="取消">
                <a href="javascript:void(0)">{record.status - 2 === 0 ? '启用' : '停用'}</a>
              </Popconfirm>
            </div>
          } else {
            return <div>
              <a href="javascript:void(0)" onClick={this.showHistory.bind(null, record)}>历史</a>
            </div>
          }
        },
      }];
    if (!isAdmin) {
      columns.pop()
    }

    return (
      <div className="instantReply">
        <div className="panel" style={{position: 'static', border: 'none', padding: '20px'}}>
          <section className="panel_bd">
            <div className="panel_main" style={{padding: '16px 0 0 0', background: '#f3f5f8'}}>
              <h5 className="panel_title">问答分类</h5>
              <Tree
                onSelect={this.setCurClass}
                autoExpandParent={false}
                selectedKeys={selectedCategory}
                defaultExpandedKeys={['所有分类']}
              >
                {
                  this.createTreeNode({
                    label: '所有分类',
                    value: '-00009999',
                    children: [{label: '未分类', value: '-11119999'}, ...categories]
                  }, null, isAdmin)
                }
              </Tree>
            </div>
            <main className="panel_aside" style={{border: 'none'}}>
              <section className="panel_hd" style={{border: 0, paddingTop: 0}}>
                <div className="panel_filter">
                  <div className="panel_filter_main">
                    <Form layout="inline">
                      <FormItem>
                        <Button
                          type="primary"
                          size="default"
                          onClick={this.addQuestion}>添加问题
                        </Button>
                      </FormItem>
                      <FormItem>
                        <Button
                          type="primary"
                          size="default"
                          onClick={this.state.uploadModal.onOpen}>批量导入
                        </Button>
                      </FormItem>
                    </Form>
                  </div>
                  {
                    list && list.length ?
                      <div className="panel_filter_addon">
                        <a href="javascript:void(0)" title="导出当前表格所有内容"
                           onClick={this.getTabRenderData.bind(null, {export: 1})}>导出到Excel</a>
                      </div>
                      : null
                  }
                </div>
                <div className="panel_filter">
                  <div className="panel_filter_main" style={{flexWrap: 'wrap'}}>
                    <Form layout="inline">
                      <FormItem>
                        <Search onChange={this.onSearchChange} onSearch={this.onSearch}
                                placeholder="输入关键字，回车检索" value={keyword}/>
                      </FormItem>
                      {/*<FormItem style={{display: 'none'}}>
                            <Select
                              showSearch allowClear
                              placeholder="是否推荐"
                              optionFilterProp="children"
                              onChange={this.onRecommendChange}
                              value={isSuggest}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0}
                            >
                              {
                                isSuggestOptions.map(item => {
                                  return <Option key={item.name} value={item.id}>{item.name}</Option>
                                })
                              }
                            </Select>
                          </FormItem>*/}
                      <FormItem>
                        <Select
                          style={{width: '140px'}}
                          showSearch allowClear
                          placeholder="编辑人"
                          optionFilterProp="children"
                          onChange={this.onEditorChange}
                          value={operator}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0}
                        >
                          {
                            editors.map(person => {
                              return <Option key={person} value={person}>{person}</Option>
                            })
                          }
                        </Select>
                      </FormItem>
                      <FormItem>
                        <Select showSearch allowClear placeholder="知识来源"
                                style={{width: '130px'}} onChange={this.fromChange}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0}>
                          <Option value="0">直接录入(单个)</Option>
                          <Option value="1">直接录入(批量)</Option>
                          <Option value="2">智能学习(相似问法)</Option>
                          <Option value="3">智能学习(未知问题)</Option>
                          <Option value="66">智能学习(不满意问题)</Option>
                          <Option value="4">人工收录</Option>
                          <Option value="5">标注系统</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="编辑时间">
                        <RangePicker
                          value={[startDate, endDate]}
                          format={dateFormat}
                          onChange={this.onCalendarChange}
                        />
                      </FormItem>
                      <FormItem>
                        <Select showSearch allowClear placeholder="状态"
                                style={{width: '120px'}} onChange={this.statusChange}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0}>
                          <Option value="0">启用(永久有效)</Option>
                          <Option value="1">启用(有效期)</Option>
                          <Option value="2">停用</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="有效时间" style={{display: status === '1' ? '' : 'none'}}>
                        <RangePicker
                          showTime={{format: 'HH:mm'}}
                          format="YYYY-MM-DD HH:mm"
                          onOk={this.onValidateChange}
                        />
                      </FormItem>
                    </Form>
                  </div>
                </div>
              </section>
              <div className="panel_main_main">
                <div className="panel_main_main">
                  <div className="panel_content">
                    {list && list.length || loading ?
                      <Table columns={columns}
                             loading={fetchSimilarQuestions}
                             rowKey={record => record.questionId}
                             rowSelection={isAdmin ? rowSelection : null}
                             dataSource={list}
                             pagination={false}
                             onChange={this.handleTableChange}
                      /> : <NeedLearning/>}
                  </div>
                </div>
                {list && list.length || loading ? <div className="panel_footer">
                  <div className="panel_footer_main" style={{display: isAdmin ? '' : 'none'}}>
                    <span style={{'marginRight': '7px'}}>批量处理</span>
                    <Button
                      type="primary"
                      onClick={this.popStop} ghost
                      disabled={!(rowSelection.selectedRowKeys.length > 0)}>停用</Button>
                    <Button
                      type="primary"
                      onClick={this.popStart} ghost
                      disabled={!(rowSelection.selectedRowKeys.length > 0)}>启用</Button>
                    <Button
                      type="primary"
                      onClick={this.popTransfer} ghost
                      disabled={!(rowSelection.selectedRowKeys.length > 0)}>转派</Button>
                    <Button
                      type="primary"
                      onClick={this.popDeleteQuestion} ghost
                      disabled={!(rowSelection.selectedRowKeys.length > 0)}>删除</Button>
                    <Button
                      type="primary"
                      onClick={this.handleValidDate} ghost
                      disabled={!(rowSelection.selectedRowKeys.length > 0)}>设定有效期</Button>
                    <Button
                      type="primary"
                      onClick={this.clearAll} ghost
                    >清空知识库</Button>
                  </div>
                  <div className="panel_footer_aside">
                    <Pagination showTotal={(total, range) => `共 ${total} 条`}
                                onChange={this.handlePaginationChange} {...pagination} showQuickJumper/>
                  </div>
                </div> : null
                }
              </div>
            </main>
          </section>
        </div>
        <History {...this.state.historyModal}/>
        <Transfer {...this.state.transferModal} />
        <UploadCreate {...this.state.uploadModal} type="proChat"/>
        <SimilarQuestionEditor {...this.state.similarQuestionModal}/>
        <ValidDate {...this.state.validDateModal}/>
        <Authentication {...this.state.AuthenticationModal} formItemLayout={formItemLayout}/>
      </div>
    );
  }
}

// export default TabContent;
function mapStateToProps(state) {
  const data = state.knowledgeManage;
  const {categories} = state.common;
  const {user, staffList} = state.userInfo;
  return {
    ...data,
    categories,
    user,
    staffList,
    loading: state.loading.models.knowledgeManage,
  };
}

export default connect(mapStateToProps)(TabProChatContent);


```

