// Retirement Plan Tracker: gap message (optional)
// https://github.com/tsheiner/retirement-plan-tracker
//
// When your balance is more than 1% away from your plan, this asks Claude
// for one sentence on the most likely cause and writes it to the Widget tab.
// The phone widget shows it under the percent.
//
// Setup, once:
//   1. In the sheet, open Extensions → Apps Script. Replace the editor's
//      contents with this file and click Save.
//   2. Click Project Settings (the gear) → Script Properties → Add script
//      property. Property: ANTHROPIC_API_KEY. Value: your Claude API key.
//      Click Save script properties.
//   3. Back in the Editor, pick `setup` in the function menu and click Run.
//      Approve the permissions it asks for. It writes a message now, then
//      runs once a day.
//
// Privacy: this sends your plan, account balances, and a summary of your
// transactions to Anthropic's API. What it writes back to the Widget tab
// never contains dollar amounts, because that tab is published.

const MODEL = "claude-opus-5-5";
const GAP = 0.01;           // show a message when more than 1% from 100%
const RUN_HOUR = 6;         // daily run, around 6 a.m. in the sheet's time zone
const LARGEST_TRANSACTIONS = 25;

const SYSTEM_PROMPT = `You explain why a retirement tracker shows a gap.

The tracker compares the person's actual total balance with the balance their plan predicts for today. The plan starts from a starting balance on the plan start date and plays forward with: annual spending (starting on the retirement date), income streams between their start and end dates, dated one-time planned items, and a steady return after inflation. Everything is in plan-start dollars, then converted to today's dollars with the inflation assumption.

Anything in the plan is expected, so it doesn't cause a gap. A gap comes from reality differing from the plan, for example:
- investment returns above or below the assumed return (market moves)
- spending above or below the planned annual spending
- unplanned income or one-time expenses
- paychecks before the retirement date (the plan doesn't count them)
- a planned item whose date passed but that hasn't happened yet, or that happened early
- an account missing from the balance, or one counted that shouldn't be
- balances that haven't updated recently

Using the data, decide the single most likely cause of the gap.

Reply with exactly one sentence, under 80 characters, that states the likely cause. Plain text only. No advice, no next steps, no hedging, no preamble. Never include dollar amounts, account names, or account numbers; percentages are fine.`;

// Run once to schedule the daily update and write a message now.
function setup() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === "updateGapMessage")
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("updateGapMessage").timeBased().everyDays(1).atHour(RUN_HOUR).create();
  updateGapMessage();
}

function updateGapMessage() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const widget = ss.getSheetByName("Widget");
  const pct = Number(widgetValue(widget, "percent_of_predicted"));

  if (!isFinite(pct) || Math.abs(pct - 1) <= GAP) {
    setWidgetValue(widget, "message", "");
    return;
  }

  const message = askClaude(buildContext(ss, pct));
  setWidgetValue(widget, "message", message);
}

// ---------- Gathering the data ----------

function buildContext(ss, pct) {
  const tz = ss.getSpreadsheetTimeZone();
  const model = labeledValues(ss.getSheetByName("Model"));
  const planStart = model["Plan start date"];
  const included = includedAccountIds(ss.getSheetByName("Accounts"));

  const parts = [
    `Today: ${Utilities.formatDate(new Date(), tz, "yyyy-MM-dd")}`,
    `Percent of predicted: ${(pct * 100).toFixed(1)}%`,
    section("Model tab", tabText(ss, "Model")),
    section("Accounts tab", tabText(ss, "Accounts")),
    section("Income tab", tabText(ss, "Income")),
    section("Planned Items tab", tabText(ss, "Planned Items")),
    section("Predicted Path tab (plan-start dollars)", tabText(ss, "Predicted Path")),
  ];

  if (planStart instanceof Date) {
    const balances = balanceChanges(ss, planStart, included, tz);
    if (balances) parts.push(section("Balance change by account since plan start (from Tiller)", balances));
    const txns = transactionSummary(ss, planStart, included, tz);
    if (txns) parts.push(section("Transactions since plan start (from Tiller)", txns));
  }
  return parts.join("\n\n");
}

function section(title, body) {
  return `## ${title}\n${body}`;
}

// A tab's visible values as tab-separated rows, skipping empty rows.
function tabText(ss, name) {
  const sheet = ss.getSheetByName(name);
  if (!sheet) return "(missing)";
  return sheet.getDataRange().getDisplayValues()
    .map(row => row.join("\t").replace(/\t+$/, ""))
    .filter(line => line.trim() !== "")
    .join("\n");
}

// Column A label → column B value, for the Model tab.
function labeledValues(sheet) {
  const out = {};
  sheet.getDataRange().getValues().forEach(row => {
    if (row[0] !== "") out[String(row[0]).trim()] = row[1];
  });
  return out;
}

// Tiller account IDs on the Accounts tab with Include = Yes (column D, from row 4).
function includedAccountIds(sheet) {
  const ids = new Set();
  if (!sheet || sheet.getLastRow() < 4) return ids;
  sheet.getRange(4, 1, sheet.getLastRow() - 3, 4).getValues().forEach(row => {
    if (String(row[2]).trim().toLowerCase() === "yes" && row[3] !== "") ids.add(String(row[3]).trim());
  });
  return ids;
}

function headerIndex(headers, name) {
  return headers.findIndex(h => String(h).trim() === name);
}

function balanceChanges(ss, planStart, included, tz) {
  const sheet = ss.getSheetByName("Balance History");
  if (!sheet || sheet.getLastRow() < 2) return null;
  const [headers, ...rows] = sheet.getDataRange().getValues();
  const c = {
    date: headerIndex(headers, "Date"), time: headerIndex(headers, "Time"),
    account: headerIndex(headers, "Account"), id: headerIndex(headers, "Account ID"),
    balance: headerIndex(headers, "Balance"),
  };
  if (c.date < 0 || c.id < 0 || c.balance < 0) return null;

  const byId = {};
  rows.forEach(r => {
    const id = String(r[c.id]).trim();
    if (!id || (included.size && !included.has(id)) || !(r[c.date] instanceof Date)) return;
    const t = stamp(r[c.date], c.time >= 0 ? r[c.time] : "");
    (byId[id] = byId[id] || { name: r[c.account], points: [] }).points.push({ t, balance: Number(r[c.balance]) });
  });

  const lines = ["Account\tStart date\tStart balance\tLatest date\tLatest balance\tChange"];
  Object.values(byId).forEach(a => {
    a.points.sort((x, y) => x.t - y.t);
    const before = a.points.filter(p => p.t <= planStart.getTime() + 86400000);
    const start = before.length ? before[before.length - 1] : a.points[0];
    const latest = a.points[a.points.length - 1];
    lines.push([a.name, day(start.t, tz), money(start.balance), day(latest.t, tz),
      money(latest.balance), money(latest.balance - start.balance)].join("\t"));
  });
  return lines.join("\n");
}

function transactionSummary(ss, planStart, included, tz) {
  const sheet = ss.getSheetByName("Transactions");
  if (!sheet || sheet.getLastRow() < 2) return null;
  const [headers, ...rows] = sheet.getDataRange().getValues();
  const c = {
    date: headerIndex(headers, "Date"), description: headerIndex(headers, "Description"),
    category: headerIndex(headers, "Category"), amount: headerIndex(headers, "Amount"),
    account: headerIndex(headers, "Account"), id: headerIndex(headers, "Account ID"),
  };
  if (c.date < 0 || c.amount < 0) return null;

  const txns = rows.filter(r => r[c.date] instanceof Date && r[c.date] >= planStart &&
      (!included.size || c.id < 0 || included.has(String(r[c.id]).trim())))
    .map(r => ({
      date: r[c.date], amount: Number(r[c.amount]) || 0,
      description: c.description >= 0 ? r[c.description] : "",
      category: (c.category >= 0 && r[c.category]) || "Uncategorized",
      account: c.account >= 0 ? r[c.account] : "",
    }));
  if (!txns.length) return "(none)";

  const byCategory = {};
  txns.forEach(t => {
    const k = byCategory[t.category] = byCategory[t.category] || { in: 0, out: 0, n: 0 };
    if (t.amount >= 0) k.in += t.amount; else k.out += t.amount;
    k.n++;
  });
  const catLines = ["Category\tInflows\tOutflows\tCount"].concat(
    Object.entries(byCategory).map(([name, k]) => [name, money(k.in), money(k.out), k.n].join("\t")));

  const largest = txns.slice().sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, LARGEST_TRANSACTIONS)
    .map(t => [day(t.date.getTime(), tz), t.description, t.category, t.account, money(t.amount)].join("\t"));

  return ["By category:", ...catLines, "",
    `Largest ${largest.length} by size (Date, Description, Category, Account, Amount):`, ...largest].join("\n");
}

function stamp(date, time) {
  const t = new Date(date.getTime());
  if (time instanceof Date) t.setHours(time.getHours(), time.getMinutes());
  return t.getTime();
}

function day(ms, tz) {
  return Utilities.formatDate(new Date(ms), tz, "yyyy-MM-dd");
}

function money(n) {
  return (n < 0 ? "-$" : "$") + Math.round(Math.abs(n)).toLocaleString("en-US");
}

// ---------- Claude ----------

function askClaude(content) {
  const key = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
  if (!key) throw new Error("Add ANTHROPIC_API_KEY under Project Settings → Script Properties.");

  const request = {
    url: "https://api.anthropic.com/v1/messages",
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2026-10-21",
      "anthropic-beta": "server-side-fallback-2026-07-01",
    },
    payload: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      output_config: { effort: "medium" },
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    }),
    muteHttpExceptions: true,
  };

  let res;
  for (let attempt = 1; attempt <= 3; attempt++) {
    res = UrlFetchApp.fetch(request.url, request);
    const code = res.getResponseCode();
    if (code !== 429 && code < 500) break;
    if (attempt < 3) Utilities.sleep(10000 * attempt);
  }

  const code = res.getResponseCode();
  const body = JSON.parse(res.getContentText());
  if (code !== 200) throw new Error(`Claude API error ${code}: ${body.error ? body.error.message : res.getContentText()}`);
  if (body.stop_reason === "refusal") throw new Error("Claude declined the request.");

  const text = body.content.filter(b => b.type === "text").map(b => b.text).join(" ")
    .replace(/\s+/g, " ").replace(/"/g, "").trim();
  if (!text) throw new Error(`Claude returned no text (stop reason: ${body.stop_reason}).`);
  return text;
}

// ---------- Widget tab (rows of key, value) ----------

function widgetValue(sheet, key) {
  const row = sheet.getRange("A:A").getValues().findIndex(r => r[0] === key);
  return row < 0 ? "" : sheet.getRange(row + 1, 2).getValue();
}

function setWidgetValue(sheet, key, value) {
  let row = sheet.getRange("A:A").getValues().findIndex(r => r[0] === key) + 1;
  if (row === 0) {
    row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1).setValue(key);
  }
  sheet.getRange(row, 2).setNumberFormat("@").setValue(value);
}
