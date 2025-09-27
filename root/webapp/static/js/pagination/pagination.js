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
        let cache = await getCache(1);
        const points = request.result;
        points.forEach(point => {
            const row = createTableRow(point);
            tableRows.push(row);
            if (point.hit) addPoint(point.x, point.y);
        });
        renderTable();

        if (tableRows.length === 0) {
            putCache(cache);
        }
        $('#page-next').prop('disabled', !cache.hasNext);
    };
}

function savePointToDB(point) {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.add(point);
}

function deleteLastN(n) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);

        const request = store.openCursor(null, "prev");
        let count = 0;

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor && count < n) {
                store.delete(cursor.primaryKey);
                tableRows.pop();
                //console.log('Deleted row');
                count++;
                cursor.continue();
            } else {
                resolve();
            }
        };

        request.onerror = () => reject(request.error);
    });
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
    if (currentPage === Math.max(1, Math.ceil(tableRows.length / pageSize)))
        $('#page-next').prop('disabled', !cachedPage.hasNext);
}

async function updateLastPage() {
    let totalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));
    let cache = await getCache(totalPages);
    //console.log(`tableRows.length: ${tableRows.length}, totalSize: ${totalPages * pageSize}`);
    //console.log(`cache size: ${cache.dots.length}`);
    if (tableRows.length < totalPages * pageSize) {
        if (cache.dots.length !== 0) {
            await deleteLastN(tableRows.length % pageSize);
            putCache(cache);
        }
    }
    //console.log(`disabled: ${!cache.hasNext}`);
    //console.log(`page: ${currentPage} of ${totalPages}`);
    if (currentPage === totalPages) {
        $('#page-next').prop('disabled', !cache.hasNext);
    }
}

function renderTable() {
    //console.log(tableRows.length);
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

    let cache = null;

    if (tableRows.length < currentPage * pageSize) {
        cache = await getCache(currentPage + 1);
        if (cache.dots.length !== 0)
            await deleteLastN(tableRows.length % pageSize);
        nextButton.prop('disabled', !cache.hasNext);
    }

    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    } else {
        if (cache === null) cache = await getCache(currentPage + 1);
        currentPage++;
        putCache(cache);
        nextButton.prop('disabled', !cache.hasNext);
    }
});

$('#page-size-select').on('change', async function () {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    renderTable();
    if (tableRows.length < pageSize) {
        await deleteLastN(tableRows.length);
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