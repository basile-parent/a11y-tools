import consoleUtils from "../utils/consoleUtils.ts";
import stringUtils from "../utils/stringUtils.ts";

export type ExecuteOptions = {
    noLog?: boolean
    noReturn?: boolean
    help?: boolean
}

export type ExecuteOptionsLog = {
    [key in keyof ExecuteOptions]: {
        type: string,
        optional: boolean,
        description: string
    }
}

abstract class Criteria {
    constructor(public uniqueTag: string, public title: string) {}

    help() {
        const info = this.informations()

        console.group(`%c[AIDE]%c Critère ${ this.uniqueTag }`, "font-weight: bold; color: blue; background-color: white; font-size: 1rem;", "font-size: 1rem;")
        console.log(`%c${ this.title }`, "font-weight: bold; font-size: 0.9rem;")

        if (info) {
            console.log("links", info.links)

            if (info.advices) {
                console.group("%cAdvices", "font-weight: bold; color: blue; background-color: white;")
                info.advices.forEach(advice => console.log(advice))
                console.groupEnd()
            }
        }

        console.groupCollapsed("%cExecute options%c (deploy group to see them)", "font-weight: bold; color: blue; background-color: white;", consoleUtils.detailsFormatting)
        console.table(this._optionsInformations())
        console.groupEnd()

        console.groupEnd()
    }

    protected abstract informations(): CriteriaInformation | void

    protected commonExecuteOptionsLog: ExecuteOptionsLog = {
        help: {type: "boolean", optional: true, description: "Show criteria help"},
        noLog: {type: "boolean", optional: true, description: "Avoid logging the criteria results (default value: false)"},
        noReturn: {type: "boolean", optional: true, description: "Avoid returning the criteria results, returns null instead (default value: false)"},
    }
    protected _optionsInformations(): ExecuteOptionsLog {
        return {
            ...this.commonExecuteOptionsLog
        }
    }

    protected _logOK() {
        console.log(`${ stringUtils.statusIcon("ok") } OK`)
    }

    execute(options?: ExecuteOptions): CriteriaResult | null {
        if (options?.help) {
            this.help()
            return null
        }
        return this._execute(options)
    }
    protected abstract _execute(options?: ExecuteOptions): CriteriaResult | null

}

export default Criteria