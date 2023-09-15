const figlet = require("figlet")

figlet("Mirka", (err, data) => {
    if (err) {
        console.log(err);
        return
    }
    console.log(data);
})