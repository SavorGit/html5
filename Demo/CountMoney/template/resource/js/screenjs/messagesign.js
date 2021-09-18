define('messagesign',['jquery','template','screencore','layerBox'],function($,template,screencore,layerBox){
	var messagesign = {
		roll_direction:1,
		roll_num:2,
		newsign:[],
		oldsign:[],
		lastid:0,
		loaded:false,
		isyd:false,
		list_wid:0,
        listcontainer_wid:0,
        container_wid:0,
        lefttitleimg_box_wid:0,
        list_container_margin:0,
        nowshow:false,
		init:function(){
			var e = this;
			e.signRender = template('messagesign-tpl');
			e.getSignList();
		},
		getSignList:function(){
			var e = this;
			screencore.ajaxSubmit("screen.messagesign.historysign",{}).then(function(data){
				var ajaxsigns = data.message;
				var signLength = ajaxsigns.length;
				if(signLength>0){
					e.lastid = ajaxsigns[0].id;
					ajaxsigns = ajaxsigns.reverse();//颠倒顺序
					for (var m=0;m<signLength;m++) {
						e.newsign.unshift(ajaxsigns[m]);
					};
				}
				$(".joinPeople span").text(signLength);
				// e.oldSign = ajaxsigns;
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
			screencore.ajaxSubmit("screen.messagesign.getnewsign",{lastid:e.lastid}).then(function(data){
					var ajaxmsgs = data.message.message;
					var newsignLength = ajaxmsgs.length;
					if(newsignLength>0){
						e.lastid = ajaxmsgs[0].id;
						ajaxmsgs = ajaxmsgs.reverse();
						for (var m=0;m<newsignLength;m++) {
							var oneMsg = ajaxmsgs[m];
							e.newsign.unshift(oneMsg);
						};
					}
					$(".joinPeople span").text(data.message.total);
			},function(){
				layerBox.showMsg('加载出错');
			});
		},
		
		yidong:function(){
		    var self = this;
		  //  console.log($('.messagesign_lists').outerWidth());
            self.list_wid = $('.messagesign_lists').outerWidth();
            self.listcontainer_wid = $('.list_container').outerWidth();
            // self.container_wid = $('.message_container').innerWidth();
            if((self.listcontainer_wid<self.list_wid)&&(self.container_wid-self.listcontainer_wid)>10){
                $('.list_container').animate({width:$('.list_container').outerWidth()+20}, 500,'linear',function(){
                    self.yidong();
                });
            }else if((self.container_wid-self.listcontainer_wid<=10)&&(self.list_wid-self.container_wid>100)){
                var container_left = $('.message_container').offset().left;
                if(self.roll_direction == '1'){
                    var last_left = $('.messagesign_item:last').offset().left;
                    if(last_left <= self.container_wid+container_left-100){
                        self.roll_direction = '2';
                        self.yidong();
                    }else{
                        $('.messagesign_lists').transition({
                            x: -20*self.roll_num,
                            duration:600,
                            easing: 'linear',
                            complete: function(){
                                self.roll_num++;
                                self.yidong();
                            }
                        });
                    }
                }else if(self.roll_direction == '2'){
                    var first_left = $('.messagesign_item:first').offset().left;
                    if(first_left >= container_left + self.list_container_margin){
                        self.roll_direction = '1';
                        self.yidong();
                    }else{
                        $('.messagesign_lists').transition({
                            x: -20*self.roll_num,
                            duration:600,
                            easing: 'linear',
                            complete: function(){
                                self.roll_num--;
                                self.yidong();
                            }
                        });
                    }
                }
            }else{
                setTimeout(function() {
                    self.yidong();
                }, 1000);
                
            }
		},
		append:function() {
			var e = this;
			if(e.nowshow){
			    return;
			}
			if (e.newsign.length == 0){
				return;
			}else{
			    e.nowshow = true;
			    if(!e.isyd){
    			    var messagenum = $('.messagesign_lists .messagesign_item').length;
    			    if(messagenum>=5){
                        e.listcontainer_wid = $('.list_container').outerWidth();
                        e.container_wid = $('.message_container').innerWidth();
                        e.lefttitleimg_box_wid = $('.lefttitleimg_box').innerWidth();
                        var margin_listcontainer = $(".list_container").css('marginLeft');
                        
                        e.list_container_margin = parseInt(margin_listcontainer);
                        // console.log(e.list_container_margin);
                        e.container_wid = e.container_wid - e.lefttitleimg_box_wid - e.list_container_margin*2;//.list_container的左右margin之和
                        if(e.listcontainer_wid>e.container_wid){
                            $('.list_container').width(e.container_wid);
                        }
                        e.isyd = true;
                        e.yidong();
    			    }
			    }
				var i = e.newsign.pop();//删除并返回数组的最后一个元素。
				i.num = $(".messagesign_lists .messagesign_item").length+1;
				
			}
			var g = $(".messagesign_lists");
			var h = e.signRender(i);
			var f = $(h);
			$('.shownew_box .shownew_nickname span').text(i.msgname);
			$('.shownew_box .shownew_detail').text(i.message);
// 			g.prepend(f);
            // g.append(f);
			e.showbig(f);
		},
		showbig:function(f){
			var self = this;
			$(".shownew_box").removeClass('hidden');
            $(".alertbgimg").addClass('animated rollIn');
            setTimeout(function(){self.shownewdetail(f);},1000);
		},
		shownewdetail:function(f){
		    var self = this;
            $('.shownew_message').animate({width:$('.shownew_message').outerWidth()+40}, 500,'linear',function(){
                if($('.shownew_message').outerWidth()>=450){
                        $(".alertbgimg").removeClass('animated rollIn');
                        $(".alertbgimg").transition({ 
                            scale: 0,
                        },800,function(){
                            $(".shownew_box").addClass('hidden');
                            $(".alertbgimg").transition({ scale: 1 });
                            $('.shownew_message').width('0');
                            $(".messagesign_lists").append(f);
                            self.nowshow = false;
                        });
                }else{
                    self.shownewdetail(f);
                }
            });
		},
	};
	return messagesign;
});
