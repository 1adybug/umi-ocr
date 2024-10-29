// @ts-check

import { readFile, writeFile } from "fs/promises"

/**
 * @param {string} path
 */
async function getType(path) {
    const content = await readFile(path, "utf-8")
    const lines = content.split("\n").filter(line => !line.startsWith("import"))
    return `\`\`\`typescript
${lines.join("\n")}\`\`\``
}

async function markdown() {
    const imageOcr = await getType("dist/esm/libs/imageOcr.d.ts")
    const docOcr = await getType("dist/esm/libs/docOcr.d.ts")
    const qrcodeGeneration = await getType("dist/esm/libs/qrcodeGeneration.d.ts")
    const qrcodeRecognition = await getType("dist/esm/libs/qrcodeRecognition.d.ts")
    const markdown = `# umi-ocr

基于 [umi-ocr](https://github.com/hiroi-sora/Umi-OCR) 项目

## 图片 OCR

${imageOcr}

## 文档 OCR

${docOcr}

## 二维码生成

${qrcodeGeneration}

## 二维码识别

${qrcodeRecognition}
`
    await writeFile("README.md", markdown)
}

markdown()
