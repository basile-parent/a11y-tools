import Criteria, {ExecuteOptions, ExecuteOptionsLog} from "../Criteria.ts"
import stringUtils from "../../utils/stringUtils.ts";
import consoleUtils from "../../utils/consoleUtils.ts";
import Criteria10_5 from "./10.5.ts";
import criteria from "../Criteria.ts";

type CriteriaWithResult = {
    criteria: Criteria,
    result: CriteriaResult
}

class Criteria10_x extends Criteria {
    private allCriterias: Criteria[]
    private tagLogged: string

    constructor() {
        super("10.*", "Présentation de l’information");

        this.tagLogged = "10"
        this.allCriterias = [
            new Criteria10_5(),
        ]
    }


    _optionsInformations(): ExecuteOptionsLog {
        return {
            ...this.commonExecuteOptionsLog
        }
    }

    informations(): CriteriaInformation {
        return {
            criteria: this.title,
            links: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#10",
        }
    }

    _execute(options?: ExecuteOptions): null {
        if (options?.noLog === false) {
            console.log("Log cannot be disabled for aggregate criterias", consoleUtils.detailsFormatting)
        }

        console.log(`Exécution de tous les critères ${ this.title }... %cL'opération peut prendre du temps`, consoleUtils.detailsFormatting)

        const allResults: CriteriaWithResult[] = this.allCriterias.map(criteria => {
            return {
                criteria,
                result: criteria.execute({ ...options, noReturn: false, noLog: true }) as CriteriaResult
            }
        })

        this.logResults(allResults)

        return null
    }

    private logResults(results: CriteriaWithResult[]) {
        console.group(`%c${ this.tagLogged }. ${ this.title }`, "font-weight: bold; font-size: 1rem;")

        results.forEach((criteriaWithResult) => {
            console.groupCollapsed(`${ stringUtils.statusIcon(criteriaWithResult.result.success) } ${ criteriaWithResult.criteria.uniqueTag } ${ criteriaWithResult.criteria.title }`)
            console.log(criteriaWithResult.result)
            console.groupEnd()
        })
        console.groupEnd()
    }

}

export default Criteria10_x