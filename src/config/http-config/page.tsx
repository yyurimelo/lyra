const http = process.env.NEXT_PUBLIC_API_URL;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export { http };
