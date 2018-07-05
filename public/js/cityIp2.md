<script type="text/javascript" src="http://pv.sohu.com/cityjson/getip.aspx" charset="utf-8"></script>
	<script language="javascript" type="text/javascript">

		function getQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]); return null;
		}
		var bm = getQueryString("bm");
		var cid = getQueryString("cid");

		var Shield_citys = ["北京", "上海", "深圳", "广州", "东莞"];

		try {

			if (returnCitySN && returnCitySN.cname) {

				toNextPage(returnCitySN.cname)
			}


		} catch (err) {

			console.log("err-----", err);

			(function () {

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
			})();
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

		function whoisobj(obj) {

			toNextPage(obj.city)
		}

		function toNextPage(_citys) {

			if (is_contain(_citys, Shield_citys)) {

				console.log(_citys)

				window.location.href = "./tf/?cid=" + cid + "&bm=" + bm;
			}
		}
	</script>
