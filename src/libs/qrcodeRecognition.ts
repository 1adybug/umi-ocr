import { Base64, FileType } from "../utils"
import { getBase64WithoutHeader } from "../utils/getBase64WithoutHeader"

/**
 * 二维码识别预处理选项类型
 */
export type QrcodeRecognitionOptions = {
    /**
     * 中值滤波器的大小
     *
     * 取值范围：1、3、5、7、9（奇数）
     *
     * 默认为不进行滤波
     */
    "preprocessing.median_filter_size"?: 1 | 3 | 5 | 7 | 9

    /**
     * 锐度增强因子
     *
     * 取值范围：0.1 ~ 10.0
     *
     * 默认值为 1（不调整锐度）
     *
     * @default 1
     */
    "preprocessing.sharpness_factor"?: number

    /**
     * 对比度增强因子
     *
     * 取值范围：0.1 ~ 10.0
     *
     * 大于 1 增强对比度，小于 1 但大于 0 减少对比度，1 保持原样
     *
     * 默认值为 1（不调整对比度）
     *
     * @default 1
     */
    "preprocessing.contrast_factor"?: number

    /**
     * 是否将图像转换为灰度图像
     *
     * true 为转换，false 为不转换
     *
     * 默认为 false（不转换）
     *
     * @default false
     */
    "preprocessing.grayscale"?: boolean

    /**
     * 二值化阈值，用于灰度图像的二值化处理
     *
     * 取值范围：0 ~ 255 的整数
     *
     * 仅在 "preprocessing.grayscale" = true 时此参数才生效
     *
     * 默认为不进行二值化处理
     */
    "preprocessing.threshold"?: number
}

/**
 * 二维码识别请求体
 */
export type QrcodeRecognitionBody = {
    /**
     * 待识别图像的 Base64 编码字符串
     *
     * 必填，无需 "data:image/png;base64," 等前缀
     */
    base64: Base64

    /**
     * 可选参数字典，包含图像预处理选项
     */
    options?: QrcodeRecognitionOptions
}

export type QrcodeRecognitionOptionsWithUrl = QrcodeRecognitionOptions & {
    /**
     * 二维码识别 API 地址
     *
     * @default "http://127.0.0.1:1224/api/qrcode"
     */
    url?: string
}

/**
 * 二维码格式类型
 */
export type QrcodeFormat =
    | "Aztec"
    | "Codabar"
    | "Code128"
    | "Code39"
    | "Code93"
    | "DataBar"
    | "DataBarExpanded"
    | "DataMatrix"
    | "EAN13"
    | "EAN8"
    | "ITF"
    | "LinearCodes"
    | "MatrixCodes"
    | "MaxiCode"
    | "MicroQRCode"
    | "PDF417"
    | "QRCode"
    | "UPCA"
    | "UPCE"

/**
 * 二维码识别数据
 */
export type QrcodeRecognitionData = {
    /**
     * 二维码方向，0为正上
     */
    orientation: number
    /**
     * 文本框顺时针四个角的xy坐标：[左上,右上,右下,左下]
     */
    box: [number, number][]
    /**
     * 为了与OCR格式兼容而设，永远为1，无意义
     */
    score: number
    /**
     * 二维码格式，如 "QRCode" 等
     */
    format: QrcodeFormat
    /**
     * 二维码文本
     */
    text: string
}

/**
 * 二维码识别结果
 */
export type QrcodeRecognitionResult = {
    code: number
    data: QrcodeRecognitionData[]
    time: number
    timestamp: number
}

/**
 * 二维码识别
 *
 * @param {FileType} image 待识别图像，支持 base64、Blob、Buffer
 *
 * @param {QrcodeRecognitionOptionsWithUrl} optionsWithUrl 二维码识别预处理选项，含有 API 地址
 *
 * @returns {Promise<QrcodeRecognitionResult>} 二维码识别结果
 */
export async function qrcodeRecognition(image: FileType, optionsWithUrl?: QrcodeRecognitionOptionsWithUrl): Promise<QrcodeRecognitionResult> {
    const base64 = await getBase64WithoutHeader(image)
    const { url = "http://127.0.0.1:1224/api/qrcode", ...options } = optionsWithUrl ?? {}
    const body: QrcodeRecognitionBody = { base64, options }
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
    const result: QrcodeRecognitionResult = await response.json()
    return result
}
