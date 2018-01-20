$(function(){
   if(0!=$('.recharge-cash').length || 0!=$('.my-order').length || 0!=$('.order-history').length){
      $('.tab-change').on('click','>li',function(){
         var index = $(this).index(),
            $p = $(this).parent(),
            _sign = $p.attr('data-sign'),
            $log_tables = $('.other-tables>.log-table').eq(index);
            console.log(index);
         if(!$(this).hasClass('on')){
            $(this).addClass('on').siblings().removeClass('on');
            if('currency'==_sign){
               $log_tables.addClass('show').siblings().removeClass('show');
               $log_tables.find('.tab-logs>li').eq(0).addClass('on').siblings().removeClass('on');
               $log_tables.find('.table-log').eq(0).removeClass('hide').siblings('.table-log').addClass('hide');
               if(1==index){
                  tobj.getCoinRechargeList();
                  //tobj.getCoinCashList();
               }else{
                  tobj.getCnyRechargeList();
                  //tobj.getCnyCashList();
               }
            }else if('order'==_sign){
               $('.other-tables>.table-order').eq(index).addClass('show').siblings().removeClass('show');
               if(tobj.getMarketId()){
                  tobj.getOrders();
                  /*if('限价挂单'==$('.tab-change>li.on').text()){
                     tobj.getOrderList();
                  }else{
                     tobj.getOrderList(2);
                  }*/
               }
            }else if('bail'==_sign){
            }else if('history'==_sign){
               $('.other-tables>.table-order').eq(index).addClass('show').siblings().removeClass('show');
               if(tobj.getMarketId()){

               }
            }
         }
      });
   }
   // if( ){
   //    $('.tab-change').on('click','>li',function(){
   //       var index = $(this).index(),
   //          $p = $(this).parent(),
   //          _sign = $p.attr('data-sign'),
   //          $log_tables = $('.other-tables>.log-table').eq(index);

   //       if(!$(this).hasClass('on')){
   //          $(this).addClass('on').siblings().removeClass('on');
   //          if('currency'==_sign){
   //             $log_tables.addClass('show').siblings().removeClass('show');
   //             $log_tables.find('.tab-logs>li').eq(0).addClass('on').siblings().removeClass('on');
   //             $log_tables.find('.table-log').eq(0).removeClass('hide').siblings('.table-log').addClass('hide');
   //             if(1==index){
   //                // tobj.getCoinRechargeList();
   //             }else{
   //                // tobj.getCnyRechargeList();
   //             }
   //          }else if('order'==_sign){
   //             $('.other-tables>.table-order').eq(index).addClass('show').siblings().removeClass('show');
   //             if(tobj.getMarketId()){
   //                // tobj.getOrders();
   //             }
   //          }else if('bail'==_sign){
   //          }
   //       }
   //    });
      // $('.check').on('mouseover',function() {
      //    $('.dir-tip').css('display','table');
      // }); 
      // $('.check').on('mouseout',function() {
      //    $('.dir-tip').css('display','none');
      // });
   // }
   if(0!=$('.login-form').length){
      // 密码强度
      $('#newPwd').on('focus',function(e){
         e = e || window.event;
         e.preventDefault();
         e.stopPropagation();

         var $warn = $('.box-warn');
         if(!$warn.hasClass('show')){
            $('.box-warn').addClass('show');
         }
      });
      $('#newPwd').on('blur',function(e){
         e = e || window.event;
         e.preventDefault();
         e.stopPropagation(),
         val = $(this).val().trim(),
         flag = true;

         var $warn = $('.box-warn'),
            $li = $('.box-warn>ul>li'),
            lv = obj.pwdValidate($(this).val());
         for(var i =0;i<lv;i++){
            $li.eq(i).addClass('active');
         }
         if(lv>1){
            $warn.removeClass('show');
         }
         if(0==val.length){
            flag = false;
         }
      });
      $('#newPwd').on('input',function(e){
         e = e || window.event;
         e.preventDefault();
         e.stopPropagation();

         var $warn = $('.box-warn'),
            $li = $('.box-warn>ul>li'),
            lv = obj.pwdValidate($(this).val());

         for(var i =0;i<lv;i++){
            $li.eq(i).addClass('active');
         }
      });
   }

   var tobj = {
      timer: null,
      cancelObj: {},
      userId: '',
      pageObj: {page:1,pageSize: 10},
      marketId: 'cny',
      imgs: [],
      flag: Object.keys(obj.getParam()),
      beforeScrollTop: 0,
      logList: [],
      cfnObj: null,
      marketList: [],
      ip_id: '',
      ipList: [],
      exchange: {cny: 0,btc: 0,eth: 0},
      // 获取订单列表
      getOrderList: function(type){
         var url = '/order/GetOrderList',
            data = {marketId: tobj.marketId,orderType: 0,status: 1,page: tobj.pageObj.page,pageSize: tobj.pageObj.pageSize};
         if(2==type){
            url = '/order/GetPlanOrderList';
         }
         if(!data.marketId){
            delete data.marketId;
         }
         obj.ajaxFn(url,{
            data: data,
            callback: function(res){
               var list = [],html = '',selector='.order-1th',sel = 'red',buz=$.t('buy'),index = 0;
               if(res.IsSuccess){
                  list = res.Data.Items;
                  if(0==list.length){
                     $('.isNull').addClass('show');
                     html = '<tr><td colspan="7" style="background-color:#f1f1f1; text-align:center;">暂无数据</td></tr>';
                  }else{
                     $('.isNull').removeClass('show');
                  }
                  if(2==type){
                     selector = '.order-2th';
                     index = 1;
                     for(var i = 0;i<list.length;i++){
                        var txtArr = [$.t('high'),$.t('hunt')];
                        var time = list[i].CreateTime,market = (list[i].MarketId).toUpperCase().split('_');
                        time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                        var date = new Date(time);
                        if(2==list[i].OrderType){
                           sel = 'green';
                           buz=$.t('sell');
                           txtArr = [$.t('s_profit'),$.t('s_loss')];
                        }else{
                           sel  = 'red';
                           buz=$.t('buy');
                        }
                        html += '<tr class="'+sel+'">\
                              <td>'+date.format("yyyy-MM-dd hh:mm:ss")+'</td>\
                              <td><span>'+market[0]+'</span>/<span>'+market[1]+'</span></td>\
                              <td>'+buz+'</td>\
                              <td><span>'+obj.scienceToNum(list[i].Amount,8)+'</span>(<span>'+market[1]+'</span>)</td>\
                              <td>\
                                 <label>'+txtArr[0]+'：<span>'+obj.scienceToNum(list[i].HighTriggerPrice,8)+'</span></label>\
                                 <label>'+txtArr[1]+'：<span>'+obj.scienceToNum(list[i].LowTriggerPrice,8)+'</span>(<span>'+market[0]+'</span>)</label>\
                              </td>\
                              <td>\
                                 <label>'+txtArr[0]+'：<span>'+obj.scienceToNum(list[i].HighPrice,8)+'</span></label>\
                                 <label>'+txtArr[1]+'：<span>'+obj.scienceToNum(list[i].LowPrice,8)+'</span>(<span>'+market[0]+'</span>)</label>\
                              </td>\
                              <td><a href="javascript:;" data-id="'+list[i].Id+'" data-type="2" data-order="'+list[i].OrderType+'">'+$.t("revocation")+'</a></td>\
                           </tr>';

                        /*'<tr class="'+sel+'">\
                              <td>'+date.format("MM-dd hh:mm:ss")+'</td>\
                              <td>'+buz+'</td>\
                              <td>'+list[i].Amount+'（'+(list[i].CurrencyId).toUpperCase()+'）'+'</td>\
                              <td>\
                                 <label>'+txtArr[0]+'：<span>'+list[i].HighTriggerPrice+'</span></label>\
                                 <label>'+txtArr[1]+'：<span>'+list[i].LowTriggerPrice+'</span></label>\
                              </td>\
                              <td>\
                                 <label>'+txtArr[0]+'：<span>'+list[i].HighPrice+'</span></label>\
                                 <label>'+txtArr[1]+'：<span>'+list[i].LowPrice+'</span></label>\
                              </td>\
                              <td><a href="javascript:;" data-id="'+list[i].Id+'" data-type="2" data-order="'+list[i].OrderType+'">撤销</a></td>\
                           </tr>';*/
                     }
                  }else{
                     for(var i = 0;i<list.length;i++){
                        var time = list[i].CreateTime,market = (list[i].MarketId).toUpperCase().split('_');
                        time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                        var date = new Date(time);
                        if(2==list[i].OrderType){
                           sel = 'green';
                           buz=$.t('sell');
                        }else{
                           sel = 'red';
                           buz=$.t('buy');
                        }
                        html += '<tr class="'+sel+'">\
                              <td>'+date.format("yyyy-MM-dd hh:mm:ss")+'</td>\
                              <td><span>'+market[0]+'</span>/<span>'+market[1]+'</span></td>\
                              <td>'+buz+'</td>\
                              <td><span>'+obj.scienceToNum(list[i].Volume,8)+'</span>/<span>'+obj.scienceToNum(list[i].TxVolume,8)+'</span>(<span>'+market[1]+'</span>)</td>\
                              <td><span>'+obj.scienceToNum(list[i].Price,8)+'</span>(<span>'+market[0]+'</span>)</td>\
                              <td><span>'+obj.scienceToNum(list[i].Amount,8)+'</span>(<span>'+market[0]+'</span>)</td>\
                              <td><a href="javascript:;" data-id="'+list[i].Id+'" data-type="1" data-order="'+list[i].OrderType+'">'+$.t("revocation")+'</a></td>\
                           </tr>';
                     }
                  }
                  $(selector).find('tbody').html(html);
                  tobj.table = $('.order-table').eq(index);
                  $('.tab-change>li').eq(index).addClass('on').siblings().removeClass('on');
                  $('.other-tables>.table-order').eq(index).addClass('show').siblings().removeClass('show');
                  
                  if(1<res.Data.TotalPage){
                     $('.pagination-list').removeClass('hide');
                     tobj.pageObj.page = res.Data.CurrentPage;
                     tobj.page(null,tobj.pageObj.page,res.Data.TotalPage,function(now,all){
                        tobj.pageObj.page = now;
                        tobj.getOrders();
                     });
                  }else{
                     $('.pagination-list').empty().addClass('hide');
                  }
               }
            }
         });
      },
      // 判断是否需要输入交易密码
      isNeedPwd: function(type){
         obj.ajaxFn('/user/GetTradePasswordStatus',{
            callback: function(res){
               var _sign = $('#to-addr').attr('data-sign'),
                  msg='';
               if(res.IsSuccess){
                  if(0==res.Data){
                     obj.modShow('#mod-prompt');
                     $('#mod-prompt .tips-txt').html('<span>'+$.t("account_set")+'</span><a href="./set-buzPwd.html">'+$.t("set_pwd")+'</a>');
                  }else if(1==res.Data){
                     if(1==type){
                        obj.modShow('#mod-buz');
                     }else if(2==type){
                        obj.modShow('#mod-operate');
                        $('#mod-operate .mod-title>span').html($.t('prompt'));
                     }

                  }else{
                     if(1==type){
                        tobj.cancelOrder();
                     }else if(2==type){
                        tobj.getOpenKeyList();
                     }
                  }
               }else{
                  if(-9997!=res.Code){
                     msg = res.ErrorMsg+'，'+$.t('operate_fail');
                  }else{
                     msg = $.t("function")+'<a href="./login.html" target="_blank">'+$.t("login")+'</a>/<a href="./register.html" target="_blank">'+$.t("register")+'</a>';
                  }
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').html(msg);
               }
            }
         });
      },
      // 分页
      page: function(sel,now,all,callback){
         obj.page({
            _class: sel||'.pagination-list',
            nowNum: now,
            allNum: all,
            callback: callback
         });
      },
      getMarketId: function(){

         var pobj = obj.getParam(),
            marketObj = {};
         if(pobj.marketid){
            marketObj = pobj.marketid.split('_');
            marketObj[0] = marketObj[0].toUpperCase();
            marketObj[1] = marketObj[1].toUpperCase();
            $('.dropdown-txt>span').text(marketObj[0]);
            $('.dropdown-list>li').each(function(){
               var that = $(this);
               if(marketObj[0] === that.find('span')){
                  that.addClass('on');
                  return false;
               }
            });
            $('#market-search').val(marketObj[1]);
            $('#market-search2').val(marketObj[1]);
            $('.c-base').text(marketObj[0]);
            $('.c-base2').text('('+marketObj[0]+')');
            $('.c-target').text(marketObj[1]);
         }

         var st = $('.dropdown-txt>span').eq(0).text().toLowerCase(),ed = $('#market-search').val().trim().toLowerCase(),flag=false;
         if(0!=ed.length){
            tobj.marketId = st+'_'+ed;
            //$('.my-order-link').prop('href','./trade-order.html?marketId='+tobj.marketId);
            $('.my-turnover-link').prop('href','./turnoverLog.html?marketid='+tobj.marketId);
            flag = true;
         }else{
            tobj.marketId = '';
            flag = true;
         }
         return flag;
      },
      // 获取基币市场列表
      getBaseMarketList: function(id){
         obj.ajaxFn('/market/GetListByBasic',{
            data: {basicId: id||tobj.marketId},
            callback: function(res){
               var list = [];
               if(res.IsSuccess){
                  list = res.Data;
                  tobj.marketList = list;
               }
            }
         });
      },
      // 展示市场列表
      getMarketList: function(that,filter){
         var html = '',list = tobj.marketList;
         for(var i =0;i<list.length;i++){
            if(list[i].indexOf(filter.toLowerCase())==-1){continue;}
            html += '<li><span class="search-txt">'+list[i].substr(list[i].indexOf('_')+1).toUpperCase()+'</span></li>';// (<span>New SaiBoCoin</span>)
         }
         that.next().html(html);
      },
      // 获取Otp密钥
      getOtpSecretKey: function(){
         obj.ajaxFn('/user/GetOtpSecretKey',{
            callback: function(res){
               var count = 4;
               if(res.IsSuccess){
                  if(res.Data){
                     $('.secret-key').text(res.Data);
                     $('.bind-feedback>span').text(res.Data);
                     $('#qcode>canvas').remove();
                     $('#qcode').qrcode({width:170,height:170,correctLevel:0,text: 'otpauth://totp/'+(obj.account||'')+'?secret='+res.Data});
                  }else{
                     obj.modShow('#mod-prompt2');
                     var timer = setInterval(function(){
                        count--;
                        if(0==count){
                           clearInterval(timer);
                           location.href = './toSafeSet.html';
                        }
                        $('#mod-prompt2 .tips-txt .countdown').text(count);
                     },1000);
                  }
               }
            }
         });
      },
      // 是否已绑定手机
      getAuthTypes: function(){
         obj.ajaxFn('/user/GetAuthType',{
            callback: function(res){
               var $phone = $('#otp-captcha').parent();
               if(res.IsSuccess){
                  if((res.Data&2)!=0){
                     $phone.removeClass('hide');
                  }else{
                     $phone.addClass('hide');
                  }
               }
            }
         });
      },
      // 绑定otp
      bindOtp: function(data,that){
         obj.ajaxFn('/user/BindOtp',{
            data: {code: data.code,captcha: data.captcha},
            callback: function(res){
               var msg = '';
               if(res.IsSuccess){
                  msg = $.t('goo_authenty');
                  that.closest('.bind-form')[0].reset();
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').text(msg);
               }else{
                  if(0==res.Code){
                     msg = $.t('otp');
                  }else if(201==res.Code){
                     msg = $.t('verify_error');
                  }else if(202==res.Code){
                     msg = $.t('expired');
                  }else if(401==res.Code){
                     msg = $.t('otp_key');
                  }
                  obj.hideTips(msg,'green');
               }
               
               that.prop('disabled',false).text($.t('sub'));
            },
            errorCallback:function(res){
               that.prop('disabled',false).text($.t('sub'));
            }
         });
      },
      // 获取基本实名认证信息
      getCertification: function(){
         obj.ajaxFn('/user/GetCertification',{
            callback: function(res){
               var data = null;
               if(res.IsSuccess){
                  if(res.Data){
                     tobj.cfnObj = res.Data;
                     data = eval('(' + res.Data.Data + ')');;
                     $('.dropdown-txt').html('<span>'+data.Country+'</span>');
                     $('#realname').val(data.Name);
                     $('#certificate-num').val(data.CardNumber);
                     for(var i = 0;i<res.Data.Images.length;i++){
                        tobj.imgs.push({name: i,url: res.Data.Images[i]});
                        $('.upload-pic>li').eq(i).find('label').css('background','url('+res.Data.Images[i]+') center no-repeat');
                     }
                     $('.dropdown-list>li').each(function(){
                        var _val = $(this).find('span').text();
                        if(data.Country == _val){
                           $(this).addClass('on');
                           return false;
                        }
                     });
                  }
               }
            }
         });
      },
      // 实名认证申请/修改
      applyCertification: function(data,that,type){
         var url = '/user/ApplyCertification',flag = true;
         if(tobj.cfnObj){
            if(Object.keys(tobj.cfnObj)){
               if('AuditFail'==tobj.cfnObj.Status || 'AuditSucess'==tobj.cfnObj.Status){
                  flag = false;
                  if('IdCard'==tobj.cfnObj.Type || 'Passport'==tobj.cfnObj.Type){
                     if(data.images.length)
                     flag = true;
                  }
               }
            }
         }
         if(flag){
            obj.ajaxFn(url,{
               data: data,
               callback: function(res){
                  var msg = '',btn = '',
                     $form = that.closest('form');
                  if(res.IsSuccess){
                     if(0!=tobj.flag){
                     }else{
                        msg = '<span class="txt">'+$.t("infor_success")+'</span><span class="txt notice">'+$.t("someday")+'</span>';
                        if(2==type){
                           msg='<span class="txt">'+$.t("infor_success")+'</span>\
                              <span class="txt">'+$.t("manual")+'</span>\
                              <span class="txt notice">'+$.t("improve")+'</span>';
                           btn = '<a href="./user-info.html" class="btn btn-default">'+$.t("certain")+'</a>';
                           $form.find('.dropdown-txt>span').remove();
                           $form.find('.dropdown-txt').prepend('<span class="default-txt">'+$.t("sel_area")+'</span>');
                           $form.find('.dropdown-list>li.on').removeClass('on');
                           $form[0].reset();
                        }
                     }
                  }else{
                     if(205==res.Code){
                        msg = $.t('duplicate');
                     }else{
                        msg = '<span class="txt">'+$.t("sorry")+'</span><span class="txt">'+$.t("re_submit")+'</span>';
                     }
                  }
                  that.prop('disabled',false);
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').html(msg);
                  $('#mod-prompt .tips-btn').html(btn);
               },
               errorCallback: function(error){
                  var msg = $.t('ren_fail'),btn = '<button type="button" class="btn btn-default" data-action="close">'+$.t("certain")+'</button>';
                  that.prop('disabled',false);
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').html(msg);
                  $('#mod-prompt .tips-btn').html(btn);
               }
            });
         }else{
            that.prop('disabled',false);
            obj.modShow('#mod-prompt');
            $('#mod-prompt .tips-txt').html($.t('upload'));
            $('#mod-prompt .tips-btn').html('<button type="button" class="btn btn-default" data-action="close">'+$.t('certain')+'</button>');
         }
      },
      // 获取当前用户交易密码类型
      getTradePwdType: function(type){
         obj.ajaxFn('/user/GetTradePasswordType',{
            callback: function(res){
               if(res.IsSuccess){
                  if(0==type){
                     if(1==res.Data){
                        $('.radio-txt').text($.t('no_set'));
                     }
                     $('.operate-radio>li').each(function(){
                        var $btn = $(this).find('button'),
                           _val = parseInt($btn.attr('data-val'));
                        if(res.Data == _val){
                           $btn.prop('disabled',true);
                           $('.radio-txt').text('"'+$btn.prev().text()+'"');
                        }else{
                           $btn.prop('disabled',false);
                        }
                     });
                  }else if(1==type){
                     var _buz = '#set-buzPwd',btd = _buz+'>td:nth-child(2)',ba = _buz+' .opearate-btn>a';
                     if(1==res.Data){
                        $(_buz).addClass('red').removeClass('green');
                        $(btd).text($.t('no_set'));
                        $(ba).eq(0).removeClass('hide').next().addClass('hide');
                     }else{
                        $(_buz).addClass('green').removeClass('red');
                        $(btd).text($.t('h_set'));
                        $(ba).eq(0).addClass('hide').next().removeClass('hide');
                     }
                  }else if(2==type){
                     if(1==res.Data){
                        location.href='./set-buzPwd.html';
                     }
                  }
               }
            }
         });
      },
      // 设置当前用户交易密码类型
      setTradePwdType: function(that,data,type){
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
                  if(type){
                     $modify.addClass('hide');
                     $btn.removeClass('hide');
                     $error.addClass('hide');
                     $closeBuz.addClass('hide');
                     tip.addClass('hide');
                     tip2.removeClass('hide');
                  }else{
                     $('.radio-txt').text('"'+that.prev().text()+'"');
                     that.closest('.operate-radio').find('button:disabled').prop('disabled',false);
                     that.prop('disabled',true);
                  }
                  obj.hideTips($.t('modify_success'),'green');
               }else{
                  if(type){
                     tip.removeClass('hide');
                     tip2.addClass('hide');
                     if(133==res.Code){
                        msg = $.t('trade_error');
                        $error.html(msg).removeClass('hide');
                     }
                  }else{
                     if(133==res.Code){
                        msg = $.t("trade_error")+'<a href="./modify-buzPwd.html">'+$.t("m_tradePwd")+'</a>';
                     }
                     obj.modShow('#mod-prompt');
                     $('#mod-prompt .tips-txt').html(msg);
                  }
               }
               if(type){
                  $modify.prop('disabled',false);
               }
            }
         });
      },
      // 获取用户配置信息
      getUserCofig: function(){
         obj.ajaxFn('/user/GetUserConfigList',{
            callback: function(res){
               var list = [],$box = $('.set-notice>li').find('.slide-box');
               if(res.IsSuccess){
                  list = res.Data;
                  for(var i = 0;i<list.length;i++){
                     if(i==4){
                        if('ON'==list[i].Value){
                           $('.login-status').removeClass('off');
                        }else{
                           $('.login-status').addClass('off');
                        }
                        break;
                     }
                     btnStatus(i);
                     /*if('LoginEmailNotice'==list[i].Key){
                        btnStatus(i,0);
                     }else if('DistanceLoginNotice'==list[i].Key){
                        btnStatus(i,1);
                     }else if('TopUpNotice'==list[i].Key){
                        btnStatus(i,2);
                     }else if('WithrawalNotice'==list[i].Key){
                        btnStatus(i,3);
                     }else if('NeedSecondaryAuth'==list[i].Key){
                        btnStatus(i,4);
                     }*/
                     function btnStatus(index){
                        if('ON'==list[index].Value){
                           $box.eq(index).removeClass('off');
                        }else{
                           $box.eq(index).addClass('off');
                        }
                     }
                  }
               }
            }
         });
      },
      // 设置用户配置信息
      setUserInfo: function(data,type){
         
         obj.ajaxFn('/user/SetUserConfig',{
            data: data,
            callback: function(res){
               var msg = '设置成功！',sel='';
               if(res.IsSuccess) {
                  if(type == 'limit'){
                     msg = '限价设置成功';
                  }else if(type == 6&&data.value.indexOf('ON')!=-1){
                     msg = '限价设置已开启';
                  }else if(type == 6&&data.value.indexOf('OFF')!=-1){
                     msg = '限价设置已关闭';
                     sel='green';
                  }
               }else{
                  msg = $.t('setup');
                  sel='green';
                  // obj.modShow('#mod-prompt');
                  // $('#mod-prompt .tips-txt').text(msg);
               }
               obj.hideTips(msg,sel);
            }
         });
      },
      // 解除谷歌绑定
      unbindOtp: function(data,flag){
         var url = '/user/UnbindOtpByOtp';
         if(flag){
            url = '/user/UnbindOtpByPhone';
         }
         obj.ajaxFn(url,{
            data: data,
            callback: function(res){
               var msg = '';
               if(res.IsSuccess){
                  msg = $.t('captcha');
                  tobj.bindFn('gug',true);
                  tobj.showOpearate(['gug']);
               }else{
                  if(201==res.Code){
                     msg = $.t('verify_error');
                  }else if(202==res.Code){
                     msg = $.t('expired');
                  }else if(0==res.Code){
                     msg = $.t('verify_error');
                  }
               }
               obj.modShow('#mod-prompt');
               $('#mod-prompt .tips-txt').text(msg);
            }
         });
      },
      // 解绑手机/邮箱
      unbindOther: function(data,flag){
         var url = '/user/UnBindPhone';
         if(flag){
            url = '/user/UnBindEmail';
         }
         obj.ajaxFn(url,{
            data: data,
            callback: function(res){
               var msg = '',sel = 'phone';
               if(res.IsSuccess){
                  msg = $.t('timeframe');
                  if(flag){
                     sel = 'email';
                  }
                  tobj.bindFn(sel,true);
                  tobj.showOpearate([sel]);
               }else{
                  if(201==res.Code){
                     msg = $.t('verify_error');
                  }else if(202==res.Code){
                     msg = $.t('expired');
                  }else if(209==res.Code){
                     msg = $.t('solution');
                  }
               }
               obj.modShow('#mod-prompt');
               $('#mod-prompt .tips-txt').text(msg);
            }
         });
      },
      // 获取用户绑定认证类型
      getAuthType: function(type){
         obj.getAuthType({
            callback: function(res){
               if(res.IsSuccess){
                  var $phone = $('#input-phone').parent(),
                        $gug = $('#input-gug').parent();
                  if(1==type){
                     if(0==res.Data){                    // 未绑定
                        tobj.bindFn('phone',true);
                        tobj.bindFn('email',true);
                        tobj.bindFn('gug',true);
                     }else if(1==res.Data){              // 绑定邮箱
                        tobj.bindFn('email');
                        //$('#email>td:nth-child(4)>a').addClass('hide');
                     }else if(2==res.Data){              // 绑定手机
                        tobj.bindFn('phone');
                        tobj.showOpearate(['phone']);
                     }else if(3==res.Data){              // 邮箱+手机
                        tobj.bindFn('email');
                        tobj.bindFn('phone');
                        tobj.showOpearate(['phone','email']);
                     }else if(4==res.Data){              // 绑定otp
                        tobj.bindFn('gug');
                        tobj.showOpearate(['gug']);
                     }else if(5==res.Data){              // 邮箱+otp
                        tobj.bindFn('email');
                        tobj.bindFn('gug');
                        tobj.showOpearate(['email','gug']);
                     }else if(6==res.Data){              // 手机+otp
                        tobj.bindFn('phone');
                        tobj.bindFn('gug');
                        tobj.showOpearate(['phone','gug']);
                     }else if(7==res.Data){              // 邮箱+手机+otp
                        tobj.bindFn('phone');
                        tobj.bindFn('email');
                        tobj.bindFn('gug');
                        tobj.showOpearate(['phone','email','gug']);
                     }
                     if(2==res.Data || 3==res.Data){
                        $phone.addClass('on').removeClass('hide');
                     }else if(4==res.Data || 5==res.Data){
                        $gug.addClass('on').removeClass('hide');
                     }else if(6==res.Data || 7==res.Data){
                        $gug.addClass('on').removeClass('hide').find('.code-tab').removeClass('hide');
                        $phone.find('.code-tab').removeClass('hide')
                     }
                  }
               }
            }
         });
      },
      // 判断用户是否为手机注册
      isPhoneRegistered: function(){
         obj.ajaxFn('/user/IsPhoneRegistered',{
            callback: function(res){
               if(res.IsSuccess){
                  var $pspan = $('#set-phone .opearate-btn>span'),
                     $espan = $('#set-email .opearate-btn>span');
                  if(!res.Data){
                     $pspan.text($.t('unbound')).attr('data-bind','phone');
                     $espan.text($.t('unable')).attr('data-bind','other');
                     
                  }else{
                     $pspan.text($.t('unable')).attr('data-bind','other');
                     $espan.text($.t('unbound')).attr('data-bind','email');
                     
                  }
               }
            }
         });
      },
      // 获取个人信息
      getUserInfo: function(){
         obj.ajaxFn('/user/GetLoginInfo',{
            callback: function(res){
               var data = {},_realName=$('.real-name'),resultMsg = $.t("not_real")+'<span><a href="./toRealName.html" class="green">（'+$.t("certification")+'）</a></span>',
                  resultTips = '',safeTip='',safeCount=0;
               if(res.IsSuccess){
                  data = res.Data;
                  var /*time = data.LastLoginTime,*/$li = $('.account-top>li'),tType = data.TradePasswordType,msg = '',bType = data.BindType;
                  /*time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                  var date = new Date(time);*/
                  tobj.userId=data.UserId;
                  var num = data.PhoneNumber;
                  if(num){
                     num = num.substr(num.indexOf('-')+1);
                  }

                  $('.email-txt').text(data.Email||$.t('not_bound'));
                  $('.phone-num').text(num||$.t('not_bound'));
                  
                  $('.nickname').text(data.NickName||$.t('anonym'));
                  $('#nickname').val(data.NickName||'');
                  if(data.RealName){
                     resultMsg = data.RealName+'<span class="green">（C'+data.VerifyLevel+'）</span>';
                  }
                  _realName.html(resultMsg);
                  //$('.login-time').text(date.format("yyyy-MM-dd hh:mm:ss"));
                  if(1==tType){
                     msg = $.t('no_trade');
                     $('.buz-pwd').text($.t('set'));
                  }else if(2==tType){
                     msg = $.t('each_login');
                  }else if(3==tType){
                     msg = $.t('each_trade');
                  }else if(4==tType){
                     msg = $.t('not_validate');
                  }
                  if(1==tType){
                     $('.buz-pwd').prop('href','./set-buzPwd.html');
                  }
                  
                  if(0===bType){
                     showHide($li,1,true);
                     showHide($li,2,true);
                  }else if(0!==bType){
                     safeCount++;
                  }
                  if(1==bType || 5==bType){
                     showHide($li,2);
                  }else if(2==bType || 6==bType){
                     showHide($li,1);
                  }else if(3==bType || 7==bType){
                     showHide($li,1);
                     showHide($li,2);
                  }
                  if(1==bType||2==bType){
                     safeTip=$.t('low');
                  }else if(3==bType||4==bType||5==bType||6==bType){
                     safeTip=$.t('centre');
                  }else if(7==bType){
                     safeTip=$.t('tall');
                  }
                  if(data.Email){
                     safeCount++;
                  }
                  if(data.PhoneNumber){
                     safeCount++;
                  }
                  if(data.IsPhoneRegistered){
                     showHide($li,1);
                     showHide($li,2,true);
                     if(data.Email){
                        $('.set-email').text($.t('modify_email')).prop('href','./toSafeSet.html');
                     }else{
                        $('.set-email').text($.t('binding_mailbox')).prop('href','./bind-email.html');
                     }
                  }else{
                     showHide($li,1,true);
                     showHide($li,2);
                     if(num){
                        $('.set-phone').text($.t('modify_phone')).prop('href','./toSafeSet.html');
                     }else{
                        $('.set-phone').text($.t('bind_phone')).prop('href','./bind-phone.html');
                     }
                  }
                  if(data.TradePasswordType){
                     safeCount++;
                  }
                  $('.safe-tip').text(safeTip);
                  $('.safe-count').text(safeCount);
                  $('.trade-type').text(msg);
                  if(0!==data.VerifyLevel){
                     $('.verify-level').text('C'+data.VerifyLevel).addClass('green').removeClass('gray');
                  }else{
                     $('.verify-level').html($.t('not_realname')).addClass('gray').removeClass('green');
                  }
                  if(0===data.VerifyLevel){
                     resultTips = $.t('wei');
                  }else{
                     resultTips = $.t('yi');
                  }
                  resultTips+=$.t('completed');
                  $('.verify-tips').text(resultTips);
                  $('.vip-level').text('VIP'+data.VipLevel);
               }
               function showHide(that,index,flag){
                     that.eq(index).find('a').removeClass('hide');
                  if(flag){
                     that.eq(index).find('a').addClass('hide');
                  }
               }
            }
         });
      },
      // 修改昵称
      modifyNickName: function(that,name){
         obj.ajaxFn('/user/SetNickName',{
            data: {nickName: name},
            callback: function(res){
               var msg = '',sel='';
               if(res.IsSuccess){
                  msg = $.t('modify_success');
                  $('#nickname').val(name).addClass('hide');
                  that.parent().find('span').text(name).removeClass('hide');
                  that.addClass('hide').prev().removeClass('hide');
               }else{
                  msg = $.t('modify_fail');
                  sel='green';
               }
               obj.hideTips(msg,sel);
            }
         });
      },
      // 修改登陆/交易密码
      updatePwd: function(that,data,flag){
         var url = '/user/UpdatePassword';
         if(flag){
            url = '/user/UpdateTradePwd';
         }
         obj.ajaxFn(url,{
            data: data,
            callback: function(res){
               var msg = '';
               if(res.IsSuccess){
                  msg = $.t('pwd_success');
                  that.closest('.form-default')[0].reset();
               }else{
                  if(133==res.Code){
                     msg = $.t('origin_corrct');
                  }
               }
               that.prop('disabled',false).text($.t('submit'));
               obj.modShow('#mod-prompt');
               $('#mod-prompt .tips-txt').text(msg);
            }
         });
      },
      // 未/已绑定
      bindFn: function(sel,flag){
         var selector = '#set-'+sel+'>td:nth-child(2)',
            that = '#set-'+sel;
         if(flag){
            $(that).addClass('red').removeClass('green');
            $(selector).text($.t('not_bound'));
         }else{
            $(that).addClass('green').removeClass('red');
            $(selector).text($.t('is_bind'));
         }
      },
      // 修改操作
      showOpearate: function(list){
         var sel = '';
         for(var i =0;i<list.length;i++){
            sel = '#set-'+list[i];
            $(sel).find('.opearate-btn .hide').removeClass('hide').siblings().addClass('hide');
         }
      },
      // 原密码是否为空
      oldPwdFn: function(that){
         var val = that.val().trim(),flag = true;
         if(val && ''!=val){
            obj.formValidate('#oldPwd',null,true);
         }else{
            obj.formValidate('#oldPwd',$.t('password_null'));
            flag = false;
         }
         return flag;
      },
      // 密码是否一致
      twoPwdFn: function(that){
         var repwd = that.val().trim(),
            val = $('#newPwd').val().trim(),
            flag = true;

         if(val && ''!=val){
            if(val != repwd){
               obj.formValidate('#rePwd',$.t('consist'));
               flag = false;
            }else{
               obj.formValidate('#rePwd',null,true);
            }
         }else{
            flag = false;
         }
         return flag;
      },
      //愿密码与新密码是否一致
      oldNewPwdFn: function(that){
         var newpwd = that.val().trim(),
            val = $('#oldPwd').val().trim(),
            flag = true;
         if(val && ''!=val){
            if(val === newpwd){
               obj.formValidate('#newPwd','愿密码与新密码不能一致！');
               flag = false;
            }else{
               obj.formValidate('#newPwd',null,true);
            }
         }else{
            flag = false;
         }
         return flag;
      },
      // 图片截取
      cutImage: function(img,fitwidth,fitheight){
         var image = new Image();
         image.src=img.src;
         if(image.width >fitwidth && image.height>fitheight){ 
            if(image.width > image.height){ 
               img.height = fitheight; 
            }else{ 
               img.width = fitwidth;
            }
         }else{ 
            img.style.position = 'absolute'; 
            img.style.top = '50%'; 
            img.style.marginTop = -(img.height/2)+'px'; 
            img.style.left = '50%'; 
            img.style.marginLeft = -(img.width/2)+'px'; 
         } 
      },
      // 返回文字描述的日期
      getTxtDate: function(date){
         var curr = new Date().getTime(),
            diff = curr-date,
            minute = 60*1000,
            hour = 60*minute,
            day = 24*hour,
            month = 31*day,
            year = 12*month,
            r = 0;
            txt = $.t('just_now');
         if(diff>year){
            r = Math.floor(diff/year);
            txt = r+$.t('year_old');
         }else if(diff>month){
            r = Math.floor(diff/month);
            txt = r+$.t('month_ago');
         }else if(diff>day){
            r = Math.floor(diff/day);
            txt = r+$.t('day_ago');
         }else if(diff>hour){
            r = Math.floor(diff/hour);
            txt = r+$.t('hour_ago');
         }else if(diff>minute){
            r = Math.floor(diff/minute);
            txt = r+$.t('minute_ago');
         }
         return txt;
      },
      // 请求新闻列表
      newsList: function(){
         obj.ajaxFn('/news/GetMarketNews',{
            data: {marketId: '',page: tobj.pageObj.page,pageSize: tobj.pageObj.pageSize},
            callback: function(res){
               if(res.IsSuccess){
                  tobj.newsShow(res.Data.Items);
                  tobj.pageObj.page = res.Data.CurrentPage+res.Data.PageSize;
                  if(2<res.Data.TotalPage){
                     tobj.getMoreNews();
                     $('.more-btn').one('click',function(){
                        tobj.getMoreNews();
                     });
                  }else{
                     $('.more-btn').addClass('hide');
                  }
               }else{
                  msg = res.ErrorMsg+'，'+$.t("get_fail");
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').text(msg);
               }
            }
         });
      },
      // 展示新闻列表
      newsShow: function(list){
         var list=list||[],msg = '',html='',i=0,pic='./imgs/news.jpg',time,date,
            $items =$('.news-items'),$li = $items.find('li'),count = $li.length,that;
         for(i;i<list.length;i++){
            if(list[i].Cover){
               pic = list[i].Cover;
            }
            time = list[i].PublishTime;
            time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
            date = new Date(time);
            time = tobj.getTxtDate(date.getTime());
            html += '<li>\
                  <label><img src="'+pic+'" alt="pic" /></label>\
                  <div class="news-info">\
                     <a href="./news-detail.html?id='+list[i].Id+'" target="_blank">'+list[i].Title+'</a>\
                     <p>'+list[i].Intro+'</p>\
                     <label class="remark-tip"><span>'+(list[i].Author||$.t("anonymity"))+'</span><span></span><span>'+time+'</span></label>\
                  </div>\
               </li>';
         }
         $items.append(html);
         for(i=count;i<$('.news-items>li').length;i++){
            $('.news-items>li').eq(i).find('img').load(function(){
               console.log(this);
               tobj.cutImage(this,260,150);
            });
         }
      },
      // 更多新闻
      getMoreNews: function(){
         $(window).on('scroll',function(e){
            e = e || window.event;
            
            if(0<$(this).scrollTop()-tobj.beforeScrollTop){
               if($(document).scrollTop()>=Math.abs($(document).height()-$(window).height()-$('#footer').height())){
                  tobj.pageObj.page = tobj.pageObj.page+tobj.pageObj.pageSize;
                  tobj.newsList();
               }
            }
            tobj.beforeScrollTop = $(this).scrollTop();
         });
      },
      // 新闻详情
      newsDetail: function(id){
         if(id){
            obj.ajaxFn('/news/Detail',{
               data: {newsId: id},
               callback: function(res){
                  var msg = '',data,date,time='',html='';
                  if(res.IsSuccess){
                     data =res.Data;
                     time = data.PublishTime;
                     time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                     date = new Date(time);
                     html = data.Content;

                     $('.news-author').text(data.Author||$.t('anonymity'));
                     $('.news-title').text(data.Title);
                     $('.news-publishTime').text(date.format('yyyy-MM-dd hh:mm:ss'));
                     $('.news-content').html(html);
                  }else{
                     msg = res.ErrorMsg+'，'+$.t("get_fail");
                     obj.modShow('#mod-prompt');
                     $('#mod-prompt .tips-txt').text(msg);
                  }
               }
            });
         }
      },
      // 人民币充值列表
      getCnyRechargeList: function(){
         obj.ajaxFn('/Deposit/GetList',{
            data: {pageIndex: tobj.pageObj.page,pageSize: tobj.pageObj.pageSize},
            callback: function(res){
               var list = [],html='',time='',date,status='';
               if(res.IsSuccess){
                  list = res.Data.Items;
                  for(var i = 0;i<list.length;i++){
                     time = list[i].CreatedAt;
                     time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                     date = new Date(time);
                     //list[i].CreatedAt = date.format('yyyy-MM-dd');
                     if(1==list[i].Status){
                        status = $.t('pend');
                     }else if(2==list[i].Status){
                        status = $.t('stock');
                     }else if(3==list[i].Status){
                        status = $.t('apply_false');
                     }else if(4==list[i].Status){
                        status = $.t('apply_false');
                     }else if(5==list[i].Status){
                        status = $.t('canceled');
                     }
                     html +='<tr>\
                              <td>'+date.format('yyyy-MM-dd hh:mm:ss')+'</td>\
                              <td>'+list[i].PayWay+'</td>\
                              <td class="txt-price txt-right">'+list[i].Amount+'</td>\
                              <td>'+status+'</td>\
                              <td class="txt-price">'+list[i].Remark+'</td>\
                           </tr>';
                  }
                  $('#log-first>tbody').html(html);
                  tobj.page(null,res.Data.CurrentPage,res.Data.TotalPage,function(now,all){
                     tobj.pageObj.page = now;
                     tobj.getCnyRechargeList();
                  });
               }
            }
         });
      },
      // 人民币提现列表
      getCnyCashList: function(){
         obj.ajaxFn('/Withdraw/GetList',{
            data: {pageIndex: tobj.pageObj.page,pageSize: tobj.pageObj.pageSize},
            callback: function(res){
               var list = [],html='',time='',date,status='';
               if(res.IsSuccess){
                  list = res.Data.Items;
                  for(var i = 0;i<list.length;i++){
                     if(1==list[i].Status){
                        status = $.t("pend")+'（<a href="javascript:;" data-action="cancel" data-dId="'+list[i].Id+'">'+$.t("revocation")+'</a>）';
                     }else if(2==list[i].Status){
                        status = $.t('allocated');
                     }else if(3==list[i].Status){
                        status = $.t('processe');
                     }else if(4==list[i].Status){
                        status = $.t('stock');
                     }else if(5==list[i].Status){
                        status = $.t('fail');
                     }else if(5==list[i].Status){
                        status = $.t('canceled');
                     }
                     time = list[i].CreatedAt;
                     time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                     date = new Date(time);
                     html +='<tr>\
                              <td>'+date.format('yyyy-MM-dd hh:mm:ss')+'</td>\
                              <td>'+list[i].BankName+' '+list[i].Subbranch+'</td>\
                              <td><span class="txt-aName">'+(list[i].UserName||$.t("anonymity"))+'</span><span class="txt-aNum">'+list[i].AccountNumber+'</span></td>\
                              <td class="txt-price txt-right">'+list[i].Amount+'</td>\
                              <td>'+status+'</td>\
                              <td class="txt-price">'+list[i].Remark+'</td>\
                           </tr>';
                  }
                  $('#log-second>tbody').html(html);
                  tobj.page(null,res.Data.CurrentPage,res.Data.TotalPage,function(now,all){
                     tobj.pageObj.page = now;
                     tobj.getCnyCashList();
                  });
               }
            }
         });
      },
      // 虚拟币充值列表
      getCoinRechargeList: function(){
         obj.ajaxFn('/Deposit/GetCoinList',{
            data: {pageIndex: tobj.pageObj.page,pageSize: tobj.pageObj.pageSize},
            callback: function(res){
               var list = [],html='',time='',date,status='';
               if(res.IsSuccess){
                  list = res.Data.Items;
                  for(var i = 0;i<list.length;i++){
                     time = list[i].CreatedAt;
                     time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                     date = new Date(time);
                     if(1==list[i].Status){
                        status = $.t("pend")+'（<a href="javascript:;" data-action="quick" data-dId="'+list[i].Id+'" data-cId="'+list[i].CurrencyId+'" data-num="'+list[i].Volume+'">'+$.t("quick_arrive")+'</a>）';
                     }else if(2==list[i].Status){
                        status = $.t('confirmed');
                     }else if(3==list[i].Status){
                        status = $.t('Safely');
                     }else if(4==list[i].Status){
                        status = $.t("guaranty")+'<span data-action="question">?</span><div class="bail-tip"><i></i><span>'+$.t("refill")+'</span></div>';
                     }else if(5==list[i].Status){
                        status = $.t('returned');
                     }else if(6==list[i].Status){
                        status = $.t('canceled');
                     }
                     html +='<tr>\
                              <td>'+date.format('yyyy-MM-dd hh:mm:ss')+'</td>\
                              <td><i class="icon icon-circle"></i><span class="txt-currency">'+list[i].CurrencyName+'</span><span class="txt-sign">'+(list[i].CurrencyId).toUpperCase()+'</span></td>\
                              <td class="txt-price txt-right">'+list[i].Volume+'</td>\
                              <td>'+status+'</td>\
                              <td><span class="txt-price ok-num">'+list[i].Confirmation+'</span>/<span class="safe-num">'+list[i].Safe+'</span></td>\
                              <td><a href="'+list[i].ExplorerUrl+'" target="_blank">'+$.t("view_detail")+'</a></td>\
                           </tr>';
                  }
                  $('#log-third>tbody').html(html);
                  tobj.page('.pagination-list2',res.Data.CurrentPage,res.Data.TotalPage,function(now,all){
                     tobj.pageObj.page = now;
                     tobj.getCoinRechargeList();
                  });
               }
            }
         });
      },
      // 虚拟币提现列表
      getCoinCashList: function(){
         obj.ajaxFn('/Withdraw/GetCoinList',{
            data: {pageIndex: tobj.pageObj.page,pageSize: tobj.pageObj.pageSize},
            callback: function(res){
               var list = [],html='',time='',date;
               if(res.IsSuccess){
                  list = res.Data.Items;
                  for(var i = 0;i<list.length;i++){
                     time = list[i].CreatedAt;
                     time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                     date = new Date(time);
                     if(1==list[i].Status){
                        status = $.t('pend');
                     }else if(2==list[i].Status){
                        status = $.t('allocated');
                     }else if(3==list[i].Status){
                        status = $.t('processe');
                     }else if(4==list[i].Status){
                        status = $.t('stock');
                     }else if(5==list[i].Status){
                        status = $.t('verify_fail');
                     }else if(6==list[i].Status){
                        status = $.t('deal_fail');
                     }else if(7==list[i].Status){
                        status = $.t('canceled');
                     }else if(8==list[i].Status){
                        status = $.t('decided');
                     }
                     html +='<tr>\
                              <td>'+date.format('yyyy-MM-dd hh:mm:ss')+'</td>\
                              <td><i class="icon icon-circle"></i><span class="txt-currency">'+list[i].CurrencyName+'</span><span class="txt-sign">'+(list[i].CurrencyId).toUpperCase()+'</span></td>\
                              <td class="txt-price txt-right">'+list[i].TxAmount+'</td>\
                              <td>'+list[i].Address+'</td>\
                              <td>'+status+'</td>\
                              <td><a href="'+list[i].ExplorerUrl+'" target="_blank">'+$.t("view_detail")+'</a></td>\
                           </tr>';
                  }
                  $('#log-fourth>tbody').html(html);
                  tobj.page('.pagination-list2',res.Data.CurrentPage,res.Data.TotalPage,function(now,all){
                     tobj.pageObj.page = now;
                     tobj.getCoinCashList();
                  });
               }
            }
         });
      },
      // 申请担保
      toMortgage: function(dId,cId,that){
         obj.ajaxFn('/Deposit/Mortgage',{
            data:{depositId: dId,currencyId: cId},
            callback: function(res){
               that.prop('disabled',false);
               if(res.IsSuccess){
                  obj.modHide('#mod-bail');
                  tobj.getCoinRechargeList();
               }else{
                  obj.modShow('#mod-prompt2');
                  $('#mod-prompt2>.tips-txt').text(res.ErrorMsg+'，'+$.t("get_fail"));
               }
            }
         });
      },
      // 获取担保金额
      getExchange: function(cId,amount){
         var tId = $('.currency-list>li.on').text().toLowerCase();
         if(0!=tobj.exchange[tId]){
            $('#mod-bail #bail-num').val(amount*tobj.exchange[tId]);
            return false;
         }
         obj.ajaxFn('/Currency/Exchange',{
            data: {currencyId: cId,targetCurrencyId: tId,amount: amount},
            callback: function(res){
               if(res.IsSuccess){
                  tobj.exchange[tId] = res.Data;
                  $('#mod-bail #bail-num').val(amount*res.Data);
               }else{
                  obj.modShow('#mod-prompt2');
                  $('#mod-prompt2>.tips-txt').text(res.ErrorMsg+'，'+$.t("get_fail"));
               }
            }
         });
      },
      // 撤销人民币提现
      cancelCnyCash: function(id,that){
         obj.ajaxFn('/Withdraw/Repeal',{
            data:{id: id},
            callback: function(res){
               that.prop('disabled',false);
               if(res.IsSuccess){
                  obj.modHide('#mod-prompt2');
                  tobj.getCnyCashList();
               }else{
                  obj.modShow('#mod-prompt2');
                  $('#mod-prompt2>.tips-txt').text(res.ErrorMsg+'，'+$.t("get_fail"));
               }
            }
         });
      },
      // 登陆日志列表
      getLoginLog: function(){
         obj.ajaxFn('/user/GetLogs',{
            data: {type: 1,page: tobj.pageObj.page,pageSize: tobj.pageObj.pageSize},
            callback: function(res){
               var list =[],html='';
               if(res.IsSuccess){
                  list = res.Data;
                  for(var i =0;i<list.length;i++){
                     var log = JSON.parse(list[i].Log);
                     tobj.logList.push({id: list[i].Id,ip: log.IP});
                     log.Location = log.Location.trim();
                     html +='<tr>\
                           <td>'+log.Time+'</td>\
                           <td>'+log.IP+'</td>\
                           <td>'+log.Location+'</td>\
                        </tr>';
                  }
                  $('.log-table>tbody').append(html);
                  tobj.getGeographicalPos();
               }else{
                  msg = res.ErrorMsg+'，'+$.t("get_fail");
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').text(msg);
               }
            }
         });
      },
      // 获取地理位置
      getGeographicalPos: function(){
         var list = tobj.logList;
         for(var i =0;i<list.length;i++){
            $.ajax({
               url: 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip='+list[i].ip+'',
               async: false,
               type: "GET",
               dataType: "jsonp",
               error: function(){
                  var html = $.t('intranet');
                  if(-1!=remote_ip_info.ret){
                     html ='<span class="province">'+remote_ip_info.country+'</span>\
                           <span class="city">'+remote_ip_info.province+'</span>\
                           <span class="area">'+remote_ip_info.city+'</span>';
                  }
                  $('.log-table>tbody>tr').eq(i).find('td:last-child').html(html);
               }
            });
         }
      },
      // 获取挂单
      getOrders: function(){
         var index = $('.tab-change>li.on').index();
         if(0==index){
            tobj.getOrderList();
         }else{
            tobj.getOrderList(2);
         }
      },
      // 撤销订单
      cancelOrder: function(){
         obj.ajaxFn('/order/CancelOrder',{
            data: tobj.cancelObj,
            callback: function(res){
               var type = tobj.cancelObj.category,msg = '';
               if(res.IsSuccess){
                  if(1==type){
                     $('.order-1th>tbody>tr').each(function(){
                        var _id = $(this).find('a').attr('data-id');
                        if(tobj.cancelObj.orderId){
                           $(this).remove();
                           return false;
                        }
                     });
                  }else{
                     $('.order-2th>tbody>tr').each(function(){
                        var _id = $(this).find('a').attr('data-id');
                        if(tobj.cancelObj.orderId){
                           $(this).remove();
                           return false;
                        }
                     });
                  }
                  tobj.getOrderList(type);
                  tobj.getMarketId();
                  //obj.modHide('#mod-buz');
               }else{
                  msg = res.ErrorMsg||$.T('cancellation');
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
                  tobj.getOrderList(type);
                  tobj.getMarket();
               }else{
                  msg = res.ErrorMsg||$.T('cancellation');
                  $('#mod-buz .error-tips').html(msg);
               }
            }
         });
      },
      // 获取成交记录列表
      getTradeList: function(){
         var data = {marketId: tobj.marketId,pageIndex: tobj.pageObj.page,pageSize: tobj.pageObj.pageSize};
         if(!data.marketId){
            delete data.marketId;
         }
         obj.ajaxFn('/Market/GetTradeList',{
            data: data,
            callback: function(res){
               var list = [],html='',sel='',mk = (tobj.marketId.toUpperCase()).split('_');
               if(res.IsSuccess){
                  list = res.Data.Items;
                  for(var i=0;i<list.length;i++){
                     sel = list[i].IsAsk?'green':'red';
                     var time = list[i].CreateTime;
                     time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
                     var date = new Date(time);
                     html += '<tr class="'+sel+'">\
                              <td>'+date.format("yyyy-MM-dd hh:mm:ss")+'</td>\
                              <td><span>'+mk[0]+'</span>/<span>'+mk[1]+'</span></td>\
                              <td>'+(list[i].IsAsk?$.t("sell"):$.t("buy"))+'</td>\
                              <td><span>'+list[i].Volume+'</span>(<span>'+mk[1]+'</span>)</td>\
                              <td><span>'+list[i].Price+'</span>(<span>'+mk[0]+'</span>)</td>\
                              <td><span>'+list[i].Amount+'</span>(<span>'+mk[0]+'</span>)</td>\
                              <td><span>'+(list[i].IsAsk?list[i].AskFee:list[i].BidFee)+'</span>(<span>'+(list[i].IsAsk?mk[0]:mk[1])+'</span>)</td>\
                           </tr>';
                  }
                  if(0===list.length){
                     html = '<tr><td colspan="7" style="background-color:#f1f1f1; text-align:center;">'+$.t("no_data")+'</td></tr>';
                  }
                  $('.table-order>tbody').html(html);
                  if(res.Data.TotalPage > 1){
                     $(".pagination-list").removeClass('hide');
                     tobj.pageObj.page = res.Data.CurrentPage;
                  
                     tobj.page(null,tobj.pageObj.page,res.Data.TotalPage,function(now,all){
                        tobj.pageObj.page = now;
                        tobj.getTradeList();
                     });
                  }else{
                     $(".pagination-list").addClass('hide');
                  }
            
               }
            }
         });
      },
      // 交易分析
      getTradeProfit: function(){
         var data = {marketId: tobj.marketId};
         if(!data.marketId){
            delete data.marketId;
         }
         obj.ajaxFn('/Market/GetTradeProfit',{
            data: data,
            callback: function(res){
               var data ={},hp=0,fp=0,tp=0,rate=0,rate2=0,rate3=0;
               if(res.IsSuccess){
                  data = res.Data;
                  $('.askAvgPrice').text(data.AskAvgPrice);
                  $('.askVolume').text(data.AskVolume);
                  $('.askAmount').text(data.AskAmount);
                  $('.bidAvgPrice').text(data.BidAvgPrice);
                  $('.bidVolume').text(data.BidVolume);
                  $('.bidAmount').text(data.BidAmount);
                  hp=data.HistoryProfit;
                  if(0<=hp){
                     hp='+'+hp;
                  }else{
                     hp='-'+hp;
                  }
                  $('.historyProfit').text(hp);
                  rate = data.HistoryProfitRate;
                  if(0<=rate){
                     rate='+'+rate+'%';
                  }else{
                     rate='-'+rate+'%';
                  }
                  $('.historyProfitRate').text(rate);
                  $('.heldAvgPrice').text(data.HeldAvgPrice);
                  $('.heldVolume').text(data.HeldVolume);
                  $('.heldAmount').text(data.HeldAmount);
                  $('.marketPrice').text(data.MarketPrice);
                  $('.marketAmount').text(data.MarketAmount);
                  fp = data.FloatProfit;
                  if(0<=fp){
                     fp='+'+fp;
                  }else{
                     fp='-'+fp;
                  }
                  $('.floatProfit').text(fp);
                  rate2 = data.FloatProfit;
                  if(0<=rate2){
                     rate2='+'+rate2+'%';
                  }else{
                     rate2='-'+rate2+'%';
                  }
                  $('.floatProfitRate').text(rate2);
                  tp = data.TotalProfit;
                  if(0<=tp){
                     tp='+'+tp;
                  }else{
                     tp='-'+tp;
                  }
                  $('.totalProfit').text(tp);
                  rate3 = data.TotalProfitRate;
                  if(0<=rate3){
                     rate3='+'+rate3+'%';
                  }else{
                     rate3='-'+rate3+'%';
                  }
                  $('.totalProfitRate').text(rate3);
               }
            }
         });
      },
      //获取限价设置
      getLimitSet:function(){
         var data = {key:'MarketOrderPriceLimit'};
         obj.ajaxFn('/user/GetUserConfig',{
            data: data,
            callback: function(res){
               if(res.IsSuccess){
                  if(res.Data){
                     $('.slide-box').css('display','block');
                     var flag = res.Data;
                     if(flag.indexOf('OFF') != -1&&flag!='OFF,'){
                        $('.slide-box').addClass('off');
                        $('input').prop('disabled',true);
                        $('button').prop('disabled',true);
                        $('button').css('background','#b8c3cc');
                        flag = flag.split(',')[1];
                        $('.price').val(flag*100);
                     }else if(flag=='OFF,'){
                        $('.slide-box').css('display','none');
                     }else{
                        $('.slide-box').removeClass('off');
                        flag = flag.split(',')[1];  
                        $('.price').val(flag*100);
                     }
                  }else{
                     $('.slide-box').css('display','none');
                     // $('.slide-box').addClass('off');
                     // $('input').prop('disabled',true);
                     // $('button').prop('disabled',true);
                     // $('button').css('background','#b8c3cc');
                  }
               }else{
                  msg = res.ErrorMsg||$.T('cancellation');
                  $('#mod-buz .error-tips').html(msg);
               }
            }
         });
      },
      // 创建open key
      createOpenKey: function(data,that){
         obj.ajaxFn('/user/CreateOpenKey',{
            data: data,
            callback: function(res){
               var msg='';
               if(res.IsSuccess){
                  msg='创建成功！';
                  obj.modShow('#mod-prompt');
                  $('#mod-prompt .tips-txt').html(msg);
                  $('#ok-tip').addClass('create');
                  $('#ok-tip').on('click',function(){
                     var that = $(this),
                        $api=$('.api-box.hide');
                     if(that.hasClass('create')){
                        $api.removeClass('hide').siblings('.api-box').addClass('hide');
                        that.removeClass('create');
                        tobj.getOpenKeyList(data.tradePassword);
                     }
                  });
               }else{
                  if(502==res.Code){
                     msg='open key超过个人最大限量';
                  }else if(1002==res.Code){
                     msg=$.t('trade_error');
                  }
                  obj.hideTips(msg,'green');
               }
               that.prop('disabled',false).text('创建');
            },
            errorCallback: function(){
               that.prop('disabled',false).text('创建');
            }
         });
      },
      // 获取open key列表
      getOpenKeyList: function(pwd){
         obj.ajaxFn('/user/GetOpenKeyList',{
            data: {tradePassword: pwd},
            callback: function(res){
               var msg='',$box=$('.api-box'),html='',tmp='',list=[],time,date;
               if(res.IsSuccess){
                  list = res.Data;
                  tobj.ipList=list;
                  tobj.showIpList();
                  obj.modHide('#mod-operate');
               }else{
                  if(1002==res.Code){
                     msg='交易密码错误！';
                  }
                  obj.hideTips(msg,'green');
               }
            }
         });
      },
      // 展示ip列表
      showIpList: function(){
         var $box=$('.api-box'),html='',tmp='',time,date;
         list = tobj.ipList;
         if(0<list.length){
            $box.eq(0).addClass('hide').end().eq(1).removeClass('hide');
            for(var i = 0;i<list.length;i++){
               for(var j = 0;j<(list[i].IPs&&list[i].IPs.length);j++){
                  tmp+='<span class="ip-item">'+list[i].IPs[j]+'</span>';
               }
               time=list[i].CreateTime;
               time = parseInt(time.substring(time.indexOf('(')+1,time.lastIndexOf(')')));
               date = new Date(time);
               date= date.format('yyyy-MM-dd hh:mm:ss').split(' ');
               html += '<tr data-id="'+list[i].Id+'">\
                     <td><span class="ip-item">'+date[0]+'</span><span class="ip-item">'+date[1]+'</span></td>\
                     <td>'+tobj.userId+'</td>\
                     <td>'+list[i].Label+'</td>\
                     <td>'+list[i].Id+'</td>\
                     <td>'+list[i].Secretkey+'</td>\
                     <td>'+tmp+'</td>\
                     <td><i class="icon icon-edit" data-type="edit" data-i18n="[title]edit"></i><i class="icon icon-del" data-type="del" data-i18n="[title]del"></i></td>\
                  </tr>';
            }
         }else{
            html='<tr><td colspan="7" style="text-align: center;">'+$.t('no_data')+'</td></tr>';
            $box.eq(0).removeClass('hide').end().eq(1).addClass('hide');
            $box.eq(0).find('form')[0].reset();
         }
         $('.api-table>tbody').html(html);
      },
      // 删除Open Key
      delOpenKey: function(data,that){
         obj.ajaxFn('/user/RemoveOpenKey',{
            data: data,
            callback: function(res){
               var msg='';
               if(res.IsSuccess){
                  msg="删除成功！";
                  tobj.getOpenKeyList(data.tradePassword);
                  obj.modHide('#mod-operate');
                  obj.hideTips(msg);
               }else{
                  if(1002==res.Code){
                     msg=$.t('trade_error');
                     that.parent().find('.error').removeClass('hide').html($.t('trade_error'));
                  }
               }
               that.removeClass('del');
               that.prop('disabled',false).text($.t('certain'));
            },
            errorCallback: function(){
               that.removeClass('del');
               that.prop('disabled',false).text($.t('certain'));
            }
         });
      },
      // Open Key绑定IP
      bindOpenKeyIp: function(data,that){
         obj.ajaxFn('/user/OpenKeyBindIp',{
            data: data,
            callback: function(res){
               var msg='';
               if(res.IsSuccess){
                  msg="绑定成功！";
                  tobj.getOpenKeyList(data.tradePassword);
                  obj.modHide('#mod-edit');
                  obj.hideTips(msg);
               }else{
                  if(1002==res.Code){
                     msg=$.t('trade_error');
                     that.parent().find('.error').removeClass('hide').html($.t('trade_error'));
                  }
               }
               that.prop('disabled',false).text($.t('certain'));
            },
            errorCallback: function(){
               that.prop('disabled',false).text($.t('certain'));
            }
         });
      }
      //提交限价设置
      // setLimitSet:function(){
      //    obj.ajaxFn('/user/SetUserConfig',{
      //       data: data,
      //       callback: function(res){

      //          if(res.IsSuccess){
      //             console.log(res);
      //          }else{
      //             msg = res.ErrorMsg||$.T('cancellation');
      //             $('#mod-buz .error-tips').html(msg);
      //          }
      //       }
      //    });
      // },
   };
   if(0!=$('.my-order').length){
      tobj.getBaseMarketList();
      if(tobj.getMarketId()){
         tobj.getOrders();
         tobj.timer = setInterval(function(){
            tobj.getOrders();
         },1000*30);
      }
      // 撤销挂单
      $('.table-order').on('click','>tbody>tr>td>a',function(){
         var _id = $(this).attr('data-id'),
            _type = $(this).attr('data-type'),
            _order = $(this).attr('data-order'),
            $td = $('.table-order.show').find('tr>td').eq(1).text().toLowerCase(),
            marketId;
         $('#to-addr').attr('data-sign','cancel');
         if(-1!=$td.indexOf('/')){
            marketId=$td.split('/');
            tobj.cancelObj = {marketId: marketId[0]+'_'+marketId[1],category: _type,orderType: _order,orderId: _id,tradePassword: ''};
            tobj.cancelOrder();
         }else{
            obj.hideTips($.t('market_id'),'green');
         }
         //tobj.isNeedPwd();
      });
      // 批量撤销挂单
      $('.table-order').on('click','>thead>tr>th>.batch-back',function(){
         var that = $(this),
            category = that.attr('data-type'),
            $tr=$('.table-order.show>tbody>tr');
         if(0!=$tr.length){
            tobj.cancelAllObj = {marketId: tobj.marketId,orderCategory: category,tradePassword: ''};
            tobj.cancelAllOrder();
         }else{
            obj.hideTips($.t('pend_order'),'green');
         }
         //tobj.isNeedPwd(1);
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
            tobj.setTradePwdType($form,data,'modify');
         });
      }
   }else if(0!=$('.order-history').length){
      tobj.getBaseMarketList();
      $('.check').on('click',function(){
         var table = $('.actionArrow');
         if(table.css('display')=='none'){
            table.css('display','table-row');
         }else{
            table.css('display','none');
         }
      })
      // if(tobj.getMarketId()){
      //    tobj.getOrders();
      //    tobj.timer = setInterval(function(){
      //       tobj.getOrders();
      //    },1000*30);
      // }
   }else if(0!=$('.my-realname').length){
      if(0!=tobj.flag){
         tobj.getCertification();
      }
      if(!obj.account){
         location.href = './login.html';
      }
      // 提交认证信息
      $('#submit-info').on('click',function(){
         var that = $(this),data = {},type = 1,
            _name = $('#realname').val().trim(),
            _num = $('#certificate-num').val().trim(),
            _cty = $('.dropdown-txt>span').text(),
            _ctyNum = $('.dropdown-list>li.on').attr('data-value'),
            list = [],urls={},flag=true;

         if(!_cty){
            flag=false;
         }
         if(!_name){
            flag =false;
         }
         if(!_num){
            flag=false;
         }
         if(flag){
            that.prop('disabled',true);
            _ctyNum = _ctyNum.substr(1);
            data = {country: _ctyNum,countryName: _cty,cardNumber: _num,name: _name};
            if(0!=tobj.imgs.length){
               list = tobj.imgs;
               data.images = [];
               for(var i =0;i<list.length;i++){
                  urls[list[i].name] = list[i].url;
               }
               for(var i in urls){data.images.push(urls[i]);}
               type = 2;
            }
            tobj.applyCertification(data,that,type);
         }else{
            obj.hideTips($.t('to_complate'),'green');
         }
      });

      // 图片上传
      $('.upload-pic').on('click','label',function(){
         var that = $(this);
         that.closest('.upload-pic').find('li').each(function(){
            $(this).find('label').removeClass('on');
         })
         that.addClass('on');
      });
      $('#upload-name').on('change',function(){
         var files = $(this).prop('files')[0],
            that = $(this),allowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

         if(files){
            if(-1==allowed.indexOf(files.type)){
               obj.modShow('#mod-prompt');
               $('#mod-prompt .tips-txt').text($.t('format'));
            }else{
               obj.ajaxUpload($('#upload-img'),{
                  callback: function(res){
                     if('SUCCESS'==res.state){
                        $('.upload-pic>li>label.on').css('background','url('+res.url+') center no-repeat');
                        tobj.imgs.push({name: files.name,url: res.url});
                     }
                  }
               });
            }
         }
      });
   }else if(0!=$('.my-gugValidate').length){
      tobj.getOtpSecretKey();
      tobj.getAuthTypes();
      obj.submitForm('.my-gugValidate','#otp-btn');
      // opt认证
      $('#otp-btn').on('click',function(){
         var that = $(this),data={},
            _captcha = $('#otp-captcha').val().trim(),
            _code = $('#otp-code').val().trim();

         data = {code: _code,captcha: _captcha};
         tobj.bindOtp(data,that);
         that.prop('disabled',true);
         that.text($.t('commit'));
      });
   }else if(0!=$('.my-safeStrategy').length){
      tobj.getTradePwdType(0);
      tobj.getUserCofig();
   }else if(0!=$('.my-safeset').length){
      tobj.getTradePwdType(1);
      tobj.getAuthType(1);
      tobj.isPhoneRegistered();
   }else if(0!=$('.my-limitset').length){
      tobj.getLimitSet();
      $('.btn-submit').on('click',function(){
         var data = {key: 'MarketOrderPriceLimit',value: ''},
             box = $('.slide-box'); 
             val = $('.price').val()/100;
         if(val<=0){
            obj.hideTips($.t('limit_set'),'green');
            return;
         }
         data.value = 'ON,'+val;
         tobj.setUserInfo(data,'limit');
      });
   }else if(0!=$('.modify-box').length){
      if(0!=$('.my-buzPwd').length){tobj.getTradePwdType(2);}
      obj.submitForm('.login-form','.modify-btn');
      $('.modify-btn').on('click',function(){
         var that = $(this),
            oldPwd=$('#oldPwd').val(),
            newPwd=$('#newPwd').val(),
            type = that.attr('data-type'),flag = false,data = {},
            lv = obj.pwdValidate(newPwd);
         $('#rePwd').blur();
         $('#oldPwd').blur();
         if(tobj.oldPwdFn($('#oldPwd'))&&tobj.twoPwdFn($('#rePwd'))){
            if(1===lv){
               obj.formValidate('#newPwd',$.t('Registration'));
            }else{
               that.prop('disabled',true).text($.t('commit'));
               data = {oldPassword: oldPwd.trim(),newPassword: newPwd.trim()};
               if('buz'==type){
                  flag = true;
               }
               tobj.updatePwd(that,data,flag);
            }
         }
      });

      // 原密码判空
      $('#oldPwd').on('blur',function(){
         tobj.oldPwdFn($('#oldPwd'));
      });
      //愿密码与新密码是否一致
      $('#newPwd').on('blur',function(){
         tobj.oldNewPwdFn($('#newPwd'));
      });
      // 重复密码判空
      $('#rePwd').on('blur',function(){
         tobj.twoPwdFn($('#rePwd'));
      });
   }else if(0!=$('.my-userinfo').length){
      tobj.getUserInfo();
      // 修改昵称
      $('.modify-cg').on('click',function(e){
         e = e || window.event;
         e.stopPropagation();
         e.preventDefault();
         var that = $(this),
            $input = that.parent().find('#nickname');

         $input.removeClass('hide');
         that.parent().find('span').addClass('hide');
         that.addClass('hide').next().removeClass('hide');
      });
      // 提交确认
      $('#nickname').on('keypress',function(e){
         e = e || window.event;
         if((e.keyCode && 13==e.keyCode) || (e.which && 13==e.which)){
            $('.modify-ok').trigger('click');
         }
      });
      // 提交确认
      $('.modify-ok').on('click',function(e){
         e = e || window.event;
         e.stopPropagation();
         e.preventDefault();

         var that = $(this),
            _val = that.parent().find('#nickname').val().trim(),
            $label = that.parent().find('label');

         if(_val && ''!=_val){
            $label.removeClass('show');
            tobj.modifyNickName(that,_val);
         }else{
            $label.addClass('show');
         }
      });
      $('#nickname').on('click',function(e){
         e = e || window.event;
         e.stopPropagation();
         e.preventDefault();
      });
      $('#nickname').on('input',function(){
         var val = $(this).val().trim(),
            $label = $(this).parent().find('label');
         setTimeout(function(){
            if(val && ''!=val){
               $label.removeClass('show');
            }
         },500);
      });
      $(window).on('click',function(){
         var that = $('.modify-ok');
         $('#nickname').addClass('hide');
         that.parent().find('span').removeClass('hide');
         that.addClass('hide').prev().removeClass('hide');
      });
   }else if(0!=$('.news-list').length){
      tobj.newsList();
   }else if(0!=$('.news-detail').length){

      tobj.newsDetail(obj.getParam().id||1);
   }else if(0!=$('.my-loginLog').length){
      tobj.getLoginLog();
      //tobj.
   }else if(0!=$('.recharge-cash').length){
      
      tobj.getCnyRechargeList();
      $('.table-log').on('click','>tbody>tr>td>[data-action]',function(e){
         var that = $(this),
            type = that.attr('data-action'),
            dId = that.attr('data-dId'),
            cId = that.attr('data-cId'),
            num = that.attr('data-num');
         e = e|| window.event;
         e.stopPropagation();
         e.preventDefault();

         if('question'==type){
            that.next().addClass('show');
            $(window).one('click',function(){
               $('.bail-tip').removeClass('show');
            });
         }else if('quick'==type){
            obj.modShow('#mod-bail');
            tobj.getExchange(cId,num);
            $('#to-bail').one('click',function(){
               var that = $(this);
               that.prop('disabled',true);
               tobj.toMortgage(dId,cId,that);
            });
            $('.tab-change').one('click','>li',function(){
               var that = $(this);
               tobj.getExchange(cId,num);
            });
         }else if('cancel'==type){
            obj.modShow('#mod-prompt');
            $('#to-cancel').one('click',function(){
               var that = $(this);
               that.prop('disabled',true);
               tobj.cancelCnyCash(dId,that);
            });
         }
      });

      // 充值提现记录tab
      $('.tab-logs').on('click','>li',function(){
         var that = $(this),
            index = that.index(),
            $box = that.closest('.log-table'),
            $log_table = null,
            $table = $box.find('.table-log');

         if(!that.hasClass('on')){
            that.addClass('on').siblings('li').removeClass('on');
            $table.eq(index).removeClass('hide').siblings('.table-log').addClass('hide');
            $log_table = that.closest('.other-tables').find('.log-table.show');
            if(0!=index){
               if(0!=$log_table.index()){
                  tobj.getCoinCashList();
               }else{
                  tobj.getCnyCashList();
               }
            }else{
               if(0!=$log_table.index()){
                  tobj.getCoinRechargeList();
               }else{
                  tobj.getCnyRechargeList();
               }
            }
         }
      });
   }else if(0!=$('.my-turnover').length){
      tobj.getBaseMarketList();
      if(tobj.getMarketId()){
         tobj.getTradeProfit();
         tobj.getTradeList();
      }
   }else if(0!=$('.my-modify').length){
      tobj.getUserInfo();
      tobj.isNeedPwd(2);
      $('#create-key').on('click',function(){
         var that = $(this),data={},
            _tag = $('#tag').val().trim(),
            _pwd=$('#buzPwd').val().trim(),
            _ip=$('#ip').val().trim(),
            isValid=obj.validate(obj.reg_ip,_ip),
            flag=true;

         data={lable: _tag,limits: [0],tradePassword: _pwd,ip: _ip};
         if(!_tag||!_pwd){
            flag=false;
         }
         if(_ip){
            if(!isValid){
               flag=false;
            }
         }
         $('.box-input>input[type="text"],.box-input>input[type="password"]').trigger('blur');
         if(flag){
            that.prop('disabled',true).text('创建中'+'...');
            tobj.createOpenKey(data,that);
         }
      });
      $('.box-input,.mod-form').on('blur','input[type="text"],input[type="password"]',function(){
         var that = $(this),msg='',_ips=[],
            $error=that.parent().find('.error');
         if(!that.val()){
            $error.removeClass('hide');
         }else{
            $error.addClass('hide');
            if('ip'==that.prop('id')){
               _ips=that.val().split(',');
               for(var i=0;i<_ips.length;i++){
                  if(!obj.validate(obj.reg_ip,_ips[i])){
                     msg ='ip格式错误！';
                     $error.removeClass('hide');
                     break;
                  }
               }
               $error.html(msg);
            }
         }
      });

      $('#btn-operate').on('click',function(){
         var that = $(this),
            $form = that.closest('.mod-form'),
            $error=that.parent().find('.error'),
            _pwd=$form.find('#o-buzPwd').val().trim(),data={},
            flag=true;

         if(!_pwd){
            $error.removeClass('hide');
            flag=false;
         }
         if(flag){
            data = {id: tobj.ip_id,tradePassword: _pwd};
            if(that.hasClass('del')){
               tobj.delOpenKey(data,that);
            }else{
               //tobj.showIpList();
               tobj.getOpenKeyList(_pwd);
            }
         }
      });
      $('#to-edit').on('click',function(){
         var that = $(this),
            $form=$('.mod-form'),
            _pwd=$form.find('#e-buzPwd').val().trim(),
            _ip=$form.find('#bindIp').val().trim(),data={},
            flag= true;

         $('.mod-form input[type="text"],.mod-form input[type="password"]').trigger('blur');
         if(!_pwd){
            flag=false;
         }
         if(flag){
            data = {ip: _ip,id: tobj.ip_id,tradePassword: _pwd};
            tobj.bindOpenKeyIp(data,that);
         }
      });
      $('.api-table').on('click','[data-type]',function(){
         var that = $(this),
            type=that.data('type'),
            _id=that.closest('tr').data('id'),tmp='';

         tobj.ip_id=_id;
         if('edit'==type){
            for(var i = 0;i<tobj.ipList.length;i++){
               if(_id==tobj.ipList[i].Id){
                  tmp = tobj.ipList[i].IPs&&tobj.ipList[i].IPs.join(',');
                  break;
               }
            }
            $('#bindIp').val(tmp);
            obj.modShow('#mod-edit');
         }else if('del'==type){
            $('#mod-operate .mod-title>span').html('确认删除API？');
            $('#mod-operate #btn-operate').addClass('del');
            obj.modShow('#mod-operate');
         }
      });
      $(document).on('keypress',function(e){
         e=e||window.event;
         var that = $(e.target),
            $form=that.closest('form'),
            type=$form.data('form');
         if((e.keyCode && 13==e.keyCode) || (e.which && 13==e.which)){
            if(1==type){
               $('#create-key').trigger('click');
            }else if(2==type){
               $('#to-edit').trigger('click');
            }else if(3==type){
               $('#btn-operate').trigger('click');
            }
         }
      });
   }
   if(0!=$('.news-list').length || 0!=$('.news-detail').length){
      $(window).on('scroll',function(e){
         e = e || window.event;
         if(50<$(this).scrollTop()){
            $('.goback').addClass('show');
         }else{
            $('.goback').removeClass('show');
         }
      });
   }
   // 下拉
   $('.other-wrap').on('click','.dropdown-txt',function(e){
      e = e || window.event;
      e.stopPropagation();
      e.preventDefault();

      if($(this).hasClass('show')){
         $(this).removeClass('show').next().removeClass('show');
      }else{
         $(this).addClass('show').next().addClass('show');
      }
      $('.search-box>ul').removeClass('show');
   });

   // 选择市场
   $('.other-wrap').on('click','.dropdown-list>li',function(e){
      e = e || window.event;
      e.stopPropagation();
      e.preventDefault();

      var that = $(this), 
         _span = that.find('span').text(),
         $box = that.closest('.dropdown-box'),
         $input = $box.find('.search-box>input');
      if(that.hasClass('on')){return false;}
      that.addClass('on').siblings().removeClass('on');
      that.closest('.dropdown-box').find('.dropdown-txt').html('<span>'+_span+'</span><i class="icon icon-down2"></i>');
      that.parent().removeClass('show');
      that.parent().prev().removeClass('show');
      tobj.getBaseMarketList(that.text().toLowerCase());
      if($input.val()){
         tobj.marketId = (that.text()+'_'+$input.val()).toLowerCase();
      }
      if(0!=$('.my-order').length){
         tobj.getOrders();
      }else if(0!=$('.my-turnover').length){
         tobj.getTradeProfit();
         tobj.getTradeList();
      }
   });

   // 检索中
   $('.other-wrap').on('input','.search-box>input',function(){
      var that = $(this),
         $next = that.next(),
         val = that.val();
      if(!!val){
         $next.addClass('show');
      }else{
         $next.removeClass('show');
      }
      $('.dropdown-list').removeClass('show');
      tobj.getMarketList(that,val);
   });
   // 选中检索内容
   $('.other-wrap').on('click','.search-box>ul>li',function(e){
      e = e || window.event;
      e.stopPropagation();
      e.preventDefault();

      var that = $(this),
         $box = that.closest('.dropdown-box'),
         val = that.find('.search-txt').text(),
         $input = that.closest('.search-box').find('input');
      $input.val(val);
      that.parent().removeClass('show');
      if($input.val()){
         tobj.marketId = ($box.find('.dropdown-txt>span').text()+'_'+$input.val()).toLowerCase();
      }
      if(0!=$('.my-order').length){
         tobj.getOrders();
         /*if('限价挂单'==$('.tab-change>li.on').text()){
            tobj.getOrderList();
         }else{
            tobj.getOrderList(2);
         }*/
      }else if(0!=$('.my-turnover').length){
         tobj.getTradeProfit();
         tobj.getTradeList();
      }
   });

   // 交易类型选择
   $('.operate-option').on('click',function(){
      var _sign = parseInt($(this).attr('data-sign')),
         $li = $(this).closest('ul').parent();
      if(!!_sign){
         if($li.hasClass('show')){
            $li.removeClass('show');
         }else{
            $li.addClass('show');
         }
      }
   });
   $('.operate-radio').on('click','>li>button',function(){
      var _txt = $(this).prev().text(),
         $radio = $(this).closest('.operate-radio'),
         that = $(this);

      obj.modShow('#mod-setTradeType');
      // 设置交易类型
      $('#set-type').one('click',function(){

         var val = $(this).closest('form').find('#trade-pwd').val().trim(),
            data = {password: val,auditType: that.attr('data-val')};
         tobj.setTradePwdType(that,data);
         obj.modHide('#mod-setTradeType');
      });
   });

   // 切换谷歌/手机验证
   $('.code-tab').on('click',function(){
      var _type = $(this).attr('data-type'),
         $box = $(this).closest('.form-group');
      $box.addClass('hide').removeClass('on').siblings().removeClass('hide').addClass('on');;
   });
   // 倒计时
   $('.send-code').on('click','>button',function(){
      var that = $(this),
         sign = that.attr('data-sign'),
         flag = false;

      if('email'==sign){
         flag = true;
      }
      obj.sendPhoneCaptcha(that,flag,function(msg){
         if(msg && ''!=msg){
            obj.modShow('#mod-prompt');
            $('#mod-prompt .tips-txt').html(msg);
         }
      });
   });
   // 解除谷歌绑定
   $('.unbind-btn').on('click',function(){
      var that = $(this),
         sign = that.attr('data-sign'),
         $box = that.closest('.mod-box'),
         $form = $box.find('.mod-form'),
         $input = $form.find('.form-group.on input'),
         type = $form.find('.form-group.on .code-tab').attr('data-type'),
         data = {captcha: ''},flag = false,code = '';

      if('phone'==sign || 'email'==sign){
         code = that.closest('.mod-form').find('input').val().trim();
      }
      if('gug'==sign){
         data.captcha = $input.val().trim();
         if('gug'==type){
            flag = true;
         }
         obj.modHide('#mod-gug');
         tobj.unbindOtp(data,flag);
      }else if('phone'==sign){
         obj.modHide('#mod-phone');
         tobj.unbindOther({code: code});
      }else if('email'==sign){
         obj.modHide('#mod-email');
         tobj.unbindOther({code: code},true);
      }
   });

   // 按钮
   obj.btnFn(function(that){
      var sign = that.attr('data-sign'),data = {key: '',value: ''},
          flag = that.hasClass('off');
      if(flag){
            data.value = 'OFF';
         }else{
            data.value = 'ON';
         }
      if(1==sign){
         data.key = 'LoginEmailNotice';
      }else if(2==sign){
         data.key = 'DistanceLoginNotice';
      }else if(3==sign){
         data.key = 'TopUpNotice';
      }else if(4==sign){
         data.key = 'WithrawalNotice';
      }else if(5==sign){
         data.key = 'NeedSecondaryAuth';
      }else if(6==sign){
         data.key = 'MarketOrderPriceLimit';
         var value = $('.price').val();
         if(data.value == 'OFF'){
            $('input').prop('disabled',true);
            $('button').prop('disabled',true);
            $('button').css('background','#b8c3cc');
            if(value){
               data.value='OFF,' + value/100;
            }else{
               data.value = 'OFF,'+'';
            }            
         }else{
            $('input').prop('disabled',false);
            $('button').prop('disabled',false);
            $('button').css('background','#0e7dcc');
            if(value){
               data.value='ON,' + value/100;
            }else{
               data.value = 'ON,'+'';
            }           
         }
      }
      tobj.setUserInfo(data,sign);
   });

   // 解除绑定弹窗
   $('.safeset-table').on('click','[data-bind]',function(){
      var sign = $(this).attr('data-bind');
      if('phone'==sign){
         obj.modShow('#mod-phone');
      }else if('email'==sign){
         obj.modShow('#mod-email');
      }else if('gug'==sign){
         obj.modShow('#mod-gug');
      }
   });

   $(window).on('click',function(){
      if($('.search-box>ul').hasClass('show') || $('.dropdown-list').hasClass('show')){
         $('.search-box>ul').removeClass('show');
         $('.dropdown-list').removeClass('show');
         $('.dropdown-txt').removeClass('show');
      }
   });
});