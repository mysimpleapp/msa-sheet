const { SheetParamDict } = require("./params")

const exp = module.exports = {}

exp.Sheet = class {

    constructor(id) {
        this.id = id
        this.params = new SheetParamDict()
    }

    formatForDb(keys) {
        const res = {}
        if (!keys || keys.indexOf("id") >= 0)
            res.id = this.id
        const content = this.content
        if (!keys || keys.indexOf("contentHead") >= 0)
            res.contentHead = content && content.head
        if (!keys || keys.indexOf("contentBody") >= 0)
            res.contentBody = content && content.body
        if (!keys || keys.indexOf("createdBy") >= 0)
            res.createdBy = this.createdBy
        if (!keys || keys.indexOf("updatedBy") >= 0)
            res.updatedBy = this.updatedBy
        if (!keys || keys.indexOf("params") >= 0)
            res.params = this.params.getAsDbStr()
        return res
    }

    parseFromDb(dbSheet) {
        this.content = {
            head: dbSheet.contentHead,
            body: dbSheet.contentBody
        }
        this.createdBy = dbSheet.createdBy
        this.updatedBy = dbSheet.updatedBy
        this.params = SheetParamDict.newFromDbStr(dbSheet.params)
    }

    static newFromDb(id, dbSheet) {
        const sheet = new this(id)
        if (dbSheet) sheet.parseFromDb(dbSheet)
        return sheet
    }
}