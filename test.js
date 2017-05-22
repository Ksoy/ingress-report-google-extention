/*$('#login').on('submit', function(evt) {
    //evt.preventDefault();
    alert($('#username').val() + $('#password').val());
    if($('#username').val() && $('#password').val()) {}
    else {
        evt.stopPropagation();
        evt.preventDefault();
    }
});

var proxied = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, path, async) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4)
                alert('gg');
        }, true);
    return proxied.apply(this, [].slice.call(arguments));
};

document.addEventListener('submit', function(e){
   alert('aa');
}, false);
*/