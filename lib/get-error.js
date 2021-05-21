module.exports = (error, useMessage = false) => {
  return typeof error === 'object' ? error instanceof Error ? error[!useMessage ? 'stack' : 'message'] : JSON.stringify(error) : error
}
