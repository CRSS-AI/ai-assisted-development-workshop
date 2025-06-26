/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["langchain", "@langchain/openai", "@langchain/anthropic"]
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  }
}

module.exports = nextConfig
