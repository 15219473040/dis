### 该方法主要解决 子路由被选中映射到父级节点，添加对应的样式（openkey）
```
const allMenu = [
 
    {
        id: 'badcaseOverview',
        name: 'badcase概览',
        route: '/badcaseOverview',
    },
    {
        id: 'caseDiagnosis',
        name: 'adid badcase分析',
        // name: 'case诊断',
        // route: '/caseDiagnosis',
        children: [
            {
                id: 'baseDiagnosis',
                name: '基本诊断',
                route: '/baseDiagnosis',
            },
            {
                id: 'dimensionsDiagnosis',
                name: '维度诊断',
                route: '/dimensionsDiagnosis',
            },
        ],
    },
    {
        id: 'detailData',
        name: '用户展示广告分析',
        children: [
            {
                id: 'caseDetail',
                name: 'case详情',
                route: '/caseDetail',
            },
            {
                id: 'userDetail',
                name: '用户详情',
                route: '/userDetail',
            },
        ],
    },
    {
        id: 'helpDoc',
        name: '帮助文档',
        route: '/helpDoc',
    },
]

const menuHasChildren = allMenu.filter(item=>{
    if(item.children && item.children.length>0) {
        return item;
    }
})

let selectedPathName=['caseDetail'];

let childSelected = menuHasChildren.find(child=>{
    if(child.children.some(subItem=>selectedPathName.includes(subItem.id))){
        return child
    }
})

selectedPathName =[childSelected.id]


console.log(selectedPathName)

```
