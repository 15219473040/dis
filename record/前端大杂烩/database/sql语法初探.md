## sql 语法 初探 
---
## 1. sql概况
### sql 的基本结构(db>table>f)
> 可以把 SQL 分为两个部分：数据操作语言 (DML) 和 数据定义语言 (DDL)。
 #### 查询和更新指令构成了 SQL 的 DML 部分：
+ SELECT - 从数据库表中获取数据
+ UPDATE - 更新数据库表中的数据
+ DELETE - 从数据库表中删除数据
+ INSERT INTO - 向数据库表中插入数据

SQL 的数据定义语言 (DDL) 部分使我们有能力创建或删除表格。我们也可以定义索引（键），规定表之间的链接，以及施加表间的约束。

#### SQL 中最重要的 DDL 语句:

+ CREATE DATABASE - 创建新数据库
+ ALTER DATABASE - 修改数据库
+ CREATE TABLE - 创建新表
+ ALTER TABLE - 变更（改变）数据库表
+ DROP TABLE - 删除表
+ CREATE INDEX - 创建索引（搜索键）
+ DROP INDEX - 删除索引

## 2. sql细探
***
 Company | OrderNumber 
 :-------|:------------:
 Apple | 4698 
 IBM   | 3532
 W3School | 6953 
 W3School | 2356
  


1. 增删改查（insert delte update select）
- SELECT 列名称 FROM 表名称 WHERE / SELECT DISTINCT Company FROM Orders  
- > WHERE 运算符 =,<>(!=),>,<,>=,,<=,BETWEEN,LIKE
    >> SELECT * FROM Persons WHERE FirstName='Thomas' AND LastName='Carter'<BR>
    >> SELECT * FROM Persons WHERE (FirstName='Thomas' OR FirstName='William')
    AND LastName='Carter'
- > ORDER
   >> SELECT Company, OrderNumber FROM Orders ORDER BY Company   
- INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)<br>
INSERT INTO Persons (LastName, Address) VALUES ('Wilson', 'Champs-Elysees')

- UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值<br>
UPDATE Person SET FirstName = 'Fred' WHERE LastName = 'Wilson' <br>
UPDATE Person SET Address = 'Zhongshan 23', City = 'Nanjing'
WHERE LastName = 'Wilson'
  
- DELETE FROM 表名称 WHERE 列名称 = 值  <br>
DELETE FROM Person WHERE LastName = 'Wilson' 
2. 高级玩法

+ SQL TOP
  - 从 "Persons" 表中选取头两条记录。
    > SELECT TOP 2 * FROM Persons   
  - SQL TOP PERCENT 实例,选取 50% 的记录
    > SELECT TOP 50 PERCENT * FROM Persons 
+ SQL LIKE 操作符语法 ,"%" 可用于定义通配符（模式中缺少的字母）
  - 选取居住在以 "N" 开始的城市里的人
    > SELECT * FROM Persons
WHERE City LIKE 'N%'    
  - 选取居住在以 "g" 结尾的城市里的人
    > SELECT * FROM Persons
WHERE City LIKE '%g'  
  - 取居住在包含 "lon" 的城市里的人：
    > SELECT * FROM Persons
WHERE City LIKE '%lon%'
  - 通过使用 NOT 关键字，我们可以从 "Persons" 表中选取居住在不包含 "lon" 的城市里的人：
    > SELECT * FROM Persons
WHERE City NOT LIKE '%lon%'
+ 通配符

 通配符 | 替换
 :-------|:------
 % | 替换一个或多个字符
 _ | 仅替换一个字符
 \[chartlists\] | 字符列表的任何单一字符
 \[^charlist\] <br> 或者 <br> \[!charlist\] | 不在字符列表的任何单一字符

> SELECT * FROM Persons
WHERE City LIKE '%lond% <br>
SELECT * FROM Persons
WHERE FirstName LIKE '_eorge'<br>
SELECT * FROM Persons
WHERE City LIKE '[!ALN]%'

+ IN 操作符
   > IN 操作符允许我们在 WHERE 子句中规定多个值。<br>
   SELECT column_name(s)
FROM table_name
WHERE column_name IN (value1,value2,...)
+ BETWEEN 操作符
  > 操作符 BETWEEN ... AND 会选取介于两个值之间的数据范围。这些值可以是数值、文本或者日期。<br>
  SELECT column_name(s)
FROM table_name
WHERE column_name
BETWEEN value1 AND value2

    > 如需以字母顺序显示介于 "Adams"（包括）和 "Carter"（不包括）之间的人，请使用下面的 SQL：<br>
    SELECT * FROM Persons
WHERE LastName
BETWEEN 'Adams' AND 'Carter'<br>
not<br>
SELECT * FROM Persons
WHERE LastName
NOT BETWEEN 'Adams' AND 'Carter'

+ SQL Alias
  > SELECT po.OrderID, p.LastName, p.FirstName
FROM Persons AS p, Product_Orders AS po
WHERE p.LastName='Adams' AND p.FirstName='John'<br>
SELECT LastName AS Family, FirstName AS Name
FROM Persons
+ join 
  > SELECT Persons.LastName, Persons.FirstName, Orders.OrderNo
FROM Persons
INNER JOIN Orders
ON Persons.Id_P = Orders.Id_P
ORDER BY Persons.LastName
