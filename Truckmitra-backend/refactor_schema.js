const fs = require('fs');
const path = require('path');

const ENTITY_DIR = path.join(__dirname, 'src', 'main', 'java', 'com', 'truckmitra', 'entity');

function toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    let modified = false;

    // We look for: private/protected Type camelCaseField [= ...];
    const fieldRegex = /^\s*(?:private|protected)\s+(?:[\w<>, \[\]]+)\s+([a-z]+[A-Z][a-zA-Z0-9]*)\s*(?:=.*)?;/;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        let match = line.match(fieldRegex);
        if (match && !line.includes('static') && !line.includes('final')) {
            let fieldName = match[1];
            let snakeCaseName = toSnakeCase(fieldName);
            
            // Check previous 10 lines for existing @Column, @JoinColumn, @Transient
            let hasNameMapping = false;
            let existingColumnLineIdx = -1;
            let checkStart = Math.max(0, i - 15);
            for (let j = i - 1; j >= checkStart; j--) {
                let prevLine = lines[j];
                if (prevLine.includes('@Column')) {
                    if (prevLine.includes('name')) {
                        hasNameMapping = true;
                    } else {
                        existingColumnLineIdx = j;
                    }
                    break;
                }
                if (prevLine.includes('@JoinColumn')) {
                    hasNameMapping = true;
                    break;
                }
                if (prevLine.includes('@Transient')) {
                    hasNameMapping = true;
                    break;
                }
                if (prevLine.includes('@CreationTimestamp') || prevLine.includes('@UpdateTimestamp')) {
                    hasNameMapping = true;
                    break;
                }
                if (prevLine.includes(';') || prevLine.includes('class ') || prevLine.includes('{')) {
                    break;
                }
            }
            
            if (!hasNameMapping) {
                let indent = line.match(/^\s*/)[0];
                if (existingColumnLineIdx !== -1) {
                    // Modify existing @Column to include name
                    let colLine = lines[existingColumnLineIdx];
                    if (colLine.includes('()')) {
                        lines[existingColumnLineIdx] = colLine.replace('()', `(name = "${snakeCaseName}")`);
                    } else if (colLine.includes('(')) {
                        lines[existingColumnLineIdx] = colLine.replace('(', `(name = "${snakeCaseName}", `);
                    } else {
                        lines[existingColumnLineIdx] = colLine.replace('@Column', `@Column(name = "${snakeCaseName}")`);
                    }
                    modified = true;
                    console.log(`[${path.basename(filePath)}] Modified @Column to add name="${snakeCaseName}" for field: ${fieldName}`);
                } else {
                    let insertIdx = i;
                    while (insertIdx > 0 && /^\s*@/.test(lines[insertIdx - 1])) {
                        insertIdx--;
                    }
                    lines.splice(insertIdx, 0, `${indent}@Column(name = "${snakeCaseName}")`);
                    i++; 
                    modified = true;
                    console.log(`[${path.basename(filePath)}] Injected @Column(name = "${snakeCaseName}") for field: ${fieldName}`);
                }
            }
        }
    }

    // Add import jakarta.persistence.Column if needed
    if (modified && !content.includes('import jakarta.persistence.Column;')) {
        // Find package or other imports
        let importIdx = lines.findIndex(l => l.startsWith('import '));
        if (importIdx === -1) importIdx = 2; // default after package
        lines.splice(importIdx, 0, 'import jakarta.persistence.Column;');
    }

    if (modified) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    }
}

function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory()) {
            walk(path.join(dir, file), fileList);
        } else if (file.endsWith('.java')) {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

const args = process.argv.slice(2);
let targetFiles = walk(ENTITY_DIR);

if (args.length > 0) {
    const pattern = new RegExp(args[0], 'i');
    targetFiles = targetFiles.filter(f => pattern.test(f));
}

for (const file of targetFiles) {
    processFile(file);
}

console.log("Refactoring complete.");
