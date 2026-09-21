const video = document.getElementById("mainVideo");

// ここに発言の情報をまとめています。
// 秒数が分かったら time: 0 のように数字を入れれば、動画ジャンプが有効になります。
// 現在は 00:20 の1件だけ入力済みです。
const voices = [
  { person: "長谷川", time: "06:40", seconds: 400, text: "バーベキューの匂いする！", tree: true, treeFile: "tree_01.png" },
  { person: "長谷川", time: "03:11", seconds: 191, text: "なんか変な音した", tree: true, treeFile: "tree_02.png" },
  { person: "長谷川", time: "00:20", seconds: 20, text: "立ち入り禁止、キープアウト、危険、立ち入らないでください", tree: true, treeFile: "tree_03.png" },
  { person: "初田", time: "20:42", seconds: 1242, text: "写真撮る人の動きだ", tree: true, treeFile: "tree_04.png" },
  { person: "初田", time: "14:59", seconds: 899, text: "ボルトゴツ！", tree: true, treeFile: "tree_05.png" },
  { person: "初田", time: "19:46", seconds: 1186, text: "謎のシミ", tree: true, treeFile: "tree_06.png" },
  { person: "原田", time: "22:13", seconds: 1333, text: "海がすごく青いかな", tree: true, treeFile: "tree_07.png" },
  { person: "原田", time: "22:00", seconds: 1320, text: "海がすっごい綺麗にキラキラめっちゃ眩しい", tree: true, treeFile: "tree_08.png" },
  { person: "原田", time: "22:24", seconds: 1344, text: "あそこの空間誰か入れそう", tree: true, treeFile: "tree_09.png" },
  { person: "尾関", time: "24:09", seconds: 1449, text: "森がありますね結構深いと思うんですけど", tree: true, treeFile: "tree_10.png" },
  { person: "尾関", time: "26:15", seconds: 1575, text: "これは金属でしょ", tree: true, treeFile: "tree_11.png" },
  { person: "尾関", time: "31:19", seconds: 1879, text: "髪の毛みたいな葉っぱが落ちてる", tree: true, treeFile: "tree_12.png" },
  { person: "森久", time: "45:37", seconds: 2737, text: "奥の方に行くと薄くなっているのでこれは空気遠近法なのかな", tree: true, treeFile: "tree_13.png" },
  { person: "森久", time: "36:45", seconds: 2205, text: "光の玉がブツブツと輝いている", tree: true, treeFile: "tree_14.png" },
  { person: "森久", time: "46:51", seconds: 2811, text: "黒いうねうねした牛のような模様と白い背景", tree: true, treeFile: "tree_15.png" }
];

function formatPerson(person) {
  return person || "話者未入力";
}

function makeVoiceCard(item, index, compact = false) {
  const card = document.createElement("button");
  card.className = `voice-card${item.seconds !== null ? " is-linked" : " is-pending"}${item.tree ? " has-tree" : ""}`;
  card.type = "button";
  card.dataset.index = index;
  card.innerHTML = `
    <div class="voice-top">
      <span class="voice-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="voice-person">${formatPerson(item.person)}</span>
      <span class="voice-time">${item.time || "--:--"}</span>
    </div>
    <div class="voice-text">${item.text}</div>
    ${item.tree ? '<div class="tree-badge">THOUGHT ↗</div>' : ''}
  `;
  if (item.seconds !== null || item.tree) {
    card.addEventListener("click", () => selectVoice(index));
  }
  return card;
}

function renderVoices() {
  const timeline = document.getElementById("timeline-grid");
  const side = document.getElementById("video-event-list");
  if (!timeline || !side) return;

  voices.forEach((item, index) => {
    timeline.appendChild(makeVoiceCard(item, index));
    if (item.seconds !== null || item.tree) {
      side.appendChild(makeVoiceCard(item, index, true));
    }
  });
}

function selectVoice(index) {
  const item = voices[index];
  if (!item) return;

  if (item.seconds !== null && video) {
    video.currentTime = item.seconds;
    video.play().catch(() => {});
    document.querySelector(".video-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (item.tree) {
    showTree(index);
    document.getElementById("thought")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function showTree(index) {
  const item = voices[index];
  if (!item) return;
  const img = document.getElementById("tree-image");
  const lightboxImg = document.getElementById("lightbox-image");
  const meta = document.querySelector(".thought-meta");
  const title = document.querySelector(".thought-copy h3");
  const caption = document.querySelector(".thought-copy p");
  if (img) {
    img.src = item.treeFile;
    img.alt = `No.${index + 1}「${item.text}」の認知プロセスの樹形図`;
  }
  if (lightboxImg) {
    lightboxImg.src = item.treeFile;
    lightboxImg.alt = `No.${index + 1}「${item.text}」の認知プロセスの樹形図`;
  }
  if (meta) meta.textContent = `${formatPerson(item.person)} / ${item.time || "--:--"}`;
  if (title) title.textContent = `「${item.text}」`;
  if (caption) caption.textContent = `No.${index + 1}　この発言に至るまでの認知プロセス。`;
}

showTree(0);

renderVoices();

document.querySelectorAll("[data-person]").forEach(el => {
  el.addEventListener("click", () => {
    document.querySelectorAll(".map-pin").forEach(pin => {
      pin.style.background = "#000";
      pin.style.color = "#fff";
    });
    el.style.background = "#fff";
    el.style.color = "#000";
  });
});

// 樹形図の拡大表示
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const zoomValue = document.getElementById("zoom-value");
let zoom = 100;

function updateZoom() {
  zoom = Math.max(50, Math.min(300, zoom));
  lightboxImage.style.width = `${zoom}%`;
  zoomValue.textContent = `${zoom}%`;
}

function openLightbox() {
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  zoom = 100;
  updateZoom();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

document.getElementById("open-tree")?.addEventListener("click", openLightbox);
document.getElementById("close-lightbox")?.addEventListener("click", closeLightbox);
document.getElementById("zoom-in")?.addEventListener("click", () => { zoom += 25; updateZoom(); });
document.getElementById("zoom-out")?.addEventListener("click", () => { zoom -= 25; updateZoom(); });
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target === document.getElementById("lightbox-stage")) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
const timelineImage = document.getElementById("timelineImage");
const timelineZoomIn = document.getElementById("zoomIn");
const timelineZoomOut = document.getElementById("zoomOut");
const timelineZoomReset = document.getElementById("zoomReset");
const timelineZoomLevel = document.getElementById("zoomLevel");

let timelineZoom = 1;

function updateTimelineZoom() {
  timelineImage.style.width = `${timelineZoom * 100}%`;
  timelineZoomLevel.textContent = `${Math.round(timelineZoom * 100)}%`;
}

timelineZoomIn.addEventListener("click", () => {
  timelineZoom = Math.min(timelineZoom + 0.25, 10);
  updateTimelineZoom();
});

timelineZoomOut.addEventListener("click", () => {
  timelineZoom = Math.max(timelineZoom - 0.25, 0.5);
  updateTimelineZoom();
});

timelineZoomReset.addEventListener("click", () => {
  timelineZoom = 1;
  updateTimelineZoom();
});

updateTimelineZoom();
// タイムスタンプから動画へ移動
const parallelMainVideo = document.getElementById("mainVideo");
const parallelTimestampButtons = document.querySelectorAll(".timestamp");

parallelTimestampButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const time = Number(button.dataset.time);

    parallelMainVideo.currentTime = time;
    parallelMainVideo.play();

    parallelMainVideo.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
});
