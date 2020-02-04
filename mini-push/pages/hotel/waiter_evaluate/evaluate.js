/**
 *
 */
$(document).ready(function(docEvent){
	$('.fa').click(function(e){
		$(this).removeClass('fa-star-o').addClass('fa-star').css({color:'#eb6877'});
		$(this).prevAll('.fa').removeClass('fa-star-o').addClass('fa-star').css({color:'#eb6877'});
		$(this).nextAll('.fa').removeClass('fa-star').addClass('fa-star-o').css({color:'#333333'});
	});
	$('.tag').click(function(e){
		$('.tag').removeClass('selected');
		$(this).addClass('selected');
	});
	$('.btn-submit').click(function(e){
		var openId = $('.waiter-evaluate-info-panel .wapper').attr('open-id');
		if(typeof(openId) != 'string' || openId.trim() == ''){
			art.dialog({
				title: '提示',
				content: '服务员标识不存在',
				fixed: true,
				okValue: '关闭',
				ok: function () {
					return true;
				}
			}).lock();
			return;
		}
		var score = $('.fa-star').size();
		if(score < 1){
			art.dialog({
				title: '提示',
				content: '请为服务员打分',
				fixed: true,
				okValue: '关闭',
				ok: function () {
					return true;
				}
			}).lock();
			return;
		}
		var comment = $('.tag.selected').html();
		var comment_2 = $('textarea').val();
		alert(openId+'\n'+score+'\n'+comment+'\n'+comment_2);
		wx.miniProgram.getEnv(function(res) {
			if(res.miniprogram) {
				wx.miniProgram.navigateTo({
					url: '/pages/hotel/waiter_evaluate'
				});
			}
		});
	});
});