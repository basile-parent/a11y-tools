import Criteria, {ExecuteOptions, ExecuteOptionsLog} from "../Criteria.ts"
import stringUtils from "../../utils/stringUtils.ts";
import consoleUtils from "../../utils/consoleUtils.ts";

type ForbiddenTags = { [tag: string]: (HTMLElement | Element)[] }
type ForbiddenProps = { [prop: string]: (HTMLElement | Element)[] }

type Criteria10_1Result = CriteriaResult & {
    forbiddenTags: ForbiddenTags
    forbiddenProps: ForbiddenProps
}

class Criteria10_1 extends Criteria {
    constructor() {
        super("10.1", "Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information ? ")
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
            console.debug(`%c[${ this.title }] Démarrage du scan`, consoleUtils.detailsFormatting)
        }

        const forbiddenTags = [...document.querySelectorAll("basefont, big, blink, center, font, marquee, s, strike, tt")].reduce((acc, element) => {
            const tagName = element.tagName as keyof ForbiddenTags
            acc[tagName] = [...(acc[tagName] || []), element]
            return acc
        }, {} as ForbiddenTags);

        let forbiddenPropsAgg: ForbiddenProps = {}

        const forbiddenProps = ["align", "alink", "background", "bgcolor", "border", "cellpadding", "cellspacing", "char", "charoff", "clear", "color", "compact", "frameborder", "hspace", "link", "marginheight", "marginwidth", "text", "valign", "vlink", "vspace"]
        forbiddenProps.forEach(prop => {
            forbiddenPropsAgg = this.searchForForbiddenProps(prop, `[${prop}]`, forbiddenPropsAgg)
        })
        forbiddenPropsAgg = this.searchForForbiddenProps("size", `:not(select)[size]`, forbiddenPropsAgg)
        forbiddenPropsAgg = this.searchForForbiddenProps("width", `:not(img, object, embed, canvas, svg, source)[width]`, forbiddenPropsAgg)
        forbiddenPropsAgg = this.searchForForbiddenProps("height", `:not(img, object, embed, canvas, svg, source)[height]`, forbiddenPropsAgg)

        const success = !Object.keys(forbiddenPropsAgg).length


        if (!options?.noLog) {
            if (success) {
                this._logOK()
            } else {
                // this.logAnomalies(anomalies)
            }
        }

        if (!options?.noReturn) {
            return {
                success: success ? "ok" : "warning",
                ...(!success ? {
                    forbiddenTags,
                    forbiddenProps: forbiddenPropsAgg,
                }: {})
            }
        }

        return null
    }

    private searchForForbiddenProps(prop: string, selector: string, forbiddenProps: ForbiddenProps): ForbiddenProps {
        const foundElements = [...document.querySelectorAll(selector)]

        const editedForbiddenProps = { ...forbiddenProps }
        if (foundElements.length) {
            editedForbiddenProps[prop as keyof ForbiddenProps] = [...(editedForbiddenProps[prop] || []), ...foundElements]
        }

        return editedForbiddenProps
    }

}

export default Criteria10_1