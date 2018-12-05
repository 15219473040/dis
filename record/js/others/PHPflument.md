### routes/web.php
```
$app->group(['prefix' => 'common'], function () use ($app) {
    $app->get('/getSelectorCategories', 'AnalyseController@getSelectorCategories');
});
```
### controller.php
```

    // 获取选项列表
    public function getSelectorCategories()
    {
        // 商品类型
        $productType = [
            '23' => '关注',
            '12' => '安卓下载',
            '36' => '卡券',
            '19' => 'ios下载',
            '37' => 'LBS',
            '31' => '品牌落地页',
            '43' => '表单提交',
            '30' => '电商',
            '25' => 'JD',
        ];

        // 广告位
        $pos = [
            '72058780271891663' => '公众号底部',
            '3050105623004875 ' => ' 新闻插件',
            '20150715' => 'H5视频',
            '20141119' => '朋友圈',
            '8040321819858439' => '小程序',
            '1030436212907001' => '小游戏',
            '9020229299926746' => '微信公众号文中',
        ];

        // 转化目标
        $bidObj = [
            '0' => '兼容老广告',
            '1' => '展示曝光',
            '2' => '点击',
            '3' => '品牌',
            '4' => '下载',
            '5' => '激活',
            '6' => '关注',
            '7' => '下单',
            '8' => '线索',
            '9' => '购物车',
        ];

        // badCaseType 翻译
        $badCaseTypeTranslate = [
            '0' => '正常',
            '1' => '新广告',
            '2' => '小样本',
            '3' => 'cvr突变',
            '4' => '偏离广告主',
            '5' => '猛投',
            '6' => 'pctr_bias',
            '-1'=> '未知',
        ];

        $uinTypeTranslate = [
            '1' => '年龄',
            '2' => '性别',
            '3' => '城市',
        ];

        return $this->response(['productType' => $productType, 'adPositions' => $pos, 'bidObjective' => (object)$bidObj, 'badCaseTypeTranslate' => (object)$badCaseTypeTranslate, 'uinTypeTranslate' => (object)$uinTypeTranslate]);
    }
```
### analyseModel.php
```
class AnalyseModel extends Model
{
    // case 详情
    public static $aidEffectDay = 'public.view_wx_aid_effect_day';
    
      public function caseDetail($params)
    {
        $builder = DB::table(static::$aidEffectDay);
        $this->addParamToBuilder($builder, $params);
        return $builder->orderBy('partition_time', 'asc')->select(
            'partition_time',
            'adpos_id',
            'aid',
            'adver_id',
            'is_moo_test',
            'ad_type_friend',
            'product_type',
            'objective_type',
            'imp as 曝光',
            'clk as 点击',
            'num_clk as 中间层点击',
            'num_clk_train as 补全点击',
            'conv as 转化',
            'ctr_value as 可转化CTR',
            'cvr',
            'bias_ctr',
            'bias_cvr'
        )->get();

    }

}

```


