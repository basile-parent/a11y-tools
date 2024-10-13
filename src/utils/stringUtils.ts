const s = (array: any[]): string => array.length > 1 ? "s" : ""
const removeBreaks = (str: string): string => str.replace((/  |\r\n|\n|\r/gm),"");
const statusIcon = (status: ExecutionStatus): string => status === "ok" ? "✅" : status === "ko" ? "❌" : "⚠️"

export default {
    s,
    removeBreaks,
    statusIcon,
}