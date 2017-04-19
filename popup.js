var reportUrl = 'https://support.ingress.com/hc/en-us/requests/new?ticket_form_id=164398';
var dataUrl = 'http://140.113.215.24:7777/reports/v1/list';

function renderStatus(statusText) {
  $('#status').text(statusText);
}

function checkUrl(tab) {
    if (tab.url == reportUrl) {
      checkName(tab);
    }
    else {
      renderStatus('wrong page.');
      $('#msg').text('You are not at report page.');
      $("#link").show();
      $('#link').on('click', function() {
        chrome.tabs.create({ url: reportUrl});
      });
    }

}

function checkName(tab) {
  renderStatus('Checking login....');
  function callback(response) {
    if (response) {
      getData(tab);
    }
    else {
      $('#msg').text('You need login first.');
      renderStatus('Need login.');
    }
  }
  chrome.tabs.sendMessage(tab.id, {op: 'check_login'}, callback);
}

function getData(tab) {
  renderStatus('Get data...');

  $.get(dataUrl, function(result) {
    renderStatus('Done.');
    result = JSON.parse(result);

    $('#msg').text('Select Data to report.');

    result.reports.forEach(function(data) {
      $('#table').append(createTable(data));
    });

    $('.send_data').on('click', function() {
      var data = JSON.parse($(this).val());
      var sendData = {
        'subject': data.subject,
        'description': data.description,
        'bad_agent': $(this).text(),
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

  data.bad_agents.forEach(function(bas_agent) {
    var name_tr = $('<tr/>');
    var name_a = $('<a/>', {'class': 'send_data', 'href': '#', 'text': bas_agent.name, 'val': JSON.stringify(data)});
    name_tr.append(name_a);
    name_td.append(name_tr);

    var status_tr = $('<tr/>');
    var status_label = $('<label/>', {'text': bas_agent.status});
    status_tr.append(status_label);
    status_td.append(status_tr);
  });
  table.append(name_td);
  table.append(status_td);

  var file_a = $('<a/>', {'class': 'download_file', 'href': '#', 'link': data.file_link, 'text': 'file'});
  file_td.append(file_a);
  table.append(file_td);

  return table;
}

document.addEventListener('DOMContentLoaded', function() {
  renderStatus('Checking page....');
  var query = { active: true, currentWindow: true };
  function callback(tabs) {
    checkUrl(tabs[0]);
  }
  chrome.tabs.query(query, callback);
});
