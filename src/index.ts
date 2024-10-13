import {LIB_VERSION} from "./version.ts"
import Criteria10_5 from "./criterias/10/10.5.ts";
import Criteria, {ExecuteOptions} from "./criterias/Criteria.ts";
import consoleUtils from "./utils/consoleUtils.ts";
import Criteria10_x from "./criterias/10/10.x.ts";

const AVAILABLE_CRITERIAS = [
    "10.*",
    "10.5"
]
const AVAILABLE_CRITERIA_LIST = [...AVAILABLE_CRITERIAS].sort().join(", ")
type AvailableCriteria = typeof AVAILABLE_CRITERIAS[number]

type CriteriaByTag = {
    [tag: AvailableCriteria]: Criteria
}
const CRITERIAS_BY_TAG: CriteriaByTag = [
    new Criteria10_x(),
    new Criteria10_5(),
].reduce((acc, item) => {
    acc[item.uniqueTag] = item
    return acc
}, {} as CriteriaByTag)

const scan = <TOptions extends ExecuteOptions>(tagName: AvailableCriteria, options?: TOptions): CriteriaResult | null => {
    if (!tagName) {
        throw new Error(`You must specify a criteria tag name. Tag names available: ${AVAILABLE_CRITERIA_LIST}`)
    }

    const criteria = CRITERIAS_BY_TAG[tagName]
    if (!AVAILABLE_CRITERIAS.includes(tagName) || !criteria) {
        throw new Error(`This criteria is not implemented yet. Criteria tag names available: ${AVAILABLE_CRITERIA_LIST}`)
    }

    return criteria.execute(options)
}

const help = () => {
    console.group("%cA11y tools", "font-size: 2rem; font-weight: bold; color: lightblue; margin-left: 5px; text-shadow: 2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000")
    console.log("Version: ", LIB_VERSION)
    console.log("Critères disponibles: ", AVAILABLE_CRITERIA_LIST)

    console.group("Commandes disponibles: ")
    console.table({
        "scan(tagName: string, options: ExecuteOptions)": "Lance l'analyse d'un critère et affiche les résultats et/ou la méthodologie de test",
        "scan(tagName: string, { help: true })": "Affiche l'aide d'un critère (ainsi que ses différentes options)",
        "help()": "Affiche cette aide",
    })
    console.groupEnd()

    console.info("Toutes les commandes %ca11yTools.xxx%c sont également disponibles via l'alias %ctools.xxx",
        consoleUtils.codeFormatting,
        "",
        consoleUtils.codeFormatting
    )

    console.groupEnd()
}

console.log("%cA11y tools installé", "font-size: 1rem; font-weight: bold;")
console.log("Pour avoir de l'aide, tapez %ca11yTools.help()", consoleUtils.codeFormatting)

export const a11yTools = {
    scan,
    help,
}
export const tools = a11yTools
