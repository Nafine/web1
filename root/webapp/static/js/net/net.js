$(function () {
    $("#form").on("submit", function (e) {
        e.preventDefault();
        let boxes = $('input[name="x"]:checked');
        console.log(boxes);
        if (boxes === undefined || boxes.length === 0) {
            return;
        }
        let y = parseFloat($('input[name="y"]').val());
        let r = parseFloat($('input[name="r"]').val());
        boxes.each(function () {
            sendData(parseFloat($(this).val()), y, r)
        })
    })
})

function sendData(x, y, r) {
    $.ajax({
        url: `/fcgi-bin/server.jar/?x=${x}&y=${y}&r=${r}`,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            let rows = $('#requestTable tbody').children();
            if (rows.length >= 20) {
                rows.remove(':last-child');
            }
            $('#requestTable').prepend(`<tr><td>${x.toFixed(2)}</td><td>${y.toFixed(2)}</td><td>${r.toFixed(2)}</td><td>${data.hit}</td><td>${(new Date).toLocaleString()}</td><td>${data.time}ns</td></tr>`);
            if (data.hit) addPoint(x, y);
        },
        error: function () {
            alert('Error');
        }
    });
}