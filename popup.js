var checkUrl = 'https://support.ingress.com/hc/(en-us|zh-tw)/requests';
var reportUrl = 'https://support.ingress.com/hc/en-us/requests/new?ticket_form_id=164398';
var host = 'http://fuckagent.nctu.me';
var dataUrl = host + '/reports/v1/api/report_list/';
var versionUrl = host + '/reports/v1/api/extension_version'
var extensionUpdateUrl = 'https://chrome.google.com/webstore/detail/ingress-inappropriate-age/iaobkfnjelkejedldphlkhimpokkdgmh?hl=zh-TW&gl=TW&authuser=0'
var fileUrl = host + ':7890/';

function getExtensionVersion() { 
  var version = 'NaN'; 
  var xhr = new XMLHttpRequest(); 
  xhr.open('GET', chrome.extension.getURL('manifest.json'), false); 
  xhr.send(null); 
  var manifest = JSON.parse(xhr.responseText); 
  return manifest.version; 
}

function renderStatus(statusText) {
  $('#status').text(statusText);
}

function setTabLocation(url) {
  function callback(tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
  }
  chrome.tabs.query({ active: true, currentWindow: true }, callback);
}

function wrongPage() {
  renderStatus('wrong page.');
  $('#msg').text('You are not at report page.');
  $("#link").show();
  $('#link').on('click', function() {
    setTabLocation(reportUrl);
    //chrome.tabs.create({ url: reportUrl});
  });
}

function check_version() {
  renderStatus('Checking version....');
  $.get(versionUrl, function(result) {
    if (result > getExtensionVersion()) {
      $('#msg').html('New extension release, go to <a href="">update</a>.');
      $('a').on('click', function() {
        setTabLocation(extensionUpdateUrl);
      })
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, check_url);
    }
  });
}

function check_url(tabs) {
  renderStatus('Checking page....');
  result = tabs[0].url.match(checkUrl);
  if (!result || !(result.index == 0)) {
    wrongPage();
    return;
  }

  function check_login(response) {
    if (response && response.result) {
      if (response.name) {
        getData(tabs[0], response.name);
      }
      else {
        $('#msg').text('You need login first.');
        renderStatus('Need login.');
      }
    }
    else {
      wrongPage();
    }
  }
  chrome.tabs.sendMessage(tabs[0].id, {op: 'check_login'}, check_login);
}

function getData(tab, name) {
  renderStatus('Get data...');

  $.get(dataUrl + name, function(result) {
    renderStatus('Done.');
    result = JSON.parse(result);


    if (!result.reports.length) {
      $('#msg').text('Congratulation, No data to report.');
    } else {
      $('#msg').text('Click username and download file to report.');
      result.reports.forEach(function(data) {
        if ('new' == data.status) {
          $('#table').append(createTable(data));
        }
      });
    }

    $('.send_data').on('click', function() {
      var data = JSON.parse($(this).val());
      var sendData = {
        'report_id': data.report_id,
        'subject': data.subject,
        'description': data.description,
        'cheater': $(this).text(),
        'inappropriate_type': data.inappropriate_type
      };
      chrome.tabs.sendMessage(tab.id, {'op': 'set_data', 'data': sendData});
    });

    $('.download_file').on('click', function() {
      chrome.tabs.create({ url: $(this).attr('link')});
    });
  });
}

function createTable(data) {
  var table = $('<table/>');
  var name_td = $('<td/>');
  var status_td = $('<td/>');
  var file_td = $('<td/>');

  data.cheaters.forEach(function(cheater) {
    var name_tr = $('<tr/>');
    var name_a = $('<a/>', {'class': 'send_data', 'href': '#', 'text': cheater.name, 'val': JSON.stringify(data)});
    name_tr.append(name_a);
    name_td.append(name_tr);

    var status_tr = $('<tr/>');
    var status_label = $('<label/>', {'text': cheater.status});
    status_tr.append(status_label);
    status_td.append(status_tr);
  });
  table.append(name_td);
  table.append(status_td);

  if (data.filename) {
    var file_a = $('<a/>', {'class': 'download_file', 'href': '#', 'link': fileUrl + data.filename, 'text': 'file'});
    file_td.append(file_a);
  } else {
    var file_label = $('<label/>', {'text': 'no file'});
    file_td.append(file_label);
  }
  table.append(file_td);

  return table;
}

document.addEventListener('DOMContentLoaded', function() {
  check_version();
});
