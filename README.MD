It's a science project for school!p

Removing items from array

- filter and find all items that match the host
- get the index of the last entry
- remove item from array

```js
const visits = [{host: "google.com"}, {host: "amazon.com"}, {host: "google.com"}];
const matchingEntries = visits.find(visit => visit.host === location.host);
const lastEntry = matchingEntries.pop();
const entryIndex = visits.indexOf(lastEntry);
visits.splice(entryIndex, 1);
```