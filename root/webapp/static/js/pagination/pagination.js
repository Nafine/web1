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

    request.onsuccess = async () => {
        const points = request.result;
        points.forEach(point => {
            const row = createTableRow(point);
            tableRows.push(row);
            if (point.hit) addPoint(point.x, point.y);
        });
        renderTable();

        if (tableRows.length === 0) {
            let beginTime = Math.floor(performance.now() * 1000);
            let cache = await getCache(1);
            putCache(cache, beginTime);
        }
    };
}

function savePointToDB(point) {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.add(point);
}

function deleteLastN(n) {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    const request = store.openCursor(null, "prev");

    let count = 0;
    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && count < n) {
            store.delete(cursor.primaryKey);
            tableRows.splice(tableRows.length - 1 - count, 1);
            count++;
            cursor.continue();
        }
    };
}

function createTableRow(point) {
    return `<tr><td>${point.x.toFixed(2)}</td><td>${point.y.toFixed(2)}</td><td>${point.r.toFixed(2)}</td><td>${point.hit}</td><td>${point.requestTime}</td><td>${point.execTime}ns</td></tr>`;
}

function putCache(cachedPage) {
    cachedPage.dots.forEach(dot => {
        let point = {
            x: dot.req.x,
            y: dot.req.y,
            r: dot.req.r,
            hit: dot.resp.hit,
            requestTime: dot.resp.requestTime,
            execTime: dot.resp.execTime
        }
        savePointToDB(point);
        const row = createTableRow(point);
        tableRows.push(row);
        if (point.hit) addPoint(point.x, point.y);
    })
    renderTable();
    $('#page-next').prop('disabled', !cachedPage.hasNext);
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
    let totalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));
    $('#page-info').text(currentPage);
    $('#page-prev').prop('disabled', currentPage === 1);
    $('#page-next').prop('disabled', currentPage === totalPages);
}

$('#page-prev').on('click', function () {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

$('#page-next').on('click', async function () {
    let totalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));
    let nextButton = $(this);

    nextButton.prop('disabled', true);

    if (tableRows.length < currentPage * pageSize) {
        let cache = await getCache(currentPage + 1);
        if (cache.dots.length !== 0)
            deleteLastN(tableRows.length % pageSize);
    }

    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    } else {
        let cache = await getCache(currentPage + 1);
        currentPage++;
        putCache(cache);
    }

    nextButton.prop('disabled', !cache.hasNext);
});

$('#page-size-select').on('change', async function () {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    renderTable();
    if (tableRows.length < pageSize) {
        deleteLastN(tableRows.length);
        let beginTime = Math.floor(performance.now() * 1000);
        let cache = await getCache(currentPage);
        putCache(cache, beginTime);
    }
});

$('#clear-table').on('click', function () {
    currentPage = 1;
    tableRows = [];
    const transaction = db.transaction([storeName], "readwrite");
    transaction.objectStore(storeName).clear();
    renderTable();
});