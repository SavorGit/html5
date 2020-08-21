/**
 *
 */
var FLUSH_TIME_INTERVAL_NORMAL = 3 * 60 * 1000,FLUSH_TIME_INTERVAL_FAST = 0.5 * 60 * 1000;
var rootFontSize = 10,pageNo = 1,totalPage = 0,autoFlushData = true,areaId = 0,flushTimeInterval = FLUSH_TIME_INTERVAL_NORMAL,pageNoFastFrom = 10;

$(document).ready(function(){
	rootFontSize = parseInt(screen.height / 76.8);
	$('html').css('font-size', rootFontSize + 'px');
	var parseParams = $.URL.parametersForGet();
	areaId = parseParams.area_id;
	if(typeof(parseParams.page_no) == 'string'){
		autoFlushData = false;
		pageNo = parseInt(parseParams.page_no);
		totalPage = 2147483647;
	}else if(typeof(parseParams.page_no) == 'number'){
		autoFlushData = false;
		pageNo = parseParams.page_no;
		totalPage = 2147483647;
	}
	if(parseParams.screen=='show'){
		alert(screen.width + 'x' + screen.height);
	}
	initPage(areaId);
	
	$(document).keydown(function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];
		//上:38 左:37 page-up:33
		if(e && e.keyCode==33 || e && e.keyCode==37 || e && e.keyCode==38){
			flushData(--pageNo,areaId);
		}
		// 下:40 右:39 page-down:34
		if(e && e.keyCode==34 || e && e.keyCode==39 || e && e.keyCode==40){//
			flushData(++pageNo,areaId);
		}
	});
});



/**
 * 初始化页面
 */
function initPage(areaId){

	$('.fa-question-circle').mouseover(function(event){
		var self = this;
		art.dialog({
			id:'fa-question-circle-art-dialog',
	    follow: self,
	    content: '在线屏：机顶盒在饭点内(11:30-14:30,18:00-21:00)，心跳次数大于5次，且平均心跳时间间隔小于10分钟<br/>网络屏：机顶盒有心跳<br/>互动饭局数：机顶盒在饭点内(11:30-14:30,18:00-21:00),有互动数据<br/><br/><br/>1.版位数：冻结状态正常,删除状态正常<br/>2.故障屏：冻结状态正常,删除状态正常,故障屏状态为是<br/>3.正常屏：冻结状态正常,删除状态正常,故障屏状态为否<br/>4.故障占比：故障屏/版位数<br/>5.午饭在线率：午饭在线屏/网络屏<br/>6.晚饭在线率：晚饭在线屏/网络屏<br/>7.日在线率：午饭+晚饭在线屏(去重)/网络屏<br/>8.饭局转化率：午饭+晚饭互动饭局数(去重)/网络屏<br/>9.扫码数：小程序二维码、大二维码（节目）、小程序呼二维码、极简版二维码、推广渠道投屏码、投屏帮助视频<br/>10.互动总数:标准版+极简版+销售端 投屏数<br/>11.标准互动数：小程序投屏日志中版本为 普通版<br/>12.极简互动数：小程序投屏日志中版本为 极简版<br/>13.销售互动数：小程序投屏日志中版本为 销售端'
		});
	}).mouseout(function(event){
		art.dialog({
			id:'fa-question-circle-art-dialog'
		}).close();
	});

	drawLineChartForLaunchCount(['7-28', '7-29', '7-30', '7-31', '8-1', '8-2', '8-3'], {"total":[820, 932, 901, 934, 1290, 1330, 1320],"sale":[420, 902, 500, 934, 1090, 330, 20],"main":[400, 30, 401, 934, 200, 1000, 1300]});
	drawPieChartForLaunchCount([{value: 77, name: '未开机'},{value: 42, name: '开机'}]);
	drawBarChartForLaunchCount(['深圳市','广州市','上海市','北京市'], [22,33,43,79]);

	flushData(pageNo,areaId);
}


/**
 * 刷新页面
 */
function flushData(pageNo,areaId){
		loadDataForLaunchCount(areaId);
		loadDataForPwerOnRate7(areaId);
		if(pageNo < 1){
			pageNo = 1;
		}else if(pageNo > totalPage){
			pageNo = 1;
		}
		if(pageNo > pageNoFastFrom){
			flushTimeInterval = FLUSH_TIME_INTERVAL_FAST;
		}else{
			flushTimeInterval = FLUSH_TIME_INTERVAL_NORMAL;
		}
		loadDataForHotelDetail(pageNo,areaId);
		if(autoFlushData === true){
			setTimeout(function(){
				++pageNo;
				flushData(pageNo,areaId);
			}, flushTimeInterval);
		}
}


/**
 * 互动次数统计
 */
function loadDataForLaunchCount(areaId){
	$.ajax({
		url:'https://mobile.littlehotspot.com/h5/rddata/interactnum',
		data:{
			area_id:areaId
		},
		dataType:'jsonp',
		success:function (data, textStatus) {
			//console.log(data, textStatus);
			$('.page-title-panel>.date').html(data.now_date);

			if(data.month_num_color==1){
				$('.count-row.month>.current').html('本月<span class="stress font-up"><div class="top-line-border"></div><div class="bottom-line-border"></div>' + data.month_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>次');
			}else if(data.month_num_color==2){
				$('.count-row.month>.current').html('本月<span class="stress font-down"><div class="top-line-border"></div><div class="bottom-line-border"></div>' + data.month_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>次');
			}else{
				$('.count-row.month>.current').html('本月<span class="stress"><div class="top-line-border"></div><div class="bottom-line-border"></div>' + data.month_num + '</span>次');
			}
			$('.count-row.month>.last>span').html(data.lastmonth_num + '次');

			if(data.week_num_color==1){
				$('.count-row.week>.current').html('本周<span class="stress font-up"><div class="top-line-border"></div><div class="bottom-line-border"></div>' + data.week_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>次');
			}else if(data.week_num_color==2){
				$('.count-row.week>.current').html('本周<span class="stress font-down"><div class="top-line-border"></div><div class="bottom-line-border"></div>' + data.week_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>次');
			}else{
				$('.count-row.week>.current').html('本周<span class="stress"><div class="top-line-border"></div><div class="bottom-line-border"></div>' + data.week_num + '</span>次');
			}
			$('.count-row.week>.last>span').html(data.lastweek_num + '次');
			var charData = {"total":[],"main":[],"sale":[]};
			if(data.time_bucket.data instanceof Array){
				charData.total = data.time_bucket.data;
			}
			if(data.time_bucket.data_user instanceof Array){
				charData.main = data.time_bucket.data_user;
			}
			if(data.time_bucket.data_sale instanceof Array){
				charData.sale = data.time_bucket.data_sale;
			}
			drawLineChartForLaunchCount(data.time_bucket.time, charData);
		},
		error:function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest, textStatus, errorThrown);
		}
	});
}


/**
 * 近7日在线率
 */
function loadDataForPwerOnRate7(areaId){
	$.ajax({
		url:'https://mobile.littlehotspot.com/h5/rddata/bootrate',
		data:{
			area_id:areaId
		},
		dataType:'jsonp',
		success:function (data, textStatus) {
			//console.log(data, textStatus);
			powerOnRatePieChartData = [];
      for(var index in data.boot.data){
      	powerOnRatePieChartData.push({value: data.boot.data[index], name: data.boot.names[index]});
      }
			drawPieChartForLaunchCount(powerOnRatePieChartData);
			drawBarChartForLaunchCount(data.area.names, data.area.data);
		},
		error:function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest, textStatus, errorThrown);
		}
	});
}


/**
 * 绘制折线图表 - 投屏次数
 */
function drawLineChartForLaunchCount(xData,yData){
	var launchCountChart = echarts.init(document.getElementById('launchCountChart'));
	var launchCountChartOption = {
		title: {
			text: '投屏次数',
			textStyle:{
				fontSize: rootFontSize,
				color:'#8792A1'
			}
		},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
          type: 'shadow'
      },
      textStyle:{
      	fontSize:rootFontSize
      },
      //formatter: '{a}<br/>{b}: {c}次'
      formatter: function (params, ticket, callback) {
		    var dateArray = params[0].name.split('-');
		    //return params[0].seriesName + '<br/>' + dateArray[0] + '月' + dateArray[1] + '日: ' + params[0].data + '次';
		    var returnString = dateArray[0] + '月' + dateArray[1] + '日<br/>';
		    for (var index in params){
		    	var param = params[index];
		    	returnString += param.marker + param.seriesName + ': ' + param.data + '次<br/>';
		    }
		    return  returnString;
			}
    },
		color: ['#01CEE7', '#d48265','#91c7ae', '#ca8622', '#c23531', '#2f4554','#749f83',  '#61a0a8', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    legend: {
    	textStyle:{
    		color: '#8792A1',
    		fontSize: 12
    	},
      data: ['所有版本', '销售版', '普通版', '直接访问', '搜索引擎']
    },
		grid:{
			top:rootFontSize * 2.5,
			left:rootFontSize * 5,
			right:rootFontSize * 1,
			bottom:rootFontSize * 3
		},
		xAxis: {
			type: 'category',
			axisLine:{
				lineStyle:{
					color:'#8792A1'
				}
			},
			axisLabel:{
				fontSize:rootFontSize * 0.9,
				interval:0,
				rotate:45,
				formatter: function (value, index) {
			    return value.replace(/-/,"/");
				}
			},
			splitLine: {
				show:false,
				lineStyle: {
					color: ['#CCCCCC']
				}
			},
			data:xData
		},
		yAxis: {
			type: 'value',
			axisLine:{
				lineStyle:{
					color:'#8792A1'
				}
			},
			axisLabel:{
				fontSize:rootFontSize * 0.8
			},
			splitLine: {
				show:true,
				lineStyle: {
					color: ['#163767']
				}
			},
			nameRotate:15,
		},
		series: [{
			type: 'line',
			name: '所有版本',
			data: yData.total
		},{
			type: 'line',
			name: '销售版',
			data: yData.sale
		},{
			type: 'line',
			name: '普通版',
			data: yData.main
		}]
	};
	launchCountChart.setOption(launchCountChartOption);
}


/**
 * 绘制饼图表 - 7日在线
 */
function drawPieChartForLaunchCount(data){
	var powerOnRatePieChart = echarts.init(document.getElementById('powerOnRatePieChart'));
	var powerOnRatePieChartOption = {
		color: ['#1890FF','#FACC14','#61a0a8','#d48265','#91c7ae','#749f83','#ca8622','#bda29a','#6e7074','#546570','#c4ccd3'],
    tooltip: {
        trigger: 'item',
        textStyle:{
        	fontSize: rootFontSize
        },
        formatter: '{a}{b}: {c} ({d}%)'
    },
    series:[{
      name: '7日',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label:{
      	show:true,
      	fontSize: rootFontSize * 1.2,
				formatter: '{b}\n{c} ({d}%)'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: rootFontSize * 1.2,
          fontWeight: 'bold'
        }
      },
      data:data,
    }]
	};
	powerOnRatePieChart.setOption(powerOnRatePieChartOption);
}


/**
 * 绘制柱图表 - 7日在线
 */
function drawBarChartForLaunchCount(xData,yData){
	var powerOnRateBarChart = echarts.init(document.getElementById('powerOnRateBarChart'));
	var powerOnRateBarChartOption = {
    title: {
      text: '分城市统计',
			textStyle:{
				fontSize: rootFontSize,
				color:'#8792A1'
			}
    },
		color: ['#02CDE6','#FACC14','#61a0a8','#d48265','#91c7ae','#749f83','#ca8622','#bda29a','#6e7074','#546570','#c4ccd3'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        textStyle:{
        	fontSize:rootFontSize
        },
        formatter: '{a}<br/>{b}: {c}%'
    },
    grid: {
			top:rootFontSize * 2,
			left:rootFontSize * 5,
			right:rootFontSize * 1,
			bottom:rootFontSize * 3
    },
    xAxis: {
      type: 'value',
			axisLine:{
				lineStyle:{
					color:'#8792A1'
				}
			},
			axisLabel:{
				show:true,
				fontSize:rootFontSize * 0.8
			},
			splitLine: {
				show:false,
				lineStyle: {
					color: ['#CCCCCC']
				}
			},
			boundaryGap: [0, 0.01]
    },
    yAxis: {
    	type: 'category',
			axisLine:{
				lineStyle:{
					color:'#8792A1'
				}
			},
			axisLabel:{
				fontSize: rootFontSize * 0.8
			},
			splitLine: {
				show:false,
				lineStyle: {
					color: ['#163767']
				}
			},
			data:xData
    },
    series: [{
      name: '城市占比',
      type: 'bar',
      label:{
      	show:true,
      	color:'#FFFFFF',
      	fontSize: rootFontSize,
				formatter: '{c}%'
      },
      data:yData
    }]
	};
	powerOnRateBarChart.setOption(powerOnRateBarChartOption);
}



/**
 * 酒楼详细数据
 */
function loadDataForHotelDetail(pageNo,areaId){
	$.ajax({
		url:'https://mobile.littlehotspot.com/h5/rddata/hotel',
		data:{
			area_id:areaId,
			page:pageNo
		},
		dataType:'jsonp',
		success:function (data, textStatus) {
			//console.log(data, textStatus);
			totalPage = data.total_page;
			$('.table-body').empty();
			for(var itemIndex in data.datalist){
				var item = data.datalist[itemIndex];
				var itemHtml = '<div class="item"><div class="table-cell first"><div class="name" title="' + item.hotel_name + '">' + ((parseInt(pageNo) - 1) * 10 + parseInt(itemIndex) + 1) + '.' + item.hotel_name + '</div><div class=""><span>' + item.area_name + '</span><span name="level" style="margin-left:15px;">级别:<span title="酒楼级别：' + item.hotel_level + '级">';
				if(typeof(item.hotel_level) == 'number'){
					for(var starIndex = 0;starIndex < item.hotel_level;starIndex++){
						itemHtml += '<i class="fa fa-star" aria-hidden="true"></i>';
					}
				}
				itemHtml += '</span></span></div><div class="">维护人:';
				if(typeof(item.maintainer) != 'string'){
					itemHtml += '<span class="font-no-value" title="渠道维护人：————">————</span>、';
				}else if(item.maintainer.trim() == ''){
					itemHtml += '<span class="font-no-value" title="渠道维护人：————">————</span>、';
				}else{
					itemHtml += '<span title="渠道维护人：' + item.maintainer + '">' + item.maintainer + '</span>、';
				}
				if(typeof(item.tech_maintainer) != 'string'){
					itemHtml += '<span class="font-no-value" title="运维人：————">————</span>、';
				}else if(item.tech_maintainer.trim() == ''){
					itemHtml += '<span class="font-no-value" title="运维人：————">————</span>、';
				}else{
					itemHtml += '<span title="运维人：' + item.tech_maintainer + '">' + item.tech_maintainer + '</span>、';
				}
				if(typeof(item.trainer) != 'string'){
					itemHtml += '<span class="font-no-value" title="培训人：————">————</span>';
				}else if(item.trainer.trim() == ''){
					itemHtml += '<span class="font-no-value" title="培训人：————">————</span>';
				}else{
					itemHtml += '<span title="培训人：' + item.trainer + '">' + item.trainer + '</span>';
				}
				itemHtml += '</div><div class="">最近培训时间:';
				if(typeof(item.train_date) != 'string'){
					itemHtml += '<span class="font-no-value">0000-00-00</span>';
				}else if(item.train_date.trim() == ''){
					itemHtml += '<span class="font-no-value">0000-00-00</span>';
				}else{
					itemHtml += item.train_date;
				}
				itemHtml +=  '</div></div><div class="row-group"><div class="row"><div class="table-cell">昨日</div>';
				if(item.yesterday.box_num_color == 1){// 版位数
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.box_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.box_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.box_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.box_num + '</div>';
				}
				if(item.yesterday.faultbox_num_color == 1){// 故障屏
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.faultbox_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.faultbox_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.faultbox_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.faultbox_num + '</div>';
				}
				if(item.yesterday.normalbox_num_color == 1){// 正常屏
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.normalbox_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.normalbox_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.normalbox_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.normalbox_num + '</div>';
				}
				if(item.yesterday.fault_rate_color == 1){// 故障占比
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.fault_rate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.fault_rate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.fault_rate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.fault_rate + '</div>';
				}
				if(item.yesterday.lunch_rate_color == 1){// 午饭在线率
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.lunch_rate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.lunch_rate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.lunch_rate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.lunch_rate + '</div>';
				}
				if(item.yesterday.dinner_rate_color == 1){// 晚饭在线率
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.dinner_rate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.dinner_rate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.dinner_rate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.dinner_rate + '</div>';
				}
				if(item.yesterday.zxrate_color == 1){// 平均在线率
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.zxrate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.zxrate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.zxrate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.zxrate + '</div>';
				}
				if(item.yesterday.fjrate_color == 1){// 饭局转化比
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.fjrate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.fjrate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.fjrate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.fjrate + '</div>';
				}
				if(item.yesterday.scancode_num_color == 1){// 扫码数
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.scancode_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.scancode_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.scancode_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.scancode_num + '</div>';
				}
				if(item.yesterday.interact_num_color == 1){// 互动总数
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.interact_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.interact_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.interact_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.interact_num + '</div>';
				}
				if(item.yesterday.interact_standard_num_color == 1){// 标准互动数
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.interact_standard_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.interact_standard_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.interact_standard_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.interact_standard_num + '</div>';
				}
				if(item.yesterday.interact_mini_num_color == 1){// 极简互动数
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.interact_mini_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.interact_mini_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.interact_mini_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.interact_mini_num + '</div>';
				}
				if(item.yesterday.interact_sale_num_color == 1){// 销售互动数
					itemHtml += '<div class="table-cell font-up">' + item.yesterday.interact_sale_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.yesterday.interact_sale_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.yesterday.interact_sale_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.yesterday.interact_sale_num + '</div>';
				}
				// 上周
				itemHtml += '</div><div class="row"><div class="table-cell">上周</div>';
				if(item.last_week.box_num_color == 1){// 版位数
					itemHtml += '<div class="table-cell font-up">' + item.last_week.box_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.box_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.box_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.box_num + '</div>';
				}
				if(item.last_week.faultbox_num_color == 1){// 故障屏
					itemHtml += '<div class="table-cell font-up">' + item.last_week.faultbox_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.faultbox_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.faultbox_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.faultbox_num + '</div>';
				}
				if(item.last_week.normalbox_num_color == 1){// 正常屏
					itemHtml += '<div class="table-cell font-up">' + item.last_week.normalbox_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.normalbox_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.normalbox_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.normalbox_num + '</div>';
				}
				if(item.last_week.fault_rate_color == 1){// 故障占比
					itemHtml += '<div class="table-cell font-up">' + item.last_week.fault_rate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.fault_rate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.fault_rate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.fault_rate + '</div>';
				}
				if(item.last_week.lunch_rate_color == 1){// 午饭在线率
					itemHtml += '<div class="table-cell font-up">' + item.last_week.lunch_rate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.lunch_rate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.lunch_rate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.lunch_rate + '</div>';
				}
				if(item.last_week.dinner_rate_color == 1){// 晚饭在线率
					itemHtml += '<div class="table-cell font-up">' + item.last_week.dinner_rate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.dinner_rate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.dinner_rate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.dinner_rate + '</div>';
				}
				if(item.last_week.zxrate_color == 1){// 平均在线率
					itemHtml += '<div class="table-cell font-up">' + item.last_week.zxrate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.zxrate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.zxrate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.zxrate + '</div>';
				}
				if(item.last_week.fjrate_color == 1){// 饭局转化比
					itemHtml += '<div class="table-cell font-up">' + item.last_week.fjrate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.fjrate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.fjrate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.fjrate + '</div>';
				}
				if(item.last_week.scancode_num_color == 1){// 扫码数
					itemHtml += '<div class="table-cell font-up">' + item.last_week.scancode_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.scancode_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.scancode_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.scancode_num + '</div>';
				}
				if(item.last_week.interact_num_color == 1){// 互动总数
					itemHtml += '<div class="table-cell font-up">' + item.last_week.interact_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.interact_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.interact_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.interact_num + '</div>';
				}
				if(item.last_week.interact_standard_num_color == 1){// 标准互动数
					itemHtml += '<div class="table-cell font-up">' + item.last_week.interact_standard_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.interact_standard_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.interact_standard_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.interact_standard_num + '</div>';
				}
				if(item.last_week.interact_mini_num_color == 1){// 极简互动数
					itemHtml += '<div class="table-cell font-up">' + item.last_week.interact_mini_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.interact_mini_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.interact_mini_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.interact_mini_num + '</div>';
				}
				if(item.last_week.interact_sale_num_color == 1){// 销售互动数
					itemHtml += '<div class="table-cell font-up">' + item.last_week.interact_sale_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_week.interact_sale_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_week.interact_sale_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_week.interact_sale_num + '</div>';
				}
				// 上月
				itemHtml += '</div><div class="row"><div class="table-cell">上月</div>';
				if(item.last_month.box_num_color == 1){// 版位数
					itemHtml += '<div class="table-cell font-up">' + item.last_month.box_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.box_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.box_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.box_num + '</div>';
				}
				if(item.last_month.faultbox_num_color == 1){// 故障屏
					itemHtml += '<div class="table-cell font-up">' + item.last_month.faultbox_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.faultbox_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.faultbox_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.faultbox_num + '</div>';
				}
				if(item.last_month.normalbox_num_color == 1){// 正常屏
					itemHtml += '<div class="table-cell font-up">' + item.last_month.normalbox_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.normalbox_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.normalbox_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.normalbox_num + '</div>';
				}
				if(item.last_month.fault_rate_color == 1){// 故障占比
					itemHtml += '<div class="table-cell font-up">' + item.last_month.fault_rate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.fault_rate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.fault_rate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.fault_rate + '</div>';
				}
				if(item.last_month.lunch_rate_color == 1){// 午饭在线率
					itemHtml += '<div class="table-cell font-up">' + item.last_month.lunch_rate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.lunch_rate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.lunch_rate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.lunch_rate + '</div>';
				}
				if(item.last_month.dinner_rate_color == 1){// 晚饭在线率
					itemHtml += '<div class="table-cell font-up">' + item.last_month.dinner_rate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.dinner_rate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.dinner_rate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.dinner_rate + '</div>';
				}
				if(item.last_month.zxrate_color == 1){// 平均在线率
					itemHtml += '<div class="table-cell font-up">' + item.last_month.zxrate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.zxrate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.zxrate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.zxrate + '</div>';
				}
				if(item.last_month.fjrate_color == 1){// 饭局转化比
					itemHtml += '<div class="table-cell font-up">' + item.last_month.fjrate + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.fjrate_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.fjrate + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.fjrate + '</div>';
				}
				if(item.last_month.scancode_num_color == 1){// 扫码数
					itemHtml += '<div class="table-cell font-up">' + item.last_month.scancode_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.scancode_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.scancode_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.scancode_num + '</div>';
				}
				if(item.last_month.interact_num_color == 1){// 互动总数
					itemHtml += '<div class="table-cell font-up">' + item.last_month.interact_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.interact_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.interact_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.interact_num + '</div>';
				}
				if(item.last_month.interact_standard_num_color == 1){// 标准互动数
					itemHtml += '<div class="table-cell font-up">' + item.last_month.interact_standard_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.interact_standard_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.interact_standard_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.interact_standard_num + '</div>';
				}
				if(item.last_month.interact_mini_num_color == 1){// 极简互动数
					itemHtml += '<div class="table-cell font-up">' + item.last_month.interact_mini_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.interact_mini_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.interact_mini_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.interact_mini_num + '</div>';
				}
				if(item.last_month.interact_sale_num_color == 1){// 销售互动数
					itemHtml += '<div class="table-cell font-up">' + item.last_month.interact_sale_num + '<i class="fa fa-long-arrow-up" aria-hidden="true"></i></div>';
				}else if(item.last_month.interact_sale_num_color == 2){
					itemHtml += '<div class="table-cell font-down">' + item.last_month.interact_sale_num + '<i class="fa fa-long-arrow-down" aria-hidden="true"></i></div>';
				}else{
					itemHtml += '<div class="table-cell">' + item.last_month.interact_sale_num + '</div>';
				}
				itemHtml += '</div></div>';
				$('.table-body').append(itemHtml);
			}
		},
		error:function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest, textStatus, errorThrown);
		}
	});
}
