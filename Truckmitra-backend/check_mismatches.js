const fs = require('fs');
const path = require('path');

const dbSchema = JSON.parse(fs.readFileSync('db_schema.json', 'utf8'));

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.java')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('C:/Users/Administrator/Downloads/Truckmitra project12345/truckmitra-backend/src/main/java/com/truckmitra/entity');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    let tableNameMatch = /@Table\s*\([^)]*name\s*=\s*['"]([^'"]+)['"][^)]*\)/.exec(content);
    let tableName = tableNameMatch ? tableNameMatch[1] : null;
    
    if (!tableName) {
        // If it extends a class or doesn't have @Table, check if class name exists in DB
        let classMatch = /(?:public|protected|private)\s+class\s+([A-Z][a-zA-Z0-9_]+)/.exec(content);
        if (classMatch) {
            let derived = classMatch[1].replace(/[A-Z]/g, letter => '_' + letter.toLowerCase()).replace(/^_/, '') + 's';
            if (dbSchema[derived]) tableName = derived;
            else if (dbSchema[classMatch[1].toLowerCase() + 's']) tableName = classMatch[1].toLowerCase() + 's';
        }
    }

    if (!tableName || !dbSchema[tableName]) {
        // For inherited tables, we might just assume they map to parent
        return;
    }

    const tableColumns = dbSchema[tableName];

    const columnRegex = /@Column\s*\([^)]*name\s*=\s*['"]([^'"]+)['"][^)]*\)/g;
    let match;
    let mismatched = [];
    while ((match = columnRegex.exec(content)) !== null) {
        let colName = match[1];
        if (!tableColumns.includes(colName)) {
            mismatched.push(colName);
        }
    }
    
    const joinColRegex = /@JoinColumn\s*\([^)]*name\s*=\s*['"]([^'"]+)['"][^)]*\)/g;
    while ((match = joinColRegex.exec(content)) !== null) {
        let colName = match[1];
        if (!tableColumns.includes(colName)) {
            mismatched.push('@JoinColumn:' + colName);
        }
    }

    if (mismatched.length > 0) {
        console.log(`File: ${path.basename(file)} (Table: ${tableName})`);
        console.log(`  Invalid Columns: ${mismatched.join(', ')}`);
    }
});
