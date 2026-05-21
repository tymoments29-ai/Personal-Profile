import translate from 'google-translate-api-x';

/**
 * Translates text from English to Indonesian.
 * @param text The text to translate
 * @returns The translated text or null if translation fails
 */
export async function translateToIndonesian(text: string | null | undefined): Promise<string | null> {
  if (!text) return null;
  
  try {
    const res = await translate(text, { from: 'en', to: 'id' });
    return res.text;
  } catch (error) {
    console.error('Translation error:', error);
    return null;
  }
}
