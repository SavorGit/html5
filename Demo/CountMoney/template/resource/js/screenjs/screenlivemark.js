define('screenlivemark',['screencore','screensocket','template','layerBox','fulldm','keyboard','jquery.ui'],function(screencore,screensocket,template,layerBox,fulldm,keyboardJS){
	var screenlivemark = {
		ntimeout:null,//普通定时器
		stimeout:null,//成绩排名定时器
		ztimeout:null,//赞排名定时器
		otimeout:null,//单个用户定时器
		pfuserid:0,
		openpubpw:2,
		pubweight:0,
		init: function() {
			var self = this;
			var wsConfig = {};
			wsConfig.onmessage = function(data){
				if(data.type=='connected'){
					screensocket.isclose = false;
					var senddata = screensocket.senddata;
					senddata.type = 'commonjoin';
					screensocket.wsloginsend(senddata);
				}else if(data.type=='rolllivemark'){
					window.location.reload();
				}else if(data.type=='screendm'){
					var messages = data.messages;
					if(messages){
						if($.isArray(messages)&&messages.length>0){
							$.each(messages,function(i, val){
								if(val.type=='1'){
									fulldm.addBullet(val);
								}
							});
						}
					}else{
						fulldm.addBullet(data);
					}
				}else if(data.type=='screendeldm'){
					if(!$.isArray(data.msgid)){
						fulldm.delBullet(data.msgid);
					}else{
						$.each(data.msgid,function(index,val){
							fulldm.delBullet(val);
						});
					}
				}
			};
			screensocket.init(wsConfig);
			self.ajaxdata(function(){
				self.bindEvent();
				self.ntimeout = setInterval(function(){ 
					self.loadNormaldata();
				}, 3e3);
			});
			$('.openpubpw').draggable({containment: ".full-main", scroll: false ,stop: function(event, ui) {
				
			}});
		},
		ajaxdata:function(fn){
			screencore.ajaxSubmit('screen.livemark.getnormaldata',{},'正在获取轮次数据').then(function(json){
				 if(json.errno==0){
					 if(json.message!=false){
						 var pfuser = json.message.pfusers;
						 var normalhtml = "";
						 if(pfuser.length>0){
							 $.each(pfuser,function(k,v){
								v.scoretype = json.message.scoretype;
								normalhtml += template('normaluserItem',v);
							 })
						 }
						 $(".livemark-title").text(json.message.title);
						 $(".livemark-users").html(normalhtml);
						 $(".emptybox").addClass('display-none');
						 json.message.openzan=='2'? $(".livemark-btns").addClass('display-none'):$(".livemark-btns").removeClass('display-none');
						 if(json.message.pfstatus && json.message.pfstatus=='2'){
							 $(".startstopbtn div").attr({'class':'endstatus','data-state':'2'});
						 }
						 $(".livemark-list").removeClass('display-none');
					 }else{
						$(".livemark-list").addClass('display-none');
						$(".emptybox").removeClass('display-none');
					 }
				 }else{
					layerBox.showMsg(json.message);
				 }
				 fn&&fn();
			}, function(){
				 layerBox.showMsg('网络太差，请稍后重试');
			});
		},
		loadNormaldata:function(){
			screencore.ajaxSubmit('screen.livemark.getnormaldata',{}).then(function(json){
				 if(json.errno==0){
					 if(json.message!=false){
						 var pfuser = json.message.pfusers;
						 var normalhtml = "";
						 if(pfuser.length>0){
							 $.each(pfuser,function(k,v){
								v.scoretype = json.message.scoretype;
								normalhtml += template('normaluserItem',v);
							 })
						 }
						 json.message.openzan=='2'? $(".livemark-btns").addClass('display-none'):$(".livemark-btns").removeClass('display-none');
						 $(".livemark-title").text(json.message.title);
						 $(".livemark-users").html(normalhtml);
					 }
				 }else{
					layerBox.showMsg(json.message);
				 }
			}, function(){
				 layerBox.showMsg('网络太差，请稍后重试');
			});
		},
		loadScoredata:function(){
			screencore.ajaxSubmit('screen.livemark.getscoredata',{}).then(function(json){
				 if(json.errno==0){
					 if(json.message!=false){
						 $(".livemark-title").text(json.message.title);
						 var pfuser = json.message.pfusers;
						 if(pfuser.length>0){
							 if(pfuser[0]){
								pfuser[0].keyindex = 1;
								pfuser[0].scoretype = json.message.scoretype;
								$(".livemark-phb-top .rank1").html(template('scorephbtopItem',pfuser[0])).attr('data-pfuserid',pfuser[0].id);
							 }
							 if(pfuser[1]){
								 pfuser[1].keyindex = 2;
								 pfuser[1].scoretype = json.message.scoretype;
								 $(".livemark-phb-top .rank2").html(template('scorephbtopItem',pfuser[1])).attr('data-pfuserid',pfuser[1].id);
							 }
							 if(pfuser[2]){
								 pfuser[2].keyindex = 3;
								 pfuser[2].scoretype = json.message.scoretype;
								 $(".livemark-phb-top .rank3").html(template('scorephbtopItem',pfuser[2])).attr('data-pfuserid',pfuser[2].id);
							 }
							 var otherhtml = "";
							 if(pfuser.length>3){
								 $.each(pfuser,function(k,v){
									if(k>2){
										v.keyindex = k + 1;
										v.scoretype = json.message.scoretype;
										otherhtml += template('scorephbotherItem',v);
									}
								 })
							 }
							 $(".livemark-phb-others").html(otherhtml);
						 }else{
							 $(".livemark-phb-top .rank2,.livemark-phb-top .rank1,.livemark-phb-top .rank3,.livemark-phb-others").empty();
						 }
						 json.message.openzan=='2'? $(".livemark-btns").addClass('display-none'):$(".livemark-btns").removeClass('display-none');
					 }
				 }else{
					layerBox.showMsg(json.message);
				 }
			}, function(){
				 layerBox.showMsg('网络太差，请稍后重试');
			});
		},
		loadZandata:function(){
			var self = this;
			screencore.ajaxSubmit('screen.livemark.getzandata',{}).then(function(json){
				 if(json.errno==0){
					 if(json.message!=false){
						 $(".livemark-title").text(json.message.title);
						 var pfuser = json.message.pfusers;
						 var zanhtml = "";
						 if(pfuser.length>0){
							 $.each(pfuser,function(k,v){
								v.keyindex = k + 1;
								v.zanpercent = json.message.totalzan > 0 ? ((v.zan/json.message.totalzan) * 100) : 0;
								zanhtml += template('zanphbItem',v);
							 })
						 }
						 $(".livemark-dianzans").html(zanhtml);
						 if(json.message.openzan=='2'){
							$(".livemark-scrollbox .livemark-dianzans").addClass('display-none');
							$(".livemark-btns").addClass('display-none');
							self.clearAll();
							self.loadNormaldata();
							self.ntimeout = setInterval(function(){ 
								self.loadNormaldata();
							}, 3e3);
							$(".livemark-btns .btn-mark").addClass('active').siblings().removeClass('active');
							$(".livemark-scrollbox .livemark-users").removeClass('display-none');
							$(".livemark-topbtn").removeClass('display-none');
						 }else{
							$(".livemark-btns .btn-mark").removeClass('active').siblings().addClass('active');
							$(".livemark-btns").removeClass('display-none');
						 }
					 }
				 }else{
					layerBox.showMsg(json.message);
				 }
			}, function(){
				 layerBox.showMsg('网络太差，请稍后重试');
			});
		},
		loadUserdata:function(){
			var self = this;
			screencore.ajaxSubmit('screen.livemark.getuserdata',{pfuserid:self.pfuserid}).then(function(json){
				 if(json.errno==0){
					 $(".livemark-title").text(json.message.title);
					 $(".livemark-userone-info img").attr('src',json.message.userimg);
					 $(".livemark-userone-info div").text(json.message.username);
					 $(".livemark-userone-des").text(json.message.userdes);
					 if(json.message.openzan=='1'){
						 if(json.message.zanpm===false){
							$(".livemark-user-rank").addClass('display-none');
						 }else{
							$(".livemark-user-rank span").text(json.message.zanpm);
							$(".livemark-user-rank").removeClass('display-none');
						 }
						 $(".livemark-user-zanbox span span").text(json.message.totalzan);
						 var zanhtml = '';
						 $.each(json.message.zanusers,function(i,v){
							zanhtml += template("pfzanItem",v);
						 });
						 $(".livemark-zanbox").html(zanhtml);
						 $(".livemark-zanmain").removeClass('display-none');
					 }else{
						 if(!$(".livemark-scrollbox .livemark-dianzans").hasClass('display-none')){
							$(".livemark-scrollbox .livemark-dianzans").addClass('display-none');
							$(".livemark-scrollbox .livemark-users").removeClass('display-none');
							$(".livemark-topbtn").removeClass('display-none');
							$(".livemark-btns .btn-mark").addClass('active').siblings().removeClass('active');
						 }
						 $(".livemark-zanmain").addClass('display-none');
					 }
					 if(json.message.openpubpw=='1'){
					     $('.livemark-user-score').addClass('hidden');
					     $('.openpubpw').removeClass('hidden').css({"background-color":json.message.scorebgcolor,"color":json.message.scoretxtcolor});
					     $('.openpubpw .score_pw').text(json.message.score_pw===false?'无':json.message.score_pw);
					     $('.openpubpw .score_pub').text(json.message.score_pub===false?'无':json.message.score_pub);
					     $('.openpubpw .score_last').text(json.message.score===false?'无':json.message.score);
					     $('.openpubpw .pw_weight').text(100-json.message.pubweight);
					     $('.openpubpw .pub_weight').text(json.message.pubweight);
					 }else{
					     $('.livemark-user-score').removeClass('hidden');
					     $('.openpubpw').addClass('hidden');
				        $(".livemark-user-score .scoretype").text(json.message.scoretype=='1'?'总分：':'平均分：');
				        $(".livemark-user-score .scorenum").text(json.message.score===false?'无':json.message.score);
					 }
					 $(".livemark-user-totalscore .scoretips").text(json.message.pfmode=='1'?'':'去掉一个最高分，去掉一个最低分');
					 json.message.pftype=='1'?$(".livemark-user-pj").addClass('display-none'):$(".livemark-user-pj").removeClass('display-none');
					 $.each(json.message.pfusers,function(i,v){
						if($(".livemark-user-pingwei").find(".pwone-"+v.id).length<=0){
						    if(v.pwtype=='1'){
							    $(".livemark-user-pingwei").append(template("pwpfItem",v));
						    }
						}
					 });
					 if(json.message.pfusers.length<=3){
						if(self.pwuserTime1!=null) {
							clearTimeout(self.pwuserTime1);
							self.pwuserTime1 = null;
						}
						if(self.pwuserTime2!=null) {
							clearTimeout(self.pwuserTime2);
							self.pwuserTime2 = null;
						}
						if(json.message.pfusers.length<=0) $(".livemark-user-pingwei").empty();
					 }else{
						if(self.pwuserTime1==null && self.pwuserTime2==null) self.pwusermove();
					 }
					 var pfitemhtml = '';
					 $.each(json.message.pfitem,function(i,v){
						v.score = parseFloat(v.score/json.message.pfusers.length).toFixed(2);
						v.dfmax = parseFloat(v.dfmax).toFixed(2);
						v.percent = (v.score / v.dfmax ) * 100;
						pfitemhtml += template("pfitemone",v);
					 });
					 $(".livemark-user-single").html(pfitemhtml);
				 }else{
					layerBox.showMsg(json.message);
				 }
			}, function(){
				 layerBox.showMsg('网络太差，请稍后重试');
			});
		},
		bindEvent: function() {
			var self = this;
			$(".livemark-btns div").on('click',function(){
				var $this = $(this);
				$(".livemark-scrollbox>div").addClass('display-none');
				if($this.hasClass('btn-mark')){//点击了评分
					if($(".livemark-topbtn").text()=='查看排名'){
						self.clearAll();
						self.loadNormaldata();
						self.ntimeout = setInterval(function(){ 
							self.loadNormaldata();
						}, 3e3);
						$(".livemark-scrollbox .livemark-users").removeClass('display-none');
					}else{
						self.clearAll();
						self.loadScoredata();
						self.stimeout = setInterval(function(){ 
							self.loadScoredata();
						}, 3e3);
						$(".livemark-scrollbox .livemark-phbs").removeClass('display-none');
					}
					$(".livemark-topbtn").removeClass('display-none');
				}else{//点击了人气
					self.clearAll();
					self.loadZandata();
					self.ztimeout = setInterval(function(){ 
						self.loadZandata();
					}, 3e3);
					$(".livemark-scrollbox .livemark-dianzans").removeClass('display-none');
					$(".livemark-topbtn").addClass('display-none');
				}
				$this.addClass('active').siblings().removeClass('active');
			});
			$(".livemark-topbtn").on('click',function(){
				var $this = $(this);
				$(".livemark-scrollbox>div").addClass('display-none');
				if($this.text()=='查看排名'){//点击查看排名
					self.clearAll();
					self.loadScoredata();
					self.stimeout = setInterval(function(){ 
						self.loadScoredata();
					}, 3e3);
					$(".livemark-scrollbox .livemark-users").addClass('display-none');
					$(".livemark-scrollbox .livemark-phbs").removeClass('display-none');
					$this.text("<<返回列表");
				}else{//点击返回列表
					self.clearAll();
					self.loadNormaldata();
					self.ntimeout = setInterval(function(){ 
						self.loadNormaldata();
					}, 3e3);
					$(".livemark-scrollbox .livemark-users").removeClass('display-none');
					$(".livemark-scrollbox .livemark-phbs").addClass('display-none');
					$this.text("查看排名");
				}
			 });
			 $(".livemark-users").on('click','.livemark-user-item',function(){
					var $this = $(this);
					self.pfuserid = $this.attr('data-pfuserid');
					self.clearAll();
					self.loadUserdata();
					self.otimeout = setInterval(function(){ 
						self.loadUserdata();
					}, 3e3);
					$(".livemark-list").addClass('display-none');
					$(".livemark-userone").removeClass('display-none');
			 });
			 //
			 $(".livemark-dianzans").on('click','.livemark-dz-item',function(){
					var $this = $(this);
					self.pfuserid = $this.attr('data-pfuserid');
					self.clearAll();
					self.loadUserdata();
					self.otimeout = setInterval(function(){ 
						self.loadUserdata();
					}, 3e3);
					$(".livemark-list").addClass('display-none');
					$(".livemark-userone").removeClass('display-none');
			 });
			 $(".livemark-phbs").on('click','.livemark-phb-item,.livemark-phb-other-item',function(){
					var $this = $(this);
					self.pfuserid = $this.attr('data-pfuserid');
					self.clearAll();
					self.loadUserdata();
					self.otimeout = setInterval(function(){ 
						self.loadUserdata();
					}, 3e3);
					$(".livemark-list").addClass('display-none');
					$(".livemark-userone").removeClass('display-none');
			 });
			 $(".livemark-userone").on('click','.returnall',function(){
					self.pfuserid = 0;
					var showboxClass = $(".livemark-scrollbox>div").not($(".display-none")).attr('class');
					self.clearAll();
					$(".livemark-user-pingwei").empty();
					if(showboxClass=='livemark-users'){
						self.loadNormaldata();
						self.ntimeout = setInterval(function(){ 
							self.loadNormaldata();
						}, 3e3);
					}else if(showboxClass=='livemark-phbs'){
						self.loadScoredata();
						self.stimeout = setInterval(function(){ 
							self.loadScoredata();
						}, 3e3);
					}else{
						self.loadZandata();
						self.ztimeout = setInterval(function(){ 
							self.loadZandata();
						}, 3e3);
					}
					$(".livemark-list").removeClass('display-none');
					$(".livemark-userone").addClass('display-none');
			 });
			 //切换评委评分与单项分
			 $(".livemark-user-pj").on('click',function(){
				var $this = $(this),btntext = $this.text();
				if(btntext=='查看评委分'){
					$this.text('查看单项平均分');
					$(".livemark-user-pingwei").removeClass('display-none');
					$(".livemark-user-single").addClass('display-none');
				}else{
					$this.text('查看评委分');
					$(".livemark-user-pingwei").addClass('display-none');
					$(".livemark-user-single").removeClass('display-none');
				}
			 });
			 //切换单个用户
			 $(".livemark-userone .livemark-prevone").on('click',function(){
					if(self.pfuserid==0) return false;
					self.showprevnext('1');
			 });
			 $(".livemark-userone .livemark-nextone").on('click',function(){
					if(self.pfuserid==0) return false;
					self.showprevnext('2');
			 });
			 $(".startstopbtn div").on('click',function(){
				var state = $(this).attr('data-state');
				if(state=='1'){
					$(".startstopbtn div").attr('data-state','2');
					$(".startstopbtn div").removeClass('startstatus').addClass('endstatus');
				}else{
					$(".startstopbtn div").attr('data-state','1');
					$(".startstopbtn div").removeClass('endstatus').addClass('startstatus');
				}
				screencore.ajaxSubmit("screen.livemark.changestate",{status:(state=='1'?'2':'1')}).then(function(data){
					if(data.errno==0){
						layerBox.showMsg(state=='1'?'评分通道已关闭':'评分通道已开启');
					}else{
						layerBox.showMsg('网络异常，操作失败');
					}
				});
			});
			keyboardJS.bind('space', function(e) {
				var state = $(".startstopbtn div").attr('data-state');
				if(state=='1'){
					$(".startstopbtn div").attr('data-state','2');
					$(".startstopbtn div").removeClass('startstatus').addClass('endstatus');
				}else{
					$(".startstopbtn div").attr('data-state','1');
					$(".startstopbtn div").removeClass('endstatus').addClass('startstatus');
				}
				screencore.ajaxSubmit("screen.livemark.changestate",{status:(state=='1'?'2':'1')}).then(function(data){
					if(data.errno==0){
						layerBox.showMsg(state=='1'?'评分通道已关闭':'评分通道已开启');
					}else{
						layerBox.showMsg('网络异常，操作失败');
					}
				});
			});
			keyboardJS.bind('left', function(e) {
				self.showprevnextRound('2');
			});
			keyboardJS.bind('right', function(e) {
				self.showprevnextRound('1');
			});
			keyboardJS.bind('up', function(e) {
				$(".livemark-userone .livemark-prevone").trigger('click');
			});
			keyboardJS.bind('down', function(e) {
				$(".livemark-userone .livemark-nextone").trigger('click');
			});
		},
		pwuserTime1:null,
		pwuserTime2:null,
		loopTime:1e3,
		pwusermove:function(){
            var t = this;
            var c_tag = $(".livemark-user-pingwei");
            var top = c_tag.find(".pingweione").eq(0).outerHeight(true);
            t.pwuserTime1 = setTimeout(function(){
				c_tag.children(".pingweione").first().animate({"margin-top":"-"+top+"px"},t.loopTime,function(){
					var $li = $(this);
					if(!$li.is(":animated")){//动画已经结束
						$li.remove();
						$li.css("margin-top","0px").appendTo(c_tag);
						t.pwuserTime2 = setTimeout(function(){
							t.pwusermove();
						},t.loopTime);
					}
				});
			},t.loopTime);
        },
		showprevnextRound:function(ctype){
			ctype = ctype||"1";
			screencore.ajaxSubmit('screen.livemark.prevnextround',{ctype:ctype}).then(function(json){
			}, function(){
				 layerBox.showMsg('网络太差，请稍后重试');
			});
		},
		showprevnext:function(type){
			var self = this;
			type = type||'1';
			self.clearAll();
			screencore.ajaxSubmit('screen.livemark.prevnext',{pfuserid:self.pfuserid,ctype:type}).then(function(json){
				 if(json.errno==0){
					self.pfuserid = json.message;
					self.clearAll();
					$(".livemark-user-pingwei").empty();
					self.loadUserdata();
					self.otimeout = setInterval(function(){ 
						self.loadUserdata();
					}, 3e3);
				 }
			}, function(){
				 layerBox.showMsg('网络太差，请稍后重试');
			});
		},
		clearAll:function(){
			var self = this;
			self.ntimeout!=null && clearInterval(self.ntimeout);
			self.stimeout!=null && clearInterval(self.stimeout);
			self.ztimeout!=null && clearInterval(self.ztimeout);
			self.otimeout!=null && clearInterval(self.otimeout);
			if(self.pwuserTime1!=null) {
				clearTimeout(self.pwuserTime1);
				self.pwuserTime1 = null;
			}
			if(self.pwuserTime2!=null) {
				clearTimeout(self.pwuserTime2);
				self.pwuserTime2 = null;
			}
		},
	};
	return screenlivemark;
});