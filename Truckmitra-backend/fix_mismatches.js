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
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    let tableNameMatch = /@Table\s*\([^)]*name\s*=\s*['"]([^'"]+)['"][^)]*\)/.exec(content);
    let tableName = tableNameMatch ? tableNameMatch[1] : null;
    
    if (!tableName) {
        let classMatch = /(?:public|protected|private)\s+class\s+([A-Z][a-zA-Z0-9_]+)/.exec(content);
        if (classMatch) {
            let derived = classMatch[1].replace(/[A-Z]/g, letter => '_' + letter.toLowerCase()).replace(/^_/, '') + 's';
            if (dbSchema[derived]) tableName = derived;
            else if (dbSchema[classMatch[1].toLowerCase() + 's']) tableName = classMatch[1].toLowerCase() + 's';
            else if (dbSchema['users'] && classMatch[1] === 'User') tableName = 'users';
        }
    }

    if (!tableName || !dbSchema[tableName]) {
        // Fallback: check if the fields exist in ANY table if it's a superclass (like User)
        if (file.endsWith('User.java')) {
            tableName = 'users';
        } else {
            return;
        }
    }

    const tableColumns = dbSchema[tableName];

    // Find and replace invalid @Column mappings
    const columnRegex = /(@Column\s*\([^)]*name\s*=\s*['"])([^'"]+)(['"][^)]*\))/g;
    content = content.replace(columnRegex, (match, prefix, colName, suffix) => {
        if (!tableColumns.includes(colName)) {
            // Check if removing underscores matches a column
            const noUnderscores = colName.replace(/_/g, '');
            if (tableColumns.includes(noUnderscores)) {
                return prefix + noUnderscores + suffix;
            }
        }
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed ${path.basename(file)}`);
    }
});
