chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    $.get('http://140.113.215.24:7777/reports/v1/api/record/' + request.user + '/' + request.report);
});