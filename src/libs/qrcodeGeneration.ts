import { QrcodeFormat } from "./qrcodeRecognition"

/**
 * 二维码生成选项
 */
export type QrcodeGenerationOptions = {
    /**
     * 二维码格式
     *
     * 默认为 "QRCode"
     *
     * 具体可选值见相关文档说明
     */
    format?: QrcodeFormat

    /**
     * 生成图像的宽度
     *
     * 整数，默认值为 0，表示自动设为最小宽度
     */
    w?: number

    /**
     * 生成图像的高度
     *
     * 整数，默认值为 0，表示自动设为最小高度
     */
    h?: number

    /**
     * 二维码四周的空白边缘宽度
     *
     * 整数，默认值为 -1，表示自动调节边缘宽度
     */
    quiet_zone?: number

    /**
     * 纠错等级
     *
     * 整数，默认值为 -1（自动选择）
     *
     * 可选值：
     *
     *  -1: 自动
     *
     *  1: 7% 纠错
     *
     *  0: 15% 纠错
     *
     *  3: 25% 纠错
     *
     *  2: 30% 纠错
     *
     * 仅在格式为 Aztec、PDF417 或 QRCode 时生效
     */
    ec_level?: -1 | 1 | 0 | 3 | 2
}

/**
 * 二维码生成选项，含有 API 地址
 */
export type QrcodeGenerationOptionsWithUrl = QrcodeGenerationOptions & {
    /**
     * 二维码生成 API 地址
     *
     * @default "http://127.0.0.1:1224/api/qrcode"
     */
    url?: string
}

/**
 * 二维码生成请求体
 */
export type QrcodeGenerationBody = {
    /**
     * 要写入二维码的文本内容
     * 必填字段
     */
    text: string

    /**
     * 可选参数，包含二维码生成的各项配置
     */
    options?: QrcodeGenerationOptions
}

/**
 * 二维码识别结果
 */
export type QrcodeGenerationResult = {
    code: number
    data: string
}

/**
 * 二维码生成
 *
 * @param {string} text 要写入二维码的文本内容
 *
 * @param {QrcodeGenerationOptionsWithUrl} optionsWithUrl 二维码识别选项，含有 API 地址
 *
 * @returns {Promise<QrcodeRecognitionResult>} 二维码识别结果
 */
export async function qrcodeGeneration(text: string, optionsWithUrl?: QrcodeGenerationOptionsWithUrl): Promise<QrcodeGenerationResult> {
    const { url = "http://127.0.0.1:1224/api/qrcode", ...options } = optionsWithUrl ?? {}
    const body: QrcodeGenerationBody = { text, options }
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    const result: QrcodeGenerationResult = await response.json()
    result.code === 100 && (result.data &&= `data:image/jpeg;base64,${result.data}`)
    return result
}
