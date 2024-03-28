
export const hasRole = (rolesArr: any, requiredRole: string) => {
    if (!Array.isArray(rolesArr)) {
        return false
    }
    return rolesArr.includes(requiredRole)
}