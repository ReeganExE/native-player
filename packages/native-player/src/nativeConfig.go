package main

import "encoding/json"

func LoadConfigFromJson(data []byte) (NativeConfig, error) {
	var r NativeConfig
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *NativeConfig) toJson() ([]byte, error) {
	return json.Marshal(r)
}

type NativeConfig struct {
	ProgramPath string   `json:"programPath"`
	Args        []string `json:"args"`
}
