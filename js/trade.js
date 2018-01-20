$(function(){
   // 滑动比例
   var Scroll = {
      flag: false,
      value: 0,
      maxVal: 100,
      x: 0,
      lightFn: function(that,cv){
         var $prev = that.prev(),
            $next = that.next(),
            $list = that.closest('.scale-width').find('.scale-line>li'),
            count = 0,
            _val = Scroll.value;
         $prev.width(cv);
         that.css({'left': parseFloat(cv)});
         $next.find('span').text(_val);
         if(0 < _val){
            count = 1;
         }
         if(25 <= _val){
            count = 2;
         }
         if(50 <= _val){
            count = 3;
         }
         if(75 <= _val){
            count = 4;
         }
         if(100 <= _val){
            count = 5;
         }
         $list.each(function(){
            $(this).removeClass('active');
         });
         if(count >0){
            for(var i = 0;i<count;i++){
               $list.eq(i).addClass('active');
            }
         }
      }
   };
   var tobj = {
      basicId: (localStorage.getItem('marketId') || 'cny').toLowerCase(),
      table: $('#limit-table'),
      currencylist: [], //测试数据变量（可删）
      nickname: '',
      status: 0,
      timer: null,
      collect: [],
      targetList: ['cny','btc','eth','ans'],
      wWidth: $(window).width(),
      orderData: {data: {},that: null},
      charObj: {klineChart: null,depthChart: null},
      marketId: 'cny_btc',    //当前市场ID
      Controllers: {
         MarketController:1   //市场控制器
      },
      ReceiveCommand: {
         ChatContent: 1,//聊天内容
         SingleKLine: 1000,//单条K线数据
         BatchKLine: 1001,//批量K线数据
         BatchKLineSendComplate: 1002,//批量K线数据发送完成
         MarketDepth:1003,//市场深度数据
         TradeSimpleDto: 1004,//单条交易记录
         TradeSimpleDtoList: 1005,//交易记录列表
         ScrollDayKLine:1006,//滑动24H日线
         CreateOrder: 1008,//新增订单信息
         CreatePlanOrder: 1009,//新增计划订单信息
         UpdateOrder: 1010//更新订单信息
      },
      SendCommand: {
         ClientUserChat: 1,//发送聊天内容
         ReceiveMarketChat: 3,//接受聊天内容
         SetKLineFequency: 900,//设置当前市场K线频度
         SetReceiveOtherMarketKLine: 902,//设置接收其它市场的K线数据
         RepairKLine: 903,//修复K线数据
         SetMarketDepth: 906,//设置接收市场深度数据
         SetTradeOrder: 907,//设置接收交易订单数据
         BindMarket: 908,//绑定到指定市场
         Login: 1000//登陆验证
      },
      //target_val:{ basePrice :0,targetBalance:0},
      getParam: obj.getParam(),
      otherMarkerIds: [],//["M_2", "M_3", "M_4", "M_5", "M_6", "M_7"], // 右侧币种列表
      otherMarkerIdsZH: [],
      dict: {},
      tradeObj: {BasicBalance: 0,TargetBalance: 0},
      cancelObj: {},
      cancelAllObj: {},
      signPrice: {buy: null,sale: null},
      sign: 'M1',
      currencyObj: {target: '',base: ''},
      closePrice: 0,
      loginCookie: {key:'',id: ''},
      detailObj: {price: 0,volume: 0,limit: null},

      marketObj: {key: '5-8',list: [],clist:[],blist: [],elist: [],alist: [],collect: 0,count: 10},
      // 币种数据列表（可删）
      getCurrencyList: function(){
         var list = [],html = '';
         if(0==this.currencylist.length){
            /*obj.ajaxFn('',{
               data: {},
               callback: function(res){

               }
            });*/
            list = [
               {collect: false,type: 'NBC',newprice: 1.811,h24: 18.11,day: -2.4},{collect: true,type: 'KPC',newprice: 0.1348,h24: 22721778.11,day: 10.6913},
               {collect: false,type: 'BTC',newprice: 6148.85,h24: 395.49,day: -4.8916},{collect: true,type: 'GSS',newprice: 1.811,h24: 18.11,day: 3.5316},
               {collect: false,type: 'ANS',newprice: 1.811,h24: 18.11,day: -2.4},{collect: true,type: 'MGC',newprice: 1.811,h24: 18.11,day: 2.4},
               {collect: false,type: 'ETH',newprice: 1.811,h24: 18.11,day: -2.4},{collect: true,type: 'BKC',newprice: 1.811,h24: 18.11,day: 2.4},
               {collect: false,type: 'CFC',newprice: 1.811,h24: 18.11,day: -2.4},{collect: true,type: 'VTC',newprice: 1.811,h24: 18.11,day: 2.4},
               {collect: false,type: 'ELC',newprice: 1.811,h24: 18.11,day: -2.4},{collect: true,type: 'XYC',newprice: 1.811,h24: 18.11,day: 2.4},
               {collect: false,type: 'ATC',newprice: 1.811,h24: 18.11,day: -2.4},{collect: true,type: 'FTC',newprice: 1.811,h24: 18.11,day: 2.4},
               {collect: false,type: 'GMC',newprice: 1.811,h24: 18.11,day: -2.4}
            ];
            for(var i=0;i<list.length;i++){
               var _clz = 'class="red"',_sign = '<i class="icon icon-unstar"></i>',_day = '';
               if (list[i].day > 0){
                  _day = '+'+list[i].day;
                  _clz = 'class="green"';
               }else{
                  _clz = 'class="red"';
                  _day = list[i].day;
               }
               if(list[i].collect){
                  _sign = '<i class="icon icon-star"></i>';
               }else{
                  _sign = '<i class="icon icon-unstar"></i>';
               }

               html += '<tr '+_clz+'>\
                           <td>'+_sign+'</td>\
                           <td>'+list[i].type+'</td>\
                           <td>￥'+list[i].newprice+'</td>\
                           <td>'+list[i].h24+'</td>\
                           <td>'+_day+'%</td>\
                        </tr>';
            }
            $('#cny-table>tbody').append(html);
         }
      },
      // 聊天数据列表（可删）
      getChatList: function(list){
         var html = '';
         /*list = list || [{type: 1,name: 'user01',txt: '今天比特币又大涨'},
               {type: 2,name: 'user02',txt: '是的，不知道明天怎么样？巴拉巴拉巴拉'},
               {type: 2,name: 'user01',txt: '今天比特币又大涨'},
               {type: 1,name: 'user02',txt: 'dddawerwerwe'}
         ]*/;
         for(var i = 0;i<list.length;i++){
            var sel = 'class="other"';
            if(1==list[i].type){
               sel = 'class="other"';
            }else{
               sel = 'class="me"';
               //html += '<li '+sel+'><span>'+list[i].txt+'</span></li>';
            }
            html += '<li '+sel+'><label>'+list[i].name+'</label><span>'+list[i].txt+'</span></li>';
         }
         $('.chat-list').append(html);
         /*if(list.length > 1){
            $('.chat-list>li').each(function(){
               $(this).height($(this).find('span').innerHeight());
            });
         }else if(list.length == 1){
            var $li = $('.chat-list>li').eq($('.chat-list>li').length-1);
            $li.height($li.find('span').innerHeight());
         }*/
      },
      // 获取公告
      getMarketNotice: function(){
         obj.ajaxFn('/news/GetMarketNotice',{
            data: {marketId: tobj.marketId,page: 1,pageSize: 10},
            callback: function(res){
               var list = [],timer=null;
               function notice(list){
                  var html = '';
                  for(var i = 0;i<list.length;i++){
                     html += '<li><a href="./news-detail.html?id='+list[i].Id+'" target="_blank">'+list[i].Intro+'</a></li>';
                  }
                  $('.notice-list').html(html);
                  if(1<list.length){
                     for(var j=0;j<list.length;j++){
                        (function(index){
                           setTimeout(function(){
                              $('.notice-list').css('transform','translateY('+-(index*25)+'px)');
                           },1000*index);
                           if(index==list.length-1){timerFn();}
                           else if(index <list.length){clearInterval(timer);}
                        })(j);
                     }
                  }
               }
               function timerFn(){
                  timer = setInterval(function(){
                     notice(list);
                  },1000*10);
               }
               if(res.IsSuccess){
                  list = res.Data.Items;
                  /*list = [{Intro: '公告1'},{Intro: '公告2'},{Intro: '公告3'},{Intro: '公告4'},{Intro: '公告5'},
                  {Intro: '公告6'},{Intro: '公告7'},{Intro: '公告7'},{Intro: '公告8'},{Intro: '公告9'},{Intro: '公告10'},{Intro: '公告11'}];*/
                  notice(list);
               }
            }
         });
      },
      // 新闻列表
      getNewsList: function(list){
         var html = '';
         /*list = list || [
            {pic: './imgs/user02.jpg',title: '19800网“新年新惊喜”每日大转盘抽奖19800网“新年新惊喜”每日大转盘抽奖',content: '为答谢新老用户对我们的支持与厚爱，藉新春佳节来为答谢新老用户对我们的支持与厚爱，藉新春佳节来',date: '2017-01-10'},
            {pic: './imgs/user02.jpg',title: '19800网“新年新惊喜”每',content: '为答谢新老用户对我们的支持与厚爱，藉新',date: '2017-01-10'}
         ];*/
         obj.ajaxFn('/news/GetMarketNews',{
            data: {marketId: tobj.marketId,page: 1,pageSize: 10},
            callback: function(res){
               var msg = '',list = [],html = '';
               if(res.IsSuccess){
                  list = res.Data.Items;
                  for(var i =0;i<list.length;i++){
                     var _t1 = list[i].Title,_t2 = '',_c1 = list[i].Intro,_c2 = '',
                        time = list[i].PublishTime;
                     time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                     var date = new Date(time);
                     if(30<tobj.getBLen(_t1)){
                        _t2 = _t1.substr(0,30/1.8)+'...';
                     }else{
                        _t2 = _t1;
                     }
                     if(40<tobj.getBLen(_c1)){
                        _c2 = _c1.substr(0,40/1.8)+'...';
                     }else{
                        _c2 = _c1;
                     }
                     html += '<li>\
                        <img src="./imgs/user02.jpg" alt="pic" />\
                        <p>\
                           <span title="'+_t1+'">'+_t2+'</span>\
                           <a href="./news-detail.html?id='+list[i].Id+'">'+_c2+'</a>\
                           <label>'+date.format("yyyy-MM-dd")+'</label>\
                        </p>\
                     </li>';
                  }
               }else{
                  msg = res.ErrorMsg+'，'+$.t("operate_fail");
               }
               $('.news-list').html(html);
            }
         });
      },
      // 获取等比宽
      getWidth: function(title){
         sel = tobj.table;
         title = title || $('.order-title.on');

         setTimeout(function(){
            $('.tables-box,.tables-box .jspContainer,.tables-box .jspPane').css('width',$('.order-tables').width());
            var $td = sel.find('tbody>tr').eq(0).find('td'),
               $li = title.eq(0).find('li');

            for(var i = 0;i<$td.length;i++){
               ~(function(index){
                  var _li = $li.eq(index),
                     _w = $td.eq(index).width();
                  _li.width(_w);
               })(i);
            }
            $('.tables-box').jScrollPane({stickToBottom: true,mouseWheelSpeed: 50});
         },300);
      },
      // 获取滚动条
      scrolls: function(){
         $('.table-box').jScrollPane({stickToBottom: true,mouseWheelSpeed: 50});
         
         $('.chat-body').jScrollPane({stickToBottom: true,mouseWheelSpeed: 50});
         if($('.chat-list').innerHeight()>=$('.chat-body').innerHeight()){
            $('.chat-body .jspPane').css('top',-($('.chat-list').innerHeight()-$('.chat-body').innerHeight()));
            $('.chat-body .jspDrag').css('top',$('.chat-body .jspTrack').innerHeight()-$('.chat-body .jspDrag').innerHeight());
         }

         //$('.tables-box').jScrollPane({stickToBottom: true,mouseWheelSpeed: 50});
      },
      // 获取混合字符串长度
      getBLen: function(str) {
         if (str == null) return 0;
         if (typeof str != "string"){
            str += "";
         }
         return str.replace(/[^\x00-\xff]/g,"01").length;
      },
      // 获取个人信息
      getUserInfo: function(){
         obj.ajaxFn('/user/GetLoginInfo',{
            callback: function(res){
               var data = res.Data;
               tobj.nickname = (data&&data.NickName)?data.NickName:$.t('anonymity');
            },
            errorCallback: function(res){
               tobj.nickname = $.t('anonymity');
            }
         });
      },
      // 获取用户登陆密钥
      getLoginCookie: function(){
         obj.ajaxFn('/user/GetLoginCookie',{
            callback: function(res){
               if(res.IsSuccess){
                  tobj.loginCookie.id = res.Data.UserId;
                  tobj.loginCookie.key= res.Data.SecretKey;
               }
            }
         });
      },
      // 图表1
      drawingKLine: function(frequency) {
         var data = tobj.dict[frequency];
         // 基于准备好的dom，初始化echarts实例
         if (!tobj.charObj.klineChart){
            tobj.charObj.klineChart = echarts.init(document.getElementById('chart'));
         }
         var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000'
                }
            },
            legend: {
                data: ['K', 'MA5', 'MA10', 'MA20', 'MA30']
            },
            grid: [{
                left: '7%',
                right: '7%',
                top: '7%',
                height: '58%'
            },
            {
                left: '7%',
                right: '7%',
                top: '71%',
                height: '22%'
            }],
            xAxis: [{
                type: 'category',
                data: data.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                }
            }, {
                type: 'category',
                gridIndex: 1,
                data: data.categoryData,
                axisLabel: { show: false }
            }],
            yAxis: [{
                name: '价格',
                nameLocation: 'middle',
                nameGap: '50',
                scale: true,
                splitArea: {
                    show: true
                }
            }, {
                name: '成交量',
                nameLocation: 'middle',
                nameGap: '50',
                scale: true,
                splitArea: {
                    show: true
                }
            }, {
                name: 'MACD',
                nameLocation: 'middle',
                nameGap: '50',
                gridIndex: 1,
                splitNumber: 4,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: true }
            }],
            dataZoom: [
                {
                    show: false,
                    xAxisIndex: [0, 0],
                    type: 'inside',
                    showDetail: false,
                    start: 60,
                    end: 100
                },
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    height: '5%',
                    top: '95%',
                    left: '5%',
                    right: '4%',
                    showDetail: false,
                    start: 60,
                    end: 100,
                    dataBackground: {
                        areaStyle: {
                            color: '#e95500'
                        },
                        lineStyle: {
                            opacity: 0.8,
                            color: '#7093DB'
                        }
                    }
                }],
            series: [
                {
                    name: 'K线数据',
                    type: 'candlestick',
                    data: data.values,
                    animation: false,
                    itemStyle: {
                        normal: {
                            color: '#ef232a',
                            color0: '#14b143',
                            borderColor: '#ef232a',
                            borderColor0: '#14b143'
                        }
                    },
                    markPoint: {
                        animation: false,
                        label: {
                            normal: {
                                formatter: function (param) {
                                    return param != null ? Math.round(param.value) : '';
                                }
                            }
                        },
                        data: [
                            {
                                name: 'highest value',
                                type: 'max',
                                valueDim: 'highest'
                            },
                            {
                                name: 'lowest value',
                                type: 'min',
                                valueDim: 'lowest'
                            },
                            {
                                name: 'average value',
                                type: 'average',
                                valueDim: 'close'
                            }
                        ]
                    },
                    markLine: {
                        symbol: ['nlittleEndian', 'none'],
                        animation: false,
                        data: [
                            [
                                {
                                    type: 'min',
                                    valueDim: 'lowest',
                                    symbol: 'circle',
                                    symbolSize: 10,
                                    label: {
                                        normal: { show: false },
                                        emphasis: { show: false }
                                    }
                                },
                                {
                                    type: 'max',
                                    valueDim: 'highest',
                                    symbol: 'circle',
                                    symbolSize: 10,
                                    label: {
                                        normal: { show: false },
                                        emphasis: { show: false }
                                    }
                                }
                            ],
                            {
                                name: 'min line on close',
                                type: 'min',
                                valueDim: 'close'
                            },
                            {
                                name: 'max line on close',
                                type: 'max',
                                valueDim: 'close'
                            }
                        ]
                    }
                },
                {
                    name: 'MA5',
                    type: 'line',
                    animation: false,
                    data: tobj.calculateMA(5, data),
                    smooth: true,
                    lineStyle: {
                        normal: { opacity: 0.5 }
                    }
                },
                {
                    name: 'MA10',
                    type: 'line',
                    animation: false,
                    data: tobj.calculateMA(10, data),
                    smooth: true,
                    lineStyle: {
                        normal: { opacity: 0.5 }
                    }
                },
                {
                    name: 'MA20',
                    type: 'line',
                    animation: false,
                    data: tobj.calculateMA(20, data),
                    smooth: true,
                    lineStyle: {
                        normal: { opacity: 0.5 }
                    }
                },
                {
                    name: 'MA30',
                    type: 'line',
                    animation: false,
                    data: tobj.calculateMA(30, data),
                    smooth: true,
                    lineStyle: {
                        normal: { opacity: 0.5 }
                    }
                },
                {
                    name: '成交量',
                    type: 'bar',
                    yAxisIndex: [1],
                    animation: false,
                    smooth: true,
                    data: data.volumns,
                    itemStyle: {
                        normal: {
                            color: '#b5c8c9',
                            color0: '#b5c8c9'
                        }
                    }
                }, {
                    name: 'MACD',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 2,
                    data: data.Macds,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList;
                                if (params.data >= 0) {
                                    colorList = '#ef232a';
                                } else {
                                    colorList = '#14b143';
                                }
                                return colorList;
                            },
                        }
                    }
                }, {
                    name: 'DIF',
                    type: 'line',
                    xAxisIndex: 1,
                    yAxisIndex: 2,
                    data: data.Diffs,
                    itemStyle: {
                        normal: {
                            color: '#094786'
                        }
                    }
                }, {
                    name: 'DEA',
                    type: 'line',
                    xAxisIndex: 1,
                    yAxisIndex: 2,
                    data: data.Deas,
                    itemStyle: {
                        normal: {
                            color: '#c79be8'
                        }
                    }
                }
            ]
         };
         // 使用刚指定的配置项和数据显示图表。
         tobj.charObj.klineChart.setOption(option, true);
         $(window).resize(function(){
            tobj.charObj.klineChart.resize();
         });
      },
      // 图表2
      drawingAskBidChart: function(data) {
         var priceList = [];
         var bidCountList = [];
         var caculateBidCountList = [];
         var askCountList = [];
         var bidTotal = 0;
         var askTotal = 0;
         for (var i = data.BidList.length; i >0 ; i--) {
            var depthData = data.BidList[i-1];
            priceList.push(depthData.Price);
            bidTotal += depthData.Total;
            caculateBidCountList.push(bidTotal);
            askCountList.push(0);
         }
         for (var i = caculateBidCountList.length; i > 0; i--) {
            bidCountList.push(caculateBidCountList[i - 1]);
         }
         var middleBid = data.BidList[data.BidList.length - 1];
         var middleAsk = data.AskList[data.AskList.length - 1];
         var price = 0;
         if (middleBid && middleAsk)
            price = (middleBid.Price + middleAsk.Price) / 2;
         priceList.push(price);
         bidCountList.push(0);
         askCountList.push(0);
         for (var i = 0; i < data.AskList.length; i++) {
            var depthData = data.AskList[i];
            priceList.push(depthData.Price);
            askTotal += depthData.Total;
            askCountList.push(askTotal);
            bidCountList.push(0);
         }
         if (!tobj.charObj.depthChart)
            tobj.charObj.depthChart = echarts.init(document.getElementById('askbid'));
         var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                backgroundColor: 'rgba(245, 245, 245, 0.8)',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                formatter: function (param) {
                    if (param[0].value != 0 || param[1].value != 0) {
                        var result = "价格:" + param[0].name;
                        if (param[0].value != 0) {
                            result += "</br>买单累计挂单量:" + param[0].value;
                            for (var i = 0; i < data.BidList.length; i++) {
                                var depthData = data.BidList[i];
                                if (depthData.Price == param[0].name) {
                                    result += "</br>买单当前挂单量:" + depthData.Total;
                                    break;
                                }
                            }

                        }
                        if (param[1].value != 0) {
                            result += "</br>卖单累计挂单量:" + param[1].value;
                            for (var i = 0; i < data.AskList.length; i++) {
                                var depthData = data.AskList[i];
                                if (depthData.Price == param[0].name) {
                                    result += "</br>卖单当前挂单量:" + depthData.Total;
                                    break;
                                }
                            }
                        }
                        return result;
                    }
                }
            },
            calculable: true,
            animation: false,
            grid: [{
                left: '7%',
                right: '7%',
                top: '5%',
                height: '100%'
            }],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: priceList
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '市场深度图',
                    nameLocation: 'middle',
                    nameGap: '50'
                }
            ],
            series: [
                {
                    name: '买单',
                    type: 'line',
                    smooth: true,
                    itemStyle: { normal: { color: '#2c9b00', areaStyle: { type: 'default' } } },
                    data: bidCountList
                },
                {
                    name: '卖单',
                    type: 'line',
                    smooth: true,
                    itemStyle: { normal: { color: '#e95500', areaStyle: { type: 'default' } } },
                    data: askCountList
                }
            ]
         }
         // 使用刚指定的配置项和数据显示图表。
         tobj.charObj.depthChart.setOption(option, true);
         $(window).resize(function(){
            tobj.charObj.depthChart.resize();
         });
      },
      processListData: function(list) {
         var frequencyKey = list[0].FrequencyKey;
         var oldData = tobj.dict[frequencyKey];
         if (oldData == undefined) {
            var categoryData = [];
            var values = [];
            var volumns = [];
            var lastId = 0;

            var deas = [];
            var diffs = [];
            var deas = [];
            var macds = [];
            var preEma12 = 0;
            var preEma26 = 0;
            var preDea = 0;
            for (var i = 0; i < list.length; i++) {
               var data = list[i];

               var ema12 = preEma12 * 11 / 13 + data.ClosedPrice * 2 / 13;
               var ema26 = preEma26 * 25 / 27 + data.ClosedPrice * 2 / 27;
               var diff = ema12 - ema26;
               var dea = preDea * 8 / 10 + diff * 2 / 10;
               var macd = 2 * (diff - dea);
               diffs.push(diff.toFixed(2));
               deas.push(dea.toFixed(2));
               macds.push(macd.toFixed(2));
               preEma12 = ema12;
               preEma26 = ema26;
               preDea = dea;

               var kData = [];
               kData.push(data.OpenPrice);
               kData.push(data.ClosedPrice);
               kData.push(data.HighPrice);
               kData.push(data.LowPrice);
               kData.push(data.Volume);
               categoryData.push(data.OpenTime);
               values.push(kData);
               volumns.push(data.Volume);
               lastId = data.Id;
            }
            var result = {
               categoryData: categoryData,
               values: values,
               volumns: volumns,
               lastId: lastId,
               Diffs: diffs,
               Deas: deas,
               Macds: macds,
               PreEma12: preEma12,
               PreEma26: preEma26,
               PreDea: preDea
            };
            tobj.dict[frequencyKey] = result;
         } else {
            for (var i = 0; i < list.length; i++) {
               var data = list[i];

               var ema12 = oldData.PreEma12 * 11 / 13 + data.ClosedPrice * 2 / 13;
               var ema26 = oldData.PreEma26 * 25 / 27 + data.ClosedPrice * 2 / 27;
               var diff = ema12 - ema26;
               var dea = oldData.PreDea * 8 / 10 + diff * 2 / 10;
               var macd = 2 * (diff - dea);
               oldData.Diffs.push(diff.toFixed(2));
               oldData.Deas.push(dea.toFixed(2));
               oldData.Macds.push(macd.toFixed(2));
               oldData.PreEma12 = ema12;
               oldData.PreEma26 = ema26;
               oldData.PreDea = dea;

               var kData = [];
               kData.push(data.OpenPrice);
               kData.push(data.ClosedPrice);
               kData.push(data.HighPrice);
               kData.push(data.LowPrice);
               kData.push(data.Volume);
               oldData.categoryData.push(data.OpenTime);
               oldData.values.push(kData);
               oldData.volumns.push(data.Volume);
               oldData.lastId = data.Id;
            }
         }
         /*var frequencyKey = list[0].FrequencyKey;
         var oldData = tobj.dict[frequencyKey];
         if (oldData == undefined) {
            var categoryData = [];
            var values = [];
            var volumns = [];
            var lastId = 0;
            for (var i = 0; i < list.length; i++) {
               var data = list[i];
               var kData = [];
               kData.push(data.OpenPrice);
               kData.push(data.ClosedPrice);
               kData.push(data.HighPrice);
               kData.push(data.LowPrice);
               kData.push(data.Volume);

               categoryData.push(data.OpenTime);
               values.push(kData);
               volumns.push(data.Volume);
               lastId = data.Id;
            }

            var result = {
               categoryData: categoryData,
               values: values,
               volumns: volumns,
               lastId: lastId
            };
            tobj.dict[frequencyKey] = result;
         } else {
            for (var i = 0; i < list.length; i++) {
               var data = list[i];
               var kData = [];
               kData.push(data.OpenPrice);
               kData.push(data.ClosedPrice);
               kData.push(data.HighPrice);
               kData.push(data.LowPrice);
               kData.push(data.Volume);
               oldData.categoryData.push(data.OpenTime);
               oldData.values.push(kData);
               oldData.volumns.push(data.Volume);
               oldData.lastId = data.Id;
            }
         }*/
      },
      processSingleData: function(ws, root, data,objs) {
         var list = tobj.marketObj.clist,count=0,sign,html,_HL/*,dp,dr*/,dsign,dhtml,day_price=0,day_rate=0,
            _sign=$('.s-tab>.active').text().toLowerCase(),
            $tbody=$('.coin-table.show>tbody'),flag=true;
         list=tobj.marketObj[_sign]?tobj.marketObj[_sign]:[];
         if(objs){
            tobj.getAverage(data);
            if(0===list.length){
               list.push(data);
            }else{
               // 数据更新
               /*for(i=0;i<list.length;i++){
                  if(list[i].MarketId == data.MarketId){
                     ~(function(sign){
                        var val='',$tr;
                        $tbody.find('tr').each(function(){
                           var that = $(this);
                           if(sign.toUpperCase()==that.find('td').eq(1).text()){
                              $tr=that;
                              val = $tr.find('td').eq(4).text();
                              return false;
                           }
                        });
                        if(-1!=val.indexOf('-')){
                           val = val.substr(val.indexOf('%')-1);
                        }else{
                           val = val.substr(1,val.indexOf('%')-1);
                        }
                        _HL = obj.getFloatValue((data.OpenPrice-data.ClosedPrice)/data.ClosedPrice,8);
                        if(_HL>val){
                           $tr.removeClass().addClass('green up');
                           _HL = '+'+_HL+'%';
                        }else if(_HL==val){
                           $tr.removeClass();
                        }else{
                           $tr.removeClass().addClass('red down');
                           _HL = _HL+'%';
                        }
                        $tr.find('td').eq(2).text('￥'+data.ClosedPrice);
                        $tr.find('td').eq(3).text(obj.getFloatValue(data.Amount,2));
                        $tr.find('td').eq(4).text(_HL);
                        setTimeout(function(){
                           $tr.removeClass('up down');
                        },1000);
                     })(data.MarketId.substr(data.MarketId.indexOf('_')+1));
                     list[i]=data;
                     count++;
                     break;
                  }
               }*/
               
               /*if(data.marketId == tobj.getParam.marketId){
                  /*dp = $('.day-price').text();
                  dr = $('.day-rate').text();*/
                  /*day_price=obj.getFloatValue((data.ClosedPrice-data.OpenPrice),3);
                  day_rate=obj.getFloatValue((data.ClosedPrice-data.OpenPrice)/data.OpenPrice,4);
                  if((data.ClosedPrice-data.OpenPrice)>0){
                     dhtml=day_price+'<i class="icon icon-down3"></i>';
                     dsign = '+'+day_rate+'%';
                     $('.priceTrend').addClass('green').removeClass('red');
                  }else{
                     dhtml=obj.getFloatValue((data.ClosedPrice-data.OpenPrice),3)+'<i class="icon icon-down8"></i>';
                     dsign = '-'+day_rate+'%';
                     $('.priceTrend').addClass('red').removeClass('green');
                  }
                  if(0===data.OpenPrice){
                     dsign = '0%';
                  }

                  $('.day-price').html(dhtml);
                  $('.day-rate').text(dsign);*/
               /*}*/
               
               // 新币种添加
               /*if(0===count){
                  _HL = obj.getFloatValue((data.OpenPrice-data.ClosedPrice)/data.ClosedPrice,8);
                  html = '<tr>\
                           <td><i class="icon icon-unstar" data-market="'+data.MarketId+'"></i></td>\
                           <td><a href="./trade.html?marketId='+data.MarketId+'" target="_blank">'+(data.MarketId).split('_')[1].toUpperCase()+'</a></td>\
                           <td>￥'+data.ClosedPrice+'</td>\
                           <td>'+data.Amount+'</td>\
                           <td>'+_HL+'%</td>\
                        </tr>';
                  list.push(data);
                  $tbody.append(html);
               }*/
               //flag = false;
            }
            //tobj.showCurrencyMarket(list,data.MarketId.split('_')[0]);
         }else{
            if(0===list.length){
               list.push(data);
            }else{
               for(i =0;i<list.length;i++){
                  if(list[i].MarketId == data.MarketId){
                     $.extend(true,list[i],data);
                     break;
                  }
               }
            }
         }
         //tobj.marketObj.clist = list;
         tobj.marketObj[_sign]=list;
         //if(flag){
         tobj.showCurrencyMarket(list,_sign);
         //}
         var kData = [];
         kData.push(data.OpenPrice);
         kData.push(data.ClosedPrice);
         kData.push(data.HighPrice);
         kData.push(data.LowPrice);
         kData.push(data.Volume);
         var oldData = tobj.dict[data.FrequencyKey];
         if (oldData == undefined) {
            var categoryData = [];
            var values = [];
            var volumns = [];

            var deas = [];
            var diffs = [];
            var deas = [];
            var macds = [];

            var ema12 = data.ClosedPrice * 2 / 13;
            var ema26 = data.ClosedPrice * 2 / 27;
            var diff = ema12 - ema26;
            var dea = diff * 2 / 10;
            var macd = 2 * (diff - dea);
            diffs.push(diff.toFixed(2));
            deas.push(dea.toFixed(2));
            macds.push(macd.toFixed(2));

            categoryData.push(data.OpenTime);
            values.push(kData);
            volumns.push(data.Volume);
            var result = {
               categoryData: categoryData,
               values: values,
               volumns: volumns,
               lastId: data.Id,
               Diffs: diffs,
               Deas: deas,
               Macds: macds,
               PreEma12: ema12,
               PreEma26: ema26,
               PreDea: dea
            };
            tobj.dict[data.FrequencyKey] = result;
            var frequencyKey = tobj.sign;
            //更新K线图
            if (data.FrequencyKey == frequencyKey){
               tobj.drawingKLine(frequencyKey);
            }
         }else {
            var ema12 = oldData.PreEma12 * 11 / 13 + data.ClosedPrice * 2 / 13;
            var ema26 = oldData.PreEma26 * 25 / 27 + data.ClosedPrice * 2 / 27;
            var diff = ema12 - ema26;
            var dea = oldData.PreDea * 8 / 10 + diff * 2 / 10;
            var macd = 2 * (diff - dea);

            if (data.Id == oldData.lastId + 1) {
               oldData.categoryData.push(data.OpenTime);
               oldData.values.push(kData);
               oldData.volumns.push(data.Volume);
               oldData.lastId = data.Id;

               oldData.Diffs.push(diff.toFixed(2));
               oldData.Deas.push(dea.toFixed(2));
               oldData.Macds.push(macd.toFixed(2));

               oldData.PreEma12 = ema12;
               oldData.PreEma26 = ema26;
               oldData.PreDea = dea;
               var frequencyKey = tobj.sign;
               //更新K线图
               if (data.FrequencyKey == frequencyKey)
                  tobj.drawingKLine(frequencyKey);

            } else if (data.Id > oldData.lastId) {
               tobj.RepairKLine(data.FrequencyKey, oldData.lastId,root);
            } else if (data.Id == oldData.lastId) {
               oldData.values[oldData.length - 1] = kData;
               oldData.Diffs[oldData.length - 1] = diff.toFixed(2);
               oldData.Deas[oldData.length - 1] = dea.toFixed(2);
               oldData.Macds[oldData.length - 1] = macd.toFixed(2);

               oldData.PreEma12 = ema12;
               oldData.PreEma26 = ema26;
               oldData.PreDea = dea;

               var frequencyKey = tobj.sign;
               //更新K线图
               if (data.FrequencyKey == frequencyKey)
                  tobj.drawingKLine(frequencyKey);
            }
         }
         /*var oldData = tobj.dict[data.FrequencyKey];
         var kData = [];
         kData.push(data.OpenPrice);
         kData.push(data.ClosedPrice);
         kData.push(data.HighPrice);
         kData.push(data.LowPrice);
         kData.push(data.Volume);
         if (oldData == undefined) {
            var categoryData = [];
            var values = [];
            var volumns = [];
            categoryData.push(data.OpenTime);
           
            values.push(kData);
            volumns.push(data.Volume);
            var result = {
               categoryData: categoryData,
               values: values,
               volumns: volumns,
               lastId: data.Id
            };
            tobj.dict[data.FrequencyKey] = result;
            var frequencyKey = tobj.sign;
            //更新K线图
            if (data.FrequencyKey == frequencyKey)
               tobj.drawingKLine(frequencyKey);
         } else {
            if (data.Id == oldData.lastId + 1) {
               oldData.categoryData.push(data.OpenTime);
               oldData.values.push(kData);
               oldData.volumns.push(data.Volume);
               oldData.lastId = data.Id;
            } else if (data.Id > oldData.lastId) {
               tobj.RepairKLine(data.FrequencyKey, oldData.lastId,root);
            }else if (data.Id == oldData.lastId) {
               oldData.values[oldData.length - 1] = kData;
               var frequencyKey = tobj.sign;
               //更新K线图
               if (data.FrequencyKey == frequencyKey)
                  tobj.drawingKLine(frequencyKey);
            }
         }*/
      },
      //修复数据
      RepairKLine: function(dataFrequencyKey, lastId,root) {
         var Repair = root.lookup("RepairKLine");
         var frequencyKey = tobj.sign;
         if (dataFrequencyKey == frequencyKey) {
            var epairData = Repair.create({ MarketId: tobj.marketId, FrequencyKey: dataFrequencyKey, StartId: lastId });
            var dataBuffer = Repair.encode(epairData).finish();
            var buffer = tobj.GenerateCmdBuffer(tobj.Controllers.MarketController,tobj.SendCommand.RepairKLine, dataBuffer);
            if (ws.readyState === WebSocket.OPEN) {
               ws.send(buffer);
            }
         }
      },
      // websocket
      StartWS: function(root) {
         var BindMarket = root.lookup("BindMarket"),
            Chat = root.lookup("Chat"),
            ReceiveChat = root.lookup("ReceiveChat"),
            Frequency = root.lookup("SetKLineFrequency"),
            KLineInfo = root.lookup("KLineInfo"),
            KLineList = root.lookup("KLineList"),
            SetTradeOrder = root.lookup("SetTradeOrder"),
            TradeSimpleDto = root.lookup("TradeSimpleDto"),
            TradeSimpleDtoList = root.lookup("TradeSimpleDtoList"),
            MarketDepth = root.lookup("MarketDepthDto"),
            SetMarketDepth = root.lookup("SetMarketDepth"),
            ScrollDayKLine = root.lookup("ScrollDayKLine"),
            SetTradeOrder = root.lookup('SetTradeOrder'),
            Login = root.lookup("LoginToMarket"),
            UpdateOrderInfo = root.lookup("UpdateOrderInfo"),
            PlanOrderInfo = root.lookup("PlanOrderInfo"),
            OrderInfo = root.lookup("OrderInfo"),
            ws = new WebSocket("ws://10.0.0.218:8987/");//192.168.3.114:8987
         ws.onopen = function (e) {
            console.log("Connection open...");
            getMarketList(root,ws);
            BindToMarket();//先绑定到市场
            bindToMarketDepth();//获取市场深度
            bindToTradeDetail();//获取交易明细
            initKChart();// 默认k线图数据
            ReceiveChatCmd(); // 接收聊天内容
            if(obj.sign){
               LoginVerify();
               getMarketInfos();
            }
            //initKChart('D1');
         };
         ws.binaryType = "arraybuffer";
         ws.onmessage = function (e) {
            if (e.data instanceof ArrayBuffer) {
               var cmdArray = new Uint8Array(e.data, 0, 2);
               var receiveBuffer = new Uint8Array(e.data, 2);
               var cmd = tobj.ByteToUnShort(cmdArray),data=null;
               if (cmd == tobj.ReceiveCommand.ChatContent) {
                  //解析聊天内容
                  data = Chat.decode(receiveBuffer);
                  tobj.getChatList([{type: 1,name: data.Name,txt: data.Content}]);
                  tobj.scrolls();
               } else if (cmd == tobj.ReceiveCommand.SingleKLine) {
                  data = KLineInfo.decode(receiveBuffer);
                  //处理数据
                  console.log('SingleKLine: ',data);
                  tobj.processSingleData(ws, root, data,{key: data.FrequencyKey,id: data.MarketId});
               }else if(cmd==tobj.ReceiveCommand.ScrollDayKLine){
                  data=ScrollDayKLine.decode(receiveBuffer);
                  console.log('ScrollDayKLine: ',data);
                  tobj.processSingleData(ws, root, data);
               } else if (cmd == tobj.ReceiveCommand.BatchKLine) {
                  var batchData = KLineList.decode(receiveBuffer);
                  //处理数据
                  console.log('BatchKLine:',batchData);
                  tobj.processListData(batchData.List);
               }else if(cmd == tobj.ReceiveCommand.BatchKLineSendComplate) {
                  console.log("传输完成");
                  var frequencyKey = tobj.sign;
                  tobj.drawingKLine(frequencyKey);
               } else if (cmd == tobj.ReceiveCommand.TradeSimpleDto) {
                  //单条交易数据直接附加
                  data = TradeSimpleDto.decode(receiveBuffer);
                  console.log('单条',data);
                  operateMarketDetail(data,1);
               } else if (cmd == tobj.ReceiveCommand.TradeSimpleDtoList) {
                  //批量交易数据需要先清空容器
                  var list = TradeSimpleDtoList.decode(receiveBuffer);
                  console.log('批量',list);
                  operateMarketDetail(list.List||[]);
               }else if(cmd==tobj.ReceiveCommand.MarketDepth){
                  data=MarketDepth.decode(receiveBuffer);
                  console.log('MarketDepth: ',data);
                  operateMarketDepth(data);
                  tobj.drawingAskBidChart(data);
               }else if (cmd == tobj.ReceiveCommand.CreateOrder) {
                  data = OrderInfo.decode(receiveBuffer);
                  console.log("有普通订单创建",data);
                  tobj.showtOrders(data,1);
               }else if (cmd == tobj.ReceiveCommand.CreatePlanOrder) {
                  data = PlanOrderInfo.decode(receiveBuffer);
                  console.log("有计划订单创建",data);
                  tobj.showtOrders(data,2);
               }else if (cmd == tobj.ReceiveCommand.UpdateOrder) {
                  data = UpdateOrderInfo.decode(receiveBuffer);
                  console.log("订单信息发生改变",data);
                  tobj.showtOrders(data,3);
               }
            }
         };
         ws.onerror = function (e) {
            console.log('websocked error');
         }
         ws.onclose = function (e) {
            console.log("Connection closed", e);
            setTimeout(function () { tobj.StartWS(root); }, 2000);
         };
         // 登陆到当前市场
         function LoginVerify() {

            var loginInfo = Login.create({ UserId: tobj.loginCookie.id, SecretKey: tobj.loginCookie.key, MarketId: tobj.marketId }),
               dataBuffer = Login.encode(loginInfo).finish(),
               buffer = tobj.GenerateCmdBuffer(tobj.Controllers.MarketController, tobj.SendCommand.Login, dataBuffer);
            if (ws.readyState == WebSocket.OPEN) {
               ws.send(buffer);
            }
         }
         // 启动监听市场
         function BindToMarket() {
            var bindMarket = BindMarket.create({ MarketId: tobj.marketId });
            var dataBuffer = BindMarket.encode(bindMarket).finish();
            var buffer = tobj.GenerateCmdBuffer(tobj.Controllers.MarketController,tobj.SendCommand.BindMarket, dataBuffer);
            if (ws.readyState === WebSocket.OPEN) {
               ws.send(buffer);
            } else {

            }
         }
         // 启动监听市场深度
         function bindToMarketDepth(){
            var bindMarket = SetMarketDepth.create({ MarketId: tobj.marketId,DepthKey:tobj.marketObj.key });
            var dataBuffer = SetMarketDepth.encode(bindMarket).finish();
            var buffer = tobj.GenerateCmdBuffer(tobj.Controllers.MarketController,tobj.SendCommand.SetMarketDepth, dataBuffer);
            if (ws.readyState === WebSocket.OPEN) {
               ws.send(buffer);
            } else {

            }
         }
         // 启动监听市场明细
         function bindToTradeDetail(){
            var data = SetTradeOrder.create({ MarketId: tobj.marketId, Count: parseInt(tobj.marketObj.count) });
            var dataBuffer = SetTradeOrder.encode(data).finish();
            var buffer = tobj.GenerateCmdBuffer(tobj.Controllers.MarketController,tobj.SendCommand.SetTradeOrder, dataBuffer);
            if (ws.readyState === WebSocket.OPEN) {
               ws.send(buffer);
            } else {

            }
         }
         // 市场深度/交易明细
         $('.about-box').on('click','>.about-list>li>span',function(){
            var index = $('.sort-list>li.on').index();
            tobj.changeMarketParam();
            if(0===index){
               bindToMarketDepth();
            }else{
               bindToTradeDetail();
            }
         });
         // 交易明细
         function operateMarketDetail(data){
            var list = [],list2=[],html = '',total=0,i=0,$tr,scale,time,val,$i,$current=$('.current-price');
            //console.log('==========data',data instanceof Array,'list',tobj.marketObj.list);
            if(data instanceof Array){
               list = data;
               if(0==list.length){return false;}
               list.slice(0,tobj.marketObj.count);
               list2=JSON.parse(JSON.stringify(list));
               list2.sort(function(a,b){return b.Volume-a.Volume;});
               total = list2[0].Volume;
               tobj.detailObj.volume=total;
               for(i;i<list.length;i++){
                  scale = (list[i].Volume/total*80<1)?1:(list[i].Volume/total)*80,
                  time = (list[i].CreateTime).split(' ');
                     
                  html += '<tr class="'+(list[i].IsAsk?'green':'red')+'" data-id="'+list[i].Id+'">\
                              <td>'+time[1]+'</td>\
                              <td>'+list[i].Price+'</td>\
                              <td class="txt-right"><i class="icon"></i><span class="d_volume">'+list[i].Volume+'</span></td>\
                              <td><i class="buz-scale" style="width: '+(total>list[i].Volume?scale:80)+'px;"></i></td>\
                           </tr>';
               }
               list2.sort(function(a,b){return b.Price-a.Price;});
               tobj.detailObj.price = list2[0].Price;
               //tobj.marketObj.list=list;
               $('#buy-price,#sell-price,#limit-min-buy-price,#limit-min-sell-price').val(tobj.detailObj.price);

               $('#deal-table>tbody').html(html);
               if($current.text()>tobj.detailObj.price){
                  $current.text(tobj.detailObj.price).removeClass('green').addClass('red');
               }else{
                  $current.text(tobj.detailObj.price).removeClass('red').addClass('green');
               }
            }else{
               /*list = tobj.marketObj.list;
               
               list2=JSON.parse(JSON.stringify(list));
               list2.sort(function(a,b){return b.Volume-a.Volume;});*/
               //total = list2[0].Volume;
               $('#buy-price,#sell-price,#limit-min-buy-price,#limit-min-sell-price').val(data.Price);
               time = (data.CreateTime).split(' ');
               if(data.Volume>tobj.detailObj.volume){
                  total= data.Volume;
                  $('#deal-table>tbody>tr').each(function(){
                     var that = $(this),
                        _vol=parseFloat(that.find('.d_volume').text());

                     that.find('.buz-scale').css('width',(total>_vol?scale:80));
                  });
               }else{
                  total=tobj.detailObj.volume;
               }
               scale = (data.Volume/total*80<1)?1:(data.Volume/total)*80;

               html = '<tr class="'+(data.IsAsk?'green':'red')+'" data-id="'+data.Id+'">\
                        <td>'+time[1]+'</td>\
                        <td>'+data.Price+'</td>\
                        <td class="txt-right"><i class="icon '+((data.Price>tobj.detailObj.price)?'icon-down7':'icon-up')+'"></i><span class="d_volume">'+data.Volume+'</span></td>\
                        <td><i class="buz-scale" style="width: '+(total>data.Volume?scale:80)+'px;"></i></td>\
                     </tr>';
               $('#deal-table>tbody>tr:last').remove();
               $('#deal-table>tbody').prepend(html);
               setTimeout(function(){
                  $('#deal-table>tbody>tr[data-id="'+data.Id+'"]').find('.icon').removeClass('icon-down7 icon-up');
               },1000);
               if($current.text()>data.Price){
                  $current.text(data.Price).removeClass('green').addClass('red');
               }else{
                  $current.text(data.Price).removeClass('red').addClass('green');
               }
               /*if(0!=count){
                  $tr=$('#deal-table>tbody>tr').eq(i);
                  $i=$tr.find('.icon');
                  val = $tr.find('td').eq(1).text();
                  $tr.find('td').eq(0).text(time[1]);
                  $tr.find('td').eq(1).text(data.Price);
                  $tr.find('.buz-scale').css('width',(total>data.Volume?scale:80));
                  if(val<data.Price){
                     $tr.removeClass('red').addClass('green');
                     $i.addClass('icon-down7').removeClass('icon-up');
                  }else if(val>data.Price){
                     $tr.removeClass('green').addClass('red');
                     $i.addClass('icon-up').removeClass('icon-down7');
                  }else{
                     $i.removeClass('icon-down7 icon-up');
                     $tr.removeClass('green red');
                  }
               }else{
                  html = '<tr>\
                           <td>'+time[1]+'</td>\
                           <td>'+data.Price+'</td>\
                           <td class="txt-right"><i class="icon"></i><span>'+data.Volume+'</span></td>\
                           <td><i class="buz-scale" style="width: '+(total>data.Volume?scale:80)+'px;"></i></td>\
                        </tr>';
                  $('#deal-table>tbody').prepend(html);
               }*/
            }
            tobj.getAverage();
            tobj.marketObj.list = list;
         }
         // 展示市场深度数据
         function operateMarketDepth(data){
            var askList = data.AskList || [],
               bidList = data.BidList || [],
               tmp = JSON.parse(JSON.stringify(bidList)),tmp2 = JSON.parse(JSON.stringify(askList)),
               html='',html2='',total = 0,scale=1,i=0,tmp3=0,diff=0,
               _sign=tobj.marketObj.key.split('-'),
               less=_sign[1];

            bidList.sort(function(a,b){return b.Price-a.Price;});
            askList.sort(function(a,b){return b.Price-a.Price;});
            tmp.sort(function(a,b){return b.Total-a.Total;});
            tmp2.sort(function(a,b){return b.Total-a.Total;});

            // 买
            if(0<bidList.length){
               total = tmp[0].Total;
               tobj.signPrice.buy=bidList[0].Price;
            }
            for(i = 0;i<_sign[0];i++){
               if(bidList[i]&&bidList[i].Total){
                  scale = (bidList[i].Total/total)*80<1?1:(bidList[i].Total/total)*80;
                  html += '<tr class="red">\
                              <td>'+$.t("purchase")+(i+1)+'</td>\
                              <td>'+obj.getFloatValue(bidList[i].Price,less)+'</td>\
                              <td class="txt-right"><span>'+bidList[i].Total+'</span></td>\
                              <td><i class="buz-scale" style="width: '+(total>bidList[i].Total?scale:80)+'px;"></i></td>\
                           </tr>';
               }else{
                  diff=_sign[0]-i;
                  break;
                  //html +='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
               }
            }
            $('#buy-table>tbody').html(html);
            for(i=0;i<diff;i++){
               $('#buy-table>tbody').append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>')
            }

            // 卖
            if(0<askList.length){
               tmp3 = tmp2[0].Total;
               total=tmp3<total?total:tmp3;
               tobj.signPrice.sale=askList[askList.length-1].Price;
               diff=0;
            }
            for(i = 0;i<_sign[0];i++){
               if(askList[i]&&askList[i].Total){
                  scale = (askList[i].Total/total)*80<1?1:(askList[i].Total/total)*80;
                  html2 += '<tr class="green">\
                              <td>'+$.t("betray")+(askList.length-i)+'</td>\
                              <td>'+obj.getFloatValue(askList[i].Price,less)+'</td>\
                              <td class="txt-right"><span>'+askList[i].Total+'</span></td>\
                              <td><i class="buz-scale" style="width: '+(total>askList[i].Total?scale:80)+'px;"></i></td>\
                           </tr>';
               }else{
                  diff=_sign[0]-i;
                  break;
                  //html2 +='';
               }
            }
            $('#sale-table>tbody').html(html2);
            for(i=0;i<diff;i++){
               $('#sale-table>tbody').prepend('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>')
            }
         }
         // 点击深度中的挂单，价格、量、百分比应联动
         $('.buz-table').on('click','>tbody>tr',function(){
            var that = $(this);
               $td = that.find('td'),
               price = $td.eq(1).text(),
               $table=that.closest('.buz-table');
            if(price){
               if('deal-table'!=$table.prop('id')){
                  $('#buy-price,#sell-price,#limit-min-buy-price,#limit-min-sell-price').val(price);
               }
            }
         });
         // 切换基币市场tab
         $('.s-tab').on('click','>li',function(){
            var index = $(this).index();
            if($(this).hasClass('active')){return false;}
            tobj.currencyObj.base = ($(this).text()).toLowerCase();
            $(this).addClass('active').siblings().removeClass('active');
            $('.table-box .coin-table').eq(index).addClass('show').siblings().removeClass('show');
            tobj.marketObj.collect = 0;
            $('#input-search').val('');
            tobj.marketObj.clist = [];
            getMarketList(root,ws);
         });
         // k线图数据切换
         $('.m-chart').on('click','>.chart-tab>li',function(){
            tobj.sign = $(this).attr('data-sign');
            if(!$(this).hasClass('active')){
               $(this).addClass('active').siblings().removeClass('active');
            }else{return false;}
            initKChart();
         });
         // 左侧市场切换
         $('.left-top').on('click','>.top-list>li',function(){
            var that = $(this),
               txt = that.text(),
               $tl = that.parent(),
               prev = that.closest('.left-top'),
               marketId = txt.toLowerCase()+'_'+$('.buyType').eq(0).text().toLowerCase();

            $(document.body).append('<a href="./trade.html?marketid='+marketId+'" id="link-attr" target="_blank"></a>');
            $('#link-attr')[0].click();
            $('#link-attr').remove();
            $tl.removeClass('show');
            /*prev.find('label>span').text(txt);
            that.addClass('on').siblings('li').removeClass('on');
            $tl.removeClass('show');*/

            //tobj.currencyObj.base = (that.text()).toLowerCase();
            // you
            /*$('.s-tab>li').each(function(){
               var _t = $(this);
               if(_t.text()===(tobj.currencyObj.base).toUpperCase()){
                  _t.addClass('active').siblings('li').removeClass('active');
                  return false;
               }
            });*/
         });
         // 右侧市场列表
         function getMarketList(root,ws){
            
            tobj.getBaseMarketListZH(function(res){
               var list = [],list2=[],$table=$('.table-box .coin-table.show');
               if(res.IsSuccess){
                  list = res.Data || [];
                  tobj.otherMarkerIdsZH = [],tobj.otherMarkerIdsZH=[],tobj.otherMarkerIds=[];
                  for(var i = 0;i<list.length;i++){
                     list2.push(list[i].Id);
                     tobj.otherMarkerIdsZH.push({TargetId: list[i].TargetId,TargetName: list[i].TargetName,Id: list[i].Id});
                  }
                  for(var i =0;i<list2.length;i++){
                     if(-1==list2.indexOf(tobj.otherMarkerIds[i])){
                        tobj.otherMarkerIds.push(list2[i]);
                     }
                  }
                  tobj.getMarketCollect(function(res){
                     var list = tobj.otherMarkerIdsZH,collect=[],html='',
                        _sign=$('.s-tab>.active').text().toLowerCase(),sel='',
                        arry=tobj.marketId.split('_'),tmp=[];
                     collect = res.Data||[];
                     tobj.collect=collect;
                     tmp=tobj.marketObj[_sign]=tobj.marketObj[_sign]?tobj.marketObj[_sign]:[];
                     if(0===$table.find('tr').length){
                        for(var i = 0;i<list.length;i++){
                           list[i].collect=false;
                           for(var j = 0;j<collect.length;j++){
                              if(list[i].Id===collect[j]){
                                 list[i].collect=true;
                              }
                           }
                           if(arry[1]==list[i].TargetId){sel="cur";}
                           html += '<tr data-type="'+list[i].TargetId+'" class="'+sel+'">\
                              <td><i class="icon '+(list[i].collect?'icon-star':'icon-unstar')+'" data-market="'+list[i].Id+'"></i></td>\
                              <td><a href="./trade.html?marketid='+list[i].Id+'">'+(list[i].TargetId).toUpperCase()+'</a></td>\
                              <td>--</td>\
                              <td>--</td>\
                              <td>--</td>\
                           </tr>';
                           tmp[i]={MarketId: list[i].Id,TargetName: list[i].TargetName,TargetId: (list[i].TargetId).toUpperCase()};
                        }
                        tobj.marketObj[_sign]=tmp;
                        $table.html(html);
                        tobj.otherMarkerIdsZH=list;
                     }else{

                     }
                     tobj.ReceiveOtherMarket(root,ws);
                  });
               }
            });
         }
         // 获取市场信息
         function getMarketInfos(root,ws){
            tobj.getMarketInfo(function(res){
               var $span = $('.about-list.show>li:nth-child(2)>span'),data={};
               if(res.IsSuccess){
                  data=res.Data;
                  $span.each(function(){
                     var that = $(this);
                     if(data.Precision==that.text()){
                        that.addClass('on').siblings('span').removeClass('on');
                        return false;
                     }
                  });
                  tobj.changeMarketParam();
                  bindToMarketDepth();
               }
            });
         }
         // 初始化市场图表
         function initKChart(){
            var frequency = Frequency.create({ MarketId: tobj.marketId, FrequencyKey: tobj.sign, IsGraph: true, IsReconnect: false });
            var dataBuffer = Frequency.encode(frequency).finish();
            var buffer = tobj.GenerateCmdBuffer(tobj.Controllers.MarketController,tobj.SendCommand.SetKLineFequency, dataBuffer);
            if (ws.readyState === WebSocket.OPEN) {
               ws.send(buffer);
            } else {

            }
         }
         function ReceiveChatCmd() {
            var receiveChat = ReceiveChat.create({ MarketId: tobj.marketId });
            var dataBuffer = ReceiveChat.encode(receiveChat).finish();
            var buffer = tobj.GenerateCmdBuffer(tobj.Controllers.MarketController, tobj.SendCommand.ReceiveMarketChat, dataBuffer);
            if (ws.readyState == WebSocket.OPEN) {
               ws.send(buffer);
            }
         }
         // 聊天信息回车发送
         $('#input-chat').on('keypress',function(e){
            e = e || window.event;
            var val = $(this).val(),
               data = { Name: tobj.nickname, Content: val, SourceId: tobj.marketId };
            val.trim();
            if((e.keyCode && 13==e.keyCode) || (e.which && 13==e.which) && !!val){
               console.log(data);
               var newchat = Chat.create(data);
               var dataBuffer = Chat.encode(newchat).finish();
               var buffer = tobj.GenerateCmdBuffer(tobj.Controllers.MarketController,tobj.SendCommand.ClientUserChat, dataBuffer);
               $(this).val('');
               if (ws.readyState === WebSocket.OPEN) {
                  ws.send(buffer);
                  tobj.getChatList([{type: 2,name: tobj.nickname,txt: val}]);
                  tobj.scrolls();
               } else {

               }
               /*tobj.getChatList([{type: 2,name: '匿名',txt: $(this).val()}]);
               tobj.scrolls();
               $(this).val('');*/
            }
         });
      },
      // 监听指定市场K线数据
      ReceiveOtherMarket: function(root, ws) {
         var otherMarkerIds = tobj.otherMarkerIds;//右上角市场列表
         //otherMarkerIds.push(tobj.marketId);  // 当前市场
         var MarketFrequency = root.lookup("MarketKLineFrequency");
         var MarketFrequencyList = root.lookup("SetReceiveOtherMarketKLine");
         var list = new Array();
         for (var i = 0; i < otherMarkerIds.length; i++) {
            var marketId = otherMarkerIds[i];
            var marketFrequency = MarketFrequency.create({ MarketId: marketId, Keys: ["SD1", "D1"] });
            list.push(marketFrequency);
         }
         var fList = MarketFrequencyList.create({ List: list });
         var dataBuffer = MarketFrequencyList.encode(fList).finish();
         var buffer = tobj.GenerateCmdBuffer(tobj.Controllers.MarketController,tobj.SendCommand.SetReceiveOtherMarketKLine, dataBuffer);
         if (ws.readyState === WebSocket.OPEN) {
            ws.send(buffer);
         } else {

         }
      },
      // 发送二进制数据
      GenerateCmdBuffer: function(controller,command, dataBuffer) {
         var controllerLittleEndian = new dcodeIO.ByteBuffer(4).writeUint32(controller, 0).flip();
         var controllerBigEndian = new Uint8Array(4);
         controllerBigEndian[0] = controllerLittleEndian.view[3];
         controllerBigEndian[1] = controllerLittleEndian.view[2];
         controllerBigEndian[2] = controllerLittleEndian.view[1];
         controllerBigEndian[3] = controllerLittleEndian.view[0];
         var commandLittleEndian = new dcodeIO.ByteBuffer(2).writeUint16(command, 0).flip();
         var commandBigEndian = new Uint8Array(2);
         commandBigEndian[0] = commandLittleEndian.view[1];
         commandBigEndian[1] = commandLittleEndian.view[0];
         var allBuffer = dcodeIO.ByteBuffer.concat([controllerBigEndian,commandBigEndian, dataBuffer], "binary");
         return allBuffer.view;
      },
      ByteToUnShort: function(b){
         return (b[0] & 0xff) | ((b[1] & 0xff) << 8);
      },
      calculateMA: function(dayCount, data) {
         var result = [];
         for (var i = 0, len = data.values.length; i < len; i++) {
            if (i < dayCount) {
               result.push('-');
               continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
               sum += data.values[i - j][1];
            }
            result.push(+(sum / dayCount).toFixed(3));
         }
         return result;
      },
      // 获取币种市场列表（zh）
      getBaseMarketListZH: function(callbacks){
         obj.ajaxFn('/market/GetFullListByBasic',{
            data: {basicId: $('.s-tab>li.active').text().toLowerCase()},
            callback: callbacks
         });
      },
      // 获取基币市场列表
      /*getBaseMarketList: function(callbacks){
         obj.ajaxFn('/market/GetListByBasic',{
            data: {basicId: tobj.currencyObj.base},
            callback: callbacks
         });
      },*/
      // 获取当前币种市场列表
      getTargetMarketList: function(){
         obj.ajaxFn('/market/GetListByTarget',{
            data: {targetId: tobj.currencyObj.target},
            callback: function(res){
               var list = [],html='',current = (tobj.currencyObj.base).toUpperCase()||'CNY';
               if(res.IsSuccess){
                  list = res.Data || [];
                  for(var i = 0;i<list.length;i++){
                     var k = list[i].split('_')[0].toUpperCase();
                     /*if(0==i){current=k;}*/
                     html+='<li>'+k+'</li>';
                  }
                  $('.top-list').html(html);
                  $('.top-list>li').each(function(){
                     var that = $(this);
                     if(that.text()===current){
                        that.addClass('on');
                     }
                  });
                  $('.current-market').text(current);
               }
            }
         });
      },
      // 获取用户当前市场的余额
      getMarket: function(){
         obj.ajaxFn('/market/GetUserInfo',{
            data: {marketId: tobj.marketId},
            callback: function(res){
               var data = {},$buy = $('.form-buy'),$sale = $('.form-sale'),bid = 0,ask = 0,
                  basePrice = 0,targetPrice = 0,limit='';
               if(res.IsSuccess){
                  data = res.Data;
                  data.BasicBalance = data.BasicBalance||0;
                  data.TargetBalance = data.TargetBalance||0;
                  $('#baseBalance').text(data.BasicBalance);
                  $('#targetBalance').text(data.TargetBalance);

                  if(0!=tobj.detailObj.price){
                      data.basePrice = obj.toDiv(data.BasicBalance,tobj.detailObj.price);
                      data.targetBalance = obj.toMul(data.TargetBalance,tobj.detailObj.price);
                     if(isNaN(basePrice)){
                        data.basePrice = 0;
                     }
                     if(isNaN(targetBalance)){
                        data.targetBalance = 0;
                     }
                     $('#able-buy').text(obj.getFloatValue(obj.toDiv(data.BasicBalance,tobj.detailObj.price),8));
                     $('#able-sale').text(obj.getFloatValue(obj.toMul(data.TargetBalance,tobj.detailObj.price),8));
                  }
                  limit=data.OrderPriceLimit;
                  if(limit&&-1==limit.indexOf('OFF')){
                     tobj.detailObj.limit=1+parseFloat(limit.substr(limit.indexOf(',')+1));
                  }

                  bid = parseFloat(obj.getFloatValue(data.BidFeeRate*100,2));
                  ask = parseFloat(obj.getFloatValue(data.AskFeeRate*100,2));
                  $('#buyFeeRate').text(bid);
                  $('#sellFeeRate').text(ask);
                  //tobj.target_val={basePrice: data.BasicBalance,targetBalance: data.TargetBalance};
                  /*Scroll.value = data.BidFeeRate*100;
                  Scroll.lightFn($buy.find('.scale-btn'),parseFloat(data.BidFeeRate*325).toFixed(2));
                  Scroll.value = data.AskFeeRate*100;
                  Scroll.lightFn($sale.find('.scale-btn'),parseFloat(data.AskFeeRate*325).toFixed(2));*/
                  tobj.tradeObj = data;
               }
            }
         });
      },
      // 获取市场信息
      getMarketInfo: function(callback){
         obj.ajaxFn('/market/GetMarketInfo',{
            data: {marketId: tobj.marketId},
            callback: callback
         });
      },
      // 提交限价订单
      submitLimetOrder: function(opt,that){
         var data = {marketId: tobj.marketId,orderType: opt.orderType,orderSource: 1,price: opt.price,volume: opt.volume};
         if(opt.tradePassword){
            data.tradePassword = opt.tradePassword;
         }
         obj.ajaxFn('/Order/SubmitOrder',{
            data: data,
            callback: function(res){
               var msg = '',param=null,sel='';
               if(res.IsSuccess){
                  msg = $.t('limit_success');
                  //that[0].reset();

                  if(2=== tobj.orderData.type){
                     param = 2;
                  }
                  obj.modHide('#mod-buz');
                  //tobj.getOrderList(param);
                  tobj.getMarket();
               }else{
                  if(1006===res.Code){
                     msg = $.t('trade_error8');
                  }else if(1005===res.Code){
                     msg = $.t('trade_error7');
                  }else if(1004===res.Code){
                     msg = $.t('trade_error4');
                  }else if(1002===res.Code){
                     msg = $.t('trade_error');
                  }else if(144===res.Code){
                     msg=$.t('trade_error2');
                  }else if(145===res.Code){
                     msg=$.t('trade_error3');
                  }else if(102===res.Code){
                     msg=$.t('trade_error6');
                  }
                  sel='green';
               }
               if(102!=res.Code){
                  obj.hideTips(msg,sel);
               }else{
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').html(msg);
               }
            },
            errorCallback: function(res){
               msg = $.t('limit_fail');
               obj.hideTips(msg,'green');
            }
         });
      },
      // 提交计划订单
      submitPlanOrder: function(opt,that){
         var data = {marketId: tobj.marketId,orderType: opt.orderType,orderSource: 1,
               highTriggerPrice: opt.highTriggerPrice,lowTriggerPrice: opt.lowTriggerPrice,
               highPrice: opt.highPrice,lowPrice: opt.lowPrice,amount: opt.amount};
         if(opt.tradePassword){
            data.tradePassword = opt.tradePassword;
         }
         obj.ajaxFn('/Order/SubmitPlanOrder',{
            data: data,
            callback: function(res){
               var msg = '',param=null,sel='';
               if(res.IsSuccess){
                  msg = $.t('plan_success');
                  //that.find('input[type="text"]').val(0);
                  if(2=== tobj.orderData.type){
                     param = 2;
                  }
                  obj.modHide('#mod-buz');
                  //tobj.getOrderList(param);
                  tobj.getMarket();
               }else{
                  if(1006===res.Code){
                     msg = $.t('trade_error8');
                  }else if(1005===res.Code){
                     msg = $.t('trade_error7');
                  }else if(1002===res.Code){
                     msg = $.t('trade_error');
                  }else if(144===res.Code){
                     msg=$.t('trade_error2');
                  }else if(145===res.Code){
                     msg=$.t('trade_error3');
                  }else if(102===res.Code){
                     msg=$.t('trade_error6');
                  }
                  sel='green';
               }
               if(102!=res.Code){
                  obj.hideTips(msg,sel);
               }else{
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').html(msg);
               }
            },
            errorCallback: function(res){
               msg = $.t('plan_fail');
               obj.hideTips(msg,'green');
            }
         });
      },
      // 提交批量订单
      submitBatchOrder: function(opt,that){
         var data = {marketId: tobj.marketId,batchType: opt.batchType,orderType: opt.orderType,orderSource: 1,
               highPrice: opt.highPrice,lowPrice: opt.lowPrice,volume: opt.volume};

         if(opt.tradePassword){
            data.tradePassword = opt.tradePassword;
         }
         obj.ajaxFn('/Order/SubmitBatchOrder',{
            data: data,
            callback: function(res){
               var msg = '',param,sel='';
               if(res.IsSuccess){
                  msg = $.t('bulk_success');
                  //that.find('input[type="text"]').val(0);
                  /*if('sell'==tobj.orderData.sign){
                     param = 2;
                  }*/
                  obj.modHide('#mod-buz');
                  //tobj.getOrderList();
                  tobj.getMarket();
               }else{
                  if(1006===res.Code){
                     msg = $.t('trade_error8');
                  }else if(1005===res.Code){
                     msg = $.t('trade_error7');
                  }else if(1004===res.Code){
                     msg = $.t('trade_error4');
                  }else if(1002===res.Code){
                     msg = $.t('trade_error');
                  }else if(144===res.Code){
                     msg=$.t('trade_error2');
                  }else if(145===res.Code){
                     msg=$.t('trade_error3');
                  }else if(102===res.Code){
                     msg=$.t('trade_error6');
                  }
                  sel='green';
               }
               if(102!=res.Code){
                  obj.hideTips(msg,sel);
               }else{
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').html(msg);
               }
            },
            errorCallback: function(res){
               msg = $.t('bulk_fail');
               obj.hideTips(msg,'green');
            }
         });
      },
      // 判断是否需要输入交易密码
      isNeedPwd: function(){
         obj.ajaxFn('/user/GetTradePasswordStatus',{
            callback: function(res){
               var _sign = $('#to-addr').attr('data-sign'),
                  msg='';
               if(res.IsSuccess){
                  if(0==res.Data){
                     //localStorage.setItem('account',)
                     obj.modShow('#mod-prompt');
                     $('#mod-prompt .tips-txt').html('<span>'+$.t("account_set")+'</span><a href="./set-buzPwd.html">'+$.t("set_pwd")+'</a>');
                  }else if(1==res.Data){
                     obj.modShow('#mod-buz');
                  }else{
                     if('ok'==_sign){
                        tobj.submitOrder();
                     }else if('cancel'==_sign){
                        tobj.cancelOrder();
                     }else if('cancelAll'==_sign){
                        tobj.cancelAllOrder();
                     }
                  }
               }else{
                  if(-9997!=res.Code){
                     msg = res.ErrorMsg+'，'+$.t("operate_fail");
                  }else{
                     msg = $.t("function")+'<a href="./login.html" target="_blank">'+$.t("login")+'</a>/<a href="./register.html" target="_blank">'+$.t("register")+'</a>';
                  }
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').html(msg);
               }
            }
         });
      },
      // 提交订单
      submitOrder: function(){
         var data = tobj.orderData.data,
            that = tobj.orderData.that,
            _type = tobj.orderData.type;

         if(1==_type){
            tobj.submitLimetOrder(data,that);
         }else if(2==_type){
            tobj.submitPlanOrder(data,that);
         }else if(3==_type){
            tobj.submitBatchOrder(data,that);
         }
      },
      // 收藏
      toCollect: function(marketId){
         obj.ajaxFn('/UserCollect/MarketCollect',{
            data: {marketId: marketId},
            callback: function(res){
               /*var msg = '';
               if(res.IsSuccess){
                  msg = '收藏成功！';
               }else{
                  msg = res.ErrorMsg+'，操作失败！';
               }
               obj.modShow('#mod-prompt');
               $('#mod-prompt .tips-txt').text(msg);*/
            }
         });
      },
      // 取消收藏
      cancelMarketCollect: function(marketId){
         obj.ajaxFn('/UserCollect/CancelMarketCollect',{
            data: {marketId: marketId},
            callback: function(res){
               /*var msg = '';
               if(res.IsSuccess){
                  msg = '取消收藏成功！';
               }else{
                  msg = res.ErrorMsg+'，操作失败！';
               }
               obj.modShow('#mod-prompt');
               $('#mod-prompt .tips-txt').text(msg);*/
            }
         })
      },
      // 获取已收藏的市场列表
      getMarketCollect: function(callback){
         obj.ajaxFn('/UserCollect/GetMarketCollect',{
            async: false,
            callback: callback
         });
      },
      // 获取可买/可得数量
      getAverage: function(data){
         var _price = tobj.detailObj.price,
            able_buy = obj.toDiv(tobj.tradeObj.BasicBalance , _price)+'',
            able_sale = obj.toMul(tobj.tradeObj.TargetBalance , _price)+'';
         if(data&&(data.MarketId == tobj.marketId)){
            _price = data.ClosedPrice;
            
            /*$('#buy-price,#limit-max-buy-price').val(_price);
            $('#sell-price,#limit-max-sell-price').val(_price);*/
            //tobj.closePrice = _price;

            $('#heightPrice').text(data.HighPrice);
            $('#lowPrice').text(data.LowPrice);
         }
         if(0!=able_buy){
            able_buy = obj.getFloatValue(able_buy,8);
         }else{
            able_buy = 0;
         }
         if(0!=able_sale){
            able_sale = obj.getFloatValue(able_sale,8);
         }else{
            able_sale = 0;
         }
         
         $('#able-buy').text(able_buy);
         $('#able-sale').text(able_sale);
      },
      // 获取比率数值
      getNumFromScale: function(that){
         var $forms = that.closest('.forms-box'),
            $form = $forms.find('.form-box.show'),
            _id = parseInt($form.attr('data-type')),
            _scale = $forms.find('.scale-txt>span').text(),
            _sign = that.closest('.items-body'),
            $expect = $forms.find('.expect-price'),
            buy_price = tobj.getNum($('#buy-price').val().trim()),
            buy_num = tobj.getNum($('#buy-num').val().trim()),
            sell_price = tobj.getNum($('#sell-price').val().trim()),
            sell_num = tobj.getNum($('#sell-num').val().trim()),
            buy_order = tobj.getNum($('#buy-order').val().trim()),
            sell_order = tobj.getNum($('#sell-order').val().trim()),
            sell_pOPrice = tobj.getNum($('#sell-pOPrice').val().trim()),
            buy_limit_max_price = tobj.getNum($('#limit-max-buy-price').val().trim()),
            buy_limit_min_price = tobj.getNum($('#limit-min-buy-price').val().trim()),
            buy_limit_num = tobj.getNum($('#limit-buy-num').val().trim()),
            sell_limit_max_price = tobj.getNum($('#limit-max-sell-price').val().trim()),
            sell_limit_min_price = tobj.getNum($('#limit-min-sell-price').val().trim()),
            sell_limit_num = tobj.getNum($('#limit-sell-num').val().trim()),
            _total =0,index=0;

         if(_sign.hasClass('buy')){
            if(1==_id){
               if(0 != buy_price) {
                  $('#buy-num').val(obj.getFloatValue(obj.toDiv(obj.toMul(obj.toDiv(_scale , 100) , tobj.tradeObj.BasicBalance) , buy_price), 8));
               }else {
                  $('#buy-num').val(0);
               }
               _total = tobj.getNum(obj.toMul($('#buy-price').val().trim(),$('#buy-num').val().trim()));
            }else if(2==_id){
               $('#buy-order').val(obj.getFloatValue( (_scale/100)*tobj.tradeObj.BasicBalance,2 ));
               //_total = buy_order;
            }else if(3==_id){
               if(0!=buy_limit_max_price){
                  $('#limit-buy-num').val(obj.getFloatValue( obj.toDiv(obj.toMul(obj.toDiv(_scale,100),tobj.tradeObj.BasicBalance),buy_limit_max_price),8));
               }else{
                  $('#limit-buy-num').val(0);
               }
               //_total = tobj.getNum($('#limit-max-buy-price').val().trim()*$('#limit-buy-num').val().trim());
            }
         }else if(_sign.hasClass('sell')){

            if(1==_id){
               $('#sell-num').val(obj.toMul(obj.toDiv(_scale , 100) , tobj.tradeObj.TargetBalance));
              _total = tobj.getNum(obj.toMul($('#sell-price').val().trim() , $('#sell-num').val().trim()));
            }else if(2==_id){
               $('#sell-order').val(obj.getFloatValue( obj.toMul(obj.toDiv(_scale,100),tobj.tradeObj.TargetBalance) ));
               //_total = tobj.getNum($('#sell-order').val().trim()*$('#sell-pOPrice').val().trim());
            }else if(3==_id){
               $('#limit-sell-num').val(obj.getFloatValue(obj.toMul(obj.toDiv(_scale , 100) * tobj.tradeObj.TargetBalance)));
                 //_total = tobj.getNum($('#limit-max-sell-price').val().trim()*$('#limit-sell-num').val().trim());
            }
            index=1;
         }
         
         if(1==_id || 3==_id){
            if(3==_id){
               _total=(1!=index)?(buy_limit_num||0)*((buy_limit_max_price+buy_limit_min_price)||0)/2:sell_limit_num*((sell_limit_max_price+sell_limit_min_price)||0)/2;
            }
            $expect.text(_total||0);
         }
      },
      // 返回数值
      getNum: function(str){
         return isNaN(str)?0:parseFloat(str);
      },
      // 获取订单列表
      getOrderList: function(type){
         var url = '/order/GetOrderList';
         if(2==type){
            url = '/order/GetPlanOrderList';
         }
         obj.ajaxFn(url,{
            data: {marketId: tobj.marketId,orderType: 0,status: 1,page: 1,pageSize: 50},
            callback: function(res){
               var list = [];
               if(res.IsSuccess){
                  list = res.Data.Items;
                  tobj.showtOrders(list,type||1);
               }
            }
         });
      },
      showtOrders: function(list,type){
         var html = '',selector='#limit-table',sel = 'red',buz=$.t('buy'),index = 0,data={};
         if(3==type){

            $(selector).find('tbody>tr').each(function(){
               var _tr=$(this),
                  _id=_tr.find('a').attr('data-id');
               if(list.OrderId == _id){
                  _tr.remove();
                  return false;
               }
            });
            return false;
         }else if(2==type){
            selector = '#plan-table';
         }
         if(list instanceof Array){

            if(0==list.length){
               $('.isNull').eq(0).addClass('show');
            }else{
               $('.isNull').eq(0).removeClass('show');
            }
            if(2==type){
               index = 1;
               for(var i = 0;i<list.length;i++){
                  var txtArr = [$.t('high'),$.t('hunt')];
                  var time=list[i].CreateTime,date=null;
                  if(-1!==time.indexOf('(')){
                     time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                     date = new Date(time);
                  }else{
                     time=time.replace(/\//g,'-');
                     time=time.substr(time.indexOf('-')+1);
                  }
                  if(2==list[i].OrderType){
                     sel  = 'green';
                     buz=$.t('sell');
                     txtArr = [$.t('s_profit'),$.t('s_loss')];
                  }else{
                     sel  = 'red';
                     buz=$.t('buy');
                  }
                  html += '<tr class="'+sel+'">\
                        <td>'+(date?date.format("MM-dd hh:mm:ss"):time)+'</td>\
                        <td>'+buz+'</td>\
                        <td>'+obj.scienceToNum(list[i].Amount,8)+'（'+(list[i].CurrencyId).toUpperCase()+'）'+'</td>\
                        <td>\
                           <label>'+txtArr[0]+'：<span>'+obj.scienceToNum(list[i].HighTriggerPrice,8)+'</span></label>\
                           <label>'+txtArr[1]+'：<span>'+obj.scienceToNum(list[i].LowTriggerPrice,8)+'</span></label>\
                        </td>\
                        <td>\
                           <label>'+txtArr[0]+'：<span>'+obj.scienceToNum(list[i].HighPrice,8)+'</span></label>\
                           <label>'+txtArr[1]+'：<span>'+obj.scienceToNum(list[i].LowPrice,8)+'</span></label>\
                        </td>\
                        <td><a href="javascript:;" data-id="'+list[i].Id+'" data-type="2" data-order="'+list[i].OrderType+'">'+$.t("revocation")+'</a></td>\
                     </tr>';
               }
            }else if(1==type){
               for(var i = 0;i<list.length;i++){
                  var time=list[i].CreateTime,date=null;
                  if(-1!==time.indexOf('(')){
                     time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                     date = new Date(time);
                  }else{
                     time=time.replace(/\//g,'-');
                     time=time.substr(time.indexOf('-')+1);
                  }
                  if(2==list[i].OrderType){
                     sel  = 'green';
                     buz=$.t('sell');
                  }else{
                     sel  = 'red';
                     buz=$.t('buy');
                  }
                  html +='<tr class="'+sel+'">\
                        <td>'+(date?date.format("MM-dd hh:mm:ss"):time)+'</td>\
                        <td>'+buz+'</td>\
                        <td><span>'+obj.scienceToNum(list[i].Volume,8)+'</span>/<span>'+obj.scienceToNum(list[i].TxVolume,8)+'</span></td>\
                        <td>¥<span>'+obj.scienceToNum(list[i].Price,8)+'</span></td>\
                        <td>¥<span>'+obj.scienceToNum(list[i].TxAmount,8)+'</span></td>\
                        <td><a href="javascript:;" data-id="'+list[i].Id+'" data-type="1" data-order="'+list[i].OrderType+'">'+$.t("revocation")+'</a></td>\
                     </tr>';
               }
            }
            $(selector).find('tbody').html(html);
         }else{
            data=list;
            if(2===type){
               index=1;

               var txtArr = [$.t('high'),$.t('hunt')];
               var time = data.CreateTime,date=null;
               if(-1!==time.indexOf('(')){
                  time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                  date = new Date(time);
               }else{
                  time=time.replace(/\//g,'-');
                  time=time.substr(time.indexOf('-')+1);
               }
               if(2===data.OrderType){
                  sel  = 'green';
                  buz=$.t('sell');
                  txtArr = [$.t('s_profit'),$.t('s_loss')];
               }else{
                  sel  = 'red';
                  buz=$.t('buy');
               }
               html = '<tr class="'+sel+'">\
                     <td>'+(date?date.format("MM-dd hh:mm:ss"):time)+'</td>\
                     <td>'+buz+'</td>\
                     <td>'+obj.scienceToNum(data.Amount,8)+'（'+(data.CurrencyId).toUpperCase()+'）'+'</td>\
                     <td>\
                        <label>'+txtArr[0]+'：<span>'+obj.scienceToNum(data.HighTriggerPrice,8)+'</span></label>\
                        <label>'+txtArr[1]+'：<span>'+obj.scienceToNum(data.LowTriggerPrice,8)+'</span></label>\
                     </td>\
                     <td>\
                        <label>'+txtArr[0]+'：<span>'+obj.scienceToNum(data.HighPrice,8)+'</span></label>\
                        <label>'+txtArr[1]+'：<span>'+obj.scienceToNum(data.LowPrice,8)+'</span></label>\
                     </td>\
                     <td><a href="javascript:;" data-id="'+data.Id+'" data-type="2" data-order="'+data.OrderType+'">'+$.t("revocation")+'</a></td>\
                  </tr>';
            }else{
               var time = data.CreateTime,date=null;
               if(-1!==time.indexOf('(')){
                  time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                  date = new Date(time);
               }else{
                  time=time.replace(/\//g,'-');
                  time=time.substr(time.indexOf('-')+1);
               }
               if(2==data.OrderType){
                  sel  = 'green';
                  buz=$.t('sell');
               }else{
                  sel  = 'red';
                  buz=$.t('buy');
               }
               html +='<tr class="'+sel+'">\
                     <td>'+(date?date.format("MM-dd hh:mm:ss"):time)+'</td>\
                     <td>'+buz+'</td>\
                     <td><span>'+obj.scienceToNum(data.Volume,8)+'</span>/<span>'+obj.scienceToNum(data.TxVolume,8)+'</span></td>\
                     <td>¥<span>'+obj.scienceToNum(data.Price,8)+'</span></td>\
                     <td>¥<span>'+obj.scienceToNum(data.TxAmount,8)+'</span></td>\
                     <td><a href="javascript:;" data-id="'+data.Id+'" data-type="1" data-order="'+data.OrderType+'">'+$.t("revocation")+'</a></td>\
                  </tr>';
            }
            $(selector).find('tbody').prepend(html);
         }
         tobj.table = $('.order-table').eq(index);
         $('.order-tab>li').eq(index).addClass('on').siblings().removeClass('on');
         $('.order-table').eq(index).addClass('on').siblings().removeClass('on');
         
         tobj.getWidth();
         //tobj.getOrderInterval();
      },
      // 撤销订单
      cancelOrder: function(){
         obj.ajaxFn('/order/CancelOrder',{
            data: tobj.cancelObj,
            callback: function(res){
               var type = tobj.cancelObj.category,msg = '';
               if(res.IsSuccess){
                  if(1==type){
                     $('#limit-table>tbody>tr').each(function(){
                        var _id = $(this).find('a').attr('data-id');
                        if(tobj.cancelObj.orderId){
                           $(this).remove();
                           return false;
                        }
                     });
                  }else{
                     $('#plan-table>tbody>tr').each(function(){
                        var _id = $(this).find('a').attr('data-id');
                        if(tobj.cancelObj.orderId){
                           $(this).remove();
                           return false;
                        }
                     });
                  }
                  //tobj.getOrderList(type);
                  tobj.getMarket();
                  //obj.modHide('#mod-buz');
               }else{
                  msg = res.ErrorMsg||$.t('cancellation');
                  $('#mod-buz .error-tips').html(msg);
               }
            }
         });
      },
      // 批量撤销订单
      cancelAllOrder: function(){
         obj.ajaxFn('/order/CancelAllOrder',{
            data: tobj.cancelAllObj,
            callback: function(res){
               var type = tobj.cancelAllObj.orderCategory;
               if(res.IsSuccess){
                  //tobj.getOrderList(type);
                  tobj.getMarket();
               }else{
                  msg = res.ErrorMsg||$.t('cancellation');
                  $('#mod-buz .error-tips').html(msg);
               }
            }
         });
      },
      // 获取参数
      changeMarketParam: function(){
         var $span = $('.about-list>li>span.on');
         tobj.marketObj.key = $span.eq(0).text()+'-'+$span.eq(1).text();
         tobj.marketObj.count = $span.eq(2).text();
      },
      // 展示币种市场
      showCurrencyMarket: function(list,sign){
         var sel = '#'+(sign||'cny')+'-table>tbody',html='',$tr=null,inserts=null;
         if(list instanceof Array){
            //if(0==tobj.marketObj.collect){
               //tobj.getMarketCollect(function(res){
                  var /*collect = [],*/mkArr=[],list2 = [],list3 = tobj.otherMarkerIdsZH,dsign,day_price=0,day_rate=0,dhtml='';
                  
                  //if(res.IsSuccess){
                     //collect = ['cny_btc']//||res.Data;
                  //}

                  for(var i=0;i<list.length;i++){
                     mkArr=(list[i].MarketId).split('_');
                     if(tobj.currencyObj.target === mkArr[1]){
                        if(list[i].Amount){
                           $('.day-amount').text(obj.getFloatValue(list[i].Amount,2));
                        }else{
                           $('.day-amount').text('--');
                        }
                        if(list[i].Volume){
                           $('.day-volume').text(obj.getFloatValue(list[i].Volume,2));
                        }else{
                           $('.day-volume').text('--');
                        }
                        day_price = obj.getFloatValue((list[i].ClosedPrice-list[i].OpenPrice),3);
                        day_rate = (0!==list[i].OpenPrice?obj.getFloatValue((list[i].ClosedPrice||0-list[i].OpenPrice||0)/list[i].OpenPrice,3):0);
                        if(list[i].ClosedPrice-list[i].OpenPrice>0){
                           dhtml=(isNaN(day_price)?'--':day_price+'<i class="icon icon-down3"></i>');
                           dsign = '+'+(isNaN(day_rate)?'--':day_rate+'%');
                           $('.priceTrend').addClass('green').removeClass('red');
                        }else{
                           dhtml=(isNaN(day_price)?'--':day_price+'<i class="icon icon-down8"></i>');
                           dsign = '-'+(isNaN(day_rate)?'-':day_rate+'%');
                           $('.priceTrend').addClass('red').removeClass('green');
                        }
                        if(0===list[i].OpenPrice){
                           dsign = '0%';
                        }

                        $('.day-price').html(dhtml);
                        $('.day-rate').text(dsign);
                        for(var j = 0;j<list3.length;j++){
                           if(tobj.currencyObj.target == list3[j].TargetId){
                              $('.icon2').addClass('icon-'+list3[j].TargetId);
                              $('.icon-zn').text(list3[j].TargetName);
                              $('.buyType').text((list3[j].TargetId).toUpperCase());
                              break;
                           }
                        }
                     }
                     if(tobj.currencyObj.base===mkArr[0]){
                        var _clz = 'red',/*_sign = '<i class="icon icon-unstar" data-market="'+list[i].MarketId+'"></i>',*/$tr=$(sel).find('tr[data-type="'+mkArr[1]+'"]'),
                           _HL = (0!==list[i].ClosedPrice?obj.getFloatValue((list[i].OpenPrice||0-list[i].ClosedPrice||0)/list[i].ClosedPrice,3):0),$td=$tr.find('td');
                        _HL=isNaN(_HL)?'--':_HL;
                        if (_HL>=0){
                           if(_HL!=0){
                              _HL = '+'+_HL;
                           }
                           _clz = 'green';
                        }
                        var val='',$tr;
                        $(sel).find('tr').each(function(){
                           var that = $(this);
                           if(mkArr[1].toUpperCase()==that.find('td').eq(1).text()){
                              $tr=that;
                              val = $tr.find('td').eq(4).text();
                              return false;
                           }
                        });
                        if(-1!=val.indexOf('-')){
                           val = val.substr(val.indexOf('%')-1);
                        }else if(-1!=val.indexOf('--')){
                           val = 0;
                        }else{
                           val = val.substr(1,val.indexOf('%')-1);
                        }
                        if(_HL>val){
                           $tr.removeClass().addClass('green up');
                           _HL = '+'+_HL+'%';
                        }else if(_HL==val){
                           $tr.removeClass();
                        }else{
                           $tr.removeClass().addClass('red down');
                           _HL = _HL+'%';
                        }
                        /*list[i].collect = false;
                        if(collect.indexOf(list[i].MarketId)!=-1){
                           _sign = '<i class="icon icon-star" data-market="'+list[i].MarketId+'"></i>';
                           list[i].collect = true;
                        }*/

                        /*html += '<tr '+_clz+'>\
                                    <td>'+_sign+'</td>\
                                    <td><a href="./trade.html?marketId='+list[i].MarketId+'" target="_blank">'+(list[i].MarketId).split('_')[1].toUpperCase()+'</a></td>\
                                    <td>￥'+list[i].ClosedPrice+'</td>\
                                    <td>'+obj.getFloatValue(list[i].Amount,2)+'</td>\
                                    <td>'+_HL+'%</td>\
                                 </tr>';*/
                        $tr.removeClass().addClass(_clz);
                        $td.eq(2).html('￥'+(list[i].ClosedPrice||'--'));
                        $td.eq(3).html(list[i].Amount?obj.getFloatValue(list[i].Amount,2):'--');
                        $td.eq(4).html(_HL);

                        setTimeout(function(){
                           $tr.removeClass('up down');
                        },1000);
                        list2.push(list[i]);
                     }
                  }
                  //tobj.marketObj[sign.substr(0,1)+'list'] = list2;
                  tobj.marketObj[sign] = list2;
                  
                  //$(sel).html(html);
                  $tr = $(sel).find('tr');
                  $tr.each(function(){
                     var that = $(this);
                     if(0==that.find('td>i.icon-star').length){
                        inserts=that;
                        return false;
                     }
                  });
                  $tr.each(function(){
                     var that = $(this);
                     if(0!=that.find('td>i.icon-star').length){
                        that.insertBefore(inserts);
                     }
                  });
               //});
            //}
            tobj.marketObj.collect = 1;
         }
      },
      // 显示筛选后列表
      showFilterCurrencyMarket: function(that,sign){
         var list = [],sel = '',html = '';
         list=tobj.marketObj[sign]?tobj.marketObj[sign]:[];
         /*if(sign =='first'){
            list = tobj.marketObj.clist;
         }else if(sign =='second'){
            list = tobj.marketObj.blist;
         }else if(sign == 'third'){
            list = tobj.marketObj.elist;
         }else if(sign == 'fourth'){
            list = tobj.marketObj.alist;
         }*/
         //console.log(list);
         sel = '#'+sign+'-table>tbody';
         for(var i = 0;i<list.length;i++){
            if((list[i].MarketId).indexOf(that.val().trim()) !=-1){
               var _clz = 'class="red"',_sign = '<i class="icon icon-unstar" data-market="'+list[i].MarketId+'"></i>',_HL = obj.getFloatValue((list[i].OpenPrice-list[i].ClosedPrice)/list[i].ClosedPrice,8);
               if (_HL>=0){
                  if(_HL!=0){
                     _HL = '+'+_HL;
                  }
                  _clz = 'class="green"';
               }else{
                  _clz = 'class="red"';
               }
               if(list[i].collect){
                  _sign = '<i class="icon icon-star" data-market="'+list[i].MarketId+'"></i>';
               }
               html += '<tr '+_clz+'>\
                           <td>'+_sign+'</td>\
                           <td>'+(list[i].MarketId).split('_')[1].toUpperCase()+'</td>\
                           <td>￥'+(list[i].ClosedPrice||'--')+'</td>\
                           <td>'+(obj.getFloatValue(list[i].Amount,8)||'--')+'</td>\
                           <td>'+(isNaN(_HL)?'--':_HL)+'%</td>\
                        </tr>';
            }else{continue;}
         }
         $(sel).html(html);
      },
      // 仅显示收藏列表
      onlyCollect: function(type,sign){
         var list = [],sel = '',html = '';
         /*if(sign =='first'){
            list = tobj.marketObj.clist;
         }else if(sign =='second'){
            list = tobj.marketObj.blist;
         }else if(sign == 'third'){
            list = tobj.marketObj.elist;
         }else if(sign == 'fourth'){
            list = tobj.marketObj.alist;
         }*/
         list=tobj.marketObj[sign]?tobj.marketObj[sign]:[];
         sel = '#'+sign+'-table>tbody';
         for(var i = 0;i<list.length;i++){

            var _clz = 'class="red"',_sign = '<i class="icon icon-unstar" data-market="'+list[i].MarketId+'"></i>',_HL = (list[i].OpenPrice-list[i].ClosedPrice)/list[i].ClosedPrice;
            if (_HL>=0){
               if(_HL!=0){
                  _HL = '+'+_HL;
               }
               _clz = 'class="green"';
            }else{
               _clz = 'class="red"';
            }
            if(1==type && !list[i].collect){
               continue;
            }
            if(list[i].collect){
               _sign = '<i class="icon icon-star" data-market="'+list[i].MarketId+'"></i>';
            }
            html += '<tr '+_clz+'>\
                        <td>'+_sign+'</td>\
                        <td>'+(list[i].MarketId).split('_')[1].toUpperCase()+'</td>\
                        <td>￥'+list[i].ClosedPrice+'</td>\
                        <td>'+list[i].Volume+'</td>\
                        <td>'+_HL+'%</td>\
                     </tr>';
         }
         $(sel).html(html);
      },
      // 设置市场标记
      setMarketSign: function(){
         var type = tobj.marketId.toUpperCase().split('_');
         $('.baseType').text(type[0]);
         $('.buyType').text(type[1]);
         $('.buy-recharge').prop('href','./transaction.html?type=recharge&mkid='+type[1]);
         $('.more-order').prop('href','./trade-order.html?marketid='+tobj.marketId);
      },
      // 获取挂单定时器
      getOrderInterval: function(){
         var that = $('.order-tab>li.on'),
            index = that.index();
         clearInterval(tobj.timer);
         tobj.timer = setInterval(function(){
            if(0===index){
               tobj.getOrderList();
            }else{
               tobj.getOrderList(2);
            }
         },1000*30);
      },
      // 设置交易密码类型
      setTradePwdType: function(that,data){
         obj.ajaxFn('/user/SetTradePwdType',{
            data: data,
            callback: function(res){
               var msg = '',
                  $modify = that.find('#to-modify'),
                  $btn = that.find('#to-addr'),
                  $error = that.find('.error-tips'),
                  $closeBuz=that.find('.close-buzPwd'),
                  tip=that.find('.buz-tips').eq(0),
                  tip2=that.find('.buz-tips').eq(1);
               if(res.IsSuccess){
                  $modify.addClass('hide');
                  $btn.removeClass('hide');
                  $error.addClass('hide');
                  $closeBuz.addClass('hide');
                  tip.addClass('hide');
                  tip2.removeClass('hide');
                  obj.hideTips($.t('modify_success'));
                  $('#to-addr').trigger('click');
               }else{
                  tip.removeClass('hide');
                  tip2.addClass('hide');
                  if(133==res.Code){
                     msg = $.t('trade_error');
                     $error.html(msg).removeClass('hide');
                  }
               }
               $modify.prop('disabled',false);
            }
         });
      },
      // 保存订单数据状态
      saveOrderStatus: function(opts){
         tobj.orderData.data = opts.data;
         tobj.orderData.that = opts.form;
         tobj.orderData.type = opts.type;
         tobj.orderData.sign = opts.sign;
      },
      // 右侧tab列表
      rightTabList: function(){
         var list = tobj.targetList,i=0,$tab=$('.s-tab'),html='';
         for(i;i<list.length;i++){
            if(i==0){
               html+='<li class="active">'+list[i].toUpperCase()+'</li>';
            }else{
               html+='<li>'+list[i].toUpperCase()+'</li>';
            }
         }
         $tab.html(html);
      },
      // 触发ws
      initWS: function(){
         protobuf.load("../js/proto_market.json", function (err, root) {
            tobj.StartWS(root);
         });
      }
   };
   tobj.marketId = (tobj.getParam && tobj.getParam.marketid)?tobj.getParam.marketid: 'cny_btc';
   $('.form-box input[type=text]').each(function(){
      var that = $(this);
      that.val(0);
   });

   tobj.rightTabList();
   tobj.initWS();
   tobj.setMarketSign();
   tobj.getUserInfo();
   tobj.currencyObj={target: (tobj.marketId).substr((tobj.marketId).indexOf('_')+1),base: tobj.basicId};
   if(obj.sign){
      tobj.getLoginCookie();
      tobj.getTargetMarketList();
      //tobj.getCurrencyList();
      tobj.getMarketNotice();
      tobj.getNewsList();
      tobj.getOrderList();
      tobj.getMarket();
      tobj.scrolls();
   }else{
      $('.chat-box .chat-input').eq(0).removeClass('show');
      $('.not-login').addClass('show');
   }
   
   $(window).resize(function(){
      var w = $(window).width();
      if(tobj.wWidth != w){
         if(0<$('.order-title').length){
            tobj.getWidth();
            tobj.wWidth = w;
         }
      }
   });
   $(window).on('click',function(){
      // 关闭市场下拉列表
      var $tl = $('.top-list');
      if($tl.hasClass('show')){
         $tl.removeClass('show');
      }
   });
   
   // 关闭公告
   $('.notice-top').on('click','>.icon-close',function(){
      $(this).parent().addClass('hide');
   });

   // 市场选择
   $('.left-top').on('click',function(e){
      e = e || window.event;
      e.stopPropagation();
      e.preventDefault();
   });
   $('.left-top').on('click','>label',function(){

      var $tl = $(this).next('.top-list');
      if($tl.hasClass('show')){
         $tl.removeClass('show');
      }else{
         $tl.addClass('show');
      }
   });
   
   // 买卖数据展示切换
   $('.sort-list').on('click','>li',function(){
      var that = $(this),
         index = that.index(),
         $items = that.closest('.m-items'),
         $order = $('.m-order'),
         $table = $('.buz-table'),
         $list = $('.about-box>.about-list.show'),
         $span = $list.find('li').eq(0).find('span.on');

      if(!that.hasClass('on')){
         that.addClass('on').siblings().removeClass('on');
         $list.removeClass('show').siblings().addClass('show');
         $list = $('.about-box>.about-list.show');
         $span = $list.find('li').eq(0).find('span.on');
         if(0<index){
            $table.eq(0).removeClass('show');
            $table.eq(1).removeClass('show');
            $('.current-price').addClass('hide');
            $table.eq(2).addClass('show');
            if(20<=$span.text()){
               $items.addClass('rows');
               $order.addClass('cols');
            }else{
               $items.removeClass('rows');
               $order.removeClass('cols');
            }
         }else{
            $table.eq(0).addClass('show');
            $table.eq(1).addClass('show');
            $('.current-price').removeClass('hide');
            $table.eq(2).removeClass('show');
            if(10<=$span.text()){
               $items.addClass('rows');
               $order.addClass('cols');
            }else{
               $items.removeClass('rows');
               $order.removeClass('cols');
            }
         }
         tobj.getWidth();
      }
   });

   // 选择档位/明细
   $('.about-box').on('click','>.about-list>li>span',function(){
      var that = $(this),
         index = that.index(),
         _sign = parseInt(that.parent().attr('data-sign')),
         $item = $('.m-items:nth-child(4)'),
         $order = $('.m-order');

      if(!that.hasClass('on')){
         that.addClass('on').siblings().removeClass('on');
         if(1===_sign){
            if(1<index){
               $item.addClass('rows');
               $order.addClass('cols');
            }else{
               $item.removeClass('rows');
               $order.removeClass('cols');
            }
         }else if(3===_sign){
            if(1<index){
               $item.addClass('rows');
               $order.addClass('cols');
            }else{
               $item.removeClass('rows');
               $order.removeClass('cols');
            }
         }
         if($('#limit-table').hasClass('active')){
            tobj.table = $('#limit-table');
         }
         if($('#plan-table').hasClass('active')){
            tobj.table = $('#plan-table');
         }
         tobj.changeMarketParam();
         tobj.getWidth();
      }
   });

   // 挂单切换
   $('.order-tab').on('click','>li',function(){
      var that = $(this),
         $login = $('.not-login'),
         index = that.index(),
         $title = null,$table = null;
      if(that.hasClass('on')){
         return false;
      }else{
         if(2!=index){
            that.addClass('on').siblings('li').removeClass('on');
            $title = $('.order-title').eq(index);
            $table = $('.tables-box table').eq(index);
            $title.addClass('on').siblings('.order-title').removeClass('on');
            $table.addClass('on').siblings('table').removeClass('on');
            tobj.table = $table;
            tobj.getWidth();
            if(!$login.hasClass('show')&&0==$table.find('tr').length){
               tobj.getOrderList(0==index?null:2);
               /*if(0==index){
                  tobj.getOrderList();
               }else if(1==index){
                  tobj.getOrderList(2);
               }*/
               //tobj.getOrderInterval();
            }
         }
      }
   });
   $('.items-body').on('click','>.body-tab>li',function(){
      var that = $(this),
         index = that.index(),
         $forms = that.parent().next('.forms-box'),
         $box = $forms.find('.form-box').eq(index),
         $sp = $forms.find('.service-price'),
         $btn = that.closest('.items-body').next('.submit-btn'),
         $sbtn = that.closest('.items-body').find('.scale-btn');
      if(that.hasClass('active')){
         return false;
      }else{
         that.addClass('active').siblings('li').removeClass('active');
         $box.addClass('show').siblings('.form-box').removeClass('show');
         if(0===index){
            $btn.removeClass('thetwo').addClass('theone');
         }else{
            $btn.removeClass('theone thetwo');
            if(2===index){
               $btn.addClass('thetwo');
            }
         }
         /*$box2.each(function(){
            var that = $(this);
            that.find('input[type=text]').not('#buy-price,#limit-max-buy-price,#sell-price,#limit-max-sell-price').val(0);
         });*/
         if(0==index || 2==index){
            $sp.find('.price_1th').removeClass('hide');
            $sp.find('.price_2th').addClass('hide');
         }else if(1==index){
            $sp.find('.price_1th').addClass('hide');
            $sp.find('.price_2th').removeClass('hide');
         }
         Scroll.value = 0;
         Scroll.lightFn($sbtn,0);
      }
   });
   $('.scale-btn').on('mousedown',function(e){
      Scroll.flag = true;
      var that = $(this);
      $(document.body).on('mousemove',function(e){
         e = e || window.event;
         e.stopPropagation();
         e.preventDefault();

         if(Scroll.flag){
            var $left = that.closest('.scale-width').find('.scale-line').offset().left,
               currentValue = e.clientX-$left,
               maxW = $('.scale-line').width()-12;
            if( currentValue >= maxW){
               currentValue = maxW;
            }else if(currentValue <0){
               currentValue = 0;
            }
            Scroll.value = Math.round(100 *(currentValue)/maxW);
            Scroll.lightFn(that,currentValue);
            tobj.getNumFromScale(that);
         }
      });
   });
   $(document.body,'.scale-btn').on('mouseup',function(e){
      Scroll.flag = false;
      $(document.body).unbind('mousemove');
   });

   // 收藏/取消收藏
   $('.coin-table').on('click','>tbody>tr',function(e){
      e = e || window.event;
      var that = $(e.target);
      if($(e.target).hasClass('icon')){
         var marketId = that.attr('data-market');
         if(that.hasClass('icon-star')){
            tobj.cancelMarketCollect(marketId);
            that.removeClass('icon-star').addClass('icon-unstar');
         }else{
            tobj.toCollect(marketId);
            that.removeClass('icon-unstar').addClass('icon-star');
         }
      }
   });

   // 仅显示收藏
   $('.s-search').on('click','>i',function(){
      var _type = parseInt($(this).attr('data-type')),
         _sign=$('.s-tab>.active').text().toLowerCase(),
         _id = $(this).parent().next().find('.coin-table.show').prop('id');
      _id = _id.substr(0,_id.indexOf('-'));
      //tobj.onlyCollect(_type,_id);
      tobj.onlyCollect(_type,_sign);
      if(0==_type){
         $(this).attr('data-type',1);
      }else{
         $(this).attr('data-type',0);
      }
   });
   // 筛选币种
   $('.box-search').on('input','#input-search',function(){
      var that = $(this),
         _sign=$('.s-tab>.active').text().toLowerCase(),
         _id = that.closest('.s-search').next().find('.coin-table.show').prop('id');
      $('.icon-starlist').attr('data-type',1);
      setTimeout(function(){
         _id = _id.substr(0,_id.indexOf('-'));
         //tobj.showFilterCurrencyMarket(that,_id);
         tobj.showFilterCurrencyMarket(that,_sign);
      },500);
   });

   // 条形比率选择
   $('.scale-line').on('click',function(e){
      e = e || window.event;
      var $p = $(this).closest('.scale-width'),
         $btn = $p.find('.scale-btn'),
         maxW = $(this).width()-12,
         scale = e.clientX-$(this).offset().left,
         val = 0;
      if(scale >= maxW){
         scale = maxW;
      }else if(scale < 0){
         scale = 0;
      }
      val = Math.round(100 *(scale)/maxW);
      Scroll.value = val;
      Scroll.lightFn($btn,scale);
      tobj.getNumFromScale($btn);
   });
   /*$('#input-chat').on('keypress',function(e){
      e = e || window.event;
      var val = $(this).val(),name = '匿名';
      val.trim();
      if(e.keyCode && 13==e.keyCode) || (e.which && 13==e.which) && !!val){
         
         tobj.getChatList([{type: 2,name: '匿名',txt: $(this).val()}]);
         tobj.scrolls();
         $(this).val('');
      }
   });*/

   // 获取订单数据
   $('.m-items').on('click','.submit-btn',function(){
      var _sign = $(this).attr('data-sign'),
         data = {},
         $form = $(this).prev().find('.form-box.show'),
         _type = parseInt($form.attr('data-type')),
         _dir = parseInt($(this).prev().find('.group-direction>li.on').attr('data-sign')),
         buy_price = $('#buy-price').val() || 0,
         buy_num = parseFloat($('#buy-num').val() || 0),
         buy_order = parseFloat($('#buy-order').val() || 0),
         buy_hTPrice = parseFloat($('#buy-hTPrice').val() || 0),
         buy_hOPrice = parseFloat($('#buy-hOPrice').val() || 0),
         buy_bTPrice = parseFloat($('#buy-bTPrice').val() || 0),
         buy_bOPrice = parseFloat($('#buy-bOPrice').val() || 0),
         buy_limit_max_price = parseFloat($('#limit-max-buy-price').val() || 0),
         buy_limit_min_price = parseFloat($('#limit-min-buy-price').val() || 0),
         buy_limit_num = parseFloat($('#limit-buy-num').val() || 0),
         sell_price = $('#sell-price').val() || 0,
         sell_num = parseFloat($('#sell-num').val() || 0),
         sell_order = parseFloat($('#sell-order').val() || 0),
         sell_hTPrice = parseFloat($('#sell-pTPrice').val() || 0),
         sell_hOPrice = parseFloat($('#sell-pOPrice').val() || 0),
         sell_bTPrice = parseFloat($('#sell-lTPrice').val() || 0),
         sell_bOPrice = parseFloat($('#sell-lOPrice').val() || 0),
         sell_limit_max_price = parseFloat($('#limit-max-sell-price').val() || 0),
         sell_limit_min_price = parseFloat($('#limit-min-sell-price').val() || 0),
         sell_limit_num = parseFloat($('#limit-sell-num').val() || 0);
      
      if('buy'==_sign){
         if(1==_type){
            if(0==buy_price||0==buy_num){
               obj.hideTips($.t('buy_buy'),'green');
               return false;
            }

            if(tobj.detailObj.limit&&(0!=tobj.detailObj.price)&&(buy_price>obj.toMul(tobj.detailObj.limit,tobj.detailObj.price))){
               obj.modShow('#mod-prompt');
               $('#mod-prompt .tips-txt').html($.t('trade_error4'));
               return false;
            }
            data = {orderType: 1,price: buy_price,volume: buy_num};
            if(buy_price>obj.toMul(tobj.detailObj.price,1.02)){
               obj.modShow('#mod-warn');
               $('#mod-warn .tips-txt').html($.t('buy_buy3'));
               tobj.saveOrderStatus({data: data,form: $form,type: _type,sign: _sign});
               return false;
            }
         }else if(2==_type){
            if(0==buy_order){
               obj.hideTips($.t('amount_great'),'green');
               return false;
            }else{
               if(tobj.signPrice.buy&&(buy_hTPrice<=tobj.signPrice.buy)){
                  obj.hideTips($.t('current_price')+tobj.signPrice.sale,'green');
                  return false;
               }else if(tobj.signPrice.sale&&(buy_bTPrice>=tobj.signPrice.sale)){
                  obj.hideTips($.t('trigger_current')+tobj.signPrice.buy,'green');
                  return false;
               }else if(buy_hOPrice<=buy_bOPrice){
                  obj.hideTips($.t('unit_great'),'green');
                  return false;
               }
               data = {orderType: 1,highTriggerPrice: buy_hTPrice,lowTriggerPrice: buy_bTPrice,highPrice: buy_hOPrice,lowPrice: buy_bOPrice,amount: buy_order};
            }
         }else if(3==_type){
            if(0==buy_limit_max_price||0==buy_limit_min_price){
               obj.hideTips($.t('purchase_price'),'green');
               return false;
            }else{
               if(buy_limit_max_price<buy_limit_min_price){
                  obj.hideTips($('minimun_bid'),'green');
                  return false;
               }else{
                  if(tobj.detailObj.limit&&(0!=tobj.detailObj.price)&&(buy_limit_max_price>obj.toMul(tobj.detailObj.limit,tobj.detailObj.price))){
                     obj.modShow('#mod-prompt');
                     $('#mod-prompt .tips-txt').html($.t('trade_error4'));
                     return false;
                  }
                  data = {batchType: _dir,orderType: 1,highPrice: buy_limit_max_price,lowPrice: buy_limit_min_price,volume: buy_limit_num};
               }
            }
         }
      }else{
         if(1==_type){
            if(0==sell_price||0==sell_num){
               obj.hideTips($.t('sell_great'),'green');
               return false;
            }
            if(tobj.detailObj.limit&&(0!=tobj.detailObj.price)&&(sell_price>obj.toMul(tobj.detailObj.limit,tobj.detailObj.price))){
               obj.modShow('#mod-prompt');
               $('#mod-prompt .tips-txt').html($.t('trade_error4'));
               return false;
            }
            data = {orderType: 2,price: sell_price,volume: sell_num};
            if(obj.toMul(sell_price,1.02)<tobj.detailObj.price){
               obj.modShow('#mod-warn');
               $('#mod-warn .tips-txt').html($.t('buy_buy2'));
               tobj.saveOrderStatus({data: data,form: $form,type: _type,sign: _sign});
               return false;
            }
         }else if(2==_type){
            if(0==sell_order){
               obj.hideTips($.t('list_great'),'green');
               return false;
            }
            if(tobj.signPrice.buy&&(sell_hTPrice<=tobj.signPrice.buy)){
               obj.hideTips($.t('trigger_bigger')+tobj.signPrice.sale,'green');
               return false;
            }else if(tobj.signPrice.sale&&(sell_bTPrice>=tobj.signPrice.sale)){
               obj.hideTips($.t('trigger_less')+tobj.signPrice.buy,'green');
               return false;
            }else if(sell_hOPrice<=sell_bOPrice){
               obj.hideTips($.t('unit_big'),'green');
               return false;
            }
            data = {orderType: 2,highTriggerPrice: sell_hTPrice,lowTriggerPrice: sell_bTPrice,highPrice: sell_hOPrice,lowPrice: sell_bOPrice,amount: sell_order};
         }else if(3==_type){
            if(0==sell_limit_max_price || 0==sell_limit_min_price){
               obj.hideTips($.t('lowest_bid'),'green');
               return false;
            }else{
               if(sell_limit_max_price<sell_limit_min_price){
                  obj.hideTips($.t('high_bid'),'green');
                  return false;
               }else{
                  if(tobj.detailObj.limit&&(0!=tobj.detailObj.price)&&(sell_limit_max_price>obj.toMul(tobj.detailObj.limit,tobj.detailObj.price))){
                     obj.modShow('#mod-prompt');
                     $('#mod-prompt .tips-txt').html($.t('trade_error4'));
                     return false;
                  }
                  data = {batchType: _dir,orderType: 2,highPrice: sell_limit_max_price,lowPrice: sell_limit_min_price,volume: sell_limit_num};
               }
            }
         }
      }
      tobj.isNeedPwd();
      tobj.saveOrderStatus({data: data,form: $form,type: _type,sign: _sign});
      $('#to-addr').attr('data-sign','ok');
   });
   // 
   $('.form-box').on('focus','input[type=text]',function(){
      var that = $(this),
         _val=that.val();
      if(0==_val){
         that.val('');
      }
   });
   $('.form-box').on('blur','input[type=text]',function(){
      var that = $(this),
         _val=that.val();
      if(''===_val){
         that.val(0);
      }
   });

   // 异常价格提交确定
   $('#form-allow').on('click',function(){
      tobj.isNeedPwd();
      $('#to-addr').attr('data-sign','ok');
   });
   // 设置交易密码类型
   if(0!=$('#to-modify').length){
      $('#to-modify').on('click',function(){
         var that = $(this),
            $form = that.closest('#buz-form'),
            $pwd = $form.find('#input-pwd').val(),
            _audit= $form.find('.close-buzPwd input[name="close"]:checked').prop('value');
            data={password: '',auditType: ''};
         if($pwd){
            data.password = $pwd.trim();
         }
         if(_audit){
            data.auditType=parseInt(_audit);
         }
         tobj.setTradePwdType($form,data);
      });
   }

   // 提交订单
   $('#buz-form').on('keypress',function(e){
      e = e || window.event;
      if((e.keyCode && 13==e.keyCode) || (e.which && 13==e.which)){
         $('#to-addr').trigger('click');
      }
   });
   $('#to-addr').on('click',function(e){
      e = e || window.event;
      e.preventDefault();
      e.stopPropagation();

      var $form = $(this).closest('.mod-form'),
         pwd = $form.find('#input-pwd').val(),
         data = tobj.orderData.data,
         _sign = $(this).attr('data-sign');

      if(pwd && ''!=pwd){
         if('ok'==_sign){
            data.tradePassword = pwd;
            tobj.submitOrder();
         }else if('cancel'==_sign || 'cancelAll'==_sign){
            tobj.cancelObj.tradePassword = pwd;
            if('cancel'==_sign){
               tobj.cancelOrder();
            }else{
               tobj.cancelAllOrder();
            }
         }
      }
   });

   // 切换提示
   $('.group-direction').on('mouseover','>li',function(){
      var _tip = $(this).attr('data-tip');
      if(0==$(this).find('.dir-tip').length){
         $(this).append($('.dir-tip'));
      }
      $(this).find('.dir-tip').addClass('show');
      $(this).find('.dir-tip>label>span').html(_tip);
   });
   $('.group-direction').on('mouseout','>li',function(){
      $(this).find('.dir-tip').removeClass('show');
   });
   $('.group-direction').on('click','>li',function(){
      $(this).addClass('on').siblings().removeClass('on');
   });

   // 买卖比率
   $('.forms-box').on('input','.form-group>input',function(){
      var that = $(this),
         _total = 0,param = 0,index=0,
         $p2=null,
         $forms = that.closest('.forms-box'),
         $form = that.closest('.form-box'),
         _id = parseInt($form.attr('data-type')),
         buy_price = tobj.getNum($('#buy-price').val().trim()),
         buy_num = tobj.getNum($('#buy-num').val().trim()),
         sell_price = tobj.getNum($('#sell-price').val().trim()),
         sell_num = tobj.getNum($('#sell-num').val().trim()),

         buy_order = tobj.getNum($('#buy-order').val().trim()),
         buy_hOPrice = tobj.getNum($('#buy-hOPrice').val().trim()),
         buy_bOPrice = tobj.getNum($('#buy-bOPrice').val().trim()),
         sell_order = tobj.getNum($('#sell-order').val().trim()),
         sell_pOPrice = tobj.getNum($('#sell-pOPrice').val().trim()),
         sell_bOPrice = tobj.getNum($('#sell-lOPrice').val().trim()),

         buy_limit_max_price = tobj.getNum($('#limit-max-buy-price').val().trim()),
         buy_limit_min_price = tobj.getNum($('#limit-min-buy-price').val().trim()),
         buy_limit_num = tobj.getNum($('#limit-buy-num').val().trim()),
         sell_limit_max_price = tobj.getNum($('#limit-max-sell-price').val().trim()),
         sell_limit_min_price = tobj.getNum($('#limit-min-sell-price').val().trim()),
         sell_limit_num = tobj.getNum($('#limit-sell-num').val().trim());

      if(that.val()===''){that.val(0);}
      if(isNaN(that.val())){that.val(0);}
      // 买单
      if(0!=$forms.find('.form-buy').length){
         if(1==_id){
            if(buy_num>=tobj.tradeObj.BasicBalance){
               buy_num=obj.getFloatValue(tobj.tradeObj.BasicBalance,8);
               $('#buy-num').val(buy_num);
            }
            _total = obj.toMul(buy_price,buy_num);
            param = Math.round(obj.toMul(obj.getFloatValue(obj.toDiv(_total,tobj.tradeObj.BasicBalance),2),100)).toFixed(2);
            
            /*if(buy_num>=tobj.target_val.basePrice){
               buy_num=obj.getFloatValue(tobj.target_val.basePrice,8);
               $('#buy-num').val(buy_num);
            }*/
            if(tobj.tradeObj.BasicBalance<_total){
               $('#buy-num').val(tobj.getNum(obj.getFloatValue(obj.toDiv(tobj.tradeObj.BasicBalance,buy_price),8)));
               _total = obj.toMul(tobj.getNum($('#buy-price').val().trim()),tobj.getNum($('#buy-num').val().trim()));
            }
            if(100<=param){
               param=100;
            }
            $('#bidFeeRate').text(param);
            Scroll.value = param;
            Scroll.lightFn($('.form-buy').find('.scale-btn'),obj.toMul(obj.toDiv(param,100),325).toFixed(2));
         }else if(2==_id){
            _total = buy_order || 0;
            param = obj.toMul(obj.toDiv(buy_order,tobj.tradeObj.BasicBalance),100).toFixed(2);
            if(100>=param){
               $('#bidFeeRate').text(param);
               Scroll.value = param;
               Scroll.lightFn($('.form-buy').find('.scale-btn'),obj.toMul(obj.toDiv(buy_order,tobj.tradeObj.BasicBalance),325).toFixed(2));
            }
         }else if(3==_id){
            _total = obj.toMul(buy_limit_max_price,buy_limit_num);
            param = obj.toMul(obj.toDiv(_total,tobj.tradeObj.BasicBalance),100).toFixed(2);
            
            if(tobj.tradeObj.BasicBalance<_total){
               if(0!=buy_limit_max_price){
                  $('#limit-buy-num').val(tobj.getNum(obj.toDiv(tobj.tradeObj.BasicBalance ,buy_limit_max_price)));
               }else{
                  $('#limit-buy-num').val(0);
               }
               _total = obj.toMul(tobj.getNum($('#limit-max-buy-price').val().trim()),tobj.getNum($('#limit-buy-num').val().trim()));
            }
            if(100>=param){
               $('#bidFeeRate').text(param);
               Scroll.value = param;
               Scroll.lightFn($('.form-buy').find('.scale-btn'),obj.toMul(obj.toDiv(_total,tobj.tradeObj.BasicBalance),325).toFixed(2));
            }
         }
      // 卖单
      }else if(0!=$forms.find('.form-sale').length){
         if(1==_id){
            if(sell_num>=tobj.tradeObj.TargetBalance){
               sell_num=obj.getFloatValue(tobj.tradeObj.TargetBalance,8);
               $('#sell-num').val(sell_num);
            }
            _total = obj.toMul((sell_price || 0),(sell_num || 0));
            param = obj.toMul(obj.toDiv((sell_num || 0),tobj.tradeObj.TargetBalance),100).toFixed(2);
             
            if(100>=param){
               $('#askFeeRate').text(param);
               Scroll.value = param;
               Scroll.lightFn($('.form-sale').find('.scale-btn'),obj.toMul(obj.toDiv(sell_num,tobj.tradeObj.TargetBalance),325).toFixed(2));
            }
         }else if(2==_id){
            _total = sell_order || 0;
            param = obj.toMul(obj.toDiv(_total,tobj.tradeObj.TargetBalance),100).toFixed(2);
            if(100>=param){
               $('#askFeeRate').text(param);
               Scroll.value = param;
               Scroll.lightFn($('.form-sale').find('.scale-btn'),obj.toMul(obj.toDiv(_total,tobj.tradeObj.TargetBalance),325).toFixed(2));
            }
         }else if(3==_id){
            _total = sell_limit_num || 0;
            param = obj.toMul(obj.toDiv(_total,tobj.tradeObj.TargetBalance),100).toFixed(2);
            if(100>=param){
               $('#askFeeRate').text(param);
               Scroll.value = param;
               Scroll.lightFn($('.form-sale').find('.scale-btn'),obj.toMul(obj.toDiv(_total,tobj.tradeObj.TargetBalance),325).toFixed(2));
            }
         }
         index = 1;
      }
      $p2=$forms.find('.price_2th').eq(0);
      $p22=$forms.find('.price_2th').eq(1);

      // 预计追高/抄底（止盈/止损）成交额
      if(2==_id){
         _total = (1!=index)?(0!=buy_hOPrice?obj.getFloatValue((buy_order||0)/(buy_hOPrice||0),8):0):(0!=sell_pOPrice?obj.getFloatValue((sell_order||0)*(sell_pOPrice||0),8):0);
         $p2.find('.expect-h-price').text(obj.getFloatValue(_total,8)||0);
         _total = (1!=index)?(0!=buy_bOPrice?obj.getFloatValue((buy_order||0)/(buy_bOPrice||0),8):0):(0!=sell_bOPrice?obj.getFloatValue((sell_order||0)*(sell_bOPrice||0),8):0);
         $p22.find('.expect-l-price').text(obj.getFloatValue(_total,8)||0);
      }
      // 预计成交额
      if(1==_id || 3==_id){
         if(3==_id){
            _total=(1!=index)?(buy_limit_num||0)*(obj.toAdd(buy_limit_max_price,buy_limit_min_price)||0)/2:sell_limit_num*(obj.toAdd(sell_limit_max_price,sell_limit_min_price)||0)/2;
         }
         $forms.find('.expect-price').text(obj.getFloatValue(_total,8)||0);
      }
   });

   // 撤销挂单
   $('.order-table').on('click','>tbody>tr>td>a',function(){
      var _id = $(this).attr('data-id'),
         _type = $(this).attr('data-type'),
         _order = $(this).attr('data-order');
      //$('#to-addr').attr('data-sign','cancel');
      tobj.cancelObj = {marketId: tobj.marketId,category: _type,orderType: _order,orderId: _id,tradePassword: ''};
      tobj.cancelOrder();
      //tobj.isNeedPwd();
   });
   // 批量撤销挂单
   $('.order-title').on('click','>li>.batch-back',function(){
      var that = $(this),
         category = that.attr('data-type'),
         $tr = $('.order-table.on>tbody>tr');
         /*$tr = $('.order-table.on>tbody>tr'),
         list = []*/
      //$('#to-addr').attr('data-sign','cancelAll');
      /*$tr.each(function(){
         var t = $(this),
            id=t.find('a').attr('data-id');
         list.push(id);
      });*/
      if(0!=$tr.length){
         tobj.cancelAllObj = {marketId: tobj.marketId,orderCategory: category,tradePassword: ''};
         tobj.cancelAllOrder();
      }else{
         obj.hideTips($.t('without_order'),'green');
      }
      //tobj.isNeedPwd(1);
   });
});