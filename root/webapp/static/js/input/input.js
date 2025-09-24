let validX = true;
let validY = false;
let validR = true;

$('input[name="x"]').on('click', function () {
    validX = $('input[name="x"]:checked').length !== 0;
    checkInput();
});

$('input[name="r"]').on('keyup', function () {
    let radius = $(this).val();
    if (!radius.match($(this).prop('pattern')) || !isValidRadius(parseFloat(radius))) {
        $('#r-err').addClass('show');
        validR = false;
    } else {
        $('#r-err').removeClass('show');
        refresh(radius);
        validR = true;
    }
    checkInput();
})

function checkInput() {
    if (validX && validY && validR) {
        $('#submit').prop('disabled', false);
    } else {
        $('#submit').prop('disabled', true);
    }
}

function isValidRadius(radius) {
    return radius != null && !isNaN(radius) && radius >= 1 && radius <= 4;
}

$('input[name="y"]').on('keyup', function () {
    let y = $(this).val();
    validY = isValidY(parseFloat(y));
    if (!y.match($(this).prop('pattern')) || !validY) {
        $('#y-err').addClass('show');
        validY = false;
    } else {
        $('#y-err').removeClass('show');
        validY = true;
    }
    checkInput();
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

    if (event.type === 'click' && hit) {
        $('input[name="r"]').val(r);
        refresh(r)
        drawDot({x: x, y: y}, 'red');
    } else if (event.type === 'mouseenter') {
        drawDot({x: x, y: y}, 'red');
    } else if (event.type === 'mouseleave') {
        refresh(parseFloat($('input[name="r"]').val()));
    }
});