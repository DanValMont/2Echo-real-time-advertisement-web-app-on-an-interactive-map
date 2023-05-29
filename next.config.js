/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  images: { domains: ["res.cloudinary.com", "myimage.com"] },
};

module.exports = nextConfig;

//https://www.youtube.com/watch?v=c1xuwVLGBAk
