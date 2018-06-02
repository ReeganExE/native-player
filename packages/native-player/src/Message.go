package main

import "encoding/json"

func ParseMessage(data []byte) (Message, error) {
	var r Message
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Message) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Message struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}
