import User from "../models/user"

async function registerPerson(images: string[]) {
  const res = await fetch(`${import.meta.env.VITE_FUNCTION_APP_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pictures: images }),
  })
  if (res.status === 202) {
    const location = res.headers.get("Location")
    if (location) {
      const res = await waitFor(location)
      if (res.runtimeStatus === "Failed") {
        const reason = res.output.split("failed: ")[1]
        if (reason) {
          throw new Error(reason)
        }
        throw new Error(res.output)
      }
      return res.output
    }
    throw new Error("No location in response")
  }
  throw new Error(`Error ${res.status}`)
}

async function waitFor(url: string) {
  let nbIteration = 0
  while (nbIteration < 20) {
    const res = await fetch(url)
    if (res.status !== 202) {
      return await res.json()
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    nbIteration++
  }
  return { runtimeStatus: "TIMEOUT" }
}

async function updateProfile(userId: string, user: Partial<User>) {
  const res = await fetch(`${import.meta.env.VITE_FUNCTION_APP_URL}/api/settings/preferences/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, ...user }),
  })

  if (res.ok) {
    return true
  }
  throw new Error(`Error ${res.status}`)
}

async function identifyUser(image: string) {
  const res = await fetch(`${import.meta.env.VITE_FUNCTION_APP_URL}/api/identify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ picture: image }),
  })
  if (res.ok) {
    return await res.json()
  }
  throw new Error(`Error ${res.status}`)
}

async function getProfile(userId: string) {
  const res = await fetch(`${import.meta.env.VITE_FUNCTION_APP_URL}/api/user/${userId}`)
  if (res.ok) {
    return await res.json()
  }
  throw new Error(`Error ${res.status}`)
}

export { registerPerson, updateProfile, identifyUser, getProfile }

