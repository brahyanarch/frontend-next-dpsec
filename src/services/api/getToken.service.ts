import Cookies from "js-cookie";

export async function getToken() {
  const token = Cookies.get("auth-token");
  return token;
}