const sharp = require('sharp');

async function generate() {
  await sharp({ create: { width: 512, height: 512, channels: 4, background: '#050505' } })
    .composite([{
      input: Buffer.from('<svg width="512" height="512"><text x="50%" y="50%" font-size="256" font-family="Arial" fill="#d4af37" text-anchor="middle" dominant-baseline="middle">A</text></svg>')
    }])
    .png()
    .toFile('public/admin-icon-512.png');

  await sharp({ create: { width: 192, height: 192, channels: 4, background: '#050505' } })
    .composite([{
      input: Buffer.from('<svg width="192" height="192"><text x="50%" y="50%" font-size="96" font-family="Arial" fill="#d4af37" text-anchor="middle" dominant-baseline="middle">A</text></svg>')
    }])
    .png()
    .toFile('public/admin-icon-192.png');
}

generate();
