let inputCount = 0;

document.getElementById("addBtn").addEventListener("click", addForm);
document.getElementById("calcBtn").addEventListener("click", calculate);
document.getElementById("resetBtn").addEventListener("click", resetAll);

// 初期表示1つ
addForm();

function addForm() {
  inputCount++;
  const container = document.getElementById("inputs");

  const card = document.createElement("div");
  card.className = "form-card";
  card.innerHTML = `
    <h3>入力 ${inputCount}</h3>
    <label>危険物の種類:</label>
    <select class="category" onchange="updateUnit(this)">
      <optgroup label="第4類 危険物（液体・L）">
        <option value="200-L">第1石油類（ガソリン等）200L</option>
        <option value="1000-L">第2石油類（灯油・軽油等）1000L</option>
        <option value="2000-L">第3石油類（重油等）2000L</option>
        <option value="6000-L">第4石油類（ギヤー油等）6000L</option>
        <option value="400-L">アルコール類（メタノール等）400L</option>
      </optgroup>
      <optgroup label="指定可燃物（固体・kg）">
        <option value="1000-kg">紙くず・ぼろ類 1000kg</option>
        <option value="200-kg">綿花類 200kg</option>
        <option value="400-kg">木毛・かんなくず 400kg</option>
        <option value="1000-kg">わら類 1000kg</option>
        <option value="10000-kg">石炭・木炭類 10000kg</option>
      </optgroup>
    </select>

    <label>数量:</label>
    <div class="unit-row">
      <input type="number" class="amount" placeholder="数値を入力">
      <span class="unit-label">L</span>
    </div>
  `;
  container.appendChild(card);
}

function updateUnit(selectEl) {
  const unit = selectEl.value.split("-")[1];
  const card = selectEl.closest(".form-card");
  card.querySelector(".unit-label").innerText = unit;
}

function calculate() {
  let categories = document.querySelectorAll(".category");
  let amounts = document.querySelectorAll(".amount");
  let details = "";
  let totalMultiple = 0;

  for (let i = 0; i < categories.length; i++) {
    let selected = categories[i].value;
    let amount = parseFloat(amounts[i].value);
    if (isNaN(amount) || amount <= 0) continue;

    let [base, unit] = selected.split("-");
    base = parseFloat(base);

    let multiple = amount / base;
    totalMultiple += multiple;

    details += `入力${i+1}: ${amount}${unit} / 基準${base}${unit} = ${multiple.toFixed(2)}倍 → `;

    if (unit === "L") {
      if (multiple < 0.2) details += "規制対象外\n";
      else if (multiple < 1) details += "少量危険物（届出）\n";
      else details += "危険物施設（許可）\n";
    } else if (unit === "kg") {
      if (multiple < 1) details += "規制対象外\n";
      else details += "指定可燃物（届出）\n";
    }
  }

  document.getElementById("details").innerText = details || "⚠️ 入力がありません";
  document.getElementById("total").innerText = `合算結果: ${totalMultiple.toFixed(2)} 倍`;
}

function resetAll() {
  document.getElementById("inputs").innerHTML = "";
  document.getElementById("details").innerText = "";
  document.getElementById("total").innerText = "";
  inputCount = 0;
  addForm(); // 初期状態として1つだけ残す
}
