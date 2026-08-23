import { relative } from 'path'

const getRelativePath = (filenames) =>
  filenames.map((e) => relative(import.meta.dirname, e).replace(/\\/g, '/'))

export default {
  '*.{js,jsx,ts,tsx,vue}': (filenames) => {
    // 过滤要忽略的路径（例如 public 目录）
    const filesToLint = getRelativePath(filenames).filter(
      (e) => !e.startsWith('src/renderer/public/')
    )

    if (!filesToLint.length) return []

    const files = filesToLint.join(' ')

    return [
      `oxlint ${files}`,
      `eslint --cache --cache-location node_modules/.cache/eslint/ ${files}`,
      `npm run type-check`
    ]
  },

  '*.{js,jsx,ts,tsx,vue,css,scss,json,md}': (filenames) => {
    const needFormat = getRelativePath(filenames).filter(
      (e) => !/CHANGELOG.md|^src\/renderer\/public\/|^resources\//.test(e)
    )
    if (!needFormat.length) return []

    return [`prettier --check --ignore-unknown --experimental-cli ${needFormat.join(' ')}`]
  }
}
