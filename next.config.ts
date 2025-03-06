import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'
const jiti = createJiti(fileURLToPath(import.meta.url))

jiti.import('env')

const nextConfig: NextConfig = {
  /* config options here */
}

export default nextConfig
