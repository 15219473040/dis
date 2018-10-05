链接1：* https://www.jb51.net/article/112591.htm *

### mongodb-dbTolls.js

```
const MongoClient = require('mongodb').MongoClient;

var client;

module.exports = {
    // 连接数据库
    connect() {
        MongoClient.connect(
            'mongodb://localhost:27017',
            { useNewUrlParser: true },
            (err, _client) => {
                if (err) throw err;
                client = _client;
                console.log('成功连接数据库');
            }
        );
    },
    // 关闭数据库
    close() {
        if (client) {
            client.close();
        }
    },
    // 插入单个数据
    insertOne(dbName, collectionName, model, success) {
        const collection = getCollection(dbName, collectionName);
        // 如果没有对应的db和collection，自动创建
        collection.insertOne(model, (err, result) => {
            if (err) throw err;
            success(result);
        });
    },
    // 删除单个数据
    deleteOne(dbName, collectionName, query, success) {
        const collection = getCollection(dbName, collectionName);
        collection.deleteOne(query, (err, result) => {
            if (err) throw err;
            success(result);
        });
    },
    // 修改单个数据
    updateOne(dbName, collectionName, query, data, success) {
        const collection = getCollection(dbName, collectionName);
        collection.updateOne(
            query,
            {
                $set: data,
                $currentDate: { lastModified: true }
            },
            (err, result) => {
                if (err) throw err;
                success(result);
            }
        );
    },
    // 查询数据
    find(dbName, collectionName, query, success) {
        const collection = getCollection(dbName, collectionName);
        // 参数可以不传，也可以传一个对象，或者一个字符串
        collection.find(query).toArray((err, docs) => {
            if (err) throw err;
            success(docs);
        });
    }
};

function getCollection(dbName, collectionName) {
    return client.db(dbName).collection(collectionName);
}
```
