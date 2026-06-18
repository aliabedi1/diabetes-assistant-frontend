export function getFieldErrors(error) {
  const data = error?.response?.data;
  const raw = data?.errors;

  if (!raw || typeof raw !== "object") {
    return {};
  }

  const normalized = {};

  Object.entries(raw).forEach(([field, messages]) => {
    if (Array.isArray(messages)) {
      normalized[field] = messages.filter(Boolean);
    } else if (messages) {
      normalized[field] = [String(messages)];
    }
  });

  return normalized;
}

export function getStatusMessage(error, fallback = "Something went wrong. Please try again.") {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (status === 429) {
    return data?.message || "Too many requests. Please wait and try again.";
  }

  if (status === 401) {
    return data?.message || "Authentication is required.";
  }

  if (status === 403) {
    return data?.message || "You do not have permission to perform this action.";
  }

  if (status >= 500) {
    return data?.message || "Server error. Please try again later.";
  }

  return data?.message || error?.message || fallback;
}
