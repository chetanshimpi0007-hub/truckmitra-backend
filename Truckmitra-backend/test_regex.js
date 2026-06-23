const fs = require('fs');
const content = fs.readFileSync('C:/Users/Administrator/Downloads/Truckmitra project12345/truckmitra-backend/src/main/java/com/truckmitra/entity/wallet/Wallet.java', 'utf8');

let tableNameMatch = /@Table\s*\([^)]*name\s*=\s*['"]([^'"]+)['"][^)]*\)/.exec(content);
console.log("Table name Match:", tableNameMatch ? tableNameMatch[1] : null);

const columnRegex = /@Column\s*\([^)]*name\s*=\s*['"]([^'"]+)['"][^)]*\)/g;
let match;
while ((match = columnRegex.exec(content)) !== null) {
    console.log("Column:", match[1]);
}
