export function extractFirstMediaUrl(mediaUrl: string): string {
  const firstUrl = mediaUrl.split(';')[0].trim();
  return firstUrl;
}