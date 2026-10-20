# Troubleshooting

### The widget says "No data"
- Check that `CSV_URL` in the script is your **published** Widget tab link (it contains `/pub?` and `output=csv`), not the sheet's normal editing link.
- Open the link in a browser. It should show two lines: `percent_of_predicted` and `status`.

### The widget shows an old number
- iOS controls when widgets refresh, usually every few hours. Run the script in Scriptable to refresh it immediately.
- Google takes a few minutes to republish after the sheet changes.

### The widget is yellow even though the percent shows 100%
The display rounds. At 99.6% it shows 100% but sits below a 100% green threshold. Set **Green threshold** to 95% so ordinary daily market moves don't flip it.

### "Start publishing" does nothing
The browser is blocking the confirmation popup. This often happens in browsers embedded in other apps. Open the sheet in a regular browser window and try again.

### Running the script in Scriptable shows nothing
Make sure the line `if (!config.runsInWidget) await w.presentSmall();` is in the script. It's what shows the preview.

### Account balance looks too high
- Tiller's **Balance History** has several rows per account, one for each refresh. The Accounts formulas should take only the latest row per account. If an account was summed several times, check its formula.
- Check the **Include** column for accounts that shouldn't count.

### Balances stopped updating
- In the sheet, open **Extensions → Tiller Money Feeds → Launch**. If you've been signed out, sign back in. Automatic updates stop while you're signed out.
- A bank may need you to log in again. Tiller's sidebar or tiller.com will show which one.

### I deleted one of Tiller's tabs
Tiller needs its Transactions, Categories and Balance History tabs. Undo the deletion (Edit → Undo, or File → Version history), then hide the tab instead.

### Status stays green, but the Predicted Path runs out of money
That's by design. Green means "on track for your plan." If the plan runs out at a certain age, revisit the assumptions, usually spending or income.
