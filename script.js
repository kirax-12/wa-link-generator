// Pembuat Link WhatsApp — normalisasi nomor Indonesia + link wa.me live.

const phoneInput = document.getElementById("input-phone");
const messageInput = document.getElementById("input-message");
const normalizedLine = document.getElementById("normalized-line");
const phoneError = document.getElementById("phone-error");
const outputLink = document.getElementById("output-link");
const copyButton = document.getElementById("copy-button");
const copyStatus = document.getElementById("copy-status");
const openButton = document.getElementById("open-button");
const previewText = document.getElementById("preview-text");
const previewName = document.getElementById("preview-name");
const previewTime = document.getElementById("preview-time");
const bubble = document.querySelector(".bubble");
const charCount = document.getElementById("char-count");
const chips = document.querySelectorAll(".chip");

const TEMPLATES = {
  tanya:
    "Halo Kak, saya [Nama]. Mau tanya, [Produk] masih ready? Harganya berapa ya? Makasih.",
  order:
    "Halo Kak, saya [Nama]. Saya mau order [Produk] sebanyak 1 pcs. Tolong info total harga + ongkirnya ya. Makasih.",
  booking:
    "Halo Kak, saya [Nama]. Saya mau booking [Produk] untuk tanggal [Tanggal]. Masih tersedia? Ditunggu konfirmasinya ya, makasih.",
};

outputLink.placeholder = "Link muncul di sini setelah nomornya valid…";

// Rapikan nomor Indonesia jadi format internasional tanpa "+" dan tanpa spasi.
// 0812… → 62812…, 812… → 62812…, 62812… tetap, +62 812… → 62812…
function normalizePhone(raw) {
  let digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  } else if (digits.startsWith("8")) {
    digits = "62" + digits;
  } else if (digits.startsWith("620")) {
    // Kebiasaan nulis 62 + 0 di depan — buang nolnya.
    digits = "62" + digits.slice(3);
  }
  return digits;
}

function buildLink(digits, message) {
  const base = "https://wa.me/" + digits;
  const text = message.trim();
  return text ? base + "?text=" + encodeURIComponent(text) : base;
}

function setActionsEnabled(enabled, link) {
  copyButton.disabled = !enabled;
  if (enabled) {
    openButton.href = link;
    openButton.classList.remove("is-disabled");
    openButton.removeAttribute("aria-disabled");
  } else {
    openButton.href = "#";
    openButton.classList.add("is-disabled");
    openButton.setAttribute("aria-disabled", "true");
  }
}

function update() {
  const raw = phoneInput.value;
  const digits = normalizePhone(raw);
  const message = messageInput.value;

  charCount.textContent = message.length;

  // Pratinjau bubble chat
  if (message.trim()) {
    previewText.textContent = message;
    bubble.classList.remove("is-empty");
  } else {
    previewText.textContent = "Pesan pembuka kamu bakal muncul di sini…";
    bubble.classList.add("is-empty");
  }
  const now = new Date();
  previewTime.textContent =
    String(now.getHours()).padStart(2, "0") +
    "." +
    String(now.getMinutes()).padStart(2, "0");

  // Belum ngetik apa-apa: diam saja, jangan teriak error.
  if (!raw.trim() || !digits) {
    normalizedLine.hidden = true;
    phoneError.hidden = true;
    outputLink.value = "";
    previewName.textContent = "Toko Kamu";
    setActionsEnabled(false, "");
    return;
  }

  normalizedLine.hidden = false;
  normalizedLine.textContent = "Nomor tujuan: +" + digits;
  previewName.textContent = "+" + digits;

  if (digits.length < 10) {
    phoneError.hidden = false;
    phoneError.textContent =
      "Nomornya kependekan nih — nomor WA yang valid biasanya 10–15 digit setelah dirapikan. Cek lagi ya.";
    outputLink.value = "";
    setActionsEnabled(false, "");
    return;
  }
  if (digits.length > 15) {
    phoneError.hidden = false;
    phoneError.textContent =
      "Nomornya kepanjangan — maksimal 15 digit. Mungkin ada angka yang dobel atau kelebihan.";
    outputLink.value = "";
    setActionsEnabled(false, "");
    return;
  }

  phoneError.hidden = true;
  const link = buildLink(digits, message);
  outputLink.value = link;
  setActionsEnabled(true, link);
}

phoneInput.addEventListener("input", update);
messageInput.addEventListener("input", update);

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const text = TEMPLATES[chip.dataset.template];
    if (!text) return;
    messageInput.value = text;
    update();
    messageInput.focus();
    // Sorot placeholder pertama biar langsung bisa diganti.
    const start = text.indexOf("[");
    const end = text.indexOf("]");
    if (start !== -1 && end !== -1) {
      messageInput.setSelectionRange(start, end + 1);
    }
  });
});

let copyTimer = null;
copyButton.addEventListener("click", async () => {
  const link = outputLink.value;
  if (!link) return;
  let ok = false;
  try {
    await navigator.clipboard.writeText(link);
    ok = true;
  } catch (err) {
    // Clipboard API gagal (izin/konteks) — fallback cara lama.
    outputLink.select();
    outputLink.setSelectionRange(0, link.length);
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
  }
  if (ok) {
    copyButton.textContent = "Tersalin!";
    copyStatus.textContent = "Link tersalin — tinggal tempel di bio atau katalog kamu.";
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copyButton.textContent = "Salin Link";
      copyStatus.textContent = "";
    }, 2000);
  } else {
    copyStatus.textContent = "Gagal menyalin otomatis — blok linknya lalu tekan Ctrl+C ya.";
  }
});

openButton.addEventListener("click", (event) => {
  if (openButton.classList.contains("is-disabled")) {
    event.preventDefault();
  }
});

update();
