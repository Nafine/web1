$('input[name="x"]').on("focus", function () {
        $(`input[name="x"][value!=${$(this).val()}]`).prop('checked', false);
    }
);

$('input[name="r"]').on("keyup", function () {
    let radius = parseFloat($(this).val());
    if (!isValidRadius(radius)) {
        $('#r-err').show();
    } else {
        $('#r-err').hide();
        refresh(radius);
    }
})

function isValidRadius(radius) {
    return radius != null && !isNaN(radius) && radius >= 1 && radius <= 4;
}

$('input[name="y"]').on("keyup", function () {
    let y = parseFloat($(this).val());
    if (!isValidY(y)) {
        $('#y-err').show();
        $('#submit').prop('disabled', true);
    } else {
        $('#y-err').hide();
        $('#submit').prop('disabled', false);
    }
})

function isValidY(y) {
    return y != null && !isNaN(y) && y >= -5 && y <= 5;
}

$('#requestTable tbody').on('click mouseenter mouseleave', 'tr', function (event) {
    let row = $(this).children();

    let x = parseFloat(row.eq(0).text());
    let y = parseFloat(row.eq(1).text());
    let r = parseFloat(row.eq(2).text());
    let hit = row.eq(3).text() === 'true';

    if (event.type === 'click') {
        $("#r").val(r);
        refresh(r)
        drawDot({x: x, y: y}, 'red');
    } else if (event.type === 'mouseenter' && hit) {
        drawDot({x: x, y: y}, 'red');
    } else if (event.type === 'mouseleave' && hit) {
        drawDot({x: x, y: y});
    }
});