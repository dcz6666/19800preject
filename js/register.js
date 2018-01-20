$(function(){
     $('.box-checkbox').on('mouseover','.bind_ip',function(){
            $('.cont-tips').css("display","block");
         });
      $('.box-checkbox').on('mouseout','.bind_ip',function(){
            $('.cont-tips').css("display","none");
         });

   if(0!=$('#login-box').length || 0!=$('#register-box').length){
      // 监听手机号/邮箱
      $('#account').on('input',function(){
         if('' !=$(this).val()){
            if(!isNaN($(this).val())){
               $('.btn-dropdown').addClass('show');
               $('.msg-show').addClass('show');
               $('.email-show').removeClass('show');
            }else{
               $('.btn-dropdown').removeClass('show');
               $('.msg-show').removeClass('show');
               $('.email-show').addClass('show');
            }
         }else{
            $('.btn-dropdown').removeClass('show');
            $('.msg-show').removeClass('show');
            $('.email-show').addClass('show');
         }
      });

      var tobj = {
         
         // 发送手机/邮箱验证码
         getCaptcha: function(that,data,flag){
            var url = '/user/PhoneActiveApply';
            if(flag){
               url = '/user/EmailActiveApply';
            }
            obj.ajaxFn(url,{
               data: data,
               callback: function(res){
                  var msg = '',s=59;
                  if(res.IsSuccess){
                     that.next().removeClass('show');
                     if(flag){s=899;}
                     obj.countDown(that,s,$.t('click_send'));
                  }else{
                     if(164 == res.Code){
                        msg = $.t('phone_used');
                        if(flag){
                           msg = $.t('mail_used');
                        }
                     }else if(203 == res.Code){
                        msg = $.t('captcha_send');
                        if(flag){
                           msg = $.t('captcha_sent');
                        }
                     }else if(404 == res.Code){
                        msg = $.t('phone_number');
                        if(flag){
                           msg = $.t('email');
                        }
                        msg = $.t("is_bind")+msg+$.t("set_first")+'<a href="./toSafeSet.html">'+$.t("unbind")+'</a>'+$.t("operation");
                     }
                     that.next().addClass('show').find('span').html(msg);
                  }
               }
            });
         },
         // 发送手机/邮箱验证码
         getCaptchaCode: function(that,data,flag){
            var url = '/account/SendForgotPasswordCaptcha';
            obj.ajaxFn(url,{
               data: data,
               callback: function(res){
                  var msg = '',s=59;
                  if(res.IsSuccess){
                     that.next().removeClass('show');
                     if(flag){s=899;}
                     obj.countDown(that,s,$.t('click_send'));
                  }else{
                     if(0 == res.Code){
                        msg = $.t('picture');
                     }else if(-3 == res.Code){
                        msg = $.t('picture');
                     }else if(203 == res.Code){
                        msg = $.t('captcha_send');
                        if(flag){
                           msg = $.t('captcha_sent');
                        }
                     }else if(404 == res.Code){
                        msg = $.t('phone_number');
                        if(flag){
                           msg = $.t('email');
                        }
                        msg = $.t("is_bind")+msg+$.t("set_first")+'<a href="./toSafeSet.html">'+$.t("unbind")+'</a>'+$.t("operation");
                     }else if(406 == res.Code){
                        msg = $.t('id_error');
                     }
                     that.next().addClass('show').find('span').html(msg);
                  }
               }
            });
         },
         // 绑定手机/邮箱
         bindSomething: function(that,data,flag){
            var url = '/user/BindPhone';
            if(flag){
               url = '/user/BindEmail';
            }
            obj.ajaxFn(url,{
               data: data,
               callback: function(res){
                  var msg = '';
                  if(res.IsSuccess){
                     $('.btn-msg').next().removeClass('show');
                     obj.modShow('#mod-bind');
                     that.closest('.bind-box')[0].reset();
                  }else{
                     if(201 == res.Code){
                        msg = $.t('verify_error');
                     }else if(202 == res.Code){
                        msg = $.t('expired');
                     }
                     $('.btn-msg').next().addClass('show').find('span').text(msg);
                  }
                  that.prop('disabled',false);
                  that.text($.t('bind'));
               },
               errorCallback: function(res){
                  obj.modShow('#mod-error');
                  $('#mod-error .errorMsg').html($.t('operate_fail'));
                  that.prop('disabled',false);
                  that.text($.t('bind'));
               }
            });
         },
         // 二次登陆验证
         secondVerify: function(that,data){
            obj.ajaxFn('/user/SecondVerify',{
               data: data,
               callback: function(res){
                  var msg = '',$tips = that.closest('form').find('.box-auth.on .box-tips');
                  $tips.removeClass('show');
                  if(res.IsSuccess){
                     window.location.href = '/';
                  }else{
                     if(201==res.Code){
                        msg = $.t('verify_error1');
                     }else if(202==res.Code){
                        msg = $.t('expired');
                     }
                     $tips.addClass('show');
                     $tips.find('span').text(msg);
                  }
                  that.prop('disabled',false);
                  that.text($.t('Submit_verified'));
               },
               errorCallback: function(){
                  that.prop('disabled',false);
                  that.text($.t('Submit_verified'));
               }
            });
         },
         // 获取用户绑定认证类型
         getAuthType: function(){
            obj.getAuthType({
               callback: function(res){
                  var $phone = $('#input-phone').parent(),
                     $gug = $('#input-gug').parent(),
                     local = window.location,
                     wUrl = local.pathname.toLowerCase();
                  if(res.IsSuccess){
                     if(0==res.Data){                    // 未绑定
                     }else if(1==res.Data){              // 绑定邮箱
                        if(0!=$('.validate-box').length || 0!=$('#register-box').length){
                           local.href='./bind-validate.html';
                        }
                     }else if(2==res.Data){              // 绑定手机
                        if('/register.html'===wUrl){
                           local.href='/';
                        }
                     }else if(3==res.Data){              // 邮箱+手机
                     }else if(4==res.Data){              // 绑定otp
                     }else if(5==res.Data){              // 邮箱+otp
                     }else if(6==res.Data){              // 手机+otp
                     }else if(7==res.Data){              // 邮箱+手机+otp
                     }
                     if(0!=$phone.length && 0!=$gug.length){
                        if(2==res.Data || 3==res.Data){
                           $phone.find('.code-tab').addClass('hide');
                           $phone.addClass('on').removeClass('hide');
                        }else if(4==res.Data || 5==res.Data){
                           $gug.find('.code-tab').addClass('hide');
                           $gug.addClass('on').removeClass('hide');
                        }else if(6==res.Data || 7==res.Data){
                           $gug.addClass('on').removeClass('hide');
                        }
                     }
                  }
               }
            });
         }
      };

      // 验证手机号/邮箱是否存在
      $('#account').on('blur',function(e){
         var that = $(this),
            val = that.val().trim(),
            flag = true;

         $(this).trigger('input');
         if(isNaN(val)){
            if(val.length>=10 && val.length<=50){
               if(obj.validate(obj.reg_email,val)){
                  if(0!=$('#register-box').length && 0!=$('#btn-submit').length){
                     obj.ajaxFn('/account/EmailIsUsed',{
                        data: {emailAddress: val},
                        callback: function(res){
                           if(res.IsSuccess){
                              obj.formValidate('#account',null,true);
                              if(res.Data){
                                 obj.formValidate('#account',$.t('registered'));
                                 flag = false;
                              }
                           }
                        }
                     });
                  }else{
                     obj.formValidate('#account',null,true);
                  }
               }else{
                  obj.formValidate('#account',$.t('email_format'));
                  flag = false;
               }
            }else{
               obj.formValidate('#account',$.t('mail_length'));
               flag = false;
            }
         }else if(!isNaN(val)){
               var num = $('.dropdown-num').text();
            if(val.length >=6 && val.length<20){
               num = num.substr(1);
               val = num + '-' + val;
               if(0!=$('#register-box').length && 0!=$('#btn-submit').length){
                  obj.ajaxFn('/account/PhoneIsUsed',{
                     data: {phoneNumber: val},
                     callback: function(res){
                        if(res.IsSuccess){
                           obj.formValidate('#account',null,true);
                           if(res.Data){
                              obj.formValidate('#account',$.t('phone_been'));
                              flag = false;
                           }
                        }
                     }
                  });
               }else{
                  obj.formValidate('#account',null,true);
               }
            }else{
               obj.formValidate('#account',$.t('phone_equal'));
               flag = false;
            }
         }
         if(0==val.length){
            obj.formValidate('#account',$.t('content_empty'));
            flag = false;
         }else{
            obj.formValidate('#account',null,true);
         }
         obj.flag = flag;
      });
      
      // 图片验证码判空
      $('#code').on('blur',function(){
         var val = $(this).val().trim(),
            flag = true;
         if(0==val.length){
            obj.formValidate('#code',$.t('code_empty'));
            flag = false;
         }else{
            obj.formValidate('#code',null,true);
         }
         obj.flag = flag;
      });

      // 下拉国际区号列表
      $('.box-input').on('click',function(e){
         e = e || window.event;
         e.preventDefault();
         e.stopPropagation();
      });
      $('.btn-dropdown').on('click',function(e){
         var $list = $('.list-dropdown');
         if($list.hasClass('active')){
            $list.removeClass('active');
         }else{
            $list.addClass('active');
         }
      });
      $('.list-dropdown').on('click','>li',function(){
         $('.dropdown-num').text($(this).attr('data-value'));
         $(this).addClass('active').siblings('li').removeClass('active');
         $(this).parent().removeClass('active');
      });
      $(window).on('click',function(e){
         e = e || window.event;
         $('.list-dropdown').removeClass('active');
      });
      
      if(0!=$('#register-box').length){
         $('#register-box').on('keypress',function(e){
            e = e || window.event;
            if((e.keyCode && 13==e.keyCode) || (e.which && 13==e.which)){
               $('#btn-submit').trigger('click');
            }
         });
         $('#apply').on('click',function(){
            var that = $(this),
               flag = that.prop('checked'),
               $btn = that.closest('form').find('#btn-submit');

            $btn.prop('disabled',!flag);
         });
         // 手机号/邮箱注册
         $('#btn-submit').on('click',function(){
            var account = $('#account').val().trim(),
               pwd = $('#pwd').val().trim(),
               repwd = $('#repwd').val().trim(),
               code = $('#code').val().trim(),
               msgCode = $('#msg-code').val().trim(),
               emailCode = $('#email-code').val().trim(),
               lv = obj.pwdValidate(pwd);
               type = 'msg',
               that = $(this);

            $('#account').trigger('blur');
            $('#pwd').trigger('blur');
            $('#repwd').trigger('blur');
            $('#code').trigger('blur');
            if($('.msg-show').hasClass('show')){
               $('#msg-code').trigger('blur');
            }
            if($('.email-show').hasClass('show')){
               $('#email-code').trigger('blur');
               type = 'email';
            }
            if(8>pwd.length || 20<pwd.length){
               obj.flag = false;
               obj.formValidate('#pwd',$.t('pwd_require'));
            }else if(8<=pwd.length && 20>=pwd.length){
               if(1>=lv){
                  obj.flag= false;
                  obj.formValidate('#pwd',$.t('Registration'));
               }else{
                  obj.flag =true;
                  obj.formValidate('#pwd',null,true);
               }
            }
            if(obj.flag){
               that.prop('disabled',true).text($.t('registering'));
               var data = {password: pwd,validCaptcha: msgCode,picCaptcha: code},sign =false;
               if('msg' == type){
                  var prev = $('.dropdown-num').text().substr(1);
                  account = prev + '-'+account;
                  data.phoneNumber = account;
                  obj.ajaxFn('/account/RegisterByPhone',{
                     data: data,
                     callback: function(res){
                        var msg = '';
                        if(res.IsSuccess){
                           sign = true;
                           localStorage.setItem('account',account.substr(account.indexOf('-')+1));
                           tobj.getAuthType();
                           //window.location.href = './bind-validate.html';
                        }else{
                           if(-1==res.Code){
                              msg = $.t('picture');
                              obj.formValidate('#code',msg);
                           }else if(-2==res.Code){
                              msg = $.t('error_fail');
                              obj.formValidate('#msg-code',msg);
                           }
                           $('#pic-captcha').trigger('click');
                        }
                        localStorage.setItem('sign',sign);
                        that.prop('disabled',false).text($.t('register3'));
                     },
                     errorCallback: function(){
                        that.prop('disabled',false).text($.t('register3'));
                     }
                  });
               }else{
                  data.email = account;
                  data.validCaptcha = emailCode;
                  obj.ajaxFn('/account/RegisterByEmail',{
                     data: data,
                     callback: function(res){
                        var msg = '';
                        if(res.IsSuccess){
                           sign = true;
                           localStorage.setItem('account',account);
                           window.location.href = './bind-validate.html';
                        }else{
                           if(-1==res.Code){
                              msg = $.t('picture');
                              obj.formValidate('#code',msg);
                           }else if(-2==res.Code){
                              msg = $.t('error_fail');
                              obj.formValidate('#email-code',msg);
                           }
                           $('#pic-captcha').trigger('click');
                        }
                        localStorage.setItem('sign',sign);
                        that.prop('disabled',false).text($.t('register3'));
                     },
                     errorCallback: function(){
                        that.prop('disabled',false).text($.t('register3'));
                     }
                  });
               }
            }
         });
         
         // 密码强度
         $('#pwd').on('focus',function(e){
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            var $warn = $('.box-warn');
            if(!$warn.hasClass('show')){
               $('.box-warn').addClass('show');
            }
         });
         $('#pwd').on('blur',function(e){
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
               obj.formValidate('#pwd',null,true);
            }
            if(0===val.length){
               obj.formValidate('#pwd');
               flag = false;
            }
            obj.flag = flag;
         });
         $('#pwd').on('input',function(e){
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

         // 重复密码判空
         $('#repwd').on('blur',function(){
            var repwd = $(this).val().trim(),
               val = $('#pwd').val().trim(),
               flag = true;
            
            if(val != repwd){
               obj.formValidate('#repwd',$.t('consist'));
               flag = false;
            }else{
               obj.formValidate('#repwd',null,true);
            }
            obj.flag = flag;
         });
         
         function msgCodeFn(opt){
            var url = '',data = {},type = opt.that.attr('data-type');
            if(type=='email'){
               url = '/account/SendRegisterEmail';
               data = {emailAddress: opt.account,captchaCode: opt.code};
            }else{
               url = '/account/SendRegisterSms';
               data = {phoneNumber: opt.account,captchaCode: opt.code};
            }
            obj.ajaxFn(url,{
               data: data,
               callback: function(res){
                  var msg = '';
                  if(res.IsSuccess){
                     obj.countDown(opt.that,opt.s);
                  }else{
                     if(type=='msg'){

                        if(-1==res.Code){
                           msg = $.t('minute_sms');
                        }else if(-2==res.Code){
                           msg = $.t('phone_been');
                        }else if(-3==res.Code){
                           msg = $.t('verify_error');
                        }
                     }else{
                        if(-1==res.Code){
                           msg = $.t('minute_mail');
                        }else if(-2==res.Code){
                           msg = $.t('email_been');
                        }else if(-3==res.Code){
                           msg = $.t('verify_error');
                        }
                     }
                     flag = false;
                     obj.formValidate('#code',msg);
                  }
               }
            });
         }
         
         var opens = null;
         $('.account').text(obj.account|| '');
         if(0!=$('#btn-submit').length){
            // 获取短信/邮件验证码
            $('.btn-msg').on('click',function(){
               var that = $(this),
                  type = that.attr('data-type'),
                  account = $('#account').val().trim(),
                  code = $('#code').val().trim(),
                  codeTimer= null,flag = true;

               $('#account').trigger('blur');
               $('#code').trigger('blur');
               if('msg'==type){
                  if(!isNaN(account) && account.length >=6 && account.length<20){
                     account = $('.dropdown-num').text().substr(1)+'-'+account;
                     msgCodeFn({account:account,code:code,that:that,s: 59});
                  }
               }else if('email'==type){
                  if(obj.validate(obj.reg_email,account)){
                     msgCodeFn({account:account,code:code,that:that,s: 899});
                  }
               }
               obj.flag = flag;
            });
         }else if(0!=$('.setPwd-box').length){
            $('#btn-set').on('click',function(){
               var pwd = $('#pwd').val().trim(),
                  $msg = $('.errorMsg'),
                  msg = '',
                  type = $('input[name="validate"]:checked').val();
               $('#pwd').trigger('blur');
               if(obj.flag){
                  obj.ajaxFn('/user/SetTradePassword',{
                     data: {password: pwd,type: type},
                     callback: function(res){
                        if(res.IsSuccess){
                           obj.modShow('#mod-setBuzPwd');
                        }else{
                           if(-1000==res.Code){
                              msg = $.t('user_log');
                           }else if(211==res.Code){
                              msg = $.t('trade_been');
                           }
                           $msg.text(msg);
                           obj.modShow('#mod-error');
                        }
                     }
                  });
               }
            });
         }else if(0!=$('.commit-box').length){
            //enter键提交表单验证
            obj.submitForm('.commit-box','#btn-commit');
            //验证tab栏切换
            $('.code-verity').on('click',function(e){
               var value = e.target.value,
                   phone = $('.commit-box>.box-input').eq(3),
                   email = $('.commit-box>.box-input').eq(4)
                   google = $('.commit-box>.box-input').eq(5);
               if(!isNaN(value)){
                  $(e.target).prop('checked',true);
               }
               if(value == 1){
                  google.attr("class","box-input hide");
                  // code.attr("class","box-input msg-show show");
                  // code.find('i').eq(0).attr("class","icon icon-bubble");
                  phone.addClass('show').removeClass('hide');
                  email.addClass('hide').removeClass('show');
               }else if(value == 2){
                  // $('.btn-msg').attr('data-type',"email");
                  // code.find('i').eq(0).attr("class","icon icon-email");
                  google.attr("class","box-input hide");
                  // code.attr("class","box-input msg-show show");
                  email.addClass('show').removeClass('hide');
                  phone.addClass('hide').removeClass('show');
               }else if (value == 3){
                  // code.attr("class","box-input msg-show hide");
                  email.addClass('hide').removeClass('show');
                  phone.addClass('hide').removeClass('show');
                  google.attr("class","box-input show");
               }
            });
            //获取用户安全工具绑定状态
            $('.certify-type').on('blur',function(){
               var account = $('#user').val().trim();
               if(account){
                  obj.ajaxFn('/account/GetAuthType',{
                     data: {account: account},
                     callback: function(res){
                        var msg = '';
                        if(res.IsSuccess){
                           var code = res&&res.Code,
                               type = res.Data&&res.Data.Type,
                               // code = $('.commit-box>.box-input').eq(3),
                               phone = $('.commit-box>.box-input').eq(3),
                               email = $('.commit-box>.box-input').eq(4),
                               card = $('.commit-box>.box-input').eq(1),
                               google = $('.commit-box>.box-input').eq(5),
                               labels = $('.code-verity>label');
                           if(res.Data.IsBindIdNo){
                              card.removeClass('hide');
                           }
                           if(code==0){
                              obj.formValidate('#user',null,true);
                           }
                           if(type == 0){
                              
                           }else if(type == 1){
                              // code.attr("class","box-input msg-show show");
                              // code.find('i').eq(0).attr("class","icon icon-email");
                              email.removeClass('hide').addClass('show');
                           }else if(type == 2){
                              // code.attr("class","box-input msg-show show");
                              // code.find('i').eq(0).attr("class","icon icon-bubble");
                              phone.removeClass('hide').addClass('show');
                           }else if(type == 3){
                              labels.eq(0).removeClass('hide');
                              labels.eq(1).removeClass('hide');
                              labels.eq(0).find('input').attr('checked',true);
                              // code.attr("class","box-input msg-show show");
                              // code.find('i').eq(0).attr("class","icon icon-bubble");
                              phone.removeClass('hide').addClass('show');
                           }else if(type == 4){
                              labels.eq(2).find('input').attr('checked',true);
                              google.attr("class","box-input show");
                           }else if(type == 5){
                              labels.eq(1).removeClass('hide');
                              labels.eq(2).removeClass('hide');
                              labels.eq(2).find('input').attr('checked',true);
                              google.attr("class","box-input show");
                           }else if(type == 6){
                              labels.eq(0).removeClass('hide');
                              labels.eq(2).removeClass('hide');
                              labels.eq(2).find('input').attr('checked',true);
                              google.attr("class","box-input show");
                           }else if(type == 7){
                              labels.eq(0).removeClass('hide');
                              labels.eq(1).removeClass('hide');
                              labels.eq(2).removeClass('hide');
                              labels.eq(2).find('input').attr('checked',true);
                              google.attr("class","box-input show");
                           }
                            // 获取短信/邮件验证码
                           $('.btn-msg').on('click',function(e){
                              console.log($(this));
                              console.log($(this).attr('data-type'));
                              var that = $(this),
                                  flag = false,
                                  type = that.attr('data-type'),
                                  userId = res.Data&&res.Data.UserId,
                                  idNo = $('#card').val().trim(),
                                  captchaCode = $('.input-validate').val().trim();
                              if('msg' == type){
                                 type = 2;
                              }else if('email' == type){
                                 type = 1;
                                 flag = true;
                              }
                              tobj.getCaptchaCode(that,{Type:type,UserId:userId,idNo:idNo,captchaCode:captchaCode},flag);     
                           });
                           //找回登录密码提交
                            $('#btn-commit').on('click',function(){
                              var type = $('.msg-show.show [data-type]').attr('data-type'),
                                  account = $('#user').val().trim(),
                                  userId = res.Data&&res.Data.UserId,
                                  idNo = $('#card').val().trim(),
                                  code = $('#msg-code').val().trim(),
                                  // google = $('.commit-box>.box-input').eq(4),
                                  labels = $('.code-verity>label'),
                                  captchaCode = $('.input-validate').val().trim();
                                  console.log(type);
                                  console.log('email' == type);
                              if('msg' == type){
                                 type = 2;
                              }else if('email' == type){
                                 type = 1;
                                 code = $('#email-code').val().trim();
                              }
                              if(labels.eq(2).find('input').prop('checked')){
                                 // code = google.val().trim();
                                 code = $('#google').val().trim();
                                 type = 4;
                              }
                              obj.ajaxFn('/account/ForgotPasswordVerify',{
                                 data: {Type:type,UserId:userId,idNo:idNo,code:code,captchaCode:captchaCode},
                                 callback: function(res){
                                    var msg = '';
                                    if(res.IsSuccess){;
                                       localStorage.setItem('UserId',userId);
                                       localStorage.setItem('account',account);
                                       window.location.href = './resetPwd.html?account='+account;
                                       // if(2===(type&2)){
                                       //    window.location.href = './resetPwd.html?account='+account;
                                       // }else if(1===(type&1)){
                                       //    window.location.href = './email-updatePwd.html?account='+account;
                                       // }
                                    }else{
                                       $('#pic-captcha').trigger('click');
                                       if(406==res.Code){
                                          msg = $.t('id_error');
                                          obj.formValidate('#card',msg);
                                       }else if(202==res.Code){
                                          msg = $.t('expired');
                                          if(labels.eq(2).find('input').prop('checked')){
                                             obj.formValidate('#google',msg);
                                          }else if(labels.eq(0).find('input').prop('checked')){
                                             obj.formValidate('#msg-code',msg);
                                          }else{
                                             obj.formValidate('#email-code',msg);
                                          }
                                       }else if(-3==res.Code){
                                          msg = $.t('picture');
                                          $('#pic-captcha').trigger('click');
                                          obj.formValidate('#code',msg);
                                       }else if(201==res.Code){
                                          msg = $.t('verify_error');
                                          if(labels.eq(2).find('input').prop('checked')){
                                             obj.formValidate('#google',msg);
                                          }else if(labels.eq(0).find('input').prop('checked')){
                                             obj.formValidate('#msg-code',msg);
                                          }else{
                                             obj.formValidate('#email-code',msg);
                                          }
                                       }
                                    }
                                 }
                              });
                           });
                        }else{
                           if(32==res.Code){
                              msg = $.t('account_exist');
                              obj.formValidate('#user',msg);
                           }else if(-1==res.Code){
                              msg = $.t('verify_error');
                              $('#pic-captcha').trigger('click');
                              obj.formValidate('#code',msg);
                           }
                        }
                     }
                  });
               }
            });
            // $('#btn-commit').on('click',function(){
            //    var account = $('#user').val().trim(),
            //       code = $('#code').val().trim();
            //       //prev = $('.dropdown-num').text().substr(1);

            //    if(obj.flag){
            //       /*if(!isNaN(account)){
            //          account = prev + '-'+account;
            //       }*/
            //       obj.ajaxFn('/account/GetAuthType',{
            //          data: {account: account,picCaptcha: code},
            //          callback: function(res){
            //             var msg = '',type = 0,id = '';
            //             if(res.IsSuccess){
            //                type = res.Data.Type;
            //                id = res.Data.UserId;
            //                localStorage.setItem('UserId',id);
            //                localStorage.setItem('account',account);
            //                if(2===(type&2)){
            //                   window.location.href = './resetPwd.html?account='+account;
            //                }else if(1===(type&1)){
            //                   window.location.href = './email-updatePwd.html?account='+account;
            //                }
            //             }else{
            //                $('#pic-captcha').trigger('click');
            //                if(32==res.Code){
            //                   msg = $.t('account_exist');
            //                   obj.formValidate('#account',msg);
            //                }else if(-1==res.Code){
            //                   msg = $.t('verify_error');
            //                   $('#pic-captcha').trigger('click');
            //                   obj.formValidate('#code',msg);
            //                }
            //             }
            //          }
            //       });
            //    }
            // });
         }else if(0!=$('.reset-box').length){
            obj.submitForm('.reset-box','#btn-reset');
            var sobj = obj.getStorage() ||{},
               pobj = obj.getParam() || {},
               that = $('.btn-msg'),
               $btn = $('#btn-reset'),
               _code = null,_id=null,
               isEmail = !!pobj.code;
            //$('#account').val(obj.getParam().account || obj.account);
            if(pobj.Userid){
               _code = pobj.code;
               _id = pobj.Userid;
            }else{
               _id = sobj.Id;
            }

            if(!isEmail) {
               //$('.box-hide').addClass('show');
               $('.msg-show').addClass('show');
            }
            that.on('click',function(){
               //var account = $('#account').val().trim();
                  //prev = $('.dropdown-num').text().trim().substr(1);

               if(obj.flag){
                  //account = prev + '-'+account;
                  obj.ajaxFn('/account/ForgotPasswordApply',{
                     data: {userId: _id,account: pobj.account},
                     callback: function(res){
                        var msg = '';
                        if(res.IsSuccess){
                           obj.countDown(that,59);
                        }else{
                           if(203==res.Code){
                              msg = $.t('sms_often');
                              obj.formValidate('#msg-code',msg);
                           }else if(1001==res.Code){
                              msg = $.t('not_regist');
                              obj.formValidate('#account',msg);
                           }
                           localStorage.clear();
                        }
                     }
                  });
               }
            });
            $btn.on('click',function(){
               var data = {},code=_code,msg='',
                  pwd = $('#pwd').val().trim(),
                  repwd=$('#repwd').val().trim(),
                  $show = that.closest('.msg-show');
               if(!pwd){
                  obj.formValidate('#pwd',$.t('enter_password'));
                  obj.flag=false;
               }
               
               $('#msg-code').on('blur',function(){
                  var val = $(this).val();
                  if(!val){
                     obj.formValidate('#msg-code',$.t('enter_code'));
                     obj.flag = false;
                  }else{
                     obj.formValidate('#msg-code',null,true);
                  }
               });
               $('#repwd').on('blur',function(){
                  var flag = true,
                     repwd = $(this).val().trim();
                  if(!repwd){
                     obj.formValidate('#repwd',$.t('passd_empty'));
                     flag=false;
                  }else{
                     if(pwd!=repwd){
                        obj.formValidate('#repwd',$.t('consist'));
                        flag=false;
                     }else{
                        obj.formValidate('#repwd',null,true);
                     }
                  }
                  console.log('pwd',flag);
                  obj.flag = flag;
               });
               $('#msg-code').trigger('blur');
               $('#repwd').trigger('blur');
               if(1==obj.pwdValidate(pwd)){
                  obj.formValidate('#pwd',$.t('Registration'));
                  obj.flag=false;
               }
               if(obj.flag){
                  console.log(1);
                  $btn.prop('disabled',true).text($.t('Modifying'));
                  if($show.hasClass('show')){
                     code = $('#msg-code').val().trim();
                  }
                  obj.ajaxFn('/account/ForgotPassword',{
                     data: {userId: _id,password: pwd,code: code},
                     callback: function(res){
                        if(res.IsSuccess){
                           obj.modShow('#mod-tips');
                        }else{
                           if(0==res.Code){
                              msg = $.t('pwd_format');
                           }else if(-1==res.Code){
                              msg = $.t('Unmodified');
                              window.location.href='./forgotPwd.html';
                           }
                           if(that.hasClass('show')){
                              obj.formValidate('#msg-code',msg);
                           }else{
                              $('.errorText').text(msg);
                              obj.modShow('#mod-error');
                           }
                        }
                        $btn.prop('disabled',false).text($.t('modify'));
                        localStorage.clear();
                     },
                     errorCallback: function(res){
                        $btn.prop('disabled',false).text($.t('modify'));
                     }
                  });
               }
            });
         }else if(0!=$('.email-box').length){
            var pobj=obj.getParam(),sobj = obj.getStorage(),
               _code = null,_id=null;
            $('#email').val(pobj.account||'');
            /*if(0 !=Object.keys(pobj).length){
               _code = pobj.code;
               _id = pobj.Userid;
            }else{
               _id = sobj.Id;
            }*/

            /*$('#btn-commit').on('click',function(){
               var email = $('#email').val().trim(),
                  code = $('#code').val().trim();

               $('#email').trigger('input');
               $('#code').trigger('blur');
               if(obj.flag && obj.validate(obj.reg_email,email)){
                  obj.ajaxFn('/account/ForgotPasswordApply',{
                     data: {userId: sobj.Id,account: email},
                     callback: function(res){
                        var msg = '';
                        if(res.IsSuccess){
                           $('.getLoginEmail').prop('href','./resetPwd.html?account='+email+'&code='+_code+'&Userid='+sobj.Id);
                           obj.modShow('#mod-tips');
                        }else{
                           $('#pic-captcha').click();
                           if(203 == res.Code){
                              msg = $.t('frequently');
                           }else if(1001 == res.Code){
                              msg = $.t('mail_error');
                           }
                           localStorage.clear();
                           $('#mod-error .errorText').text(msg);
                           obj.modShow('#mod-error');
                        }
                     }
                  });
               }
            });*/
         }else if(0!=$('.forgotBuzPwd-box').length){
            $('#btn-commit').on('click',function(){
               var account = $('#account').val().trim(),
                  code = $('#code').val().trim(),
                  prev = $('.dropdown-num').text();

               $('#account').trigger('blur');
               $('#code').trigger('blur');
               if(obj.flag){
                  /*if(!isNaN(account)){
                     account = prev + '-'+account;
                  }*/
                  obj.ajaxFn('/user/GetAuthType',{
                     callback: function(res){
                        var type = null,msg='';
                        if(res.IsSuccess){
                           type = res.Data;
                           id = res.Data.UserId;
                           localStorage.setItem('Type',type);
                           if(2==(type&2)){
                              window.location.href = './resetBuzPwd.html';
                           }else if(1==(type&1)){
                              window.location.href = './email-updateBuzPwd.html';
                           }
                        }else{
                           if(-1==res.Data){
                              msg = $.t('verify_error');
                              obj.formValidate('#code',msg);
                           }else if(32==res.Data){
                              msg = $.t('account_exist');
                              obj.formValidate('#account',msg);
                           }
                        }
                     }
                  });
               }
            });
         }else if(0!=$('.resetBuz-box').length){
            obj.submitForm('.resetBuz-box','#btn-reset');
            var that = $('.btn-msg'),
               account = null,
               //prev = $('.dropdown-num').text(),
               pobj=obj.getParam(),_code = null,_id=null,isEmail=false;
            $('#account').val(obj.account||'');
            account = $('#account').val();
            if(account){account = account.trim();}
            isEmail = obj.validate(obj.reg_email,account);
            /*if(isEmail){

            }else{
               $('.box-hide').addClass('show');
               //$('.msg-show').addClass('show');
            }*/
            //重置交易密码的展示
            obj.getAuthType({
               callback: function(res){
                  var $phone = $('.login-box>.box-input').eq(2);
                  var $gug = $('.login-box>.box-input').eq(3);
                  if(res.IsSuccess){
                     if(2==res.Data || 3==res.Data){
                        console.log(res.Data);
                        $phone.addClass('show').removeClass('hide');
                        $gug.addClass('hide').removeClass('show');
                     }else if(4==res.Data || 5==res.Data){
                        $gug.addClass('show').removeClass('hide');
                        $phone.addClass('hide').removeClass('show');
                     }else if(6==res.Data || 7==res.Data){
                        $gug.addClass('show').removeClass('hide');
                        $phone.addClass('hide').removeClass('show');
                        $('.code-tab').eq(1).addClass('show').removeClass('hide');
                     }
                  }
                  $('.code-tab').on('click',function(){
                     if($(this).attr('data-type')=='gug'){
                        $('.code-tab').eq(0).addClass('hide').removeClass('show');
                        $('.code-tab').eq(1).addClass('show').removeClass('hide');
                        $gug.addClass('show').removeClass('hide');
                        $phone.addClass('hide').removeClass('show');
                     }else if($(this).attr('data-type')=='phone'){
                        $('.code-tab').eq(0).addClass('show').removeClass('hide');
                        $('.code-tab').eq(1).addClass('hide').removeClass('show');
                        $gug.addClass('hide').removeClass('show');
                        $phone.addClass('show').removeClass('hide');
                     }
                  });
               }
            });
            that.on('click',function(){
               var account = obj.account;
                  //prev = $('.dropdown-num').text().trim().substr(1);
               $('#account').trigger('blur');
               if(obj.flag){
                  //account = prev + '-'+account;
                  obj.ajaxFn('/user/SendForgotTradePasswordCaptcha',{
                     // data: {account: account},
                     callback: function(res){
                        var msg = '';
                        if(res.IsSuccess){
                           obj.countDown(that,59);
                        }else{
                           if(203==res.Code){
                              msg = isEmail?$.t('frequently'):$.t('sms_often');
                              obj.formValidate('#msg-code',msg);
                           }else if(1001==res.Code){
                              msg = isEmail?$.t('mail_error'):$.t('phone_error');
                              obj.formValidate('#account',msg);
                           }
                        }
                     }
                  });
               }
            });
            $('#btn-reset').on('click',function(){
               var pwd = $('#pwd').val().trim(),
                  code = _code || $('#google').val().trim(),
                  type = $('.box-input.show').attr('data-type');
                  lv=obj.pwdValidate(pwd);
               if(type == 'gug'){
                  type = 4;
               }else{
                  type = 2;
               }
               if(1===lv){
                  obj.flag=false;
               }
               if(!code){
                  code = $('#msg-code').val().trim();
               }
               if(obj.flag){
                  /*if(!isNaN(account)){
                     account = prev + '-'+account;
                  }*/
                  obj.ajaxFn('/User/ForgotTradePassword',{
                     data: {type:type,password: pwd,code: code},
                     callback: function(res){
                        var msg = '';
                        if(res.IsSuccess){
                           obj.modShow('#mod-tips');
                        }else{
                           if(201==res.Code){
                              msg = $.t('verify_error');
                           }else if(202==res.Code){
                              msg = $.t('expired');
                           }
                           $('#mod-error .errorText').text(msg);
                           obj.modShow('#mod-error');
                        }
                     }
                  });
               }
            });
         }else if(0!=$('.email-buz-box').length){
            $('#btn-commit').on('click',function(){
               var email = $('#email').val().trim(),
                  pobj=obj.getParam(),_code = null,_id=null;

               if(0!=Object.keys(pobj).length){
                  _code = pobj.code;
                  _id = pobj.Userid;
               }

               $('#email').trigger('blur');
               if(obj.flag && obj.validate(obj.reg_email,email)){
                  obj.ajaxFn('/User/ForgotTradePasswordApply',{
                     data: {account: email},
                     callback: function(res){
                        var msg = '';
                        if(res.IsSuccess){
                           window.location.href='./resetBuzPwd.html?code='+_code+'&Userid='+_id;
                        }else{
                           if(203 == res.Code){
                              msg = $.t('frequently');
                           }else if(1001 == res.Code){
                              msg = $.t('mail_error');
                           }
                           $('#mod-error .errorText').text(msg);
                           obj.modShow('#mod-error');
                           localStorage.clear();
                        }
                     }
                  });
               }
            });
         }else if(0!=$('.bind-box').length){
            obj.submitForm('.bind-box','#btn-bind');
            $('#btn-bind').on('click',function(){
               var that = $(this),
                  _type = that.attr('data-type'),
                  code = $('#msg-code').val().trim();

               if('msg'==_type){
                  tobj.bindSomething(that,{code: code});

               }else{
                  tobj.bindSomething(that,{secretValue: code},true);
               }
               $(this).text($.t('binding'));
               $(this).prop('disabled',true);
            });
            // 获取短信/邮件验证码
            $('.btn-msg').on('click',function(){
               var that = $(this),
                  type = that.attr('data-type'),
                  account = '',email = '',
                  codeTimer= null;
               $('#email').trigger('blur');
               $('#email').on('blur',function(){
                  var val = $(this).val().trim();
                  if(!val){
                     obj.formValidate('#email',$.t('enter_email'));
                  }
               });
               if(0!=$('#phone').length){
                  account = $('#phone').val().trim();
               }
               if(0!=$('#email').length){
                  email = $('#email').val().trim();
               }

               if('msg'==type){
                  if(!isNaN(account) && account.length >=6 && account.length<20){
                     account = $('.dropdown-num').text().substr(1)+'-'+account;
                     tobj.getCaptcha(that,{phoneNumber: account});
                  }
               }else if('email'==type){
                  if(obj.validate(obj.reg_email,email)){
                     tobj.getCaptcha(that,{email: email},true);
                  }
               }
            });
         }else if(0!=$('.validate-box').length){
            tobj.getAuthType();
            obj.submitForm('.validate-box','#btn-auth');
            // 切换谷歌/手机验证
            $('.box-input').on('click','.code-tab',function(){
               var $box = $(this).parent();
               $('.box-auth').removeClass('hide').addClass('on');
               $box.addClass('hide').removeClass('on');
            });
            // 倒计时
            $('.send-code').on('click','>button',function(){
               var that = $(this);
               obj.sendPhoneCaptcha(that);
            });
            // 提交验证
            $('#btn-auth').on('click',function(){
               var $auth = $('.box-auth.on'),
                  that = $(this),
                  _type = $auth.find('p').attr('data-type'),
                  _val = $auth.find('input').val().trim(),
                  data={isOtp: false,code: _val};

               that.prop('disabled',true);
               that.text($.t('commit'));
               if('phone'==_type){
                  data.isOtp = true;
               }
               tobj.secondVerify(that,data);
            });
         }else if(0!=$('.choose-validate').length){
            obj.getAuthType({
               callback: function(res){
                  var $phone = $('.bind-btn').eq(1);
                  if(res.IsSuccess){
                     if((res.Data&2)!=0){
                        if(!$phone.hasClass('hide')){
                           $phone.addClass('hide');
                        }
                     }else{
                        $phone.removeClass('hide');
                     }
                  }
               }
            });
         }
         if(0!=$('.email-box').length || 0!=$('.email-buz-box').length){
            $('#email').on('input',function(){
               var val = $(this).val().trim();

               if(0!=val.length){
                  if(!obj.validate(obj.reg_email,val)){
                     obj.formValidate('#email',$.t('email_format'));
                  }else{
                     obj.formValidate('#email',null,true);
                  }
               }else if(0==val.length){
                  obj.formValidate('#email',$.t('empty'));
               }
            });
         }
      }else if(0!=$('#login-box').length){
         $('#login-box').on('keypress',function(e){
            e = e || window.event;
            if((e.keyCode && 13==e.keyCode) || (e.which && 13==e.which)){
               $('#btn-submit').trigger('click');
            }
         });
         /*if(0!=$('#remember').length){
            if(obj.getCookie('account')){
               $('#account').val(obj.getCookie('account'));
               $('#remember').prop('checked',true);
            }
         }*/
         $('#btn-submit').on('click',function(){
            // obj.getLanguageType();
            var account = $('#account').val().trim(),
               pwd = $('#pwd').val().trim(),
               prev = $('.dropdown-num').text().substr(1),
               that = $(this),
               sign = false,
               sign = $('#remember').prop('checked'),
               checked = $('#remember').prop('checked'),
               exp = new Date();
               if(checked){
                  var data={account: account,password: pwd,Name:'bindIp'};
               }else{
                  data={account: account,password: pwd};
               }
            exp.setDate(exp.getDate()+7);

            $('#account').trigger('blur');
            $('#pwd').trigger('blur');
            /*if(sign){
               obj.setCookie('account',$('#account').val().trim(),exp.toGMTString());
            }else{
               obj.delCookie('account');
            }*/
            if(obj.flag){
               that.prop('disabled',true).text($.t('Log_in'));
               /*if(!isNaN(account)){
                  account = prev + '-'+account;
               }*/
               obj.ajaxFn('/account/Login',{
                  // data: {account: account,password: pwd},
                  data:data,
                  callback: function(res){
                     var msg = '';
                     if(res.IsSuccess){
                        obj.getLanguageType();
                        sign = true;
                        localStorage.setItem('account',account);
                     }else{
                        if(2==res.Code){
                           msg = $.t('incorrect_pwd');
                           obj.formValidate('#pwd',msg);
                           $('#pwd').focus();
                        }else if(8==res.Code){
                           msg = $.t('account_lock');
                           obj.formValidate('#account',msg);
                        }else if(16==res.Code){
                           msg = $.t('lock_minute');
                           obj.formValidate('#pwd',msg);
                        }else if(32==res.Code){
                           msg = $.t('account_exist');
                           obj.formValidate('#account',msg);
                           $('#account').focus();
                        }
                        sign = false;
                     }
                     localStorage.setItem('sign',sign);
                     that.prop('disabled',false).text($.t('login'));
                  },
                  errorCallback: function(){
                     that.prop('disabled',false).text($.t('login'));
                  }
               });
            }

         });
         $('#pwd').on('blur',function(){
            var val = $(this).val().trim(),
               flag = true;
            if(0==val.length){
               obj.formValidate('#pwd',$.t('password_null'));
               flag = false;
            }else if(8>val.length || 20 < val.length){
               obj.formValidate('#pwd',$.t('login_bit'));
               flag = false;
            }else if(8<=val.length || 20 >= val.length){
               obj.formValidate('#pwd',null,true);
            }
            obj.flag = flag;
         });

       
      }
   }
});