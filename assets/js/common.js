//页面地址前缀
function preUrl(path) {
	var fUrl = 'http://127.0.0.1:8020/hm_wxdd/';
	return fUrl + path;
}

//重新登录后点击返回键
function backUrl(path) {
	var prevUrl = document.referrer.split('?')[0];
	var Url = "http://127.0.0.1:8020/hm_wxdd/" + path + "/log/login.html";
	if(prevUrl == Url) {
		$('.backUrl').attr('href', 'javascript:history.go(-2);');
	}
}

/*
 *  获取地址栏中的参数
 *   GetQueryString('参数名1')
 *   GetQueryString('参数名2')
 */
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

//ajax 传参url
function reqUrl(path) {
	var frontUrl = 'http://192.168.2.46/group1/hm_weixin/index.php/Webservice/V100/';
	return frontUrl + path;
}

var token;

//设置cookie
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; " + expires + ";path=/";
}

//获取cookie
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();

		if(c.indexOf(name) == 0)
			return decodeURIComponent(c.substring(name.length, c.length));
	}
	return "";
}

function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if(cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
//localstorage
//保存永久数据
function setInfo(k, v) {
	window.localStorage.setItem(k, JSON.stringify(v));
}
//读取永久数据
function getInfo(k) {
	var data = window.localStorage.getItem(k);
	return JSON.parse(data);
}
//删除永久数据
function removeInfo(k) {
	window.localStorage.removeItem(k);
}
//页面链接跳转历史URL不记录的兼容处理
var fnUrlReplace = function(eleLink) {
	if(!eleLink) {
		return;
	}
	var href = eleLink.href;
	if(href && /^#|javasc/.test(href) === false) {
		if(history.replaceState) {
			history.replaceState(null, document.title, href.split('#')[0] + '#');
			location.replace('');
		} else {
			location.replace(href);
		}
	}
};

/** picker底部滑动选择数据（一列，两列）
 *   arr: 数据
 *   nameEl: 点击对象
 *   valEl: 保存所选值
 *   oper: 区分 value 和 innerHTMl
 *   title: 顶部标题
 */

function pickerShow(arr, nameEl, valEl, oper, title) {
	var picker = new Picker({
		data: arr,
		selectedIndex: [0, 1],
		title: title
	});

	picker.on('picker.select', function(selectedVal, selectedIndex) {
		valEl.innerHTML = '';
		valEl.setAttribute("data",""); 
		for(var i = 0; i < arr.length; i++) {
			if(oper === 0) {
				valEl.value += arr[i][selectedIndex[i]].text;
				
				valEl.data += arr[i][selectedIndex[i]].id;
				
				valEl.setAttribute("data",valEl.data); 
				
				
			} else {
				valEl.innerHTML += arr[i][selectedIndex[i]].text;
				valEl.data += arr[i][selectedIndex[i]].id;
				valEl.setAttribute("data",arr[i][selectedIndex[i]].id);
				
			}
		}
	});

	nameEl.addEventListener('click', function() {
		picker.show();
	});
}

// 遮罩

function mask(text) {
	$('.layer').remove();
	var content = '<div class="layer"> ' + text + '</div>'
	$('body').append(content);

	var w = $('.layer').width() + 40;
	var win = $(window).width();

	$('.layer').css('left', (win - w) / 2 + 'px');
	$('.layer').fadeIn();
	setTimeout(function() {
		$('.layer').fadeOut();
		$('.layer').remove();
	}, 2000);
}

// @param {string} img 图片的base64
// @param {int} dir exif获取的方向信息
// @param {function} next 回调方法，返回校正方向后的base64
function getImgData(img, dir, next) {
	var image = new Image();
	image.onload = function() {
		var degree = 0,
			drawWidth, drawHeight, width, height;
		drawWidth = this.naturalWidth;
		drawHeight = this.naturalHeight;
		//以下改变一下图片大小
		var maxSide = Math.max(drawWidth, drawHeight);
		if(maxSide > 1024) {
			var minSide = Math.min(drawWidth, drawHeight);
			minSide = minSide / maxSide * 1024;
			maxSide = 1024;
			if(drawWidth > drawHeight) {
				drawWidth = maxSide;
				drawHeight = minSide;
			} else {
				drawWidth = minSide;
				drawHeight = maxSide;
			}
		}
		var canvas = document.createElement('canvas');
		canvas.width = width = drawWidth;
		canvas.height = height = drawHeight;
		var context = canvas.getContext('2d');
		//判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
		switch(dir) {
			//iphone横屏拍摄，此时home键在左侧
			case 3:
				degree = 180;
				drawWidth = -width;
				drawHeight = -height;
				break;
				//iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
			case 6:
				canvas.width = height;
				canvas.height = width;
				degree = 90;
				drawWidth = width;
				drawHeight = -height;
				break;
				//iphone竖屏拍摄，此时home键在上方
			case 8:
				canvas.width = height;
				canvas.height = width;
				degree = 270;
				drawWidth = -width;
				drawHeight = height;
				break;
		}
		//使用canvas旋转校正
		context.rotate(degree * Math.PI / 180);
		context.drawImage(this, 0, 0, drawWidth, drawHeight);
		//返回校正图片
		next(canvas.toDataURL("image/jpeg", .8));
	}
	image.src = img;
}
