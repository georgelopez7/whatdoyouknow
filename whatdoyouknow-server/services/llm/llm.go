package llm

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

func PromptOpenAILLM(messages []LLMMessage, model string, apiKey string, jsonMode bool) (LLMResponse, error) {
	// --- OPENAI API ---
	const OPENAI_LLM_ENDPOINT = "https://api.openai.com/v1/chat/completions"

	// --- CONSTRUCT MESSAGES FOR CHATGPT ---
	var chatGPTMessages []IChatGPTMessage
	for _, message := range messages {

		// --- CONSTRUCT MESSAGE CONTENT ---
		messageContent := []IChatGPTMessageContent{
			{
				Type: "text",
				Text: message.Content,
			},
		}

		// --- APPEND MESSAGE TO MESSAGES ARRAY ---
		chatGPTMessages = append(chatGPTMessages, IChatGPTMessage{
			Role:    message.Role,
			Content: messageContent,
		})
	}

	// --- CONSTRUCT PAYLOAD ---
	payload := IChatGPTPayload{
		Model:    model,
		Messages: chatGPTMessages,
	}

	// --- [OPTIONAL] SET TO JSON MODE ---
	if jsonMode {
		payload.ResponseFormat = &struct {
			Type string `json:"type"`
		}{Type: "json_object"}
	}

	// --- MARSHAL PAYLOAD ---
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return LLMResponse{}, fmt.Errorf("failed to marshal payload: %w", err)
	}

	// --- FORMAT HTTP "POST" REQUEST ---
	req, err := http.NewRequest("POST", OPENAI_LLM_ENDPOINT, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return LLMResponse{}, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))

	// --- SEND POST REQUEST ---
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return LLMResponse{}, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// --- CHECK STATUS CODE ---
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return LLMResponse{}, fmt.Errorf("unexpected status code: %d, body: %s", resp.StatusCode, string(bodyBytes))
	}

	// --- RESPONSE ---
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return LLMResponse{}, fmt.Errorf("failed to read response body: %w", err)
	}
	defer resp.Body.Close()

	// --- PARSE RESPONSE ---
	var jsonResponse IChatGPTRawResponse
	if err := json.Unmarshal(responseBody, &jsonResponse); err != nil {
		return LLMResponse{}, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	// --- CHECK RESPONSE ---
	if len(jsonResponse.Choices) == 0 {
		return LLMResponse{}, errors.New("invalid response format: missing choices")
	}

	content := jsonResponse.Choices[0].Message.Content
	if content == "" {
		return LLMResponse{}, errors.New("invalid response format: content is empty")
	}

	// --- RETURN RESPONSE FROM LLM ---
	return LLMResponse{Content: content}, nil
}
