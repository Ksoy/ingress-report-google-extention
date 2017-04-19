var TYPE_MAP = {
    'abuse_ma': 'Multiple accounts/account sharing',
    'abuse_sell': 'Account buying/selling',
    'abuse_cheat': 'GPS spoofing'
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.op == 'check_login') {
        sendResponse({
            result: "164398" == $('#request_issue_type_select option:selected').val(),
            name: $('#user-name').text()
        });
    }
    else if (msg.op == 'set_data') {
        var data = msg.data;
        $('#request_subject').val(data.subject);
        $('#request_description').val(data.description);
        $('#request_custom_fields_27867927').val(data.bad_agent);
        $('#request_custom_fields_26993577').val(data.inappropriate_type);
        $('a.nesty-input').text(TYPE_MAP[data.inappropriate_type]);
        $('#request_custom_fields_26753947').val($('#user-name').text());
    }
});

$('#new_request').on('submit', function(evt) {
    chrome.extension.sendMessage({
        user: $('#user-name').text(),
        report: $('#request_custom_fields_27867927').val()
    });
});
