'use strict';

var header = {
    init: function() {
        var header = $('h1');
        header.on('click', function () {
            $(this).toggleClass('pink');
        });
    }
};