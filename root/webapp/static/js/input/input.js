let validX = true;
let validY = false;

$('input[name="x"]').on("change", function () {
    $('input[name="x"]').not(this).prop('checked', false);
    validX = $(this).filter(':checked').length !== 0;
    console.log($(this).filter(':checked').length);
    checkInput();
});

$('input[name="r"]').on("keyup", function () {
    let radius = parseFloat($(this).val());
    if (!isValidRadius(radius)) {
        $('#r-err').addClass('show');
    } else {
        $('#r-err').removeClass('show');
        refresh(radius);
    }
})

function checkInput(){
    if (validX && validY) {
        $('#submit').prop('disabled', false);
    }else{
        $('#submit').prop('disabled', true);
    }
}

function isValidRadius(radius) {
    return radius != null && !isNaN(radius) && radius >= 1 && radius <= 4;
}

$('input[name="y"]').on("keyup", function () {
    let y = parseFloat($(this).val());
    validY = isValidY(y);
    if (!validY) {
        $('#y-err').addClass('show');
    } else {
        $('#y-err').removeClass('show');
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