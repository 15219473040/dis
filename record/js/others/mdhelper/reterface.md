一、首页





## 二、badcase概览

### 1、Top 10 badcase

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\Top 10 badcase.png)

```sql
select
	partition_time,  --日期
	adpos_id ,  --广告位ID。展示时需要根据广告位名称和广告位ID的映射表将其转换为“广告位名称”
	adid,  --广告ID
	advertiser_id,  --广告主ID
	product_type,  --商品类型编码。展示时可使用相关维表转换为“商品类型名称”。
	bid_objective,  --转化目标编码。展示时可使用相关维表转换为“转化目标名称”。
	is_moo_test,  --是否为oCPM广告（1：是，0：否）
	real_cost,  --收入(单位：元)
	imp,  --曝光数
	clk_value,  --点击数
	cnt_conv,  --转化数
	ctr_value,  --CTR
	cvr,  --CVR
	pctr_value,  --PCTR
	pcvr,  --PCVR
	bias_ctr,
	bias_cvr,
	r_c,  --同维度下按照消耗降序排列的序号
	badcase_type  --badcase类别（1:新广告;2:小样本;...）
from public.view_wx_top_badcase_day
where adpos_id = ?  --筛选框选择的广告位名称对应的广告位ID 
		and is_moo_test = ?  --筛选框选择的是否为oCPM的值（是：1，否：0）
		and product_type = ?  --筛选框选择的商品类型名称对应的商品类型编码
		and bid_objective = ?  --筛选框选择的转化目标名称对应的转化目标编码
		and partition_time = ? --筛选框选择的时间区间（如 date1~date2）中的date1
		
注释：鉴于一个aid可能同时属于多个badcase_type，所以上述SQL查询出的记录数可能多于10条，展示时需要对badcase_type进行压缩。例如aid=562938的badcase类别为猛投和小样本，那么压缩后该字段应变为"猛投,小样本"（即对于同一aid下的多个badcase类别，压缩后以英文逗号分隔的形式展示）
```



### 2、占比分析

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\占比分析.png)

```sql
select 
    partition_time,  --日期
    adpos_id,  --广告位ID。展示时需要根据广告位名称和广告位ID的映射表将其转换为“广告位名称”
	is_moo_test,  ----是否为oCPM广告（1：是，0：否）
    product_type,  --商品类型编码。展示时可使用相关维表转换为“商品类型名称”。
    bid_objective,  --转化目标编码。展示时可使用相关维表转换为“转化目标名称”。
    rate_imp,  --曝光数占比
	rate_clk,  --点击数占比
    rate_aid  --广告数占比
from public.view_wx_type_badcase_ratio_day 
where adpos_id = ?  --筛选框选择的广告位名称对应的广告位ID 
		and is_moo_test = ?  --筛选框选择的是否为oCPM的值（是：1，否：0）
		and product_type = ?  --筛选框选择的商品类型名称对应的商品类型编码
		and bid_objective = ?  --筛选框选择的转化目标名称对应的转化目标编码
		and partition_time >= date1 and partition_time <= date2  --筛选框选择的时间区间（如 date1~date2）
```



### 3、成分分析

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\成分分析.png)

#### 3.1 饼图：

当时间区间选择框中date1=date2,即只需展示一天的数据，以饼图方式呈现各占比。（注意：占比之和可能大于100%）

```sql

select
    partition_time,  --日期
    adpos_id,        --广告位ID
    is_moo_test,  --是否为oCPM广告（1：是，0：否）
    product_type,  --商品类型编码。展示时可使用相关维表转换为“商品类型名称”。
    bid_objective,  --转化目标编码。展示时可使用相关维表转换为“转化目标名称”。
    badcase_type,  --badcase类别（1:新广告;2:小样本;...）
	rate_imp,  --曝光数占比
    rate_clk,  --点击数占比
    rate_aid  --广告数占比
from public.view_wx_type_badcase_causes_day 
where adpos_id = ?  --筛选框选择的广告位名称对应的广告位ID 
		and is_moo_test = ?  --筛选框选择的是否为oCPM的值（是：1，否：0）
		and product_type = ?  --筛选框选择的商品类型名称对应的商品类型编码
		and bid_objective = ?  --筛选框选择的转化目标名称对应的转化目标编码
		and partition_time >= date1 and partition_time <= date2  --筛选框选择的时间区间（此时date1=date2）
```

#### 3.2 折线图:

当时间区间选择框中date1!=date2,此时我们一折线图的形式展示相关指标的趋势。

```sql
select
    partition_time,  --日期
    adpos_id,        --广告位ID
    is_moo_test,  --是否为oCPM广告（1：是，0：否）
    product_type,  --商品类型编码。展示时可使用相关维表转换为“商品类型名称”。
    bid_objective,  --转化目标编码。展示时可使用相关维表转换为“转化目标名称”。
    badcase_type,  --badcase类别（1:新广告;2:小样本;...）
	imp,  --曝光数
	rate_imp,  --曝光数占比
	clk_value,  --点击数
    rate_clk,  --点击数占比
	aid_cnt,  --广告数
    rate_aid  --广告数占比
from public.view_wx_type_badcase_causes_day 
where adpos_id = ?  --筛选框选择的广告位名称对应的广告位ID 
		and is_moo_test = ?  --筛选框选择的是否为oCPM的值（是：1，否：0）
		and product_type = ?  --筛选框选择的商品类型名称对应的商品类型编码
		and bid_objective = ?  --筛选框选择的转化目标名称对应的转化目标编码
		and partition_time >= date1 and partition_time <= date2  --筛选框选择的时间区间（此时date1 != date2）
```



## 三、case诊断

### 1、基本诊断之基本信息

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\基本诊断之基本信息.png)

```sql
select
	partition_time,    --日期
	adpos_id,          --广告位ID
	aid,               --广告ID
	adver_id,          --广告主ID
	is_moo_test,       --是否为oCPM广告（1：是，0：否）
	ad_type_friend,    --1：合约，2：竞价
	product_type,      --商品类型编码。展示时可使用相关维表转换为“商品类型名称”。
	bid_objective,     --转化目标编码。展示时可使用相关维表转换为“转化目标名称”。
	imp,               --曝光数
	clk_value,         --点击数
	num_conv,          --转化数
	ctr_value,         --CTR
	cvr	,              --CVR
	bias_ctr,          --PCTR的bias
	bias_cvr,          --PCVR的bias
	badcase_type       --badcase类别（1:新广告;2:小样本;...；7：数据不充分）
from public.view_wx_aid_base_info_day
where adpos_id = ? --筛选框选择的广告位名称对应的广告位ID 
		and aid = ? --待查的广告ID
		and partition_time = ? --日期
		
注释：鉴于一个aid可能同时属于多个badcase_type，所以上述SQL查询出的记录数可能多于10条，展示时需要对badcase_type进行压缩。例如aid=562938的badcase类别为猛投和小样本，那么压缩后该字段应变为"猛投,小样本"（即对于同一aid下的多个badcase类别，压缩后以英文逗号分隔的形式展示）
```



### 2、基本诊断之诊断数据

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\基本诊断之诊断数据.png)

```sql
----当前aid的 badcase_type=0 时，触发以下SQL：
select
    partition_time,
    aid,
    bias_ctr,
    bias_cvr
from public.view_wx_aid_diag_info_hour 
where partition_time >= %s and partition_time <= %s 
		and adpos_id = %s 
		and aid = %s 


----当前aid的 badcase_type=1或2 时，触发以下SQL：
select 
    partition_time,
    aid,
    imp,
    num_clk_train,
    num_conv,
    bias_cvr
from public.view_wx_aid_diag_info_hour 
where partition_time >=%s and partition_time <= %s 
		and adpos_id = %s 
		and aid = %s 


----当前aid的badcase_type=3 时，触发以下SQL：
select 
	partition_time,
    aid,
    imp,
    num_clk_train,
    num_conv,
    bias_cvr
from public.view_wx_aid_diag_info_hour 
where partition_time >=%s and partition_time <= %s 
		and adpos_id = %s 
		and aid = %s 
union 
select 
	partition_time,
    aid,
    imp,
    num_clk_train,
    num_conv,
    bias_cvr
from public.view_wx_aid_diag_info_hour 
where partition_time >=%s-1 and partition_time <= %s-1 
		and adpos_id = %s 
		and aid = %s 
		
		
----当前aid的badcase_type=4 时，触发以下SQL：
select 
    partition_time,
    aid,
    cvr_aid,
    cvr_adver
from public.view_wx_aid_diag_info_hour 
where partition_time >=%s and partition_time <= %s 
		and adpos_id = %s 
		and aid = %s 


----当前aid的badcase_type=5 时，触发以下SQL：
select 
    partition_time,
	aid,
    imp,
    clk_value
from public.view_wx_aid_diag_info_hour 
where partition_time >=%s and partition_time <= %s 
		and adpos_id = %s 
		and aid = %s 


----当前aid的badcase_type=6 时，触发以下SQL：
select
	partition_time,
	aid,
    imp,
    ctr_value,
    bias_ctr
from public.view_wx_aid_diag_info_hour 
where partition_time >=%s and partition_time <= %s 
		and adpos_id = %s 
		and aid = %s 

----当前aid的badcase_type=7 时，触发以下SQL：
select
	partition_time,
	aid,
    imp,
    num_clk,
    num_conv
from public.view_wx_aid_diag_info_hour 
where partition_time >=%s and partition_time <= %s 
		and adpos_id = %s 
		and aid = %s 
		
----当前aid的badcase_type= -1 时，触发以下SQL：
select 
    partition_time,
	aid,
    imp,
    cvr_aid,
    bias_ctr
from public.view_wx_aid_diag_info_hour 
where partition_time >=%s and partition_time <= %s 
		and adpos_id = %s 
		and aid = %s 
		
		
注释：鉴于部分aid可能同时属于（1~6）的多种badcase类型，此时只需通过多个查询并分别返回查询结果即可。
```



### 2、维度诊断

#### 2.1 类别诊断

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\维度诊断之类型诊断.png)

```sql
select 
    partition_time,    --日期
    adpos_id,          --广告位ID
    aid as valus,      --取值(广告ID)
	is_moo_test,       --是否为oCPM广告（1：是；0：否）
	real_cost,         --aid收入（元）
	imp,               --aid曝光数
	clk_value,         --aid点击数
	num_conv,          --aid转化数
	ctr_value,         --aid CTR
    cvr,               --aid CVR
    bias_ctr,          
    bias_cvr 
from public.view_wx_aid_adver_po_info_day
where partition_time =%s 
		and adpos_id = %s 
		and aid = %s 	
union all		
select 
    partition_time,                --日期
    adpos_id,                      --广告位ID
    case when product_type = 23 and bid_objective = 6 then '关注'
		 when product_type = 12 and bid_objective = 4 then '安卓下载'
		 ...
		 end as valus,             --取值(即将商品类型和转化目标的名称粘合在一起)
	is_moo_test,                   --是否为oCPM广告（1：是；0：否）
	po_real_cost as real_cost,     --po 收入（元）
	po_imp as imp,                 --po 曝光数
	po_clk_value as clk_value,     --po 点击数
	po_num_conv as num_conv,       --po 转化数
	po_ctr_value as ctr_value,     --po CTR
    po_cvr as cvr,                 --po CVR
    po_bias_ctr as bias_ctr,          
    po_bias_cvr as bias_cvr
from public.view_wx_aid_adver_po_info_day
where partition_time =%s 
		and aid = %s 
union all		
select  
    partition_time,                   --日期
    adpos_id,                         --广告位ID
    adver_id as valus,                --取值(广告主ID)
	is_moo_test,                      --是否为oCPM广告（1：是；0：否）
	adver_real_cost as real_cost,     --adver 收入（元）
	adver_imp as imp,                 --adver 曝光数
	adver_clk_value as clk_value,     --adver 点击数
	adver_num_conv as num_conv,       --adver 转化数
	adver_ctr_value as ctr_value,     --adver CTR
    adver_cvr as cvr,                 --adver CVR
    adver_bias_ctr as bias_ctr,          
    adver_bias_cvr as bias_cvr
from public.view_wx_aid_adver_po_info_day
where partition_time =%s
		and adpos_id = %s 
		and aid = %s
		
注意：此表每天的数据规模较大，查询较慢。
```



#### 2.2 实验诊断

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\维度诊断之实验诊断.png)

```sql
select
	'主力' as row_title,
	partition_time,   --日期
	aid,              --广告ID
	adpos,            --广告位ID
	exp_layer,        --实验层ID
	exp_id,           --实验ID
	real_cost,        --收入(元)
	imp,              --曝光数
	clk,              --点击数
	num_conv,         --转化数
	ctr,              --CTR
	cvr,              --CVR
	bias_ctr,
	bias_cvr 
from public.wx_aid_exp_day
where partition_time =%s
		and adpos = %s 
		and aid = %s
		and is_main_alg = 1  --主力
union all
select
	'实验' as row_title,
	partition_time,   --日期
	aid,              --广告ID
	adpos,            --广告位ID
	exp_layer,        --实验层ID
	exp_id,           --实验ID
	real_cost,        --收入(元)
	imp,              --曝光数
	clk,              --点击数
	num_conv,         --转化数
	ctr,              --CTR
	cvr,              --CVR
	bias_ctr,
	bias_cvr 
from public.wx_aid_exp_day
where partition_time =%s
		and adpos = %s 
		and aid = %s
		and is_main_alg = 0  --实验
```



## 四、详细数据

### 1、case详情

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\详细数据之case详情.png)

```sql
select
	partition_time,       --日期
	adpos_id,             --广告位ID
	aid,                  --广告ID
	adver_id,             --广告主ID
	is_moo_test,          --是否为oCPM广告(1:是;0:否)
	ad_type_friend,       --1:合约;2:竞价
	product_type,         --商品类型
	objective_type,       --转化目标
	imp,                  --曝光数 
	clk,                  --点击数(cgilog)
	conv,                 --转化数
	ctr_value,            --CTR 
	cvr,                  --CVR
	bias_ctr,         
	bias_cvr
from public.view_wx_aid_effect_day 		
where partition_time >=%s and partition_time <= %s 
		and adpos_id = %s 
		and aid = %s 
```



### 2、用户详情

#### 2.1 CTR（指标类型选择"CTR"时返回本查询结果）

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\用户详情之CTR.png)

##### 2.1.1 饼图：date1 = date2

```sql
select 
	t1.partition_time,
	t1.adpos_id,
	t1.aid,
	t1.uin_type,
	t1.detail_type,
	t1.uin_cnt*1.0/t2.uin_cnt_all as rate
from(
	select 
		partition_time,
		adpos_id,
		aid,
		uin_type,
		detail_type,
		uin_cnt
	from public.view_wx_uin_type_ctr_day 
	where partition_time >= date1 and  partition_time <= date2
			and adpos_id = %s 
			and uin_type = %s 
			and aid = %s
	) t1
	join
	(		
	select 
		partition_time,
		adpos_id,
		aid,
		uin_type,
		sum(uin_cnt) as uin_cnt_all
	from public.view_wx_uin_type_ctr_day 
	where partition_time >= date1 and  partition_time <= date2
			and adpos_id = %s 
			and uin_type = %s 
			and aid = %s
	) t2
	on(t1.partition_time = t2.partition_time 
		and t1.adpos_id = t2,adpos_id
		and t1.aid = t2.aid
		and t1.uin_type = t2.uin_type)
```

##### 2.1.2 折线图：date1 != date2

```sql
select 
	partition_time,  --日期
	adpos_id,        --广告位ID 
	aid,             --广告ID
	uin_type,        --年龄 or 性别 or 城市level
	detail_type,     --分箱，如年龄的分箱（少年、青年、壮年等）
	bias_ctr         --PCTR的bias
from public.view_wx_uin_type_ctr_day 
where partition_time >= date1 and  partition_time <= date2
		and adpos_id = %s 
		and uin_type = %s 
		and aid = %s
```



#### 2.2 CVR（指标类型选择"CVR"时返回本查询结果）

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\用户详情之CVR.png)

##### 2.2.1 饼图：date1 = date2

```sql
select 
	t1.partition_time,
	t1.adpos_id,
	t1.aid,
	t1.uin_type,
	t1.detail_type,
	t1.uin_cnt*1.0/t2.uin_cnt_all as rate
from(
	select 
		partition_time,
		adpos_id,
		aid,
		uin_type,
		detail_type,
		uin_cnt
	from public.view_wx_uin_type_cvr_day 
	where partition_time >= date1 and  partition_time <= date2
			and adpos_id = %s 
			and uin_type = %s 
			and aid = %s
	) t1
	join
	(		
	select 
		partition_time,
		adpos_id,
		aid,
		uin_type,
		sum(uin_cnt) as uin_cnt_all
	from public.view_wx_uin_type_cvr_day 
	where partition_time >= date1 and  partition_time <= date2
			and adpos_id = %s 
			and uin_type = %s 
			and aid = %s
	) t2
	on(t1.partition_time = t2.partition_time 
		and t1.adpos_id = t2,adpos_id
		and t1.aid = t2.aid
		and t1.uin_type = t2.uin_type)
```

##### 2.2.2 折线图：date1 != date2

```sql
select 
	partition_time,  --日期
	adpos_id,        --广告位ID 
	aid,             --广告ID
	uin_type,        --年龄 or 性别 or 城市level
	detail_type,     --分箱，如年龄的分箱（少年、青年、壮年等）
	bias_cvr         --PCVR的bias
from public.view_wx_uin_type_cvr_day 
where partition_time >= date1 and  partition_time <= date2
		and adpos_id = %s 
		and uin_type = %s 
		and aid = %s
```





## 五、预估值分布

![](C:\Users\zhdongzhang\Desktop\啄木鸟系统数据接口\数据接口2018-11-27\预估值分布之一键穿越.png)

可转化点击预估分布:

<http://10.224.155.46:8080/valuable/>

等曝光均分的可转化点击bias分布：

<http://10.224.155.46:8080/valuable_bias/>

不感兴趣预估分布：

<http://10.224.155.46:8080/not_interest/>

等曝光均分的不感兴趣bias分布：

<http://10.224.155.46:8080/not_interest_bias/>

pcvr预估分布：

<http://10.224.155.46:8080/pcvr/>

pcvr按点击均分的分段bias：

<http://10.224.155.46:8080/pcvr_bias/>

