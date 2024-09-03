const BASE64 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function uid() {
  let id = "";
  id += BASE64.charAt(Math.random() * 52);
  for (let i = 0; i < 23; i++) id += BASE64.charAt(Math.random() * 62);
  return id;
}
