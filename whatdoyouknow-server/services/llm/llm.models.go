package llm

type LLMMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type IChatGPTMessageContent struct {
	Type string `json:"type"`
	Text string `json:"text"`
}
type IChatGPTMessage struct {
	Role    string                   `json:"role"`
	Content []IChatGPTMessageContent `json:"content"`
}

type IChatGPTPayload struct {
	Model          string            `json:"model"`
	Messages       []IChatGPTMessage `json:"messages"`
	ResponseFormat *struct {
		Type string `json:"type"`
	} `json:"response_format,omitempty"`
}

type IChatGPTRawResponse struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Index   int `json:"index"`
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
}

type LLMResponse struct {
	Content string
}
