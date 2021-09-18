define('screenbigcj',['screencore','layerBox','template','keyboard'],function (screencore,layerBox,template,keyboardJS) {
var screenbigcj = {
	alluser:[],
	maxid:0,
	init: function() {
		var self = this;
		self.ajaxusers(function(){
			self.createwall();
			self.bindevent();
			setTimeout(function(){
				self.getnewUser();
			},10e3);
		});
	},
	ajaxusers:function(fn){
		var self = this;
		screencore.ajaxSubmit('screen.bigcj.getAlluser',{bdinfo:XCV2Config.bdinfo}).then(function(e){
			if(e.errno==0){
				self.alluser = e.message.total;
				if(self.alluser.length>0){
					self.maxid = self.alluser.slice(-1)[0].userid;
				}
				$(".bigcj-joinbox span").text(e.message.count);
				fn&&fn();
			}else{
				layerBox.showMsg(e.message);
			}
		});
	},
	getnewUser:function(){
		var self = this;
		screencore.ajaxSubmit('screen.bigcj.getmoreuser',{maxid:self.maxid,openupimg:XCV2Config.bdinfo.openupimg,openreal:XCV2Config.bdinfo.openreal}).then(function(data){
			$(".bigcj-joinbox span").text(data.message.total);
			var newuser = data.message.newuser;
			var noavatars = $(".bigcj-avatarBox .avatarbox").filter(function(o, i) {
				return "N" == $(i).attr("data-avatar")
		    });
			if(noavatars.length <= 0 ){
				noavatars = $(".bigcj-avatarBox .avatarbox").filter(function(o, i) {
					return "Y" == $(i).attr("data-avatar")
				});
			}
			if(newuser.length >0 ){
				$.each(newuser,function(i,v){
					if(noavatars.eq(i).length>0){
						noavatars.eq(i).find('img').attr('src',v.avatar);
						noavatars.eq(i).attr('data-avatar','Y');
					}
				});
				self.maxid = newuser.slice(-1)[0].userid;
			}
			setTimeout(function(){
				self.getnewUser();
			},5e3);
		}, function(){
			setTimeout(function(){
				self.getnewUser();
			},5e3);
		});
	},
	createwall:function(){
		var self = this;
		for (var i=0; i < bigcj.cols; i++) {
			var colrow = '<div class="avatarcols">';
			for (var j = 0; j < bigcj.colrows; j++){
				var key = (i*bigcj.colrows + j);
				var uavatar = self.alluser[key]?self.alluser[key].avatar:(self.alluser.length>0?self.alluser[Math.floor(Math.random()*self.alluser.length)].avatar:bigcj.defaultavatar);
				colrow += template("oneavatar-tpl",{avatar:uavatar,isyes:(self.alluser[key]?true:false)});
			}
			colrow += '</div>';
			$('.bigcj-avatarBox').append(colrow);
		}
		$('.bigcj-avatarBox .avatarbox').height($('.bigcj-avatarBox .avatarbox').eq(0).width());
		var q = Math.pow,screenW = $('body').width(),colnums = $('.avatarcols').length;
		for (var n = 0; n < colnums; n++) {
			var h = ( colnums + 1) / 2,i = Math.abs(n + 1 - h),j = screenW / 2,k = Math.sqrt(q(j, 2) - q(i / h * j, 2));
			var l = bigcj.shape=='1'?(1 - 0.3 * ((k - j / 3) / (j - j / 3))):bigcj.shape=='2'?(0.56 + 0.4 * ((k - j / 4) / (j - j / 4))):0.8;
			$('.avatarcols').eq(n).css({
				transform: 'scale(' + l + ')',
				margin: '0 ' + (l / 2 - 0.4)*56 + 'px'
			})
		}
	},
	bindevent:function(){
		var self = this;
		$(window).on('resize',function(){
			$('.bigcj-avatarBox .avatarbox').height($('.bigcj-avatarBox .avatarbox').eq(0).width());
		});
		$('.start_btn').on('click',function(){
			var $this = $(this);
			if($this.hasClass('isining')) return;
			$this.addClass('issaving');
			if($this.text()=='开始抽奖'){
				$('.bigcj-prizeusers').hide();
				var selprizeid = parseInt($('.bigcj-prizename').attr('data-id'));
				if(!selprizeid || selprizeid<=0) return layerBox.showMsg('请选择奖项');
				var personnum = parseInt($('.bigcj-numbox input').val());
				if(!personnum || personnum<=0) return layerBox.showMsg('请设置抽取人数');
				screencore.ajaxSubmit('screen.bigcj.savelucker',{prizeid:selprizeid,selnum:personnum,bdinfo:XCV2Config.bdinfo}).then(function(e){
					if(e.errno==0){
						screencore.hideFootAndQr();
						$(".bigcj-cubebox .bigcj-awardbox,.bigcj-cubebox .bigcj-cube,.bigcj-cubebox .bigcj-sex").css({"opacity":"0"});//隐藏立体盒子
						$('.bigcj-avatarBox .avatarbox').removeClass('avatar_shadow');
						$('.bigcj-mask1, .bigcj-mask2').addClass('maskopen');
						setTimeout(function() {
							$('.bigcj-mask1, .bigcj-mask2').width(0), $('.bigcj-mask1, .bigcj-mask2').removeClass('maskopen')
						}, 1e3);
						for (var b = 0; b < $('.bigcj-avatarBox .avatarbox').length / 2; b++) {
							$('.bigcj-avatarBox .avatarbox').eq(b).addClass('avatar_rotate');
							$('.bigcj-avatarBox .avatarbox').eq(b).css('animation-delay', b / 40 + 's');
						}
						for (var c = $('.bigcj-avatarBox .avatarbox').length; c >= $('.bigcj-avatarBox .avatarbox').length / 2; c--) {
							$('.bigcj-avatarBox .avatarbox').eq(c).addClass('avatar_rotate');
							$('.bigcj-avatarBox .avatarbox').eq(c).css('animation-delay', ($('.bigcj-avatarBox .avatarbox').length - c) / 40 + 's')
						}
						$("#bgmusic").length >0 && $("#bgmusic").get(0).pause();
						$("#cjing").get(0).play();
						$this.text('充能中..').removeClass('issaving').addClass('isining');
						luckerids = e.message.luckerids;
						var outluckerRender = template('outlucker-tpl');
						var html = '';
						var popnum = 0;
						if(e.message.list.length > 0 && e.message.list.length < 3){
							popnum = 1;
						}else if(e.message.list.length > 2 && e.message.list.length < 9){
							popnum = 2;
						}else if(e.message.list.length > 8 && e.message.list.length < 13){
							popnum = 3;
						}
						$.each(e.message.list,function(i,v){
							var nickname = '';
							if(lotteryshow.length>0&&v.binddata){
								var bdval = '';
								$.each(lotteryshow,function(index,val){
									 if(!v.binddata[val]||v.binddata[val]==''){
										return true;
									 }
									 if(val=='mobile'){
										 bdval += '<div>'+v.binddata[val].replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')+'</div>';
									 }else{
										 bdval += '<div>'+v.binddata[val]+'</div>';
									 }
								});
								nickname += (bdval==''?'<div>'+v.nickname+'</div>':bdval);
							}else{
								nickname += '<div>'+v.nickname+'</div>';
							}
							v.nickname = nickname;
							v.popnum = popnum;
							html += outluckerRender(v);
						});
						$(".bigcj-popBox ul").html(html);
						setTimeout(function(){
							$this.text('停止抽奖').removeClass('isining');
						},3e3);
					}else{
						$this.removeClass('issaving');
						layerBox.showMsg(e.message);
					}
				}, function(){
				  $this.removeClass('issaving');
				  $(".bigcj-popBox ul").empty();
				  layerBox.showMsg('网络异常，抽奖出错');
				});
			}else{
				var popBoxprize = $(".bigcj-popBox-prize").find('span'),selprize = $(".bigcj-prizelist li.issel");
				popBoxprize.eq(0).text(selprize.text());
				popBoxprize.eq(1).text(selprize.attr("data-prizename"));
				bigcj.hideavatarwall=='1' && $(".bigcj-avatarBox").css({'opacity':'0'});
				$(".bigcj-popBox").addClass('bigcj-popBox-ani');
				$('.bigcj-avatarBox .avatarbox').removeClass('avatar_rotate');
				$('.bigcj-avatarBox .avatarbox').addClass('avatar_scale');
				for (var g = 0; g < $('.bigcj-avatarBox .avatarbox').length; g++){
					(function(b) {
					setTimeout(function() {
						$('.bigcj-avatarBox .avatarbox').eq(b).removeClass('avatar_scale');
						$('.bigcj-avatarBox .avatarbox').eq(b).css('animation-delay','0s');
						$('.bigcj-avatarBox .avatarbox').eq(b).addClass('avatar_shadow');
					}, 1e3 * parseFloat($('.bigcj-avatarBox .avatarbox').eq(b).css('animation-delay')) + 400)
					})(g);
				}
				setTimeout(function() {
						$this.text('开始抽奖').removeClass('issaving').hide();
						$('.bigcj-mask1, .bigcj-mask2').width('50%'), $('.bigcj-mask1, .bigcj-mask2').removeClass('maskclose')
				}, 1e3);
				$("#cjing").get(0).pause();
				$("#cjend").get(0).play();
				screencore.ajaxSubmit('screen.bigcj.sendLuckerMsg',{luckerids:luckerids}).then(function(e){
					luckerids = [];
				});
				$('.bigcj-mask1, .bigcj-mask2').addClass('maskclose');
			}
		});
		$(".bigcj-popBox .bigcj-popBox-close").on('click',function(){
				$(".bigcj-popBox").removeClass('bigcj-popBox-ani');
				bigcj.hideavatarwall=='1' && $(".bigcj-avatarBox").css({'opacity':'1'});
				$('.start_btn').show();
				$(".bigcj-cubebox .bigcj-awardbox,.bigcj-cubebox .bigcj-cube,.bigcj-cubebox .bigcj-sex").css({"opacity":"1"});
				$("#bgmusic").length >0 && $("#bgmusic").get(0).play();
		});
		$(".bigcj-prizeusers .bigcj-user-close").on('click',function(){
				$('.bigcj-prizeusers').hide();
		});
		//切换奖品
		$('.bigcj-prizename').on('click', function() {
			if ('show' == bigcj.arraowflag) {
				var b = 4 < bigcj.prizenum ? 4 : bigcj.prizenum;
				$(this).nextAll('.bigcj-prizelist').animate({
					height: 30 * b + 'px'
				}, 500), bigcj.arraowflag = 'hide', $('.bigcj-setarrow').css('transform', 'rotate(0deg)')
			} else {
				$(this).nextAll('.bigcj-prizelist').animate({
					height: 0
				}, 500);
				bigcj.arraowflag = 'show';
				$('.bigcj-setarrow').css('transform', 'rotate(180deg)');
			}
		});
		$(".bigcj-prizelist li").on('click',function(){
			$('.bigcj-prizename').text($(this).text());
			$('.bigcj-prizename').attr('data-id',$(this).attr('data-id'));
			$('.bigcj-cube div').css('background-image','url('+$(this).attr('data-prizeimg')+')');
			$('.bigcj-awardbox span').eq(0).text($(this).text());
			$('.bigcj-awardbox span').eq(1).text($(this).attr('data-prizename'));
			$('.bigcj-numbox input').val($(this).attr('data-onceout'));
			$(this).addClass('issel').siblings().removeClass('issel');
			$('.bigcj-prizelist').animate({height:0}, 500);
			bigcj.arraowflag = 'show';
			$('.bigcj-setarrow').css('transform', 'rotate(180deg)');
		});
		keyboardJS.bind('left', function(e) {
			if($(".bigcj-cubebox .bigcj-sex").css("opacity")=='0') return;
			var prevLi = $(".bigcj-prizelist li.issel").prev();
			prevLi.length > 0 ? prevLi.trigger('click'):$(".bigcj-prizelist li:last").trigger('click');
			setTimeout(function(){
				if(!$('.bigcj-prizeusers').is(':hidden')){
					getprizelucker($('.bigcj-prizename').attr('data-id'));
				}
			},5e2);
		});
		keyboardJS.bind('right', function(e) {
			if($(".bigcj-cubebox .bigcj-sex").css("opacity")=='0') return;
			var nextLi = $(".bigcj-prizelist li.issel").next();
			nextLi.length > 0 ? nextLi.trigger('click'):$(".bigcj-prizelist li:first").trigger('click');
			setTimeout(function(){
				if(!$('.bigcj-prizeusers').is(':hidden')){
					getprizelucker($('.bigcj-prizename').attr('data-id'));
				}
			},3e2);
		});
		keyboardJS.bind('up', function(e) {
			if($(".bigcj-cubebox .bigcj-sex").css("opacity")=='0') return;
			var nownum = parseInt($('.bigcj-numbox input').val());
			nownum = (nownum&&nownum>0)? nownum + 1:1;
			$('.bigcj-numbox input').val(nownum);
		});
		keyboardJS.bind('down', function(e) {
			if($(".bigcj-cubebox .bigcj-sex").css("opacity")=='0') return;
			var nownum = parseInt($('.bigcj-numbox input').val());
			nownum = (nownum&&nownum>2)? nownum - 1:1;
			$('.bigcj-numbox input').val(nownum);
		});
		keyboardJS.bind('/', function(e) {
			layerBox.showConfirm('警告','清空将删除当前奖品的所有中奖用户，并且无法恢复，您确定要清空？',['确定','取消'],function(){
				var prizeid = $('.bigcj-prizename').attr('data-id');
				screencore.ajaxSubmit('screen.bigcj.delalllucker',{prizeid:prizeid},'').then(function(e){
					if(e.errno==0){
						getprizelucker(prizeid);
						layerBox.showMsg('清空成功');
					}else{
						layerBox.showMsg(e.message);
					}
				});
			});
		});
		$(".bigcj-user-list").on('click',".right-luckerdel",function(){
			var $this = $(this);
			var luckerid = $this.attr('data-id');
			layerBox.showConfirm('警告','删除将无法恢复，确定要删除此中奖用户么?',['确定','取消'],function(){
				screencore.ajaxSubmit('screen.bigcj.dellucker',{luckerid:luckerid},'').then(function(e){
					if(e.errno==0){
						$this.parent().parent().remove();
						layerBox.showMsg('删除成功');
					}else{
						layerBox.showMsg(e.message);
					}
				});
			});
		});
		keyboardJS.bind('space', function(e) {
			if(!$('.start_btn').is(':hidden')){
				$('.start_btn').trigger('click');
			}else{
				$(".bigcj-popBox .bigcj-popBox-close").trigger('click');
			}
		});
		$(".bigcj-set .bigcj-showlist").on('click',function(){
			if($('.bigcj-popBox').is(':hidden')){
				if($('.bigcj-prizeusers').is(':hidden')){
					var prizeid = $('.bigcj-prizename').attr('data-id');
					getprizelucker(prizeid,function(){
						$('.bigcj-prizeusers').show();
					});
				}else{
					$('.bigcj-prizeusers').hide();
				}
			}
		});	
		keyboardJS.bind('shift', function() {
			$('.bigcj-set .bigcj-showlist').trigger('click');
		});
},
};
function getprizelucker(id,fn){
	screencore.ajaxSubmit('screen.bigcj.ajaxprizelucker',{prizeid:id,bdinfo:XCV2Config.bdinfo},'正在加载中奖记录..').then(function(e){
		if(e.errno==0){
			var lucker = e.message.lucker;
			var luckerRender = template('lucker-tpl');
			var html = '';
			$.each(lucker,function(i,v){
				var nickname = '';
				if(lotteryshow.length>0&&v.binddata){
					var bdval = '';
					$.each(lotteryshow,function(index,val){
						 if(!v.binddata[val]||v.binddata[val]==''){
							return true;
						 }
						 if(val=='mobile'){
							 bdval += '<div>'+v.binddata[val].replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')+'</div>';
						 }else{
							 bdval += '<div>'+v.binddata[val]+'</div>';
						 }
					});
					nickname += (bdval==''?'<div>'+v.nickname+'</div>':bdval);
				}else{
					nickname += '<div>'+v.nickname+'</div>';
				}
				v.nickname = nickname;
				html += luckerRender(v);
			});
			$(".bigcj-prizeusers ul").html(html);
			$(".bigcj-prizeusers .bigcj-prize-name span").eq(0).text(e.message.awardname);
			$(".bigcj-prizeusers .bigcj-prize-name span").eq(1).text(Object.keys(lucker).length);
			$(".bigcj-prizeusers .bigcj-prize-awardname").text(e.message.prizename);
			fn&&fn();
		}else{
			layerBox.showMsg(e.message);
		}
	});
}
return screenbigcj;
});
