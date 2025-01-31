export const GENDER = {
  0: "Other",
  1: "Male",
  2: "Female",
}

export const getGenderName = (id) => GENDER[id] || "UNKNOWN"

export function genderNameToEnum(query) {
  if (query === "male" || query === "Male") {
    console.log("query === male")
    return 1
  }
  if (query === "female" || query === "Female") {
    console.log("this is female")
    return 2
  }
  return 0
}
