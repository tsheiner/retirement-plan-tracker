# How the model works

The tracker answers one question: **is your balance where your plan says it should be today?**

## The predicted path

The **Predicted Path** tab plays your plan forward one year at a time, starting from your **Starting balance** on the **Plan start date**:

```
Predicted balance (end) = Predicted balance (start)
                        − Annual spending
                        + Income
                        + Planned items
                        + Growth
```

- **Annual spending** starts on the **Retirement date**. The first year is prorated if retirement falls partway through it.
- **Income** is the sum of the rows on the Income tab, each counted only between its start and end dates, prorated by month.
- **Planned items** are one-time expenses (negative) or inflows (positive) in the year they're dated.
- **Growth** is the year's starting balance times **Return after inflation**.

The path runs 40 years. If the balance goes negative, that's the year the plan runs out of money.

## Today's dollars

The whole plan is in **today's dollars** (plan-start dollars). Spending stays flat, the return is measured *after* inflation, and Social Security estimates are already in today's dollars. That keeps the inputs simple: you never have to forecast prices.

Your real account balances, though, are in actual dollars, which drift upward with inflation. So the sheet converts the predicted balance into today's actual dollars using the **Inflation** assumption, and you compare like with like. That's why the **Predicted balance** on the Model tab gradually runs higher than the Predicted Path tab's numbers.

## The comparison

- **Predicted balance:** where the path says you should be today, including any planned items whose dates have passed, converted to actual dollars.
- **Percent of predicted** = Account balance ÷ Predicted balance.
- **Status:** green at or above the **Green threshold**, red below the **Red threshold**, yellow in between.

## The gap message (optional)

When **Percent of predicted** is more than 1% from 100%, a script in the sheet (`apps-script/gap-message.gs`) runs once a day. It sends Claude the Model, Accounts, Income, Planned Items and Predicted Path tabs, each account's balance change since the plan start, and a summary of transactions since then. Claude replies with one sentence giving the most likely cause, which goes in the `message` row of the Widget tab. Within 1%, the message is cleared and Claude isn't called.

It's an explanation of the gap, not a prediction or advice, and it never includes dollar amounts.

## Design choices

- **Monitoring, not prediction.** The path uses a steady expected return. It doesn't try to forecast crashes; when one happens, the widget shows it, and what to do about it is a separate decision.
- **Totals, not holdings.** Only account totals matter. How the money is invested shows up in its balance automatically.
- **Surprises show up; plans don't.** Anything in the plan (income, planned items) is expected, so it doesn't move the widget. Anything outside the plan (a market drop, unplanned spending, unexpected income) does, which is exactly what you want to see.
- **Simple over precise.** Taxes and health insurance are folded into one spending number. Pensions are treated as keeping up with inflation. Those simplifications make the plan slightly optimistic or pessimistic, but they keep it understandable.
