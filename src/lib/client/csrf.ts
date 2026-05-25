export async function getCsrfToken(): Promise<string> {
  const response = await fetch("/api/csrf", { method: "GET", cache: "no-store" });
  if (!response.ok) {
    throw new Error("Gagal mengambil CSRF token");
  }
  const data = await response.json();
  return data.token as string;
}

