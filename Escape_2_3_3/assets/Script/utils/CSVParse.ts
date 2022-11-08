export class CCCsv {
    originData = null;
    parsedData = null;
    constructor(csvString) {
        this.originData = csvString
        this.parsedData = this.parseCell(csvString)
    }

    parseCell(csvString) {

        csvString.replace("{0}","");
        csvString.replace("{","");
        csvString.replace("}","");


        // 去除前后空格
        return csvString.trim()
            //  获取数据行数
            .split(/\n/gm).map((v) => {
                // 匹配出非单纯英文字符串的内容str
                const str = v.match(/"[^"]+"/ig)
                if (str) {
                    // 将匹配到的str中的英文逗号转换成<|>标记符
                    const result = str.map((vv) => {
                        return vv.replace(/,/g, '<|>')
                    })
                    // 将原字符串v中的匹配到的str进行替换
                    str.forEach((vv, i) => {
                        v = v.replace(vv, result[i])
                    })
                }
                // 按逗号截取每一列数据，顺便去除前后空字符
                v = v.split(/\s*,\s*/g)
                    .map((v) => {
                        // 去除双引号
                        return v.replace(/"/g, '')
                            // 重新将标记符转换到英文逗号
                            .replace(/<\|>/g, ',').replace('\r', '')
                    })
                return v
            })
    }

    getParsedData() { // 被解析的初始数据，只被一层解析过
        return this.parsedData
    }

    getColumnByIndex(index) {
        if (!this.parsedData[0][index]) {
            return null
        }
        return this.parsedData.map(el => el[index])
    }

    getColumnByHeadName(name) {
        const index = this.parsedData[0].indexOf(name)
        if (index === -1) {
            console.warn('不存在该表头', name)
            return null
        }
        return this.parsedData.map(el => el[index])
    }

    getRowByIndex(index) {
        if (!this.parsedData[index]) {
            return null
        }
        return {
            head: this.parsedData[0],
            data: this.parsedData[index]
        }
    }

    getRowByNameAndValue(name, value) {
        const column = this.getColumnByHeadName(name)
        if (column == null) {
            return null
        }
        const index = column.indexOf(value)
        if (index == -1) {
            return null
        }
        return this.getRowByIndex(index)
    }

}

export const loadCsv = (url) => new Promise((resolve, reject) => {
    cc.loader.loadRes(url, cc.Asset, (err, res) => {
        if (err) {
            reject(err)
            throw new Error('csv 文件加载失败，令人绝望')
        }
        resolve(new CCCsv(res.text))
    })
})