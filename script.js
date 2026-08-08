
function openPage(id, menu) {
  document.querySelector(".navbar").classList.add("inactive");
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-menu li").forEach((item) => item.classList.remove("active"));
  menu.classList.add("active");
}

const DEFAULT_PASSWORD = "1234";
const DEFAULT_TITLE = "Goldsmith";

// ပထမဆုံးဖွင့်ရင် Default Password သိမ်း
if (!localStorage.getItem("password")) {
    localStorage.setItem("password", DEFAULT_PASSWORD);
}


if (!localStorage.getItem("title")) {
    localStorage.setItem("title", DEFAULT_TITLE);
}

// ==========================
// Page Load
// ==========================
window.onload = function () {

    if (localStorage.getItem("isLogin") === "true") {

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("app").style.display = "block";

    } else {

        document.getElementById("loginPage").style.display = "flex";
        document.getElementById("app").style.display = "none";

    }

};

// ==========================
// Login
// ==========================
function login() {

    let password = document.getElementById("loginPass").value;
    let savedPassword = localStorage.getItem("password");

    if (password === savedPassword) {
        // Login State သိမ်း
        localStorage.setItem("isLogin", "true");

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("app").style.display = "block";

        document.getElementById("loginPass").value = "";
        document.getElementById("loginMsg").innerHTML = "";
    } else {
        document.getElementById("loginMsg").innerHTML = "Password မှားနေပါတယ်";
    }
}

// ==========================
// Logout
// ==========================
function logout() {
    // Login State ဖျက်
    localStorage.removeItem("isLogin");
    document.getElementById("app").style.display = "none";
    document.getElementById("loginPage").style.display = "flex";
    document.getElementById("loginPass").value = "";
}

// ==========================
// Change Password
// ==========================
function showChange() {
    const box = document.getElementById("changeBox");
    box.style.display =
        box.style.display === "block" ? "none" : "block";
}

function changePassword() {

    let oldPass = document.getElementById("oldPass").value;
    let newPass = document.getElementById("newPass").value;
    let newTitle = document.getElementById("newTitle").value;

    let savedPassword = localStorage.getItem("password");

    if (oldPass !== savedPassword) {
        alert("Current Password မှားနေပါတယ်");
        return;
    }

    if (newPass.trim() === "") {
        alert("New Password ထည့်ပါ");
        return;
    }

    localStorage.setItem("password", newPass);
    localStorage.setItem("title", newTitle.trim() === "" ? DEFAULT_TITLE : newTitle.trim());
    document.getElementById("appTitle").innerText = localStorage.getItem("title");

    

    alert("Changes saved successfully");

    document.getElementById("oldPass").value = "";
    document.getElementById("newPass").value = "";
    document.getElementById("newTitle").value = "";
    document.getElementById("changeBox").style.display = "none";

}
document.getElementById("appTitle").innerText = localStorage.getItem("title");


function backupData() {
  let data = {};
  Object.keys(localStorage).forEach((key) => (data[key] = localStorage.getItem(key)));
  let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "single_backup.json";
  a.click();
}

function restoreData() {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.multiple = true;

  input.onchange = (e) => {
    localStorage.clear();
    let files = e.target.files;
    if (files.length === 0) return;

    let completed = 0;
    for (let file of files) {
      let reader = new FileReader();
      reader.onload = function () {
        try {
          let data = JSON.parse(reader.result);
          Object.keys(data).forEach((key) => localStorage.setItem(key, data[key]));
          completed++;
          if (completed === files.length) {
            alert(files.length + " ခုသော Backup File များ Restore ပြီးပါပြီ");
            location.reload();
          }
        } catch (err) {
          alert(file.name + " သည် JSON File မမှန်ပါ။");
        }
      };
      reader.readAsText(file);
    }
  };

  input.click();
}

function timestamp(withTime) {
  let d = new Date();
  let s =
    d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  if (withTime) {
    s +=
      " " +
      String(d.getHours()).padStart(2, "0") +
      ":" +
      String(d.getMinutes()).padStart(2, "0") +
      ":" +
      String(d.getSeconds()).padStart(2, "0");
  }
  return s;
}

function deleteAllData() {
  const groups = [
    { list: workers, extra: " မှာ" },
    { list: shops, extra: " ဆိုင်မှာ" },
  ];

  for (const { list, extra } of groups) {
    for (const item of list) {
      let goldData = JSON.parse(localStorage.getItem("goldlists_" + item.name)) || [];
      if (goldData.length > 0) {
        alert(
          item.name +
            extra +
            " လက်ရှိစာရင်းရှိနေသေးသောကြောင့် ဖျက်၍မရပါ။\nစာရင်းအားလုံးကို Close လုပ်ပြီးမှ ဖျက်နိုင်ပါသည်။",
        );
        return;
      }
    }
  }

  let pass = prompt("Password");
  if (pass !== localStorage.getItem("password")) {
    alert("Password မှားပါတယ်");
    return;
  }

  if (!confirm("History များကို မဖျက်ခင် Backup သိမ်းပြီး ဖျက်မှာ သေချာပါသလား?")) return;

  let backup = {};
  Object.keys(localStorage).forEach((key) => (backup[key] = localStorage.getItem(key)));
  let blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "Gold_Backup_" + timestamp(false) + ".json";
  a.click();
  URL.revokeObjectURL(url);

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("workerHistory_") || key.startsWith("shopHistory_")) {
      localStorage.removeItem(key);
    }
  });
  localStorage.removeItem("owngold");

  alert("Backup သိမ်းပြီး History များကို ဖျက်ပြီးပါပြီ။");
  location.reload();
}

function showAbout() {
  document.querySelector(".about").classList.remove("inactive");
  document.querySelector(".setting-btns").classList.add("inactive");
}
/* ============ Shared state & gold-unit helpers ============ */

let workers = JSON.parse(localStorage.getItem("workers")) || [];
let shops = JSON.parse(localStorage.getItem("shops")) || [];
let editIndex = -1;

const K = 16.58;

function fromGram(type) {
  let g = Number(document.getElementById(type + "Gram").value) || 0;
  let k = Math.floor(g / K);
  let r = g - k * K;
  let p = Math.floor(r / (K / 16));
  r -= p * (K / 16);
  let y = Math.round(r / (K / 128));
  document.getElementById(type + "Kyat").value = k;
  document.getElementById(type + "Pae").value = p;
  document.getElementById(type + "Yway").value = y;
}

function fromGold(type) {
  let k = Number(document.getElementById(type + "Kyat").value) || 0;
  let p = Number(document.getElementById(type + "Pae").value) || 0;
  let y = Number(document.getElementById(type + "Yway").value) || 0;
  let g = k * K + p * (K / 16) + y * (K / 128);
  document.getElementById(type + "Gram").value = g.toFixed(3);
}

function goldText(g) {
  let sign = "";
  if (g < 0) {
    sign = "-";
    g = Math.abs(g);
  }
  let k = Math.floor(g / K);
  let r = g - k * K;
  let p = Math.floor(r / (K / 16));
  r -= p * (K / 16);
  let y = Math.round(r / (K / 128));
  if (y >= 8) {
    y = 0;
    p++;
  }
  if (p >= 16) {
    p = 0;
    k++;
  }
  return `
        ${sign}${g.toFixed(3)} g
        <br>
        ${sign}${k}' ${p}'' ${y} ရွေး
    `;
}
function goldKPY(g) {
  let sign = "";
  if (g < 0) {
    sign = "-";
    g = Math.abs(g);
  }
  let k = Math.floor(g / K);
  let r = g - k * K;
  let p = Math.floor(r / (K / 16));
  r -= p * (K / 16);
  let y = Math.round(r / (K / 128));
  if (y >= 8) {
    y = 0;
    p++;
  }
  if (p >= 16) {
    p = 0;
    k++;
  }
  return `
        ${sign}${k}ကျပ် ${p}ပဲ ${y} ရွေး
    `;
}

const isMobile = window.innerWidth < 768; // 📱 Mobile = gram, 💻 Desktop = goldText

function displayGold(value) {
  value = Number(value || 0);
  if (value === 0) return " ";
  return isMobile ? value.toFixed(2) + "g" : goldText(value);
}


function formatDate(dateStr) {
  let d = new Date(dateStr.replace(" ", "T"));
  return d.toLocaleString("en-GB", { day: "numeric", month: "numeric", year: "numeric" });
}

function clear() {
  document.querySelectorAll("input").forEach((x) => (x.value = ""));
}

/* ============ Worker / Shop shared config ============ */

function getList(type) {
  return type === "worker" ? workers : shops;
}
function dataKey(type, index) {
  return "goldlists_" + getList(type)[index].name;
}
function historyKeyOf(type, name) {
  return (type === "worker" ? "workerHistory_" : "shopHistory_") + name;
}

function inputGroup(title, prefix, extra) {
  return `
    <div class="input-group">
        <div>${title}</div>
        <div style="display:flex">
            <div><input id="${prefix}Gram" placeholder="Gram" oninput="fromGram('${prefix}')" /></div>
            ${extra || ""}
        </div>
        <div class="kpy-div">
            <div><input id="${prefix}Kyat" placeholder="ကျပ်" oninput="fromGold('${prefix}')" /></div>
            <div><input id="${prefix}Pae" placeholder="ပဲ" oninput="fromGold('${prefix}')" /></div>
            <div><input id="${prefix}Yway" placeholder="ရွေး" oninput="fromGold('${prefix}')" /></div>
        </div>
    </div>`;
}

/* ============ Name / Shop registration ============ */

function Save(type) {
  let input = document.getElementById(type === "worker" ? "name_input" : "shop_input");
  let name = input.value.trim();
  if (name === "") return;

  let list = getList(type);
  if (list.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
    alert(`"${name}" already exists.`);
    return;
  }

  list.push({ name });
  localStorage.setItem(type === "worker" ? "workers" : "shops", JSON.stringify(list));
  input.value = "";
  display();
  nameForHistory();
}

function Delete(type, i) {
  if (!confirm("ဖျက်မလား?")) return;
  if (prompt("Password ရိုက်ထည့်ပါ") !== localStorage.getItem("password")) {
    alert("Password မှားနေပါတယ်");
    return;
  }

  let list = getList(type);
  let name = list[i].name;
  list.splice(i, 1);
  localStorage.setItem(type === "worker" ? "workers" : "shops", JSON.stringify(list));

  Object.keys(localStorage).forEach((key) => {
    if (key.endsWith("_" + name)) localStorage.removeItem(key);
  });

  alert("ဖျက်ပြီးပါပြီ");
  display();
}

display();

function display() {
  document.getElementById("name_list").innerHTML = workers
    .map(
      (item, index) => `
        <div class="name-div">
            <div onclick="workerDetail(${index})" style="width:90%">${item.name}</div>
            <div><button onclick="Delete('worker', ${index})" style="padding: 0 10px;">🗑</button></div>
        </div>`,
    )
    .join("");

  document.getElementById("shop_list").innerHTML = shops
    .map(
      (item, index) => `
        <div class="name-div">
            <div onclick="shopDetail(${index})" style="width:95%">${item.name}</div>
            <button onclick="Delete('shop', ${index})" style="padding: 0 10px;">🗑</button>
        </div>`,
    )
    .join("");
}

/* ============ Worker / Shop ledger detail page ============ */

function openDetail(type, index) {
  const isWorker = type === "worker";
  const listSel = isWorker ? "#name_list" : "#shop_list";
  const detailSel = isWorker ? "#w_detail_div" : "#s_detail_div";

  document.querySelector(listSel).classList.add("inactive");
  document.querySelector(detailSel).classList.remove("inactive");
  document.querySelectorAll(".on-off-nav").forEach((nav) => nav.classList.add("inactive"));

  const name = getList(type)[index].name;

  const dateField = isWorker ? `<input id="workDate" type="date"/>` : `နေ့စွဲ<input id="shopDate" type="date"/>`;

  const fieldsHtml = isWorker
    ? inputGroup("ပေးရွှေ", "give") +
      inputGroup("အပ်ရွှေ", "get", `<div><input id="types" placeholder="အမျိုးအစား" /></div>`) +
      inputGroup("အလျော့", "factor")
    : inputGroup("လက်ခံ", "sget") +
      inputGroup("ပြန်အပ်", "sgive") +
      inputGroup("ရလျော့", "getfactor") +
      inputGroup("ပေးလျော့", "givefactor");

  const tableHead = isWorker
    ? `<th>☑</th><th>နေ့စွဲ</th><th>ပေးရွှေ</th><th>အပ်ရွှေ</th><th>Type</th><th>လျော့</th><th>ကျန်</th><th>Action</th>`
    : `<th>☑</th><th>နေ့စွဲ</th><th>လက်ခံ</th><th>ပြန်အပ်</th><th>ရလျော့</th><th>ပေးလျော့</th><th>ကျန်</th><th>Action</th>`;

  const tableId = (isWorker ? "mainTable_" : "mainShopTable_") + index;
  const saveBtnClass = isWorker ? "res-btn1" : "res-btn1";

  document.querySelector(detailSel).innerHTML = `
      <div class="second-nav">
        <div class="icon" onclick="${isWorker ? "workerBack()" : "shopBack()"}">⬅️</div>
        <div style="text-align: center;">${name}</div>
        <div>${dateField}</div>
      </div>

      <div class="main-ctn">
                <div class="input-group-ctn">
                    ${fieldsHtml}
                </div>
                    <div style="display: flex; justify-content: center; margin-top: 5px;">
                        <button class="${saveBtnClass}" onclick="saveData('${type}', ${index})">SAVE</button>
                    </div>
                        <table>
                            <tr>${tableHead}</tr>
                            <tbody id="${tableId}"></tbody>
                        </table>
    </div>
      `;

  renderList(type, index);
}

const workerDetail = (index) => openDetail("worker", index);
const shopDetail = (index) => openDetail("shop", index);

function saveData(type, index) {
  const isWorker = type === "worker";
  const dateId = isWorker ? "workDate" : "shopDate";
  if (document.getElementById(dateId).value === "") {
    alert("နေ့စွဲထည့်ပါ");
    return;
  }

  const giveId = isWorker ? "giveGram" : "sgiveGram";
  const getId = isWorker ? "getGram" : "sgetGram";
  if (document.getElementById(giveId).value === "" && document.getElementById(getId).value === "") {
    alert("ပေးရွှေ(သို့)အပ်ရွှေ ထည့်ပါ");
    return;
  }

  const list = getList(type);
  const key = dataKey(type, index);
  let goldData = JSON.parse(localStorage.getItem(key)) || [];
  const dateInput = document.getElementById(dateId).value;

  let obj;
  if (isWorker) {
    obj = {
      name: list[index].name,
      date: dateInput,
      give: Number(document.getElementById("giveGram").value) || 0,
      get: Number(document.getElementById("getGram").value) || 0,
      types: document.getElementById("types").value,
      factor: Number(document.getElementById("factorGram").value) || 0,
      checked: false,
    };
  } else {
    obj = {
      shop: list[index].name,
      date: dateInput,
      give: Number(document.getElementById("sgiveGram").value) || 0,
      get: Number(document.getElementById("sgetGram").value) || 0,
      getfactor: Number(document.getElementById("getfactorGram").value) || 0,
      givefactor: Number(document.getElementById("givefactorGram").value) || 0,
      checked: false,
    };
  }

  if (editIndex === -1) {
    goldData.push(obj);
  } else {
    goldData[editIndex] = obj;
    editIndex = -1;
  }

  localStorage.setItem(key, JSON.stringify(goldData));
  clear();
  renderList(type, index);
}

function renderList(type, index) {
  const isWorker = type === "worker";
  const goldData = JSON.parse(localStorage.getItem(dataKey(type, index))) || [];

  let balance = 0;
  let rows = "";

  goldData.forEach((x, i) => {
    if (isWorker) {
      balance += Number(x.get || 0) - Number(x.give || 0);
    } else {
      balance += Number(x.get || 0) + Number(x.getfactor || 0) - Number(x.give || 0) - Number(x.givefactor || 0);
    }

    const action = x.checked
      ? '<span style="color:green;font-weight:bold;">✔ ပြီးစီး</span>'
      : `<button class="res-btn2" onclick="editData('${type}', ${index}, ${i})">✏️</button>
         <button class="res-btn2" onclick="deleteData('${type}', ${index}, ${i})">🗑️</button>`;

    const checkbox = `<input type="checkbox" ${x.checked ? "checked" : " "} onchange="toggleCheck('${type}', ${index}, ${i})">`;

    rows += isWorker
      ? `<tr>
          <td>${checkbox}</td>
          <td>${formatDate(x.date)}</td>
          <td>${x.give ? displayGold(x.give) : "-"}</td>
          <td>${x.get ? displayGold(x.get) : "-"}</td>
          <td>${x.types ? x.types : "-"}</td>
          <td>${x.factor ? displayGold(x.factor) : "-"}</td>
          <td>${displayGold(balance)}</td>
          <td>${action}</td>
        </tr>`
      : `<tr>
          <td>${checkbox}</td>
          <td>${formatDate(x.date)}</td>
          <td>${x.get ? displayGold(x.get) : "-"}</td>
          <td>${x.give ? displayGold(x.give) : "-"}</td>
          <td>${x.getfactor ? displayGold(x.getfactor) : "-"}</td>
          <td>${x.givefactor ? displayGold(x.givefactor) : "-"}</td>
          <td>${displayGold(balance)}</td>
          <td>${action}</td>
        </tr>`;
  });

  let give = 0,
    get = 0,
    factorA = 0,
    factorB = 0;
  goldData.forEach((x) => {
    give += Number(x.give || 0);
    get += Number(x.get || 0);
    if (isWorker) factorA += Number(x.factor || 0);
    else {
      factorA += Number(x.getfactor || 0);
      factorB += Number(x.givefactor || 0);
    }
  });

  const closeBtn = `<button class="res-btn" onclick="closeList('${type}', ${index})">စာရင်းပိတ်</button>`;

  rows += isWorker
    ? `<tr style="font-weight:bold;background:#eeee">
        <td colspan="2">စုစုပေါင်း</td>
        <td>${displayGold(give)}</td>
        <td>${displayGold(get)}</td>
        <td> </td>
        <td>${displayGold(factorA)}</td>
        <td>${displayGold(balance)}</td>
        <td>${closeBtn}</td>
      </tr>`
    : `<tr style="font-weight:bold;background:#eeee;">
        <td colspan="2">စုစုပေါင်း</td>
        <td>${displayGold(get)}</td>
        <td>${displayGold(give)}</td>
        <td>${displayGold(factorA)}</td>
        <td>${displayGold(factorB)}</td>
        <td>${displayGold(balance)}</td>
        <td>${closeBtn}</td>
      </tr>`;

  document.getElementById((isWorker ? "mainTable_" : "mainShopTable_") + index).innerHTML = rows;
}

function showWorker(index) {
  renderList("worker", index);
}
function showShop(index) {
  renderList("shop", index);
}

function toggleCheck(type, idx, itemIdx) {
  const key = dataKey(type, idx);
  const goldData = JSON.parse(localStorage.getItem(key)) || [];
  goldData[itemIdx].checked = !goldData[itemIdx].checked;
  localStorage.setItem(key, JSON.stringify(goldData));
  renderList(type, idx);
}

const EDIT_FIELD_MAP = {
  worker: { give: "give", get: "get", factor: "factor" },
  shop: { sget: "get", sgive: "give", getfactor: "getfactor", givefactor: "givefactor" },
};

function editData(type, idx, itemIdx) {
  editIndex = itemIdx;
  const r = (JSON.parse(localStorage.getItem(dataKey(type, idx))) || [])[itemIdx];

  Object.entries(EDIT_FIELD_MAP[type]).forEach(([inputPrefix, field]) => {
    document.getElementById(inputPrefix + "Gram").value = r[field];
    fromGram(inputPrefix);
  });

  if (type === "worker") {
    document.getElementById("types").value = r.types;
    document.getElementById("workDate").value = r.date;
  } else {
    document.getElementById("shopDate").value = r.date;
  }
}

function deleteData(type, idx, itemIdx) {
  if (!confirm("ဖျက်မလား?")) return;
  const key = dataKey(type, idx);
  const goldData = JSON.parse(localStorage.getItem(key)) || [];
  goldData.splice(itemIdx, 1);
  localStorage.setItem(key, JSON.stringify(goldData));
  renderList(type, idx);
}

function closeList(type, index) {
  const isWorker = type === "worker";
  const name = getList(type)[index].name;
  const key = dataKey(type, index);
  const goldData = JSON.parse(localStorage.getItem(key)) || [];

  if (goldData.length == 0) {
    alert("စာရင်းမရှိပါ");
    return;
  }
  if (!goldData.every((item) => item.checked === true)) {
    alert("စာရင်းမပိတ်နိုင်သေးပါ!\nRecord အားလုံးကို ✓ Check လုပ်ပြီးမှ ပိတ်နိုင်ပါသည်။");
    return;
  }
  if (!confirm("ဒီစာရင်းကို ပိတ်ပြီး History ထဲသိမ်းမလား?")) return;

  const closeDate = timestamp(true);
  const dates = goldData.map((x) => x.date).filter(Boolean).sort();
  const startDate = dates[0] || "";
  const endDate = dates[dates.length - 1] || "";

  let totalGive = 0,
    totalGet = 0;
  let entry;

  if (isWorker) {
    let totalFactor = 0;
    goldData.forEach((x) => {
      totalGive += Number(x.give || 0);
      totalGet += Number(x.get || 0);
      totalFactor += Number(x.factor || 0);
    });
    entry = {
      worker: name,
      closeDate,
      startDate,
      endDate,
      totalGive,
      totalGet,
      balance: totalGet - totalGive,
      totalFactor,
      details: goldData,
    };
  } else {
    let totalGetFactor = 0,
      totalGiveFactor = 0;
    goldData.forEach((x) => {
      totalGive += Number(x.give || 0);
      totalGet += Number(x.get || 0);
      totalGetFactor += Number(x.getfactor || 0);
      totalGiveFactor += Number(x.givefactor || 0);
    });
    entry = {
      name,
      closeDate,
      startDate,
      endDate,
      totalGive,
      totalGet,
      balance: totalGet + totalGetFactor - (totalGive + totalGiveFactor),
      totalGetFactor,
      totalGiveFactor,
      details: goldData,
    };
  }

  const historyKey = historyKeyOf(type, name);
  const history = JSON.parse(localStorage.getItem(historyKey)) || [];
  history.push(entry);
  localStorage.setItem(historyKey, JSON.stringify(history));
  localStorage.setItem(key, JSON.stringify([]));
  
  alert("စာရင်းပိတ်ပြီး History ထဲသိမ်းပြီးပါပြီ");
  renderList(type, index);
  finalResult();
  // nameForHistory();
}

/* ============ History modal (view a closed period) ============ */

function historyView(type, name, idx) {
  const isWorker = type === "worker";
  const history = JSON.parse(localStorage.getItem(historyKeyOf(type, name))) || [];
  const data = history[idx];
  if (!data) {
    alert("History not found!");
    return;
  }

  const details = data.details || [];
  let rows = "";
  let balance = 0;
  let totalGive = 0,
    totalGet = 0,
    totalFactor = 0,
    totalGetFactor = 0,
    totalGiveFactor = 0;

  details.forEach((x) => {
    const give = Number(x.give || 0);
    const get = Number(x.get || 0);
    totalGive += give;
    totalGet += get;

    if (isWorker) {
      const factor = Number(x.factor || 0);
      totalFactor += factor;
      balance += get - give;
      rows += `
        <tr>
          <td>${formatDate(x.date)}</td>
          <td>${give ? displayGold(give) : "-"}</td>
          <td>${get ? displayGold(get) : "-"}</td>
          <td>${x.types || "-"}</td>
          <td>${factor ? displayGold(factor) : "-"}</td>
          <td>${balance ? displayGold(balance) : "0"}</td>
        </tr>`;
    } else {
      const getFactor = Number(x.getfactor || 0);
      const giveFactor = Number(x.givefactor || 0);
      totalGetFactor += getFactor;
      totalGiveFactor += giveFactor;
      balance += get + getFactor - (give + giveFactor);
      rows += `
        <tr>
          <td>${formatDate(x.date)}</td>
          <td>${get ? displayGold(get) : "-"}</td>
          <td>${give ? displayGold(give) : "-"}</td>
          <td>${getFactor ? displayGold(getFactor) : "-"}</td>
          <td>${giveFactor ? displayGold(giveFactor) : "-"}</td>
          <td>${balance ? displayGold(balance) : "0"}</td>
        </tr>`;
    }
  });

  const dateRange = `${formatDate(data.startDate)} မှ <br> 
                     ${formatDate(data.endDate)} အထိ`;

  if (isWorker) {
    rows += `
      <tr style="background:#eee;font-weight:bold">
        <td>Total</td>
        <td>${totalGive ? displayGold(totalGive) : "-"}</td>
        <td>${totalGet ? displayGold(totalGet) : "-"}</td>
        <td>-</td>
        <td>${totalFactor ? displayGold(totalFactor) : "-"}</td>
        <td>${totalGet - totalGive ? displayGold(totalGet - totalGive) : "0"}</td>
      </tr>`;
    document.getElementById("historyDateRange").innerHTML = dateRange;
    document.getElementById("historyWorkerName").innerHTML = name;
    document.getElementById("historyDetails").innerHTML = rows;
    document.getElementById("workerModal").style.display = "block";
  } else {
    const totalBalance = totalGet + totalGetFactor - (totalGive + totalGiveFactor);
    rows += `
      <tr style="background:#eee;font-weight:bold">
        <td>Total</td>
        <td>${totalGet ? displayGold(totalGet) : "-"}</td>
        <td>${totalGive ? displayGold(totalGive) : "-"}</td>
        <td>${totalGetFactor ? displayGold(totalGetFactor) : "-"}</td>
        <td>${totalGiveFactor ? displayGold(totalGiveFactor) : "-"}</td>
        <td>${totalBalance ? displayGold(totalBalance) : "0"}</td>
      </tr>`;
    document.getElementById("shopDateRange").innerHTML = dateRange;
    document.getElementById("historyShopName").innerHTML = name;
    document.getElementById("shopDetails").innerHTML = rows;
    document.getElementById("shopModal").style.display = "block";
  }
}

function workerView(name, idx) {
  historyView("worker", name, idx);
}

function shopView(name, idx) {
  historyView("shop", name, idx);
}

function closeModal() {
  document.getElementById("workerModal").style.display = "none";
  document.getElementById("shopModal").style.display = "none";
}

/* ============ History list pages ============ */

nameForHistory();

function nameForHistory() {
  document.getElementById("name_h_div").innerHTML = workers
    .map(
      (item) => `
        <div class="his-name-div">
            <div onclick="WorkerHistory('${item.name}')" style="width:100%">${item.name}</div>
        </div>`,
    )
    .join("");

  document.getElementById("shop_h_div").innerHTML = shops
    .map(
      (item) => `
        <div class="his-shop-div">
            <div onclick="ShopHistory('${item.name}')" style="width:100%">${item.name}</div>
        </div>`,
    )
    .join("");
}

function showHistory(type, name) {
  const isWorker = type === "worker";
  document.querySelectorAll(".on-off-nav").forEach((nav) => nav.classList.add("inactive"));
 
  if (isWorker) {
    document.querySelector(".h-w-table").classList.remove("inactive");
  } else {
    document.querySelector(".h-s-table").classList.remove("inactive");
  }

  const history = JSON.parse(localStorage.getItem(historyKeyOf(type, name))) || [];

  let rows = "";
  let totalGive = 0,
    totalGet = 0,
    totalBalance = 0,
    totalFactor = 0,
    totalGetFactor = 0,
    totalGiveFactor = 0;

  history.forEach((x, i) => {
    totalGive += Number(x.totalGive || 0);
    totalGet += Number(x.totalGet || 0);
    totalBalance += Number(x.balance || 0);

    if (isWorker) {
      totalFactor += Number(x.totalFactor || 0);
      rows += `
        <tr>
          <td>${i + 1}</td>
          <td>${formatDate(x.closeDate)}</td>
          <td>${x.totalGive ? displayGold(x.totalGive) : "-"}</td>
          <td>${x.totalGet ? displayGold(x.totalGet) : "-"}</td>
          <td>${x.totalFactor ? displayGold(x.totalFactor) : "-"}</td>
          <td>${x.balance ? displayGold(x.balance) : "0"}</td>
          <td><button class="res-btn2" onclick="workerView('${name}', ${i})">View</button></td>
        </tr>`;
    } else {
      totalGetFactor += Number(x.totalGetFactor || 0);
      totalGiveFactor += Number(x.totalGiveFactor || 0);
      rows += `
        <tr>
          <td>${i + 1}</td>
          <td>${formatDate(x.closeDate)}</td>
          <td>${x.totalGet ? displayGold(x.totalGet) : "-"}</td>
          <td>${x.totalGive ? displayGold(x.totalGive) : "-"}</td>
          <td>${x.totalGetFactor ? displayGold(x.totalGetFactor) : "-"}</td>
          <td>${x.totalGiveFactor ? displayGold(x.totalGiveFactor) : "-"}</td>
          <td>${x.balance ? displayGold(x.balance) : "0"}</td>
          <td><button class="res-btn2" onclick="shopView('${name}', ${i})">View</button></td>
        </tr>`;
    }
  });

  const head = isWorker
    ? `<th>No</th><th>ပိတ်ရက်</th><th>ပေး</th><th>အပ်</th><th>လျော့</th><th>ကျန်</th><th>Action</th>`
    : `<th>No</th><th>ပိတ်ရက်</th><th>ရ</th><th>ပေး</th><th>ရလျော့</th><th>ပေးလျော့</th><th>ကျန်</th><th>Action</th>`;

  const foot = isWorker
    ? `<th colspan="2">စုစုပေါင်း</th>
       <th>${totalGive ? displayGold(totalGive) : "-"}</th>
       <th>${totalGet ? displayGold(totalGet) : "-"}</th>
       <th>${totalFactor ? displayGold(totalFactor) : "-"}</th>
       <th>${totalBalance ? displayGold(totalBalance) : "0"}</th>
       <th></th>`
    : `<th colspan="2">စုစုပေါင်း</th>
       <th>${totalGet ? displayGold(totalGet) : "-"}</th>
       <th>${totalGive ? displayGold(totalGive) : "-"}</th>
       <th>${totalGetFactor ? displayGold(totalGetFactor) : "-"}</th>
       <th>${totalGiveFactor ? displayGold(totalGiveFactor) : "-"}</th>
       <th>${totalBalance ? displayGold(totalBalance) : "0"}</th>
       <th></th>`;

  document.getElementById(isWorker ? "mainHWorkerTable" : "mainHShopTable").innerHTML = `
      <div class="second-nav">
        <div></div>
        <div style="text-align: center;">${name}</div>
        <div class="icon" onclick="${isWorker ? "WhBack()" : "ShBack()"}">⬅️</div>
      </div>

        <table border="1">
            <thead><tr>${head}</tr></thead>
            <tbody>${rows}</tbody>
            <tfoot><tr>${foot}</tr></tfoot>
        </table>
    `;
}


function WorkerHistory(name) {
  showHistory("worker", name);
}

function ShopHistory(name) {
  showHistory("shop", name);
}

function Back() {
  document.querySelector(".navbar").classList.remove("inactive");
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
}

function reBack() {
  location.reload();
}

document.getElementById("about").addEventListener("click", Back);

function workerBack() {
  document.querySelector("#w_detail_div").classList.add("inactive");
  document.querySelectorAll(".on-off-nav").forEach((nav) => nav.classList.remove("inactive"));
}

function shopBack() {
  document.querySelector("#s_detail_div").classList.add("inactive");
  document.querySelectorAll(".on-off-nav").forEach((nav) => nav.classList.remove("inactive"));
}

function WhBack() {
  document.querySelector(".h-w-table").classList.add("inactive");
  document.querySelectorAll(".on-off-nav").forEach((nav) => nav.classList.remove("inactive"));
}

function ShBack() {
  document.querySelector(".h-s-table").classList.add("inactive");
  document.querySelectorAll(".on-off-nav").forEach((nav) => nav.classList.remove("inactive"));
}

/* ============ Final summary (all workers + shops + own gold) ============ */

finalResult();

function finalResult() {
  let rows = "";
  let totalGive = 0,
    totalGet = 0,
    totalFactor = 0,
    totalGetFactor = 0,
    totalGiveFactor = 0,
    totalBalance = 0,
    totalOwnGold = 0;

  const ownGold = JSON.parse(localStorage.getItem("owngold")) || [];
  ownGold.forEach((item) => (totalOwnGold += Number(item.own || 0)));

  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith("workerHistory_") && !key.startsWith("shopHistory_")) return;

    const history = JSON.parse(localStorage.getItem(key)) || [];

    history.forEach((item) => {
      const getFactor = item.totalGetFactor ?? 0; // Worker => totalFactor, Shop => totalGetFactor
      const giveFactor = item.totalGiveFactor ?? 0; // Worker has no giveFactor
      const factor = item.totalFactor ?? 0;

      rows += `
            <tr>
            <td>${item.worker || item.name}</td>
                <td></td>
                <td>${item.totalGet ? displayGold(item.totalGet) : "-"}</td>
                <td>${item.totalGive ? displayGold(item.totalGive) : "-"}</td>
                <td>${factor ? displayGold(factor) : "-"}</td>
                <td>${getFactor ? displayGold(getFactor) : "-"}</td>
                <td>${giveFactor ? displayGold(giveFactor) : "-"}</td>
                <td>${item.balance ? displayGold(item.balance) : "0"}</td>
            </tr>
            `;

      totalGive += Number(item.totalGive || 0);
      totalGet += Number(item.totalGet || 0);
      totalFactor += Number(factor);
      totalGetFactor += Number(getFactor);
      totalGiveFactor += Number(giveFactor);
      totalBalance += Number(item.balance || 0);
    });
  });

  const finalBalance = totalGet + totalGetFactor - (totalGive + totalGiveFactor) - totalOwnGold;
  document.getElementById("final_history").innerHTML = rows;

  document.getElementById("historyFoot").innerHTML = `
        <tr style="font-weight:bold;background:#eeee;">
            <td colspan="1">စုစုပေါင်း</td>
            <td>${displayGold(totalOwnGold)}</td>
            <td>${displayGold(totalGet)}</td>
            <td>${displayGold(totalGive)}</td>
            <td>${displayGold(totalFactor)}</td>
            <td>${displayGold(totalGetFactor)}</td>
            <td>${displayGold(totalGiveFactor)}</td>
            <td>${displayGold(finalBalance)}</td>
        </tr>
    `;


  document.getElementById("finalSummary").innerHTML = `
        
        <div><h3>စုစုပေါင်း</h3></div>
        <div> <p>စိုက်ရွှေ :-</p> <p>${goldKPY(totalOwnGold)}</p></div>
        <div> <p>ရရွှေ :-</p> <p>${goldKPY(totalGet)}</p></div>
        <div> <p>ပေးရွှေ :-</p> <p>${goldKPY(totalGive)}</p></div>  
        <div> <p>လျော့တွက် :-</p> <p>${goldKPY(totalFactor)}</p></div>  
        <div> <p>ရလျော့ :-</p> <p>${goldKPY(totalGetFactor)}</p></div>
        <div>  <p>ပေးလျော့ :-</p> <p>${goldKPY(totalGiveFactor)}</p></div>
        <div> <p>ကျန်ရွှေ :-</p> <p>${goldKPY(finalBalance)}</p></div>

      `;
}

/* ============ Own gold (ဖိုစိုက်ရွှေ) ============ */

showOwn();

function ownSave() {
  let owngold = JSON.parse(localStorage.getItem("owngold")) || [];
  let ownDate = document.querySelector(".owndate").value;
  let obj = {
    date: ownDate,
    own: Number(document.getElementById("ownGram").value) || 0,
  };

  if (ownDate === "") {
    alert("နေ့စွဲထည့်ပါ");
    return;
  }
  if (obj.own === 0) {
    alert("စိုက်ရွှေထည့်ပါ");
    return;
  }

  if (editIndex === -1) {
    owngold.push(obj);
  } else {
    owngold[editIndex] = obj;
    editIndex = -1;
  }

  localStorage.setItem("owngold", JSON.stringify(owngold));
  clear();
  showOwn();
  finalResult();
}

function showOwn(index) {
  let goldData = JSON.parse(localStorage.getItem("owngold")) || [];

  let html = goldData
    .map(
      (x, i) => `
        <tr>
            <td><input type="checkbox" ${x.checked ? "checked" : ""} onchange="otoggleCheck(${index}, ${i})"></td>
            <td>${formatDate(x.date)}</td>
            <td>${x.own ? goldText(x.own) : "-"}</td>
            <td>
                ${
                  x.checked
                    ? '<span style="color:green;font-weight:bold;">✔ ပြီးစီး</span>'
                    : `<button onclick="editOwnData(${index}, ${i})">✏️</button>
                       <button onclick="deleteOwnData(${index}, ${i})">🗑️</button>`
                }
            </td>
        </tr>`,
    )
    .join("");

  let g = 0;
  goldData.forEach((x) => (g += Number(x.own || 0)));

  html += `
    <tr style="font-weight:bold;background:#eeee;">
        <td colspan="2">စုစုပေါင်း</td>
        <td>${goldText(g)}</td>
        <td></td>
    </tr>
    `;

  document.getElementById("own_tbody").innerHTML = html;
}

function otoggleCheck(workerIndex, itemIndex) {
  let goldData = JSON.parse(localStorage.getItem("owngold")) || [];
  goldData[itemIndex].checked = !goldData[itemIndex].checked;
  localStorage.setItem("owngold", JSON.stringify(goldData));
  showOwn(workerIndex);
}

function editOwnData(workerIndex, itemIndex) {
  editIndex = itemIndex;
  let goldData = JSON.parse(localStorage.getItem("owngold")) || [];
  let r = goldData[itemIndex];
  document.getElementById("ownGram").value = r.own;
  fromGram("own");
  document.getElementById("ownDate").value = r.date;
}

function deleteOwnData(workerIndex, itemIndex) {
  if (confirm("ဖျက်မလား?")) {
    let goldData = JSON.parse(localStorage.getItem("owngold")) || [];
    goldData.splice(itemIndex, 1);
    localStorage.setItem("owngold", JSON.stringify(goldData));
    showOwn(workerIndex);
    finalResult();
  }
}
