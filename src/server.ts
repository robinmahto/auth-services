const username = "robinmahto";
function printName(username: string): string {
    const users = {
        name: "robin",
    };
    console.log(users.name);
    return username;
}

console.log(printName(username));
