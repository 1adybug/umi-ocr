// @ts-check

import { readdir, stat, writeFile } from "fs/promises"
import { join } from "path"

export async function writeExports() {
    const dir = await readdir("src")
    /**
     * @type {string[]}
     */
    const exports = []
    for (const item of dir) {
        const folder = join("src", item)
        const status = await stat(folder)
        if (!status.isDirectory()) continue
        const files = await readdir(folder)
        for (const file of files) {
            const status2 = await stat(join(folder, file))
            if (!status2.isFile()) continue
            if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue
            exports.push(`export * from "./${item}/${file.replace(/\.tsx?$/, "")}"`)
        }
    }
    await writeFile("src/index.ts", exports.join("\n") + "\n")
}

writeExports()
