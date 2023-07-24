/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.dummyjson.com",
				pathname: "**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				pathname: "**",
			},
		],
	},
}

module.exports = nextConfig
