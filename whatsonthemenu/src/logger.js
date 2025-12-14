export function setup_logger() {
  // Simple logger setup, can be expanded
  return {
    info: (msg) => console.log(`INFO: ${msg}`),
    error: (msg) => console.error(`ERROR: ${msg}`)
  };
}
