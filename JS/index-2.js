// UNTUK AMBIL DATA DARI API PADA HALAMAN DRIVER

// JUDUL TABLE
const judul = ["Country", "Name", "Driver Number", "Team"];
// KODE BENDERA
const countryCodes = ["nl", "us", "gb", "fr", "mx", "es", "mc", 
  "de", "nl", "jp", "cn", "de", "fr", "gb", "es", "gb", "au", "th", "br", "fi"];

// MEMILIH TABLE HEAD DAN BODY
const tbth = document.querySelector(".table-head");
const tbbd = document.querySelector(".table-body");

// BUAT HEADER TABLE 
function buatHeaderTabel() {
  const barisHeader = document.createElement("tr");
  
  judul.forEach((judulKolom) => {
    const elemenTh = document.createElement("th");
    elemenTh.textContent = judulKolom;
    barisHeader.appendChild(elemenTh);
  });
  
  tbth.appendChild(barisHeader);
}
// <------------------------------>

// Buat baris untuk setiap pembalap
function buatBarisPembalap(pembalap, kodeNegara, indeks) {
  const baris = document.createElement("tr");

  // Kolom negara dengan bendera
  const kolomNegara = document.createElement("td");
  const gambarBendera = document.createElement("img");
  gambarBendera.src = `https://flagcdn.com/w40/${kodeNegara}.png`;
  gambarBendera.alt = pembalap.country || "-";
  gambarBendera.style.width = "30px";
  gambarBendera.style.borderRadius = "4px";
  kolomNegara.appendChild(gambarBendera);
  baris.appendChild(kolomNegara);

  // Kolom nama
  const kolomNama = document.createElement("td");
  kolomNama.textContent = pembalap.full_name || "-";
  baris.appendChild(kolomNama);

  // Kolom nomor pembalap
  const kolomNomor = document.createElement("td");
  kolomNomor.textContent = pembalap.driver_number || "-";
  baris.appendChild(kolomNomor);

  // Kolom tim
  const kolomTim = document.createElement("td");
  kolomTim.textContent = pembalap.team_name || "-";
  baris.appendChild(kolomTim);

  return baris;
}

// Ambil data pembalap dengan cache
async function ambilDataPembalap() {
  try {
    const kunciCache = 'cache-data-pembalap';
    const waktuCache = 'waktu-cache-pembalap';
    const waktuSekarang = Date.now();
    const satuJam = 3600000; // 1 jam dalam milidetik

    // Cek cache yang masih valid
    const dataCache = localStorage.getItem(kunciCache);
    const waktuCacheSimpan = localStorage.getItem(waktuCache);
    
    if (dataCache && waktuCacheSimpan && (waktuSekarang - parseInt(waktuCacheSimpan)) < satuJam) {
      prosesDataPembalap(JSON.parse(dataCache));
      return;
    }

    // Ambil data baru jika cache tidak ada atau kadaluarsa
    const respons = await fetch("https://api.openf1.org/v1/drivers");
    
    if (!respons.ok) {
      throw new Error(`HTTP error! status: ${respons.status}`);
    }
    
    const data = await respons.json();
    
    // Simpan ke cache
    localStorage.setItem(kunciCache, JSON.stringify(data));
    localStorage.setItem(waktuCache, waktuSekarang.toString());
    
    prosesDataPembalap(data);
  } catch (error) {
    console.error("Error mengambil data:", error);
    tampilkanPesanError();
  }
}

// Proses data pembalap
function prosesDataPembalap(data) {
  // Kosongkan tabel
  tbbd.innerHTML = '';
  
  // Buat header
  buatHeaderTabel();

  // supaya tidak duplicate
  const pembalapUnik = [];
  const namaUnik = new Set();
  
  for (const pembalap of data) {
    if (namaUnik.size >= 20) break;
    if (!namaUnik.has(pembalap.full_name)) {
      namaUnik.add(pembalap.full_name);
      pembalapUnik.push(pembalap);
    }
  }

  // Render semua sekaligus
  const fragment = document.createDocumentFragment();
  
  pembalapUnik.forEach((pembalap, indeks) => {
    const kode = countryCodes[indeks % countryCodes.length];
    fragment.appendChild(buatBarisPembalap(pembalap, kode, indeks));
  });
  
  tbbd.appendChild(fragment);
}

// Tampilkan pesan error
function tampilkanPesanError() {
  const barisError = document.createElement("tr");
  const kolomError = document.createElement("td");
  kolomError.colSpan = "4";
  kolomError.textContent = "Gagal memuat data. Silakan coba lagi.";
  barisError.appendChild(kolomError);
  tbbd.appendChild(barisError);
}

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", ambilDataPembalap);