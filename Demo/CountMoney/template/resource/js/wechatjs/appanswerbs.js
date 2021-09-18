define('appanswerbs',['appsocket','wechatcore'],function(appsocket,wechatcore){
	var appanswerbs = {
		rotateid:0,
		myscore:0,
		mytime:0,
		nowquestionscore:null,
		gamestatus: 0,
		answertime:10,
		questiontpl:null,
		selTimer:null,
		selTime:0,
		statustip:['游戏还未开始','正在倒计时，马上开始','游戏开始了','游戏已结束','即将公布本题结果','即将进入下一题'],
		init: function() {
			var self = this;
			self.roundBox = $(".roundInfo-box");
			self.optionBox = $(".options-box");
			var params={};
			params.onmessage = function(data){
				if(data.type=='connected'){
					appsocket.isclose = false;
					self.senddata({stype:'gamelink'});
				}else if(data.type=='gameiswait'||data.type=='gameisrun'){
					self.rotateid = data.rotateid;
					self.initAudio();
					self.bindEvent();
					self.answertime = data.answertime;
					self.roundBox.find(".roundInfo-title").text(data.rotatetitle);
					self.roundBox.find(".roundInfo-quesnum span").text(data.question.totalnum);
					if(data.type=='gameiswait'){
						self.gamestatus = 1;
						self.gameiswait();
						self.myscore = 0;
						self.mytime = 0;
					}else{
						data.question.djstime = 0;
						self.nowquestionscore = data.nowquestionscore||null;
						self.gameisrun(data.question);
						self.myscore = data.myscore;
						self.mytime = data.mytime;
					}		
				}else if(data.type=='gameiscountdown'){
					if(self.gamestatus == 3){
						self.gameiswait(self.statustip[5]+"( "+data.djs+" )");
					}else{
						self.gameiswait(self.statustip[1]+"( "+data.djs+" )");
					}
					wechatcore.playAudio(self.djsaudio);
				}else if(data.type=='gameisdjs'){
					if(data.djs>0){
						self.gamestatus = 2;
						self.saveseltime(data.djs);
						self.gameisrun(data.question);
					}else{
						self.selTimer!=null&&clearInterval(self.selTimer),self.selTimer=null;;
						self.gameisend();
					}
					$(".options-box .questiontime span").text(data.djs);
				}else if(data.type=='gamehadquestion'){
					self.gameshowquestionresult(data.num);
				}else if(data.type=='gameanswerbsrefresh'||data.type=='gameappanswerrefresh'){
					appsocket.closeClient();
				}else if(data.type=='gameshowphbbtn'){
					self.gamestatus==3&&self.showphbbtn(data.rotateid,data.gamephb);
				}else if(data.type=='gamenoround'||data.type=='gameislucker'){
					self.gameisnormal((data.type=='gamenoround'?'暂无正在进行的轮次':XCV2Config.isluckertxt));
				}else if(data.type=='gamestartnojoin'){
					self.gameisnormal('本轮游戏已经开始，无法加入');
				}else if(data.type=='gameneedpay'){
					self.gameisnormal('请先购买参与游戏资格');
					wechatcore.gamePayrotate(data.rotateid,data.fee,function(){
						appsocket.closeClient();
				   });
				}else if(data.type=='gameiserror'){
					appsocket.closeClient();
				}else if(data.type=='addblack'){
					data.userid==XCV2Config.userid&&wechatcore.closewxwindow();
				}else if(data.type=='goto'){
					wechatcore.gotopage(data.r,data.url);
				}else if(data.type=='luckopenids'){
					wechatcore.layerAsklucker(data);
				}
			};
			appsocket.init(params);
		},
		initAudio: function(){
			var self = this;
			self.djsaudio = $("#djsaudio")[0];
		},
		bindEvent: function() {
			var self = this;
			$(".options-box").on('click','ul li',function(){
				var $this = $(this),answerNum = $(".options-box ul").attr('data-yesanswer').split(","),isactiveNum = $(".options-box ul").find("li.is-active").length;
				if(self.nowquestionscore != null || self.gamestatus!=2 || isactiveNum>=answerNum.length || $this.hasClass('is-active')) return;
				$this.addClass('is-active');
				if(self.gamestatus==2 && $(".options-box ul").find("li.is-active").length>=answerNum.length){
					var myquestime = self.answertime * 100 - (parseFloat(self.selTime)*100);
					self.selTimer!=null&&clearInterval(self.selTimer),self.selTimer=null;
					var senddata = {stype:'senddata',ys:myquestime};
					var selLi = self.optionBox.find("li.is-active"),selanswer = [],yesanswer = self.optionBox.find("ul").attr("data-yesanswer");
					if(selLi.length>0){
						selLi.each(function(){
							selanswer.push($(this).attr("data-key"));
						});
					}
					selanswer = selanswer.join(',');
					senddata.selanswer = selanswer;
					if(selanswer==yesanswer){
						senddata.answeryes = '1';
						self.myscore++;
					}else{
						senddata.answeryes = '2';
					}
					self.mytime += myquestime;
					self.senddata(senddata);
					
				}
			});
		},
		chanstatus:function(txt){
			var self = this,statusBox = self.roundBox.find(".roundInfo-status");
			statusBox.text(txt);
			statusBox.removeClass('hidden');
		},
		senddata:function(obj){
			var senddata = appsocket.senddata;
			senddata.type = 'answerbsgame';
			$.extend(senddata,obj);
			appsocket.wssend(senddata);
		},
		gameiswait:function(txt){
			var self = this;
			self.roundBox.find(".roundInfo-img").removeClass('hidden');
			self.roundBox.find(".roundInfo-title").removeClass('hidden');
			self.roundBox.find(".roundInfo-quesnum").removeClass('hidden');
			self.hideoptionBox();
			self.hidephbbtn();
			self.showroundBox();
			self.chanstatus(txt||self.statustip[0]);
		},
		gameisrun:function(question){
			var self = this;
			self.roundBox.find(".roundInfo-img").addClass('hidden');
			self.roundBox.find(".roundInfo-title").addClass('hidden');
			self.roundBox.find(".roundInfo-quesnum").addClass('hidden');
			self.hidephbbtn();
			self.hideroundBox();
			if($(".question-"+question.id).length<=0){
				$(".options-box").html(wechatcore.tpl($("#question-tpl"),question));
				if(self.nowquestionscore!=null){//已答
					var selanswer = self.nowquestionscore.selanswer.split(',');
					$.each(selanswer,function(i,v){
						$(".question-"+question.id).find('li[data-key='+v+']').addClass('is-active');
					});
				}
			}
			self.showoptionBox();
			self.chanstatus(self.statustip[2]);
		},
		gameisend:function(txt){
			var self = this;
			self.roundBox.find(".roundInfo-img").addClass('hidden');
			self.roundBox.find(".roundInfo-title").addClass('hidden');
			self.roundBox.find(".roundInfo-quesnum").addClass('hidden');
			self.gamestatus = 3;
			self.hideoptionBox();
			self.hidephbbtn();
			self.showroundBox();
			self.chanstatus(txt||self.statustip[4]);
			self.nowquestionscore = null;
		},
		gameisnormal:function(txt){
			var self = this;
			self.roundBox.find(".roundInfo-img").addClass('hidden');
			self.roundBox.find(".roundInfo-title").addClass('hidden');
			self.roundBox.find(".roundInfo-quesnum").addClass('hidden');
			self.hidephbbtn();
			self.gamestatus = 0;
			self.hideoptionBox();
			self.showroundBox();
			self.chanstatus(txt);
		},
		gameshowquestionresult:function(num){
			var self = this;
			self.roundBox.find(".roundInfo-img").addClass('hidden');
			self.roundBox.find(".roundInfo-title").addClass('hidden');
			self.roundBox.find(".roundInfo-quesnum").addClass('hidden');
			self.hidephbbtn();
			self.hideroundBox();
			var selLi = self.optionBox.find("li.is-active"),selanswer = [],yesanswer = self.optionBox.find("ul").attr("data-yesanswer");
			if(selLi.length>0){
				selLi.each(function(){
					selanswer.push($(this).attr("data-key"));
				});
			}
			selanswer = selanswer.join(',');
			if(selanswer==yesanswer){
				self.optionBox.find(".questionresult").text("恭喜，选择正确");
			}else{
				self.optionBox.find(".questionresult").text("很遗憾，选择错误，正确答案是:"+yesanswer);
			}
			self.showoptionBox();
			if(num==0){
				self.gameisend("本轮已结束，您答对了"+self.myscore+"题，总耗时:"+(self.mytime / 100).toFixed(2)+"秒");
			}
		},
		showroundBox:function(){
			var self = this;
			self.roundBox.removeClass('hidden');
		},
		hideroundBox:function(){
			var self = this;
			self.roundBox.addClass('hidden');
		},
		showoptionBox:function(){
			var self = this;
			self.optionBox.removeClass('hidden');
		},
		hideoptionBox:function(){
			var self = this;
			self.optionBox.addClass('hidden');
		},
		showphbbtn:function(rotateid,gamephb){
			var self = this;
			var btn = self.roundBox.find(".phb-btn")
			btn.attr({'data-rotateid':rotateid,'data-gamephb':gamephb});
			btn.removeClass('hidden');
		},
		hidephbbtn:function(){
			var self = this;
			self.roundBox.find(".phb-btn").addClass('hidden');
		},
		saveseltime:function(seconds){
			var self = this,times = parseInt(seconds) * 100;
			if(self.selTimer!=null) return;
			self.selTimer = setInterval(function() {
				times = --times < 0 ? 0 : times;
				var ms = Math.floor(times / 100).toString();
				if(ms.length <= 1) {
					ms = ms;
				}
				var hm = Math.floor(times % 100).toString();
				if(hm.length <= 1) {
					hm = "0" + hm;
				}
				if(times == 0) {
					clearInterval(self.selTimer),self.selTimer=null;;
				}
				self.selTime = ms +'.'+ hm;
			}, 10);
		},
	};
	return appanswerbs;
});
