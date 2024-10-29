import { Base64, FileType } from "../utils"
import { getBase64WithoutHeader } from "../utils/getBase64WithoutHeader"

/**
 * 语言/模型库
 */
export enum ImageOcrLanguage {
    /** 简体中文 */
    "zh" = "models/config_chinese.txt",
    /** 英文，English */
    "en" = "models/config_en.txt",
    /** 繁体中文，繁體中文 */
    "zh-tw" = "models/config_chinese_cht(v2).txt",
    /** 日本语，日本語 */
    "ja" = "models/config_japan.txt",
    /** 韩语，한국어 */
    "ko" = "models/config_korean.txt",
    /** 俄语，Русский */
    "ru" = "models/config_cyrillic.txt",
}

/**
 * 限制图像边长
 */
export enum ImageOcrLimitSideLen {
    /** 960 （默认） */
    Default = 960,
    /** 2880 */
    Large = 2880,
    /** 4320 */
    ExtraLarge = 4320,
    /** 无限制 */
    Unlimited = 999999,
}

/**
 * 排版解析方案
 */
export enum ImageOcrTbpuParser {
    /** 多栏-按自然段换行 */
    MultiPara = "multi_para",
    /** 多栏-总是换行 */
    MultiLine = "multi_line",
    /** 多栏-无换行 */
    MultiNone = "multi_none",
    /** 单栏-按自然段换行 */
    SinglePara = "single_para",
    /** 单栏-总是换行 */
    SingleLine = "single_line",
    /** 单栏-无换行 */
    SingleNone = "single_none",
    /** 单栏-保留缩进 */
    SingleCode = "single_code",
    /** 不做处理 */
    None = "none",
}

/**
 * 数据返回格式
 */
export enum ImageOcrDataFormat {
    /** 含有位置等信息的原始字典 */
    Dict = "dict",
    /** 纯文本 */
    Text = "text",
}

/**
 * 图像 Ocr 选项
 */
export type ImageOcrOptions<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict> = {
    /**
     * 语言/模型库
     *
     * @default ImageOcrLanguage.zh
     */
    "ocr.language"?: ImageOcrLanguage

    /**
     * 纠正文本方向
     *
     * 启用方向分类，识别倾斜或倒置的文本。可能降低识别速度
     *
     * @default false
     */
    "ocr.cls"?: boolean

    /**
     * 限制图像边长
     *
     * 将边长大于该值的图片进行压缩，可以提高识别速度。可能降低识别精度
     *
     * @default ImageOcrLimitSideLen.Default
     */
    "ocr.limit_side_len"?: ImageOcrLimitSideLen

    /**
     * 排版解析方案
     *
     * 按什么方式，解析和排序图片中的文字块
     *
     * @default ImageOcrTbpuParser.MultiPara
     */
    "tbpu.parser"?: ImageOcrTbpuParser

    /** 忽略区域
     *
     * 数组，每一项为 [[左上角x,y],[右下角x,y]]
     */
    "tbpu.ignoreArea"?: [number, number][][]

    /**
     * 数据返回格式
     *
     * @default ImageOcrDataFormat.Dict
     */
    "data.format"?: T
}

/**
 * 图像 Ocr 选项，含有 api 地址
 */
export type ImageOcrOptionsWithUrl<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict> = ImageOcrOptions<T> & {
    /** api 地址
     *
     * @default "http://127.0.0.1:1224/api/ocr"
     */
    url?: string
}

/**
 * 图像 Ocr 请求体
 */
export type ImageOcrBody<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict> = {
    base64: Base64
    options?: ImageOcrOptions<T>
}

/**
 * 含有位置等信息的原始字典
 */
export type ImageOcrDictData = {
    box: [number, number][]
    score: number
    text: string
    end: string
}

/**
 * 图像 Ocr 结果
 */
export type ImageOcrResult<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict> = {
    code: number
    data: T extends ImageOcrDataFormat.Dict ? ImageOcrDictData[] : string
    score: number
    time: number
    timestamp: number
}

/**
 * 图像识别
 *
 * @param { FileType } image 图像，支持 base64、Blob、Buffer
 *
 * @param { ImageOcrOptionsWithUrl } optionsWithUrl 选项
 *
 * @returns {Promise<ImageOcrResult>} 识别结果
 */
export async function imageOcr<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict>(
    image: FileType,
    optionsWithUrl?: ImageOcrOptionsWithUrl<T>,
): Promise<ImageOcrResult<T>> {
    const base64 = await getBase64WithoutHeader(image)
    const { url = "http://127.0.0.1:1224/api/ocr", ...options } = optionsWithUrl ?? {}
    const body: ImageOcrBody<T> = { base64, options }
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
    const result: ImageOcrResult<T> = await response.json()
    return result
}
