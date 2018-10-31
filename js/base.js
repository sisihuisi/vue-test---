Vue.component('cp1', {
	props: ['msg'],
	template: '<div>{{msg}}</div>'

})

var app6 = new Vue({
	el: '#app6',
	data: {
		parentMsg: ''
	}
})



Vue.component("my-component", {
	template: "<button @click='counter++' class='btn btn-blue'>{{counter}}</button>",
	data: function () {
		return {
			counter: 0
		}
	}
})

var myComponent = new Vue({
	el: "#components-box"
})


new Vue({
	el: "#check-box",
	data: {
		checked: ['ck1']
	}
})


var radios = new Vue({
	el: "#radio-box",
	data: {
		picked: 'aa'
	}

})


var app = new Vue({
	el: "#app",
	data: {
		name: ""
	}
});
var app2 = new Vue({
	el: "#app2",
	data: {
		books: [{
				name: "111是技术"
			},
			{
				name: "222是技术"
			},
			{
				name: "333是技术"
			},
		]
	}

});

function padDate(value) {
	return value < 10 ? "0" + value : value;
};

var app3 = new Vue({
	el: "#app3",
	data: {
		date: new Date()
	},
	filters: {
		formatDate: function (value) {
			var date = new Date(value);
			var year = date.getFullYear();
			var month = padDate(date.getMonth() + 1);
			var day = padDate(date.getDate());
			var hours = padDate(date.getHours());
			var minutes = padDate(date.getMinutes());
			var seconds = padDate(date.getSeconds());
			return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

		}
	},
	mounted: function () {
		var _this = this;
		this.timer = setInterval(function () {
			_this.date = new Date();
		}, 1000);
	},
	beforeDestroy: function () {
		if (this.timer) {
			clearInterval(this.timer)

		}
	}

});
var app4 = new Vue({
	el: "#app4",
	data: {
		url: "http://www.baidu.com",
		src: "vue1/build/logo.png",
		title: "这是一段描述哦！"
	},
});

var app5 = new Vue({
	el: "#app5",
	data: {
		flag: true,
	},
	methods: {
		doit: function () {
			this.flag = this.flag == true ? false : true;
		}
	}
});