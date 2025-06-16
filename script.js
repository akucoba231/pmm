let test;

function analyzeVideo(skill) {
            // Simulasi analisis AI (dalam implementasi nyata akan menggunakan API AI)
    alert(`Video ${skill} sedang dianalisis oleh AI...`);

    let vidContainer = document.getElementById(skill);
    vidContainer.innerHTML = "";

    let video = document.createElement('video');
    let source = document.createElement('source');
    let videoUpload = document.getElementById(`${skill}-video`);
    let note = document.getElementById(`${skill}-note`);
    test = videoUpload.files[0];
    let tmp = videoUpload.files[0];
    note.textContent = tmp.name;
    source.src = URL.createObjectURL(tmp);
    source.type = tmp.type

    video.appendChild(source);
    video.controls = true;
    vidContainer.appendChild(video);
    console.log(test);

            // Tampilkan hasil (ini hanya simulasi)
    setTimeout(() => {
        document.getElementById(`${skill}-result`).style.display = 'block';
        calculateOverallAverage();
    }, 2000);
}

function resetForm() {
    if(confirm('Apakah Anda yakin ingin mereset semua data?')) {
        document.getElementById('student-name').value = '';
        document.getElementById('student-class').value = '';
        document.getElementById('student-school').value = '';

        const results = document.querySelectorAll('.analysis-result');
        results.forEach(result => {
            result.style.display = 'none';
        });

        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.value = '';
        });

        document.getElementById('overall-result').style.display = 'none';
    }
}

function generateReport() {
    const name = document.getElementById('student-name').value || 'Nama Siswa';
    calculateOverallAverage();
    alert(`Laporan lengkap untuk ${name} sedang diproses...`);
            // Dalam implementasi nyata akan menghasilkan PDF atau tampilan laporan
}

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