Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

// 产生1--i之间的整数随机数
function randomData(i) {
  return Math.round(Math.random() * i);
}


//去处数组中重复元素
function unique(arr) {
  var temp = [];
  for (var i = 0; i < arr.length; i++) {
    if (temp.indexOf(arr[i]) === -1) { //该元素在tmp内部不存在才允许追加
      temp.push(arr[i]);
    }
  }
  return temp;
}

// 产生n个0--num之间的随机数 放入数组 res
function arrData(n, num) {
  var temp = [];
  while (n--) {
    temp.push(Math.round(randomData(num - 1))); //产生1--num之间的随机数
  }
  return temp;
}


(function ($) {
  $.fn.echartSet = function (option) {
    return this.each(function () {
      clearTimeout(timer);
      var ec = echarts.init($(this)[0]),
        timer;
      ec.setOption(option);
      $(window).resize(function () {
        timer = setTimeout(ec.resize, 100);
      });
    });
  };
  $.fn.hoverIt = function (options) {
    $.fn.hoverIt.defaults = {
      trigger: 'mouseover',
      className: 'hover',
      closeFlag: true || 'true'
    };
    return this.each(function () {
      var opts = $.extend({}, $.fn.hoverIt.defaults, options);
      var $self = $(this);
      var className = opts.className;
      var trigger = opts.trigger;
      var closeFlag = opts.closeFlag;
      var closeObj = $self.find('.closeIt');
      var toggleObj = $self.children(":last-child");

      function showObj() {
        $self.addClass(className);
        toggleObj.slideDown(200);
        clickClose();
      }

      function hideObj() {
        $self.removeClass(className);
        toggleObj.slideUp(200);
      }

      function clickClose() {
        closeFlag && toggleObj.click(function () {
          hideObj();
        });
      }

      closeObj.click(function () {
        hideObj();
      });

      if (trigger === 'mouseover') {
        $self.on({
          'mouseenter': function () {
            showObj();
          },
          'mouseleave': function () {
            hideObj();
          }
        });
      } else {
        $self.on({
          'click': function () {
            toggleObj.is(':hidden') ? showObj() : hideObj();
          },
          'mouseleave': function () {
            hideObj();
          }
        });
      }
    });
  };
})(jQuery);


/*
 * type              请求的方式默认为get
 * url               发送请求的地址
 * param             发送请求的参数
 * isShowLoader      是否显示loader动画  默认为false
 * dataType          返回JSON数据  默认为JSON格式数据
 * callBack          请求的回调函数
 */
(function () {
  function pxAjaxRequest(opts) {
    this.type = opts.type || "get";
    this.url = ysapiPath + opts.url;
    this.param = opts.param || {};
    this.isShowLoader = opts.isShowLoader || false;
    this.dataType = opts.dataType || "json";
    this.callBack = opts.callBack;
    this.init();
  }

  pxAjaxRequest.prototype = {
    //初始化
    init: function () {
      this.sendRequest();
    },
    //渲染loader
    showLoader: function () {
      if (this.isShowLoader) {
        var loader = '<div class="ajaxLoader"><div class="loader">加载中...</div></div>';
        $("body").append(loader);
      }
    },
    //隐藏loader
    hideLoader: function () {
      if (this.isShowLoader) {
        $(".ajaxLoader").remove();
      }
    },
    //发送请求
    sendRequest: function () {
      var self = this;
      $.ajax({
        type: this.type,
        url: this.url,
        data: this.param,
        dataType: this.dataType,
        beforeSend: this.showLoader(),
        success: function (res) {
          self.hideLoader();
          if (res) {
            if (self.callBack) {
              if (Object.prototype.toString.call(self.callBack) === "[object Function]") {
                //Object.prototype.toString.call方法--精确判断对象的类型
                self.callBack(res);
              } else {
                console.log("callBack is not a function");
              }
            }
          }
        }
      });
    }
  };
  window.pxAjaxRequest = pxAjaxRequest;
})();

//中间表格数据
new pxAjaxRequest({
  url: "/asset/region/statistics",
  param: {
    from: 'nanjing'
  },
  callBack: function (json) {
    var html = '',
      _data = json.data.list;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        html += '<tr>' +
          '<td>' + da.name + '</td>' +
          '<td>' + da.pbu + '</td>' +
          '<td>' + da.app + '</td>' +
          '<td>' + da.price + '</td>' +
          '</tr>';
      }
    }
    $("#px-table-data .data_json").append(html);
  }
});

var _textStyle = {
    color: '#686E75',
    fontSize: 12
  },
  title_textStyle = {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: 14
  };

//-------ec-left-1---------
var option_left_1, chart_left_1;
new pxAjaxRequest({
  url: "/asset/useState",
  callBack: function (json) {
    var data = [],
      data_legend = [],
      _data = json.data;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        if (da.activeStatu && da.statuCount) {
          data.push({
            name: da.activeStatu,
            value: da.statuCount
          });
        }
        if (da.activeStatu) {
          data_legend.push(da.activeStatu);
        }
      }
    }

    option_left_1 = {
      animationDuration: 2000,
      animationEasing: 'elasticOut',
      color: ['#00E4F4', '#FCF53C', '#4CD964'],
      title: {
        text: '软件使用状态',
        left: 5,
        top: 10,
        textStyle: title_textStyle
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 10,
        textStyle: _textStyle,
        data: data_legend
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [{
        name: '软件使用状态',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: data,
        labelLine: {
          length: 10,
          length2: 10,
          smooth: true,
        },
        itemStyle: {
          normal: {
            label: {
              formatter: '{b}\n{d}%'
            }
          }
        }
      }]
    };
    chart_left_1 = echarts.init(document.getElementById('ec-left-1'));
    chart_left_1.setOption(option_left_1);
    $(window).resize(function () {
      chart_left_1.resize(option_left_1);
    });

  }
})


//**********ec-left-2************
var option_left_2, chart_left_2;
new pxAjaxRequest({
  url: "/asset/usefulLife",
  callBack: function (json) {
    var data_left_2 = [],
      data_style = [],
      _max = [],
      sum = 0,
      _data = json.data;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        if (da.softWareCount) {
          sum += da.softWareCount;
          data_left_2.push(da.softWareCount);
        }
        da.usedYearBetween && data_style.push(da.usedYearBetween);
      }
    }
    for (var j = 0; j < _data.length; j++) {
      var da = _data[j];
      if (da) {
        _max.push(data_left_2.max() + Math.round(sum / _data.length));
      }
    }

    option_left_2 = {
      animationDuration: 2000,
      animationEasing: 'elasticOut',
      textStyle: _textStyle,
      title: {
        text: '分类统计',
        left: 10,
        top: 10,
        textStyle: title_textStyle
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '15%',
        left: '2%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: '{value}个',
          textStyle: _textStyle
        }
      },
      yAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: data_style
        },
        {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: []
        }
      ],
      series: [{
          name: '总共年限',
          type: 'bar',
          barWidth: 10,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#000',
              barBorderRadius: 10
            }
          },
          data: _max
        },
        {
          name: '已使用年限',
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                1, 0, 0, 0, [{
                    offset: 1,
                    color: '#DDF6Bc'
                  },
                  {
                    offset: 0,
                    color: '#ffffff'
                  }
                ]
              ),
              barBorderRadius: 10
            }
          },
          data: data_left_2
        }
      ]
    };
    chart_left_2 = echarts.init(document.getElementById('ec-left-2'));
    chart_left_2.setOption(option_left_2);
    $(window).resize(function () {
      chart_left_2.resize(option_left_2);
    });

  }
})


//-------ec-left-3---------
var option_left_3, chart_left_3;
new pxAjaxRequest({
  url: "/asset/license/remain",
  param: {
    from: 'nanjing'
  },
  callBack: function (json) {
    var data = [],
      data_style = [],
      _data = json.data.list;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        if (da.name) {
          data.push({
            name: da.name,
            value: da.value
          });
        }
        da.name && data_style.push(da.name);
      }
    }
    option_left_3 = {
      color: ['#00c5E6', '#06E8B1', '#62FDE7', '#F8E71c', '#F5A825', '#54Dc6D', '#D1F1AB'],
      title: {
        text: '许可剩余时间',
        left: 10,
        top: 10,
        textStyle: title_textStyle
      },
      legend: {
        orient: 'vertical',
        icon: 'circle',
        itemWidth: 6,
        itemHeight: 6,
        left: 10,
        bottom: 10,
        textStyle: {
          color: '#686E75',
          fontSize: 12
        },
        data: data_style
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
      },
      series: [{
        type: 'pie',
        radius: ['10%', '60%'],
        center: ['60%', '50%'],
        roseType: 'radius',
        data: data,
        labelLine: {
          length: 4,
          length2: 4,
          smooth: true,
          lineStyle: {
            width: 1
          }
        },
        itemStyle: {
          normal: {
            shadowBlur: 30,
            shadowColor: 'rgba(0, 0, 0, 0.4)'
          }
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }]
    };
    chart_left_3 = echarts.init(document.getElementById('ec-left-3'));
    chart_left_3.setOption(option_left_3);
    $(window).resize(function () {
      chart_left_3.resize(option_left_3);
    });

  }
})


///-------ec-right-1---------
var option_right_1, chart_right_1;
new pxAjaxRequest({
  url: "/archive/quality",
  param: {
    fromYj: 1
  },
  callBack: function (json) {
    var data1 = [],
      data2 = [],
      sum = 0,
      _data = json.data;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        da.value && data2.push(da.value);
        sum += da.value;
      }
    }
    for (var j = 0; j < _data.length; j++) {
      var da = _data[j];
      if (da) {
        if (da.name && da.value) {
          data1.push({
            name: da.name,
            max: data2.max() + Math.round(sum / _data.length)
          })
        }
      }
    }

    option_right_1 = {
      color: ['#FFDB5F'],
      textStyle: {
        fontSize: 12,
        color: "#0FD5CB"
      },
      title: {
        text: '归档质量评估',
        left: 10,
        top: 10,
        textStyle: title_textStyle
      },
      tooltip: {},
      radar: {
        indicator: data1,
        center: ['50%', '60%'],
        radius: '80%',
        splitNumber: 4,
        splitArea: {
          areaStyle: {
            color: 'rgba(20, 100, 98, 0.2)'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(20, 100, 98, 0.6)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(20, 100, 98, 0.8)'
          }
        }
      },
      series: [{
        type: 'radar',
        data: [{
          value: data2,
          name: ' ',
          itemStyle: {
            normal: {
              borderColor: '#FFDB5F',
              borderWidth: 1
            }
          },
          lineStyle: {
            normal: {
              type: 'solid',
              color: "#FFDB5F",
              width: 1,
              opacity: 1
            }
          },
          label: {
            normal: {
              show: true,
              color: "#FFDB5F",
              formatter: function (params) {
                return params.value + "分";
              }
            }
          }
        }]
      }]
    };
    chart_right_1 = echarts.init(document.getElementById('ec-right-1'));
    chart_right_1.setOption(option_right_1);
    $(window).resize(function () {
      chart_right_1.resize(option_right_1);
    });

  }
});


//-------ec-right-2---------
var option_right_2, chart_right_2;
new pxAjaxRequest({
  url: "/asset/cumulativeCostByMonth",
  callBack: function (json) {
    var data_right_2 = [],
      data_style_2 = [],
      _data = json.data;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        da.sumCoast && data_right_2.push(da.sumCoast);
        da.archiveMonth && data_style_2.push(da.archiveMonth);
      }
    }
    option_right_2 = {
      textStyle: _textStyle,
      title: {
        text: '累计建设投入',
        left: 10,
        top: 10,
        textStyle: title_textStyle
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '20%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          textStyle: _textStyle
        },
        data: data_style_2
      }],
      yAxis: [{
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          textStyle: _textStyle,
          formatter: function (value) {
            return !(value % 10000) ? (value / 10000) + '万' : (value / 10000).toFixed(4) + '万'
          }
        }
      }],
      series: [{
        name: '投入金额',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 1
        },
        itemStyle: {
          borderWidth: 0,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(33, 195, 232, .9)'
          }, {
            offset: 1,
            color: 'rgba(0, 231, 177, .9)'
          }], false)
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(33, 195, 232, .3)'
          }, {
            offset: 1,
            color: 'rgba(0, 231, 177, .3)'
          }], false)
        },
        data: data_right_2
      }]
    };
    chart_right_2 = echarts.init(document.getElementById('ec-right-2'));
    chart_right_2.setOption(option_right_2);
    $(window).resize(function () {
      chart_right_2.resize(option_right_2);
    });


  }
});




//-------ec-right-3---------
var option_right_3, chart_right_3;
new pxAjaxRequest({
  url: "/asset/cumulativeCost",
  callBack: function (json) {
    var data_right_3 = [],
      data_style_3 = [],
      _data = json.data;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        da.sumCoast && data_right_3.push(da.sumCoast);
        da.supplyerName && data_style_3.push(da.supplyerName);
      }
    }
    option_right_3 = {
      animationDuration: 2000,
      animationEasing: 'elasticOut',
      textStyle: _textStyle,
      title: {
        text: '供应商排行',
        left: 10,
        top: 10,
        textStyle: title_textStyle
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '15%',
        left: '2%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          rotate: 40
        },
        data: data_style_3
      },
      yAxis: [{
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          textStyle: _textStyle,
          formatter: function (value) {
            return !(value % 10000) ? (value / 10000) + '万' : (value / 10000).toFixed(4) + '万'
          }
        }
      }],
      series: [{
        name: '业绩',
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(
            1, 1, 0, 0, [{
                offset: 0,
                color: '#21C3E8'
              },
              {
                offset: 1,
                color: '#00E7B1'
              }
            ]
          ),
          barBorderRadius: 10
        },
        emphasis: {
          itemStyle: {
            color: "#F8E71C"
          }
        },
        data: data_right_3
      }]
    };
    chart_right_3 = echarts.init(document.getElementById('ec-right-3'));
    chart_right_3.setOption(option_right_3);
    $(window).resize(function () {
      chart_right_3.resize(option_right_3);
    });


  }
});


var px_chart_map, px_option_map;
//-------ec-map---------
// var data_map = [
//     		[118.78, 32.04, 150],
//     		[118.88, 32.14, 120],
//     		[118.48, 32.00, 200],
//     		[119.11, 31.64, 120],
//     		[118.90, 31.84, 200],
//     		[119.02, 31.32, 150],
//     		[118.98, 32.24, 100]
// ];
var data_map = [
  []
];
var uploadedData = "../js/echarts-json/nanjing.json"; //jsp
$.getJSON(uploadedData, function (geoJson) {
  echarts.registerMap('nanjing', geoJson);
  px_option_map = {
    tooltip: {
      trigger: 'item',
      show: true
    },
    legend: {
      show: false,
    },
    geo: {
      type: 'heatmap',
      map: 'nanjing',
      zoom: 1.2,
      roam: false,
      label: {
        normal: {
          show: false,
          color: "#ccc"
        },
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          // areaColor: 'rgba(0,231,177,.4)',
          areaColor: new echarts.graphic.LinearGradient(
            1, 1, 1, 0, [{
                offset: 0,
                color: 'rgba(0,231,177,.3)'
              },
              {
                offset: 1,
                color: 'rgba(33,195,232,.3)'
              }
            ]
          ),
          borderColor: '#rgba(0, 0, 0, .2)'
        },
        emphasis: {
          areaColor: 'rgba(0,231,177,.6)'
        }
      }
    },
    series: [{
      name: ' ',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      symbolSize: function (val) {
        return val[2] / 10;
      },
      itemStyle: {
        normal: {
          shadowColor: '#f04040',
          shadowBlur: 10,
          opacity: 0.80,
          color: '#f04040'
        }
      },
      rippleEffect: {
        brushType: 'stroke'
      },
      data: data_map
    }]
  };
  px_chart_map = echarts.init(document.getElementById('ec-map'));
  px_chart_map.setOption(px_option_map);
  $(window).resize(function () {
    px_chart_map.resize(px_option_map);
  });
});


//-------中间两个仪表盘---------
var option_gauge_1, option_gauge_2, chart_gauge_1, chart_gauge_2;
var gauge_value_1 = 0;
var gauge_value_2 = 0;
var maxNum1 = 0;
var maxNum2 = 0;
new pxAjaxRequest({
  url: "/asset/total",
  param: {
    from: "nanjing"
  },
  callBack: function (json) {
    var _data = json.data;
    gauge_value_1 = Math.round(_data.app); //软件数量
    gauge_value_2 = !(_data.price % 10000) ? _data.price % 10000 : (_data.price / 10000).toFixed(4); //投入
    maxNum1 = (gauge_value_1 == 0) ? 1000 : Math.round(gauge_value_1 * 1.1);
    maxNum2 = (gauge_value_2 == 0) ? 1000 : (gauge_value_2 * 1.1).toFixed(2);
    $(".txt-gauge-1 .card-cont").text(_data.code);
    $(".txt-gauge-2 .card-cont").text(Math.round(_data.doc));
    $(".txt-gauge-3 .card-cont").text(Math.round(_data.work));
    $(".txt-gauge-4 .card-cont").text(Math.round(_data.license));
    $(".txt-gauge-5 .card-cont").text(Math.round(_data.patent));

    option_gauge_1 = {
      title: {
        text: '软件总数',
        left: 'center',
        bottom: 10,
        textStyle: _textStyle
      },
      series: [{
          name: '辅助饼图最外层',
          type: 'pie',
          radius: '100%',
          z: -1,
          center: ["50%", "55%"],
          hoverAnimation: false,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            color: {
              type: 'radial',
              x: .5,
              y: .05,
              r: .5,
              colorStops: [{
                offset: 0,
                color: 'rgba(24,35,46,1)'
              }, {
                offset: 1,
                color: 'rgba(24,28,33,1)'
              }],
              globalCoord: false
            },
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 20
          },
          data: [{
            value: 1,
            name: '辅助饼图最外层'
          }]
        },
        {
          name: '辅助饼图',
          type: 'pie',
          radius: '6%',
          z: 0,
          center: ["50%", "55%"],
          hoverAnimation: false,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            color: "#F7E71C",
            borderWidth: 4,
            borderColor: "rgba(255, 255, 255, .4)"
          },
          data: [{
            value: 1,
            name: '辅助饼图'
          }]
        },
        {
          name: "辅助圆环",
          hoverAnimation: false,
          center: ["50%", "55%"],
          radius: ["78%", "88%"],
          type: "pie",
          startAngle: 220,
          endAngle: -40,
          data: [{
            value: gauge_value_1 * (260 / 360),
            name: "",
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              borderWidth: 0,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#FCF53C'
              }, {
                offset: 1,
                color: '#F8E71C'
              }])
            }
          }, {
            name: " ",
            value: maxNum1 - gauge_value_1 * (260 / 360),
            itemStyle: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              color: 'rgba(0,0,0,0)',
              borderColor: 'rgba(0,0,0,0)',
              borderWidth: 0
            }
          }]
        },
        {
          name: '外层刻度', //
          axisLine: { //仪表盘
            lineStyle: {
              color: [
                [1, 'rgba(0,0,0,0)']
              ]
            }
          },
          splitLine: { //分隔线样式
            show: true,
            length: 8,
            lineStyle: {
              color: "#F7E71C",
              width: 1
            }
          },
          axisTick: { //刻度样式
            show: false //交给内层显示
          },
          axisLabel: { //刻度标签数字
            show: false
          },
          detail: {
            show: false
          },
          type: 'gauge',
          startAngle: 220,
          endAngle: -40,
          splitNumber: 10,
          radius: '99%',
          center: ['50%', '55%']
        },
        {
          name: '内层刻度',
          min: 0,
          max: maxNum1,
          pointer: {
            length: '70%',
            width: 4
          },
          axisLine: { //仪表盘
            lineStyle: {
              color: [
                [1, 'rgba(0,0,0,0)']
              ]
            }
          },
          splitLine: { //分隔线样式
            show: false //交给外层显示
          },
          axisTick: { //刻度样式
            show: true,
            length: 4,
            splitNumber: 8,
            lineStyle: {
              color: "#F7E71C",
              width: 1
            }
          },
          axisLabel: { //刻度标签数字
            show: false,
          },
          type: 'gauge',
          startAngle: 220,
          endAngle: -40,
          splitNumber: 10,
          radius: '86%',
          center: ['50%', '55%'],
          itemStyle: { //表盘指针样式
            color: {
              type: 'radia',
              colorStops: [{
                offset: 0,
                color: '#FCF53C'
              }, {
                offset: 1,
                color: '#F8E71C'
              }],
              globalCoord: false
            }
          },
          detail: { // 表盘文字样式
            formatter: [
              "{value}",
              "{a|个}"
            ].join(''),
            rich: {
              a: {
                color: 'fff',
                fontSize: 12,
                verticalAlign: 'bottom',
                padding: [3, 0, 10, 4]
              }
            },
            offsetCenter: [0, "58%"],
            textStyle: {
              fontSize: 30,
              color: "#fff"
            }
          },
          data: [{
            value: gauge_value_1
          }]
        }
      ]
    };
    option_gauge_2 = {
      title: {
        text: '总建设投入',
        left: 'center',
        bottom: 10,
        textStyle: _textStyle
      },
      series: [{
          name: '辅助饼图最外层',
          type: 'pie',
          radius: '100%',
          z: -1,
          center: ["50%", "55%"],
          hoverAnimation: false,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            color: {
              type: 'radial',
              x: .5,
              y: .05,
              r: .5,
              colorStops: [{
                offset: 0,
                color: 'rgba(24,35,46,1)'
              }, {
                offset: 1,
                color: 'rgba(24,28,33,1)'
              }],
              globalCoord: false
            },
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 20
          },
          data: [{
            value: 1,
            name: '辅助饼图最外层'
          }]
        },
        {
          name: '辅助饼图',
          type: 'pie',
          radius: '6%',
          z: 0,
          center: ["50%", "55%"],
          hoverAnimation: false,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            color: "#00E7B1",
            borderWidth: 4,
            borderColor: "rgba(255, 255, 255, .4)"
          },
          data: [{
            value: 1,
            name: '辅助饼图'
          }]
        },
        {
          name: "辅助圆环",
          hoverAnimation: false,
          center: ["50%", "55%"],
          radius: ["78%", "88%"],
          type: "pie",
          startAngle: 220,
          endAngle: -40,
          data: [{
            name: "",
            value: gauge_value_2 * (260 / 360),
            labelLine: {
              show: false
            },
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#00E7B1'
                }, {
                  offset: 1,
                  color: '#21C3E8'
                }])
              }
            }
          }, {
            name: " ",
            value: maxNum2 - gauge_value_2 * (260 / 360),
            "itemStyle": {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: 'rgba(0,0,0,0)',
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 0
              }
            }
          }]
        },
        {
          name: '外层刻度', //
          axisLine: { //仪表盘
            lineStyle: {
              color: [
                [1, 'rgba(0,0,0,0)']
              ]
            }
          },
          splitLine: { //分隔线样式
            show: true,
            length: 8,
            lineStyle: {
              color: "#21C3E8",
              width: 1
            }
          },
          axisTick: { //刻度样式
            show: false //交给内层显示
          },
          axisLabel: { //刻度标签数字
            show: false
          },
          detail: {
            show: false
          },
          type: 'gauge',
          startAngle: 220,
          endAngle: -40,
          splitNumber: 10,
          radius: '99%',
          center: ['50%', '55%']
        },
        {
          name: '内层刻度',
          min: 0,
          max: maxNum2,
          pointer: {
            length: '70%',
            width: 4
          },
          axisLine: { //仪表盘
            lineStyle: {
              color: [
                [1, 'rgba(0,0,0,0)']
              ]
            }
          },
          splitLine: { //分隔线样式
            show: false //交给外层显示
          },
          axisTick: { //刻度样式
            show: true,
            length: 4,
            splitNumber: 8,
            lineStyle: {
              color: "#21C3E8",
              width: 1
            }
          },
          axisLabel: { //刻度标签数字
            show: false
          },
          type: 'gauge',
          startAngle: 220,
          endAngle: -40,
          splitNumber: 10,
          radius: '86%',
          center: ['50%', '55%'],
          itemStyle: { //表盘指针样式
            color: {
              type: 'radia',
              colorStops: [{
                offset: 0,
                color: '#00E7B1'
              }, {
                offset: 1,
                color: '#21C3E8'
              }],
              globalCoord: false
            }
          },
          detail: { // 表盘文字样式
            formatter: [
              "{value}",
              "{a|万}"
            ].join(''),
            rich: {
              a: {
                color: 'fff',
                fontSize: 12,
                verticalAlign: 'bottom',
                padding: [3, 0, 10, 4]
              }
            },
            offsetCenter: [0, "58%"],
            textStyle: {
              fontSize: 30,
              color: "#fff"
            }
          },
          data: [{
            value: gauge_value_2
          }]
        }
      ]
    };

    chart_gauge_1 = echarts.init(document.getElementById('ec-gauge-1'));
    chart_gauge_2 = echarts.init(document.getElementById('ec-gauge-2'));
    chart_gauge_1.setOption(option_gauge_1);
    chart_gauge_2.setOption(option_gauge_2);
    $(window).resize(function () {
      chart_gauge_1.resize(option_gauge_1);
      chart_gauge_2.resize(option_gauge_2);
    });

  }
});

//-------tab2-bar---------
var option_bar1, option_bar2, option_bar3, option_bar4, option_bar5, option_bar6;
var chart_tab2_bar1, chart_tab2_bar2, chart_tab2_bar3, chart_tab2_bar4, chart_tab2_bar5, chart_tab2_bar6;
var option_bar_base = {
  animationDuration: 2000,
  animationEasing: 'elasticOut',
  textStyle: _textStyle,
  title: {
    text: ' ',
    left: 10,
    top: 2,
    textStyle: title_textStyle
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    top: '15%',
    left: '2%',
    right: '2%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      rotate: 40
    },
    data: []
  },
  yAxis: [{
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitArea: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      formatter: '{value}个',
      textStyle: _textStyle
    }
  }],
  series: [{
      name: ' ',
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        opacity: .6,
        barBorderRadius: 10,
        color: new echarts.graphic.LinearGradient(
          1, 1, 0, 0, [{
              offset: 0,
              color: '#fff'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        )
      },
      emphasis: {
        itemStyle: {
          color: "#fff"
        }
      },
      data: []
    },
    {
      name: ' ',
      type: 'line',
      itemStyle: {
        color: "#fff"
      },
      data: []
    }
  ]
};


//软件数量
new pxAjaxRequest({
  url: "/asset/softWareNumByMonth",
  callBack: function (json) {
    var bar_data = [],
      bar_style = [],
      _data = json.data,
      text = _data[_data.length - 1];
    for (var i = 0; i < _data.length - 1; i++) {
      var da = _data[i];
      if (da) {
        bar_data.push(da.softWareCount);
        da.archiveMonth && bar_style.push(da.archiveMonth);
      }
    }

    $(".px-bar-txt1 .last-month").text(text.lastMonth);
    $(".px-bar-txt1 .last-month-data").text(Math.round(text.lastMonthData));
    $(".px-bar-txt1 .last-two-month").text(text.lastTwoMonth);
    $(".px-bar-txt1 .last-two-month-data").text(Math.round(text.lastTwoData));
    $(".px-bar-txt1 .annular-growth").text(text.annularGrowth);

    var option = {
      title: {
        text: '软件数量'
      },
      xAxis: {
        data: bar_style
      },
      yAxis: [{
        axisLabel: {
          formatter: '{value}万行'
        }
      }],
      series: [{
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              1, 1, 0, 0, [{
                  offset: 0,
                  color: '#00E7B1'
                },
                {
                  offset: 1,
                  color: '#21C3E8'
                }
              ]
            )
          },
          emphasis: {
            itemStyle: {
              color: "#F8E71C"
            }
          },
          data: bar_data
        },
        {
          name: ' ',
          type: 'line',
          itemStyle: {
            color: "#0ADDC2"
          },
          data: bar_data
        }
      ]
    };

    option_bar1 = $.extend(true, {}, option_bar_base, option);
  }
});


//代码累积
new pxAjaxRequest({
  url: "/asset/codeInfos",
  param: {
    from: "nanjing"
  },
  callBack: function (json) {
    var bar_data = [],
      bar_style = [],
      text = json.data,
      _data = json.data.list;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        bar_data.push(da.sumCoast);
        da.archiveMonth && bar_style.push(da.archiveMonth);
      }
    }

    $(".px-bar-txt2 .last-month").text(text.lastMonth);
    $(".px-bar-txt2 .last-month-data").text((text.lastMonthData / 10000).toFixed(4));
    $(".px-bar-txt2 .last-two-month").text(text.lastTwoMonth);
    $(".px-bar-txt2 .last-two-month-data").text((text.lastMonthData / 10000).toFixed(4));
    $(".px-bar-txt2 .annular-growth").text(text.annularGrowth);


    var option = {
      title: {
        text: '代码累积'
      },
      xAxis: {
        data: bar_style
      },
      yAxis: [{
        axisLabel: {
          formatter: function (value) {
            return !(value % 10000) ? (value / 10000) + '万行' : (value / 10000).toFixed(4) + '万行'
          }
        }
      }],
      series: [{
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              1, 1, 0, 0, [{
                  offset: 0,
                  color: '#FCF53C'
                },
                {
                  offset: 1,
                  color: '#F8E71C'
                }
              ]
            )
          },
          emphasis: {
            itemStyle: {
              color: "#F8E71C"
            }
          },
          data: bar_data
        },
        {
          name: ' ',
          type: 'line',
          itemStyle: {
            color: "#F9E900"
          },
          data: bar_data
        }
      ]
    };

    option_bar2 = $.extend(true, {}, option_bar_base, option);
  }
});


//著作权获取
new pxAjaxRequest({
  url: "/asset/work",
  param: {
    from: "nanjing"
  },
  callBack: function (json) {
    var bar_data = [],
      bar_style = [],
      text = json.data,
      _data = json.data.list;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        bar_data.push(da.sumCoast);
        da.archiveMonth && bar_style.push(da.archiveMonth);
      }
    }

    $(".px-bar-txt3 .last-month").text(text.lastMonth);
    $(".px-bar-txt3 .last-month-data").text(Math.round(text.lastMonthData));
    $(".px-bar-txt3 .last-two-month").text(text.lastTwoMonth);
    $(".px-bar-txt3 .last-two-month-data").text(Math.round(text.lastTwoData));
    $(".px-bar-txt3 .annular-growth").text(text.annularGrowth + '%');

    var option = {
      title: {
        text: '著作权获取'
      },
      xAxis: {
        data: bar_style
      },
      yAxis: [{
        axisLabel: {
          formatter: '{value}个'
        }
      }],
      series: [{
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              1, 1, 0, 0, [{
                  offset: 0,
                  color: '#0EF5D9'
                },
                {
                  offset: 1,
                  color: '#06E8B1'
                }
              ]
            )
          },
          emphasis: {
            itemStyle: {
              color: "#F8E71C"
            }
          },
          data: bar_data
        },
        {
          name: ' ',
          type: 'line',
          itemStyle: {
            color: "#06E8B1"
          },
          data: bar_data
        }
      ]
    };

    option_bar3 = $.extend(true, {}, option_bar_base, option);

  }
});


//建设投入
new pxAjaxRequest({
  url: "/asset/coastByMonth",
  callBack: function (json) {
    var bar_data = [],
      bar_style = [],
      _data = json.data,
      text = _data[_data.length - 1];
    for (var i = 0; i < _data.length - 1; i++) {
      var da = _data[i];
      if (da) {
        bar_data.push(da.sumCoast);
        da.archiveMonth && bar_style.push(da.archiveMonth);
      }
    }

    $(".px-bar-txt4 .last-month").text(text.lastMonth);
    $(".px-bar-txt4 .last-month-data").text(Math.round(text.lastMonthData));
    $(".px-bar-txt4 .last-two-month").text(text.lastTwoMonth);
    $(".px-bar-txt4 .last-two-month-data").text(Math.round(text.lastTwoData));
    $(".px-bar-txt4 .annular-growth").text(text.annularGrowth);

    var option = {
      title: {
        text: '建设投入'
      },
      xAxis: {
        data: bar_style
      },
      yAxis: [{
        axisLabel: {
          formatter: function (value) {
            return !(value % 10000) ? (value / 10000) + '万行' : (value / 10000).toFixed(4) + '万行'
          }
        }
      }],
      series: [{
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              1, 1, 0, 0, [{
                  offset: 0,
                  color: '#DDF6BC'
                },
                {
                  offset: 1,
                  color: '#B8E986'
                }
              ]
            )
          },
          emphasis: {
            itemStyle: {
              color: "#F8E71C"
            }
          },
          data: bar_data
        },
        {
          name: ' ',
          type: 'line',
          itemStyle: {
            color: "#C4ED97"
          },
          data: bar_data
        }
      ]
    };

    option_bar4 = $.extend(true, {}, option_bar_base, option);

  }
});


//归档完成比
new pxAjaxRequest({
  url: "/archive/stipulateCompletion",
  param: {
    platForm: 'JFH'
  },
  callBack: function (json) {
    var bar_data = [],
      bar_style = [],
      _data = json.data,
      text = _data[_data.length - 1];
    for (var i = 0; i < _data.length - 1; i++) {
      var da = _data[i];
      if (da) {
        bar_data.push(da.stipulateCompletion.substring(0, da.stipulateCompletion.length - 1));
        da.archiveMonth && bar_style.push(da.archiveMonth);
      }
    }

    $(".px-bar-txt5 .last-month").text(text.lastMonth);
    $(".px-bar-txt5 .last-month-data").text(Math.round(text.lastMonthData));
    $(".px-bar-txt5 .last-two-month").text(text.lastTwoMonth);
    $(".px-bar-txt5 .last-two-month-data").text(Math.round(text.lastTwoData));
    $(".px-bar-txt5 .annular-growth").text(text.annularGrowth);

    var option = {
      title: {
        text: '归档完成比'
      },
      xAxis: {
        data: bar_style
      },
      yAxis: [{
        axisLabel: {
          formatter: '{value}%'
        }
      }],
      series: [{
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              1, 1, 0, 0, [{
                  offset: 0,
                  color: '#62FDE7'
                },
                {
                  offset: 1,
                  color: '#33FBCA'
                }
              ]
            )
          },
          emphasis: {
            itemStyle: {
              color: "#F8E71C"
            }
          },
          data: bar_data
        },
        {
          name: ' ',
          type: 'line',
          itemStyle: {
            color: "#33FBCA"
          },
          data: bar_data
        }
      ]
    };

    option_bar5 = $.extend(true, {}, option_bar_base, option);

  }
});


//专利获取
new pxAjaxRequest({
  url: "/asset/patent",
  param: {
    from: "nanjing"
  },
  callBack: function (json) {
    var bar_data = [],
      bar_style = [],
      text = json.data,
      _data = json.data.list;
    for (var i = 0; i < _data.length; i++) {
      var da = _data[i];
      if (da) {
        bar_data.push(da.sumCoast);
        da.archiveMonth && bar_style.push(da.archiveMonth);
      }
    }

    $(".px-bar-txt6 .last-month").text(text.lastMonth);
    $(".px-bar-txt6 .last-month-data").text(Math.round(text.lastMonthData));
    $(".px-bar-txt6 .last-two-month").text(text.lastTwoMonth);
    $(".px-bar-txt6 .last-two-month-data").text(Math.round(text.lastTwoData));
    $(".px-bar-txt6 .annular-growth").text(text.annularGrowth + '%');

    var option = {
      title: {
        text: '专利获取'
      },
      xAxis: {
        data: bar_style
      },
      yAxis: [{
        axisLabel: {
          formatter: '{value}个'
        }
      }],
      series: [{
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              1, 1, 0, 0, [{
                  offset: 0,
                  color: '#83EE9D'
                },
                {
                  offset: 1,
                  color: '#4CD964'
                }
              ]
            )
          },
          emphasis: {
            itemStyle: {
              color: "#F8E71C"
            }
          },
          data: bar_data
        },
        {
          name: ' ',
          type: 'line',
          itemStyle: {
            color: "#4DDA65"
          },
          data: bar_data
        }
      ]
    };

    option_bar6 = $.extend(true, {}, option_bar_base, option);
  }
});


function tab1_charts_resize() {
  option_left_1 && chart_left_1.resize(option_left_1);
  option_left_2 && chart_left_2.resize(option_left_2);
  option_left_3 && chart_left_3.resize(option_left_3);
  option_right_1 && chart_right_1.resize(option_right_1);
  option_right_2 && chart_right_2.resize(option_right_2);
  option_right_3 && chart_right_3.resize(option_right_3);
  option_gauge_1 && chart_gauge_1.resize(option_gauge_1);
  option_gauge_2 && chart_gauge_2.resize(option_gauge_2);
  px_option_map && px_chart_map.resize(px_option_map);
}

function tab2_charts_resize() {
  option_bar1 && chart_tab2_bar1.resize(option_bar1);
  option_bar2 && chart_tab2_bar2.resize(option_bar2);
  option_bar3 && chart_tab2_bar3.resize(option_bar3);
  option_bar4 && chart_tab2_bar4.resize(option_bar4);
  option_bar5 && chart_tab2_bar5.resize(option_bar5);
  option_bar6 && chart_tab2_bar6.resize(option_bar6);
}

function tab2_charts_init() {
  chart_tab2_bar1 = echarts.init(document.getElementById('ec-tab2-bar1'));
  chart_tab2_bar2 = echarts.init(document.getElementById('ec-tab2-bar2'));
  chart_tab2_bar3 = echarts.init(document.getElementById('ec-tab2-bar3'));
  chart_tab2_bar4 = echarts.init(document.getElementById('ec-tab2-bar4'));
  chart_tab2_bar5 = echarts.init(document.getElementById('ec-tab2-bar5'));
  chart_tab2_bar6 = echarts.init(document.getElementById('ec-tab2-bar6'));

  if (option_bar1) {
    chart_tab2_bar1.setOption(option_bar1);
    $(window).resize(function () {
      chart_tab2_bar1.resize(option_bar1);
    });
  }
  if (option_bar2) {
    chart_tab2_bar2.setOption(option_bar2);
    $(window).resize(function () {
      chart_tab2_bar2.resize(option_bar2);
    });
  }
  if (option_bar3) {
    chart_tab2_bar3.setOption(option_bar3);
    $(window).resize(function () {
      chart_tab2_bar3.resize(option_bar3);
    });
  }
  if (option_bar4) {
    chart_tab2_bar4.setOption(option_bar4);
    $(window).resize(function () {
      chart_tab2_bar4.resize(option_bar4);
    });
  }
  if (option_bar5) {
    chart_tab2_bar5.setOption(option_bar5);
    $(window).resize(function () {
      chart_tab2_bar5.resize(option_bar5);
    });
  }
  if (option_bar6) {
    chart_tab2_bar6.setOption(option_bar6);
    $(window).resize(function () {
      chart_tab2_bar6.resize(option_bar6);
    });
  }

}