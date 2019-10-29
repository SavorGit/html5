var tmr_cutdown_start;
var $PlayeSeed;
$PlayeSeed = $('<div class="player"><div class="head"></div><div class="nickname"></div></div>').css({
        width: $(".pashuMain").height() / 10 - 10 * 2,
        height: $(".pashuMain").height() / 10 - 10 * 2
 });
function showGameResult() {
    var b = $(".result-layer").show();
    var d = $(".result-label", b).show().addClass("pulse");
    var a = $(".result-cup", b).hide();
    var c = pnum;
    $(".button.allresult", a).show();
    $(".button.nexttound").show();
    document.getElementById("Audio_Gameover").play();
    window.setTimeout(function() {
        d.fadeOut(function() {
            a.show(function() {
                if (c >= 1 && rankTopTen[0]) {
                    window.setTimeout(function() {
                        var e = $PlayeSeed.clone().addClass("result").css({
                            left: "50%",
                            "margin-left": "-65px",
                            width: "160px",
                            height: "160px",
                            bottom: "150px"
                        });
                        e.find(".head").css({
                            "background-image": "url(" + rankTopTen[0]["client_avatar"] + ")"
                        }).addClass("shake");
                        e.find(".nickname").html(rankTopTen[0]["client_name"]);
                        e.appendTo(a).addClass("bounce")
                    },
                    800)
                }
                if (c >= 2 && rankTopTen[1]) {
                    window.setTimeout(function() {
                        var e = $PlayeSeed.clone().addClass("result").css({
                            left: "40px",
                            width: "100px",
                            height: "100px",
                            bottom: "120px"
                        });
                        e.find(".head").css({
                            "background-image": "url(" + rankTopTen[1]["client_avatar"] + ")"
                        }).addClass("shake");
                        e.find(".nickname").html(rankTopTen[1]["client_name"]);
                        e.appendTo(a).addClass("bounce")
                    },
                    1800)
                }
                if (c >= 3 && rankTopTen[2]) {
                    window.setTimeout(function() {
                        var e = $PlayeSeed.clone().addClass("result").css({
                            right: "30px",
                            width: "70px",
                            height: "70px",
                            bottom: "100px"
                        });
                        e.find(".head").css({
                            "background-image": "url(" + rankTopTen[2]["client_avatar"] + ")"
                        }).addClass("shake");
                        e.find(".nickname").html(rankTopTen[2]["client_name"]);
                        e.appendTo(a).addClass("bounce")
                    },
                    2800)
                }
            })
        }).removeClass("pulse")
    },
    1000)
}
var resizePart = window.WBActivity.resize = function() {
};
function showScore(b) {
    var a = PATH_ACTIVITY + Path_url('mshake_result')+"&rid=" + scene_id;
    if (b != undefined) {
        a += "&rotate_id=" + b
    }
    $.showPage(a)
}
var start = window.WBActivity.start = function() {
    window.WBActivity.hideLoading();
	bingkjj();
    $(".Panel.Top").css({
        top: 0
    });
    $(".Panel.Bottom").css({
        bottom: 0
    });
    $(".pashuMain").css({
        opacity: 1
    });
	if(CURR_ROUND_ID==0){
         $(".pashuMain,.round-welcome").hide();
		 $(".btn-endgame").hide();
         showScore();
         $(".frame-dialog .closebutton").hide()
	}else{
		$(".round-welcome").slideDown().find(".round-label").html("ROUND "+now_round);	
		if(RoundStatus==2){
				layer.alert('当前轮次正处进行中，用户无法参与，需要重置当前轮次！', {
					closeBtn:0,
					shade :0.6,
					move:false,
					title: ['温馨提示','font-size:18px'],
				}, function(){
					$.getJSON(PATH_ACTIVITY + Path_url('mshake_status'), {
						rid: scene_id,
						rotate_id: CURR_ROUND_ID,
						type: "reset"
					},
					function(c) {
					 if(c.errno==0){
						msg_control.ws.send('{"type":"mshake","ttype":"mshake_reset","openid":"meepo_xinchang_mshake"}');
						layer.msg('重置成功',{time:2000});
						window.location.reload();
					 }else{
						layer.msg("重置失败啦");
						window.location.reload()
					 }
					})
				});
		}
	}
    $(".round-welcome .button-start").on("click", function() {
        $(".round-welcome").slideUp(function() {
				cutdown_start();
        })
    });
	$(".button.allresult").on("click", 
    function() {
		$(".result-layer").hide()
		showScore(CURR_ROUND_ID);
    });
    $(".button.nexttound").on("click", function() {
		msg_control.ws.send('{"type":"mshake","ttype":"fast_end","openid":"meepo_xinchang_mshake"}');
        window.location.reload();
    });
	 $(".btn-endgame").on("click", function() {
		layer.confirm('确定结束本轮游戏么？', {
		  btn: ['确定','取消'],
		  closeBtn:0,
		  shade :0.6,
		  move:false
		}, function(){
				layer.closeAll();
				msg_control.ws.send('{"type":"mshake","ttype":"fast_end","openid":"meepo_xinchang_mshake"}');
				$.getJSON(PATH_ACTIVITY + Path_url('mshake_nowstop'), {rid: scene_id,rotate_id: CURR_ROUND_ID,
				},function(c) { 
					if(c.errno==0){
						window.location.reload()
					}else{
						layer.msg("操作失败、请重试!");
						window.location.reload()	
					}
				})
		}, function(){
				layer.closeAll();
		});
	});
    $(".button.reset").on("click", function() {
		layer.confirm('重玩本轮会导致本轮成绩作废并清空，您确定吗？', {
		  btn: ['确定','取消'],
		  closeBtn:0,
		  shade :0.6,
		  move:false
		}, function(){
			 layer.closeAll();
			 $.getJSON(PATH_ACTIVITY + Path_url('mshake_status'), {
                rid: scene_id,
                rotate_id: CURR_ROUND_ID,
                type: "reset"
            },
            function(c) {
			 if(c.errno==0){
				msg_control.ws.send('{"type":"mshake","ttype":"mshake_reset","openid":"meepo_xinchang_mshake"}');
				window.location.reload();
			 }else{
				layer.msg("重置失败啦");
                window.location.reload()
			 }
            })
		}, function(){
		  layer.closeAll();
		});
    })
};
var cutdown_start = function() {
    var a = $(".cutdown-start");
    var b = ready_time * 1 + 1;;
    a.html("").show().css({
        "margin-left": -a.width() / 2 + "px",
        "margin-top": -a.height() / 2 + "px",
        "font-size": a.height() * 0.7 + "px",
        "line-height": a.height() + "px"
    }).addClass("cutdownan-imation");
	msg_control.ws.send('{"type":"mshake","ttype":"mshake_start","openid":"meepo_xinchang_mshake"}');
    tmr_cutdown_start = window.setInterval(function() {
        b--;
        if (b == 0) {
			a.html("GO!")
            $.getJSON(PATH_ACTIVITY + Path_url('mshake_status'), {
                rid: scene_id,
                rotate_id: CURR_ROUND_ID,
                type: "start"
            },
            function(c) {
                if (c.errno == 0) {
					$('.pashuMain .houzi_user').removeClass('houzi_user');
                     a.hide();
                }else if(c.errno==-2){
					a.hide();
					layer.msg("当前轮数无人参与、无法开始!");
					window.location.reload()
				} else {
					a.hide();
                    layer.msg("游戏初始参数错误，请刷新重新开始");
                    window.location.reload()
                }
            }).fail(function() {
				a.hide();
                layer.msg("无法连接游戏服务器，请刷新重新开始");
                window.location.reload()
            })
        } else {
            if (b < 0) {
                window.clearInterval(tmr_cutdown_start);
				clearInterval(get_man);
                hideSlogan();
				window.pc_data_time = setInterval(function(){
					msg_control.ws.send('{"type":"mshake","ttype":"mshake_data","openid":"meepo_xinchang_mshake"}');
				},1000);
            } else {
                document.getElementById("Audio_CutdownPlayer").play();
                a.html(b)
            }
        }
    },
    1000)
};
function hideSlogan() {
    $(".Panel.Top").css({
        top: "-" + $(".Panel.Top").height() + "px"
    });
    $(".Panel.Bottom").css({
        bottom: "-" + $(".Panel.Bottom").height() + "px"
    });
	$("#panel_status").val("0");
}
function showSlogan() {
    $(".Panel.Top").css({
        top: 0
    });
    $(".Panel.Bottom").css({
        bottom: 0
    })
   $("#panel_status").val("1");
};