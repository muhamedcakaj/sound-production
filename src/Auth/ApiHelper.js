import { useAuth } from "../Auth/AuthContext"

export const useApi = () => {
  const { token } = useAuth()
  const authFetch = (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
  }

  return { authFetch }
}