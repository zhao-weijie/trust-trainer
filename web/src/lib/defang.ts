const urlPattern = /\b(https?:\/\/|www\.)[^\s<>"']+/gi;

export function defangUrl(value: string): string {
  return value
    .replace(/^https:\/\//i, "hxxps://")
    .replace(/^http:\/\//i, "hxxp://")
    .replace(/^www\./i, "www[.]")
    .replace(/\./g, "[.]");
}

export function defangText(text: string): string {
  return text.replace(urlPattern, (match) => defangUrl(match));
}
