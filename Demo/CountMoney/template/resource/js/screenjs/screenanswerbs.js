define('screenanswerbs',['screensocket','screencore','template','layerBox','fulldm','keyboard'],function(screensocket,screencore,template,layerBox,fulldm,keyboardJS){
	var screenanswerbs = {
		gamestatus:0,
		stopclick:false,
		gameend:0,
		questionstatus:'0',
		maxscore: 120,
		phbnums:10,
		autoquestion:1,
		autorun:1,
		autonum:20,
		gametimererror:true,
		joinInterval:null,
		questiontpl:null,
		questionranktpl:null,
		allranktpl:null,
		rankTen:[],
		audio:{},
		init: function() {
			var self = this;
			self.questiontpl = template('question-tpl');
			self.questionranktpl = template('questionrank-tpl');
			self.allranktpl = template('allrank-tpl');
			self.pmitemRender = template('pmshakeItem-tpl');
			var params = {};
			params.onmessage = function(data){
				if(data.type=='connected'){
					screensocket.isclose = false;
					screensocket.sendData({type:"answerbsgame",stype:"gamelink"});
				}else if(data.type=='gamenoround'){
					if(self.gamestatus==0){
						self.showLastRoundUser();
						self.gameend = 1;
					}
				}else if(data.type=='gameonline'){
					self.gamestatus==1&&self.rushuser(data);
				}else if(data.type=='gameiswait'||data.type=='gameisrun'){
					self.initAudio();
					self.bindEvent();
					self.phbnums = data.phbnums;
					if(self.phbnums>10||self.phbnums==0) self.phbnums = 10;
					if(data.question==null){
						return layerBox.showMsg('本轮异常，未添加轮次题目',1);
					}
					self.questionstatus = data.question.status;
					self.autoquestion = data.autoquestion;
					if(data.type=='gameiswait'){
						$(".welcomeBox").removeClass("display-none");
						screencore.anicss(".welcomeBox");
						self.gamestatus = 1;
						clearInterval(self.joinInterval);
						self.autorun = data.autorun;
						self.autonum = data.autonum;
						self.joinInterval = setInterval(function(){
							screensocket.sendData({type:"answerbsgame",stype:"gameonline"});
						},2e3);
					}else{
						$(".answerbs-lists .answerbs-quescontent").html(self.questiontpl(data.question));
						if(self.autoquestion==2&&self.questionstatus=='3'){
							self.rushDom({alllist:data.alllist,nowlist:[]});
							$(".answerbs-lists .answerbs-quesitem-right").show();
							$(".answerbs-lists .next-question-btn").removeClass('display-none');
						}
						$(".answerbs-lists").removeClass("display-none");
						self.gamestatus = 2;
						self.gametimererror = true;
						setTimeout(function(){
							if(self.gamestatus == 2&&self.questionstatus=='2'&&self.gametimererror){
								layerBox.showConfirm('警告','当前轮次计时器存在异常，需要重置才可以继续开始',['重置本轮','跳过本轮，进入下一轮'],function(){
									screensocket.sendData({type:"answerbsgame",stype:"gameerror"});
								},function(){
									screensocket.sendData({type:"answerbsgame",stype:"gamedel"});
								});
							}
						},4e3);
					}
				}else if(data.type=='gameiscountdown'){
					self.gametimererror = false;
					if($(".answerbs-quescontent ul").length==0){
						var b = $(".webstartdjs"),e = b.find(".webstartdjsBox"),s = b.find(".startdjsani");
						s.text(data.djs>0?data.djs:'GO');
						b.removeClass('display-none');
					}
					self.audio.countAudio.play();
					data.djs==0&&layerBox.closeLayer();
				}else if(data.type=='gameisdjs'){
					self.gamestatus = 2;
					self.questionstatus = '2';
					self.gametimererror = false;
					$(".welcomeBox,.webstartdjs").addClass('display-none');
					if($(".question-"+data.question.id).length<=0) $(".answerbs-lists .answerbs-quescontent").html(self.questiontpl(data.question));
					$(".answerbs-lists").removeClass("display-none");
					var b = $(".webgamedjs"),s = b.find(".gamedjsani");
					s.text(data.djs);
					b.removeClass('display-none');
					if(data.djs == 0){
						self.gamestatus = 3;
						self.questionstatus = '3';
						b.addClass('display-none');
						layerBox.showMsg('正在加载答题结果...',1);
					}
					self.rushDom(data);
				}else if(data.type=='gamehadquestion'){
					var hasnext = data.hasnext;
					layerBox.closeLayer();
					self.showquestionresult(data.percents);
					if(data.num > 0){
						if(data.autoquestion==1){
							layerBox.showMsg('即将进入下一题',1);
							screensocket.sendData({type:"answerbsgame",stype:"nextquestion"});
						}else{
							$(".answerbs-lists .next-question-btn").removeClass('display-none');
						}
					}else{
						var btn = $(".rankBox-btns .paiming");
						btn.attr({'data-rotateid':data.rotateid,'data-gamephb':data.gamephb});
						setTimeout(function(){
							self.showEndUser();
							screencore.sendLuckerTpl(data.rotateid);
						},3e3);
						self.gameend = 1;
					}
				}else if(data.type=='gameshowphbbtn'){
					layerBox.closeLayer();
					var btn = $(".rankBox-btns .paiming");
					btn.attr({'data-rotateid':data.rotateid,'data-gamephb':data.gamephb});
					setTimeout(function(){
						self.showEndUser();
						self.audio.overAudio.play();
						screencore.sendLuckerTpl(data.rotateid);
					},3e3);
				}else if(data.type=='gameanswerbsrefresh'||data.type=='gameerrorhaddone'){
					window.location.reload();
				}else if(data.type=='gameiserror'){
					layerBox.showMsg('当前轮次异常');
					setTimeout(function(){
						window.location.reload();
					},1e3);
				}else if(data.type=='answerbsoffline'){
					screensocket.forceoff = true;
					layerBox.showMsg('当前游戏不支持多开，当前窗口已经被迫下线','0');
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
				}else if(data.type=='screenresetdm'){
					fulldm.resetBullet();
				}
			};
			params.onclose = function(){
				screensocket.reconnect();
				clearInterval(self.joinInterval);
			};
			screensocket.init(params);
		},
		initAudio: function(){
			var self = this;
			self.audio.joinAudio = document.getElementById("joinaudio");
			self.audio.countAudio = document.getElementById("countaudio");
			self.audio.overAudio = document.getElementById("overaudio");
		},
		bindEvent: function() {
			var self = this;
			$(".start-btn").on('click',function(){
				if(screensocket.isclose) return;
				if(parseInt($(".welcomeBox-nums span").text())==0) return layerBox.showMsg('当前无用户参与，无法开始游戏');
				if(self.stopclick) return;
				self.stopclick = true;
				$(".welcomeBox").addClass('display-none');
				screencore.hideFootAndQr();
				clearInterval(self.joinInterval);
				screensocket.sendData({type:"answerbsgame",stype:"gamestart"});
			});
			$(".rankBox .nextround").on('click',function(){
				window.location.reload();
			});
			var clickpm = false;
			$(".rankBox .paiming").on('click',function(){
				var $this = $(this);
				$(".banglistBox-btns").removeAttr("data-nowrotateid");
				if(clickpm) return;
				clickpm = true;
				screencore.ajaxSubmit('screen.common.gamerotatephb',{'gametype':XCV2Config.gametype,rotateid:$this.attr('data-rotateid'),gamephb:$this.attr('data-gamephb')},'正在获取排行榜数据').then(function(data){
					 clickpm = false;
					 if(data.errno==0){
						 var pmHtml = "";
						 if(data.message.length>0){
							 $.each(data.message,function(k,v){
								v.key = k;
								v.score = "答对:"+v.ddnum+"题，耗时:"+(v.ys / 100).toFixed(2)+"秒";
								pmHtml += self.pmitemRender(v);
							 })
						 }
						 $(".banglistBox .banglist").html(pmHtml);
						 $(".banglistBox").removeClass('display-none');
						 screencore.anicss('.banglistBox','bounceInUp');
					 }else{
						layerBox.showMsg(data.message);
					 }
				}, function(){
					  clickpm = false;
					  layerBox.showMsg('网络太差，请稍后重试');
				});
			});
			$(".banglist-close i").on('click',function(){
				 screencore.anicss('.banglistBox','bounceOutDown',function(){
						$(".banglistBox").addClass('display-none');
				 });
			});
			var clickpn = false;
			$(".banglistBox-btns a").on('click',function(){
				var $this = $(this);
				if(clickpn) return;
				clickpn = true;
				var isprev = $this.hasClass('banglistBox-btn-prev');
				var rotateid = $this.parent().attr('data-nowrotateid')?$this.parent().attr('data-nowrotateid'):$(".rankBox-btns .paiming").attr('data-rotateid');
				screencore.ajaxSubmit('screen.common.gamerotatepnphb',{'gametype':XCV2Config.gametype,rotateid:rotateid,isprev:isprev?'1':'2'},'正在获取排行榜数据').then(function(data){
					 clickpn = false;
					 if(data.errno==0){
						 var pmHtml = "";
						 if(data.message.data.length>0){
							 $.each(data.message.data,function(k,v){
								v.key = k;
								v.score = "答对:"+v.ddnum+"题，耗时:"+(v.ys / 100).toFixed(2)+"秒";
								pmHtml += self.pmitemRender(v);
							 }) 
						 }
						 $this.parent().attr('data-nowrotateid',data.message.rotateid);
						 $(".banglistBox .banglist").html(pmHtml);
					 }else{
						layerBox.showMsg(data.message);
					 }
				}, function(){
					  clickpn = false;
					  layerBox.showMsg('网络太差，请稍后重试');
				});
			});
			$(".answerbs-lists .next-question-btn").on('click',function(){
				if(self.autoquestion==1||$(this).hasClass("display-none")) return;
				screensocket.sendData({type:"answerbsgame",stype:"nextquestion"});
				$(this).addClass('display-none');
				layerBox.showMsg('即将进入下一题',1);
			});
			keyboardJS.bind('space', function(e) {
				if(self.gamestatus==1){
					$(".start-btn").trigger('click');
				}
			});
			keyboardJS.bind('right', function(e) {
				if(self.gamestatus==2&&self.questionstatus=='2'){
					layerBox.showConfirm('警告','当前题目还未结束，确定要强制结束本题么?',['确定','取消'],function(){
						$(".welcomeBox").addClass('display-none');
						screensocket.sendData({type:"answerbsgame",stype:"gameend"});
					});
				}else{
					self.gameend==1&&$(".rankBox .nextround").trigger('click');
				}
			});
			keyboardJS.bind('shift', function(e) {
				if(self.gamestatus==1||self.gamestatus==2) return;
				if(!$(".rankBox").is(":hidden")){//已经出来了前10排名 
					if($(".banglistBox").is(":hidden")){
						$(".rankBox .paiming").trigger('click');
					}else{
						$(".banglist-close i").trigger('click');
					}
				}
			});
			keyboardJS.bind('.', function(e) {
				$(".answerbs-lists .next-question-btn").trigger('click');
			});
			
		},
		rushDom:function(json){
			var self = this;
			self.rankTen = json.alllist;
			//nowlist
			$onehtml = '';
			$.each(json.nowlist,function(i,v){
				v.key = i + 1;
				v.ys = (v.ys / 100).toFixed(2);
				$onehtml += self.questionranktpl(v);
			});
			$(".answerbs-lists .answerbs-onerank-lists").html($onehtml);
			//alllist
			$allhtml = '';
			$.each(json.alllist,function(i,v){
				v.key = i + 1;
				v.ys = (v.ys / 100).toFixed(2);
				$allhtml += self.allranktpl(v);
			});
			$(".answerbs-lists .answerbs-allrank-lists").html($allhtml);
		},
		showEndUser:function(enduser,endphbnums){
			var self = this,r = $(".rankBox"),o = $(".rank-others li");
			var list = enduser||self.rankTen;
			var phbnums = endphbnums||self.phbnums;
			for(var i=0,j=list.length;i<j;i++){
				if(i<3){
					if(i<phbnums&&list[i]){
						var box = i==0?r.find('.rank-item-first'):i==1?r.find('.rank-item-second'):r.find('.rank-item-third');
						box.find('img').attr('src',list[i].avatar);
						box.find('p').text(list[i].nickname);
					}
				}else{
					if(i<phbnums&&list[i]){
						o.eq((i-3)).find('img').attr('src',list[i].avatar);
						o.eq((i-3)).find('p span').text(list[i].nickname);
					}
				}
			}
			r.removeClass('display-none');
			if(phbnums<=3){
				$(".rank-others").remove();
				if(phbnums>=1){
					$(".rankfirst-second-third .rank-item-first").removeClass('opacity-hide');
					screencore.anicss('.rank-item-first','bounceInDown');
				}
				if(phbnums>=2){
					$(".rankfirst-second-third .rank-item-second").removeClass('opacity-hide');
					screencore.anicss('.rank-item-second','bounceInDown');
				}
				if(phbnums>=3){
					$(".rankfirst-second-third .rank-item-third").removeClass('opacity-hide');
					screencore.anicss('.rank-item-third','bounceInDown');
				}
				$(".rankBox-btns").removeClass('opacity-hide');
				screencore.anicss('.rankBox-btns','bounceIn');
			}else{
				$(".rankfirst-second-third .rank-item").removeClass('opacity-hide');
				screencore.anicss('.rank-item-first','bounceInDown');
				screencore.anicss('.rank-item-second','bounceInDown');
				screencore.anicss('.rank-item-third','bounceInDown',function(){
						$(".rank-others .rank-others-item:gt("+(phbnums-4)+")").remove();
						$(".rank-others").removeClass('opacity-hide');
						screencore.anicss('.rank-others','bounceInUp',function(){
							$(".rankBox-btns").removeClass('opacity-hide');
							screencore.anicss('.rankBox-btns','bounceIn');
						});
				});
			}	
		},
		showLastRoundUser:function(){
			var self = this;
			screencore.ajaxSubmit('screen.common.getLastrotatephb',{'gametype':XCV2Config.gametype}).then(function(data){
				 if(data.errno==0){
					 var lastusers = data.message;
					 if(lastusers=='1'){
						$(".answerbs-mainbox .emptybox").removeClass("display-none");
					 }else{
						var tipindex = layerBox.showLoading('无正在进行的轮次，直接显示最后一轮结果');
						setTimeout(function(){
							layerBox.close(tipindex);
						},1e3);
						self.bindEvent();
						var btn = $(".rankBox-btns .paiming");
						btn.attr({'data-rotateid':lastusers.rotateid,'data-gamephb':lastusers.gamephb});
						self.showEndUser(lastusers.users,lastusers.phbnums);
					 }
				 }else{
					layerBox.showMsg(data.message);
				 }
			}, function(){
				  layerBox.showMsg('网络太差，请稍后重试');
			});
			
		},
		rushuser:function(data){
			var self = this;
			$(".welcomeBox-nums span").text(data.count);
			var end10 = data.user;
			if(!end10) return;
			end10 = screencore.objectToarray(end10);
			var userdom = $(".welcome-users div");
			$.each(userdom,function(i,val){
				var oneuser = end10[i];
				if(oneuser){
					$(this).css('background-image',"url("+oneuser.avatar+")");
				}else{
					$(this).css('background-image',"url()");
				}
			});
			if(self.autorun==2){
				if(self.gamestatus==1&&data.count>=self.autonum){
					self.autostart();
				}
			}
		},
		showquestionresult:function(data){
			var self = this;
			$(".answerbs-lists .answerbs-quesitem-right").show();
			$(".answerbs-questionitems li").each(function(i,v){
				$(this).find(".answerbs-quesitem-precent").css({"width":data[i]+"%"});
			});
		},
		autostart:function(){
			var self = this;
			clearInterval(self.joinInterval);
			setTimeout(function(){
				$(".start-btn").trigger('click');
			},1e3)
		}
	};
	return screenanswerbs;
});
