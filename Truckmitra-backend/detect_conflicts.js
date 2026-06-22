const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
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
    
    // 1. Explicit columns
    const columnRegex = /@Column\s*\([^)]*name\s*=\s*['"]([^'"]+)['"][^)]*\)\s*(?:private|protected|public)\s+(?:Long|String|Integer|Double|Boolean)\s+([a-zA-Z0-9_]+)\s*;/g;
    let explicitCols = [];
    let match;
    while ((match = columnRegex.exec(content)) !== null) {
        if (!match[0].includes('insertable = false') && !match[0].includes('insertable=false')) {
            explicitCols.push({ colName: match[1], fieldName: match[2] });
        }
    }

    // 2. Relations (ManyToOne, OneToOne)
    // To match annotations across lines we need a robust regex or just find the field type
    const relRegex = /@(ManyToOne|OneToOne)[\s\S]*?(?:private|protected|public)\s+([A-Z][a-zA-Z0-9_]+)\s+([a-zA-Z0-9_]+)\s*;/g;
    let relCols = [];
    while ((match = relRegex.exec(content)) !== null) {
        const fullDecl = match[0];
        let colName;
        const joinColMatch = /@JoinColumn\s*\([^)]*name\s*=\s*['"]([^'"]+)['"][^)]*\)/.exec(fullDecl);
        if (joinColMatch) {
            colName = joinColMatch[1];
        } else {
            // Default derived column name: fieldName_id
            const fieldName = match[3];
            colName = fieldName.replace(/[A-Z]/g, letter => '_' + letter.toLowerCase()) + '_id';
        }
        
        if (!fullDecl.includes('insertable = false') && !fullDecl.includes('insertable=false')) {
            relCols.push({ colName });
        }
    }

    const colCounts = {};
    explicitCols.forEach(ec => { colCounts[ec.colName] = (colCounts[ec.colName] || 0) + 1; });
    relCols.forEach(rc => { colCounts[rc.colName] = (colCounts[rc.colName] || 0) + 1; });
    
    const duplicates = Object.keys(colCounts).filter(k => colCounts[k] > 1);

    if (duplicates.length > 0) {
        console.log('File:', file);
        console.log('  Conflicts on columns:', duplicates);
    }
});
