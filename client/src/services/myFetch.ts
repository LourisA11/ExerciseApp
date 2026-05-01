const API_ROOT = import.meta.env.VITE_API_ROOT ?? "http://localhost:3000/api"


export async function myFetch(path: string, options: RequestInit = {}) {

    const res = await fetch(`${API_ROOT}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

  const contentType = res.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) {
    const text = await res.text()
    throw new Error(`Expected JSON but got: ${text.slice(0, 80)}`)
  }

  return res.json()
}

export default function rest<T>(
  url: string,
  data?: unknown,
  options: RequestInit = {},
): Promise<T> {
  options = {
    method: data ? 'POST' : 'GET',

    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
    ...options,

    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  return fetch(url, options).then((res) => {
    if (!res.ok) {
      if (res.headers.get('Content-Type')?.includes('application/json')) {
        return res.json().then((responseData) => {
          throw new Error(responseData.message || 'An error occurred')
        })
      }
      return res.text().then((text) => {
        throw new Error(text)
      })
    }
    return res.json() as Promise<T>
  })
}

// export function api<T>(endpoint: string, data?: unknown, options: RequestInit = {}) {
//   return rest<T>(`${API_ROOT}${endpoint}`, data, options)

  export async function api<T>(path: string, data?: unknown, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_ROOT}${path}`;
  
  options = {
    method: data ? 'POST' : (options.method || 'GET'),
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Add Centralized Authorization here
      'user-id': localStorage.getItem('userId') || '', 
      ...options.headers,
    },
  };

  const res = await fetch(url, options);

  // Centralized Error Handling
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.message || `Error ${res.status}: ${res.statusText}`;
    
    // UI Feedback: You could trigger a global notification store here
    console.error("Global API Error:", message);
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

