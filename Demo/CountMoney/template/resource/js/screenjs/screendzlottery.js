define('screendzlottery',['screensocket','screencore','template','layerBox','fulldm','keyboard','jquerytrans'],function(screensocket,screencore,template,layerBox,fulldm,keyboardJS){
    var screendzlottery = {
        pdinfo:[],
        status:true,
        pdtimer:null,
        checkstart:false,
        checktimer:null,
        audio:{},
        pdopenid:0,
        ispdout:false,//倒计时为0时和发过来appstart时出队改为true
        apphasstart:false,//如果手机端点了开始，那么不需要再发gameneedstart的倒计时了。
        isnoprize:false,//没有奖品了//必须重新刷新才能继续抽奖
        circle:0,
        djsdata:{},//存储要开始的抽奖者信息，方便一键抽奖时获取信息。
        refreshpd:true,
        prizeinfo:{},
        djs_b:null,
        init: function(){
            var self = this;
            var params = {};
            var showfiveboxtimer = null;
            var isstatustimer = null;
            params.onmessage = function(data){
                // console.log(data);
				if(data.type=='connected'){
					screensocket.isclose = false;
					screensocket.sendData({type:"dzlotterygame",stype:"gamelink"});
					self.sendpdinfo();
				}else if(data.type=='appstart'){
				    if(self.apphasstart) return;
				    self.apphasstart = true;
			        self.startcj(data);
				}else if(data.type=='gamenoround'){
				    
				}else if(data.type=='gamedzlotteryrefresh'||data.type=='gameerrorhaddone'){
					window.location.reload();
				}else if(data.type=='gameiserror'){
					layerBox.showMsg('当前轮次异常');
					setTimeout(function(){
						window.location.reload();
					},1e3);
				}else if(data.type=='dzlotteryoffline'){
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
			self.bindEvent();
			self.initAudio();
        },
        sendpdinfo: function(){
            var self = this;
            if(self.pdtimer != null){
                clearInterval(self.pdtimer);
            }
            self.pdtimer = setInterval(function(){
                screencore.ajaxSubmit('screen.dzlottery.ajaxsendpdinfo',{}).then(function(e){
                    if(e.errno == 0){
                        self.pdinfo = e.message;
                        if(self.refreshpd){
                            var html='';
                            // var i=4;
                            $.each(e.message,function(k,v){
                                if(k<4){
                                    html = template('showdzuser-tpl',v)+html;
                                }
                            });
                            $('.one_avatarbox').html(html);
                        }
                    }
			    }, function(){
					console.log('网络太差，请稍后重试.');
				});
            },3000);
        },
        initAudio: function(){
			var self = this;
            if(bgmusic_src != ''){
                self.audio.bgmusic = document.getElementById("bgmusic");
            }
            if(dzlotterymusic_src != ''){
			    self.audio.dzlotteryAudio = document.getElementById("dzlotterymusic");
            }
            if(prizemusic_src != ''){
			    self.audio.overAudio = document.getElementById("prizemusic");
            }
            self.audio.dzrollAudio = document.getElementById("dzrollmusic");
		},
        bindEvent: function(){
            var self = this;
            setInterval(function(){
                //添加图片放大效果
                var prizenum = $(".dz_main .dz_awardimg").length;
                var giftclass = 'gift'+parseInt(Math.random()*prizenum+1);
                $('.showprizeimg').removeClass('boxTada');
                $('.'+giftclass+' .showprizeimg').addClass('boxTada');
                giftclass = 'gift'+parseInt(Math.random()*prizenum+1);
                $('.showprizeimg').removeClass('animated flip');
                $('.'+giftclass+' .showprizeimg').addClass('animated flip');
                //是否可以开始抽奖
                if(!self.checkstart && self.pdinfo.length > 0 && status=='2' && !self.isnoprize){
                    self.checkstart = true;
                    screencore.ajaxSubmit('screen.dzlottery.ajaxgetfirstpd',{}).then(function(e){
                        if(e.errno == 0){
                            if(e.message == ''||e.message==null){
                                self.checkstart = false;
                            }else{
                                // console.log(e.message);
                                $("div[data-id="+e.message.openid+"]").addClass('twinkling');
                                self.ispdout = false;
                                self.refreshpd = false;
                                self.djsdata.openid = e.message.openid;
                                self.djsdata.cjtype = e.message.cjtype;
                                self.djsdata.codeid = e.message.codeid ? e.message.codeid : '';
                                self.djs_b = screencore.coundown(djstime,function(t){//倒计时进行中
                                    if(!self.apphasstart){
                                        self.pdopenid = e.message.openid;
                                        screensocket.sendData({type:"dzlotterygame",stype:"gameneedstart",time:t,openid:e.message.openid,cjtype:e.message.cjtype});
                                    }
                                },function(t){//倒计时为0
                                    if(!self.apphasstart){
                                        if((e.message.cjtype=='1' && freecj_autostart=='1')||(e.message['cjtype']=='2' && pricecj_autostart=='1')||(e.message.cjtype=='3' && codecj_autostart=='1')){
                screencore.ajaxSubmit('screen.dzlottery.ajaxscreenautostart',{openid:e.message.openid,cjtype:e.message.cjtype}).then(function(json){
                    if(json.errno == 0){
                        // console.log(json.message);
                        if(self.apphasstart) return;
                        self.apphasstart = true;
                        self.startcj(json.message);
                    }else{
                        layerBox.showMsg(json.message);
                    }
			    }, function(){
					console.log('网络太差，请稍后重试.');
				});
                                        }else{
                                            self.pdout(self.pdopenid);
                                            
                                            self.refreshpd = true;
                                            $("div[data-id="+e.message.openid+"]").remove();
                                            screensocket.sendData({type:"dzlotterygame",stype:"gameover",openid:e.message.openid,cjtype:e.message.cjtype,isuse:4,codeid:self.djsdata.codeid});
                                            //清除变量    
                                            self.djsdata = {};
                                            self.checkstart = false;
                                        }
                                    }
                                });
                            }
                        }
    			    }, function(){
    					console.log('网络太差，请稍后重试.');
    				});
                }
            },2000);
            $(".dzlottery-start-btn").on('click',function(){
				if(screensocket.isclose) return;
				if(parseInt($(".joinPeople span").text())==0) return layerBox.showMsg('当前无用户参与，无法开始游戏');
				if(self.stopclick) return;
				// alert(2);
				self.stopclick = true;
				// $(".shakestart-start-btn").addClass('display-none');
				screencore.hideFootAndQr();
				// clearInterval(self.joinInterval);
				self.hasstart = true;
				screensocket.sendData({type:"dzlotterygame",stype:"gamestart"});
			});
			//关闭抽奖
            keyboardJS.bind('enter', function(e) {
                screencore.ajaxSubmit('screen.dzlottery.ajaxchangestatus',{status:1}).then(function(e){
                    if(e.errno == 0){
                        status = 1;
                    }
			    }, function(){
					console.log('网络太差，请稍后重试.');
				});
			});
			//开启抽奖
			keyboardJS.bind('shift', function(e) {
			    screencore.ajaxSubmit('screen.dzlottery.ajaxchangestatus',{status:2}).then(function(e){
                    if(e.errno == 0){
                        status = 2;
                    }
			    }, function(){
					console.log('网络太差，请稍后重试.');
				});
			});
			//一键抽奖
			keyboardJS.bind('spacebar', function(e) {
			    if(typeof self.djsdata.openid == "undefined" || self.apphasstart) return;
			    screencore.ajaxSubmit('screen.dzlottery.ajaxscreenautostart',{openid:self.djsdata.openid,cjtype:self.djsdata.cjtype,'key':'spacebar'}).then(function(json){
                    if(json.errno == 0){
                        if(self.apphasstart) return;
                        self.apphasstart = true;
                        self.startcj(json.message);
                    }else{
                        layerBox.showMsg(json.message);
                    }
			    }, function(){
					console.log('网络太差，请稍后重试.');
				});
			});
			//重置数据
			keyboardJS.bind(',', function(e) {
			    layerBox.showConfirm('警告','重置会删除此游戏的用户数据和中奖数据，确定重置么?',['确定','取消'],function(){
					screencore.ajaxSubmit('screen.dzlottery.ajaxreset',{}).then(function(data){
    					if(data.errno==0){
    					    //发送消息给微信端
    					    screensocket.sendData({type:"dzlotterygame",stype:"gamereset"});
    					    
    						screensocket.isclose = false;
    						window.location.reload();
    					}else{
    						layerBox.showMsg(data.message);
    					}
    				}, function(){
    					console.log('网络太差，请稍后重试.');
    				});
				});
			});
        },
        startcj: function(data){
			var self = this;
            screencore.ajaxSubmit('screen.dzlottery.ajaxgetoneprize',{openid:data.openid,nickname:data.nickname,avatar:data.avatar,cjtype:data.cjtype,isorder:data.isorder,code:data.code,isuse:3,codeid:self.djsdata.codeid,'prize_template_type':prize_template_type}).then(function(e){
                    if(e.errno == 0){
                        self.pdout(data.openid);
                        //开始滚动抽奖
                        self.prizeinfo = e.message;
                        self.prizeinfo.openid = data.openid;
                        var prizeimgnum = $(".dz_main .dz_awardimg").length;
                        if(prizeimgnum <= 0){
                            layerBox.showMsg('暂无奖品可选，请联系工作人员！');
                            return;
                        }
                        if($("div[data-prizeid='"+self.prizeinfo.id+"']").length<=0){//所抽出的奖品未显示在大屏幕
                            layerBox.showMsg('抽奖出现异常，所抽取的奖品未显示在大屏幕，请联系工作人员！');
                            setTimeout(function(){
        						window.location.reload();
        					},1e3);
                            return;
                        }
                        var rollnum = parseInt($("div[data-prizeid='"+self.prizeinfo.id+"']").attr('data-giftnum')) + prizeimgnum;
                        // console.log(rollnum);
                        self.dzroll(data.openid,rollnum);
                        
                        $('.dz_roll img').attr('src',data.avatar);
                        if($('.dz_roll_start').length>0){
                            $('.dz_roll_start img').attr('src',data.avatar);
                        }
                        $('.showprize img').attr('src',data.avatar);
                        $('.showprize .nickname span').text(data.nickname);
                        $('.showprizedetail img').attr('src',self.prizeinfo.prizeimg);
                        $('.showprizedetail .showprizename').text(self.prizeinfo.prizename);
                        $('.showbgpao .avatarpao').attr('src',data.avatar);
                        $('.showbgpao .prizepao').attr('src',self.prizeinfo.prizeimg);
                    }else if(e.errno == -5){
                        layerBox.showMsg(e.message);
                        self.isnoprize = true;//必须重新刷新才能继续抽奖
                        screensocket.sendData({type:"dzlotterygame",stype:"gamenoprize",openid:data.openid});
                    }else{
                        //当前用户抽取奖品出现错误！跟t=0未开始一样
                        clearInterval(self.djs_b);
                        self.pdout(data.openid);
                        layerBox.showMsg(e.message);
                        self.apphasstart=false;
                        self.refreshpd = true;
                        $("div[data-id="+data.openid+"]").remove();
                        screensocket.sendData({type:"dzlotterygame",stype:"gameover",openid:data.openid,cjtype:data.cjtype,isuse:4,codeid:self.djsdata.codeid});
                        //清除变量    
                        self.djsdata = {};
                        self.checkstart = false;
                    }
		    }, function(){
				console.log('网络太差，请稍后重试。');
			});
		},
		pdout: function(outopenid){
			var self = this;
			if(!self.ispdout){
			 //   console.log('出队执行');
                screencore.ajaxSubmit('screen.dzlottery.ajaxpdout',{openid:outopenid}).then(function(e){
                    if(e.errno == 0){
                        self.ispdout = true;
                    }else{
                        layerBox.showMsg(e.message);
                    }
			    }, function(){
					console.log('网络太差，请稍后重试。');
				});
            }
		},
		dzroll: function(openid,rolenum){
		    var self = this;
		    var dzgoto = $("div[data-id="+openid+"]");
		    dzgoto.find('span').remove();
            if(prize_template_type=='1'){
                    dzgoto.transition({
                        x: 150,
                        y: 50,
                        duration:1000,
                        easing: 'linear',
                        rotate: 90,
                        scale: 0.8,
                        complete: function(){
                            dzgoto.remove();
                	        $('.dz_roll').removeClass('hidden');
                		    self.startroll(openid,rolenum);
                        }
                    });
            }else{
                dzgoto.transition({
                    x: 30,
                    y: 130,
                    duration:1000,
                    easing: 'linear',
                    rotate: 90,
                    scale: 0.8,
                    complete: function(){
                        dzgoto.remove();
                        setTimeout(function(){
                            $('.dz_roll_start').addClass('hidden');
                        },700);
                        $('.dz_roll_start').removeClass('hidden').transition({
                            rotate: 1800,
                            duration:1000,
                            complete: function(){
                                $('.dz_roll_start').transition({rotate:0});
                                $('.dz_roll').removeClass('hidden');
                		        self.startroll(openid,rolenum);
                            }
                        });
                    }
                });
            }
		},
		startroll: function(openid,rolenum){
		    var self = this;
		    //开始播放抽奖音乐
            if(bgmusic_src != ''){
                self.audio.bgmusic.pause();
            }
            if(dzlotterymusic_src != ''){
                self.audio.dzlotteryAudio.play();
            }
            if(prizemusic_src != ''){
                self.audio.overAudio.pause();
            }
            var ballobj;
            var pos = [];
		    var ftop = $('.dzbox')[0].getBoundingClientRect().top;
		    var fleft = $('.dzbox')[0].getBoundingClientRect().left;
		    var ntop,nleft; 
		    var prizenum = $(".dz_main .dz_awardimg").length;
		    if(prize_template_type == '1'){
		        var rolltop = 40;
		    }else{
		        var rolltop = 30;
		    }
		    if(prizenum > 12){
		        if(rolenum>0){
		            var speed1 = Math.ceil(dzlotterytime*1000/5/(rolenum-12));
		            var speed2 = Math.ceil(dzlotterytime*1000/5/4);
		            var speed3 = Math.ceil(dzlotterytime*1000/5/4);
		          //  var speed4 = Math.ceil(dzlotterytime*1000/5/2);
		            var speed4 = Math.ceil(dzlotterytime*1000/5);
    		        for (var i = 1; i <= rolenum; i++) {
    		            if(i>prizenum){
    		                var num = i - prizenum;
    		            }else{
    		                var num = i;
    		            }
    		            
                        var nextgift = $('.gift'+num);
                        if(i<(rolenum-10)){
    		                var speed = speed1;
    		            }else if(i>=(rolenum-10) && i<(rolenum-6)){
    		                var speed = speed2;
    		            }else if(i>=(rolenum-6) && i<(rolenum-2)){
    		                var speed = speed3;
    		            }else{
    		                var speed = speed4;
    		            }
    		            //球的位置
    	                btop = $(".dz_roll")[0].getBoundingClientRect().top;
    	                bleft = $(".dz_roll")[0].getBoundingClientRect().left;
    	                //下一个奖品位置
    	                ntop = nextgift[0].getBoundingClientRect().top;
    		            nleft = nextgift[0].getBoundingClientRect().left;
    	                var transiobj = {
    	                   x: (nleft - bleft)+rolltop,
                		   y: (ntop - btop)+rolltop,
                		   duration:speed,
                		   easing: 'linear',
                		   rotate: 90*i,
                		   complete: function(){
                		       self.audio.dzrollAudio.play();
                		   }
    	                };
    	                if(i == rolenum){
    	                    transiobj.complete = function(){
    	                        self.showprizedetail(openid);
    	                    }
    	                };
    	                ballobj = $(".dz_roll").transition(transiobj);
                    }
    		    }
		    }else{
		        if(rolenum>0){
		            var speed = Math.ceil(dzlotterytime*1000/rolenum);
    		        for (var i = 1; i <= rolenum; i++) {
    		            if(i>prizenum){
    		                var num = i - prizenum;
    		            }else{
    		                var num = i;
    		            }
                        var nextgift = $('.gift'+num);
    		            //球的位置
    	                btop = $(".dz_roll")[0].getBoundingClientRect().top;
    	                bleft = $(".dz_roll")[0].getBoundingClientRect().left;
    	                //下一个奖品位置
    	                ntop = nextgift[0].getBoundingClientRect().top;
    		            nleft = nextgift[0].getBoundingClientRect().left;
    	                /*pos.push();*/
    	                var transiobj = {
    	                   x: (nleft - bleft)+40,
                		   y: (ntop - btop)+40,
                		   duration:speed,
                		   easing: 'linear',
                		   rotate: 90*i,
                		   complete: function(){
                		       self.audio.dzrollAudio.play();
                		   }
    	                };
    	                if(i == rolenum){
    	                    transiobj.complete = function(){self.showprizedetail(openid);}
    	                };
    	                ballobj = $(".dz_roll").transition(transiobj);
                    }
    		    }
		    }
		},
		showprizedetail: function(openid){
		    var self = this;
		    setTimeout(function(){
		      //  console.log(self.prizeinfo);
		        screensocket.sendData({type:"dzlotterygame",stype:"gameshowprize",data:self.prizeinfo});
                if(prize_template_type == '1'){
                    $('.dz_roll').addClass('hidden');
                    $('.dz_roll').css({'top':'400px','left':'1150px'});
                    $('.dz_roll').css({'transform':"translate(0,0)"});
                }else{
                    $('.dz_roll').addClass('hidden');
                    $('.dz_roll').css({'top':'735px','left':'1390px'});
                    $('.dz_roll').css({'transform':"translate(0,0)"});
                }
                $('.dzlottery').addClass('hidden');
                
                $('.showprize').removeClass('hidden');
                $('.showprizebox').addClass('animated bounceInDown');
                flowerstart();
                //播放中奖音乐
                if(dzlotterymusic_src != ''){
                    self.audio.dzlotteryAudio.pause();
                }
                if(prizemusic_src != ''){
                    self.audio.overAudio.play();
                }
                if(bgmusic_src != ''){
                    self.audio.bgmusic.pause();
                }
                setTimeout(function(){
                    $('.showuser').removeClass('hidden').transition({y: -200},800,function(){
                        $('.showprizedetail').removeClass('hidden').addClass('animated wobble');
                        self.refreshpd = true;
                        setTimeout(function(){
                            $('#leafContainer').html('');
                            $('.dzlottery').removeClass('hidden');
                            $('.showprize .showuser').addClass('hidden').transition({y:0,x:0,});
                            self.checkstart = false;
                            screensocket.sendData({type:"dzlotterygame",stype:"gameover",openid:openid,isuse:3,codeid:self.djsdata.codeid});
                            //清除变量    
                            self.djsdata = {};
                            self.prizeinfo = {};
                            self.apphasstart = false;//下一轮开始
                            $('.showprize').addClass('hidden');
                            $('.showprizebox').removeClass('animated bounceInDown');
                            $('.showprizedetail').addClass('hidden').removeClass('animated wobble');
                            //抽奖结束，播放背景音乐
                            if(bgmusic_src != ''){
                                self.audio.bgmusic.play();
                            }
                            if(dzlotterymusic_src != ''){
                                self.audio.dzlotteryAudio.pause();
                            }
                            if(prizemusic_src != ''){
                                self.audio.overAudio.pause();
                            }
                        },8000);
                    });
                }, 1000);
		    },600);
		},
        
    };
    return screendzlottery;
});