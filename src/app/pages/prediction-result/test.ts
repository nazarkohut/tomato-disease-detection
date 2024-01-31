function getCurrentDateTime() {
  const timestamp = Date.now();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false, // Use 24-hour format
  };
  return new Date(timestamp).toLocaleString('en-US', options);
}

console.log(getCurrentDateTime());
console.log(getCurrentDateTime());
console.log(getCurrentDateTime());

