chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    $.get('https://fuckagents.nctu.me/reports/v1/api/record/'+request.user+'/'+request.report_id+'/'+request.cheater);
});
