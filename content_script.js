chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.op === 'check_login') {
        sendResponse($('#user-name').text());
    }
    else if (msg.op == 'set_data') {
        var data = msg.data;
        $('#request_subject').val(data.subject);
        $('#request_description').val(data.description);
        $('#request_custom_fields_27867927').val(data.flyname);

        $('#request_custom_fields_26993577').val('abuse_cheat');
        $('a.nesty-input').text('GPS spoofing');
        $('#request_custom_fields_26753947').val($('#user-name').text());
    }
});

var a;
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    a = details;
    console.log(a.requestBody.formData);
    alert('before request');
}, {urls: ["https://support.ingress.com/hc/en-us/requests"]});

$('new_request').addEventListener('submit', function(evt) {
    alert('submit listerner');
});