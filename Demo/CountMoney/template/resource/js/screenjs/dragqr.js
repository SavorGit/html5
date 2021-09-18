define('dragqr',['jquery','screencore','jquery.ui'],function($,screencore){
	var dragqr = {
		dragDom:null,
		dragBox:null,
		isScale:false,
		zoom:0,
		init:function(dom,resize){
			var resize = resize||false;
			var self = this;
			self.zoom = (window.innerHeight / 800).toFixed(2);
			var _dragBox = $(dom);
			if(_dragBox.length<=0) return;
			self.dragDom = _dragBox;
			self.dragBox = _dragBox[0];
			var dragImg = _dragBox.find('img');
			_dragBox.draggable({containment: ".full-main", scroll: false ,stop: function(event, ui) {
				var left = ui.position.left,top = ui.position.top;
				self.dragBox.style.left = left + 'px';
				self.dragBox.style.top = top + 'px';
				window.localStorage.setItem("qrleft"+XCV2Config.hdid,left);
				window.localStorage.setItem("qrtop"+XCV2Config.hdid,top);
				window.localStorage.setItem("qrleftp"+XCV2Config.hdid,self.wpxtoper(left));
				window.localStorage.setItem("qrtopp"+XCV2Config.hdid,self.hpxtoper(top));
				window.localStorage.setItem("qrtype"+XCV2Config.hdid,'1');
			}});
			if(resize){
				var resizeObjs = _dragBox.find('span');
				resizeObjs.each(function(k,v){
					self.dragresize($(v));
				});
			}
			self.bindevent();
		},
		bindevent:function(){
			var self = this;
			$(".hdQrbox img").dblclick(function(){
				self.dragBox.style.width = '200px';
				self.dragBox.style.height = '240px';
				var pleft = (window.innerWidth/self.zoom - 300);
				var ptop = (800 - 240)/2;
				self.dragBox.style.left = pleft+'px';
				self.dragBox.style.top = ptop+'px';
				window.localStorage.setItem("qrw"+XCV2Config.hdid,200);
				window.localStorage.setItem("qrh"+XCV2Config.hdid,240);
				window.localStorage.setItem("qrleft"+XCV2Config.hdid,pleft);
				window.localStorage.setItem("qrtop"+XCV2Config.hdid,ptop);
				window.localStorage.setItem("qrleftp"+XCV2Config.hdid,self.wpxtoper(pleft));
				window.localStorage.setItem("qrtopp"+XCV2Config.hdid,self.hpxtoper(ptop,1));
				window.localStorage.setItem("qrshowtype"+XCV2Config.hdid,'1');
				window.localStorage.removeItem("qrright"+XCV2Config.hdid);
				window.localStorage.removeItem("qrbottom"+XCV2Config.hdid);
				window.localStorage.setItem("qrtype"+XCV2Config.hdid,'1');
			});
			$("body").click(function (e) {
				if (!$(e.target).closest(".hdQrbox").length) {
					$(".hdQrbox").removeClass('active');
				}else{
					$(".hdQrbox").addClass('active');
				}
			});
			$(window).bind('resize', function () {
				self.onresize();
			});
			self.initqr();
		},
		dragresize:function(obj){
				var self = this;
				obj.mousedown(function(ev){
                    self.isScale = true;
                    var oEv = ev || event;
                    var oldWidth = self.dragBox.offsetWidth;
					var oldHeight = self.dragBox.offsetHeight;
                    var oldX = oEv.clientX;
                    var oldY = oEv.clientY;
                    var oldLeft = self.dragBox.offsetLeft;
                    var oldTop = self.dragBox.offsetTop;
                    $(document).bind('mousemove',function(event){ 
                        var oEv = event || event;
						var className = obj.attr('class');
						var tipsH = self.dragDom.find("p").height();
						if(className=='tl'||className=='bl'){
							var boxwidth = oldWidth - (oEv.clientX - oldX);
							if(className=='tl'){
								var boxheight = oldHeight - (oEv.clientY - oldY);
							}else{
								var boxheight = oldHeight + (oEv.clientY - oldY);
							}
						}else{
							var boxwidth = oldWidth + (oEv.clientX - oldX);
							var boxheight = oldHeight + (oEv.clientY - oldY);
						}
						boxwidth = boxwidth<150?150:boxwidth;
						boxheight = boxheight<150?150:boxheight;
						//boxheight = ($(document.body).outerWidth(true) - (boxheight+2*tipsH))<=0?$(document.body).outerWidth(true)-2*tipsH:boxheight;
						//var boxheight = boxwidth + tipsH;
                        if (className === 'tl') {
                            self.dragBox.style.width = boxwidth + 'px';
                            self.dragBox.style.height = boxheight + 'px';
                            self.dragBox.style.left = oldLeft + (oEv.clientX - oldX) + 'px';
                            self.dragBox.style.top = oldTop + (oEv.clientY - oldY) + 'px';
							window.localStorage.setItem("qrw"+XCV2Config.hdid,boxwidth);
							window.localStorage.setItem("qrh"+XCV2Config.hdid,boxheight);
							window.localStorage.setItem("qrleft"+XCV2Config.hdid,oldLeft + (oEv.clientX - oldX));
							window.localStorage.setItem("qrtop"+XCV2Config.hdid,oldTop + (oEv.clientY - oldY));
							window.localStorage.setItem("qrleftp"+XCV2Config.hdid,self.wpxtoper(oldLeft + (oEv.clientX - oldX)));
							window.localStorage.setItem("qrtopp"+XCV2Config.hdid,self.hpxtoper(oldTop + (oEv.clientY - oldY)));
                        } else if (className === 'bl') {
                            self.dragBox.style.width = boxwidth + 'px';
                            self.dragBox.style.height = boxheight + 'px';
                            self.dragBox.style.left = oldLeft + (oEv.clientX - oldX) + 'px';
                            self.dragBox.style.bottom = oldTop + (oEv.clientY + oldY) + 'px';
							window.localStorage.setItem("qrw"+XCV2Config.hdid,boxwidth);
							window.localStorage.setItem("qrh"+XCV2Config.hdid,boxheight);
							window.localStorage.setItem("qrleft"+XCV2Config.hdid,oldLeft + (oEv.clientX - oldX));
							window.localStorage.setItem("qrbottom"+XCV2Config.hdid,oldTop + (oEv.clientY + oldY));
							//add
							window.localStorage.setItem("qrleftp"+XCV2Config.hdid,self.wpxtoper(oldLeft + (oEv.clientX - oldX)));
							window.localStorage.setItem("qrbottomp"+XCV2Config.hdid,self.hpxtoper(oldTop + (oEv.clientY + oldY)));
                        } else if (className === 'tr') {
                            self.dragBox.style.width = boxwidth + 'px';
							self.dragBox.style.height = boxheight + 'px';
                            self.dragBox.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
                            self.dragBox.style.top = oldTop + (oEv.clientY - oldY) + 'px';
							window.localStorage.setItem("qrw"+XCV2Config.hdid,boxwidth);
							window.localStorage.setItem("qrh"+XCV2Config.hdid,boxheight);
							window.localStorage.setItem("qrright"+XCV2Config.hdid,oldLeft - (oEv.clientX - oldX));
							window.localStorage.setItem("qrtop"+XCV2Config.hdid,oldTop + (oEv.clientY - oldY));
							//add
							window.localStorage.setItem("qrrightp"+XCV2Config.hdid,self.wpxtoper(oldLeft - (oEv.clientX - oldX)));
							window.localStorage.setItem("qrtopp"+XCV2Config.hdid,self.hpxtoper(oldTop + (oEv.clientY - oldY)));
                        } else if (className === 'br') {
                            self.dragBox.style.width = boxwidth + 'px';
                            self.dragBox.style.height = boxheight + 'px';
                            self.dragBox.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
                            self.dragBox.style.bottom = oldTop + (oEv.clientY + oldY) + 'px';
							window.localStorage.setItem("qrw"+XCV2Config.hdid,boxwidth);
							window.localStorage.setItem("qrh"+XCV2Config.hdid,boxheight);
							window.localStorage.setItem("qrright"+XCV2Config.hdid,oldLeft - (oEv.clientX - oldX));
							window.localStorage.setItem("qrbottom"+XCV2Config.hdid,oldTop + (oEv.clientY + oldY));
							//add
							window.localStorage.setItem("qrrightp"+XCV2Config.hdid,self.wpxtoper(oldLeft - (oEv.clientX - oldX)));
							window.localStorage.setItem("qrbottomp"+XCV2Config.hdid,self.hpxtoper(oldTop + (oEv.clientY + oldY)));
                        }
						window.localStorage.setItem("qrtype"+XCV2Config.hdid,'1');
                    });
                    $(document).bind('mouseup',function(event){
                        $(document).unbind('mousemove');
                        self.isScale = false;
                    });
                    return false;
                });
		},
		onresize:function(){
			var self = this;
			self.zoom = (window.innerHeight / 800).toFixed(2);
			var pleft = window.localStorage.getItem("qrleftp"+XCV2Config.hdid);
			var ptop = window.localStorage.getItem("qrtopp"+XCV2Config.hdid);
			var pright = window.localStorage.getItem("qrrightp"+XCV2Config.hdid);
			var pbottom = window.localStorage.getItem("qrbottomp"+XCV2Config.hdid);
			self.dragBox.style.left = pleft;
			self.dragBox.style.top = ptop;
			self.dragBox.style.right = pright;
			self.dragBox.style.bottom = pbottom;
			window.localStorage.setItem("qrtype"+XCV2Config.hdid,'2');
		},
		wpxtoper:function(v){
			var self = this;
			var per = v / (window.innerWidth/self.zoom);
			return Number(per*100).toFixed(2) + '%';
		},
		hpxtoper:function(v){
			var self = this;
			var per = v / 800;
			return Number(per*100).toFixed(2) + '%';
		},
		initqr:function(){
			var qrw = window.localStorage.getItem("qrw"+XCV2Config.hdid);
			var qrh = window.localStorage.getItem("qrh"+XCV2Config.hdid);
			var qrtype = window.localStorage.getItem("qrtype"+XCV2Config.hdid);
			if(qrw!=null){
				$(".hdQrbox").css({"width":qrw+'px'});
			}
			if(qrh!=null){
				$(".hdQrbox").css({"height":qrh+'px'});
			}
			if(qrtype=='1'){
				var qright = window.localStorage.getItem("qrright"+XCV2Config.hdid);
				var qleft = window.localStorage.getItem("qrleft"+XCV2Config.hdid);
				var qtop = window.localStorage.getItem("qrtop"+XCV2Config.hdid);
				var qbottom = window.localStorage.getItem("qrbottom"+XCV2Config.hdid);
				if(qright!=null){
					$(".hdQrbox").css({"right":qright+'px'});
				}
				if(qleft!=null){
					$(".hdQrbox").css({"left":qleft+'px'});
				}
				if(qtop!=null){
					$(".hdQrbox").css({"top":qtop+'px'});
				}
				if(qbottom!=null){
					$(".hdQrbox").css({"bottom":qbottom+'px'});
				}
			}else if(qrtype=='2'){
				var qright = window.localStorage.getItem("qrrightp"+XCV2Config.hdid);
				var qleft = window.localStorage.getItem("qrleftp"+XCV2Config.hdid);
				var qtop = window.localStorage.getItem("qrtopp"+XCV2Config.hdid);
				var qbottom = window.localStorage.getItem("qrbottomp"+XCV2Config.hdid);
				if(qright!=null){
					$(".hdQrbox").css({"right":qright});
				}
				if(qleft!=null){
					$(".hdQrbox").css({"left":qleft});
				}
				if(qtop!=null){
					$(".hdQrbox").css({"top":qtop});
				}
				if(qbottom!=null){
					$(".hdQrbox").css({"bottom":qbottom});
				}
			}else{
				//普通的模块应该居中 霸屏应该居底部
				var openmodule = screencore.getParas('r');
				if(openmodule.indexOf('baping')==-1){
					$(".hdQrbox img").trigger('dblclick');
				}else{
					var rightboxshow = localStorage.getItem('rightboxshow');
					if(rightboxshow=='0'){
						$(".hdQrbox img").trigger('dblclick');
					}else{
						$('.hdQrbox').css({'top':'68%','left':'83%'});
						window.localStorage.setItem("qrleftp"+XCV2Config.hdid,'83%');
						window.localStorage.setItem("qrtopp"+XCV2Config.hdid,'68%');
					}
				}
			}
		},
	};
	return dragqr;
});