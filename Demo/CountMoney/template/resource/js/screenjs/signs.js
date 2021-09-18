define('signs',['jquery','template','screencore','layerBox'],function($,template,screencore,layerBox){
	var signs = {
		animateIndex:0,
		loaded:false,
		lastid:0,
		showtype:'1',
		signQueue:[],
		msgRender:null,
		oldSign:[],
		init:function(){
			var e = this;
			e.showtype = itemshowtype;
			e.signRender = template('sign-tpl');
			$(".sign-lists").css({"display":"block","opacity":"1"});
			screencore.anicss(".sign-lists","zoomInRight");
			e.getSignList();
		},
		getSignList:function(){
			var e = this;
			screencore.ajaxSubmit("screen.sign.historysign",{bdinfo:XCV2Config.bdinfo}).then(function(data){
				var ajaxsigns = data.message;
				var signLength = ajaxsigns.length;
				if(signLength>0){
					e.lastid = ajaxsigns[0].id;
					ajaxsigns = ajaxsigns.reverse();
					for (var m=0;m<signLength;m++) {
						e.signQueue.unshift(ajaxsigns[m]);
					};
				}
				$(".joinPeople span").text(signLength);
				e.oldSign = ajaxsigns;
				//e.append();
				e.loaded = true;
				setInterval(function() {
					e.loaded&&e.append();
				},1400);
			},function(){
				layerBox.showMsg('加载出错');
			});
			setInterval(function() {
				e.loaded&&e.ajaxNewsign();
			}, 5000);
		},
		ajaxNewsign:function(){
			var e = this;
			screencore.ajaxSubmit("screen.sign.newsign",{lastid:e.lastid,bdinfo:XCV2Config.bdinfo}).then(function(data){
					var ajaxmsgs = data.message.message;
					var newsignLength = ajaxmsgs.length;
					if(newsignLength>0){
						e.lastid = ajaxmsgs[0].id;
						ajaxmsgs = ajaxmsgs.reverse();
						for (var m=0;m<newsignLength;m++) {
							var oneMsg = ajaxmsgs[m];
							e.signQueue.unshift(oneMsg);
						};
					}
					$(".joinPeople span").text(data.message.total);
			},function(){
				layerBox.showMsg('加载出错');
			});
		},
		rotate:function(h){
			var self = this;
			h.closest("li").addClass(self.showtype=='1'?"bigtosmall":"rotatebigtosmall");
		},
		append:function() {
			var e = this;
			if (e.signQueue.length == 0){
				return ;
			}else{
				var i = e.signQueue.pop();//方法用于删除并返回数组的最后一个元素。
				i.num = $(".sign-lists ul li").length+1;
			}
			var g = $(".sign-lists>ul");
			var h = e.signRender(i);
			var f = $(h);
			g.prepend(f);
			e.rotate(f);
		},
	};
	return signs;
});
