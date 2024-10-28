// @ts-check

import { readFile, writeFile } from "fs/promises"

async function main() {
    const content = await readFile("dist/esm/index.d.ts", "utf-8")
    const lines = content.split("\n").slice(2)
    const markdown = `# umi-ocr

基于 [umi-ocr](https://github.com/hiroi-sora/Umi-OCR) 项目

## 类型说明

\`\`\`typescript
${lines.join("\n")}\`\`\`
`
    await writeFile("README.md", markdown)
}

main()
