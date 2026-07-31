function openPage(id, menu) {
  document.querySelector(".navbar").classList.add("inactive");
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Show selected page
  document.getElementById(id).classList.add("active");

  // Remove active from all menu items
  document.querySelectorAll(".nav-menu li").forEach((item) => {
    item.classList.remove("active");
  });

  // Add active to clicked menu
  menu.classList.add("active");
}

if (!localStorage.getItem("password")) {
  localStorage.setItem("password", "1234");
}

function changePassword() {
  let oldPass = prompt("လက်ရှိ Password");

  let save = localStorage.getItem("password");

  if (oldPass !== save) {
    alert("Password မှားပါတယ်");

    return;
  }

  let newPass = prompt("Password အသစ်");

  if (newPass) {
    localStorage.setItem("password", newPass);

    alert("Password ပြောင်းပြီးပါပြီ");
  }
}

function backupData() {
  let data = {};

  Object.keys(localStorage).forEach((key) => {
    data[key] = localStorage.getItem(key);
  });

  let blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  let a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = "keybell_backup.json";

  a.click();
}

function restoreData() {
  let input = document.createElement("input");

  input.type = "file";
  input.accept = ".json";
  input.multiple = true; // ✅ File အများကြီးရွေးနိုင်

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

          Object.keys(data).forEach((key) => {
            localStorage.setItem(key, data[key]);
          });

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


function deleteAllData() {

  // ===========================
  // Workers စစ်
  // ===========================
  for (let worker of workers) {
    let key = "goldlists_" + worker.name;
    let goldData = JSON.parse(localStorage.getItem(key)) || [];

    if (goldData.length > 0) {
      alert(
        worker.name +
          " မှာ လက်ရှိစာရင်းရှိနေသေးသောကြောင့် ဖျက်၍မရပါ။\nစာရင်းအားလုံးကို Close လုပ်ပြီးမှ ဖျက်နိုင်ပါသည်။"
      );
      return;
    }
  }

  // ===========================
  // Shops စစ်
  // ===========================
  for (let shop of shops) {
    let key = "goldlists_" + shop.name;
    let shopData = JSON.parse(localStorage.getItem(key)) || [];

    if (shopData.length > 0) {
      alert(
        shop.name +
          " ဆိုင်မှာ လက်ရှိစာရင်းရှိနေသေးသောကြောင့် ဖျက်၍မရပါ။\nစာရင်းအားလုံးကို Close လုပ်ပြီးမှ ဖျက်နိုင်ပါသည်။"
      );
      return;
    }
  }

  // ===========================
  // Password စစ်
  // ===========================
  let pass = prompt("Password");

  if (pass !== localStorage.getItem("password")) {
    alert("Password မှားပါတယ်");
    return;
  }

  // ===========================
  // Confirm
  // ===========================
  if (!confirm("History များကို မဖျက်ခင် Backup သိမ်းပြီး ဖျက်မှာ သေချာပါသလား?")) {
    return;
  }

  // ===========================
  // Backup Download
  // ===========================
  let backup = {};

  Object.keys(localStorage).forEach((key) => {
    backup[key] = localStorage.getItem(key);
  });

  let blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");

  let d = new Date();

  let fileName =
    "Gold_Backup_" +
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0") +
    "_" +
    String(d.getHours()).padStart(2, "0") +
    "-" +
    String(d.getMinutes()).padStart(2, "0") +
    "-" +
    String(d.getSeconds()).padStart(2, "0") +
    ".json";

  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);

  // ===========================
  // Delete History
  // ===========================
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith("workerHistory_") ||
      key.startsWith("shopHistory_")
    ) {
      localStorage.removeItem(key);
    }
  });

  // Own Gold ဖျက်
  localStorage.removeItem("owngold");

  alert("Backup သိမ်းပြီး History များကို ဖျက်ပြီးပါပြီ။");

  location.reload();
}

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
  // ရွေး = 8 ဖြစ်ရင် ပဲတိုး
  if (y >= 8) {
    y = 0;
    p++;
  }
  // ပဲ = 16 ဖြစ်ရင် ကျပ်တိုး
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

    // 📱 Mobile = gram, 💻 Desktop = goldText
  const isMobile = window.innerWidth < 768;

  function displayGold(value) {
    value = Number(value || 0);

    if (value === 0) return " ";

    return isMobile ? value.toFixed(2) + "g" : goldText(value);
  }

function Save(type) {
  let input = document.getElementById(
    type === "worker" ? "name_input" : "shop_input",
  );

  let name = input.value.trim();

  if (name === "") return;

  let list = type === "worker" ? workers : shops;

  const exists = list.some(
    (item) => item.name.toLowerCase() === name.toLowerCase(),
  );

  if (exists) {
    alert(`"${name}" already exists.`);
    return;
  }

  list.push({ name: name });

  localStorage.setItem(
    type === "worker" ? "workers" : "shops",
    JSON.stringify(list),
  );

  input.value = "";
  display();
}

const now = new Date();

const closeDate =
  now.getFullYear() +
  "-" +
  String(now.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(now.getDate()).padStart(2, "0");

function formatDate(dateStr) {
  let d = new Date(dateStr.replace(" ", "T"));

  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

display();

function display() {
  // Workers
  let workerHtml = "";

  workers.forEach((item, index) => {
    workerHtml += `
        <div class="name-div">
            <div onclick="workerDetail(${index})" style="width:90%">
                ${item.name}
            </div>
            <div >
               <button onclick="Delete('worker', ${index})" style="padding: 0 10px;" >🗑</button>
            </div>
        </div>
        `;
  });

  document.getElementById("name_list").innerHTML = workerHtml;

  // Shops
  let shopHtml = "";
  shops.forEach((item, index) => {
    shopHtml += `
        <div class="name-div">
            <div onclick="shopDetail(${index})" style="width:95%">
                ${item.name}
            </div>

            <button onclick="Delete('shops', ${index})" style="padding: 0 10px;" >🗑</button>

        </div>
        `;
  });

  document.getElementById("shop_list").innerHTML = shopHtml;
}

function Delete(type, i) {
  if (!confirm("ဖျက်မလား?")) return;

  let password = prompt("Password ရိုက်ထည့်ပါ");
  let savedPassword = localStorage.getItem("password");

  if (password !== savedPassword) {
    alert("Password မှားနေပါတယ်");
    return;
  }

  // workers / shops ရွေး
  let list = type === "worker" ? workers : shops;
  let name = list[i].name;

  // Array မှဖျက်
  list.splice(i, 1);

  // localStorage update
  localStorage.setItem(
    type === "worker" ? "workers" : "shops",
    JSON.stringify(list),
  );

  // သက်ဆိုင်တဲ့ storage အားလုံးဖျက်
  Object.keys(localStorage).forEach((key) => {
    if (key.endsWith("_" + name)) {
      localStorage.removeItem(key);
    }
  });

  alert("ဖျက်ပြီးပါပြီ");

  display();
}

function saveWorkersData(index) {
  if (document.getElementById("workDate").value == "") {
    alert("နေ့စွဲထည့်ပါ");
    return;
  }

  if (
    document.getElementById("giveGram").value == "" &&
    document.getElementById("getGram").value == ""
  ) {
    alert("ပေးရွှေ(သို့)အပ်ရွှေ ထည့်ပါ");
    return;
  }

  let goldData =
    JSON.parse(localStorage.getItem("goldlists_" + workers[index].name)) || [];
  let dateInput = document.getElementById("workDate").value;
  let obj = {
    name: workers[index].name,
    date: dateInput,
    give: Number(document.getElementById("giveGram").value) || 0,
    get: Number(document.getElementById("getGram").value) || 0,
    types: document.getElementById("types").value,
    factor: Number(document.getElementById("factorGram").value) || 0,
    checked: false,
  };

  if (editIndex === -1) {
    // အသစ်ထည့်
    goldData.push(obj);
  } else {
    // ပြင်ဆင်
    goldData[editIndex] = obj;
    editIndex = -1;
  }

  localStorage.setItem(
    "goldlists_" + workers[index].name,
    JSON.stringify(goldData),
  );
  clear();
  showWorker(index);
}

const workerDetail = (index) => {
  document.querySelector("#name_list").classList.add("inactive");
  document.querySelector("#w_detail_div").classList.remove("inactive");

  document.querySelectorAll(".second-nav").forEach((nav) => {
    nav.classList.add("inactive");
  });

  let html = "";
  html += `
      <div class="second-nav">
        <div class= "icon" onclick="workerBack()" >⬅️</div>
        
        <div style="text-align: center;" >${workers[index].name}</div>
        
        <div>
            <input id="workDate" type="date"/>
        </div>
      </div>

      <div class="main-ctn">
                <div class="input-group-ctn">
                    <div class="input-group">
                        <div>ပေးရွှေ</div>
                        <div>
                            <input id="giveGram" placeholder="Gram" oninput="fromGram('give')" />
                        </div>
                        <div class="kpy-div">
                            <div>
                                <input id="giveKyat" placeholder="ကျပ်" oninput="fromGold('give')" />
                            </div>
                            <div>
                                <input id="givePae" placeholder="ပဲ" oninput="fromGold('give')" />
                            </div>
                            <div>
                                <input id="giveYway" placeholder="ရွေး" oninput="fromGold('give')" />
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <div>အပ်ရွှေ</div>
                        
                        <div style="display:flex">
                          <div>
                              <input id="getGram" placeholder="Gram" oninput="fromGram('get')" />
                          </div>
                          <div>
                              <input id="types" placeholder="အမျိုးအစား" />
                          </div>
                        </div>
                        <div class="kpy-div">
                        
                            <div>
                                <input id="getKyat" placeholder="ကျပ်" oninput="fromGold('get')" />
                            </div>
                            <div>
                                <input id="getPae" placeholder="ပဲ" oninput="fromGold('get')" />
                            </div>
                            <div>
                                <input id="getYway" placeholder="ရွေး" oninput="fromGold('get')" />
                            </div>
                        </div>
                        
                    </div>

                    <div class="input-group">
                        <div>အလျော့</div>
                        <div>
                            <input id="factorGram" placeholder="Gram" oninput="fromGram('factor')" />
                        </div>
                        <div class="kpy-div">

                            <div>
                                <input id="factorKyat" placeholder="ကျပ်" oninput="fromGold('factor')" />
                            </div>
                            <div>
                                <input id="factorPae" placeholder="ပဲ" oninput="fromGold('factor')" />
                            </div>
                            <div>
                                <input id="factorYway" placeholder="ရွေး" oninput="fromGold('factor')" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button class="res-btn" onclick="saveWorkersData(${index})">SAVE</button>
                    </div>
            </div>
                        <table>
                            <tr>
                                <th>☑</th>
                                <th>နေ့စွဲ</th>
                                <th>ပေးရွှေ</th>
                                <th>အပ်ရွှေ</th>
                                <th>Type</th>
                                <th>လျော့</th>
                                <th>ကျန်</th>
                                <th>Action</th>
                             </tr>

                            <tbody id="mainTable_${index}"></tbody>
                        </table>
    </div>
      `;

  document.querySelector("#w_detail_div").innerHTML = html;
  showWorker(index);
};

function showWorker(index) {
  let html = "";
  let goldData =
    JSON.parse(localStorage.getItem("goldlists_" + workers[index].name)) || [];

  let balance = 0;

  goldData.forEach((x, i) => {
    balance += Number(x.get || 0);
    balance -= Number(x.give || 0);

    html += `
      <tr>

        <td>
          <input type="checkbox"
            ${x.checked ? "checked" : ""}
            onchange="wtoggleCheck(${index}, ${i})">
        </td>

        <td>${formatDate(x.date)}</td>

        <td>${displayGold(x.give)}</td>
        <td>${displayGold(x.get)}</td>

        <td>${x.types}</td>

        <td>${displayGold(x.factor)}</td>

        <td>${displayGold(balance)}</td>

        <td>
          ${
            x.checked
              ? '<span style="color:green;font-weight:bold;">✔ ပြီးစီး</span>'
              : `
                <button class="res-btn2" onclick="editData(${index}, ${i})">✏️</button>
                <button class="res-btn2" onclick="deleteData(${index}, ${i})">🗑️</button>
              `
          }
        </td>

      </tr>
    `;
  });

  let g = 0;
  let t = 0;
  let f = 0;

  goldData.forEach((x) => {
    g += Number(x.give || 0);
    t += Number(x.get || 0);
    f += Number(x.factor || 0);
  });

  html += `
    <tr style="font-weight:bold;background:#eeee">

      <td colspan="2">စုစုပေါင်း</td>

      <td>${displayGold(g)}</td>
      <td>${displayGold(t)}</td>

      <td> </td>

      <td>${displayGold(f)}</td>

      <td>${displayGold(balance)}</td>

      <td>
        <button class="res-btn"
          onclick="closeWorkerList(${index})">
          စာရင်းပိတ်
        </button>
      </td>

    </tr>
  `;

  document.getElementById("mainTable_" + index).innerHTML = html;
}

function wtoggleCheck(workerIndex, itemIndex) {
  let goldData =
    JSON.parse(
      localStorage.getItem("goldlists_" + workers[workerIndex].name),
    ) || [];

  goldData[itemIndex].checked = !goldData[itemIndex].checked;
  localStorage.setItem(
    "goldlists_" + workers[workerIndex].name,
    JSON.stringify(goldData),
  );
  showWorker(workerIndex);
}

function editData(workerIndex, itemIndex) {
  // document.querySelector(".box").classList.remove("inactive")

  editIndex = itemIndex;
  let goldData =
    JSON.parse(
      localStorage.getItem("goldlists_" + workers[workerIndex].name),
    ) || [];

  let r = goldData[itemIndex];
  document.getElementById("types").value = r.types;
  document.getElementById("factorGram").value = r.factor;
  fromGram("factor");
  document.getElementById("workDate").value = r.date;
  document.getElementById("giveGram").value = r.give;
  fromGram("give");
  document.getElementById("getGram").value = r.get;
  fromGram("get");
}

function deleteData(workerIndex, itemIndex) {
  if (confirm("ဖျက်မလား?")) {
    let goldData =
      JSON.parse(
        localStorage.getItem("goldlists_" + workers[workerIndex].name),
      ) || [];
    goldData.splice(itemIndex, 1);
    localStorage.setItem(
      "goldlists_" + workers[workerIndex].name,
      JSON.stringify(goldData),
    );
    showWorker(workerIndex);
  }
}

function closeWorkerList(index) {
  let worker = workers[index].name;
  let key = "goldlists_" + worker;
  let goldData = JSON.parse(localStorage.getItem(key)) || [];

  if (goldData.length == 0) {
    alert("စာရင်းမရှိပါ");
    return;
  }

  // ✅ Check အားလုံး true ဖြစ်ရမည်
  let allChecked = goldData.every((item) => item.checked === true);

  if (!allChecked) {
    alert(
      "စာရင်းမပိတ်နိုင်သေးပါ!\nRecord အားလုံးကို ✓ Check လုပ်ပြီးမှ ပိတ်နိုင်ပါသည်။",
    );
    return;
  }

  if (!confirm("ဒီစာရင်းကို ပိတ်ပြီး History ထဲသိမ်းမလား?")) return;

  // 🔥 Local Time (close time)
  let now = new Date();

  let closeDate =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  // 🔥 Start Date / End Date
  let dates = goldData
    .map((x) => x.date)
    .filter(Boolean)
    .sort();

  let startDate = dates[0] || "";
  let endDate = dates[dates.length - 1] || "";

  let totalGive = 0;
  let totalGet = 0;
  let totalFactor = 0;

  goldData.forEach((x) => {
    totalGive += Number(x.give || 0);
    totalGet += Number(x.get || 0);
    totalFactor += Number(x.factor || 0);
  });

  let historyKey = "workerHistory_" + worker;
  let history = JSON.parse(localStorage.getItem(historyKey)) || [];

  history.push({
    worker: worker,
    closeDate: closeDate,
    startDate: startDate,
    endDate: endDate,
    totalGive: totalGive,
    totalGet: totalGet,
    balance: totalGet - totalGive,
    totalFactor: totalFactor,
    details: goldData,
  });

  localStorage.setItem(historyKey, JSON.stringify(history));

  // Clear current list
  localStorage.setItem(key, JSON.stringify([]));

  alert("စာရင်းပိတ်ပြီး History ထဲသိမ်းပြီးပါပြီ");

  showWorker(index);
}

function saveShopData(index) {
  if (document.getElementById("shopDate").value == "") {
    alert("နေ့စွဲထည့်ပါ");
    return;
  }

  if (
    document.getElementById("sgiveGram").value == "" &&
    document.getElementById("sgetGram").value == ""
  ) {
    alert("ပေးရွှေ(သို့)အပ်ရွှေ ထည့်ပါ");
    return;
  }

  let goldData =
    JSON.parse(localStorage.getItem("goldlists_" + shops[index].name)) || [];
  let dateInput = document.getElementById("shopDate").value;
  let obj = {
    shop: shops[index].name,
    date: dateInput,
    give: Number(document.getElementById("sgiveGram").value) || 0,
    get: Number(document.getElementById("sgetGram").value) || 0,
    getfactor: Number(document.getElementById("getfactorGram").value) || 0,
    givefactor: Number(document.getElementById("givefactorGram").value) || 0,
    checked: false,
  };

  if (editIndex === -1) {
    // အသစ်ထည့်
    goldData.push(obj);
  } else {
    // ပြင်ဆင်
    goldData[editIndex] = obj;
    editIndex = -1;
  }

  localStorage.setItem(
    "goldlists_" + shops[index].name,
    JSON.stringify(goldData),
  );
  clear();
  showShop(index);
}

const shopDetail = (index) => {
  document.getElementById("shop_list").classList.add("inactive");
  document.querySelector("#s_detail_div").classList.remove("inactive");

  document.querySelectorAll(".second-nav").forEach((nav) => {
    nav.classList.add("inactive");
  });

  let html = "";
  html += `
      <div class="second-nav" >
        <div onclick="shopBack()" class="icon">
            ⬅️
        </div>
        
        <div style="text-align: center;" >${shops[index].name}</div>
        
        <div>
            နေ့စွဲ<input id="shopDate" type="date"/>
        </div>
      </div>

      <div class="main-ctn">
      
                <div class="input-group-ctn">

                   <div class="input-group">
                        <div>လက်ခံ</div>

                        <div>
                            <input id="sgetGram" placeholder="Gram" oninput="fromGram('sget')" />
                        </div>
                        <div class="kpy-div">
                        
                            <div>
                                <input id="sgetKyat" placeholder="ကျပ်" oninput="fromGold('sget')" />
                            </div>
                            <div>
                                <input id="sgetPae" placeholder="ပဲ" oninput="fromGold('sget')" />
                            </div>
                            <div>
                                <input id="sgetYway" placeholder="ရွေး" oninput="fromGold('sget')" />
                            </div>
                        </div>

                    </div>
                    
                    <div class="input-group">
                        <div>ပြန်အပ်</div>

                        <div>
                            <input id="sgiveGram" placeholder="Gram" oninput="fromGram('sgive')" />
                        </div>
                        <div class="kpy-div">
                            <div>
                                <input id="sgiveKyat" placeholder="ကျပ်" oninput="fromGold('sgive')" />
                            </div>
                            <div>
                                <input id="sgivePae" placeholder="ပဲ" oninput="fromGold('sgive')" />
                            </div>
                            <div>
                                <input id="sgiveYway" placeholder="ရွေး" oninput="fromGold('sgive')" />
                            </div>
                        </div>
                    </div>

                    

                    <div class="input-group">
                        <div>ရလျော့</div>
                        <div>
                            <input id="getfactorGram" placeholder="Gram" oninput="fromGram('getfactor')" />
                        </div>
                        <div class="kpy-div">

                            <div>
                                <input id="getfactorKyat" placeholder="ကျပ်" oninput="fromGold('getfactor')" />
                            </div>
                            <div>
                                <input id="getfactorPae" placeholder="ပဲ" oninput="fromGold('getfactor')" />
                            </div>
                            <div>
                                <input id="getfactorYway" placeholder="ရွေး" oninput="fromGold('getfactor')" />
                            </div>
                        </div>
                    </div>

                    <div class="input-group">
                        <div>ပေးလျော့</div>
                            <div>
                                <input id="givefactorGram" placeholder="Gram" oninput="fromGram('givefactor')" />
                            </div>
                            
                            <div class="kpy-div">

                                    <div>
                                        <input id="givefactorKyat" placeholder="ကျပ်" oninput="fromGold('givefactor')" />
                                    </div>
                                    <div>
                                        <input id="givefactorPae" placeholder="ပဲ" oninput="fromGold('givefactor')" />
                                    </div>
                                    <div>
                                        <input id="givefactorYway" placeholder="ရွေး" oninput="fromGold('givefactor')" />
                                    </div>
                            </div>

                        </div>
                  </div> 
                            <div style="width=100%; display:flex; align-item;center; justify-content:center;">
                                <button class="res-btn1" onclick="saveShopData(${index})">SAVE</button>
                            </div>
            
                        <table>
                            <tr style="background-color:#eeee">
                                <th>☑</th>
                                <th>နေ့စွဲ</th>
                                <th>လက်ခံ</th>
                                <th>ပြန်အပ်</th>
                                <th>ရလျော့</th>
                                <th>ပေးလျော့</th>
                                <th>ကျန်</th>
                                <th>Action</th>
                             </tr>

                            <tbody id="mainShopTable_${index}"></tbody>
                        </table>

    </div>
      `;
  document.querySelector("#s_detail_div").innerHTML = html;
  showShop(index);
};

function showShop(index) {
  let html = "";
  let goldData =
    JSON.parse(localStorage.getItem("goldlists_" + shops[index].name)) || [];

  let balance = 0; // Running Balance

  goldData.forEach((x, i) => {
    balance += Number(x.get || 0);
    balance += Number(x.getfactor || 0);

    balance -= Number(x.give || 0);
    balance -= Number(x.givefactor || 0);

    html += `
        <tr>
            <td><input type="checkbox"
                ${x.checked ? "checked" : " "}
                onchange="toggleCheck(${index}, ${i})"></td>

            <td>${formatDate(x.date)}</td>

            <td>${x.get ? displayGold(x.get) : "-"}</td>
            <td>${x.give ? displayGold(x.give) : "-"}</td>
            
            <td>${x.getfactor ? displayGold(x.getfactor) : " "}</td>
            <td>${x.givefactor ? displayGold(x.givefactor) : " "}</td>
            <!-- လက်ကျန်ရွှေ -->
            <td>${displayGold(balance)}</td>

            <td>
                ${
                  x.checked
                    ? '<span style="color:green;font-weight:bold;">✔ ပြီးစီး</span>'
                    : `
                        <button class="res-btn2" onclick="editShopData(${index}, ${i})">✏️</button>
                        <button class="res-btn2" onclick="deleteShopData(${index}, ${i})">🗑️</button>
                    `
                }
            </td>
        </tr>
        `;
  });

  let g = 0,
    t = 0,
    f = 0,
    c = 0,
    o = 0;

  goldData.forEach((x) => {
    g += Number(x.give || 0);
    t += Number(x.get || 0);
    f += Number(x.getfactor || 0);
    c += Number(x.givefactor || 0);
    o += Number(x.own || 0);
  });

  html += `
    <tr style="font-weight:bold;background:#eeee;">
        
        <td colspan="2">စုစုပေါင်း</td>
        <td>${displayGold(t)}</td>
        <td>${displayGold(g)}</td>
        <td>${displayGold(f)}</td>
        <td>${displayGold(c)}</td>
        <td>${displayGold(balance)}</td>
        <td><button class="res-btn" onclick="closeShopList(${index})">
          စာရင်းပိတ်
    </button></td>
    </tr>
    `;

  document.getElementById("mainShopTable_" + index).innerHTML = html;
}

function toggleCheck(shopIndex, itemIndex) {
  let goldData =
    JSON.parse(localStorage.getItem("goldlists_" + shops[shopIndex].name)) ||
    [];

  goldData[itemIndex].checked = !goldData[itemIndex].checked;
  localStorage.setItem(
    "goldlists_" + shops[shopIndex].name,
    JSON.stringify(goldData),
  );
  showShop(shopIndex);
}

function editShopData(workerIndex, itemIndex) {
  editIndex = itemIndex;
  let goldData =
    JSON.parse(localStorage.getItem("goldlists_" + shops[workerIndex].name)) ||
    [];

  let r = goldData[itemIndex];
  document.getElementById("getfactorGram").value = r.getfactor;
  fromGram("getfactor");
  document.getElementById("shopDate").value = r.date;
  document.getElementById("sgiveGram").value = r.give;
  fromGram("sgive");
  document.getElementById("sgetGram").value = r.get;
  fromGram("sget");
  document.getElementById("givefactorGram").value = r.givefactor;
  fromGram("givefactor");
}

function deleteShopData(workerIndex, itemIndex) {
  if (confirm("ဖျက်မလား?")) {
    let goldData =
      JSON.parse(
        localStorage.getItem("goldlists_" + shops[workerIndex].name),
      ) || [];
    goldData.splice(itemIndex, 1);
    localStorage.setItem(
      "goldlists_" + shops[workerIndex].name,
      JSON.stringify(goldData),
    );
    showShop(workerIndex);
  }
}

function closeShopList(index) {
  let name = shops[index].name;
  let key = "goldlists_" + name;
  let goldData = JSON.parse(localStorage.getItem(key)) || [];

  if (goldData.length == 0) {
    alert("စာရင်းမရှိပါ");
    return;
  }

  // ✅ Check အားလုံး true ဖြစ်ရမည်
  let allChecked = goldData.every((item) => item.checked === true);

  if (!allChecked) {
    alert(
      "စာရင်းမပိတ်နိုင်သေးပါ!\nRecord အားလုံးကို ✓ Check လုပ်ပြီးမှ ပိတ်နိုင်ပါသည်။",
    );
    return;
  }

  if (!confirm("ဒီစာရင်းကို ပိတ်ပြီး History ထဲသိမ်းမလား?")) return;

  // 🔥 Local Time (close time)
  let now = new Date();

  let closeDate =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  // 🔥 Start Date / End Date (from details)
  let dates = goldData
    .map((x) => x.date)
    .filter(Boolean)
    .sort();

  let startDate = dates[0] || "";
  let endDate = dates[dates.length - 1] || "";

  let totalGive = 0;
  let totalGet = 0;
  let totalGetFactor = 0;
  let totalGiveFactor = 0;

  goldData.forEach((x) => {
    totalGive += Number(x.give || 0);
    totalGet += Number(x.get || 0);
    totalGetFactor += Number(x.getfactor || 0);
    totalGiveFactor += Number(x.givefactor || 0);
  });

  let historyKey = "shopHistory_" + name;

  let history = JSON.parse(localStorage.getItem(historyKey)) || [];

  history.push({
    name: name,
    closeDate: closeDate,

    // ⭐ NEW FIELDS
    startDate: startDate,
    endDate: endDate,
    totalGive: totalGive,
    totalGet: totalGet,
    balance: totalGet + totalGetFactor - (totalGive + totalGiveFactor),
    totalGetFactor: totalGetFactor,
    totalGiveFactor: totalGiveFactor,
    details: goldData,
  });

  localStorage.setItem(historyKey, JSON.stringify(history));

  // clear current list
  localStorage.setItem(key, JSON.stringify([]));

  alert("စာရင်းပိတ်ပြီး History ထဲသိမ်းပြီးပါပြီ");

  showShop(index);
}

finalResult();

function finalResult() {
  let html = "";

  let totalGive = 0;
  let totalGet = 0;
  let totalFactor = 0;
  let totalGetFactor = 0;
  let totalGiveFactor = 0;
  let totalBalance = 0;
  let totalOwnGold = 0;

  let no = 1;

  let ownGold = JSON.parse(localStorage.getItem("owngold")) || [];

  ownGold.forEach((item) => {
    totalOwnGold += Number(item.own || 0);
  });

  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith("workerHistory_") && !key.startsWith("shopHistory_"))
      return;

    let history = JSON.parse(localStorage.getItem(key)) || [];



    history.forEach((item) => {
      // Worker => totalFactor
      // Shop => totalGetFactor
      let getFactor = item.totalGetFactor ?? 0;

      // Worker မှာ GiveFactor မရှိ
      let giveFactor = item.totalGiveFactor ?? 0;

      let Factor = item.totalFactor ?? 0;

      html += `
            <tr>
            <td>${item.worker || item.name}</td>
                <td></td>
                <td>${displayGold(item.totalGet)}</td>
                <td>${displayGold(item.totalGive)}</td>
                <td>${displayGold(Factor)}</td>
                <td>${displayGold(getFactor)}</td>
                <td>${displayGold(giveFactor)}</td>
                <td>${displayGold(item.balance)}</td>
            </tr>
            `;

      totalGive += Number(item.totalGive || 0);
      totalGet += Number(item.totalGet || 0);
      totalFactor += Number(Factor);
      totalGetFactor += Number(getFactor);
      totalGiveFactor += Number(giveFactor);
      totalBalance += Number(item.balance || 0);
    });
  });

  let finalBalance =
    totalGet + totalGetFactor - (totalGive + totalGiveFactor) - totalOwnGold;
  document.getElementById("final_history").innerHTML = html;

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
}

nameForHistory();

function nameForHistory() {
  // Workers
  let workerHtml = "";

  workers.forEach((item) => {
    workerHtml += `
        <div class="his-name-div" >

            <div onclick="WorkerHistory('${item.name}')" style="width:100%" >
                ${item.name}
            </div>

        </div>
        `;
  });

  document.getElementById("name_h_div").innerHTML = workerHtml;

  // Shops
  let shopHtml = "";

  shops.forEach((item) => {
    shopHtml += `
        <div class="his-shop-div">

                <div onclick="ShopHistory('${item.name}')" style="width:100%">
                    ${item.name}
                </div>

        </div>
        `;
  });

  document.getElementById("shop_h_div").innerHTML = shopHtml;
}

function WorkerHistory(workerName) {
  document.querySelector("#name_h_div").classList.add("inactive");
  document.querySelector(".h-w-table").classList.remove("inactive");
  document.querySelectorAll(".second-nav").forEach((nav) => {
    nav.classList.add("inactive");
  });

  let history =
    JSON.parse(localStorage.getItem("workerHistory_" + workerName)) || [];

  let html = "";

  let totalGive = 0;
  let totalGet = 0;
  let totalFactor = 0;
  let totalBalance = 0;

  history.forEach((x, i) => {
    totalGive += Number(x.totalGive || 0);
    totalGet += Number(x.totalGet || 0);
    totalFactor += Number(x.totalFactor || 0);
    totalBalance += Number(x.balance || 0);

    html += `
            <tr>
                <td>${i + 1}</td>
                <td>${formatDate(x.closeDate)}</td>
                <td>${displayGold(x.totalGive)}</td>
                <td>${displayGold(x.totalGet)}</td>
                <td>${displayGold(x.balance)}</td>
                <td>${displayGold(x.totalFactor)}</td>
                <td>
                    <button class="res-btn2" onclick="workerView('${workerName}', ${i})">
                        View
                    </button>
                </td>
            </tr>
        `;
  });

  document.getElementById("mainHWorkerTable").innerHTML = `
      <div class="second-nav">
        <div onclick="Back()" class="icon">🏠</div>
        
        <div style="text-align: center;" >${workerName}</div>

        <div class="icon"  onclick="WhBack()">⬅️</div>

        
      </div>

        <table border="1">
            <thead>
                <tr>
                    <th>No</th>
                    <th>ပိတ်ရက်</th>
                    <th>ပေး</th>
                    <th>အပ်</th>
                    <th>ကျန်</th>
                    <th>လျော့</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${html}
            </tbody>

            <tfoot>
                <tr>
                    <th colspan="2">စုစုပေါင်း</th>
                    <th>${displayGold(totalGive)}</th>
                    <th>${displayGold(totalGet)}</th>
                    <th>${displayGold(totalBalance)}</th>
                    <th>${displayGold(totalFactor)}</th>
                    <th></th>
                </tr>
            </tfoot>
        </table>
    `;
}

function ShopHistory(shopName) {
  document.querySelector(".h-s-table").classList.remove("inactive");
  document.querySelector("#shop_h_div").classList.add("inactive");
  document.querySelectorAll(".second-nav").forEach((nav) => {
    nav.classList.add("inactive");
  });

  let history =
    JSON.parse(localStorage.getItem("shopHistory_" + shopName)) || [];

  let html = "";

  let totalGive = 0;
  let totalGet = 0;
  let totalBalance = 0;
  let totalGiveFactor = 0;
  let totalGetFactor = 0;

  history.forEach((x, i) => {
    totalGive += Number(x.totalGive || 0);
    totalGet += Number(x.totalGet || 0);
    totalBalance += Number(x.balance || 0);

    totalGiveFactor += Number(x.totalGiveFactor || 0);
    totalGetFactor += Number(x.totalGetFactor || 0);

    html += `
            <tr>
                <td>${i + 1}</td>
                <td>${formatDate(x.closeDate)}</td>
                <td>${displayGold(x.totalGet)}</td>
                <td>${displayGold(x.totalGive)}</td>
                <td>${displayGold(x.totalGetFactor)}</td>
                <td>${displayGold(x.totalGiveFactor)}</td>
                <td>${displayGold(x.balance)}</td>
                <td>
                    <button class="res-btn2" onclick="shopView('${shopName}', ${i})">
    View
</button>
                </td>
            </tr>
        `;
  });

  document.getElementById("mainHShopTable").innerHTML = `
    <div class="second-nav">
       <div onclick="Back()" class="icon">🏠</div>

       <div style="text-align: center;" >${shopName}</div>

        <div class="icon" onclick="ShBack()">⬅️</div>

        
        
      </div>

        <table border="1">
            <thead>
                <tr>
                    <th>No</th>
                    <th>ပိတ်ရက်</th>
                    <th>ရ</th>
                    <th>ပေး</th>
                    <th>ရလျော့</th>
                    <th>ပေးလျော့</th>
                    <th>ကျန်</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                ${html}
            </tbody>

            <tfoot>
                <tr style="background:#eee;font-weight:bold">
                    <th colspan="2">စုစုပေါင်း</th>
                    <th>${displayGold(totalGet)}</th>
                    <th>${displayGold(totalGive)}</th>
                    <th>${displayGold(totalGetFactor)}</th>
                    <th>${displayGold(totalGiveFactor)}</th>
                    <th>${displayGold(totalBalance)}</th>
                    <th></th>
                </tr>
            </tfoot>
        </table>
    `;
}



function shopView(shopName, index) {
  let history = JSON.parse(localStorage.getItem("shopHistory_" + shopName)) || [];

  let data = history[index];

  if (!data) {
    alert("History not found!");
    return;
  }

  let details = data.details || [];



  let html = "";

  let balance = 0;
  let totalGive = 0;
  let totalGet = 0;
  let totalGetFactor = 0;
  let totalGiveFactor = 0;

  details.forEach((x) => {
    let give = Number(x.give || 0);
    let get = Number(x.get || 0);
    let giveFactor = Number(x.givefactor || 0);
    let getFactor = Number(x.getfactor || 0);

    balance += get + getFactor - (give + giveFactor);

    totalGive += give;
    totalGet += get;
    totalGiveFactor += giveFactor;
    totalGetFactor += getFactor;

    html += `
            <tr>
                <td>${formatDate(x.date)}</td>
                <td>${displayGold(get)}</td>
                <td>${displayGold(give)}</td>
                <td>${displayGold(getFactor)}</td>
                <td>${displayGold(giveFactor)}</td>
                <td>${displayGold(balance)}</td>
            </tr>
        `;
  });

  let totalBalance = totalGet + totalGetFactor - (totalGive + totalGiveFactor);

  html += `
        <tr style="background:#eee;font-weight:bold">
            <td>Total</td>
            <td>${displayGold(totalGet)}</td>
            <td>${displayGold(totalGive)}</td>
            <td>${displayGold(totalGetFactor)}</td>
            <td>${displayGold(totalGiveFactor)}</td>
            <td>${displayGold(totalBalance)}</td>
        </tr>
    `;

  document.getElementById("shopDateRange").innerHTML =
    `${formatDate(data.startDate)} မှ ${formatDate(data.endDate)} အထိ`;

  document.getElementById("historyShopName").innerHTML = shopName;

  document.getElementById("shopDetails").innerHTML = html;

  document.getElementById("shopModal").style.display = "block";
}

function workerView(workerName, index) {
  let history =
    JSON.parse(localStorage.getItem("workerHistory_" + workerName)) || [];

  let data = history[index];
  console.log(workerName);
  if (!data) return;

  let html = "";
  let balance = 0;
  let totalGive = 0;
  let totalGet = 0;
  let totalFactor = 0;

  data.details.forEach((x) => {
    let give = Number(x.give || 0);
    let get = Number(x.get || 0);
    let factor = Number(x.factor || 0);

    totalGive += give;
    totalGet += get;
    totalFactor += factor;
    balance += get - give;
    html += `

            <tr>
              <td>${formatDate(x.date)}</td>
              <td>${displayGold(give)}</td>
              <td>${displayGold(get)}</td>
              <td>${x.types || "-"}</td>
              <td>${displayGold(balance)}</td>
              <td>${displayGold(factor)}</td>
            </tr>
            `;
  });

  // Total Row

  html += `
        <tr style="background:#eee;font-weight:bold;">
          <td>Total</td>
          <td>${displayGold(totalGive)}</td>
          <td>${displayGold(totalGet)}</td>
          <td></td>
          <td>${displayGold(totalGet - totalGive)}</td>
          <td>${displayGold(totalFactor)}</td>
        </tr>
        `;

  // Header
  document.getElementById("historyDateRange").innerHTML =
    `${formatDate(data.startDate)} မှ ${formatDate(data.endDate)} အထိ`;
  document.getElementById("historyWorkerName").innerHTML = workerName;
  // Table
  document.getElementById("historyDetails").innerHTML = html;
  // Show Modal
  document.getElementById("workerModal").style.display = "block";
}

function closeModal() {
  document.getElementById("workerModal").style.display = "none";
  document.getElementById("shopModal").style.display = "none";
}

function openhPage(id, menu) {
  // Hide all pages
  document.querySelector(".his-navbar").classList.add("inactive");
  document.querySelectorAll(".hpage").forEach((page) => {
    page.classList.remove("active");
  });

  // Show selected page
  document.getElementById(id).classList.add("active");

  // Remove active from all menu items
  document.querySelectorAll(".his-nav-menu li").forEach((item) => {
    item.classList.remove("active");
  });

  // Add active to clicked menu
  menu.classList.add("active");
  finalResult();
}

showOwn();

function ownSave() {
  let owngold = JSON.parse(localStorage.getItem("owngold")) || [];

  let ownDate = document.querySelector(".owndate").value;
  let obj = {
    date: ownDate,
    own: Number(document.getElementById("ownGram").value) || 0,
  };

  if (editIndex === -1) {
    // အသစ်ထည့်
    owngold.push(obj);
  } else {
    // ပြင်ဆင်
    owngold[editIndex] = obj;
    editIndex = -1;
  }

  localStorage.setItem("owngold", JSON.stringify(owngold));
  clear();
  showOwn();
}

function showOwn(index) {
  let html = "";
  let goldData = JSON.parse(localStorage.getItem("owngold")) || [];

  let balance = 0; // Running Balance

  goldData.forEach((x, i) => {
    balance += Number(x.own || 0);

    html += `
        <tr>
            <td><input type="checkbox"
                ${x.checked ? "checked" : ""}
                onchange="otoggleCheck(${index}, ${i})"></td>

            <td>${formatDate(x.date)}</td>
            <td>${x.own ? goldText(x.own) : "-"}</td>
            <td>
                ${
                  x.checked
                    ? '<span style="color:green;font-weight:bold;">✔ ပြီးစီး</span>'
                    : `
                        <button onclick="editOwnData(${index}, ${i})">✏️</button>
                        <button onclick="deleteOwnData(${index}, ${i})">🗑️</button>
                    `
                }
            </td>
        </tr>
        `;
  });

  let g = 0;
  goldData.forEach((x) => {
    g += Number(x.own || 0);
  });

  html += `
    <tr style="font-weight:bold;background:#ffeeba">
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
  }
}

function Back() {
  location.reload()
  // document.querySelector(".navbar").classList.remove("inactive");
  // document.querySelectorAll(".page").forEach((page) => {
  //   page.classList.remove("active");
  // });
}

function workerBack() {
  document.querySelector("#w_detail_div").classList.add("inactive");
  document.querySelector("#name_list").classList.remove("inactive");
  document.querySelectorAll(".second-nav").forEach((nav) => {
    nav.classList.remove("inactive");
  });
}

function shopBack() {
  document.querySelector("#s_detail_div").classList.add("inactive");
  document.querySelector("#shop_list").classList.remove("inactive");
  document.querySelectorAll(".second-nav").forEach((nav) => {
    nav.classList.remove("inactive");
  });
}

function WhBack() {
  document.querySelector("#name_h_div").classList.remove("inactive");
  document.querySelector(".h-w-table").classList.add("inactive");
  document.querySelectorAll(".second-nav").forEach((nav) => {
    nav.classList.remove("inactive");
  });
}
function ShBack() {
  document.querySelector("#shop_h_div").classList.remove("inactive");
  document.querySelector(".h-s-table").classList.add("inactive");
  document.querySelectorAll(".second-nav").forEach((nav) => {
    nav.classList.remove("inactive");
  });
}

function clear() {
  document.querySelectorAll("input").forEach((x) => (x.value = ""));
} // Initialize the display for the first worker
