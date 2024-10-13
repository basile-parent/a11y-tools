import Criteria, {ExecuteOptions, ExecuteOptionsLog} from "../Criteria.ts"
import stringUtils from "../../utils/stringUtils.ts";
import consoleUtils from "../../utils/consoleUtils.ts";

type Anomaly = {
    text:string,
    cssRulesStyle: {
        color: string,
        backgroundColor: string,
    },
    computedStyle: {
        color: string,
        backgroundColor: string,
    },
    element: HTMLElement,
}

type Criteria10_5Result = CriteriaResult & {
    anomalies?: Anomaly[]
}

class Criteria10_5 extends Criteria {
    constructor() {
        super("10.5", "Dans chaque page web, les déclarations CSS de couleurs de fond d’élément et de police sont-elles correctement utilisées ?");
    }


    _optionsInformations(): ExecuteOptionsLog {
        return {
            ...this.commonExecuteOptionsLog
        }
    }

    informations(): CriteriaInformation {
        return {
            criteria: this.title,
            links: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#10.5",
            advices: [
                "Rechercher tous les textes de couleur (différentes de la couleur par défaut) et vérifier leurs déclarations",
                "Rechercher tous les backgrounds (différents de la couleur par défaut) et vérifier leurs déclarations",
            ]
        }
    }

    _execute(options?: ExecuteOptions): CriteriaResult | null {
        if (!options?.noLog) {
            console.debug("%cDémarrage du scan (l'opération peut prendre un moment)", consoleUtils.detailsFormatting)
        }

        const anomalies: Anomaly[] = []
        document.body.querySelectorAll("*").forEach(element => {
            const cssInspection = this.inspectColorAndBg(element as HTMLElement)
            if (!cssInspection.areSame) {
                const style = getComputedStyle(element)
                anomalies.push({
                    text: element.textContent,
                    cssRulesStyle: {
                        color: cssInspection.color,
                        backgroundColor: cssInspection.backgroundColor,
                    },
                    computedStyle: {
                        color: style.color,
                        backgroundColor: style.backgroundColor,
                    },
                    element: element as HTMLElement,
                })
            }
        })

        const success = !anomalies.length


        if (!options?.noLog) {
            if (success) {
                this._logOK()
            } else {
                this.logAnomalies(anomalies)
            }
        }

        if (!options?.noReturn) {
            return {
                success: success ? "ok" : "warning",
                ...(!success ? { anomalies }: {})
            }
        }

        return null
    }

    private logAnomalies(anomalies: Anomaly[]): void {
        console.groupCollapsed(`${ stringUtils.statusIcon("ko") } %c${ anomalies.length }%c anomalie${ stringUtils.s(anomalies) } détectée${ stringUtils.s(anomalies) }`, "font-weight: bold;", "")

        anomalies.forEach(anomaly => {
            console.log(`Texte de l'élément: "${ stringUtils.removeBreaks(anomaly.text).substring(0, 50) }${ anomaly.text.length > 50 ? "..." :""}"`
                + `\n`
                + `\n%c[CSS]%c\t\tColor: ${anomaly.cssRulesStyle.color ?? "\t" }\t\tBackground-color: ${anomaly.cssRulesStyle.backgroundColor}`
                + `\n%c[Computed]%c\tColor: ${anomaly.computedStyle.color}\t\tBackground-color: ${anomaly.computedStyle.backgroundColor} %c ⬤ %c`,
                "font-weight: bold;",
                "",
                "font-weight: bold;",
                "",
                `background-color: ${anomaly.computedStyle.backgroundColor}; color: ${anomaly.computedStyle.color};`,
                "",
                anomaly.element
                )
        })

        console.groupEnd()
    }

    private inspectColorAndBg(element: HTMLElement) {
        const allCssDeclarations = this.getAllCssDeclarations(element)
        let color = element.style.color
        let backgroundColor = element.style.backgroundColor
        allCssDeclarations.forEach(declaration => {
            color = declaration.style.color || color
            backgroundColor = declaration.style.backgroundColor || backgroundColor
        })

        // Either none or both of them should be declared
        return {
            areSame: !(!!color ^ !!backgroundColor),
            color,
            backgroundColor
        }
    }

    private getAllCssDeclarations(element: HTMLElement) {
        const sheets = document.styleSheets, ret = [];
        element.matches = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector
            || element.msMatchesSelector || element.oMatchesSelector
        for (const i in sheets) {
            const rules: CSSRuleList = sheets[i].rules || sheets[i].cssRules;
            for (const r in rules) {
                if (element.matches((rules[r] as CSSStyleRule).selectorText)) {
                    ret.push(rules[r])
                }
            }
        }
        return ret;
    }

}

export default Criteria10_5