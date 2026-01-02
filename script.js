let data = {};
let historyLog = [];
let animFrame = null;

/* ===== ALGORITMA ===== */
function fibIteratif(n) {
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return n === 0 ? 0 : b;
}

function fibRekursif(n) {
    if (n <= 1) return n;
    return fibRekursif(n - 1) + fibRekursif(n - 2);
}

/* ===== KONTROL ===== */
function ujiIteratif() { uji("iteratif"); }
function ujiRekursif() { uji("rekursif"); }

function uji(tipe) {
    let n = +document.getElementById("n").value;
    let ulang = +document.getElementById("ulang").value;

    if (!data[n]) data[n] = { iteratif: "-", rekursif: "-" };

    let start = performance.now();
    let hasil;
    for (let i = 0; i < ulang; i++) {
        hasil = tipe === "iteratif" ? fibIteratif(n) : fibRekursif(n);
    }

    let waktu = +(performance.now() - start).toFixed(3);
    data[n][tipe] = waktu;

    historyLog.unshift(`${tipe} | n=${n} | ${ulang}x | ${waktu} ms`);

    document.getElementById("hasil").innerText =
        `${tipe.toUpperCase()} → Fibonacci(${n}) = ${hasil}
(${ulang}x), Waktu: ${waktu} ms`;

    updateHistory();
    updateTabel();
    animateCharts();
}

/* ===== CLEAR ===== */
function clearAll() {
    if (animFrame) cancelAnimationFrame(animFrame);
    data = {};
    historyLog = [];
    document.getElementById("hasil").innerText = "Data telah dihapus";
    document.getElementById("history").innerText = "Belum ada percobaan";
    document.getElementById("tabelData").innerHTML = "";
    resetCanvas("lineChart");
    resetCanvas("barChart");
}

function resetCanvas(id) {
    const c = document.getElementById(id);
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;
}

/* ===== HISTORY & TABEL ===== */
function updateHistory() {
    const el = document.getElementById("history");
    el.innerHTML = "";
    historyLog.slice(0, 15).forEach(h => {
        const d = document.createElement("div");
        d.innerText = h;
        el.appendChild(d);
    });
}

function updateTabel() {
    const tbody = document.getElementById("tabelData");
    tbody.innerHTML = "";
    Object.keys(data).sort((a,b)=>a-b).forEach(n => {
        tbody.innerHTML += `
        <tr>
            <td>${n}</td>
            <td>${data[n].iteratif}</td>
            <td>${data[n].rekursif}</td>
        </tr>`;
    });
}

/* ===== ANIMASI ===== */
function animateCharts() {
    if (animFrame) cancelAnimationFrame(animFrame);
    let step = 0, max = 25;

    function frame() {
        step++;
        let p = step / max;
        drawLineChart(p);
        drawBarChart(p);
        if (step < max) animFrame = requestAnimationFrame(frame);
    }
    frame();
}

/* ===== LINE CHART (Sumbu JELAS) ===== */
function drawLineChart(p = 1) {
    const c = document.getElementById("lineChart");
    const ctx = c.getContext("2d");
    c.width = c.offsetWidth;
    c.height = 240;
    ctx.clearRect(0,0,c.width,c.height);

    const ns = Object.keys(data)
        .sort((a,b)=>a-b)
        .filter(n => data[n].iteratif !== "-" && data[n].rekursif !== "-");
    if (ns.length < 2) return;

    const pad = 50;
    const baseY = c.height - pad;
    const maxH = baseY - pad;

    let maxVal = Math.max(...ns.map(n =>
        Math.max(data[n].iteratif, data[n].rekursif)
    ));
    const scale = maxH / maxVal;
    const visible = Math.max(1, Math.floor(ns.length * p));

    /* Sumbu Y */
    ctx.fillStyle = "#cbd5f5";
    for (let i = 0; i <= 4; i++) {
        let val = (maxVal * i / 4).toFixed(1);
        let y = baseY - (i / 4) * maxH;
        ctx.fillText(val, 6, y + 4);
        ctx.strokeStyle = "#1e293b";
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(c.width - pad, y);
        ctx.stroke();
    }

    /* Sumbu X */
    ns.forEach((n,i)=>{
        let x = pad + i*(c.width-2*pad)/(ns.length-1);
        ctx.fillText(n, x-4, baseY + 16);
    });

    ["iteratif","rekursif"].forEach(key=>{
        ctx.beginPath();
        ns.slice(0, visible).forEach((n,i)=>{
            let x = pad + i*(c.width-2*pad)/(ns.length-1);
            let y = baseY - data[n][key]*scale;
            i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        });
        ctx.strokeStyle = key==="iteratif" ? "#60a5fa" : "#f87171";
        ctx.lineWidth = 2.5;
        ctx.stroke();
    });
}

/* ===== BAR CHART (PEMBATAS JELAS) ===== */
function drawBarChart(p = 1) {
    const c = document.getElementById("barChart");
    const ctx = c.getContext("2d");
    c.width = c.offsetWidth;
    c.height = 240;
    ctx.clearRect(0,0,c.width,c.height);

    const pad = 50;
    const baseY = c.height - pad;
    const maxH = baseY - pad;

    const ns = Object.keys(data).sort((a,b)=>a-b);
    if (!ns.length) return;

    let maxVal = Math.max(...ns.map(n =>
        data[n].rekursif === "-" ? 1 : Math.log10(data[n].rekursif+1)
    ));
    const scale = maxH / maxVal;
    const barW = 18;
    const visible = Math.max(1, Math.floor(ns.length * p));

    /* Garis pembatas */
    ctx.strokeStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(pad, baseY);
    ctx.lineTo(c.width - pad, baseY);
    ctx.stroke();

    ns.slice(0, visible).forEach((n,i)=>{
        let x = pad + i*70;

        if (data[n].iteratif !== "-") {
            let h = Math.log10(data[n].iteratif+1)*scale;
            ctx.fillStyle = "#60a5fa";
            ctx.fillRect(x, baseY-h, barW, h);
        }

        if (data[n].rekursif !== "-") {
            let h = Math.log10(data[n].rekursif+1)*scale;
            ctx.fillStyle = "#f87171";
            ctx.fillRect(x+barW+6, baseY-h, barW, h);
        }

        ctx.fillStyle = "#cbd5f5";
        ctx.fillText(n, x+4, baseY + 18);
    });
}
