import { Base64, FileType } from "."

/**
 * 获取文件的 base64
 * @param {FileType} file 文件，支持 base64、Blob、Buffer
 * @returns {Base64} base64
 */
export async function getBase64(file: FileType): Promise<Base64> {
    let base64: string
    if (typeof file === "string") {
        base64 = file
    } else if (file instanceof Blob) {
        if (globalThis.FileReader) {
            base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.addEventListener("load", () => resolve(reader.result as string))
                reader.addEventListener("error", reject)
            })
        } else if (globalThis.Buffer) {
            base64 = Buffer.from(await file.arrayBuffer()).toString("base64")
        } else {
            throw new Error("Blob is not supported in this environment")
        }
    } else {
        base64 = file.toString("base64")
    }
    return base64
}
