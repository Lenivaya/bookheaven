import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import pluginQuery from '@tanstack/eslint-plugin-query'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  // ...compat.extends('next/core-web-vitals', 'next/typescript')
  ...pluginQuery.configs['flat/recommended'],
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
    plugins: ['drizzle'],
    ignorePatterns: ['__tests__', '*.test.tsx', '*.test.ts']
  })
]

export default eslintConfig
