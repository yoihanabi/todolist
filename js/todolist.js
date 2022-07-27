
if (window.localStorage.getItem("data") == null)
  init()

function getData() {
  return JSON.parse(window.localStorage.getItem("data"))
}

function setData(data) {
  window.localStorage.setItem("data", JSON.stringify(data))
}

function init() {
  var data = [
    {
      index: 0, // 索引
      content: '今天要写1个bug',  // 正文
      state: 1,   // 0 未完成  1 已完成
    }, {
      index: 1, // 索引
      content: '今天修复2个bug',  // 正文
      state: 0,   // 0 未完成  1 已完成
    }, {
      index: 2,
      content: '今天要写3个bug',
      state: 0,
    }, {
      index: 3,
      content: '今天要写4个bug',
      state: 1,
    }, {
      index: 4,
      content: '今天要写5个bug',
      state: 0,
    }, {
      index: 5,
      content: '今天要写6个bug',
      state: 0,
    }, {
      index: 6,
      content: '今天要写7个bug',
      state: 0,
    }, {
      index: 7,
      content: '今天要写10个bug',
      state: 0,
    }, {
      index: 8,
      content: '今天要写10个bug',
      state: 0,
    }, {
      index: 9,
      content: '今天要写10个bug',
      state: 0,
    }, {
      index: 10,
      content: '今天要写10个bug',
      state: 0,
    },
  ]
  window.localStorage.setItem("data", JSON.stringify(data))
}

function SortItem(a, b) {
  return a.state - b.state
}
function loadarr(state) {
  var data = getData().sort(SortItem)
  var arr = []
  for (var i = 0; i < data.length; i++) {
    if (data[i].state == state) {
      json = {
        index: data[i].index,
        content: data[i].content,
        state: state,
      }
      arr.push(json)
    }
  }
  $('#table').bootstrapTable("load", arr);
}
function Refresh(obj) {
  var nav = $('.active').children('a').text()
  switch (nav) {
    case "已完成":
      loadarr(1);
      break;
    case "未完成":
      loadarr(0);
      break;
    case "所有":
      var data = getData().sort(SortItem)
      $('#table').bootstrapTable("load", data);
      break;

  }
}

$(function () {
  $('#table').bootstrapTable({
    method: 'get',
    dataType: 'json',
    data: getData().sort(SortItem),
    striped: true, // 是否显示行间隔色
    columns: [{
      checkbox: true,
      fixed: 'left',
      align: 'center',
      formatter: function (value, row, index) {
        var _checked = false;       //默认不选中
        if (row.state == 1) {   //满足条件，设置选中
          _checked = true;
        };
        return {
          checked: _checked
        }
      }
    }, {
      field: 'content',
      title: 'content'
    }, {
      field: 'operate',
      title: '操作',
      width: 150,
      align: 'center',
      valign: 'middle',
      events: operateEvents,   //给按钮注册事件
      formatter: actionFormatter
    }],
    //点击全选框时触发的操作
    onCheckAll: function (rows) {
      var data = getData();
      for (var i = 0; i < rows.length; i++) {
        data[i].state = 1;
        setData(data);
      }
      Refresh()
    },
    onUncheckAll: function (rows) {
      var data = getData();
      for (var i = 0; i < data.length; i++) {
        data[i].state = 0;
        setData(data);
      }
      Refresh()
    },

    //点击每一个单选框时触发的操作
    onCheck: function (row) {
      var data = getData();
      // for (var i = 0; i < data.length; i++) {
      //   if (data[i].index == row.index) {
      //     data[i].state = 1
      //   }
      // }
      data.forEach(i=>{
        if(i.index==row.index){
          i.state=1
        }
      })
      setData(data);
      Refresh()
    },

    //取消每一个单选框时对应的操作；
    onUncheck: function (row) {
      var data = getData();
      for (var i = 0; i < data.length; i++) {
        if (data[i].index == row.index) {
          data[i].state = 0
        }
      }
      setData(data);
      Refresh()
    },
    
    //更改内容
    onClickCell: function (field, value, row, $element) {
      if (field == "content") {
        $element.attr('contenteditable', true);
      }
      $element.blur(function (obj) {
        obj = row
        let tdValue = $element.html();
        var data = getData()
        data.forEach(d => {
          if (d.index == obj.index) {
            d.content = tdValue
          }
        });
        setData(data)
      })
    }
  });

  // 三种点击加载数据
  $('#finish').click(function () {
    loadarr(1)
  })
  $('#unfinished').click(function () {
    loadarr(0)
  })
  $('#all').click(function () {
    var data = getData().sort(SortItem)
    $('#table').bootstrapTable("load", data);
  })

  // 隐藏加载
  $("#table").bootstrapTable("hideLoading");

  // 添加按钮点击事件
  $("#add").click(function (data) {
    data = $('#addin').val()
    $('#addin').val('')
    SaveItem(data)
    Refresh()
  });
});

window.operateEvents = {
  "click #deleteTable": function (e, value, row, index) {
    //删除按钮事件
    var data = getData();
    for (var i = 0; i < data.length; i++) {
      if (data[i].index == row.index) {
        data.splice(i, 1)
      }
    }
    setData(data)
    Refresh()
  }
}

function actionFormatter(value, row, index) {
  return [
    '<button id="deleteTable" type="button" style="margin:5px" class="btn  btn-xs btn-danger">删除</button>',
  ].join('');
}

function SaveItem(obj) {
  var data = getData()
  var index = 0
  if (data.length == 0)
    index = data.length
  else
    index = data[data.length - 1].index + 1
  json = {
    index: index,
    content: obj,
    state: 0,
  }
  data.push(json)
  setData(data)
}
