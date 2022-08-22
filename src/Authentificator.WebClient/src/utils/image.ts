export const base64ToBlob = async (base64: string) => {
  const res = await fetch(base64)
  return await res.blob()
}

export const base64RemoveHeader = (base64: string) => {
  return base64.replace(/^data:image\/\w+;base64,/, "")
}
