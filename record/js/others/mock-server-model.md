## mock
```
module.exports = {

  //查询账户列表
  [`GET ${mockUrl}account/search`] (req, res) {
    res.status(200).json({
      ret_code: 0,
      params: {
        groupId: '权限组id',
        keyword: '',
      },
      result: {
        list: [{
          'id': 111,
          'name': '用户名',
          'uin': '帐号',
          'createTime': '2018-08-20 10:00:00',
          'groupId': '权限组id',
          'groupName': '权限组',
        }],
        total: 1
      },
      err_msg: null
    })
  }
  }

```
## server

```
import { get, post, } from '../utils/request'
import { mockUrl } from '../config'

// 获取用户列表
export function getAccountList (params = {}) {
  return get(mockUrl + 'account/search', params)
}

```

## model


```
import { getGroupList, getAccountList } from '../../services/Account'
export default {
  namespace: 'account',
  state: {
    groupList: [], //权限组列表
    userList: [] //用户列表
  },
  reducers: {
    setStateList (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
    *groupList ({ payload }, { call, put }) {
      const { data } = yield call(getGroupList, { ...payload })
      let result = []
      if (typeof data === 'object' && data.ret_code === 0 && data.result) {
        result = data.result
        yield put({
          type: 'setStateList',
          payload: {
            groupList: result.list || [],
          }
        })
      }
    },
    *userList ({ payload }, { call, put }) {
      const { data } = yield call(getAccountList, { ...payload })
      let result = []
      if (typeof data === 'object' && data.ret_code === 0 && data.result) {
        result = data.result
        yield put({
          type: 'setStateList',
          payload: {
            userList: result.list || [],
          }
        })
        return result.total
      }
      return 0
    },
  },
  subscriptions: {

  }
}


```
