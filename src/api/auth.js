export const checkAuth = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/user/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Not authenticated");
  return await res.json();
};

export const logout = async () => {
  return await fetch(`${process.env.REACT_APP_API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};
