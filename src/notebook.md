```js
md`# Deviations - Product development`
```

```js
md`## Overdue activities`
```

```js
dot_plot(activities_overdue, "Overdue activities", '#375875')
```

```js
histogram(activities_overdue, "Overdue activities", '#375875')
```

```js
md`## Overdue milestones`
```

```js
dot_plot(milestones_overdue, "Overdue milestones", '#375875')
```

```js
histogram(milestones_overdue, "Overdue milestones", '#375875')
```

```js
md`## Delayed activities`
```

```js
dot_plot(activities_done_delayed, 'Delayed activities', '#5e8962')
```

```js
info(activities_done_delayed)
```

```js
histogram(activities_done_delayed, 'Delayed activities', '#5e8962')
```

```js
viewof z = Inputs.range([1, 20], { step: 0.5, label: 'Z value', value: 4 })
```

```js
md`## Delayed milestones`
```

```js
dot_plot(milestones_done_delayed, 'Delayed milestones', '#5e8962')
```

```js
info(milestones_done_delayed)
```

```js
info = data => {
  const days = d3.sort(data.map(d => d.days))
  const ov = outlier_value(days)
  const index = d3.bisect(days, ov)
  const oc = days.length - index
  return oc ? md`There are ${oc} outliers with a mean of ${d3.mean(days.slice(index))}.` : ''
}
```

```js
histogram(milestones_done_delayed, 'Delayed milestones', '#5e8962')
```

```js
md`## Overdue cards`
```

```js
dot_plot(cards_overdue, 'Overdue cards', '#375875')
```

```js
histogram(cards_overdue, 'Overdue cards', '#375875')
```

```js
md`_~Data~_`
```

```js
planlets = await FileAttachment("planlets.json").json()
```

```js
activities_overdue = planlets
  .filter(d => d.kind === 0)
  .filter(d => !d.is_parent)
  .filter(d => d.state !== 1)
  .filter(d => getUtcTime(d.end_date) < getUtcTime())
  .map(d => ({
    name: d.name,
    days: d3.timeDay.count(utcDate(d.end_date), utcDate())
  }))
```

```js
activities_done_delayed = planlets
  .filter(d => d.kind === 0)
  .filter(d => !d.is_parent)
  .filter(d => d.state === 1)
  //.filter(d => d.done_date && d.end_date)
  .filter(d => getUtcTime(d.done_date) > getUtcTime(d.end_date))
  .map(d => ({
    name: d.name,
    days: d3.timeDay.count(utcDate(d.end_date), utcDate(d.done_date))
  })).concat({ name: 'Dummy', days: 2000})
```

```js
milestones_overdue = planlets
  .filter(d => d.kind === 1)
  .filter(d => !d.is_parent)
  .filter(d => d.state !== 1)
  .filter(d => getUtcTime(d.end_date) < getUtcTime())
  .map(d => ({
    name,
    days: d3.timeDay.count(utcDate(d.end_date), utcDate())
  }))
```

```js
milestones_done_delayed = planlets
  .filter(d => d.kind === 1)
  .filter(d => !d.is_parent)
  .filter(d => d.state === 1)
  .filter(d => d.done_date && d.end_date)
  .filter(d => getUtcTime(d.done_date) > getUtcTime(d.end_date))
  .map(d => ({
    name: d.name,
    days: d3.timeDay.count(utcDate(d.end_date), utcDate(d.done_date))
  }))
```

```js
cards_overdue = {
  const cards = await FileAttachment("cards.json").json()
  return cards.map(d => ({
    name: d.title,
    days: d3.timeDay.count(utcDate(d.due_date), utcDate())
  }))
  .filter(d => d.days > 0 )
}
```

```js
md`_~Utils~_`
```

```js
getUtcTime = date => utcDate(date).getTime()
```

```js
utcDate = (date) => d3.utcDay.floor(date ? new Date(date) : new Date())
```

```js
dot_plot = (data, caption, fill) => {
  const y = () => {
    const frac = x => x - (x | 0);
    return i => 50 + 25 * frac(952 * Math.sin((i + 0.5) * 876));
  }
  const outlier_value_ = outlier_value(data.map(d => d.days))
  const max_days = d3.max(data, d => d.days)
  data = d3.sort(data, d => d.days)
  return Plot.plot({
    caption,
    grid: true,
    y: {
      axis: null,
    },
    marks: [
      outlier_value_ < max_days ? Plot.ruleX([outlier_value_], { stroke: 'red', strokeOpacity: 0.5 }) : [],
      /*outlier_value_ < max_days ? Plot.barX(data, Plot.selectMaxX({
        x: 'days',
        x1: d => outlier_value_,
        x2: d => d.days,
        fill: 'red',
        fillOpacity: 0.1,
      })) : [],*/
      outlier_value_ < max_days ? Plot.barX([1], {
        x1: [outlier_value_],
        x2: [max_days],
        fill: 'red',
        fillOpacity: 0.1,
      }) : [],
      Plot.dot(data, {
        x: 'days',
        title: 'name',
        y: (d, i) => y()(i),
        r: 3,
        fill,
        fillOpacity: 0.5,
      }),
      Plot.ruleX(data, Plot.groupZ({
        x: "median"
      }, {
        x: 'days',
        fill,
      })),
      Plot.text(data, Plot.groupZ({
        x: "median",
        text: g => 'Median: ' +d3.format('.2s')(d3.median(g)) + ' days',
      }, {
        x: 'days',
        text: 'days',
        dx: 5,
        textAnchor: 'start',
        fontSize: 14,
      })),
      Plot.ruleX(data, Plot.groupZ({
        x: "mean"
      }, {
        x: 'days',
        fill: 'blue',
      })),
      Plot.text(data, Plot.groupZ({
        x: "mean",
        text: g => 'Mean: ' + d3.format('.2s')(d3.mean(g)) + ' days',
      }, {
        x: 'days',
        text: 'days',
        dx: 5,
        dy: 30,
        textAnchor: 'start',
        fontSize: 14,
      })),
      Plot.ruleX(data, Plot.groupZ({
        x: "deviation"
      }, {
        x: 'days',
        fill: 'blue',
      })),
      Plot.text(data, Plot.groupZ({
        x: "mean",
        text: g => 'Deviation: ' + d3.format('.2s')(d3.deviation(g)) + ' days',
      }, {
        x: 'days',
        text: 'days',
        dx: 5,
        dy: -30,
        textAnchor: 'start',
        fontSize: 14,
      })),
    ]
  })
}
```

```js
histogram = (data, caption, fill) => {
  const outlier_value_ = outlier_value(data.map(d => d.days))
  data = data.filter(d => d.days <= outlier_value_)
  return Plot.plot({
    caption,
    y: {
      grid: true,
    },
    x: {
      nice: true,
    },
    marks: [
      Plot.rectY(data, Plot.binX({
        y: "count",
        title: "count"
      }, {
        x: "days",
        fill,
        //domain: [0, d3.quantile(data.map(d => d.days), 0.98)],
      }))
    ]
  })
}
```

```js
z_score = data => z * d3.deviation(data) + d3.mean(data)
```

```js
outlier_value = data => z_score(data)
```
