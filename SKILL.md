---
name: retirement-plan-tracker
description: Walk a person through setting up the Retirement Plan Tracker, a Google Sheet plus an iPhone widget that shows whether their retirement savings are on track against their plan. Use when someone wants to set up, understand, or adjust this tracker.
---

# Retirement Plan Tracker setup

You are helping a person set up a simple monitoring tool for their retirement savings. By the end they'll have a Google Sheet that holds their plan and a widget on their iPhone that shows green, yellow, or red.

How to work with them:

- **Use plain language.** Many people doing this aren't spreadsheet experts. Avoid jargon, or explain it when you can't.
- **Go one step at a time.** Before each step, say what's about to happen, why it matters, and **who does it: you or them**.
- **Do what you can yourself.** If you can edit Google Sheets, do the sheet work. Leave the person only the steps that need them: logins, purchases, and their phone.
- **Keep their numbers private.** Never repeat account numbers, and don't keep financial details beyond what the setup needs.
- **This isn't financial advice.** You're helping them build a monitoring tool. If they ask what they *should* do with their money, suggest a qualified professional.

---

## Step 1: Explain the problem and check fit

Before any setup, make sure the person understands what this is for and actually has the problem it solves. Explain it in your own words, covering:

1. **The problem.** In retirement you live off your savings, so your balance is *supposed* to go down. That makes it hard to tell, just by looking at your accounts, whether you're on track for the money to last your lifetime.
2. **What this does.** It puts one number on your phone: your balance compared with where your plan says it should be today. Green means on track. Yellow means drifting behind. Red means well behind, time to take a closer look.
3. **The model, conceptually.** The plan starts with your savings, then each year subtracts your spending, adds your income (Social Security, pensions, and so on) and adds investment growth. That produces a predicted path. If your actual balance stays close to that path, your cash flow is holding up.
4. **What it isn't.** It doesn't predict the market or tell you what to do. It only tells you whether you need to pay attention.
5. **One important nuance.** Green means "on track for *your* plan." If the plan itself runs out of money at 85, staying green means you're on track to run out at 85. The sheet shows this, and you'll see it once the plan is built.

Then check fit: ask whether they're living off savings now, or will be soon, and whether this question matters to them. **If it doesn't, stop. They don't need this project.**

Move on only once they can say back, roughly, what the widget tells them.

---

## Step 2: Explain what setup involves

Give a short overview so there are no surprises.

| Step | Who | Roughly how long |
|---|---|---|
| 3. Interview: your plan's numbers | Together | 20–40 min |
| 4. Read back the plan | Agent | 5 min |
| 5. Create the sheet | Person creates the file; agent fills it in | 10 min |
| 6. Connect your balances | Person links accounts (Tiller); agent maps them | 15–30 min |
| 7. Publish the widget data | Person | 5 min |
| 8. Add the widget to your phone | Person | 10 min |

Check what they have:

- **A Google account.** The sheet lives in Google Sheets.
- **An iPhone**, with the free [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) app. (Android isn't supported yet.)
- **Tiller (optional),** about $99/yr after a free trial, to update balances automatically. Without it, they'll type balances in by hand, maybe monthly.
- **About a year of spending history**, ideally. A spending tracker (Empower, Monarch, Tiller, a bank's export) helps a lot, but an estimate works too.

Check your own capabilities and tell them what you found:

- **Can you edit Google Sheets** (read and write cells, add rows)? In Claude, that's the **Google Sheets connector** (Settings → Connectors). If you can, you'll do the sheet work. If you can't, you'll tell them exactly what to type, cell by cell. Both paths work.

---

## Step 3: Interview

Collect the plan's numbers conversationally, one section at a time. Don't assume their situation looks like any particular person's. Use their words for things (for example, "Dana's pension"), and write those names into the sheet.

### 3a. Situation

- Single or a couple?
- Already retired, or when will they retire? → **Retirement date** (when spending from savings starts).

This only shapes which questions come next.

### 3b. Assets

- Which accounts hold the money they'll live on? List them: brokerage, IRAs, 401(k)s, savings, checking.
- **Ask what should *not* count.** For example, someone else's account they manage, money set aside for a child, or an account that belongs to a different plan.
- Tiller or manual balances?

Include cash accounts. The real question is whether total money keeps up with the plan.

### 3c. Spending

Goal: **one annual number, in today's dollars**, for what retirement will cost per year. Offer whichever method fits what they have:

1. **From actual spending** (best). Take the last 12 months of spending from their tracker, then adjust it:
   - **Subtract** income tax payments that show up as spending (April payments, estimated tax) and any health insurance premiums they paid directly. Taxes and premiums withheld from a paycheck never show up as spending, so there's nothing to subtract for those.
   - **Subtract** one-time items that won't repeat.
   - **Add** an estimate of taxes on retirement withdrawals (see below).
   - **Add** health insurance before Medicare, if they'll lose employer coverage.
2. **From take-home pay.** Current take-home pay, minus what they save each year, then the same additions as above.
3. **A best guess**, if nothing else is available. Note that it should be refined later.

**Estimating taxes on withdrawals.** Withdrawals from traditional IRAs and 401(k)s are taxed as ordinary income. Selling from a taxable brokerage account is taxed only on the gain, often at lower capital gains rates. Roth withdrawals are usually tax-free. Help them make a rough yearly estimate based on their mix of accounts and their state. Precision isn't needed. Suggest a tax preparer for a better number.

**Health insurance before Medicare (age 65).** Ask whether they'll be on a spouse's plan, a former employer's retiree plan, or buying their own. Look up current costs if you can. Retiree plans often depend on age and years of service.

**If they own property,** add an **annual average for routine maintenance** (a common rule of thumb is 1–2% of the property's value per year). Roofs and furnaces are lumpy but certain over a long retirement. Leave out optional upgrades. See Planned items below.

### 3d. Income streams

Go stream by stream. For each, record: **name, monthly amount (today's dollars), start date, end date (if it ends)**. Prompt for the common types without assuming any exist:

- Social Security, for each person. Their statement at ssa.gov shows amounts by claiming age, already in today's dollars.
- Pensions
- Annuities
- Rental income
- Part-time work or consulting they're confident about (with an end date)

Note it if a pension doesn't keep pace with inflation (many cap yearly increases). The model treats all income as inflation-adjusted, so a capped pension makes the plan a little optimistic over time. Mention it, but don't overcomplicate.

**Rule of thumb:** known, recurring income goes in the plan. Surprise income (a one-off consulting job) shouldn't. It simply shows up as a better balance, which is the right signal.

### 3e. Planned items

Ask: *"Any big one-time expenses or windfalls you're confident about, with a rough date?"* Examples: a renovation, a car, a wedding, a home sale, an expected inheritance.

| Kind | Where it goes |
|---|---|
| Certain and dated (a planned renovation) | **Planned Items** tab, as an Expense or Inflow |
| Lumpy but recurring (roofs, cars every 10 years) | An annual average added to **Annual spending** |
| Optional or uncertain (a possible upgrade) | Leave it out. If it happens, it shows as a dip in the widget, which tells them what it cost. |

### 3f. Settings

Offer defaults and explain each in one sentence:

- **Return after inflation:** 4%. Expected yearly growth above inflation.
- **Inflation:** 3%. Check it once a year against the BLS CPI 12-month change.
- **Green threshold:** 95%. **Red threshold:** 80%. Don't set green at 100%; ordinary daily market moves would flip it to yellow.

---

## Step 4: Read back the plan

Before building, summarize the plan in plain terms: when retirement starts, yearly spending, each income stream and when it starts, any planned items, and the settings. Ask them to confirm or correct it.

---

## Step 5: Create the sheet

1. **Person:** download `template/retirement-plan-tracker.xlsx` from this repo, upload it to Google Drive, open it, and choose **File → Save as Google Sheets**. Delete the uploaded `.xlsx` afterward so there's only one copy. Share the new sheet's link with you.
2. **Agent:** fill in the sheet from the interview. Replace every yellow example value, delete the example rows, and remove the yellow highlighting as you go:
   - **Model tab:** the assumptions (see the cell map in the Reference section).
   - **Income tab:** one row per stream.
   - **Planned Items tab:** one row per item, or none.
   - **Accounts tab:** filled in Step 6.

   If you can't edit Sheets, give the person each value and the exact cell it goes in, one tab at a time.
3. **Agent:** read back the **Predicted Path** tab and tell them in plain terms what it shows: does the money last through the 40 years shown, and if not, at what age does it run out? This is the plan they'll be tracking against (see the nuance in Step 1).

---

## Step 6: Connect balances

### Option A: Tiller (automatic)

1. **Person:** sign up at tiller.com using **the same Google account** as the sheet, and link their banks and brokerages.
2. **Person:** in the tracker sheet, go to **Extensions → Add-ons → Get add-ons**, install **Tiller Money Feeds**, then open it (**Extensions → Tiller Money Feeds → Launch**). Choose to link **this sheet**, switch on only the accounts that should count, then click **Fill**.
   - Tiller also offers to create its own template sheets. Those aren't needed.
   - Tiller adds several tabs (Transactions, Categories, Balance History, and a hidden metadata tab). **Hide them if they're in the way, but don't delete them.** Tiller needs them.
   - To keep automatic updates running, the person should stay signed in to the add-on.
3. **Agent:** read the **Balance History** tab. It contains **multiple rows per account** (one per refresh). Use only the most recent one. List the accounts for the person and confirm which count.
4. **Agent:** on the **Accounts** tab, add one row per account: Account name, a formula for its latest Balance, Include = Yes, and the Tiller account ID. Match by **account ID**, not name, so renaming doesn't break anything. Read the Balance History header row first to find the Date, Time, Account ID and Balance columns. With Tiller's default layout (Date in B, Time in C, Account ID in F, Balance in I), the Balance formula for row 4 is:

   ```
   =IFERROR(INDEX(SORT(FILTER({'Balance History'!B$2:B+'Balance History'!C$2:C,'Balance History'!I$2:I},'Balance History'!F$2:F=D4),1,FALSE),1,2),0)
   ```

   If the person later wants an account left out, set Include to No. If they never want it, delete its row and suggest they switch it off in Tiller too.

### Option B: Manual balances

**Person:** type each account and its current balance into the **Accounts** tab, with Include = Yes. Updating once a month is enough. The widget only moves when balances are updated.

### Start the plan

**Agent:** set **Plan start date** to today and **Starting balance** to today's **Account balance**. The widget starts at 100%. These two always change together. Only reset them to deliberately restart the plan, and never just to make a dip go away.

---

## Step 7: Publish the widget data

The phone reads one small tab, **Widget**, which holds just the percent and status, never dollar amounts.

**Person:** in the sheet, go to **File → Share → Publish to web**, then:

1. Under **Link**, choose **Widget** (not "Entire document") and **Comma-separated values (.csv)**.
2. Open **Published content & settings**, uncheck **Entire document**, and check only **Widget**.
3. Click **Start publishing**, then **OK** to confirm.
4. Copy the link that appears and send it to you.

If nothing happens on Start publishing, the browser is likely blocking the confirmation popup. Open the sheet in a regular browser window and try again.

**Agent:** open the link and confirm it returns two lines, `percent_of_predicted` and `status`, and nothing else.

---

## Step 8: Add the widget to the phone

1. **Agent:** give the person the contents of `widget/retirement-plan.js` with their published link filled in for `CSV_URL`.
2. **Person:**
   1. Install **Scriptable** from the App Store.
   2. In Scriptable, tap **+**, paste the code, tap the title at the top to rename it (for example "Retirement"), and tap **Done**.
   3. Tap the script to run it. A preview of the widget should appear.
   4. On the home screen, long-press an empty spot, tap **Edit → Add Widget**, choose **Scriptable**, pick the small size, and add it.
   5. Tap the new widget, set **Script** to the one they just created, and tap outside to finish.

---

## Step 9: Explain how to live with it

Close by making sure they know:

- **What the colors mean**, and that the widget monitors; it doesn't advise.
- **Refresh timing.** iOS decides when widgets refresh (usually every few hours). Running the script in Scriptable refreshes it immediately. Tiller updates balances a few times a day.
- **What to update, and when:**
  - **Inflation:** once a year.
  - **Income or Planned Items:** when plans become certain. Adding an item means "I've decided I can afford this." Before adding one, check the Predicted Path to see that the money still lasts.
  - **Annual spending:** if their lifestyle changes for good.
- **Don't restart the plan after a bad stretch.** Restarting erases the signal.
- **Before retirement,** paychecks add to the balance but the plan doesn't count them, so the widget tends to run a little ahead. That's expected.

---

## Reference

### Tabs

| Tab | What it holds | Who edits it |
|---|---|---|
| Model | Results at the top, assumptions below | Person edits assumptions (blue) |
| Accounts | One row per account; the total is the Account balance | Person (manual) or Tiller formulas |
| Income | One row per income stream | Person |
| Planned Items | One row per dated one-time expense or inflow | Person |
| Predicted Path | The plan played forward year by year, in plan-start dollars | Nobody, it's calculated |
| Widget | `percent_of_predicted` and `status`; the only published tab | Nobody, it's calculated |

### Model cell map

| Cell | Label | Type |
|---|---|---|
| B2 | Account balance | From Accounts |
| B3 | Predicted balance | Calculated (today's dollars) |
| B4 | Percent of predicted | Calculated |
| B5 | Status | Calculated |
| B9 | Plan start date | Input |
| B10 | Retirement date | Input |
| B11 | Starting balance | Input |
| B12 | Annual spending | Input |
| B13 | Return after inflation | Input |
| B14 | Inflation | Input |
| B15 | Total monthly income | From Income |
| B16 | Planned items (net) | From Planned Items |
| B17 | Green threshold | Input |
| B18 | Red threshold | Input |

### Data tabs

- **Accounts:** rows start at row 4. Columns: Account, Balance, Include (Yes/No), Tiller account ID.
- **Income:** rows start at row 4. Columns: Income stream, Monthly amount, Start date, End date (blank = no end).
- **Planned Items:** rows start at row 4. Columns: Planned item, Amount (positive number), Date, Type (Expense or Inflow).

How the calculation works is described in [`docs/model.md`](docs/model.md). Fixes for common problems are in [`docs/troubleshooting.md`](docs/troubleshooting.md).
