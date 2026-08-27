/*<!--section:docs-->

Format a date value as an ISO 8601 date string (YYYY-MM-DD).
Accepts any value accepted by the Date constructor and returns
the date portion of the resulting ISO string.

<!--section:code-->```js */
export default function (dateVal) {
  return new Date(dateVal).toISOString().split("T")[0];
}
//```
