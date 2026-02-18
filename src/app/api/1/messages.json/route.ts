// Pushover API path compatibility: /api/1/messages.json
// This is the exact path Pushover uses, so apps with hardcoded URLs work out of the box

export { POST, GET } from "@/app/api/pushover/route";
