define('screenshakestart',['screensocket','screencore','template','layerBox','fulldm','keyboard','threejs'],function(screensocket,screencore,template,layerBox,fulldm,keyboardJS,THREE){
    THREE.CSS3DObject=function(a){THREE.Object3D.call(this);this.element=a;this.element.style.position="absolute";this.addEventListener("removed",function(){if(this.element.parentNode!==null){this.element.parentNode.removeChild(this.element)}})};THREE.CSS3DObject.prototype=Object.create(THREE.Object3D.prototype);THREE.CSS3DObject.prototype.constructor=THREE.CSS3DObject;THREE.CSS3DSprite=function(a){THREE.CSS3DObject.call(this,a)};THREE.CSS3DSprite.prototype=Object.create(THREE.CSS3DObject.prototype);THREE.CSS3DSprite.prototype.constructor=THREE.CSS3DSprite;THREE.CSS3DRenderer=function(){console.log("THREE.CSS3DRenderer",THREE.REVISION);var d,g;var n,l;var m=new THREE.Matrix4();var a={camera:{fov:0,style:""},objects:{}};var i=document.createElement("div");i.style.overflow="hidden";this.domElement=i;var j=document.createElement("div");j.style.WebkitTransformStyle="preserve-3d";j.style.MozTransformStyle="preserve-3d";j.style.transformStyle="preserve-3d";i.appendChild(j);var c=/Trident/i.test(navigator.userAgent);this.setClearColor=function(){};this.getSize=function(){return{width:d,height:g}};this.setSize=function(q,p){d=q;g=p;n=d/2;l=g/2;i.style.width=q+"px";i.style.height=p+"px";j.style.width=q+"px";j.style.height=p+"px"};function o(p){return Math.abs(p)<1e-10?0:p}function k(p){var q=p.elements;return"matrix3d("+o(q[0])+","+o(-q[1])+","+o(q[2])+","+o(q[3])+","+o(q[4])+","+o(-q[5])+","+o(q[6])+","+o(q[7])+","+o(q[8])+","+o(-q[9])+","+o(q[10])+","+o(q[11])+","+o(q[12])+","+o(-q[13])+","+o(q[14])+","+o(q[15])+")"}function f(p,s){var q=p.elements;var r="matrix3d("+o(q[0])+","+o(q[1])+","+o(q[2])+","+o(q[3])+","+o(-q[4])+","+o(-q[5])+","+o(-q[6])+","+o(-q[7])+","+o(q[8])+","+o(q[9])+","+o(q[10])+","+o(q[11])+","+o(q[12])+","+o(q[13])+","+o(q[14])+","+o(q[15])+")";if(c){return"translate(-50%,-50%)translate("+n+"px,"+l+"px)"+s+r}return"translate(-50%,-50%)"+r}function b(q,v,w){if(q instanceof THREE.CSS3DObject){var u;if(q instanceof THREE.CSS3DSprite){m.copy(v.matrixWorldInverse);m.transpose();m.copyPosition(q.matrixWorld);m.scale(q.scale);m.elements[3]=0;m.elements[7]=0;m.elements[11]=0;m.elements[15]=1;u=f(m,w)}else{u=f(q.matrixWorld,w)}var s=q.element;var t=a.objects[q.id]&&a.objects[q.id].style;if(t===undefined||t!==u){s.style.WebkitTransform=u;s.style.MozTransform=u;s.style.transform=u;a.objects[q.id]={style:u};if(c){a.objects[q.id].distanceToCameraSquared=e(v,q)}}if(s.parentNode!==j){j.appendChild(s)}}for(var r=0,p=q.children.length;r<p;r++){b(q.children[r],v,w)}}var e=function(){var q=new THREE.Vector3();var p=new THREE.Vector3();return function(s,r){q.setFromMatrixPosition(s.matrixWorld);p.setFromMatrixPosition(r.matrixWorld);return q.distanceToSquared(p)}}();function h(r){var p=Object.keys(a.objects).sort(function(t,s){return a.objects[t].distanceToCameraSquared-a.objects[s].distanceToCameraSquared});var q=p.length;r.traverse(function(t){var s=p.indexOf(t.id+"");if(s!==-1){t.element.style.zIndex=q-s}})}this.render=function(s,r){var p=r.projectionMatrix.elements[5]*l;if(a.camera.fov!==p){i.style.WebkitPerspective=p+"px";i.style.MozPerspective=p+"px";i.style.perspective=p+"px";a.camera.fov=p}s.updateMatrixWorld();if(r.parent===null){r.updateMatrixWorld()}var t="translateZ("+p+"px)"+k(r.matrixWorldInverse);var q=t+"translate("+n+"px,"+l+"px)";if(a.camera.style!==q&&!c){j.style.WebkitTransform=q;j.style.MozTransform=q;j.style.transform=q;a.camera.style=q}b(s,r,t);if(c){h(s)}}};
    var screenshakestart = {
        stopclick:false,
        gamestatus:0,
        list:[],
        sendgameend:false,//解决只能发送一次gameend
        showUserStatus:false,//判断上一个newsign结束没有；
        oldjoinarr:[],
        newjoinarr:[],
        isnormaldjs:false,
        rankTen:[],
        showphbnumber:10,
        hasopenShakeStart:false,//已经开始画圆了，不能重复画
        hasstart:false,//已经开始了，开始快捷键失效
        isstop:false,
        audio:{},
        addstartvideo:false,
        init: function(){
            // var shakestartEnd = 0;//判断还可以出现newsign
            var newtimer = null;
            var self = this;
            var params = {};
            params.onmessage = function(data){
                // console.log(data);
				if(data.type=='connected'){
					screensocket.isclose = false;
					screensocket.sendData({type:"shakestartgame",stype:"gamelink"});
					
				}else if(data.type=='newjoin'){
				    if(data.nickname && data.avatar && data.openid){
				        var addnewjoin = true;
				        if(self.oldjoinarr.length > 0){
				            for(var i=0;i<self.oldjoinarr.length;i++){
				                if(self.oldjoinarr[i].openid == data.openid){
				                    addnewjoin = false;
				                    break;
				                }
				            }
				        }
				        if(addnewjoin){
				            self.newjoinarr.push({openid:data.openid,avatar:data.avatar,nickname:data.nickname});
				            var joinnumber = parseInt($('.joinPeople span').text());
				            $('.joinPeople span').text(joinnumber+1);
				        }
				    }
				}else if(data.type=='gameisend'){
				    self.hasstart = true;
				    layer.msg('启动仪式已经结束！请到后台重置',{time:200000});
				}else if(data.type=='gamenoround'){
				// 	if(self.gamestatus==0){
				        // self.showLastRoundUser();
				        $(".emptybox").removeClass("display-none");
				// 	}
				}else if(data.type=='gameisdjs'){
				    self.gamestatus = 2;
				    self.isnormaldjs = true;
				    clearInterval(newtimer);
					newtimer = null;
					if(!$('.cutdown-start').hasClass('countHidden')){
					    $('.cutdown-start').addClass('countHidden');
					}
					if(data.shakestart_type == '2'){
					    waterdata = (data.shakestart_time - data.djs) / data.shakestart_time;
					}else{
					    userTotalCount = data.allscore;
    			        waterdata = userTotalCount/totalMax;
					}
					if(!self.hasopenShakeStart){
					    self.openShakeStart();
					    self.hasopenShakeStart = true;
					}
					if(self.newjoinarr.length > 0){
					    var newshowjoin = self.newjoinarr.shift();
					    self.oldjoinarr.push(newshowjoin);
					}
                    if(data.djs == 0){
                        if(bgmusic != ''){
                            self.audio.bgmusic.pause();
                        }
                        if(countaudio_src != ''){
                            self.audio.countAudio.pause();
                        }
//                        if(startvideo == '' && overaudio_src != ''){
//                            self.audio.overAudio.play();
//                        }
						if(isplay == '2' && overaudio_src != ''){
                            self.audio.overAudio.play();
                        }
                        if(startvideo != '' && isplay != '1'){
                            $('.videoBg')[0].pause();
                        }
                    
						self.gamestatus = 3;
						shakestartEnd = 1;
						arcStack = [];
						ballctx.clearRect(0,0,oW,oH);
						window.cancelAnimationFrame(stopball);
						$(".ballBox").hide();
				        if($(".logoBox img").attr('src') != ''){
				            $(".logoBox").removeClass('countHidden');
				            $(".logoBox img").addClass('animated flip');
				        }
						setTimeout(function(){
							if(data.showflower == '1'){
							    if(flowertype == '1'){
							        totalplay();
							    }else{
							        flowerstart();
							    }
							}
						},1500);
            			
            			//解决当根据时间来涨水时，会继续飞头像
            			self.stageStop = true;
                        setTimeout(function(){
                            $('.lottery3d-stage').empty();
                        },500);
					}
				}else if(data.type=='gameiswait'||data.type=='gameisrun'){
				    // self.bindEvent();
				    self.initAudio();
				    self.oldjoinarr = data.list ? data.list : [];
				    self.showphbnumber = data.showphbnumber;
					if(data.signnumber){
                        $('.joinPeople span').text(data.signnumber);
                    }
					if(data.type=='gameiswait'){
						self.gamestatus = 1;
						clearInterval(self.joinInterval);
				        newtimer = setInterval(function(){
    					   if(self.newjoinarr.length > 0){
    					        if(!self.showUserStatus){
        				            var newshow = self.newjoinarr.shift();
                    				self.showUserStatus = true;
                    				self.showNewuser(newshow.avatar,newshow.nickname);
                    				self.oldjoinarr.push(newshow);
                			    }
    					    }else if(self.oldjoinarr.length > 0){
    					        if(!self.showUserStatus){
        				            var newshow = self.oldjoinarr[Math.floor((Math.random()*self.oldjoinarr.length))];
                    				self.showUserStatus = true;
                    				self.showNewuser(newshow.avatar,newshow.nickname);
                			    }
    					    }
    					},1800);
					}else{
					    if(bgmusic != ''){
					        self.audio.bgmusic.pause();
					    }
					    if(overaudio_src != ''){
    				        self.audio.overAudio.pause();
					    }
    				    if(startvideo == '' && countaudio_src != ''){
    				        self.audio.countAudio.play();
    				    }
				        // if(startvideo != '' && !self.addstartvideo){
    				    //     $('.pcbgBox .main-bg').html('<video class="videoBg" src="'+startvideo+'" autoplay="autoplay" loop="loop"></video>');
    				    //     self.addstartvideo = true;
    				    // }
				        if(startvideo != '' && !self.addstartvideo){
				            if(countaudio_src != ''){
				                $('.pcbgBox .main-bg').html('<video muted class="videoBg" src="'+startvideo+'" autoplay="autoplay" loop="loop"></video>');
				                self.audio.countAudio.play();
				            }else{
				                $('.pcbgBox .main-bg').html('<video class="videoBg" src="'+startvideo+'" autoplay="autoplay" loop="loop"></video>');
				            }
    				        
    				        self.addstartvideo = true;
    				    }
					    self.gamestatus = 2;
					    self.hasstart = true;
					   // shakestartEnd == 1;
					    clearInterval(newtimer);
					    newtimer = null;
						setTimeout(function(){
						    if(!self.isnormaldjs){
						        layerBox.showMsg('请到后台重置摇一摇启动');
						    }else{
						        self.stageInit();
						    }
						},5000);
					}
				}else if(data.type=='gameiscountdown'){
				    if(bgmusic != ''){
				        self.audio.bgmusic.pause();
				    }
				    if(overaudio_src != ''){
				        self.audio.overAudio.pause();
				    }
				    if(startvideo == '' && countaudio_src != ''){
				        self.audio.countAudio.play();
				    }
				    // if(startvideo != '' && !self.addstartvideo){
				    //     $('.pcbgBox .main-bg').html('<video class="videoBg" src="'+startvideo+'" autoplay="autoplay" loop="loop"></video>');
				    //     self.addstartvideo = true;
				    // }
				    if(startvideo != '' && !self.addstartvideo){
			            if(countaudio_src != ''){
			                $('.pcbgBox .main-bg').html('<video muted class="videoBg" src="'+startvideo+'" autoplay="autoplay" loop="loop"></video>');
			                self.audio.countAudio.play();
			            }else{
			                $('.pcbgBox .main-bg').html('<video class="videoBg" src="'+startvideo+'" autoplay="autoplay" loop="loop"></video>');
			            }
				        self.addstartvideo = true;
				    }
				    clearInterval(newtimer);
					newtimer = null;
					if($('.cutdown-start').hasClass('countHidden') && djsisshow == '1'){
				        $('.cutdown-start').removeClass('countHidden');
					}
					var screendjs = data.djs>0?data.djs:'GO';
				    $(".cutdown-box p").html(screendjs);
				    if(data.djs == 0){
				        setTimeout(function(){
				            self.stageInit();
				        },1500);
				    }
				}else if(data.type=='gameshowphbbtn'){
				    if(data.showphb == '1'){
				        self.showEndUser(data.list,data.showphbnumber);
				    }
				}else if(data.type=='gameshakestartrefresh'||data.type=='gameerrorhaddone'){
					window.location.reload();
				}else if(data.type=='gameiserror'){
					layerBox.showMsg('当前轮次异常');
					setTimeout(function(){
						window.location.reload();
					},1e3);
				}else if(data.type=='shakestartoffline'){
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
			self.drawCircle();
        },
        initAudio: function(){
			var self = this;
            if(bgmusic != ''){
                self.audio.bgmusic = document.getElementById("bgmusic");
            }
            if(countaudio_src != ''){
			    self.audio.countAudio = document.getElementById("countaudio");
            }
            if(overaudio_src != ''){
			    self.audio.overAudio = document.getElementById("overaudio");
            }
		},
        bindEvent: function(){
            var self = this;
            $(".shakestart-start-btn").on('click',function(){
				if(screensocket.isclose) return;
				if(parseInt($(".joinPeople span").text())==0) return layerBox.showMsg('当前无用户参与，无法开始游戏');
				if(self.stopclick) return;
				// alert(2);
				self.stopclick = true;
				// $(".shakestart-start-btn").addClass('display-none');
				screencore.hideFootAndQr();
				// clearInterval(self.joinInterval);
				self.hasstart = true;
				screensocket.sendData({type:"shakestartgame",stype:"gamestart"});
			});
            keyboardJS.bind('enter', function(e) {
				if(!$('.videoBg').hasClass('hasplay')){
                    $('.videoBg')[0].pause();
                    $('.videoBg').addClass('hasplay');
                }else{
                    $('.videoBg')[0].play();
                    $('.videoBg').removeClass('hasplay');
                }
			});
			keyboardJS.bind('spacebar', function(e) {
			 //   console.log('spacebar');
			    if(!self.hasstart){
                    $('.shakestart-start-btn').click();
			    }
			});
			keyboardJS.bind('shift', function(e) {
                if(self.isstop){
                    screensocket.sendData({type:"shakestartgame",stype:"gamecontinue"});
                    self.isstop = false;
                }else{
                    screensocket.sendData({type:"shakestartgame",stype:"gamepause"});
                    self.isstop = true;
                }
			});
			keyboardJS.bind('/', function(e) {
			    if(self.gamestatus == 2){
			        screensocket.sendData({type:"shakestartgame",stype:"gameend"});
			    }
			});
			keyboardJS.bind(',', function(e) {
			    layerBox.showConfirm('警告','重置会删除此游戏的用户数据和排名数据，确定重置么?',['确定','取消'],function(){
					screencore.ajaxSubmit('screen.shakestart.ajaxreset',{}).then(function(data){
    					if(data.errno==0){
    					    //发送消息给微信端
    					    screensocket.sendData({type:"shakestartgame",stype:"gamereset"});
    					    //可以点击游戏开始了
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
        showEndUser:function(enduser,endphbnums){
            keyboardJS.bind('.', function(e) {
			    var self = this,list = enduser||self.rankTen,showphbnumber = endphbnums||self.showphbnumber;
			    screencore.gameEndphb(list,showphbnumber);
			});
			
		},
        openShakeStart:function(){
    		$(".qrcode-box").hide();
    		var countbox = $('.cutdown-start');
    		countbox.find('.cutdown-box').css({
    			"-webkit-animation":"bounceIn 1s ease .01s 1 both"
    		});
    		this.ballrender();
        },
        showNewuser:function(avatar,nickname){
            var self = this;
        	var posfrom = [
        			[800,-800,3e3],
        			[800,800,3e3],
        			[-800,800,3e3],
        			[-800,-800,3e3],
        	];
        	//var e =  nickname || '木木';
        	var l = "UserShakstart" + (new Date).getTime();
        	var r = '<div id="' + l + '" class="new-sign onCenterColumn"><img src="' + avatar + '" class="avatar"></a><p class="nickname">' + nickname + "</p></div>";
        	$(".ShakeStart").append(r);
        	$("#" + l).snabbt({
        		fromPosition: posfrom[Math.floor(Math.random()*posfrom.length)],
        		fromRotation: [0, 2 * Math.PI, 0],
        		fromScale: [2, 2],
        		posotion: [0, 0, 2e3],
        		scale: [1, 1],
        		rotation: [0, 0, 0],
        		duration: 1000,
        		easing: "easeOut",
        		complete: function() {
        			$("#" + l).snabbt({
        				position:[0,0,0],
        				rotation:[0,0,0],
        				duration: 500,
        				scale: [.25, .25],
        				easing: "easeIn",
        				delay: 200,
        				complete: function() {
        					$("#" + l).remove(),self.showUserStatus=false;
        				}
        			})
        		}
        	})
        },
        countdown:function(c,d,f) {
        	var b = setInterval(function() {
        		c = c -1;
        		if (c < 0) {
        			clearInterval(b);
        		}else if(c > 0){
        			$("#Audio_count")[0].play();
        			if (d) {
        				d(c)
        			}
        		}else {
        			if (f) {
        				f()
        			}
        		}
        	}, 1e3)
        },
        drawSine:function() {//水颜色以及波浪色
            ballctx.beginPath();
            ballctx.save();
            var Stack = []; // 记录起始点和终点坐标
            for (var i = xoffset; i<=xoffset + axisLength; i+=20/axisLength) {
                var x = sp + (xoffset + i) / unit;
                var y = Sin(x) * nowrange;
        
                var dx = i;
        
                var dy = 2*ballR*(1-nowdata) + (ballhalfr - ballR) - (unit * y);
            
                ballctx.lineTo(dx, dy);
                Stack.push([dx,dy])
            }
        
            // 获取初始点和结束点
            var startP = Stack[0]
            var endP = Stack[Stack.length - 1]
        
            ballctx.lineTo(xoffset + axisLength,oW);
            ballctx.lineTo(xoffset,oW);
            ballctx.lineTo(startP[0], startP[1])
            ballctx.fillStyle = watercolor;
            ballctx.fill()
            ballctx.restore();
        },
    
        drawText:function() {//控制水球水所占百分比
          ballctx.globalCompositeOperation = 'source-over';
          ballctx.font = 'bold ' + Textsize + 'px Microsoft Yahei';
          txt = (nowdata.toFixed(2)*100).toFixed(0) + '%';
          var fonty = ballhalfr + Textsize/2;
          var fontx = ballhalfr - Textsize * 0.8;
          ballctx.fillStyle = Textcolor;
          ballctx.fillText(txt, fontx, fonty)
        },
        drawCircle:function(){
            //alert(11);
            var self = this;
        	ballctx.clearRect(0,0,oW,oH);
        	if (arcStack.length) {
        		  var temp = arcStack.shift();
        		  ballctx.lineTo(temp[0],temp[1])
        		  ballctx.stroke();
        		  circleball = window.requestAnimationFrame(self.drawCircle.bind(this));
        	} else {
        		  circleLock = false;
        		  ballctx.lineTo(cStartPoint[0],cStartPoint[1])
        		  ballctx.stroke();
        		  arcStack = null;
        		  ballctx.globalCompositeOperation = 'destination-over';
        		  ballctx.beginPath();
        		  ballctx.lineWidth = lineWidth;
        		  ballctx.arc(ballhalfr,ballhalfr, bR, 0, 2*PI, 1);
        		  ballctx.beginPath();  
        		  ballctx.save();
        		  ballctx.arc(ballhalfr,ballhalfr, ballhalfr-16*lineWidth, 0, 2*PI, 1);
        		  ballctx.restore()
        		  ballctx.clip();
        		  ballctx.fillStyle = "transparent";
        		  window.cancelAnimationFrame(circleball);
        	}
        },
        transformObj:function(obj){
            var arr = [];
            for(var item in obj){
        	  if(obj[item].client_openid!='meepo_xinchang_shakestart'){
        			arr.push(obj[item]);
        	  }
            }
            arr = arr.sort(function(a, b){
        		return b.shakestart_count - a.shakestart_count;
        	});
            return arr;
        },
        ballrender:function(){
            var self = this;
          ballctx.clearRect(0,0,oW,oH);
          if (!circleLock) {
            if (waterdata >= 0.85) {
              if (nowrange > range/4) {
                var t = range * 0.01;
                nowrange -= t;   
              }
            } else if (waterdata <= 0.1) {
              if (nowrange < range*1.5) {
                var t = range * 0.01;
                nowrange += t;   
              }
            } else {
              if (nowrange <= range) {
                var t = range * 0.01;
                nowrange += t;   
              }
        
              if (nowrange >= range) {
                var t = range * 0.01;
                nowrange -= t;
              }
            }
            if((waterdata - nowdata) > 0) {
              nowdata += waveupsp;      
            }
            if((waterdata - nowdata) < 0){
              nowdata -= waveupsp
            }
            sp += 0.07; 
            self.drawSine();
            self.drawText();
          }
          if(nowdata>=1){
            self.stageStop = true;
            setTimeout(function(){
                $('.lottery3d-stage').empty();
            },500);
            window.cancelAnimationFrame(stopball);
			$(".ShakeStart .new-sign").remove();
			if(!self.sendgameend){
			    self.sendgameend = true;
			    screensocket.sendData({type:"shakestartgame",stype:"gameend"});
			}
          }else{
        	stopball = window.requestAnimationFrame(self.ballrender.bind(this))
          }
        },
        total:36,
        stageStop:false,
        speed:500,
        cards:[],
        stageInit: function() {
    		var v = this;
    		var b = window,a = document;
    		var zoom = (b.innerHeight / 800).toFixed(4);
    		v.camera = new THREE.PerspectiveCamera(40, b.innerWidth/zoom / 800, 1000, 10000);
    		v.camera.position.z = 20000;
    		v.scene = new THREE.Scene();
    		var k = a.createElement("img");
    		k.className = "headImg";
    		var s;
    		var h = Math.sqrt(v.total),
    		u = Math.floor(h / 2);
    		for (var p = 0; p < v.total; p++) {
    			var x = Math.floor(p / h) % h;
    			var j = (p % h);
    			if (x == u && j == u) {
    				continue
    			}
    			var o = k.cloneNode();
    // 			s = v.getPlayer();
			 //   o.src = s.head_img;
			    if(v.newjoinarr.length > 0){
			        var showavatar = v.newjoinarr.shift();
                	v.oldjoinarr.push(showavatar);
                	o.src = showavatar.avatar;
			    }else if(v.oldjoinarr.length > 0){
			        var showavatar = v.oldjoinarr[Math.floor((Math.random()*v.oldjoinarr.length))];
			        o.src = showavatar.avatar;
			    }
    			var m = new THREE.CSS3DSprite(o);
    			var w = b.innerWidth/zoom  / h,
    			q = 800 / h;
    			var g = w / q;
    			var l = 300,
    			t = l * g;
    			m.position.x = (j * w - b.innerWidth/zoom  / 2 + w / 2) + (j - 2) * t;
    			m.position.y = (x * q - 800 / 2 + q / 2) * -1 - (x - 2) * l;
    			m.position.z = screencore.randomInt(20000, 40000);
    			v.scene.add(m);
    			v.cards.push(m);
    		}
    		v.renderer = new THREE.CSS3DRenderer();
    		v.renderer.setSize(b.innerWidth/zoom , 800);
    		v.renderer.domElement.style.position = "absolute";
    		a.getElementById("lottery3d-stage").appendChild(v.renderer.domElement);
    		v.animate()
    	},
    	
    	animate: function() {
    		var k = this;
    		requestAnimationFrame(function() {
    			k.animate()
    		});
    		k.speed -= 1;
    		if (k.speed < 200) {
    			k.speed = 200
    		}
    		var g = k.cards.length;
    		if (k.stageStop === false) {
    			for (var j = 0; j < g; j++) {
    				var h = k.cards[j];
    				h.position.z -= k.speed;//400-700
    				if (h.position.z < -10000) {
    				// 	var l = '1';//k.getPlayer();
    					if(k.newjoinarr.length > 0){
        			        var l = k.newjoinarr.shift();
                        	k.oldjoinarr.push(l);
        			    }else if(k.oldjoinarr.length > 0){
        			        var l = k.oldjoinarr[Math.floor((Math.random()*k.oldjoinarr.length))];
        			    }
    					if (l) {
    						h.element.src = l.avatar;
    						h.position.z = screencore.randomInt(20000, 40000);
    					}
    				}
    			}
    		}
    		k.renderer.render(k.scene, k.camera);
    	},
    };
    return screenshakestart;
});