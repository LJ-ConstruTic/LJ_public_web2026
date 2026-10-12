const target = process.env.CMS_API_TARGET || 'https://ap-v2-1.ljconstrutic.com';
console.info(`[CMS proxy] /v2 -> ${target}`);

module.exports = {
  '/v2': {
    target,
    secure: true,
    changeOrigin: true,
  },
};