# retirement-plan-tracker

A phone widget that tells you if your retirement plan is on track.

It compares your actual balance (via Google Sheets and Tiller) to the path your plan predicts from savings, spending, income and growth, and shows green, yellow, or red. Monitoring, not prediction.

## The problem this solves

In retirement you live off your savings, so your balance is *supposed* to go down. That makes it hard to tell, just by looking at your accounts, whether you're on track for the money to last your lifetime.

This project gives you one simple signal: **is your balance where your plan says it should be today?**

- **Green:** on track
- **Yellow:** drifting behind the plan
- **Red:** well behind the plan; time to take a closer look

It doesn't predict markets or tell you what to do. It tells you when you need to pay attention.

**If you aren't living off savings, or don't have this question, you don't need this project.**

## How it works

1. **A Google Sheet holds your plan.** You enter a few assumptions: your starting balance, annual spending, retirement date, expected return, and any income (Social Security, pensions, part-time work). The sheet plays them forward year by year into a *predicted path*.
2. **Tiller keeps your balances current.** It pulls account balances into the sheet automatically. (You can also enter balances by hand.)
3. **The sheet compares actual to predicted.** It works out what percent of the predicted balance you actually have and turns that into a status.
4. **A widget on your iPhone shows the result.** It reads one published tab of the sheet that holds only the percent and the status, never your dollar amounts.

## Getting started

The easiest way to set this up is with an AI agent. Give it [`SKILL.md`](SKILL.md) and ask it to walk you through setup. The agent will:

- explain how the tracker works and check that it fits your situation
- interview you for your plan's assumptions
- build the sheet, if it can access Google Sheets, or guide you through it
- tell you clearly which steps it can do for you and which you'll need to do yourself

To do it by hand instead, follow the same steps in `SKILL.md`.

### What you'll need

| | Cost |
|---|---|
| A Google account | Free |
| An iPhone with [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) installed | Free |
| [Tiller](https://tiller.com) to update balances automatically (optional) | About $99/yr after a free trial |
| An AI agent that can edit Google Sheets (optional but recommended). In Claude, that's the Google Sheets connector. | Included with a paid plan |

## What's in this repo

| Path | What it is |
|---|---|
| `SKILL.md` | The setup guide, written for an AI agent to follow with you |
| `template/` | The blank Google Sheet template |
| `widget/` | The Scriptable code for the iPhone widget |
| `docs/` | How the model works, and troubleshooting |

## Disclaimer

This is a personal monitoring tool, not financial advice. Its predicted path is only as good as the assumptions you give it. For decisions about your retirement, talk to a qualified financial professional.

## License

[MIT](LICENSE)
