import { translateToIndonesian } from '../src/lib/translator';

async function main() {
  const text = 'I am a Cloud Engineer with over five years of experience in designing scalable infrastructure.';
  console.log('Original:', text);
  const translated = await translateToIndonesian(text);
  console.log('Translated:', translated);
}

main();
