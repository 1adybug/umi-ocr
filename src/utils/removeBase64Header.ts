import { Base64 } from "."

/**
 * 移除 base64 头部
 * @param {Base64} base64 base64
 * @returns {Base64} base64
 */
export function removeBase64Header(base64: Base64): Base64 {
    return base64.replace(/^data:.+?base64,/, "")
}
