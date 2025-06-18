export const checkAuth = async () => {
  const res = await fetch("http://localhost:8080/api/user/info", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Not authenticated");
  return await res.json();
};

export const logout = async () => {
  return await fetch("http://localhost:8080/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};
