$(function () {
    $("#form").on("submit", function (e) {
        e.preventDefault();
        let x = $('input[name="x"]:checked').val();
        if (x === undefined || x === "") {
            return;
        }
        let y = $('input[name="y"]').val();
        let r = $('input[name="r"]').val();

        $.ajax({
            url: `/fcgi-bin/server.jar?x=${x}&y=${y}&r=${r}`,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                let rows = $('#requestTable tbody').children();
                if (rows.length >= 20) {
                    rows.remove(':last-child');
                }
                $('#requestTable').prepend(`<tr><td>${parseInt(x)}</td><td>${parseFloat(y)}</td><td>${parseFloat(r)}</td><td>${data.hit}</td><td>${(new Date).toLocaleString()}</td><td>${data.time}ns</td></tr>`);
                if (data.hit) addPoint(x, y);
            },
            error: function () {
                alert('Error');
            }
        });
    })
})