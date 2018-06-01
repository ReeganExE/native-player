package main

import (
	"encoding/json"
	"io/ioutil"
)

func parseConfig(data []byte) (NativeConfig, error) {
	var r NativeConfig
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *NativeConfig) toJson() ([]byte, error) {
	return json.MarshalIndent(r, "", "  ")
}

func (r *HostConfig) toJson() ([]byte, error) {
	return json.MarshalIndent(r, "", "  ")
}

func (r *NativeConfig) writeFile(path string) error {
	out, _ := r.toJson()
	return ioutil.WriteFile(path, out, 0644)
}

type NativeConfig struct {
	ProgramPath string   `json:"programPath"`
	Args        []string `json:"args"`
}

type HostConfig struct {
	*NativeConfig
	HostPath	string `json:"hostPath"`
}
