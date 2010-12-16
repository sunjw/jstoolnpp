var FileManager = {
	ajaxBg :null,
	multilanTitles :null,
	inputChecks :null,
	selectedItems :null,
	sortName :null,
	sortOrder :null,
	isSearch :null,
	delayID :0,
	miniMainViewHeight :120,
	isIE :null,

	/*
	 * 阻止事件浮升
	 */
	stopBubble : function(e) {
		var e = e ? e : window.event;
		if (window.event) { // IE
			e.cancelBubble = true;
		} else { // FF
			// e.preventDefault();
			e.stopPropagation();
		}
	},

	/*
	 * 什么也不做
	 */
	doNothing : function() {
		void (0);
	},

	/*
	 * 详细信息模式时，当鼠标移到项目上的操作
	 */
	detailViewItemOver : function(item) {
		var detailViewItem = $(item);
		detailViewItem.addClass("selected");
	},

	/*
	 * 详细信息模式时，当鼠标移出项目的操作
	 */
	detailViewItemOut : function(item) {
		var detailViewItem = $(item);
		var checkBox = $(detailViewItem.children().get(0)).children().get(0); // 比较笨的办法
		if (checkBox.checked != true) {
			detailViewItem.removeClass("selected");
		}
	},

	/*
	 * 大图标模式时，当鼠标移到项目上的操作
	 */
	largeiconViewItemOver : function(item) {
		var largeiconViewItem = $(item);
		largeiconViewItem.addClass("selected");
	},

	/*
	 * 大图标模式时，当鼠标移出项目的操作
	 */
	largeiconViewItemOut : function(item) {
		var largeiconViewItem = $(item);
		var checkBox = $(largeiconViewItem.children().get(0)).children().get(0); // 比较笨的办法
		if (checkBox.checked != true) {
			largeiconViewItem.removeClass("selected");
		}
	},

	/*
	 * 大图标模式时，当鼠标点击项目的操作
	 */
	largeiconViewItemClicked : function(item) {
		var largeiconViewItem = $(item);
		var checkBox = $(largeiconViewItem.children().get(0)).children().get(0); // 比较笨的办法
		if (checkBox.checked) {
			$(checkBox).removeAttr("checked");
		} else {
			$(checkBox).attr("checked", "checked");
			largeiconViewItem.addClass("selected");
		}
		FileManager.viewItemCheck();
	},

	/*
	 * 项目选择改变
	 */
	viewItemCheck : function() {
		FileManager.setButton("toolbarCut", "images/toolbar-cut-disable.gif",
				FileManager.doNothing, "disable", "");
		FileManager.setButton("toolbarCopy", "images/toolbar-copy-disable.gif",
				FileManager.doNothing, "disable", "");
		FileManager.setButton("toolbarRename",
				"images/toolbar-rename-disable.gif", FileManager.doNothing,
				"disable", "");
		FileManager.setButton("toolbarDelete",
				"images/toolbar-delete-disable.gif", FileManager.doNothing,
				"disable", "");

		var count = this.inputChecks.length;
		var checkedItemsCount = 0;
		this.selectedItems = new Array();

		for ( var i = 0; i < count; i++) {
			var checkBox = this.inputChecks.get(i);
			var item = $(checkBox.parentNode.parentNode); // CheckBox 对应的项目
			if (checkBox.checked) {
				checkedItemsCount++;
				this.selectedItems.push(checkBox.name);
				item.addClass("selected");
			} else {
				item.removeClass("selected");
			}
		}

		if (checkedItemsCount > 0) {
			FileManager.setButton("toolbarCut", "images/toolbar-cut.gif",
					FileManager.clickCut, "", "disable");
			FileManager.setButton("toolbarCopy", "images/toolbar-copy.gif",
					FileManager.clickCopy, "", "disable");
			FileManager.setButton("toolbarDelete", "images/toolbar-delete.gif",
					FileManager.clickDelete, "", "disable");
			if (checkedItemsCount == 1) {
				FileManager.setButton("toolbarRename",
						"images/toolbar-rename.gif", FileManager.clickRename,
						"", "disable");
			}
		}
	},

	/*
	 * 设置按钮
	 */
	setButton : function(className, src, clickFunc, addClass, removeClass) {
		var buttons = $("div#toolbar .toolbarButton");

		for ( var i = 0; i < buttons.length; i++) {
			var button = $(buttons.get(i));
			if (button.hasClass(className)) {
				button.get(0).onclick = clickFunc;
				if (addClass != "")
					button.addClass(addClass);
				if (removeClass != "")
					button.removeClass(removeClass);
				var img = button.children("img");
				img.attr("src", src);
			}
		}
	},

	/*
	 * 点击了重命名的操作
	 */
	clickRename : function() {
		FileManager.displayAjaxBg(true);

		FileManager.setOldname();

		FileManager.displayAjaxInput("func/post.func.php", "rename", "rename",
				true);
	},

	/*
	 * 点击了新建目录的操作
	 */
	clickNewFolder : function() {
		// alert("newfolder");
		FileManager.displayAjaxBg(true);

		FileManager.displayAjaxInput("func/post.func.php", "newfolder",
				"new folder", true);
	},

	/*
	 * 点击了剪切的操作
	 */
	clickCut : function() {
		// alert("cut");
		FileManager.sendAjaxOper("cut");
	},

	/*
	 * 点击了复制的操作
	 */
	clickCopy : function() {
		FileManager.sendAjaxOper("copy");
	},

	/*
	 * 点击了粘贴的操作
	 */
	clickPaste : function() {
		var subdir = $("input#subdir").attr("value");
		var returnURL = $("input#return").val();

		FileManager.displayAjaxBg(false);

		var ajaxWait = $("div#ajaxWait");

		ajaxWait.css("left", FileManager.getLeftMargin() + "px");
		ajaxWait.fadeIn();

		$.post("func/post.func.php", {
			"oper" :"paste",
			"subdir" :subdir,
			"return" :returnURL
			}, function(data) {
			// alert(data);
				window.location.reload();
		});
		/*
		 * $.get("func/paste.ajax.php?subdir=" + subdir + "&return=" +
		 * returnURL, function(data) { // alert(data); window.location.reload();
		 * });
		 */
	},

	/*
	 * 点击了删除的操作
	 */
	clickDelete : function() {
		FileManager.displayAjaxBg(true);

		var ajaxDelete = $("div#ajaxDelete");

		ajaxDelete.css("left", FileManager.getLeftMargin() + "px");
		ajaxDelete.fadeIn();

	},

	/*
	 * 确认删除后的操作
	 */
	doDelete : function() {
		// 准备界面
		var ajaxDelete = $("div#ajaxDelete");
		ajaxDelete.css("display", "none");

		this.ajaxBg.get(0).onclick = FileManager.doNothing;

		var ajaxWait = $("div#ajaxWait");

		ajaxWait.css("left", FileManager.getLeftMargin() + "px");
		ajaxWait.fadeIn();

		var itemsStr = this.selectedItems.join("|");

		// var subdir = $("input#subdir").val();

		$.post("func/post.func.php", {
			"oper" :"delete",
			"items" :itemsStr
			}, function(data) {
			// alert(data);
				if (data == "ok") {
					window.location.reload();
				}
		});
	},

	/*
	 * 点击了上传的操作
	 */
	clickUpload : function() {
		FileManager.displayAjaxBg(true);
		FileManager.displayAjaxInput("func/post.func.php", "upload", "upload",
				false);
	},

	/*
	 * 点击了全选的操作
	 */
	selectAll : function() {
		var count = FileManager.inputChecks.length;

		for ( var i = 0; i < count; i++) {
			var checkBox = $(FileManager.inputChecks.get(i));
			checkBox.attr("checked", "checked");
		}

		FileManager.viewItemCheck();
	},

	/*
	 * 点击了取消选择的操作
	 */
	deselect : function() {
		var count = FileManager.inputChecks.length;

		for ( var i = 0; i < count; i++) {
			var checkBox = $(FileManager.inputChecks.get(i));
			checkBox.removeAttr("checked");
		}

		FileManager.viewItemCheck();
	},

	/*
	 * 设置显示排序的箭头
	 */
	setSortArrow : function(name, order) {
		this.sortName = name;
		this.sortOrder = order;
	},

	/*
	 * 设置为搜索模式
	 */
	setSearchMode : function(isSearch) {
		this.isSearch = isSearch;
	},

	/*
	 * 获得消息
	 */
	getMessage : function() {
		$.get("func/getmessage.ajax.php", function(data) {
			if (data != "") {
				var phpfmMessage = $("#phpfmMessage");
				if (phpfmMessage.length == 1) {
					var msg;
					var stat;

					data = data.split("|PHPFM|");
					msg = data[0];
					stat = data[1];

					phpfmMessage.html(msg);
					if (stat == 2) {
						// 错误消息
				phpfmMessage.addClass("wrong");
			} else {
				phpfmMessage.removeClass("wrong");
			}

			phpfmMessage.fadeIn();
		}

		clearTimeout(this.delayID);
		this.delayID = setTimeout("FileManager.closeMessage()", 10000);
	}
}		);

	},

	/*
	 * 关闭消息
	 */
	closeMessage : function() {
		$("#phpfmMessage").fadeOut();
	},

	/*
	 * 获得左边距，使得输入部分居中
	 */
	getLeftMargin : function() {
		var viewWidth = document.documentElement.clientWidth;
		var leftMargin = (viewWidth - 420) / 2; // 居中
		return leftMargin;
	},

	/*
	 * 发送 ajax
	 */
	sendAjaxOper : function(oper) {

		var itemsStr = this.selectedItems.join("|");

		// var subdir = $("input#subdir").val();

		$.post("func/post.func.php", {
			"oper" :oper,
			"items" :itemsStr
		}, function(data) {
			if (data == "ok" && FileManager.isSearch == false) {
				FileManager.setButton("toolbarPaste",
						"images/toolbar-paste.gif", FileManager.clickPaste, "",
						"disable");
			} else {
				FileManager.setButton("toolbarPaste",
						"images/toolbar-paste-disable.gif",
						FileManager.doNothing, "disable", "");
			}
		});

		setTimeout("FileManager.getMessage()", 500);
	},

	/*
	 * 设置修改名称时的原名称
	 */
	setOldname : function() {
		$("div#oldnameLine").css("display", "block");
		var oldPathInput = $("input#renamePath");
		var oldnameInput = $("input#oldname");
		var newnameInput = $("input#newname");
		var path = this.selectedItems[0];
		oldPathInput.attr("value", path);
		var oldname = path.substring(path.lastIndexOf("/") + 1, path.length);
		oldnameInput.attr("value", oldname); // 显示原文件名
		newnameInput.attr("value", oldname);
	},

	/*
	 * 清除修改名称输入框中的原名称
	 */
	cleanOldname : function() {
		var oldnameInput = $("input#oldname");
		var newnameInput = $("input#newname");
		oldnameInput.attr("value", ""); // 显示原文件名
		newnameInput.attr("value", "");
	},

	/*
	 * 初始化 ajax
	 */
	initFuncPre : function() {
		this.ajaxBg = $("div#ajaxBg");

		var rawTitles = $("div#ajaxInput > .ajaxHeader > span");
		rawTitles = $(rawTitles[0]);
		rawTitles = rawTitles.html();
		rawTitles = rawTitles.split("|");

		this.multilanTitles = new Array();
		var count = rawTitles.length;
		var rawTitle, key, value;
		for ( var i = 0; i < count; ++i) {
			rawTitle = rawTitles[i];
			rawTitle = rawTitle.split(":");
			key = rawTitle[0];
			value = rawTitle[1];
			this.multilanTitles[key] = value;
		}

		var ajaxFuncClose = $("div.ajaxHeader > .ajaxFuncClose");
		var count = ajaxFuncClose.length;
		for ( var i = 0; i < count; i++) {
			ajaxFuncClose.get(i).onclick = FileManager.closeAjax;
		}
	},

	/*
	 * 显示 Ajax 输入的半透明背景
	 */
	displayAjaxBg : function(canClose) {
		if (canClose) {
			this.ajaxBg.get(0).onclick = FileManager.closeAjax;
		} else {
			this.ajaxBg.get(0).onclick = FileManager.doNothing;
		}
		this.ajaxBg.css("height", document.documentElement.scrollHeight + "px");
		this.ajaxBg.css("display", "block");
	},

	/*
	 * 显示 ajax 输入部分
	 */
	displayAjaxInput : function(action, oper, title, isInput) {
		var ajaxInput = $("div#ajaxInput");
		var operInput = $("input#oper");
		operInput.val(oper);
		var form = ajaxInput.children("form");
		form.attr("action", action);
		var titleSpan = ajaxInput.children("div.ajaxHeader").children("span");
		titleSpan.html(this.multilanTitles[title]);
		if (isInput) {
			// form.removeAttr("enctype");
			$("div#divInput").removeClass("ajaxHidden");
			$("div#divUpload").addClass("ajaxHidden");

		} else {
			// form.attr("enctype", "multipart/form-data");
			$("div#divInput").addClass("ajaxHidden");
			$("div#divUpload").removeClass("ajaxHidden");
		}
		ajaxInput.css("left", FileManager.getLeftMargin() + "px");
		ajaxInput.fadeIn();
		if (isInput) {
			$("input#newname").focus();
			$("input#newname").get(0).select();
		}
	},

	/*
	 * 显示 AudioPlayer
	 */
	displayAjaxAudioPlayer : function() {
		var ajaxAudioPlayer = $("div#ajaxAudioPlayer");

		ajaxAudioPlayer.css("left", FileManager.getLeftMargin() + "px");
		ajaxAudioPlayer.fadeIn();
	},

	/*
	 * 关闭 ajax 部分
	 */
	closeAjax : function() {
		var ajaxInput = $("div#ajaxInput");
		if (ajaxInput.is(":visible"))
			ajaxInput.fadeOut();

		var ajaxDelete = $("div#ajaxDelete");
		if (ajaxDelete.is(":visible"))
			ajaxDelete.fadeOut();

		$("div#oldnameLine").css("display", "none");
		FileManager.cleanOldname();
		FileManager.ajaxBg.css("display", "none");

		var ajaxAudioPlayer = $("div#ajaxAudioPlayer");
		if (ajaxAudioPlayer.is(":visible")) {
			AudioPlayer.close("pAudioPlayer"); // IE 9 has a bug on this call
			ajaxAudioPlayer.fadeOut();
		}
	},

	changeMainViewListHeight : function() {
		// 自适应 mainViewList 高度
		var mainViewList = $("div#mainViewList");
		var mainViewListOffset = mainViewList.offset();
		var footerHeight = $("div#footer").height();
		var windowHeight = $(window).height();
		var mainViewListHeight;

		if (this.isIE && $.browser.version < 8) {
			return;
		} else {
			mainViewListHeight = windowHeight - mainViewListOffset.top
					- footerHeight - 30;
			mainViewListHeight = mainViewListHeight > FileManager.miniMainViewHeight ? mainViewListHeight
					: FileManager.miniMainViewHeight;
			mainViewList.css("height", mainViewListHeight + "px");
			mainViewList.css("overflow", "auto");
		}
	},

	toolbarButtonMouseIn : function() {
		if (!$(this).hasClass("disable")) {
			$(this).css("border-bottom", "1px solid #B8D1ED");
		}
	},

	toolbarButtonMouseOut : function() {
		$(this).css("border-bottom", "1px solid white");
	},

	/*
	 * 准备工具栏
	 */
	initToolbar : function() {
		var buttons = $("div#toolbar .toolbarButton");

		if (buttons.filter(".toolbarBack").hasClass("disable")) {// 后退
			buttons.filter(".toolbarBack").find("img").attr("src",
					"images/toolbar-back-disable.gif");
		}
		if (buttons.filter(".toolbarForward").hasClass("disable")) { // 前进
			buttons.filter(".toolbarForward").find("img").attr("src",
					"images/toolbar-forward-disable.gif");
		}

		buttons.filter(".toolbarRefresh").click( function() {
			window.location.reload(); // 刷新
			});

		// buttons.filter(".toolbarSelectAll").click(FileManager.selectAll); //
		// 全选
		// buttons.filter(".toolbarDeselect").click(FileManager.deselect); //
		// 取消选择
		buttons.filter(".toolbarPaste").hasClass("disable") ? null : buttons
				.filter(".toolbarPaste").click(FileManager.clickPaste); // 粘贴

		if (FileManager.isSearch) {
			// 搜索模式
			buttons.filter(".toolbarUp").addClass("disable"); // 向上
			buttons.filter(".toolbarNewFolder").addClass("disable"); // 新建目录
			buttons.filter(".toolbarUpload").addClass("disable"); // 上传
		} else {
			// 浏览模式
			buttons.filter(".toolbarNewFolder").click(
					FileManager.clickNewFolder); // 新建目录
			buttons.filter(".toolbarUpload").click(FileManager.clickUpload); // 上传
		}

		buttons.hover(FileManager.toolbarButtonMouseIn,
				FileManager.toolbarButtonMouseOut); // 按钮 hover 时的效果

		$("#toolbar form#searchForm input[type='submit']").hover(
				FileManager.toolbarButtonMouseIn,
				FileManager.toolbarButtonMouseOut); // 按钮 hover 时的效果

		$("#mainView .header span #checkSelectAll").click( function() {
			if (this.checked)
				FileManager.selectAll();
			else
				FileManager.deselect();
		});
	},

	/*
	 * 准备主视图
	 */
	initMainView : function() {
		// changeMainViewHeight();
		FileManager.changeMainViewListHeight();
		$(window).resize(FileManager.changeMainViewListHeight);

		var detailViewItems = $("ul#detailView");
		var largeiconViewItems = $("div#largeiconView");
		if (detailViewItems.length > 0) {
			// 是详细视图
			var items = detailViewItems.children("li");
			var count = items.length;
			for ( var i = 0; i < count; i++) {
				var item = $(items.get(i));
				if (!item.hasClass("empty")) {
					var jsObj = item.get(0);
					jsObj.onmouseover = function() {
						FileManager.detailViewItemOver(this);
					};
					jsObj.onmouseout = function() {
						FileManager.detailViewItemOut(this);
					};
				}
			}
		} else if (largeiconViewItems.length > 0) {
			// 是大图标视图
			var items = largeiconViewItems.children("div.largeIconItem");
			var count = items.length;
			for ( var i = 0; i < count; i++) {
				var item = $(items.get(i));
				if (!item.hasClass("empty")) {
					var jsObj = item.get(0);
					jsObj.onmouseover = function() {
						FileManager.largeiconViewItemOver(this);
					};
					jsObj.onmouseout = function() {
						FileManager.largeiconViewItemOut(this);
					};
					jsObj.onclick = function() {
						FileManager.largeiconViewItemClicked(this);
					};
					var as = jsObj.getElementsByTagName("a");
					for ( var j = 0; j < as.length; j++) {
						var a = as[j];
						a.onclick = function(e) {
							FileManager.stopBubble(e);
						};
					}

				}
			}
		}

		this.inputChecks = $("input.inputCheck");
		var count = this.inputChecks.length;
		for ( var i = 0; i < count; i++) {
			var check = this.inputChecks.get(i);
			check.onclick = function(e) {
				FileManager.viewItemCheck();
				FileManager.stopBubble(e);
			};
		}
		FileManager.viewItemCheck();
	},

	/*
	 * 准备 AudioPlayer
	 */
	initAudioPlayer : function() {
		AudioPlayer.setup("images/player.swf", {
			width :290,
			initialvolume :100
		});

		$("a.audioPlayer").click( function() {
			var audioObj = $(this);
			var audioLink = audioObj.attr("href");
			var divFlash = $("div.flashAudioPlayer");

			// Player
				AudioPlayer.embed("pAudioPlayer", {
					soundFile :audioLink
				});
				var pLink = divFlash.find("p#link");
				pLink.html("<a href=\"" + audioLink + "\">"
						+ audioObj.attr("title") + "</a>");

				FileManager.displayAjaxBg(true);
				FileManager.displayAjaxAudioPlayer();

				return false;
			});
	},

	initMediaPreview : function() {
		// lightbox
	$('a.lightboxImg').lightBox( {
		overlayOpacity :0.5,
		autoAdapt :true
	});

	// AudioPlayer
	FileManager.initAudioPlayer();
}

}

/*
 * 初始化
 */
FileManager.init = function() {
	FileManager.isIE = $.browser.msie ? true : false;
	// alert($.browser.version);
	var str = "#mainView > .header > span." + FileManager.sortName + " > a";
	var item = $(str);
	item.addClass("sort" + FileManager.sortOrder);

	// FileManager.initFullPath();
	jqMenu.init();

	FileManager.initToolbar();

	FileManager.initMainView();

	FileManager.initFuncPre();

	FileManager.getMessage();

	FileManager.initMediaPreview();
};

// $(window).load(init); // 运行准备函数
$(FileManager.init);
