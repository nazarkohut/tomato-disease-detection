function getCurrentDateTime() {
    var timestamp = Date.now();
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };
    return new Date(timestamp).toLocaleString('en-US', options);
}
console.log(getCurrentDateTime());
console.log(getCurrentDateTime());
console.log(getCurrentDateTime());
