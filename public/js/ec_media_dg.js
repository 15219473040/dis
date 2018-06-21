function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}


var bm  = getQueryString("bm");
var cid = getQueryString("cid");
// createScr('http://odjs.yksq.net/js/dg.js');
createScr('//odjs.ecsage.net/js/area.js');

window.onload =function(){

	_init_area()
	var CID2="891B45E1A8B1535183EF87588112AA6F";
	var PID2="02BDA81C9E99E2AF1172BA1B0A6008E1";
	var PRICE2="2D09079FC0EFC44FBE41BC1C28259C06";

	$el("customerId2").value=CID2;
	$el("productId2").value=PID2;
	var _obj = document.getElementsByName("productPlanId2");
	if(_obj){
		for(var i=0;i<_obj.length;i++){
			if(_obj[i].checked){
				_obj[i].value =PRICE2;
			}
		}
	}

}


function checkdg() {	
	if (hanzi(trim($el("username2").value)).length>10 || hanzi(trim($el("username2").value)).length<1 ) { 
		$el("username2").focus();
		alert("请正确填写用户名，以便我们方便联系您！");
		return false;
	}
	
	if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(trim($el("mobile2").value)))||trim($el("mobile2").value).length !=11){ 
		$el("mobile2").focus();
		alert("您的电话输入有误，请重新填写！"); 
		return false; 
	}

	if(document.getElementById('s_province').value=='省份'){
		alert("请选择省份");
		return false;
		
	}
	if(document.getElementById('s_city').value=='城市'){
		alert("请选择城市");
		return false;
	}
	if(document.getElementById('s_county').value=='地区'){
		alert("请选择地区");
		return false;
	}
	
	if (trim($el("addr2").value).length<3)  {
		$el("addr2").focus();
		alert("请详细填写您的街道地址（3个文字以上），以便我们方便联系您！");
		return false;
	}
	submitorder();
}
function $el(name) { 
	return document.getElementById(name);
}
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g, ""); 
} 
function hanzi(str){
	return str.replace(/[^\u4E00-\u9FA5]/g,''); 
}





// JavaScript Document dgs.js
document.write('<form name="form1" id="form1">' +
	'<input name="cid" id="cid"/>' +
	'<input name="customerId" id="customerId"/>' +
	'<input name="productPlanId" id="productPlanId"/>' +
	'<input name="productId" id="productId"/>' +
	'<input name="buyerName" id="buyerName"/>' +
	'<input name="buyerMobile" id="buyerMobile"/>' +
	'<input name="buyerProvince" id="buyerProvince"/>' +
	'<input name="buyerCity" id="buyerCity"/>' +
	'<input name="buyerArea" id="buyerArea"/>' +
	'<input name="buyerAddress" id="buyerAddress"/>' +
	'<input name="orderPrice" id="orderPrice"/>' +
	'<input name="payCategory" id="payCategory"/>' +
	'<input name="sendTime" id="sendTime"/>' +
	'<input name="buyerRemarks" id="buyerRemarks"/>' +
	'<input name="bm" id="bm"/>' +
	'<input name="fromUrl" id="fromUrl"/>' +
	'<input name="color" id="color"/>' +
	'<input name="size" id="size"/>' +
	'<input name="buyerSex" id="buyerSex"/>' +
	'<input name="channel" id="channel"/>' +
	'<input name="backUrl" id="backUrl" value=""/></form>');

$el("form1").style.display = "none";

function submitorder() {
	var oForm = document.getElementById("form1");
	oForm.cid.value = cid;
	oForm.channel.value = channel;
	oForm.customerId.value = $el("customerId2").value;
	if ($el("productId2") != null) {
		oForm.productId.value = $el("productId2").value;
	}
	oForm.buyerName.value = $el("username2").value;
	oForm.buyerMobile.value = $el("mobile2").value;
	oForm.buyerProvince.value = $el("s_province").value;
	oForm.buyerCity.value = $el("s_city").value;
	oForm.buyerArea.value = $el("s_county").value;
	oForm.buyerAddress.value = $el("addr2").value;
	var obj = document.getElementsByName("productPlanId2");
	var price = "";
	var planId = "";
	if (obj != null) {
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].checked) {
				price = (obj[i].attributes["price"].nodeValue);
				planId = (obj[i].attributes["value"].nodeValue);
			}
		}
		oForm.productPlanId.value = planId;
		oForm.orderPrice.value = price;
	}
	if ($el("payCategory2") != null) {
		oForm.payCategory.value = $el("payCategory2").value;
	}
	if ($el("sendTime2") != null) {
		oForm.sendTime.value = $el("sendTime2").value;
	}
	oForm.buyerRemarks.value = $el("remark2").value;
	oForm.bm.value = bm;
	oForm.fromUrl.value = $el("fromUrl").value;
	var col = document.getElementsByName("color2");
	if (col != null) {
		var color = "";
		for (var i = 0; i < col.length; i++) {
			if (col[i].checked) {
				color = (col[i].attributes["value"].nodeValue);
			}
		}
		oForm.color.value = color;
	}
	var siz = document.getElementsByName("size2");
	if (siz != null) {
		var ssize = "";
		for (var i = 0; i < siz.length; i++) {
			if (siz[i].checked) {
				ssize = (siz[i].attributes["value"].nodeValue);
			}
		}
		oForm.size.value = ssize;
	}
	var sex = "";
	var chkObjs = document.getElementsByName("sex2");
	for (var i = 0; i < chkObjs.length; i++) {
		if (chkObjs[i].checked) {
			sex = (chkObjs[i].value);
			break;
		}
	}
	oForm.buyerSex.value = sex;
	oForm.backUrl.value = '';
	oForm.method = 'post';
	//	oForm.target = '_blank';
	oForm.action = "//genod1.ecsage.net/order/gen/genOrderByForm";
	oForm.submit();
}

function $el(name) {
	return document.getElementById(name);
}

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

function hanzi(str) {
	return str.replace(/[^\u4E00-\u9FA5]/g, '');
}


function createScr(url) {
	var el = document.createElement("script");
	el.src=url;
	el.type="text/javascript";
	document.head.appendChild(el);
}
