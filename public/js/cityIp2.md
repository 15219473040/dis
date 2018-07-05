 <script type="text/javascript" src="//pv.sohu.com/cityjson/getip.aspx" charset="utf-8"></script>
    <!-- <script type="text/javascript" src="//whois.pconline.com.cn/ipJson.jsp?callback=whoisobj" async></script> -->
    <script language="javascript" type="text/javascript">




        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
        var bm = getQueryString("bm");
        var cid = getQueryString("cid");
        var citys;

        try {

            if(returnCitySN &&returnCitySN.cname){

                citys = returnCitySN.cname
                console.log("souh")
                toNextPage(citys)
            }


        } catch (err) {
            
            console.log("err", err);

            (function() {
           
            var ta = document.createElement('script'); 
            ta.type = 'text/javascript'; 
            ta.async = true;
            ta.src = '//whois.pconline.com.cn/ipJson.jsp?callback=whoisobj';
            ta.onerror = function () {
                var request = new XMLHttpRequest();
                request.open('GET', ta.src, true);
                request.send(null);
            }
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ta, s);
        })(window);

            function whoisobj(obj) {
                citys = obj.city

                toNextPage(citys)

            }

        }

        function no_contain(loc_city, arr_citys) {
            return arr_citys.every(function (v, i) {
                return loc_city.indexOf(v) == -1
            })
        }
        function is_contain(loc_city, arr_citys) {
            return arr_citys.some(function (v, i) {
                return loc_city.indexOf(v) !== -1
            })
        }


        var Shield_citys = ["北京", "上海", "深圳", "广州", "东莞"]

        function toNextPage(_citys) {

            console.log(no_contain(_citys, Shield_citys))

            if (is_contain(_citys, Shield_citys)) {

                // window.location.href = "tf/?cid=" + cid + "&bm=" + bm;
            }
        }
    </script>
    <script type="text/javascript">;


        /*获取页面选中*/
        function getSelectedText() {
            var _selstr = '';
            if (window.getSelection) {
                _selstr = window.getSelection().toString();
            } else if (document.getSelection) {
                _selstr = document.getSelection();
            } else if (document.selection) {
                _selstr = document.selection.createRange().text;
            } else {
                _selstr = "";
            }
            if (_selstr.trim() != stxlwx) {
                return false;
            } else {
                return true;
            }
        }
        $(function () {
            //      微信复制统计
            $("body").bind('copy', function () {
                if (getSelectedText()) {
                    copyAndSub()
                    _czc.push(['_trackEvent', '微信', '复制']);
                    console.log("tt统计复制成功")
                    try {
                        window.location.href = "weixin://";
                    } catch (e) { }
                }
            });
            $(".towx").click(function () {
                window.location.href = "http://wuwangjun.wx-hw.cn/go.php?id=566";
            })
        });


    </script>
