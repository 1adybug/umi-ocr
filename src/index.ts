/** 语言/模型库 */
export enum ImageOcrLanguage {
    /** 简体中文 */
    简体中文 = "models/config_chinese.txt",
    /** English */
    English = "models/config_en.txt",
    /** 繁體中文 */
    繁體中文 = "models/config_chinese_cht(v2).txt",
    /** 日本語 */
    日本語 = "models/config_japan.txt",
    /** 한국어 */
    한국어 = "models/config_korean.txt",
    /** Русский */
    Русский = "models/config_cyrillic.txt",
}

/** 限制图像边长 */
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

/** 排版解析方案 */
export enum ImageTbpuParser {
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

/** 数据返回格式 */
export enum ImageDataFormat {
    /** 含有位置等信息的原始字典 */
    Dict = "dict",
    /** 纯文本 */
    Text = "text",
}

/** 图像 Ocr 选项 */
export type ImageOcrOptions = {
    /** api 地址，默认 http://127.0.0.1:1224/api/ocr */
    url?: string
    /** 语言/模型库 */
    "ocr.language"?: ImageOcrLanguage

    /** 纠正文本方向 */
    "ocr.cls"?: boolean

    /** 限制图像边长 */
    "ocr.limit_side_len"?: ImageOcrLimitSideLen

    /** 排版解析方案 */
    "tbpu.parser"?: ImageTbpuParser

    /** 忽略区域?: 数组，每一项为 [[左上角x,y],[右下角x,y]] */
    "tbpu.ignoreArea"?: [number, number][][]

    /** 数据返回格式 */
    "data.format"?: ImageDataFormat
}

/** 图像 Ocr 结果 */
export type ImageOcrResult = {
    code: number
    data: string
    score: number
    time: number
    timestamp: number
}

/**
 * 图像识别
 * @param image 图像，支持 base64、Blob、Buffer
 * @param options 选项
 * @returns 识别结果
 */
export async function imageOcr(image: string | Blob | Buffer, options: ImageOcrOptions): Promise<ImageOcrResult> {
    let base64: string
    if (typeof image === "string") {
        base64 = image
    } else if (image instanceof Blob) {
        base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(image)
            reader.addEventListener("load", () => resolve(reader.result as string))
            reader.addEventListener("error", reject)
        })
    } else {
        base64 = image.toString("base64")
    }
    const url = options.url ?? "http://127.0.0.1:1224/api/ocr"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            base64,
            options,
        }),
    })
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    const data = await response.json()
    return data
}
