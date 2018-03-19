# httpmw

@(httpmw)[json|schema]

----------------------------------------------------------

**JSON**（ JavaScript Object Notation ），即 JavaScript 对象表示法。JSON 主要用于存储和交换文本信息，类似于XML。但是和 XML 相比，JSON 是更加轻量级的文本数据交换格式，具有更小、更快、更易解析的特点。JSON 具有自我描述性，更易理解。虽然 JSON 使用 JavaScript 语法来描述数据对象，但是，JSON 是独立于语言和平台的。JSON 解析器和 JSON 库支持许多不同的编程语言。

**JSON Schema** 是一个可以对json格式数据进行校验和进行内容描述的文档，它本身也是基于json格式的。

**主要有以下作用:**
[1]. 对现有的json数据格式进行描述（字段类型、内容长度、是否必须存在、取值示例等）；
[2]. 是一个描述清晰、人机可读的文档；
[3].自动测试、验证客户端提交的数据；

```
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "BookInfo",
    "description": "some information about book",
    "type": "object",
    "properties": {
        "id": {
            "description": "The unique identifier for a book",
            "type": "integer",
            "minimum": 1
        },
        "name": {
            "description": "Name of the book",
            "type": "string",
            "maxLength": 50,
            "minLength": 1
        },
        "price": {
            "type": "number",
            "minimum": 0,
            "exclusiveMinimum": true
        }
    },
    "required": [
        "id",
        "name",
        "price"
    ]
}
```
------------------------
