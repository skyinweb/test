var DatePicker = function(id) {
	var $el = this.$el = document.getElementById(id);
	this.now = (!$el.getAttribute('data-now') || isNaN(new Date($el.getAttribute('data-now'))))? new Date()  : new Date(new Date($el.getAttribute('data-now')));
	this.year = this.now.getFullYear();
	this.month = this.now.getMonth();
	this.day = this.now.getDate();
	var self = this;
	var reflash = function(date) {
		self.now = date;
		self.year = self.now.getFullYear();
		self.month = self.now.getMonth();
		self.day = self.now.getDate();
	}
	$el.onfocus  = function() {
		this.blur();
		var picker = document.getElementById('datePicker' + self.$el.id);
		if (picker) {
			document.body.removeChild(document.getElementById('overlay' + self.$el.id));
			document.body.removeChild(picker);
			self.setDate();
		} else {
			if ($el.getAttribute('data-now') && !isNaN(new Date($el.getAttribute('data-now')))) {
				reflash(new Date($el.getAttribute('data-now')));
			}
			self.init();
		}
	}
}

DatePicker.prototype = {
	constructor: DatePicker,
	today: new Date(),
	dateToObj: function(date) {
		return {
			year: date.getFullYear(),
			month: date.getMonth(),
			day: date.getDate()
		}
	},
	getDates: function (date) {
		var dObj = this.dateToObj(date),
			curDs = (new Date(dObj.year, dObj.month + 1, 0)).getDate(),
			preDs = (new Date(dObj.year, dObj.month, 0)).getDate(),
			nextDs = (new Date(dObj.year, dObj.month + 2, 0)).getDate(),
			wkf = (new Date(dObj.year, dObj.month, 1)).getDay(),
			wkl = (new Date(dObj.year, dObj.month + 1, 0)).getDay();
		var result = [];
		var i;
		var today = this.dateToObj(this.today);
		for (i = 0; i < wkf; i++) {
			result.push({
				cls: "unable", 
				day: preDs - wkf + i + 1
			})
		}
		for (i = 1; i <= curDs; i++) {
			result.push({
				cls: (dObj.year == today.year && dObj.month == today.month &&i == today.day) ?
					"today" :(dObj.year == this.year && dObj.month == this.month &&i == this.day) ? 
					"active" : "",
				day: i
			});
		}
		for (i = wkl + 1; i <= 6; i++) {
			result.push({
				cls: "unable",
				day: i - wkl
			});
		}
		var dateStr = "";
		var liH = "";
		for (var i = 0; i < result.length; i++) {
			liH = '<li class="' + result[i].cls + '"><a href="javaScript:">' + result[i].day + '</a></li>';
			dateStr = dateStr + liH;
		}
		return dateStr;
	},
	getMonths: function (date) {
		var result = [],
			month = date.getMonth() + 1,
			i,
			today = this.dateToObj(this.today);
		for (i = 1; i <= 12; i++) {
			result.push({
				cls: (date.getFullYear() == today.year && i == (today.month + 1)) ?
					"today" : (date.getFullYear() == this.year && i == (this.month + 1)) ?
					"active" : "",
				month: i
			});
		}
		var dateStr = "";
		var liH = "";
		for (var i = 0; i < result.length; i++) {
			liH = '<li class="' + result[i].cls + '"><a href="javaScript:">' + result[i].month + '</a></li>';
			dateStr = dateStr + liH;
		}
		var ul = '<ul class="month_list clearfix">'
				+ dateStr
				+ '</ul>';
		return ul;
	},
	getYears: function (date) {
		var result = [],
			minY = this.minYear,
			maxY = this.maxYear,
			year = date.getFullYear(),
			num = (year - 1970) % 12,
			i;
		for (i = 0; i < 12; i++) {
			result.push({
				cls: ((year - num + i) == this.today.getFullYear()) ? 
					"today" : ((year - num + i) == this.year) ? 
					"active" : "",
				year: year - num + i
			})
		}
		var dateStr = "";
		var liH = "";
		for (var i = 0; i < result.length; i++) {
			liH = '<li class="' + result[i].cls + '"><a href="javaScript:">' + result[i].year + '</a></li>';
			dateStr = dateStr + liH;
		}
		var ul = '<ul class="month_list clearfix">'
				+ dateStr
				+ '</ul>';
		return ul;
	},
	offsetL: function(e) {
		var left = e.offsetLeft;
		if (e.offsetParent) {
			left += this.offsetL(e.offsetParent);
		}
		return left;
	},
	offsetT: function(e) {
		var left = e.offsetTop;
		if (e.offsetParent) {
			left += this.offsetT(e.offsetParent);
		}
		return left;
	},
	format: function(str) {
		var  o = {
			"M+": this.month + 1,
			"d+": this.day,
			"h+": this.now.getHours() % 12 == 0 ? 12: this.now.getHours() % 12 ,
			"H+": this.now.getHours(),
			"m+": this.now.getMinutes(),
			"s+": this.now.getSeconds(),
			"q+": Math.floor((this.now.getMonth() + 3) / 3),
			"S": this.now.getMilliseconds() 
		};
		var week = {
			"0": "日",
			"1": "一",
			"2": "二",
			"3": "三",
			"4": "四",
			"5": "五",
			"6": "六"
		};
		if(/(y+)/.test(str)) {
			str = str.replace(RegExp.$1, (this.year + "").substr(4 - RegExp.$1.length));
		}
		if(/(E+)/.test(str)) {
			str = str.replace(RegExp.$1, 
				(RegExp.$1.length > 2 ? "星期" : (RegExp.$1.length > 1 ? "周" : "")) + week[this.now.getDay() +""]);
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(str)) {
				str = str.replace(RegExp.$1, (RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr((''+o[k]).length)));
			}
		}
		return str;
	},
	setDate: function() {
		if (this.$el.getAttribute('data-format')) {
			this.$el.value = this.format(this.$el.getAttribute('data-format'));
		}  else {
			this.$el.value = this.year + '-' + (this.month + 1) + '-' + this.day;
		}
		this.$el.setAttribute('data-now', this.now);
	},
	getHeader: function() {
		var pH = '<div class="picker_header clearfix" data-level="l2">' 
			+ '<a class="left" href="javaScript:">&lt;</a>'
			+ '<a class="center" href="javaScript:">' + this.year+ '年' + (this.month + 1) + '月</a>'
			+ '<a class="right" href="javaScript:">&gt;</a>'
			+ '</div>';
		return pH;
	},
	getBody: function(date) {
		var dateStr = this.getDates(date);
		var pB = '<ul class="week_list clearfix">'
			+ '<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>'
			+ '</ul>'
			+ '<ul class="date_list clearfix">'
			+ dateStr
			+ '</ul>';
		return pB;
	},
	init: function() {
		var overlay = document.createElement('div');
		var picker = document.createElement('div');
		overlay.className = "overlay";
		overlay.id = 'overlay' + this.$el.id;
		picker.id = 'datePicker' + this.$el.id;
		picker.className = "picker";
		picker.style.left = this.offsetL(this.$el) + "px";
		picker.style.top = this.offsetT(this.$el) + this.$el.offsetHeight + 1 + "px";
		var pH = this.getHeader();
		var pB = '<div class="picker_body">'
			+ this.getBody(this.now)
			+ '</div>';
		picker.innerHTML = pH + pB;
		document.body.appendChild(overlay);
		document.body.appendChild(picker);
		var self = this;
		overlay.onclick = function(e) {
			self.setDate();
			document.body.removeChild(overlay);
			document.body.removeChild(picker);
		}
		picker.children[0].onclick = function(e) {
			var src = getEventTag(e);
			switch (src.className) {
				case "center": 
					var level = src.parentElement.getAttribute("data-level");
					var text = src.innerHTML;
					if (level == "l0") {
						return false;
					} else if (level == "l1") {
						var year = parseInt(text.split("年")[0]);
						var ul = self.getYears(new Date(year, self.month, self.day));
						src.innerHTML = "请选择年份：";
						src.parentElement.setAttribute("data-level", "l0")
						picker.children[1].innerHTML = ul;
					} else if (level == "l2") {
						var year = parseInt(text.split("年")[0]);
						var ul = self.getMonths(new Date(year, self.month, self.day));
						src.innerHTML = year + "年";
						src.parentElement.setAttribute("data-level", "l1")
						picker.children[1].innerHTML = ul;
					}
					break;
				case "left":
					var level = src.parentElement.getAttribute("data-level");
					var next = src.nextElementSibling || src.nextSibling;
					var text = next.innerHTML;
					if (level == "l0") {
						var year = parseInt(picker.children[1].children[0].children[0].children[0].innerHTML);
						var ul = self.getYears(new Date(parseInt(year - 12), self.month, self.day));
						picker.children[1].innerHTML = ul;
					} else if (level == "l1") {
						var year = parseInt(text.split("年")[0]);
						var ul = self.getMonths(new Date(year - 1, self.month, self.day));
						next.innerHTML = (year - 1) + "年";
						picker.children[1].innerHTML = ul;
					} else if (level == "l2") {
						var list = text.split("年");
						var year = parseInt(list[0]);
						var month = parseInt(list[1].split("月")[0]) - 1;
						if (month == 0) {
							year = year - 1;
							month = 12;
						}
						var dateStr = self.getDates(new Date(year, month - 1, self.day));
						next.innerHTML = year + "年" + month+"月";
						picker.children[1].children[1].innerHTML = dateStr;
					}
					break;
				case "right":
					var level = src.parentElement.getAttribute("data-level");
					var pre = src.previousElementSibling || src.previousSibling;
					var text = pre.innerHTML;
					if (level == "l0") {
						var year = parseInt(picker.children[1].children[0].children[0].children[0].innerHTML);
						var ul = self.getYears(new Date(parseInt(year + 12), self.month, self.day));
						picker.children[1].innerHTML = ul;
					} else if (level == "l1") {
						var year = parseInt(text.split("年")[0]);
						var ul = self.getMonths(new Date(year + 1, self.month, self.day));
						pre.innerHTML= (year + 1) + "年";
						picker.children[1].innerHTML = ul;
					} else if (level == "l2") {
						var list = text.split("年");
						var year = parseInt(list[0])
						var month = parseInt(list[1].split("月")[0]) - 1;
						if (month == 11) {
							year = year + 1;
							month = - 1;
						}
						var dateStr = self.getDates(new Date(year, month + 1, self.day));
						pre.innerHTML = year + "年" + (month + 2) +"月";
						picker.children[1].children[1].innerHTML = dateStr;
					}
					break;
				default:
					break;
			}
		}
		picker.children[1].onclick = function(e) {
			var src = getEventTag(e);
			if (/^a$/i.test(src.tagName)) {
				var level = picker.children[0].getAttribute("data-level");
				switch (level) {
					case "l0":
						var year = parseInt(src.innerHTML);
						var ul = self.getMonths(new Date(year, self.month, self.day));
						picker.children[1].innerHTML = ul;
						picker.children[0].setAttribute("data-level", "l1");
						picker.children[0].children[1].innerHTML = year + "年";
						break;
					case "l1":
						var year = parseInt(picker.children[0].children[1].innerHTML.split("年")[0]);
						var month = parseInt(src.innerHTML);
						var ul = self.getBody(new Date(year, month - 1, self.day));
						picker.children[1].innerHTML = ul;
						picker.children[0].setAttribute("data-level", "l2");
						picker.children[0].children[1].innerHTML = year + "年" + month + "月";
						break;
					case "l2":
						if (src.parentElement.className == "unable") {
							return false;
						} 
						var list = picker.children[0].children[1].innerHTML.split("年");
						var year = parseInt(list[0]);
						var month = parseInt(list[1].split("月")[0]) - 1;
						var day = parseInt(src.innerHTML);
						self.now.setFullYear(year);
						self.year = year;
						self.now.setMonth(month);
						self.month = month;
						self.now.setDate(day);
						self.day = day;
						overlay.click();
						break;
					default:
						break;
				}
			} else {
				return false;
			}
		}
		window.onresize = function() {
			picker.style.left = self.offsetL(self.$el) + "px";
			picker.style.top = self.offsetT(self.$el) + self.$el.offsetHeight + 1 + "px";
		}
	}
}

function getEventTag(e) {
	e = e || window.event;
	return e.target || e.srcElement;
}
