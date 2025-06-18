import {
  ObjectDetector,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";

const vision = await FilesetResolver.forVisionTasks(
  // path/to/wasm/root
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
let objectDetector = await ObjectDetector.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`,
    //delegate: "GPU"
},
scoreThreshold: 0.5,
  runningMode: "IMAGE", //VIDEO , IMAGE
  displayNamesLocale: "id",
  categoryAllowList: ["person", "ball"]
});


function makeBox2(el, x, y, w, h, keterangan, confident) {
  //imgCont;
  let scale = 1; //(video.naturalWidth / video.offsetWidth).toFixed(1);

  x = (x / scale).toFixed(1)
  y = (y / scale).toFixed(1)
  w = (w / scale).toFixed(1)
  h = (h / scale).toFixed(1)

  let span = document.createElement('span');
  span.textContent = keterangan + " : " + confident
  let box = document.createElement('div');
  box.setAttribute('class', 'box');
  box.classList.add('video-box')
  box.setAttribute('style', `
    top: ${y}px;
    left: ${x}px;
    width: ${w}px;
    height: ${h}px;
  `);
  box.appendChild(span)
  el.appendChild(box);
}


await objectDetector.setOptions({ runningMode: "VIDEO" });


let lastVideoTime = -1;
function renderLoop(nama_video) {
  const video = document.getElementById(nama_video);

  if(video.ended){
    lastVideoTime = -1;
}
else if (video.currentTime !== lastVideoTime) {
    let vidCont = video.parentNode;
    //console.log(video);
    try {
      let videoBox = document.getElementsByClassName('video-box');
      Array.from(videoBox).forEach((item) => {
        item.parentNode.removeChild(item);
    })
  } catch (e) {
      console.log(e.toString())
  }
  const detections = objectDetector.detectForVideo(video, lastVideoTime);
  console.log(detections.detections);
  let lihat = detections.detections;
  lihat.forEach((item) => {
      let keterangan = item.categories[0].categoryName;
      let confident = item.categories[0].score;
      let x = item.boundingBox.originX
      let y = item.boundingBox.originY
      let width = item.boundingBox.width
      let height = item.boundingBox.height

      makeBox2(vidCont, x, y, width, height, keterangan, confident);
      //console.log("ok")
  })
  lastVideoTime = video.currentTime;
  
}

requestAnimationFrame(() => {
    renderLoop(nama_video);
});
}



let test;
let scores = {
    lempar : 0,
    tangkap : 0,
    hit: 0,
    kick: 0,
}

function analyzeVideo(skill) {
            // Simulasi analisis AI (dalam implementasi nyata akan menggunakan API AI)
    alert(`Video ${skill} sedang dianalisis oleh AI...`);

    let vidContainer = document.getElementById(skill);
    vidContainer.innerHTML = "";

    let video = document.createElement('video');
    video.setAttribute('id',`${skill}-video`);
    let source = document.createElement('source');
    let videoUpload = document.getElementById(`${skill}-video`);
    let note = document.getElementById(`${skill}-note`);

    test = videoUpload.files[0];

    let tmp = videoUpload.files[0];
    if(tmp == undefined){
        return alert("Masukan video terlebih dahulu.")
    }
    note.textContent = tmp.name;
    source.src = URL.createObjectURL(tmp);
    source.type = tmp.type

    video.appendChild(source);
    video.controls = true;
    vidContainer.appendChild(video);
    video.addEventListener('loadeddata', async ()=>{
        console.log("Memulai analisa");
        renderLoop(`${skill}-video`);
    })
    //console.log(test);

            // Tampilkan hasil (ini hanya simulasi)
    setTimeout(() => {
        document.getElementById(`${skill}-result`).style.display = 'block';
        console.log('ok')
        if (skill == "catch") {
            scores['tangkap'] = getNilai(`${skill}-score`);
        }
        else if(skill == "throw"){
            scores['lempar'] = getNilai(`${skill}-score`);
        }
        else{
            scores[skill] = getNilai(`${skill}-score`);
        }
        //calculateOverallAverage();
    }, 2000);
}

document.getElementById('reset').onclick = ()=>{
    return resetForm();
}

function resetForm() {
    if(confirm('Apakah Anda yakin ingin mereset semua data?')) {
        // document.getElementById('student-name').value = '';
        // document.getElementById('student-class').value = '';
        // document.getElementById('student-school').value = '';

        let input = document.getElementsByTagName('input');
        Array.from(input).forEach((item)=>{
            item.value = "";
        })

        for(const obj in scores){
            scores[obj] = 0;
        }

        document.getElementById('overall-result').style.display = 'none';
        document.getElementById('all-score-wrapper').style.display = 'none';
        document.getElementById('export').style.display = 'none';
    }
}

function generateReport() {
    const name = document.getElementById('student-name').value || 'Nama Siswa';
    calculateOverallAverage();
    alert(`Laporan lengkap untuk ${name} sedang diproses...`);
            // Dalam implementasi nyata akan menghasilkan PDF atau tampilan laporan
}

/*
function calculateOverallAverage() {
    const averages = [];
    const skills = ['throw', 'catch', 'hit', 'kick'];

    skills.forEach(skill => {
        const resultElement = document.getElementById(`${skill}-result`);
        if (resultElement && resultElement.style.display !== 'none') {
            const averageElement = document.getElementById(`${skill}-average`);
            if (averageElement) {
                const averageValue = parseFloat(averageElement.textContent);
                averages.push(averageValue);
            }
        }
    });

    if (averages.length > 0) {
        const totalAverage = (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(1);
        document.getElementById('total-average').textContent = totalAverage;

                // Tentukan kategori berdasarkan nilai rata-rata
        let category = '';
        if (totalAverage >= 3.5) {
            category = 'Sangat Baik';
        } else if (totalAverage >= 2.5) {
            category = 'Baik';
        } else if (totalAverage >= 1.5) {
            category = 'Cukup';
        } else {
            category = 'Perlu Perbaikan';
        }

        document.getElementById('total-average').textContent = `${totalAverage} (${category})`;
        document.getElementById('overall-result').style.display = 'block';
    }
}
*/

function getNilai(el){
    console.log(el);
    let tmp = document.getElementById(el);
    console.log(tmp)

    let score = Math.min((Math.random()*100).toFixed(1), 100);
    tmp.textContent = score;
    return score;
}

let button = document.getElementsByClassName('analyzeVideo');

Array.from(button).forEach((item)=>{
    item.onclick = (e)=>{
        let skill = item.getAttribute('data-id');
        analyzeVideo(skill);
    }
})

let record = document.getElementById('record');
record.onclick = ()=>{
    let showData = document.getElementsByClassName('show-data');
    let input = document.getElementsByClassName('input-text')
    let hasEmpty = false
    Array.from(input).forEach((item)=>{
        if(item.value == ""){
            alert("Masukan data : " + item.getAttribute('id'));
            hasEmpty = true;
        }
    })

    if(hasEmpty == true){
        return;
    }

    let data = {
        nama : "",
        kelas : "",
        sekolah : "",
        nilai1 : 0,
        nilai2 : 0,
        nilai3 : 0,
        nilai4 : 0,
    }

    let key = ['nama', 'kelas', 'sekolah'];
    
    for(let i = 0; i < 7; ++i){
        if(i < 3){
            showData[i].textContent = input[i].value
            data[key[i]] = input[i].value
        }
        switch(i) {
        case 3:
            showData[i].textContent = scores.lempar
            data.nilai1 = scores.lempar
            break;
        case 4:
            showData[i].textContent = scores.tangkap
            data.nilai2 = scores.tangkap
            break;
        case 5:
            showData[i].textContent = scores.hit
            data.nilai3 = scores.hit
            break;
        case 6:
            showData[i].textContent = scores.kick
            data.nilai4 = scores.kick
            break;
        default:
            break;
        }
    }

    data['tanggal'] = getTanggal();
    document.getElementById('tanggal').textContent = data.tanggal


    let dataNilai = [];
    if(localStorage.getItem('dataNilai') == null){
        dataNilai[0] = data;
        localStorage.setItem('dataNilai', JSON.stringify(dataNilai));
    }
    else{
        let tmp = localStorage.getItem('dataNilai');
        dataNilai = JSON.parse(tmp);
        dataNilai[dataNilai.length] = data
        localStorage.setItem('dataNilai', JSON.stringify(dataNilai));
    }
    
    document.getElementById('overall-result').style.display = 'block';
    //return "ok";

}


function getTanggal(){
    let d = new Date();
    let y = d.getFullYear();

    let m = d.getMonth()+1;

    if(m.toString().length > 1){
        m = m
    }
    else {
        m = `0${m}`
    }

    let t = d.getDate()

    if(t.toString().length > 1){
        t = t
    } else {
        t = `0${t}`
    }

    let h = d.getHours();
    let mnt = d.getMinutes();
    let dtk = d.getSeconds();

    return `${y}/${m}/${t} ${h}:${mnt}:${dtk}`;
}

function showAllRecord(){
    let allScoreWrapper = document.getElementById('all-score-wrapper');
    let exportXLS = document.getElementById('export')

    allScoreWrapper.style.display = "block"
    exportXLS.style.display = "block";

    exportXLS.onclick = ()=>{
        exportToXLS();
    }

    let tbodyRecord = document.getElementById('tbody-record');
    tbodyRecord.innerHTML = "";

    let controlShow = ['tanggal','nama','kelas','sekolah','nilai1', 'nilai2', 'nilai3', 'nilai4']

    if(localStorage.getItem('dataNilai') == null){
        return alert('No data found !');
    }
    else {
        let dataNilai = localStorage.getItem('dataNilai');
        dataNilai = JSON.parse(dataNilai);

        let n = 1;
        Array.from(dataNilai).forEach((item)=>{
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = n;
            tr.appendChild(td)
            for(let i of controlShow){
                let tdN = document.createElement('td');
                tdN.textContent = item[i]
                tr.appendChild(tdN);
            }

            tbodyRecord.appendChild(tr);
            ++n;
        })
    }
}
let tombolShowRecord = document.getElementById('show-all');
tombolShowRecord.onclick = ()=>{
    showAllRecord();
}


// Fungsi untuk export ke XLSX
function exportToXLS() {
            /* Ambil data dari tabel HTML */
    const table = document.getElementById('table-record');
    const ws = XLSX.utils.table_to_sheet(table, {
        cellDates: true, // Penting: agar tanggal dikenali sebagai objek tanggal Excel
        dateNF: "dd/mm/yyyy hh:mm:ss", // Format yang diinginkan (tanggal dan waktu)

    });

            /* Buat workbook baru */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Hasil Penilaian");

            /* Tulis file XLSX */
    XLSX.writeFile(wb, "PMM_data_analisa_video" +".xlsx");
}
