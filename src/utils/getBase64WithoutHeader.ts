import { Base64, FileType } from "."
import { getBase64 } from "./getBase64"
import { removeBase64Header } from "./removeBase64Header"

/**
 * 获取文件的 base64，不包含头部
 * @param {FileType} file 文件，支持 base64、Blob、Buffer
 * @returns {Base64} base64
 */
export async function getBase64WithoutHeader(file: FileType): Promise<Base64> {
    return removeBase64Header(await getBase64(file))
}
