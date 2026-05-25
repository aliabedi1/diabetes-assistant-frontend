export function getApiError(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (data?.message) {
    return data.message;
  }

  if (data?.errors) {
    return Object.values(data.errors).flat().join(" ");
  }

  return error?.message || fallback;
}
