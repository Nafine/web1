function sendData(x, y, r) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/fcgi-bin/server.jar/?x=${x}&y=${y}&r=${r}`,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: resolve,
            error: (jqXHR, textStatus, errorThrown) =>
                reject({jqXHR, textStatus, errorThrown})
        });
    });
}

function getCache(page, size = parseInt($('#page-size-select').val())) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/fcgi-bin/server.jar/dots?page=${page}&size=${size}`,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                const cachedPage = {
                    page: page,
                    size: size,
                    hasBefore: data.hasBefore,
                    hasNext: data.hasNext,
                    dots: data.dots
                };
                resolve(cachedPage);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}

$(function () {
    $("#form").on("submit", async function (e) {
        e.preventDefault();
        let boxes = $('input[name="x"]:checked');
        if (boxes === undefined || boxes.length === 0) {
            return;
        }
        let y = parseFloat($('input[name="y"]').val());
        let r = parseFloat($('input[name="r"]').val());
        let promises = [];
        boxes.each(function () {
            promises.push(sendData(parseFloat($(this).val()), y, r));
        });

        await Promise.allSettled(promises);
        await updatePaginationControls();
        await updateLastPage();
    })
})