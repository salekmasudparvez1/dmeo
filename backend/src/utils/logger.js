export function log(tag, message) {
  console.log(`[${tag}] ${new Date().toISOString()} - ${message}`);
}