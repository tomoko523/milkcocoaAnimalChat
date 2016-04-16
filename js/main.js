$(function() {

  var mymilkcocoaid;
  var pass;
  var milkcocoa;
  var chatDataStore;

  mymilkcocoaid = sessionStorage.getItem("mymilkcocoaid");

  if (mymilkcocoaid == null) {
    myPassWord = prompt("milkcocoaのapp_idをいれてください", "");
    pass = myPassWord + ".mlkcca.com";
  } else {
    pass = mymilkcocoaid;
  }

  milkcocoa　 = new MilkCocoa(pass);
  chatDataStore = milkcocoa.dataStore("chat2");

  var getData = [];
  var setData = [];

  $("#user").imagepicker({
    clicked: changeuser
  });

  $("#btn").on("click", function() {
    var user = $("#user").val();
    var text = $("#msg").val();

    chatDataStore.push({
      user: user,
      day: date(),
      message: text
    }, function(e) {
      $("#msg").val("");
    });
  });

  $("#btnSave").on("click", function() {

    sessionStorage.setItem("mymilkcocoaid", pass);
    alert("SeesionStrageに保存しました！")

  });

  $("#btnDelete").on("click", function() {

    sessionStorage.removeItem("mymilkcocoaid");
    alert("SeesionStrageから削除しました！")

  });

  chatDataStore.on("push", function(data) {
    var icon = "<img src='img/" + data.value.user + ".png' alt=" + data.value.user + ">";
    var msg, message;
    if ($("#user").val() == data.value.user) {
      msg = "<div class='arrow_box_right'>" + data.value.day + '<br/>' + data.value.message + "</div>";
      message = msg + icon;
    } else {
      msg = "<div class='arrow_box_left'>" + data.value.day + '<br/>' + data.value.message + "</div>";
      message = icon + msg;
    }
    var addmsg = {
      message: message,
      user: data.value.user,
      msg: data.value.message,
      day: data.value.day
    };
    getData.push(addmsg);
    vm.milkcocoaval.push(addmsg);
    var length = getData.length * 100;
    $('html body').animate({
      scrollTop: length
    }, 'slow');
  })

  function viewModel() {
    var self = this;
    self.milkcocoaval = ko.observableArray();
    self.setmilkcocoaval = function() {
      self.milkcocoaval.removeAll();
      getData = setData;
      ko.utils.arrayPushAll(self.milkcocoaval, getData);
      setData = [];
    }
  };

  var vm = new viewModel();
  ko.applyBindings(vm);

  var history = milkcocoa.dataStore('chat2').history();

  history.sort('asc');
  history.size(1);
  history.limit(100);
  var i = 0;
  history.on('data', function(data) {
    data.forEach(function(d, i) {
      var icon = "<img src='img/" + data[i].value.user + ".png' alt=" + data[i].value.user + ">";
      var msg, message;
      if ($("#user").val() == data[i].value.user) {
        msg = "<div class='arrow_box_right'>" + data[i].value.day + '<br/>' + data[i].value.message + "</div>";
        message = msg + icon;
      } else {
        msg = "<div class='arrow_box_left'>" + data[i].value.day + '<br/>' + data[i].value.message + "</div>";
        message = icon + msg;
      }
      getData.push({
        message: message,
        user: data[i].value.user,
        msg: data[i].value.message,
        day: data[i].value.day
      });
    });
  });
  history.on('end', function() {
    vm.milkcocoaval(getData);
    var length = getData.length * 100;
    $('html body').animate({
      scrollTop: length
    }, 'slow');
  });
  history.run();

  function changeuser() {
    getData.forEach(function(d, i) {
      var icon = "<img  src='img/" + getData[i].user + ".png' alt=" + getData[i].user + ">";
      var msg, message;
      if ($("#user").val() == getData[i].user) {
        msg = "<div class='arrow_box_right'>" + getData[i].day + '<br/>' + getData[i].msg + "</div>";
        message = msg + icon;
      } else {
        msg = "<div class='arrow_box_left'>" + getData[i].day + '<br/>' + getData[i].msg + "</div>";
        message = icon + msg;
      }
      setData.push({
        message: message,
        user: getData[i].user,
        msg: getData[i].msg,
        day: getData[i].day
      });
    });
    vm.setmilkcocoaval();
  }

  function date() {
    myTbl = new Array("Sun.", "Man.", "Thu.", "Wed.", "Thur.", "Fri.", "Sat.");
    myD = new Date();
    myYear = myD.getFullYear();
    myMonth = myD.getMonth() + 1;
    myDate = myD.getDate();
    myDay = myD.getDay();
    myHours = myD.getHours();
    myMinutes = myD.getMinutes();
    mySeconds = myD.getSeconds();
    myMess1 = myYear + "/" + myMonth + "/" + myDate + "/";
    myMess2 = myTbl[myDay];
    myMess3 = myHours + ":" + myMinutes + ":" + mySeconds;
    myMess = myMess1 + " " + myMess2 + " " + myMess3;
    return myMess;
  }
});
