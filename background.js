chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    $.get('http://fuckagent.nctu.me/reports/v1/api/record/'+request.user+'/'+request.report_id+'/'+request.cheater);
});
