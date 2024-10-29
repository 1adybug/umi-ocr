import { ImageOcrDataFormat, ImageOcrOptions } from "./imageOcr"

/**
 * 内容提取模式
 */
export enum DocOcrExtractionMode {
    /**
     * 混合OCR/原文本
     */
    Mixed = "mixed",

    /**
     * 整页强制OCR
     */
    FullPage = "fullPage",

    /**
     * 仅OCR图片
     */
    ImageOnly = "imageOnly",

    /**
     * 仅拷贝原有文本
     */
    TextOnly = "textOnly",
}

export type DocOcrOptions<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict> = Pick<
    ImageOcrOptions<T>,
    "ocr.language" | "ocr.cls" | "ocr.limit_side_len" | "tbpu.parser" | "tbpu.ignoreArea" | "data.format"
> & {
    /**
     * 忽略区域起始: 忽略区域生效的页数范围起始
     *
     * 从 1 开始
     */
    "tbpu.ignoreRangeStart"?: number

    /**
     * 忽略区域结束: 忽略区域生效的页数范围结束
     *
     * 可以用负数表示倒数第X页
     */
    "tbpu.ignoreRangeEnd"?: number

    /**
     * OCR页数起始: OCR的页数范围起始。从1开始
     */
    pageRangeStart?: number

    /**
     * OCR页数结束: OCR的页数范围结束。可以用负数表示倒数第X页
     */
    pageRangeEnd?: number

    /**
     * OCR页数列表: 数组，可指定单个或多个页数
     *
     * 例：
     *
     * [1,2,5]表示对第1、2、5页进行OCR
     *
     * 如果与页数范围同时填写，则 pageList 优先
     */
    pageList?: number[]

    /**
     * 密码: 如果文档已加密，则填写文档密码
     */
    password?: string

    /**
     * 内容提取模式
     */
    "doc.extractionMode"?: DocOcrExtractionMode
}

/**
 * 文档OCR选项，含有API地址
 */
export type DocOcrOptionsWithUrl<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict> = DocOcrOptions<T> & {
    /**
     * API地址
     *
     * @default "http://127.0.0.1:1224/api/doc/upload"
     */
    url?: string
}

/**
 * 文档上传结果
 */
export type DocUploadResult = {
    code: number
    data: string
}

/**
 * 上传文档进行OCR
 *
 * @param {File} file 文件
 *
 * @param {DocOcrOptionsWithUrl} optionsWithUrl 选项
 *
 * @returns {Promise<DocUploadResult>} 文档上传结果
 */
export async function docUpload<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict>(
    file: File,
    optionsWithUrl?: DocOcrOptionsWithUrl<T>,
): Promise<DocUploadResult> {
    const { url = "http://127.0.0.1:1224/api/doc/upload", ...options } = optionsWithUrl ?? {}
    const formData = new FormData()
    formData.append("file", file)
    formData.append("json", JSON.stringify(options))
    const response = await fetch(url, {
        method: "POST",
        body: formData,
    })
    if (!response.ok) {
        throw new Error(`docUpload failed: ${response.statusText}`)
    }
    const result: DocUploadResult = await response.json()
    return result
}

/**
 * 文档 OCR 结果查询选项
 */
export type DocOcrResultQueryOptions = {
    /**
     * 文件上传接口执行成功后返回的任务 ID
     *
     * 必填字段，用于标识特定的识别任务
     */
    id: string

    /**
     * 是否在返回值中包含识别结果
     *
     * 可选布尔值，默认为 false
     *
     * - true: 返回值中包含识别结果
     *
     * - false: 返回值中不包含识别结果，仅返回简略的任务状态信息
     */
    is_data?: boolean

    /**
     * 是否返回未读过的识别结果条目
     *
     * 可选布尔值，默认为 true
     *
     * - true: 返回未读的识别结果条目
     *
     * - false: 返回全部识别结果条目
     */
    is_unread?: boolean

    /**
     * 返回结果的格式
     *
     * 可选字符串，默认为 "dict"
     *
     * - "dict": 以字典形式返回详细的识别结果
     *
     * - "text": 以字符串形式返回识别结果文本
     */
    format?: ImageOcrDataFormat
}

/**
 * 文档 OCR 结果查询选项，含有 API地址
 */
export type DocOcrResultQueryOptionsWithUrl = DocOcrResultQueryOptions & {
    /**
     * API地址
     *
     * @default "http://127.0.0.1:1224/api/doc/result"
     */
    url?: string
}

export enum DocOcrState {
    /**
     * 任务排队中
     */
    Waiting = "waiting",

    /**
     * 任务进行中
     */
    Running = "running",

    /**
     * 任务成功
     */
    Success = "success",

    /**
     * 任务失败
     */
    Failure = "failure",
}

/**
 * 任务查询返回结果类型
 */
export type DocOcrResult = {
    /**
     * 任务状态码
     *
     * 整数，100 表示查询成功，其他值表示查询失败
     */
    code: number

    /**
     * 查询返回的数据
     *
     * - 如果查询失败，则为失败原因的字符串
     *
     * - 如果查询成功且 is_data 为 true，则为识别内容的字符串
     *
     * - 如果查询成功且 is_data 为 false，则为空数组
     */
    data: string | string[]

    /**
     * 已经识别完成的页数
     *
     * 整数，表示任务处理进度
     */
    processed_count: number

    /**
     * 总页数
     *
     * 整数，表示待识别的总页数
     */
    pages_count: number

    /**
     * 任务是否已完成
     *
     * 布尔值，true 表示任务已结束，false 表示任务仍在进行中
     *
     * 当 is_done 为 true 时，state 可能为 "success" 或 "failure"
     */
    is_done: boolean

    /**
     * 任务状态
     */
    state: DocOcrState

    /**
     * 任务失败的原因
     *
     * 字符串，仅当 state 为 "failure" 时存在
     *
     * 注意：即便任务失败，仍然可能通过 data 获取已完成的部分任务结果
     */
    message?: string
}

/**
 * 查询文档OCR结果
 *
 * @param {DocOcrResultQueryOptionsWithUrl} optionsWithUrl 选项
 *
 * @returns {Promise<DocOcrResult>} 文档OCR结果
 */
export async function docOcrResultQuery(optionsWithUrl: DocOcrResultQueryOptionsWithUrl): Promise<DocOcrResult> {
    const { url = "http://127.0.0.1:1224/api/doc/result", ...options } = optionsWithUrl
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
    })
    if (!response.ok) {
        throw new Error(`docOcrResult failed: ${response.statusText}`)
    }
    const result: DocOcrResult = await response.json()
    return result
}

export enum DocDownloadFileType {
    /**
     * 双层可搜索 PDF
     */
    PdfLayered = "pdfLayered",

    /**
     * 单层纯文本 PDF
     */
    PdfOneLayer = "pdfOneLayer",

    /**
     * 带页数等信息的 txt 文件
     */
    Txt = "txt",

    /**
     * 只含识别文本的 txt 文件
     */
    TxtPlain = "txtPlain",

    /**
     * 与 result 接口的 format="dict" 格式类似，每行为一个 JSON 对象
     */
    Jsonl = "jsonl",

    /**
     * 表格，每行为一页的识别文本
     */
    Csv = "csv",
}

/**
 * 文件下载请求选项
 */
export type DocDownloadOptions = {
    /**
     * 任务 ID
     *
     * 必填字段，用于指定需要下载文件的任务
     */
    id: string

    /**
     * 文件类型数组
     *
     * 每项为字符串，指定返回的文件格式
     *
     * - 如果只填写一个值，则返回该格式的文件下载链接
     *
     * - 如果填写多个值，则返回包含多个文件的 zip 压缩包下载链接
     */
    file_types: DocDownloadFileType[]

    /**
     * 是否忽略空页
     *
     * 布尔值，默认为 true
     *
     * - true：在 txt、csv 等文件中跳过空页（没有文字的页数）
     *
     * - false：不跳过空页，文件中空页的内容将记为空字符串
     */
    ignore_blank?: boolean
}

/**
 * 文件下载请求选项，含有 API 地址
 */
export type DocDownloadOptionsWithUrl = DocDownloadOptions & {
    /**
     * API 地址
     *
     * @default "http://127.0.0.1:1224/api/doc/download"
     */
    url?: string
}

/**
 * 下载文档 OCR 结果
 */
export type DocDownloadResult = {
    /**
     * 任务状态码
     *
     * 整数，100 表示成功生成目标文件，其余值表示无法生成目标文件
     */
    code: number

    /**
     * 数据字段
     *
     * - 如果生成成功，则为下载链接的字符串
     *
     * - 如果生成失败，则为失败原因的字符串
     */
    data: string

    /**
     * 文件名
     *
     * 字符串，仅在生成成功时存在，表示下载链接对应的文件名
     */
    name?: string
}

/**
 * 下载文档 OCR 结果
 *
 * @param {DocDownloadOptionsWithUrl} optionsWithUrl 选项
 *
 * @returns {Promise<DocDownloadResult>} 文档 OCR 结果
 */
export async function docDownload(optionsWithUrl: DocDownloadOptionsWithUrl): Promise<DocDownloadResult> {
    const { url = "http://127.0.0.1:1224/api/doc/download", ...options } = optionsWithUrl
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
    })
    if (!response.ok) {
        throw new Error(`docDownload failed: ${response.statusText}`)
    }
    const result: DocDownloadResult = await response.json()
    return result
}

/**
 * 文档 OCR 任务清理选项
 */
export type DocOcrTaskClearOptions = {
    /**
     * 任务 ID
     *
     * 必填字段，用于指定需要清理的任务
     */
    id: string
}

/**
 * 文档 OCR 任务清理选项，含有 API 地址
 */
export type DocOcrTaskClearOptionsWithUrl = DocOcrTaskClearOptions & {
    /**
     * API 地址
     *
     * @default "http://127.0.0.1:1224/api/doc/clear"
     */
    url?: string
}

/**
 * 文档 OCR 任务清理结果
 */
export type DocOcrTaskClearResult = {
    /**
     * 状态码
     *
     * 整数，100 表示清理成功，其余值表示清理失败或不存在对应任务
     */
    code: number

    /**
     * 失败原因或其他信息
     *
     * 字符串，表示清理失败的原因或相关信息
     */
    data: string
}

export async function docOcrTaskClear(optionsWithUrl: DocOcrTaskClearOptionsWithUrl) {
    const { url = "http://127.0.0.1:1224/api/doc/clear", id } = optionsWithUrl
    const response = await fetch(`${url}/${id}`)
    if (!response.ok) {
        throw new Error(`docOcrTaskClear failed: ${response.statusText}`)
    }
    const result: DocOcrTaskClearResult = await response.json()
    return result
}
