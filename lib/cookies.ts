export function getCookie(name: string): any {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift()
    try {
      return JSON.parse(decodeURIComponent(cookieValue || ""))
    } catch (e) {
      return decodeURIComponent(cookieValue || "")
    }
  }

  return null
}

export function setCookie(name: string, value: any, days = 30): void {
  if (typeof document === "undefined") return

  const stringValue = typeof value === "object" ? encodeURIComponent(JSON.stringify(value)) : encodeURIComponent(value)

  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `; expires=${date.toUTCString()}`

  document.cookie = `${name}=${stringValue}${expires}; path=/`
}

