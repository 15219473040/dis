
/**
 * dd.js
 */
 document.write(
 	'<div style="display:none">'+
 	'<input name="customerId2" id="customerId2" value="FBE04CD66DD9D5E67D4F9BE078936AD1"/>' +
 	'<input name="productId2" id="productId2" value="58CFECED4134A19885DC19433498482E"/>' +
 	'<input type="radio" price="0.00" value="2E3C52FFDF784BFD2CBA56D7E805AB11" checked="checked" name="productPlanId2"/>' +
 	'<input id="remark2"/>' +
 	'<img id="img2" src=""/></div>');


 function copyAndSub() {
	// _czc.push(['_trackEvent', '微信', '复制']);
	document.getElementById("remark2").value = stxlwx;
	submitorder();

}



function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

function getRefString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var ref = document.referrer
	var ref_ser = ref.slice(ref.indexOf("?"));
	var r = ref_ser.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

var ss = getQueryString('id');
if (ss != null) {
	stxlwx = ss;
}
var cid = getQueryString('cid');
var bm = getQueryString('bm');


function goto(obj) {
	var url = obj.getAttribute("url-data");
	window.location.href = url + cid + "&bm=" + bm + "&id=" + stxlwx;
}


/**
 * suiji.js
 */

 var arr_wx = ["jf02630", "nx6856", "jf46872"];
 var wx_index = Math.floor((Math.random() * arr_wx.length));
 stxlwx = arr_wx[wx_index];
 var img = arr_wx[wx_index] + ".gif";
 var wx_img = "<img width='100%' height='100%' src='images/" + img + "'>"; 



/**
 * Created by Charles Gan on 2016/12/19.
 * dg2s.js
 */
 var od = {
 	cid: '', buyerName: '', buyerMobile: '', buyerSex: '', country: '',
 	province: '', city: '', buyerProvince: '', buyerCity: '', buyerArea: '', buyerAddress: '', productId: '',
 	productPlanId: '', customerId: '', orderPrice: '', payCategory: '',
 	sendTime: '', buyerRemarks: '', bm: '', fromUrl: '', channel: '', color: '', size: '',
 	dealMoney: '', createBy: ''
 };


 function submitorder() {
 	setValue();
    /**var temp = document.createElement("form");
    temp.action = "http://192.168.1.26:8082/order/gen/genOrderByForm";
    temp.method = "post";
    temp.style.display = "none";
    //temp.setRequestHeader("Content-Type", "application/json");
    for (var x in od) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = od[x];
        // alert(opt.name)
        temp.appendChild(opt);
    }*/

    var imgSrc = "//fgenod.ecsage.net/order/gen/genOrderByForm?";
	//alert("###" + imgSrc + "###");
	for (var x in od) {
		var opt = document.createElement("textarea");
		opt.name = x;
		opt.value = od[x];
		imgSrc += (x + "=" + od[x] + "&");
	}
	//alert("###" + imgSrc + "@@@");
	imgSrc = imgSrc.substring(0, imgSrc.length - 1);

	//alert("@@@" + imgSrc + "@@@");
	var imgObj = document.getElementById("img2");
	imgObj.src = imgSrc;
}

function setValue() {
	od.cid = cid;
	od.buyerName = getValue("username2");
	od.buyerMobile = getValue("mobile2");
	od.buyerProvince = getValue("s_province");
	od.buyerCity = getValue("s_city");
	od.buyerArea = getValue("s_county");
	od.buyerAddress = getValue("addr2");
	od.productId = getValue("productId2");
	od.customerId = getValue("customerId2");
	od.payCategory = getValue("payCategory2");
	od.buyerRemarks = getValue("remark2");
	od.bm = bm;
	od.fromUrl = getValue("fromUrl");
	od.payCategory = getValue("payCategory2");
	od.sendTime = getValue("sendTime2");
	//od.buyerTel = '';
	//od.buyerEmail = '';
	//od.country = '';
	//od.province = '';
	//od.city = '';
	//od.orderStatus = '';
	//od.ip = '';
	//od.customerService = '';
	//od.lineTime = '';
	//od.channel = '';
	//od.dealMoney = '';
	//    od.createBy = getValue("createBy2");
	//od.createTime = '';
	//od.remarks = '';

	var obj = document.getElementsByName("productPlanId2");
	if (obj != null) {
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].checked) {
				od.orderPrice = (obj[i].attributes["price"].nodeValue);
				od.productPlanId = (obj[i].attributes["value"].nodeValue);
				break;
			}
		}
	}
	var col = document.getElementsByName("color2");
	if (col != null) {
		for (var i = 0; i < col.length; i++) {
			if (col[i].checked) {
				od.color = (col[i].attributes["value"].nodeValue);
				break;
			}
		}
	}
	var siz = document.getElementsByName("size2");
	if (siz != null) {
		for (var i = 0; i < siz.length; i++) {
			if (siz[i].checked) {
				od.size = (siz[i].attributes["value"].nodeValue);
				break;
			}
		}
	}
	var chkObjs = document.getElementsByName("sex2");
	for (var i = 0; i < chkObjs.length; i++) {
		if (chkObjs[i].checked) {
			od.buyerSex = (chkObjs[i].value);
			break;
		}
	}
}

function getValue(key) {
	var obj = null;
	try {
		obj = document.getElementById(key);
	}
	catch (e) {
	}
	if (obj == null || typeof (obj) == 'undefined' || typeof (obj.value) == 'undefined') {
		return '';
	}
	return obj.value;
}

/**
 * copy methods
 * 
 */
 createScr("//libs.baidu.com/jquery/2.0.0/jquery.min.js")

 window.onload=function(){

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
				copyAndSub();
				console.log("success")
				try {
					window.location.href = "weixin://";
				} catch (e) { }
			}
		});
	});

 }	

 function createScr(url) {
 	var el = document.createElement("script");
 	el.src = url;
 	el.type = "text/javascript";
 	document.head.appendChild(el);
 }
