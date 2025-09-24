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

$(function () {

})

let tableRows = [];
let currentPage = 1;
let pageSize = 10;
let db;

const storeName = "points";
const request = indexedDB.open("pointsDB", 1);

request.onerror = (event) => {
    console.error("Database error:", event.target.error);
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {keyPath: "id", autoIncrement: true});
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadPointsFromDB();
};

function loadPointsFromDB() {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
        const points = request.result;
        points.forEach(point => {
            const row = createTableRow(point);
            tableRows.unshift(row);
            if (point.hit) addPoint(point.x, point.y);
        });
        renderTable();
    };
}

function savePointToDB(point) {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.add(point);
}

function createTableRow(point) {
    return `<tr><td>${point.x.toFixed(2)}</td><td>${point.y.toFixed(2)}</td><td>${point.r.toFixed(2)}</td><td>${point.hit}</td><td>${point.requestTime}</td><td>${point.execTime}ns</td></tr>`;
}

function renderTable() {
    const tbody = $('#requestTable tbody');
    tbody.empty();
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageRows = tableRows.slice(start, end);
    for (const row of pageRows) {
        tbody.append(row);
    }
    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));
    $('#page-info').text(currentPage + ' / ' + totalPages);
    $('#page-prev').prop('disabled', currentPage === 1);
    $('#page-next').prop('disabled', currentPage === totalPages);
}

$('#page-prev').on('click', function () {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});
$('#page-next').on('click', function () {
    const totalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});
$('#page-size-select').on('change', function () {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    renderTable();
});

function sendData(x, y, r) {
    $.ajax({
        url: `/fcgi-bin/server.jar/?x=${x}&y=${y}&r=${r}`,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            const point = {
                x: x,
                y: y,
                r: r,
                hit: data.hit,
                requestTime: (new Date).toLocaleString(),
                execTime: data.time
            };

            savePointToDB(point);
            const row = createTableRow(point);
            tableRows.unshift(row);
            renderTable();
            if (data.hit) addPoint(x, y);
        },
        error: function () {
            alert('Error');
        }
    });
}

function getCache() {
    let size = parseInt($('#page-size-select').val());
    $.ajax({
        url: `/fcgi-bin/server.jar/dots?page=1&size=${size}`,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            const dots = {
                page: 1,
                size: size,
                hasBefore: data.hasBefore,
                hasNext: data.hasNext,
                dots: data.dots
            }

        }
    })
}

$(function () {
    renderTable();
});
