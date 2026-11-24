// Retirement Plan Tracker widget for Scriptable (iOS)
// https://github.com/tsheiner/retirement-plan-tracker
//
// Shows how your balance compares to your plan's predicted balance,
// colored green, yellow, or red, plus a short likely cause when you're
// more than 1% off the plan (if the optional gap message is set up).
//
// Setup: replace the URL below with the "Publish to web" CSV link for
// the Widget tab of your sheet. Publish ONLY the Widget tab, never the
// whole document; it holds the percent and status, no dollar amounts.

const CSV_URL = "PASTE_YOUR_PUBLISHED_WIDGET_TAB_CSV_LINK_HERE";

const COLORS = { GREEN: "#2e7d32", YELLOW: "#f9a825", RED: "#c62828" };
const GRAY = "#607d8b";

const w = new ListWidget();

try {
  // The Widget tab is rows of key,value. Read them into an object.
  const data = {};
  const csv = await new Request(CSV_URL).loadString();
  csv.trim().split("\n").forEach(line => {
    const [key, ...rest] = line.split(",");
    data[key.replace(/"/g, "").trim()] = rest.join(",").replace(/"/g, "").trim();
  });

  const status = data.status || "";
  const pct = parseFloat(data.percent_of_predicted);

  w.backgroundColor = new Color(COLORS[status] || GRAY);

  const title = w.addText("Retirement");
  title.textColor = Color.white();
  title.font = Font.mediumSystemFont(14);

  const value = w.addText(isNaN(pct) ? "--" : Math.round(pct * 100) + "%");
  value.textColor = Color.white();
  value.font = Font.boldSystemFont(40);

  // Optional: a one-line likely cause when more than 1% from the plan.
  // Written by apps-script/gap-message.gs; blank if that isn't set up.
  const message = data.message || "";
  if (message && !isNaN(pct) && Math.abs(pct - 1) > 0.01) {
    w.addSpacer(4);
    const note = w.addText(message);
    note.textColor = Color.white();
    note.font = Font.systemFont(11);
    note.lineLimit = 4;
    note.minimumScaleFactor = 0.8;
  }
} catch (e) {
  w.backgroundColor = new Color(GRAY);
  const err = w.addText("No data");
  err.textColor = Color.white();
}

// Ask iOS to refresh about every 6 hours (iOS decides the actual timing).
w.refreshAfterDate = new Date(Date.now() + 6 * 3600 * 1000);

// When run inside the Scriptable app, show a preview.
if (!config.runsInWidget) await w.presentSmall();

Script.setWidget(w);
Script.complete();
