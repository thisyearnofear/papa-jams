/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"]
    })
    return config
  },
  transpilePackages: ["three-custom-shader-material", "three-stdlib"]
}

module.exports = nextConfig
