define('screencore',['jquery','layerBox'],function($,layerBox){
	var screencore = {
		debug:false,
		emotions:{
		"1": ["[微笑]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/1.png"],
		"2": ["[撇嘴]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/2.png"],
		"3": ["[色]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/3.png"],
		"4": ["[发呆]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/4.png"],
		"5": ["[得意]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/5.png"],
		"6": ["[流泪]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/6.png"],
		"7": ["[害羞]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/7.png"],
		"8": ["[闭嘴]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/8.png"],
		"9": ["[睡]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/9.png"],
		"10": ["[大哭]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/10.png"],
		"11": ["[尴尬]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/11.png"],
		"12": ["[发怒]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/12.png"],
		"13": ["[调皮]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/13.png"],
		"14": ["[龇牙]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/14.png"],
		"15": ["[惊讶]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/15.png"],
		"16": ["[难过]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/16.png"],
		"17": ["[酷]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/17.png"],
		"18": ["[冷汗]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/18.png"],
		"19": ["[抓狂]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/19.png"],
		"20": ["[吐]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/20.png"],
		"21": ["[偷笑]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/21.png"],
		"22": ["[冷酷]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/22.png"],
		"23": ["[白眼]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/23.png"],
		"24": ["[傲慢]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/24.png"],
		"25": ["[饥饿]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/25.png"],
		"26": ["[困]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/26.png"],
		"27": ["[惊恐]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/27.png"],
		"28": ["[流汗]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/28.png"],
		"29": ["[憨笑]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/29.png"],
		"30": ["[大兵]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/30.png"],
		"31": ["[奋斗]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/31.png"],
		"32": ["[咒骂]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/32.png"],
		"33": ["[疑问]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/33.png"],
		"34": ["[嘘]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/34.png"],
		"35": ["[晕]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/35.png"],
		"36": ["[折磨]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/36.png"],
		"37": ["[哀]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/37.png"],
		"38": ["[骷髅]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/38.png"],
		"39": ["[敲打]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/39.png"],
		"40": ["[再见]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/40.png"],
		"41": ["[擦汗]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/41.png"],
		"42": ["[抠鼻]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/42.png"],
		"43": ["[鼓掌]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/43.png"],
		"44": ["[糗大了]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/44.png"],
		"45": ["[坏笑]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/45.png"],
		"46": ["[左哼哼]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/46.png"],
		"47": ["[右哼哼]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/47.png"],
		"48": ["[哈欠]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/48.png"],
		"49": ["[鄙视]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/49.png"],
		"50": ["[委屈]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/50.png"],
		"51": ["[快哭了]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/51.png"],
		"52": ["[阴险]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/52.png"],
		"53": ["[亲亲]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/53.png"],
		"54": ["[吓]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/54.png"],
		"55": ["[可怜]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/55.png"],
		"56": ["[菜刀]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/56.png"],
		"57": ["[西瓜]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/57.png"],
		"58": ["[啤酒]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/58.png"],
		"59": ["[篮球]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/59.png"],
		"60": ["[乒乓]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/60.png"],
		"61": ["[咖啡]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/61.png"],
		"62": ["[饭]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/62.png"],
		"63": ["[猪头]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/63.png"],
		"64": ["[玫瑰]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/64.png"],
		"65": ["[凋谢]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/65.png"],
		"66": ["[示爱]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/66.png"],
		"67": ["[爱心]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/67.png"],
		"68": ["[心碎]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/68.png"],
		"69": ["[蛋糕]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/69.png"],
		"70": ["[闪电]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/70.png"],
		"71": ["[炸弹]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/71.png"],
		"72": ["[刀]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/72.png"],
		"73": ["[足球]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/73.png"],
		"74": ["[瓢虫]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/74.png"],
		"75": ["[便便]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/75.png"],
		"76": ["[月亮]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/76.png"],
		"77": ["[太阳]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/77.png"],
		"78": ["[礼物]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/78.png"],
		"79": ["[拥抱]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/79.png"],
		"80": ["[强]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/80.png"],
		"81": ["[弱]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/81.png"],
		"82": ["[握手]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/82.png"],
		"83": ["[胜利]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/83.png"],
		"84": ["[抱拳]", "../addons/meepo_xianchangv2/template/resource/images/wechat/emoji/84.png"],
		},
		emotionDataIndexs:{
		"[微笑]":1,
		"[撇嘴]":2,
		"[色]":3,
		"[发呆]":4,
		"[得意]":5,
		"[流泪]":6,
		"[害羞]":7,
		"[闭嘴]":8,
		"[睡]":9,
		"[大哭]":10,
		"[尴尬]":11,
		"[发怒]":12,
		"[调皮]":13,
		"[龇牙]":14,
		"[惊讶]":15,
		"[难过]":16,
		"[酷]":17,
		"[冷汗]":18,
		"[抓狂]":19,
		"[吐]":20,
		"[偷笑]":21,
		"[冷酷]":22,
		"[白眼]":23,
		"[傲慢]":24,
		"[饥饿]":25,
		"[困]":26,
		"[惊恐]":27,
		"[流汗]":28,
		"[憨笑]":29,
		"[大兵]":30,
		"[奋斗]":31,
		"[咒骂]":32,
		"[疑问]":33,
		"[嘘]":34,
		"[晕]":35,
		"[折磨]":36,
		"[哀]":37,
		"[骷髅]":38,
		"[敲打]":39,
		"[再见]":40,
		"[擦汗]":41,
		"[抠鼻]":42,
		"[鼓掌]":43,
		"[糗大了]":44,
		"[坏笑]":45,
		"[左哼哼]":46,
		"[右哼哼]":47,
		"[哈欠]":48,
		"[鄙视]":49,
		"[委屈]":50,
		"[快哭了]":51,
		"[阴险]":52,
		"[亲亲]":53,
		"[吓]":54,
		"[可怜]":55,
		"[菜刀]":56,
		"[西瓜]":57,
		"[啤酒]":58,
		"[篮球]":59,
		"[乒乓]":60,
		"[咖啡]":61,
		"[饭]":62,
		"[猪头]":63,
		"[玫瑰]":64,
		"[凋谢]":65,
		"[示爱]":66,
		"[爱心]":67,
		"[心碎]":68,
		"[蛋糕]":69,
		"[闪电]":70,
		"[炸弹]":71,
		"[刀]":72,
		"[足球]":73,
		"[瓢虫]":74,
		"[便便]":75,
		"[月亮]":76,
		"[太阳]":77,
		"[礼物]":78,
		"[拥抱]":79,
		"[强]":80,
		"[弱]":81,
		"[握手]":82,
		"[胜利]":83,
		"[抱拳]":84
		},
		emoToimg:function (txt) {
			if(!txt) return '';
			var e = this;
			txt = txt.toString();
			var patternemoji = /\[[\u4e00-\u9fa5]+\]/g;
			return txt.replace(patternemoji, function(match) {
					if(e.emotionDataIndexs[match]){
						return '<img src="' + e.emotions[e.emotionDataIndexs[match]][1] + '" class="faceImg" />'
					}
			})
		},
		getQueryString:function(key){
			return this.getParas(key);
		},
		getParas: function(name){
			var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i")); 
			if (result == null || result.length < 1){ 
				return "";
			}
			return result[1]; 
		},
		ajaxSubmit: function(url,params,tips){
			var self = this;
			if ( typeof(tips) != "undefined" ) {
				var layindex = layerBox.showLoading(tips);
			}
			params.hdid = XCV2Config.hdid;
			params.hdhash = XCV2Config.hdhash;
			var ajaxObj = $.Deferred();
			$.ajax({
				url:self.makeurl(url),
				type: 'post',
				data:params,
				dataType: 'json'
			}).then(function(json){
				if ( typeof(tips) != "undefined" ) {
					layerBox.close(layindex);
				}
				ajaxObj.resolve(json);
			}, function(json){
				if ( typeof(tips) != "undefined" ) {
					layerBox.close(layindex);
				}
				self.alert(json);
				ajaxObj.reject(json);
			});
			return ajaxObj.promise();
		},
		makeurl:function(r,hdid){
			var hdid = hdid||false;
			var i = this.getQueryString('i');
			var j = this.getQueryString('j');
			if(!hdid){
				return './index.php?i='+i+'&j='+j+'&c=entry&do=mobile&r='+r+'&m=meepo_xianchangv2';
			}else{
				return './index.php?i='+i+'&j='+j+'&c=entry&do=mobile&r='+r+'&m=meepo_xianchangv2&hdid='+hdid;
			}
		},
		anicssold:function(element, animationName, callback) {
			var e = this;
			var node = document.querySelector(element);
			animationName = animationName||e.anicssArr();
			node.classList.add('animated', animationName);
			function handleAnimationEnd() {
				node.classList.remove('animated', animationName)
				node.removeEventListener('animationend', handleAnimationEnd);
				if (typeof callback === 'function') callback();
			}
			node.addEventListener('webkitAnimationEnd animationend', handleAnimationEnd);
		},
		anicss:function(element, animationName, callback){
			var e = this;
			if(!animationName){
				animationName = e.anicssArr();
			}
			$(element).addClass('animated ' + animationName).one('animationend webkitAnimationEnd', function() {
				$(element).removeClass('animated ' + animationName);
				if (typeof callback === 'function') {
					callback();
				}
			});
			return $(element);
		},
		anicssArr:function(){
			var arr = ['bounceInDown','bounceInLeft','bounceInUp','bounceInRight'];
			var key = Math.floor(Math.random()*arr.length);
			return arr[key];
		},
		gameEndphb:function(list,num){
			num = num||10;
			var r = $(".rankBox"),o = $(".rank-others li");
			for(var i=0,j=list.length;i<j;i++){
				if(i<3){
					if(i < num && list[i] ){
						var box = i==0?r.find('.rank-item-first'):i==1?r.find('.rank-item-second'):r.find('.rank-item-third');
						box.find('img').attr('src',list[i].avatar);
						box.find('p').text(list[i].nickname);
					}
				}else{
					if(i < num && list[i] ){
						o.eq((i-3)).find('img').attr('src',list[i].avatar);
						o.eq((i-3)).find('p span').text(list[i].nickname);
					}
				}
			}
			r.removeClass('display-none');
			if(num <= 3){
				$(".rank-others").remove();
				num >= 1 && $(".rankfirst-second-third .rank-item-first").removeClass('opacity-hide').animateControl('bounceInDown');
				num >= 2 && $(".rankfirst-second-third .rank-item-second").removeClass('opacity-hide').animateControl('bounceInDown');
				num == 3 && $(".rankfirst-second-third .rank-item-third").removeClass('opacity-hide').animateControl('bounceInDown');
				setTimeout(function(){
					$('.rankBox-btns').removeClass('opacity-hide');
				},1e3);
			}else{
				$(".rankfirst-second-third .rank-item").removeClass('opacity-hide');
				$('.rank-item-first').animateControl('bounceInDown');
				$('.rank-item-second').animateControl('bounceInDown');
				$('.rank-item-third').animateControl('bounceInDown');
				setTimeout(function(){
					$(".rank-others .rank-others-item:gt("+(num - 4)+")").length>0 && $(".rank-others .rank-others-item:gt("+(num - 4)+")").remove();
					$('.rank-others').removeClass('opacity-hide').animateControl('bounceInUp',function(){
						$('.rankBox-btns').removeClass('opacity-hide');
					});
				},1e3);
			}
		},
		alert:function(data){
			if(this.debug){
				alert(JSON.stringify(data));
			}
		},
		timeTostring:function(time,type){
			  var type = type||'1';
			  var    now     = new Date(time*1000);
			  var    year     =now.getFullYear();     
			  var   month  =now.getMonth()+1;     
			  var   date      =now.getDate();     
			  var   hour     =now.getHours();     
			  var   minute =now.getMinutes();     
			  var   second =now.getSeconds();  
			  if(type=='1'){
				 return   (month<10?'0'+month:month)+"-"+(date<10?'0'+date:date)+"   "+(hour<10?'0'+hour:hour)+":"+(minute<10?'0'+minute:minute)+":"+(second<10?'0'+second:second);     
			  }else{
				 return   year+'-'+(month<10?'0'+month:month)+"-"+(date<10?'0'+date:date)+"   "+(hour<10?'0'+hour:hour)+":"+(minute<10?'0'+minute:minute)+":"+(second<10?'0'+second:second);
			  }
		},
		videofullScreen:function(video,data,father){
			if(data==null) return;
			father = father||window;
			var winW = $(father).width();
			var winH = $(father).height();
			var dir = winW/winH;
			if((data.width/data.height)<=dir){
				$(video).css({width:winW,height:'auto',left:0,top:'50%',marginLeft:0});
				var h = winW/data.dir;
				$(video).css({marginTop:h/-2});
			}else{
				$(video).css({height:winH,width:'auto',top:0,left:'50%',marginTop:0});
				var w = winH*data.dir;
				$(video).css({marginLeft:w/-2});
			}
		},
		getvideoData:function(video){
			video = video.length>0?video[0]:video;
			var videoW = video.videoWidth;
			var videoH = video.videoHeight;
			var dir = videoW/videoH;
			var time = parseInt(video.duration);
			return {dir:dir,width:videoW,height:videoH,time:time}
		},
		coundown:function(time,lg,draw,jgtime){
				var jgtime = jgtime||false;
				var b = setInterval(function() {
					time = time -1;
					if(time > 0){//>0
						if (lg) {
							lg(time);
						}
					}else{
						clearInterval(b);
						if (draw) {
							draw()
						}
					}
				}, jgtime||1e3);
				return b;
		},
		fullScreen:function () {
			  var el = document.documentElement;
			  var rfs = el.requestFullScreen || el.webkitRequestFullScreen;
			  if(typeof rfs != "undefined" && rfs) {
				rfs.call(el);
			  } else if(typeof window.ActiveXObject != "undefined") {
				var wscript = new ActiveXObject("WScript.Shell");
				if(wscript != null) {
					wscript.SendKeys("{F11}");
				}
			  }else if (el.msRequestFullscreen) {
				el.msRequestFullscreen();
			  }else if(el.oRequestFullscreen){
				el.oRequestFullscreen();
			  }else{
				alert('浏览器不支持全屏,按F11键切换全屏');
			  }
		},
		exitFullScreen:function () {
			  var el = document;
			  var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.exitFullScreen;
			  if(typeof cfs != "undefined" && cfs) {
				cfs.call(el);
			  } else if(typeof window.ActiveXObject != "undefined") {
				var wscript = new ActiveXObject("WScript.Shell");
				if(wscript != null) {
					wscript.SendKeys("{F11}");
				}
			}else if (el.msExitFullscreen) {
				el.msExitFullscreen();
			}else if(el.oRequestFullscreen){
				el.oCancelFullScreen();
			}else{ 
				alert('浏览器不支持全屏,按F12键切换全屏');
			}
		},
		randomInt:function(n, m){
			var random = Math.floor(Math.random()*(m-n+1)+n);
			return random;
		},
		setcookie: function (e, t, i) {
            expires = new Date,
            expires.setTime(expires.getTime() + 1e3 * i),
            document.cookie = XCV2Config.cookie.pre + e + "=" + escape(t) + "; expires=" + expires.toGMTString() + "; path=/"
        },
		objectToarray:function(o){
			var arr = [];
			for(var i in o) {
				arr.push(o[i]);
			}
			return arr;
		},
		alert:function(data){
			if(this.debug){
				alert(JSON.stringify(data));
			}
		},
		sendLuckerTpl:function(rotateid){
			var self = this;
			self.ajaxSubmit('screen.common.sendluckertpl',{'gametype':XCV2Config.gametype,rotateid:rotateid}).then(function(data){
				console.log(data.errno);
			}, function(){
			});
		},
		gameautocreate:function(){
			var self = this;
			self.ajaxSubmit('screen.common.gameautocreate',{'gametype':XCV2Config.gametype}).then(function(data){
				if(data.errno==0){
					window.location.reload();
				}else{
					layerBox.showMsg(data.message);
				}
			}, function(){
				layerBox.showMsg('网络异常，操作失败');
			});
		},
		mediaUrl:function(url){
			if(url=='') return url;
			var http = url.substr(0, 7).toLowerCase(),https = url.substr(0, 8).toLowerCase();
			if(http=== "http://"||https=== "https://"){
				return url;
			}
			return XCV2Config.attchurl + url;
		},
		getBase64img:function(src, fn){
			var img = document.createElement('img'),
			dataURL = '';
			img.crossOrigin = '';
			img.src = src;
			img.onload = function() {
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, img.width, img.height);
				fn(canvas.toDataURL());
			};
		},
		/*从数组中获取固定个数的随机值*/
		arrayrandom:function(arr, len) {
			var l = arr.length;
			if (l <= len) {
				len = l
			}
			var d = [];
			for (var e = 0; e < l; e++) {
				d[e] = e
			}
			d.sort(function() {
				return 0.5 - Math.random()
			});
			var c = [];
			for (e = 0; e < len; e++) {
				c.push(arr[d[e]])
			}
			return c;
		},
		/*从数组中删除某个元素 并返回改元素*/
		arrayremove:function(b, e, d) {
			var a = b.length;
			for (var c = 0; c < a; c++) {
				if (e == b[c][d]) {
					return b.splice(c, 1)[0]
				}
			}
			return null
		},
		/*移除全部*/
		arrayremoveall:function(a, d, c) {
			for (var b = 0; b < a.length; b++) {
				if (d == a[b][c]) {
					a.splice(b, 1);
					b--
				}
			}
		},
		/*从数组中查找某元素*/
		arraysearch:function(b, e, d) {
			var a = b.length;
			for (var c = 0; c < a; c++) {
				if (e == b[c][d]) {
					return b[c]
				}
			}
			return null;
		},
		/*获取数组元素对象中某值等于给定值的元素 数组集合*/
		arraybyvalue:function(c, g, f) {
			var d = []
			  , b = c.length;
			for (var e = 0; e < b; e++) {
				if (c[e].hasOwnProperty(f) && g == c[e][f]) {
					d.push(c[e]);
				}
			}
			return d;
		},
		/*获取数组元素对象中不等于定值的元素 数组集合*/
		arraybynotvalue:function(c, g, f) {
			var d = []
			  , b = c.length;
			for (var e = 0; e < b; e++) {
				if (c[e].hasOwnProperty(f) && g != c[e][f]) {
					d.push(c[e]);
				}
			}
			return d;
		},
		hiddentxt:function(str,startLen,endLen,replaceword) { 
			 var len = str.length - startLen - endLen;
			 var xing = '';
			 replaceword = replaceword || '*';
			 if (str.length <= 0 || len==0) {
				return str;
			 }
			 if(len<0){
				startLen = 0;
				len = str.length - endLen;
			 }
			 for (var i=0;i<len;i++) {
				 xing+=replaceword;
			 }
			 return str.substring(0,startLen)+xing+str.substring(str.length-endLen);
	   },
	   hideFootMenu:function(){
			!$(".footer-controlBox").hasClass('down') && $('.footer-controlBox').trigger('mouseleave');
	   },
	   hideFootAndQr:function(){
			!$(".hdQrbox").is(':hidden') && $(".control-normal-list .openqr").trigger('click',['1']);
			!$(".footer-controlBox").hasClass('down') && $('.footer-controlBox').trigger('mouseleave');
	   },
	};
	return screencore;
});
