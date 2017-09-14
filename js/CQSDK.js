
if(window.CQSDK == null ){

	window.CQ = window.CQSDK = function(id,type){
		
		var ext = type?type:$(id).attr('ext');
		if(typeof id == 'string'){
			return $.data($(id)[0],ext);
		}else if(typeof id == 'object'){
			return $.data(id,ext);
		}
	}

	window.CQSDK.prototype  = {
		version:'1.0',
		title:'传奇开发包',
		author:'卓成俊',
		note:'未经作者允许，不能做商业用途'
	}
	CQSDK.Utils = {
		attrStringToJson:function(str){
			return eval('({'+str+'})');
		},
		templateParse:function(index, data, item, temp){
			/*
			支持索引 {$index}
			支持对象名 {name}，例如：{xxx} 
			支持序号 {index},例如：{0}
			*/
			item.$index = index;
			return temp.replace(/\{([^\}]*)\}/g, function(str, key) {		
		    	var keys = key.split("."), v = item[keys.shift()];
		    	for(var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
		    	if(typeof v === 'function'){
		    		return v(index, data, item) || ""
		    	}else{
		    		return (typeof v !== "undefined" && v !== null) ? v : "";
		    	}
		  	});
		},
		strToJson:function(str){
			if(str){
				str = str.replace(/(['"])?([a-zA-Z0-9\-]+)(['"])?:/g, '"$2":');
		        str = str.replace(/'/g, '"');
		        str = '{' + str + '}';
		        try{
		          return JSON.parse(str);
		        }catch(error){
		          return null;
		        }
		 }
		}
	};

	CQSDK.Mask = (function(){    
      
	    var $mask,$maskMsg;    
	        
	    var defMsg = '正在加载数据，请稍待...';    
	        
	    function init(){
	        if(!$mask){    
	            $mask = $("<div class=\" cq-mask mymask\"></div>").appendTo("body");    
	        }    
	        if(!$maskMsg){    
	            $maskMsg = $("<div class=\"datagrid-mask-msg mymask\">"+defMsg+"</div>")    
	                .appendTo("body").css({'font-size':'12px'});  
	        }    
	            
	        $mask.css({width:"100%",height:'100%'});    
            var width = $maskMsg.outerWidth(),height = $maskMsg.outerHeight();
	        $maskMsg.css({
	        	left:'calc(50% - '+width+'px)',
	        	top:'calc(50% - '+(height/2)+'px)'
	        });    
	    }    
	        
	    return {    
	        show:function(msg){    
	            init();    
	            $mask.show();    
	            $maskMsg.html(msg||defMsg).show();    
	        },   
	        hide:function(){    
	        	
	        	$mask.hide();    
	           	$maskMsg.hide(); 
	              
	        }    
	    }    
	        
	}());
	
	//获取url中"?"符后的字串
	CQSDK.RequestData = function(){
		var url = location.search; 
	    var theRequest = {};
	    if (url.indexOf("?") != -1) {
	        var str = url.substr(1);
	        strs = str.split("&");
	        for (var i = 0; i < strs.length; i++) {
	            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
	        }
	    }
	    return theRequest;
	};
	//接管EasyUI的解析器
	CQSDK.Parser = $.parser.parse;
	//重新写alert
	window.alert = function(text){
		$.messager.alert('传奇浏览器提示',text?text:'');  
	}
	//重新confirm
	/*window.confirm = function(text){
		$.messager.confirm('传奇浏览器提示',text);
	}*/
}


window.cq_type = {
	cqInput:{
		name:'cqInput',
		id:0,//
	},
	cq_menus:{
		name:'cq_menus',
		id:0
	},
	cq_btn:{
		name:'cq_btn',
		id:0
	},
	cq_dlg:{
		name:'cq_dlg',
		id:0
	},
	cq_form:{
		name:'cq_form',
		id:0
	},
	cq_tree:{
		name:'cq_tree',
		id:0
	},
	cq_grid:{
		name:'cq_grid',
		id:0
	},
	cq_listbox:{
		name:'cq_listbox',
		id:0
	},
	cq_form:{
		name:'cq_form',
		id:0
	},
	cq_tabs:{
		name:'cq_tabs',
		id:0
	},
	cq_pupMenus:{
		name:'cq_pupMenus',
		id:0
	}
}

//获取新的id
function Utils_getId (type) {
	if(type){
		cq_type[type].id += 1;
		return cq_type[type].name +'_'+ cq_type[type].id;
	}else{
		if(window.cqid == null){
			window.cqid = 0;
		}
		return window.cqid += 1
	}
}

//转换tree数据结构 var treeData = new TreeHelper(serverList).dataTransferer();
function TreeHelper(list,idName,pidName,title){
    this.list = list;
    this.id = idName;
    this.pid = pidName;
    this.title = title;
}
/***************tree数据转换类**********************/
(function(TreeHelper){
    function getAllChildren(list,item,id,pid,title){
        var children = getNextLevelChildren(list,item,id,pid,title);
        for(var i=0,ii=children.length;i<ii;i++){
            getAllChildren(list,children[i],id,pid,title);
        }
    }
    //遍历list剩下的数据，找到item的下一层的子节点
    function getNextLevelChildren(list,item,id,pid,title){
        var children = [];
        for(var i=list.length-1;i>=0;i--){
            var mid = list[i];
            if(mid[pid] === item[id]){
                delete mid[pid];
                mid = $.extend({},mid,{id:mid[id],pid:mid[pid],text:mid[title]});
                children.push(mid);
                list.splice(i,1);
            }
        }
        if(children.length > 0){
            item.children = children;
        }
        return children;
    }
    TreeHelper.prototype.dataTransferer = function(){
        var list = this.list,id= this.id,pid = this.pid,text = this.title,count=0;
        if( !list || !list.length > 0){
        	return [];
        }

        for(var key in list[0]){
        	if(key.indexOf(id) > -1 || key.indexOf(pid) > -1 || key.indexOf(text) > -1){
        		count ++ ;
        	}
        }
        if(count != 3){
        	console.log('keyName,parentName,valueName,不正确');
        	return;
        }
        //根节点必须在数组前面
        list.sort(function(a,b){
            if(a[pid] > b[pid]){
                return 1;
            }else{
                return -1;
            }
        });
        var item, result = [];
           
        //遍历根节点，递归处理其所有子节点的数据
        //每处理完一个根节点，就将其及其所有子节点从list中删除，加快递归速度
        while(list.length){
            item = list[0];
            list.splice(0,1);
            delete item[pid];
            getAllChildren(list,item,id,pid,text);
            item = $.extend({},item,{id:item[id],pid:item[pid],text:item[text]});
            result.push(item);
        }
        return result;
    };
})(TreeHelper);

/**************************CQ-ajax**********************************/
(function($,Utils){
	CQSDK.ajax = CQSDK.Utils.ajax = function(options){
		options = checkAjax( options );
		if(options.error == null){//默认 每次写得好累
			options.error = function(xml){
				CQSDK.Mask.hide();
				alert(xml.responseText);
			}
		}
		$.ajax( options );
	}
	CQSDK.ajax.get = function (options) {
		options.type = 'GET';
		return CQSDK.ajax(options)
	}

	CQSDK.ajax.post = function (options) {
		options.type = 'POST';
		return CQSDK.ajax(options)
	}
	CQSDK.ajax.delete = function( options ){
		options.type = 'DELETE'
		return CQSDK.ajax(options)
	}

	function checkAjax(options){
		if(typeof options == "function"){
			options = {
				type: 'function',
				handler: options
			}			
		}else{
			options = options || {}					
			options.async = options.async != false //默认异步请求
			options.type = String(options.type || 'GET').toUpperCase()   //支持 function 		
			//options.method = options.type
			options.dataType = (options.dataType || 'json').toLowerCase()	//默认json格式
			options.contentType = options.contentType || 'application/json; charset=utf-8'							
			if(options.remoteApi!=null && options.remoteApi!==false){
				options.remoteUrl = options.url
				if(/^(?:GET|HEAD)$/.test( options.type || options.method ) && options.data){
					if(typeof options.data !== 'string'){
						options.data = $.param(options.data, false)
					}					
					options.remoteUrl = ( options.url += ( (/\?/).test( options.remoteUrl ) ? "&" : "?" ) + options.data )
					delete options.data
				}
				options.url = "/proxy"
			}
			if(options.dataType=='json' && options.type!=='GET' && options.data && typeof options.data=='object'){
				options.data = JSON.stringify(options.data)
			}
			//要求为Function类型的参数，发送请求前可以修改XMLHttpRequest对象的函数，例如添加自定义HTTP头。在beforeSend中如果返回false可以取消本次ajax请求。XMLHttpRequest对象是惟一的参数。
			options._____beforeSend = options.beforeSend
			options.beforeSend = function(XMLHttpRequest){				
				if(this.remoteUrl){
					XMLHttpRequest.setRequestHeader("p-url", this.remoteUrl)
				}
				if(typeof options.remoteApi == 'string'){
					XMLHttpRequest.setRequestHeader("p-org", this.remoteApi)
				}
				if(this._____beforeSend){
					this._____beforeSend(XMLHttpRequest)
				}
			}
		}
		return options
	}

})(jQuery,CQSDK.Utils);

/**********************按钮*****************************************/
(function($) {
	//$.parser.plugins.splice(1, 0,'cqmenus');//将自定义的插件加入 easyui 的插件组
	//$.parser.plugins.splice(2, 0,pluginsType);
	/**
	 * 插件定义
	 */
	/*$.fn.menus = function(options, param){
		$.fn.cqmenus(options, param);
	}*/
	
	$.fn.cqmenus =$.fn.menus = function(options, param) {
		if (typeof options == "string") {
			return $.fn.cqmenus.methods[options](this, param);
		};
		
		options = options || {};

		return this.each(function(){
			var id = this.id || $(this).attr('id',Utils_getId('cq_menus')),opts ;
			var data = $.data(this, "cqmenus");
			if (data) {
				opts = $.extend(data.options, options);
			} else {
				opts = $.extend( {}, $.parser.parseOptions(this), options);
				cq_data = $.extend({},$.fn.cqmenus.defaults,$.fn.cqmenus.parseOptions(this));
				data = $.data(this, "cqmenus", {
					options : opts,
					cq_data: cq_data,
					target:this
				});
			}
			//你的插件。。。
			//如果在这里动态的生成了  easyui 的控件，html 写到页面上后是不能渲染成 easyui 组件的，需要手动调用
			//$.parser.parse(你定义的html); // parse 必须渲染父节点，不能渲染节点本身
			create(this,cq_data);
		});
	};

	var htmlTmp = '<span class="cq-btn cq-action" action="%s"><a></a><c>%s</c></span>';
	
	function create(target){
		var state = $.data(target, 'cqmenus');
		$(target).attr('ext','cqmenus');
		var cq_data = state.cq_data;
		if(!cq_data.menus || cq_data.menus.length <0 ) return ;
		//创建dom
		for(var i=0,len=cq_data.menus.length;i<len;i++){
			var item = cq_data.menus[i];
			if(typeof item === 'string'){//普通按钮
				var gruopHtml = '<span class="cq-btn-breakmenu">&nbsp;</span>';
				var $span = $( item=='|'?gruopHtml:htmlTmp.replace(/\%s/g,item)).appendTo($(target));
				if('close' === item){//默认关闭按钮图标
					$span.find('a:first-child').addClass('cq-btn-a cq-icon-close');
					$span.find('c').text('关闭');
				}
				if('refresh' === item){
					$span.find('a:first-child').addClass('cq-btn-a cq-icon-refresh');
				}
				if('add' === item){
					$span.find('a:first-child').addClass('cq-btn-a cq-icon-add');
				}
				if('edit' === item){
					$span.find('a:first-child').addClass('cq-btn-a cq-icon-edit');
				}
				if('del' === item || 'delete' === item){
					$span.find('a:first-child').addClass('cq-btn-a cq-icon-delete');
				}

				
			}else if(typeof item === 'object'){//分组按钮 调用底层的easyui-menubutton
				var id = Utils_getId('cq_btn');
				//创建div 下拉
				var $menu = $('<sapn>',{
					class:'easyui-menubutton cq-btn',
					id:id,
					text:item.text,
					'data-options':'menu:\'#mm_'+id+'\'',
				}).appendTo($(target));

				var $jq = $('<div>',{
					id:'mm_'+id,
					class:'cq-mm-item',
				}).appendTo($(target));

				for(var j=0,jlen=item.menus.length;j<jlen;j++){
					var t = item.menus[j];
					$('<div>',{text:t,action:t,class:'cq-action'}).appendTo($jq)
				}
				var a= $.parser.parse(target);
				$(target).removeClass('l-btn-plain');
				//删除原来的样式
				
			}
		}	
	}

	function visiable(target,itemName){
		var state = $.data(target, 'cqmenus');
		var cq_data = state.cq_data;
	}

	/**
	 * 默认值配置
	 */
	$.fn.cqmenus.defaults = $.fn.menus.defaults = {//默认属性定义
	    visiable :true,
	    enable:true,
	    icon:'cq-icon-none'
	};

	/**
	 * 对外暴露的方法
	 */
	$.fn.cqmenus.methods =  $.fn.menus.methods = {
		onResTreeQuery : function(jq,param){
			return jq.each(function(){
				addTabs(this,param);
			});
			
		}
	};

	/**
	 * class声明式定义属性data-options转化为options
	 * @param {Object} target DOM对象
	 * @return {TypeName} 
	 */
	$.fn.cqmenus.parseOptions = $.fn.menus.parseOptions  = function(target) {
		var t = $(target);
		var cq_data = $.parser.parseOptions(target,['cq-data']);
		return CQSDK.Utils.attrStringToJson(cq_data['cq-data']);
	};
})(jQuery);	

/************************conbobx tree下拉框*****************************/
(function($){
	$.parser.plugins.push('cqInput');//将自定义的插件加入 easyui 的插件组
	
	/**
	 * 组件的构造函数
	 */
 	$.fn.cqInput = $.fn.input = function(options,param){
 		
 		if (typeof options == "string") {//外部调用组件方法
 			var action = $.fn.cqInput.methods[options];
 			if($.isFunction(action)){
 				return action(this, param);
 			}else if(typeof action == "object"){//get  set 

 			}
 			return;
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this,'cqInput');
			if(state){//已经初始化过   
				$.extend(state.options,options);
			}else{//还未初始化  
				state = $.data(this,'cqInput',{//可见用户定义优先级最高
					options:$.extend({},$.fn.cqInput.defaults,$.fn.cqInput.parseOptions(this),options)
				})
			}
			create(this);
		});
 	}

 	/**
 	 * 公共组件默认值
 	 */
 	$.fn.cqInput.defaults = {
 		border:true,
 		activate:false,
 		enabled:true,
 		layout:'fill',
 	}

 	/**
 	 * 公用的属性转换器
 	 * 解析 data-options 中的初始化参数
 	 */
 	$.fn.cqInput.parseOptions = function(target){
 		var t = $(target);
 		return $.extend({},$.parser.parseOptions(target,['valueField'])) ;
 	}

 	/**
 	 * 对外调用方法 $('#id').cqInput('方法名')
 	 * @type {Object}
 	 */
 	$.fn.cqInput.methods = {
 		value : {
 			get : function(jq){return $(jq).attr('data-value');},
 		}
 	}
 	
 	/**
 	 * 创建主入口
 	 */
 	function create(target){
 		//渲染样式
 		var state = $.data(target, 'cqInput');
		var opts = state.options;
		$(target).attr({
			     	id: target.id?target.id:Utils_getId('cqInput'),
			'data-value':opts.dfvalue?(target.value = opts.dfvalue):'',
			  style: opts.width?("width:"+opts.width+'px'):'',
			  ext:'cqInput',
			  required:opts.required
		});
		if(opts.sid){//下拉框把data加入
			var sidData = $.data(window,'sid')[opts.sid]?$.data(window,'sid')[opts.sid]:[];
			sidData?sidData:{[opts.sid]:[]};
			opts.data?null:(opts.data = sidData);
			$(target).addClass('cq-input cq-input-combox-list-bg cq-input-plugin');
			createSelectItems(target,opts.data);
		}else{//普通输入框
			opts.type = opts.type || 'text';
			$(target).attr('type',opts.type);
			switch (opts.type){
				case 'datetime':{
					$(target).addClass('cq-input-dateOrtime-list-bg');
					$(target).datetimepicker({
						format:'Y-m-d H:i:s'
					});
					break;
				}
				case 'date':{
					$(target).addClass('cq-input-dateOrtime-list-bg');
					$(target).datetimepicker({
						timepicker:false,
						format:'Y-m-d'
					});
					break;
				}
				case 'tree':{//下拉树
					$(target).addClass('cq-input-combox-list-bg');
					createTreeCtn(target);
				}
			}
			$(target).addClass('cq-input cq-input-plugin');
		}
		bindEvent(target);
		setOpts(state,target);
 	}
 	//创建下拉选项
 	function createSelectItems(target,data){
 		var state = $.data(target, 'cqInput');
 		var opts =  state.options;
 		//如果存在不创建 绑定ID即可
 		/*if( $.data(window,'sid') && $.data(window,'sid')[opts.sid] ){
 			opts.selectItemsID = $.data(window,'sid')[opts.sid].id;
 			return;
 		}*/
 		var id = 'drop_down_' + Utils_getId();
 		var $li = $('<div>',{id:id,class:'drop-down cq-hide',nowItem:''}).appendTo(document.body);
 		//绑定下拉框id
 		opts.selectItemsID = id;
 		for(var i=0;i<data.length;i++){
 			$('<li>',{text:data[i].value,value:data[i].id,'data-index':i,class:(!opts.dfvalue&&i===0)?'li-hover':''}).appendTo($li);
 		}
 		//加入页面缓存中
 		//$.data(window,'sid',{[opts.sid]:{data:opts.data,id:id}});
 		bindItems(opts);
 	}

 	function bindEvent(target){
 		var state = $.data(target, 'cqInput');
 		var opts =  state.options;
 		if(opts.sid){
 			$(target).on('click.cqInput',function(e){
	 			//下拉展现
				showSelectItems(target);	
	 		});
	 		/*$(target).on('blur.cqInput',function(e){
	 			//下拉展现
				 destroy(opts);	
	 		});*/
	 		
 		}
 		//绑定输入事件
 		bindChange(target);
 	}

 	function bindChange(target){
 		$(target).on('change',function(e){
 			setTimeout(function(){
				setValue(target.value,target)	 				
 			},1);
 		})
 	}

 	function showSelectItems(target){
 		var handler;
 		var go = function(){
 			//隐藏所有,只保留一个
 			var state = $.data(target, 'cqInput'),sender = $(target);
 			var opts =  state.options;
 			var id = opts.selectItemsID,$selectSender=$('#'+id);
 			if(!$selectSender.hasClass('activate')){
 				clearInterval(handler);
		 		var offset = sender.offset();
 				$selectSender.addClass('activate');
		 		//当前input
		 		$selectSender.attr('nowItem',target.id);
		 		if(opts.enabled && id){
		 			$selectSender.css({
		 				left:offset.left,
		 				top:offset.top + sender.outerHeight () ,
		 				'min-width': sender.outerWidth(),
		 			}).show();
		 			//选中节点
		 			var val = sender.attr('data-value');
		 			$selectSender.find('li').removeClass('li-hover');
		 			if(val){
		 				$selectSender.find('li[value="'+val+'"]').addClass('li-hover');
		 			}else{
		 				$selectSender.find('li:first-child').addClass('li-hover');
		 			}
		 		}
		 		hideSelectItems(target);
 			}
 		}
 		handler = setInterval(go, 1);
 	}	

 	function hideSelectItems(target){
 		var state = $.data(target, 'cqInput');
 		var opts =  state.options;
 		if($('#'+opts.selectItemsID).hasClass('activate')){
 			$(window).on('click.me',function(event){
 				//在这个范围之内，
 				var xp1 = $(target).offset();
 				var xp2 = $('#'+opts.selectItemsID).offset();
 				if(//显示区域
 						xp1.left < event.pageX && event.pageX < xp1.left + $(target).outerWidth()
 						&&
 						xp1.top < event.pageY && event.pageY < xp1.top + $('#'+opts.selectItemsID).outerHeight() + $(target).outerHeight()
 					||
 						(
 						xp1.left + $(target).outerWidth() < event.pageX && event.pageX < xp2.left +  $('#'+opts.selectItemsID).outerWidth()
 						&& 
 						xp2.top < event.pageY && event.pageY < xp2.top + $('#'+opts.selectItemsID).outerHeight()
 						)
 				){
 					//bindItems(opts,target);
 				}else{
 					destroy(opts);
 				}
 			});
 		}
 	}

 	function destroy(opts) {
 		$('#'+opts.selectItemsID).addClass('cq-hide').removeClass('activate').hide();
		$(window).off("click.me");
 	}

 	function bindItems(opts){
 		//绑定选中事件
		if(opts.multiselect){//多选

		}else{//单选 默认选中第一条 如果输入框有值 这选中
			if(opts.dfvalue || opts.value) {

			}
		}
 		
		$('#'+opts.selectItemsID).on('click','li',function(){
			var inputId = $('#'+opts.selectItemsID).attr('nowItem'); 
			if(inputId){
				var target= $('#'+inputId)[0],sender = $(this);
				target.value = sender.text();
				var value = $(this).attr('value');
				$(target).attr('data-value',value);
				opts.value = value;
				destroy(opts);
			}
		});
 	}

 	function setOpts(state,target){
		state.__proto__ = {
			get value(){
		        return getValue(target);
		    },
		    set value(val){
		    	setValue(val,target);
		    },
		    set width(val){
		    	this.options.width = val;
		    	$(target).width(val) ;
		    },
		    get width(){
		    	return this.options.width;
		    }
		}
 	}

 	function setValue(val,target,text){
 		$(target).attr('data-value',val);
 		var opts = $.data(target, 'cqInput').options;
 		if(opts.sid || opts.type == 'tree'){//sid还没有定
 			var sidData = $.data(window,'sid')[opts.sid],selectData,flag=false,text;
 			if(sidData && sidData.length>0){
 				selectData = $.grep(sidData,function(a){return a.id==val});
 				if(selectData&&selectData.length>0){
 					text = selectData[0].value;
 					flag = true;
 				}
 			}
 			if(!flag){
 				val = '';
 				text = '';
 			}
 			target.value = text;
 			$(target).attr('data-value',val);
 		}else{
 			opts.value = val;
 			target.value = val;
 		}
 	}

 	function getValue(target){
 		return $(target).attr('data-value');
 	}

 	//下拉树
 	function createTreeCtn(target){
 		var state = $.data(target, 'cqInput'),opts = state.options,id = 'drop_down_tree' + Utils_getId();;
 		var $div = $('<div>',{id:id,class:'drop-down-tree',nowItem:target.id}).appendTo(document.body).hide();
 		//绑定下拉框id
 		opts.selectItemsID = id;
 		createTree(target);
 	}
 	function createTree(target){
 		var state = $.data(target, 'cqInput'),opts = state.options,treeId = opts.selectItemsID;
 		opts.onSelect = function(node){
 			if(node){
 				setValue(node.id,target,node.text);
 				destroy(opts);
 			}
 		}
 		$.fn.cqtree.call($('#'+treeId),opts);

 		event(target);
 	}
	function event(target){
 		showTree(target);
 		//hideTree(target);
 		selectTreeValue(target)
 	}
 	function showTree(target){
 		var state = $.data(target, 'cqInput'),opts = state.options,treeId = opts.selectItemsID ;
 		$(target).on('focus',function(){
 			var sender = $(target),offset = sender.offset();
 			$('#'+treeId).css({
 				left:offset.left,
 				top:offset.top + sender.outerHeight () ,
 				'min-width': sender.outerWidth(),
 			}).show().addClass('activate');
 			hideSelectItems(target);
 		});

 	}
 	function selectTreeValue(target){
 		/*var state = $.data(target, 'cqInput'),opts = state.options,treeId = opts.selectItemsID ;
 		$('#'+treeId).tree('options',{onSelect:function(sender,node){
 			console.log(node);
 		}});*/
 	}
})(jQuery);

/************************绑定窗口dialog******************/
(function($){
	CQ.window = function($id,options){
		var $dlg = create($id,options),target = $dlg[0],winDld = $($id)[0];
		if($dlg){
			var state = $.data($dlg[0],'dialog');
			var opts = state.options;
			bandButton(winDld,options);
			setOpts($id);
			//绑定表单,目前支持一个表单
			//bindForm(target);
		}
		return CQ(opts.windowID);
	};

	var defaultsOpt = {
		resizable:false,
		width:500,
		icon:'cq-icon-logo',
		title:'New title',
		modal:true
	}
	function create($id,options){
		var id = Utils_getId('cq_dlg');

		//创建button
		var $button =  $('<div>',{
			id:id + '_buttons',
			class:'dialog-button',
			ext:'dialog'
		}).appendTo(document.body);

		if(options.buttons && options.buttons.length > 0){
			for(var index in options.buttons){
				var item = options.buttons[index];
				if(item.icon){
					$('<span class="cq-btn" flag="'+item.flag+'"><a class="cq-btn-a '+(item.icon?item.icon:'')+'"></a>'+item.text+'</span>').appendTo($button);
				}else{
					$('<span class="cq-btn" flag="'+item.flag+'">'+item.text+'</span>').appendTo($button);
				}
			}
		}else{//默认 buttons:[{text:'确定',flag:'ok'},{text:'取消',flag:'no'}],
			$('<span class="cq-btn" flag="ok">确定</span>').appendTo($button);
			$('<span class="cq-btn" flag="cancel">取消</span>').appendTo($button);
		}
		//创建dialog
		var options = $.extend({},defaultsOpt,options,
			{title:'<a id="'+id+'_icon" class="cq-btn-a '+(options.icon?options.icon:defaultsOpt.icon)+'"></a><span id="'+id+'_title" class="dlg-title">'+(options.title?options.title:defaultsOpt.title)+'</span>'},
			{buttons:'#'+id + '_buttons'},
			{titleID:'#'+id+'_title',iconID:'#'+id+'_icon'},
			{windowID:$id});
		var $dlg = $('<div>',{
			id:id,
			class:'easyui-dialog',
		}).appendTo(document.body);
		if($($id).length < 0){
			alert('定义不正确...');
			return;
		}
		//复制
		$($id).attr('ext','dialog');
		$($id).appendTo($dlg.dialog(options));
		$.data($($id)[0],'dialog',$dlg.dialog('options'));
		$($id).show();
		return $dlg;
	}

	function bandButton(target,options){
		var opts = CQ('#'+target.id);
		$(opts.buttons).find('span').on('click',function(){
			var flag = $(this).attr('flag');
			var action = options.handler(opts,flag);
			if(action){
				$('#'+opts.id).dialog('close');
			}
		});
	}

	function setOpts(id){
		//CQ(sender.id)
		var options = CQ(id);

		options.__proto__ = {
			close:function(){
				if(typeof options=== 'object'){
					$('#'+options.id).dialog('close');
				}
			},
			show:function(){
				$('#'+options.id).dialog('open');
			},
			set titled(val){
				if(typeof options === 'object'){
					options.title = val;
					$(options.titleID).html(val);
				}
			},
			get titled(){
				if(typeof options === 'object'){
					return $(options.titleID).text();
				}
			},
			set iconed(val){
				if(typeof options === 'object'){
					$(options.iconID).removeClass($(options.iconID).attr('class').split(' ')[1]);
					options.icon = val;
					$(options.iconID).addClass(val);
				}
			},
			get iconed(){
				return $(options.iconID).attr('class').split(' ')[1];
			},
			get form(){
				var $form = $('form',id)[0];
				return CQ('#'+$form.id);
			}
		}
	}

	function close(sender){

	}

})(jQuery);

/************************表单******************/
(function($){
	var pluginsType = 'form';
	$.parser.plugins.push(pluginsType);//将自定义的插件加入 easyui 的插件组
	$.fn[pluginsType] = function(options, param) {
		if (typeof options == "string") {
			return $.fn[pluginsType].methods[options](this, param);
		};
		
		options = options || {};

		return this.each(function(){
			var id =this.id || $(this).attr('id',Utils_getId('cq_form'));
			var opts ;
			var data = $.data(this, pluginsType);
			if (data) {
				opts = $.extend(data.options, options);
			} else {
				opts = $.extend( {}, $.fn[pluginsType].defaults,$.fn[pluginsType].parseOptions(this), options);
				data = $.data(this, pluginsType, {
					options : opts,
					target:this,
					type:pluginsType
				});
			}
			
			//你的插件。。。
			//如果在这里动态的生成了  easyui 的控件，html 写到页面上后是不能渲染成 easyui 组件的，需要手动调用
			//$.parser.parse(你定义的html); // parse 必须渲染父节点，不能渲染节点本身
			create(this);
			setOpts(this.id);
			keydownOnfocus(this.id);
			//表单认证 使用jquery validate 插件
			$(this).validate();
		});
	};
	/**
	 * 默认值配置
	 */
	$.fn[pluginsType].defaults = {//默认属性定义
	    
	};
	/**
	 * class声明式定义属性data-options转化为options
	 * @param {Object} target DOM对象
	 * @return {TypeName} 
	 */
	$.fn[pluginsType].parseOptions = function(target) {
		var t = $(target);
		return $.extend({},$.parser.parseOptions(target,["resQueryUrl"]));//解析 data-options 中的初始化参数
	};

	function create(target){
		var id = target.id || Utils_getId('cq_form');
		target.id = id;
		$(target).attr('ext',pluginsType).addClass('cq-form cq-form-layout');

	}

	function setOpts(id){
		var options = CQ('#'+id),target = options.target,sender = $(target);
		options.__proto__ = {
			set value(data){//val 是对象
				setValue($(':input','#'+id),data);
			},
			get value(){
				return getValue(target);
			},
			clear:function(){
				$(':input','#'+id).each(function(index,item){
					var $obj = item,id = $obj.id,name = item.name;
					item.value = '';
					item.setAttribute("data-value", '');
				});
			},
			validate:function(){
				return sender.valid();
			}
		}
	}

	function getValue(target){
		return $(target).serializeJSON()
	}

	function setValue(target, data, onlyValue){
		//if (onlyValue!=undefined && onlyValue==false) clear(target)
		if (typeof data == 'string' ) { return; }
		if ( !data.text )  data.text = {};
		var i = 0, length = target.length, item, fields, j = 0, name, fieldCount, value, f	;
		for( ; i<length; i++ ) {
			item = target[i];
			name = item.name;
			if ( !name ) continue;

			fields = name.split('.');
			fieldCount = fields.length;
			value = data, j = 0;
			for( ; j<fieldCount; j++ ) {
				if ( value.hasOwnProperty(fields[j]) ) {
					value = value[fields[j]];
					if ( value == null ) {
						value = '';
						break;
					}
				} else {
					value = null;
					break;
				}
			}						
			if (value==null){
				$(item).val('');
				item.setAttribute("data-value", '');
				continue;
			} 
			
			if (item.type && 'radio,checkbox'.indexOf(String(item.type).toLowerCase()) != -1 ) {					
				item.checked = value;
			}else if( CQSDK(item).options ){
				item.setAttribute("data-value", value);
				CQSDK(item).value = value;
			}else {
				$(item).val(value);
			}
		}
	}

	function keydownOnfocus(id){
		var inputs = $(':input','#'+id),count = 0;
		inputs.length > 0 ? (function(inputArrary){
			count = inputArrary.length ;
			inputArrary.each(function(i,obj){
				$(obj).on('keydown',function(e){
					if(e.keyCode == 13){
						if(i < count -1){
							$(inputArrary[i+1]).focus();
						}
					}
				});
			});
		})(inputs):null;
	}

})(jQuery);

/************************tree树*****************************/
(function($){
	var pluginsType = 'cqtree';
	$.parser.plugins.push(pluginsType);//将自定义的插件加入 easyui 的插件组

	/**
	 * 插件定义
	 */
	$.fn.cqtree = function(options, param) {
		if (typeof options == "string") {
			return $.fn.cqtree.methods[options](this, param);
		};
		
		options = options || {};

		return this.each(function(){
			var id = this.id || Utils_getId('cq_tree'),opts,data = $.data(this, pluginsType);
			$(this).attr({"id":id,ext:pluginsType});
			if (data) {
				opts = $.extend(data.options, options);
			} else {
				opts = $.extend( {}, $.fn.cqtree.defaults,$.fn.cqtree.parseOptions(this), options);
				data = $.data(this, pluginsType, {
					options : opts,
					type:pluginsType
				});
			}
			
			//你的插件。。。
			//如果在这里动态的生成了  easyui 的控件，html 写到页面上后是不能渲染成 easyui 组件的，需要手动调用
			//$.parser.parse(你定义的html); // parse 必须渲染父节点，不能渲染节点本身
			create(this);
		});
	};

	/**
	 * 默认值配置
	 */
	$.fn.cqtree.defaults = {//默认属性定义
	    data:[],
	    lines:true,
	    keyName: 'id',
		valueName:'text',
		parentName: 'pid'
	};

	/**
	 * 对外暴露的方法
	 */
	$.fn.cqtree.methods = {
		onResTreeQuery : function(jq,param){
			return jq.each(function(){
				addTabs(this,param);
			});
		}
	};

	/**
	 * class声明式定义属性data-options转化为options
	 * @param {Object} target DOM对象
	 * @return {TypeName} 
	 */
	$.fn.cqtree.parseOptions = function(target) {
		var t = $(target);
		return $.extend({},$.parser.parseOptions(target,["resQueryUrl"]));//解析 data-options 中的初始化参数
	};

	function create(target){
		var state = $.data(target, pluginsType),options = state.options;
		state.options.caseData = [];
		$.each(options.data,function(index,item){
			state.options.caseData.push($.extend({},item) );
		});
		//state.options.caseData = options.data;
		setOpts (target);
		if(options.data.length > 0){
			options.data = new TreeHelper(options.data,options.keyName,options.parentName,options.valueName).dataTransferer();
		}
		$.fn.tree.call($(target),options);
		state.options = $.extend({},{easyui_tree:$(target).tree('options')},options);
	}

	function setOpts (target){
		CQ('#'+target.id).__proto__ = {
				setOptions : function(opts){
					var state = $.data(target, pluginsType),options = state.options;
					if(typeof opts == 'object'){
						opts = $.extend({},options,opts);
						$(target).tree(opts);
					}
				},
				set data(data){
					var state = $.data(target, pluginsType),options = state.options,tmp,tmpDate = [];
					if($.type(data) === 'array'){
						$.each(data,function(index,item){
							tmpDate.push($.extend({},item));
						});
					}
					tmp = new TreeHelper(data,options.keyName,options.parentName,options.valueName).dataTransferer();
					if(!tmp){
						return;
					}
					state.options.data = tmp;
					state.options.caseData = [];
					$.each(tmpDate,function(index,item){
						state.options.caseData.push($.extend({},item) );
					});
					$(target).tree({data:state.options.data});
				},
				get data(){
					var state = $.data(target, pluginsType),options = state.options;
					return state.options.caseData;
				},
				get value(){
					//alert()
					var node = $(target).tree('getSelected'),state = $.data(target, pluginsType),keyName=state.options.keyName;
					if(!node){
						return null;
					}else{
						if($.type(node) === 'object'){
							return $.grep(state.options.caseData,function(a){ return a[keyName] == node.id})[0];
						}else{
							return $.grep(state.options.caseData,function(a){ return a[keyName] == node.id});
						}
						
					}
				}
		}
	}

})(jQuery);

/************************tabs选项卡*****************************/
(function($,CQ){
	var pluginsType = 'cqtabs';
	$.parser.plugins.push(pluginsType);//将自定义的插件加入 easyui 的插件组
	/**
	 * 插件定义
	 */
	$.fn.cqtabs = function(options, param) {
		if (typeof options == "string") {
			return $.fn.cqtree.methods[options](this, param);
		};
		
		options = options || {};

		return this.each(function(){
			var id = this.id || Utils_getId('cq_tabs'),opts,data = $.data(this, pluginsType);
			$(this).attr({"id":id,ext:pluginsType});
			if (data) {
				opts = $.extend(data.options, options);
			} else {
				opts = $.extend( {}, $.fn.cqtabs.defaults,$.fn.cqtabs.parseOptions(this), options);
				data = $.data(this, pluginsType, {
					options : opts,
					type:pluginsType
				});
			}
			
			//你的插件。。。
			//如果在这里动态的生成了  easyui 的控件，html 写到页面上后是不能渲染成 easyui 组件的，需要手动调用
			//$.parser.parse(你定义的html); // parse 必须渲染父节点，不能渲染节点本身
			create(this);
		});
	};

	function create(target){
		var state = $.data(target, pluginsType),options = state.options;
		setOpts (target);
		$.fn.tabs.call($(target),options);
		state.options = $.extend({},{easyui_tabs:$(target).tabs('options')},options);
	}

	function setOpts(target){
		CQ('#'+target.id).__proto__ = {
			setOptions : function(opts){
				var state = $.data(target, pluginsType),options = state.options;
				if(typeof opts == 'object'){
					opts = $.extend({},options,opts);
					$(target).tabs(opts);
				}
			},
			addTab:function(opt){
				$(target).tabs('add',opt);
			},
			closeAll:function(){
				 var arrTitle = [];  
		         var tabs = $(target).find('.tabs-title');//获得所有小标题的dom
	             for(var i=0;i<tabs.length;i++){  
	                 arrTitle.push(tabs[i].innerText)  
	             }  
	              //根据收集的title一个一个删除=====清空Tab  
	             for(var i=0;i<arrTitle.length;i++){
	                 $(target).tabs("close",arrTitle[i]);  
	             }  
			},
			set selectIndex(i){//根据位置选中某个
				$(target).tabs("select",i); 
			},
			get selectIndex(){
				var tab = $(target).tabs('getSelected');
    			return $(target).tabs('getTabIndex',tab);
			},
			get selectTab(){
				return $(target).tabs('getSelected').panel('options').tab;
			}
		};
	}

	/**
	 * class声明式定义属性data-options转化为options
	 * @param {Object} target DOM对象
	 * @return {TypeName} 
	 */
	$.fn.cqtabs.parseOptions = function(target) {
		var t = $(target);
		return $.extend({},$.parser.parseOptions(target,["resQueryUrl"]));//解析 data-options 中的初始化参数
	};

	$.fn.cqtabs.defaults = {

	}

})(jQuery,CQSDK);

/************************右键菜单*****************************/
/*!
 * jQuery contextMenu - Plugin for simple contextMenu handling
 * Version: 1.6.6
 */

(function($, undefined){
       
    $.support.htmlMenuitem = ('HTMLMenuItemElement' in window);
    $.support.htmlCommand = ('HTMLCommandElement' in window);
    $.support.eventSelectstart = ("onselectstart" in document.documentElement);
    if (!$.ui || !$.ui.widget) {
        // duck punch $.cleanData like jQueryUI does to get that remove event
        // https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js#L16-24
        var _cleanData = $.cleanData;
        $.cleanData = function( elems ) {
            for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
                try {
                    $( elem ).triggerHandler( "remove" );
                    // http://bugs.jquery.com/ticket/8235
                } catch( e ) {}
            }
            _cleanData( elems );
        };
    }

    var // currently active contextMenu trigger
        $currentTrigger = null,
        // is contextMenu initialized with at least one menu?
        initialized = false,
        // window handle
        $win = $(window),
        // number of registered menus
        counter = 0,
        // mapping selector to namespace
        namespaces = {},
        // mapping namespace to options
        menus = {},
        // custom command type handlers
        types = {},
        // default values
        defaults = {
            // selector of contextMenu trigger
            selector: null,
            // where to append the menu to
            appendTo: null,
            // method to trigger context menu ["right", "left", "hover"]
            trigger: "right",
            // hide menu when mouse leaves trigger / menu elements
            autoHide: false,
            // ms to wait before showing a hover-triggered context menu
            delay: 200,
            // flag denoting if a second trigger should simply move (true) or rebuild (false) an open menu
            // as long as the trigger happened on one of the trigger-element's child nodes
            reposition: true,
            // determine position to show menu at
            determinePosition: function($menu) {
                // position to the lower middle of the trigger element
                if ($.ui && $.ui.position) {
                    // .position() is provided as a jQuery UI utility
                    // (...and it won't work on hidden elements)
                    $menu.css('display', 'block').position({
                        my: "center top",
                        at: "center bottom",
                        of: this,
                        offset: "0 5",
                        collision: "fit"
                    }).css('display', 'none');
                } else {
                    // determine contextMenu position
                    var offset = this.offset();
                    offset.top += this.outerHeight();
                    offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
                    $menu.css(offset);
                }
            },
            // position menu
            position: function(opt, x, y) {
                var $this = this,
                    offset;
                // determine contextMenu position
                if (!x && !y) {
                    opt.determinePosition.call(this, opt.$menu);
                    return;
                } else if (x === "maintain" && y === "maintain") {
                    // x and y must not be changed (after re-show on command click)
                    offset = opt.$menu.position();
                } else {
                    // x and y are given (by mouse event)
                    offset = {top: y, left: x};
                }
                
                // correct offset if viewport demands it
                var bottom = $win.scrollTop() + $win.height(),
                    right = $win.scrollLeft() + $win.width(),
                    height = opt.$menu.height(),
                    width = opt.$menu.width();
                
                if (offset.top + height > bottom) {
                    offset.top -= height;
                }
                
                if (offset.left + width > right) {
                    offset.left -= width;
                }
                
                opt.$menu.css(offset);
            },
            // position the sub-menu
            positionSubmenu: function($menu) {
                if ($.ui && $.ui.position) {
                    // .position() is provided as a jQuery UI utility
                    // (...and it won't work on hidden elements)
                    $menu.css('display', 'block').position({
                        my: "left top",
                        at: "right top",
                        of: this,
                        collision: "flipfit fit"
                    }).css('display', '');
                } else {
                    // determine contextMenu position
                    var offset = {
                        top: 0,
                        left: this.outerWidth()
                    };
                    $menu.css(offset);
                }
            },
            // offset to add to zIndex
            zIndex: 1,
            // show hide animation settings
            animation: {
                duration: 50,
                show: 'slideDown',
                hide: 'slideUp'
            },
            // events
            events: {
                show: $.noop,
                hide: $.noop
            },
            // default callback
            callback: null,
            // list of contextMenu items
            items: {}
        },
        // mouse position for hover activation
        hoveract = {
            timer: null,
            pageX: null,
            pageY: null
        },
        // determine zIndex
        zindex = function($t) {
            var zin = 0,
                $tt = $t;

            while (true) {
                zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
                $tt = $tt.parent();
                if (!$tt || !$tt.length || "html body".indexOf($tt.prop('nodeName').toLowerCase()) > -1 ) {
                    break;
                }
            }
            
            return zin;
        },
        // event handlers
        handle = {
            // abort anything
            abortevent: function(e){
                e.preventDefault();
                e.stopImmediatePropagation();
            },
            
            // contextmenu show dispatcher
            contextmenu: function(e) {
                var $this = $(this);
                
                // disable actual context-menu
                e.preventDefault();
                e.stopImmediatePropagation();
                
                // abort native-triggered events unless we're triggering on right click
                if (e.data.trigger != 'right' && e.originalEvent) {
                    return;
                }
                
                // abort event if menu is visible for this trigger
                if ($this.hasClass('context-menu-active')) {
                    return;
                }
                
                if (!$this.hasClass('context-menu-disabled')) {
                    // theoretically need to fire a show event at <menu>
                    // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#context-menus
                    // var evt = jQuery.Event("show", { data: data, pageX: e.pageX, pageY: e.pageY, relatedTarget: this });
                    // e.data.$menu.trigger(evt);
                    
                    $currentTrigger = $this;
                    if (e.data.build) {
                        var built = e.data.build($currentTrigger, e);
                        // abort if build() returned false
                        if (built === false) {
                            return;
                        }
                        
                        // dynamically build menu on invocation
                        e.data = $.extend(true, {}, defaults, e.data, built || {});

                        // abort if there are no items to display
                        if (!e.data.items || $.isEmptyObject(e.data.items)) {
                            // Note: jQuery captures and ignores errors from event handlers
                            if (window.console) {
                                (console.error || console.log)("No items specified to show in contextMenu");
                            }
                            
                            throw new Error('No Items specified');
                        }
                        
                        // backreference for custom command type creation
                        e.data.$trigger = $currentTrigger;
                        
                        op.create(e.data);
                    }
                    // show menu
                    op.show.call($this, e.data, e.pageX, e.pageY);
                }
            },
            // contextMenu left-click trigger
            click: function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $(this).trigger($.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
            },
            // contextMenu right-click trigger
            mousedown: function(e) {
                // register mouse down
                var $this = $(this);
                
                // hide any previous menus
                if ($currentTrigger && $currentTrigger.length && !$currentTrigger.is($this)) {
                    $currentTrigger.data('contextMenu').$menu.trigger('contextmenu:hide');
                }
                
                // activate on right click
                if (e.button == 2) {
                    $currentTrigger = $this.data('contextMenuActive', true);
                }
            },
            // contextMenu right-click trigger
            mouseup: function(e) {
                // show menu
                var $this = $(this);
                if ($this.data('contextMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $currentTrigger = $this;
                    $this.trigger($.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
                }
                
                $this.removeData('contextMenuActive');
            },
            // contextMenu hover trigger
            mouseenter: function(e) {
                var $this = $(this),
                    $related = $(e.relatedTarget),
                    $document = $(document);
                
                // abort if we're coming from a menu
                if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                    return;
                }
                
                // abort if a menu is shown
                if ($currentTrigger && $currentTrigger.length) {
                    return;
                }
                
                hoveract.pageX = e.pageX;
                hoveract.pageY = e.pageY;
                hoveract.data = e.data;
                $document.on('mousemove.contextMenuShow', handle.mousemove);
                hoveract.timer = setTimeout(function() {
                    hoveract.timer = null;
                    $document.off('mousemove.contextMenuShow');
                    $currentTrigger = $this;
                    $this.trigger($.Event("contextmenu", { data: hoveract.data, pageX: hoveract.pageX, pageY: hoveract.pageY }));
                }, e.data.delay );
            },
            // contextMenu hover trigger
            mousemove: function(e) {
                hoveract.pageX = e.pageX;
                hoveract.pageY = e.pageY;
            },
            // contextMenu hover trigger
            mouseleave: function(e) {
                // abort if we're leaving for a menu
                var $related = $(e.relatedTarget);
                if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                    return;
                }
                
                try {
                    clearTimeout(hoveract.timer);
                } catch(e) {}
                
                hoveract.timer = null;
            },
            
            // click on layer to hide contextMenu
            layerClick: function(e) {
                var $this = $(this),
                    root = $this.data('contextMenuRoot'),
                    mouseup = false,
                    button = e.button,
                    x = e.pageX,
                    y = e.pageY,
                    target, 
                    offset,
                    selectors;
                    
                e.preventDefault();
                e.stopImmediatePropagation();
                
                setTimeout(function() {
                    var $window, hideshow, possibleTarget;
                    var triggerAction = ((root.trigger == 'left' && button === 0) || (root.trigger == 'right' && button === 2));
                    
                    // find the element that would've been clicked, wasn't the layer in the way
                    if (document.elementFromPoint) {
                        root.$layer.hide();
                        target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                        root.$layer.show();
                    }
                    
                    if (root.reposition && triggerAction) {
                        if (document.elementFromPoint) {
                            if (root.$trigger.is(target) || root.$trigger.has(target).length) {
                                root.position.call(root.$trigger, root, x, y);
                                return;
                            }
                        } else {
                            offset = root.$trigger.offset();
                            $window = $(window);
                            // while this looks kinda awful, it's the best way to avoid
                            // unnecessarily calculating any positions
                            offset.top += $window.scrollTop();
                            if (offset.top <= e.pageY) {
                                offset.left += $window.scrollLeft();
                                if (offset.left <= e.pageX) {
                                    offset.bottom = offset.top + root.$trigger.outerHeight();
                                    if (offset.bottom >= e.pageY) {
                                        offset.right = offset.left + root.$trigger.outerWidth();
                                        if (offset.right >= e.pageX) {
                                            // reposition
                                            root.position.call(root.$trigger, root, x, y);
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    if (target && triggerAction) {
                        root.$trigger.one('contextmenu:hidden', function() {
                            $(target).contextMenu({x: x, y: y});
                        });
                    }

                    root.$menu.trigger('contextmenu:hide');
                }, 50);
            },
            // key handled :hover
            keyStop: function(e, opt) {
                if (!opt.isInput) {
                    e.preventDefault();
                }
                
                e.stopPropagation();
            },
            key: function(e) {
                var opt = $currentTrigger.data('contextMenu') || {};

                switch (e.keyCode) {
                    case 9:
                    case 38: // up
                        handle.keyStop(e, opt);
                        // if keyCode is [38 (up)] or [9 (tab) with shift]
                        if (opt.isInput) {
                            if (e.keyCode == 9 && e.shiftKey) {
                                e.preventDefault();
                                opt.$selected && opt.$selected.find('input, textarea, select').blur();
                                opt.$menu.trigger('prevcommand');
                                return;
                            } else if (e.keyCode == 38 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
                                // checkboxes don't capture this key
                                e.preventDefault();
                                return;
                            }
                        } else if (e.keyCode != 9 || e.shiftKey) {
                            opt.$menu.trigger('prevcommand');
                            return;
                        }
                        // omitting break;
                        
                    // case 9: // tab - reached through omitted break;
                    case 40: // down
                        handle.keyStop(e, opt);
                        if (opt.isInput) {
                            if (e.keyCode == 9) {
                                e.preventDefault();
                                opt.$selected && opt.$selected.find('input, textarea, select').blur();
                                opt.$menu.trigger('nextcommand');
                                return;
                            } else if (e.keyCode == 40 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
                                // checkboxes don't capture this key
                                e.preventDefault();
                                return;
                            }
                        } else {
                            opt.$menu.trigger('nextcommand');
                            return;
                        }
                        break;
                    
                    case 37: // left
                        handle.keyStop(e, opt);
                        if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                            break;
                        }
                    
                        if (!opt.$selected.parent().hasClass('context-menu-root')) {
                            var $parent = opt.$selected.parent().parent();
                            opt.$selected.trigger('contextmenu:blur');
                            opt.$selected = $parent;
                            return;
                        }
                        break;
                        
                    case 39: // right
                        handle.keyStop(e, opt);
                        if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                            break;
                        }
                        
                        var itemdata = opt.$selected.data('contextMenu') || {};
                        if (itemdata.$menu && opt.$selected.hasClass('context-menu-submenu')) {
                            opt.$selected = null;
                            itemdata.$selected = null;
                            itemdata.$menu.trigger('nextcommand');
                            return;
                        }
                        break;
                    
                    case 35: // end
                    case 36: // home
                        if (opt.$selected && opt.$selected.find('input, textarea, select').length) {
                            return;
                        } else {
                            (opt.$selected && opt.$selected.parent() || opt.$menu)
                                .children(':not(.disabled, .not-selectable)')[e.keyCode == 36 ? 'first' : 'last']()
                                .trigger('contextmenu:focus');
                            e.preventDefault();
                            return;
                        }
                        break;
                        
                    case 13: // enter
                        handle.keyStop(e, opt);
                        if (opt.isInput) {
                            if (opt.$selected && !opt.$selected.is('textarea, select')) {
                                e.preventDefault();
                                return;
                            }
                            break;
                        }
                        opt.$selected && opt.$selected.trigger('mouseup');
                        return;
                        
                    case 32: // space
                    case 33: // page up
                    case 34: // page down
                        // prevent browser from scrolling down while menu is visible
                        handle.keyStop(e, opt);
                        return;
                        
                    case 27: // esc
                        handle.keyStop(e, opt);
                        opt.$menu.trigger('contextmenu:hide');
                        return;
                        
                    default: // 0-9, a-z
                        var k = (String.fromCharCode(e.keyCode)).toUpperCase();
                        if (opt.accesskeys[k]) {
                            // according to the specs accesskeys must be invoked immediately
                            opt.accesskeys[k].$node.trigger(opt.accesskeys[k].$menu
                                ? 'contextmenu:focus'
                                : 'mouseup'
                            );
                            return;
                        }
                        break;
                }
                // pass event to selected item, 
                // stop propagation to avoid endless recursion
                e.stopPropagation();
                opt.$selected && opt.$selected.trigger(e);
            },

            // select previous possible command in menu
            prevItem: function(e) {
                e.stopPropagation();
                var opt = $(this).data('contextMenu') || {};

                // obtain currently selected menu
                if (opt.$selected) {
                    var $s = opt.$selected;
                    opt = opt.$selected.parent().data('contextMenu') || {};
                    opt.$selected = $s;
                }
                
                var $children = opt.$menu.children(),
                    $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev(),
                    $round = $prev;
                
                // skip disabled
                while ($prev.hasClass('disabled') || $prev.hasClass('not-selectable')) {
                    if ($prev.prev().length) {
                        $prev = $prev.prev();
                    } else {
                        $prev = $children.last();
                    }
                    if ($prev.is($round)) {
                        // break endless loop
                        return;
                    }
                }
                
                // leave current
                if (opt.$selected) {
                    handle.itemMouseleave.call(opt.$selected.get(0), e);
                }
                
                // activate next
                handle.itemMouseenter.call($prev.get(0), e);
                
                // focus input
                var $input = $prev.find('input, textarea, select');
                if ($input.length) {
                    $input.focus();
                }
            },
            // select next possible command in menu
            nextItem: function(e) {
                e.stopPropagation();
                var opt = $(this).data('contextMenu') || {};

                // obtain currently selected menu
                if (opt.$selected) {
                    var $s = opt.$selected;
                    opt = opt.$selected.parent().data('contextMenu') || {};
                    opt.$selected = $s;
                }

                var $children = opt.$menu.children(),
                    $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next(),
                    $round = $next;

                // skip disabled
                while ($next.hasClass('disabled') || $next.hasClass('not-selectable')) {
                    if ($next.next().length) {
                        $next = $next.next();
                    } else {
                        $next = $children.first();
                    }
                    if ($next.is($round)) {
                        // break endless loop
                        return;
                    }
                }
                
                // leave current
                if (opt.$selected) {
                    handle.itemMouseleave.call(opt.$selected.get(0), e);
                }
                
                // activate next
                handle.itemMouseenter.call($next.get(0), e);
                
                // focus input
                var $input = $next.find('input, textarea, select');
                if ($input.length) {
                    $input.focus();
                }
            },
            
            // flag that we're inside an input so the key handler can act accordingly
            focusInput: function(e) {
                var $this = $(this).closest('.context-menu-item'),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.$selected = opt.$selected = $this;
                root.isInput = opt.isInput = true;
            },
            // flag that we're inside an input so the key handler can act accordingly
            blurInput: function(e) {
                var $this = $(this).closest('.context-menu-item'),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.isInput = opt.isInput = false;
            },
            
            // :hover on menu
            menuMouseenter: function(e) {
                var root = $(this).data().contextMenuRoot;
                root.hovering = true;
            },
            // :hover on menu
            menuMouseleave: function(e) {
                var root = $(this).data().contextMenuRoot;
                if (root.$layer && root.$layer.is(e.relatedTarget)) {
                    root.hovering = false;
                }
            },
            
            // :hover done manually so key handling is possible
            itemMouseenter: function(e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;
                
                root.hovering = true;

                // abort if we're re-entering
                if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }

                // make sure only one item is selected
                (opt.$menu ? opt : root).$menu
                    .children('.hover').trigger('contextmenu:blur');

                if ($this.hasClass('disabled') || $this.hasClass('not-selectable')) {
                    opt.$selected = null;
                    return;
                }
                
                $this.trigger('contextmenu:focus');
            },
            // :hover done manually so key handling is possible
            itemMouseleave: function(e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
                    root.$selected && root.$selected.trigger('contextmenu:blur');
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    root.$selected = opt.$selected = opt.$node;
                    return;
                }
                
                $this.trigger('contextmenu:blur');
            },
            // contextMenu item click
            itemClick: function(e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot,
                    key = data.contextMenuKey,
                    callback;

                // abort if the key is unknown or disabled or is a menu
                if (!opt.items[key] || $this.is('.disabled, .context-menu-submenu, .context-menu-separator, .not-selectable')) {
                    return;
                }

                e.preventDefault();
                e.stopImmediatePropagation();

                if ($.isFunction(root.callbacks[key]) && Object.prototype.hasOwnProperty.call(root.callbacks, key)) {
                    // item-specific callback
                    callback = root.callbacks[key];
                } else if ($.isFunction(root.callback)) {
                    // default callback
                    callback = root.callback;                
                } else {
                    // no callback, no action
                    return;
                }

                // hide menu if callback doesn't stop that
                if (callback.call(root.$trigger, key, root) !== false) {
                    root.$menu.trigger('contextmenu:hide');
                } else if (root.$menu.parent().length) {
                    op.update.call(root.$trigger, root);
                }
            },
            // ignore click events on input elements
            inputClick: function(e) {
                e.stopImmediatePropagation();
            },
            
            // hide <menu>
            hideMenu: function(e, data) {
                var root = $(this).data('contextMenuRoot');
                op.hide.call(root.$trigger, root, data && data.force);
            },
            // focus <command>
            focusItem: function(e) {
                e.stopPropagation();
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                $this.addClass('hover')
                    .siblings('.hover').trigger('contextmenu:blur');
                
                // remember selected
                opt.$selected = root.$selected = $this;
                
                // position sub-menu - do after show so dumb $.ui.position can keep up
                if (opt.$node) {
                    root.positionSubmenu.call(opt.$node, opt.$menu);
                }
            },
            // blur <command>
            blurItem: function(e) {
                e.stopPropagation();
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;
                
                $this.removeClass('hover');
                opt.$selected = null;
            }
        },
        // operations
        op = {
            show: function(opt, x, y) {
                var $trigger = $(this),
                    offset,
                    css = {};

                // hide any open menus
                $('#context-menu-layer').trigger('mousedown');

                // backreference for callbacks
                opt.$trigger = $trigger;

                // show event
                if (opt.events.show.call($trigger, opt) === false) {
                    $currentTrigger = null;
                    return;
                }

                // create or update context menu
                op.update.call($trigger, opt);
                
                // position menu
                opt.position.call($trigger, opt, x, y);

                // make sure we're in front
                if (opt.zIndex) {
                    css.zIndex = zindex($trigger) + opt.zIndex;
                }
                
                // add layer
                op.layer.call(opt.$menu, opt, css.zIndex);
                
                // adjust sub-menu zIndexes
                opt.$menu.find('ul').css('zIndex', css.zIndex + 1);
                
                // position and show context menu
                opt.$menu.css( css )[opt.animation.show](opt.animation.duration, function() {
                    $trigger.trigger('contextmenu:visible');
                });
                // make options available and set state
                $trigger
                    .data('contextMenu', opt)
                    .addClass("context-menu-active");
                
                // register key handler
                $(document).off('keydown.contextMenu').on('keydown.contextMenu', handle.key);
                // register autoHide handler
                if (opt.autoHide) {
                    // mouse position handler
                    $(document).on('mousemove.contextMenuAutoHide', function(e) {
                        // need to capture the offset on mousemove,
                        // since the page might've been scrolled since activation
                        var pos = $trigger.offset();
                        pos.right = pos.left + $trigger.outerWidth();
                        pos.bottom = pos.top + $trigger.outerHeight();
                        
                        if (opt.$layer && !opt.hovering && (!(e.pageX >= pos.left && e.pageX <= pos.right) || !(e.pageY >= pos.top && e.pageY <= pos.bottom))) {
                            // if mouse in menu...
                            opt.$menu.trigger('contextmenu:hide');
                        }
                    });
                }
            },
            hide: function(opt, force) {
                var $trigger = $(this);
                if (!opt) {
                    opt = $trigger.data('contextMenu') || {};
                }
                
                // hide event
                if (!force && opt.events && opt.events.hide.call($trigger, opt) === false) {
                    return;
                }
                
                // remove options and revert state
                $trigger
                    .removeData('contextMenu')
                    .removeClass("context-menu-active");
                
                if (opt.$layer) {
                    // keep layer for a bit so the contextmenu event can be aborted properly by opera
                    setTimeout((function($layer) {
                        return function(){
                            $layer.remove();
                        };
                    })(opt.$layer), 10);
                    
                    try {
                        delete opt.$layer;
                    } catch(e) {
                        opt.$layer = null;
                    }
                }
                
                // remove handle
                $currentTrigger = null;
                // remove selected
                opt.$menu.find('.hover').trigger('contextmenu:blur');
                opt.$selected = null;
                // unregister key and mouse handlers
                //$(document).off('.contextMenuAutoHide keydown.contextMenu'); // http://bugs.jquery.com/ticket/10705
                $(document).off('.contextMenuAutoHide').off('keydown.contextMenu');
                // hide menu
                opt.$menu && opt.$menu[opt.animation.hide](opt.animation.duration, function (){
                    // tear down dynamically built menu after animation is completed.
                    if (opt.build) {
                        opt.$menu.remove();
                        $.each(opt, function(key, value) {
                            switch (key) {
                                case 'ns':
                                case 'selector':
                                case 'build':
                                case 'trigger':
                                    return true;

                                default:
                                    opt[key] = undefined;
                                    try {
                                        delete opt[key];
                                    } catch (e) {}
                                    return true;
                            }
                        });
                    }
                    
                    setTimeout(function() {
                        $trigger.trigger('contextmenu:hidden');
                    }, 10);
                });
            },
            create: function(opt, root) {
                if (root === undefined) {
                    root = opt;
                }
                // create contextMenu
                opt.$menu = $('<ul class="context-menu-list"></ul>').addClass(opt.className || "").data({
                    'contextMenu': opt,
                    'contextMenuRoot': root
                });
                
                $.each(['callbacks', 'commands', 'inputs'], function(i,k){
                    opt[k] = {};
                    if (!root[k]) {
                        root[k] = {};
                    }
                });
                
                root.accesskeys || (root.accesskeys = {});
                
                // create contextMenu items
                $.each(opt.items, function(key, item){
                    var flag = true,group=false;
                    if(key.indexOf('sep')== 0) flag = false;
                    if(key.indexOf('group')== 0) group = true;
                    var $t = $('<li class="context-menu-item cq-action" action="'+(flag?key:'')+'"><a class="'+(flag?"cq-btn-a":'')+' '+(group?item.icon:'')+'"></a></li>').addClass(item.className || ""),
                        $label = null,
                        $input = null;
                    
                    // iOS needs to see a click-event bound to an element to actually
                    // have the TouchEvents infrastructure trigger the click event
                    $t.on('click', $.noop);
                    
                    item.$node = $t.data({
                        'contextMenu': opt,
                        'contextMenuRoot': root,
                        'contextMenuKey': key
                    });
                    
                    // register accesskey
                    // NOTE: the accesskey attribute should be applicable to any element, but Safari5 and Chrome13 still can't do that
                    if (item.accesskey) {
                        var aks = splitAccesskey(item.accesskey);
                        for (var i=0, ak; ak = aks[i]; i++) {
                            if (!root.accesskeys[ak]) {
                                root.accesskeys[ak] = item;
                                item._name = item.name.replace(new RegExp('(' + ak + ')', 'i'), '<span class="context-menu-accesskey">$1</span>');
                                break;
                            }
                        }
                    }
                    
                    if (typeof item == "string") {
                        $t.addClass('context-menu-separator not-selectable');
                    } else if (item.type && types[item.type]) {
                        // run custom type handler
                        types[item.type].call($t, item, opt, root);
                        // register commands
                        $.each([opt, root], function(i,k){
                            k.commands[key] = item;
                            if ($.isFunction(item.callback)) {
                                k.callbacks[key] = item.callback;
                            }
                        });
                    } else {
                        // add label for input
                        if (item.type == 'html') {
                            $t.addClass('context-menu-html not-selectable');
                        } else if (item.type) {
                            $label = $('<label></label>').appendTo($t);
                            $('<span></span>').html(item._name || item.name).appendTo($label);
                            $t.addClass('context-menu-input');
                            opt.hasTypes = true;
                            $.each([opt, root], function(i,k){
                                k.commands[key] = item;
                                k.inputs[key] = item;
                            });
                        } else if (item.items) {
                            item.type = 'sub';
                        }
                    
                        switch (item.type) {
                            case 'sub':
                                // FIXME: shouldn't this .html() be a .text()?
                                $('<span></span>').html(item._name || item.name).appendTo($t);
                                item.appendTo = item.$node;
                                op.create(item, root);
                                $t.data('contextMenu', item).addClass('context-menu-submenu');
                                item.callback = null;
                                break;
                            default:
                                $.each([opt, root], function(i,k){
                                    k.commands[key] = item;
                                    if ($.isFunction(item.callback)) {
                                        k.callbacks[key] = item.callback;
                                    }
                                });
                                // FIXME: shouldn't this .html() be a .text()?
                                $('<span></span>').html(item._name || item.name || "").appendTo($t);
                                break;
                        }
                        
                        // disable key listener in <input>
                        if (item.type && item.type != 'sub' && item.type != 'html') {
                            $input
                                .on('focus', handle.focusInput)
                                .on('blur', handle.blurInput);
                            
                            if (item.events) {
                                $input.on(item.events, opt);
                            }
                        }
                    }
                    
                    // cache contained elements
                    item.$input = $input;
                    item.$label = $label;

                    // attach item to menu
                    $t.appendTo(opt.$menu);
                    
                    // Disable text selection
                    if (!opt.hasTypes && $.support.eventSelectstart) {
                        // browsers support user-select: none, 
                        // IE has a special event for text-selection
                        // browsers supporting neither will not be preventing text-selection
                        $t.on('selectstart.disableTextSelect', handle.abortevent);
                    }
                });
                // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
                if (!opt.$node) {
                    opt.$menu.css('display', 'none').addClass('context-menu-root');
                }
                opt.$menu.appendTo(opt.appendTo || document.body);
            },
            resize: function($menu, nested) {
                // determine widths of submenus, as CSS won't grow them automatically
                // position:absolute within position:absolute; min-width:100; max-width:200; results in width: 100;
                // kinda sucks hard...

                // determine width of absolutely positioned element
                $menu.css({position: 'absolute', display: 'block'});
                // don't apply yet, because that would break nested elements' widths
                // add a pixel to circumvent word-break issue in IE9 - #80
                $menu.data('width', Math.ceil($menu.width()) + 1);
                // reset styles so they allow nested elements to grow/shrink naturally
                $menu.css({
                    position: 'static',
                    minWidth: '0px',
                    maxWidth: '100000px'
                });
                // identify width of nested menus
                $menu.find('> li > ul').each(function() {
                    op.resize($(this), true);
                });
                // reset and apply changes in the end because nested
                // elements' widths wouldn't be calculatable otherwise
                if (!nested) {
                    $menu.find('ul').addBack().css({
                        position: '', 
                        display: '',
                        minWidth: '',
                        maxWidth: ''
                    }).width(function() {
                        return $(this).data('width');
                    });
                }
            },
            update: function(opt, root) {
                var $trigger = this;
                if (root === undefined) {
                    root = opt;
                    op.resize(opt.$menu);
                }
                // re-check disabled for each item
                opt.$menu.children().each(function(){
                    var $item = $(this),
                        key = $item.data('contextMenuKey'),
                        item = opt.items[key],
                        disabled = ($.isFunction(item.disabled) && item.disabled.call($trigger, key, root)) || item.disabled === true;

                    // dis- / enable item
                    $item[disabled ? 'addClass' : 'removeClass']('disabled');
                    
                    if (item.type) {
                        // dis- / enable input elements
                        $item.find('input, select, textarea').prop('disabled', disabled);
                        
                        // update input states
                        switch (item.type) {
                            case 'text':
                            case 'textarea':
                                item.$input.val(item.value || "");
                                break;
                                
                            case 'checkbox':
                            case 'radio':
                                item.$input.val(item.value || "").prop('checked', !!item.selected);
                                break;
                                
                            case 'select':
                                item.$input.val(item.selected || "");
                                break;
                        }
                    }
                    
                    if (item.$menu) {
                        // update sub-menu
                        op.update.call($trigger, item, root);
                    }
                });
            },
            layer: function(opt, zIndex) {
                // add transparent layer for click area
                // filter and background for Internet Explorer, Issue #23
                var $layer = opt.$layer = $('<div id="context-menu-layer" style="position:fixed; z-index:' + zIndex + '; top:0; left:0; opacity: 0; filter: alpha(opacity=0); background-color: #000;"></div>')
                    .css({height: $win.height(), width: $win.width(), display: 'block'})
                    .data('contextMenuRoot', opt)
                    .insertBefore(this)
                    .on('contextmenu', handle.abortevent)
                    .on('mousedown', handle.layerClick);
                
                // IE6 doesn't know position:fixed;
                if (!$.support.fixedPosition) {
                    $layer.css({
                        'position' : 'absolute',
                        'height' : $(document).height()
                    });
                }
                
                return $layer;
            }
        };

    // split accesskey according to http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key
    function splitAccesskey(val) {
        var t = val.split(/\s+/),
            keys = [];
            
        for (var i=0, k; k = t[i]; i++) {
            k = k[0].toUpperCase(); // first character only
            // theoretically non-accessible characters should be ignored, but different systems, different keyboard layouts, ... screw it.
            // a map to look up already used access keys would be nice
            keys.push(k);
        }
        
        return keys;
    }

    // handle contextMenu triggers
    $.fn.contextMenu = function(operation) {
        if (operation === undefined) {
            this.first().trigger('contextmenu');
        } else if (operation.x && operation.y) {
            this.first().trigger($.Event("contextmenu", {pageX: operation.x, pageY: operation.y}));
        } else if (operation === "hide") {
            var $menu = this.data('contextMenu').$menu;
            $menu && $menu.trigger('contextmenu:hide');
        } else if (operation === "destroy") {
            $.contextMenu("destroy", {context: this});
        } else if ($.isPlainObject(operation)) {
            operation.context = this;
            $.contextMenu("create", operation);
        } else if (operation) {
            this.removeClass('context-menu-disabled');
        } else if (!operation) {
            this.addClass('context-menu-disabled');
        }
        
        return this;
    };

    // manage contextMenu instances
    $.contextMenu = function(operation, options) {
        if (typeof operation != 'string') {
            options = operation;
            operation = 'create';
        }
        
        if (typeof options == 'string') {
            options = {selector: options};
        } else if (options === undefined) {
            options = {};
        }
        
        // merge with default options
        var o = $.extend(true, {}, defaults, options || {});
        var $document = $(document);
        var $context = $document;
        var _hasContext = false;
        
        if (!o.context || !o.context.length) {
            o.context = document;
        } else {
            // you never know what they throw at you...
            $context = $(o.context).first();
            o.context = $context.get(0);
            _hasContext = o.context !== document;
        }
        
        switch (operation) {
            case 'create':
                // no selector no joy
                if (!o.selector) {
                    throw new Error('No selector specified');
                }
                // make sure internal classes are not bound to
                if (o.selector.match(/.context-menu-(list|item|input)($|\s)/)) {
                    throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
                }
                if (!o.build && (!o.items || $.isEmptyObject(o.items))) {
                    throw new Error('No Items specified');
                }
                counter ++;
                o.ns = '.contextMenu' + counter;
                if (!_hasContext) {
                    namespaces[o.selector] = o.ns;
                }
                menus[o.ns] = o;
                
                // default to right click
                if (!o.trigger) {
                    o.trigger = 'right';
                }
                
                if (!initialized) {
                    // make sure item click is registered first
                    $document
                        .on({
                            'contextmenu:hide.contextMenu': handle.hideMenu,
                            'prevcommand.contextMenu': handle.prevItem,
                            'nextcommand.contextMenu': handle.nextItem,
                            'contextmenu.contextMenu': handle.abortevent,
                            'mouseenter.contextMenu': handle.menuMouseenter,
                            'mouseleave.contextMenu': handle.menuMouseleave
                        }, '.context-menu-list')
                        .on('mouseup.contextMenu', '.context-menu-input', handle.inputClick)
                        .on({
                            'mouseup.contextMenu': handle.itemClick,
                            'contextmenu:focus.contextMenu': handle.focusItem,
                            'contextmenu:blur.contextMenu': handle.blurItem,
                            'contextmenu.contextMenu': handle.abortevent,
                            'mouseenter.contextMenu': handle.itemMouseenter,
                            'mouseleave.contextMenu': handle.itemMouseleave
                        }, '.context-menu-item');

                    initialized = true;
                }
                
                // engage native contextmenu event
                $context
                    .on('contextmenu' + o.ns, o.selector, o, handle.contextmenu);
                
                if (_hasContext) {
                    // add remove hook, just in case
                    $context.on('remove' + o.ns, function() {
                        $(this).contextMenu("destroy");
                    });
                }
                
                switch (o.trigger) {
                    case 'hover':
                            $context
                                .on('mouseenter' + o.ns, o.selector, o, handle.mouseenter)
                                .on('mouseleave' + o.ns, o.selector, o, handle.mouseleave);                    
                        break;
                        
                    case 'left':
                            $context.on('click' + o.ns, o.selector, o, handle.click);
                        break;
                    /*
                    default:
                        // http://www.quirksmode.org/dom/events/contextmenu.html
                        $document
                            .on('mousedown' + o.ns, o.selector, o, handle.mousedown)
                            .on('mouseup' + o.ns, o.selector, o, handle.mouseup);
                        break;
                    */
                }
                
                // create menu
                if (!o.build) {
                    op.create(o);
                }
                break;
            
            case 'destroy':
                var $visibleMenu;
                if (_hasContext) {
                    // get proper options 
                    var context = o.context;
                    $.each(menus, function(ns, o) {
                        if (o.context !== context) {
                            return true;
                        }
                        
                        $visibleMenu = $('.context-menu-list').filter(':visible');
                        if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is($(o.context).find(o.selector))) {
                            $visibleMenu.trigger('contextmenu:hide', {force: true});
                        }

                        try {
                            if (menus[o.ns].$menu) {
                                menus[o.ns].$menu.remove();
                            }

                            delete menus[o.ns];
                        } catch(e) {
                            menus[o.ns] = null;
                        }

                        $(o.context).off(o.ns);
                        
                        return true;
                    });
                } else if (!o.selector) {
                    $document.off('.contextMenu .contextMenuAutoHide');
                    $.each(menus, function(ns, o) {
                        $(o.context).off(o.ns);
                    });
                    
                    namespaces = {};
                    menus = {};
                    counter = 0;
                    initialized = false;
                    
                    $('#context-menu-layer, .context-menu-list').remove();
                } else if (namespaces[o.selector]) {
                    $visibleMenu = $('.context-menu-list').filter(':visible');
                    if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is(o.selector)) {
                        $visibleMenu.trigger('contextmenu:hide', {force: true});
                    }
                    
                    try {
                        if (menus[namespaces[o.selector]].$menu) {
                            menus[namespaces[o.selector]].$menu.remove();
                        }
                        
                        delete menus[namespaces[o.selector]];
                    } catch(e) {
                        menus[namespaces[o.selector]] = null;
                    }
                    
                    $document.off(namespaces[o.selector]);
                }
                break;
            
            case 'html5':
                // if <command> or <menuitem> are not handled by the browser,
                // or options was a bool true,
                // initialize $.contextMenu for them
                if ((!$.support.htmlCommand && !$.support.htmlMenuitem) || (typeof options == "boolean" && options)) {
                    $('menu[type="context"]').each(function() {
                        if (this.id) {
                            $.contextMenu({
                                selector: '[contextmenu=' + this.id +']',
                                items: $.contextMenu.fromMenu(this)
                            });
                        }
                    }).css('display', 'none');
                }
                break;
            
            default:
                throw new Error('Unknown operation "' + operation + '"');
        }
        
        return this;
    };

    // find <label for="xyz">
    function inputLabel(node) {
        return (node.id && $('label[for="'+ node.id +'"]').val()) || node.name;
    }

    // convert html5 menu
    $.contextMenu.fromMenu = function(element) {
        var $this = $(element),
            items = {};
        menuChildren(items, $this.children());
        return items;
    };

    // make defaults accessible
    $.contextMenu.defaults = defaults;
    $.contextMenu.types = types;
    // export internal functions - undocumented, for hacking only!
    $.contextMenu.handle = handle;
    $.contextMenu.op = op;
    $.contextMenu.menus = menus;

})(jQuery);


(function($,CQ){
	var pluginsType = 'pupMenus';
	$.parser.plugins.push(pluginsType);//将自定义的插件加入 easyui 的插件组

	$.fn.pupMenus = function(options, param) {
		options = options || {};
		return this.each(function(){
			var id = this.id || Utils_getId('cq_pupMenus'),opts,data = $.data(this, pluginsType);
			$(this).attr({"id":id,ext:pluginsType});
			if (data) {
				opts = $.extend(data.options, options);
			} else {
				opts = $.extend( {}, $.fn.pupMenus.parseOptions(this), options);
				data = $.data(this, pluginsType, {
					options : opts,
					type:pluginsType,
					target:this
				});
			}
			create(this);
		});
	};
	$.fn.pupMenus.parseOptions = function(target) {
		var t = $(target);
		return $.extend({},$.parser.parseOptions(target,["resQueryUrl"]));//解析 data-options 或者cq-data 中的初始化参数
	};

	/**
	 * 解析json 调用另个插件创建右键菜单，仅仅支持2级就行了 不需要太多级
	 * @param  {[type]} target [description]
	 * @return {[type]}        [description]
	 */
	function create(target){
		var state=$.data(target,pluginsType),options = state.options;
		var selector = options.selector,menusArray = options.menus;
		var itemObject={
			selector:selector,
			items:{},
			callback:function(key, options){
				if(MainPage.actions[key] && MainPage.actions[key].handler){
					 MainPage.actions[key].handler();
				}
			}
		};
		for(var i=0,menu;i<menusArray.length;i++){
			menu = menusArray[i];
			if($.type(menu) === 'string'){//正常的
				if(menu=='|') {
					itemObject.items[('sep'+i)] = '------';
				}else{
					itemObject.items[menu] = {name:menu};
				}
			}else if($.type(menu) === 'object'){//有子项
				var mr = menu.menus;//解析子项
				itemObject.items['group'+i] = {name:menu.name,icon:menu.icon,items:{}};
				for(var k=0,subMenu;k<mr.length;k++){
					subMenu = mr[k];
					if(subMenu == '|'){
						itemObject.items['group'+i].items[('sep'+k)] = '-----';
					}else{
						itemObject.items['group'+i].items[subMenu] =  {name:subMenu};
					}
				}
			}
		}
		//创建插件
		  $.contextMenu(itemObject);
	}

})(jQuery,CQSDK);


/************************cq-listbox*****************************/
(function($,CQ){
	var pluginsType = 'listbox';
	$.parser.plugins.splice(30, 0,pluginsType);//将自定义的插件加入 easyui 的插件组
	/**
	 * 插件定义
	 */
	$.fn.listbox = function(options, param) {
		if (typeof options == "string") {
			return $.fn.listbox.methods[options](this, param);
		};
		
		options = options || {};

		return this.each(function(){
			var id = this.id || Utils_getId('cq_listbox'),opts,data = $.data(this, pluginsType);
			$(this).attr({"id":id,ext:pluginsType});
			if (data) {
				opts = $.extend(data.options, options);
			} else {
				opts = $.extend( {}, $.fn.listbox.defaults,$.fn.listbox.parseOptions(this), options);
				data = $.data(this, pluginsType, {
					options : opts,
					type:pluginsType,
					target:this
				});
			}
			//继承panle
			$.fn.panel.call($(this),opts);	
			create(this);
			setOpts(this);
		});
	};
	$.fn.listbox.parseOptions = function(target) {
		var t = $(target);
		return $.extend({},$.parser.parseOptions(target,["resQueryUrl"]));//解析 data-options 或者cq-data 中的初始化参数
	};

	function create(target){
		var state=$.data(target,pluginsType),options = state.options;
		$(target).addClass("cq-listbox-layout cq-listbox-body");
		if(options.height && options.height > 0){
			$(target).height(options.height);
			$(target).attr({title:options.title});
		}
		state.setOptions = setOptions;
	}

	function setOptions(options,target){
		if($.type(options) === 'array'){//直接给数据
			var temple = $.data(target,pluginsType).options.temple;
			 createItem(target,options,temple);
		}else if($.type(options) === 'object') {
			this.options.temple = options.html;
			this.options = $.extend({},this.options,options);
			createItem(this.target,options.data,options.html);
		}
		if(this.target){
			return CQ('#'+this.target.id);
		}
		
	}
	function createItem(target,data,temple,options){
		//清空 
		$(target).empty();
		if(options == null){
			options = CQ('#'+target.id).options;
		}
		$.each(data,function(i,item){
			var $li = $('<li>',{
				html: CQ.Utils.templateParse(i,data,item,temple),
				'data-index':i,
				click:function(){
					$(target).find('li').removeClass('focus');
					$(this).addClass('focus');
					if($.type(options.onSelect) == 'function'){
						options.onSelect(CQ('#'+target.id),item);
					}
				}
			}).appendTo($(target)).data('data',item);
		});
		CQ('#'+target.id).options.data = data;
	}
	function setOpts(target){
		CQ('#'+target.id).__proto__ = {
			set data(data){
				setOptions(data,this.target);
			},
			get data(){
				return this.options.data?this.options.data:[];
			},
			get value(){
				return $(this.target).find('.focus').data('data');
			},
			get selectIndex(){
				var value = this.value;
				return value?value.$index:null;
			}
		}
	}

})(jQuery,CQSDK);


/************************dataGrid表格*****************************/
(function($){
	var pluginsType = 'cqgrid';
	$.parser.plugins.push(pluginsType);//将自定义的插件加入 easyui 的插件组

	$.fn[pluginsType] = function(options, param) {
		if (typeof options == "string") {
			return ;
		};
		
		options = options || {};

		return this.each(function(){
			var id = this.id || Utils_getId('cq_grid'),opts,data = $.data(this, pluginsType),datagrid;
			$(this).attr({"id":id,ext:pluginsType});
			if (data) {
				opts = $.extend(data.options, options);
			} else {
				opts = $.extend( {}, $.fn[pluginsType].defaults,$.fn[pluginsType].parseOptions(this), options);
				data = $.data(this, pluginsType, {
					options:opts,
					type:pluginsType
				});
			}
			//你的插件。。。
			//如果在这里动态的生成了  easyui 的控件，html 写到页面上后是不能渲染成 easyui 组件的，需要手动调用
			//$.parser.parse(你定义的html); // parse 必须渲染父节点，不能渲染节点本身
			
			$.fn.datagrid.call($(this),opts);
			$(this).datagrid('resize');
			data.datagrid = $(this).datagrid('options');
			setOpts (this);
		});
	}

	/**
	 * 默认值配置
	 */
	$.fn[pluginsType].defaults = {//默认属性定义
		pagination:false,
		singleSelect:true,
		rownumbers:true,
		idField:'',
		remoteSort:false,
		pageNumber:1,
		pageSize:10,
		nowrap:true,
		autoRowHeight:false,
		fit:true,
		sortable:true,
		pageList:[10,20,30,40,50],
		selectIndex:0
	};

	$.fn[pluginsType].parseOptions = function(target) {
		var t = $(target),options;
		options = $.extend({},$.parser.parseOptions(target));//解析 data-options 中的初始化参数
		return $.extend({},options,{
			pagination:options.page?true:false,
			idField:options.key?options.key:'',
			rowStyler:options.formatter
		});
	};
	

	function setOpts (target){
		CQ('#'+target.id).__proto__ = {
			setOptions : function(opts){
				var state = $.data(target, pluginsType),options = state.options;
				if(typeof opts == 'object'){
					opts = $.extend({},options,opts);
					$(target).datagrid(opts);
				}
				return this;
			},
			get value(){
				var state = $.data(target, pluginsType),options = state.options;
				//判断是多选还是单选
				if(options.singleSelect){//单选
					return $(target).datagrid('getSelected');
				}else{
					return $(target).datagrid('getSelections');
				}
			},
			get data(){
				return $(target).datagrid('getData').rows;
			},
			set data(data){
				$(target).datagrid({data:data});
				//选中第一行,
				$(target).datagrid('selectRow',0);
				
			},
			get selectIndex(){
				return $(target).datagrid('getRowIndex', $(target).datagrid('getSelected'));  
			}
		}
	}

})(jQuery);

/************************拼音码工具*****************************/
(function(CQ){
    CQSDK.PY = {};
    CQSDK.PY.Code = function(code,toUpperCase){
        if(toUpperCase){
            return ConvertPinyin(code).toUpperCase();
        }
         return ConvertPinyin(code);
    }
    var PinYin = {
        "a": "\u554a\u963f\u9515",
        "ai": "\u57c3\u6328\u54ce\u5509\u54c0\u7691\u764c\u853c\u77ee\u827e\u788d\u7231\u9698\u8bf6\u6371\u55f3\u55cc\u5ad2\u7477\u66a7\u7839\u953f\u972d",
        "an": "\u978d\u6c28\u5b89\u4ffa\u6309\u6697\u5cb8\u80fa\u6848\u8c19\u57ef\u63de\u72b4\u5eb5\u6849\u94f5\u9e4c\u9878\u9eef",
        "ang": "\u80ae\u6602\u76ce",
        "ao": "\u51f9\u6556\u71ac\u7ff1\u8884\u50b2\u5965\u61ca\u6fb3\u5773\u62d7\u55f7\u5662\u5c99\u5ed2\u9068\u5aaa\u9a9c\u8071\u87af\u93ca\u9ccc\u93d6",
        "ba": "\u82ad\u634c\u6252\u53ed\u5427\u7b06\u516b\u75a4\u5df4\u62d4\u8dcb\u9776\u628a\u8019\u575d\u9738\u7f62\u7238\u8307\u83dd\u8406\u636d\u5c9c\u705e\u6777\u94af\u7c91\u9c85\u9b43",
        "bai": "\u767d\u67cf\u767e\u6446\u4f70\u8d25\u62dc\u7a17\u859c\u63b0\u97b4",
        "ban": "\u6591\u73ed\u642c\u6273\u822c\u9881\u677f\u7248\u626e\u62cc\u4f34\u74e3\u534a\u529e\u7eca\u962a\u5742\u8c73\u94a3\u7622\u764d\u8228",
        "bang": "\u90a6\u5e2e\u6886\u699c\u8180\u7ed1\u68d2\u78c5\u868c\u9551\u508d\u8c24\u84a1\u8783",
        "bao": "\u82de\u80de\u5305\u8912\u96f9\u4fdd\u5821\u9971\u5b9d\u62b1\u62a5\u66b4\u8c79\u9c8d\u7206\u52f9\u8446\u5b80\u5b62\u7172\u9e28\u8913\u8db5\u9f85",
        "bo": "\u5265\u8584\u73bb\u83e0\u64ad\u62e8\u94b5\u6ce2\u535a\u52c3\u640f\u94c2\u7b94\u4f2f\u5e1b\u8236\u8116\u818a\u6e24\u6cca\u9a73\u4eb3\u8543\u5575\u997d\u6a97\u64d8\u7934\u94b9\u9e41\u7c38\u8ddb",
        "bei": "\u676f\u7891\u60b2\u5351\u5317\u8f88\u80cc\u8d1d\u94a1\u500d\u72c8\u5907\u60eb\u7119\u88ab\u5b5b\u9642\u90b6\u57e4\u84d3\u5457\u602b\u6096\u789a\u9e4e\u8919\u943e",
        "ben": "\u5954\u82ef\u672c\u7b28\u755a\u574c\u951b",
        "beng": "\u5d29\u7ef7\u752d\u6cf5\u8e66\u8ff8\u552a\u5623\u750f",
        "bi": "\u903c\u9f3b\u6bd4\u9119\u7b14\u5f7c\u78a7\u84d6\u853d\u6bd5\u6bd9\u6bd6\u5e01\u5e87\u75f9\u95ed\u655d\u5f0a\u5fc5\u8f9f\u58c1\u81c2\u907f\u965b\u5315\u4ef3\u4ffe\u8298\u835c\u8378\u5421\u54d4\u72f4\u5eb3\u610e\u6ed7\u6fde\u5f3c\u59a3\u5a62\u5b16\u74a7\u8d32\u7540\u94cb\u79d5\u88e8\u7b5a\u7b85\u7be6\u822d\u895e\u8df8\u9ac0",
        "bian": "\u97ad\u8fb9\u7f16\u8d2c\u6241\u4fbf\u53d8\u535e\u8fa8\u8fa9\u8fab\u904d\u533e\u5f01\u82c4\u5fed\u6c74\u7f0f\u7178\u782d\u78a5\u7a39\u7a86\u8759\u7b3e\u9cca",
        "biao": "\u6807\u5f6a\u8198\u8868\u5a4a\u9aa0\u98d1\u98d9\u98da\u706c\u9556\u9573\u762d\u88f1\u9cd4",
        "bie": "\u9cd6\u618b\u522b\u762a\u8e69\u9cd8",
        "bin": "\u5f6c\u658c\u6fd2\u6ee8\u5bbe\u6448\u50a7\u6d5c\u7f24\u73a2\u6ba1\u8191\u9554\u9acc\u9b13",
        "bing": "\u5175\u51b0\u67c4\u4e19\u79c9\u997c\u70b3\u75c5\u5e76\u7980\u90b4\u6452\u7ee0\u678b\u69df\u71f9",
        "bu": "\u6355\u535c\u54fa\u8865\u57e0\u4e0d\u5e03\u6b65\u7c3f\u90e8\u6016\u62ca\u535f\u900b\u74ff\u6661\u949a\u91ad",
        "ca": "\u64e6\u5693\u7924",
        "cai": "\u731c\u88c1\u6750\u624d\u8d22\u776c\u8e29\u91c7\u5f69\u83dc\u8521",
        "can": "\u9910\u53c2\u8695\u6b8b\u60ed\u60e8\u707f\u9a96\u74a8\u7cb2\u9eea",
        "cang": "\u82cd\u8231\u4ed3\u6ca7\u85cf\u4f27",
        "cao": "\u64cd\u7cd9\u69fd\u66f9\u8349\u8279\u5608\u6f15\u87ac\u825a",
        "ce": "\u5395\u7b56\u4fa7\u518c\u6d4b\u5202\u5e3b\u607b",
        "ceng": "\u5c42\u8e6d\u564c",
        "cha": "\u63d2\u53c9\u832c\u8336\u67e5\u78b4\u643d\u5bdf\u5c94\u5dee\u8be7\u7339\u9987\u6c4a\u59f9\u6748\u6942\u69ce\u6aab\u9497\u9538\u9572\u8869",
        "chai": "\u62c6\u67f4\u8c7a\u4faa\u8308\u7625\u867f\u9f87",
        "chan": "\u6400\u63ba\u8749\u998b\u8c17\u7f20\u94f2\u4ea7\u9610\u98a4\u5181\u8c04\u8c36\u8487\u5edb\u5fcf\u6f7a\u6fb6\u5b71\u7fbc\u5a75\u5b17\u9aa3\u89c7\u7985\u9561\u88e3\u87fe\u8e94",
        "chang": "\u660c\u7316\u573a\u5c1d\u5e38\u957f\u507f\u80a0\u5382\u655e\u7545\u5531\u5021\u4f25\u9b2f\u82cc\u83d6\u5f9c\u6005\u60dd\u960a\u5a3c\u5ae6\u6636\u6c05\u9cb3",
        "chao": "\u8d85\u6284\u949e\u671d\u5632\u6f6e\u5de2\u5435\u7092\u600a\u7ec9\u6641\u8016",
        "che": "\u8f66\u626f\u64a4\u63a3\u5f7b\u6f88\u577c\u5c6e\u7817",
        "chen": "\u90f4\u81e3\u8fb0\u5c18\u6668\u5ff1\u6c89\u9648\u8d81\u886c\u79f0\u8c0c\u62bb\u55d4\u5bb8\u741b\u6987\u809c\u80c2\u789c\u9f80",
        "cheng": "\u6491\u57ce\u6a59\u6210\u5448\u4e58\u7a0b\u60e9\u6f84\u8bda\u627f\u901e\u9a8b\u79e4\u57d5\u5d4a\u5fb5\u6d48\u67a8\u67fd\u6a18\u665f\u584d\u77a0\u94d6\u88ce\u86cf\u9172",
        "chi": "\u5403\u75f4\u6301\u5319\u6c60\u8fdf\u5f1b\u9a70\u803b\u9f7f\u4f88\u5c3a\u8d64\u7fc5\u65a5\u70bd\u50ba\u5880\u82aa\u830c\u640b\u53f1\u54e7\u557b\u55e4\u5f73\u996c\u6cb2\u5ab8\u6555\u80dd\u7719\u7735\u9e31\u761b\u892b\u86a9\u87ad\u7b1e\u7bea\u8c49\u8e05\u8e1f\u9b51",
        "chong": "\u5145\u51b2\u866b\u5d07\u5ba0\u833a\u5fe1\u61a7\u94f3\u825f",
        "chou": "\u62bd\u916c\u7574\u8e0c\u7a20\u6101\u7b79\u4ec7\u7ef8\u7785\u4e11\u4fe6\u5733\u5e31\u60c6\u6eb4\u59af\u7633\u96e0\u9c8b",
        "chu": "\u81ed\u521d\u51fa\u6a71\u53a8\u8e87\u9504\u96cf\u6ec1\u9664\u695a\u7840\u50a8\u77d7\u6410\u89e6\u5904\u4e8d\u520d\u61b7\u7ecc\u6775\u696e\u6a17\u870d\u8e70\u9edc",
        "chuan": "\u63e3\u5ddd\u7a7f\u693d\u4f20\u8239\u5598\u4e32\u63be\u821b\u60f4\u9044\u5ddb\u6c1a\u948f\u9569\u8221",
        "chuang": "\u75ae\u7a97\u5e62\u5e8a\u95ef\u521b\u6006",
        "chui": "\u5439\u708a\u6376\u9524\u5782\u9672\u68f0\u69cc",
        "chun": "\u6625\u693f\u9187\u5507\u6df3\u7eaf\u8822\u4fc3\u83bc\u6c8c\u80ab\u6710\u9e51\u877d",
        "chuo": "\u6233\u7ef0\u851f\u8fb6\u8f8d\u955e\u8e14\u9f8a",
        "ci": "\u75b5\u8328\u78c1\u96cc\u8f9e\u6148\u74f7\u8bcd\u6b64\u523a\u8d50\u6b21\u8360\u5472\u5d6f\u9e5a\u8785\u7ccd\u8d91",
        "cong": "\u806a\u8471\u56f1\u5306\u4ece\u4e1b\u506c\u82c1\u6dd9\u9aa2\u742e\u7481\u679e",
        "cu": "\u51d1\u7c97\u918b\u7c07\u731d\u6b82\u8e59",
        "cuan": "\u8e7f\u7be1\u7a9c\u6c46\u64ba\u6615\u7228",
        "cui": "\u6467\u5d14\u50ac\u8106\u7601\u7cb9\u6dec\u7fe0\u8403\u60b4\u7480\u69b1\u96b9",
        "cun": "\u6751\u5b58\u5bf8\u78cb\u5fd6\u76b4",
        "cuo": "\u64ae\u6413\u63aa\u632b\u9519\u539d\u811e\u9509\u77ec\u75e4\u9e7e\u8e49\u8e9c",
        "da": "\u642d\u8fbe\u7b54\u7629\u6253\u5927\u8037\u54d2\u55d2\u601b\u59b2\u75b8\u8921\u7b2a\u977c\u9791",
        "dai": "\u5446\u6b79\u50a3\u6234\u5e26\u6b86\u4ee3\u8d37\u888b\u5f85\u902e\u6020\u57ed\u7519\u5454\u5cb1\u8fe8\u902f\u9a80\u7ed0\u73b3\u9edb",
        "dan": "\u803d\u62c5\u4e39\u5355\u90f8\u63b8\u80c6\u65e6\u6c2e\u4f46\u60ee\u6de1\u8bde\u5f39\u86cb\u4ebb\u510b\u5369\u840f\u5556\u6fb9\u6a90\u6b9a\u8d55\u7708\u7605\u8043\u7baa",
        "dang": "\u5f53\u6321\u515a\u8361\u6863\u8c20\u51fc\u83ea\u5b95\u7800\u94db\u88c6",
        "dao": "\u5200\u6363\u8e48\u5012\u5c9b\u7977\u5bfc\u5230\u7a3b\u60bc\u9053\u76d7\u53e8\u5541\u5fc9\u6d2e\u6c18\u7118\u5fd1\u7e9b",
        "de": "\u5fb7\u5f97\u7684\u951d",
        "deng": "\u8e6c\u706f\u767b\u7b49\u77aa\u51f3\u9093\u5654\u5d9d\u6225\u78f4\u956b\u7c26",
        "di": "\u5824\u4f4e\u6ef4\u8fea\u654c\u7b1b\u72c4\u6da4\u7fdf\u5ae1\u62b5\u5e95\u5730\u8482\u7b2c\u5e1d\u5f1f\u9012\u7f14\u6c10\u7c74\u8bcb\u8c1b\u90b8\u577b\u839c\u837b\u5600\u5a23\u67e2\u68e3\u89cc\u7825\u78b2\u7747\u955d\u7f9d\u9ab6",
        "dian": "\u98a0\u6382\u6ec7\u7898\u70b9\u5178\u975b\u57ab\u7535\u4f43\u7538\u5e97\u60e6\u5960\u6dc0\u6bbf\u4e36\u963d\u576b\u57dd\u5dc5\u73b7\u765c\u766b\u7c1f\u8e2e",
        "diao": "\u7889\u53fc\u96d5\u51cb\u5201\u6389\u540a\u9493\u8c03\u8f7a\u94de\u8729\u7c9c\u8c82",
        "die": "\u8dcc\u7239\u789f\u8776\u8fed\u8c0d\u53e0\u4f5a\u57a4\u581e\u63f2\u558b\u6e2b\u8f76\u7252\u74de\u8936\u800b\u8e40\u9cbd\u9cce",
        "ding": "\u4e01\u76ef\u53ee\u9489\u9876\u9f0e\u952d\u5b9a\u8ba2\u4e22\u4ec3\u5576\u738e\u815a\u7887\u753a\u94e4\u7594\u8035\u914a",
        "dong": "\u4e1c\u51ac\u8463\u61c2\u52a8\u680b\u4f97\u606b\u51bb\u6d1e\u578c\u549a\u5cbd\u5cd2\u5902\u6c21\u80e8\u80f4\u7850\u9e2b",
        "dou": "\u515c\u6296\u6597\u9661\u8c46\u9017\u75d8\u8538\u94ad\u7aa6\u7aac\u86aa\u7bfc\u9161",
        "du": "\u90fd\u7763\u6bd2\u728a\u72ec\u8bfb\u5835\u7779\u8d4c\u675c\u9540\u809a\u5ea6\u6e21\u5992\u828f\u561f\u6e0e\u691f\u6a50\u724d\u8839\u7b03\u9ad1\u9ee9",
        "duan": "\u7aef\u77ed\u953b\u6bb5\u65ad\u7f0e\u5f56\u6934\u7145\u7c16",
        "dui": "\u5806\u5151\u961f\u5bf9\u603c\u619d\u7893",
        "dun": "\u58a9\u5428\u8e72\u6566\u987f\u56e4\u949d\u76fe\u9041\u7096\u7818\u7905\u76f9\u9566\u8db8",
        "duo": "\u6387\u54c6\u591a\u593a\u579b\u8eb2\u6735\u8dfa\u8235\u5241\u60f0\u5815\u5484\u54da\u7f0d\u67c1\u94ce\u88f0\u8e31",
        "e": "\u86fe\u5ce8\u9e45\u4fc4\u989d\u8bb9\u5a25\u6076\u5384\u627c\u904f\u9102\u997f\u5669\u8c14\u57a9\u57ad\u82ca\u83aa\u843c\u5443\u6115\u5c59\u5a40\u8f6d\u66f7\u816d\u786a\u9507\u9537\u9e57\u989a\u9cc4",
        "en": "\u6069\u84bd\u6441\u5514\u55ef",
        "er": "\u800c\u513f\u8033\u5c14\u9975\u6d31\u4e8c\u8d30\u8fe9\u73e5\u94d2\u9e38\u9c95",
        "fa": "\u53d1\u7f5a\u7b4f\u4f10\u4e4f\u9600\u6cd5\u73d0\u57a1\u781d",
        "fan": "\u85e9\u5e06\u756a\u7ffb\u6a0a\u77fe\u9492\u7e41\u51e1\u70e6\u53cd\u8fd4\u8303\u8d29\u72af\u996d\u6cdb\u8629\u5e61\u72ad\u68b5\u6535\u71d4\u7548\u8e6f",
        "fang": "\u574a\u82b3\u65b9\u80aa\u623f\u9632\u59a8\u4eff\u8bbf\u7eba\u653e\u531a\u90a1\u5f77\u94ab\u822b\u9c82",
        "fei": "\u83f2\u975e\u5561\u98de\u80a5\u532a\u8bfd\u5420\u80ba\u5e9f\u6cb8\u8d39\u82be\u72d2\u60b1\u6ddd\u5983\u7ecb\u7eef\u69a7\u8153\u6590\u6249\u7953\u7829\u9544\u75f1\u871a\u7bda\u7fe1\u970f\u9cb1",
        "fen": "\u82ac\u915a\u5429\u6c1b\u5206\u7eb7\u575f\u711a\u6c7e\u7c89\u594b\u4efd\u5fff\u6124\u7caa\u507e\u7035\u68fc\u610d\u9cbc\u9f22",
        "feng": "\u4e30\u5c01\u67ab\u8702\u5cf0\u950b\u98ce\u75af\u70fd\u9022\u51af\u7f1d\u8bbd\u5949\u51e4\u4ff8\u9146\u8451\u6ca3\u781c",
        "fu": "\u4f5b\u5426\u592b\u6577\u80a4\u5b75\u6276\u62c2\u8f90\u5e45\u6c1f\u7b26\u4f0f\u4fd8\u670d\u6d6e\u6daa\u798f\u88b1\u5f17\u752b\u629a\u8f85\u4fef\u91dc\u65a7\u812f\u8151\u5e9c\u8150\u8d74\u526f\u8986\u8d4b\u590d\u5085\u4ed8\u961c\u7236\u8179\u8d1f\u5bcc\u8ba3\u9644\u5987\u7f1a\u5490\u5310\u51eb\u90db\u8299\u82fb\u832f\u83a9\u83d4\u544b\u5e5e\u6ecf\u8274\u5b5a\u9a78\u7ec2\u6874\u8d59\u9efb\u9efc\u7f58\u7a03\u99a5\u864d\u86a8\u8709\u8760\u876e\u9eb8\u8dba\u8dd7\u9cc6",
        "ga": "\u5676\u560e\u86e4\u5c2c\u5477\u5c15\u5c1c\u65ee\u9486",
        "gai": "\u8be5\u6539\u6982\u9499\u76d6\u6e89\u4e10\u9654\u5793\u6224\u8d45\u80f2",
        "gan": "\u5e72\u7518\u6746\u67d1\u7aff\u809d\u8d76\u611f\u79c6\u6562\u8d63\u5769\u82f7\u5c34\u64c0\u6cd4\u6de6\u6f89\u7ec0\u6a44\u65f0\u77f8\u75b3\u9150",
        "gang": "\u5188\u521a\u94a2\u7f38\u809b\u7eb2\u5c97\u6e2f\u6206\u7f61\u9883\u7b7b",
        "gong": "\u6760\u5de5\u653b\u529f\u606d\u9f9a\u4f9b\u8eac\u516c\u5bab\u5f13\u5de9\u6c5e\u62f1\u8d21\u5171\u857b\u5efe\u54a3\u73d9\u80b1\u86a3\u86e9\u89e5",
        "gao": "\u7bd9\u768b\u9ad8\u818f\u7f94\u7cd5\u641e\u9550\u7a3f\u544a\u777e\u8bf0\u90dc\u84bf\u85c1\u7f1f\u69d4\u69c1\u6772\u9506",
        "ge": "\u54e5\u6b4c\u6401\u6208\u9e3d\u80f3\u7599\u5272\u9769\u845b\u683c\u9601\u9694\u94ec\u4e2a\u5404\u9b32\u4ee1\u54ff\u5865\u55dd\u7ea5\u643f\u8188\u784c\u94ea\u9549\u88bc\u988c\u867c\u8238\u9abc\u9ac2",
        "gei": "\u7ed9",
        "gen": "\u6839\u8ddf\u4e98\u831b\u54cf\u826e",
        "geng": "\u8015\u66f4\u5e9a\u7fb9\u57c2\u803f\u6897\u54fd\u8d53\u9ca0",
        "gou": "\u94a9\u52fe\u6c9f\u82df\u72d7\u57a2\u6784\u8d2d\u591f\u4f5d\u8bdf\u5ca3\u9058\u5abe\u7f11\u89cf\u5f40\u9e32\u7b31\u7bdd\u97b2",
        "gu": "\u8f9c\u83c7\u5495\u7b8d\u4f30\u6cbd\u5b64\u59d1\u9f13\u53e4\u86ca\u9aa8\u8c37\u80a1\u6545\u987e\u56fa\u96c7\u560f\u8bc2\u83f0\u54cc\u5d2e\u6c69\u688f\u8f71\u726f\u727f\u80cd\u81cc\u6bc2\u77bd\u7f5f\u94b4\u9522\u74e0\u9e2a\u9e44\u75fc\u86c4\u9164\u89da\u9cb4\u9ab0\u9e58",
        "gua": "\u522e\u74dc\u5250\u5be1\u6302\u8902\u5366\u8bd6\u5471\u681d\u9e39",
        "guai": "\u4e56\u62d0\u602a\u54d9",
        "guan": "\u68fa\u5173\u5b98\u51a0\u89c2\u7ba1\u9986\u7f50\u60ef\u704c\u8d2f\u500c\u839e\u63bc\u6dab\u76e5\u9e73\u9ccf",
        "guang": "\u5149\u5e7f\u901b\u72b7\u6844\u80f1\u7592",
        "gui": "\u7470\u89c4\u572d\u7845\u5f52\u9f9f\u95fa\u8f68\u9b3c\u8be1\u7678\u6842\u67dc\u8dea\u8d35\u523d\u5326\u523f\u5e8b\u5b84\u59ab\u6867\u7085\u6677\u7688\u7c0b\u9c91\u9cdc",
        "gun": "\u8f8a\u6eda\u68cd\u4e28\u886e\u7ef2\u78d9\u9ca7",
        "guo": "\u9505\u90ed\u56fd\u679c\u88f9\u8fc7\u9998\u8803\u57da\u63b4\u5459\u56d7\u5e3c\u5d1e\u7313\u6901\u8662\u951e\u8052\u872e\u873e\u8748",
        "ha": "\u54c8",
        "hai": "\u9ab8\u5b69\u6d77\u6c26\u4ea5\u5bb3\u9a87\u54b4\u55e8\u988f\u91a2",
        "han": "\u9163\u61a8\u90af\u97e9\u542b\u6db5\u5bd2\u51fd\u558a\u7f55\u7ff0\u64bc\u634d\u65f1\u61be\u608d\u710a\u6c57\u6c49\u9097\u83e1\u6496\u961a\u701a\u6657\u7113\u9894\u86b6\u9f3e",
        "hen": "\u592f\u75d5\u5f88\u72e0\u6068",
        "hang": "\u676d\u822a\u6c86\u7ed7\u73e9\u6841",
        "hao": "\u58d5\u568e\u8c6a\u6beb\u90dd\u597d\u8017\u53f7\u6d69\u8585\u55e5\u5686\u6fe0\u704f\u660a\u7693\u98a2\u869d",
        "he": "\u5475\u559d\u8377\u83cf\u6838\u79be\u548c\u4f55\u5408\u76d2\u8c89\u9602\u6cb3\u6db8\u8d6b\u8910\u9e64\u8d3a\u8bc3\u52be\u58d1\u85ff\u55d1\u55ec\u9616\u76cd\u86b5\u7fee",
        "hei": "\u563f\u9ed1",
        "heng": "\u54fc\u4ea8\u6a2a\u8861\u6052\u8a07\u8605",
        "hong": "\u8f70\u54c4\u70d8\u8679\u9e3f\u6d2a\u5b8f\u5f18\u7ea2\u9ec9\u8ba7\u836d\u85a8\u95f3\u6cd3",
        "hou": "\u5589\u4faf\u7334\u543c\u539a\u5019\u540e\u5820\u5f8c\u9005\u760a\u7bcc\u7cc7\u9c8e\u9aba",
        "hu": "\u547c\u4e4e\u5ffd\u745a\u58f6\u846b\u80e1\u8774\u72d0\u7cca\u6e56\u5f27\u864e\u552c\u62a4\u4e92\u6caa\u6237\u51b1\u553f\u56eb\u5cb5\u7322\u6019\u60da\u6d52\u6ef9\u7425\u69f2\u8f77\u89f3\u70c0\u7173\u623d\u6248\u795c\u9e55\u9e71\u7b0f\u9190\u659b",
        "hua": "\u82b1\u54d7\u534e\u733e\u6ed1\u753b\u5212\u5316\u8bdd\u5290\u6d4d\u9a85\u6866\u94e7\u7a1e",
        "huai": "\u69d0\u5f8a\u6000\u6dee\u574f\u8fd8\u8e1d",
        "huan": "\u6b22\u73af\u6853\u7f13\u6362\u60a3\u5524\u75ea\u8c62\u7115\u6da3\u5ba6\u5e7b\u90c7\u5942\u57b8\u64d0\u571c\u6d39\u6d63\u6f36\u5bf0\u902d\u7f33\u953e\u9ca9\u9b1f",
        "huang": "\u8352\u614c\u9ec4\u78fa\u8757\u7c27\u7687\u51f0\u60f6\u714c\u6643\u5e4c\u604d\u8c0e\u968d\u5fa8\u6e5f\u6f62\u9051\u749c\u8093\u7640\u87e5\u7bc1\u9cc7",
        "hui": "\u7070\u6325\u8f89\u5fbd\u6062\u86d4\u56de\u6bc1\u6094\u6167\u5349\u60e0\u6666\u8d3f\u79fd\u4f1a\u70e9\u6c47\u8bb3\u8bf2\u7ed8\u8bd9\u8334\u835f\u8559\u54d5\u5599\u96b3\u6d04\u5f57\u7f0b\u73f2\u6656\u605a\u867a\u87ea\u9ebe",
        "hun": "\u8364\u660f\u5a5a\u9b42\u6d51\u6df7\u8be8\u9984\u960d\u6eb7\u7f17",
        "huo": "\u8c41\u6d3b\u4f19\u706b\u83b7\u6216\u60d1\u970d\u8d27\u7978\u6509\u56af\u5925\u94ac\u952a\u956c\u8020\u8816",
        "ji": "\u51fb\u573e\u57fa\u673a\u7578\u7a3d\u79ef\u7b95\u808c\u9965\u8ff9\u6fc0\u8ba5\u9e21\u59ec\u7ee9\u7f09\u5409\u6781\u68d8\u8f91\u7c4d\u96c6\u53ca\u6025\u75be\u6c72\u5373\u5ac9\u7ea7\u6324\u51e0\u810a\u5df1\u84df\u6280\u5180\u5b63\u4f0e\u796d\u5242\u60b8\u6d4e\u5bc4\u5bc2\u8ba1\u8bb0\u65e2\u5fcc\u9645\u5993\u7ee7\u7eaa\u5c45\u4e0c\u4e69\u525e\u4f76\u4f74\u8114\u58bc\u82a8\u82b0\u8401\u84ba\u857a\u638e\u53fd\u54ad\u54dc\u5527\u5c8c\u5d74\u6d0e\u5f50\u5c50\u9aa5\u757f\u7391\u696b\u6b9b\u621f\u6222\u8d4d\u89ca\u7284\u9f51\u77f6\u7f81\u5d47\u7a37\u7620\u7635\u866e\u7b08\u7b04\u66a8\u8dfb\u8dfd\u9701\u9c9a\u9cab\u9afb\u9e82",
        "jia": "\u5609\u67b7\u5939\u4f73\u5bb6\u52a0\u835a\u988a\u8d3e\u7532\u94be\u5047\u7a3c\u4ef7\u67b6\u9a7e\u5ac1\u4f3d\u90cf\u62ee\u5cac\u6d43\u8fe6\u73c8\u621b\u80db\u605d\u94d7\u9553\u75c2\u86f1\u7b33\u8888\u8dcf",
        "jian": "\u6b7c\u76d1\u575a\u5c16\u7b3a\u95f4\u714e\u517c\u80a9\u8270\u5978\u7f04\u8327\u68c0\u67ec\u78b1\u7877\u62e3\u6361\u7b80\u4fed\u526a\u51cf\u8350\u69db\u9274\u8df5\u8d31\u89c1\u952e\u7bad\u4ef6\u5065\u8230\u5251\u996f\u6e10\u6e85\u6da7\u5efa\u50ed\u8c0f\u8c2b\u83c5\u84b9\u641b\u56dd\u6e54\u8e47\u8b07\u7f23\u67a7\u67d9\u6957\u620b\u622c\u726e\u728d\u6bfd\u8171\u7751\u950f\u9e63\u88e5\u7b15\u7bb4\u7fe6\u8dbc\u8e3a\u9ca3\u97af",
        "jiang": "\u50f5\u59dc\u5c06\u6d46\u6c5f\u7586\u848b\u6868\u5956\u8bb2\u5320\u9171\u964d\u8333\u6d1a\u7edb\u7f30\u729f\u7913\u8029\u7ce8\u8c47",
        "jiao": "\u8549\u6912\u7901\u7126\u80f6\u4ea4\u90ca\u6d47\u9a84\u5a07\u56bc\u6405\u94f0\u77eb\u4fa5\u811a\u72e1\u89d2\u997a\u7f34\u7ede\u527f\u6559\u9175\u8f7f\u8f83\u53eb\u4f7c\u50ec\u832d\u6322\u564d\u5ce4\u5fbc\u59e3\u7e9f\u656b\u768e\u9e6a\u86df\u91ae\u8de4\u9c9b",
        "jie": "\u7a96\u63ed\u63a5\u7686\u79f8\u8857\u9636\u622a\u52ab\u8282\u6854\u6770\u6377\u776b\u7aed\u6d01\u7ed3\u89e3\u59d0\u6212\u85c9\u82a5\u754c\u501f\u4ecb\u75a5\u8beb\u5c4a\u5048\u8ba6\u8bd8\u5588\u55df\u736c\u5a55\u5b51\u6840\u7352\u78a3\u9534\u7596\u88b7\u9889\u86a7\u7faf\u9c92\u9ab1\u9aeb",
        "jin": "\u5dfe\u7b4b\u65a4\u91d1\u4eca\u6d25\u895f\u7d27\u9526\u4ec5\u8c28\u8fdb\u9773\u664b\u7981\u8fd1\u70ec\u6d78\u5c3d\u537a\u8369\u5807\u5664\u9991\u5ed1\u5997\u7f19\u747e\u69ff\u8d46\u89d0\u9485\u9513\u887f\u77dc",
        "jing": "\u52b2\u8346\u5162\u830e\u775b\u6676\u9cb8\u4eac\u60ca\u7cbe\u7cb3\u7ecf\u4e95\u8b66\u666f\u9888\u9759\u5883\u656c\u955c\u5f84\u75c9\u9756\u7adf\u7ade\u51c0\u522d\u5106\u9631\u83c1\u734d\u61ac\u6cfe\u8ff3\u5f2a\u5a67\u80bc\u80eb\u8148\u65cc",
        "jiong": "\u70af\u7a98\u5182\u8fe5\u6243",
        "jiu": "\u63ea\u7a76\u7ea0\u7396\u97ed\u4e45\u7078\u4e5d\u9152\u53a9\u6551\u65e7\u81fc\u8205\u548e\u5c31\u759a\u50e6\u557e\u9604\u67e9\u6855\u9e6b\u8d73\u9b0f",
        "ju": "\u97a0\u62d8\u72d9\u75bd\u9a79\u83ca\u5c40\u5480\u77e9\u4e3e\u6cae\u805a\u62d2\u636e\u5de8\u5177\u8ddd\u8e1e\u952f\u4ff1\u53e5\u60e7\u70ac\u5267\u5028\u8bb5\u82e3\u82f4\u8392\u63ac\u907d\u5c66\u741a\u67b8\u6910\u6998\u6989\u6a58\u728b\u98d3\u949c\u9514\u7aad\u88fe\u8d84\u91b5\u8e3d\u9f83\u96ce\u97ab",
        "juan": "\u6350\u9e43\u5a1f\u5026\u7737\u5377\u7ee2\u9104\u72f7\u6d93\u684a\u8832\u9529\u954c\u96bd",
        "jue": "\u6485\u652b\u6289\u6398\u5014\u7235\u89c9\u51b3\u8bc0\u7edd\u53a5\u5282\u8c32\u77cd\u8568\u5658\u5d1b\u7357\u5b53\u73cf\u6877\u6a5b\u721d\u9562\u8e76\u89d6",
        "jun": "\u5747\u83cc\u94a7\u519b\u541b\u5cfb\u4fca\u7ae3\u6d5a\u90e1\u9a8f\u6343\u72fb\u76b2\u7b60\u9e87",
        "ka": "\u5580\u5496\u5361\u4f67\u5494\u80e9",
        "ke": "\u54af\u5777\u82db\u67ef\u68f5\u78d5\u9897\u79d1\u58f3\u54b3\u53ef\u6e34\u514b\u523b\u5ba2\u8bfe\u5ca2\u606a\u6e98\u9a92\u7f02\u73c2\u8f72\u6c2a\u778c\u94b6\u75b4\u7aa0\u874c\u9ac1",
        "kai": "\u5f00\u63e9\u6977\u51ef\u6168\u5240\u57b2\u8488\u5ffe\u607a\u94e0\u950e",
        "kan": "\u520a\u582a\u52d8\u574e\u780d\u770b\u4f83\u51f5\u83b0\u83b6\u6221\u9f9b\u77b0",
        "kang": "\u5eb7\u6177\u7ce0\u625b\u6297\u4ea2\u7095\u5751\u4f09\u95f6\u94aa",
        "kao": "\u8003\u62f7\u70e4\u9760\u5c3b\u6832\u7292\u94d0",
        "ken": "\u80af\u5543\u57a6\u6073\u57a0\u88c9\u9880",
        "keng": "\u542d\u5fd0\u94ff",
        "kong": "\u7a7a\u6050\u5b54\u63a7\u5025\u5d06\u7b9c",
        "kou": "\u62a0\u53e3\u6263\u5bc7\u82a4\u853b\u53e9\u770d\u7b58",
        "ku": "\u67af\u54ed\u7a9f\u82e6\u9177\u5e93\u88e4\u5233\u5800\u55be\u7ed4\u9ab7",
        "kua": "\u5938\u57ae\u630e\u8de8\u80ef\u4f89",
        "kuai": "\u5757\u7b77\u4fa9\u5feb\u84af\u90d0\u8489\u72ef\u810d",
        "kuan": "\u5bbd\u6b3e\u9acb",
        "kuang": "\u5321\u7b50\u72c2\u6846\u77ff\u7736\u65f7\u51b5\u8bd3\u8bf3\u909d\u5739\u593c\u54d0\u7ea9\u8d36",
        "kui": "\u4e8f\u76d4\u5cbf\u7aa5\u8475\u594e\u9b41\u5080\u9988\u6127\u6e83\u9997\u532e\u5914\u9697\u63c6\u55b9\u559f\u609d\u6126\u9615\u9035\u668c\u777d\u8069\u8770\u7bd1\u81fe\u8dec",
        "kun": "\u5764\u6606\u6346\u56f0\u6083\u9603\u7428\u951f\u918c\u9cb2\u9ae1",
        "kuo": "\u62ec\u6269\u5ed3\u9614\u86de",
        "la": "\u5783\u62c9\u5587\u8721\u814a\u8fa3\u5566\u524c\u647a\u908b\u65ef\u782c\u760c",
        "lai": "\u83b1\u6765\u8d56\u5d03\u5f95\u6d9e\u6fd1\u8d49\u7750\u94fc\u765e\u7c41",
        "lan": "\u84dd\u5a6a\u680f\u62e6\u7bee\u9611\u5170\u6f9c\u8c30\u63fd\u89c8\u61d2\u7f06\u70c2\u6ee5\u5549\u5c9a\u61d4\u6f24\u6984\u6593\u7f71\u9567\u8934",
        "lang": "\u7405\u6994\u72fc\u5eca\u90ce\u6717\u6d6a\u83a8\u8497\u5577\u9606\u9512\u7a02\u8782",
        "lao": "\u635e\u52b3\u7262\u8001\u4f6c\u59e5\u916a\u70d9\u6d9d\u5520\u5d02\u6833\u94d1\u94f9\u75e8\u91aa",
        "le": "\u52d2\u4e50\u808b\u4ec2\u53fb\u561e\u6cd0\u9cd3",
        "lei": "\u96f7\u956d\u857e\u78ca\u7d2f\u5121\u5792\u64c2\u7c7b\u6cea\u7fb8\u8bd4\u837d\u54a7\u6f2f\u5ad8\u7f27\u6a91\u8012\u9179",
        "ling": "\u68f1\u51b7\u62ce\u73b2\u83f1\u96f6\u9f84\u94c3\u4f36\u7f9a\u51cc\u7075\u9675\u5cad\u9886\u53e6\u4ee4\u9143\u5844\u82d3\u5464\u56f9\u6ce0\u7eeb\u67c3\u68c2\u74f4\u8046\u86c9\u7fce\u9cae",
        "leng": "\u695e\u6123",
        "li": "\u5398\u68a8\u7281\u9ece\u7bf1\u72f8\u79bb\u6f13\u7406\u674e\u91cc\u9ca4\u793c\u8389\u8354\u540f\u6817\u4e3d\u5389\u52b1\u783e\u5386\u5229\u5088\u4f8b\u4fd0\u75e2\u7acb\u7c92\u6ca5\u96b6\u529b\u7483\u54e9\u4fea\u4fda\u90e6\u575c\u82c8\u8385\u84e0\u85dc\u6369\u5456\u5533\u55b1\u7301\u6ea7\u6fa7\u9026\u5a0c\u5ae0\u9a8a\u7f21\u73de\u67a5\u680e\u8f79\u623e\u783a\u8a48\u7f79\u9502\u9e42\u75a0\u75ac\u86ce\u870a\u8821\u7b20\u7be5\u7c9d\u91b4\u8dde\u96f3\u9ca1\u9ce2\u9ee7",
        "lian": "\u4fe9\u8054\u83b2\u8fde\u9570\u5ec9\u601c\u6d9f\u5e18\u655b\u8138\u94fe\u604b\u70bc\u7ec3\u631b\u8539\u5941\u6f4b\u6fc2\u5a08\u740f\u695d\u6b93\u81c1\u81a6\u88e2\u880a\u9ca2",
        "liang": "\u7cae\u51c9\u6881\u7cb1\u826f\u4e24\u8f86\u91cf\u667e\u4eae\u8c05\u589a\u690b\u8e09\u9753\u9b49",
        "liao": "\u64a9\u804a\u50da\u7597\u71ce\u5be5\u8fbd\u6f66\u4e86\u6482\u9563\u5ed6\u6599\u84fc\u5c25\u5639\u7360\u5bee\u7f2d\u948c\u9e69\u8022",
        "lie": "\u5217\u88c2\u70c8\u52a3\u730e\u51bd\u57d2\u6d0c\u8d94\u8e90\u9b23",
        "lin": "\u7433\u6797\u78f7\u9716\u4e34\u90bb\u9cde\u6dcb\u51db\u8d41\u541d\u853a\u5d99\u5eea\u9074\u6aa9\u8f9a\u77b5\u7cbc\u8e8f\u9e9f",
        "liu": "\u6e9c\u7409\u69b4\u786b\u998f\u7559\u5218\u7624\u6d41\u67f3\u516d\u62a1\u507b\u848c\u6cd6\u6d4f\u905b\u9a9d\u7efa\u65d2\u7198\u950d\u954f\u9e68\u938f",
        "long": "\u9f99\u804b\u5499\u7b3c\u7abf\u9686\u5784\u62e2\u9647\u5f04\u5785\u830f\u6cf7\u73d1\u680a\u80e7\u783b\u7643",
        "lou": "\u697c\u5a04\u6402\u7bd3\u6f0f\u964b\u55bd\u5d5d\u9542\u7618\u8027\u877c\u9ac5",
        "lu": "\u82a6\u5362\u9885\u5e90\u7089\u63b3\u5364\u864f\u9c81\u9e93\u788c\u9732\u8def\u8d42\u9e7f\u6f5e\u7984\u5f55\u9646\u622e\u5786\u6445\u64b8\u565c\u6cf8\u6e0c\u6f09\u7490\u680c\u6a79\u8f73\u8f82\u8f98\u6c07\u80ea\u9565\u9e2c\u9e6d\u7c0f\u823b\u9c88",
        "lv": "\u9a74\u5415\u94dd\u4fa3\u65c5\u5c65\u5c61\u7f15\u8651\u6c2f\u5f8b\u7387\u6ee4\u7eff\u634b\u95fe\u6988\u8182\u7a06\u891b",
        "luan": "\u5ce6\u5b6a\u6ee6\u5375\u4e71\u683e\u9e3e\u92ae",
        "lue": "\u63a0\u7565\u950a",
        "lun": "\u8f6e\u4f26\u4ed1\u6ca6\u7eb6\u8bba\u56f5",
        "luo": "\u841d\u87ba\u7f57\u903b\u9523\u7ba9\u9aa1\u88f8\u843d\u6d1b\u9a86\u7edc\u502e\u8366\u645e\u7321\u6cfa\u6924\u8136\u9559\u7630\u96d2",
        "ma": "\u5988\u9ebb\u739b\u7801\u8682\u9a6c\u9a82\u561b\u5417\u551b\u72b8\u5b37\u6769\u9ebd",
        "mai": "\u57cb\u4e70\u9ea6\u5356\u8fc8\u8109\u52a2\u836c\u54aa\u973e",
        "man": "\u7792\u9992\u86ee\u6ee1\u8513\u66fc\u6162\u6f2b\u8c29\u5881\u5e54\u7f26\u71b3\u9558\u989f\u87a8\u9cd7\u9794",
        "mang": "\u8292\u832b\u76f2\u5fd9\u83bd\u9099\u6f2d\u6726\u786d\u87d2",
        "meng": "\u6c13\u840c\u8499\u6aac\u76df\u9530\u731b\u68a6\u5b5f\u52d0\u750d\u77a2\u61f5\u791e\u867b\u8722\u8813\u824b\u8268\u9efe",
        "miao": "\u732b\u82d7\u63cf\u7784\u85d0\u79d2\u6e3a\u5e99\u5999\u55b5\u9088\u7f08\u7f2a\u676a\u6dfc\u7707\u9e4b\u8731",
        "mao": "\u8305\u951a\u6bdb\u77db\u94c6\u536f\u8302\u5192\u5e3d\u8c8c\u8d38\u4f94\u88a4\u52d6\u8306\u5cc1\u7441\u6634\u7266\u8004\u65c4\u61cb\u7780\u86d1\u8765\u87ca\u9ae6",
        "me": "\u4e48",
        "mei": "\u73ab\u679a\u6885\u9176\u9709\u7164\u6ca1\u7709\u5a92\u9541\u6bcf\u7f8e\u6627\u5bd0\u59b9\u5a9a\u5776\u8393\u5d4b\u7338\u6d7c\u6e44\u6963\u9545\u9e5b\u8882\u9b45",
        "men": "\u95e8\u95f7\u4eec\u626a\u739f\u7116\u61d1\u9494",
        "mi": "\u772f\u919a\u9761\u7cdc\u8ff7\u8c1c\u5f25\u7c73\u79d8\u89c5\u6ccc\u871c\u5bc6\u5e42\u8288\u5196\u8c27\u863c\u5627\u7315\u736f\u6c68\u5b93\u5f2d\u8112\u6549\u7cf8\u7e3b\u9e8b",
        "mian": "\u68c9\u7720\u7ef5\u5195\u514d\u52c9\u5a29\u7f05\u9762\u6c94\u6e4e\u817c\u7704",
        "mie": "\u8511\u706d\u54a9\u881b\u7bfe",
        "min": "\u6c11\u62bf\u76bf\u654f\u60af\u95fd\u82e0\u5cb7\u95f5\u6cef\u73c9",
        "ming": "\u660e\u879f\u9e23\u94ed\u540d\u547d\u51a5\u8317\u6e9f\u669d\u7791\u9169",
        "miu": "\u8c2c",
        "mo": "\u6478\u6479\u8611\u6a21\u819c\u78e8\u6469\u9b54\u62b9\u672b\u83ab\u58a8\u9ed8\u6cab\u6f20\u5bde\u964c\u8c1f\u8309\u84e6\u998d\u5aeb\u9546\u79e3\u763c\u8031\u87c6\u8c8a\u8c98",
        "mou": "\u8c0b\u725f\u67d0\u53b6\u54de\u5a7a\u7738\u936a",
        "mu": "\u62c7\u7261\u4ea9\u59c6\u6bcd\u5893\u66ae\u5e55\u52df\u6155\u6728\u76ee\u7766\u7267\u7a46\u4eeb\u82dc\u5452\u6c90\u6bea\u94bc",
        "na": "\u62ff\u54ea\u5450\u94a0\u90a3\u5a1c\u7eb3\u5185\u637a\u80ad\u954e\u8872\u7bac",
        "nai": "\u6c16\u4e43\u5976\u8010\u5948\u9f10\u827f\u8418\u67f0",
        "nan": "\u5357\u7537\u96be\u56ca\u5583\u56e1\u6960\u8169\u877b\u8d67",
        "nao": "\u6320\u8111\u607c\u95f9\u5b6c\u57b4\u7331\u7459\u7847\u94d9\u86f2",
        "ne": "\u6dd6\u5462\u8bb7",
        "nei": "\u9981",
        "nen": "\u5ae9\u80fd\u6798\u6041",
        "ni": "\u59ae\u9713\u502a\u6ce5\u5c3c\u62df\u4f60\u533f\u817b\u9006\u6eba\u4f32\u576d\u730a\u6029\u6ee0\u6635\u65ce\u7962\u615d\u7768\u94cc\u9cb5",
        "nian": "\u852b\u62c8\u5e74\u78be\u64b5\u637b\u5ff5\u5eff\u8f87\u9ecf\u9c87\u9cb6",
        "niang": "\u5a18\u917f",
        "niao": "\u9e1f\u5c3f\u8311\u5b32\u8132\u8885",
        "nie": "\u634f\u8042\u5b7d\u556e\u954a\u954d\u6d85\u4e5c\u9667\u8616\u55eb\u8080\u989e\u81ec\u8e51",
        "nin": "\u60a8\u67e0",
        "ning": "\u72de\u51dd\u5b81\u62e7\u6cde\u4f5e\u84e5\u549b\u752f\u804d",
        "niu": "\u725b\u626d\u94ae\u7ebd\u72c3\u5ff8\u599e\u86b4",
        "nong": "\u8113\u6d53\u519c\u4fac",
        "nu": "\u5974\u52aa\u6012\u5476\u5e11\u5f29\u80ec\u5b65\u9a7d",
        "nv": "\u5973\u6067\u9495\u8844",
        "nuan": "\u6696",
        "nuenue": "\u8650",
        "nue": "\u759f\u8c11",
        "nuo": "\u632a\u61e6\u7cef\u8bfa\u50a9\u6426\u558f\u9518",
        "ou": "\u54e6\u6b27\u9e25\u6bb4\u85d5\u5455\u5076\u6ca4\u6004\u74ef\u8026",
        "pa": "\u556a\u8db4\u722c\u5e15\u6015\u7436\u8469\u7b62",
        "pai": "\u62cd\u6392\u724c\u5f98\u6e43\u6d3e\u4ff3\u848e",
        "pan": "\u6500\u6f58\u76d8\u78d0\u76fc\u7554\u5224\u53db\u723f\u6cee\u88a2\u897b\u87e0\u8e52",
        "pang": "\u4e53\u5e9e\u65c1\u802a\u80d6\u6ec2\u9004",
        "pao": "\u629b\u5486\u5228\u70ae\u888d\u8dd1\u6ce1\u530f\u72cd\u5e96\u812c\u75b1",
        "pei": "\u5478\u80da\u57f9\u88f4\u8d54\u966a\u914d\u4f69\u6c9b\u638a\u8f94\u5e14\u6de0\u65c6\u952b\u9185\u9708",
        "pen": "\u55b7\u76c6\u6e53",
        "peng": "\u7830\u62a8\u70f9\u6f8e\u5f6d\u84ec\u68da\u787c\u7bf7\u81a8\u670b\u9e4f\u6367\u78b0\u576f\u580b\u562d\u6026\u87db",
        "pi": "\u7812\u9739\u6279\u62ab\u5288\u7435\u6bd7\u5564\u813e\u75b2\u76ae\u5339\u75de\u50fb\u5c41\u8b6c\u4e15\u9674\u90b3\u90eb\u572e\u9f19\u64d7\u567c\u5e80\u5ab2\u7eb0\u6787\u7513\u7765\u7f74\u94cd\u75e6\u7656\u758b\u868d\u8c94",
        "pian": "\u7bc7\u504f\u7247\u9a97\u8c1d\u9a88\u728f\u80fc\u890a\u7fe9\u8e41",
        "piao": "\u98d8\u6f02\u74e2\u7968\u527d\u560c\u5ad6\u7f25\u6b8d\u779f\u87b5",
        "pie": "\u6487\u77a5\u4e3f\u82e4\u6c15",
        "pin": "\u62fc\u9891\u8d2b\u54c1\u8058\u62da\u59d8\u5ad4\u6980\u725d\u98a6",
        "ping": "\u4e52\u576a\u82f9\u840d\u5e73\u51ed\u74f6\u8bc4\u5c4f\u4fdc\u5a09\u67b0\u9c86",
        "po": "\u5761\u6cfc\u9887\u5a46\u7834\u9b44\u8feb\u7c95\u53f5\u9131\u6ea5\u73c0\u948b\u94b7\u76a4\u7b38",
        "pou": "\u5256\u88d2\u8e23",
        "pu": "\u6251\u94fa\u4ec6\u8386\u8461\u83e9\u84b2\u57d4\u6734\u5703\u666e\u6d66\u8c31\u66dd\u7011\u530d\u5657\u6fee\u749e\u6c06\u9564\u9568\u8e7c",
        "qi": "\u671f\u6b3a\u6816\u621a\u59bb\u4e03\u51c4\u6f06\u67d2\u6c8f\u5176\u68cb\u5947\u6b67\u7566\u5d0e\u8110\u9f50\u65d7\u7948\u7941\u9a91\u8d77\u5c82\u4e5e\u4f01\u542f\u5951\u780c\u5668\u6c14\u8fc4\u5f03\u6c7d\u6ce3\u8bab\u4e9f\u4e93\u573b\u8291\u840b\u847a\u5601\u5c7a\u5c90\u6c54\u6dc7\u9a90\u7eee\u742a\u7426\u675e\u6864\u69ed\u6b39\u797a\u61a9\u789b\u86f4\u871e\u7da6\u7dae\u8dbf\u8e4a\u9ccd\u9e92",
        "qia": "\u6390\u6070\u6d3d\u845c",
        "qian": "\u7275\u6266\u948e\u94c5\u5343\u8fc1\u7b7e\u4edf\u8c26\u4e7e\u9ed4\u94b1\u94b3\u524d\u6f5c\u9063\u6d45\u8c34\u5811\u5d4c\u6b20\u6b49\u4f65\u9621\u828a\u82a1\u8368\u63ae\u5c8d\u60ad\u614a\u9a9e\u6434\u8930\u7f31\u6920\u80b7\u6106\u94a4\u8654\u7b9d",
        "qiang": "\u67aa\u545b\u8154\u7f8c\u5899\u8537\u5f3a\u62a2\u5af1\u6a2f\u6217\u709d\u9516\u9535\u956a\u8941\u8723\u7f9f\u8deb\u8dc4",
        "qiao": "\u6a47\u9539\u6572\u6084\u6865\u77a7\u4e54\u4fa8\u5de7\u9798\u64ac\u7fd8\u5ced\u4fcf\u7a8d\u5281\u8bee\u8c2f\u835e\u6100\u6194\u7f32\u6a35\u6bf3\u7857\u8df7\u9792",
        "qie": "\u5207\u8304\u4e14\u602f\u7a83\u90c4\u553c\u60ec\u59be\u6308\u9532\u7ba7",
        "qin": "\u94a6\u4fb5\u4eb2\u79e6\u7434\u52e4\u82b9\u64d2\u79bd\u5bdd\u6c81\u82a9\u84c1\u8572\u63ff\u5423\u55ea\u5659\u6eb1\u6a8e\u8793\u887e",
        "qing": "\u9752\u8f7b\u6c22\u503e\u537f\u6e05\u64ce\u6674\u6c30\u60c5\u9877\u8bf7\u5e86\u5029\u82d8\u570a\u6aa0\u78ec\u873b\u7f44\u7b90\u8b26\u9cad\u9ee5",
        "qiong": "\u743c\u7a77\u909b\u8315\u7a79\u7b47\u928e",
        "qiu": "\u79cb\u4e18\u90b1\u7403\u6c42\u56da\u914b\u6cc5\u4fc5\u6c3d\u5def\u827d\u72b0\u6e6b\u9011\u9052\u6978\u8d47\u9e20\u866c\u86af\u8764\u88d8\u7cd7\u9cc5\u9f3d",
        "qu": "\u8d8b\u533a\u86c6\u66f2\u8eaf\u5c48\u9a71\u6e20\u53d6\u5a36\u9f8b\u8da3\u53bb\u8bce\u52ac\u8556\u8627\u5c96\u8862\u9612\u74a9\u89d1\u6c0d\u795b\u78f2\u766f\u86d0\u883c\u9eb4\u77bf\u9ee2",
        "quan": "\u5708\u98a7\u6743\u919b\u6cc9\u5168\u75ca\u62f3\u72ac\u5238\u529d\u8be0\u8343\u737e\u609b\u7efb\u8f81\u754e\u94e8\u8737\u7b4c\u9b08",
        "que": "\u7f3a\u7094\u7638\u5374\u9e4a\u69b7\u786e\u96c0\u9619\u60ab",
        "qun": "\u88d9\u7fa4\u9021",
        "ran": "\u7136\u71c3\u5189\u67d3\u82d2\u9aef",
        "rang": "\u74e4\u58e4\u6518\u56b7\u8ba9\u79b3\u7a70",
        "rao": "\u9976\u6270\u7ed5\u835b\u5a06\u6861",
        "ruo": "\u60f9\u82e5\u5f31",
        "re": "\u70ed\u504c",
        "ren": "\u58ec\u4ec1\u4eba\u5fcd\u97e7\u4efb\u8ba4\u5203\u598a\u7eab\u4ede\u834f\u845a\u996a\u8f6b\u7a14\u887d",
        "reng": "\u6254\u4ecd",
        "ri": "\u65e5",
        "rong": "\u620e\u8338\u84c9\u8363\u878d\u7194\u6eb6\u5bb9\u7ed2\u5197\u5d58\u72e8\u7f1b\u6995\u877e",
        "rou": "\u63c9\u67d4\u8089\u7cc5\u8e42\u97a3",
        "ru": "\u8339\u8815\u5112\u5b7a\u5982\u8fb1\u4e73\u6c5d\u5165\u8925\u84d0\u85b7\u5685\u6d33\u6ebd\u6fe1\u94f7\u8966\u98a5",
        "ruan": "\u8f6f\u962e\u670a",
        "rui": "\u854a\u745e\u9510\u82ae\u8564\u777f\u868b",
        "run": "\u95f0\u6da6",
        "sa": "\u6492\u6d12\u8428\u5345\u4ee8\u6332\u98d2",
        "sai": "\u816e\u9cc3\u585e\u8d5b\u567b",
        "san": "\u4e09\u53c1\u4f1e\u6563\u5f61\u9993\u6c35\u6bf5\u7cc1\u9730",
        "sang": "\u6851\u55d3\u4e27\u6421\u78c9\u98a1",
        "sao": "\u6414\u9a9a\u626b\u5ac2\u57fd\u81ca\u7619\u9ccb",
        "se": "\u745f\u8272\u6da9\u556c\u94e9\u94ef\u7a51",
        "sen": "\u68ee",
        "seng": "\u50e7",
        "sha": "\u838e\u7802\u6740\u5239\u6c99\u7eb1\u50bb\u5565\u715e\u810e\u6b43\u75e7\u88df\u970e\u9ca8",
        "shai": "\u7b5b\u6652\u917e",
        "shan": "\u73ca\u82eb\u6749\u5c71\u5220\u717d\u886b\u95ea\u9655\u64c5\u8d61\u81b3\u5584\u6c55\u6247\u7f2e\u5261\u8baa\u912f\u57cf\u829f\u6f78\u59d7\u9a9f\u81bb\u9490\u759d\u87ee\u8222\u8dda\u9cdd",
        "shang": "\u5892\u4f24\u5546\u8d4f\u664c\u4e0a\u5c1a\u88f3\u57a7\u7ef1\u6b87\u71b5\u89de",
        "shao": "\u68a2\u634e\u7a0d\u70e7\u828d\u52fa\u97f6\u5c11\u54e8\u90b5\u7ecd\u52ad\u82d5\u6f72\u86f8\u7b24\u7b72\u8244",
        "she": "\u5962\u8d4a\u86c7\u820c\u820d\u8d66\u6444\u5c04\u6151\u6d89\u793e\u8bbe\u538d\u4f58\u731e\u7572\u9e9d",
        "shen": "\u7837\u7533\u547b\u4f38\u8eab\u6df1\u5a20\u7ec5\u795e\u6c88\u5ba1\u5a76\u751a\u80be\u614e\u6e17\u8bdc\u8c02\u5432\u54c2\u6e16\u6939\u77e7\u8703",
        "sheng": "\u58f0\u751f\u7525\u7272\u5347\u7ef3\u7701\u76db\u5269\u80dc\u5723\u4e1e\u6e11\u5ab5\u771a\u7b19",
        "shi": "\u5e08\u5931\u72ee\u65bd\u6e7f\u8bd7\u5c38\u8671\u5341\u77f3\u62fe\u65f6\u4ec0\u98df\u8680\u5b9e\u8bc6\u53f2\u77e2\u4f7f\u5c4e\u9a76\u59cb\u5f0f\u793a\u58eb\u4e16\u67ff\u4e8b\u62ed\u8a93\u901d\u52bf\u662f\u55dc\u566c\u9002\u4ed5\u4f8d\u91ca\u9970\u6c0f\u5e02\u6043\u5ba4\u89c6\u8bd5\u8c25\u57d8\u83b3\u84cd\u5f11\u5511\u9963\u8f7c\u8006\u8d33\u70bb\u793b\u94c8\u94ca\u87ab\u8210\u7b6e\u8c55\u9ca5\u9cba",
        "shou": "\u6536\u624b\u9996\u5b88\u5bff\u6388\u552e\u53d7\u7626\u517d\u624c\u72e9\u7ef6\u824f",
        "shu": "\u852c\u67a2\u68b3\u6b8a\u6292\u8f93\u53d4\u8212\u6dd1\u758f\u4e66\u8d4e\u5b70\u719f\u85af\u6691\u66d9\u7f72\u8700\u9ecd\u9f20\u5c5e\u672f\u8ff0\u6811\u675f\u620d\u7ad6\u5885\u5eb6\u6570\u6f31\u6055\u500f\u587e\u83fd\u5fc4\u6cad\u6d91\u6f8d\u59dd\u7ebe\u6bf9\u8167\u6bb3\u956f\u79eb\u9e6c",
        "shua": "\u5237\u800d\u5530\u6dae",
        "shuai": "\u6454\u8870\u7529\u5e05\u87c0",
        "shuan": "\u6813\u62f4\u95e9",
        "shuang": "\u971c\u53cc\u723d\u5b40",
        "shui": "\u8c01\u6c34\u7761\u7a0e",
        "shun": "\u542e\u77ac\u987a\u821c\u6042",
        "shuo": "\u8bf4\u7855\u6714\u70c1\u84b4\u6420\u55cd\u6fef\u5981\u69ca\u94c4",
        "si": "\u65af\u6495\u5636\u601d\u79c1\u53f8\u4e1d\u6b7b\u8086\u5bfa\u55e3\u56db\u4f3a\u4f3c\u9972\u5df3\u53ae\u4fdf\u5155\u83e5\u549d\u6c5c\u6cd7\u6f8c\u59d2\u9a77\u7f0c\u7940\u7960\u9536\u9e36\u801c\u86f3\u7b25",
        "song": "\u677e\u8038\u6002\u9882\u9001\u5b8b\u8bbc\u8bf5\u51c7\u83d8\u5d27\u5d69\u5fea\u609a\u6dde\u7ae6",
        "sou": "\u641c\u8258\u64de\u55fd\u53df\u55d6\u55fe\u998a\u6eb2\u98d5\u778d\u953c\u878b",
        "su": "\u82cf\u9165\u4fd7\u7d20\u901f\u7c9f\u50f3\u5851\u6eaf\u5bbf\u8bc9\u8083\u5919\u8c21\u850c\u55c9\u612b\u7c0c\u89eb\u7a23",
        "suan": "\u9178\u849c\u7b97",
        "sui": "\u867d\u968b\u968f\u7ee5\u9ad3\u788e\u5c81\u7a57\u9042\u96a7\u795f\u84d1\u51ab\u8c07\u6fc9\u9083\u71e7\u772d\u7762",
        "sun": "\u5b59\u635f\u7b0b\u836a\u72f2\u98e7\u69ab\u8de3\u96bc",
        "suo": "\u68ad\u5506\u7f29\u7410\u7d22\u9501\u6240\u5522\u55e6\u5a11\u686b\u7743\u7fa7",
        "ta": "\u584c\u4ed6\u5b83\u5979\u5854\u736d\u631e\u8e4b\u8e0f\u95fc\u6ebb\u9062\u69bb\u6c93",
        "tai": "\u80ce\u82d4\u62ac\u53f0\u6cf0\u915e\u592a\u6001\u6c70\u90b0\u85b9\u80bd\u70b1\u949b\u8dc6\u9c90",
        "tan": "\u574d\u644a\u8d2a\u762b\u6ee9\u575b\u6a80\u75f0\u6f6d\u8c2d\u8c08\u5766\u6bef\u8892\u78b3\u63a2\u53f9\u70ad\u90ef\u8548\u6619\u94bd\u952c\u8983",
        "tang": "\u6c64\u5858\u642a\u5802\u68e0\u819b\u5510\u7cd6\u50a5\u9967\u6e8f\u746d\u94f4\u9557\u8025\u8797\u87b3\u7fb0\u91a3",
        "thang": "\u5018\u8eba\u6dcc",
        "theng": "\u8d9f\u70eb",
        "tao": "\u638f\u6d9b\u6ed4\u7ee6\u8404\u6843\u9003\u6dd8\u9676\u8ba8\u5957\u6311\u9f17\u5555\u97ec\u9955",
        "te": "\u7279",
        "teng": "\u85e4\u817e\u75bc\u8a8a\u6ed5",
        "ti": "\u68af\u5254\u8e22\u9511\u63d0\u9898\u8e44\u557c\u4f53\u66ff\u568f\u60d5\u6d95\u5243\u5c49\u8351\u608c\u9016\u7ee8\u7f07\u9e48\u88fc\u918d",
        "tian": "\u5929\u6dfb\u586b\u7530\u751c\u606c\u8214\u8146\u63ad\u5fdd\u9617\u6b84\u754b\u94bf\u86ba",
        "tiao": "\u6761\u8fe2\u773a\u8df3\u4f7b\u7967\u94eb\u7a95\u9f86\u9ca6",
        "tie": "\u8d34\u94c1\u5e16\u841c\u992e",
        "ting": "\u5385\u542c\u70c3\u6c40\u5ef7\u505c\u4ead\u5ead\u633a\u8247\u839b\u8476\u5a77\u6883\u8713\u9706",
        "tong": "\u901a\u6850\u916e\u77b3\u540c\u94dc\u5f64\u7ae5\u6876\u6345\u7b52\u7edf\u75db\u4f5f\u50ee\u4edd\u833c\u55f5\u6078\u6f7c\u783c",
        "tou": "\u5077\u6295\u5934\u900f\u4ea0",
        "tu": "\u51f8\u79c3\u7a81\u56fe\u5f92\u9014\u6d82\u5c60\u571f\u5410\u5154\u580d\u837c\u83df\u948d\u9174",
        "tuan": "\u6e4d\u56e2\u7583",
        "tui": "\u63a8\u9893\u817f\u8715\u892a\u9000\u5fd2\u717a",
        "tun": "\u541e\u5c6f\u81c0\u9968\u66be\u8c5a\u7a80",
        "tuo": "\u62d6\u6258\u8131\u9e35\u9640\u9a6e\u9a7c\u692d\u59a5\u62d3\u553e\u4e47\u4f57\u5768\u5eb9\u6cb1\u67dd\u7823\u7ba8\u8204\u8dce\u9f0d",
        "wa": "\u6316\u54c7\u86d9\u6d3c\u5a03\u74e6\u889c\u4f64\u5a32\u817d",
        "wai": "\u6b6a\u5916",
        "wan": "\u8c4c\u5f2f\u6e7e\u73a9\u987d\u4e38\u70f7\u5b8c\u7897\u633d\u665a\u7696\u60cb\u5b9b\u5a49\u4e07\u8155\u525c\u8284\u82cb\u83c0\u7ea8\u7efe\u742c\u8118\u7579\u873f\u7ba2",
        "wang": "\u6c6a\u738b\u4ea1\u6789\u7f51\u5f80\u65fa\u671b\u5fd8\u5984\u7f54\u5c22\u60d8\u8f8b\u9b4d",
        "wei": "\u5a01\u5dcd\u5fae\u5371\u97e6\u8fdd\u6845\u56f4\u552f\u60df\u4e3a\u6f4d\u7ef4\u82c7\u840e\u59d4\u4f1f\u4f2a\u5c3e\u7eac\u672a\u851a\u5473\u754f\u80c3\u5582\u9b4f\u4f4d\u6e2d\u8c13\u5c09\u6170\u536b\u502d\u504e\u8bff\u9688\u8473\u8587\u5e0f\u5e37\u5d34\u5d6c\u7325\u732c\u95f1\u6ca9\u6d27\u6da0\u9036\u5a13\u73ae\u97ea\u8ece\u709c\u7168\u71a8\u75ff\u8249\u9c94",
        "wen": "\u761f\u6e29\u868a\u6587\u95fb\u7eb9\u543b\u7a33\u7d0a\u95ee\u520e\u6120\u960c\u6c76\u74ba\u97eb\u6b81\u96ef",
        "weng": "\u55e1\u7fc1\u74ee\u84ca\u8579",
        "wo": "\u631d\u8717\u6da1\u7a9d\u6211\u65a1\u5367\u63e1\u6c83\u83b4\u5e44\u6e25\u674c\u809f\u9f8c",
        "wu": "\u5deb\u545c\u94a8\u4e4c\u6c61\u8bec\u5c4b\u65e0\u829c\u68a7\u543e\u5434\u6bcb\u6b66\u4e94\u6342\u5348\u821e\u4f0d\u4fae\u575e\u620a\u96fe\u6664\u7269\u52ff\u52a1\u609f\u8bef\u5140\u4ef5\u9622\u90ac\u572c\u82b4\u5e91\u6003\u5fe4\u6d6f\u5be4\u8fd5\u59a9\u9a9b\u727e\u7110\u9e49\u9e5c\u8708\u92c8\u9f2f",
        "xi": "\u6614\u7199\u6790\u897f\u7852\u77fd\u6670\u563b\u5438\u9521\u727a\u7a00\u606f\u5e0c\u6089\u819d\u5915\u60dc\u7184\u70ef\u6eaa\u6c50\u7280\u6a84\u88ad\u5e2d\u4e60\u5ab3\u559c\u94e3\u6d17\u7cfb\u9699\u620f\u7ec6\u50d6\u516e\u96b0\u90d7\u831c\u8478\u84f0\u595a\u550f\u5f99\u9969\u960b\u6d60\u6dc5\u5c63\u5b09\u73ba\u6a28\u66e6\u89cb\u6b37\u71b9\u798a\u79a7\u94b8\u7699\u7a78\u8725\u87cb\u823e\u7fb2\u7c9e\u7fd5\u91af\u9f37",
        "xia": "\u778e\u867e\u5323\u971e\u8f96\u6687\u5ce1\u4fa0\u72ed\u4e0b\u53a6\u590f\u5413\u6380\u846d\u55c4\u72ce\u9050\u7455\u7856\u7615\u7f45\u9ee0",
        "xian": "\u9528\u5148\u4ed9\u9c9c\u7ea4\u54b8\u8d24\u8854\u8237\u95f2\u6d8e\u5f26\u5acc\u663e\u9669\u73b0\u732e\u53bf\u817a\u9985\u7fa1\u5baa\u9677\u9650\u7ebf\u51bc\u85d3\u5c98\u7303\u66b9\u5a34\u6c19\u7946\u9e47\u75eb\u86ac\u7b45\u7c7c\u9170\u8df9",
        "xiang": "\u76f8\u53a2\u9576\u9999\u7bb1\u8944\u6e58\u4e61\u7fd4\u7965\u8be6\u60f3\u54cd\u4eab\u9879\u5df7\u6a61\u50cf\u5411\u8c61\u8297\u8459\u9977\u5ea0\u9aa7\u7f03\u87d3\u9c9e\u98e8",
        "xiao": "\u8427\u785d\u9704\u524a\u54ee\u56a3\u9500\u6d88\u5bb5\u6dc6\u6653\u5c0f\u5b5d\u6821\u8096\u5578\u7b11\u6548\u54d3\u54bb\u5d24\u6f47\u900d\u9a81\u7ee1\u67ad\u67b5\u7b71\u7bab\u9b48",
        "xie": "\u6954\u4e9b\u6b47\u874e\u978b\u534f\u631f\u643a\u90aa\u659c\u80c1\u8c10\u5199\u68b0\u5378\u87f9\u61c8\u6cc4\u6cfb\u8c22\u5c51\u5055\u4eb5\u52f0\u71ee\u85a4\u64b7\u5ee8\u7023\u9082\u7ec1\u7f2c\u69ad\u698d\u6b59\u8e9e",
        "xin": "\u85aa\u82af\u950c\u6b23\u8f9b\u65b0\u5ffb\u5fc3\u4fe1\u8845\u56df\u99a8\u8398\u6b46\u94fd\u946b",
        "xing": "\u661f\u8165\u7329\u60fa\u5174\u5211\u578b\u5f62\u90a2\u884c\u9192\u5e78\u674f\u6027\u59d3\u9649\u8347\u8365\u64e4\u60bb\u784e",
        "xiong": "\u5144\u51f6\u80f8\u5308\u6c79\u96c4\u718a\u828e",
        "xiu": "\u4f11\u4fee\u7f9e\u673d\u55c5\u9508\u79c0\u8896\u7ee3\u83a0\u5cab\u9990\u5ea5\u9e3a\u8c85\u9af9",
        "xu": "\u589f\u620c\u9700\u865a\u5618\u987b\u5f90\u8bb8\u84c4\u9157\u53d9\u65ed\u5e8f\u755c\u6064\u7d6e\u5a7f\u7eea\u7eed\u8bb4\u8be9\u5729\u84ff\u6035\u6d2b\u6e86\u987c\u6829\u7166\u7809\u76f1\u80e5\u7cc8\u9191",
        "xuan": "\u8f69\u55a7\u5ba3\u60ac\u65cb\u7384\u9009\u7663\u7729\u7eda\u5107\u8c16\u8431\u63ce\u9994\u6ceb\u6d35\u6e32\u6f29\u7487\u6966\u6684\u70ab\u714a\u78b9\u94c9\u955f\u75c3",
        "xue": "\u9774\u859b\u5b66\u7a74\u96ea\u8840\u5671\u6cf6\u9cd5",
        "xun": "\u52cb\u718f\u5faa\u65ec\u8be2\u5bfb\u9a6f\u5de1\u6b89\u6c5b\u8bad\u8baf\u900a\u8fc5\u5dfd\u57d9\u8340\u85b0\u5ccb\u5f87\u6d54\u66db\u7aa8\u91ba\u9c9f",
        "ya": "\u538b\u62bc\u9e26\u9e2d\u5440\u4e2b\u82bd\u7259\u869c\u5d16\u8859\u6daf\u96c5\u54d1\u4e9a\u8bb6\u4f22\u63e0\u5416\u5c88\u8fd3\u5a05\u740a\u6860\u6c29\u7811\u775a\u75d6",
        "yan": "\u7109\u54bd\u9609\u70df\u6df9\u76d0\u4e25\u7814\u8712\u5ca9\u5ef6\u8a00\u989c\u960e\u708e\u6cbf\u5944\u63a9\u773c\u884d\u6f14\u8273\u5830\u71d5\u538c\u781a\u96c1\u5501\u5f66\u7130\u5bb4\u8c1a\u9a8c\u53a3\u9765\u8d5d\u4fe8\u5043\u5156\u8ba0\u8c33\u90fe\u9122\u82ab\u83f8\u5d26\u6079\u95eb\u960f\u6d07\u6e6e\u6edf\u598d\u5ae3\u7430\u664f\u80ed\u814c\u7131\u7f68\u7b75\u917d\u9b47\u990d\u9f39",
        "yang": "\u6b83\u592e\u9e2f\u79e7\u6768\u626c\u4f6f\u75a1\u7f8a\u6d0b\u9633\u6c27\u4ef0\u75d2\u517b\u6837\u6f3e\u5f89\u600f\u6cf1\u7080\u70ca\u6059\u86d8\u9785",
        "yao": "\u9080\u8170\u5996\u7476\u6447\u5c27\u9065\u7a91\u8c23\u59da\u54ac\u8200\u836f\u8981\u8000\u592d\u723b\u5406\u5d3e\u5fad\u7039\u5e7a\u73e7\u6773\u66dc\u80b4\u9e5e\u7a88\u7e47\u9cd0",
        "ye": "\u6930\u564e\u8036\u7237\u91ce\u51b6\u4e5f\u9875\u6396\u4e1a\u53f6\u66f3\u814b\u591c\u6db2\u8c12\u90ba\u63f6\u9980\u6654\u70e8\u94d8",
        "yi": "\u4e00\u58f9\u533b\u63d6\u94f1\u4f9d\u4f0a\u8863\u9890\u5937\u9057\u79fb\u4eea\u80f0\u7591\u6c82\u5b9c\u59e8\u5f5d\u6905\u8681\u501a\u5df2\u4e59\u77e3\u4ee5\u827a\u6291\u6613\u9091\u5c79\u4ebf\u5f79\u81c6\u9038\u8084\u75ab\u4ea6\u88d4\u610f\u6bc5\u5fc6\u4e49\u76ca\u6ea2\u8be3\u8bae\u8c0a\u8bd1\u5f02\u7ffc\u7fcc\u7ece\u5208\u5293\u4f7e\u8bd2\u572a\u572f\u57f8\u61ff\u82e1\u858f\u5f08\u5955\u6339\u5f0b\u5453\u54a6\u54bf\u566b\u5cc4\u5db7\u7317\u9974\u603f\u6021\u6092\u6f2a\u8fe4\u9a7f\u7f22\u6baa\u8d3b\u65d6\u71a0\u9487\u9552\u9571\u75cd\u7617\u7654\u7fca\u8864\u8734\u8223\u7fbf\u7ff3\u914f\u9edf",
        "yin": "\u8335\u836b\u56e0\u6bb7\u97f3\u9634\u59fb\u541f\u94f6\u6deb\u5bc5\u996e\u5c39\u5f15\u9690\u5370\u80e4\u911e\u5819\u831a\u5591\u72fa\u5924\u6c24\u94df\u763e\u8693\u972a\u9f88",
        "ying": "\u82f1\u6a31\u5a74\u9e70\u5e94\u7f28\u83b9\u8424\u8425\u8367\u8747\u8fce\u8d62\u76c8\u5f71\u9896\u786c\u6620\u5b34\u90e2\u8314\u83ba\u8426\u6484\u5624\u81ba\u6ee2\u6f46\u701b\u745b\u748e\u6979\u9e66\u763f\u988d\u7f42",
        "yo": "\u54df\u5537",
        "yong": "\u62e5\u4f63\u81c3\u75c8\u5eb8\u96cd\u8e0a\u86f9\u548f\u6cf3\u6d8c\u6c38\u607f\u52c7\u7528\u4fd1\u58c5\u5889\u6175\u9095\u955b\u752c\u9cd9\u9954",
        "you": "\u5e7d\u4f18\u60a0\u5fe7\u5c24\u7531\u90ae\u94c0\u72b9\u6cb9\u6e38\u9149\u6709\u53cb\u53f3\u4f51\u91c9\u8bf1\u53c8\u5e7c\u5363\u6538\u4f91\u83b8\u5466\u56ff\u5ba5\u67da\u7337\u7256\u94d5\u75a3\u8763\u9c7f\u9edd\u9f2c",
        "yu": "\u8fc2\u6de4\u4e8e\u76c2\u6986\u865e\u611a\u8206\u4f59\u4fde\u903e\u9c7c\u6109\u6e1d\u6e14\u9685\u4e88\u5a31\u96e8\u4e0e\u5c7f\u79b9\u5b87\u8bed\u7fbd\u7389\u57df\u828b\u90c1\u5401\u9047\u55bb\u5cea\u5fa1\u6108\u6b32\u72f1\u80b2\u8a89\u6d74\u5bd3\u88d5\u9884\u8c6b\u9a6d\u79ba\u6bd3\u4f1b\u4fe3\u8c00\u8c15\u8438\u84e3\u63c4\u5581\u5704\u5709\u5d5b\u72f3\u996b\u5ebe\u9608\u59aa\u59a4\u7ea1\u745c\u6631\u89ce\u8174\u6b24\u65bc\u715c\u71e0\u807f\u94b0\u9e46\u7610\u7600\u7ab3\u8753\u7afd\u8201\u96e9\u9f89",
        "yuan": "\u9e33\u6e0a\u51a4\u5143\u57a3\u8881\u539f\u63f4\u8f95\u56ed\u5458\u5706\u733f\u6e90\u7f18\u8fdc\u82d1\u613f\u6028\u9662\u586c\u6c85\u5a9b\u7457\u6a7c\u7230\u7722\u9e22\u8788\u9f0b",
        "yue": "\u66f0\u7ea6\u8d8a\u8dc3\u94a5\u5cb3\u7ca4\u6708\u60a6\u9605\u9fa0\u6a3e\u5216\u94ba",
        "yun": "\u8018\u4e91\u90e7\u5300\u9668\u5141\u8fd0\u8574\u915d\u6655\u97f5\u5b55\u90d3\u82b8\u72c1\u607d\u7ead\u6b92\u6600\u6c32",
        "za": "\u531d\u7838\u6742\u62f6\u5482",
        "zai": "\u683d\u54c9\u707e\u5bb0\u8f7d\u518d\u5728\u54b1\u5d3d\u753e",
        "zan": "\u6512\u6682\u8d5e\u74d2\u661d\u7c2a\u7ccc\u8db1\u933e",
        "zang": "\u8d43\u810f\u846c\u5958\u6215\u81e7",
        "zao": "\u906d\u7cdf\u51ff\u85fb\u67a3\u65e9\u6fa1\u86a4\u8e81\u566a\u9020\u7682\u7076\u71e5\u5523\u7f2b",
        "ze": "\u8d23\u62e9\u5219\u6cfd\u4ec4\u8d5c\u5567\u8fee\u6603\u7b2e\u7ba6\u8234",
        "zei": "\u8d3c",
        "zen": "\u600e\u8c2e",
        "zeng": "\u589e\u618e\u66fe\u8d60\u7f2f\u7511\u7f7e\u9503",
        "zha": "\u624e\u55b3\u6e23\u672d\u8f67\u94e1\u95f8\u7728\u6805\u69a8\u548b\u4e4d\u70b8\u8bc8\u63f8\u5412\u54a4\u54f3\u600d\u781f\u75c4\u86b1\u9f44",
        "zhai": "\u6458\u658b\u5b85\u7a84\u503a\u5be8\u7826",
        "zhan": "\u77bb\u6be1\u8a79\u7c98\u6cbe\u76cf\u65a9\u8f97\u5d2d\u5c55\u8638\u6808\u5360\u6218\u7ad9\u6e5b\u7efd\u8c35\u640c\u65c3",
        "zhang": "\u6a1f\u7ae0\u5f70\u6f33\u5f20\u638c\u6da8\u6756\u4e08\u5e10\u8d26\u4ed7\u80c0\u7634\u969c\u4ec9\u9123\u5e5b\u5d82\u7350\u5adc\u748b\u87d1",
        "zhao": "\u62db\u662d\u627e\u6cbc\u8d75\u7167\u7f69\u5146\u8087\u53ec\u722a\u8bcf\u68f9\u948a\u7b0a",
        "zhe": "\u906e\u6298\u54f2\u86f0\u8f99\u8005\u9517\u8517\u8fd9\u6d59\u8c2a\u966c\u67d8\u8f84\u78d4\u9e67\u891a\u8707\u8d6d",
        "zhen": "\u73cd\u659f\u771f\u7504\u7827\u81fb\u8d1e\u9488\u4fa6\u6795\u75b9\u8bca\u9707\u632f\u9547\u9635\u7f1c\u6862\u699b\u8f78\u8d48\u80d7\u6715\u796f\u755b\u9e29",
        "zheng": "\u84b8\u6323\u7741\u5f81\u72f0\u4e89\u6014\u6574\u62ef\u6b63\u653f\u5e27\u75c7\u90d1\u8bc1\u8be4\u5ce5\u94b2\u94ee\u7b5d",
        "zhi": "\u829d\u679d\u652f\u5431\u8718\u77e5\u80a2\u8102\u6c41\u4e4b\u7ec7\u804c\u76f4\u690d\u6b96\u6267\u503c\u4f84\u5740\u6307\u6b62\u8dbe\u53ea\u65e8\u7eb8\u5fd7\u631a\u63b7\u81f3\u81f4\u7f6e\u5e1c\u5cd9\u5236\u667a\u79e9\u7a1a\u8d28\u7099\u75d4\u6ede\u6cbb\u7a92\u536e\u965f\u90c5\u57f4\u82b7\u646d\u5e19\u5fee\u5f58\u54ab\u9a98\u6809\u67b3\u6800\u684e\u8f75\u8f7e\u6534\u8d3d\u81a3\u7949\u7957\u9ef9\u96c9\u9e37\u75e3\u86ed\u7d77\u916f\u8dd6\u8e2c\u8e2f\u8c78\u89ef",
        "zhong": "\u4e2d\u76c5\u5fe0\u949f\u8877\u7ec8\u79cd\u80bf\u91cd\u4ef2\u4f17\u51a2\u953a\u87bd\u8202\u822f\u8e35",
        "zhou": "\u821f\u5468\u5dde\u6d32\u8bcc\u7ca5\u8f74\u8098\u5e1a\u5492\u76b1\u5b99\u663c\u9aa4\u5544\u7740\u501c\u8bf9\u836e\u9b3b\u7ea3\u80c4\u78a1\u7c40\u8233\u914e\u9cb7",
        "zhu": "\u73e0\u682a\u86db\u6731\u732a\u8bf8\u8bdb\u9010\u7af9\u70db\u716e\u62c4\u77a9\u5631\u4e3b\u8457\u67f1\u52a9\u86c0\u8d2e\u94f8\u7b51\u4f4f\u6ce8\u795d\u9a7b\u4f2b\u4f8f\u90be\u82ce\u8331\u6d19\u6e1a\u6f74\u9a7a\u677c\u69e0\u6a65\u70b7\u94e2\u75b0\u7603\u86b0\u7afa\u7bb8\u7fe5\u8e85\u9e88",
        "zhua": "\u6293",
        "zhuai": "\u62fd",
        "zhuan": "\u4e13\u7816\u8f6c\u64b0\u8d5a\u7bc6\u629f\u556d\u989b",
        "zhuang": "\u6869\u5e84\u88c5\u5986\u649e\u58ee\u72b6\u4e2c",
        "zhui": "\u690e\u9525\u8ffd\u8d58\u5760\u7f00\u8411\u9a93\u7f12",
        "zhun": "\u8c06\u51c6",
        "zhuo": "\u6349\u62d9\u5353\u684c\u7422\u8301\u914c\u707c\u6d4a\u502c\u8bfc\u5ef4\u855e\u64e2\u555c\u6d5e\u6dbf\u6753\u712f\u799a\u65ab",
        "zi": "\u5179\u54a8\u8d44\u59ff\u6ecb\u6dc4\u5b5c\u7d2b\u4ed4\u7c7d\u6ed3\u5b50\u81ea\u6e0d\u5b57\u8c18\u5d6b\u59ca\u5b73\u7f01\u6893\u8f8e\u8d40\u6063\u7726\u9531\u79ed\u8014\u7b2b\u7ca2\u89dc\u8a3e\u9cbb\u9aed",
        "zong": "\u9b03\u68d5\u8e2a\u5b97\u7efc\u603b\u7eb5\u8159\u7cbd",
        "zou": "\u90b9\u8d70\u594f\u63cd\u9139\u9cb0",
        "zu": "\u79df\u8db3\u5352\u65cf\u7956\u8bc5\u963b\u7ec4\u4fce\u83f9\u5550\u5f82\u9a75\u8e74",
        "zuan": "\u94bb\u7e82\u6525\u7f35",
        "zui": "\u5634\u9189\u6700\u7f6a",
        "zun": "\u5c0a\u9075\u6499\u6a3d\u9cdf",
        "zuo": "\u6628\u5de6\u4f50\u67de\u505a\u4f5c\u5750\u5ea7\u961d\u963c\u80d9\u795a\u9162",
        "cou": "\u85ae\u6971\u8f8f\u8160",
        "nang": "\u652e\u54dd\u56d4\u9995\u66e9",
        "o": "\u5594",
        "dia": "\u55f2",
        "chuai": "\u562c\u81aa\u8e39",
        "cen": "\u5c91\u6d94",
        "diu": "\u94e5",
        "nou": "\u8028",
        "fou": "\u7f36",
        "bia": "\u9adf"
    };

    // 汉字转拼音
    function ConvertPinyin(l1) {
        var l2 = l1.length;
        var I1 = "";
        var reg = new RegExp('[a-zA-Z0-9\- ]');
        for (var i = 0; i < l2; i++) {
            var val = l1.substr(i, 1);
            var name = arraySearch(val, PinYin);
            if (reg.test(val)) {
                I1 += val;
            } else if (name !== false) {
                I1 += name;
            }

        }
        I1 = I1.replace(/ /g, '-');
        while (I1.indexOf('--') > 0) {
            I1 = I1.replace('--', '-');
        }
        return I1;
    }

    // 在对象中搜索
    function arraySearch(l1, l2) {
        for (var name in PinYin) {
            if (PinYin[name].indexOf(l1) != -1) {
                return ucfirst(name);
                break;
            }
        }
        return false;
    }

    // 首字母大写
    function ucfirst(l1) {
        if (l1.length > 0) {
            var first = l1.substr(0, 1);
            var spare = l1.substr(1, l1.length);
            return first + spare;
            // return first;
        }
    }
})(CQSDK);

/************************日期工具*****************************/
(function($){
	/**  
     * 此JS文件是格式化JS中日期时间的工具类，其中包含了传入日期对象Date，格式化成想要的格式，<br>  
     * 或者传入字符串格式的时间个，次字符串日期对应的格式可以转换为相应的日期对象，<br>  
     * 可以计算两个日期之间的差值  
     *   
     * y: 表示年  
     * M：表示一年中的月份 1~12  
     * d: 表示月份中的天数 1~31  
     * H：表示一天中的小时数 00~23  
     * m: 表示小时中的分钟数 00~59  
     * s: 表示分钟中的秒数   00~59  
    */    
          
	window.DateUtils = {    
        //定义一些常用的日期格式的常量     
        DEFAULT_DATE_FORMAT: 'yyyy-MM-dd',    
        DEFAULT_MONTH_FORMAT: 'yyyy-MM',    
        DEFAULT_YEAR_FORMAT: 'yyyy',    
        DEFAULT_TIME_FORMAT: 'HH:mm:ss',    
        DEFAULT_DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',    
        DEFAULT_YEAR: 'YEAR',    
        DEFAULT_MONTH: 'MONTH',    
        DEFAULT_DATE: 'DATE',    
        DEFAULT_HOUR: 'HOUR',    
        DEFAULT_MINUTE: 'MINUTE',    
        DEFAULT_SECOND: 'SECOND',    
        get datetime() {
			return this.formatCurrentDate(this.DEFAULT_DATETIME_FORMAT);
		},
		get curDate(){
			return new Date();
		},
		get date(){
			return this.formatCurrentDate(this.DEFAULT_DATE_FORMAT);
		},
        /**  
         * 根据给定的日期时间格式，格式化当前日期  
         * @params strFormat 格式化字符串， 如："yyyy-MM-dd" 默认格式为：“yyyy-MM-dd HH:mm:ss”  
         * @return 返回根据给定格式的字符串表示的时间日期格式<br>  
         *         如果传入不合法的格式，则返回日期的字符串格式{@see Date#toLocaleString()}  
         */    
         formatCurrentDate: function(strFormat){  
           try{    
              var tempFormat = strFormat == undefined? this.DEFAULT_DATETIME_FORMAT: strFormat;    
              var dates = this.getDateObject(this.curDate);    
              if(/(y+)/.test(tempFormat)){    
                 var fullYear = this.curDate.getFullYear() + '';    
                 var year = RegExp.$1.length == 4? fullYear: fullYear.substr(4 - RegExp.$1.length);    
                 tempFormat = tempFormat.replace(RegExp.$1, year);    
              }    
              for(var i in dates){    
                 if(new RegExp('(' + i + ')').test(tempFormat)){    
                    var target = RegExp.$1.length == 1? dates[i]: ('0' + dates[i]).substr(('' + dates[i]).length - 1);    
                    tempFormat = tempFormat.replace(RegExp.$1, target);    
                 }    
              }    
              return tempFormat === strFormat? this.curDate.toLocaleString(): tempFormat;    
           }catch(e){    
              this.debug('格式化日期出现异常：' + e.message);    
           }    
        },    
            
            
        /**  
         * 根据给定的格式，把给定的时间进行格式化  
         * @params date 要格式化的日期  
         * @params strFormat 要得到的日期的格式的格式化字符串，如：'yyyy-MM-dd'，默认：yyyy-MM-dd HH:mm:ss  
         * @return 根据规定格式的时间格式  
         *    
         * @updateDate 2011-09-15  
         */    
        format: function(date, strFormat){    
         try{    
            if(date == undefined){    
               this.curDate = new Date();    
            }else if(!(date instanceof Date)){    
               this.debug('你输入的date:' + date + '不是日期类型');    
               return date;    
            }else{    
               this.curDate = date;    
            }    
            return this.formatCurrentDate(strFormat);    
         }catch(e){    
            this.debug('格式化日期出现异常：' + e.message);    
         }    
        },    
            
        /**  
         * 根据给定的格式对给定的字符串日期时间进行解析，  
         * @params strDate 要解析的日期的字符串表示,此参数只能是字符串形式的日期，否则返回当期系统日期  
         * @params strFormat 解析给定日期的顺序, 如果输入的strDate的格式为{Date.parse()}方法支持的格式，<br>  
         *         则可以不传入，否则一定要传入与strDate对应的格式, 若不传入格式则返回当期系统日期。  
         * @return 返回解析后的Date类型的时间<br>  
         *        若不能解析则返回当前日期<br>  
         *        若给定为时间格式 则返回的日期为 1970年1月1日的日期  
         *  
         * bug: 此方法目前只能实现类似'yyyy-MM-dd'格式的日期的转换，<br>  
         *       而'yyyyMMdd'形式的日期，则不能实现  
         */    
             
        parseDate: function(strDate, strFormat){    
           if(typeof strDate != 'string'){    
                return new Date();    
           }    
          var longTime = Date.parse(strDate);    
          if(isNaN(longTime)){    
              if(strFormat == undefined){    
                  this.debug('请输入日期的格式');    
                 return new Date();    
              }    
              var tmpDate = new Date();    
              var regFormat = /(\w{4})|(\w{2})|(\w{1})/g;    
              var regDate = /(\d{4})|(\d{2})|(\d{1})/g;    
              var formats = strFormat.match(regFormat);    
              var dates = strDate.match(regDate);    
              if( formats != undefined &&  dates != undefined && formats.length == dates.length){    
                for(var i = 0; i < formats.length; i++){    
                  var format = formats[i];    
                  if(format === 'yyyy'){    
                    tmpDate.setFullYear(parseInt(dates[i], 10));    
                  }else if(format == 'yy'){    
                    var prefix = (tmpDate.getFullYear() + '').substring(0, 2);    
                    var year = (parseInt(dates[i], 10) + '').length == 4? parseInt(dates[i], 10): prefix + (parseInt(dates[i], 10) + '00').substring(0, 2);    
                    var tmpYear = parseInt(year, 10);    
                    tmpDate.setFullYear(tmpYear);    
                  }else if(format == 'MM' || format == 'M'){    
                    tmpDate.setMonth(parseInt(dates[i], 10) - 1);    
                  }else if(format == 'dd' || format == 'd'){    
                    tmpDate.setDate(parseInt(dates[i], 10));    
                  }else if(format == 'HH' || format == 'H'){    
                    tmpDate.setHours(parseInt(dates[i], 10));    
                  }else if(format == 'mm' || format == 'm'){    
                    tmpDate.setMinutes(parseInt(dates[i], 10));    
                  }else if(format == 'ss' || format == 's'){    
                    tmpDate.setSeconds(parseInt(dates[i], 10));    
                  }    
                }    
               return tmpDate;    
             }    
              return tmpDate;    
            }else{    
              return new Date(longTime);    
            }    
        },    
            
            
        /**  
         * 根据给定的时间间隔类型及间隔值，以给定的格式对给定的时间进行计算并格式化返回  
         * @params date 要操作的日期时间可以为时间的字符串或者{@see Date}类似的时间对象，  
         * @params interval 时间间隔类型如："YEAR"、"MONTH"、 "DATE", 不区分大小写  
         * @params amount 时间间隔值，可以正数和负数, 负数为在date的日期减去相应的数值，正数为在date的日期上加上相应的数值  
         * @params strFormat 当输入端的date的格式为字符串是，此项必须输入。若date参数为{@see Date}类型是此项会作为最终输出的格式。  
         * @params targetFormat 最终输出的日期时间的格式，若没有输入则使用strFormat或者默认格式'yyyy-MM-dd HH:mm:ss'  
         * @return 返回计算并格式化后的时间的字符串  
         */    
        changeDate: function(date, interval, amount, strFormat, targetFormat){    
            var tmpdate = new Date();    
            if(date == undefined){    
               this.debug('输入的时间不能为空!');    
               return new Date();    
            }else if(typeof date == 'string'){    
                tmpdate = this.parseDate(date, strFormat);    
            }else if(date instanceof Date){    
              tmpdate = date;    
            }    
            var field  =  (typeof interval == 'string')? interval.toUpperCase(): 'DATE';    
                
            try{    
              amount = parseInt(amount + '', 10);    
              if(isNaN(amount)){    
                 amount = 0;    
              }    
            }catch(e){    
               this.debug('你输入的[amount=' + amount + ']不能转换为整数');    
               amount = 0;    
            }    
            switch(field){    
               case this.DEFAULT_YEAR:    
                 tmpdate.setFullYear(tmpdate.getFullYear() + amount);    
                 break;    
               case this.DEFAULT_MONTH:    
                 tmpdate.setMonth(tmpdate.getMonth() + amount);    
                 break;    
               case this.DEFAULT_DATE:    
                 tmpdate.setDate(tmpdate.getDate() + amount);    
                 break;    
               case this.DEFAULT_HOUR:    
                 tmpdate.setHours(tmpdate.getHours() + amount);    
                 break;    
               case this.DEFAULT_MINUTE:    
                 tmpdate.setMinutes(tmpdate.getMinutes() + amount);    
                 break;    
               case this.DEFAULT_SECOND:    
                  tmpdate.setSeconds(tmpdate.getSeconds() + amount);    
                 break;    
               default:    
                  this.debug('你输入的[interval:' + field + '] 不符合条件!');            
            }    
                
            this.curDate = tmpdate;    
            return this.formatCurrentDate(targetFormat == undefined? strFormat: targetFormat);    
        },    
            
        /**  
         * 比较两个日期的差距  
         * @param date1 Date类型的时间  
         * @param date2 Dete 类型的时间  
         * @param isFormat boolean 是否对得出的时间进行格式化,<br>   
         *       false:返回毫秒数，true：返回格式化后的数据  
         * @return 返回两个日期之间的毫秒数 或者是格式化后的结果  
         */    
        compareTo: function(date1, date2, isFormat){    
          try{    
                var len = arguments.length;    
                var tmpdate1 = new Date();    
                var tmpdate2 = new Date();    
                if(len == 1){    
                   tmpdate1 = date1;    
                }else if(len >= 2){    
                  tmpdate1 = date1;    
                  tmpdate2 = date2;    
                }    
            if(!(tmpdate1 instanceof Date) || !(tmpdate2 instanceof Date)){    
               return 0;    
            }else{    
                var time1 = tmpdate1.getTime();     
                var time2 = tmpdate2.getTime();    
                var time = Math.max(time1, time2) - Math.min(time1, time2);    
                if(!isNaN(time) && time > 0){    
                   if(isFormat){    
                      var date = new Date(time);    
                      var result = {};    
                      result['year']   = (date.getFullYear() - 1970) > 0? (date.getFullYear() - 1970): '0';    
                      result['month']  = (date.getMonth() - 1) > 0? (date.getMonth() - 1): '0';    
                      result['day']    = (date.getDate() - 1) > 0? (date.getDate() - 1): '0';    
                      result['hour']   = (date.getHours() - 8) > 0? (date.getHours() - 1): '0';    
                      result['minute'] = date.getMinutes() > 0? date.getMinutes(): '0';    
                      result['second'] = date.getSeconds() > 0? date.getSeconds(): '0';    
                      return result;    
                    }else {    
                     return time;    
                    }    
                }else{    
                  return 0;    
                }    
            }    
          }catch(e){    
            this.debug('比较时间出现异常' + e.message);    
          }    
        },    
            
        /**  
         * 根据给定的日期得到日期的月，日，时，分和秒的对象  
         * @params date 给定的日期 date为非Date类型， 则获取当前日期  
         * @return 有给定日期的月、日、时、分和秒组成的对象  
         */    
        getDateObject: function(date){    
	         if(!(date instanceof Date)){    
	           date = new Date();    
	         }    
	        return {    
	            'M+' : date.getMonth() + 1,     
	            'd+' : date.getDate(),       
	            'H+' : date.getHours(),       
	            'm+' : date.getMinutes(),     
	            's+' : date.getSeconds()    
	         };    
        },    
            
        /**  
         *在控制台输出日志  
         *@params message 要输出的日志信息  
         */    
        debug: function(message){    
           try{    
               if(!this.isDebug){    
                 return;    
               }    
               if(!window.console){    
                   window.console = {};    
                   window.console.log = function(){    
                      return;    
                   }    
               }    
               window.console.log(message + ' ');    
           }catch(e){    
           }    
        }    
    }    
})(jQuery);

/************************MainPage*****************************/
(function($,CQ){
	CQ.register = function(sid,options){
		var data = options.data?options.data:[],url=options.url;

		if(url){//ajax加载
			console.log(url)
		}else{//把数据放在window缓存池中
			$.each(data,function(index,item){
				item = $.extend({},item,{id:item[options.key],value:item[options.value]});
				data[index] = item
			});
			var all = $.data(window,'sid')?$.data(window,'sid'):{};
			all = $.extend({},all,{[sid]:data});
			$.data(window,'sid',all);
		}
	}

	CQ.TWebPage = function (options){
		
		$.parser.onComplete = function(context){
			//CQ.Mask.show('正在加载，请稍后...');
			if(!context){
				window.MainPage = new MainPage(options);
				//CQ.Mask.hide();
			}
		}
	}
	function MainPage(options){
		if($.type(options.actions) == 'object'){
			actions(options.actions);
		}
		$.extend(options,this);
		if($.type(options.create) === 'function'){
			options.urlData = urlData();
			options.create();
			//如果不存在初始化一个空的SID
			if(!$.data(window,'sid')) $.data(window,'sid',{});
		}
		return options;
	}
	function actions(actions) {
		var $buttons = $('.cq-action');
		if($buttons.length > 0){
			for(var i=0;i<$buttons.length; i++){
				bindActions($($buttons[i]),actions);
			}
		}
	}
	//绑定单击事件
	function bindActions($dom,actions){
		var label = $dom.attr('action');
		if($.type(actions[label]) === 'object'){
			if(actions[label].label) {
				$dom.find('c,.menu-text').text(actions[label].label);
				//可能有右键菜单
				$dom.find('span').text(actions[label].label);
			}

			if($.type(actions[label].handler) === 'function'){
				//如果是右键按钮 已经绑定了
				if(!$dom.hasClass('context-menu-item'))
				$dom.on('click.actions',actions[label].handler);
			}
			if(actions[label].icon){
				$dom.find('a').addClass('cq-btn-a ' + actions[label].icon);
			}
		}
	}
	//封装页面地址信息 参数
	function urlData(){
		var urlData = {
			href:location.href, //完整地址
			hostname:location.hostname,
			pathname:location.pathname,
			params:{}
		};
		var name,value;
	   	var str=location.href; //取得整个地址栏
	   	var num=str.indexOf("?")
	   	str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
	   	var arr=str.split("&"); //各个参数放到数组里
	   	for(var i=0;i < arr.length;i++){
	        num=arr[i].indexOf("=");
	        if(num>0){
	             name=arr[i].substring(0,num);
	             value=arr[i].substr(num+1);
	             this[name]=value;
	             urlData.params[name] = value;
	        }
	   	}
	   	return urlData;
	}

})(jQuery,CQSDK);

/************************MainPage*****************************/
























/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2015
 * @version 1.3.3
 *
 * Date formatter utility library that allows formatting date/time variables or Date objects using PHP DateTime format.
 * @see http://php.net/manual/en/function.date.php
 *
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
var DateFormatter;
(function () {
    "use strict";

    var _compare, _lpad, _extend, defaultSettings, DAY, HOUR;
    DAY = 1000 * 60 * 60 * 24;
    HOUR = 3600;

    _compare = function (str1, str2) {
        return typeof(str1) === 'string' && typeof(str2) === 'string' && str1.toLowerCase() === str2.toLowerCase();
    };
    _lpad = function (value, length, char) {
        var chr = char || '0', val = value.toString();
        return val.length < length ? _lpad(chr + val, length) : val;
    };
    _extend = function (out) {
        var i, obj;
        out = out || {};
        for (i = 1; i < arguments.length; i++) {
            obj = arguments[i];
            if (!obj) {
                continue;
            }
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        _extend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }
        return out;
    };
    defaultSettings = {
        dateSettings: {
            ordinal: function (number) {
                var n = number % 10, suffixes = {1: 'st', 2: 'nd', 3: 'rd'};
                return Math.floor(number % 100 / 10) === 1 || !suffixes[n] ? 'th' : suffixes[n];
            }
        },
        separators: /[ \-+\/\.T:@]/g,
        validParts: /[dDjlNSwzWFmMntLoYyaABgGhHisueTIOPZcrU]/g,
        intParts: /[djwNzmnyYhHgGis]/g,
        tzParts: /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        tzClip: /[^-+\dA-Z]/g
    };

    DateFormatter = function (options) {
        var self = this, config = _extend(defaultSettings, options);
        self.dateSettings = config.dateSettings;
        self.separators = config.separators;
        self.validParts = config.validParts;
        self.intParts = config.intParts;
        self.tzParts = config.tzParts;
        self.tzClip = config.tzClip;
    };

    DateFormatter.prototype = {
        constructor: DateFormatter,
        parseDate: function (vDate, vFormat) {
            var self = this, vFormatParts, vDateParts, i, vDateFlag = false, vTimeFlag = false, vDatePart, iDatePart,
                vSettings = self.dateSettings, vMonth, vMeriIndex, vMeriOffset, len, mer,
                out = {date: null, year: null, month: null, day: null, hour: 0, min: 0, sec: 0};
            if (!vDate) {
                return undefined;
            }
            if (vDate instanceof Date) {
                return vDate;
            }
            if (typeof vDate === 'number') {
                return new Date(vDate);
            }
            if (vFormat === 'U') {
                i = parseInt(vDate);
                return i ? new Date(i * 1000) : vDate;
            }
            if (typeof vDate !== 'string') {
                return '';
            }
            vFormatParts = vFormat.match(self.validParts);
            if (!vFormatParts || vFormatParts.length === 0) {
                throw new Error("Invalid date format definition.");
            }
            vDateParts = vDate.replace(self.separators, '\0').split('\0');
            for (i = 0; i < vDateParts.length; i++) {
                vDatePart = vDateParts[i];
                iDatePart = parseInt(vDatePart);
                switch (vFormatParts[i]) {
                    case 'y':
                    case 'Y':
                        len = vDatePart.length;
                        if (len === 2) {
                            out.year = parseInt((iDatePart < 70 ? '20' : '19') + vDatePart);
                        } else if (len === 4) {
                            out.year = iDatePart;
                        }
                        vDateFlag = true;
                        break;
                    case 'm':
                    case 'n':
                    case 'M':
                    case 'F':
                        if (isNaN(vDatePart)) {
                            vMonth = vSettings.monthsShort.indexOf(vDatePart);
                            if (vMonth > -1) {
                                out.month = vMonth + 1;
                            }
                            vMonth = vSettings.months.indexOf(vDatePart);
                            if (vMonth > -1) {
                                out.month = vMonth + 1;
                            }
                        } else {
                            if (iDatePart >= 1 && iDatePart <= 12) {
                                out.month = iDatePart;
                            }
                        }
                        vDateFlag = true;
                        break;
                    case 'd':
                    case 'j':
                        if (iDatePart >= 1 && iDatePart <= 31) {
                            out.day = iDatePart;
                        }
                        vDateFlag = true;
                        break;
                    case 'g':
                    case 'h':
                        vMeriIndex = (vFormatParts.indexOf('a') > -1) ? vFormatParts.indexOf('a') :
                            (vFormatParts.indexOf('A') > -1) ? vFormatParts.indexOf('A') : -1;
                        mer = vDateParts[vMeriIndex];
                        if (vMeriIndex > -1) {
                            vMeriOffset = _compare(mer, vSettings.meridiem[0]) ? 0 :
                                (_compare(mer, vSettings.meridiem[1]) ? 12 : -1);
                            if (iDatePart >= 1 && iDatePart <= 12 && vMeriOffset > -1) {
                                out.hour = iDatePart + vMeriOffset - 1;
                            } else if (iDatePart >= 0 && iDatePart <= 23) {
                                out.hour = iDatePart;
                            }
                        } else if (iDatePart >= 0 && iDatePart <= 23) {
                            out.hour = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                    case 'G':
                    case 'H':
                        if (iDatePart >= 0 && iDatePart <= 23) {
                            out.hour = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                    case 'i':
                        if (iDatePart >= 0 && iDatePart <= 59) {
                            out.min = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                    case 's':
                        if (iDatePart >= 0 && iDatePart <= 59) {
                            out.sec = iDatePart;
                        }
                        vTimeFlag = true;
                        break;
                }
            }
            if (vDateFlag === true && out.year && out.month && out.day) {
                out.date = new Date(out.year, out.month - 1, out.day, out.hour, out.min, out.sec, 0);
            } else {
                if (vTimeFlag !== true) {
                    return false;
                }
                out.date = new Date(0, 0, 0, out.hour, out.min, out.sec, 0);
            }
            return out.date;
        },
        guessDate: function (vDateStr, vFormat) {
            if (typeof vDateStr !== 'string') {
                return vDateStr;
            }
            var self = this, vParts = vDateStr.replace(self.separators, '\0').split('\0'), vPattern = /^[djmn]/g,
                vFormatParts = vFormat.match(self.validParts), vDate = new Date(), vDigit = 0, vYear, i, iPart, iSec;

            if (!vPattern.test(vFormatParts[0])) {
                return vDateStr;
            }

            for (i = 0; i < vParts.length; i++) {
                vDigit = 2;
                iPart = vParts[i];
                iSec = parseInt(iPart.substr(0, 2));
                switch (i) {
                    case 0:
                        if (vFormatParts[0] === 'm' || vFormatParts[0] === 'n') {
                            vDate.setMonth(iSec - 1);
                        } else {
                            vDate.setDate(iSec);
                        }
                        break;
                    case 1:
                        if (vFormatParts[0] === 'm' || vFormatParts[0] === 'n') {
                            vDate.setDate(iSec);
                        } else {
                            vDate.setMonth(iSec - 1);
                        }
                        break;
                    case 2:
                        vYear = vDate.getFullYear();
                        if (iPart.length < 4) {
                            vDate.setFullYear(parseInt(vYear.toString().substr(0, 4 - iPart.length) + iPart));
                            vDigit = iPart.length;
                        } else {
                            vDate.setFullYear = parseInt(iPart.substr(0, 4));
                            vDigit = 4;
                        }
                        break;
                    case 3:
                        vDate.setHours(iSec);
                        break;
                    case 4:
                        vDate.setMinutes(iSec);
                        break;
                    case 5:
                        vDate.setSeconds(iSec);
                        break;
                }
                if (iPart.substr(vDigit).length > 0) {
                    vParts.splice(i + 1, 0, iPart.substr(vDigit));
                }
            }
            return vDate;
        },
        parseFormat: function (vChar, vDate) {
            var self = this, vSettings = self.dateSettings, fmt, backspace = /\\?(.?)/gi, doFormat = function (t, s) {
                return fmt[t] ? fmt[t]() : s;
            };
            fmt = {
                /////////
                // DAY //
                /////////
                /**
                 * Day of month with leading 0: `01..31`
                 * @return {string}
                 */
                d: function () {
                    return _lpad(fmt.j(), 2);
                },
                /**
                 * Shorthand day name: `Mon...Sun`
                 * @return {string}
                 */
                D: function () {
                    return vSettings.daysShort[fmt.w()];
                },
                /**
                 * Day of month: `1..31`
                 * @return {number}
                 */
                j: function () {
                    return vDate.getDate();
                },
                /**
                 * Full day name: `Monday...Sunday`
                 * @return {number}
                 */
                l: function () {
                    return vSettings.days[fmt.w()];
                },
                /**
                 * ISO-8601 day of week: `1[Mon]..7[Sun]`
                 * @return {number}
                 */
                N: function () {
                    return fmt.w() || 7;
                },
                /**
                 * Day of week: `0[Sun]..6[Sat]`
                 * @return {number}
                 */
                w: function () {
                    return vDate.getDay();
                },
                /**
                 * Day of year: `0..365`
                 * @return {number}
                 */
                z: function () {
                    var a = new Date(fmt.Y(), fmt.n() - 1, fmt.j()), b = new Date(fmt.Y(), 0, 1);
                    return Math.round((a - b) / DAY);
                },

                //////////
                // WEEK //
                //////////
                /**
                 * ISO-8601 week number
                 * @return {number}
                 */
                W: function () {
                    var a = new Date(fmt.Y(), fmt.n() - 1, fmt.j() - fmt.N() + 3), b = new Date(a.getFullYear(), 0, 4);
                    return _lpad(1 + Math.round((a - b) / DAY / 7), 2);
                },

                ///////////
                // MONTH //
                ///////////
                /**
                 * Full month name: `January...December`
                 * @return {string}
                 */
                F: function () {
                    return vSettings.months[vDate.getMonth()];
                },
                /**
                 * Month w/leading 0: `01..12`
                 * @return {string}
                 */
                m: function () {
                    return _lpad(fmt.n(), 2);
                },
                /**
                 * Shorthand month name; `Jan...Dec`
                 * @return {string}
                 */
                M: function () {
                    return vSettings.monthsShort[vDate.getMonth()];
                },
                /**
                 * Month: `1...12`
                 * @return {number}
                 */
                n: function () {
                    return vDate.getMonth() + 1;
                },
                /**
                 * Days in month: `28...31`
                 * @return {number}
                 */
                t: function () {
                    return (new Date(fmt.Y(), fmt.n(), 0)).getDate();
                },

                //////////
                // YEAR //
                //////////
                /**
                 * Is leap year? `0 or 1`
                 * @return {number}
                 */
                L: function () {
                    var Y = fmt.Y();
                    return (Y % 4 === 0 && Y % 100 !== 0 || Y % 400 === 0) ? 1 : 0;
                },
                /**
                 * ISO-8601 year
                 * @return {number}
                 */
                o: function () {
                    var n = fmt.n(), W = fmt.W(), Y = fmt.Y();
                    return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
                },
                /**
                 * Full year: `e.g. 1980...2010`
                 * @return {number}
                 */
                Y: function () {
                    return vDate.getFullYear();
                },
                /**
                 * Last two digits of year: `00...99`
                 * @return {string}
                 */
                y: function () {
                    return fmt.Y().toString().slice(-2);
                },

                //////////
                // TIME //
                //////////
                /**
                 * Meridian lower: `am or pm`
                 * @return {string}
                 */
                a: function () {
                    return fmt.A().toLowerCase();
                },
                /**
                 * Meridian upper: `AM or PM`
                 * @return {string}
                 */
                A: function () {
                    var n = fmt.G() < 12 ? 0 : 1;
                    return vSettings.meridiem[n];
                },
                /**
                 * Swatch Internet time: `000..999`
                 * @return {string}
                 */
                B: function () {
                    var H = vDate.getUTCHours() * HOUR, i = vDate.getUTCMinutes() * 60, s = vDate.getUTCSeconds();
                    return _lpad(Math.floor((H + i + s + HOUR) / 86.4) % 1000, 3);
                },
                /**
                 * 12-Hours: `1..12`
                 * @return {number}
                 */
                g: function () {
                    return fmt.G() % 12 || 12;
                },
                /**
                 * 24-Hours: `0..23`
                 * @return {number}
                 */
                G: function () {
                    return vDate.getHours();
                },
                /**
                 * 12-Hours with leading 0: `01..12`
                 * @return {string}
                 */
                h: function () {
                    return _lpad(fmt.g(), 2);
                },
                /**
                 * 24-Hours w/leading 0: `00..23`
                 * @return {string}
                 */
                H: function () {
                    return _lpad(fmt.G(), 2);
                },
                /**
                 * Minutes w/leading 0: `00..59`
                 * @return {string}
                 */
                i: function () {
                    return _lpad(vDate.getMinutes(), 2);
                },
                /**
                 * Seconds w/leading 0: `00..59`
                 * @return {string}
                 */
                s: function () {
                    return _lpad(vDate.getSeconds(), 2);
                },
                /**
                 * Microseconds: `000000-999000`
                 * @return {string}
                 */
                u: function () {
                    return _lpad(vDate.getMilliseconds() * 1000, 6);
                },

                //////////////
                // TIMEZONE //
                //////////////
                /**
                 * Timezone identifier: `e.g. Atlantic/Azores, ...`
                 * @return {string}
                 */
                e: function () {
                    var str = /\((.*)\)/.exec(String(vDate))[1];
                    return str || 'Coordinated Universal Time';
                },
                /**
                 * Timezone abbreviation: `e.g. EST, MDT, ...`
                 * @return {string}
                 */
                T: function () {
                    var str = (String(vDate).match(self.tzParts) || [""]).pop().replace(self.tzClip, "");
                    return str || 'UTC';
                },
                /**
                 * DST observed? `0 or 1`
                 * @return {number}
                 */
                I: function () {
                    var a = new Date(fmt.Y(), 0), c = Date.UTC(fmt.Y(), 0),
                        b = new Date(fmt.Y(), 6), d = Date.UTC(fmt.Y(), 6);
                    return ((a - c) !== (b - d)) ? 1 : 0;
                },
                /**
                 * Difference to GMT in hour format: `e.g. +0200`
                 * @return {string}
                 */
                O: function () {
                    var tzo = vDate.getTimezoneOffset(), a = Math.abs(tzo);
                    return (tzo > 0 ? '-' : '+') + _lpad(Math.floor(a / 60) * 100 + a % 60, 4);
                },
                /**
                 * Difference to GMT with colon: `e.g. +02:00`
                 * @return {string}
                 */
                P: function () {
                    var O = fmt.O();
                    return (O.substr(0, 3) + ':' + O.substr(3, 2));
                },
                /**
                 * Timezone offset in seconds: `-43200...50400`
                 * @return {number}
                 */
                Z: function () {
                    return -vDate.getTimezoneOffset() * 60;
                },

                ////////////////////
                // FULL DATE TIME //
                ////////////////////
                /**
                 * ISO-8601 date
                 * @return {string}
                 */
                c: function () {
                    return 'Y-m-d\\TH:i:sP'.replace(backspace, doFormat);
                },
                /**
                 * RFC 2822 date
                 * @return {string}
                 */
                r: function () {
                    return 'D, d M Y H:i:s O'.replace(backspace, doFormat);
                },
                /**
                 * Seconds since UNIX epoch
                 * @return {number}
                 */
                U: function () {
                    return vDate.getTime() / 1000 || 0;
                }
            };
            return doFormat(vChar, vChar);
        },
        formatDate: function (vDate, vFormat) {
            var self = this, i, n, len, str, vChar, vDateStr = '';
            if (typeof vDate === 'string') {
                vDate = self.parseDate(vDate, vFormat);
                if (vDate === false) {
                    return false;
                }
            }
            if (vDate instanceof Date) {
                len = vFormat.length;
                for (i = 0; i < len; i++) {
                    vChar = vFormat.charAt(i);
                    if (vChar === 'S') {
                        continue;
                    }
                    str = self.parseFormat(vChar, vDate);
                    if (i !== (len - 1) && self.intParts.test(vChar) && vFormat.charAt(i + 1) === 'S') {
                        n = parseInt(str);
                        str += self.dateSettings.ordinal(n);
                    }
                    vDateStr += str;
                }
                return vDateStr;
            }
            return '';
        }
    };
})();/**
 * @preserve jQuery DateTimePicker plugin v2.5.3
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * @author Chupurnov Valeriy (<chupurnov@gmail.com>)
 */
/*global DateFormatter, document,window,jQuery,setTimeout,clearTimeout,HighlightedDate,getCurrentValue*/
;(function (factory) {
	if ( typeof define === 'function' && define.amd ) {
		// AMD. Register as an anonymous module.
		define(['jquery', 'jquery-mousewheel'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS style for Browserify
		module.exports = factory;
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	'use strict';
	var default_options  = {
		i18n: {
			en: { // English
				months: [
					"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
				],
				dayOfWeekShort: [
					"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
				],
				dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
			},
			ch: { // Simplified Chinese
				months: [
					"一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
				],
				dayOfWeekShort: [
					"日", "一", "二", "三", "四", "五", "六"
				],
                dayOfWeek: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
			}
		},
		value: '',
		rtl: false,

		format:	'Y/m/d H:i',
		formatTime:	'H:i',
		formatDate:	'Y/m/d',

		startDate:	false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
		step: 60,
		monthChangeSpinner: true,

		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		closeOnWithoutClick: true,
		closeOnInputClick: true,

		timepicker: true,
		datepicker: true,
		weeks: false,

		defaultTime: false,	// use formatTime format (ex. '10:00' for formatTime:	'H:i')
		defaultDate: false,	// use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')

		minDate: false,
		maxDate: false,
		minTime: false,
		maxTime: false,
		disabledMinTime: false,
		disabledMaxTime: false,

		allowTimes: [],
		opened: false,
		initTime: true,
		inline: false,
		theme: '',

		onSelectDate: function () {},
		onSelectTime: function () {},
		onChangeMonth: function () {},
		onGetWeekOfYear: function () {},
		onChangeYear: function () {},
		onChangeDateTime: function () {},
		onShow: function () {},
		onClose: function () {},
		onGenerate: function () {},

		withoutCopyright: true,
		inverseButton: false,
		hours12: false,
		next: 'xdsoft_next',
		prev : 'xdsoft_prev',
		dayOfWeekStart: 0,
		parentID: 'body',
		timeHeightInTimePicker: 25,
		timepickerScrollbar: true,
		todayButton: true,
		prevButton: true,
		nextButton: true,
		defaultSelect: true,

		scrollMonth: true,
		scrollTime: true,
		scrollInput: true,

		lazyInit: false,
		mask: false,
		validateOnBlur: true,
		allowBlank: true,
		yearStart: 1950,
		yearEnd: 2050,
		monthStart: 0,
		monthEnd: 11,
		style: '',
		id: '',
		fixed: false,
		roundTime: 'round', // ceil, floor
		className: '',
		weekends: [],
		highlightedDates: [],
		highlightedPeriods: [],
		allowDates : [],
		allowDateRe : null,
		disabledDates : [],
		disabledWeekDays: [],
		yearOffset: 0,
		beforeShowDay: null,

		enterLikeTab: true,
		showApplyButton: false
	};

	var dateHelper = null,
		globalLocaleDefault = 'ch',
		globalLocale = 'ch';

	var dateFormatterOptionsDefault = {
		meridiem: ['AM', 'PM']
	};

	var initDateFormatter = function(){
		var locale = default_options.i18n[globalLocale],
			opts = {
				days: locale.dayOfWeek,
				daysShort: locale.dayOfWeekShort,
				months: locale.months,
				monthsShort: $.map(locale.months, function(n){ return n.substring(0, 3) }),
			};

	 	dateHelper = new DateFormatter({
			dateSettings: $.extend({}, dateFormatterOptionsDefault, opts)
		});
	};

	// for locale settings
	$.datetimepicker = {
		setLocale: function(locale){
			var newLocale = default_options.i18n[locale]?locale:globalLocaleDefault;
			if(globalLocale != newLocale){
				globalLocale = newLocale;
				// reinit date formatter
				initDateFormatter();
			}
		},
		setDateFormatter: function(dateFormatter) {
			dateHelper = dateFormatter;
		},
		RFC_2822: 'D, d M Y H:i:s O',
		ATOM: 'Y-m-d\TH:i:sP',
		ISO_8601: 'Y-m-d\TH:i:sO',
		RFC_822: 'D, d M y H:i:s O',
		RFC_850: 'l, d-M-y H:i:s T',
		RFC_1036: 'D, d M y H:i:s O',
		RFC_1123: 'D, d M Y H:i:s O',
		RSS: 'D, d M Y H:i:s O',
		W3C: 'Y-m-d\TH:i:sP'
	};

	// first init date formatter
	initDateFormatter();

	// fix for ie8
	if (!window.getComputedStyle) {
		window.getComputedStyle = function (el, pseudo) {
			this.el = el;
			this.getPropertyValue = function (prop) {
				var re = /(\-([a-z]){1})/g;
				if (prop === 'float') {
					prop = 'styleFloat';
				}
				if (re.test(prop)) {
					prop = prop.replace(re, function (a, b, c) {
						return c.toUpperCase();
					});
				}
				return el.currentStyle[prop] || null;
			};
			return this;
		};
	}
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (obj, start) {
			var i, j;
			for (i = (start || 0), j = this.length; i < j; i += 1) {
				if (this[i] === obj) { return i; }
			}
			return -1;
		};
	}
	Date.prototype.countDaysInMonth = function () {
		return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
	};
	$.fn.xdsoftScroller = function (percent) {
		return this.each(function () {
			var timeboxparent = $(this),
				pointerEventToXY = function (e) {
					var out = {x: 0, y: 0},
						touch;
					if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
						touch  = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						out.x = touch.clientX;
						out.y = touch.clientY;
					} else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
						out.x = e.clientX;
						out.y = e.clientY;
					}
					return out;
				},
				timebox,
				parentHeight,
				height,
				scrollbar,
				scroller,
				maximumOffset = 100,
				start = false,
				startY = 0,
				startTop = 0,
				h1 = 0,
				touchStart = false,
				startTopScroll = 0,
				calcOffset = function () {};
			if (percent === 'hide') {
				timeboxparent.find('.xdsoft_scrollbar').hide();
				return;
			}
			if (!$(this).hasClass('xdsoft_scroller_box')) {
				timebox = timeboxparent.children().eq(0);
				parentHeight = timeboxparent[0].clientHeight;
				height = timebox[0].offsetHeight;
				scrollbar = $('<div class="xdsoft_scrollbar"></div>');
				scroller = $('<div class="xdsoft_scroller"></div>');
				scrollbar.append(scroller);

				timeboxparent.addClass('xdsoft_scroller_box').append(scrollbar);
				calcOffset = function calcOffset(event) {
					var offset = pointerEventToXY(event).y - startY + startTopScroll;
					if (offset < 0) {
						offset = 0;
					}
					if (offset + scroller[0].offsetHeight > h1) {
						offset = h1 - scroller[0].offsetHeight;
					}
					timeboxparent.trigger('scroll_element.xdsoft_scroller', [maximumOffset ? offset / maximumOffset : 0]);
				};

				scroller
					.on('touchstart.xdsoft_scroller mousedown.xdsoft_scroller', function (event) {
						if (!parentHeight) {
							timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
						}

						startY = pointerEventToXY(event).y;
						startTopScroll = parseInt(scroller.css('margin-top'), 10);
						h1 = scrollbar[0].offsetHeight;

						if (event.type === 'mousedown' || event.type === 'touchstart') {
							if (document) {
								$(document.body).addClass('xdsoft_noselect');
							}
							$([document.body, window]).on('touchend mouseup.xdsoft_scroller', function arguments_callee() {
								$([document.body, window]).off('touchend mouseup.xdsoft_scroller', arguments_callee)
									.off('mousemove.xdsoft_scroller', calcOffset)
									.removeClass('xdsoft_noselect');
							});
							$(document.body).on('mousemove.xdsoft_scroller', calcOffset);
						} else {
							touchStart = true;
							event.stopPropagation();
							event.preventDefault();
						}
					})
					.on('touchmove', function (event) {
						if (touchStart) {
							event.preventDefault();
							calcOffset(event);
						}
					})
					.on('touchend touchcancel', function () {
						touchStart =  false;
						startTopScroll = 0;
					});

				timeboxparent
					.on('scroll_element.xdsoft_scroller', function (event, percentage) {
						if (!parentHeight) {
							timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percentage, true]);
						}
						percentage = percentage > 1 ? 1 : (percentage < 0 || isNaN(percentage)) ? 0 : percentage;

						scroller.css('margin-top', maximumOffset * percentage);

						setTimeout(function () {
							timebox.css('marginTop', -parseInt((timebox[0].offsetHeight - parentHeight) * percentage, 10));
						}, 10);
					})
					.on('resize_scroll.xdsoft_scroller', function (event, percentage, noTriggerScroll) {
						var percent, sh;
						parentHeight = timeboxparent[0].clientHeight;
						height = timebox[0].offsetHeight;
						percent = parentHeight / height;
						sh = percent * scrollbar[0].offsetHeight;
						if (percent > 1) {
							scroller.hide();
						} else {
							scroller.show();
							scroller.css('height', parseInt(sh > 10 ? sh : 10, 10));
							maximumOffset = scrollbar[0].offsetHeight - scroller[0].offsetHeight;
							if (noTriggerScroll !== true) {
								timeboxparent.trigger('scroll_element.xdsoft_scroller', [percentage || Math.abs(parseInt(timebox.css('marginTop'), 10)) / (height - parentHeight)]);
							}
						}
					});

				timeboxparent.on('mousewheel', function (event) {
					var top = Math.abs(parseInt(timebox.css('marginTop'), 10));

					top = top - (event.deltaY * 20);
					if (top < 0) {
						top = 0;
					}

					timeboxparent.trigger('scroll_element.xdsoft_scroller', [top / (height - parentHeight)]);
					event.stopPropagation();
					return false;
				});

				timeboxparent.on('touchstart', function (event) {
					start = pointerEventToXY(event);
					startTop = Math.abs(parseInt(timebox.css('marginTop'), 10));
				});

				timeboxparent.on('touchmove', function (event) {
					if (start) {
						event.preventDefault();
						var coord = pointerEventToXY(event);
						timeboxparent.trigger('scroll_element.xdsoft_scroller', [(startTop - (coord.y - start.y)) / (height - parentHeight)]);
					}
				});

				timeboxparent.on('touchend touchcancel', function () {
					start = false;
					startTop = 0;
				});
			}
			timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
		});
	};

	$.fn.datetimepicker = function (opt, opt2) {
		var result = this,
			KEY0 = 48,
			KEY9 = 57,
			_KEY0 = 96,
			_KEY9 = 105,
			CTRLKEY = 17,
			DEL = 46,
			ENTER = 13,
			ESC = 27,
			BACKSPACE = 8,
			ARROWLEFT = 37,
			ARROWUP = 38,
			ARROWRIGHT = 39,
			ARROWDOWN = 40,
			TAB = 9,
			F5 = 116,
			AKEY = 65,
			CKEY = 67,
			VKEY = 86,
			ZKEY = 90,
			YKEY = 89,
			ctrlDown	=	false,
			options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, default_options, opt) : $.extend(true, {}, default_options),

			lazyInitTimer = 0,
			createDateTimePicker,
			destroyDateTimePicker,

			lazyInit = function (input) {
				input
					.on('open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart', function initOnActionCallback() {
						if (input.is(':disabled') || input.data('xdsoft_datetimepicker')) {
							return;
						}
						clearTimeout(lazyInitTimer);
						lazyInitTimer = setTimeout(function () {

							if (!input.data('xdsoft_datetimepicker')) {
								createDateTimePicker(input);
							}
							input
								.off('open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart', initOnActionCallback)
								.trigger('open.xdsoft');
						}, 100);
					});
			};

		createDateTimePicker = function (input) {
			var datetimepicker = $('<div class="xdsoft_datetimepicker xdsoft_noselect"></div>'),
				xdsoft_copyright = $('<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'),
				datepicker = $('<div class="xdsoft_datepicker active"></div>'),
				mounth_picker = $('<div class="xdsoft_mounthpicker"><button type="button" class="xdsoft_prev"></button><button type="button" class="xdsoft_today_button"></button>' +
					'<div class="xdsoft_label xdsoft_month"><span></span><i></i></div>' +
					'<div class="xdsoft_label xdsoft_year"><span></span><i></i></div>' +
					'<button type="button" class="xdsoft_next"></button></div>'),
				calendar = $('<div class="xdsoft_calendar"></div>'),
				timepicker = $('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"></button></div>'),
				timeboxparent = timepicker.find('.xdsoft_time_box').eq(0),
				timebox = $('<div class="xdsoft_time_variant"></div>'),
				applyButton = $('<button type="button" class="xdsoft_save_selected blue-gradient-button">Save Selected</button>'),

				monthselect = $('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'),
				yearselect = $('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>'),
				triggerAfterOpen = false,
				XDSoft_datetime,

				xchangeTimer,
				timerclick,
				current_time_index,
				setPos,
				timer = 0,
				_xdsoft_datetime,
				forEachAncestorOf;

			if (options.id) {
				datetimepicker.attr('id', options.id);
			}
			if (options.style) {
				datetimepicker.attr('style', options.style);
			}
			if (options.weeks) {
				datetimepicker.addClass('xdsoft_showweeks');
			}
			if (options.rtl) {
				datetimepicker.addClass('xdsoft_rtl');
			}

			datetimepicker.addClass('xdsoft_' + options.theme);
			datetimepicker.addClass(options.className);

			mounth_picker
				.find('.xdsoft_month span')
					.after(monthselect);
			mounth_picker
				.find('.xdsoft_year span')
					.after(yearselect);

			mounth_picker
				.find('.xdsoft_month,.xdsoft_year')
					.on('touchstart mousedown.xdsoft', function (event) {
					var select = $(this).find('.xdsoft_select').eq(0),
						val = 0,
						top = 0,
						visible = select.is(':visible'),
						items,
						i;

					mounth_picker
						.find('.xdsoft_select')
							.hide();
					if (_xdsoft_datetime.currentTime) {
						val = _xdsoft_datetime.currentTime[$(this).hasClass('xdsoft_month') ? 'getMonth' : 'getFullYear']();
					}

					select[visible ? 'hide' : 'show']();
					for (items = select.find('div.xdsoft_option'), i = 0; i < items.length; i += 1) {
						if (items.eq(i).data('value') === val) {
							break;
						} else {
							top += items[0].offsetHeight;
						}
					}

					select.xdsoftScroller(top / (select.children()[0].offsetHeight - (select[0].clientHeight)));
					event.stopPropagation();
					return false;
				});

			mounth_picker
				.find('.xdsoft_select')
					.xdsoftScroller()
				.on('touchstart mousedown.xdsoft', function (event) {
					event.stopPropagation();
					event.preventDefault();
				})
				.on('touchstart mousedown.xdsoft', '.xdsoft_option', function () {
					if (_xdsoft_datetime.currentTime === undefined || _xdsoft_datetime.currentTime === null) {
						_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
					}

					var year = _xdsoft_datetime.currentTime.getFullYear();
					if (_xdsoft_datetime && _xdsoft_datetime.currentTime) {
						_xdsoft_datetime.currentTime[$(this).parent().parent().hasClass('xdsoft_monthselect') ? 'setMonth' : 'setFullYear']($(this).data('value'));
					}

					$(this).parent().parent().hide();

					datetimepicker.trigger('xchange.xdsoft');
					if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
						options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}

					if (year !== _xdsoft_datetime.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
						options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}
				});

			datetimepicker.getValue = function () {
				return _xdsoft_datetime.getCurrentTime();
			};

			datetimepicker.setOptions = function (_options) {
				var highlightedDates = {};

				options = $.extend(true, {}, options, _options);

				if (_options.allowTimes && $.isArray(_options.allowTimes) && _options.allowTimes.length) {
					options.allowTimes = $.extend(true, [], _options.allowTimes);
				}

				if (_options.weekends && $.isArray(_options.weekends) && _options.weekends.length) {
					options.weekends = $.extend(true, [], _options.weekends);
				}

				if (_options.allowDates && $.isArray(_options.allowDates) && _options.allowDates.length) {
					options.allowDates = $.extend(true, [], _options.allowDates);
				}

				if (_options.allowDateRe && Object.prototype.toString.call(_options.allowDateRe)==="[object String]") {
					options.allowDateRe = new RegExp(_options.allowDateRe);
				}

				if (_options.highlightedDates && $.isArray(_options.highlightedDates) && _options.highlightedDates.length) {
					$.each(_options.highlightedDates, function (index, value) {
						var splitData = $.map(value.split(','), $.trim),
							exDesc,
							hDate = new HighlightedDate(dateHelper.parseDate(splitData[0], options.formatDate), splitData[1], splitData[2]), // date, desc, style
							keyDate = dateHelper.formatDate(hDate.date, options.formatDate);
						if (highlightedDates[keyDate] !== undefined) {
							exDesc = highlightedDates[keyDate].desc;
							if (exDesc && exDesc.length && hDate.desc && hDate.desc.length) {
								highlightedDates[keyDate].desc = exDesc + "\n" + hDate.desc;
							}
						} else {
							highlightedDates[keyDate] = hDate;
						}
					});

					options.highlightedDates = $.extend(true, [], highlightedDates);
				}

				if (_options.highlightedPeriods && $.isArray(_options.highlightedPeriods) && _options.highlightedPeriods.length) {
					highlightedDates = $.extend(true, [], options.highlightedDates);
					$.each(_options.highlightedPeriods, function (index, value) {
						var dateTest, // start date
							dateEnd,
							desc,
							hDate,
							keyDate,
							exDesc,
							style;
						if ($.isArray(value)) {
							dateTest = value[0];
							dateEnd = value[1];
							desc = value[2];
							style = value[3];
						}
						else {
							var splitData = $.map(value.split(','), $.trim);
							dateTest = dateHelper.parseDate(splitData[0], options.formatDate);
							dateEnd = dateHelper.parseDate(splitData[1], options.formatDate);
							desc = splitData[2];
							style = splitData[3];
						}

						while (dateTest <= dateEnd) {
							hDate = new HighlightedDate(dateTest, desc, style);
							keyDate = dateHelper.formatDate(dateTest, options.formatDate);
							dateTest.setDate(dateTest.getDate() + 1);
							if (highlightedDates[keyDate] !== undefined) {
								exDesc = highlightedDates[keyDate].desc;
								if (exDesc && exDesc.length && hDate.desc && hDate.desc.length) {
									highlightedDates[keyDate].desc = exDesc + "\n" + hDate.desc;
								}
							} else {
								highlightedDates[keyDate] = hDate;
							}
						}
					});

					options.highlightedDates = $.extend(true, [], highlightedDates);
				}

				if (_options.disabledDates && $.isArray(_options.disabledDates) && _options.disabledDates.length) {
					options.disabledDates = $.extend(true, [], _options.disabledDates);
				}

				if (_options.disabledWeekDays && $.isArray(_options.disabledWeekDays) && _options.disabledWeekDays.length) {
					options.disabledWeekDays = $.extend(true, [], _options.disabledWeekDays);
				}

				if ((options.open || options.opened) && (!options.inline)) {
					input.trigger('open.xdsoft');
				}

				if (options.inline) {
					triggerAfterOpen = true;
					datetimepicker.addClass('xdsoft_inline');
					input.after(datetimepicker).hide();
				}

				if (options.inverseButton) {
					options.next = 'xdsoft_prev';
					options.prev = 'xdsoft_next';
				}

				if (options.datepicker) {
					datepicker.addClass('active');
				} else {
					datepicker.removeClass('active');
				}

				if (options.timepicker) {
					timepicker.addClass('active');
				} else {
					timepicker.removeClass('active');
				}

				if (options.value) {
					_xdsoft_datetime.setCurrentTime(options.value);
					if (input && input.val) {
						input.val(_xdsoft_datetime.str);
					}
				}

				if (isNaN(options.dayOfWeekStart)) {
					options.dayOfWeekStart = 0;
				} else {
					options.dayOfWeekStart = parseInt(options.dayOfWeekStart, 10) % 7;
				}

				if (!options.timepickerScrollbar) {
					timeboxparent.xdsoftScroller('hide');
				}

				if (options.minDate && /^[\+\-](.*)$/.test(options.minDate)) {
					options.minDate = dateHelper.formatDate(_xdsoft_datetime.strToDateTime(options.minDate), options.formatDate);
				}

				if (options.maxDate &&  /^[\+\-](.*)$/.test(options.maxDate)) {
					options.maxDate = dateHelper.formatDate(_xdsoft_datetime.strToDateTime(options.maxDate), options.formatDate);
				}

				applyButton.toggle(options.showApplyButton);

				mounth_picker
					.find('.xdsoft_today_button')
						.css('visibility', !options.todayButton ? 'hidden' : 'visible');

				mounth_picker
					.find('.' + options.prev)
						.css('visibility', !options.prevButton ? 'hidden' : 'visible');

				mounth_picker
					.find('.' + options.next)
						.css('visibility', !options.nextButton ? 'hidden' : 'visible');

				setMask(options);

				if (options.validateOnBlur) {
					input
						.off('blur.xdsoft')
						.on('blur.xdsoft', function () {
							if (options.allowBlank && (!$.trim($(this).val()).length || (typeof options.mask == "string" && $.trim($(this).val()) === options.mask.replace(/[0-9]/g, '_')))) {
								$(this).val(null);
								datetimepicker.data('xdsoft_datetime').empty();
							} else {
								var d = dateHelper.parseDate($(this).val(), options.format);
								if (d) { // parseDate() may skip some invalid parts like date or time, so make it clear for user: show parsed date/time
									$(this).val(dateHelper.formatDate(d, options.format));
								} else {
									var splittedHours   = +([$(this).val()[0], $(this).val()[1]].join('')),
										splittedMinutes = +([$(this).val()[2], $(this).val()[3]].join(''));
	
									// parse the numbers as 0312 => 03:12
									if (!options.datepicker && options.timepicker && splittedHours >= 0 && splittedHours < 24 && splittedMinutes >= 0 && splittedMinutes < 60) {
										$(this).val([splittedHours, splittedMinutes].map(function (item) {
											return item > 9 ? item : '0' + item;
										}).join(':'));
									} else {
										$(this).val(dateHelper.formatDate(_xdsoft_datetime.now(), options.format));
									}
								}
								datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
							}

							datetimepicker.trigger('changedatetime.xdsoft');
							datetimepicker.trigger('close.xdsoft');
						});
				}
				options.dayOfWeekStartPrev = (options.dayOfWeekStart === 0) ? 6 : options.dayOfWeekStart - 1;

				datetimepicker
					.trigger('xchange.xdsoft')
					.trigger('afterOpen.xdsoft');
			};

			datetimepicker
				.data('options', options)
				.on('touchstart mousedown.xdsoft', function (event) {
					event.stopPropagation();
					event.preventDefault();
					yearselect.hide();
					monthselect.hide();
					return false;
				});

			//scroll_element = timepicker.find('.xdsoft_time_box');
			timeboxparent.append(timebox);
			timeboxparent.xdsoftScroller();

			datetimepicker.on('afterOpen.xdsoft', function () {
				timeboxparent.xdsoftScroller();
			});

			datetimepicker
				.append(datepicker)
				.append(timepicker);

			if (options.withoutCopyright !== true) {
				datetimepicker
					.append(xdsoft_copyright);
			}

			datepicker
				.append(mounth_picker)
				.append(calendar)
				.append(applyButton);

			$(options.parentID)
				.append(datetimepicker);

			XDSoft_datetime = function () {
				var _this = this;
				_this.now = function (norecursion) {
					var d = new Date(),
						date,
						time;

					if (!norecursion && options.defaultDate) {
						date = _this.strToDateTime(options.defaultDate);
						d.setFullYear(date.getFullYear());
						d.setMonth(date.getMonth());
						d.setDate(date.getDate());
					}

					if (options.yearOffset) {
						d.setFullYear(d.getFullYear() + options.yearOffset);
					}

					if (!norecursion && options.defaultTime) {
						time = _this.strtotime(options.defaultTime);
						d.setHours(time.getHours());
						d.setMinutes(time.getMinutes());
					}
					return d;
				};

				_this.isValidDate = function (d) {
					if (Object.prototype.toString.call(d) !== "[object Date]") {
						return false;
					}
					return !isNaN(d.getTime());
				};

				_this.setCurrentTime = function (dTime) {
					_this.currentTime = (typeof dTime === 'string') ? _this.strToDateTime(dTime) : _this.isValidDate(dTime) ? dTime : _this.now();
					datetimepicker.trigger('xchange.xdsoft');
				};

				_this.empty = function () {
					_this.currentTime = null;
				};

				_this.getCurrentTime = function (dTime) {
					return _this.currentTime;
				};

				_this.nextMonth = function () {

					if (_this.currentTime === undefined || _this.currentTime === null) {
						_this.currentTime = _this.now();
					}

					var month = _this.currentTime.getMonth() + 1,
						year;
					if (month === 12) {
						_this.currentTime.setFullYear(_this.currentTime.getFullYear() + 1);
						month = 0;
					}

					year = _this.currentTime.getFullYear();

					_this.currentTime.setDate(
						Math.min(
							new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
							_this.currentTime.getDate()
						)
					);
					_this.currentTime.setMonth(month);

					if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
						options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}

					if (year !== _this.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
						options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}

					datetimepicker.trigger('xchange.xdsoft');
					return month;
				};

				_this.prevMonth = function () {

					if (_this.currentTime === undefined || _this.currentTime === null) {
						_this.currentTime = _this.now();
					}

					var month = _this.currentTime.getMonth() - 1;
					if (month === -1) {
						_this.currentTime.setFullYear(_this.currentTime.getFullYear() - 1);
						month = 11;
					}
					_this.currentTime.setDate(
						Math.min(
							new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
							_this.currentTime.getDate()
						)
					);
					_this.currentTime.setMonth(month);
					if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
						options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}
					datetimepicker.trigger('xchange.xdsoft');
					return month;
				};

				_this.getWeekOfYear = function (datetime) {
					if (options.onGetWeekOfYear && $.isFunction(options.onGetWeekOfYear)) {
						var week = options.onGetWeekOfYear.call(datetimepicker, datetime);
						if (typeof week !== 'undefined') {
							return week;
						}
					}
					var onejan = new Date(datetime.getFullYear(), 0, 1);
					//First week of the year is th one with the first Thursday according to ISO8601
					if(onejan.getDay()!=4)
						onejan.setMonth(0, 1 + ((4 - onejan.getDay()+ 7) % 7));
					return Math.ceil((((datetime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
				};

				_this.strToDateTime = function (sDateTime) {
					var tmpDate = [], timeOffset, currentTime;

					if (sDateTime && sDateTime instanceof Date && _this.isValidDate(sDateTime)) {
						return sDateTime;
					}

					tmpDate = /^(\+|\-)(.*)$/.exec(sDateTime);
					if (tmpDate) {
						tmpDate[2] = dateHelper.parseDate(tmpDate[2], options.formatDate);
					}
					if (tmpDate  && tmpDate[2]) {
						timeOffset = tmpDate[2].getTime() - (tmpDate[2].getTimezoneOffset()) * 60000;
						currentTime = new Date((_this.now(true)).getTime() + parseInt(tmpDate[1] + '1', 10) * timeOffset);
					} else {
						currentTime = sDateTime ? dateHelper.parseDate(sDateTime, options.format) : _this.now();
					}

					if (!_this.isValidDate(currentTime)) {
						currentTime = _this.now();
					}

					return currentTime;
				};

				_this.strToDate = function (sDate) {
					if (sDate && sDate instanceof Date && _this.isValidDate(sDate)) {
						return sDate;
					}

					var currentTime = sDate ? dateHelper.parseDate(sDate, options.formatDate) : _this.now(true);
					if (!_this.isValidDate(currentTime)) {
						currentTime = _this.now(true);
					}
					return currentTime;
				};

				_this.strtotime = function (sTime) {
					if (sTime && sTime instanceof Date && _this.isValidDate(sTime)) {
						return sTime;
					}
					var currentTime = sTime ? dateHelper.parseDate(sTime, options.formatTime) : _this.now(true);
					if (!_this.isValidDate(currentTime)) {
						currentTime = _this.now(true);
					}
					return currentTime;
				};

				_this.str = function () {
					return dateHelper.formatDate(_this.currentTime, options.format);
				};
				_this.currentTime = this.now();
			};

			_xdsoft_datetime = new XDSoft_datetime();

			applyButton.on('touchend click', function (e) {//pathbrite
				e.preventDefault();
				datetimepicker.data('changed', true);
				_xdsoft_datetime.setCurrentTime(getCurrentValue());
				input.val(_xdsoft_datetime.str());
				datetimepicker.trigger('close.xdsoft');
			});
			mounth_picker
				.find('.xdsoft_today_button')
				.on('touchend mousedown.xdsoft', function () {
					datetimepicker.data('changed', true);
					_xdsoft_datetime.setCurrentTime(0);
					datetimepicker.trigger('afterOpen.xdsoft');
				}).on('dblclick.xdsoft', function () {
					var currentDate = _xdsoft_datetime.getCurrentTime(), minDate, maxDate;
					currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
					minDate = _xdsoft_datetime.strToDate(options.minDate);
					minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
					if (currentDate < minDate) {
						return;
					}
					maxDate = _xdsoft_datetime.strToDate(options.maxDate);
					maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
					if (currentDate > maxDate) {
						return;
					}
					input.val(_xdsoft_datetime.str());
					input.trigger('change');
					datetimepicker.trigger('close.xdsoft');
				});
			mounth_picker
				.find('.xdsoft_prev,.xdsoft_next')
				.on('touchend mousedown.xdsoft', function () {
					var $this = $(this),
						timer = 0,
						stop = false;

					(function arguments_callee1(v) {
						if ($this.hasClass(options.next)) {
							_xdsoft_datetime.nextMonth();
						} else if ($this.hasClass(options.prev)) {
							_xdsoft_datetime.prevMonth();
						}
						if (options.monthChangeSpinner) {
							if (!stop) {
								timer = setTimeout(arguments_callee1, v || 100);
							}
						}
					}(500));

					$([document.body, window]).on('touchend mouseup.xdsoft', function arguments_callee2() {
						clearTimeout(timer);
						stop = true;
						$([document.body, window]).off('touchend mouseup.xdsoft', arguments_callee2);
					});
				});

			timepicker
				.find('.xdsoft_prev,.xdsoft_next')
				.on('touchend mousedown.xdsoft', function () {
					var $this = $(this),
						timer = 0,
						stop = false,
						period = 110;
					(function arguments_callee4(v) {
						var pheight = timeboxparent[0].clientHeight,
							height = timebox[0].offsetHeight,
							top = Math.abs(parseInt(timebox.css('marginTop'), 10));
						if ($this.hasClass(options.next) && (height - pheight) - options.timeHeightInTimePicker >= top) {
							timebox.css('marginTop', '-' + (top + options.timeHeightInTimePicker) + 'px');
						} else if ($this.hasClass(options.prev) && top - options.timeHeightInTimePicker >= 0) {
							timebox.css('marginTop', '-' + (top - options.timeHeightInTimePicker) + 'px');
						}
                        /**
                         * Fixed bug:
                         * When using css3 transition, it will cause a bug that you cannot scroll the timepicker list.
                         * The reason is that the transition-duration time, if you set it to 0, all things fine, otherwise, this
                         * would cause a bug when you use jquery.css method.
                         * Let's say: * { transition: all .5s ease; }
                         * jquery timebox.css('marginTop') will return the original value which is before you clicking the next/prev button,
                         * meanwhile the timebox[0].style.marginTop will return the right value which is after you clicking the
                         * next/prev button.
                         * 
                         * What we should do:
                         * Replace timebox.css('marginTop') with timebox[0].style.marginTop.
                         */
                        timeboxparent.trigger('scroll_element.xdsoft_scroller', [Math.abs(parseInt(timebox[0].style.marginTop, 10) / (height - pheight))]);
						period = (period > 10) ? 10 : period - 10;
						if (!stop) {
							timer = setTimeout(arguments_callee4, v || period);
						}
					}(500));
					$([document.body, window]).on('touchend mouseup.xdsoft', function arguments_callee5() {
						clearTimeout(timer);
						stop = true;
						$([document.body, window])
							.off('touchend mouseup.xdsoft', arguments_callee5);
					});
				});

			xchangeTimer = 0;
			// base handler - generating a calendar and timepicker
			datetimepicker
				.on('xchange.xdsoft', function (event) {
					clearTimeout(xchangeTimer);
					xchangeTimer = setTimeout(function () {

						if (_xdsoft_datetime.currentTime === undefined || _xdsoft_datetime.currentTime === null) {
							_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
						}

						var table =	'',
							start = new Date(_xdsoft_datetime.currentTime.getFullYear(), _xdsoft_datetime.currentTime.getMonth(), 1, 12, 0, 0),
							i = 0,
							j,
							today = _xdsoft_datetime.now(),
							maxDate = false,
							minDate = false,
							hDate,
							day,
							d,
							y,
							m,
							w,
							classes = [],
							customDateSettings,
							newRow = true,
							time = '',
							h = '',
							line_time,
							description;

						while (start.getDay() !== options.dayOfWeekStart) {
							start.setDate(start.getDate() - 1);
						}

						table += '<table><thead><tr>';

						if (options.weeks) {
							table += '<th></th>';
						}

						for (j = 0; j < 7; j += 1) {
							table += '<th>' + options.i18n[globalLocale].dayOfWeekShort[(j + options.dayOfWeekStart) % 7] + '</th>';
						}

						table += '</tr></thead>';
						table += '<tbody>';

						if (options.maxDate !== false) {
							maxDate = _xdsoft_datetime.strToDate(options.maxDate);
							maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
						}

						if (options.minDate !== false) {
							minDate = _xdsoft_datetime.strToDate(options.minDate);
							minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
						}

						while (i < _xdsoft_datetime.currentTime.countDaysInMonth() || start.getDay() !== options.dayOfWeekStart || _xdsoft_datetime.currentTime.getMonth() === start.getMonth()) {
							classes = [];
							i += 1;

							day = start.getDay();
							d = start.getDate();
							y = start.getFullYear();
							m = start.getMonth();
							w = _xdsoft_datetime.getWeekOfYear(start);
							description = '';

							classes.push('xdsoft_date');

							if (options.beforeShowDay && $.isFunction(options.beforeShowDay.call)) {
								customDateSettings = options.beforeShowDay.call(datetimepicker, start);
							} else {
								customDateSettings = null;
							}

							if(options.allowDateRe && Object.prototype.toString.call(options.allowDateRe) === "[object RegExp]"){
								if(!options.allowDateRe.test(dateHelper.formatDate(start, options.formatDate))){
									classes.push('xdsoft_disabled');
								}
							} else if(options.allowDates && options.allowDates.length>0){
								if(options.allowDates.indexOf(dateHelper.formatDate(start, options.formatDate)) === -1){
									classes.push('xdsoft_disabled');
								}
							} else if ((maxDate !== false && start > maxDate) || (minDate !== false && start < minDate) || (customDateSettings && customDateSettings[0] === false)) {
								classes.push('xdsoft_disabled');
							} else if (options.disabledDates.indexOf(dateHelper.formatDate(start, options.formatDate)) !== -1) {
								classes.push('xdsoft_disabled');
							} else if (options.disabledWeekDays.indexOf(day) !== -1) {
								classes.push('xdsoft_disabled');
							}else if (input.is('[readonly]')) {
								classes.push('xdsoft_disabled');
							}

							if (customDateSettings && customDateSettings[1] !== "") {
								classes.push(customDateSettings[1]);
							}

							if (_xdsoft_datetime.currentTime.getMonth() !== m) {
								classes.push('xdsoft_other_month');
							}

							if ((options.defaultSelect || datetimepicker.data('changed')) && dateHelper.formatDate(_xdsoft_datetime.currentTime, options.formatDate) === dateHelper.formatDate(start, options.formatDate)) {
								classes.push('xdsoft_current');
							}

							if (dateHelper.formatDate(today, options.formatDate) === dateHelper.formatDate(start, options.formatDate)) {
								classes.push('xdsoft_today');
							}

							if (start.getDay() === 0 || start.getDay() === 6 || options.weekends.indexOf(dateHelper.formatDate(start, options.formatDate)) !== -1) {
								classes.push('xdsoft_weekend');
							}

							if (options.highlightedDates[dateHelper.formatDate(start, options.formatDate)] !== undefined) {
								hDate = options.highlightedDates[dateHelper.formatDate(start, options.formatDate)];
								classes.push(hDate.style === undefined ? 'xdsoft_highlighted_default' : hDate.style);
								description = hDate.desc === undefined ? '' : hDate.desc;
							}

							if (options.beforeShowDay && $.isFunction(options.beforeShowDay)) {
								classes.push(options.beforeShowDay(start));
							}

							if (newRow) {
								table += '<tr>';
								newRow = false;
								if (options.weeks) {
									table += '<th>' + w + '</th>';
								}
							}

							table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '" title="' + description + '">' +
										'<div>' + d + '</div>' +
									'</td>';

							if (start.getDay() === options.dayOfWeekStartPrev) {
								table += '</tr>';
								newRow = true;
							}

							start.setDate(d + 1);
						}
						table += '</tbody></table>';

						calendar.html(table);

						mounth_picker.find('.xdsoft_label span').eq(0).text(options.i18n[globalLocale].months[_xdsoft_datetime.currentTime.getMonth()]);
						mounth_picker.find('.xdsoft_label span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());

						// generate timebox
						time = '';
						h = '';
						m = '';

						line_time = function line_time(h, m) {
							var now = _xdsoft_datetime.now(), optionDateTime, current_time,
								isALlowTimesInit = options.allowTimes && $.isArray(options.allowTimes) && options.allowTimes.length;
							now.setHours(h);
							h = parseInt(now.getHours(), 10);
							now.setMinutes(m);
							m = parseInt(now.getMinutes(), 10);
							optionDateTime = new Date(_xdsoft_datetime.currentTime);
							optionDateTime.setHours(h);
							optionDateTime.setMinutes(m);
							classes = [];			
							if ((options.minDateTime !== false && options.minDateTime > optionDateTime) || (options.maxTime !== false && _xdsoft_datetime.strtotime(options.maxTime).getTime() < now.getTime()) || (options.minTime !== false && _xdsoft_datetime.strtotime(options.minTime).getTime() > now.getTime())) {
								classes.push('xdsoft_disabled');
							} else if ((options.minDateTime !== false && options.minDateTime > optionDateTime) || ((options.disabledMinTime !== false && now.getTime() > _xdsoft_datetime.strtotime(options.disabledMinTime).getTime()) && (options.disabledMaxTime !== false && now.getTime() < _xdsoft_datetime.strtotime(options.disabledMaxTime).getTime()))) {
								classes.push('xdsoft_disabled');
							} else if (input.is('[readonly]')) {
								classes.push('xdsoft_disabled');
							}

							current_time = new Date(_xdsoft_datetime.currentTime);
							current_time.setHours(parseInt(_xdsoft_datetime.currentTime.getHours(), 10));

							if (!isALlowTimesInit) {
								current_time.setMinutes(Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes() / options.step) * options.step);
							}

							if ((options.initTime || options.defaultSelect || datetimepicker.data('changed')) && current_time.getHours() === parseInt(h, 10) && ((!isALlowTimesInit && options.step > 59) || current_time.getMinutes() === parseInt(m, 10))) {
								if (options.defaultSelect || datetimepicker.data('changed')) {
									classes.push('xdsoft_current');
								} else if (options.initTime) {
									classes.push('xdsoft_init_time');
								}
							}
							if (parseInt(today.getHours(), 10) === parseInt(h, 10) && parseInt(today.getMinutes(), 10) === parseInt(m, 10)) {
								classes.push('xdsoft_today');
							}
							time += '<div class="xdsoft_time ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '">' + dateHelper.formatDate(now, options.formatTime) + '</div>';
						};

						if (!options.allowTimes || !$.isArray(options.allowTimes) || !options.allowTimes.length) {
							for (i = 0, j = 0; i < (options.hours12 ? 12 : 24); i += 1) {
								for (j = 0; j < 60; j += options.step) {
									h = (i < 10 ? '0' : '') + i;
									m = (j < 10 ? '0' : '') + j;
									line_time(h, m);
								}
							}
						} else {
							for (i = 0; i < options.allowTimes.length; i += 1) {
								h = _xdsoft_datetime.strtotime(options.allowTimes[i]).getHours();
								m = _xdsoft_datetime.strtotime(options.allowTimes[i]).getMinutes();
								line_time(h, m);
							}
						}

						timebox.html(time);

						opt = '';
						i = 0;

						for (i = parseInt(options.yearStart, 10) + options.yearOffset; i <= parseInt(options.yearEnd, 10) + options.yearOffset; i += 1) {
							opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getFullYear() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + i + '</div>';
						}
						yearselect.children().eq(0)
												.html(opt);

						for (i = parseInt(options.monthStart, 10), opt = ''; i <= parseInt(options.monthEnd, 10); i += 1) {
							opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getMonth() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + options.i18n[globalLocale].months[i] + '</div>';
						}
						monthselect.children().eq(0).html(opt);
						$(datetimepicker)
							.trigger('generate.xdsoft');
					}, 10);
					event.stopPropagation();
				})
				.on('afterOpen.xdsoft', function () {
					if (options.timepicker) {
						var classType, pheight, height, top;
						if (timebox.find('.xdsoft_current').length) {
							classType = '.xdsoft_current';
						} else if (timebox.find('.xdsoft_init_time').length) {
							classType = '.xdsoft_init_time';
						}
						if (classType) {
							pheight = timeboxparent[0].clientHeight;
							height = timebox[0].offsetHeight;
							top = timebox.find(classType).index() * options.timeHeightInTimePicker + 1;
							if ((height - pheight) < top) {
								top = height - pheight;
							}
							timeboxparent.trigger('scroll_element.xdsoft_scroller', [parseInt(top, 10) / (height - pheight)]);
						} else {
							timeboxparent.trigger('scroll_element.xdsoft_scroller', [0]);
						}
					}
				});

			timerclick = 0;
			calendar
				.on('touchend click.xdsoft', 'td', function (xdevent) {
					xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
					timerclick += 1;
					var $this = $(this),
						currentTime = _xdsoft_datetime.currentTime;

					if (currentTime === undefined || currentTime === null) {
						_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
						currentTime = _xdsoft_datetime.currentTime;
					}

					if ($this.hasClass('xdsoft_disabled')) {
						return false;
					}

					currentTime.setDate(1);
					currentTime.setFullYear($this.data('year'));
					currentTime.setMonth($this.data('month'));
					currentTime.setDate($this.data('date'));

					datetimepicker.trigger('select.xdsoft', [currentTime]);

					input.val(_xdsoft_datetime.str());

					if (options.onSelectDate &&	$.isFunction(options.onSelectDate)) {
						options.onSelectDate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
					}

					datetimepicker.data('changed', true);
					datetimepicker.trigger('xchange.xdsoft');
					datetimepicker.trigger('changedatetime.xdsoft');
					if ((timerclick > 1 || (options.closeOnDateSelect === true || (options.closeOnDateSelect === false && !options.timepicker))) && !options.inline) {
						datetimepicker.trigger('close.xdsoft');
					}
					setTimeout(function () {
						timerclick = 0;
					}, 200);
				});

			timebox
				.on('touchend click.xdsoft', 'div', function (xdevent) {
					xdevent.stopPropagation();
					var $this = $(this),
						currentTime = _xdsoft_datetime.currentTime;

					if (currentTime === undefined || currentTime === null) {
						_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
						currentTime = _xdsoft_datetime.currentTime;
					}

					if ($this.hasClass('xdsoft_disabled')) {
						return false;
					}
					currentTime.setHours($this.data('hour'));
					currentTime.setMinutes($this.data('minute'));
					datetimepicker.trigger('select.xdsoft', [currentTime]);

					datetimepicker.data('input').val(_xdsoft_datetime.str());

					if (options.onSelectTime && $.isFunction(options.onSelectTime)) {
						options.onSelectTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
					}
					datetimepicker.data('changed', true);
					datetimepicker.trigger('xchange.xdsoft');
					datetimepicker.trigger('changedatetime.xdsoft');
					if (options.inline !== true && options.closeOnTimeSelect === true) {
						datetimepicker.trigger('close.xdsoft');
					}
				});

			datepicker
				.on('mousewheel.xdsoft', function (event) {
					if (!options.scrollMonth) {
						return true;
					}
					if (event.deltaY < 0) {
						_xdsoft_datetime.nextMonth();
					} else {
						_xdsoft_datetime.prevMonth();
					}
					return false;
				});

			input
				.on('mousewheel.xdsoft', function (event) {
					if (!options.scrollInput) {
						return true;
					}
					if (!options.datepicker && options.timepicker) {
						current_time_index = timebox.find('.xdsoft_current').length ? timebox.find('.xdsoft_current').eq(0).index() : 0;
						if (current_time_index + event.deltaY >= 0 && current_time_index + event.deltaY < timebox.children().length) {
							current_time_index += event.deltaY;
						}
						if (timebox.children().eq(current_time_index).length) {
							timebox.children().eq(current_time_index).trigger('mousedown');
						}
						return false;
					}
					if (options.datepicker && !options.timepicker) {
						datepicker.trigger(event, [event.deltaY, event.deltaX, event.deltaY]);
						if (input.val) {
							input.val(_xdsoft_datetime.str());
						}
						datetimepicker.trigger('changedatetime.xdsoft');
						return false;
					}
				});

			datetimepicker
				.on('changedatetime.xdsoft', function (event) {
					if (options.onChangeDateTime && $.isFunction(options.onChangeDateTime)) {
						var $input = datetimepicker.data('input');
						options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, $input, event);
						delete options.value;
						$input.trigger('change');
					}
				})
				.on('generate.xdsoft', function () {
					if (options.onGenerate && $.isFunction(options.onGenerate)) {
						options.onGenerate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}
					if (triggerAfterOpen) {
						datetimepicker.trigger('afterOpen.xdsoft');
						triggerAfterOpen = false;
					}
				})
				.on('click.xdsoft', function (xdevent) {
					xdevent.stopPropagation();
				});

			current_time_index = 0;

			/**
			 * Runs the callback for each of the specified node's ancestors.
			 *
			 * Return FALSE from the callback to stop ascending.
			 *
			 * @param {DOMNode} node
			 * @param {Function} callback
			 * @returns {undefined}
			 */
			forEachAncestorOf = function (node, callback) {
				do {
					node = node.parentNode;

					if (callback(node) === false) {
						break;
					}
				} while (node.nodeName !== 'HTML');
			};

			/**
			 * Sets the position of the picker.
			 *
			 * @returns {undefined}
			 */
			setPos = function () {
				var dateInputOffset,
					dateInputElem,
					verticalPosition,
					left,
					position,
					datetimepickerElem,
					dateInputHasFixedAncestor,
					$dateInput,
					windowWidth,
					verticalAnchorEdge,
					datetimepickerCss,
					windowHeight,
					windowScrollTop;

				$dateInput = datetimepicker.data('input');
				dateInputOffset = $dateInput.offset();
				dateInputElem = $dateInput[0];

				verticalAnchorEdge = 'top';
				verticalPosition = (dateInputOffset.top + dateInputElem.offsetHeight) - 1;
				left = dateInputOffset.left;
				position = "absolute";

				windowWidth = $(window).width();
				windowHeight = $(window).height();
				windowScrollTop = $(window).scrollTop();

				if ((document.documentElement.clientWidth - dateInputOffset.left) < datepicker.parent().outerWidth(true)) {
					var diff = datepicker.parent().outerWidth(true) - dateInputElem.offsetWidth;
					left = left - diff;
				}

				if ($dateInput.parent().css('direction') === 'rtl') {
					left -= (datetimepicker.outerWidth() - $dateInput.outerWidth());
				}

				if (options.fixed) {
					verticalPosition -= windowScrollTop;
					left -= $(window).scrollLeft();
					position = "fixed";
				} else {
					dateInputHasFixedAncestor = false;

					forEachAncestorOf(dateInputElem, function (ancestorNode) {
						if (window.getComputedStyle(ancestorNode).getPropertyValue('position') === 'fixed') {
							dateInputHasFixedAncestor = true;
							return false;
						}
					});

					if (dateInputHasFixedAncestor) {
						position = 'fixed';

						//If the picker won't fit entirely within the viewport then display it above the date input.
						if (verticalPosition + datetimepicker.outerHeight() > windowHeight + windowScrollTop) {
							verticalAnchorEdge = 'bottom';
							verticalPosition = (windowHeight + windowScrollTop) - dateInputOffset.top;
						} else {
							verticalPosition -= windowScrollTop;
						}
					} else {
						if (verticalPosition + dateInputElem.offsetHeight > windowHeight + windowScrollTop) {
							verticalPosition = dateInputOffset.top - dateInputElem.offsetHeight + 1;
						}
					}

					if (verticalPosition < 0) {
						verticalPosition = 0;
					}

					if (left + dateInputElem.offsetWidth > windowWidth) {
						left = windowWidth - dateInputElem.offsetWidth;
					}
				}

				datetimepickerElem = datetimepicker[0];

				forEachAncestorOf(datetimepickerElem, function (ancestorNode) {
					var ancestorNodePosition;

					ancestorNodePosition = window.getComputedStyle(ancestorNode).getPropertyValue('position');

					if (ancestorNodePosition === 'relative' && windowWidth >= ancestorNode.offsetWidth) {
						left = left - ((windowWidth - ancestorNode.offsetWidth) / 2);
						return false;
					}
				});

				datetimepickerCss = {
					position: position,
					left: left,
					top: '',  //Initialize to prevent previous values interfering with new ones.
					bottom: ''  //Initialize to prevent previous values interfering with new ones.
				};

				datetimepickerCss[verticalAnchorEdge] = verticalPosition;

				datetimepicker.css(datetimepickerCss);
			};

			datetimepicker
				.on('open.xdsoft', function (event) {
					var onShow = true;
					if (options.onShow && $.isFunction(options.onShow)) {
						onShow = options.onShow.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
					}
					if (onShow !== false) {
						datetimepicker.show();
						setPos();
						$(window)
							.off('resize.xdsoft', setPos)
							.on('resize.xdsoft', setPos);

						if (options.closeOnWithoutClick) {
							$([document.body, window]).on('touchstart mousedown.xdsoft', function arguments_callee6() {
								datetimepicker.trigger('close.xdsoft');
								$([document.body, window]).off('touchstart mousedown.xdsoft', arguments_callee6);
							});
						}
					}
				})
				.on('close.xdsoft', function (event) {
					var onClose = true;
					mounth_picker
						.find('.xdsoft_month,.xdsoft_year')
							.find('.xdsoft_select')
								.hide();
					if (options.onClose && $.isFunction(options.onClose)) {
						onClose = options.onClose.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
					}
					if (onClose !== false && !options.opened && !options.inline) {
						datetimepicker.hide();
					}
					event.stopPropagation();
				})
				.on('toggle.xdsoft', function () {
					if (datetimepicker.is(':visible')) {
						datetimepicker.trigger('close.xdsoft');
					} else {
						datetimepicker.trigger('open.xdsoft');
					}
				})
				.data('input', input);

			timer = 0;

			datetimepicker.data('xdsoft_datetime', _xdsoft_datetime);
			datetimepicker.setOptions(options);

			function getCurrentValue() {
				var ct = false, time;

				if (options.startDate) {
					ct = _xdsoft_datetime.strToDate(options.startDate);
				} else {
					ct = options.value || ((input && input.val && input.val()) ? input.val() : '');
					if (ct) {
						ct = _xdsoft_datetime.strToDateTime(ct);
					} else if (options.defaultDate) {
						ct = _xdsoft_datetime.strToDateTime(options.defaultDate);
						if (options.defaultTime) {
							time = _xdsoft_datetime.strtotime(options.defaultTime);
							ct.setHours(time.getHours());
							ct.setMinutes(time.getMinutes());
						}
					}
				}

				if (ct && _xdsoft_datetime.isValidDate(ct)) {
					datetimepicker.data('changed', true);
				} else {
					ct = '';
				}

				return ct || 0;
			}

			function setMask(options) {

				var isValidValue = function (mask, value) {
					var reg = mask
						.replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1')
						.replace(/_/g, '{digit+}')
						.replace(/([0-9]{1})/g, '{digit$1}')
						.replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}')
						.replace(/\{digit[\+]\}/g, '[0-9_]{1}');
					return (new RegExp(reg)).test(value);
				},
				getCaretPos = function (input) {
					try {
						if (document.selection && document.selection.createRange) {
							var range = document.selection.createRange();
							return range.getBookmark().charCodeAt(2) - 2;
						}
						if (input.setSelectionRange) {
							return input.selectionStart;
						}
					} catch (e) {
						return 0;
					}
				},
				setCaretPos = function (node, pos) {
					node = (typeof node === "string" || node instanceof String) ? document.getElementById(node) : node;
					if (!node) {
						return false;
					}
					if (node.createTextRange) {
						var textRange = node.createTextRange();
						textRange.collapse(true);
						textRange.moveEnd('character', pos);
						textRange.moveStart('character', pos);
						textRange.select();
						return true;
					}
					if (node.setSelectionRange) {
						node.setSelectionRange(pos, pos);
						return true;
					}
					return false;
				};
				if(options.mask) {
					input.off('keydown.xdsoft');
				}
				if (options.mask === true) {
														if (typeof moment != 'undefined') {
																	options.mask = options.format
																			.replace(/Y{4}/g, '9999')
																			.replace(/Y{2}/g, '99')
																			.replace(/M{2}/g, '19')
																			.replace(/D{2}/g, '39')
																			.replace(/H{2}/g, '29')
																			.replace(/m{2}/g, '59')
																			.replace(/s{2}/g, '59');
														} else {
																	options.mask = options.format
																			.replace(/Y/g, '9999')
																			.replace(/F/g, '9999')
																			.replace(/m/g, '19')
																			.replace(/d/g, '39')
																			.replace(/H/g, '29')
																			.replace(/i/g, '59')
																			.replace(/s/g, '59');
														}
				}

				if ($.type(options.mask) === 'string') {
					if (!isValidValue(options.mask, input.val())) {
						input.val(options.mask.replace(/[0-9]/g, '_'));
						setCaretPos(input[0], 0);
					}

					input.on('keydown.xdsoft', function (event) {
						var val = this.value,
							key = event.which,
							pos,
							digit;

						if (((key >= KEY0 && key <= KEY9) || (key >= _KEY0 && key <= _KEY9)) || (key === BACKSPACE || key === DEL)) {
							pos = getCaretPos(this);
							digit = (key !== BACKSPACE && key !== DEL) ? String.fromCharCode((_KEY0 <= key && key <= _KEY9) ? key - KEY0 : key) : '_';

							if ((key === BACKSPACE || key === DEL) && pos) {
								pos -= 1;
								digit = '_';
							}

							while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
								pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
							}

							val = val.substr(0, pos) + digit + val.substr(pos + 1);
							if ($.trim(val) === '') {
								val = options.mask.replace(/[0-9]/g, '_');
							} else {
								if (pos === options.mask.length) {
									event.preventDefault();
									return false;
								}
							}

							pos += (key === BACKSPACE || key === DEL) ? 0 : 1;
							while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
								pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
							}

							if (isValidValue(options.mask, val)) {
								this.value = val;
								setCaretPos(this, pos);
							} else if ($.trim(val) === '') {
								this.value = options.mask.replace(/[0-9]/g, '_');
							} else {
								input.trigger('error_input.xdsoft');
							}
						} else {
							if (([AKEY, CKEY, VKEY, ZKEY, YKEY].indexOf(key) !== -1 && ctrlDown) || [ESC, ARROWUP, ARROWDOWN, ARROWLEFT, ARROWRIGHT, F5, CTRLKEY, TAB, ENTER].indexOf(key) !== -1) {
								return true;
							}
						}

						event.preventDefault();
						return false;
					});
				}
			}

			_xdsoft_datetime.setCurrentTime(getCurrentValue());

			input
				.data('xdsoft_datetimepicker', datetimepicker)
				.on('open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart', function () {
					if (input.is(':disabled') || (input.data('xdsoft_datetimepicker').is(':visible') && options.closeOnInputClick)) {
						return;
					}
					clearTimeout(timer);
					timer = setTimeout(function () {
						if (input.is(':disabled')) {
							return;
						}

						triggerAfterOpen = true;
						_xdsoft_datetime.setCurrentTime(getCurrentValue());
						if(options.mask) {
							setMask(options);
						}
						datetimepicker.trigger('open.xdsoft');
					}, 100);
				})
				.on('keydown.xdsoft', function (event) {
					var elementSelector,
						key = event.which;
					if ([ENTER].indexOf(key) !== -1 && options.enterLikeTab) {
						elementSelector = $("input:visible,textarea:visible,button:visible,a:visible");
						datetimepicker.trigger('close.xdsoft');
						elementSelector.eq(elementSelector.index(this) + 1).focus();
						return false;
					}
					if ([TAB].indexOf(key) !== -1) {
						datetimepicker.trigger('close.xdsoft');
						return true;
					}
				})
				.on('blur.xdsoft', function () {
					datetimepicker.trigger('close.xdsoft');
				});
		};
		destroyDateTimePicker = function (input) {
			var datetimepicker = input.data('xdsoft_datetimepicker');
			if (datetimepicker) {
				datetimepicker.data('xdsoft_datetime', null);
				datetimepicker.remove();
				input
					.data('xdsoft_datetimepicker', null)
					.off('.xdsoft');
				$(window).off('resize.xdsoft');
				$([window, document.body]).off('mousedown.xdsoft touchstart');
				if (input.unmousewheel) {
					input.unmousewheel();
				}
			}
		};
		$(document)
			.off('keydown.xdsoftctrl keyup.xdsoftctrl')
			.on('keydown.xdsoftctrl', function (e) {
				if (e.keyCode === CTRLKEY) {
					ctrlDown = true;
				}
			})
			.on('keyup.xdsoftctrl', function (e) {
				if (e.keyCode === CTRLKEY) {
					ctrlDown = false;
				}
			});

		this.each(function () {
			var datetimepicker = $(this).data('xdsoft_datetimepicker'), $input;
			if (datetimepicker) {
				if ($.type(opt) === 'string') {
					switch (opt) {
					case 'show':
						$(this).select().focus();
						datetimepicker.trigger('open.xdsoft');
						break;
					case 'hide':
						datetimepicker.trigger('close.xdsoft');
						break;
					case 'toggle':
						datetimepicker.trigger('toggle.xdsoft');
						break;
					case 'destroy':
						destroyDateTimePicker($(this));
						break;
					case 'reset':
						this.value = this.defaultValue;
						if (!this.value || !datetimepicker.data('xdsoft_datetime').isValidDate(dateHelper.parseDate(this.value, options.format))) {
							datetimepicker.data('changed', false);
						}
						datetimepicker.data('xdsoft_datetime').setCurrentTime(this.value);
						break;
					case 'validate':
						$input = datetimepicker.data('input');
						$input.trigger('blur.xdsoft');
						break;
					default:
						if (datetimepicker[opt] && $.isFunction(datetimepicker[opt])) {
							result = datetimepicker[opt](opt2);
						}
					}
				} else {
					datetimepicker
						.setOptions(opt);
				}
				return 0;
			}
			if ($.type(opt) !== 'string') {
				if (!options.lazyInit || options.open || options.inline) {
					createDateTimePicker($(this));
				} else {
					lazyInit($(this));
				}
			}
		});

		return result;
	};

	$.fn.datetimepicker.defaults = default_options;

	function HighlightedDate(date, desc, style) {
		"use strict";
		this.date = date;
		this.desc = desc;
		this.style = style;
	}
}));
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
       
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));


/*!
  SerializeJSON jQuery plugin.
  https://github.com/marioizquierdo/jquery.serializeJSON
  version 2.8.1 (Dec, 2016)

  Copyright (c) 2012, 2017 Mario Izquierdo
  Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
  and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) { // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') { // Node/CommonJS
    var jQuery = require('jquery');
    module.exports = factory(jQuery);
  } else { // Browser globals (zepto supported)
    factory(window.jQuery || window.Zepto || window.$); // Zepto supported on browsers as well
  }

}(function ($) {
  "use strict";
  
  /**
  	解决cq序列化的组建，因为生的组建只会取value ，现在cq 下拉框sid tree要取data-value
  */
  $.fn.extend( {
		/*serialize: function() {
			return jQuery.param( this.serializeArray() );
		},*/
		serializeArrayCq: function() {
			var
				rbracket = /\[\]$/,
				rCRLF = /\r?\n/g,
				rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
				rcheckableType = ( /^(?:checkbox|radio)$/i ),
				rsubmittable = /^(?:input|select|textarea|keygen)/i;

			return this.map( function() {

				// Can add propHook for "elements" to filter or add form elements
				var elements = $.prop( this, "elements" );
				return elements ? $.makeArray( elements ) : this;
			} ).filter( function() {
				var type = this.type;
				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !$( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} ).map( function( i, elem ) {
				
				var id=this.id, opts =id?CQSDK('#'+this.id):'',val;
				if(opts && $.type(opts.options) == 'object' && opts.options.sid){
					val = CQSDK('#'+this.id).value;
				}else{
					//如果是checkbox 选中是1 
					if(this.type && this.type === 'checkbox'){
						val = this.checked? '1':'0';
					}else{
						 val = $( this ).val();//
					}
				}

				if ( val == null ) {
					return null;
				}

				if ( Array.isArray( val ) ) {
					return $.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} );
				}

				return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );
  // jQuery('form').serializeJSON()
  $.fn.serializeJSON = function (options) {
    var f, $form, opts, formAsArray, serializedObject, name, value, parsedValue, _obj, nameWithNoType, type, keys, skipFalsy;
    f = $.serializeJSON;
    $form = this; // NOTE: the set of matched elements is most likely a form, but it could also be a group of inputs
    opts = f.setupOpts(options); // calculate values for options {parseNumbers, parseBoolens, parseNulls, ...} with defaults

    // Use native `serializeArray` function to get an array of {name, value} objects.
    formAsArray = $form.serializeArrayCq();
    //转化写法a.b.c  => {a:{b:{c:}}}
    $.each(formAsArray,function(index,item){
        var name = item.name,tmp,arr,len;
        if(name.indexOf('.') > -1){
          arr = name.split('.');
          len = arr.length;
          $.each(arr,function(i,t){
              if(i == 0){
                tmp = t + '[';
              }else if(i > 0 && i < len -1){
                tmp += t +'][';
              }else {
                 tmp += t +']';
              }
          });
          item.name = tmp;
          tmp = '';
        }
      // console.log(item);
    });
    f.readCheckboxUncheckedValues(formAsArray, opts, $form); // add objects to the array from unchecked checkboxes if needed

    // Convert the formAsArray into a serializedObject with nested keys
    serializedObject = {};
    $.each(formAsArray, function (i, obj) {
      name  = obj.name; // original input name
      value = obj.value; // input value

      _obj = f.extractTypeAndNameWithNoType(name);
      nameWithNoType = _obj.nameWithNoType; // input name with no type (i.e. "foo:string" => "foo")
      type = _obj.type; // type defined from the input name in :type colon notation
      if (!type) type = f.attrFromInputWithName($form, name, 'data-value-type');
      f.validateType(name, type, opts); // make sure that the type is one of the valid types if defined

      if (type !== 'skip') { // ignore inputs with type 'skip'
        keys = f.splitInputNameIntoKeysArray(nameWithNoType);
        parsedValue = f.parseValue(value, name, type, opts); // convert to string, number, boolean, null or customType

        skipFalsy = !parsedValue && f.shouldSkipFalsy($form, name, nameWithNoType, type, opts); // ignore falsy inputs if specified
        if (!skipFalsy) {
          f.deepSet(serializedObject, keys, parsedValue, opts);
        }
      }
    });
    return serializedObject;
  };

  // Use $.serializeJSON as namespace for the auxiliar functions
  // and to define defaults
  $.serializeJSON = {

    defaultOptions: {
      checkboxUncheckedValue: undefined, // to include that value for unchecked checkboxes (instead of ignoring them)

      parseNumbers: false, // convert values like "1", "-2.33" to 1, -2.33
      parseBooleans: false, // convert "true", "false" to true, false
      parseNulls: false, // convert "null" to null
      parseAll: false, // all of the above
      parseWithFunction: null, // to use custom parser, a function like: function(val){ return parsed_val; }

      skipFalsyValuesForTypes: [], // skip serialization of falsy values for listed value types
      skipFalsyValuesForFields: [], // skip serialization of falsy values for listed field names

      customTypes: {}, // override defaultTypes
      defaultTypes: {
        "string":  function(str) { return String(str); },
        "number":  function(str) { return Number(str); },
        "boolean": function(str) { var falses = ["false", "null", "undefined", "", "0"]; return falses.indexOf(str) === -1; },
        "null":    function(str) { var falses = ["false", "null", "undefined", "", "0"]; return falses.indexOf(str) === -1 ? str : null; },
        "array":   function(str) { return JSON.parse(str); },
        "object":  function(str) { return JSON.parse(str); },
        "auto":    function(str) { return $.serializeJSON.parseValue(str, null, null, {parseNumbers: true, parseBooleans: true, parseNulls: true}); }, // try again with something like "parseAll"
        "skip":    null // skip is a special type that makes it easy to ignore elements
      },

      useIntKeysAsArrayIndex: false // name="foo[2]" value="v" => {foo: [null, null, "v"]}, instead of {foo: ["2": "v"]}
    },

    // Merge option defaults into the options
    setupOpts: function(options) {
      var opt, validOpts, defaultOptions, optWithDefault, parseAll, f;
      f = $.serializeJSON;

      if (options == null) { options = {}; }   // options ||= {}
      defaultOptions = f.defaultOptions || {}; // defaultOptions

      // Make sure that the user didn't misspell an option
      validOpts = ['checkboxUncheckedValue', 'parseNumbers', 'parseBooleans', 'parseNulls', 'parseAll', 'parseWithFunction', 'skipFalsyValuesForTypes', 'skipFalsyValuesForFields', 'customTypes', 'defaultTypes', 'useIntKeysAsArrayIndex']; // re-define because the user may override the defaultOptions
      for (opt in options) {
        if (validOpts.indexOf(opt) === -1) {
          throw new  Error("serializeJSON ERROR: invalid option '" + opt + "'. Please use one of " + validOpts.join(', '));
        }
      }

      // Helper to get the default value for this option if none is specified by the user
      optWithDefault = function(key) { return (options[key] !== false) && (options[key] !== '') && (options[key] || defaultOptions[key]); };

      // Return computed options (opts to be used in the rest of the script)
      parseAll = optWithDefault('parseAll');
      return {
        checkboxUncheckedValue:    optWithDefault('checkboxUncheckedValue'),

        parseNumbers:  parseAll || optWithDefault('parseNumbers'),
        parseBooleans: parseAll || optWithDefault('parseBooleans'),
        parseNulls:    parseAll || optWithDefault('parseNulls'),
        parseWithFunction:         optWithDefault('parseWithFunction'),

        skipFalsyValuesForTypes:   optWithDefault('skipFalsyValuesForTypes'),
        skipFalsyValuesForFields:  optWithDefault('skipFalsyValuesForFields'),
        typeFunctions: $.extend({}, optWithDefault('defaultTypes'), optWithDefault('customTypes')),

        useIntKeysAsArrayIndex: optWithDefault('useIntKeysAsArrayIndex')
      };
    },

    // Given a string, apply the type or the relevant "parse" options, to return the parsed value
    parseValue: function(valStr, inputName, type, opts) {
      var f, parsedVal;
      f = $.serializeJSON;
      parsedVal = valStr; // if no parsing is needed, the returned value will be the same

      if (opts.typeFunctions && type && opts.typeFunctions[type]) { // use a type if available
        parsedVal = opts.typeFunctions[type](valStr);
      } else if (opts.parseNumbers  && f.isNumeric(valStr)) { // auto: number
        parsedVal = Number(valStr);
      } else if (opts.parseBooleans && (valStr === "true" || valStr === "false")) { // auto: boolean
        parsedVal = (valStr === "true");
      } else if (opts.parseNulls    && valStr == "null") { // auto: null
        parsedVal = null;
      }
      if (opts.parseWithFunction && !type) { // custom parse function (apply after previous parsing options, but not if there's a specific type)
        parsedVal = opts.parseWithFunction(parsedVal, inputName);
      }

      return parsedVal;
    },

    isObject:          function(obj) { return obj === Object(obj); }, // is it an Object?
    isUndefined:       function(obj) { return obj === void 0; }, // safe check for undefined values
    isValidArrayIndex: function(val) { return /^[0-9]+$/.test(String(val)); }, // 1,2,3,4 ... are valid array indexes
    isNumeric:         function(obj) { return obj - parseFloat(obj) >= 0; }, // taken from jQuery.isNumeric implementation. Not using jQuery.isNumeric to support old jQuery and Zepto versions

    optionKeys: function(obj) { if (Object.keys) { return Object.keys(obj); } else { var key, keys = []; for(key in obj){ keys.push(key); } return keys;} }, // polyfill Object.keys to get option keys in IE<9


    // Fill the formAsArray object with values for the unchecked checkbox inputs,
    // using the same format as the jquery.serializeArray function.
    // The value of the unchecked values is determined from the opts.checkboxUncheckedValue
    // and/or the data-unchecked-value attribute of the inputs.
    readCheckboxUncheckedValues: function (formAsArray, opts, $form) {
      var selector, $uncheckedCheckboxes, $el, uncheckedValue, f, name;
      if (opts == null) { opts = {}; }
      f = $.serializeJSON;

      selector = 'input[type=checkbox][name]:not(:checked):not([disabled])';
      $uncheckedCheckboxes = $form.find(selector).add($form.filter(selector));
      $uncheckedCheckboxes.each(function (i, el) {
        // Check data attr first, then the option
        $el = $(el);
        uncheckedValue = $el.attr('data-unchecked-value');
        if (uncheckedValue == null) {
          uncheckedValue = opts.checkboxUncheckedValue;
        }

        // If there's an uncheckedValue, push it into the serialized formAsArray
        if (uncheckedValue != null) {
          if (el.name && el.name.indexOf("[][") !== -1) { // identify a non-supported
            throw new Error("serializeJSON ERROR: checkbox unchecked values are not supported on nested arrays of objects like '"+el.name+"'. See https://github.com/marioizquierdo/jquery.serializeJSON/issues/67");
          }
          formAsArray.push({name: el.name, value: uncheckedValue});
        }
      });
    },

    // Returns and object with properties {name_without_type, type} from a given name.
    // The type is null if none specified. Example:
    //   "foo"           =>  {nameWithNoType: "foo",      type:  null}
    //   "foo:boolean"   =>  {nameWithNoType: "foo",      type: "boolean"}
    //   "foo[bar]:null" =>  {nameWithNoType: "foo[bar]", type: "null"}
    extractTypeAndNameWithNoType: function(name) {
      var match;
      if (match = name.match(/(.*):([^:]+)$/)) {
        return {nameWithNoType: match[1], type: match[2]};
      } else {
        return {nameWithNoType: name, type: null};
      }
    },


    // Check if this input should be skipped when it has a falsy value,
    // depending on the options to skip values by name or type, and the data-skip-falsy attribute.
    shouldSkipFalsy: function($form, name, nameWithNoType, type, opts) {
      var f = $.serializeJSON;
      
      var skipFromDataAttr = f.attrFromInputWithName($form, name, 'data-skip-falsy');
      if (skipFromDataAttr != null) {
        return skipFromDataAttr !== 'false'; // any value is true, except if explicitly using 'false' 
      }

      var optForFields = opts.skipFalsyValuesForFields;
      if (optForFields && (optForFields.indexOf(nameWithNoType) !== -1 || optForFields.indexOf(name) !== -1)) {
        return true;
      }
      
      var optForTypes = opts.skipFalsyValuesForTypes;
      if (type == null) type = 'string'; // assume fields with no type are targeted as string
      if (optForTypes && optForTypes.indexOf(type) !== -1) {
        return true
      }

      return false;
    },

    // Finds the first input in $form with this name, and get the given attr from it.
    // Returns undefined if no input or no attribute was found.
    attrFromInputWithName: function($form, name, attrName) {
      var escapedName, selector, $input, attrValue;
      escapedName = name.replace(/(:|\.|\[|\]|\s)/g,'\\$1'); // every non-standard character need to be escaped by \\
      selector = '[name="' + escapedName + '"]';
      $input = $form.find(selector).add($form.filter(selector)); // NOTE: this returns only the first $input element if multiple are matched with the same name (i.e. an "array[]"). So, arrays with different element types specified through the data-value-type attr is not supported.
      return $input.attr(attrName);
    },

    // Raise an error if the type is not recognized.
    validateType: function(name, type, opts) {
      var validTypes, f;
      f = $.serializeJSON;
      validTypes = f.optionKeys(opts ? opts.typeFunctions : f.defaultOptions.defaultTypes);
      if (!type || validTypes.indexOf(type) !== -1) {
        return true;
      } else {
        throw new Error("serializeJSON ERROR: Invalid type " + type + " found in input name '" + name + "', please use one of " + validTypes.join(', '));
      }
    },


    // Split the input name in programatically readable keys.
    // Examples:
    // "foo"              => ['foo']
    // "[foo]"            => ['foo']
    // "foo[inn][bar]"    => ['foo', 'inn', 'bar']
    // "foo[inn[bar]]"    => ['foo', 'inn', 'bar']
    // "foo[inn][arr][0]" => ['foo', 'inn', 'arr', '0']
    // "arr[][val]"       => ['arr', '', 'val']
    splitInputNameIntoKeysArray: function(nameWithNoType) {
      var keys, f;
      f = $.serializeJSON;
      keys = nameWithNoType.split('['); // split string into array
      keys = $.map(keys, function (key) { return key.replace(/\]/g, ''); }); // remove closing brackets
      if (keys[0] === '') { keys.shift(); } // ensure no opening bracket ("[foo][inn]" should be same as "foo[inn]")
      return keys;
    },

    // Set a value in an object or array, using multiple keys to set in a nested object or array:
    //
    // deepSet(obj, ['foo'], v)               // obj['foo'] = v
    // deepSet(obj, ['foo', 'inn'], v)        // obj['foo']['inn'] = v // Create the inner obj['foo'] object, if needed
    // deepSet(obj, ['foo', 'inn', '123'], v) // obj['foo']['arr']['123'] = v //
    //
    // deepSet(obj, ['0'], v)                                   // obj['0'] = v
    // deepSet(arr, ['0'], v, {useIntKeysAsArrayIndex: true})   // arr[0] = v
    // deepSet(arr, [''], v)                                    // arr.push(v)
    // deepSet(obj, ['arr', ''], v)                             // obj['arr'].push(v)
    //
    // arr = [];
    // deepSet(arr, ['', v]          // arr => [v]
    // deepSet(arr, ['', 'foo'], v)  // arr => [v, {foo: v}]
    // deepSet(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}]
    // deepSet(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}, {bar: v}]
    //
    deepSet: function (o, keys, value, opts) {
      var key, nextKey, tail, lastIdx, lastVal, f;
      if (opts == null) { opts = {}; }
      f = $.serializeJSON;
      if (f.isUndefined(o)) { throw new Error("ArgumentError: param 'o' expected to be an object or array, found undefined"); }
      if (!keys || keys.length === 0) { throw new Error("ArgumentError: param 'keys' expected to be an array with least one element"); }

      key = keys[0];

      // Only one key, then it's not a deepSet, just assign the value.
      if (keys.length === 1) {
        if (key === '') {
          o.push(value); // '' is used to push values into the array (assume o is an array)
        } else {
          o[key] = value; // other keys can be used as object keys or array indexes
        }

      // With more keys is a deepSet. Apply recursively.
      } else {
        nextKey = keys[1];

        // '' is used to push values into the array,
        // with nextKey, set the value into the same object, in object[nextKey].
        // Covers the case of ['', 'foo'] and ['', 'var'] to push the object {foo, var}, and the case of nested arrays.
        if (key === '') {
          lastIdx = o.length - 1; // asume o is array
          lastVal = o[lastIdx];
          if (f.isObject(lastVal) && (f.isUndefined(lastVal[nextKey]) || keys.length > 2)) { // if nextKey is not present in the last object element, or there are more keys to deep set
            key = lastIdx; // then set the new value in the same object element
          } else {
            key = lastIdx + 1; // otherwise, point to set the next index in the array
          }
        }

        // '' is used to push values into the array "array[]"
        if (nextKey === '') {
          if (f.isUndefined(o[key]) || !$.isArray(o[key])) {
            o[key] = []; // define (or override) as array to push values
          }
        } else {
          if (opts.useIntKeysAsArrayIndex && f.isValidArrayIndex(nextKey)) { // if 1, 2, 3 ... then use an array, where nextKey is the index
            if (f.isUndefined(o[key]) || !$.isArray(o[key])) {
              o[key] = []; // define (or override) as array, to insert values using int keys as array indexes
            }
          } else { // for anything else, use an object, where nextKey is going to be the attribute name
            if (f.isUndefined(o[key]) || !f.isObject(o[key])) {
              o[key] = {}; // define (or override) as object, to set nested properties
            }
          }
        }

        // Recursively set the inner object
        tail = keys.slice(1);
        f.deepSet(o[key], tail, value, opts);
      }
    }

  };

}));

/*!
 * jQuery Validation Plugin v1.16.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2016 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery"], factory );
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory( require( "jquery" ) );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

$.extend( $.fn, {

	// http://jqueryvalidation.org/validate/
	validate: function( options ) {

		// If nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// Check if a validator for this form was already created
		var validator = $.data( this[ 0 ], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[ 0 ] );
		$.data( this[ 0 ], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.on( "click.validate", ":submit", function( event ) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = event.target;
				}

				// Allow suppressing validation by adding a cancel class to the submit button
				if ( $( this ).hasClass( "cancel" ) ) {
					validator.cancelSubmit = true;
				}

				// Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
				if ( $( this ).attr( "formnovalidate" ) !== undefined ) {
					validator.cancelSubmit = true;
				}
			} );

			// Validate the form on submit
			this.on( "submit.validate", function( event ) {
				if ( validator.settings.debug ) {

					// Prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden, result;
					if ( validator.settings.submitHandler ) {
						if ( validator.submitButton ) {

							// Insert a hidden input as a replacement for the missing submit button
							hidden = $( "<input type='hidden'/>" )
								.attr( "name", validator.submitButton.name )
								.val( $( validator.submitButton ).val() )
								.appendTo( validator.currentForm );
						}
						result = validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( validator.submitButton ) {

							// And clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						if ( result !== undefined ) {
							return result;
						}
						return false;
					}
					return true;
				}

				// Prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			} );
		}

		return validator;
	},

	// http://jqueryvalidation.org/valid/
	valid: function() {
		var valid, validator, errorList;

		if ( $( this[ 0 ] ).is( "form" ) ) {
			valid = this.validate().form();
		} else {
			errorList = [];
			valid = true;
			validator = $( this[ 0 ].form ).validate();
			this.each( function() {
				valid = validator.element( this ) && valid;
				if ( !valid ) {
					errorList = errorList.concat( validator.errorList );
				}
			} );
			validator.errorList = errorList;
		}
		return valid;
	},

	// http://jqueryvalidation.org/rules/
	rules: function( command, argument ) {
		var element = this[ 0 ],
			settings, staticRules, existingRules, data, param, filtered;

		// If nothing is selected, return empty object; can't chain anyway
		if ( element == null || element.form == null ) {
			return;
		}

		if ( command ) {
			settings = $.data( element.form, "validator" ).settings;
			staticRules = settings.rules;
			existingRules = $.validator.staticRules( element );
			switch ( command ) {
			case "add":
				$.extend( existingRules, $.validator.normalizeRule( argument ) );

				// Remove messages from rules, but allow them to be set separately
				delete existingRules.messages;
				staticRules[ element.name ] = existingRules;
				if ( argument.messages ) {
					settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[ element.name ];
					return existingRules;
				}
				filtered = {};
				$.each( argument.split( /\s/ ), function( index, method ) {
					filtered[ method ] = existingRules[ method ];
					delete existingRules[ method ];
					if ( method === "required" ) {
						$( element ).removeAttr( "aria-required" );
					}
				} );
				return filtered;
			}
		}

		data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules( element ),
			$.validator.attributeRules( element ),
			$.validator.dataRules( element ),
			$.validator.staticRules( element )
		), element );

		// Make sure required is at front
		if ( data.required ) {
			param = data.required;
			delete data.required;
			data = $.extend( { required: param }, data );
			$( element ).attr( "aria-required", "true" );
		}

		// Make sure remote is at back
		if ( data.remote ) {
			param = data.remote;
			delete data.remote;
			data = $.extend( data, { remote: param } );
		}

		return data;
	}
} );

// Custom selectors
$.extend( $.expr.pseudos || $.expr[ ":" ], {		// '|| $.expr[ ":" ]' here enables backwards compatibility to jQuery 1.7. Can be removed when dropping jQ 1.7.x support

	// http://jqueryvalidation.org/blank-selector/
	blank: function( a ) {
		return !$.trim( "" + $( a ).val() );
	},

	// http://jqueryvalidation.org/filled-selector/
	filled: function( a ) {
		var val = $( a ).val();
		return val !== null && !!$.trim( "" + val );
	},

	// http://jqueryvalidation.org/unchecked-selector/
	unchecked: function( a ) {
		return !$( a ).prop( "checked" );
	}
} );

// Constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

// http://jqueryvalidation.org/jQuery.validator.format/
$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray( arguments );
			args.unshift( source );
			return $.validator.format.apply( this, args );
		};
	}
	if ( params === undefined ) {
		return source;
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray( arguments ).slice( 1 );
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each( params, function( i, n ) {
		source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
			return n;
		} );
	} );
	return source;
};

$.extend( $.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		pendingClass: "pending",
		validClass: "valid",
		errorElement: "label",
		focusCleanup: false,
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element ) {
			this.lastActive = element;

			// Hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.hideThese( this.errorsFor( element ) );
			}
		},
		onfocusout: function( element ) {
			/*if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
				this.element( element );
			}*/
		},
		onkeyup: function( element, event ) {

			// Avoid revalidate the field when pressing one of the following keys
			// Shift       => 16
			// Ctrl        => 17
			// Alt         => 18
			// Caps lock   => 20
			// End         => 35
			// Home        => 36
			// Left arrow  => 37
			// Up arrow    => 38
			// Right arrow => 39
			// Down arrow  => 40
			// Insert      => 45
			// Num lock    => 144
			// AltGr key   => 225
			/*var excludedKeys = [
				16, 17, 18, 20, 35, 36, 37,
				38, 39, 40, 45, 144, 225
			];

			if ( event.which === 9 && this.elementValue( element ) === "" || $.inArray( event.keyCode, excludedKeys ) !== -1 ) {
				return;
			} else if ( element.name in this.submitted || element.name in this.invalid ) {
				this.element( element );
			}*/
		},
		onclick: function( element ) {

			// Click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element( element );

			// Or option elements, check parent select in that case
			} else if ( element.parentNode.name in this.submitted ) {
				this.element( element.parentNode );
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
			} else {
				$( element ).addClass( errorClass ).removeClass( validClass );
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
			} else {
				$( element ).removeClass( errorClass ).addClass( validClass );
			}
		}
	},

	// http://jqueryvalidation.org/jQuery.validator.setDefaults/
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "[{0}] 不能为空",
		remote: "请修正此字段",
		email: "[{0}]必须输入正确格式的电子邮件",
		url: "请输入有效的网址",
		date: "请输入有效的日期",
		dateISO: "请输入有效的日期 (YYYY-MM-DD)",
		number: "[{0}]必须输入合法的数字（负数，小数）",
		int: "[{0}]必须输入整数",
		equalTo: "你的输入不相同",
		extension: "请输入有效的后缀",
		maxlength: $.validator.format( "输入长度最多是 {0} 的字符串（汉字算一个字符）。" ),
		minlength: $.validator.format( "最少要输入 {0} 个字符" ),
		rangelength: $.validator.format( "请输入长度在 {0} 到 {1} 之间的字符串" ),
		range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
		max: $.validator.format("请输入不大于 {0} 的数值"),
		min: $.validator.format("请输入不小于 {0} 的数值"),
		step: $.validator.format( "Please enter a multiple of {0}." )
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $( this.settings.errorLabelContainer );
			this.errorContext = this.labelContainer.length && this.labelContainer || $( this.currentForm );
			this.containers = $( this.settings.errorContainer ).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = ( this.groups = {} ),
				rules;
			$.each( this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split( /\s/ );
				}
				$.each( value, function( index, name ) {
					groups[ name ] = key;
				} );
			} );
			rules = this.settings.rules;
			$.each( rules, function( key, value ) {
				rules[ key ] = $.validator.normalizeRule( value );
			} );

			function delegate( event ) {

				// Set form expando on contenteditable
				if ( !this.form && this.hasAttribute( "contenteditable" ) ) {
					this.form = $( this ).closest( "form" )[ 0 ];
				}

				var validator = $.data( this.form, "validator" ),
					eventType = "on" + event.type.replace( /^validate/, "" ),
					settings = validator.settings;
				if ( settings[ eventType ] && !$( this ).is( settings.ignore ) ) {
					settings[ eventType ].call( validator, this, event );
				}
			}

			$( this.currentForm )
				.on( "focusin.validate focusout.validate keyup.validate",
					":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
					"[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
					"[type='radio'], [type='checkbox'], [contenteditable], [type='button']", delegate )

				// Support: Chrome, oldIE
				// "select" is provided as event.target when clicking a option
				.on( "click.validate", "select, option, [type='radio'], [type='checkbox']", delegate );

			if ( this.settings.invalidHandler ) {
				$( this.currentForm ).on( "invalid-form.validate", this.settings.invalidHandler );
			}

			// Add aria-required to any Static/Data/Class required fields before first validation
			// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
			$( this.currentForm ).find( "[required], [data-rule-required], .required" ).attr( "aria-required", "true" );
		},

		// http://jqueryvalidation.org/Validator.form/
		form: function() {
			this.checkForm();
			$.extend( this.submitted, this.errorMap );
			this.invalid = $.extend( {}, this.errorMap );
			if ( !this.valid() ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ] );
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = ( this.currentElements = this.elements() ); elements[ i ]; i++ ) {
				this.check( elements[ i ] );
			}
			return this.valid();
		},

		// http://jqueryvalidation.org/Validator.element/
		element: function( element ) {
			var cleanElement = this.clean( element ),
				checkElement = this.validationTargetFor( cleanElement ),
				v = this,
				result = true,
				rs, group;

			if ( checkElement === undefined ) {
				delete this.invalid[ cleanElement.name ];
			} else {
				this.prepareElement( checkElement );
				this.currentElements = $( checkElement );

				// If this element is grouped, then validate all group elements already
				// containing a value
				group = this.groups[ checkElement.name ];
				if ( group ) {
					$.each( this.groups, function( name, testgroup ) {
						if ( testgroup === group && name !== checkElement.name ) {
							cleanElement = v.validationTargetFor( v.clean( v.findByName( name ) ) );
							if ( cleanElement && cleanElement.name in v.invalid ) {
								v.currentElements.push( cleanElement );
								result = v.check( cleanElement ) && result;
							}
						}
					} );
				}

				rs = this.check( checkElement ) !== false;
				result = result && rs;
				if ( rs ) {
					this.invalid[ checkElement.name ] = false;
				} else {
					this.invalid[ checkElement.name ] = true;
				}

				if ( !this.numberOfInvalids() ) {

					// Hide error containers on last error
					this.toHide = this.toHide.add( this.containers );
				}
				this.showErrors();

				// Add aria-invalid status for screen readers
				$( element ).attr( "aria-invalid", !rs );
			}

			return result;
		},

		// http://jqueryvalidation.org/Validator.showErrors/
		showErrors: function( errors ) {
			if ( errors ) {
				var validator = this;

				// Add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = $.map( this.errorMap, function( message, name ) {
					return {
						message: message,
						element: validator.findByName( name )[ 0 ]
					};
				} );

				// Remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !( element.name in errors );
				} );
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://jqueryvalidation.org/Validator.resetForm/
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$( this.currentForm ).resetForm();
			}
			this.invalid = {};
			this.submitted = {};
			this.prepareForm();
			this.hideErrors();
			var elements = this.elements()
				.removeData( "previousValue" )
				.removeAttr( "aria-invalid" );

			this.resetElements( elements );
		},

		resetElements: function( elements ) {
			var i;

			if ( this.settings.unhighlight ) {
				for ( i = 0; elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ],
						this.settings.errorClass, "" );
					this.findByName( elements[ i ].name ).removeClass( this.settings.validClass );
				}
			} else {
				elements
					.removeClass( this.settings.errorClass )
					.removeClass( this.settings.validClass );
			}
		},

		numberOfInvalids: function() {
			return this.objectLength( this.invalid );
		},

		objectLength: function( obj ) {
			/* jshint unused: false */
			var count = 0,
				i;
			for ( i in obj ) {
				if ( obj[ i ] ) {
					count++;
				}
			}
			return count;
		},

		hideErrors: function() {
			this.hideThese( this.toHide );
		},

		hideThese: function( errors ) {
			errors.not( this.containers ).text( "" );
			this.addWrapper( errors ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$( this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [] )
					.filter( ":visible" )
					.focus()

					// Manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger( "focusin" );
				} catch ( e ) {

					// Ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep( this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			} ).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// Select all valid inputs inside the form (no submit or reset buttons)
			return $( this.currentForm )
			.find( "input, select, textarea, [contenteditable]" )
			.not( ":submit, :reset, :image, :disabled" )
			.not( this.settings.ignore )
			.filter( function() {
				var name = this.name || $( this ).attr( "name" ); // For contenteditable
				if ( !name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this );
				}

				// Set form expando on contenteditable
				if ( this.hasAttribute( "contenteditable" ) ) {
					this.form = $( this ).closest( "form" )[ 0 ];
				}

				// Select only the first element for each name, and only those with rules specified
				if ( name in rulesCache || !validator.objectLength( $( this ).rules() ) ) {
					return false;
				}

				rulesCache[ name ] = true;
				return true;
			} );
		},

		clean: function( selector ) {
			return $( selector )[ 0 ];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.split( " " ).join( "." );
			return $( this.settings.errorElement + "." + errorClass, this.errorContext );
		},

		resetInternals: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $( [] );
			this.toHide = $( [] );
		},

		reset: function() {
			this.resetInternals();
			this.currentElements = $( [] );
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor( element );
		},

		elementValue: function( element ) {
			var $element = $( element ),
				type = element.type,
				val, idx;

			if ( type === "radio" || type === "checkbox" ) {
				return this.findByName( element.name ).filter( ":checked" ).val();
			} else if ( type === "number" && typeof element.validity !== "undefined" ) {
				return element.validity.badInput ? "NaN" : $element.val();
			}

			if ( element.hasAttribute( "contenteditable" ) ) {
				val = $element.text();
			} else {
				val = $element.val();
			}

			if ( type === "file" ) {

				// Modern browser (chrome & safari)
				if ( val.substr( 0, 12 ) === "C:\\fakepath\\" ) {
					return val.substr( 12 );
				}

				// Legacy browsers
				// Unix-based path
				idx = val.lastIndexOf( "/" );
				if ( idx >= 0 ) {
					return val.substr( idx + 1 );
				}

				// Windows-based path
				idx = val.lastIndexOf( "\\" );
				if ( idx >= 0 ) {
					return val.substr( idx + 1 );
				}

				// Just the file name
				return val;
			}

			if ( typeof val === "string" ) {
				return val.replace( /\r/g, "" );
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $( element ).rules(),
				rulesCount = $.map( rules, function( n, i ) {
					return i;
				} ).length,
				dependencyMismatch = false,
				val = this.elementValue( element ),
				result, method, rule;

			// If a normalizer is defined for this element, then
			// call it to retreive the changed value instead
			// of using the real one.
			// Note that `this` in the normalizer is `element`.
			if ( typeof rules.normalizer === "function" ) {
				val = rules.normalizer.call( element, val );

				if ( typeof val !== "string" ) {
					throw new TypeError( "The normalizer should return a string value." );
				}

				// Delete the normalizer from rules to avoid treating
				// it as a pre-defined method.
				delete rules.normalizer;
			}

			for ( method in rules ) {
				rule = { method: method, parameters: rules[ method ] };
				try {
					result = $.validator.methods[ method ].call( this, val, element, rule.parameters );

					// If a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" && rulesCount === 1 ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor( element ) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch ( e ) {
					if ( this.settings.debug && window.console ) {
						console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					if ( e instanceof TypeError ) {
						e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
					}

					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength( rules ) ) {
				this.successList.push( element );
			}
			return true;
		},

		// Return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		// return the generic message if present and no method specific message is present
		customDataMessage: function( element, method ) {
			return $( element ).data( "msg" + method.charAt( 0 ).toUpperCase() +
				method.substring( 1 ).toLowerCase() ) || $( element ).data( "msg" );
		},

		// Return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[ name ];
			return m && ( m.constructor === String ? m : m[ method ] );
		},

		// Return the first defined argument, allowing empty strings
		findDefined: function() {
			for ( var i = 0; i < arguments.length; i++ ) {
				if ( arguments[ i ] !== undefined ) {
					return arguments[ i ];
				}
			}
			return undefined;
		},

		// The second parameter 'rule' used to be a string, and extended to an object literal
		// of the following form:
		// rule = {
		//     method: "method name",
		//     parameters: "the given method parameters"
		// }
		//
		// The old behavior still supported, kept to maintain backward compatibility with
		// old code, and will be removed in the next major release.
		defaultMessage: function( element, rule ) {
			if ( typeof rule === "string" ) {
				rule = { method: rule };
			}

			/*var message = this.findDefined(
					this.customMessage( element.name, rule.method ),
					this.customDataMessage( element, rule.method ),

					// 'title' is never undefined, so handle empty string as undefined
					!this.settings.ignoreTitle && element.title || undefined,
					$.validator.messages[ rule.method ],
					"<strong>Warning: No message defined for " + element.name + "</strong>"
				),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call( this, rule.parameters, element );
			} else if ( theregex.test( message ) ) {
				message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
			}*/

			var message =  $.validator.messages[ rule.method ],theregex = /\$?\{(\d+)\}/g;
			rule.parameters = [element.title || element.name];
			message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
			return message;
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule );

			this.errorList.push( {
				message: message,
				element: element,
				method: rule.method
			} );

			this.errorMap[ element.name ] = message;
			this.submitted[ element.name ] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements, error;
			for ( i = 0; this.errorList[ i ]; i++ ) {
				error = this.errorList[ i ];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
				//卓 只校验一个
				break;
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[ i ]; i++ ) {
					this.showLabel( this.successList[ i ] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not( this.invalidElements() );
		},

		invalidElements: function() {
			return $( this.errorList ).map( function() {
				return this.element;
			} );
		},

		showLabel: function( element, message ) {
			var place, group, errorID, v,
				error = this.errorsFor( element ),
				elementID = this.idOrName( element ),
				describedBy = $( element ).attr( "aria-describedby" );
			alert(message);
			element.focus(); 

		},

		errorsFor: function( element ) {
			var name = this.escapeCssMeta( this.idOrName( element ) ),
				describer = $( element ).attr( "aria-describedby" ),
				selector = "label[for='" + name + "'], label[for='" + name + "'] *";

			// 'aria-describedby' should directly reference the error element
			if ( describer ) {
				selector = selector + ", #" + this.escapeCssMeta( describer )
					.replace( /\s+/g, ", #" );
			}

			return this
				.errors()
				.filter( selector );
		},

		// See https://api.jquery.com/category/selectors/, for CSS
		// meta-characters that should be escaped in order to be used with JQuery
		// as a literal part of a name/id or any selector.
		escapeCssMeta: function( string ) {
			return string.replace( /([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1" );
		},

		idOrName: function( element ) {
			return this.groups[ element.name ] || ( this.checkable( element ) ? element.name : element.id || element.name );
		},

		validationTargetFor: function( element ) {

			// If radio/checkbox, validate first element in group instead
			if ( this.checkable( element ) ) {
				element = this.findByName( element.name );
			}

			// Always apply ignore filter
			return $( element ).not( this.settings.ignore )[ 0 ];
		},

		checkable: function( element ) {
			return ( /radio|checkbox/i ).test( element.type );
		},

		findByName: function( name ) {
			return $( this.currentForm ).find( "[name='" + this.escapeCssMeta( name ) + "']" );
		},

		getLength: function( value, element ) {
			switch ( element.nodeName.toLowerCase() ) {
			case "select":
				return $( "option:selected", element ).length;
			case "input":
				if ( this.checkable( element ) ) {
					return this.findByName( element.name ).filter( ":checked" ).length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[ typeof param ] ? this.dependTypes[ typeof param ]( param, element ) : true;
		},

		dependTypes: {
			"boolean": function( param ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$( param, element.form ).length;
			},
			"function": function( param, element ) {
				return param( element );
			}
		},

		optional: function( element ) {
			var val = this.elementValue( element );
			return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
		},

		startRequest: function( element ) {
			if ( !this.pending[ element.name ] ) {
				this.pendingRequest++;
				$( element ).addClass( this.settings.pendingClass );
				this.pending[ element.name ] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;

			// Sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[ element.name ];
			$( element ).removeClass( this.settings.pendingClass );
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$( this.currentForm ).submit();
				this.formSubmitted = false;
			} else if ( !valid && this.pendingRequest === 0 && this.formSubmitted ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ] );
				this.formSubmitted = false;
			}
		},

		previousValue: function( element, method ) {
			method = typeof method === "string" && method || "remote";

			return $.data( element, "previousValue" ) || $.data( element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, { method: method } )
			} );
		},

		// Cleans up all forms and elements, removes validator-specific events
		destroy: function() {
			this.resetForm();

			$( this.currentForm )
				.off( ".validate" )
				.removeData( "validator" )
				.find( ".validate-equalTo-blur" )
					.off( ".validate-equalTo" )
					.removeClass( "validate-equalTo-blur" );
		}

	},

	classRuleSettings: {
		required: { required: true },
		email: { email: true },
		url: { url: true },
		date: { date: true },
		dateISO: { dateISO: true },
		number: { number: true },
		int: { int: true },
		creditcard: { creditcard: true }
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[ className ] = rules;
		} else {
			$.extend( this.classRuleSettings, className );
		}
	},

	classRules: function( element ) {
		var rules = {},
			classes = $( element ).attr( "class" );

		if ( classes ) {
			$.each( classes.split( " " ), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend( rules, $.validator.classRuleSettings[ this ] );
				}
			} );
		}
		return rules;
	},

	normalizeAttributeRule: function( rules, type, method, value ) {

		// Convert the value to a number for number inputs, and for text for backwards compability
		// allows type="date" and others to be compared as strings
		if ( /min|max|step/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
			value = Number( value );

			// Support Opera Mini, which returns NaN for undefined minlength
			if ( isNaN( value ) ) {
				value = undefined;
			}
		}

		if ( value || value === 0 ) {
			rules[ method ] = value;
		} else if ( type === method && type !== "range" ) {

			// Exception: the jquery validate 'range' method
			// does not test for the html5 'range' type
			rules[ method ] = true;
		}
	},

	attributeRules: function( element ) {
		var rules = {},
			$element = $( element ),
			type = element.getAttribute( "type" ),
			method, value;

		for ( method in $.validator.methods ) {

			// Support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = element.getAttribute( method );

				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}

				// Force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr( method );
			}

			this.normalizeAttributeRule( rules, type, method, value );
		}

		// 'maxlength' may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test( rules.maxlength ) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var rules = {},
			$element = $( element ),
			type = element.getAttribute( "type" ),
			method, value;

		for ( method in $.validator.methods ) {
			value = $element.data( "rule" + method.charAt( 0 ).toUpperCase() + method.substring( 1 ).toLowerCase() );
			this.normalizeAttributeRule( rules, type, method, value );
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {},
			validator = $.data( element.form, "validator" );

		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule( validator.settings.rules[ element.name ] ) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {

		// Handle dependency check
		$.each( rules, function( prop, val ) {

			// Ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[ prop ];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch ( typeof val.depends ) {
				case "string":
					keepRule = !!$( val.depends, element.form ).length;
					break;
				case "function":
					keepRule = val.depends.call( element, element );
					break;
				}
				if ( keepRule ) {
					rules[ prop ] = val.param !== undefined ? val.param : true;
				} else {
					$.data( element.form, "validator" ).resetElements( $( element ) );
					delete rules[ prop ];
				}
			}
		} );

		// Evaluate parameters
		$.each( rules, function( rule, parameter ) {
			rules[ rule ] = $.isFunction( parameter ) && rule !== "normalizer" ? parameter( element ) : parameter;
		} );

		// Clean number parameters
		$.each( [ "minlength", "maxlength" ], function() {
			if ( rules[ this ] ) {
				rules[ this ] = Number( rules[ this ] );
			}
		} );
		$.each( [ "rangelength", "range" ], function() {
			var parts;
			if ( rules[ this ] ) {
				if ( $.isArray( rules[ this ] ) ) {
					rules[ this ] = [ Number( rules[ this ][ 0 ] ), Number( rules[ this ][ 1 ] ) ];
				} else if ( typeof rules[ this ] === "string" ) {
					parts = rules[ this ].replace( /[\[\]]/g, "" ).split( /[\s,]+/ );
					rules[ this ] = [ Number( parts[ 0 ] ), Number( parts[ 1 ] ) ];
				}
			}
		} );

		if ( $.validator.autoCreateRanges ) {

			// Auto-create ranges
			if ( rules.min != null && rules.max != null ) {
				rules.range = [ rules.min, rules.max ];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength != null && rules.maxlength != null ) {
				rules.rangelength = [ rules.minlength, rules.maxlength ];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each( data.split( /\s/ ), function() {
				transformed[ this ] = true;
			} );
			data = transformed;
		}
		return data;
	},

	// http://jqueryvalidation.org/jQuery.validator.addMethod/
	addMethod: function( name, method, message ) {
		$.validator.methods[ name ] = method;
		$.validator.messages[ name ] = message !== undefined ? message : $.validator.messages[ name ];
		if ( method.length < 3 ) {
			$.validator.addClassRules( name, $.validator.normalizeRule( name ) );
		}
	},

	// http://jqueryvalidation.org/jQuery.validator.methods/
	methods: {

		// http://jqueryvalidation.org/required-method/
		required: function( value, element, param ) {

			// Check if dependency is met
			if ( !this.depend( param, element ) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {

				// Could be an array for select-multiple or a string, both are fine this way
				var val = $( element ).val();
				return val && val.length > 0;
			}
			if ( this.checkable( element ) ) {
				return this.getLength( value, element ) > 0;
			}
			return value.length > 0;
		},

		// http://jqueryvalidation.org/email-method/
		email: function( value, element ) {

			// From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
			// Retrieved 2014-01-14
			// If you have a problem with this implementation, report a bug against the above spec
			// Or use custom methods to implement your own email validation
			return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
		},

		// http://jqueryvalidation.org/url-method/
		url: function( value, element ) {

			// Copyright (c) 2010-2013 Diego Perini, MIT licensed
			// https://gist.github.com/dperini/729294
			// see also https://mathiasbynens.be/demo/url-regex
			// modified to allow protocol-relative URLs
			return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
		},

		// http://jqueryvalidation.org/date-method/
		date: function( value, element ) {
			return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
		},

		// http://jqueryvalidation.org/dateISO-method/
		dateISO: function( value, element ) {
			return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
		},

		// http://jqueryvalidation.org/number-method/
		number: function( value, element ) {
			return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
		},

		// http://jqueryvalidation.org/digits-method/
		int: function( value, element ) {
			return this.optional( element ) || /^\d+$/.test( value );
		},

		// http://jqueryvalidation.org/minlength-method/
		minlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length >= param;
		},

		// http://jqueryvalidation.org/maxlength-method/
		maxlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length <= param;
		},

		// http://jqueryvalidation.org/rangelength-method/
		rangelength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/min-method/
		min: function( value, element, param ) {
			return this.optional( element ) || value >= param;
		},

		// http://jqueryvalidation.org/max-method/
		max: function( value, element, param ) {
			return this.optional( element ) || value <= param;
		},

		// http://jqueryvalidation.org/range-method/
		range: function( value, element, param ) {
			return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/step-method/
		step: function( value, element, param ) {
			var type = $( element ).attr( "type" ),
				errorMessage = "Step attribute on input type " + type + " is not supported.",
				supportedTypes = [ "text", "number", "range" ],
				re = new RegExp( "\\b" + type + "\\b" ),
				notSupported = type && !re.test( supportedTypes.join() ),
				decimalPlaces = function( num ) {
					var match = ( "" + num ).match( /(?:\.(\d+))?$/ );
					if ( !match ) {
						return 0;
					}

					// Number of digits right of decimal point.
					return match[ 1 ] ? match[ 1 ].length : 0;
				},
				toInt = function( num ) {
					return Math.round( num * Math.pow( 10, decimals ) );
				},
				valid = true,
				decimals;

			// Works only for text, number and range input types
			// TODO find a way to support input types date, datetime, datetime-local, month, time and week
			if ( notSupported ) {
				throw new Error( errorMessage );
			}

			decimals = decimalPlaces( param );

			// Value can't have too many decimals
			if ( decimalPlaces( value ) > decimals || toInt( value ) % toInt( param ) !== 0 ) {
				valid = false;
			}

			return this.optional( element ) || valid;
		},

		// http://jqueryvalidation.org/equalTo-method/
		equalTo: function( value, element, param ) {

			// Bind to the blur event of the target in order to revalidate whenever the target field is updated
			var target = $( param );
			if ( this.settings.onfocusout && target.not( ".validate-equalTo-blur" ).length ) {
				target.addClass( "validate-equalTo-blur" ).on( "blur.validate-equalTo", function() {
					$( element ).valid();
				} );
			}
			return value === target.val();
		},

		// http://jqueryvalidation.org/remote-method/
		remote: function( value, element, param, method ) {
			if ( this.optional( element ) ) {
				return "dependency-mismatch";
			}

			method = typeof method === "string" && method || "remote";

			var previous = this.previousValue( element, method ),
				validator, data, optionDataString;

			if ( !this.settings.messages[ element.name ] ) {
				this.settings.messages[ element.name ] = {};
			}
			previous.originalMessage = previous.originalMessage || this.settings.messages[ element.name ][ method ];
			this.settings.messages[ element.name ][ method ] = previous.message;

			param = typeof param === "string" && { url: param } || param;
			optionDataString = $.param( $.extend( { data: value }, param.data ) );
			if ( previous.old === optionDataString ) {
				return previous.valid;
			}

			previous.old = optionDataString;
			validator = this;
			this.startRequest( element );
			data = {};
			data[ element.name ] = value;
			$.ajax( $.extend( true, {
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				context: validator.currentForm,
				success: function( response ) {
					var valid = response === true || response === "true",
						errors, message, submitted;

					validator.settings.messages[ element.name ][ method ] = previous.originalMessage;
					if ( valid ) {
						submitted = validator.formSubmitted;
						validator.resetInternals();
						validator.toHide = validator.errorsFor( element );
						validator.formSubmitted = submitted;
						validator.successList.push( element );
						validator.invalid[ element.name ] = false;
						validator.showErrors();
					} else {
						errors = {};
						message = response || validator.defaultMessage( element, { method: method, parameters: value } );
						errors[ element.name ] = previous.message = message;
						validator.invalid[ element.name ] = true;
						validator.showErrors( errors );
					}
					previous.valid = valid;
					validator.stopRequest( element, valid );
				}
			}, param ) );
			return "pending";
		}
	}

} );

// Ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

var pendingRequests = {},
	ajax;

// Use a prefilter if available (1.5+)
if ( $.ajaxPrefilter ) {
	$.ajaxPrefilter( function( settings, _, xhr ) {
		var port = settings.port;
		if ( settings.mode === "abort" ) {
			if ( pendingRequests[ port ] ) {
				pendingRequests[ port ].abort();
			}
			pendingRequests[ port ] = xhr;
		}
	} );
} else {
	// Proxy ajax
	ajax = $.ajax;
	$.ajax = function( settings ) {
		var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
			port = ( "port" in settings ? settings : $.ajaxSettings ).port;
		if ( mode === "abort" ) {
			if ( pendingRequests[ port ] ) {
				pendingRequests[ port ].abort();
			}
			pendingRequests[ port ] = ajax.apply( this, arguments );
			return pendingRequests[ port ];
		}
		return ajax.apply( this, arguments );
	};
}
return $;
}));


