let data = {};
let historyLog = [];


function fibIteratif(n) {
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        let c = a + b;
        a = b;
        b = c;
    }
    return n === 0 ? 0 : b;
}

function fibRekursif(n) {
    if (n <= 1) return n;
    return fibRekursif(n - 1) + fibRekursif(n - 2);
}


function ujiIteratif() {
    runTest("iteratif");
}

function ujiRekursif() {
    runTest("rekursif");
}

function runTest(type) {
    const n = Number(document.getElementById("n").value);
    let ulang = Number(document.getElementById("ulang").value);

    if (type === "iteratif" && ulang < 50000) {
        ulang = 50000;
    }

    let start = performance.now();
    let hasil;

    for (let i = 0; i < ulang; i++) {
        hasil = (type === "iteratif")
            ? fibIteratif(n)
            : fibRekursif(n);
    }

    let waktu = +(performance.now() - start).toFixed(3);

    if (!data[n]) {
        data[n] = { iteratif: "-", rekursif: "-" };
    }
    data[n][type] = waktu;

    historyLog.unshift(
        `${type} | n=${n} | ${ulang}x | ${waktu} ms`
    );

    document.getElementById("hasil").innerText =
`${type.toUpperCase()} → Fibonacci(${n}) = ${hasil}
(${ulang}x), Waktu: ${waktu} ms`;

    updateHistory();
    updateTable();
    drawLineChart();
    drawBarChart();
}

function clearAll() {
    data = {};
    historyLog = [];

    document.getElementById("hasil").innerText = "Data dihapus";
    document.getElementById("history").innerText = "Belum ada percobaan";
    document.getElementById("tabelData").innerHTML = "";

    clearCanvas("lineChart");
    clearCanvas("barChart");
}

function updateHistory() {
    const el = document.getElementById("history");
    el.innerHTML = "";
    historyLog.slice(0, 12).forEach(item => {
        const div = document.createElement("div");
        div.innerText = item;
        el.appendChild(div);
    });
}

function updateTable() {
    const tbody = document.getElementById("tabelData");
    tbody.innerHTML = "";

    Object.keys(data)
        .sort((a, b) => a - b)
        .forEach(n => {
            tbody.innerHTML += `
                <tr>
                    <td>${n}</td>
                    <td>${data[n].iteratif}</td>
                    <td>${data[n].rekursif}</td>
                </tr>
            `;
        });
}


function clearCanvas(id) {
    const c = document.getElementById(id);
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
}


function drawLineChart() {
    const c = document.getElementById("lineChart");
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    const keys = Object.keys(data).map(Number).sort((a, b) => a - b);
    if (keys.length < 2) return;

    const pad = 45;
    const baseY = c.height - pad;
    const maxH = baseY - pad;

    const maxVal = Math.max(
        ...keys.map(n =>
            Math.max(
                data[n].iteratif === "-" ? 0 : data[n].iteratif,
                data[n].rekursif === "-" ? 0 : data[n].rekursif
            )
        )
    );

    const scale = maxH / maxVal;


    ctx.strokeStyle = "#1e293b";
    ctx.fillStyle = "#cbd5f5";
    for (let i = 0; i <= 4; i++) {
        let y = baseY - (i / 4) * maxH;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(c.width - pad, y);
        ctx.stroke();
        ctx.fillText((maxVal * i / 4).toFixed(1), 6, y + 4);
    }

   
    keys.forEach((n, i) => {
        let x = pad + i * (c.width - 2 * pad) / (keys.length - 1);
        ctx.fillText(n, x - 4, baseY + 16);
    });

    ["iteratif", "rekursif"].forEach(type => {
        const color = type === "iteratif" ? "#60a5fa" : "#f87171";
        const offset = type === "iteratif" ? -4 : 4;

   
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;

        keys.forEach((n, i) => {
            if (data[n][type] === "-") return;
            let x = pad + i * (c.width - 2 * pad) / (keys.length - 1);
            let y = baseY - data[n][type] * scale + offset;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();

   
        keys.forEach((n, i) => {
            if (data[n][type] === "-") return;
            let x = pad + i * (c.width - 2 * pad) / (keys.length - 1);
            let y = baseY - data[n][type] * scale + offset;

            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    });
}

function drawBarChart() {
    const c = document.getElementById("barChart");
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    const keys = Object.keys(data).map(Number).sort((a, b) => a - b);
    if (!keys.length) return;

    const pad = 45;
    const baseY = c.height - pad;
    const barW = 18;

    ctx.strokeStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(pad, baseY);
    ctx.lineTo(c.width - pad, baseY);
    ctx.stroke();

    keys.forEach((n, i) => {
        let x = pad + i * 60;

        if (data[n].iteratif !== "-") {
            let h = Math.log10(data[n].iteratif + 1) * 35;
            ctx.fillStyle = "#60a5fa";
            ctx.fillRect(x, baseY - h, barW, h);
        }

        if (data[n].rekursif !== "-") {
            let h = Math.log10(data[n].rekursif + 1) * 35;
            ctx.fillStyle = "#f87171";
            ctx.fillRect(x + barW + 6, baseY - h, barW, h);
        }

        ctx.fillStyle = "#cbd5f5";
        ctx.fillText(n, x + 2, baseY + 16);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const details = document.querySelectorAll("details");

    if (details.length >= 2) {
        details[0].innerHTML = `
            <summary>Algoritma Iteratif</summary>
            <p>
                Algoritma iteratif merupakan pendekatan penyelesaian masalah
                dengan menggunakan perulangan (loop) tanpa pemanggilan fungsi
                secara berulang.
            </p>
            <p>
                Pada algoritma Fibonacci iteratif, perhitungan dilakukan secara
                bertahap mulai dari nilai awal F(0) dan F(1), kemudian dilanjutkan
                hingga mencapai F(n). Setiap iterasi hanya melakukan satu operasi
                penjumlahan, sehingga tidak terjadi perhitungan ulang nilai yang sama.
            </p>
            <p>
                Pendekatan ini sangat efisien karena tidak memiliki overhead
                pemanggilan fungsi dan hanya membutuhkan sedikit variabel bantu.
                Oleh karena itu, algoritma iteratif memiliki performa yang stabil
                meskipun ukuran input semakin besar.
            </p>
            <p><b>Kompleksitas waktu:</b> O(n)</p>
            <p><b>Kompleksitas ruang:</b> O(1)</p>
        `;

        details[1].innerHTML = `
            <summary>Algoritma Rekursif</summary>
            <p>
                Algoritma rekursif menyelesaikan masalah dengan cara memanggil
                dirinya sendiri hingga mencapai kondisi dasar (base case).
            </p>
            <p>
                Pada Fibonacci rekursif, setiap pemanggilan fungsi F(n) akan
                memanggil F(n−1) dan F(n−2). Hal ini menyebabkan banyak nilai
                Fibonacci dihitung berulang kali.
            </p>
            <p>
                Jumlah pemanggilan fungsi bertambah secara eksponensial seiring
                bertambahnya nilai n, sehingga waktu eksekusi meningkat sangat
                drastis dibandingkan pendekatan iteratif.
            </p>
            <p><b>Kompleksitas waktu:</b> O(2ⁿ)</p>
            <p><b>Kompleksitas ruang:</b> O(n)</p>
        `;
    }
});