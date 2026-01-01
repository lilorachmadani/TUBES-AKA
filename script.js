let data = {};

function fibIteratif(n) {
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return n === 0 ? 0 : b;
}

function fibRekursif(n) {
    if (n <= 1) return n;
    return fibRekursif(n - 1) + fibRekursif(n - 2);
}

function ujiIteratif() { uji("iteratif"); }
function ujiRekursif() { uji("rekursif"); }

function uji(tipe) {
    let n = parseInt(document.getElementById("n").value);
    if (!data[n]) data[n] = { iteratif: "-", rekursif: "-" };

    const ULANGAN = 10000; 
    let hasil;

    let start = performance.now();
    for (let i = 0; i < ULANGAN; i++) {
        hasil = tipe === "iteratif"
            ? fibIteratif(n)
            : fibRekursif(n);
    }
    let waktu = (performance.now() - start).toFixed(3);

    data[n][tipe] = waktu;

    document.getElementById("hasil").innerText =
        `${tipe.toUpperCase()} → Fibonacci(${n}) = ${hasil}
        (dijalankan ${ULANGAN}x), Waktu: ${waktu} ms`;

    updateTabel();
    drawChart();
}

function updateTabel() {
    let tbody = document.getElementById("tabelData");
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

function drawChart() {
    let canvas = document.getElementById("chart");
    let ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const baseY = 260;        
    const maxHeight = 200;    

    let ns = Object.keys(data);
    if (ns.length === 0) return;

    let maxVal = 1;
    ns.forEach(n => {
        if (data[n].iteratif !== "-")
            maxVal = Math.max(maxVal, Math.log10(Number(data[n].iteratif) + 1));
        if (data[n].rekursif !== "-")
            maxVal = Math.max(maxVal, Math.log10(Number(data[n].rekursif) + 1));
    });

    let scale = maxHeight / maxVal;


    ctx.strokeStyle = "#cbd5f5";
    ctx.beginPath();
    ctx.moveTo(40, baseY);
    ctx.lineTo(canvas.width - 20, baseY);
    ctx.stroke();

    ns.forEach((n, i) => {
        let x = 60 + i * 80;

        if (data[n].iteratif !== "-") {
            let h = Math.log10(Number(data[n].iteratif) + 1) * scale;
            h = Math.min(h, maxHeight); 

            ctx.fillStyle = "#4f6ef7";
            ctx.fillRect(x, baseY - h, 20, h);
        }

        if (data[n].rekursif !== "-") {
            let h = Math.log10(Number(data[n].rekursif) + 1) * scale;
            h = Math.min(h, maxHeight); 

            ctx.fillStyle = "#ef4444";
            ctx.fillRect(x + 26, baseY - h, 20, h);
        }

        ctx.fillStyle = "#334155";
        ctx.fillText(n, x, baseY + 18);
    });

    ctx.fillStyle = "#475569";
    ctx.fillText("Skala Logaritmik (log10)", 10, 20);
}

