
$(function(){
   
   var ip = 'http://10.0.0.218:7898';

   // 切换首页轮播图片
   $('#banner').on('click',function(e){
      e = e || window.event,
      $that = $(e.target);

      if(0 < $that.closest('.w-sign').length){
         $that.addClass('on').siblings('li').removeClass('on');
      }
   });
   // 绑定id
   $('.input-checkbox').on('mouseover','.bind_ip',function(){
      $('.cont-tips').css("display","block");
   });
   $('.input-checkbox').on('mouseout','.bind_ip',function(){
      $('.cont-tips').css("display","none");
   });
   
   // 初始化页面
   setTimeout(function(){
      var _h = $('.w-banner>li').innerHeight(),
         _wh = $(window).height(),
         lb = $('.login-box').outerHeight(true)+80;
      //$('#banner').height(_h);
      //$('#banner>.w-box').height(_h);
      if(_wh < lb){
         $('.login-box').css('margin-top',100);
      }else{
         $('.login-box').css('margin-top',120);
      }
      $(window).resize(function(){
         var _h = $('.w-banner>li').innerHeight(),
            _wh = $(window).height();
         //$('#banner').height(_h);
         //$('#banner>.w-box').height(_h);
         if(0!=$('#bg-wrap').length){
            if(_wh < lb){
               $('.login-box').css('margin-top',40);
            }else{
               $('.login-box').css('margin-top',40+(_wh-lb)/2);
            }
         }
      });
   },10);
   // 图片轮播
   var count = 0,timer = null;
   $('.w-sign').on('mouseover','>li',function(){
      var that = $(this),
         $show = $('.w-banner>li'),
         index = that.index();

      count = index;
      that.addClass('on').siblings('li').removeClass('on');
      $show.eq(count).addClass('on').siblings('li').removeClass('on');
   });
   $('#banner').on('mouseover',function(){
      clearTimeout(timer);
   });
   $('#banner').on('mouseout',function(){
      timer = setInterval(times,3000);
   });
   var times = function(){
      var $show = $('.w-banner>li'),
         $sign = $('.w-sign>li');
      count ++;
      if(count >= $show.length){
         count = 0;
      }
      $sign.eq(count).addClass('on').siblings('li').removeClass('on');
      $show.eq(count).addClass('on').siblings('li').removeClass('on');
   };
   timer = setInterval(times,3000);

   // 更新验证码
   $('#pic-captcha').on('click',function(){
      var url = ip+'/common/Captcha?rd='+Math.random();
      $(this).attr('src',url);
   });
   

   ~(function(){
      var obj = {
         reg_email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
         reg_ip: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
         account: localStorage.getItem('account')||'',
         sign: localStorage.getItem('sign')||0,
         lang: localStorage.getItem('i18next_lng')||'zh-cn',
         // 验证
         validate: function(reg,val){
            var reg = reg || /^/;
            return reg.test(val);
         },
         // ajax
         ajaxFn: function(url,opts){
            var _url = ip + url,
               _method = opts.method || 'POST',
               _dataType = opts.dataType || 'json',
               _data = opts.data || null,
               _async = opts.async ? true :false,
               _jsonp = opts.jsonp || null,
               _callback = opts.callback || new Function(),
               _errorCallback = opts.errorCallback || new Function();
            $.ajax({url: _url,
               method: _method,
               dataType: _dataType,
               data: _data,
               jsonp: _jsonp,
               xhrFields: {withCredentials: true},
               crossDomain: true,
               success: function(res){
                  var local = window.location,
                     pathUrl = local.pathname.toLowerCase(),
                     referrer = document.referrer.toLowerCase(),
                     sign=false,
                     notList=['bind-','email-','forgot','modify-','login','register','reset','twoCardValidate'];
                  if(res.IsSuccess){
                     if(_url.toLowerCase().indexOf('/user/getloginstatus')!=-1){
                        if((res.Data & 32) != 0){
                           local.href = './twoCardValidate.html';
                        }else if((res.Data & 16) != 0){
                           if(pathUrl!='/set-gugValidate.html'){
                              local.href = './bind-phone.html';
                           }
                        }
                     }else if(_url.toLowerCase().indexOf('/account/login')!=-1){
                        for(var i =0;i<notList.length;i++){
                           if(-1==referrer.indexOf(notList[i])){
                              sign=true;
                           }else{
                              sign=false;
                              break;
                           }
                        }
                        if((res.Data&4)!=0){
                           local.href = './twoCardValidate.html';
                        }else{
                           if(sign){
                              obj.setCookie('local_href',referrer);
                              local.href = obj.getCookie('local_href');
                           }else{
                              obj.delCookie('local_href');
                              local.href = '/';
                           }
                        }
                     }
                  }else{
                     if(-9996==res.Code){
                        local.href = './twoCardValidate.html';
                     }else if(-9995==res.Code){
                        local.href = './twoCardValidate.html';
                        if(obj.validate(obj.reg_email,obj.account)){
                           local.href = './bind-phone.html';
                        }
                     }else if(-9997==res.Code){
                        localStorage.clear();
                        if(pathUrl=='/' ||pathUrl=='/trade.html'){
                           obj.showMenu(); if(pathUrl!='/trade.html'){ return false;}
                        }
                        if(pathUrl!='/trade.html'){
                           local.href = '/login.html';
                        }
                     }
                  }
                  if (typeof(_callback) == "function" && typeof(res) != 'undefined') {
                     _callback(res);
                  }
               },
               error: function(error){
                  _errorCallback(error);
               }
            });
         },
         // 上传图片
         ajaxUpload: function(that,opts){
            var url = opts.url || 'http://10.0.0.218:5758/File/upload/Certification?action=uploadimage',
               _callback = opts.callback || new Function();
            
            that.ajaxSubmit({
               url: url,
               type: 'POST',
               success: function(res){
                  if (typeof(_callback) == "function" && typeof(res) != 'undefined') {
                     that[0].reset();
                     _callback(res);
                  }
               }
            });
         },
         //enter提交form表单
         submitForm: function(_form,_id){
            $(_form).on('keypress',function(event){
               if(event.keyCode == 13){  
                  $(_id).trigger("click");  
               }  
            });
         },
         // 获取session值
         getStorage: function(){
            var type = localStorage.getItem('Type'),
               id = localStorage.getItem('UserId'),
               account = localStorage.getItem('account'),
               lang = localStorage.getItem('i18next_lng');
            return {Type: type,Id: id,account: account,lang: lang};
         },
         // 获取url参数
         getParam: function(){
            var params = (window.location.search).substr(1),
               items = params.split('&'),data = {};
            for(var i=0;i<items.length;i++){
               var key = items[i].substr(0,items[i].indexOf('=')),
                  val = items[i].substr(items[i].indexOf('=')+1);
               if(0!=key.length && 0!=val.length){
                  data[key] = val;
               }
            }
            return data;
         },
         // 分页
         page: function(opt){
            if(!opt._class){ return false;}

            var objs = $(opt._class),
               allNum = opt.allNum || 5,
               nowNum = opt.nowNum || 1,
               html = '',
               callback = opt.callback || function(){};
            objs.off('click','>li');
            if(opt.allNum <=0){objs.empty(); return false;}
            if(nowNum >= 2){
               html += '<li class="st-page" data-page="'+(nowNum-1)+'"><i class="icon icon-direction"></i></li>';
            }
            
            if(allNum <= 5){
               for(var i = 1;i<=allNum;i++){
                  if(nowNum == i){
                     html += '<li class="on">'+i+'</li>';
                  }else{
                     html += '<li data-page="'+i+'">'+i+'</li>';
                  }
               }
            }else{
               if(nowNum>3){
                  html+='<li data-page="1">1</li><li class="more">...</li>';
               }
               for(var i = 1;i<=5;i++){
                  if(nowNum == 1 || nowNum == 2){
                     if(nowNum == i){
                        html += '<li class="on">'+i+'</li>';
                     }else{
                        html += '<li data-page="'+i+'">'+i+'</li>';
                     }
                  }else if((allNum - nowNum) == 0 || (allNum - nowNum) == 1){
                     if((allNum - nowNum) == 0 && i == 5){
                        html += '<li class="on">'+(allNum-5+i)+'</li>';
                     }else if((allNum - nowNum) == 1 && i == 4){
                        html += '<li class="on">'+(allNum-5+i)+'</li>';
                     }else{
                        html += '<li data-page="'+(allNum-5+i)+'">'+(allNum-5+i)+'</li>';
                     }
                  }else{
                     if(i == 3){
                        html += '<li class="on">'+(nowNum-3+i)+'</li>';
                     }else{
                        html += '<li data-page="'+(nowNum-3+i)+'">'+(nowNum-3+i)+'</li>';
                     }
                  }
               }
               if(allNum - nowNum>=3){
                  html+='<li class="more">...</li><li data-page="'+allNum+'">'+allNum+'</li>';
               }
            }
            if(allNum - nowNum >= 1){
               html +='<li class="ed-page" data-page="'+(parseInt(nowNum)+1)+'"><i class="icon icon-direction"></i></li>';
            }
            objs.html(html);
            if(allNum <= 5){
               if(!objs.find('li:last-child').hasClass('on')){
                  objs.find('li:last-child').addClass('last');
               }
            }
            objs.on('click','>button',function(e){
               var _val = parseInt(objs.find('input').val());
               if(_val){
                  if(_val > opt.allNum){return false;}
               }else{return false;}
               obj.page({
                  _class: opt._class,
                  nowNum: _val,
                  allNum: opt.allNum,
                  callback: callback
               });
              callback(_val,allNum);
            });
            objs.on('click','>li',function(e){
               if($(this).hasClass('on')){return false;}
               var now = $(this).attr('data-page');
               obj.page({
                  _class: opt._class,
                  nowNum: now,
                  allNum: opt.allNum,
                  callback: callback
               });
               callback(now,allNum);
            });
         },
         pageFn: function(sel,now,all,callback){
            obj.page({
               _class: sel||'.pagination-list',
               nowNum: now,
               allNum: all,
               callback: callback
            });
         },
         // 倒计时手机验证码有效期
         countDown: function(that,s,str){
            var codeTimer = null;
            s = s || 0;
            if(that){
               that.attr('disabled',true);
            }
            codeTimer = setInterval(function(){
               s--;
               if(-1==s){
                  clearInterval(codeTimer);
                  that.text(str||$.t('send_verify'));
                  that.attr('disabled',false);
                  return false;
               }
               var txt = s+ $.t('seconds');
               that.text(txt);
            },1000);
         },
         // 密码等级验证
         pwdValidate: function(val){
            var lv = 1,val = val.trim(),count=0,
               $li = $('.box-warn>ul>li'),
               reg_char = /[a-zA-Z]+/gi,
               reg_num = /[0-9]+/g,
               reg_spchar = /[^0-9a-zA-Z]+/gi;

            if(val.length >= 8 && val.length <=20){
               if(reg_char.test(val)){count++;}
               if(reg_num.test(val)){count++;} 
               if(reg_spchar.test(val)){count++;}
               if(2===count){
                  lv=3;
               }else if(3===count){
                  lv=4;
               }
            }
            $li.removeClass('active');

            return lv;
         },
         // 展开模态框
         modShow: function(selector){
            var _top = $(window).scrollTop();
            $('#mask').addClass('show');
            $(selector).addClass('show');
            $(selector).css('margin-top',_top+$(selector).height()/2);
         },
         // 关闭模态框
         modHide: function(selector){
            var $box = $(selector).closest('.mod-box'),
               $form = $box.find('.mod-form');
            $('#mask').removeClass('show');
            $(selector).removeClass('show');
            if(0<$form.length){
               $form[0].reset();
            }
         },
         // 获取用户绑定认证类型
         getAuthType: function(opts){
            var callback = opts.callback || new Function(),
               errorCallback = opts.errorCallback || new Function();
            obj.ajaxFn('/user/GetAuthType',{
               callback: callback,
               errorCallback: errorCallback
            });
         },
         // 发送手机/邮箱验证码
         sendPhoneCaptcha: function(that,flag,msgFn){
            var url = '/user/SendPhoneCaptcha';
            msgFn = msgFn || new Function();
            if(flag){
               url = '/user/SendEmailCaptcha';
            }
            obj.ajaxFn(url,{
               callback: function(res){
                  var msg = '',s=59;
                  if(res.IsSuccess){
                     if(flag){
                        s = 899;
                     }
                     obj.countDown(that,s);
                  }else{
                     if(203==res.Code){
                        msg = $.t('once_minute');
                        if(flag){
                           msg = $.t('email_minute');
                        }
                     }else if(402==res.Code){
                        msg = $.t('phone_html');
                        if(flag){
                           msg = $.t('email_html');
                        }
                        obj.modHide('#mod-gug');
                     }
                     msgFn(msg);
                  }
               }
            });
         },
         // 滑动按钮
         btnFn: function(callback){
            callback = callback || new Function();
            //$('.slide-box').on('click','>label>.slide-btn',function(){
            $('.slide-box').on('click','>label>span',function(){
               var $p = $(this).closest('.slide-box');
               if($p.hasClass('off')){
                  $p.removeClass('off');
               }else{
                  $p.addClass('off');
               }
               callback($p);
            });
         },
         // 错误提示
         formValidate: function(selector,txt,flag){
            var that = $(selector).parent().children('.box-tips'),
               flag = flag || false;
            if(txt && 0!=txt.length){
               that.children('span').text(txt);
            }
            if(flag){
               that.removeClass('show');
            }else{
               that.addClass('show');
            }
         },
         // 资产统计
         myAvailabelAsset: function(){
            obj.ajaxFn('/MyAccount/MyAvailableAsset',{
               callback: function(res){
                  var html = '',list = [];
                  if(res.IsSuccess){
                     list = res.Data;
                     for(var i =0;i<list.length;i++){
                        //<td><img src="./imgs/c-'+list[i].CurrencyId+'.png" alt="币种" /><span>'+list[i].CurrencyId+'</span></td>\
                        //<td><i class="icon2 icon-'+list[i].CurrencyId+'"></i><span>'+list[i].CurrencyId+'</span></td>\
                        html +='<tr>\
                                 <td><i class="icon2 icon-'+list[i].CurrencyId+'"></i><span>'+list[i].CurrencyId+'</span></td>\
                                 <td>'+obj.getFloatValue(list[i].Balance,2)+'</td>\
                                 <td>'+obj.getFloatValue(list[i].LockedAmount,2)+'</td>\
                              </tr>';
                      }
                  }else{
                     html = '';
                  }
                  $('#asset-table>tbody').html(html);
               }
            });
         },
         // 资产折合统计
         myTotalAsset: function(){
            obj.ajaxFn('/MyAccount/MyTotalAsset',{
               callback: function(res){
                  var data= res.Data,a = '';
                  if(res.IsSuccess){
                     a = data.UserAccount;
                     // console.log(a);
                     a=a.substr(0,3)+'***'+a.substr(a.indexOf('@'));
                     $('#user-account').text(a);
                     $('#user-id').text(data.UserName||$.t('not_realname'));

                     if(data.UserName){
                        $('.certification').addClass("hide");
                     }else{
                        $('.certification').removeClass("hide");
                     }
                     $('.asset').text('￥'+obj.getFloatValue(data.CnyAmount,8));
                     //登录tab栏切换
                     $('#asset-list span').on('click',function(e){
                        var lists = $('#asset-list span');
                        for(var i = 0; i < lists.length; i++) {
                           $(lists[i]).removeClass();
                        }
                        $(this).addClass('hight');
                        var _id = this.getAttribute('id');
                        if(_id == 'CnyAmount'){
                           $('.asset').text('￥'+obj.getFloatValue(data.CnyAmount,8));
                        }else if(_id == 'BtcAmount'){
                           $('.asset').text(obj.getFloatValue(data.BtcAmount,8));
                        }else if(_id == 'EthAmount'){
                           $('.asset').text(obj.getFloatValue(data.EthAmount,8));
                        }
                     });
                     // $('.asset-btc').text(obj.getSubVal(data.BtcAmount,10));
                  }
               },
                errorCallback: function(res){
                     $('.asset').html('--');
               }
            });
         },
         // 菜单显示
         showMenu: function(){
            var pic=$('.list-lang>li[data-lang="'+obj.lang+'"]').find('img');
            $('.show-txt').html(pic);
            if(obj.sign){
               $('.set-2').addClass('hide');
               $('.set-1').removeClass('hide');
            }else{
               $('.set-1').addClass('hide');
               $('.set-2').removeClass('hide');
            }
            if(location.pathname.toLowerCase()=='/login.html'){
               $('.set-2>li').eq(0).find('a').attr('href','./register.html');
               $('.set-2>li').eq(1).find('a').attr('href','javascript:;');
               $('.set-2>li').eq(1).addClass('active').siblings().removeClass('active');
            }else if(location.pathname.toLowerCase()=='/register.html'){
               $('.set-2>li').eq(0).find('a').attr('href','javascript:;');
               $('.set-2>li').eq(1).find('a').attr('href','./login.html');
               $('.set-2>li').eq(0).addClass('active').siblings().removeClass('active');
            }else{
               $('.w-menu>li').each(function(){
                  if(location.pathname.toLowerCase()=='/'){
                     $('.w-menu>li').eq(0).addClass('on').siblings().removeClass('on');
                     return false;
                  }else if(location.pathname.toLowerCase()=='/market.html' || location.pathname.toLowerCase()=='/trade.html'){
                     $('.w-menu>li').eq(1).addClass('on').siblings().removeClass('on');
                     return false;
                  }
               });
            }
         },
         // 获取交易统计
         getTradeStatistics: function(){
            obj.ajaxFn('/market/Statistics',{
               data: {currencys: ['cny','btc','eth','ans']},
               callback: function(res){
                  var list = [],i = 0,h='',rst='';
                  if(res.IsSuccess){
                     list = res.Data;
                     for(i;i<list.length;i++){
                        h = '.h-'+list[i].Currency;
                        if('cny'===list[i].Currency){
                           rst = '￥'+obj.getFloatValue(list[i].Result,2);
                        }else{
                           rst = obj.getFloatValue(list[i].Result,2);
                        }
                        $(h).html(rst);
                     }
                  }
               },
               errorCallback: function(res){
                     $('.h-cny').html('--');
                     $('.h-btc').html('--');
                     $('.h-eth').html('--');
                     $('.h-ans').html('--');
               }
            });
         },
         // 取小数点位数
         getFloatValue: function(num,count,flag){
            var str = num+'',slength=0,flag=flag||true,back;
            num = parseFloat(num);
            str = str.substr(str.indexOf('.')+1);
            slength=str.length;
            if(count<slength){
               num = num.toFixed(count);
            }
            if(flag){
               back= parseFloat(num);
            }else{
               
            }
            return back;
         },
         // 科学计数法转10进制数
         scienceToNum: function(num,count){
            var str = new String(num);
            var e_pos = str.indexOf('e+');
            var p_pos = str.indexOf('.');
            // For Firefox 科学计数法
            if (e_pos > 0) {
               bit = e_pos - p_pos - 1;
               tim = str.substr(e_pos + 2);
               str = str.substr(0, e_pos).replace('.', '');
               var mov = tim - bit;
               while (mov > 0) {
                  str += '0';
                  mov--;
               }
               str += '.';
               while (count > 0) {
                  str += '0';
                  count--;
               }
               return str;
            }else{
               e_pos = str.indexOf('e-');
               if(e_pos>0){
                  tim = str.substr(0,e_pos);
                  mov=parseInt(str.substr(e_pos + 2))-1;
                  var zeros='0.';
                  while (mov > 0) {
                     if(count===mov){break;}
                     zeros += '0';
                     mov--;
                  }
                  str=zeros+tim;
                  return str;
               }
            }
            return num;
         },
         // 交易提示
         hideTips: function(msg,sel){
            sel=sel||'';
            var _top=$(document).scrollTop();
            if(0<=_top&&100>=_top){_top=50;}else{_top=0;}
            var that = null,
               html = '<div class="msg-tips '+sel+'" style="top: '+_top+'px;"><span>'+msg+'</span></div>';
            if(0!=$('.msg-tips').length){
               $('.msg-tips').remove();
            }
            if(msg){
               $(document.body).append(html);
               that = $('.msg-tips');
               //that.css('')
               setTimeout(function(){
                  if(sel){
                     that.css({'background-color':'rgba(233,85,0,.7)','opacity': 1});
                  }else{
                     that.css({'background-color':'rgba(44,155,0,.7)','opacity': 1});
                  }
               },300);

               setTimeout(function(){
                  if(sel){
                     that.css({'background-color':'rgba(233,85,0,.7)','opacity': 0});
                  }else{
                     that.css({'background-color':'rgba(44,155,0,.7)','opacity': 0});
                  }
                  setTimeout(function(){
                     that.remove();
                  },300);
               },3000);
            }
         },
         // 国际化
         getInternation: function(lang){
            if(lang){
               $.i18n.init({
                  fallbackLng: lang,
                  fallbackOnEmpty: true,
                  lowerCaseLng: true,
                  detectLngFromLocalStorage: true,
                  resGetPath: "locales/__lng__/translation.json",
                  debug: true
               }, function() {
                  $("[data-i18n]").i18n();
               });
            }
            //obj.setCookie("i18next",lang);
            /*obj.ajaxFn('/common/LangPackage',{
               data: {page: 1,pageSize: 100},
               callback: function(res){
                  if(res.IsSuccess){

                  }
               }
            });*/
         },
         //获取语言类型
         getLanguageType:function(){
            obj.ajaxFn('/common/GetLangType',{
               async:false,
               callback: function(res){
                  if(res.IsSuccess){
                     var lang = res.Data;
                     
                     if(lang == 'EN'){
                        lang = 'en';
                     }else{
                        lang = 'zh-cn';
                     }
                     obj.setCookie("i18next",lang);
                     localStorage.setItem('i18next_lng',lang);
                     obj.getInternation(lang);
                  }
               }
            });
         },
         setCookie: function(c_name,value,expiredays){
            var exdate=new Date();
            exdate.setDate(exdate.getDate()+expiredays);
            document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
         },
         delCookie: function(name){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=obj.getCookie(name);
            if(cval!=null){
               document.cookie= name + "="+cval+";expires="+exp.toGMTString();
            }
         },
         getCookie: function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg)){
               return unescape(arr[2]);
            }else{
               return null;
            }
         },
         // 首页上浮
         animate:function(){
            var sections = $('.section'),
            section_one=$('.section-first'),
            section_two=$('.section-second'),
            section_three=$('.section-third'),
            section_four=$('.section-four'),
            section_five=$('.section-fifth');
            prev =section_one.prev();
            section_one.find('h3').addClass('show animated fadeInUp');
            section_one.find('li').css('display','inline-block');
            section_one.find('li').addClass('animated fadeInUp');
            $(window).scroll(function(){
               var sTop = $(this).scrollTop()+prev.height();
               if(sTop>=sections.eq(1).offset().top){
                  section_two.find('h3').addClass('show animated fadeInUp');
                  section_two.find('li').addClass('show animated fadeInUp');
               }
               if(sTop>=sections.eq(2).offset().top){
                  section_three.find('h3').addClass('show animated fadeInUp');
                  section_three.find('.pic').css('display','inline-block');
                  section_three.find('.pic').addClass('animated fadeInUp');
                  section_three.find('ul').css('display','inline-block');
                  section_three.find('ul').addClass('show animated fadeInUp');
               }
               if(sTop>=sections.eq(3).offset().top){
                  section_four.find('h3').addClass('show animated fadeInUp');
                  section_four.find('li').css('display',"inline-block");
                  section_four.find('li').addClass('animated fadeInUp');
                  setTimeout(function(){
                     section_four.find("h3,li").removeClass('animated');
                  },500);
               }
               if(sTop>=sections.eq(4).offset().top-100){
                  section_five.find("h3").addClass('show animated fadeInUp');
                  section_five.find("li").addClass('show animated fadeInUp');
               }
            });
         },
         // 获取中英文字符长度
         getLen: function(str){
            var len = 0;
            for (var i = 0; i < str.length; i++) {
               var c = str.charCodeAt(i);
               //单字节加1
               if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                  len++;
               }
               else {
                  len += 2;
               }
            }
           return len;
         },
         // 除法
         toDiv: function(arg1,arg2){
            var t1=0,t2=0,r1,r2;
            try{t1=arg1.toString().split(".")[1].length}catch(e){}
            try{t2=arg2.toString().split(".")[1].length}catch(e){}
            with(Math){
               r1=Number(arg1.toString().replace(".",""));
               r2=Number(arg2.toString().replace(".",""));
               return (r1/r2)*pow(10,t2-t1);
            }
         },
         // 乘法
         toMul: function(arg1,arg2){
            var m=0,s1=arg1.toString(),s2=arg2.toString();
            try{m+=s1.split(".")[1].length}catch(e){}
            try{m+=s2.split(".")[1].length}catch(e){}
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
         },
         // 加法
         toAdd: function(arg1,arg2){
            var r1,r2,m;
            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
            m=Math.pow(10,Math.max(r1,r2));
            return (parseInt(arg1 * m) + parseInt(arg2 * m)) / m;
         },
         // 减法
         toSub: function(arg1,arg2){
            var r1,r2,m,n;
            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
            m=Math.pow(10,Math.max(r1,r2));
            //last modify by deeka
            //动态控制精度长度
            n=(r1>=r2)?r1:r2;
            return ((arg1*m-arg2*m)/m).toFixed(n);
         },
         flag: true
      };

      if(0==$('.login-box').length){

         if(obj.sign){
            obj.myAvailabelAsset();
            $('#login>ul').eq(0).removeClass('show').siblings().addClass('show');
         }else{
            $('#login>ul').eq(1).removeClass('show').siblings().addClass('show');
         }
      }
      /*$('.w-menu').on('click','>li',function(){
         var that = $(this),
            index = that.index(),
            url = './market.html';

         if(2==index||3==index){
            if(!obj.sign){
               obj.hideTips('请先登录！');
            }
         }
      });*/
      // obj.getLanguageType();
      obj.showMenu();
      if(0!=$('#banner').length){
         obj.animate();
      }
      if('/'==location.pathname.toLowerCase()){
         if(obj.sign){
            obj.myTotalAsset();
         }
         obj.getTradeStatistics();
      }
      if(!obj.sign){
         var notAllow=['modify-','set-','bind-','api-','buzpwd','transaction'];
         for(var i = 0;i<notAllow.length;i++){
            if(-1!==location.pathname.toLowerCase().indexOf(notAllow[i])){
               location.href='/login.html';
            }
         }
      }
      // 语言切换
      $('.lang-box').on('click','.list-lang>li',function(){
         var that = $(this),
            lang = 'zh-cn',
            type = 'ZH',
            index = that.index(),
            url = '';
         if(0!=index){
            type = 'EN';
            lang = 'en';
         }
         obj.ajaxFn('/common/SetLangType',{
            data: {type:type},
            callback: function(res){
               if(res.IsSuccess){
               }
            }
         });
         url = window.location.pathname;//+'?lang='+lang

         obj.setCookie("i18next",lang);
         localStorage.setItem('i18next_lng',lang);
         $('.w-set').append('<a href="'+url+'" id="link-attr"></a>');
         $('#link-attr')[0].click();
         $('#link-attr').remove();
      });
      obj.getInternation(obj.lang);
      //obj.myAvailabelAsset();
      // 关闭模态框
      $('.mod-box').on('click','[data-action]',function(e){
         e = e || window.event;
         e.stopPropagation();
         e.preventDefault();

         var action = $(this).attr('data-action'),
            $box = $(this).closest('.mod-box'),
            _id = $box.prop('id'),
            $form = $box.find('.mod-form');
         if('close'==action){
            obj.modHide('#'+_id);
         }
         $form.find('.error').addClass('hide');
      });
      
      // 点击回车登陆
      $('#login').on('keypress',function(e){
         e = e || window.event;
         if((e.keyCode && 13==e.keyCode) || (e.which && 13==e.which)){
            $('.login-btn').trigger('click');
         }
      });
      
      // 登录
      $('.login-btn').on('click',function(){
         //obj.getLanguageType();
         var user = $('#input-user').val(),
            pwd = $('#input-pwd').val(),
            that = $(this),
            sign = false,
            checked=$('#remember').prop('checked');
           
         if(user && ''!=user){
            user = user.trim();
         }
         if(pwd && ''!=pwd){
            pwd = pwd.trim();
         }
         if(checked){
            var data={account: user,password: pwd,Name:'bindIp'};
         }else{
            data={account: user,password: pwd};
         }
         $('#input-user').trigger('blur');
         $('#input-pwd').trigger('blur');
         if(obj.flag){
            that.prop('disabled',true).text($.t('Log_in'));
            obj.ajaxFn('/account/Login',{
               data:data,
               callback: function(res){
                  if(res.IsSuccess){
                     sign = true;
                     localStorage.setItem('account',user);
                  }else{
                     if(2==res.Code){
                        msg = $.t('incorrect_pwd');
                     }else if(8==res.Code){
                        msg = $.t('account_lock');
                     }else if(16==res.Code){
                        msg = $.t('lock_minute');
                     }else if(32==res.Code){
                        msg = $.t('account_exist');
                     }
                     if(-1!=[2,8,16].indexOf(res.Code)){
                        $('#input-pwd').next().removeClass('hide').html(msg);
                     }else{
                        $('#input-user').next().removeClass('hide').html(msg);
                     }
                     sign = false;
                  }
                  localStorage.setItem('sign',sign);
                  obj.flag = true;
                  that.prop('disabled',false).text($.t('login'));
               },
               errorCallback: function(res){
                  that.prop('disabled',false).text($.t('login'));
               }
            });
         }
      });
      $('#input-user').on('blur',function(){
         var user = $('#input-user').val(),
            that = $(this),flag = true;

         if(null!=user && ''!=user){
            user = user.trim();
            that.next().addClass('hide');
         }else{
            flag = false;
            that.next().removeClass('hide').html($.t('account_empty'));
         }
         obj.flag = flag;
      });
      $('#input-pwd').on('blur',function(){
         var pwd = $('#input-pwd').val(),
            that = $(this),flag = true;
         if(null!=pwd && ''!=pwd){
            pwd = pwd.trim();
            that.next().addClass('hide');
         }else{
            flag = false;
            that.next().removeClass('hide').html($.t('passd_empty'));
         }
         obj.flag = flag;
      });

      // 关闭交易密码/取消关闭交易密码操作
      $('.buz-tips').on('click','[data-type]',function(){
         var that = $(this),
            type = that.attr('data-type'),
            $p = that.parent(),
            $form = that.closest('.mod-form');

         if(2==type){
            $p.addClass('hide');
            $p.prev().removeClass('hide');
            $('#to-modify').removeClass('hide');
            $('#to-addr').addClass('hide');
            $form.find('.close-buzPwd').removeClass('hide');
         }else{
            $p.addClass('hide');
            $p.next().removeClass('hide');
            $('#to-modify').addClass('hide');
            $('#to-addr').removeClass('hide');
            $form.find('.close-buzPwd').addClass('hide');
         }
      });

      // 退出登录
      $('.list-user').on('click','>li',function(){
         var index = $(this).index();
         if(1===index){
            obj.ajaxFn('/account/LoginOut',{
               callback: function(res){
                  if(res.IsSuccess){
                     localStorage.clear();
                     window.location.href="./login.html";
                  }
               }
            });
         }
      });

      // 日期格式化 例如(new Date()).format('yyyy-MM-dd')
      Date.prototype.format = function (format) {
         var o = {
            "M+": this.getMonth() + 1,  //month 
            "d+": this.getDate(),     //day 
            "h+": this.getHours(),    //hour 
            "m+": this.getMinutes(),  //minute 
            "s+": this.getSeconds(), //second 
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter 
            "S": this.getMilliseconds() //millisecond 
         }
         if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
         }
         for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
               format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
         }
         return format;
      };

      // 返回顶部
      $('.goback').on('click',function(){
         $('body').animate({scrollTop: 0},400);
      });
      window.obj = obj;
   })();
});