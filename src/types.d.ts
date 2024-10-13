type ExecutionStatus = "ok" | "ko" | "warning"

type CriteriaResult = {
    success: ExecutionStatus
}

type CriteriaInformation = {
    criteria: string,
    links: string | string[],
    advices?: string[]
}