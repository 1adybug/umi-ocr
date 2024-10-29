# umi-ocr

基于 [umi-ocr](https://github.com/hiroi-sora/Umi-OCR) 项目

## 图片 OCR

```typescript
/**
 * 语言/模型库
 */
export declare enum ImageOcrLanguage {
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
export declare enum ImageOcrLimitSideLen {
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
export declare enum ImageOcrTbpuParser {
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
export declare enum ImageOcrDataFormat {
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
export declare function imageOcr<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict>(
    image: FileType,
    optionsWithUrl?: ImageOcrOptionsWithUrl<T>,
): Promise<ImageOcrResult<T>>
```

## 文档 OCR

```typescript
/**
 * 内容提取模式
 */
export declare enum DocOcrExtractionMode {
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
export declare function docUpload<T extends ImageOcrDataFormat = ImageOcrDataFormat.Dict>(
    file: File,
    optionsWithUrl?: DocOcrOptionsWithUrl<T>,
): Promise<DocUploadResult>
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
export declare enum DocOcrState {
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
export declare function docOcrResultQuery(optionsWithUrl: DocOcrResultQueryOptionsWithUrl): Promise<DocOcrResult>
export declare enum DocDownloadFileType {
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
export declare function docDownload(optionsWithUrl: DocDownloadOptionsWithUrl): Promise<DocDownloadResult>
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
export declare function docOcrTaskClear(optionsWithUrl: DocOcrTaskClearOptionsWithUrl): Promise<DocOcrTaskClearResult>
```

## 二维码生成

```typescript
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
export declare function qrcodeGeneration(text: string, optionsWithUrl?: QrcodeGenerationOptionsWithUrl): Promise<QrcodeGenerationResult>
```

## 二维码识别

```typescript
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
export declare function qrcodeRecognition(image: FileType, optionsWithUrl?: QrcodeRecognitionOptionsWithUrl): Promise<QrcodeRecognitionResult>
```
