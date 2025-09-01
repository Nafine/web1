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

$('#form').on('submit', function (e) {
    let x = $('input[name="x"]:checked').val();
    let y = $('input[name="y"]').val();

    $('#requestTable').prepend(
        `<tr><td>${x}</td><td>${y}</td></tr>`
    );

    e.preventDefault();
});

$('#requestTable tbody').on('click', 'tr', function () {
    let cols = $(this).children();
    console.log(`X:${cols.eq(0).text()} Y:${cols.eq(1).text()}`);
});