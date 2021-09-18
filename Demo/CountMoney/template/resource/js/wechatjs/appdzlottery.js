define('appdzlottery',['appsocket','jquery.shake','wechatcore'],function(appsocket,Shake,wechatcore){
	var appdzlottery = {
//  	statustip:['游戏还未开始','正在倒计时，马上开始','游戏开始了','游戏已结束',''],
        cjtype:0,
        audio:{},
        stopclickstart:false,
		init: function() {
			var self = this;
			var params={};
			self.initAudio();
			params.onmessage = function(data){
			 //   console.log(data);
				if(data.type=='connected'){
					appsocket.isclose = false;
					self.senddata({stype:'gamelink'});
				}else if(data.type=='pdinfo'){
				    var pdinfo = data.list;
				    if(pdinfo.length == 0){
				        $('.dzlottery_joinpeople span').text('0');
				    }else{
    				    $('.dzlottery_joinpeople span').text(pdinfo.length);
    				    $.each(pdinfo, function(k,v){
    				        if(v.openid == XCV2Config.openid){
    				            $('.cjtips').text("您排在第"+(k + 1)+"位");
    				            return false;
    				        }
    				    });
				    }
				}else if(data.type=='pdout'){
				}else if(data.type=='mepos' || data.type=='meislottery'){
				    if(data.type=='meislottery'){
				        self.cjstatus('4');
				    }else if(data.type=='mepos'){
				        //队列里没有我 选模式
				        if(data.mypos == -1){
				            self.cjstatus('1');
			            }else{
			            //队列里有我 显示我的排名
        				    $('.cjtips').text("您排在第"+data.mypos +"位");
        				    self.cjstatus('2');
			            }
			            //最后显示右上角排名总人数
			            $('.dzlottery_joinpeople span').text(data.len);
				    }
    			    
				}else if(data.type=='gameneedstart'){
				    if(data.openid == XCV2Config.openid){
				        $('.startdjsani').text(data.time);
				        $('.appstartdjs').removeClass('hidden');
				        self.cjtype = data.cjtype;
				        self.cjstatus('3');
				    }
				}else if(data.type=='autostart'){
				    if(!($('.appstartdjs').hasClass('hidden'))){
				        $('.appstartdjs').addClass('hidden');
				    }
				    $('.startdjsani').text('0');
				    self.cjstatus('4');
				}else if(data.type=='gameshowprize'){
				    if(self.audio.appstartmusic != null){
        			    self.audio.appstartmusic.pause();
        			}
        			if(self.audio.appbgmusic != null){
        			    self.audio.appbgmusic.pause();
        			}
        			if(self.audio.appprizemusic != null){
        			    wechatcore.playAudio(self.audio.appprizemusic);
        			}
                    $('.showprize img').attr('src',XCV2Config.avatar);
                    $('.showprize .nickname span').text(XCV2Config.nickname);
                    $('.showprizedetail img').attr('src',data.prizeinfo.prizeimg);
                    $('.showprizedetail .showprizename').text(data.prizeinfo.prizename);
                        
                    $('.zam_app_dzlottery_main').addClass('hidden');
                    $('.dzlottery_main').addClass('hidden');
                    $('.showprize').removeClass('hidden');
                    $('.showprizebox').addClass('animated bounceInDown');
				}else if(data.type=='gameover'){
				    $('.startdjsani').text('0');
				    if(!$('.appstartdjs').hasClass('hidden')){
				        $('.appstartdjs').addClass('hidden');
				    }
				    if($('.zam_app_dzlottery_main').hasClass('hidden')){
				        $('.zam_app_dzlottery_main').removeClass('hidden');
				    }
				    if($('.dzlottery_main').hasClass('hidden')){
				        $('.dzlottery_main').removeClass('hidden');
				    }
				    if(!$('.showprize').hasClass('hidden')){
                        $('.showprize').addClass('hidden');
                        $('.showprizebox').removeClass('animated bounceInDown');
				    }
				    self.cjstatus('1');
			        self.stopclickstart = false;
				}else if(data.type=='gamenoprize'){
				    wechatcore.msg('奖品不足，请稍等或联系工作人员',1000);
				}else if(data.type=='gameisnopub'){
				    wechatcore.msg('活动未发布，仅准许10人参与',1000);
				}else if(data.type=='gamedzlotteryrefresh'||data.type=='gameappdgshakerefresh'){
				    wechatcore.reloadpage();
				}else if(data.type=='gamedzlotteryreconnect'){
				    appsocket.closeClient();
				}else if(data.type=='gameshowphbbtn'){
					self.gamestatus==3&&self.showphbbtn(data.rotateid,data.gamephb);
				}else if(data.type=='gamenoround'||data.type=='gameislucker'){
					self.gamestatus = 0;
					self.changetip((data.type=='gamenoround'?'暂无正在进行的轮次':XCV2Config.isluckertxt));
					self.shaketype = -1;
					self.initshaketype();
					self.hideProgressBox();
					self.hideMask();
				}else if(data.type=='gamestartnojoin'){
					self.gamestatus = 0;
					self.changetip('本轮游戏已经开始，无法加入');
					self.hideProgressBox();
					self.hideMask();
					self.shaketype = -1;
					self.initshaketype();
				}else if(data.type=='gameneedpay'){
					self.changetip('请先购买参与游戏资格');
					self.hideProgressBox();
					self.hideMask();
					self.shaketype = -1;
					self.initshaketype();
					wechatcore.gamePayrotate(data.rotateid,data.fee,function(){
						appsocket.closeClient();
				   });
				}else if(data.type=='gameisend'){
					self.gamestatus = 3;
					self.changetip(self.statustip[3]);
				}else if(data.type=='gameiserror'){
					appsocket.closeClient();
				}else if(data.type=='addblack'){
					data.userid==XCV2Config.userid&&WeixinJSBridge.call('closeWindow');
				}else if(data.type=='goto'){
					wechatcore.gotopage(data.r,data.url);
				}
			};
			appsocket.init(params);
			self.bindEvent();
			
		},
		initAudio: function(){
			var self = this;
			self.audio.appstartmusic = null;
			self.audio.appbgmusic = null;
			self.audio.appprizemusic = null;
			if($('#appstartmusic').length > 0){
			    self.audio.appstartmusic = $('#appstartmusic')[0];
			}
			if($('#appbgmusic').length > 0){
			    self.audio.appbgmusic = $('#appbgmusic')[0];
			}
			if($('#appprizemusic').length > 0){
			    self.audio.appprizemusic = $('#appprizemusic')[0];
			}
		},
		cjstatus: function(type){
		    type = type || '1';
		    var self = this;
		    if(type == '1'){
		        if(!($('.appstartdjs').hasClass('hidden'))){
			        $('.appstartdjs').addClass('hidden');
			    }
		        if(self.audio.appstartmusic != null){
    			    self.audio.appstartmusic.pause();
    			}
    			if(self.audio.appprizemusic != null){
    			    self.audio.appprizemusic.pause();
    			}
    			if(self.audio.appbgmusic != null){
    			    wechatcore.playAudio(self.audio.appbgmusic);
    			}
			    $('.cjtips').text(appjointip);
		        if($('.cjbtn').hasClass('hidden')){
		            $('.cjbtn').removeClass('hidden');
		        }
		        if(!$('.startbox').hasClass('hidden')){
		            $('.startbox').addClass('hidden');
		        }
		        if(!$('.startbtn').hasClass('hidden')){
		            $('.startbtn').addClass('hidden');
		        }
		        if(!$('.waitbtn').hasClass('hidden')){
		            $('.waitbtn').addClass('hidden');
		        }
		    }else if(type=='2'){
		        if(!($('.appstartdjs').hasClass('hidden'))){
			        $('.appstartdjs').addClass('hidden');
			    }
		        if(self.audio.appstartmusic != null){
    			    self.audio.appstartmusic.pause();
    			}
    			if(self.audio.appprizemusic != null){
    			    self.audio.appprizemusic.pause();
    			}
    			if(self.audio.appbgmusic != null){
    			    wechatcore.playAudio(self.audio.appbgmusic);
    			}
		        if(!$('.cjbtn').hasClass('hidden')){
		            $('.cjbtn').addClass('hidden');
		        }
		        if($('.startbox').hasClass('hidden')){
		            $('.startbox').removeClass('hidden');
		        }
		        if(!$('.startbtn').hasClass('hidden')){
		            $('.startbtn').addClass('hidden');
		        }
		        if($('.waitbtn').hasClass('hidden')){
		            $('.waitbtn').removeClass('hidden');
		        }
		    }else if(type=='3'){
		        if(self.audio.appstartmusic != null){
    			    self.audio.appstartmusic.pause();
    			}
    			if(self.audio.appprizemusic != null){
    			    self.audio.appprizemusic.pause();
    			}
    			if(self.audio.appbgmusic != null){
    			    wechatcore.playAudio(self.audio.appbgmusic);
    			}
		        $('.cjtips').text('请点击按钮开始');
		        if(!$('.cjbtn').hasClass('hidden')){
		            $('.cjbtn').addClass('hidden');
		        }
		        if($('.startbox').hasClass('hidden')){
		            $('.startbox').removeClass('hidden');
		        }
		        if($('.startbtn').hasClass('hidden')){
		            $('.startbtn').removeClass('hidden');
		        }
		        if(!$('.waitbtn').hasClass('hidden')){
		            $('.waitbtn').addClass('hidden');
		        }
		    }else if(type=='4'){
		        if(!($('.appstartdjs').hasClass('hidden'))){
			        $('.appstartdjs').addClass('hidden');
			    }
    		    $('.cjtips').text('抽奖中请看大屏幕');
    		    if(self.audio.appstartmusic != null){
    			    wechatcore.playAudio(self.audio.appstartmusic);
    			}
    			if(self.audio.appprizemusic != null){
    			    self.audio.appprizemusic.pause();
    			}
    			if(self.audio.appbgmusic != null){
    			    self.audio.appbgmusic.pause();
    			}
    	        if(!$('.cjbtn').hasClass('hidden')){
    	            $('.cjbtn').addClass('hidden');
    	        }
    	        if(!$('.startbox').hasClass('hidden')){
    	            $('.startbox').addClass('hidden');
    	        }
    	        if(!$('.startbtn').hasClass('hidden')){
    	            $('.startbtn').addClass('hidden');
    	        }
    	        if(!$('.waitbtn').hasClass('hidden')){
    	            $('.waitbtn').addClass('hidden');
    	        }
		    }
		},
		bindEvent: function() {
			var self = this;
			$('.startbtn').on('click',function(){
			    if(self.stopclickstart) return;
			    self.stopclickstart = true;
			    //确定此用户是当前队列里的第一个人
			    wechatcore.ajaxSubmit('wechat.dzlottery.ajaxiscanstart',{},'正在加入排队..').then(function(json){
    				// console.log(json);
    				if(json.errno==0){
    				    if(!($('.appstartdjs').hasClass('hidden'))){
    				        $('.appstartdjs').addClass('hidden');
    				    }
				        $('.startdjsani').text('0');
    				    self.cjstatus('4');
		                self.senddata({stype:'gameappstart',openid:XCV2Config.openid,nickname:XCV2Config.nickname,avatar:XCV2Config.avatar,cjtype:self.cjtype,isorder:isorder,code:code});
    				}else{
    					wechatcore.msg(json.message);
    					return;
    				}
    			}, function(){
    				wechatcore.msg('网络太差，请稍候再试');
    				return;
    			});
			    
			});
			$('.waitbtn').on('click',function(){
			    wechatcore.msg('排队中,请耐心等待');
			});
		},
		senddata:function(obj){
			var senddata = appsocket.senddata;
			senddata.type = 'dzlotterygame';
			$.extend(senddata,obj);
			appsocket.wssend(senddata);
		},
		changetip:function(tips){
			$('.zam-app-shaketip').text(tips);//.zam-app-shake-over 
		},
	};
	return appdzlottery;
});