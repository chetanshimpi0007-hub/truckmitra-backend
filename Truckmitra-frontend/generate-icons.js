const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const SOURCE_LOGO = path.join(__dirname, 'public', 'truckmitra-logo.png'); // assuming this exists
const TRANSPARENT_LOGO = path.join(__dirname, 'public', 'logo-transparent.png');
const PUBLIC_DIR = path.join(__dirname, 'public');

async function generate() {
    console.log('Generating icons...');
    // We'll use logo-transparent.png as the base if truckmitra-logo.png doesn't have transparency, or whichever exists.
    let srcFile = fs.existsSync(TRANSPARENT_LOGO) ? TRANSPARENT_LOGO : SOURCE_LOGO;
    if (!fs.existsSync(srcFile)) {
        console.error('No source logo found!');
        return;
    }

    // PWA logo192.png with padding
    await sharp(srcFile)
        .resize(150, 150, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .extend({
            top: 21, bottom: 21, left: 21, right: 21,
            background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(PUBLIC_DIR, 'logo192.png'));
    console.log('logo192.png created');

    // PWA logo512.png with padding
    await sharp(srcFile)
        .resize(400, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .extend({
            top: 56, bottom: 56, left: 56, right: 56,
            background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(PUBLIC_DIR, 'logo512.png'));
    console.log('logo512.png created');

    // Apple Touch Icon
    await sharp(srcFile)
        .resize(160, 160, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .extend({
            top: 10, bottom: 10, left: 10, right: 10,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log('apple-touch-icon.png created');

    // Generate 64x64 PNG for favicon conversion
    const tempFaviconPng = path.join(PUBLIC_DIR, 'favicon-temp.png');
    await sharp(srcFile)
        .resize(64, 64, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .toFile(tempFaviconPng);
    
    // Create favicon.ico
    const buf = await pngToIco(tempFaviconPng);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), buf);
    fs.unlinkSync(tempFaviconPng);
    console.log('favicon.ico created');

    console.log('All icons generated successfully!');
}

generate().catch(console.error);
